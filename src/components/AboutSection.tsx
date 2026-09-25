import { usePressClub } from '../context/PressClubContext';
import { TIMELINE_EVENTS } from '../data/pressClubData';
import SectionActionToolbar from './SectionActionToolbar';
import { 
  Building2, 
  CheckCircle, 
  Compass, 
  Scale, 
  Feather, 
  Flame,
  History,
  MapPin
} from 'lucide-react';

export default function AboutSection() {
  const { clubInfo, images } = usePressClub();

  const coreValues = [
    {
      icon: Scale,
      title: 'বস্তুনিষ্ঠতা ও নিরপেক্ষতা',
      desc: 'কোনো দল বা গোষ্ঠীর পক্ষপাত না করে সাধারণ মানুষের অধিকার ও সত্য তুলে ধরা আমাদের মূল অঙ্গীকার।'
    },
    {
      icon: Feather,
      title: 'সাংবাদিকদের সুরক্ষা ও ঐক্য',
      desc: 'পেশাগত মর্যাদা রক্ষা, আইনি সহায়তা এবং পারস্পরিক ভ্রাতৃত্ব বজায় রাখতে উল্লাপাড়া প্রেসক্লাব সর্বদা সচেষ্ট।'
    },
    {
      icon: Compass,
      title: 'উন্নয়ন ও তৃণমূলের কণ্ঠস্বর',
      desc: 'উল্লাপাড়ার শিক্ষা, কৃষি, স্বাস্থ্য, পরিবেশ এবং যাতায়াত ব্যবস্থার চিত্র তুলে ধরে টেকসই উন্নয়নে ভূমিকা রাখা।'
    },
    {
      icon: Flame,
      title: 'নৈতিক সাংবাদিকতা চর্চা',
      desc: 'গুজব ও অপতথ্য পরিহার করে সঠিক তথ্য যাচাইয়ের মাধ্যমে গণমাধ্যমের বিশ্বাসযোগ্যতা অক্ষুণ্ণ রাখা।'
    }
  ];

  return (
    <section id="about" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 relative">
          <div className="flex items-center justify-center gap-3 mb-2">
            <span className="text-amber-950 bg-amber-100 border border-amber-300 px-3.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
              ঐতিহ্য ও পথচলা
            </span>
            <SectionActionToolbar sectionId="about" sectionTitle="আমাদের পরিচিতি ও ইতিহাস" />
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#0d3b66] mt-1 font-serif">
            {clubInfo.nameBangla}র ইতিহাস ও লক্ষ্য
          </h2>
          <p className="text-slate-600 mt-3 text-base">
            {clubInfo.establishedYear} সাল থেকে সিরাজগঞ্জের অবহেলিত জনপদের কণ্ঠস্বর হিসেবে উল্লাপাড়া প্রেসক্লাব নিরলসভাবে কাজ করে চলেছে।
          </p>
          <div className="w-20 h-1 bg-amber-500 mx-auto mt-4 rounded-full"></div>
        </div>

        {/* Narrative & Visual Grid - Bento Layout */}
        <div className="grid lg:grid-cols-12 gap-8 items-center mb-20">
          <div className="lg:col-span-6 bg-white border border-slate-200 rounded-2xl shadow-md p-6 sm:p-8 border-l-4 border-amber-500 space-y-5">
            <div className="h-[2px] w-8 bg-amber-500 mb-2"></div>
            <h3 className="text-2xl font-bold text-[#0d3b66] font-serif leading-snug">
              চার দশকেরও বেশি সময়ের সাংবাদিকতার ঐতিহ্য ও সামাজিক অঙ্গীকার
            </h3>
            
            <p className="text-slate-600 leading-relaxed text-sm sm:text-base">
              সিরাজগঞ্জ জেলার প্রবেশদ্বার এবং উত্তরবঙ্গের ঐতিহ্যবাহী জনপদ উল্লাপাড়ায় সাংবাদিকতার আলোকবর্তিকা হয়ে ১৯৭৮ সালে আত্মপ্রকাশ ঘটে উল্লাপাড়া প্রেসক্লাবের। তৃণমূলের মানুষের সুখ-দুঃখ, সমস্যা, সম্ভাবনা এবং জাতীয় সংবাদে উল্লাপাড়ার প্রাসঙ্গিকতা তুলে ধরার ক্ষেত্রে সংগঠনটি অনন্য অবদান রেখে আসছে।
            </p>

            <p className="text-slate-600 leading-relaxed text-sm sm:text-base">
              প্রেসক্লাব কেবল সংবাদ সম্মেলন বা সংবাদ প্রেরণের কেন্দ্র নয়; এটি গণতন্ত্রের চতুর্থ স্তম্ভ গণমাধ্যমের মুক্ত চর্চা, নবীন সাংবাদিকদের প্রশিক্ষণ এবং সামাজিক দায়বদ্ধতা পালনের একটি নির্ভরযোগ্য প্ল্যাটফর্ম।
            </p>

            <div className="pt-2 grid sm:grid-cols-2 gap-3 text-sm text-slate-700">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>স্থায়ী আধুনিক প্রেসক্লাব ভবন ({clubInfo.address})</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>সাংবাদিক কল্যাণ তহবিল</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>ডিজিটাল তথ্য ও মিডিয়া সেন্টার</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>নিয়মিত সেমিনার ও গোলটেবিল</span>
              </div>
            </div>

            <div className="p-4 bg-slate-50 border-l-4 border-amber-500 rounded-r-lg text-xs sm:text-sm text-slate-700 italic">
              "সত্যের মুখোমুখি দাঁড়িয়ে নিঃশঙ্ক লেখনী পরিচালনা করাই উল্লাপাড়া প্রেসক্লাবের মূল ব্রত।"
            </div>
          </div>

          <div className="lg:col-span-6">
            <div className="relative rounded-2xl overflow-hidden shadow-lg border-2 border-slate-200 group bg-slate-900">
              {images?.building ? (
                <img 
                  src={images.building} 
                  alt="উল্লাপাড়া প্রেসক্লাব ভবন (থানা সংলগ্ন)" 
                  className="w-full h-80 sm:h-96 object-cover group-hover:scale-105 transition-transform duration-500"
                  referrerPolicy="no-referrer"
                />
              ) : (
                <div className="w-full h-80 sm:h-96 flex items-center justify-center text-slate-400">
                  <Building2 className="w-16 h-16 text-amber-500/50" />
                </div>
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-[#0d3b66]/95 via-[#0d3b66]/40 to-transparent flex items-end p-6">
                <div className="text-white">
                  <span className="text-xs font-bold uppercase tracking-wider text-amber-300 flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5" />
                    ঐতিহ্যের স্থায়ী ঠিকানা
                  </span>
                  <h4 className="text-lg font-bold font-serif text-white mt-1">
                    উল্লাপাড়া প্রেসক্লাব ভবন (থানা সংলগ্ন)
                  </h4>
                  <p className="text-xs text-slate-200 mt-1">
                    {clubInfo.address}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 4 Core Values - Bento Cards */}
        <div className="mb-20">
          <div className="text-center mb-10">
            <h3 className="text-xl sm:text-2xl font-bold text-[#0d3b66] font-serif">
              আমাদের মূল আদর্শ ও নীতিমালা
            </h3>
            <p className="text-sm text-slate-500 mt-1">
              যে ভিত্তিগুলোর ওপর দাঁড়িয়ে উল্লাপাড়া প্রেসক্লাব ৪ দশক ধরে প্রতিষ্ঠিত
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {coreValues.map((val, idx) => {
              const Icon = val.icon;
              return (
                <div 
                  key={idx} 
                  className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm hover:shadow-md border-b-4 border-b-amber-500 transition-all duration-200 flex flex-col justify-between"
                >
                  <div>
                    <div className="w-12 h-12 rounded-xl bg-amber-50 text-[#0d3b66] flex items-center justify-center mb-4 border border-amber-200">
                      <Icon className="w-6 h-6 text-[#0d3b66]" />
                    </div>
                    <h4 className="text-base font-bold text-[#0d3b66] mb-2 font-serif">
                      {val.title}
                    </h4>
                    <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                      {val.desc}
                    </p>
                  </div>
                  <div className="pt-3 mt-4 border-t border-slate-100 text-[11px] font-bold text-amber-700">
                    নীতিমালা
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Historic Timeline - Bento Cards */}
        <div className="bg-slate-50 rounded-2xl p-6 sm:p-10 border border-slate-200">
          <div className="flex items-center gap-2 mb-8 justify-center">
            <History className="w-5 h-5 text-amber-600" />
            <h3 className="text-2xl font-bold text-[#0d3b66] font-serif">
              ঐতিহাসিক মাইলফলক পরিক্রমা
            </h3>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 relative">
            {TIMELINE_EVENTS.map((event, idx) => (
              <div key={idx} className="relative bg-white rounded-2xl p-5 border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                <div className="inline-block px-3 py-1 bg-[#0d3b66] text-amber-300 font-mono text-xs font-bold rounded-lg mb-3 shadow-xs">
                  {event.year}
                </div>
                <h4 className="text-base font-bold text-[#0d3b66] mb-2 font-serif">
                  {event.title}
                </h4>
                <p className="text-xs text-slate-600 leading-relaxed">
                  {event.description}
                </p>
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}
