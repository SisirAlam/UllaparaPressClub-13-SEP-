import { usePressClub } from '../context/PressClubContext';
import HeroSlider from './HeroSlider';
import AdvertisementBanner from './AdvertisementBanner';
import { 
  Sparkles, 
  ArrowRight, 
  ShieldCheck, 
  Award, 
  UserPlus,
  ExternalLink,
  Smartphone
} from 'lucide-react';

interface HeroProps {
  onNavigate: (sectionId: string) => void;
}

export default function Hero({ onNavigate }: HeroProps) {
  const { clubInfo, images, setIsRecruitmentModalOpen, setIsAndroidModalOpen } = usePressClub();

  return (
    <section id="home" className="relative pt-36 pb-12 md:pt-40 md:pb-16 overflow-hidden bg-gradient-to-r from-[#0d3b66] via-[#103e6d] to-[#1e293b] text-white">
      
      {/* Giant subtle watermark "৫০" from Bento design */}
      <div className="absolute inset-0 flex items-center justify-center opacity-10 select-none pointer-events-none overflow-hidden">
        <span className="text-[16rem] sm:text-[22rem] lg:text-[26rem] font-black text-white font-serif tracking-tighter leading-none">
          ৫০
        </span>
      </div>

      {/* Ambient background building overlay */}
      <div 
        className="absolute inset-0 opacity-10 bg-cover bg-center mix-blend-luminosity"
        style={{
          backgroundImage: `url('${images.building}')`
        }}
      ></div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        
        {/* Top Section: Core Intro & Identity */}
        <div className="grid lg:grid-cols-12 gap-8 items-center">
          
          {/* Left Column: Core Message & Call to Action */}
          <div className="lg:col-span-8 text-center lg:text-left space-y-5">
            
            {/* Bento Amber Badge with 1977-2027 Jubilee Branding */}
            <div className="inline-flex flex-wrap items-center justify-center lg:justify-start gap-2">
              <div className="inline-flex items-center gap-2 bg-amber-500 text-slate-950 px-4 py-1.5 rounded-full text-xs font-extrabold uppercase tracking-wider shadow-sm">
                <Sparkles className="w-3.5 h-3.5 text-slate-950" />
                <span>সিরাজগঞ্জের ঐতিহ্যবাহী সাংবাদিক ফোরাম • স্থাপিত {clubInfo.establishedYear}</span>
              </div>
              <span className="bg-red-600 text-white px-3 py-1 rounded-full text-xs font-bold tracking-wide shadow-xs">
                সুবর্ণজয়ন্তী ২০২৭ (১৯৭৭-২০২৭)
              </span>
            </div>

            {/* Main Headline */}
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-tight font-serif">
              "এগিয়ে যাও, এগিয়ে নাও <br className="hidden sm:inline" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-amber-400 to-amber-200">
                সোনার বাংলাদেশ"
              </span>
            </h1>

            {/* Quotation Motto */}
            <div className="bg-white/5 border-l-4 border-amber-400 p-3 sm:p-4 rounded-r-xl backdrop-blur-xs text-left max-w-2xl mx-auto lg:mx-0">
              <p className="text-xs sm:text-sm text-slate-200 italic font-serif leading-relaxed">
                "{clubInfo.motto || clubInfo.tagline}"
              </p>
            </div>

            {/* Description with ICT Partner Text */}
            <p className="text-sm sm:text-base text-slate-300 leading-relaxed max-w-2xl mx-auto lg:mx-0 font-normal">
              {clubInfo.establishedYear} সাল থেকে উত্তরবঙ্গের সিরাজগঞ্জে বস্তুনিষ্ঠ সাংবাদিকতা ও সমাজ উন্নয়নে নিয়োজিত {clubInfo.nameBangla}। আইসিটি পার্টনার: <strong>Sristi Communication</strong>-এর সার্বিক সহযোগিতায় সুবর্ণজয়ন্তী ২০২৭-এর ডিজিটাল তথ্য বাতায়ন।
            </p>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3 pt-1">
              <button
                onClick={() => onNavigate('jubilee')}
                className="inline-flex items-center gap-2 bg-amber-500 text-slate-950 px-5 py-3 rounded-xl font-bold shadow-lg shadow-amber-950/30 hover:bg-amber-400 hover:scale-[1.02] transition-all duration-150 text-xs sm:text-sm"
              >
                <Award className="w-4 h-4 text-slate-950" />
                সুবর্ণজয়ন্তী ২০২৭ (১৯৭৭-২০২৭)
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={() => setIsAndroidModalOpen(true)}
                className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white px-5 py-3 rounded-xl font-bold shadow-md hover:scale-[1.02] transition-all duration-150 text-xs sm:text-sm"
              >
                <Smartphone className="w-4 h-4 text-emerald-200" />
                অ্যান্ড্রয়েড অ্যাপ
              </button>

              <button
                onClick={() => setIsRecruitmentModalOpen(true)}
                className="inline-flex items-center gap-2 bg-white text-[#0d3b66] px-5 py-3 rounded-xl font-bold shadow-md hover:bg-slate-100 hover:scale-[1.02] transition-all duration-150 text-xs sm:text-sm"
              >
                <UserPlus className="w-4 h-4 text-amber-600" />
                সদস্য সংগ্রহ ও নবায়ন
              </button>

              <a
                href="https://facebook.com/UllaparaPressClub"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white px-4 py-3 rounded-xl font-bold shadow-sm transition text-xs sm:text-sm"
              >
                <span>facebook.com/UllaparaPressClub</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>

              <button
                onClick={() => onNavigate('complaint')}
                className="inline-flex items-center gap-2 border border-white/40 text-white px-4 py-3 rounded-xl font-bold hover:bg-white/10 backdrop-blur-xs transition duration-150 text-xs sm:text-sm"
              >
                <ShieldCheck className="w-4 h-4 text-amber-400" />
                তথ্য ও অভিযোগ দিন
              </button>
            </div>

          </div>

          {/* Right Column: Frosted Golden Jubilee Bento Emblem & Recruitment Card */}
          <div className="lg:col-span-4 flex flex-col items-center gap-4">
            <div className="w-full bg-white/10 backdrop-blur-md rounded-3xl border border-white/20 p-6 shadow-2xl flex flex-col items-center justify-center text-center relative overflow-hidden group hover:border-amber-400/50 transition-all">
              
              {/* Subtle gold corner indicator */}
              <div className="absolute top-0 right-0 w-24 h-24 bg-amber-400/10 rounded-full blur-xl pointer-events-none"></div>

              {/* Logo Emblem */}
              <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-amber-400 shadow-md bg-white p-0.5 mb-2.5 group-hover:scale-105 transition-transform flex items-center justify-center">
                {images?.logo ? (
                  <img
                    src={images.logo}
                    alt="উল্লাপাড়া প্রেসক্লাব লোগো"
                    className="w-full h-full object-contain rounded-full"
                    referrerPolicy="no-referrer"
                  />
                ) : (
                  <Sparkles className="w-8 h-8 text-amber-500" />
                )}
              </div>

              {/* Badge top */}
              <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-amber-500 text-slate-950 font-bold text-xs uppercase tracking-wider mb-1 shadow-sm">
                <Sparkles className="w-3.5 h-3.5" />
                সুবর্ণজয়ন্তী উৎসব
              </div>

              {/* Year */}
              <span className="text-4xl sm:text-5xl font-black text-amber-400 font-mono tracking-tight">
                ২০২৭
              </span>

              <h3 className="text-white font-bold mt-1 tracking-widest uppercase text-xs sm:text-sm font-serif">
                সুবর্ণজয়ন্তী • GOLDEN JUBILEE
              </h3>

              <div className="h-1 w-12 bg-amber-500 my-2 rounded-full"></div>

              <p className="text-xs text-slate-200">
                ১৯৭৭ – ২০২৭ : গৌরবময় ৫০ বছর পূর্তি
              </p>
              <p className="text-[11px] text-amber-300/90 mt-0.5">
                {clubInfo.address}
              </p>

              {/* Action buttons inside frosted box */}
              <div className="w-full pt-4 mt-4 border-t border-white/15 flex flex-col gap-2">
                <button
                  onClick={() => onNavigate('jubilee')}
                  className="w-full py-2 px-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold shadow-md transition"
                >
                  কাউন্টডাউন ও কর্মসূচি
                </button>
                <div className="text-[11px] text-slate-300">
                  আইসিটি পার্টনার: <span className="text-amber-300 font-semibold">{clubInfo.sponsor}</span>
                </div>
              </div>

            </div>

            {/* Quick Banner Trigger Card */}
            <div 
              onClick={() => setIsRecruitmentModalOpen(true)}
              className="w-full bg-gradient-to-r from-amber-500 to-amber-600 rounded-2xl p-3 text-slate-950 shadow-lg cursor-pointer hover:brightness-105 transition flex items-center justify-between gap-3 border border-amber-300"
            >
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-slate-950 text-amber-400 flex items-center justify-center font-bold shrink-0">
                  <UserPlus className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-black tracking-wide uppercase">সদস্য সংগ্রহ ও নবায়ন</h4>
                  <p className="text-[10px] font-medium text-slate-900 leading-tight">আবেদনের শেষ তারিখ: ১৫ জুন ২০২৬</p>
                </div>
              </div>
              <span className="text-[11px] font-extrabold bg-slate-950 text-white px-2 py-1 rounded-lg shrink-0">
                আবেদন →
              </span>
            </div>

          </div>

        </div>

        {/* Centerpiece: Automatic Sliding Main Banner with Uploaded Committee Photos */}
        <div className="pt-2">
          <div className="flex items-center justify-between mb-3 px-1">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-ping"></span>
              <h3 className="text-sm sm:text-base font-bold text-white font-serif flex items-center gap-2">
                <span>মেইন ব্যানার স্লাইডার — উল্লাপাড়া উপজেলা প্রেসক্লাব কার্যক্রম ও পরিষদ</span>
              </h3>
            </div>
            <span className="text-xs text-amber-300/80 hidden sm:inline">
              স্বয়ংক্রিয় স্লাইডিং • ছবি ও স্লাইড এডিটযোগ্য
            </span>
          </div>

          <HeroSlider onNavigate={onNavigate} />
        </div>

      </div>
    </section>
  );
}

