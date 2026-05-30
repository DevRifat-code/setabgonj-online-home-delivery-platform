import { motion, useScroll, useTransform } from 'motion/react';
import { useRef } from 'react';

interface HeroProps {
  imagePath: string;
  title?: string;
  subtitle?: string;
}

export default function Hero({ imagePath, title, subtitle }: HeroProps) {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"]
  });

  const y = useTransform(scrollYProgress, [0, 1], ["0%", "25%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.8], [0.8, 0.4]);

  return (
    <section 
      ref={containerRef}
      id="home" 
      className="relative min-h-screen flex items-center justify-center pt-20 overflow-hidden"
      style={{ position: 'relative' }}
    >
      <motion.div 
        style={{ y }}
        className="absolute inset-0 z-0"
      >
        <motion.img
          style={{ opacity }}
          src={imagePath}
          alt="Luxury Henna Art"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-soft-white/20 via-transparent to-soft-white" />
      </motion.div>

      <div className="relative z-10 text-center px-6 max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        >
          <span className="inline-block font-sans text-xs uppercase tracking-[0.5em] text-rose-gold mb-6 font-semibold">
            Est. 2024
          </span>
          <h1 className="font-serif text-5xl md:text-7xl lg:text-8xl font-light mb-8 leading-[1.1] tracking-tight text-emerald-deep">
            {title || <>Handcrafted <br /><span className="italic font-normal text-rose-gold">with Love</span></>}
          </h1>
          <p className="font-sans text-lg md:text-xl text-emerald-deep/80 max-w-2xl mx-auto mb-10 leading-relaxed font-light">
            {subtitle || <>Premium Henna, Floral Jewelry & Bespoke Tailoring. <br /> Where tradition meets contemporary elegance.</>}
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
            <a
              href="#products"
              className="px-10 py-4 bg-emerald-deep text-white rounded-full font-medium hover:bg-rose-gold transition-all duration-500 shadow-lg hover:shadow-rose-gold/20 tracking-wide"
            >
              Explore Collection
            </a>
            <a
              href="#booking"
              className="px-10 py-4 border border-emerald-deep text-emerald-deep rounded-full font-medium hover:bg-emerald-deep hover:text-white transition-all duration-500 tracking-wide"
            >
              Book Bridal Art
            </a>
          </div>
        </motion.div>
      </div>

      <motion.div
        className="absolute bottom-10 left-1/2 -translate-x-1/2"
        animate={{ y: [0, 10, 0] }}
        transition={{ repeat: Infinity, duration: 2 }}
      >
        <div className="w-[1px] h-16 bg-gradient-to-b from-rose-gold to-transparent" />
      </motion.div>
    </section>
  );
}
