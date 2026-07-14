import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';

interface LazyImageProps {
  src: string;
  alt: string;
  className?: string;
  wrapperClassName?: string;
  loading?: 'lazy' | 'eager';
  priority?: boolean;
  variants?: any;
  transition?: any;
  onClick?: (e: React.MouseEvent) => void;
}

export default function LazyImage({
  src,
  alt,
  className = '',
  wrapperClassName = '',
  loading = 'lazy',
  priority = false,
  variants,
  transition,
  onClick,
}: LazyImageProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState(false);

  // Dynamic preloading for high-priority images
  useEffect(() => {
    if (priority && src) {
      const link = document.createElement('link');
      link.rel = 'preload';
      link.as = 'image';
      link.href = src;
      document.head.appendChild(link);

      return () => {
        try {
          document.head.removeChild(link);
        } catch (e) {
          // Ignore if already removed
        }
      };
    }
  }, [src, priority]);

  return (
    <div className={`relative overflow-hidden w-full h-full ${wrapperClassName}`}>
      {/* Premium Shimmer Loader */}
      {!isLoaded && !error && (
        <div className="absolute inset-0 bg-gradient-to-r from-emerald-deep/5 via-rose-gold/10 to-emerald-deep/5 animate-pulse flex items-center justify-center">
          <div className="w-8 h-8 rounded-full border-2 border-rose-gold/30 border-t-rose-gold animate-spin" />
        </div>
      )}

      {error ? (
        <div className="absolute inset-0 bg-warm-beige flex flex-col items-center justify-center p-4 text-center">
          <span className="text-xs font-semibold text-emerald-deep/40 uppercase tracking-wider">Image Unavailable</span>
        </div>
      ) : (
        <motion.img
          src={src}
          alt={alt}
          loading={priority ? 'eager' : loading}
          referrerPolicy="no-referrer"
          className={`w-full h-full object-cover ${className}`}
          variants={variants}
          transition={transition || { duration: 0.6, ease: 'easeOut' }}
          onLoad={() => setIsLoaded(true)}
          onError={() => setError(true)}
          onClick={onClick}
          initial={{ opacity: 0 }}
          animate={{ opacity: isLoaded ? 1 : 0 }}
        />
      )}
    </div>
  );
}
