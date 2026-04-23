/**
 * Image optimization utilities
 *
 * For WebP conversion and lazy loading
 * Used in: Resource pages, components
 */

export interface OptimizedImage {
  src: string;
  webp?: string;
  alt: string;
  width?: number;
  height?: number;
  loading?: 'lazy' | 'eager';
  sizes?: string;
}

/**
 * Generate srcSet for responsive images
 * Example: image.jpg -> 1x, 2x variants
 */
export function generateSrcSet(src: string): string {
  if (!src) return '';
  const basePath = src.replace(/\.[^.]+$/, ''); // Remove extension
  const ext = src.substring(src.lastIndexOf('.') + 1);
  return `${src} 1x, ${basePath}@2x.${ext} 2x`;
}

/**
 * Responsive sizes string for images
 * Usage: img srcSet sizes={getResponsiveSizes()}
 */
export function getResponsiveSizes(breakpoints?: {
  sm?: number;
  md?: number;
  lg?: number;
}) {
  const defaults = {
    sm: 100,  // 100vw on mobile
    md: 50,   // 50vw on tablet
    lg: 33,   // 33vw on desktop
  };

  const bp = { ...defaults, ...breakpoints };
  return `(max-width: 640px) ${bp.sm}vw, (max-width: 1024px) ${bp.md}vw, ${bp.lg}vw`;
}

/**
 * Generate WebP fallback variant path
 * Example: image.jpg -> image.webp
 */
export function getWebPVariant(src: string): string {
  return src.replace(/\.[^.]+$/, '.webp');
}

/**
 * Common alt text patterns for resources
 */
export const altTextPatterns = {
  assessment: (name: string) => `${name} assessment tool screenshot`,
  framework: (name: string) => `${name} framework diagram`,
  hero: (title: string) => `Header image for ${title}`,
  profile: (name: string) => `${name} personality profile icon`,
  chart: (type: string) => `${type} chart showing results`,
  icon: (name: string) => `${name} icon`,
};

/**
 * Image lazy loading configuration
 */
export const lazyLoadConfig = {
  root: null,
  rootMargin: '50px',
  threshold: 0.01,
};

/**
 * Create picture element with WebP fallback
 * Returns HTML string for use in Next.js
 */
export function createPictureHTML(
  src: string,
  webp: string,
  alt: string,
  width?: number,
  height?: number
): string {
  return `
    <picture>
      <source srcSet="${webp}" type="image/webp" />
      <img src="${src}" alt="${alt}" ${width ? `width="${width}"` : ''} ${height ? `height="${height}"` : ''} loading="lazy" />
    </picture>
  `;
}
