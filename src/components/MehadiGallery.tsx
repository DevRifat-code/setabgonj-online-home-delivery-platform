import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { getSupabase } from '../lib/supabase';
import { useLanguage } from '../lib/LanguageContext';
import Lightbox from './Lightbox';

const DEFAULT_DESIGNS = [
  { img: '/assets/images/bridal_art_card_1778986446990.png', title: 'Intricate Bridal' },
  { img: '/assets/images/henna_hero_banner_1778986342690.png', title: 'Minimalist Floral' },
  { img: '/assets/images/organic_henna_cones_1778986359766.png', title: 'Traditional Patterns' },
  { img: '/assets/images/tailoring_studio_1778986392437.png', title: 'Custom Fusion' },
];

export default function MehadiGallery() {
  const [designs, setDesigns] = useState<any[]>(DEFAULT_DESIGNS);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [activeDesignIndex, setActiveDesignIndex] = useState(0);
  const { t, language } = useLanguage();

  useEffect(() => {
    const fetchDesigns = async () => {
      try {
        const client = getSupabase();
        const { data, error } = await client
          .from('design_library')
          .select('*')
          .order('created_at', { ascending: true });
        
        if (data && data.length > 0) {
          setDesigns(data.map((item: any) => ({
            img: item.image_url,
            title: item.title
          })));
        }
      } catch (err) {
        console.error('Error fetching designs:', err);
      }
    };
    fetchDesigns();
  }, []);

  const getTranslatedDesignTitle = (title: string) => {
    if (title === 'Intricate Bridal') return t('Intricate Bridal') !== 'Intricate Bridal' ? t('Intricate Bridal') : title;
    if (title === 'Minimalist Floral') return t('Minimalist Floral') !== 'Minimalist Floral' ? t('Minimalist Floral') : title;
    if (title === 'Traditional Patterns') return t('Traditional Patterns') !== 'Traditional Patterns' ? t('Traditional Patterns') : title;
    if (title === 'Custom Fusion') return t('Custom Fusion') !== 'Custom Fusion' ? t('Custom Fusion') : title;
    return title;
  };

  return (
    <section id="mehadi-design-gallery" className="py-32 px-6 bg-soft-white/50">
      <div className="max-w-7xl mx-auto">
        <div className="mb-20">
          <span className="font-sans text-xs uppercase tracking-[0.4em] text-rose-gold font-bold mb-4 block text-right font-bold">
            {t('mehadi.tag')}
          </span>
          <h2 className="font-serif text-5xl md:text-7xl font-light text-emerald-deep tracking-tight text-right">
            {t('mehadi.title_library').split(' ').slice(0, 1).join(' ')} <span className="italic">{t('mehadi.title_library').split(' ').slice(1).join(' ')}</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {designs.map((design, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: index * 0.1 }}
              className="group relative h-[400px] overflow-hidden rounded-[2rem] shadow-lg bg-warm-beige cursor-pointer"
              onClick={() => {
                setActiveDesignIndex(index);
                setIsLightboxOpen(true);
              }}
            >
              <img 
                src={design.img} 
                alt={design.title} 
                className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700 scale-110 group-hover:scale-100"
              />
              <div className="absolute inset-x-0 bottom-0 p-6 bg-gradient-to-t from-black/60 to-transparent flex flex-col justify-end opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                <span className="text-white font-serif text-xl italic mb-1">{getTranslatedDesignTitle(design.title)}</span>
                <span className="text-white/70 font-sans text-[10px] uppercase tracking-wider">
                  {language === 'bn' ? 'বড় করে দেখতে স্পর্শ করুন' : 'Tap to View Full Screen'}
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Lightbox Overlay */}
      <Lightbox
        isOpen={isLightboxOpen}
        onClose={() => setIsLightboxOpen(false)}
        images={designs.map((d) => ({
          src: d.img,
          title: getTranslatedDesignTitle(d.title),
        }))}
        currentIndex={activeDesignIndex}
        setCurrentIndex={setActiveDesignIndex}
      />
    </section>
  );
}

