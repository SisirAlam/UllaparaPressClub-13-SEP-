import { usePressClub } from '../context/PressClubContext';
import CountdownTimer from './CountdownTimer';
import { 
  ShieldCheck, 
  BookOpen, 
  ArrowRight, 
  Award, 
  History, 
  Sparkles, 
  Users 
} from 'lucide-react';

interface BentoGridShowcaseProps {
  onNavigate: (sectionId: string) => void;
}

export default function BentoGridShowcase({ onNavigate }: BentoGridShowcaseProps) {
  const { clubInfo } = usePressClub();

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 sm:-mt-12 relative z-20 mb-12">
      <div className="grid grid-cols-12 gap-6">
        
        {/* Bento Card 1: Live Jubilee Countdown Card (col-span-12 lg:col-span-4) */}
        <div className="col-span-12 lg:col-span-4 bg-white border border-slate-200 rounded-2xl shadow-md p-6 flex flex-col justify-between hover:shadow-lg transition-shadow">
          <div>
            <div className="flex items-center justify-between border-b border-slate-100 pb-2 mb-4">
              <h2 className="text-[#0d3b66] font-bold text-xl font-serif">
                সুবর্ণজয়ন্তী কাউন্টডাউন
              </h2>
              <span className="bg-red-600 text-white text-[10px] font-bold px-2.5 py-0.5 rounded-full animate-pulse tracking-wide">
                লাইভ
              </span>
            </div>
            
            <p className="text-xs text-slate-500 mb-4 font-semibold">
              ১৯৭৮ - ২০২৭ • ৫০ বছর পূর্তি মহোৎসব
            </p>
            
            {/* Bento 4-tile countdown */}
            <div className="py-2">
              <CountdownTimer variant="bento" />
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span className="flex items-center gap-1.5 font-medium text-[#0d3b66]">
              <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
              উল্লাপাড়া, সিরাজগঞ্জ
            </span>
            <span className="text-amber-700 font-bold bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
              সৌজন্যে: {clubInfo.sponsor}
            </span>
          </div>
        </div>

        {/* Bento Card 2: History & Story Card (col-span-12 lg:col-span-5) */}
        <div className="col-span-12 lg:col-span-5 bg-white border border-slate-200 rounded-2xl shadow-md p-6 border-l-4 border-amber-500 flex flex-col justify-between hover:shadow-lg transition-shadow">
          <div>
            <div className="h-[2px] w-8 bg-amber-500 mb-2"></div>
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-[#0d3b66] mb-2 font-serif">
                ঐতিহ্যের ৪৮ বছর
              </h2>
              <span className="text-xs font-bold text-amber-900 bg-amber-100 px-2.5 py-0.5 rounded-full border border-amber-200">
                ১৯৭৮ – বর্তমান
              </span>
            </div>

            <p className="text-slate-600 text-sm mb-4 leading-relaxed">
              ১৯৭৮ সালে প্রতিষ্ঠিত উল্লাপাড়া প্রেসক্লাব উত্তরাঞ্চলের গণমানুষের অধিকার রক্ষা ও বস্তুনিষ্ঠ সংবাদ পরিবেশনে অগ্রণী ভূমিকা পালন করে আসছে। সিরাজগঞ্জের ইতিহাস ও ঐতিহ্যের এক অবিচ্ছেদ্য বাতিঘর।
            </p>

            {/* Bento Quote Box */}
            <div className="bg-slate-50 p-3.5 rounded-lg border-l-4 border-amber-500 italic text-slate-700 text-xs mb-4">
              "সত্যের সন্ধানে অবিচল, ন্যায়ের পক্ষে আপসহীন — উল্লাপাড়া প্রেসক্লাব গণমানুষের কণ্ঠস্বর।"
            </div>

            <div className="grid grid-cols-2 gap-3 pt-1 text-xs text-slate-700 font-medium">
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-amber-500"></span>
                <span>স্বতন্ত্র স্থায়ী ক্লাব ভবন</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-[#0d3b66]"></span>
                <span>৫০+ নির্ভীক সাংবাদিক সদস্য</span>
              </div>
            </div>
          </div>

          <div className="pt-5 mt-4 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2">
            <button
              onClick={() => onNavigate('about')}
              className="inline-flex items-center gap-1.5 text-xs font-bold text-[#0d3b66] hover:text-amber-600 transition"
            >
              ইতিহাস ও লক্ষ্য
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
            <div className="flex items-center gap-2">
              <button
                onClick={() => onNavigate('committee')}
                className="inline-flex items-center gap-1 text-xs text-slate-600 hover:text-[#0d3b66] transition"
              >
                <Users className="w-3.5 h-3.5" />
                কমিটি
              </button>
              <button
                onClick={() => onNavigate('complaint')}
                className="inline-flex items-center gap-1 text-xs font-bold text-amber-900 bg-amber-100 hover:bg-amber-200 px-2.5 py-1 rounded-lg border border-amber-300 transition"
              >
                তথ্য ও অভিযোগ
              </button>
            </div>
          </div>
        </div>

        {/* Bento Card 3: Action & Publication Card (col-span-12 lg:col-span-3) */}
        <div className="col-span-12 lg:col-span-3 bg-[#0d3b66] rounded-2xl shadow-lg p-6 flex flex-col items-center justify-between text-center space-y-4 text-white relative overflow-hidden group">
          {/* Subtle background glow */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/10 rounded-full blur-2xl pointer-events-none"></div>

          <div className="flex flex-col items-center space-y-3 pt-2">
            <div className="w-14 h-14 bg-white/20 rounded-full flex items-center justify-center text-2xl font-bold font-serif border border-white/20 text-amber-300 shadow-inner group-hover:scale-105 transition-transform">
              ৫০
            </div>
            
            <h3 className="font-bold text-lg font-serif text-white">
              সুবর্ণজয়ন্তী প্রকাশনা
            </h3>
            
            <p className="text-xs text-blue-100 leading-relaxed px-2">
              স্মারক গ্রন্থ <strong className="text-amber-300 font-semibold">"পঞ্চাশের প্রতিধ্বনি"</strong>-র জন্য আপনার স্মৃতিচারণমূলক লেখা ও তথ্য পাঠান।
            </p>
          </div>

          <div className="w-full space-y-2 pt-2">
            <button
              onClick={() => onNavigate('jubilee')}
              className="w-full bg-amber-500 text-slate-950 font-bold py-2.5 rounded-lg text-sm hover:bg-amber-400 transition shadow-md flex items-center justify-center gap-1.5"
            >
              <BookOpen className="w-4 h-4" />
              লেখা জমা দিন
            </button>
            
            <p className="text-[11px] text-blue-200/80">
              শেষ সময়: ৩১ ডিসেম্বর ২০২৬
            </p>
          </div>
        </div>

      </div>
    </section>
  );
}
