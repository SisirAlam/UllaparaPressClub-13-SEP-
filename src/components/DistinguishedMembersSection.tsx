import { useState } from 'react';
import { usePressClub } from '../context/PressClubContext';
import { DistinguishedMember } from '../types';
import { 
  Award, 
  BookOpen, 
  Quote, 
  Newspaper, 
  BadgeCheck, 
  ExternalLink, 
  Star, 
  Sparkles,
  ChevronRight,
  X,
  Clock,
  Feather
} from 'lucide-react';

export default function DistinguishedMembersSection() {
  const { distinguishedMembers } = usePressClub();
  const [selectedMember, setSelectedMember] = useState<DistinguishedMember | null>(null);

  return (
    <section id="distinguished" className="py-20 bg-slate-100/70 border-t border-slate-200 relative overflow-hidden">
      {/* Decorative subtle background accents */}
      <div className="absolute top-0 right-0 -translate-y-12 translate-x-12 w-96 h-96 bg-amber-200/20 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 translate-y-12 -translate-x-12 w-96 h-96 bg-blue-200/20 rounded-full blur-3xl pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <span className="text-amber-950 bg-amber-100 border border-amber-300 px-3.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider inline-flex items-center gap-1.5 shadow-xs">
            <Award className="w-3.5 h-3.5 text-amber-700" />
            সাংবাদিকতায় বিশেষ অবদান
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#0d3b66] mt-3 font-serif tracking-tight">
            গুণী ও প্রবীণ সাংবাদিকবৃন্দ (Distinguished Members)
          </h2>
          <p className="text-slate-600 mt-3 text-base leading-relaxed">
            চলনবিল, সিরাজগঞ্জ ও জাতীয় গণমাধ্যমে বস্তুনিষ্ঠ সাংবাদিকতা, অনুসন্ধানী প্রতিবেদন এবং সমাজ বিনির্মাণে অসামান্য অবদানের স্বীকৃতি
          </p>
          <div className="w-20 h-1 bg-amber-500 mx-auto mt-4 rounded-full"></div>
        </div>

        {/* Distinguished Members Card-Based Grid Layout */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-7">
          {distinguishedMembers.map((member) => (
            <div 
              key={member.id}
              className="bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between overflow-hidden group hover:-translate-y-1"
            >
              {/* Card Top / Header with Headshot and Badges */}
              <div className="p-6">
                <div className="flex items-start gap-4">
                  <div className="relative shrink-0">
                    <img 
                      src={member.headshotUrl} 
                      alt={member.name}
                      className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl object-cover border-2 border-amber-300 shadow-md group-hover:scale-105 transition-transform duration-300"
                      referrerPolicy="no-referrer"
                    />
                    <span 
                      className="absolute -bottom-2 -right-1 bg-amber-500 text-slate-950 p-1 rounded-full shadow-sm" 
                      title="স্বীকৃত জ্যেষ্ঠ সাংবাদিক"
                    >
                      <BadgeCheck className="w-4 h-4" />
                    </span>
                  </div>

                  <div className="space-y-1 min-w-0 flex-1">
                    <div className="flex items-center gap-1.5 text-amber-800 text-[11px] font-bold">
                      <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                      <span>{member.tenure}</span>
                    </div>

                    <h3 className="text-lg font-bold text-[#0d3b66] font-serif group-hover:text-amber-700 transition">
                      {member.name}
                    </h3>

                    <p className="text-xs font-semibold text-slate-700">
                      {member.title}
                    </p>

                    <div className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md bg-blue-50 text-[#0d3b66] border border-blue-100 text-[11px] font-medium">
                      <Newspaper className="w-3 h-3 text-amber-600 shrink-0" />
                      <span className="truncate">{member.affiliation}</span>
                    </div>
                  </div>
                </div>

                {/* Beat / Focus Tag */}
                {member.beat && (
                  <div className="mt-4 pt-3 border-t border-slate-100 flex items-center gap-2">
                    <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400">
                      রিপোর্টিং ক্ষেত্র:
                    </span>
                    <span className="text-xs font-semibold text-slate-700 bg-slate-100 px-2.5 py-0.5 rounded-full">
                      {member.beat}
                    </span>
                  </div>
                )}

                {/* Bio Snippet */}
                <p className="text-xs text-slate-600 mt-3 leading-relaxed line-clamp-3">
                  {member.bio}
                </p>

                {/* Journalism Achievements List */}
                <div className="mt-4 space-y-1.5 bg-amber-50/50 p-3 rounded-xl border border-amber-100">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-amber-900">
                    <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                    <span>সাংবাদিকতা ও পেশাগত সাফল্য:</span>
                  </div>
                  <ul className="space-y-1">
                    {member.achievements.slice(0, 2).map((achievement, idx) => (
                      <li key={idx} className="text-[11px] text-slate-700 flex items-start gap-1.5">
                        <span className="text-amber-500 font-bold mt-0.5">•</span>
                        <span className="line-clamp-1">{achievement}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Featured Quote if available */}
                {member.featuredQuote && (
                  <div className="mt-3.5 flex items-start gap-2 text-xs italic text-slate-500 bg-slate-50 p-2.5 rounded-lg border-l-2 border-amber-400">
                    <Quote className="w-3.5 h-3.5 text-amber-500 shrink-0 mt-0.5" />
                    <span className="line-clamp-2">"{member.featuredQuote}"</span>
                  </div>
                )}
              </div>

              {/* Card Footer Button */}
              <div className="p-4 bg-slate-50/80 border-t border-slate-100 flex items-center justify-between">
                <span className="text-[11px] text-slate-500 font-medium">
                  {member.awards.length} টি সম্মাননা স্মারক
                </span>

                <button
                  onClick={() => setSelectedMember(member)}
                  className="inline-flex items-center gap-1 text-xs font-bold text-[#0d3b66] hover:text-amber-600 bg-white hover:bg-amber-50 px-3 py-1.5 rounded-lg border border-slate-200 transition shadow-2xs"
                >
                  <span>বিস্তারিত প্রোফাইল</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Modal for full bio & journalism achievement portfolio */}
        {selectedMember && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
            <div className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]">
              
              {/* Modal Header Banner */}
              <div className="p-6 bg-gradient-to-r from-[#0d3b66] to-slate-800 text-white relative">
                <button
                  onClick={() => setSelectedMember(null)}
                  className="absolute top-4 right-4 p-1.5 text-white/70 hover:text-white rounded-full hover:bg-white/10 transition"
                  aria-label="Close"
                >
                  <X className="w-5 h-5" />
                </button>

                <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5">
                  <img
                    src={selectedMember.headshotUrl}
                    alt={selectedMember.name}
                    className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl object-cover border-4 border-amber-400 shadow-lg shrink-0"
                    referrerPolicy="no-referrer"
                  />
                  <div className="text-center sm:text-left space-y-1">
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-400 text-slate-950">
                      <Star className="w-3 h-3 fill-slate-950" />
                      {selectedMember.tenure}
                    </span>
                    <h3 className="text-2xl font-bold font-serif">{selectedMember.name}</h3>
                    <p className="text-sm text-blue-200">{selectedMember.title}</p>
                    <p className="text-xs text-amber-300 font-semibold">{selectedMember.affiliation}</p>
                  </div>
                </div>
              </div>

              {/* Modal Body */}
              <div className="p-6 overflow-y-auto space-y-6">
                
                {/* Full Bio */}
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2 flex items-center gap-1.5">
                    <BookOpen className="w-4 h-4 text-amber-600" />
                    জীবন ও সাংবাদিকতার ইতিবৃত্ত (Biography)
                  </h4>
                  <p className="text-sm text-slate-700 leading-relaxed bg-slate-50 p-4 rounded-xl border border-slate-200/80">
                    {selectedMember.bio}
                  </p>
                </div>

                {/* Achievements */}
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2 flex items-center gap-1.5">
                    <Award className="w-4 h-4 text-amber-600" />
                    সাংবাদিকতায় বিশেষ অর্জন ও ভূমিকা (Journalism Achievements)
                  </h4>
                  <div className="space-y-2">
                    {selectedMember.achievements.map((item, idx) => (
                      <div key={idx} className="flex items-start gap-3 bg-amber-50/60 p-3 rounded-xl border border-amber-200/60">
                        <span className="w-6 h-6 rounded-full bg-amber-500 text-slate-950 font-bold text-xs flex items-center justify-center shrink-0">
                          {idx + 1}
                        </span>
                        <p className="text-xs sm:text-sm font-medium text-slate-800">{item}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Awards */}
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2 flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4 text-amber-600" />
                    প্রাপ্ত সম্মাননা ও পদকসমূহ (Awards & Honors)
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedMember.awards.map((award, idx) => (
                      <span key={idx} className="inline-flex items-center gap-1 px-3 py-1.5 bg-blue-50 text-[#0d3b66] border border-blue-200 rounded-lg text-xs font-semibold">
                        <Award className="w-3.5 h-3.5 text-amber-500" />
                        {award}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Quote */}
                {selectedMember.featuredQuote && (
                  <div className="p-4 bg-amber-100/50 rounded-2xl border border-amber-200 text-center space-y-1">
                    <Quote className="w-5 h-5 text-amber-600 mx-auto" />
                    <p className="text-sm font-serif italic text-amber-950">
                      "{selectedMember.featuredQuote}"
                    </p>
                    <p className="text-[11px] font-bold text-amber-800">— {selectedMember.name}</p>
                  </div>
                )}
              </div>

              {/* Modal Footer */}
              <div className="p-4 bg-slate-50 border-t border-slate-200 flex justify-end">
                <button
                  onClick={() => setSelectedMember(null)}
                  className="px-5 py-2 text-xs font-bold bg-[#0d3b66] hover:bg-slate-800 text-white rounded-xl transition"
                >
                  বন্ধ করুন
                </button>
              </div>

            </div>
          </div>
        )}

      </div>
    </section>
  );
}
