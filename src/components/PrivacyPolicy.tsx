import { useLanguage } from '../lib/LanguageContext';
import { ArrowLeft, ShieldCheck, Mail, Database, Cookie, UserCheck } from 'lucide-react';

interface PrivacyPolicyProps {
  onBack: () => void;
}

export default function PrivacyPolicy({ onBack }: PrivacyPolicyProps) {
  const { language, t } = useLanguage();

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
            {language === 'bn' ? 'নিরাপত্তা ও গোপনীয়তা' : 'Security & Trust'}
          </span>
          <h1 className="font-serif text-5xl md:text-6xl font-light tracking-tight mb-4">
            {language === 'bn' ? 'গোপনীয়তা নীতি' : 'Privacy Policy'}
          </h1>
          <p className="text-sm font-mono text-emerald-deep/40 uppercase tracking-widest mt-2">
            {language === 'bn' ? 'সর্বশেষ সংস্করণ: ২৮ মে, ২০২৬' : 'Last Updated: May 28, 2026'}
          </p>
          <div className="w-24 h-[1px] bg-rose-gold mx-auto mt-6" />
        </div>

        {/* Info Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          <div className="p-6 bg-white border border-emerald-deep/5 rounded-[2rem] shadow-sm flex gap-4">
            <div className="p-3 bg-emerald-deep/5 text-rose-gold rounded-2xl h-fit">
              <ShieldCheck size={20} />
            </div>
            <div>
              <h3 className="font-serif text-lg mb-1 font-medium">
                {language === 'bn' ? '১০০% ড্যাটা নিরাপত্তা' : '100% Data Protection'}
              </h3>
              <p className="text-xs text-emerald-deep/60 leading-relaxed">
                {language === 'bn' 
                  ? 'আপনার কোনো ব্যক্তিগত তথ্য তৃতীয় পক্ষের সাথে কখনও শেয়ার করা হয় না।' 
                  : 'Your personal information is never shared with third parties under any circumstances.'}
              </p>
            </div>
          </div>

          <div className="p-6 bg-white border border-emerald-deep/5 rounded-[2rem] shadow-sm flex gap-4">
            <div className="p-3 bg-emerald-deep/5 text-rose-gold rounded-2xl h-fit">
              <Database size={20} />
            </div>
            <div>
              <h3 className="font-serif text-lg mb-1 font-medium">
                {language === 'bn' ? 'শুধুমাত্র প্রয়োজনীয় সংগ্রহ' : 'What We Collect'}
              </h3>
              <p className="text-xs text-emerald-deep/60 leading-relaxed">
                {language === 'bn' 
                  ? 'আমরা কেবল বুকিং এবং ডেলিভারি সুগম করার জন্য প্রয়োজনীয় ন্যূনতম তথ্য সংগ্রহ করি।' 
                  : 'We only collect essential details to facilitate your custom booking and doorstep deliveries.'}
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
                <h2 className="font-serif text-2xl text-emerald-deep font-semibold">১. সূচনা এবং ভূমিকা</h2>
                <p>
                  সেতাবগঞ্জ অনলাইন হোম ডেলিভারি (বৃষ্টি’র বুটিক, মেকআপ ও মেহেদি আর্ট)-এ আপনার বিশ্বাস আমাদের চালিকাশক্তি। আমরা আপনার ব্যক্তিগত তথ্যের গোপনীয়তা রক্ষা করতে প্রতিশ্রুতিবদ্ধ। এই গোপনীয়তা নীতি নির্দেশ করে আমরা কীভাবে তথ্য সংগ্রহ করি, তা ব্যবহার করি এবং কীভাবে সুরক্ষিত রাখি।
                </p>
              </section>

              {/* Data We Collect - BN */}
              <section className="space-y-4">
                <h2 className="font-serif text-2xl text-emerald-deep font-semibold">২. সংগৃহীত তথ্য এবং এর উৎস</h2>
                <p>
                  আমাদের অর্ডার এবং বুকিং সার্ভিসসমূহ ব্যবহার করার সময় আমরা নিম্নলিখিত তথ্য সংগ্রহ করতে পারি:
                </p>
                <ul className="list-disc pl-6 space-y-2 text-sm text-emerald-deep/70">
                  <li><strong>যোগাযোগের তথ্য:</strong> আপনার নাম, মোবাইল নম্বর এবং ইমেইল ঠিকানা।</li>
                  <li><strong>ঠিকানা:</strong> মেহেদি অর্ডার বা কাস্টম হোম ডেলিভারি সার্ভিসের জন্য আপনার ইভেন্ট এবং ডেলিভারি ঠিকানা।</li>
                  <li><strong>সার্ভিস সংক্রান্ত নির্দেশনা:</strong> বিশেষ প্রয়োজনীয়তা (যেমন ব্রাইডাল মেহেদির নকশা, পোশাকের পরিমাপ বা কাস্টম ডিজাইন)।</li>
                  <li><strong>প্রযুক্তিগত তথ্য:</strong> সাইট ব্যবহারের অভিজ্ঞতা বাড়াতে ব্রাউজার সেটিংস, থিম পছন্দ (লাইট/ডার্ক মোড) এবং ভাষা পছন্দকরণ (ইংরেজি/বাংলা)।</li>
                </ul>
              </section>

              {/* How We Use It - BN */}
              <section className="space-y-4">
                <h2 className="font-serif text-2xl text-emerald-deep font-semibold">৩. তথ্যের ব্যবহারকারী ও উদ্দেশ্য</h2>
                <p>
                  আপনার সংগৃহীত তথ্য নিম্নলিখিত উদ্দেশ্যে ব্যবহৃত হয়:
                </p>
                <ul className="list-disc pl-6 space-y-2 text-sm text-emerald-deep/70">
                  <li>আপনার দেওয়া বুকিং বুকড করা এবং অনুরোধকৃত সেবা সরবরাহ করা।</li>
                  <li>আপনার সাথে সরাসরি অর্ডার নিশ্চিতকরণ এবং সমন্বয় করার জন্য।</li>
                  <li>আমাদের সেবার গুণগত মান এবং ওয়েবসাইটের ইউজার এক্সপেরিয়েন্স উন্নত করতে।</li>
                  <li>প্রয়োজনে বিশেষ ডিসকাউন্ট এবং বুটিক পণ্যের নতুন আপডেটের খবর পৌঁছাতে।</li>
                </ul>
              </section>

              {/* Cookies and Storage - BN */}
              <section className="space-y-4">
                <h2 className="font-serif text-2xl text-emerald-deep font-semibold">৪. কুকিজ ও লোকাল স্টোরেজ</h2>
                <div className="flex gap-4 p-4 bg-emerald-deep/[0.02] rounded-2xl border border-emerald-deep/5">
                  <Cookie className="text-rose-gold shrink-0 mt-1" size={20} />
                  <p className="text-sm">
                    আমরা ব্রাউজারের লোকাল স্টোরেজ (Local Storage) ব্যবহার করি আপনার পছন্দের ডার্ক/লাইট থিম মুড এবং ভাষা সংক্রান্ত পছন্দসমূহ ডিভাইসভেদে নিখুঁতভাবে সংরক্ষণ করার জন্য, যেন আপনার প্রতিটি ভিজিট স্বাচ্ছন্দ্যময় হয়।
                  </p>
                </div>
              </section>

              {/* Security - BN */}
              <section className="space-y-4">
                <h2 className="font-serif text-2xl text-emerald-deep font-semibold">৫. তথ্যের নিরাপত্তা ব্যবস্থা</h2>
                <p>
                  আপনার তথ্য আমাদের কাছে সুরক্ষিত। আমরা অননুমোদিত অ্যাক্সেস, পরিবর্তন বা ড্যাটা লিক হওয়া রোধে সর্বাধুনিক এনক্রিপশন ও সিকিউর সার্ভার টেকনোলজি ব্যবহার করি। আমরা কোনো ব্যাংক বা পেমেন্ট গেটওয়ের গোপন পিন কোড জমা করি না।
                </p>
              </section>

              {/* User Rights - BN */}
              <section className="space-y-4">
                <h2 className="font-serif text-2xl text-emerald-deep font-semibold">৬. গ্রাহকের অধিকার ও সংশোধন</h2>
                <div className="flex gap-4 p-4 bg-emerald-deep/[0.02] rounded-2xl border border-emerald-deep/5">
                  <UserCheck className="text-rose-gold shrink-0 mt-1" size={20} />
                  <p className="text-sm">
                    গ্রাহকরা তাদের জমা দেওয়া যেকোনো তথ্য দেখতে, সংশোধন করতে বা তাদের অর্ডার তালিকা থেকে মুছে ফেলার জন্য অনুরোধ করতে পারেন। এ কাজের জন্য সরাসরি এডমিনের সাথে আমাদের দেওয়া কন্টাক্ট নাম্বারে যোগাযোগ করা যাবে।
                  </p>
                </div>
              </section>

              {/* Contact Information - BN */}
              <section className="space-y-4 border-t border-emerald-deep/5 pt-8">
                <h2 className="font-serif text-2xl text-emerald-deep font-semibold">৭. যেকোনো জিজ্ঞাসাবাদে যোগাযোগ</h2>
                <p>
                  আমাদের গোপনীয়তা নীতি সম্পর্কে কোনো প্রশ্ন থাকলে সরাসরি ইমেইল করতে পারেন অথবা কল করতে পারেন:
                </p>
                <div className="flex flex-col sm:flex-row gap-4 pt-2">
                  <div className="flex items-center gap-2 text-sm">
                    <Mail size={16} className="text-rose-gold" />
                    <span>hello@brishtys.com</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <span className="text-rose-gold font-bold">☏</span>
                    <span>+880 1830-896222</span>
                  </div>
                </div>
              </section>
            </>
          ) : (
            <>
              {/* Introduction - EN */}
              <section className="space-y-4">
                <h2 className="font-serif text-2xl text-emerald-deep font-semibold">1. Introduction and Scope</h2>
                <p>
                  At Setabgonj Online Home Delivery (featuring Brishty\'s Boutique, Makeup & Henna Art), we deeply value our customers\' trust. This Privacy Policy details the types of personal information we gather when you navigate our portal, use our interactive checkout, or place custom orders, alongside how we shield that data.
                </p>
              </section>

              {/* Data We Collect - EN */}
              <section className="space-y-4">
                <h2 className="font-serif text-2xl text-emerald-deep font-semibold">2. Information Collection & Usage</h2>
                <p>
                  To deliver pristine custom tailoring, natural henna bookings, and doorstep floral jewelry delivery, we may request certain attributes:
                </p>
                <ul className="list-disc pl-6 space-y-2 text-sm text-emerald-deep/70">
                  <li><strong>Contact Details:</strong> Your full name, telephone number, and e-mail.</li>
                  <li><strong>Postal/Event Address:</strong> Used strictly to dispatch bespoke orders or arrange bridal henna sessions at your convenience.</li>
                  <li><strong>Tailoring / Appointment Notes:</strong> Measurements, preferences, and customized henna hand/foot package directives.</li>
                  <li><strong>Preferences and State:</strong> System credentials, dark-mode configuration, and preferred language options.</li>
                </ul>
              </section>

              {/* How We Use It - EN */}
              <section className="space-y-4">
                <h2 className="font-serif text-2xl text-emerald-deep font-semibold">3. Purpose of Processing</h2>
                <p>
                  Collected data is strictly operated to execute requested utilities:
                </p>
                <ul className="list-disc pl-6 space-y-2 text-sm text-emerald-deep/70">
                  <li>Processing, verifying, and dispatching bespoke artisanal crafts or reservations.</li>
                  <li>Communicating booking slots or confirming delivery details via phone calls.</li>
                  <li>Enhancing user journeys, visual themes, and site capabilities.</li>
                  <li>Disseminating opt-in rewards or collection notifications.</li>
                </ul>
              </section>

              {/* Cookies and Storage - EN */}
              <section className="space-y-4">
                <h2 className="font-serif text-2xl text-emerald-deep font-semibold">4. Cookies and State Persistence</h2>
                <div className="flex gap-4 p-4 bg-emerald-deep/[0.02] rounded-2xl border border-emerald-deep/5">
                  <Cookie className="text-rose-gold shrink-0 mt-1" size={20} />
                  <p className="text-sm">
                    We utilize browser storage options (Local Storage) to persist your aesthetic themes (light/dark layout) and selected localizations, providing an integrated native feel across sessions without server-side lag.
                  </p>
                </div>
              </section>

              {/* Security - EN */}
              <section className="space-y-4">
                <h2 className="font-serif text-2xl text-emerald-deep font-semibold">5. Strict Security Controls</h2>
                <p>
                  We have instituted rigorous technical safeguards to secure gathered attributes. All inputs submitted via order flows are transmitted via secured protocols and protected against accidental data leaks, unauthorized access, or manipulation.
                </p>
              </section>

              {/* User Rights - EN */}
              <section className="space-y-4">
                <h2 className="font-serif text-2xl text-emerald-deep font-semibold">6. Choice, Consent, & Removal</h2>
                <div className="flex gap-4 p-4 bg-emerald-deep/[0.02] rounded-2xl border border-emerald-deep/5">
                  <UserCheck className="text-rose-gold shrink-0 mt-1" size={20} />
                  <p className="text-sm">
                    You hold full sovereignty to request the extraction, alteration, or complete visual delete of your submitted inquiries, event info, or contact addresses. Contacts us directly to execute these changes instantly.
                  </p>
                </div>
              </section>

              {/* Contact Information - EN */}
              <section className="space-y-4 border-t border-emerald-deep/5 pt-8">
                <h2 className="font-serif text-2xl text-emerald-deep font-semibold">7. Contact & Support Escalations</h2>
                <p>
                  For immediate clarifications regarding our privacy governance or terms, connect with us through the channels below:
                </p>
                <div className="flex flex-col sm:flex-row gap-4 pt-2">
                  <div className="flex items-center gap-2 text-sm">
                    <Mail size={16} className="text-rose-gold" />
                    <span>hello@brishtys.com</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <span className="text-rose-gold font-bold">☏</span>
                    <span>+880 1830-896222</span>
                  </div>
                </div>
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
