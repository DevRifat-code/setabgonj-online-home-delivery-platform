import React, { useState } from 'react';
import { MapPin, Phone, Instagram, Facebook, Mail, ArrowUp, Send, CheckCircle } from 'lucide-react';
import { useLanguage } from '../lib/LanguageContext';
import defaultLogo from '../assets/images/logo.png';

interface FooterProps {
  siteName?: string;
  logoUrl?: string;
  setView?: (view: 'home' | 'account' | 'privacy' | 'terms') => void;
}

export default function Footer({ siteName, logoUrl, setView }: FooterProps) {
  const [imageError, setImageError] = useState(false);
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);
  const { language, t } = useLanguage();

  const logoSrc = logoUrl || defaultLogo;

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      setSubscribed(true);
      setTimeout(() => {
        setSubscribed(false);
        setEmail('');
      }, 5000);
    }
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="relative bg-emerald-deep text-white overflow-hidden pt-24 pb-12 px-6 lg:px-12 border-t border-rose-gold/20 font-sans">
      {/* Decorative subtle ambient lights */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-rose-gold/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 right-10 w-80 h-80 bg-white/5 rounded-full blur-[100px] pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 pb-16 border-b border-white/10">
          
          {/* Column 1: Brand & Bio */}
          <div className="lg:col-span-5 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center gap-4">
              {logoSrc && !imageError ? (
                <div 
                  onClick={scrollToTop}
                  className="cursor-pointer inline-flex p-2 bg-white/5 border border-white/10 rounded-[1.25rem] hover:border-rose-gold/40 transition-all duration-300"
                >
                  <img 
                    id="site-footer-logo"
                    src={logoSrc} 
                    alt={siteName || "Setabgonj Online Home Delivery"} 
                    className="h-14 w-auto object-contain max-w-[180px]"
                    referrerPolicy="no-referrer"
                    onError={() => setImageError(true)}
                  />
                </div>
              ) : (
                <span 
                  onClick={scrollToTop}
                  className="font-serif text-3xl font-bold tracking-tight text-white cursor-pointer hover:text-rose-gold transition-colors duration-300"
                >
                  {siteName || "Setabgonj Online Home Delivery"}
                </span>
              )}
              
              <div className="flex flex-col justify-center">
                <span className="font-sans text-[10px] uppercase tracking-[0.35em] text-rose-gold font-black">
                  {language === 'bn' ? 'মেহেদি ও ফ্যাশন' : 'Henna & Hue'}
                </span>
                <span className="text-[11px] text-white/40 font-mono mt-0.5">ESTD 2024</span>
              </div>
            </div>

            <p className="text-white/70 text-base md:text-lg max-w-md leading-relaxed font-light">
              {t('footer.tagline')}
            </p>

            {/* Rich Contacts Mini-Boxes */}
            <div className="pt-4 space-y-4">
              <a 
                href="tel:+8801830896222" 
                className="group flex items-center gap-4 p-4 bg-white/[0.03] border border-white/5 hover:border-rose-gold/30 hover:bg-white/[0.06] rounded-2xl transition-all duration-300 w-full max-w-sm"
              >
                <div className="p-3 bg-rose-gold/10 group-hover:bg-rose-gold/20 rounded-xl text-rose-gold transition-colors duration-300">
                  <Phone size={18} />
                </div>
                <div>
                  <span className="block text-[9px] uppercase tracking-wider text-white/40 font-bold mb-0.5">
                    {language === 'bn' ? 'সরাসরি কল করুন' : 'Call Directly'}
                  </span>
                  <span className="text-base font-semibold group-hover:text-rose-gold transition-colors block">
                    +880 1830-896222
                  </span>
                </div>
              </a>

              <div className="flex items-start gap-4 p-4 bg-white/[0.03] border border-white/5 rounded-2xl w-full max-w-sm">
                <div className="p-3 bg-rose-gold/10 rounded-xl text-rose-gold">
                  <MapPin size={18} />
                </div>
                <div>
                  <span className="block text-[9px] uppercase tracking-wider text-white/40 font-bold mb-0.5">
                    {language === 'bn' ? 'আমাদের গন্তব্য' : 'Our Destination'}
                  </span>
                  <p className="text-sm text-white/85 leading-relaxed font-light">
                    {language === 'bn' ? (
                      'সেতাবগঞ্জ বাস স্ট্যান্ড থেকে ধান্তলা ঝাড়বাড়ি, বোচাগঞ্জ, দিনাজপুর, বাংলাদেশ।'
                    ) : (
                      'Setabganj Bus Stand to Dhantala Jharbari, Bochaganj, Dinajpur, Bangladesh.'
                    )}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Column 2: Elegant Navigation & Quick Links */}
          <div className="lg:col-span-3 space-y-6 lg:pl-4">
            <h4 className="font-serif text-xl font-medium tracking-wide text-white border-b border-rose-gold/20 pb-2 inline-block">
              {t('footer.links')}
            </h4>
            
            <ul className="space-y-3.5">
              {[
                { label: language === 'bn' ? 'মূল পাতা' : 'Home', action: () => { setView?.('home'); scrollToTop(); } },
                { label: language === 'bn' ? 'সেবাসমূহ' : 'Our Services', hash: 'products' },
                { label: language === 'bn' ? 'কাজের পোর্টফলিও' : 'Our Portfolio', hash: 'work-photo-gallery' },
                { label: language === 'bn' ? 'মেহেদি ডিজাইন লাইব্রেরি' : 'Design Library', hash: 'mehadi-design-gallery' },
                { label: language === 'bn' ? 'ব্রাইডাল বুকিং' : 'Bridal Booking', hash: 'booking' },
                { label: language === 'bn' ? 'পরিচিতি পাতা' : 'About Developer', hash: 'about' }
              ].map((link, idx) => {
                const handleClick = (e: React.MouseEvent) => {
                  if (link.action) {
                    link.action();
                  } else if (link.hash) {
                    e.preventDefault();
                    setView?.('home');
                    setTimeout(() => {
                      const el = document.getElementById(link.hash || '');
                      if (el) el.scrollIntoView({ behavior: 'smooth' });
                    }, 100);
                  }
                };

                return (
                  <li key={idx}>
                    <button
                      type="button"
                      onClick={handleClick}
                      className="text-white/60 hover:text-rose-gold text-sm font-medium flex items-center gap-2 group transition-all duration-300 bg-transparent border-none p-0 outline-none cursor-pointer"
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-rose-gold/40 group-hover:bg-rose-gold group-hover:scale-125 transition-all duration-300" />
                      <span className="group-hover:translate-x-1.5 transition-transform duration-300">
                        {link.label}
                      </span>
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>

          {/* Column 3: Redesigned Newsletter, Social & Connect Hub */}
          <div className="lg:col-span-4 space-y-6">
            <h4 className="font-serif text-xl font-medium tracking-wide text-white border-b border-rose-gold/20 pb-2 inline-block">
              {language === 'bn' ? 'যুক্ত থাকুন' : 'Stay Connected'}
            </h4>
            
            <p className="text-sm text-white/60 font-light leading-relaxed">
              {language === 'bn' 
                ? 'নতুন অফার, এক্সক্লুসিভ মেহেদি ডিজাইন এবং বুকিংয়ের বিশেষ সুযোগগুলো সবার আগে জিমেইলে পেতে সাবস্ক্রাইব করুন।' 
                : 'Subscribe to receive personalized henna package collections, special event offers, and update notifications.'}
            </p>

            {/* Premium Subscribe Box */}
            <form onSubmit={handleSubscribe} className="relative group">
              <div className="relative overflow-hidden rounded-2xl bg-white/[0.03] border border-white/10 group-focus-within:border-rose-gold/50 transition-all duration-300 p-1 flex">
                <input 
                  type="email" 
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={language === 'bn' ? 'আপনার ইমেইল অ্যাড্রেস...' : 'Enter your email...'} 
                  className="bg-transparent border-none text-white text-sm focus:outline-none focus:ring-0 px-4 py-3 flex-1 font-light placeholder-white/30"
                />
                <button 
                  type="submit"
                  className="bg-rose-gold hover:bg-rose-gold/80 hover:scale-105 active:scale-95 text-emerald-deep font-bold rounded-xl px-5 flex items-center justify-center gap-2 transition-all duration-300"
                >
                  <Send size={15} />
                  <span className="text-xs uppercase tracking-wider hidden sm:inline">
                    {language === 'bn' ? 'সাবস্ক্রাইব' : 'Join'}
                  </span>
                </button>
              </div>
              
              {subscribed && (
                <div className="absolute -bottom-7 left-1 right-1 text-[11px] text-rose-gold font-medium flex items-center gap-1.5 animate-fadeIn">
                  <CheckCircle size={12} className="text-rose-gold" />
                  <span>
                    {language === 'bn' ? 'ধন্যবাদ! সফলভাবে সাবস্ক্রাইব হয়েছে।' : 'Thank you for subscribing! Your email is verified.'}
                  </span>
                </div>
              )}
            </form>

            {/* Clean, Grid Social Networking Links */}
            <div className="pt-3">
            <span className="block text-[10px] uppercase tracking-widest text-white/40 font-bold mb-3">
              {language === 'bn' ? 'সামাজিক যোগাযোগ' : 'Social Platforms'}
            </span>
            <div className="flex gap-3">
              <a 
                href="https://facebook.com/brishtymou" 
                target="_blank" 
                rel="noreferrer" 
                className="p-3 bg-white/[0.04] border border-white/5 hover:border-[#1877F2]/50 hover:bg-[#1877F2]/10 hover:text-[#1877F2] rounded-xl transition-all duration-300 text-white/80"
                aria-label="Facebook"
              >
                <Facebook size={20} />
              </a>
              <a 
                href="https://instagram.com" 
                target="_blank" 
                rel="noreferrer" 
                className="p-3 bg-white/[0.04] border border-white/5 hover:border-[#E1306C]/50 hover:bg-[#E1306C]/10 hover:text-[#E1306C] rounded-xl transition-all duration-300 text-white/80"
                aria-label="Instagram"
              >
                <Instagram size={20} />
              </a>
              <a 
                href="mailto:hello@brishtys.com" 
                className="p-3 bg-white/[0.04] border border-white/5 hover:border-rose-gold/50 hover:bg-rose-gold/10 hover:text-rose-gold rounded-xl transition-all duration-300 text-white/80"
                aria-label="Email"
              >
                  <Mail size={20} />
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar: Copyright and Extra Links */}
        <div className="mt-12 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="text-center md:text-left space-y-1">
            <p className="text-xs text-white/40 font-light">
              &copy; {new Date().getFullYear()} {siteName || "Setabgonj Online Home Delivery"}. {t('footer.rights')}
            </p>
            <p className="text-[10px] text-white/20 uppercase tracking-widest font-mono">
              Designed for Organic Premium Henna Artistry
            </p>
          </div>

          <div className="flex items-center gap-6">
            <div className="flex gap-6 text-[10px] uppercase tracking-widest text-white/50 font-bold">
              <button 
                type="button"
                onClick={() => { setView?.('privacy'); scrollToTop(); }}
                className="hover:text-rose-gold transition-colors cursor-pointer bg-transparent border-none p-0 outline-none"
              >
                {language === 'bn' ? 'গোপনীয়তা নীতি' : 'Privacy Policy'}
              </button>
              <button 
                type="button"
                onClick={() => { setView?.('terms'); scrollToTop(); }}
                className="hover:text-rose-gold transition-colors cursor-pointer bg-transparent border-none p-0 outline-none"
              >
                {language === 'bn' ? 'ব্যবহারের শর্তাবলী' : 'Terms of Service'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
