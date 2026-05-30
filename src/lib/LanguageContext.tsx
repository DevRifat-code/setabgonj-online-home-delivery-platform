import React, { createContext, useContext, useState, useEffect } from 'react';

export type Language = 'en' | 'bn';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const translations: Record<Language, Record<string, string>> = {
  en: {
    // Navbar
    'nav.home': 'Home',
    'nav.products': 'Products',
    'nav.work_gallery': 'Portfolio Gallery',
    'nav.mehadi_gallery': 'Mehadi Designs',
    'nav.booking': 'Booking',
    'nav.about': 'About Us',
    'nav.contact': 'Contact',
    'nav.account': 'Account',
    'nav.cart': 'View Shopping Cart',

    // Hero Section
    'hero.title': "The Art of Natural Henna",
    'hero.subtitle': "Handcrafted organic henna cones and custom bridal designs for your most precious moments.",

    // Collection Section
    'collection.curated': 'Curated Services',
    'collection.title_our': 'Our',
    'collection.title_col': 'Collection',
    'collection.btn_order': 'Inquire / Order',
    'collection.btn_order_product': 'Order Now',
    'collection.btn_book_service': 'Book Now',
    'collection.price': 'Price',

    // Bridal / Booking Section
    'bridal.tag': 'Bridal Special',
    'bridal.title_part1': 'A Masterpiece',
    'bridal.title_part2': 'For Your',
    'bridal.title_part3': 'Big Day',
    'bridal.desc': 'Every stroke of ours tells a story. From traditional patterns to modern fusions, we ensure your bridal henna is as unique as your journey. Using only 100% organic henna for a rich, long-lasting stain.',
    'bridal.btn': 'Inquire for Availability',
    'bridal.badge': 'Trusted by 500+ Brides',

    // Portfolio Section
    'portfolio.tag': 'Portfolio',
    'portfolio.title_recent': 'Our',
    'portfolio.title_work': 'Recent Work',

    // Mehadi Gallery Section
    'mehadi.tag': 'Artistry',
    'mehadi.title_library': 'Mehadi Design Library',

    // About Section
    'about.story': 'Our Story',
    'about.title_essence': 'The Essence of',
    'about.title_craft': "Brishty's Craft",
    'about.desc1': "Founded with a passion for natural beauty and traditional craftsmanship, Brishty's Henna & Hue is more than just a boutique. We are curators of elegance, blending the ancient art of henna with modern bespoke tailoring and artisanal jewelry.",
    'about.desc2': 'Every product we create and every service we provide is rooted in our commitment to quality, authenticity, and the celebration of individuality.',

    // Contact Section
    'contact.connection': 'Connection',
    'contact.get_in_touch': 'Get in Touch',
    'contact.email': 'Email',
    'contact.phone': 'Phone',
    'contact.studio': 'Studio',
    'contact.studio_val': 'Dhanmondi, Dhaka, Bangladesh',
    'contact.full_name': 'Full Name',
    'contact.message': 'Message',
    'contact.placeholder_name': 'Ex. Sarah Kabir',
    'contact.placeholder_msg': 'Tell us about your requirements...',
    'contact.btn_send': 'Send Message',

    // Checkout Modal
    'checkout.title': 'Complete Your Request / Order',
    'checkout.subtitle': 'Provide your details. We will contact you back!',
    'checkout.field_name': 'Full Name',
    'checkout.field_phone': 'Phone Number',
    'checkout.field_date': 'Preferred Date',
    'checkout.field_time': 'Preferred Time',
    'checkout.field_address': 'Delivery / Event Address',
    'checkout.field_req': 'Special Instructions / Requirements',
    'checkout.placeholder_ins': 'E.g., bridal henna hands & feet, specific dress measurements, or package type.',
    'checkout.btn_place': 'Place Inquiry (অনুরোধ পাঠান)',
    'checkout.btn_submitting': 'Sending Inquiry...',
    'checkout.success_title': 'Inquiry Submitted Successfully!',
    'checkout.success_text': 'Thank you! We will get back to you shortly.',
    'checkout.error_msg': 'Setup required or connection issue. Details has been logged to console.',

    // Account / Login / Admin Settings
    'account.welcome': 'Welcome Back',
    'account.title': 'Boutique Portal / Admin Gateway',
    'account.desc': 'Access your account or login as admin to customize settings, services, and manage bookings.',
    'account.btn_logout': 'Logout / সাইন আউট',
    'account.btn_login': 'Sign In / লগইন করুন',
    'account.invalid_cred': 'Invalid credentials / ইমেইল বা পাসওয়ার্ড ভুল!',
    'account.user_dashboard': 'User Dashboard / ইউজার ড্যাশবোর্ড',
    'account.admin_tab': 'Admin Panel / এডমিন প্যানেল',

    // Footer
    'footer.desc': 'Bespoke beauty, organic henna, and timeless bridal packages designed for your most precious moments.',
    'footer.tagline': 'Bespoke beauty, organic henna, and timeless bridal packages designed for your most precious moments.',
    'footer.links': 'Quick Links',
    'footer.contact': 'Contact Us',
    'footer.follow': 'Follow Us',
    'footer.rights': 'All rights reserved.',
  },
  bn: {
    // Navbar
    'nav.home': 'হোম',
    'nav.products': 'সার্ভিসসমূহ',
    'nav.work_gallery': 'রিসেন্ট ওয়ার্ক',
    'nav.mehadi_gallery': 'ডিজাইন কালেকশন',
    'nav.booking': 'বুকিং',
    'nav.about': 'পরিচিতি',
    'nav.contact': 'যোগাযোগ',
    'nav.account': 'অ্যাকাউন্ট',
    'nav.cart': 'কার্ট দেখুন',

    // Hero Section
    'hero.title': "প্রাকৃতিক মেহেদির নান্দনিক শিল্প",
    'hero.subtitle': "আপনার জীবনের সেরা মুহূর্তগুলোর জন্য আমাদের হাতে তৈরি ১০০% অর্গানিক মেহেদি কোণ এবং দৃষ্টিনন্দন ব্রাইডাল ডিজাইন।",

    // Collection Section
    'collection.curated': 'আমাদের বিশেষ সার্ভিসসমূহ',
    'collection.title_our': 'আমাদের',
    'collection.title_col': 'সংগ্রহ',
    'collection.btn_order': 'অর্ডার / বুকিং করুন',
    'collection.btn_order_product': 'অর্ডার করুন',
    'collection.btn_book_service': 'বুকিং করুন',
    'collection.price': 'মূল্য',

    // Bridal / Booking Section
    'bridal.tag': 'ব্রাইডাল স্পেশাল',
    'bridal.title_part1': 'একটি মাস্টারপিস',
    'bridal.title_part2': 'আপনার',
    'bridal.title_part3': 'বিশেষ দিনের জন্য',
    'bridal.desc': 'আমাদের প্রতিটি মেহেদির ছোঁয়া একটি গল্প তৈরি করে। সনাতন নকশা থেকে শুরু করে আধুনিক ফিউশন ডিজাইন, প্রতিটি ব্রাইডাল ডিজাইনকে আপনার মনের মতো করে ফুটিয়ে তুলতে আমরা ১০০% অর্গানিক এবং সমৃদ্ধ রঙের উজ্জ্বল প্রাকৃতিক মেহেদি ব্যবহার নিশ্চিত করি।',
    'bridal.btn': 'বুকিং এর জন্য অনুরোধ করুন',
    'bridal.badge': '৫০০+ কনের নির্ভরযোগ্য পছন্দ',

    // Portfolio Section
    'portfolio.tag': 'পোর্টফোলিও',
    'portfolio.title_recent': 'আমাদের',
    'portfolio.title_work': 'সাম্প্রতিক কাজ',

    // Mehadi Gallery Section
    'mehadi.tag': 'নান্দনিকতা',
    'mehadi.title_library': 'মেহেদি ডিজাইন গ্যালারি',

    // About Section
    'about.story': 'আমাদের গল্প',
    'about.title_essence': 'ভিত্তি ও আদর্শ',
    'about.title_craft': "বৃষ্টি’র কারুকাজ",
    'about.desc1': "প্রাকৃতিক সৌন্দর্য এবং রাজকীয় কারুকার্যের ঐতিহ্যকে ধারণ করে গড়ে উঠেছে বৃষ্টি’র 'হেন্না অ্যান্ড হিউ'। এটি কেবল একটি বুটিক নয়; এটি আভিজাত্যের প্রতীক যেখানে আমরা মেহেদি শিল্পের মেলবন্ধন ঘটিয়েছি মানসম্মত কাস্টম দর্জি শিল্প এবং গহনার সাথে।",
    'about.desc2': 'আমরা যা কিছু তৈরি করি এবং যে সেবা প্রদান করি, তা মান, সততা ও প্রতিটি মানুষের ব্যক্তিত্বকে ফুটিয়ে তোলার প্রতিশ্রুতিতে নিবেদিত।',

    // Contact Section
    'contact.connection': 'যোগাযোগের মাধ্যম',
    'contact.get_in_touch': 'যোগাযোগ করুন',
    'contact.email': 'ইমেইল',
    'contact.phone': 'ফোন',
    'contact.studio': 'স্টুডিও ঠিকানা',
    'contact.studio_val': 'ধানমন্ডি, ঢাকা, বাংলাদেশ',
    'contact.full_name': 'আপনার নাম',
    'contact.message': 'বার্তা',
    'contact.placeholder_name': 'উদা: সারা কবির',
    'contact.placeholder_msg': 'আপনার বিশেষ প্রয়োজনীয়তা এবং প্রশ্নসমূহ লিখুন...',
    'contact.btn_send': 'বার্তা পাঠান',

    // Checkout Modal
    'checkout.title': 'আবেদন বা অর্ডার সম্পূর্ণ করুন',
    'checkout.subtitle': 'আপনার প্রয়োজনীয় তথ্যগুলো দিয়ে সাহায্য করুন। আমরা অতিসত্বর যোগাযোগ করব।',
    'checkout.field_name': 'পূর্ণ নাম',
    'checkout.field_phone': 'মোবাইল নম্বর',
    'checkout.field_date': 'পছন্দের তারিখ',
    'checkout.field_time': 'পছন্দের সময়',
    'checkout.field_address': 'ডেলিভারি / অনুষ্ঠানের ঠিকানা',
    'checkout.field_req': 'বিশেষ অনুরোধ বা নির্দেশনাবলী',
    'checkout.placeholder_ins': 'উদা: ব্রাইডাল মেহেদি হাত ও পা, পোশাকের নির্দিষ্ট পরিমাপ বা প্যাকেজের বিবরণ।',
    'checkout.btn_place': 'অনুরোধ পাঠান',
    'checkout.btn_submitting': 'অনুরোধ পাঠানো হচ্ছে...',
    'checkout.success_title': 'অনুরোধটি সফলভাবে গৃহীত হয়েছে!',
    'checkout.success_text': 'ধন্যবাদ! আমরা খুব শীঘ্রই আপনার সাথে যোগাযোগ করব।',
    'checkout.error_msg': 'সংযোগজনিত ত্রুটি দেখা দিয়েছে। বিস্তারিত কনসোলে রেকর্ড করা হয়েছে।',

    // Account / Login / Admin Settings
    'account.welcome': 'স্বাগতম',
    'account.title': 'বুটিক পোর্টাল / এডমিন গেটওয়ে',
    'account.desc': 'আপনার অ্যাকাউন্টে প্রবেশ করতে পারেন অথবা বুকিং ও সার্ভিসসমূহ নিয়ন্ত্রণ করার জন্য এডমিন প্যানেলে লগইন করুন।',
    'account.btn_logout': 'সাইন আউট',
    'account.btn_login': 'লগইন করুন',
    'account.invalid_cred': 'ভুল ইমেইল অথবা পাসওয়ার্ড!',
    'account.user_dashboard': 'ইউজার ড্যাশবোর্ড',
    'account.admin_tab': 'এডমিন প্যানেল',

    // Footer
    'footer.desc': 'আভিজাত্য লুকিয়ে আছে আমাদের হাতের স্পর্শে। প্রাকৃতিক অর্গানিক মেহেদি, কাস্টম ডিজাইনার গাউন ও আকর্ষণীয় ব্রাইডাল প্যকেজ বেছে নিন আপনার আনন্দের মুহূর্তকে জমকালো করতে।',
    'footer.tagline': 'আভিজাত্য লুকিয়ে আছে আমাদের হাতের স্পর্শে। প্রাকৃতিক অর্গানিক মেহেদি, কাস্টম ডিজাইনার গাউন ও আকর্ষণীয় ব্রাইডাল প্যকেজ বেছে নিন আপনার আনন্দের মুহূর্তকে জমকালো করতে।',
    'footer.links': 'দ্রুত লিংক',
    'footer.contact': 'যোগাযোগের ঠিকানা',
    'footer.follow': 'সোশ্যাল মিডিয়া',
    'footer.rights': 'সর্বস্বত্ব সংরক্ষিত।',
  }
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<Language>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('language');
      if (saved === 'en' || saved === 'bn') return saved;
    }
    return 'en';
  });

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    if (typeof window !== 'undefined') {
      localStorage.setItem('language', lang);
    }
  };

  const t = (key: string): string => {
    const value = translations[language]?.[key] || translations['en']?.[key];
    return value || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
