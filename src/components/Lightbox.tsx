import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, ChevronLeft, ChevronRight, Play, Pause } from 'lucide-react';

interface LightboxImage {
  src: string;
  title?: string;
}

interface LightboxProps {
  isOpen: boolean;
  onClose: () => void;
  images: LightboxImage[];
  currentIndex: number;
  setCurrentIndex: (index: number) => void;
}

export default function Lightbox({
  isOpen,
  onClose,
  images,
  currentIndex,
  setCurrentIndex,
}: LightboxProps) {
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [isPlaying, setIsPlaying] = useState(true);

  // Prevent background scrolling when lightbox is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  const handleNext = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (images.length <= 1) return;
    setCurrentIndex((currentIndex + 1) % images.length);
  };

  const handlePrev = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (images.length <= 1) return;
    setCurrentIndex((currentIndex - 1 + images.length) % images.length);
  };

  // Autoplay handler
  useEffect(() => {
    if (!isOpen || !isPlaying || images.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentIndex((currentIndex + 1) % images.length);
    }, 4000);

    return () => clearInterval(interval);
  }, [isOpen, isPlaying, images.length, currentIndex, setCurrentIndex]);

  // Keyboard navigation
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowRight') handleNext();
      if (e.key === 'ArrowLeft') handlePrev();
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, currentIndex, images.length]);

  // Touch handlers for mobile swiping
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStart === null) return;
    const touchEnd = e.changedTouches[0].clientX;
    const distance = touchStart - touchEnd;
    const threshold = 50; // Minimum distance (px) to register as slide

    if (distance > threshold) {
      // Swiped Left -> Show Next Image
      handleNext();
    } else if (distance < -threshold) {
      // Swiped Right -> Show Previous Image
      handlePrev();
    }
    setTouchStart(null);
  };

  if (!isOpen || images.length === 0) return null;

  const currentImage = images[currentIndex];

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
        className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-[#09110d]/95 backdrop-blur-md"
        onClick={onClose}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        {/* Top bar with close option */}
        <div className="absolute top-6 left-6 right-6 z-[110] flex items-center justify-between pointer-events-none">
          {/* Caption info and Play/Pause control on top left */}
          <div className="flex items-center gap-3 pointer-events-auto">
            <div className="text-white/60 font-mono text-sm bg-neutral-900/40 px-3 py-1.5 rounded-full backdrop-blur-sm">
              {currentIndex + 1} / {images.length}
            </div>

            {images.length > 1 && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setIsPlaying(!isPlaying);
                }}
                className="w-10 h-10 flex items-center justify-center text-white bg-white/10 hover:bg-white/20 active:scale-95 rounded-full cursor-pointer transition-all duration-300 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-white/40"
                title={isPlaying ? 'Pause Slideshow' : 'Start Slideshow'}
                aria-label={isPlaying ? 'Pause slideshow' : 'Start slideshow'}
                id="lightbox-play-pause-btn"
              >
                {isPlaying ? <Pause size={16} /> : <Play size={16} className="ml-0.5" />}
              </button>
            )}
          </div>

          {/* Close Button */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              onClose();
            }}
            className="w-12 h-12 flex items-center justify-center text-white bg-white/10 hover:bg-white/20 active:scale-95 rounded-full cursor-pointer transition-all duration-300 pointer-events-auto focus:outline-none focus:ring-2 focus:ring-white/40"
            aria-label="Close lightbox"
            id="lightbox-close-btn"
          >
            <X size={24} />
          </button>
        </div>

        {/* Center content container */}
        <div className="relative w-full max-w-5xl h-full flex flex-col items-center justify-center px-4 md:px-16 py-20 pointer-events-none">
          {/* Main Image Layer */}
          <div className="relative flex flex-col items-center justify-center max-h-[70vh] md:max-h-[80vh] w-full max-w-full pointer-events-auto">
            <AnimatePresence mode="wait">
              <motion.img
                key={currentIndex}
                src={currentImage.src}
                alt={currentImage.title || `Gallery Image ${currentIndex + 1}`}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.25, ease: 'easeOut' }}
                className="max-h-[70vh] md:max-h-[80vh] max-w-full object-contain rounded-2xl md:rounded-3xl shadow-2xl select-none"
                onClick={(e) => e.stopPropagation()} // Stop closing lightbox when image itself is tapped
              />
            </AnimatePresence>

            {/* Subtle Caption Card below Image */}
            {currentImage.title && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                transition={{ delay: 0.1, duration: 0.2 }}
                className="mt-6 bg-white/10 px-6 py-3 rounded-2xl backdrop-blur-md text-white font-serif text-lg tracking-wide md:text-xl text-center select-none"
              >
                {currentImage.title}
              </motion.div>
            )}
          </div>
        </div>

        {/* Navigation arrows (desktop and larger touch targets) */}
        {images.length > 1 && (
          <>
            {/* Left Button */}
            <button
              onClick={handlePrev}
              className="absolute left-4 md:left-6 w-14 h-14 hidden sm:flex items-center justify-center text-white bg-white/10 hover:bg-white/20 active:scale-95 rounded-full cursor-pointer transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-white/40 z-[110]"
              aria-label="Previous image"
              id="lightbox-prev-btn"
            >
              <ChevronLeft size={30} />
            </button>

            {/* Right Button */}
            <button
              onClick={handleNext}
              className="absolute right-4 md:right-6 w-14 h-14 hidden sm:flex items-center justify-center text-white bg-white/10 hover:bg-white/20 active:scale-95 rounded-full cursor-pointer transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-white/40 z-[110]"
              aria-label="Next image"
              id="lightbox-next-btn"
            >
              <ChevronRight size={30} />
            </button>
          </>
        )}

        {/* Progress Bar (at the very bottom of the entire viewport) */}
        {images.length > 1 && isPlaying && (
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/10 z-[110]">
            <motion.div
              key={`${currentIndex}`}
              initial={{ width: '0%' }}
              animate={{ width: '100%' }}
              transition={{
                duration: 4,
                ease: 'linear',
              }}
              className="h-full bg-rose-gold"
            />
          </div>
        )}
      </motion.div>
    </AnimatePresence>
  );
}
