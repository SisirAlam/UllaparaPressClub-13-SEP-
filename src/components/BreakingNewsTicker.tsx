import { BellRing, ChevronRight, Edit3, Sparkles } from 'lucide-react';
import { usePressClub } from '../context/PressClubContext';

interface BreakingNewsTickerProps {
  onNoticeClick?: () => void;
}

export default function BreakingNewsTicker({ onNoticeClick }: BreakingNewsTickerProps) {
  const { 
    tickerItems, 
    isAdminAuthenticated, 
    setIsAdminOpen, 
    openUrgentNoticePopup 
  } = usePressClub();

  const handleTickerClick = () => {
    if (onNoticeClick) {
      onNoticeClick();
    } else {
      openUrgentNoticePopup();
    }
  };

  return (
    <div className="bg-[#0a2744] h-9 sm:h-10 flex items-center text-white overflow-hidden text-xs sm:text-sm border-b border-blue-900/60 shadow-inner z-40 relative">
      <div className="bg-amber-500 text-slate-950 h-full px-3 sm:px-4 flex items-center font-extrabold text-xs uppercase tracking-wider shrink-0 gap-1.5 shadow-md z-10">
        <BellRing className="w-3.5 h-3.5 animate-bounce text-slate-950" />
        <span>ব্রেকিং নিউজ:</span>
      </div>
      
      <div className="flex-1 overflow-hidden relative flex items-center h-full">
        <div className="whitespace-nowrap flex items-center gap-6 animate-marquee text-blue-100 font-medium pl-4">
          {tickerItems.map((item, idx) => (
            <span key={idx} className="inline-flex items-center gap-6">
              <span 
                onClick={handleTickerClick}
                className="cursor-pointer hover:text-amber-300 hover:underline transition-colors"
              >
                {item}
              </span>
              <span className="text-amber-400 font-bold">•</span>
            </span>
          ))}
        </div>
      </div>

      <div className="flex items-center h-full shrink-0">
        <button
          onClick={() => openUrgentNoticePopup()}
          className="hidden sm:flex items-center gap-1 bg-red-600/80 hover:bg-red-600 px-3 h-full text-xs font-bold text-white transition shrink-0"
          title="জরুরি নোটিশ পপ-আপ খুলুন"
        >
          <Sparkles className="w-3.5 h-3.5 text-amber-300" />
          <span>জরুরি নোটিশ</span>
        </button>

        {isAdminAuthenticated && (
          <button
            onClick={() => setIsAdminOpen(true)}
            className="flex items-center gap-1 bg-amber-500/20 hover:bg-amber-500/30 px-2.5 h-full text-xs font-bold text-amber-300 transition border-l border-blue-800/80"
            title="টিকার সংবাদ আপডেট করুন"
          >
            <Edit3 className="w-3 h-3" />
            <span className="hidden md:inline">টিকার এডিট</span>
          </button>
        )}

        {onNoticeClick && (
          <button
            onClick={onNoticeClick}
            className="hidden lg:flex items-center gap-1 bg-amber-500/15 hover:bg-amber-500/25 px-3 h-full text-xs font-bold text-amber-300 shrink-0 border-l border-blue-800/80 transition"
          >
            <span>বিজ্ঞপ্তি দেখুন</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        )}
      </div>
    </div>
  );
}

