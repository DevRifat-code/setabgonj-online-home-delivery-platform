import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { getSupabase } from '../lib/supabase';
import { Save, Globe, Phone, Mail, Instagram, Facebook, Layout, Loader2, AlertCircle } from 'lucide-react';
import ImageUploadField from './ImageUploadField';

interface SiteConfig {
  id?: string;
  site_name: string;
  hero_title: string;
  hero_subtitle: string;
  contact_email: string;
  contact_phone: string;
  social_instagram: string;
  social_facebook: string;
  logo_url?: string;
  hero_image_url?: string;
  about_image_url?: string;
  booking_image_url?: string;
}

export default function AdminSettings() {
  const [config, setConfig] = useState<SiteConfig>({
    site_name: "Setabgonj Online Home Delivery",
    hero_title: "The Art of Natural Henna",
    hero_subtitle: "Handcrafted organic henna cones and custom bridal designs for your most precious moments.",
    contact_email: "hello@brishtys.com",
    contact_phone: "+880 1830-896222",
    social_instagram: "",
    social_facebook: "",
    logo_url: "",
    hero_image_url: "",
    about_image_url: "",
    booking_image_url: ""
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  const fetchConfig = async () => {
    try {
      const client = getSupabase();
      const { data, error } = await client
        .from('site_config')
        .select('*')
        .single();

      if (error) {
        if (error.code === 'PGRST116') {
          // Table exists but is empty
          setNeedsSetup(false);
        } else {
          throw error;
        }
      } else {
        if (data) {
          setConfig(data);
        }
        setNeedsSetup(false);
      }
    } catch (err: any) {
      console.error('Error fetching config:', err);
      setNeedsSetup(true);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage(null);
    try {
      const client = getSupabase();
      let error;
      
      const payload = { ...config };
      delete payload.id; // Remove ID for update/insert logic

      if (config.id) {
        const { error: err } = await client
          .from('site_config')
          .update(payload)
          .eq('id', config.id);
        error = err;
      } else {
        const { error: err } = await client
          .from('site_config')
          .insert([payload]);
        error = err;
      }

      if (error) {
        // Handle case where custom image columns do not exist in Supabase yet (PGRST204/column cache/missing schema)
        const isMissingImgCol = error.code === 'PGRST204' || 
          (error.message && (
            error.message.toLowerCase().includes('logo_url') || 
            error.message.toLowerCase().includes('hero_image_url') || 
            error.message.toLowerCase().includes('about_image_url') ||
            error.message.toLowerCase().includes('booking_image_url')
          ));

        if (isMissingImgCol) {
          console.warn("One or more image columns are missing in Supabase. Saving other settings first...");
          
          const fallbackPayload = { ...payload };
          delete fallbackPayload.logo_url;
          delete fallbackPayload.hero_image_url;
          delete fallbackPayload.about_image_url;
          delete fallbackPayload.booking_image_url;

          let fallbackError;
          if (config.id) {
            const { error: err } = await client
              .from('site_config')
              .update(fallbackPayload)
              .eq('id', config.id);
            fallbackError = err;
          } else {
            const { error: err } = await client
              .from('site_config')
              .insert([fallbackPayload]);
            fallbackError = err;
          }

          if (fallbackError) throw fallbackError;

          setMessage({
            type: 'error',
            text: 'বাকি সেটিংস সেভ হয়েছে! তবে সাইট কাস্টম ব্যানার, লোগো, পরিচিতি এবং বুকিং ছবি আপডেট করার ফিচার চালু করতে নিচের SQL-টি আপনার Supabase SQL Editor-এ রান করুন: \n\n' +
                  'ALTER TABLE public.site_config ADD COLUMN IF NOT EXISTS logo_url text DEFAULT \'\';\n' +
                  'ALTER TABLE public.site_config ADD COLUMN IF NOT EXISTS hero_image_url text DEFAULT \'\';\n' +
                  'ALTER TABLE public.site_config ADD COLUMN IF NOT EXISTS about_image_url text DEFAULT \'\';\n' +
                  'ALTER TABLE public.site_config ADD COLUMN IF NOT EXISTS booking_image_url text DEFAULT \'\';'
          });
          setNeedsSetup(true);
          fetchConfig();
          return;
        }

        throw error;
      }

      setMessage({ type: 'success', text: 'Settings saved successfully!' });
      fetchConfig();
    } catch (err: any) {
      console.error('Error saving config:', err);
      if (err.code === 'PGRST205' || err.code === '42P01') {
        setMessage({ 
          type: 'error', 
          text: 'Table "site_config" missing in Supabase.' 
        });
        setNeedsSetup(true);
      } else {
        setMessage({ type: 'error', text: err.message || 'Failed to save settings.' });
      }
    } finally {
      setSaving(false);
    }
  };

  const [needsSetup, setNeedsSetup] = useState(false);
  const sqlScript = `-- 1. Create orders table
CREATE TABLE IF NOT EXISTS public.orders (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  product_name text NOT NULL,
  quantity integer NOT NULL,
  customer_name text NOT NULL,
  phone_number text NOT NULL,
  address text NOT NULL,
  notes text DEFAULT '',
  status text DEFAULT 'pending',
  created_at timestamptz DEFAULT now()
);

-- Ensure notes column exists for upgrade users
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS notes text DEFAULT '';

-- 2. Create site_config table
CREATE TABLE IF NOT EXISTS public.site_config (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  site_name text DEFAULT 'Setabgonj Online Home Delivery',
  logo_url text DEFAULT '',
  hero_image_url text DEFAULT '',
  about_image_url text DEFAULT '',
  booking_image_url text DEFAULT '',
  hero_title text DEFAULT 'The Art of Natural Henna',
  hero_subtitle text DEFAULT 'Handcrafted organic henna cones and custom bridal designs for your most precious moments.',
  contact_email text DEFAULT 'hello@brishtys.com',
  contact_phone text DEFAULT '+880 1830-896222',
  social_instagram text DEFAULT '',
  social_facebook text DEFAULT ''
);

-- Ensure logo_url column exists for upgrade users
ALTER TABLE public.site_config ADD COLUMN IF NOT EXISTS logo_url text DEFAULT '';
ALTER TABLE public.site_config ADD COLUMN IF NOT EXISTS hero_image_url text DEFAULT '';
ALTER TABLE public.site_config ADD COLUMN IF NOT EXISTS about_image_url text DEFAULT '';
ALTER TABLE public.site_config ADD COLUMN IF NOT EXISTS booking_image_url text DEFAULT '';

-- 3. Create services table
CREATE TABLE IF NOT EXISTS public.services (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  title text NOT NULL,
  category text NOT NULL,
  image_url text NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- 4. Create portfolio table
CREATE TABLE IF NOT EXISTS public.portfolio (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  title text DEFAULT '',
  image_url text NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- 5. Create design_library table
CREATE TABLE IF NOT EXISTS public.design_library (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  title text NOT NULL,
  image_url text NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- 6. Create admins table
CREATE TABLE IF NOT EXISTS public.admins (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  email text NOT NULL UNIQUE,
  password text NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- 7. Enable RLS
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.site_config ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.portfolio ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.design_library ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admins ENABLE ROW LEVEL SECURITY;

-- 8. Policies
DROP POLICY IF EXISTS "Public insert orders" ON public.orders;
DROP POLICY IF EXISTS "Auth manage orders" ON public.orders;
DROP POLICY IF EXISTS "Public manage orders" ON public.orders;
DROP POLICY IF EXISTS "Public read config" ON public.site_config;
DROP POLICY IF EXISTS "Auth manage config" ON public.site_config;
DROP POLICY IF EXISTS "Public manage config" ON public.site_config;
DROP POLICY IF EXISTS "Public read services" ON public.services;
DROP POLICY IF EXISTS "Auth manage services" ON public.services;
DROP POLICY IF EXISTS "Public manage services" ON public.services;
DROP POLICY IF EXISTS "Public read portfolio" ON public.portfolio;
DROP POLICY IF EXISTS "Auth manage portfolio" ON public.portfolio;
DROP POLICY IF EXISTS "Public manage portfolio" ON public.portfolio;
DROP POLICY IF EXISTS "Public read design_library" ON public.design_library;
DROP POLICY IF EXISTS "Auth manage design_library" ON public.design_library;
DROP POLICY IF EXISTS "Public manage design_library" ON public.design_library;
DROP POLICY IF EXISTS "Public manage admins" ON public.admins;

CREATE POLICY "Public manage orders" ON public.orders FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Public manage config" ON public.site_config FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Public manage services" ON public.services FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Public manage portfolio" ON public.portfolio FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Public manage design_library" ON public.design_library FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Public manage admins" ON public.admins FOR ALL USING (true) WITH CHECK (true);

-- 9. Seed Initial Data
INSERT INTO public.site_config (site_name)
SELECT 'Setabgonj Online Home Delivery'
WHERE NOT EXISTS (SELECT 1 FROM public.site_config);

INSERT INTO public.admins (email, password)
SELECT 'mdrifathossainpersonal@gmail.com', 'Admin@143'
WHERE NOT EXISTS (SELECT 1 FROM public.admins WHERE email = 'mdrifathossainpersonal@gmail.com');

INSERT INTO public.admins (email, password)
SELECT 'admin@brishtys.com', 'Admin@143'
WHERE NOT EXISTS (SELECT 1 FROM public.admins WHERE email = 'admin@brishtys.com');

INSERT INTO public.services (title, category, image_url)
SELECT 'Organic Henna Cones', 'Botanical Beauty', '/assets/images/organic_henna_cones_1778986359766.png' WHERE NOT EXISTS (SELECT 1 FROM public.services);
INSERT INTO public.services (title, category, image_url)
SELECT 'Bridal Henna Art', 'Luxe Booking', '/assets/images/bridal_art_card_1778986446990.png' WHERE NOT EXISTS (SELECT 1 FROM public.services);
INSERT INTO public.services (title, category, image_url)
SELECT 'Handcrafted Floral Jewelry', 'Artisanal Accessory', '/assets/images/floral_jewelry_display_1778986376041.png' WHERE NOT EXISTS (SELECT 1 FROM public.services);
INSERT INTO public.services (title, category, image_url)
SELECT 'Bespoke Tailoring', 'Custom Design', '/assets/images/tailoring_studio_1778986392437.png' WHERE NOT EXISTS (SELECT 1 FROM public.services);

INSERT INTO public.portfolio (title, image_url)
SELECT 'Bridal Art', '/assets/images/bridal_art_card_1778986446990.png' WHERE NOT EXISTS (SELECT 1 FROM public.portfolio);
INSERT INTO public.portfolio (title, image_url)
SELECT 'Tailoring', '/assets/images/tailoring_studio_1778986392437.png' WHERE NOT EXISTS (SELECT 1 FROM public.portfolio);
INSERT INTO public.portfolio (title, image_url)
SELECT 'Hero Banner', '/assets/images/henna_hero_banner_1778986342690.png' WHERE NOT EXISTS (SELECT 1 FROM public.portfolio);
INSERT INTO public.portfolio (title, image_url)
SELECT 'Floral Jewelry', '/assets/images/floral_jewelry_display_1778986376041.png' WHERE NOT EXISTS (SELECT 1 FROM public.portfolio);

INSERT INTO public.design_library (title, image_url)
SELECT 'Intricate Bridal', '/assets/images/bridal_art_card_1778986446990.png' WHERE NOT EXISTS (SELECT 1 FROM public.design_library);
INSERT INTO public.design_library (title, image_url)
SELECT 'Minimalist Floral', '/assets/images/henna_hero_banner_1778986342690.png' WHERE NOT EXISTS (SELECT 1 FROM public.design_library);
INSERT INTO public.design_library (title, image_url)
SELECT 'Traditional Patterns', '/assets/images/organic_henna_cones_1778986359766.png' WHERE NOT EXISTS (SELECT 1 FROM public.design_library);
INSERT INTO public.design_library (title, image_url)
SELECT 'Custom Fusion', '/assets/images/tailoring_studio_1778986392437.png' WHERE NOT EXISTS (SELECT 1 FROM public.design_library);`;

  useEffect(() => {
    fetchConfig();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="animate-spin text-emerald-deep" size={32} />
      </div>
    );
  }

  return (
    <div className="space-y-10">
      <div className="flex items-center justify-between border-b border-emerald-deep/10 pb-6">
        <div>
          <h3 className="font-serif text-3xl text-emerald-deep">Site Customization</h3>
          <p className="text-emerald-deep/60">Update global website content and contact information</p>
        </div>
      </div>

      {needsSetup && (
        <div className="bg-amber-50 border border-amber-200 p-8 rounded-3xl space-y-6">
          <div className="flex items-center gap-3 text-amber-800 font-bold text-lg">
            <AlertCircle size={24} /> Supabase Database Setup Required
          </div>
          <p className="text-amber-700 leading-relaxed">
            The database tables for <strong>Orders</strong> and <strong>Site Configuration</strong> are missing in your Supabase project. 
            Please run the following SQL script in your Supabase SQL Editor to enable all features:
          </p>
          <div className="relative group">
            <pre className="bg-white/70 p-6 rounded-2xl text-[11px] font-mono overflow-x-auto border border-amber-200 max-h-[300px] shadow-inner">
              {sqlScript}
            </pre>
            <button 
              onClick={() => {
                navigator.clipboard.writeText(sqlScript);
                alert("SQL Script copied to clipboard!");
              }}
              className="absolute top-4 right-4 bg-emerald-deep text-white px-4 py-2 rounded-lg font-bold text-xs hover:bg-rose-gold transition-colors shadow-lg"
            >
              Copy SQL
            </button>
          </div>
          <div className="flex items-center gap-4 pt-4">
            <button 
              onClick={fetchConfig}
              className="bg-amber-200 hover:bg-amber-300 text-amber-900 px-6 py-3 rounded-xl font-bold transition-all flex items-center gap-2"
            >
              <Loader2 size={18} className={loading ? 'animate-spin' : ''} />
              I've run the script, check again
            </button>
          </div>
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-8">
        {message && (
          <div className={`p-4 rounded-2xl ${message.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'} font-medium`}>
            {message.text}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-6">
            <h4 className="font-sans text-xs uppercase tracking-widest font-bold text-rose-gold flex items-center gap-2">
              <Globe size={16} /> Identity & Hero
            </h4>
            
            <div className="space-y-4">
              <div>
                <label className="text-xs font-bold text-emerald-deep/40 uppercase tracking-widest mb-2 block">Site Name</label>
                <input 
                  type="text"
                  value={config.site_name}
                  onChange={e => setConfig({...config, site_name: e.target.value})}
                  className="w-full bg-emerald-deep/5 border-none rounded-2xl px-6 py-3 focus:ring-2 focus:ring-rose-gold transition-all"
                />
              </div>
              <div>
                <ImageUploadField
                  label="Site Logo (সাইট লোগো)"
                  value={config.logo_url || ""}
                  onChange={val => setConfig({...config, logo_url: val})}
                  placeholder="Paste image URL or upload logo"
                />
              </div>
              <div>
                <ImageUploadField
                  label="Hero Background Banner (ব্যাকগ্রাউন্ড ব্যানার ছবি)"
                  value={config.hero_image_url || ""}
                  onChange={val => setConfig({...config, hero_image_url: val})}
                  placeholder="Upload of paste banner image"
                />
              </div>
              <div>
                <ImageUploadField
                   label="Booking Banner / Bridal Art (বুকিং সেকশন ছবি)"
                   value={config.booking_image_url || ""}
                   onChange={val => setConfig({...config, booking_image_url: val})}
                   placeholder="Upload or paste bridal booking section image"
                />
              </div>
              <div>
                <label className="text-xs font-bold text-emerald-deep/40 uppercase tracking-widest mb-2 block">Hero Title</label>
                <input 
                  type="text"
                  value={config.hero_title}
                  onChange={e => setConfig({...config, hero_title: e.target.value})}
                  className="w-full bg-emerald-deep/5 border-none rounded-2xl px-6 py-3 focus:ring-2 focus:ring-rose-gold transition-all"
                />
              </div>
              <div>
                <label className="text-xs font-bold text-emerald-deep/40 uppercase tracking-widest mb-2 block">Hero Subtitle</label>
                <textarea 
                  rows={3}
                  value={config.hero_subtitle}
                  onChange={e => setConfig({...config, hero_subtitle: e.target.value})}
                  className="w-full bg-emerald-deep/5 border-none rounded-2xl px-6 py-3 focus:ring-2 focus:ring-rose-gold transition-all resize-none"
                />
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <h4 className="font-sans text-xs uppercase tracking-widest font-bold text-rose-gold flex items-center gap-2">
              <Phone size={16} /> Contact & Social
            </h4>
            
            <div className="space-y-4">
              <div>
                <label className="text-xs font-bold text-emerald-deep/40 uppercase tracking-widest mb-2 block">Contact Email</label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-emerald-deep/20" size={18} />
                  <input 
                    type="email"
                    value={config.contact_email}
                    onChange={e => setConfig({...config, contact_email: e.target.value})}
                    className="w-full pl-12 pr-6 py-3 bg-emerald-deep/5 border-none rounded-2xl focus:ring-2 focus:ring-rose-gold transition-all"
                  />
                </div>
              </div>
              <div>
                <label className="text-xs font-bold text-emerald-deep/40 uppercase tracking-widest mb-2 block">Phone Number</label>
                <div className="relative">
                  <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-emerald-deep/20" size={18} />
                  <input 
                    type="text"
                    value={config.contact_phone}
                    onChange={e => setConfig({...config, contact_phone: e.target.value})}
                    className="w-full pl-12 pr-6 py-3 bg-emerald-deep/5 border-none rounded-2xl focus:ring-2 focus:ring-rose-gold transition-all"
                  />
                </div>
              </div>
              <div>
                <label className="text-xs font-bold text-emerald-deep/40 uppercase tracking-widest mb-2 block">Instagram Link</label>
                <div className="relative">
                  <Instagram className="absolute left-4 top-1/2 -translate-y-1/2 text-emerald-deep/20" size={18} />
                  <input 
                    type="text"
                    value={config.social_instagram}
                    onChange={e => setConfig({...config, social_instagram: e.target.value})}
                    className="w-full pl-12 pr-6 py-3 bg-emerald-deep/5 border-none rounded-2xl focus:ring-2 focus:ring-rose-gold transition-all"
                    placeholder="https://instagram.com/..."
                  />
                </div>
              </div>
              <div>
                <label className="text-xs font-bold text-emerald-deep/40 uppercase tracking-widest mb-2 block">Facebook Link</label>
                <div className="relative">
                  <Facebook className="absolute left-4 top-1/2 -translate-y-1/2 text-emerald-deep/20" size={18} />
                  <input 
                    type="text"
                    value={config.social_facebook}
                    onChange={e => setConfig({...config, social_facebook: e.target.value})}
                    className="w-full pl-12 pr-6 py-3 bg-emerald-deep/5 border-none rounded-2xl focus:ring-2 focus:ring-rose-gold transition-all"
                    placeholder="https://facebook.com/..."
                  />
                </div>
              </div>
              <div>
                <ImageUploadField
                  label="About Portrait Image (পরিচিতি পাতার ছবি)"
                  value={config.about_image_url || ""}
                  onChange={val => setConfig({...config, about_image_url: val})}
                  placeholder="Upload or paste portrait photo"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-end pt-6 border-t border-emerald-deep/10">
          <button 
            type="submit"
            disabled={saving}
            className="bg-emerald-deep text-white px-10 py-4 rounded-full font-bold hover:bg-rose-gold transition-all duration-300 shadow-xl shadow-emerald-deep/5 flex items-center gap-2 disabled:opacity-50"
          >
            {saving ? <Loader2 className="animate-spin" size={20} /> : <Save size={20} />}
            Save Customization
          </button>
        </div>
      </form>
      
      <div className="bg-rose-gold/5 p-6 rounded-3xl border border-rose-gold/10">
        <h5 className="font-serif text-lg text-emerald-deep mb-2 flex items-center gap-2">
          <Layout size={18} /> Tip: Full Site Control
        </h5>
        <p className="text-sm text-emerald-deep/60 leading-relaxed">
          These settings refresh globally. Changing the site name or contact details here will update them in the Navbar, Contact section, and Footer automatically.
        </p>
      </div>

    </div>
  );
}
