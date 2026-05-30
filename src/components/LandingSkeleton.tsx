import React from 'react';

export default function LandingSkeleton() {
  return (
    <div className="w-full animate-pulse bg-soft-white dark:bg-zinc-950 min-h-screen">
      {/* Hero Section Skeleton */}
      <section className="relative min-h-[90vh] flex flex-col items-center justify-center pt-24 pb-16 px-6 overflow-hidden border-b border-emerald-deep/5">
        <div className="absolute inset-0 bg-emerald-deep/[0.02] dark:bg-emerald-deep/[0.01]" />
        
        <div className="relative z-10 w-full max-w-4xl flex flex-col items-center text-center space-y-8">
          {/* Est 2024 tiny text skeleton */}
          <div className="h-4 w-28 bg-rose-gold/20 dark:bg-rose-gold/10 rounded-full" />
          
          {/* Main heading lines skeleton */}
          <div className="space-y-4 w-full flex flex-col items-center">
            <div className="h-12 md:h-16 lg:h-20 w-4/5 md:w-3/5 bg-emerald-deep/10 dark:bg-emerald-deep/5 rounded-2xl" />
            <div className="h-12 md:h-16 lg:h-20 w-3/5 md:w-2/5 bg-emerald-deep/10 dark:bg-emerald-deep/5 rounded-2xl" />
          </div>

          {/* Subtitle description skeleton */}
          <div className="space-y-3 w-full flex flex-col items-center max-w-xl">
            <div className="h-4 w-11/12 bg-emerald-deep/5 dark:bg-emerald-deep/[0.03] rounded-lg" />
            <div className="h-4 w-9/12 bg-emerald-deep/5 dark:bg-emerald-deep/[0.03] rounded-lg" />
          </div>

          {/* Button indicators */}
          <div className="flex flex-col sm:flex-row items-center gap-4 pt-6">
            <div className="h-14 w-44 bg-emerald-deep/15 dark:bg-emerald-deep/10 rounded-full" />
            <div className="h-14 w-44 bg-rose-gold/15 dark:bg-rose-gold/10 rounded-full border border-rose-gold/20" />
          </div>
        </div>

        {/* Vertical line pointer */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 w-[1px] h-12 bg-gradient-to-b from-rose-gold/30 to-transparent" />
      </section>

      {/* Products Grid Skeleton */}
      <section className="py-24 px-6 max-w-7xl mx-auto">
        {/* Curated collection header skeleton */}
        <div className="mb-16 flex flex-col items-center space-y-4 text-center">
          <div className="h-4 w-32 bg-rose-gold/25 dark:bg-rose-gold/15 rounded-full" />
          <div className="h-10 md:h-12 w-80 bg-emerald-deep/10 dark:bg-emerald-deep/5 rounded-2xl" />
          <div className="w-16 h-[2px] bg-rose-gold/30" />
        </div>

        {/* 4 Product Cards in responsive columns */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {[1, 2, 3, 4].map((idx) => (
            <div key={idx} className="space-y-5">
              {/* Product Card Aspect Ratio Image Shell */}
              <div className="aspect-[3/4] w-full bg-emerald-deep/[0.04] dark:bg-emerald-deep/[0.02] rounded-[2rem] relative overflow-hidden flex items-end p-6">
                <div className="absolute inset-0 bg-gradient-to-t from-emerald-deep/[0.05] to-transparent" />
                {/* Simulated button */}
                <div className="h-12 w-full bg-white/60 dark:bg-white/10 rounded-full" />
              </div>

              {/* Text labels below the image */}
              <div className="flex justify-between items-start pt-1">
                <div className="space-y-2.5 flex-1">
                  {/* Category tag */}
                  <div className="h-3 w-24 bg-rose-gold/20 dark:bg-rose-gold/10 rounded-full" />
                  {/* Title */}
                  <div className="h-6 w-11/12 bg-emerald-deep/10 dark:bg-emerald-deep/5 rounded-xl" />
                </div>
                {/* Price block */}
                <div className="h-7 w-16 bg-emerald-deep/5 dark:bg-emerald-deep/[0.03] rounded-xl ml-4 shrink-0" />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Booking Special CTA Skeleton */}
      <section className="py-24 px-6 bg-warm-beige/30 dark:bg-zinc-900/30">
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-16">
          <div className="flex-1 w-full flex justify-center">
            {/* Aspect Ratio Decorative Frame */}
            <div className="aspect-square w-full max-w-md bg-emerald-deep/[0.03] dark:bg-emerald-deep/[0.01] rounded-[2.5rem] relative" />
          </div>
          <div className="flex-1 space-y-6 w-full text-left">
            <div className="h-3 w-28 bg-rose-gold/25 dark:bg-rose-gold/15 rounded-full" />
            <div className="space-y-3">
              <div className="h-8 md:h-10 w-9/12 bg-emerald-deep/10 dark:bg-emerald-deep/5 rounded-xl" />
              <div className="h-8 md:h-10 w-6/12 bg-emerald-deep/10 dark:bg-emerald-deep/5 rounded-xl" />
            </div>
            <div className="space-y-2 pt-2">
              <div className="h-4 w-11/12 bg-emerald-deep/5 dark:bg-emerald-deep/[0.03] rounded-lg" />
              <div className="h-4 w-10/12 bg-emerald-deep/5 dark:bg-emerald-deep/[0.03] rounded-lg" />
              <div className="h-4 w-8/12 bg-emerald-deep/5 dark:bg-emerald-deep/[0.03] rounded-lg" />
            </div>
            <div className="h-14 w-44 bg-emerald-deep/15 dark:bg-emerald-deep/10 rounded-full pt-4" />
          </div>
        </div>
      </section>
    </div>
  );
}
