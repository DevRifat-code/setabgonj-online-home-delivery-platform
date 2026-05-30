import { motion, AnimatePresence } from 'motion/react';
import { ShoppingBag, Menu, X, Globe, Sun, Moon, Home, Sparkles, Image, Heart, Calendar, BookOpen, User } from 'lucide-react';
import { useState } from 'react';
import { useLanguage } from '../lib/LanguageContext';
import defaultLogo from '../assets/images/logo.png';

interface NavbarProps {
  setView: (view: 'home' | 'account' | 'privacy' | 'terms') => void;
  currentView: 'home' | 'account' | 'privacy' | 'terms';
  siteName?: string;
  logoUrl?: string;
  theme: 'light' | 'dark';
  onToggleTheme: () => void;
}

export default function Navbar({ setView, currentView, siteName, logoUrl, theme, onToggleTheme }: NavbarProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [showCartInfo, setShowCartInfo] = useState(false);
  const { language, setLanguage, t } = useLanguage();
  
  const logoSrc = logoUrl || defaultLogo;

  const NAV_ITEMS = [
    { id: 'Home', tKey: 'nav.home' },
    { id: 'Products', tKey: 'nav.products' },
    { id: 'Work Photo Gallery', tKey: 'nav.work_gallery' },
    { id: 'Mehadi Design Gallery', tKey: 'nav.mehadi_gallery' },
    { id: 'Booking', tKey: 'nav.booking' },
    { id: 'About', tKey: 'nav.about' },
    { id: 'Account', tKey: 'nav.account' }
  ];

  const getNavItemIcon = (id: string) => {
    switch (id) {
      case 'Home': return <Home size={18} />;
      case 'Products': return <Sparkles size={18} />;
      case 'Work Photo Gallery': return <Image size={18} />;
      case 'Mehadi Design Gallery': return <Heart size={18} />;
      case 'Booking': return <Calendar size={18} />;
      case 'About': return <BookOpen size={18} />;
      case 'Account': return <User size={18} />;
      default: return <Sparkles size={18} />;
    }
  };

  const handleNavClick = (itemId: string) => {
    if (itemId === 'Account') {
      setView('account');
    } else {
      setView('home');
      // Delay to allow view switch if needed, though hash links usually work fine
      setTimeout(() => {
        const id = itemId.toLowerCase().replace(/\s+/g, '-');
        const element = document.getElementById(id);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        } else {
          window.location.hash = id;
        }
      }, 0);
    }
    setIsOpen(false);
  };

  return (
    <nav role="navigation" aria-label="Main Navigation" className="fixed top-0 left-0 right-0 z-50 px-6 py-4">
      <div className="max-w-7xl mx-auto flex items-center justify-between glass rounded-full px-8 py-3 shadow-sm">
        <div 
          className="flex items-center gap-3 cursor-pointer" 
          onClick={() => setView('home')}
        >
          {logoSrc && !imageError ? (
            <img 
              id="site-navbar-logo"
              src={logoSrc} 
              alt={siteName || "Setabgonj Online Home Delivery"} 
              className="h-10 w-auto object-contain max-w-[140px] rounded"
              referrerPolicy="no-referrer"
              onError={() => setImageError(true)}
            />
          ) : (
            <span className="font-serif text-sm sm:text-base md:text-2xl font-bold tracking-tight text-emerald-deep max-w-[150px] sm:max-w-none truncate sm:overflow-visible">
              {siteName || "Setabgonj Online Home Delivery"}
            </span>
          )}
          <span className="font-sans text-xs uppercase tracking-[0.3em] mt-1 text-rose-gold font-semibold hidden md:inline-block">
            {language === 'bn' ? 'মেহেদি ও ফ্যাশন' : 'Henna & Hue'}
          </span>
        </div>
        
        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-6 lg:gap-8">
          {NAV_ITEMS.map((item) => (
            <button
              key={item.id}
              onClick={() => handleNavClick(item.id)}
              className={`text-[13px] lg:text-sm font-medium transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-rose-gold rounded-lg px-2 py-1 ${
                (item.id === 'Account' && currentView === 'account') || (item.id === 'Home' && currentView === 'home') 
                  ? 'text-rose-gold underline flex items-center' 
                  : 'text-emerald-deep hover:text-rose-gold'
              }`}
            >
              {t(item.tKey)}
            </button>
          ))}

          {/* BN/EN Selector */}
          <div className="flex bg-emerald-deep/5 p-0.5 rounded-full items-center border border-emerald-deep/5">
            <button
              type="button"
              onClick={() => setLanguage('en')}
              className={`text-[11px] font-bold px-2.5 py-1 rounded-full transition-all ${
                language === 'en' 
                  ? 'bg-emerald-deep text-white shadow-sm' 
                  : 'text-emerald-deep/60 hover:text-emerald-deep'
              }`}
            >
              EN
            </button>
            <button
              type="button"
              onClick={() => setLanguage('bn')}
              className={`text-[11px] font-bold px-2.5 py-1 rounded-full transition-all ${
                language === 'bn' 
                  ? 'bg-emerald-deep text-white shadow-sm' 
                  : 'text-emerald-deep/60 hover:text-emerald-deep'
              }`}
            >
              বাংলা
            </button>
          </div>

          {/* Theme Toggle (Desktop) */}
          <button
            type="button"
            onClick={onToggleTheme}
            title={theme === 'dark' ? "Switch to Light Mode" : "Switch to Dark Mode"}
            className="p-2 text-emerald-deep hover:text-rose-gold rounded-full bg-emerald-deep/5 hover:bg-emerald-deep/10 transition-all focus:outline-none focus:ring-2 focus:ring-rose-gold cursor-pointer"
          >
            {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
          </button>

          <button 
            type="button"
            onClick={() => setShowCartInfo(true)}
            aria-label={t('nav.cart')}
            className="bg-emerald-deep text-white p-2 rounded-full hover:bg-rose-gold transition-colors duration-500 focus:outline-none focus:ring-2 focus:ring-rose-gold cursor-pointer"
          >
            <ShoppingBag size={18} />
          </button>
        </div>

        {/* Mobile Toggle & Harmonious Quick Actions Control Menu */}
        <div className="flex items-center gap-1.5 bg-emerald-deep/5 dark:bg-emerald-deep/10 p-1.5 rounded-full border border-emerald-deep/5 shadow-sm md:hidden">
          {/* BN/EN Quick Selector for Mobile */}
          <button
            onClick={() => setLanguage(language === 'en' ? 'bn' : 'en')}
            className="text-[10px] font-bold text-emerald-deep dark:text-rose-gold px-2.5 py-1 rounded-full hover:bg-emerald-deep/5 active:scale-95 transition-all flex items-center gap-1 cursor-pointer"
          >
            <Globe size={11} className="text-emerald-deep/60 dark:text-rose-gold/60" />
            <span>{language === 'en' ? 'বাংলা' : 'EN'}</span>
          </button>

          {/* Theme Toggle (Mobile) */}
          <button
            onClick={onToggleTheme}
            aria-label="Toggle Dark Mode"
            className="p-1.5 text-emerald-deep dark:text-white rounded-full hover:bg-emerald-deep/5 active:scale-95 transition-all flex items-center justify-center cursor-pointer"
          >
            {theme === 'dark' ? <Sun size={13} /> : <Moon size={13} />}
          </button>

          {/* Quick Shopping Guide Popover Button for Mobile */}
          <button 
            type="button"
            onClick={() => setShowCartInfo(true)}
            aria-label={t('nav.cart')}
            className="bg-emerald-deep text-white p-1.5 rounded-full hover:bg-rose-gold active:scale-95 transition-all cursor-pointer flex items-center justify-center shadow-sm"
          >
            <ShoppingBag size={12} />
          </button>
        </div>
      </div>

      {/* Mobile Custom Bottom Menu (Drawer) Sheet - slides up above bottom bar */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            id="mobile-menu"
            initial={{ opacity: 0, scale: 0.95, y: 40 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 40 }}
            transition={{ type: 'spring', damping: 20, stiffness: 220 }}
            className="fixed bottom-[5.5rem] inset-x-4 z-40 bg-white/95 dark:bg-[#070D0A]/95 backdrop-blur-xl rounded-[2.5rem] p-6 flex flex-col gap-2 shadow-2xl border border-rose-gold/20 overflow-hidden"
          >
            {NAV_ITEMS.map((item, idx) => {
              const isActive = (item.id === 'Account' && currentView === 'account') || (item.id === 'Home' && currentView === 'home');
              return (
                <motion.button
                  key={item.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.03, duration: 0.2 }}
                  type="button"
                  onClick={() => handleNavClick(item.id)}
                  className={`flex items-center gap-3 text-sm font-medium py-2.5 px-3.5 rounded-2xl border transition-all text-left w-full cursor-pointer group ${
                    isActive 
                      ? 'bg-rose-gold/15 text-rose-gold font-semibold border-rose-gold/30 shadow-sm' 
                      : 'border-transparent text-emerald-deep hover:bg-emerald-deep/5 dark:hover:bg-emerald-deep/10'
                  }`}
                >
                  <div className={`p-1.5 rounded-lg transition-colors duration-300 ${
                    isActive 
                      ? 'bg-rose-gold/20 text-rose-gold' 
                      : 'bg-emerald-deep/5 text-emerald-deep/60 group-hover:text-rose-gold'
                  }`}>
                    {getNavItemIcon(item.id)}
                  </div>
                  <span className="flex-1 tracking-normal">{t(item.tKey)}</span>
                  {isActive ? (
                    <span className="w-1.5 h-1.5 rounded-full bg-rose-gold animate-pulse" />
                  ) : (
                    <span className="w-1 h-1 rounded-full bg-emerald-deep/15 opacity-0 group-hover:opacity-100 transition-opacity" />
                  )}
                </motion.button>
              );
            })}

            {/* Micro Details */}
            <div className="mt-2 pt-2.5 border-t border-emerald-deep/5 flex flex-col items-center justify-center gap-1">
              <span className="text-[8px] uppercase tracking-[0.25em] text-rose-gold font-extrabold">
                {language === 'bn' ? 'সেতাবগঞ্জ অনলাইন হোম ডেলিভারি' : 'Setabganj Online Booking'}
              </span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* NEW Custom Bottom Navigation Tab-Bar for Mobile View (Matches Reference Design Perfectly) */}
      <div className="fixed bottom-0 left-0 right-0 z-50 px-4 pb-4 md:hidden pointer-events-none flex justify-center">
        <div className="pointer-events-auto flex items-center justify-between w-full max-w-sm h-[3.8rem] relative">
          
          {/* Custom SVG Notch and Solid Background Segments */}
          {/* Left Side Pill (40% width to span index 0 and 1) */}
          <div className="absolute left-0 bottom-0 top-0 w-[40%] bg-[#0A110D] rounded-l-[1.75rem]" />
          
          {/* Middle Custom SVG Notch Curve (Centered at 40% to 60%) */}
          <svg viewBox="0 0 100 60" preserveAspectRatio="none" className="absolute bottom-0 left-[40%] w-[20%] h-full fill-[#0A110D] pointer-events-none">
            <path d="M 0 0 C 15 0, 20 8, 25 18 C 32 30, 68 30, 75 18 C 80 8, 85 0, 100 0 L 100 60 L 0 60 Z" />
          </svg>
          
          {/* Right Side Pill (40% width to span index 3 and 4) */}
          <div className="absolute left-[60%] right-0 bottom-0 top-0 bg-[#0A110D] rounded-r-[1.75rem]" />

          {/* Tab Bar Foreground Buttons */}
          <div className="absolute inset-0 flex items-center justify-between z-10 px-1">
            {/* Tab 1: Menu Toggle */}
            <button
              type="button"
              onClick={() => setIsOpen(!isOpen)}
              className={`w-[20%] h-full flex flex-col items-center justify-center pt-2.5 focus:outline-none transition-colors duration-300 group ${
                isOpen ? 'text-rose-gold font-semibold' : 'text-white/60 hover:text-white'
              }`}
            >
              <div className="transition-transform duration-300 group-hover:scale-110">
                {isOpen ? <X size={18} /> : <Menu size={18} />}
              </div>
              <span className="text-[9px] mt-1 font-medium select-none text-center">
                {language === 'bn' ? 'মেনু' : 'Menu'}
              </span>
            </button>

            {/* Tab 2: Designs (Mehadi Design Gallery) */}
            <button
              type="button"
              onClick={() => {
                setIsOpen(false);
                handleNavClick('Mehadi Design Gallery');
              }}
              className="w-[20%] h-full flex flex-col items-center justify-center pt-2.5 focus:outline-none transition-colors duration-300 group text-white/60 hover:text-white"
            >
              <div className="transition-transform duration-300 group-hover:scale-110">
                <Heart size={18} className="group-hover:text-rose-gold transition-colors" />
              </div>
              <span className="text-[9px] mt-1 font-medium select-none text-center">
                {language === 'bn' ? 'ডিজাইন' : 'Designs'}
              </span>
            </button>

            {/* Tab 3: Centered Floating Cutout Highlight Button (Booking Trigger) */}
            <div className="w-[20%] h-full relative flex items-center justify-center">
              <button
                type="button"
                onClick={() => {
                  setIsOpen(false);
                  handleNavClick('Booking');
                }}
                className="absolute -top-[1.2rem] w-[3.3rem] h-[3.3rem] bg-white text-neutral-950 rounded-full flex flex-col items-center justify-center shadow-[0_4px_14px_rgba(0,0,0,0.4)] active:scale-95 transition-all duration-300 cursor-pointer group hover:bg-rose-gold hover:text-white ring-4 ring-[#0A110D]/50"
                title={language === 'bn' ? 'বুকিং করুন' : 'Book Now'}
              >
                <Calendar size={16} className="text-neutral-900 group-hover:text-white group-hover:scale-110 transition-all duration-300" />
                <span className="text-[8px] font-black text-neutral-900 group-hover:text-white leading-none mt-1 tracking-tight uppercase select-none transition-all duration-300">
                  {language === 'bn' ? 'বুক' : 'Book'}
                </span>
              </button>
            </div>

            {/* Tab 4: Home */}
            <button
              type="button"
              onClick={() => {
                setIsOpen(false);
                setView('home');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className={`w-[20%] h-full flex flex-col items-center justify-center pt-2.5 focus:outline-none transition-colors duration-300 group ${
                currentView === 'home' && !isOpen ? 'text-rose-gold font-semibold' : 'text-white/60 hover:text-white'
              }`}
            >
              <div className="transition-transform duration-300 group-hover:scale-110">
                <Home size={18} />
              </div>
              <span className="text-[9px] mt-1 font-medium select-none text-center">
                {language === 'bn' ? 'হোম' : 'Home'}
              </span>
            </button>

            {/* Tab 5: Profile/Account */}
            <button
              type="button"
              onClick={() => {
                setIsOpen(false);
                handleNavClick('Account');
              }}
              className={`w-[20%] h-full flex flex-col items-center justify-center pt-2.5 focus:outline-none transition-colors duration-300 group ${
                currentView === 'account' ? 'text-rose-gold font-semibold' : 'text-white/60 hover:text-white'
              }`}
            >
              <div className="transition-transform duration-300 group-hover:scale-110">
                <User size={18} />
              </div>
              <span className="text-[9px] mt-1 font-medium select-none text-center">
                {language === 'bn' ? 'প্রোফাইল' : 'Profile'}
              </span>
            </button>
          </div>

        </div>
      </div>

      {/* Direct Order Fast-Track Information Popover */}
      <AnimatePresence>
        {showCartInfo && (
          <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowCartInfo(false)}
              className="fixed inset-0 bg-emerald-deep/40 backdrop-blur-sm"
            />
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 15 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 15 }}
              className="relative bg-soft-white p-8 md:p-10 rounded-[2.5rem] shadow-2xl w-full max-w-md z-10 text-emerald-deep space-y-6"
            >
              <button
                onClick={() => setShowCartInfo(false)}
                className="absolute top-6 right-6 p-1.5 hover:bg-emerald-deep/5 rounded-full transition-colors focus:outline-none"
                aria-label="Close message"
              >
                <X size={18} />
              </button>

              <div className="space-y-2">
                <span className="text-[10px] uppercase tracking-[0.3em] font-bold text-rose-gold block leading-none">
                  {language === 'bn' ? 'ফাস্ট-ট্র্যাক অর্ডার সুবিধা' : 'Frictionless Checkout'}
                </span>
                <h3 className="font-serif text-3xl font-light tracking-tight pb-2 border-b border-emerald-deep/5">
                  {language === 'bn' ? 'অর্ডার ও বুকিং নিয়মাবলী' : 'Shopping Cart Guideline'}
                </h3>
              </div>

              <p className="text-sm text-emerald-deep/75 leading-relaxed font-light">
                {language === 'bn' ? (
                  'সেতাবগঞ্জ অনলাইন হোম ডেলিভারি প্রতিটি অর্ডারের জন্য জটিল সিস্টেম বর্জন করে সরাসরি চেকআউট প্রক্রিয়া সমর্থন করে। আপনি যেকোনো পণ্য বা সেশন বুকিংয়ের জন্য "অর্ডার করুন" অথবা "বুকিং করুন" বাটনে ক্লিক করলে তা সরাসরি ডাটাবেজে সংরক্ষিত হবে এবং পরবর্তীতে এক ক্লিকেই সম্পূর্ণ অর্ডার বিবরণীসহ সরাসরি আমাদের অফিশিয়াল হোয়াটসঅ্যাপ লাইনে যুক্ত হতে পারবেন। এতে ডেলিভারি হয় ঝামেলাহীন এবং নিরাপদ!'
                ) : (
                  'Setabgonj Online Home Delivery handles active bookings and deliveries on a direct per-item basis. Clicking "Order Now" or "Book Slot" on any product instantly submits a digital request to our secure repository and generates a compiled inquiry for direct WhatsApp routing. Bypassing a complex multi-step cart makes booking and delivery instantaneous.'
                )}
              </p>

              <div className="pt-2">
                <button
                  onClick={() => setShowCartInfo(false)}
                  className="w-full py-4 bg-emerald-deep text-white font-bold rounded-2xl hover:bg-rose-gold transition-colors shadow-lg cursor-pointer text-center text-sm"
                >
                  {language === 'bn' ? 'ঠিক আছে, ধন্যবাদ' : 'Got it, Thank You'}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </nav>
  );
}

