import { motion, AnimatePresence } from 'motion/react';
import { X, CheckCircle2, MessageSquare } from 'lucide-react';
import React, { useState } from 'react';
import { getSupabase } from '../lib/supabase';
import { useLanguage } from '../lib/LanguageContext';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  productName: string;
  productType?: string; // 'product' | 'booking'
  productPrice?: string;
}

export default function CheckoutModal({ isOpen, onClose, productName, productType = 'product', productPrice }: CheckoutModalProps) {
  const { language, t } = useLanguage();
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    address: '',
    quantity: 1,
    notes: '',
    date: '',
    time: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [whatsappUrl, setWhatsappUrl] = useState('');

  const isBooking = productType === 'booking';

  const getTranslatedProductTitle = (title: string) => {
    if (title === 'Organic Henna Cones') return t('Organic Henna Cones');
    if (title === 'Bridal Henna Art') return t('Bridal Henna Art');
    if (title === 'Handcrafted Floral Jewelry') return t('Handcrafted Floral Jewelry');
    if (title === 'Bespoke Tailoring') return t('Bespoke Tailoring');
    return title;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      const client = getSupabase();
      let dbError: any = null;

      // Pack booking date/time into notes if columns do not exist
      const finalNotes = isBooking 
        ? `[BOOKING: Date: ${formData.date}, Time: ${formData.time}] ${formData.notes}`.trim()
        : formData.notes;

      try {
        const { error } = await client.from('orders').insert([
          {
            customer_name: formData.name,
            phone_number: formData.phone,
            address: formData.address,
            product_name: productName,
            quantity: formData.quantity,
            notes: finalNotes,
          },
        ]);
        dbError = error;
      } catch (e: any) {
        dbError = e;
      }

      // If there's an error about the 'notes' column missing, retry without it
      if (dbError && (
        dbError.message?.toLowerCase().includes('notes') || 
        dbError.message?.toLowerCase().includes('schema cache') || 
        dbError.code === '42703' || 
        dbError.code === 'PGRST204' ||
        dbError.code === '23502'
      )) {
        console.warn('Omiting "notes" column due to schema cache mismatch. Retrying order submission without notes...');
        const { error: retryError } = await client.from('orders').insert([
          {
            customer_name: formData.name,
            phone_number: formData.phone,
            address: formData.address,
            product_name: productName,
            quantity: formData.quantity,
          },
        ]);
        dbError = retryError;
      }

      if (dbError) throw dbError;

      // Construct beautifully formatted WhatsApp message
      const targetNumber = '8801830896222';
      const typeLabel = isBooking ? 'Booking' : 'Product Order';

      const textEnglish = `Hello Setabgonj Online Home Delivery! I have placed a ${isBooking ? 'booking request' : 'product order'}:\n\n` +
        `📅 *Type:* ${typeLabel}\n` +
        `🛍️ *${isBooking ? 'Service' : 'Product'}:* ${productName}\n` +
        (productPrice ? `💰 *Price:* ${productPrice}\n` : '') +
        (isBooking && formData.date ? `📆 *Date:* ${formData.date}\n` : '') +
        (isBooking && formData.time ? `🕒 *Time:* ${formData.time}\n` : '') +
        `🔢 *${isBooking ? 'No. of People' : 'Quantity'}:* ${formData.quantity}\n` +
        `👤 *Name:* ${formData.name}\n` +
        `📞 *Phone:* ${formData.phone}\n` +
        `📍 *${isBooking ? 'Venue / Address' : 'Address'}:* ${formData.address}\n` +
        (formData.notes ? `📝 *Instructions:* ${formData.notes}\n` : '') +
        `\nThank you!`;

      const textBengali = `হ্যালো Setabgonj Online Home Delivery! আমি একটি ${isBooking ? 'বুকিং সম্পন্ন করেছি' : 'অর্ডার সম্পন্ন করেছি'}:\n\n` +
        `📅 *ধরণ:* ${isBooking ? 'সার্ভিস বুকিং' : 'পণ্য অর্ডার'}\n` +
        `🛍️ *${isBooking ? 'সার্ভিস' : 'পণ্য'}:* ${getTranslatedProductTitle(productName)}\n` +
        (productPrice ? `💰 *মূল্য:* ${productPrice}\n` : '') +
        (isBooking && formData.date ? `📆 *তারিখ:* ${formData.date}\n` : '') +
        (isBooking && formData.time ? `🕒 *সময়:* ${formData.time}\n` : '') +
        `🔢 *${isBooking ? 'জনসংখ্যা / সংখ্যা' : 'পরিমাণ'}:* ${formData.quantity}\n` +
        `👤 *নাম:* ${formData.name}\n` +
        `📞 *মোবাইল নম্বর:* ${formData.phone}\n` +
        `📍 *${isBooking ? 'অনুষ্ঠানের স্থান' : 'ডেলিভারি ঠিকানা'}:* ${formData.address}\n` +
        (formData.notes ? `📝 *বিশেষ অনুরোধ:* ${formData.notes}\n` : '') +
        `\nধন্যবাদ!`;

      const msgText = language === 'bn' ? textBengali : textEnglish;
      const waUrl = `https://wa.me/${targetNumber}?text=${encodeURIComponent(msgText)}`;
      
      setWhatsappUrl(waUrl);
      setIsSuccess(true);
      
      // Attempt to automatically redirect the user to WhatsApp
      try {
        window.open(waUrl, '_blank', 'noopener,noreferrer');
      } catch (err) {
        console.warn('Auto-redirection blocked by pop-up settings. Fallback to manual click button.');
      }

      setFormData({ name: '', phone: '', address: '', quantity: 1, notes: '', date: '', time: '' });
    } catch (err: any) {
      console.error('Order submission error:', err);
      setError(err.message || t('checkout.error_msg'));
    } finally {
      setIsSubmitting(false);
    }
  };

  const displayTitle = isBooking 
    ? (language === 'bn' ? 'বুকিং বুক করুন' : 'Confirm Your Booking') 
    : t('checkout.title');

  const displaySubtitle = isBooking 
    ? (language === 'bn' ? 'অনুগ্রহ করে নিচে আপনার বুকিংয়ের তথ্য দিন।' : 'Review your service slot and submit registration.') 
    : t('checkout.subtitle');

  const addressLabel = isBooking 
    ? (language === 'bn' ? 'অনুষ্ঠানের স্থান ও ঠিকানা' : 'Event Venue & Location') 
    : t('checkout.field_address');

  const addressPlaceholder = isBooking 
    ? (language === 'bn' ? 'উদা: কমিউনিটি সেন্টার বা বাসার সম্পূর্ণ ঠিকানা' : 'E.g. Community hall, hotel venue, or complete home location') 
    : (language === 'bn' ? 'বাসা নম্বর, সড়ক, এলাকা এবং শহর' : 'Street, Area, Home no.');

  const qtyLabel = isBooking 
    ? (language === 'bn' ? 'কতজনের জন্য (জন)' : 'No. of People') 
    : (language === 'bn' ? 'পরিমাণ' : 'Qty');

  const submitBtnText = isBooking 
    ? (language === 'bn' ? 'বুকিং কনফার্ম করুন' : 'Book Appointment / Slot') 
    : t('collection.btn_order');

  return (
    <AnimatePresence>
      {isOpen && (
        <div 
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 overflow-y-auto"
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-title"
        >
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-emerald-deep/40 backdrop-blur-sm"
          />
          
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative w-full max-w-lg bg-soft-white rounded-[2.5rem] shadow-2xl overflow-hidden my-8 z-10 max-h-[90vh] overflow-y-auto"
          >
            {isSuccess ? (
              <div className="p-8 md:p-12 text-center" aria-live="polite">
                <div className="w-20 h-20 bg-emerald-deep/10 text-emerald-deep rounded-full flex items-center justify-center mx-auto mb-6">
                  <CheckCircle2 size={48} className="animate-bounce" />
                </div>
                <h2 id="modal-title" className="font-serif text-3xl font-bold mb-4 text-emerald-deep">
                  {language === 'bn' ? 'সফলভাবে সম্পন্ন হয়েছে!' : 'Submitted Successfully!'}
                </h2>
                <p className="text-emerald-deep/70 leading-relaxed mb-8 text-sm md:text-base">
                  {language === 'bn' 
                    ? 'আপনার আবেদনটি তথ্য ভান্ডারে সফলভাবে সংরক্ষিত হয়েছে। দ্রুত বুকিং বা অর্ডার নিশ্চিত করতে সরাসরি হোয়াটসঅ্যাপে তথ্যটি পাঠিয়ে দিন!' 
                    : 'Your details have been saved securely. To confirm and secure your slot instantly, tap below to send it to us via WhatsApp!'}
                </p>
                
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-3 w-full py-4 bg-[#25D366] text-white rounded-2xl font-bold hover:bg-[#20ba5a] hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 shadow-xl shadow-green-500/20 mb-6 cursor-pointer"
                >
                  <MessageSquare size={20} />
                  <span>
                    {language === 'bn' ? 'হোয়াটসঅ্যাপে মেসেজ পাঠান' : 'Send Message on WhatsApp'}
                  </span>
                </a>

                <button
                  onClick={() => {
                    setIsSuccess(false);
                    onClose();
                  }}
                  className="w-full py-3 bg-emerald-deep/5 hover:bg-emerald-deep/10 text-emerald-deep rounded-2xl font-semibold text-sm transition-all focus:outline-none focus:ring-2 focus:ring-emerald-deep/20"
                >
                  {language === 'bn' ? 'বন্ধ করুন' : 'Close / Done'}
                </button>
              </div>
            ) : (
              <div className="p-8 md:p-12">
                <button
                  onClick={onClose}
                  aria-label="Close modal"
                  className="absolute top-6 right-6 p-2 hover:bg-emerald-deep/5 rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-rose-gold"
                >
                  <X size={20} />
                </button>

                <div className="mb-8">
                  <span className="text-[10px] uppercase tracking-[0.3em] text-rose-gold font-bold mb-2 block animate-none">
                    {displayTitle}
                  </span>
                  <div className="flex justify-between items-start gap-3">
                    <h2 id="modal-title" className="font-serif text-3xl font-light text-emerald-deep tracking-tight">
                      {getTranslatedProductTitle(productName)}
                    </h2>
                    {productPrice && (
                      <span className="shrink-0 font-mono font-bold text-sm text-rose-gold bg-emerald-deep/5 px-2.5 py-1.5 rounded-xl border border-rose-gold/10">
                        {productPrice}
                      </span>
                    )}
                  </div>
                  <p className="text-emerald-deep/60 text-xs mt-2">
                    {displaySubtitle}
                  </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <label htmlFor="full-name" className="text-xs uppercase tracking-widest font-bold text-emerald-deep/50 mb-2 block">{t('checkout.field_name')}</label>
                    <input
                      id="full-name"
                      required
                      type="text"
                      className="w-full bg-warm-beige border-none rounded-2xl px-6 py-4 focus:ring-2 focus:ring-rose-gold transition-all"
                      placeholder={language === 'bn' ? 'আপনার নাম লিখুন' : 'Enter your name'}
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    />
                  </div>

                  <div>
                    <label htmlFor="phone" className="text-xs uppercase tracking-widest font-bold text-emerald-deep/50 mb-2 block">{t('checkout.field_phone')}</label>
                    <input
                      id="phone"
                      required
                      type="tel"
                      className="w-full bg-warm-beige border-none rounded-2xl px-6 py-4 focus:ring-2 focus:ring-rose-gold transition-all"
                      placeholder="+880 1XXX-XXXXXX"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    />
                  </div>

                  {isBooking && (
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label htmlFor="preferred-date" className="text-xs uppercase tracking-widest font-bold text-emerald-deep/50 mb-2 block">
                          {t('checkout.field_date')}
                        </label>
                        <input
                          id="preferred-date"
                          required={isBooking}
                          type="date"
                          className="w-full bg-warm-beige border-none rounded-2xl px-4 py-4 focus:ring-2 focus:ring-rose-gold transition-all text-xs"
                          value={formData.date}
                          onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                        />
                      </div>
                      <div>
                        <label htmlFor="preferred-time" className="text-xs uppercase tracking-widest font-bold text-emerald-deep/50 mb-2 block">
                          {t('checkout.field_time')}
                        </label>
                        <input
                          id="preferred-time"
                          type="time"
                          className="w-full bg-warm-beige border-none rounded-2xl px-4 py-4 focus:ring-2 focus:ring-rose-gold transition-all text-xs"
                          value={formData.time}
                          onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                        />
                      </div>
                    </div>
                  )}

                  <div>
                    <label htmlFor="address" className="text-xs uppercase tracking-widest font-bold text-emerald-deep/50 mb-2 block">{addressLabel}</label>
                    <textarea
                      id="address"
                      required
                      className="w-full bg-warm-beige border-none rounded-2xl px-6 py-4 focus:ring-2 focus:ring-rose-gold transition-all min-h-[90px]"
                      placeholder={addressPlaceholder}
                      value={formData.address}
                      onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    />
                  </div>

                  <div>
                    <label htmlFor="notes" className="text-xs uppercase tracking-widest font-bold text-emerald-deep/50 mb-2 block">{t('checkout.field_req')}</label>
                    <textarea
                      id="notes"
                      className="w-full bg-warm-beige border-none rounded-2xl px-6 py-4 focus:ring-2 focus:ring-rose-gold transition-all min-h-[80px]"
                      placeholder={isBooking 
                        ? (language === 'bn' ? 'পছন্দের ডিজাইন, থিম বা যেকোনো বিশেষ তথ্য...' : 'Preferred packages, additional requests, etc.') 
                        : t('checkout.placeholder_ins')}
                      value={formData.notes}
                      onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    />
                  </div>

                  <div className="flex items-center gap-6">
                    <div className="w-24">
                      <label htmlFor="quantity" className="text-xs uppercase tracking-widest font-bold text-emerald-deep/50 mb-2 block">
                        {qtyLabel}
                      </label>
                      <input
                        id="quantity"
                        type="number"
                        min="1"
                        className="w-full bg-warm-beige border-none rounded-2xl px-4 py-4 text-center focus:ring-2 focus:ring-rose-gold transition-all"
                        value={isNaN(formData.quantity) ? '' : formData.quantity}
                        onChange={(e) => {
                          const val = parseInt(e.target.value);
                          setFormData({ ...formData, quantity: isNaN(val) ? 1 : val });
                        }}
                      />
                    </div>
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="flex-1 py-4 bg-emerald-deep text-white rounded-2xl font-bold hover:bg-rose-gold transition-all duration-500 shadow-lg disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-rose-gold cursor-pointer"
                    >
                      {isSubmitting ? t('checkout.btn_submitting') : submitBtnText}
                    </button>
                  </div>
                  
                  {error && (
                    <p className="text-red-500 text-xs text-center mt-2 italic" aria-live="assertive">{error}</p>
                  )}
                </form>
              </div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
