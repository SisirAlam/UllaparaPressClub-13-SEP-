import { useState } from 'react';
import { NoticeItem } from '../types';
import { usePressClub } from '../context/PressClubContext';
import { 
  Printer, 
  X, 
  ShieldCheck, 
  Calendar, 
  FileText, 
  CheckCircle2, 
  Info,
  Building,
  Type,
  EyeOff
} from 'lucide-react';

interface PrintFriendlyArticleModalProps {
  article: NoticeItem | null;
  onClose: () => void;
}

export default function PrintFriendlyArticleModal({ article, onClose }: PrintFriendlyArticleModalProps) {
  const { clubInfo } = usePressClub();
  const [fontSize, setFontSize] = useState<'normal' | 'large' | 'larger'>('normal');
  const [showSignatures, setShowSignatures] = useState(true);

  if (!article) return null;

  const handlePrint = () => {
    window.print();
  };

  const getFontSizeClass = () => {
    switch (fontSize) {
      case 'large':
        return 'text-base sm:text-lg leading-relaxed';
      case 'larger':
        return 'text-lg sm:text-xl leading-loose';
      default:
        return 'text-sm sm:text-base leading-relaxed';
    }
  };

  const formattedPrintTime = new Date().toLocaleString('bn-BD', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });

  return (
    <div 
      id="print-article-modal"
      className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/70 backdrop-blur-xs flex items-start justify-center p-2 sm:p-4 md:p-6 animate-in fade-in duration-200 print:p-0 print:m-0 print:bg-white print:static print:overflow-visible"
    >
      <div className="w-full max-w-4xl my-auto print:my-0 print:w-full print:max-w-none flex flex-col">
        
        {/* On-screen Print Toolbar (Hidden on paper print) */}
        <div className="no-print bg-slate-900 text-white rounded-t-2xl p-4 border-b border-slate-700 flex flex-wrap items-center justify-between gap-3 shadow-xl">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-amber-500 text-slate-950 flex items-center justify-center font-bold">
              <Printer className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-sm sm:text-base text-white font-serif">
                  প্রিন্ট-বান্ধব সংস্করণ (Print-Friendly View)
                </span>
                <span className="text-[10px] font-bold bg-emerald-500/30 text-emerald-300 border border-emerald-400/30 px-2 py-0.5 rounded-full flex items-center gap-1">
                  <EyeOff className="w-3 h-3 text-emerald-300" />
                  বিজ্ঞাপন ও হেডার মুক্ত
                </span>
              </div>
              <p className="text-xs text-slate-400">
                কাগজে পড়ার জন্য পরিষ্কার ও সাশ্রয়ী লেআউট
              </p>
            </div>
          </div>

          {/* Controls: Font Size + Signatures Toggle + Print Button + Close */}
          <div className="flex flex-wrap items-center gap-2">
            
            {/* Font size toggles */}
            <div className="hidden sm:flex items-center bg-slate-800 rounded-lg p-0.5 border border-slate-700 text-xs">
              <button
                onClick={() => setFontSize('normal')}
                className={`px-2 py-1 rounded font-medium transition ${
                  fontSize === 'normal' ? 'bg-amber-500 text-slate-950 font-bold' : 'text-slate-300 hover:text-white'
                }`}
                title="স্বাভাবিক ফন্ট"
              >
                A
              </button>
              <button
                onClick={() => setFontSize('large')}
                className={`px-2 py-1 rounded font-medium transition ${
                  fontSize === 'large' ? 'bg-amber-500 text-slate-950 font-bold' : 'text-slate-300 hover:text-white'
                }`}
                title="বড় ফন্ট"
              >
                A+
              </button>
              <button
                onClick={() => setFontSize('larger')}
                className={`px-2 py-1 rounded font-medium transition ${
                  fontSize === 'larger' ? 'bg-amber-500 text-slate-950 font-bold' : 'text-slate-300 hover:text-white'
                }`}
                title="আরো বড় ফন্ট"
              >
                A++
              </button>
            </div>

            {/* Print Button */}
            <button
              onClick={handlePrint}
              className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs sm:text-sm rounded-xl shadow-md transition flex items-center gap-1.5 cursor-pointer"
            >
              <Printer className="w-4 h-4" />
              <span>এখনই প্রিন্ট করুন</span>
            </button>

            {/* Close Button */}
            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl transition cursor-pointer"
              title="বন্ধ করুন"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Paper Document Sheet */}
        <div 
          id="printable-article-content"
          className="printable-document bg-white text-slate-900 rounded-b-2xl shadow-2xl p-6 sm:p-10 md:p-12 print:p-4 print:shadow-none print:rounded-none print:border-none border-x border-b border-slate-200"
        >
          {/* Press Club Official Letterhead (Masthead) */}
          <div className="border-b-2 border-slate-900 pb-5 mb-6 text-center">
            
            {/* Top Logo & Government / Organization Reference */}
            <div className="flex items-center justify-center gap-2 text-xs text-slate-600 font-semibold uppercase tracking-wider mb-1">
              <Building className="w-4 h-4 text-slate-700" />
              <span>সিরাজগঞ্জ জেলার ঐতিহ্যবাহী সাংবাদিক ফোরাম • স্থাপিত: {clubInfo.establishedYear} খ্রিস্টাব্দ</span>
            </div>

            {/* Organization Main Title */}
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-black text-slate-950 font-serif tracking-tight">
              {clubInfo.nameBangla}
            </h1>
            <p className="text-xs sm:text-sm font-semibold text-slate-700 mt-0.5 tracking-wide">
              {clubInfo.nameEnglish} • উল্লাপাড়া উপজেলা, সিরাজগঞ্জ-৬৭৬০
            </p>
            <p className="text-[11px] text-slate-500 mt-1">
              {clubInfo.address} • ইমেইল: {clubInfo.email} • মোবাইল: {clubInfo.phone}
            </p>
            
            {/* Tagline / Subtitle */}
            <div className="mt-2 text-[11px] font-bold text-slate-800 bg-slate-100 print:bg-transparent inline-block px-3 py-0.5 rounded border border-slate-200 print:border-slate-400">
              "সত্য ও বস্তুনিষ্ঠ সাংবাদিকতায় অবিচল কণ্ঠস্বর — সুবর্ণজয়ন্তী ২০২৭"
            </div>
          </div>

          {/* Reference Meta Header */}
          <div className="flex flex-wrap items-center justify-between gap-3 text-xs border-b border-slate-200 pb-4 mb-6">
            <div className="space-y-1">
              <div className="flex items-center gap-1.5 font-bold text-slate-900">
                <span>স্মারক নম্বর:</span>
                <span className="font-mono bg-slate-100 print:bg-transparent px-1.5 py-0.5 rounded border border-slate-200 print:border-none">
                  {article.refNumber || `ইউপিচি/বিজ্ঞপ্তি/${new Date().getFullYear()}/${article.id}`}
                </span>
              </div>
              <div className="text-slate-600">
                প্রকাশের স্থান: <strong className="text-slate-800">{article.location || 'উল্লাপাড়া, সিরাজগঞ্জ'}</strong>
              </div>
            </div>

            <div className="text-left sm:text-right space-y-1">
              <div className="flex items-center sm:justify-end gap-1 font-semibold text-slate-800">
                <Calendar className="w-3.5 h-3.5 text-slate-600 print:hidden" />
                <span>তারিখ: {article.date}</span>
              </div>
              <div className="inline-block px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-slate-100 print:bg-transparent border border-slate-300 text-slate-800">
                শ্রেণি: {article.badge}
              </div>
            </div>
          </div>

          {/* Article Title */}
          <div className="mb-6">
            <h2 className="text-xl sm:text-2xl md:text-3xl font-extrabold text-slate-950 font-serif leading-snug">
              {article.title}
            </h2>
            {article.reporter && (
              <p className="text-xs sm:text-sm text-slate-600 font-medium mt-2">
                প্রতিবেদক: <span className="font-bold text-slate-800">{article.reporter}</span>
              </p>
            )}
          </div>

          {/* Summary Box (if different from fullText) */}
          {article.summary && (
            <div className="bg-slate-50 print:bg-transparent p-4 rounded-xl border-l-4 border-slate-800 print:border-l-2 print:border-slate-800 mb-6 text-slate-700 italic text-sm">
              <strong className="text-slate-900 not-italic block mb-1">সারসংক্ষেপ:</strong>
              {article.summary}
            </div>
          )}

          {/* Full Text Body */}
          <div className={`space-y-4 text-slate-800 font-serif whitespace-pre-line text-justify ${getFontSizeClass()}`}>
            {article.fullText || article.content}
          </div>

          {/* Official Signatures & Seal Section */}
          {showSignatures && (
            <div className="mt-12 pt-8 border-t-2 border-slate-800/60 print:mt-10 print:pt-6">
              <div className="flex flex-col sm:flex-row items-end justify-between gap-6">
                
                {/* Official Verification Seal Mockup */}
                <div className="w-full sm:w-auto flex items-center gap-3">
                  <div className="w-16 h-16 rounded-full border-2 border-dashed border-slate-400 flex flex-col items-center justify-center text-center p-1 text-[9px] font-bold text-slate-600 uppercase tracking-tighter">
                    <span>উল্লাপাড়া</span>
                    <span>প্রেসক্লাব</span>
                    <span className="text-[8px] font-mono">সিলমোহর</span>
                  </div>
                  <div className="text-[11px] text-slate-500">
                    <p className="font-bold text-slate-800">অফিসিয়াল সার্টিফাইড কপি</p>
                    <p>উল্লাপাড়া উপজেলা প্রেসক্লাব আর্কাইভ</p>
                    <p className="text-[10px] text-slate-400 font-mono">আইডি: {article.id}</p>
                  </div>
                </div>

                {/* Signatories Block */}
                <div className="w-full sm:w-auto text-left sm:text-right space-y-1">
                  <p className="text-xs font-bold text-slate-700">আদেশক্রমে,</p>
                  {article.signatory ? (
                    <div className="pt-1">
                      <p className="text-sm font-bold font-serif text-slate-950">
                        {article.signatory}
                      </p>
                      <p className="text-xs text-slate-600 font-medium">
                        উল্লাপাড়া উপজেলা প্রেসক্লাব, সিরাজগঞ্জ
                      </p>
                    </div>
                  ) : (
                    <div className="pt-1 space-y-1">
                      <div className="flex flex-col sm:items-end">
                        <span className="text-xs font-serif font-bold text-slate-900">মোঃ আনিছুর রহমান (লিটন)</span>
                        <span className="text-[11px] text-slate-600">সভাপতি</span>
                      </div>
                      <div className="flex flex-col sm:items-end pt-1">
                        <span className="text-xs font-serif font-bold text-slate-900">মোঃ ময়нул হোসাইন</span>
                        <span className="text-[11px] text-slate-600">সাধারণ সম্পাদক</span>
                      </div>
                    </div>
                  )}
                </div>

              </div>
            </div>
          )}

          {/* Official Footer Verification Note */}
          <div className="mt-8 pt-4 border-t border-slate-200 text-[10px] sm:text-[11px] text-slate-500 flex flex-col sm:flex-row items-center justify-between gap-2">
            <div>
              <span>ওয়েবসাইট: <strong>ullaparapressclub.org</strong> • ফেসবুক: fb.com/UllaparaPressClub</span>
            </div>
            <div className="flex items-center gap-2 text-[10px]">
              <span>মুদ্রণ সময়: {formattedPrintTime}</span>
              <span>•</span>
              <span>আইসিটি পার্টনার: Sristi Communication</span>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
