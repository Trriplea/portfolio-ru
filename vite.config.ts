import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import { readFileSync } from 'node:fs';
import { defineConfig, type Plugin } from 'vite';

type ImageVariant = {
  src: string;
  width: number;
};

type ImageManifestEntry = {
  sources: {
    avif: ImageVariant[];
  };
};

const productionBasePath = '/portfolio-ru/';
const priorityCoverSource = '/projects/toto-cover.png';
const priorityCoverSizes =
  '(min-width: 1026px) 32vw, (min-width: 501px) calc(100vw - 320px), 31vw';

const withProductionBasePath = (assetPath: string) => {
  return `${productionBasePath}${assetPath.replace(/^\//, '')}`;
};

const createPriorityCoverPreloadPlugin = (): Plugin => ({
  name: 'priority-cover-preload',
  transformIndexHtml: {
    order: 'pre',
    handler: () => {
      const manifestUrl = new URL(
        './src/generated/image-manifest.json',
        import.meta.url,
      );
      const imageManifest = JSON.parse(
        readFileSync(manifestUrl, 'utf8'),
      ) as Record<string, ImageManifestEntry>;
      const priorityCoverVariants =
        imageManifest[priorityCoverSource]?.sources.avif ?? [];

      if (priorityCoverVariants.length === 0) {
        return [];
      }

      const preloadSrcSet = priorityCoverVariants
        .map(
          (variant) =>
            `${withProductionBasePath(variant.src)} ${variant.width}w`,
        )
        .join(', ');

      return [
        {
          attrs: {
            as: 'image',
            fetchpriority: 'high',
            href: withProductionBasePath(priorityCoverVariants[0].src),
            imagesizes: priorityCoverSizes,
            imagesrcset: preloadSrcSet,
            rel: 'preload',
            type: 'image/avif',
          },
          injectTo: 'head-prepend',
          tag: 'link',
        },
      ];
    },
  },
});

export default defineConfig(({ mode }) => ({
  base: mode === 'production' ? productionBasePath : '/',
  plugins: [
    react(),
    tailwindcss(),
    ...(mode === 'production' ? [createPriorityCoverPreloadPlugin()] : []),
  ],
}));
