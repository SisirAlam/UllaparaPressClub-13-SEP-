import { BellRing, ChevronRight } from 'lucide-react';

interface BreakingNewsTickerProps {
  onNoticeClick?: () => void;
}

export default function BreakingNewsTicker({ onNoticeClick }: BreakingNewsTickerProps) {
  return (
    <div className="bg-[#0a2744] h-9 sm:h-10 flex items-center text-white overflow-hidden text-xs sm:text-sm border-b border-blue-900/60 shadow-inner z-40 relative">
      <div className="bg-amber-500 text-slate-950 h-full px-3 sm:px-5 flex items-center font-extrabold text-xs uppercase tracking-wider shrink-0 gap-1.5 shadow-md z-10">
        <BellRing className="w-3.5 h-3.5 animate-bounce text-slate-950" />
        <span>ব্রেকিং নিউজ:</span>
      </div>
      
      <div className="flex-1 overflow-hidden relative flex items-center h-full">
        <div className="whitespace-nowrap flex items-center gap-8 animate-marquee text-blue-100 font-medium pl-4">
          <span 
            onClick={onNoticeClick}
            className="cursor-pointer hover:text-amber-300 hover:underline inline-flex items-center gap-1 transition-colors"
          >
            আসন্ন ২০২৭ সালের সুবর্ণজয়ন্তী উৎসবের জন্য স্মারক প্রকাশনা "পঞ্চাশের প্রতিধ্বনি"-র লেখা আহ্বান এবং প্রস্তুতি সভা সংক্রান্ত জরুরি বিজ্ঞপ্তি প্রকাশিত হয়েছে।
          </span>
          <span className="text-amber-400 font-bold">•</span>
          <span 
            onClick={onNoticeClick}
            className="cursor-pointer hover:text-amber-300 hover:underline inline-flex items-center gap-1 transition-colors"
          >
            ১৯৭৮ থেকে ২০২৭ : উল্লাপাড়া প্রেসক্লাবের গৌরবময় ৫০ বছর পূর্তির ক্ষণগণনা শুরু!
          </span>
          <span className="text-amber-400 font-bold">•</span>
          <span className="text-amber-200">
            সৌজন্যে: Sristi Communication, উল্লাপাড়া, সিরাজগঞ্জ।
          </span>
        </div>
      </div>

      {onNoticeClick && (
        <button
          onClick={onNoticeClick}
          className="hidden md:flex items-center gap-1 bg-amber-500/15 hover:bg-amber-500/25 px-3.5 h-full text-xs font-bold text-amber-300 shrink-0 border-l border-blue-800/80 transition"
        >
          <span>বিজ্ঞপ্তি দেখুন</span>
          <ChevronRight className="w-3.5 h-3.5" />
        </button>
      )}
    </div>
  );
}
