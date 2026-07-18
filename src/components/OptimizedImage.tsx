import type { CSSProperties, ImgHTMLAttributes } from 'react';
import imageManifestData from '../generated/image-manifest.json';
import { withBasePath } from '../lib/basePath';

type ImageVariant = {
  src: string;
  width: number;
};

type OptimizedImageManifestEntry = {
  fallbackType: 'image/jpeg' | 'image/png';
  height: number;
  sources: {
    avif: ImageVariant[];
    fallback: ImageVariant[];
    webp: ImageVariant[];
  };
  width: number;
};

const imageManifest = imageManifestData as Record<
  string,
  OptimizedImageManifestEntry
>;

export type OptimizedImageProps = Omit<
  ImgHTMLAttributes<HTMLImageElement>,
  'alt' | 'fetchPriority' | 'height' | 'loading' | 'src' | 'width'
> & {
  alt: string;
  fetchPriority?: 'high' | 'low' | 'auto';
  height?: number;
  loading?: 'eager' | 'lazy';
  objectFit?: CSSProperties['objectFit'];
  sizes?: string;
  src: string;
  width?: number;
};

const createSrcSet = (variants: ImageVariant[]) => {
  return variants
    .map((variant) => `${withBasePath(variant.src)} ${variant.width}w`)
    .join(', ');
};

export const OptimizedImage = ({
  alt,
  fetchPriority,
  height,
  loading,
  objectFit,
  sizes = '100vw',
  src,
  style,
  width,
  ...imageProps
}: OptimizedImageProps) => {
  const manifestEntry = imageManifest[src];
  const resolvedStyle = objectFit ? { ...style, objectFit } : style;

  if (!manifestEntry) {
    return (
      <img
        {...imageProps}
        alt={alt}
        fetchPriority={fetchPriority}
        height={height}
        loading={loading}
        sizes={sizes}
        src={withBasePath(src)}
        style={resolvedStyle}
        width={width}
      />
    );
  }

  const fallbackVariants = manifestEntry.sources.fallback;
  const fallbackSource = withBasePath(fallbackVariants.at(-1)?.src ?? src);

  return (
    <picture className="contents">
      <source
        sizes={sizes}
        srcSet={createSrcSet(manifestEntry.sources.avif)}
        type="image/avif"
      />
      <source
        sizes={sizes}
        srcSet={createSrcSet(manifestEntry.sources.webp)}
        type="image/webp"
      />
      <img
        {...imageProps}
        alt={alt}
        fetchPriority={fetchPriority}
        height={height ?? manifestEntry.height}
        loading={loading}
        sizes={sizes}
        src={fallbackSource}
        srcSet={createSrcSet(fallbackVariants)}
        style={resolvedStyle}
        width={width ?? manifestEntry.width}
      />
    </picture>
  );
};
