import { useState, FormEvent } from 'react';
import { usePressClub } from '../context/PressClubContext';
import CountdownTimer from './CountdownTimer';
import SectionActionToolbar from './SectionActionToolbar';
import { 
  Award, 
  BookOpen, 
  Sparkles, 
  Send, 
  CheckCircle2, 
  HeartHandshake,
  CalendarCheck,
  FileText
} from 'lucide-react';

export default function GoldenJubilee() {
  const { clubInfo } = usePressClub();

  const [writerName, setWriterName] = useState('');
  const [writerPhone, setWriterPhone] = useState('');
  const [topic, setTopic] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!writerName || !writerPhone) return;
    setIsSubmitted(true);
    setTimeout(() => {
      setWriterName('');
      setWriterPhone('');
      setTopic('');
    }, 500);
  };

  const jubileeFeatures = [
    {
      icon: BookOpen,
      title: 'ঐতিহাসিক স্মারক গ্রন্থ "পঞ্চাশের প্রতিধ্বনি"',
      desc: '১৯৭৭ থেকে ২০২৭ পর্যন্ত উল্লাপাড়া এবং উত্তরাঞ্চলের আর্থ-সামাজিক, রাজনৈতিক ও সাংবাদিকতার ইতিহাসের প্রামাণ্য দলিল।'
    },
    {
      icon: Award,
      title: 'আজীবন ও গুণীজন সম্মাননা পদক',
      desc: 'বস্তুनिष्ठ সাংবাদিকতা ও সমাজসেবায় অবদান রাখা প্রবীণ সাংবাদিক, কলামিস্ট ও সুধীজনদের বিশেষ সুবর্ণজয়ন্তী পদক প্রদান।'
    },
    {
      icon: CalendarCheck,
      title: 'জাতীয় গণমাধ্যম সম্মেলন ও সেমিনার',
      desc: 'ডিজিটাল যুগে অপসাংবাদিকতা রোধ ও বস্তুনিষ্ঠ সাংবাদিকতার ভূমিকা নিয়ে জাতীয় ও স্থানীয় সাংবাদিকদের মিলনমেলা।'
    },
    {
      icon: HeartHandshake,
      title: 'সাংবাদিক কল্যাণ ও চিকিৎসা তহবিল',
      desc: 'সুবর্ণজয়ন্তী উপলক্ষে অসুস্থ ও দুঃস্থ সাংবাদিক পরিবারের কল্যাণে স্থায়ী কল্যাণ তহবিল গঠন।'
    }
  ];

  return (
    <section id="jubilee" className="py-20 bg-slate-50 border-t border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="flex items-center justify-center gap-3 mb-3 flex-wrap">
            <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-amber-100 border border-amber-300 text-amber-950 text-xs font-bold uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5 text-amber-600" />
              ঐতিহাসিক মাইলফলক
            </div>
            <SectionActionToolbar sectionId="jubilee" sectionTitle="সুবর্ণজয়ন্তী ২০২৭" />
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#0d3b66] font-serif">
            {clubInfo.nameBangla} সুবর্ণজয়ন্তী ২০২৭
          </h2>
          <p className="text-base sm:text-lg text-slate-600 mt-3 font-normal">
            ১৯৭৭ – ২০২৭ : গৌরব, ঐতিহ্য ও সত্য প্রকাশের ৫০টি বছর (সুবর্ণজয়ন্তী ২০২৭)।
          </p>
          <div className="w-20 h-1 bg-amber-500 mx-auto mt-4 rounded-full"></div>
        </div>

        {/* Jubilee Banner with Live Countdown */}
        <div className="bg-[#0d3b66] text-white rounded-3xl p-6 sm:p-10 shadow-xl border border-blue-900/50 relative overflow-hidden mb-16">
          <div className="absolute -right-10 -bottom-10 w-72 h-72 bg-amber-500/10 rounded-full blur-3xl pointer-events-none"></div>
          
          <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-8">
            <div className="text-center lg:text-left space-y-2 max-w-xl">
              <span className="text-xs font-bold uppercase tracking-widest text-amber-400">
                মহোৎসবের ক্ষণগণনা
              </span>
              <h3 className="text-2xl sm:text-3xl font-bold font-serif text-white">
                সুবর্ণজয়ন্তী মহোৎসব শুরু হতে বাকি
              </h3>
              <p className="text-sm text-slate-200 leading-relaxed">
                ৫০ বছর পূর্তির এই মাহেন্দ্রক্ষণে আপনাদের দোয়া, আন্তরিক সমর্থন ও ভালোবাসায় উদ্ভাসিত হোক সাংবাদিকতার এই বাতিঘর।
              </p>
              <p className="text-xs text-amber-300 pt-1 font-semibold">
                আইসিটি পার্টনার: Sristi Communication
              </p>
            </div>

            <div className="w-full lg:w-auto">
              <CountdownTimer variant="gold" />
            </div>
          </div>
        </div>

        {/* 4 Pillars of Jubilee */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {jubileeFeatures.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div 
                key={idx} 
                className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm hover:shadow-md border-b-4 border-b-amber-500 transition-all duration-200 flex flex-col justify-between"
              >
                <div>
                  <div className="w-12 h-12 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 flex items-center justify-center mb-4">
                    <Icon className="w-6 h-6" />
                  </div>
                  <h4 className="text-base font-bold text-[#0d3b66] mb-2 font-serif">
                    {item.title}
                  </h4>
                  <p className="text-sm text-slate-600 leading-relaxed">
                    {item.desc}
                  </p>
                </div>
                <div className="pt-4 mt-4 border-t border-slate-100 flex items-center gap-1.5 text-xs text-amber-700 font-semibold">
                  <span>৫০ বছর পূর্তি কর্মসূচি</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Call for Souvenir Articles / Registration Box */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-md p-6 sm:p-8 lg:p-10 border-l-4 border-l-amber-500">
          <div className="grid lg:grid-cols-12 gap-8 items-center">
            
            <div className="lg:col-span-7 space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-50 border border-amber-200 text-amber-900 text-xs font-bold">
                <FileText className="w-4 h-4 text-amber-700" />
                স্মারক গ্রন্থ "পঞ্চাশের প্রতিধ্বনি"
              </div>
              <h3 className="text-2xl sm:text-3xl font-bold text-[#0d3b66] font-serif">
                স্মারক গ্রন্থে আপনার মূল্যবান লেখা বা স্মৃতিচারণ পাঠান
              </h3>
              <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
                উল্লাপাড়া প্রেসক্লাব ও সিরাজগঞ্জ জেলার স্মৃতি, মুক্তিযুদ্ধ, সাংবাদিকতার অভিজ্ঞতা বা শুভেচ্ছা জানিয়ে লেখা পাঠাতে পারেন। লেখা পাঠানোর শেষ তারিখ: ৩১ ডিসেম্বর ২০২৬।
              </p>
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 text-xs sm:text-sm text-slate-700 space-y-2">
                <p><strong>জমা দেওয়ার স্থান:</strong> <span className="text-[#0d3b66] font-semibold">{clubInfo.address}</span></p>
                <p><strong>যোগাযোগ ও সমন্বয়:</strong> সাধারণ সম্পাদক ও সুবর্ণজয়ন্তী প্রকাশনা পর্ষদ, উল্লাপাড়া প্রেসক্লাব</p>
                <p><strong>শব্দসীমা:</strong> ৫০০ - ১২০০ শব্দ (ইউনিকোড ফন্টে ওয়ার্ড ফাইল অথবা সরাসরি প্রেসক্লাবে)</p>
              </div>
            </div>

            <div className="lg:col-span-5 bg-slate-50 p-6 rounded-2xl border border-slate-200">
              <h4 className="text-base font-bold text-[#0d3b66] mb-1 font-serif">
                স্মারক নিবন্ধ আগ্রহ নিবন্ধন
              </h4>
              <p className="text-xs text-slate-500 mb-4">
                প্রাথমিক তথ্য প্রদান করলে সম্পাদনা পরিষদ আপনার সাথে যোগাযোগ করবে।
              </p>

              {isSubmitted ? (
                <div className="py-6 text-center space-y-2 bg-emerald-50 rounded-xl border border-emerald-200 p-4">
                  <CheckCircle2 className="w-10 h-10 text-emerald-600 mx-auto" />
                  <p className="text-sm font-bold text-emerald-800">ধন্যবাদ! তথ্য গৃহীত হয়েছে।</p>
                  <p className="text-xs text-emerald-700">
                    আমাদের স্মারক সম্পাদনা কমিটি শীঘ্রই আপনার সাথে যোগাযোগ করবে।
                  </p>
                  <button
                    onClick={() => setIsSubmitted(false)}
                    className="mt-2 text-xs text-emerald-800 underline font-medium"
                  >
                    আরেকটি এন্ট্রি দিন
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-3">
                  <div>
                    <label className="block text-xs font-medium text-slate-700 mb-1">
                      আপনার নাম *
                    </label>
                    <input
                      type="text"
                      required
                      value={writerName}
                      onChange={(e) => setWriterName(e.target.value)}
                      placeholder="যেমন: মোহাম্মদ ইকবাল"
                      className="w-full text-sm px-3 py-2 bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-700 mb-1">
                      মোবাইল নম্বর *
                    </label>
                    <input
                      type="tel"
                      required
                      value={writerPhone}
                      onChange={(e) => setWriterPhone(e.target.value)}
                      placeholder="যেমন: ০১৭১১-XXXXXX"
                      className="w-full text-sm px-3 py-2 bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-700 mb-1">
                      লেখা বা বিষয়ের শিরোনাম
                    </label>
                    <input
                      type="text"
                      value={topic}
                      onChange={(e) => setTopic(e.target.value)}
                      placeholder="যেমন: উল্লাপাড়া প্রেসক্লাবের অতীত ও ভবিষ্যৎ"
                      className="w-full text-sm px-3 py-2 bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-2.5 px-4 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-sm rounded-lg shadow-sm flex items-center justify-center gap-2 transition"
                  >
                    <Send className="w-4 h-4" />
                    আগ্রহ জমা দিন
                  </button>
                </form>
              )}
            </div>

          </div>
        </div>

      </div>
    </section>
  );
}
