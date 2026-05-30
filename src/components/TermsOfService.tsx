import { useLanguage } from '../lib/LanguageContext';
import { ArrowLeft, BookOpen, AlertCircle, ShoppingBag, Clock, Heart } from 'lucide-react';

interface TermsOfServiceProps {
  onBack: () => void;
}

export default function TermsOfService({ onBack }: TermsOfServiceProps) {
  const { language } = useLanguage();

  return (
    <div className="pt-28 pb-20 px-6 min-h-screen bg-soft-white text-emerald-deep font-sans transition-colors duration-500">
      <div className="max-w-4xl mx-auto">
        {/* Back Button */}
        <button
          onClick={onBack}
          className="group mb-12 inline-flex items-center gap-2 px-6 py-2.5 border border-emerald-deep/10 rounded-full hover:bg-emerald-deep/5 transition-all text-sm font-semibold cursor-pointer"
        >
          <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
          {language === 'bn' ? 'হোমে ফিরে যান' : 'Back to Home'}
        </button>

        {/* Title */}
        <div className="mb-16 text-center">
          <span className="font-sans text-xs uppercase tracking-[0.4em] text-rose-gold font-bold mb-4 block">
            {language === 'bn' ? 'সেবা ব্যবহারের শর্তাবলী' : 'Service Agreements'}
          </span>
          <h1 className="font-serif text-5xl md:text-6xl font-light tracking-tight mb-4">
            {language === 'bn' ? 'ব্যবহারের শর্তাবলী' : 'Terms of Service'}
          </h1>
          <p className="text-sm font-mono text-emerald-deep/40 uppercase tracking-widest mt-2">
            {language === 'bn' ? 'সর্বশেষ সংস্করণ: ২৮ মে, ২০২৬' : 'Last Updated: May 28, 2026'}
          </p>
          <div className="w-24 h-[1px] bg-rose-gold mx-auto mt-6" />
        </div>

        {/* Info Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="p-6 bg-white border border-emerald-deep/5 rounded-[2rem] shadow-sm flex flex-col gap-3">
            <div className="p-3 bg-emerald-deep/5 text-rose-gold rounded-2xl w-fit">
              <ShoppingBag size={20} />
            </div>
            <div>
              <h3 className="font-serif text-lg mb-1 font-medium">
                {language === 'bn' ? 'অর্ডার ও ডেলিভারি' : 'Placing Orders'}
              </h3>
              <p className="text-xs text-emerald-deep/60 leading-relaxed">
                {language === 'bn' 
                  ? 'সব ধরণের কাস্টম আর্ট এবং অর্গানিক মেহেদি সঠিক বুকিং সাপেক্ষে দ্রুততম সময়ে ডেলিভারি করা হয়।' 
                  : 'All custom arts and organic henna cones are delivered safely matching strict timeframe slots.'}
              </p>
            </div>
          </div>

          <div className="p-6 bg-white border border-emerald-deep/5 rounded-[2rem] shadow-sm flex flex-col gap-3">
            <div className="p-3 bg-emerald-deep/5 text-rose-gold rounded-2xl w-fit">
              <Clock size={20} />
            </div>
            <div>
              <h3 className="font-serif text-lg mb-1 font-medium">
                {language === 'bn' ? 'সহজ বাতিলকরণ নীতি' : 'Cancellations'}
              </h3>
              <p className="text-xs text-emerald-deep/60 leading-relaxed">
                {language === 'bn' 
                  ? 'অনুষ্ঠান বা বুকিং পরিবর্তনের ক্ষেত্রে অন্তত ২৪-৪৮ ঘণ্টা পূর্বে অবহিত করার অনুরোধ করা হচ্ছে।' 
                  : 'Rescheduling or appointment edits require a 24-48 hours headstart prior to the slot.'}
              </p>
            </div>
          </div>

          <div className="p-6 bg-white border border-emerald-deep/5 rounded-[2rem] shadow-sm flex flex-col gap-3">
            <div className="p-3 bg-emerald-deep/5 text-rose-gold rounded-2xl w-fit">
              <Heart size={20} />
            </div>
            <div>
              <h3 className="font-serif text-lg mb-1 font-medium">
                {language === 'bn' ? '১০০% অর্গানিক পণ্য' : 'Botanical Guarantee'}
              </h3>
              <p className="text-xs text-emerald-deep/60 leading-relaxed">
                {language === 'bn' 
                  ? 'আমরা মেহেদি প্রস্তুতিতে ১০০% অর্গানিক উপকরণ ব্যবহার করি যা সব স্ক্রিনের জন্য নিরাপদ।' 
                  : 'Our henna cones are 100% natural, hand-rolled and totally chemical-free for deep rich stains.'}
              </p>
            </div>
          </div>
        </div>

        {/* Document Content */}
        <div className="bg-white border border-emerald-deep/5 rounded-[2.5rem] p-8 md:p-12 shadow-sm space-y-10 leading-relaxed font-light text-emerald-deep/80">
          {language === 'bn' ? (
            <>
              {/* Introduction - BN */}
              <section className="space-y-4">
                <h2 className="font-serif text-2xl text-emerald-deep font-semibold flex items-center gap-2">
                  <BookOpen size={20} className="text-rose-gold" />
                  ১. শর্তাবলীর স্বীকৃতি ও সম্মতি
                </h2>
                <p>
                  সেতাবগঞ্জ অনলাইন হোম ডেলিভারি ওয়েবসাইট এবং আমাদের বুটিক, ডিজাইন ও ব্রাইডাল সার্ভিস ব্যবহারে স্বাগতম। এই সেবাটি ব্যবহারের মাধ্যমে আপনি আমাদের শর্তাবলীতে সম্পূর্ণ সম্মতি জানিয়েছেন বলে গণ্য হবে। যদি আপনি কোনো শর্তের সাথে একমত না হন, তবে দয়া করে সেবাটি ব্যবহার করা থেকে বিরত থাকুন।
                </p>
              </section>

              {/* Scope of Services - BN */}
              <section className="space-y-4">
                <h2 className="font-serif text-2xl text-emerald-deep font-semibold">২. সেবাসমূহের পরিধি ও হোম ডেলিভারি</h2>
                <p>
                  আমাদের হোম ডেলিভারি সেবা বোচাগঞ্জ, সেতাবগঞ্জ বাস স্ট্যান্ড, ধান্তলা ঝাড়বাড়ি এবং পার্শ্ববর্তী অঞ্চলভিত্তিক। কাস্টম বুটিক ড্রেস মেকিং ও অর্গানিক সুগন্ধি মেহেদি কোণ হোম ডেলিভারি দেওয়া হয়। প্রতিটি অর্ডারের ডেলিভারি চার্জ দূরত্ব এবং প্যাকেজ সাইজের উপর ভিত্তি করে নির্ধারিত হবে।
                </p>
              </section>

              {/* Bookings & Scheduling - BN */}
              <section className="space-y-4">
                <h2 className="font-serif text-2xl text-emerald-deep font-semibold">৩. ব্রাইডাল বুকিং ও কাস্টম পোশাক অর্ডার</h2>
                <div className="space-y-2 text-sm text-emerald-deep/70">
                  <p>
                    <strong>ক) বুকিং নিশ্চিতকরণ:</strong> ওয়েবসাইট বা চেকআউট ফর্মের মাধ্যমে প্রেরিত ইনকোয়ারি সরাসরি ফোনে নিশ্চিত করার পরই আপনার স্লট ফাইনাল বুক করা হবে।
                  </p>
                  <p>
                    <strong>খ) অ্যাডভান্স পেমেন্ট:</strong> কাস্টম ব্রাইডাল মেহেদি সাজ এবং বিশেষ ফিটিং দর্জি কাপড়ের অর্ডারের ক্ষেত্রে একটি নির্দিষ্ট পরিমাণ অংশ অ্যাডভান্স পেমেন্ট হিসেবে বিকাশ/রকেট/নগদের মাধ্যমে পরিশোধ করতে হতে পারে।
                  </p>
                  <p>
                    <strong>গ) পোশাকের পরিমাপ:</strong> পোশাক তৈরির ক্ষেত্রে দেওয়া মাপ সঠিক রাখতে আমাদের বুটিক গাইডলাইন্স অনুসরণ করুন।
                  </p>
                </div>
              </section>

              {/* Natural Henna Safety Policy - BN */}
              <section className="space-y-4 bg-emerald-deep/[0.02] p-6 rounded-3xl border border-emerald-deep/5">
                <h2 className="font-serif text-2xl text-emerald-deep font-semibold flex items-center gap-2">
                  <AlertCircle size={20} className="text-rose-gold ink-0" />
                  ৪. অর্গানিক মেহেদি ও স্কিন সেফটি পলিসি
                </h2>
                <p className="text-sm">
                  আমরা বৃষ্টি’র কারুকার্যে শুধুমাত্র নিজেরা প্রস্তুতকৃত ১০০% অর্গানিক রাজস্থানি মেহেদি পাতা এবং এসেনশিয়াল অয়েল (যেমন ইউক্যালিপটাস ও ল্যাভেন্ডার অয়েল) ব্যবহার করে মেহেদি কোণ তৈরি করি। এতে কোনো রাসায়নিক উপাদান বা ক্ষতিকর পিপিডি (PPD) থাকে না। অতি সংবেদনশীল ত্বকে ব্যবহারের পূর্বে একটি প্যাচ টেস্ট করে নেওয়ার জন্য পরামর্শ দেওয়া হচ্ছে।
                </p>
              </section>

              {/* Cancellations & Refunds - BN */}
              <section className="space-y-4">
                <h2 className="font-serif text-2xl text-emerald-deep font-semibold">৫. বাতিলকরণ, ফেরত এবং পরিবর্তন নীতি</h2>
                <p>
                  যদি আপনি কোনো অর্ডার বা বুকিং বাতিল বা স্থগিত করতে চান, তবে দয়া করে আপনার নির্ধারিত সময়ের অন্তত ২৪ ঘণ্টা পূর্বে আমাদের কল সেন্টারের মাধ্যমে পরিবর্তন করুন। কাস্টম সেলাইকৃত ড্রেস বা ইতিমধ্যে ব্যবহৃত বা কাটা কাপড়ের ফেরত গ্রহণ করা হয় না। অর্গানিক মেহেদি কোণগুলো তাজা ও কার্যকর রাখতে রেফ্রিজারেটরে সংরক্ষণ করুন।
                </p>
              </section>

              {/* Intellectual Property - BN */}
              <section className="space-y-4">
                <h2 className="font-serif text-2xl text-emerald-deep font-semibold">৬. মেধা সম্পদ ও পোর্টফোলিও স্বত্ব</h2>
                <p>
                  এই ওয়েবসাইটে প্রদর্শিত সকল কাস্টম ডিজাইন, কাজের ছবি ও ব্র্যান্ডের লোগো বৃষ্টি’র কারুকাজ ও সেতাবগঞ্জ অনলাইন হোম ডেলিভারির সম্পদ। অনুমতি ছাড়া আমাদের তৈরি গ্যালারির যেকোনো ছবি বাণিজ্যিক উদ্দেশ্যে ব্যবহার বা অনুকরণ দণ্ডনীয় অপরাধ।
                </p>
              </section>
            </>
          ) : (
            <>
              {/* Introduction - EN */}
              <section className="space-y-4">
                <h2 className="font-serif text-2xl text-emerald-deep font-semibold flex items-center gap-2">
                  <BookOpen size={20} className="text-rose-gold" />
                  1. Acceptance of Terms
                </h2>
                <p>
                  By accessing and employing the online boutique portals, booking sheets, chemical-free henna carts, and tailor coordination systems offered by Setabgonj Online Home Delivery, you signify unconditional compliance with these Terms of Service. If you disagree, please refrain from utilizing our online platform.
                </p>
              </section>

              {/* Scope of Services - EN */}
              <section className="space-y-4">
                <h2 className="font-serif text-2xl text-emerald-deep font-semibold">2. Service Boundaries & Portal Deliveries</h2>
                <p>
                  We coordinate custom home-deliveries within Bochaganj, Setabganj Bus Stand, Dhantala Jharbari, Dinajpur division, and adjacent locations. Home delivery pricing is responsive down to distance tiers and custom bundle weight characteristics.
                </p>
              </section>

              {/* Bookings & Scheduling - EN */}
              <section className="space-y-4">
                <h2 className="font-serif text-2xl text-emerald-deep font-semibold">3. Bridal Packages & Customized Couture</h2>
                <div className="space-y-2 text-sm text-emerald-deep/70">
                  <p>
                    <strong>A) Booking Verifications:</strong> Inquiries sent via the portal are finalized and confirmed over direct voice calls to isolate exact dates and locations.
                  </p>
                  <p>
                    <strong>B) Booking Fee deposits:</strong> Special events, bridal henna bookings, or heavy-work bridal apparel tailoring may necessitate down deposits via local banking (bKash/Nagad/Rocket) to lock the timeframe.
                  </p>
                  <p>
                    <strong>C) Measurements accuracy:</strong> For couture apparel, you agree to convey meticulous measurements to ensure precise fits.
                  </p>
                </div>
              </section>

              {/* Natural Henna Safety Policy - EN */}
              <section className="space-y-4 bg-emerald-deep/[0.02] p-6 rounded-3xl border border-emerald-deep/5">
                <h2 className="font-serif text-2xl text-emerald-deep font-semibold flex items-center gap-2">
                  <AlertCircle size={20} className="text-rose-gold shrink-0" />
                  4. Chemical-Free Pure Henna Policy
                </h2>
                <p className="text-sm">
                  Brishty\'s Henna & Hue offers premium henna cones processed using 100% natural Rajasthani leaves blended with safe therapeutic oils. Our botanical cones are completely free of chemical dyes and PPD. We encourage a small skin-patch test for ultra-sensitive skin types beforehand.
                </p>
              </section>

              {/* Cancellations & Refunds - EN */}
              <section className="space-y-4">
                <h2 className="font-serif text-2xl text-emerald-deep font-semibold">5. Cancellations, Storage & Revisions</h2>
                <p>
                  To reschedule, update, or cancel services, call our direct help line at least 24 hours prior to your scheduled booking slot. Bespoke handstitched apparel orders, cut fabrics, or opened cones cannot be returned or refunded. Keep botanical henna cones frozen to maintain freshness.
                </p>
              </section>

              {/* Intellectual Property - EN */}
              <section className="space-y-4">
                <h2 className="font-serif text-2xl text-emerald-deep font-semibold">6. Proprietary Designs & Media Rights</h2>
                <p>
                  All catalog mockups, portfolio pictures, and brand assets shown belong exclusively to Brishty\'s Henna & Hue and Setabgonj Online Home Delivery. Unsanctioned use of our catalog for commercial mimicry is strictly prohibited.
                </p>
              </section>
            </>
          )}

          {/* Prompt Back */}
          <div className="pt-8 border-t border-emerald-deep/5 text-center">
            <button
              onClick={onBack}
              className="px-8 py-3.5 bg-emerald-deep text-white rounded-full font-bold hover:bg-rose-gold transition-all duration-300 shadow-lg shadow-emerald-deep/10 cursor-pointer"
            >
              {language === 'bn' ? 'বুঝেছি, হোমপেজে ফিরে যান' : 'I Understand, Return to Homepage'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
