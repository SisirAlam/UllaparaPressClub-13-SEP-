import { usePressClub } from '../context/PressClubContext';
import FooterNewsletter from './FooterNewsletter';
import { 
  ArrowUp, 
  Mail, 
  Phone, 
  MapPin, 
  Sparkles, 
  ShieldCheck, 
  UserPlus,
  Download,
  Smartphone,
  UserCheck
} from 'lucide-react';

interface FooterProps {
  onNavigate: (sectionId: string) => void;
}

export default function Footer({ onNavigate }: FooterProps) {
  const { 
    clubInfo, 
    images, 
    setIsAdminOpen, 
    setIsRecruitmentModalOpen,
    setIsExportModalOpen,
    setIsAndroidModalOpen,
    setIsMemberDashboardOpen
  } = usePressClub();

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="no-print bg-[#08223c] text-blue-100/70 border-t border-blue-900/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-12">
        {/* Member Sign-up & Newsletter Subscription Form */}
        <FooterNewsletter />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          
          {/* Column 1: Brand & Identity */}
          <div className="space-y-4">
            <div className="flex items-center gap-3 text-white">
              <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-amber-400 shadow-md bg-white p-0.5 shrink-0 flex items-center justify-center">
                {images?.logo ? (
                  <img
                    src={images.logo}
                    alt="উল্লাপাড়া প্রেসক্লাব লোগো"
                    className="w-full h-full object-contain rounded-full"
                    referrerPolicy="no-referrer"
                  />
                ) : (
                  <Sparkles className="w-6 h-6 text-amber-500" />
                )}
              </div>
              <div>
                <h3 className="font-bold font-serif text-lg text-white">
                  {clubInfo.nameBangla}
                </h3>
                <span className="text-xs text-amber-300 font-mono">
                  স্থাপিত {clubInfo.establishedYear}
                </span>
              </div>
            </div>

            <p className="text-xs text-blue-100/70 leading-relaxed">
              {clubInfo.establishedYear} সাল থেকে সিরাজগঞ্জের উল্লাপাড়া উপজেলায় সাংবাদিকতার মানোন্নয়ন, সত্যনিষ্ঠ সংবাদ প্রকাশ এবং গণমানুষের সেবায় উৎসর্গীকৃত প্রতিষ্ঠান।
            </p>

            <div className="pt-2 flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-400/20 text-amber-300 border border-amber-400/40">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                সুবর্ণজয়ন্তী ২০২৭
              </span>
              <button
                onClick={() => setIsMemberDashboardOpen(true)}
                className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-blue-700/80 hover:bg-blue-600 text-white border border-blue-500/60 transition cursor-pointer"
              >
                <UserCheck className="w-3 h-3" />
                সদস্য ড্যাশবোর্ড
              </button>
              <button
                onClick={() => setIsAdminOpen(true)}
                className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-blue-900/80 hover:bg-amber-500 hover:text-slate-950 text-blue-200 border border-blue-700/60 transition"
              >
                <ShieldCheck className="w-3 h-3" />
                অ্যাডমিন পোর্টাল
              </button>
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div className="space-y-4">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider font-serif">
              প্রয়োজনীয় পাতা ও সেবা
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button 
                  onClick={() => onNavigate('home')} 
                  className="hover:text-amber-300 transition"
                >
                  মূল প্রচ্ছদ (Home)
                </button>
              </li>
              <li>
                <button 
                  onClick={() => onNavigate('about')} 
                  className="hover:text-amber-300 transition"
                >
                  আমাদের ইতিহাস ও লক্ষ্য
                </button>
              </li>
              <li>
                <button 
                  onClick={() => onNavigate('complaint')} 
                  className="hover:text-amber-300 transition font-bold text-amber-300 flex items-center gap-1"
                >
                  <span>তথ্য ও অভিযোগ প্রদান</span>
                </button>
              </li>
              <li>
                <button 
                  onClick={() => onNavigate('committee')} 
                  className="hover:text-amber-300 transition"
                >
                  কার্যনির্বাহী পরিষদ ও সদস্যবৃন্দ
                </button>
              </li>
              <li>
                <button 
                  onClick={() => onNavigate('distinguished')} 
                  className="hover:text-amber-300 transition"
                >
                  গুণী ও প্রবীণ সাংবাদিকবৃন্দ
                </button>
              </li>
              <li>
                <button 
                  onClick={() => setIsRecruitmentModalOpen(true)} 
                  className="hover:text-amber-300 transition text-amber-400 flex items-center gap-1"
                >
                  <UserPlus className="w-3 h-3" />
                  <span>সদস্য সংগ্রহ ও নবায়ন ফরম</span>
                </button>
              </li>
              <li>
                <button 
                  onClick={() => setIsMemberDashboardOpen(true)} 
                  className="hover:text-blue-300 transition text-blue-300 font-semibold flex items-center gap-1.5"
                >
                  <UserCheck className="w-3.5 h-3.5 text-blue-400" />
                  <span>সদস্য ড্যাশবোর্ড ও ডিজিটাল প্রেস কার্ড</span>
                </button>
              </li>
              <li>
                <button 
                  onClick={() => onNavigate('notices')} 
                  className="hover:text-amber-300 transition"
                >
                  প্রেস বিজ্ঞপ্তি ও নোটিশ বোর্ড
                </button>
              </li>
              <li>
                <button 
                  onClick={() => onNavigate('gallery')} 
                  className="hover:text-amber-300 transition"
                >
                  প্রেসক্লাব মিডিয়া গ্যালারি
                </button>
              </li>
              <li className="pt-1">
                <button 
                  onClick={() => setIsAndroidModalOpen(true)} 
                  className="hover:text-emerald-300 transition text-emerald-400 font-bold flex items-center gap-1.5"
                >
                  <Smartphone className="w-3.5 h-3.5" />
                  <span>অ্যান্ড্রয়েড অ্যাপ (ইনস্টল ও APK)</span>
                </button>
              </li>
              <li>
                <button 
                  onClick={() => setIsExportModalOpen(true)} 
                  className="hover:text-amber-300 transition text-amber-300 font-bold flex items-center gap-1.5"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>ওয়েবসাইট ডাউনলোড (ZIP / HTML)</span>
                </button>
              </li>
            </ul>
          </div>

          {/* Column 3: Contact Summary */}
          <div className="space-y-4">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider font-serif">
              সরাসরি যোগাযোগ
            </h4>
            <ul className="space-y-3 text-xs">
              <li className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <span className="text-blue-100/90">{clubInfo.address}</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-amber-400 shrink-0" />
                {clubInfo.email ? (
                  <a href={`mailto:${clubInfo.email}`} className="hover:underline text-amber-300">
                    {clubInfo.email}
                  </a>
                ) : (
                  <span className="text-blue-200/50 italic">(ইমেইল সংযোজনযোগ্য)</span>
                )}
              </li>
              <li className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-amber-400 shrink-0" />
                {clubInfo.phone ? (
                  <span className="text-blue-100/90">{clubInfo.phone}</span>
                ) : (
                  <span className="text-blue-200/50 italic">(ফোন নং সংযোজনযোগ্য)</span>
                )}
              </li>
            </ul>
          </div>

          {/* Column 4: ICT Partner & Dedication */}
          <div className="space-y-4">
            <h4 className="text-sm font-bold text-amber-400 uppercase tracking-wider font-serif">
              আইসিটি পার্টনার ও কারিগরি
            </h4>
            <div className="p-4 rounded-2xl bg-[#0d3b66] border border-blue-800/80 text-xs space-y-2 border-l-4 border-l-amber-500 shadow-sm">
              <p className="font-bold text-white text-sm">
                আইসিটি পার্টনার: Sristi Communication
              </p>
              <p className="text-blue-100/70 leading-relaxed">
                উল্লাপাড়া প্রেসক্লাবের সুবর্ণজয়ন্তী ২০২৭ (১৯৭৭-২০২৭) উপলক্ষে ক্লাবের সার্বিক আধুনিকায়ন ও ওয়েব পোর্টাল বাস্তবায়নে নিবেদিত।
              </p>
            </div>

            <div className="flex flex-col gap-2">
              <button
                onClick={() => setIsAndroidModalOpen(true)}
                className="w-full py-2.5 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition shadow-sm"
              >
                <Smartphone className="w-3.5 h-3.5" />
                <span>অ্যান্ড্রয়েড অ্যাপ ইনস্টল ও APK</span>
              </button>
              {typeof window !== 'undefined' && !window.PRESSCLUB_WP_CONFIG && (
                <button
                  onClick={() => setIsExportModalOpen(true)}
                  className="w-full py-2.5 px-3 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs flex items-center justify-center gap-1.5 transition shadow-sm cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>১-ক্লিকে ওয়ার্ডপ্রেস থিম (ZIP) নামান</span>
                </button>
              )}
            </div>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-blue-900/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
          <p className="text-blue-200/60 text-center sm:text-left">
            © ১৯৭৭ – ২০২৭ {clubInfo.nameBangla}। সুবর্ণজয়ন্তী ২০২৭ (১৯৭৭-২০২৭)। সর্বস্বত্ব সংরক্ষিত। সিরাজগঞ্জ, বাংলাদেশ।
          </p>

          <div className="flex items-center gap-4">
            <span className="text-blue-200/70">
              আইসিটি পার্টনার: <strong className="text-amber-300 font-semibold">Sristi Communication</strong>
            </span>
            <button
              onClick={scrollToTop}
              className="p-2 rounded-lg bg-[#0d3b66] hover:bg-amber-500 hover:text-slate-950 text-white border border-blue-800 transition"
              aria-label="Back to top"
            >
              <ArrowUp className="w-4 h-4" />
            </button>
          </div>
        </div>

      </div>
    </footer>
  );
}
