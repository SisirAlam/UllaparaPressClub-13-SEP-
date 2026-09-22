import { useState, useEffect } from 'react';
import { usePressClub } from '../context/PressClubContext';
import BreakingNewsTicker from './BreakingNewsTicker';
import { 
  Newspaper, 
  Menu, 
  X, 
  Mail, 
  Phone, 
  MapPin, 
  Sparkles,
  Award,
  ShieldCheck,
  UserPlus,
  Download,
  Smartphone,
  Cloud,
  KeyRound,
  Lock,
  UserCheck
} from 'lucide-react';

interface NavbarProps {
  onNavigate: (sectionId: string) => void;
  activeSection: string;
}

export default function Navbar({ onNavigate, activeSection }: NavbarProps) {
  const { 
    clubInfo, 
    images, 
    setIsAdminOpen, 
    setIsRecruitmentModalOpen,
    setIsExportModalOpen,
    setIsAndroidModalOpen,
    setIsWorkspaceModalOpen,
    setIsMemberDashboardOpen,
    authenticatedMember
  } = usePressClub();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { id: 'home', label: 'প্রচ্ছদ' },
    { id: 'about', label: 'আমাদের পরিচিতি' },
    { id: 'jubilee', label: 'সুবর্ণজয়ন্তী ২০২৭' },
    { id: 'committee', label: 'কার্যনির্বাহী পরিষদ' },
    { id: 'distinguished', label: 'গুণী সদস্য' },
    { id: 'notices', label: 'নোটিশ বোর্ড' },
    { id: 'complaint', label: 'তথ্য ও অভিযোগ প্রদান' },
    { id: 'gallery', label: 'মিডিয়া গ্যালারি' },
    { id: 'contact', label: 'যোগাযোগ' }
  ];

  const handleLinkClick = (id: string) => {
    setMobileMenuOpen(false);
    onNavigate(id);
  };

  return (
    <header className="no-print fixed top-0 left-0 right-0 z-50 transition-all duration-300">
      {/* Top Banner with Sponsorship, Contact Info & Admin trigger */}
      <div className="bg-[#0d3b66] text-slate-200 text-xs py-1.5 px-4 border-b border-blue-950/40">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-2">
          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3 sm:gap-4 text-slate-200">
            <span className="inline-flex items-center gap-1.5 text-amber-300 font-bold">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              সুবর্ণজয়ন্তী ২০২৭ (১৯৭৭-২০২৭)
            </span>
            <span className="hidden sm:inline text-blue-300/40">•</span>
            <span className="inline-flex items-center gap-1">
              <MapPin className="w-3 h-3 text-amber-400" />
              {clubInfo.address}
            </span>
            {clubInfo.email && (
              <>
                <span className="hidden md:inline text-blue-300/40">•</span>
                <span className="inline-flex items-center gap-1">
                  <Mail className="w-3 h-3 text-emerald-300" />
                  {clubInfo.email}
                </span>
              </>
            )}
          </div>

          <div className="flex items-center gap-2 sm:gap-3 text-[11px]">
            <span className="bg-slate-900/60 text-amber-300 px-2.5 py-0.5 rounded-full border border-amber-400/30 font-semibold">
              আইসিটি পার্টনার: Sristi Communication
            </span>

            {/* Android App Trigger */}
            <button
              onClick={() => setIsAndroidModalOpen(true)}
              className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold transition shadow-xs text-[11px]"
              title="অ্যান্ড্রয়েড অ্যাপ্লিকেশন ও ফোনে ইনস্টল"
            >
              <Smartphone className="w-3 h-3" />
              <span>অ্যান্ড্রয়েড অ্যাপ</span>
            </button>
            
            {/* Download Website ZIP Trigger */}
            <button
              onClick={() => setIsExportModalOpen(true)}
              className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold transition shadow-xs text-[11px]"
              title="সম্পূর্ণ ওয়েবসাইট জিপ ও অফলাইন এইচটিএমএল ডাউনলোড করুন"
            >
              <Download className="w-3 h-3" />
              <span>ডাউনলোড জিপ</span>
            </button>

            {/* Member Dashboard Trigger */}
            <button
              onClick={() => setIsMemberDashboardOpen(true)}
              className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-blue-600 hover:bg-blue-500 text-white font-bold transition shadow-xs text-[11px] cursor-pointer"
              title="প্রেসক্লাব সদস্য ড্যাশবোর্ড ও ডিজিটাল প্রেস কার্ড"
            >
              <UserCheck className="w-3 h-3 text-white" />
              <span>{authenticatedMember ? 'আমার প্রোফাইল' : 'সদস্য ড্যাশবোর্ড'}</span>
            </button>

            {/* Admin Overlay Trigger Button */}
            <button
              onClick={() => setIsAdminOpen(true)}
              className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold transition shadow-xs text-[11px] cursor-pointer"
              title="প্রেসক্লাব অভ্যন্তরীণ অ্যাডমিন পোর্টাল (PIN: 1977)"
            >
              <KeyRound className="w-3 h-3 text-slate-950" />
              <span>অ্যাডমিন লগইন</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <nav 
        className={`transition-all duration-300 ${
          isScrolled 
            ? 'bg-white/95 backdrop-blur-md shadow-md py-2.5 border-b border-slate-200/80' 
            : 'bg-white py-3 border-b border-slate-100 shadow-xs'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          {/* Logo & Title */}
          <button 
            onClick={() => handleLinkClick('home')}
            className="flex items-center gap-3 text-left focus:outline-none group"
          >
            <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-full overflow-hidden border-2 border-amber-400 shadow-md bg-white p-0.5 group-hover:scale-105 transition-transform flex items-center justify-center shrink-0">
              {images?.logo ? (
                <img
                  src={images.logo}
                  alt="উল্লাপাড়া প্রেসক্লাব লোগো"
                  className="w-full h-full object-contain rounded-full"
                  referrerPolicy="no-referrer"
                />
              ) : (
                <span className="font-bold text-xs text-amber-700">প্রেসক্লাব</span>
              )}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xl sm:text-2xl font-bold text-[#0d3b66] tracking-tight font-serif">
                  {clubInfo.nameBangla}
                </span>
                <span className="hidden sm:inline-block px-2 py-0.5 text-[10px] font-bold tracking-wider text-amber-900 bg-amber-100 border border-amber-300 rounded-full">
                  স্থাপিত {clubInfo.establishedYear}
                </span>
              </div>
              <p className="text-xs text-amber-600 font-semibold tracking-wider">
                বস্তুনিষ্ঠ সাংবাদিকতা ও সমাজ উন্নয়ন
              </p>
            </div>
          </button>

          {/* Desktop Nav Links */}
          <div className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => {
              const isActive = activeSection === link.id;
              return (
                <button
                  key={link.id}
                  onClick={() => handleLinkClick(link.id)}
                  className={`px-3 py-2 text-sm font-medium rounded-lg transition-colors duration-150 ${
                    isActive 
                      ? 'text-[#0d3b66] bg-amber-50/80 font-bold border-b-2 border-amber-500 rounded-b-none' 
                      : 'text-slate-700 hover:text-amber-600 hover:bg-slate-50'
                  }`}
                >
                  {link.label}
                </button>
              );
            })}
          </div>

          {/* Desktop Action Buttons */}
          <div className="hidden lg:flex items-center gap-2">
            <button
              onClick={() => setIsAndroidModalOpen(true)}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold text-emerald-900 bg-emerald-50 hover:bg-emerald-100 rounded-full border border-emerald-300 transition"
              title="অ্যান্ড্রয়েড অ্যাপ্লিকেশন ও ফোনে ইনস্টল"
            >
              <Smartphone className="w-3.5 h-3.5 text-emerald-600" />
              <span>অ্যান্ড্রয়েড অ্যাপ</span>
            </button>
            <button
              onClick={() => setIsExportModalOpen(true)}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold text-[#0d3b66] bg-amber-50 hover:bg-amber-100 rounded-full border border-amber-300 transition"
              title="সম্পূর্ণ ওয়েবসাইট জিপ ও অফলাইন এইচটিএমএল নামান"
            >
              <Download className="w-3.5 h-3.5 text-amber-600" />
              <span>ডাউনলোড জিপ</span>
            </button>
            <button
              onClick={() => setIsMemberDashboardOpen(true)}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold text-[#0d3b66] bg-blue-50 hover:bg-blue-100 rounded-full border border-blue-200 transition shadow-xs cursor-pointer"
              title="প্রেসক্লাব সদস্য ড্যাশবোর্ড ও ডিজিটাল প্রেস কার্ড"
            >
              <UserCheck className="w-3.5 h-3.5 text-blue-600" />
              <span>{authenticatedMember ? 'আমার ড্যাশবোর্ড' : 'সদস্য ড্যাশবোর্ড'}</span>
            </button>
            <button
              onClick={() => setIsRecruitmentModalOpen(true)}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold text-slate-950 bg-amber-400 hover:bg-amber-300 rounded-full shadow-xs transition"
            >
              <UserPlus className="w-3.5 h-3.5 text-slate-950" />
              <span>সদস্য সংগ্রহ</span>
            </button>
            <button
              onClick={() => handleLinkClick('contact')}
              className="bg-[#0d3b66] text-white px-4 py-2 rounded-full hover:bg-slate-800 text-xs sm:text-sm font-semibold transition shadow-sm"
            >
              যোগাযোগ
            </button>
            <button
              onClick={() => setIsAdminOpen(true)}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold text-slate-950 bg-amber-400 hover:bg-amber-300 rounded-full shadow-xs transition border border-amber-500/40 cursor-pointer"
              title="প্রেসক্লাব অ্যাডমিন পোর্টাল লগইন (ডিফল্ট PIN: 1977)"
            >
              <KeyRound className="w-3.5 h-3.5 text-slate-950" />
              <span>লগইন</span>
            </button>
          </div>

          {/* Mobile Menu Button & Quick Actions */}
          <div className="flex items-center lg:hidden gap-1.5">
            <button
              onClick={() => setIsMemberDashboardOpen(true)}
              className="p-2 text-white bg-blue-600 hover:bg-blue-500 rounded-full shadow-xs flex items-center justify-center cursor-pointer"
              title="সদস্য ড্যাশবোর্ড ও লগইন"
              aria-label="সদস্য ড্যাশবোর্ড"
            >
              <UserCheck className="w-4 h-4 text-white" />
            </button>
            <button
              onClick={() => setIsAdminOpen(true)}
              className="p-2 text-slate-950 bg-amber-400 hover:bg-amber-300 rounded-full shadow-xs flex items-center justify-center cursor-pointer"
              title="অ্যাডমিন লগইন (PIN: 1977)"
              aria-label="অ্যাডমিন লগইন"
            >
              <KeyRound className="w-4 h-4 text-slate-950" />
            </button>
            <button
              onClick={() => setIsRecruitmentModalOpen(true)}
              className="px-2.5 py-1.5 text-xs font-bold text-slate-950 bg-amber-400 rounded-full shadow-xs"
            >
              সদস্য আবেদন
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-slate-700 hover:text-slate-900 hover:bg-slate-100 focus:outline-none"
              aria-label="Toggle Menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Drawer */}
        {mobileMenuOpen && (
          <div className="lg:hidden bg-white border-b border-slate-200 px-4 pt-3 pb-6 space-y-1 shadow-xl animate-in slide-in-from-top-2 duration-200">
            {navLinks.map((link) => (
              <button
                key={link.id}
                onClick={() => handleLinkClick(link.id)}
                className={`w-full text-left px-4 py-2.5 text-base font-medium rounded-lg transition-colors ${
                  activeSection === link.id
                    ? 'bg-amber-50 text-[#0d3b66] font-bold border-l-4 border-amber-500'
                    : 'text-slate-700 hover:bg-slate-50'
                }`}
              >
                {link.label}
              </button>
            ))}
            <div className="pt-3 border-t border-slate-100 flex flex-col gap-2">
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  setIsMemberDashboardOpen(true);
                }}
                className="w-full py-2.5 text-center text-xs font-bold text-white bg-gradient-to-r from-blue-700 to-indigo-700 hover:from-blue-600 hover:to-indigo-600 rounded-full shadow-sm flex items-center justify-center gap-1.5"
              >
                <UserCheck className="w-4 h-4" />
                <span>{authenticatedMember ? `সদস্য ড্যাশবোর্ড (${authenticatedMember.name})` : 'সদস্য ড্যাশবোর্ড ও প্রোফাইল'}</span>
              </button>
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  setIsAndroidModalOpen(true);
                }}
                className="w-full py-2.5 text-center text-xs font-bold text-white bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-500 hover:to-emerald-600 rounded-full shadow-sm flex items-center justify-center gap-1.5"
              >
                <Smartphone className="w-4 h-4" />
                <span>অ্যান্ড্রয়েড অ্যাপ ইনস্টল ও APK</span>
              </button>
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  setIsExportModalOpen(true);
                }}
                className="w-full py-2.5 text-center text-xs font-bold text-[#0d3b66] bg-amber-50 hover:bg-amber-100 border border-amber-300 rounded-full shadow-xs flex items-center justify-center gap-1.5"
              >
                <Download className="w-4 h-4 text-amber-600" />
                <span>ওয়েবসাইট ডাউনলোড (ZIP / HTML)</span>
              </button>
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  setIsRecruitmentModalOpen(true);
                }}
                className="w-full py-2.5 text-center text-xs font-bold text-slate-950 bg-amber-400 hover:bg-amber-300 rounded-full shadow-xs flex items-center justify-center gap-1.5"
              >
                <UserPlus className="w-4 h-4" />
                <span>সদস্য সংগ্রহ ও নবায়ন ফরম</span>
              </button>
              <button
                onClick={() => handleLinkClick('contact')}
                className="w-full py-2.5 text-center text-xs font-bold text-white bg-[#0d3b66] hover:bg-slate-800 rounded-full shadow-sm"
              >
                বার্তা পাঠান / যোগাযোগ
              </button>
              <div className="flex items-center justify-between text-xs text-slate-500 pt-2 px-1">
                <span>সৌজন্যে: {clubInfo.sponsor}</span>
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    setIsAdminOpen(true);
                  }}
                  className="text-[#0d3b66] font-bold underline flex items-center gap-1"
                >
                  <ShieldCheck className="w-3.5 h-3.5" />
                  অ্যাডমিন পোর্টাল
                </button>
              </div>
            </div>
          </div>
        )}
      </nav>

      {/* Bento Breaking News Ticker */}
      <BreakingNewsTicker onNoticeClick={() => handleLinkClick('notices')} />
    </header>
  );
}
