import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Package, Heart, Clock, LogOut, User, Search, RefreshCw, MapPin } from 'lucide-react';
import { getSupabase } from '../lib/supabase';
import { useLanguage } from '../lib/LanguageContext';

interface UserDashboardProps {
  email: string;
  onLogout: () => void;
}

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

export default function UserDashboard({ email, onLogout }: UserDashboardProps) {
  const { language, t } = useLanguage();
  const [phoneNumber, setPhoneNumber] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('user_track_phone') || '';
    }
    return '';
  });
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);

  // Fetch real-time orders based on phone number
  const fetchMyOrders = async (phoneToQuery: string) => {
    if (!phoneToQuery.trim()) return;
    setLoading(true);
    setFeedback(null);
    try {
      const client = getSupabase();
      const trimmedPhone = phoneToQuery.trim();
      
      // Select orders containing or matching phone number
      const { data, error } = await client
        .from('orders')
        .select('*')
        .or(`phone_number.eq.${trimmedPhone},phone_number.ilike.%${trimmedPhone}%`)
        .order('created_at', { ascending: false });

      if (error) throw error;

      if (data) {
        setOrders(data);
        if (data.length === 0) {
          setFeedback(
            language === 'bn' 
              ? 'এই নম্বরে কোনো অর্ডার বা বুকিং পাওয়া যায়নি।' 
              : 'No orders or bookings found for this phone number.'
          );
        } else {
          if (typeof window !== 'undefined') {
            localStorage.setItem('user_track_phone', trimmedPhone);
          }
        }
      }
    } catch (err: any) {
      console.error('Error tracking orders:', err);
      setFeedback(
        language === 'bn' 
          ? 'তথ্য লোড করতে সমস্যা হয়েছে। দয়া করে আবার চেষ্টা করুন।' 
          : 'Failed to seek orders. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (phoneNumber) {
      fetchMyOrders(phoneNumber);
    }
  }, []);

  const handleTrackSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchMyOrders(phoneNumber);
  };

  return (
    <div className="space-y-12">
      {/* Header Profile Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-rose-gold/10">
        <div className="flex items-center gap-6">
          <div className="w-16 h-16 md:w-20 md:h-20 bg-rose-gold text-white rounded-full flex items-center justify-center shadow-lg">
            <User size={36} />
          </div>
          <div>
            <h2 className="font-serif text-3xl md:text-4xl text-emerald-deep font-semibold">
              {language === 'bn' ? 'স্বাগতম, সুপ্রিয় গ্রাহক' : 'Hello, Beautiful Customer'}
            </h2>
            <p className="text-emerald-deep/60 text-sm md:text-base">{email}</p>
          </div>
        </div>
        <button 
          onClick={onLogout}
          className="flex items-center justify-center gap-2 px-8 py-3 bg-white hover:bg-emerald-deep/5 border border-emerald-deep/10 rounded-full text-emerald-deep font-bold transition-all shadow-sm cursor-pointer"
        >
          <LogOut size={18} /> 
          <span>{language === 'bn' ? 'সাইন আউট' : 'Logout'}</span>
        </button>
      </div>

      {/* Grid: Order Tracker vs Wishlist */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Real-time Order Tracker Column */}
        <div className="lg:col-span-7 space-y-6">
          <div className="glass p-6 md:p-8 rounded-[2rem] shadow-md border border-rose-gold/5">
            <h3 className="font-sans text-xs uppercase tracking-[0.3em] font-bold text-rose-gold mb-2">
              {language === 'bn' ? 'লাইভ অর্ডার ট্র্যাকার' : 'Live Order & Booking Tracker'}
            </h3>
            <p className="text-xs text-emerald-deep/60 mb-6">
              {language === 'bn' 
                ? 'আপনার অর্ডার বা স্লট বুকিং ট্র্যাক করতে মোবাইল নম্বর দিয়ে সার্চ করুন।' 
                : 'Lookup or synchronize your delivery statuses by placing your mobile number below.'}
            </p>

            {/* Tracking Input form */}
            <form onSubmit={handleTrackSubmit} className="flex gap-2.5 mb-6">
              <div className="relative flex-1">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-emerald-deep/30" size={18} />
                <input
                  required
                  type="text"
                  placeholder={language === 'bn' ? 'মোবাইল নম্বর লিখুন (উদা: +8801830...)' : 'Enter phone number (e.g. +8801830...)'}
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  className="w-full pl-12 pr-4 py-3.5 bg-white/50 border border-emerald-deep/10 rounded-xl focus:border-rose-gold outline-none transition-all focus:ring-2 focus:ring-rose-gold/20 text-sm"
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="px-6 bg-emerald-deep text-white rounded-xl hover:bg-rose-gold transition-all duration-300 flex items-center justify-center gap-2 font-semibold text-sm shadow-md cursor-pointer disabled:opacity-50"
              >
                {loading ? <RefreshCw size={16} className="animate-spin" /> : <Search size={16} />}
                <span className="hidden sm:inline">{language === 'bn' ? 'খুঁজুন' : 'Search'}</span>
              </button>
            </form>

            {/* Results Feedback panel */}
            {feedback && (
              <p className="text-center text-xs text-rose-gold/80 italic p-4 bg-rose-gold/5 rounded-xl">
                {feedback}
              </p>
            )}

            {/* Active order lists */}
            <div className="space-y-4 max-h-[420px] overflow-y-auto pr-1">
              {orders.map((ord) => (
                <div key={ord.id} className="p-5 bg-white/40 dark:bg-white/5 border border-emerald-deep/5 rounded-2xl space-y-3 shadow-sm hover:border-rose-gold/20 transition-all">
                  <div className="flex justify-between items-start gap-3">
                    <div>
                      <h4 className="font-serif text-lg font-medium text-emerald-deep">
                        {ord.product_name}
                      </h4>
                      <p className="text-[10px] text-emerald-deep/40 font-mono mt-0.5 flex items-center gap-1">
                        <Clock size={11} />
                        {new Date(ord.created_at).toLocaleString()}
                      </p>
                    </div>
                    <span className={`text-[9px] md:text-[10px] uppercase tracking-wider font-bold px-3 py-1 rounded-full shrink-0 ${
                      ord.status === 'delivered' 
                        ? 'bg-green-100 text-green-700 dark:bg-green-950/40 dark:text-green-300' 
                        : ord.status === 'shipped' 
                        ? 'bg-purple-100 text-purple-700 dark:bg-purple-950/40 dark:text-purple-300'
                        : ord.status === 'confirmed' 
                        ? 'bg-blue-100 text-blue-700 dark:bg-blue-950/40 dark:text-blue-300'
                        : 'bg-yellow-100 text-yellow-700 dark:bg-yellow-950/40 dark:text-yellow-300'
                    }`}>
                      {ord.status || 'Pending'}
                    </span>
                  </div>

                  {/* Quantity and shipping information block */}
                  <div className="grid grid-cols-2 gap-4 text-xs pt-2 border-t border-emerald-deep/5">
                    <div>
                      <span className="text-emerald-deep/40 block text-[9px] uppercase tracking-widest">{language === 'bn' ? 'পরিমাণ' : 'Quantity'}</span>
                      <span className="font-semibold">{ord.quantity} pcs</span>
                    </div>
                    <div>
                      <span className="text-emerald-deep/40 block text-[9px] uppercase tracking-widest">{language === 'bn' ? 'গ্রাহক' : 'Recipient'}</span>
                      <span className="font-semibold">{ord.customer_name}</span>
                    </div>
                  </div>

                  {/* Complete details address */}
                  <div className="text-xs space-y-1">
                    <span className="text-emerald-deep/40 block text-[9px] uppercase tracking-widest">{language === 'bn' ? 'ঠিকানা/ভেন্যু' : 'Address/Venue'}</span>
                    <p className="flex items-start gap-1 text-emerald-deep/70 shrink-0 font-light">
                      <MapPin size={12} className="text-rose-gold shrink-0 mt-0.5" />
                      <span>{ord.address}</span>
                    </p>
                  </div>

                  {ord.notes && (
                    <div className="text-xs bg-emerald-deep/[0.02] dark:bg-white/[0.01] p-2.5 rounded-lg border border-emerald-deep/[0.04]">
                      <span className="text-emerald-deep/40 block text-[9px] uppercase tracking-widest leading-none mb-1">{language === 'bn' ? 'বিশেষ অনুরোধ' : 'Instructions'}</span>
                      <p className="text-emerald-deep/75 italic font-light">{ord.notes}</p>
                    </div>
                  )}
                </div>
              ))}

              {!loading && orders.length === 0 && !feedback && (
                <div className="text-center py-10 text-emerald-deep/40 space-y-3">
                  <Package size={36} className="mx-auto text-emerald-deep/20" />
                  <p className="text-xs">
                    {language === 'bn' 
                      ? 'অর্ডার ট্র্যাকিং শুরু করতে উপরে মোবাইল নম্বর দিন।' 
                      : 'Provide your mobile number to load live order schedules.'}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Dynamic Highlight Column */}
        <div className="lg:col-span-5 space-y-6">
          <div className="glass p-6 md:p-8 rounded-[2rem] shadow-md border border-rose-gold/5 bg-warm-beige/10">
            <h3 className="font-sans text-xs uppercase tracking-[0.3em] font-bold text-rose-gold mb-4">
              {language === 'bn' ? 'বিশেষ সেবাসমূহ' : 'Exclusive Benefits'}
            </h3>
            
            <div className="space-y-4 text-xs leading-relaxed text-emerald-deep/70">
              <div className="p-4 bg-emerald-deep/5 dark:bg-white/5 rounded-xl border border-rose-gold/10">
                <span className="font-bold text-emerald-deep block mb-1">{language === 'bn' ? 'অর্গানিক গুণাগুণ নিশ্চয়তা' : '100% Organic Henna Stain'}</span>
                {language === 'bn' 
                  ? 'আমরা নিশ্চিত করি রাজকীয় এবং দীর্ঘস্থায়ী মেরুন কালার যা ত্বকের জন্য সম্পূর্ণ নিরাপদ।' 
                  : 'We ensure custom bridal formulations that guarantee rich mahogany stains safely.'}
              </div>

              <div className="p-4 bg-emerald-deep/5 dark:bg-white/5 rounded-xl border border-rose-gold/10">
                <span className="font-bold text-emerald-deep block mb-1">{language === 'bn' ? 'সরাসরি হোম ডেলিভারি' : 'Setabgonj Home Logistics'}</span>
                {language === 'bn' 
                  ? 'বোচাগঞ্জ এবং সেতাবগঞ্জের আশেপাশের অঞ্চলে সরাসরি হোম ডেলিভারি ও পার্সেল সুবিধা।' 
                  : 'Fast-track organic parcel dispatches and professional wedding decorators at your doorstep.'}
              </div>

              <div className="p-4 bg-emerald-deep/5 dark:bg-white/5 rounded-xl border border-rose-gold/10">
                <span className="font-bold text-emerald-deep block mb-1">{language === 'bn' ? 'সহজ যোগাযোগ' : 'WhatsApp Support Assistance'}</span>
                {language === 'bn' 
                  ? 'যেকোনো প্রয়োজনে সরাসরি আমাদের হোয়াটসঅ্যাপ নম্বরে বার্তা পাঠিয়ে সাহায্য নিতে পারেন।' 
                  : 'Connect with lead artists directly for custom jewelry or sizing revisions instantly.'}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
