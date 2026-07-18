import { createHash } from 'node:crypto';
import {
  access,
  mkdir,
  readFile,
  readdir,
  rm,
  stat,
  writeFile,
} from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const scriptDirectory = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(scriptDirectory, '..');
const publicDirectory = path.join(projectRoot, 'public');
const sourceCodeDirectory = path.join(projectRoot, 'src');
const outputDirectory = path.join(publicDirectory, 'generated', 'images');
const manifestPath = path.join(
  sourceCodeDirectory,
  'generated',
  'image-manifest.json',
);

const candidateWidths = [240, 320, 480, 768, 1024, 1440, 1920];
const pipelineVersion = 'avif60-webp80-jpeg82-png-v1';
const supportedSourceExtensions = new Set(['.jpg', '.jpeg', '.png', '.webp']);
const sourceReferencePattern = /["'`](\/[a-zA-Z0-9_./-]+\.(?:jpe?g|png|webp))["'`]/gi;

const pathExists = async (filePath) => {
  try {
    await access(filePath);
    return true;
  } catch {
    return false;
  }
};

const listFilesRecursively = async (directory) => {
  if (!(await pathExists(directory))) {
    return [];
  }

  const directoryEntries = await readdir(directory, { withFileTypes: true });
  const nestedFiles = await Promise.all(
    directoryEntries.map(async (directoryEntry) => {
      const entryPath = path.join(directory, directoryEntry.name);

      if (directoryEntry.isDirectory()) {
        return listFilesRecursively(entryPath);
      }

      return [entryPath];
    }),
  );

  return nestedFiles.flat();
};

const toPublicUrl = (filePath) => {
  const publicRelativePath = path.relative(publicDirectory, filePath);

  return `/${publicRelativePath.split(path.sep).join('/')}`;
};

const getReferencedSourcePaths = async () => {
  const sourceFiles = (await listFilesRecursively(sourceCodeDirectory)).filter(
    (filePath) => /\.(?:css|ts|tsx)$/.test(filePath),
  );
  const referencedSources = new Set();

  for (const sourceFile of sourceFiles) {
    const sourceCode = await readFile(sourceFile, 'utf8');

    for (const match of sourceCode.matchAll(sourceReferencePattern)) {
      const sourceUrl = match[1];

      if (
        !sourceUrl ||
        sourceUrl.startsWith('/generated/images/') ||
        !supportedSourceExtensions.has(path.extname(sourceUrl).toLowerCase())
      ) {
        continue;
      }

      referencedSources.add(sourceUrl);
    }
  }

  return [...referencedSources].sort();
};

const getOrientedDimensions = (metadata) => {
  const width = metadata.width;
  const height = metadata.height;

  if (!width || !height) {
    throw new Error('Image dimensions are unavailable.');
  }

  const shouldSwapDimensions = metadata.orientation
    ? metadata.orientation >= 5 && metadata.orientation <= 8
    : false;

  return shouldSwapDimensions
    ? { width: height, height: width }
    : { width, height };
};

const getTargetWidths = (sourceWidth) => {
  const maximumOutputWidth = Math.min(sourceWidth, 1920);
  const widths = candidateWidths.filter((width) => width < maximumOutputWidth);

  widths.push(maximumOutputWidth);

  return [...new Set(widths)];
};

const createVariant = async ({
  buffer,
  format,
  outputPath,
  width,
}) => {
  if (await pathExists(outputPath)) {
    return;
  }

  let imagePipeline = sharp(buffer, { failOn: 'warning' })
    .rotate()
    .resize({ fit: 'inside', width, withoutEnlargement: true });

  if (format === 'avif') {
    imagePipeline = imagePipeline.avif({
      chromaSubsampling: '4:4:4',
      effort: 4,
      quality: 60,
    });
  } else if (format === 'webp') {
    imagePipeline = imagePipeline.webp({
      effort: 4,
      quality: 80,
      smartSubsample: true,
    });
  } else if (format === 'png') {
    imagePipeline = imagePipeline.png({
      compressionLevel: 9,
      effort: 10,
      palette: false,
    });
  } else {
    imagePipeline = imagePipeline.jpeg({
      chromaSubsampling: '4:4:4',
      mozjpeg: true,
      quality: 82,
    });
  }

  await imagePipeline.toFile(outputPath);
};

const optimizeSource = async (sourceUrl, expectedOutputPaths) => {
  const sourcePath = path.join(publicDirectory, sourceUrl.slice(1));

  if (!(await pathExists(sourcePath))) {
    throw new Error(`Referenced image does not exist: ${sourceUrl}`);
  }

  const sourceBuffer = await readFile(sourcePath);
  const metadata = await sharp(sourceBuffer).metadata();
  const sourceDimensions = getOrientedDimensions(metadata);
  const targetWidths = getTargetWidths(sourceDimensions.width);
  const contentHash = createHash('sha256')
    .update(sourceBuffer)
    .update(pipelineVersion)
    .digest('hex')
    .slice(0, 12);
  const sourceRelativePath = sourceUrl.slice(1);
  const parsedSourcePath = path.parse(sourceRelativePath);
  const targetDirectory = path.join(outputDirectory, parsedSourcePath.dir);
  const fallbackFormat = metadata.hasAlpha ? 'png' : 'jpeg';
  const fallbackExtension = fallbackFormat === 'jpeg' ? 'jpg' : 'png';
  const variants = {
    avif: [],
    fallback: [],
    webp: [],
  };

  await mkdir(targetDirectory, { recursive: true });

  for (const width of targetWidths) {
    const fileStem = `${parsedSourcePath.name}.${contentHash}-${width}`;
    const outputDefinitions = [
      { extension: 'avif', format: 'avif', manifestKey: 'avif' },
      { extension: 'webp', format: 'webp', manifestKey: 'webp' },
      {
        extension: fallbackExtension,
        format: fallbackFormat,
        manifestKey: 'fallback',
      },
    ];

    for (const outputDefinition of outputDefinitions) {
      const outputPath = path.join(
        targetDirectory,
        `${fileStem}.${outputDefinition.extension}`,
      );

      expectedOutputPaths.add(outputPath);
      await createVariant({
        buffer: sourceBuffer,
        format: outputDefinition.format,
        outputPath,
        width,
      });
      variants[outputDefinition.manifestKey].push({
        src: toPublicUrl(outputPath),
        width,
      });
    }
  }

  return {
    fallbackType: fallbackFormat === 'png' ? 'image/png' : 'image/jpeg',
    height: sourceDimensions.height,
    sources: variants,
    width: sourceDimensions.width,
  };
};

const removeStaleOutputs = async (expectedOutputPaths) => {
  const generatedFiles = await listFilesRecursively(outputDirectory);

  await Promise.all(
    generatedFiles
      .filter((filePath) => !expectedOutputPaths.has(filePath))
      .map((filePath) => rm(filePath, { force: true })),
  );
};

const writeManifest = async (manifest) => {
  await mkdir(path.dirname(manifestPath), { recursive: true });
  await writeFile(manifestPath, `${JSON.stringify(manifest, null, 2)}\n`);
};

const cleanGeneratedImages = async () => {
  await rm(outputDirectory, { force: true, recursive: true });
  await writeManifest({});
  console.log('Generated image variants and manifest were cleaned.');
};

const optimizeImages = async () => {
  const sourceUrls = await getReferencedSourcePaths();

  if (sourceUrls.length === 0) {
    throw new Error('No referenced raster images were found in src.');
  }

  const expectedOutputPaths = new Set();
  const manifestEntries = await Promise.all(
    sourceUrls.map(async (sourceUrl) => [
      sourceUrl,
      await optimizeSource(sourceUrl, expectedOutputPaths),
    ]),
  );
  const manifest = Object.fromEntries(manifestEntries);

  await removeStaleOutputs(expectedOutputPaths);
  await writeManifest(manifest);

  const sourceBytes = await Promise.all(
    sourceUrls.map(async (sourceUrl) => {
      const sourcePath = path.join(publicDirectory, sourceUrl.slice(1));
      return (await stat(sourcePath)).size;
    }),
  );
  const generatedBytes = await Promise.all(
    [...expectedOutputPaths].map(async (filePath) => (await stat(filePath)).size),
  );

  console.log(
    `Optimized ${sourceUrls.length} images into ${expectedOutputPaths.size} responsive variants.`,
  );
  console.log(
    `Referenced originals: ${(sourceBytes.reduce((sum, size) => sum + size, 0) / 1024 / 1024).toFixed(2)} MB.`,
  );
  console.log(
    `All generated formats and widths: ${(generatedBytes.reduce((sum, size) => sum + size, 0) / 1024 / 1024).toFixed(2)} MB.`,
  );
};

if (process.argv.includes('--clean')) {
  await cleanGeneratedImages();
} else {
  await optimizeImages();
}
