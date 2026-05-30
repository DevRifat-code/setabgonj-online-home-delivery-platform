import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { getSupabase } from '../lib/supabase';
import { useLanguage } from '../lib/LanguageContext';
import Lightbox from './Lightbox';

const DEFAULT_IMAGES = [
  '/assets/images/bridal_art_card_1778986446990.png',
  '/assets/images/tailoring_studio_1778986392437.png',
  '/assets/images/henna_hero_banner_1778986342690.png',
  '/assets/images/floral_jewelry_display_1778986376041.png',
];

export default function WorkGallery() {
  const [images, setImages] = useState<string[]>(DEFAULT_IMAGES);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const { t, language } = useLanguage();

  useEffect(() => {
    const fetchPortfolio = async () => {
      try {
        const client = getSupabase();
        const { data, error } = await client
          .from('portfolio')
          .select('*')
          .order('created_at', { ascending: true });
        
        if (data && data.length > 0) {
          setImages(data.map((item: any) => item.image_url));
        }
      } catch (err) {
        console.error('Error fetching portfolio:', err);
      }
    };
    fetchPortfolio();
  }, []);

  return (
    <section id="work-photo-gallery" className="py-32 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-20 text-center">
          <span className="font-sans text-xs uppercase tracking-[0.4em] text-rose-gold font-bold mb-4 block">
            {t('portfolio.tag')}
          </span>
          <h2 className="font-serif text-5xl md:text-7xl font-light text-emerald-deep tracking-tight">
            {t('portfolio.title_recent')} <span className="italic">{t('portfolio.title_work')}</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {images.map((img, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="relative aspect-[4/3] overflow-hidden rounded-[2.5rem] group cursor-pointer"
              onClick={() => {
                setActiveImageIndex(index);
                setIsLightboxOpen(true);
              }}
            >
              <img 
                src={img} 
                alt={`Work ${index + 1}`} 
                loading="lazy"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors duration-500 flex items-center justify-center" />
              
              {/* Optional overlay button hint on hover */}
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <span className="bg-white/95 text-emerald-deep font-sans text-xs uppercase font-semibold tracking-widest px-6 py-3 rounded-full shadow-lg transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                  {language === 'bn' ? 'বড় করে দেখুন' : 'View Full Image'}
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Lightbox Modal */}
      <Lightbox
        isOpen={isLightboxOpen}
        onClose={() => setIsLightboxOpen(false)}
        images={images.map((img, idx) => ({
          src: img,
          title: language === 'bn' ? `ছবি ${idx + 1}` : `Image ${idx + 1}`,
        }))}
        currentIndex={activeImageIndex}
        setCurrentIndex={setActiveImageIndex}
      />
    </section>
  );
}

