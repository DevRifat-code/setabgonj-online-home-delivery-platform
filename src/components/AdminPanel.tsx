import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { getSupabase, setCustomSupabaseCredentials, clearCustomSupabaseCredentials } from '../lib/supabase';
import { 
  Package, 
  Clock, 
  CheckCircle2, 
  AlertCircle, 
  RefreshCw, 
  Trash2, 
  LayoutGrid, 
  Settings, 
  Plus, 
  Edit, 
  Image as ImageIcon, 
  Sparkles, 
  BookOpen, 
  Loader2, 
  Save, 
  Tag,
  ChevronDown,
  ChevronUp,
  Copy,
  Check,
  MapPin,
  Phone,
  User,
  FileText
} from 'lucide-react';
import AdminSettings from './AdminSettings';
import ImageUploadField from './ImageUploadField';

interface Order {
  id: string;
  created_at: string;
  customer_name: string;
  phone_number: string;
  address: string;
  product_name: string;
  quantity: number;
  status: string;
  notes?: string;
}

interface Service {
  id: string;
  title: string;
  category: string;
  image_url: string;
  price?: string;
  type?: string;
  created_at?: string;
}

interface PortfolioItem {
  id: string;
  title: string;
  image_url: string;
  created_at?: string;
}

interface DesignLibraryItem {
  id: string;
  title: string;
  image_url: string;
  created_at?: string;
}

export default function AdminPanel() {
  const [activeTab, setActiveTab] = useState<'orders' | 'services' | 'portfolio' | 'library' | 'settings'>('orders');
  const [orderFilter, setOrderFilter] = useState<'active' | 'history' | 'all'>('active');
  
  // Custom Supabase credentials override state
  const [supabaseUrlInput, setSupabaseUrlInput] = useState(() => (typeof window !== 'undefined' ? localStorage.getItem('custom_supabase_url') || 'https://qmuczhbazdqepefdmffd.supabase.co' : 'https://qmuczhbazdqepefdmffd.supabase.co'));
  const [supabaseAnonKeyInput, setSupabaseAnonKeyInput] = useState(() => (typeof window !== 'undefined' ? localStorage.getItem('custom_supabase_anon_key') || '' : ''));
  const [apiKeyError, setApiKeyError] = useState(false);
  
  // Data States
  const [orders, setOrders] = useState<Order[]>([]);
  const filteredOrders = orders.filter(order => {
    const status = order.status || 'pending';
    if (orderFilter === 'active') {
      return status !== 'delivered' && status !== 'cancelled';
    } else if (orderFilter === 'history') {
      return status === 'delivered' || status === 'cancelled';
    }
    return true; // 'all'
  });
  const [expandedOrders, setExpandedOrders] = useState<Record<string, boolean>>({});
  const [copiedOrderId, setCopiedOrderId] = useState<string | null>(null);
  const [services, setServices] = useState<Service[]>([]);
  const [portfolio, setPortfolio] = useState<PortfolioItem[]>([]);
  const [designLib, setDesignLib] = useState<DesignLibraryItem[]>([]);
  
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [needsSetup, setNeedsSetup] = useState(false);
  const [rlsError, setRlsError] = useState<{ action: string; table: string; message: string; sql: string } | null>(null);

  // Form states
  const [formMode, setFormMode] = useState<'none' | 'add' | 'edit'>('none');
  const [activeFormId, setActiveFormId] = useState<string | null>(null);

  // Individual Form Fields
  const [serviceForm, setServiceForm] = useState({ title: '', category: '', image_url: '', price: '', type: 'product' });
  const [portfolioForm, setPortfolioForm] = useState({ title: '', image_url: '' });
  const [designForm, setDesignForm] = useState({ title: '', image_url: '' });

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
  hero_title text DEFAULT 'The Art of Natural Henna',
  hero_subtitle text DEFAULT 'Handcrafted organic henna cones and custom bridal designs for your most precious moments.',
  contact_email text DEFAULT 'hello@brishtys.com',
  contact_phone text DEFAULT '+880 1830-896222',
  social_instagram text DEFAULT '',
  social_facebook text DEFAULT ''
);

-- Ensure logo_url column exists for upgrade users
ALTER TABLE public.site_config ADD COLUMN IF NOT EXISTS logo_url text DEFAULT '';

-- 3. Create services table
CREATE TABLE IF NOT EXISTS public.services (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  title text NOT NULL,
  category text NOT NULL,
  image_url text NOT NULL,
  price text DEFAULT '',
  type text DEFAULT 'product',
  created_at timestamptz DEFAULT now()
);

-- Ensure price and type columns exist for services upgrade users
ALTER TABLE public.services ADD COLUMN IF NOT EXISTS price text DEFAULT '';
ALTER TABLE public.services ADD COLUMN IF NOT EXISTS type text DEFAULT 'product';

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

  const fetchAllData = async () => {
    setRefreshing(true);
    try {
      const client = getSupabase();
      
      const [ordersRes, servicesRes, portfolioRes, libRes] = await Promise.all([
        client.from('orders').select('*').order('created_at', { ascending: false }),
        client.from('services').select('*').order('created_at', { ascending: false }),
        client.from('portfolio').select('*').order('created_at', { ascending: false }),
        client.from('design_library').select('*').order('created_at', { ascending: false })
      ]);

      const isKeyError = !!(
        (ordersRes.error?.message && (ordersRes.error.message.includes('API key') || ordersRes.error.message.includes('anon'))) ||
        (servicesRes.error?.message && (servicesRes.error.message.includes('API key') || servicesRes.error.message.includes('anon'))) ||
        (portfolioRes.error?.message && (portfolioRes.error.message.includes('API key') || portfolioRes.error.message.includes('anon'))) ||
        (libRes.error?.message && (libRes.error.message.includes('API key') || libRes.error.message.includes('anon')))
      );

      setApiKeyError(isKeyError);

      // If any of the new tables do not exist, they will return an error (such as 42P01: relation does not exist)
      const hasTableError = !!(
        ordersRes.error || 
        servicesRes.error || 
        portfolioRes.error || 
        libRes.error
      );

      if (hasTableError) {
        setNeedsSetup(true);
        if (ordersRes.error) console.error('Orders table error:', ordersRes.error);
        if (servicesRes.error) console.error('Services table error:', servicesRes.error);
        if (portfolioRes.error) console.error('Portfolio table error:', portfolioRes.error);
        if (libRes.error) console.error('Design library table error:', libRes.error);
      } else {
        setNeedsSetup(false);
      }

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

      if (ordersRes.data) setOrders(ordersRes.data);
      if (servicesRes.data) {
        setServices(servicesRes.data.map((s: any) => ({
          ...s,
          price: s.price !== undefined && s.price !== null && s.price !== '' ? s.price : getServiceDefaultPrice(s.title),
          type: s.type !== undefined && s.type !== null && s.type !== '' ? s.type : getServiceDefaultType(s.title),
        })));
      }
      if (portfolioRes.data) setPortfolio(portfolioRes.data);
      if (libRes.data) setDesignLib(libRes.data);
    } catch (err: any) {
      console.error('Error fetching admin panel data:', err);
      setNeedsSetup(true);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchAllData();
  }, []);

  // Update order status
  const updateOrderStatus = async (id: string, status: string) => {
    try {
      const client = getSupabase();
      const { error } = await client
        .from('orders')
        .update({ status })
        .eq('id', id);

      if (error) throw error;
      setOrders(orders.map(o => o.id === id ? { ...o, status } : o));
    } catch (err: any) {
      console.error('Error updating status:', err);
      if (err.code === '42501' || err.message?.includes('row-level security') || err.message?.includes('policy')) {
        setRlsError({
          action: 'updating status of',
          table: 'orders',
          message: err.message || 'Row Level Security policy violation',
          sql: `-- Option 1: 100% Guaranteed Fix / সবচেয়ে সহজ ও নিশ্চিত সমাধান (Recommended)\n-- Run this in your Supabase SQL Editor to disable security checks and allow instantly:\nALTER TABLE public.orders DISABLE ROW LEVEL SECURITY;\n\n-- Option 2: Alternative Public Policy / ব্যাকআপ পলিসি\nALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;\nDROP POLICY IF EXISTS "Public manage orders" ON public.orders;\nDROP POLICY IF EXISTS "Public insert orders" ON public.orders;\nDROP POLICY IF EXISTS "Auth manage orders" ON public.orders;\nCREATE POLICY "Public manage orders" ON public.orders FOR ALL USING (true) WITH CHECK (true);`
        });
      } else {
        alert(err.message || 'Error updating order status.');
      }
    }
  };

  // Delete order
  const deleteOrder = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this order?')) return;
    try {
      const client = getSupabase();
      const { error } = await client
        .from('orders')
        .delete()
        .eq('id', id);

      if (error) throw error;
      setOrders(orders.filter(o => o.id !== id));
    } catch (err: any) {
      console.error('Error deleting order:', err);
      if (err.code === '42501' || err.message?.includes('row-level security') || err.message?.includes('policy')) {
        setRlsError({
          action: 'deleting',
          table: 'orders',
          message: err.message || 'Row Level Security policy violation',
          sql: `-- Option 1: 100% Guaranteed Fix / সবচেয়ে সহজ ও নিশ্চিত সমাধান (Recommended)\n-- Run this in your Supabase SQL Editor to disable security checks and allow instantly:\nALTER TABLE public.orders DISABLE ROW LEVEL SECURITY;\n\n-- Option 2: Alternative Public Policy / ব্যাকআপ পলিসি\nALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;\nDROP POLICY IF EXISTS "Public manage orders" ON public.orders;\nDROP POLICY IF EXISTS "Public insert orders" ON public.orders;\nDROP POLICY IF EXISTS "Auth manage orders" ON public.orders;\nCREATE POLICY "Public manage orders" ON public.orders FOR ALL USING (true) WITH CHECK (true);`
        });
      } else {
        alert(err.message || 'Error deleting order.');
      }
    }
  };

  // --------------------------------------------------------------------------------Services CRUD
  const handleServiceSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!serviceForm.title || !serviceForm.category || !serviceForm.image_url) {
      alert('Please fill out all fields.');
      return;
    }

    try {
      const client = getSupabase();
      let dbError: any = null;

      try {
        if (formMode === 'edit' && activeFormId) {
          const { error } = await client
            .from('services')
            .update({
              title: serviceForm.title,
              category: serviceForm.category,
              image_url: serviceForm.image_url,
              price: serviceForm.price,
              type: serviceForm.type
            })
            .eq('id', activeFormId);
          dbError = error;
        } else {
          const { error } = await client
            .from('services')
            .insert([{
              title: serviceForm.title,
              category: serviceForm.category,
              image_url: serviceForm.image_url,
              price: serviceForm.price,
              type: serviceForm.type
            }]);
          dbError = error;
        }
      } catch (err: any) {
        dbError = err;
      }

      // If price or type columns do not exist in the DB, retry without them
      if (dbError && (
        dbError.message?.toLowerCase().includes('price') || 
        dbError.message?.toLowerCase().includes('type') || 
        dbError.code === '42703' || 
        dbError.code === 'PGRST204'
      )) {
        console.warn('Omiting "price" & "type" columns due to schema mismatch. Retrying service submission...');
        if (formMode === 'edit' && activeFormId) {
          const { error } = await client
            .from('services')
            .update({
              title: serviceForm.title,
              category: serviceForm.category,
              image_url: serviceForm.image_url
            })
            .eq('id', activeFormId);
          dbError = error;
        } else {
          const { error } = await client
            .from('services')
            .insert([{
              title: serviceForm.title,
              category: serviceForm.category,
              image_url: serviceForm.image_url
            }]);
          dbError = error;
        }
      }

      if (dbError) throw dbError;

      setServiceForm({ title: '', category: '', image_url: '', price: '', type: 'product' });
      setFormMode('none');
      setActiveFormId(null);
      fetchAllData();
    } catch (err: any) {
      console.error('Error submitting service:', err);
      if (err.code === '42501' || err.message?.includes('row-level security') || err.message?.includes('policy')) {
        setRlsError({
          action: formMode === 'edit' ? 'updating' : 'creating',
          table: 'services',
          message: err.message || 'Row Level Security policy violation',
          sql: `-- Option 1: 100% Guaranteed Fix / সবচেয়ে সহজ ও নিশ্চিত সমাধান (Recommended)\n-- Run this in your Supabase SQL Editor to disable security checks and allow instantly:\nALTER TABLE public.services DISABLE ROW LEVEL SECURITY;\n\n-- Option 2: Alternative Public Policy / ব্যাকআপ পলিসি\nALTER TABLE public.services ENABLE ROW LEVEL SECURITY;\nDROP POLICY IF EXISTS "Public manage services" ON public.services;\nDROP POLICY IF EXISTS "Public read services" ON public.services;\nDROP POLICY IF EXISTS "Auth manage services" ON public.services;\nCREATE POLICY "Public manage services" ON public.services FOR ALL USING (true) WITH CHECK (true);`
        });
      } else {
        alert(err.message || 'Error submitting service.');
      }
    }
  };

  const startEditService = (service: Service) => {
    setServiceForm({
      title: service.title,
      category: service.category,
      image_url: service.image_url,
      price: service.price || '',
      type: service.type || 'product'
    });
    setActiveFormId(service.id);
    setFormMode('edit');
  };

  const deleteService = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this service?')) return;
    try {
      const client = getSupabase();
      const { error } = await client.from('services').delete().eq('id', id);
      if (error) throw error;
      fetchAllData();
    } catch (err: any) {
      console.error('Error deleting service:', err);
      if (err.code === '42501' || err.message?.includes('row-level security') || err.message?.includes('policy')) {
        setRlsError({
          action: 'deleting',
          table: 'services',
          message: err.message || 'Row Level Security policy violation',
          sql: `-- Option 1: 100% Guaranteed Fix / সবচেয়ে সহজ ও নিশ্চিত সমাধান (Recommended)\n-- Run this in your Supabase SQL Editor to disable security checks and allow instantly:\nALTER TABLE public.services DISABLE ROW LEVEL SECURITY;\n\n-- Option 2: Alternative Public Policy / ব্যাকআপ পলিসি\nALTER TABLE public.services ENABLE ROW LEVEL SECURITY;\nDROP POLICY IF EXISTS "Public manage services" ON public.services;\nDROP POLICY IF EXISTS "Public read services" ON public.services;\nDROP POLICY IF EXISTS "Auth manage services" ON public.services;\nCREATE POLICY "Public manage services" ON public.services FOR ALL USING (true) WITH CHECK (true);`
        });
      } else {
        alert(err.message || 'Error deleting service.');
      }
    }
  };

  // --------------------------------------------------------------------------------Portfolio CRUD
  const handlePortfolioSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!portfolioForm.image_url) {
      alert('Please provide an Image URL.');
      return;
    }

    try {
      const client = getSupabase();
      if (formMode === 'edit' && activeFormId) {
        const { error } = await client
          .from('portfolio')
          .update({
            title: portfolioForm.title,
            image_url: portfolioForm.image_url
          })
          .eq('id', activeFormId);
        if (error) throw error;
      } else {
        const { error } = await client
          .from('portfolio')
          .insert([{
            title: portfolioForm.title,
            image_url: portfolioForm.image_url
          }]);
        if (error) throw error;
      }

      setPortfolioForm({ title: '', image_url: '' });
      setFormMode('none');
      setActiveFormId(null);
      fetchAllData();
    } catch (err: any) {
      console.error('Error submitting portfolio item:', err);
      if (err.code === '42501' || err.message?.includes('row-level security') || err.message?.includes('policy')) {
        setRlsError({
          action: formMode === 'edit' ? 'updating' : 'creating',
          table: 'portfolio',
          message: err.message || 'Row Level Security policy violation',
          sql: `-- Option 1: 100% Guaranteed Fix / সবচেয়ে সহজ ও নিশ্চিত সমাধান (Recommended)\n-- Run this in your Supabase SQL Editor to disable security checks and allow instantly:\nALTER TABLE public.portfolio DISABLE ROW LEVEL SECURITY;\n\n-- Option 2: Alternative Public Policy / ব্যাকআপ পলিসি\nALTER TABLE public.portfolio ENABLE ROW LEVEL SECURITY;\nDROP POLICY IF EXISTS "Public manage portfolio" ON public.portfolio;\nDROP POLICY IF EXISTS "Public read portfolio" ON public.portfolio;\nDROP POLICY IF EXISTS "Auth manage portfolio" ON public.portfolio;\nCREATE POLICY "Public manage portfolio" ON public.portfolio FOR ALL USING (true) WITH CHECK (true);`
        });
      } else {
        alert(err.message || 'Error submitting portfolio item.');
      }
    }
  };

  const startEditPortfolio = (item: PortfolioItem) => {
    setPortfolioForm({
      title: item.title,
      image_url: item.image_url
    });
    setActiveFormId(item.id);
    setFormMode('edit');
  };

  const deletePortfolioItem = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this portfolio item?')) return;
    try {
      const client = getSupabase();
      const { error } = await client.from('portfolio').delete().eq('id', id);
      if (error) throw error;
      fetchAllData();
    } catch (err: any) {
      console.error('Error deleting portfolio item:', err);
      if (err.code === '42501' || err.message?.includes('row-level security') || err.message?.includes('policy')) {
        setRlsError({
          action: 'deleting',
          table: 'portfolio',
          message: err.message || 'Row Level Security policy violation',
          sql: `-- Option 1: 100% Guaranteed Fix / সবচেয়ে সহজ ও নিশ্চিত সমাধান (Recommended)\n-- Run this in your Supabase SQL Editor to disable security checks and allow instantly:\nALTER TABLE public.portfolio DISABLE ROW LEVEL SECURITY;\n\n-- Option 2: Alternative Public Policy / ব্যাকআপ পলিসি\nALTER TABLE public.portfolio ENABLE ROW LEVEL SECURITY;\nDROP POLICY IF EXISTS "Public manage portfolio" ON public.portfolio;\nDROP POLICY IF EXISTS "Public read portfolio" ON public.portfolio;\nDROP POLICY IF EXISTS "Auth manage portfolio" ON public.portfolio;\nCREATE POLICY "Public manage portfolio" ON public.portfolio FOR ALL USING (true) WITH CHECK (true);`
        });
      } else {
        alert(err.message || 'Error deleting portfolio item.');
      }
    }
  };

  // --------------------------------------------------------------------------------Design Library CRUD
  const handleDesignSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!designForm.title || !designForm.image_url) {
      alert('Please provide a title and an Image URL.');
      return;
    }

    try {
      const client = getSupabase();
      if (formMode === 'edit' && activeFormId) {
        const { error } = await client
          .from('design_library')
          .update({
            title: designForm.title,
            image_url: designForm.image_url
          })
          .eq('id', activeFormId);
        if (error) throw error;
      } else {
        const { error } = await client
          .from('design_library')
          .insert([{
            title: designForm.title,
            image_url: designForm.image_url
          }]);
        if (error) throw error;
      }

      setDesignForm({ title: '', image_url: '' });
      setFormMode('none');
      setActiveFormId(null);
      fetchAllData();
    } catch (err: any) {
      console.error('Error submitting design library item:', err);
      if (err.code === '42501' || err.message?.includes('row-level security') || err.message?.includes('policy')) {
        setRlsError({
          action: formMode === 'edit' ? 'updating' : 'creating',
          table: 'design_library',
          message: err.message || 'Row Level Security policy violation',
          sql: `-- Option 1: 100% Guaranteed Fix / সবচেয়ে সহজ ও নিশ্চিত সমাধান (Recommended)\n-- Run this in your Supabase SQL Editor to disable security checks and allow instantly:\nALTER TABLE public.design_library DISABLE ROW LEVEL SECURITY;\n\n-- Option 2: Alternative Public Policy / ব্যাকআপ পলিসি\nALTER TABLE public.design_library ENABLE ROW LEVEL SECURITY;\nDROP POLICY IF EXISTS "Public manage design_library" ON public.design_library;\nDROP POLICY IF EXISTS "Public read design_library" ON public.design_library;\nDROP POLICY IF EXISTS "Auth manage design_library" ON public.design_library;\nCREATE POLICY "Public manage design_library" ON public.design_library FOR ALL USING (true) WITH CHECK (true);`
        });
      } else {
        alert(err.message || 'Error submitting design library item.');
      }
    }
  };

  const startEditDesign = (item: DesignLibraryItem) => {
    setDesignForm({
      title: item.title,
      image_url: item.image_url
    });
    setActiveFormId(item.id);
    setFormMode('edit');
  };

  const deleteDesignItem = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this design library item?')) return;
    try {
      const client = getSupabase();
      const { error } = await client.from('design_library').delete().eq('id', id);
      if (error) throw error;
      fetchAllData();
    } catch (err: any) {
      console.error('Error deleting design library item:', err);
      if (err.code === '42501' || err.message?.includes('row-level security') || err.message?.includes('policy')) {
        setRlsError({
          action: 'deleting',
          table: 'design_library',
          message: err.message || 'Row Level Security policy violation',
          sql: `-- Option 1: 100% Guaranteed Fix / সবচেয়ে সহজ ও নিশ্চিত সমাধান (Recommended)\n-- Run this in your Supabase SQL Editor to disable security checks and allow instantly:\nALTER TABLE public.design_library DISABLE ROW LEVEL SECURITY;\n\n-- Option 2: Alternative Public Policy / ব্যাকআপ পলিসি\nALTER TABLE public.design_library ENABLE ROW LEVEL SECURITY;\nDROP POLICY IF EXISTS "Public manage design_library" ON public.design_library;\nDROP POLICY IF EXISTS "Public read design_library" ON public.design_library;\nDROP POLICY IF EXISTS "Auth manage design_library" ON public.design_library;\nCREATE POLICY "Public manage design_library" ON public.design_library FOR ALL USING (true) WITH CHECK (true);`
        });
      } else {
        alert(err.message || 'Error deleting design library item.');
      }
    }
  };


  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-deep"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Dynamic Navigation Tabs */}
      <div className="flex flex-wrap border-b border-emerald-deep/10 gap-2">
        <button 
          onClick={() => { setActiveTab('orders'); setFormMode('none'); }}
          className={`px-6 py-4 font-sans text-xs uppercase tracking-[0.2em] font-bold transition-all border-b-2 flex items-center gap-2 ${
            activeTab === 'orders' ? 'border-rose-gold text-emerald-deep' : 'border-transparent text-emerald-deep/30 hover:text-emerald-deep'
          }`}
        >
          <LayoutGrid size={16} /> Orders
        </button>

        <button 
          onClick={() => { setActiveTab('services'); setFormMode('none'); }}
          className={`px-6 py-4 font-sans text-xs uppercase tracking-[0.2em] font-bold transition-all border-b-2 flex items-center gap-2 ${
            activeTab === 'services' ? 'border-rose-gold text-emerald-deep' : 'border-transparent text-emerald-deep/30 hover:text-emerald-deep'
          }`}
        >
          <Sparkles size={16} /> Our Collection
        </button>

        <button 
          onClick={() => { setActiveTab('portfolio'); setFormMode('none'); }}
          className={`px-6 py-4 font-sans text-xs uppercase tracking-[0.2em] font-bold transition-all border-b-2 flex items-center gap-2 ${
            activeTab === 'portfolio' ? 'border-rose-gold text-emerald-deep' : 'border-transparent text-emerald-deep/30 hover:text-emerald-deep'
          }`}
        >
          <ImageIcon size={16} /> Recent Work
        </button>

        <button 
          onClick={() => { setActiveTab('library'); setFormMode('none'); }}
          className={`px-6 py-4 font-sans text-xs uppercase tracking-[0.2em] font-bold transition-all border-b-2 flex items-center gap-2 ${
            activeTab === 'library' ? 'border-rose-gold text-emerald-deep' : 'border-transparent text-emerald-deep/30 hover:text-emerald-deep'
          }`}
        >
          <BookOpen size={16} /> Mehadi Library
        </button>

        <button 
          onClick={() => { setActiveTab('settings'); setFormMode('none'); }}
          className={`px-6 py-4 font-sans text-xs uppercase tracking-[0.2em] font-bold transition-all border-b-2 flex items-center gap-2 ${
            activeTab === 'settings' ? 'border-rose-gold text-emerald-deep' : 'border-transparent text-emerald-deep/30 hover:text-emerald-deep'
          }`}
        >
          <Settings size={16} /> Site Config
        </button>
      </div>

      {/* API Key Connection Error Alert and Setup Form */}
      {apiKeyError && (
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-rose-50 border border-rose-200 p-8 rounded-3xl space-y-6 shadow-sm mb-6"
        >
          <div className="flex items-center gap-3 text-red-800 font-bold text-xl font-serif">
            <AlertCircle size={24} className="text-red-600 animate-pulse" /> Supabase Connection Error / ডাটাবেজ সংযোগে সমস্যা
          </div>
          <div className="text-red-800 text-sm space-y-4 font-sans leading-relaxed">
            <p className="font-semibold text-red-900">
              আপনার Supabase API Key অথবা Anon Key-টি অকার্যকর বা ভুল দেখাচ্ছে (Invalid API key)। 
              নিচে আপনার বর্তমান প্রজেক্টের সঠিক API Key ও URL প্রদান করে সংযোগ স্থাপন করুন:
            </p>
          </div>

          <form onSubmit={(e) => {
            e.preventDefault();
            setCustomSupabaseCredentials(supabaseUrlInput, supabaseAnonKeyInput);
            fetchAllData();
          }} className="space-y-4 bg-white/70 p-6 rounded-2xl border border-rose-100">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold text-red-900/70 uppercase tracking-widest mb-1.5 block">Supabase Project URL</label>
                <input 
                  type="text"
                  value={supabaseUrlInput}
                  onChange={(e) => setSupabaseUrlInput(e.target.value)}
                  placeholder="https://your-project.supabase.co"
                  className="w-full bg-white border border-red-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-rose-gold focus:border-transparent transition-all"
                  required
                />
              </div>
              <div>
                <label className="text-xs font-bold text-red-900/70 uppercase tracking-widest mb-1.5 block">Supabase Anon Key</label>
                <input 
                  type="text"
                  value={supabaseAnonKeyInput}
                  onChange={(e) => setSupabaseAnonKeyInput(e.target.value)}
                  placeholder="eyJhbGciOi..."
                  className="w-full bg-white border border-red-200 rounded-xl px-4 py-2.5 text-xs font-mono focus:outline-none focus:ring-2 focus:ring-rose-gold focus:border-transparent transition-all"
                  required
                />
              </div>
            </div>
            
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button 
                type="submit"
                className="bg-emerald-deep hover:bg-rose-gold text-white px-6 py-3 rounded-full font-bold text-sm transition-all shadow-md flex items-center gap-2 hover:scale-[1.02]"
              >
                <RefreshCw size={16} /> Update API Credentials & Retry (সংযোগ করুন)
              </button>
              <button 
                type="button"
                onClick={() => {
                  clearCustomSupabaseCredentials();
                  setSupabaseUrlInput('https://qmuczhbazdqepefdmffd.supabase.co');
                  setSupabaseAnonKeyInput('');
                  fetchAllData();
                }}
                className="text-xs text-red-700 hover:text-red-900 underline underline-offset-4 font-bold"
              >
                Reset to default (রিসেট করুন)
              </button>
            </div>
          </form>
        </motion.div>
      )}

      {/* RLS Policy Error Banner / আরএলএস পলিসি ত্রুটি */}
      {rlsError && (
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-rose-50 border border-rose-200 p-8 rounded-3xl space-y-6 shadow-sm"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3 text-rose-800 font-bold text-xl font-serif">
              <AlertCircle size={24} className="text-rose-600 animate-pulse" /> Row-Level Security Policy Error / আরএলএস পলিসি ত্রুটি
            </div>
            <button 
              type="button"
              onClick={() => setRlsError(null)}
              className="text-rose-800/40 hover:text-rose-800 text-xs font-bold font-sans uppercase tracking-wider"
              id="close-rls-banner"
            >
              Dismiss / বন্ধ করুন ✕
            </button>
          </div>
          
          <div className="text-rose-800 text-sm space-y-4 font-sans leading-relaxed">
            <p className="font-semibold text-rose-900">
              You encountered a database permission issue (RLS Policy violation) while trying to <strong>{rlsError.action}</strong> an item in the <strong>{rlsError.table}</strong> table. 
              <br />
              আপনার Supabase ডাটাবেজের সিকিউরিটি পলিসি (RLS) এই ডাটা সংরক্ষণের অনুমতি দিচ্ছে না। এটি সমাধান করতে নিচের সহজ নিয়ম অনুসরণ করুন:
            </p>
            
            <div className="bg-rose-100/50 p-4 rounded-2xl border border-rose-200 space-y-2">
              <span className="font-bold text-xs uppercase tracking-wider block">সহজ সমাধান করার নিয়ম:</span>
              <ol className="list-decimal pl-5 space-y-1.5 text-xs text-rose-900">
                <li>নিচের <strong>Copy Policy SQL</strong> বাটনে ক্লিক করে কোডটি কপি করুন।</li>
                <li>আপনার <a href="https://supabase.com" target="_blank" rel="noopener noreferrer" className="underline font-bold hover:text-rose-gold transition-colors font-sans">Supabase Dashboard</a> এ যান।</li>
                <li>বাম পাশের মেনু থেকে <strong>SQL Editor</strong> সিলেক্ট করুন।</li>
                <li><strong>New query</strong> ওপেন করে কপি করা সম্পূর্ণ কোডটি পেস্ট করুন এবং <strong>Run</strong> বাটনে চাপ দিন।</li>
                <li>রান করার পর এই নোটিশটি বন্ধ করে পুনরায় চেষ্টা করুন!</li>
              </ol>
            </div>
          </div>
          
          <div className="relative group">
            <pre className="bg-white/90 p-6 rounded-2xl text-[11px] font-mono overflow-x-auto border border-rose-100 max-h-[220px] shadow-inner text-rose-900 leading-tight">
              {rlsError.sql}
            </pre>
            <button 
              type="button"
              onClick={() => {
                navigator.clipboard.writeText(rlsError.sql);
                alert("SQL copied to clipboard! কোডটি কপি করা হয়েছে।");
              }}
              className="absolute top-4 right-4 bg-rose-600 hover:bg-rose-700 text-white px-4 py-2 rounded-lg font-bold text-xs transition-colors shadow-lg flex items-center gap-1.5"
            >
              Copy Policy SQL (কপি করুন)
            </button>
          </div>
        </motion.div>
      )}

      {/* Setup Required banner */}
      {needsSetup && (
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-amber-50/95 border border-amber-200 p-8 rounded-3xl space-y-6 shadow-sm"
        >
          <div className="flex items-center gap-3 text-amber-805 font-bold text-xl font-serif">
            <AlertCircle size={24} className="text-amber-600" /> Supabase Database Update Required / ডাটাবেজ আপডেট প্রয়োজন
          </div>
          <div className="text-amber-800 text-sm space-y-4 font-sans leading-relaxed">
            <p>
              আপনার Supabase প্রজেক্টে <strong>Our Collection, Our Recent Work, এবং Mehadi Design Library</strong> এর ডাটা রাখার জন্য কোনো টেবিল 
              তৈরি করা নেই। এই কারণে টেবিলগুলো খুঁজে পাওয়া যাচ্ছে না (PGRST205)। 
            </p>
            <div className="bg-amber-100/50 p-4 rounded-2xl border border-amber-200 space-y-2">
              <span className="font-bold text-xs uppercase tracking-wider block">সহজ সমাধান করার নিয়ম:</span>
              <ol className="list-decimal pl-5 space-y-1.5 text-xs text-amber-900">
                <li>প্রথমে নিচের <strong>Copy SQL</strong> বাটনে ক্লিক করে কোডটি কপি করুন।</li>
                <li>আপনার <a href="https://supabase.com" target="_blank" rel="noopener noreferrer" className="underline font-bold hover:text-rose-gold transition-colors">Supabase Dashboard</a> এ যান।</li>
                <li>বাম পাশের মেনু থেকে <strong>SQL Editor</strong> সিলেক্ট করুন।</li>
                <li><strong>New query</strong> এ ক্লিক করে কপি করা সম্পূর্ণ কোডটি পেস্ট (paste) করুন।</li>
                <li>সবশেষে <strong>Run</strong> বাটনে ক্লিক করে রান করুন।</li>
                <li>রান করার পর নিচে এসে <strong>I've run the script, check again</strong> বাটনে চাপ দিন।</li>
              </ol>
            </div>
          </div>
          <div className="relative group">
            <pre className="bg-white/90 p-6 rounded-2xl text-[11px] font-mono overflow-x-auto border border-amber-200 max-h-[300px] shadow-inner text-amber-900 leading-tight">
              {sqlScript}
            </pre>
            <button 
              type="button"
              onClick={() => {
                navigator.clipboard.writeText(sqlScript);
                alert("SQL Script copied to clipboard! কোডটি কপি করা হয়েছে।");
              }}
              className="absolute top-4 right-4 bg-emerald-deep hover:bg-rose-gold text-white px-4 py-2 rounded-lg font-bold text-xs transition-colors shadow-lg flex items-center gap-1.5"
            >
              Copy SQL (কপি করুন)
            </button>
          </div>
          <div className="flex items-center gap-4 pt-2">
            <button 
              type="button"
              onClick={fetchAllData}
              className="bg-emerald-deep hover:bg-rose-gold text-white px-6 py-3 rounded-full font-bold transition-all flex items-center gap-2 shadow-md hover:scale-[1.02]"
            >
              <RefreshCw size={18} className={refreshing ? 'animate-spin' : ''} />
              I've run the script, check again (আমি রান করেছি, আবার চেক করুন)
            </button>
          </div>
        </motion.div>
      )}

      <AnimatePresence mode="wait">
        {/* ----------------- Tab: Orders ----------------- */}
        {activeTab === 'orders' && (
          <motion.div 
            key="orders"
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 10 }}
            className="space-y-8"
          >
            <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between border-b border-emerald-deep/10 pb-6">
              <div>
                <h3 className="font-serif text-3xl text-emerald-deep">
                  {orderFilter === 'active' && 'Active Orders / চলতি অর্ডারসমূহ'}
                  {orderFilter === 'history' && 'Order History / অর্ডার ইতিহাস'}
                  {orderFilter === 'all' && 'All Orders / সকল অর্ডার'}
                </h3>
                <p className="text-emerald-deep/60">
                  {orderFilter === 'active' && 'Manage your active product and service requests'}
                  {orderFilter === 'history' && 'View completed or cancelled orders history'}
                  {orderFilter === 'all' && 'View all registers list'}
                </p>
              </div>

              <div className="flex items-center gap-3">
                <div className="flex bg-warm-beige/30 border border-emerald-deep/10 p-1.5 rounded-full">
                  <button
                    onClick={() => setOrderFilter('active')}
                    className={`px-4 py-2 rounded-full font-bold text-xs uppercase tracking-wider transition-all duration-300 flex items-center gap-1.5 cursor-pointer ${
                      orderFilter === 'active'
                        ? 'bg-emerald-deep text-white shadow-sm'
                        : 'text-emerald-deep/60 hover:text-emerald-deep'
                    }`}
                  >
                    <Clock size={12} />
                    <span>চলতি ({orders.filter(o => {
                      const s = o.status || 'pending';
                      return s !== 'delivered' && s !== 'cancelled';
                    }).length})</span>
                  </button>

                  <button
                    onClick={() => setOrderFilter('history')}
                    className={`px-4 py-2 rounded-full font-bold text-xs uppercase tracking-wider transition-all duration-300 flex items-center gap-1.5 cursor-pointer ${
                      orderFilter === 'history'
                        ? 'bg-rose-gold text-white shadow-sm'
                        : 'text-emerald-deep/60 hover:text-emerald-deep'
                    }`}
                  >
                    <CheckCircle2 size={12} />
                    <span>ইতিহাস ({orders.filter(o => {
                      const s = o.status || 'pending';
                      return s === 'delivered' || s === 'cancelled';
                    }).length})</span>
                  </button>

                  <button
                    onClick={() => setOrderFilter('all')}
                    className={`px-4 py-2 rounded-full font-bold text-xs uppercase tracking-wider transition-all duration-300 flex items-center gap-1.5 cursor-pointer ${
                      orderFilter === 'all'
                        ? 'bg-emerald-deep/10 text-emerald-deep shadow-sm'
                        : 'text-emerald-deep/60 hover:text-emerald-deep'
                    }`}
                  >
                    <Package size={12} />
                    <span>সকল ({orders.length})</span>
                  </button>
                </div>

                <button 
                  onClick={fetchAllData}
                  disabled={refreshing}
                  className="p-3 bg-emerald-deep/5 rounded-full hover:bg-emerald-deep/10 transition-colors text-emerald-deep disabled:opacity-50 shrink-0"
                  title="Refresh orders/রিফ্রেশ করুন"
                >
                  <RefreshCw size={20} className={refreshing ? 'animate-spin' : ''} />
                </button>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="border-b border-emerald-deep/10 text-left">
                    <th className="py-4 px-4 font-sans text-xs uppercase tracking-widest text-emerald-deep/40 w-12"></th>
                    <th className="py-4 px-4 font-sans text-xs uppercase tracking-widest text-emerald-deep/40">Product</th>
                    <th className="py-4 px-4 font-sans text-xs uppercase tracking-widest text-emerald-deep/40">Customer</th>
                    <th className="py-4 px-4 font-sans text-xs uppercase tracking-widest text-emerald-deep/40">Date</th>
                    <th className="py-4 px-4 font-sans text-xs uppercase tracking-widest text-emerald-deep/40">Status</th>
                    <th className="py-4 px-4 font-sans text-xs uppercase tracking-widest text-emerald-deep/40">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredOrders.map((order) => {
                    const isExpanded = !!expandedOrders[order.id];
                    return (
                      <React.Fragment key={order.id}>
                        <motion.tr 
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          className={`border-b border-emerald-deep/5 cursor-pointer transition-colors duration-200 select-none ${isExpanded ? 'bg-emerald-deep/[0.03]' : 'hover:bg-emerald-deep/5'}`}
                          onClick={() => setExpandedOrders(prev => ({ ...prev, [order.id]: !prev[order.id] }))}
                        >
                          <td className="py-4 px-4 w-12 text-center">
                            <div className="flex items-center justify-center">
                              {isExpanded ? (
                                <ChevronUp size={16} className="text-rose-gold transition-all duration-300 animate-none" />
                              ) : (
                                <ChevronDown size={16} className="text-emerald-deep/60 transition-all duration-300 animate-none" />
                              )}
                            </div>
                          </td>
                          <td className="py-4 px-4">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 bg-warm-beige rounded-lg flex items-center justify-center">
                                <Package size={20} className="text-rose-gold" />
                              </div>
                              <div>
                                <p className="font-medium text-emerald-deep">{order.product_name}</p>
                                <p className="text-xs text-emerald-deep/40">Qty: {order.quantity}</p>
                              </div>
                            </div>
                          </td>
                          <td className="py-4 px-4">
                            <div className="flex flex-col gap-0.5">
                              <p className="font-medium text-emerald-deep">{order.customer_name}</p>
                              <p className="text-xs text-emerald-deep/40">{order.phone_number}</p>
                              {!isExpanded && (
                                <>
                                  <p className="text-[10px] text-emerald-deep/30 truncate max-w-[150px]" title={order.address}>{order.address}</p>
                                  {order.notes && (
                                    <div className="mt-1 bg-rose-gold/5 border border-rose-gold/15 rounded-lg px-1.5 py-0.5 text-[9px] text-rose-gold/90 font-medium inline-block w-fit">
                                      Has special instructions
                                    </div>
                                  )}
                                </>
                              )}
                            </div>
                          </td>
                          <td className="py-4 px-4">
                            <div className="flex items-center gap-2 text-emerald-deep/60 text-sm">
                              <Clock size={14} />
                              {new Date(order.created_at).toLocaleDateString()}
                            </div>
                          </td>
                          <td className="py-4 px-4">
                            <select 
                              value={order.status || 'pending'}
                              onChange={(e) => {
                                e.stopPropagation();
                                updateOrderStatus(order.id, e.target.value);
                              }}
                              onClick={(e) => e.stopPropagation()}
                              className={`bg-transparent border-none text-sm font-medium focus:ring-0 cursor-pointer p-0 ${
                                (order.status || 'pending') === 'pending' ? 'text-amber-500' :
                                (order.status || 'pending') === 'confirmed' ? 'text-blue-500' :
                                (order.status || 'pending') === 'shipped' ? 'text-purple-500' :
                                (order.status || 'pending') === 'delivered' ? 'text-emerald-600 font-semibold' :
                                'text-rose-500 font-semibold'
                              }`}
                            >
                              <option value="pending" className="text-amber-600 font-sans">Pending / পেন্ডিং</option>
                              <option value="confirmed" className="text-blue-600 font-sans">Confirmed / নিশ্চিত</option>
                              <option value="shipped" className="text-purple-600 font-sans">Shipped / পাঠানো হয়েছে</option>
                              <option value="delivered" className="text-emerald-600 font-semibold font-sans">Delivered / ডেলিভারড</option>
                              <option value="cancelled" className="text-red-500 font-semibold font-sans">Cancelled / বাতিল</option>
                            </select>
                          </td>
                          <td className="py-4 px-4">
                            <div className="flex items-center gap-2">
                              <button 
                                onClick={(e) => {
                                  e.stopPropagation();
                                  deleteOrder(order.id);
                                }}
                                className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                                title="Delete Order"
                              >
                                <Trash2 size={18} />
                              </button>
                            </div>
                          </td>
                        </motion.tr>

                        {isExpanded && (
                          <tr className="bg-emerald-deep/[0.01]">
                            <td colSpan={6} className="py-2 px-6 pb-6 border-b border-emerald-deep/10">
                              <motion.div
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                transition={{ duration: 0.2 }}
                                className="bg-white/95 border border-emerald-deep/15 rounded-3xl p-6 shadow-sm overflow-hidden"
                              >
                                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 pb-4 border-b border-emerald-deep/5">
                                  <div>
                                    <h4 className="font-serif text-lg font-bold text-emerald-deep flex items-center gap-2">
                                      <FileText size={18} className="text-rose-gold animate-none" />
                                      Order &amp; Booking Details / সম্পূর্ণ বিবরণ
                                    </h4>
                                    <p className="text-[10px] text-emerald-deep/45 font-mono mt-1">Order Registration ID: {order.id}</p>
                                  </div>
                                  <div className="flex flex-wrap items-center gap-2">
                                    <button
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        const text = `Order details:
-----------------------------
Product: ${order.product_name}
Qty: ${order.quantity}
Customer: ${order.customer_name}
Phone: ${order.phone_number}
Address: ${order.address}
Instructions/Notes: ${order.notes || 'None'}`;
                                        navigator.clipboard.writeText(text);
                                        setCopiedOrderId(order.id);
                                        setTimeout(() => setCopiedOrderId(null), 1500);
                                      }}
                                      className="px-3.5 py-1.5 bg-emerald-deep/5 hover:bg-emerald-deep/10 text-emerald-deep rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer"
                                    >
                                      {copiedOrderId === order.id ? (
                                        <>
                                          <Check size={13} className="text-emerald-deep" />
                                          <span>Copied! / কপি হয়েছে</span>
                                        </>
                                      ) : (
                                        <>
                                          <Copy size={13} />
                                          <span>Copy All / পুরোটা কপি করুন</span>
                                        </>
                                      )}
                                    </button>
                                    <a
                                      href={`https://wa.me/88${order.phone_number.replace(/[^0-9]/g, '')}`}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      onClick={(e) => e.stopPropagation()}
                                      className="px-3.5 py-1.5 bg-green-500/10 hover:bg-green-500/20 text-green-600 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5"
                                    >
                                      WhatsApp
                                    </a>
                                  </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
                                  {/* Column 1: Client details */}
                                  <div className="space-y-3">
                                    <span className="text-[10px] uppercase font-bold tracking-wider text-rose-gold/80 block">Client Contact</span>
                                    <div className="space-y-2 bg-warm-beige/20 p-4 rounded-2xl border border-emerald-deep/5">
                                      <div className="flex items-center gap-2.5 text-sm text-emerald-deep">
                                        <User size={15} className="text-emerald-deep/45 shrink-0 animate-none" />
                                        <span className="font-semibold">{order.customer_name}</span>
                                      </div>
                                      <div className="flex items-center gap-2.5 text-sm text-emerald-deep">
                                        <Phone size={15} className="text-emerald-deep/45 shrink-0 animate-none" />
                                        <span className="font-mono">{order.phone_number}</span>
                                        <button
                                          onClick={(e) => {
                                            e.stopPropagation();
                                            navigator.clipboard.writeText(order.phone_number);
                                          }}
                                          className="text-rose-gold p-1 hover:bg-rose-gold/10 rounded-md transition-all ml-auto shrink-0 cursor-pointer"
                                          title="Copy Phone Number"
                                        >
                                          <Copy size={11} />
                                        </button>
                                      </div>
                                      <div className="flex items-center gap-2.5 text-[11px] text-emerald-deep/60 pt-2 border-t border-emerald-deep/5">
                                        <Clock size={14} className="text-emerald-deep/30 shrink-0" />
                                        <span>Placed At: {new Date(order.created_at).toLocaleString()}</span>
                                      </div>
                                    </div>
                                  </div>

                                  {/* Column 2: Venue / Delivery Location */}
                                  <div className="space-y-3">
                                    <div className="flex justify-between items-center">
                                      <span className="text-[10px] uppercase font-bold tracking-wider text-rose-gold/80">Location / Address</span>
                                      <button
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          navigator.clipboard.writeText(order.address);
                                        }}
                                        className="text-[11px] text-rose-gold hover:underline flex items-center gap-1 cursor-pointer"
                                      >
                                        <Copy size={11} />
                                        Copy
                                      </button>
                                    </div>
                                    <div className="bg-warm-beige/20 p-4 rounded-2xl border border-emerald-deep/5 text-sm text-emerald-deep/80 flex gap-2.5 min-h-[100px] h-[calc(100%-1.75rem)]">
                                      <MapPin size={16} className="text-rose-gold mt-0.5 shrink-0 animate-none" />
                                      <p className="leading-relaxed font-light">{order.address}</p>
                                    </div>
                                  </div>

                                  {/* Column 3: Special Request Notes */}
                                  <div className="space-y-3">
                                    <div className="flex justify-between items-center">
                                      <span className="text-[10px] uppercase font-bold tracking-wider text-rose-gold/80">Requests &amp; Notes</span>
                                      {order.notes && (
                                        <button
                                          onClick={(e) => {
                                            e.stopPropagation();
                                            navigator.clipboard.writeText(order.notes || '');
                                          }}
                                          className="text-[11px] text-rose-gold hover:underline flex items-center gap-1 cursor-pointer"
                                        >
                                          <Copy size={11} />
                                          Copy
                                        </button>
                                      )}
                                    </div>
                                    <div className="bg-rose-gold/[0.03] p-4 rounded-2xl border border-rose-gold/15 text-sm text-emerald-deep/80 min-h-[100px] h-[calc(100%-1.75rem)]">
                                      {order.notes ? (
                                        <p className="leading-relaxed whitespace-pre-line font-light">{order.notes}</p>
                                      ) : (
                                        <p className="text-emerald-deep/30 italic text-xs font-light">No special instructions or custom request notes were provided by client.</p>
                                      )}
                                    </div>
                                  </div>
                                </div>
                              </motion.div>
                            </td>
                          </tr>
                        )}
                      </React.Fragment>
                    );
                  })}
                </tbody>
              </table>
              
              {filteredOrders.length === 0 && (
                <div className="py-20 text-center">
                  <AlertCircle size={48} className="mx-auto text-emerald-deep/10 mb-4" />
                  <p className="text-emerald-deep/40 font-light truncate">
                    {orderFilter === 'active' && 'No active orders found / কোনো চলতি অর্ডার নেই।'}
                    {orderFilter === 'history' && 'No order history found / কোনো অর্ডার ইতিহাস নেই।'}
                    {orderFilter === 'all' && 'No orders found / কোনো অর্ডার পাওয়া যায়নি।'}
                  </p>
                </div>
              )}
            </div>
          </motion.div>
        )}

        {/* ----------------- Tab: Services ----------------- */}
        {activeTab === 'services' && (
          <motion.div 
            key="services"
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 10 }}
            className="space-y-8"
          >
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h3 className="font-serif text-3xl text-emerald-deep">Curated Services</h3>
                <p className="text-emerald-deep/60">Customize the services shown in 'Our Collection' section</p>
              </div>
              <button 
                onClick={() => {
                  if (formMode === 'add') {
                    setFormMode('none');
                  } else {
                    setServiceForm({ title: '', category: '', image_url: '', price: '', type: 'product' });
                    setFormMode('add');
                  }
                }}
                className="bg-emerald-deep text-white px-6 py-3 rounded-full font-bold hover:bg-rose-gold transition-all duration-300 flex items-center gap-2 self-start"
              >
                {formMode === 'add' ? 'Close Form' : <><Plus size={16} /> Add New Service</>}
              </button>
            </div>

            {/* Premium Image Upload & Management Companion Card */}
            <div className="bg-emerald-deep/[0.03] border border-emerald-deep/10 p-6 rounded-[2rem] space-y-3 shadow-sm feedback-buddy">
              <p className="text-sm text-emerald-deep font-bold flex items-center gap-2">
                <Sparkles size={16} className="text-rose-gold animate-pulse" /> 
                ছবি আপলোড, এডিট এবং ডিলিট করার নিয়মাবলী (Image Upload Guide)
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs text-emerald-deep/75 leading-relaxed">
                <div className="space-y-1">
                  <p className="font-semibold text-emerald-deep">১. নতুন ছবি আপলোড এবং এডিট:</p>
                  <p>সার্ভিস যোগ বা এডিট করার সময় <strong>"Computer Upload"</strong> সিলেক্ট করে ছবি আপলোড করুন। এটি স্বয়ংক্রিয়ভাবে কম্প্রেস ও রিসাইজ হয়ে ক্লাউডে বা ডাটাবেজে ডাটা-ইউআরএল হিসেবে ইনস্ট্যান্টলি সেভ হবে এবং হোমপেজে রিয়েল-টাইম চলে যাবে!</p>
                </div>
                <div className="space-y-1">
                  <p className="font-semibold text-emerald-deep">২. মুছে ফেলা ও মডিফাই করা:</p>
                  <p>যেকোনো অপ্রয়োজনীয় সার্ভিস চিরতরে বাদ দিতে চাইলে নিচে প্রতিটি পণ্যের ট্র্যাশ আইকনে ক্লিক করে <strong>"Delete"</strong> করতে পারেন। এছাড়া নাম বা দাম বদলাতে <strong>"Edit"</strong> বাটনে ক্লিক করুন।</p>
                </div>
              </div>
            </div>

            {/* Service Form Panel */}
            {formMode !== 'none' && (
              <motion.div 
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-warm-beige/30 border border-emerald-deep/5 p-6 rounded-3xl animate-none"
              >
                <form onSubmit={handleServiceSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="text-xs font-bold text-emerald-deep/80 uppercase tracking-widest mb-1.5 block">Service Title</label>
                      <input 
                        type="text"
                        value={serviceForm.title}
                        onChange={e => setServiceForm({...serviceForm, title: e.target.value})}
                        className="w-full bg-white border-none rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-rose-gold transition-all"
                        placeholder="e.g. Organic Henna Cones"
                        required
                      />
                    </div>
                    <div>
                      <label className="text-xs font-bold text-emerald-deep/80 uppercase tracking-widest mb-1.5 block">Category / Caption</label>
                      <input 
                        type="text"
                        value={serviceForm.category}
                        onChange={e => setServiceForm({...serviceForm, category: e.target.value})}
                        className="w-full bg-white border-none rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-rose-gold transition-all"
                        placeholder="e.g. Botanical Beauty"
                        required
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="text-xs font-bold text-emerald-deep/80 uppercase tracking-widest mb-1.5 block">Price (দাম, উদা: ১৫০ TK বা ৩০০০ TK)</label>
                      <input 
                        type="text"
                        value={serviceForm.price}
                        onChange={e => setServiceForm({...serviceForm, price: e.target.value})}
                        className="w-full bg-white border-none rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-rose-gold transition-all"
                        placeholder="e.g. 150 TK"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-bold text-emerald-deep/80 uppercase tracking-widest mb-1.5 block">Item Type (পণ্য অথবা বুকিং)</label>
                      <select 
                        value={serviceForm.type}
                        onChange={e => setServiceForm({...serviceForm, type: e.target.value})}
                        className="w-full bg-white border-none rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-rose-gold transition-all"
                        required
                      >
                        <option value="product">Product (পণ্য - অর্ডার করার জন্য)</option>
                        <option value="booking">Booking (বুকিং - অ্যাপয়েন্টমেন্টের জন্য)</option>
                      </select>
                    </div>
                  </div>
                  <div>
                    <ImageUploadField
                      label="Service Image (ছবির লিংক বা ফাইল)"
                      value={serviceForm.image_url}
                      onChange={val => setServiceForm({...serviceForm, image_url: val})}
                      placeholder="e.g. /src/assets/images/... or https://"
                      required
                    />
                  </div>
                  <div className="flex justify-end gap-3 pt-2">
                    <button 
                      type="button" 
                      onClick={() => setFormMode('none')}
                      className="px-6 py-3 border border-emerald-deep/10 rounded-full font-bold text-emerald-deep hover:bg-emerald-deep/5 transition-colors"
                    >
                      Cancel
                    </button>
                    <button 
                      type="submit" 
                      className="px-8 py-3 bg-emerald-deep text-white rounded-full font-bold hover:bg-rose-gold transition-colors flex items-center gap-2"
                    >
                      <Save size={16} /> {formMode === 'edit' ? 'Update Service' : 'Create Service'}
                    </button>
                  </div>
                </form>
              </motion.div>
            )}

            {/* Services Grid List */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {services.map((service) => (
                <div key={service.id} className="bg-white border border-emerald-deep/5 rounded-[2rem] overflow-hidden group shadow-sm flex flex-col justify-between">
                  {/* Image Preview */}
                  <div className="relative aspect-video bg-warm-beige overflow-hidden">
                    <img 
                      src={service.image_url} 
                      alt={service.title} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-4 left-4 flex flex-wrap gap-1.5">
                      <div className="bg-emerald-deep text-white text-[10px] uppercase tracking-wider px-2.5 py-1 rounded-full font-bold">
                        {service.category}
                      </div>
                      <div className="bg-rose-gold text-emerald-deep text-[10px] uppercase tracking-wider px-2.5 py-1 rounded-full font-bold">
                        {service.type === 'booking' ? 'Booking' : 'Product'}
                      </div>
                    </div>
                  </div>
                  {/* Content & Actions */}
                  <div className="p-6 space-y-4">
                    <div className="flex justify-between items-start gap-2">
                      <h4 className="font-serif text-lg text-emerald-deep font-bold leading-tight">{service.title}</h4>
                      {service.price && (
                        <span className="shrink-0 bg-emerald-deep/5 text-rose-gold font-mono text-xs font-bold px-2 py-1 rounded-md">
                          {service.price}
                        </span>
                      )}
                    </div>
                    <div className="flex justify-between items-center pt-2 border-t border-emerald-deep/5">
                      <button 
                        onClick={() => startEditService(service)}
                        className="text-xs py-2 px-4 rounded-xl border border-emerald-deep/10 text-emerald-deep font-bold flex items-center gap-1.5 hover:bg-emerald-deep/5 transition-all"
                      >
                        <Edit size={12} /> Edit
                      </button>
                      <button 
                        onClick={() => deleteService(service.id)}
                        className="text-xs py-2 px-4 rounded-xl bg-red-50 text-red-600 font-bold flex items-center gap-1.5 hover:bg-red-100 transition-all"
                      >
                        <Trash2 size={12} /> Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
              
              {services.length === 0 && (
                <div className="col-span-full py-20 text-center border-2 border-dashed border-emerald-deep/10 rounded-3xl">
                  <Package size={48} className="mx-auto text-emerald-deep/10 mb-4" />
                  <p className="text-emerald-deep/45 font-medium mb-1">No services created yet.</p>
                  <p className="text-xs text-emerald-deep/30">Once setup is complete, you can click "Add New Service" above to build your catalog.</p>
                </div>
              )}
            </div>
          </motion.div>
        )}

        {/* ----------------- Tab: Portfolio (Recent Work) ----------------- */}
        {activeTab === 'portfolio' && (
          <motion.div 
            key="portfolio"
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 10 }}
            className="space-y-8"
          >
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h3 className="font-serif text-3xl text-emerald-deep">Recent Work Portfolio</h3>
                <p className="text-emerald-deep/60">Customize the images displayed in 'Our Recent Work' gallery</p>
              </div>
              <button 
                onClick={() => {
                  if (formMode === 'add') {
                    setFormMode('none');
                  } else {
                    setPortfolioForm({ title: '', image_url: '' });
                    setFormMode('add');
                  }
                }}
                className="bg-emerald-deep text-white px-6 py-3 rounded-full font-bold hover:bg-rose-gold transition-all duration-300 flex items-center gap-2 self-start"
              >
                {formMode === 'add' ? 'Close Form' : <><Plus size={16} /> Add Portfolio Photo</>}
              </button>
            </div>

            {/* Premium Photo Upload & Management Companion Card */}
            <div className="bg-emerald-deep/[0.03] border border-emerald-deep/10 p-6 rounded-[2rem] space-y-3 shadow-sm feedback-buddy">
              <p className="text-sm text-emerald-deep font-bold flex items-center gap-2">
                <Sparkles size={16} className="text-rose-gold animate-pulse" /> 
                পোর্টফলিও ছবি সংযোজন ও মুছে ফেলার নিয়মাবলী (Portfolio Management Guide)
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs text-emerald-deep/75 leading-relaxed font-sans">
                <div className="space-y-1">
                  <p className="font-semibold text-emerald-deep">১. নতুন পোর্টফলিও ছবি যুক্ত ও এডিট করা:</p>
                  <p>আপনার সাম্প্রতিক কাজের ছবি যুক্ত করতে <strong>"Add Portfolio Photo"</strong> বাটনে ট্যাপ করুন। এরপর টাইটেল লিখে <strong>"Computer Upload"</strong> বাটনের মাধ্যমে সরাসরি নিজের ফোন বা পিসি থেকে মেহেন্দি বা সেলাইয়ের কাজের ছবি আপলোড করে সেভ করতে পারবেন।</p>
                </div>
                <div className="space-y-1">
                  <p className="font-semibold text-emerald-deep">২. ছবি এডিট ও রিমুভ করা:</p>
                  <p>নিচের গ্যালারিতে যেকোনো ছবির ওপর মাউস রাখলে বা টাচ করলে <strong>Edit (পেন্সিল)</strong> এবং <strong>Delete (ট্র্যাশ)</strong> আইকন দৃশ্যমান হবে। সেখান থেকে আপনি তাৎক্ষণিক পরিবর্তন বা ডিলিট করতে পারবেন!</p>
                </div>
              </div>
            </div>

            {/* Portfolio Form Panel */}
            {formMode !== 'none' && (
              <motion.div 
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-warm-beige/30 border border-emerald-deep/5 p-6 rounded-3xl"
              >
                <form onSubmit={handlePortfolioSubmit} className="space-y-6">
                  <div>
                    <label className="text-xs font-bold text-emerald-deep/80 uppercase tracking-widest mb-2 block">Photo Caption / Name (Optional)</label>
                    <input 
                      type="text"
                      value={portfolioForm.title}
                      onChange={e => setPortfolioForm({...portfolioForm, title: e.target.value})}
                      className="w-full bg-white border-none rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-rose-gold transition-all"
                      placeholder="e.g. Bridal Floral Set"
                    />
                  </div>
                  <div>
                    <ImageUploadField
                      label="Portfolio Image (ছবির লিংক বা ফাইল)"
                      value={portfolioForm.image_url}
                      onChange={val => setPortfolioForm({...portfolioForm, image_url: val})}
                      placeholder="e.g. /src/assets/images/... or https://"
                      required
                    />
                  </div>
                  <div className="flex justify-end gap-3 pt-2">
                    <button 
                      type="button" 
                      onClick={() => setFormMode('none')}
                      className="px-6 py-3 border border-emerald-deep/10 rounded-full font-bold text-emerald-deep hover:bg-emerald-deep/5 transition-colors"
                    >
                      Cancel
                    </button>
                    <button 
                      type="submit" 
                      className="px-8 py-3 bg-emerald-deep text-white rounded-full font-bold hover:bg-rose-gold transition-colors flex items-center gap-2"
                    >
                      <Save size={16} /> {formMode === 'edit' ? 'Update Photo' : 'Add Photo'}
                    </button>
                  </div>
                </form>
              </motion.div>
            )}

            {/* Portfolio Grid List */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {portfolio.map((item) => (
                <div key={item.id} className="relative aspect-[4/3] rounded-[2rem] overflow-hidden group shadow` bg-warm-beige border border-emerald-deep/5">
                  <img 
                    src={item.image_url} 
                    alt={item.title || 'Portfolio Work'} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  {/* Edit/Delete Overlay */}
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-between p-4">
                    <span className="text-white text-xs font-semibold truncate bg-black/40 px-3 py-1.5 rounded-full inline-block self-start">
                      {item.title || 'Untitled Work'}
                    </span>
                    <div className="flex gap-2 self-end">
                      <button 
                        onClick={() => startEditPortfolio(item)}
                        className="bg-white text-emerald-deep p-2 rounded-xl font-bold text-xs hover:bg-rose-gold hover:text-white transition-colors flex items-center gap-1"
                        title="Edit Item"
                      >
                        <Edit size={14} />
                      </button>
                      <button 
                        onClick={() => deletePortfolioItem(item.id)}
                        className="bg-red-500 text-white p-2 rounded-xl font-bold text-xs hover:bg-red-600 transition-colors flex items-center gap-1"
                        title="Delete Item"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
              
              {portfolio.length === 0 && (
                <div className="col-span-full py-20 text-center border-2 border-dashed border-emerald-deep/10 rounded-3xl">
                  <ImageIcon size={48} className="mx-auto text-emerald-deep/10 mb-4" />
                  <p className="text-emerald-deep/45 font-medium mb-1">No portfolio photos created yet.</p>
                  <p className="text-xs text-emerald-deep/30">Click "Add Portfolio Photo" to showcase your gorgeous creations.</p>
                </div>
              )}
            </div>
          </motion.div>
        )}

        {/* ----------------- Tab: Mehadi Design Library ----------------- */}
        {activeTab === 'library' && (
          <motion.div 
            key="library"
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 10 }}
            className="space-y-8"
          >
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h3 className="font-serif text-3xl text-emerald-deep">Mehadi Design Library</h3>
                <p className="text-emerald-deep/60">Customize posts and captions inside 'Mehadi Design Library'</p>
              </div>
              <button 
                onClick={() => {
                  if (formMode === 'add') {
                    setFormMode('none');
                  } else {
                    setDesignForm({ title: '', image_url: '' });
                    setFormMode('add');
                  }
                }}
                className="bg-emerald-deep text-white px-6 py-3 rounded-full font-bold hover:bg-rose-gold transition-all duration-300 flex items-center gap-2 self-start"
              >
                {formMode === 'add' ? 'Close Form' : <><Plus size={16} /> Add New Design</>}
              </button>
            </div>

            {/* Premium Design Uploader & Management Companion Card */}
            <div className="bg-emerald-deep/[0.03] border border-emerald-deep/10 p-6 rounded-[2rem] space-y-3 shadow-sm feedback-buddy">
              <p className="text-sm text-emerald-deep font-bold flex items-center gap-2">
                <Sparkles size={16} className="text-rose-gold animate-pulse" /> 
                মেহেন্দি ক্যাটালগ ও নতুন ডিজাইন কন্ট্রোল গাইড (Mehadi Lookbook Control Guide)
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs text-emerald-deep/75 leading-relaxed font-sans">
                <div className="space-y-1">
                  <p className="font-semibold text-emerald-deep">১. নতুন মেহেন্দি ডিজাইন আপলোড করা:</p>
                  <p>আপনার ক্যাটালগে নতুন কোনো ডিজাইন সাজাতে <strong>"Add New Design"</strong> বাটনে ক্লিক করে টাইটেল ও ছবি আপলোড করতে পারবেন। ক্যানভাস কম্প্রেসার প্রতিটি ফাইলকে হালকা ও ফাস্ট-লোডিং করে ডাটাবেজে স্টোর করে নেয়!</p>
                </div>
                <div className="space-y-1">
                  <p className="font-semibold text-emerald-deep">২. ডিজাইন পরিবর্তন ও ডিলিট করা:</p>
                  <p>নিচে ক্যাটালগের লিস্টের ডিজাইনগুলোর ওপর টাচ বা হোভার করলে এডিট বা ডিলিট অপশন আসবে। <strong>Edit</strong> বাটনে ক্লিক করে আপনি মুহূর্তেই ছবি বা ক্যাটালগের নাম পাল্টে আপডেট করতে পারবেন এবং ডিলিট করে দিতে পারবেন।</p>
                </div>
              </div>
            </div>

            {/* Design Form Panel */}
            {formMode !== 'none' && (
              <motion.div 
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-warm-beige/30 border border-emerald-deep/5 p-6 rounded-3xl animate-none"
              >
                <form onSubmit={handleDesignSubmit} className="space-y-6">
                  <div>
                    <label className="text-xs font-bold text-emerald-deep/80 uppercase tracking-widest mb-2 block">Design Title</label>
                    <input 
                      type="text"
                      value={designForm.title}
                      onChange={e => setDesignForm({...designForm, title: e.target.value})}
                      className="w-full bg-white border-none rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-rose-gold transition-all"
                      placeholder="e.g. Traditional Mandalas"
                      required
                    />
                  </div>
                  <div>
                    <ImageUploadField
                      label="Design Image (ছবির লিংক বা ফাইল)"
                      value={designForm.image_url}
                      onChange={val => setDesignForm({...designForm, image_url: val})}
                      placeholder="e.g. /src/assets/images/... or https://"
                      required
                    />
                  </div>
                  <div className="flex justify-end gap-3 pt-2">
                    <button 
                      type="button" 
                      onClick={() => setFormMode('none')}
                      className="px-6 py-3 border border-emerald-deep/10 rounded-full font-bold text-emerald-deep hover:bg-emerald-deep/5 transition-colors"
                    >
                      Cancel
                    </button>
                    <button 
                      type="submit" 
                      className="px-8 py-3 bg-emerald-deep text-white rounded-full font-bold hover:bg-rose-gold transition-colors flex items-center gap-2"
                    >
                      <Save size={16} /> {formMode === 'edit' ? 'Update Design' : 'Add Design'}
                    </button>
                  </div>
                </form>
              </motion.div>
            )}

            {/* Designs Grid List */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {designLib.map((item) => (
                <div key={item.id} className="relative h-[280px] rounded-[2rem] overflow-hidden group shadow bg-warm-beige border border-emerald-deep/5">
                  <img 
                    src={item.image_url} 
                    alt={item.title} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  {/* Edit/Delete Overlay */}
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-between p-4 bg-gradient-to-t from-black/80 to-black/30">
                    <span className="text-white text-xs font-semibold truncate bg-rose-gold/95 px-3 py-1.5 rounded-full inline-block self-start font-sans">
                      {item.title}
                    </span>
                    <div className="flex gap-2 self-end">
                      <button 
                        onClick={() => startEditDesign(item)}
                        className="bg-white text-emerald-deep p-2 rounded-xl font-bold text-xs hover:bg-rose-gold hover:text-white transition-colors flex items-center gap-1"
                        title="Edit Item"
                      >
                        <Edit size={14} />
                      </button>
                      <button 
                        onClick={() => deleteDesignItem(item.id)}
                        className="bg-red-500 text-white p-2 rounded-xl font-bold text-xs hover:bg-red-600 transition-colors flex items-center gap-1"
                        title="Delete Item"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
              
              {designLib.length === 0 && (
                <div className="col-span-full py-20 text-center border-2 border-dashed border-emerald-deep/10 rounded-3xl">
                  <BookOpen size={48} className="mx-auto text-emerald-deep/10 mb-4" />
                  <p className="text-emerald-deep/45 font-medium mb-1">No designs inside Mehadi Design Library.</p>
                  <p className="text-xs text-emerald-deep/30">Click "Add New Design" above to expand the lookbook.</p>
                </div>
              )}
            </div>
          </motion.div>
        )}

        {/* ----------------- Tab: Settings ----------------- */}
        {activeTab === 'settings' && (
          <motion.div
            key="settings"
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -10 }}
          >
            <AdminSettings />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
