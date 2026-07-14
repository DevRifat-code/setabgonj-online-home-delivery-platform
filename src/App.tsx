import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import ProductCard from './components/ProductCard';
import Lightbox from './components/Lightbox';
import CheckoutModal from './components/CheckoutModal';
import Footer from './components/Footer';
import WorkGallery from './components/WorkGallery';
import MehadiGallery from './components/MehadiGallery';
import About from './components/About';
import Account from './components/Account';
import ScrollToTop from './components/ScrollToTop';
import PrivacyPolicy from './components/PrivacyPolicy';
import TermsOfService from './components/TermsOfService';
import LandingSkeleton from './components/LandingSkeleton';
import Helmet from './components/Helmet';
import { getSupabase } from './lib/supabase';
import { useLanguage } from './lib/LanguageContext';
import { Calendar } from 'lucide-react';

// Image paths from list_dir
const IMAGES = {
  hero: '/assets/images/henna_hero_banner_1778986342690.png',
  cones: '/assets/images/organic_henna_cones_1778986359766.png',
  jewelry: '/assets/images/floral_jewelry_display_1778986376041.png',
  tailoring: '/assets/images/tailoring_studio_1778986392437.png',
  bridal: '/assets/images/bridal_art_card_1778986446990.png',
};

const PRODUCTS = [
  {
    title: 'Organic Henna Cones',
    category: 'Botanical Beauty',
    image: IMAGES.cones,
    price: '150 TK',
    type: 'product',
  },
  {
    title: 'Bridal Henna Art',
    category: 'Luxe Booking',
    image: IMAGES.bridal,
    price: '3000 TK',
    type: 'booking',
  },
  {
    title: 'Handcrafted Floral Jewelry',
    category: 'Artisanal Accessory',
    image: IMAGES.jewelry,
    price: '1200 TK',
    type: 'product',
  },
  {
    title: 'Bespoke Tailoring',
    category: 'Custom Design',
    image: IMAGES.tailoring,
    price: '800 TK',
    type: 'booking',
  },
];

export default function App() {
  const { t } = useLanguage();
  const [selectedProduct, setSelectedProduct] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [isProductLightboxOpen, setIsProductLightboxOpen] = useState(false);
  const [activeProductIndex, setActiveProductIndex] = useState(0);
  const [view, setView] = useState<'home' | 'account' | 'privacy' | 'terms'>(() => {
    if (typeof window !== 'undefined') {
      const hash = window.location.hash;
      const path = window.location.pathname;
      const params = new URLSearchParams(window.location.search);
      
      if (hash === '#privacy' || path.endsWith('/privacy') || params.get('view') === 'privacy') return 'privacy';
      if (hash === '#terms' || path.endsWith('/terms') || params.get('view') === 'terms') return 'terms';
      if (hash === '#account' || path.endsWith('/account') || params.get('view') === 'account') return 'account';
    }
    return 'home';
  });

  // Synchronize view state changes with URL hash
  useEffect(() => {
    if (view === 'home') {
      if (window.location.hash && !window.location.hash.includes('access_token=') && !window.location.hash.includes('code=')) {
        window.history.pushState(null, '', window.location.pathname + window.location.search);
      }
    } else {
      window.location.hash = view;
    }
  }, [view]);

  // Handle browser hash navigation changed by user
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash;
      if (hash === '#privacy') setView('privacy');
      else if (hash === '#terms') setView('terms');
      else if (hash === '#account') setView('account');
      else if (!hash.includes('access_token=') && !hash.includes('code=')) setView('home');
    };
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);
  const [services, setServices] = useState<any[]>(PRODUCTS);
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    if (typeof window !== 'undefined') {
      return (localStorage.getItem('theme') as 'light' | 'dark') || 'light';
    }
    return 'light';
  });

  useEffect(() => {
    const root = window.document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    localStorage.setItem('theme', theme);
  }, [theme]);

  // Check if we are inside an OAuth redirect popup window
  useEffect(() => {
    if (typeof window !== 'undefined' && window.opener) {
      const hash = window.location.hash;
      const search = window.location.search;
      const hasAuthToken = hash.includes('access_token=') || search.includes('code=');
      if (hasAuthToken) {
        try {
          window.opener.postMessage({
            type: 'SUPABASE_OAUTH_SUCCESS',
            hash,
            search,
            href: window.location.href
          }, '*');
          // Close this popup window quickly
          setTimeout(() => {
            window.close();
          }, 1000);
        } catch (e) {
          console.error('Error sending OAuth message to parent window:', e);
        }
      }
    }
  }, []);
  const [siteConfig, setSiteConfig] = useState({
    site_name: "Setabgonj Online Home Delivery",
    logo_url: "",
    hero_title: "The Art of Natural Henna",
    hero_subtitle: "Handcrafted organic henna cones and custom bridal designs for your most precious moments.",
    contact_email: "hello@brishtys.com",
    contact_phone: "+880 1830-896222",
    hero_image_url: "",
    about_image_url: "",
    booking_image_url: "",
    social_instagram: "",
    social_facebook: ""
  });

  const getTranslatedProductTitle = (title: string) => {
    if (title === 'Organic Henna Cones') return t('Organic Henna Cones');
    if (title === 'Bridal Henna Art') return t('Bridal Henna Art');
    if (title === 'Handcrafted Floral Jewelry') return t('Handcrafted Floral Jewelry');
    if (title === 'Bespoke Tailoring') return t('Bespoke Tailoring');
    return title;
  };


  useEffect(() => {
    const fetchData = async () => {
      try {
        const client = getSupabase();
        
        // Fetch Site Config
        const { data: configData } = await client
          .from('site_config')
          .select('*')
          .single();
        if (configData) {
          setSiteConfig({
            site_name: configData.site_name,
            logo_url: configData.logo_url || "",
            hero_title: configData.hero_title,
            hero_subtitle: configData.hero_subtitle,
            contact_email: configData.contact_email,
            contact_phone: configData.contact_phone,
            hero_image_url: configData.hero_image_url || "",
            about_image_url: configData.about_image_url || "",
            booking_image_url: configData.booking_image_url || "",
            social_instagram: configData.social_instagram || "",
            social_facebook: configData.social_facebook || ""
          });
        }

        // Fetch Dynamic Services
        const { data: servicesData } = await client
          .from('services')
          .select('*')
          .order('created_at', { ascending: true });

        const getServiceDefaultPrice = (title: string) => {
          const tLower = title.toLowerCase();
          if (tLower.includes('cone')) return '150 TK';
          if (tLower.includes('bridal')) return '3000 TK';
          if (tLower.includes('floral') || tLower.includes('jewelry')) return '1200 TK';
          if (tLower.includes('tailoring')) return '800 TK';
          return '500 TK';
        };

        const getServiceDefaultType = (title: string): 'product' | 'booking' => {
          const tLower = title.toLowerCase();
          if (tLower.includes('bridal') || tLower.includes('tailoring') || tLower.includes('booking') || tLower.includes('art')) {
            return 'booking';
          }
          return 'product';
        };

        if (servicesData && servicesData.length > 0) {
          setServices(servicesData.map(s => ({
            id: s.id,
            title: s.title,
            category: s.category,
            image: s.image_url,
            price: s.price !== undefined && s.price !== null && s.price !== '' ? s.price : getServiceDefaultPrice(s.title),
            type: s.type !== undefined && s.type !== null && s.type !== '' ? s.type : getServiceDefaultType(s.title),
          })));
        }
      } catch (err) {
        console.error('Error fetching data from Supabase:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const LandingPage = () => {
    // Dynamic translations if still using the defaults
    const finalHeroTitle = siteConfig.hero_title === "The Art of Natural Henna" 
      ? t('hero.title') 
      : siteConfig.hero_title;
    const finalHeroSubtitle = siteConfig.hero_subtitle === "Handcrafted organic henna cones and custom bridal designs for your most precious moments." 
      ? t('hero.subtitle') 
      : siteConfig.hero_subtitle;

    return (
      <>
        <Hero 
          imagePath={siteConfig.hero_image_url || IMAGES.hero} 
          title={finalHeroTitle}
          subtitle={finalHeroSubtitle}
        />

        <motion.section 
          id="products" 
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="py-32 px-6"
        >
          <div className="max-w-7xl mx-auto">
            <div className="mb-20 text-center">
              <span className="font-sans text-xs uppercase tracking-[0.4em] text-rose-gold font-bold mb-4 block">
                {t('collection.curated')}
              </span>
              <h2 className="font-serif text-5xl md:text-7xl font-light text-emerald-deep tracking-tight">
                {t('collection.title_our')} <span className="italic">{t('collection.title_col')}</span>
              </h2>
              <div className="w-24 h-[1px] bg-rose-gold mx-auto mt-6" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {services.map((product, index) => {
                // Determine if item or category has customized terms or fallback to static mapping
                const displayTitle = getTranslatedProductTitle(product.title);
                const displayCategory = product.category === 'Botanical Beauty' ? t('collection.curated') : product.category;
                
                return (
                  <ProductCard
                    key={product.id || product.title}
                    index={index}
                    title={displayTitle}
                    category={displayCategory}
                    image={product.image}
                    price={product.price}
                    type={product.type}
                    onOrder={() => setSelectedProduct(product.title)}
                    onZoom={() => {
                      setActiveProductIndex(index);
                      setIsProductLightboxOpen(true);
                    }}
                  />
                );
              })}
            </div>

            {/* Product Lightbox Overlay */}
            <Lightbox
              isOpen={isProductLightboxOpen}
              onClose={() => setIsProductLightboxOpen(false)}
              images={services.map(s => ({
                src: s.image,
                title: `${getTranslatedProductTitle(s.title)} - ${s.price || ''}`
              }))}
              currentIndex={activeProductIndex}
              setCurrentIndex={setActiveProductIndex}
            />
          </div>
        </motion.section>

        <WorkGallery />
        
        <MehadiGallery />

        <motion.section 
          id="booking" 
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="py-32 px-6 bg-warm-beige"
        >
          <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-16">
            <div className="flex-1">
              <div className="relative aspect-square max-w-lg mx-auto">
                <img
                  src={siteConfig.booking_image_url || IMAGES.bridal}
                  alt="Bridal Art"
                  className="w-full h-full object-cover rounded-[3rem] shadow-2xl"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute -bottom-8 -right-8 w-48 h-48 rounded-full border-4 border-white shadow-xl overflow-hidden glass p-4 flex items-center justify-center text-center">
                  <span className="font-serif text-xl italic text-emerald-deep">{t('bridal.badge')}</span>
                </div>
              </div>
            </div>
            
            <div className="flex-1 space-y-8">
              <span className="font-sans text-xs uppercase tracking-[0.4em] text-rose-gold font-bold block">
                {t('bridal.tag')}
              </span>
              <h2 className="font-serif text-5xl md:text-6xl text-emerald-deep leading-tight">
                {t('bridal.title_part1')} <br />
                {t('bridal.title_part2')} <span className="italic">{t('bridal.title_part3')}</span>
              </h2>
              <p className="text-lg text-emerald-deep/70 font-light leading-relaxed">
                {t('bridal.desc')}
              </p>
              <div className="pt-4">
                <button 
                  onClick={() => setSelectedProduct('Bridal Henna Art')}
                  className="px-12 py-5 bg-emerald-deep text-white hover:bg-rose-gold hover:text-emerald-deep rounded-full font-bold transition-all duration-500 shadow-xl inline-flex items-center gap-3 group"
                >
                  <Calendar size={20} className="transition-transform duration-500 group-hover:scale-110" />
                  <span>{t('bridal.btn')}</span>
                </button>
              </div>
            </div>
          </div>
        </motion.section>

        <About imageUrl={siteConfig.about_image_url} />
      </>
    );
  };

  // Determine SEO title and description dynamically
  const getSEOMetadata = () => {
    switch (view) {
      case 'home':
        return {
          title: siteConfig.site_name === "Setabgonj Online Home Delivery"
            ? `${t('hero.title')} | ${siteConfig.site_name}`
            : `${siteConfig.site_name} - ${siteConfig.hero_title}`,
          description: siteConfig.hero_subtitle,
        };
      case 'account':
        return {
          title: `${t('nav.account')} | ${siteConfig.site_name}`,
          description: t('account.desc') || 'Boutique Admin Gateway to manage bookings, products, services, and dynamic styles.',
        };
      case 'privacy':
        return {
          title: `Privacy Policy | ${siteConfig.site_name}`,
          description: 'Complete privacy statement covering personal information handling and organic inquiry order records.',
        };
      case 'terms':
        return {
          title: `Terms of Service | ${siteConfig.site_name}`,
          description: 'Official Terms of Service covering service booking conditions, organic henna deliveries, and agreements.',
        };
      default:
        return {
          title: siteConfig.site_name,
          description: siteConfig.hero_subtitle,
        };
    }
  };

  const { title: seoTitle, description: seoDescription } = getSEOMetadata();

  return (
    <motion.div 
      key={theme}
      initial={{ opacity: 0.9 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className="min-h-screen relative"
    >
      <Helmet title={seoTitle} description={seoDescription} />
      <Navbar 
        setView={setView} 
        currentView={view} 
        siteName={siteConfig.site_name} 
        logoUrl={siteConfig.logo_url} 
        theme={theme}
        onToggleTheme={() => setTheme(prev => prev === 'light' ? 'dark' : 'light')}
      />
      
      {view === 'home' ? (
        loading ? (
          <LandingSkeleton />
        ) : (
          <LandingPage />
        )
      ) : view === 'account' ? (
        <Account />
      ) : view === 'privacy' ? (
        <PrivacyPolicy onBack={() => setView('home')} />
      ) : (
        <TermsOfService onBack={() => setView('home')} />
      )}

      <Footer 
        siteName={siteConfig.site_name} 
        logoUrl={siteConfig.logo_url} 
        setView={setView} 
        socialInstagram={siteConfig.social_instagram}
        socialFacebook={siteConfig.social_facebook}
        contactEmail={siteConfig.contact_email}
        contactPhone={siteConfig.contact_phone}
      />

      {(() => {
        const activeSvc = services.find(s => s.title === selectedProduct);
        const activeType = activeSvc?.type || (selectedProduct?.toLowerCase().includes('booking') || selectedProduct?.toLowerCase().includes('bridal') ? 'booking' : 'product');
        const activePrice = activeSvc?.price || '';

        return (
          <CheckoutModal
            isOpen={!!selectedProduct}
            onClose={() => setSelectedProduct(null)}
            productName={selectedProduct || ''}
            productType={activeType}
            productPrice={activePrice}
          />
        );
      })()}

      <ScrollToTop />
    </motion.div>
  );
}
