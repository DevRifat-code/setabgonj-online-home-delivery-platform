import React from 'react';
import { motion } from 'motion/react';
import { ArrowRight, ZoomIn } from 'lucide-react';
import { useLanguage } from '../lib/LanguageContext';
import LazyImage from './LazyImage';

interface ProductCardProps {
  title: string;
  category: string;
  image: string;
  onOrder: () => void;
  index: number;
  price?: string;
  type?: string;
  key?: string | number;
  onZoom?: () => void;
}

export default function ProductCard({ title, category, image, onOrder, index, price, type, onZoom }: ProductCardProps) {
  const { t } = useLanguage();

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      className="group relative"
      whileHover="hover"
      whileFocus="hover"
    >
      <div 
        className="aspect-[3/4] overflow-hidden rounded-[2rem] bg-warm-beige relative group cursor-pointer"
        onClick={onZoom}
      >
        <LazyImage
          src={image}
          alt={`Image for ${title}`}
          className="w-full h-full object-cover"
          variants={{
            hover: { scale: 1.1 }
          }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        />

        {/* Premium Zoom Button Badge */}
        {onZoom && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onZoom();
            }}
            className="absolute top-4 right-4 z-20 w-11 h-11 rounded-full bg-white/90 backdrop-blur-md text-emerald-deep hover:text-rose-gold shadow-lg flex items-center justify-center transition-all duration-300 hover:scale-110 active:scale-95 focus:outline-none cursor-pointer border border-white/20"
            title="Zoom image (বড় করে দেখুন)"
            aria-label={`Zoom ${title} image`}
            id={`zoom-btn-${index}`}
          >
            <ZoomIn size={18} />
          </button>
        )}

        <motion.div 
          className="absolute inset-0 bg-black/10 transition-colors duration-500"
          variants={{
            hover: { backgroundColor: "rgba(0, 0, 0, 0.3)" }
          }}
        />
        
        <div 
          className="absolute bottom-0 left-0 right-0 p-6 md:p-8 transition-all duration-300 opacity-100 translate-y-0 md:opacity-0 md:translate-y-4 md:group-hover:opacity-100 md:group-hover:translate-y-0"
          onClick={(e) => e.stopPropagation()}
        >
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={onOrder}
            aria-label={`${type === 'booking' ? 'Book' : 'Order'} ${title} now`}
            className="w-full py-4 bg-white text-emerald-deep rounded-full font-bold flex items-center justify-center gap-2 shadow-xl hover:bg-soft-white transition-colors focus:outline-none focus:ring-4 focus:ring-rose-gold/50 cursor-pointer"
          >
            {type === 'booking' ? t('collection.btn_book_service') : t('collection.btn_order_product')} <ArrowRight size={18} />
          </motion.button>
        </div>
      </div>
      
      <div className="mt-6 flex justify-between items-start px-2 gap-4">
        <div>
          <span className="text-[10px] uppercase tracking-[0.3em] text-rose-gold font-bold mb-1 block">
            {category} {type && `• ${type === 'booking' ? 'Booking' : 'Product'}`}
          </span>
          <h3 className="font-serif text-2xl font-medium text-emerald-deep tracking-tight">
            {title}
          </h3>
        </div>
        {price && (
          <div className="bg-emerald-deep/5 text-rose-gold border border-rose-gold/10 font-mono font-bold px-3 py-1.5 rounded-xl text-sm whitespace-nowrap shrink-0 self-center">
            {price}
          </div>
        )}
      </div>
    </motion.div>
  );
}
