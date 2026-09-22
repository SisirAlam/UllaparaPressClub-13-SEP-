import React, { useState, useEffect } from 'react';
import { Megaphone, Phone, Mail, Sparkles, ExternalLink, X, CheckCircle2 } from 'lucide-react';
import { usePressClub } from '../context/PressClubContext';

interface AdvertisementBannerProps {
  variant?: 'top-strip' | 'hero-bottom' | 'sidebar' | 'footer-pre' | 'inline';
  className?: string;
}

export default function AdvertisementBanner({ variant = 'hero-bottom', className = '' }: AdvertisementBannerProps) {
  const { clubInfo, adConfig } = usePressClub();
  const [isAdModalOpen, setIsAdModalOpen] = useState(false);
  const [adFormSubmitted, setAdFormSubmitted] = useState(false);
  const [advertiserName, setAdvertiserName] = useState('');
  const [advertiserPhone, setAdvertiserPhone] = useState('');
  const [adType, setAdType] = useState('টপ ব্যানার (Top Header Banner)');

  // Dynamic Google AdSense Loader
  useEffect(() => {
    if (adConfig?.enabled && adConfig?.adsenseClientId && typeof window !== 'undefined') {
      const existing = document.querySelector('script[src*="pagead2.googlesyndication.com"]');
      if (!existing) {
        const script = document.createElement('script');
        script.src = `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${encodeURIComponent(adConfig.adsenseClientId.trim())}`;
        script.async = true;
        script.crossOrigin = 'anonymous';
        document.head.appendChild(script);
      }
    }
  }, [adConfig?.enabled, adConfig?.adsenseClientId]);

  if (adConfig && !adConfig.enabled) {
    return null;
  }

  const hotlinePhone = adConfig?.bannerPhone || clubInfo.phone;
  const contactEmail = adConfig?.bannerEmail || clubInfo.email;

  const handleAdSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!advertiserName || !advertiserPhone) return;
    setAdFormSubmitted(true);
    setTimeout(() => {
      setAdFormSubmitted(false);
      setIsAdModalOpen(false);
      setAdvertiserName('');
      setAdvertiserPhone('');
    }, 2200);
  };

  // 1. Top Strip Variant (Above or below banner)
  if (variant === 'top-strip') {
    // If custom HTML is provided for header
    if (adConfig?.customHeaderHtml) {
      return (
        <div 
          className={`no-print advertisement-banner w-full overflow-hidden my-1 flex justify-center ${className}`}
          dangerouslySetInnerHTML={{ __html: adConfig.customHeaderHtml }}
        />
      );
    }

    return (
      <>
        <aside 
          aria-label="বিজ্ঞাপন স্লট"
          className={`no-print advertisement-banner bg-gradient-to-r from-amber-500 via-amber-400 to-amber-500 text-slate-950 py-2 px-4 shadow-sm border-b border-amber-300 font-sans ${className}`}
        >
          <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2 text-xs sm:text-sm">
            <div className="flex items-center gap-2">
              <span className="bg-slate-950 text-amber-400 font-extrabold px-2 py-0.5 rounded text-[11px] uppercase tracking-wider flex items-center gap-1">
                <Megaphone className="w-3 h-3" />
                বিজ্ঞাপন
              </span>
              <strong className="font-extrabold text-slate-950 text-sm">
                এখানে আপনার বিজ্ঞাপন দিন
              </strong>
              <span className="hidden md:inline text-slate-800">
                — উল্লাপাড়া উপজেলা প্রেসক্লাব পোর্টালে আপনার প্রতিষ্ঠান বা পণ্যের প্রচার বাড়ান
              </span>
            </div>
            <div className="flex items-center gap-2.5">
              <span className="hidden sm:inline-flex items-center gap-1 font-bold text-slate-900 text-xs">
                <Phone className="w-3.5 h-3.5 text-slate-950" />
                হটলাইন: {hotlinePhone}
              </span>
              <button
                onClick={() => setIsAdModalOpen(true)}
                className="bg-slate-950 hover:bg-slate-800 text-amber-300 hover:text-white px-3 py-1 rounded-full text-xs font-bold transition shadow-xs flex items-center gap-1 cursor-pointer"
              >
                <span>বিজ্ঞাপন দিন</span>
                <ExternalLink className="w-3 h-3" />
              </button>
            </div>
          </div>
        </aside>

        {isAdModalOpen && renderModal()}
      </>
    );
  }

  // 2. Sidebar Variant (Responsive 300x250 format)
  if (variant === 'sidebar') {
    if (adConfig?.customSidebarHtml) {
      return (
        <div 
          className={`no-print advertisement-banner w-full overflow-hidden my-3 flex justify-center ${className}`}
          dangerouslySetInnerHTML={{ __html: adConfig.customSidebarHtml }}
        />
      );
    }

    if (adConfig?.adsenseSidebarSlot && adConfig?.adsenseClientId) {
      return (
        <div className={`no-print advertisement-banner p-2 bg-slate-50 border border-slate-200 rounded-2xl text-center overflow-hidden my-3 ${className}`}>
          <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block mb-1">বিজ্ঞাপন (AdSense)</span>
          <ins 
            className="adsbygoogle"
            style={{ display: 'block' }}
            data-ad-client={adConfig.adsenseClientId}
            data-ad-slot={adConfig.adsenseSidebarSlot}
            data-ad-format="auto"
            data-full-width-responsive="true"
          />
        </div>
      );
    }

    return (
      <>
        <div className={`no-print advertisement-banner bg-gradient-to-br from-amber-50/80 via-white to-amber-100/60 border-2 border-dashed border-amber-300 hover:border-amber-500 rounded-2xl p-5 text-center shadow-xs transition duration-200 group ${className}`}>
          <div className="inline-flex items-center gap-1 bg-amber-500 text-slate-950 text-[10px] font-extrabold px-2.5 py-0.5 rounded-full uppercase tracking-wider mb-2.5">
            <Megaphone className="w-3 h-3" />
            বিজ্ঞাপন স্লট (৩০০×২৫০)
          </div>
          <h4 className="text-base font-bold text-[#0d3b66] group-hover:text-amber-700 transition">
            এখানে আপনার বিজ্ঞাপন দিন
          </h4>
          <p className="text-xs text-slate-600 mt-1.5 leading-relaxed">
            উত্তরবঙ্গের শীর্ষ পাঠকপ্রিয় সাংবাদিক পোর্টালে বিজ্ঞাপন দিয়ে গ্রাহকের কাছে পৌঁছান।
          </p>
          <div className="mt-3.5 pt-3 border-t border-amber-200/60 flex items-center justify-between text-xs">
            <span className="font-semibold text-slate-700 text-[11px] flex items-center gap-1">
              <Phone className="w-3 h-3 text-amber-600" />
              {hotlinePhone}
            </span>
            <button
              onClick={() => setIsAdModalOpen(true)}
              className="px-3 py-1 bg-amber-500 hover:bg-amber-400 text-slate-950 rounded-lg font-bold text-xs shadow-xs transition cursor-pointer"
            >
              বুকিং করুন
            </button>
          </div>
        </div>

        {isAdModalOpen && renderModal()}
      </>
    );
  }

  // 3. Pre-Footer Variant (Prominent responsive wide box)
  if (variant === 'footer-pre') {
    if (adConfig?.customInfeedHtml) {
      return (
        <div 
          className={`no-print advertisement-banner w-full overflow-hidden my-4 flex justify-center ${className}`}
          dangerouslySetInnerHTML={{ __html: adConfig.customInfeedHtml }}
        />
      );
    }

    if (adConfig?.adsenseInfeedSlot && adConfig?.adsenseClientId) {
      return (
        <section aria-label="বিজ্ঞাপন এরিয়া" className={`no-print advertisement-banner py-4 bg-slate-50 border-t border-b border-slate-200 text-center ${className}`}>
          <div className="max-w-7xl mx-auto px-4">
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block mb-1">বিজ্ঞাপন (AdSense In-Feed)</span>
            <ins 
              className="adsbygoogle"
              style={{ display: 'block' }}
              data-ad-client={adConfig.adsenseClientId}
              data-ad-slot={adConfig.adsenseInfeedSlot}
              data-ad-format="auto"
              data-full-width-responsive="true"
            />
          </div>
        </section>
      );
    }

    return (
      <>
        <section aria-label="বিজ্ঞাপন এরিয়া" className={`no-print advertisement-banner py-6 bg-slate-100 border-t border-b border-slate-200 ${className}`}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="bg-gradient-to-r from-[#0d3b66] via-[#124e86] to-[#0d3b66] text-white rounded-2xl p-4 sm:p-6 shadow-md border border-blue-900/60 flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-3.5 text-center md:text-left">
                <div className="w-12 h-12 rounded-xl bg-amber-500 text-slate-950 flex items-center justify-center shrink-0 shadow-md">
                  <Megaphone className="w-6 h-6" />
                </div>
                <div>
                  <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded bg-amber-400/20 text-amber-300 text-[11px] font-bold uppercase tracking-wider mb-1">
                    <Sparkles className="w-3 h-3" />
                    রেসপন্সিভ বিজ্ঞাপন এরিয়া
                  </div>
                  <h3 className="text-lg sm:text-xl font-bold font-serif text-white">
                    এখানে আপনার বিজ্ঞাপন দিন — উল্লাপাড়া প্রেসক্লাব ডিজিটাল নেটওয়ার্ক
                  </h3>
                  <p className="text-xs sm:text-sm text-blue-100/80 mt-0.5">
                    ওয়েবসাইটের প্রতিটি পাতায় এবং শীর্ষ ব্যানারে আপনার বাণিজ্যিক প্রতিষ্ঠানের বিজ্ঞাপন প্রচার করুন
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap items-center justify-center gap-3 shrink-0">
                <a
                  href={`tel:${hotlinePhone}`}
                  className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-white font-bold text-xs sm:text-sm flex items-center gap-1.5 transition"
                >
                  <Phone className="w-4 h-4 text-amber-400" />
                  <span>{hotlinePhone}</span>
                </a>
                <button
                  onClick={() => setIsAdModalOpen(true)}
                  className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold text-xs sm:text-sm shadow-md transition hover:scale-[1.02] flex items-center gap-1.5 cursor-pointer"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>বিজ্ঞাপন বুকিং ফরম</span>
                </button>
              </div>
            </div>
          </div>
        </section>

        {isAdModalOpen && renderModal()}
      </>
    );
  }

  // 4. Hero Bottom / Section Divider Variant (Default Leaderboard)
  if (adConfig?.adsenseHeaderSlot && adConfig?.adsenseClientId) {
    return (
      <div className={`no-print advertisement-banner max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 my-6 text-center ${className}`}>
        <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block mb-1">বিজ্ঞাপন (AdSense Leaderboard)</span>
        <ins 
          className="adsbygoogle"
          style={{ display: 'block' }}
          data-ad-client={adConfig.adsenseClientId}
          data-ad-slot={adConfig.adsenseHeaderSlot}
          data-ad-format="auto"
          data-full-width-responsive="true"
        />
      </div>
    );
  }

  return (
    <>
      <div className={`no-print advertisement-banner max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 my-6 ${className}`}>
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-amber-50 via-white to-amber-50 border-2 border-dashed border-amber-300 hover:border-amber-400 p-4 sm:p-5 shadow-xs transition duration-200">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            
            <div className="flex items-center gap-3 text-center sm:text-left">
              <div className="w-11 h-11 rounded-xl bg-amber-500 text-slate-950 flex items-center justify-center shrink-0 shadow-xs">
                <Megaphone className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center justify-center sm:justify-start gap-2 mb-0.5">
                  <span className="bg-amber-500 text-slate-950 text-[10px] font-black px-2 py-0.5 rounded uppercase tracking-wider">
                    বিজ্ঞাপন স্লট (Responsive Leaderboard 728×90 / 970×90)
                  </span>
                  <span className="text-xs text-amber-700 font-bold hidden md:inline">
                    • সুবর্ণজয়ন্তী বিশেষ ছাড়
                  </span>
                </div>
                <h3 className="text-base sm:text-lg font-extrabold text-[#0d3b66] font-serif">
                  এখানে আপনার বিজ্ঞাপন দিন
                </h3>
                <p className="text-xs text-slate-600">
                  উল্লাপাড়া উপজেলা প্রেসক্লাব পোর্টালে আপনার বিজ্ঞাপন প্রচারে যোগাযোগ করুন: {hotlinePhone}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2.5 shrink-0">
              <a
                href={`tel:${hotlinePhone}`}
                className="px-3.5 py-2 rounded-xl bg-white border border-slate-300 hover:border-amber-500 text-slate-800 text-xs font-bold transition flex items-center gap-1.5 shadow-2xs"
              >
                <Phone className="w-3.5 h-3.5 text-amber-600" />
                <span>{hotlinePhone}</span>
              </a>
              <button
                onClick={() => setIsAdModalOpen(true)}
                className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold shadow-xs hover:shadow transition flex items-center gap-1.5 cursor-pointer"
              >
                <span>বিজ্ঞাপন দিন →</span>
              </button>
            </div>

          </div>
        </div>
      </div>

      {isAdModalOpen && renderModal()}
    </>
  );

  // Helper Modal for Inquiries
  function renderModal() {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in duration-200">
        <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-slate-200 relative overflow-hidden">
          
          <button
            onClick={() => setIsAdModalOpen(false)}
            className="absolute top-4 right-4 p-2 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-2xl bg-amber-500 text-slate-950 flex items-center justify-center font-bold">
              <Megaphone className="w-6 h-6" />
            </div>
            <div>
              <span className="text-[11px] font-bold text-amber-700 uppercase tracking-wider">
                বিজ্ঞাপন প্রচার কেন্দ্র
              </span>
              <h3 className="text-xl font-extrabold text-[#0d3b66] font-serif">
                এখানে আপনার বিজ্ঞাপন দিন
              </h3>
            </div>
          </div>

          {adFormSubmitted ? (
            <div className="py-8 text-center space-y-3">
              <CheckCircle2 className="w-14 h-14 text-emerald-600 mx-auto animate-bounce" />
              <h4 className="text-lg font-bold text-[#0d3b66]">আপনার বিজ্ঞাপন অনুরোধ গৃহীত হয়েছে!</h4>
              <p className="text-xs text-slate-600">
                শীঘ্রই উল্লাপাড়া প্রেসক্লাব বাণিজ্যিক বিভাগ থেকে আপনার প্রদত্ত মোবাইল নম্বরে যোগাযোগ করা হবে।
              </p>
            </div>
          ) : (
            <>
              <p className="text-xs text-slate-600 mb-4 leading-relaxed">
                উল্লাপাড়া প্রেসক্লাবের ওয়েবসাইট, সুবর্ণজয়ন্তী বিশেষ সংখ্যা ও ডিজিটাল নেটওয়ার্কে বিজ্ঞাপন দিয়ে লাখো পাঠকের কাছে সহজে পৌঁছান।
              </p>

              {/* Slot Rates Overview */}
              <div className="grid grid-cols-2 gap-2.5 mb-5 text-xs">
                <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200">
                  <span className="font-bold text-[#0d3b66] block">টপ ব্যানার (Leaderboard)</span>
                  <span className="text-slate-500 text-[11px]">প্রচ্ছদের শীর্ষে সার্বক্ষণিক দৃশ্যমান</span>
                </div>
                <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200">
                  <span className="font-bold text-[#0d3b66] block">মেইন ব্যানার সংলগ্ন</span>
                  <span className="text-slate-500 text-[11px]">কমিটি স্লাইডার ও সংবাদের নিচে</span>
                </div>
                <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200">
                  <span className="font-bold text-[#0d3b66] block">সাইডবার রেকটেঙ্গেল</span>
                  <span className="text-slate-500 text-[11px]">নোটিশ বোর্ড ও ইভেন্টের পাশে</span>
                </div>
                <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200">
                  <span className="font-bold text-[#0d3b66] block">ফুটার ও প্রতিটি পাতা</span>
                  <span className="text-slate-500 text-[11px]">সাইটব্যাপী রেসপন্সিভ ব্যানার</span>
                </div>
              </div>

              {/* Booking Form */}
              <form onSubmit={handleAdSubmit} className="space-y-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    বিজ্ঞাপনদাতা / প্রতিষ্ঠানের নাম *
                  </label>
                  <input
                    type="text"
                    required
                    value={advertiserName}
                    onChange={(e) => setAdvertiserName(e.target.value)}
                    placeholder="উদাঃ সৃষ্টি কমিউনিকেশন / গ্রামীণ স্টোর"
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      মোবাইল নম্বর *
                    </label>
                    <input
                      type="tel"
                      required
                      value={advertiserPhone}
                      onChange={(e) => setAdvertiserPhone(e.target.value)}
                      placeholder="০১৭১X-XXXXXX"
                      className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      কাঙ্ক্ষিত বিজ্ঞাপন স্লট
                    </label>
                    <select
                      value={adType}
                      onChange={(e) => setAdType(e.target.value)}
                      className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500 bg-white"
                    >
                      <option value="টপ ব্যানার (Top Header Banner)">টপ ব্যানার (Header Banner)</option>
                      <option value="মেইন স্লাইডার সংলগ্ন ব্যানার">মেইন স্লাইডার সংলগ্ন ব্যানার</option>
                      <option value="সাইডবার ও নোটিশ ব্যানার">সাইডবার ও নোটিশ ব্যানার</option>
                      <option value="ফুটার ও প্রতিটি পাতা ব্যানার">ফুটার ও প্রতিটি পাতা ব্যানার</option>
                    </select>
                  </div>
                </div>

                <div className="pt-2 flex items-center justify-between gap-3">
                  <a
                    href={`tel:${hotlinePhone}`}
                    className="flex-1 py-2.5 text-center text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition flex items-center justify-center gap-1.5"
                  >
                    <Phone className="w-3.5 h-3.5 text-amber-600" />
                    <span>সরাসরি কল: {hotlinePhone}</span>
                  </a>
                  <button
                    type="submit"
                    className="flex-1 py-2.5 text-center text-xs font-bold text-slate-950 bg-amber-500 hover:bg-amber-400 rounded-xl shadow-md transition cursor-pointer"
                  >
                    অনুরোধ জমা দিন
                  </button>
                </div>
              </form>

              <div className="mt-4 pt-3 border-t border-slate-100 text-[11px] text-slate-500 flex items-center justify-between">
                <span>বিজ্ঞাপন নীতি ও নীতিমালা প্রযোজ্য</span>
                <span className="font-semibold text-amber-700">আইসিটি সেল: উল্লাপাড়া প্রেসক্লাব</span>
              </div>
            </>
          )}

        </div>
      </div>
    );
  }
}

