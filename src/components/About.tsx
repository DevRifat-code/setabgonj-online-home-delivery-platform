import { motion } from 'motion/react';
import { useLanguage } from '../lib/LanguageContext';
import { Facebook, MessageCircle } from 'lucide-react';

interface AboutProps {
  imageUrl?: string;
}

export default function About({ imageUrl }: AboutProps) {
  const { t, language } = useLanguage();

  return (
    <section id="about" className="py-32 px-6 overflow-hidden bg-warm-beige">
      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-16 lg:gap-24">
        <motion.div 
          initial={{ opacity: 0, x: -50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1 }}
          className="flex-1 text-center lg:text-left space-y-8"
        >
          <div>
            <span className="font-sans text-xs uppercase tracking-[0.4em] text-rose-gold font-bold mb-4 block">
              {t('about.story')}
            </span>
            <h2 className="font-serif text-5xl md:text-6xl text-emerald-deep leading-tight">
              {language === 'en' ? 'Meet' : 'পরিচিত হোন'}{' '}
              <span className="italic font-bold block mt-2 text-rose-gold">Brishty Möû</span>
            </h2>
            <p className="text-sm font-sans uppercase tracking-widest text-emerald-deep/60 mt-2 font-medium">
              {language === 'en' ? 'Founder & Lead Artist' : 'প্রতিষ্ঠাতা এবং প্রধান শিল্পী'}
            </p>
          </div>

          <p className="text-lg text-emerald-deep/80 font-light leading-relaxed max-w-2xl">
            {t('about.desc1')}
          </p>
          <p className="text-lg text-emerald-deep/80 font-light leading-relaxed max-w-2xl">
            {t('about.desc2')}
          </p>

          <div className="flex flex-wrap justify-center lg:justify-start gap-4 pt-4">
            <a 
              href="https://www.facebook.com/bodhuseje.brishtymou"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-6 py-3.5 bg-blue-600 hover:bg-blue-700 text-white rounded-full font-sans font-medium text-sm transition-all duration-300 shadow-lg hover:shadow-blue-600/20 hover:-translate-y-0.5"
              id="facebook-connect-btn"
            >
              <Facebook size={18} />
              <span>Facebook ID</span>
            </a>
            
            <a 
              href="https://wa.me/8801830896222"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-6 py-3.5 bg-[#25D366] hover:bg-[#20ba5a] text-white rounded-full font-sans font-medium text-sm transition-all duration-300 shadow-lg hover:shadow-green-500/20 hover:-translate-y-0.5"
              id="whatsapp-connect-btn"
            >
              <MessageCircle size={18} />
              <span>+880 1830-896222</span>
            </a>
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, x: 50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1 }}
          className="flex-[0.9] relative w-full max-w-md lg:max-w-none"
        >
          <div className="relative z-10 aspect-[3/4] rounded-[2.5rem] overflow-hidden shadow-2xl border-4 border-white">
            <img 
              src={imageUrl || "/assets/images/brishty_mou_ref_portrait_1779846203677.png"} 
              alt="Brishty Möû" 
              loading="lazy"
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
            />
          </div>
          <div className="absolute -top-12 -right-12 w-64 h-64 bg-rose-gold/10 rounded-full blur-3xl" />
          <div className="absolute -bottom-12 -left-12 w-64 h-64 bg-emerald-deep/5 rounded-full blur-3xl" />
        </motion.div>
      </div>
    </section>
  );
}

