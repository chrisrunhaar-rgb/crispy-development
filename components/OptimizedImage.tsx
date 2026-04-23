'use client';

import Image from 'next/image';
import { OptimizedImage as OptimizedImageType, getResponsiveSizes, getWebPVariant } from '@/lib/image-utils';

interface OptimizedImageProps extends Omit<OptimizedImageType, 'src' | 'alt'> {
  src: string;
  alt: string;
  className?: string;
  containerClassName?: string;
  priority?: boolean;
}

/**
 * Optimized image component with lazy loading and WebP support
 *
 * Usage:
 * <OptimizedImage
 *   src="/images/assessment.jpg"
 *   alt="DISC assessment screenshot"
 *   width={800}
 *   height={600}
 * />
 */
export default function OptimizedImage({
  src,
  alt,
  width = 800,
  height = 600,
  loading = 'lazy',
  className = '',
  containerClassName = '',
  priority = false,
}: OptimizedImageProps) {
  const webpSrc = getWebPVariant(src);
  const sizes = getResponsiveSizes();

  return (
    <div className={`relative overflow-hidden ${containerClassName}`}>
      {/* Picture element with WebP fallback */}
      <picture>
        <source srcSet={webpSrc} type="image/webp" />
        <source srcSet={src} type={`image/${src.split('.').pop()}`} />

        {/* Next.js Image component for optimization */}
        <Image
          src={src}
          alt={alt}
          width={width}
          height={height}
          loading={loading}
          className={className}
          sizes={sizes}
          priority={priority}
          quality={85}
        />
      </picture>
    </div>
  );
}
