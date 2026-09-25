import { useState, FormEvent } from 'react';
import { usePressClub } from '../context/PressClubContext';
import SectionActionToolbar from './SectionActionToolbar';
import { 
  Mail, 
  Phone, 
  MapPin, 
  Send, 
  CheckCircle, 
  Clock, 
  Sparkles, 
  Building, 
  UserCheck,
  Edit,
  Navigation
} from 'lucide-react';
import ClubLocationMap from './ClubLocationMap';

export default function ContactSection() {
  const { clubInfo, setIsAdminOpen } = usePressClub();

  const [formData, setFormData] = useState({
    name: '',
    emailOrPhone: '',
    subject: '',
    message: ''
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.emailOrPhone || !formData.message) return;
    setSubmitted(true);
  };

  const handleReset = () => {
    setFormData({ name: '', emailOrPhone: '', subject: '', message: '' });
    setSubmitted(false);
  };

  return (
    <section id="contact" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="flex items-center justify-center gap-3 mb-3 flex-wrap">
            <span className="text-amber-950 bg-amber-100 border border-amber-300 px-3.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider inline-flex items-center gap-1.5 shadow-xs">
              <Mail className="w-3.5 h-3.5 text-amber-700" />
              যোগাযোগ ও অনুসন্ধান
            </span>
            <SectionActionToolbar sectionId="contact" sectionTitle="যোগাযোগ ও অনুসন্ধান" />
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#0d3b66] mt-1 font-serif">
            উল্লাপাড়া প্রেসক্লাবের সাথে যুক্ত হোন
          </h2>
          <p className="text-slate-600 mt-3 text-base">
            যেকোনো তথ্য, সংবাদ বিজ্ঞপ্তি, সুবর্ণজয়ন্তী শুভেচ্ছা বা অনুসন্ধানের জন্য আমাদের সাথে যোগাযোগ করুন
          </p>
          <div className="w-20 h-1 bg-amber-500 mx-auto mt-4 rounded-full"></div>
        </div>

        <div className="grid lg:grid-cols-12 gap-8">
          
          {/* Left Column: Contact Cards & Office Details (Bento Cards) */}
          <div className="lg:col-span-5 space-y-6">
            
            <div className="bg-[#0d3b66] text-white rounded-2xl p-6 sm:p-8 shadow-lg border border-blue-900/60 space-y-6 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/10 rounded-full blur-2xl pointer-events-none"></div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-amber-500 text-slate-950 flex items-center justify-center font-bold shadow-md">
                    <Building className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold font-serif text-white">{clubInfo.nameBangla}</h3>
                    <p className="text-xs text-blue-200">সিরাজগঞ্জ জেলা, বাংলাদেশ</p>
                  </div>
                </div>

                <button
                  onClick={() => setIsAdminOpen(true)}
                  className="p-1.5 bg-blue-900/60 hover:bg-amber-500 hover:text-slate-950 text-blue-200 rounded-lg transition"
                  title="ঠিকানা ও যোগাযোগ সম্পাদনা করুন"
                >
                  <Edit className="w-4 h-4" />
                </button>
              </div>

              <div className="space-y-4 text-sm text-blue-100">
                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-white block">কার্যালয়ের ঠিকানা:</strong>
                    <span>{clubInfo.address}</span>
                    <div className="mt-1.5">
                      <a 
                        href="#club-location-map" 
                        className="inline-flex items-center gap-1.5 text-xs text-amber-300 hover:text-amber-200 underline underline-offset-2 decoration-amber-400/50 transition font-medium bg-blue-900/50 px-2 py-0.5 rounded"
                      >
                        <Navigation className="w-3 h-3 text-amber-400" />
                        <span>ইন্টারেক্টিভ মানচিত্র ও দিকনির্দেশনা</span>
                      </a>
                    </div>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Mail className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-white block">ইমেইল:</strong>
                    {clubInfo.email ? (
                      <a href={`mailto:${clubInfo.email}`} className="text-amber-300 hover:underline">
                        {clubInfo.email}
                      </a>
                    ) : (
                      <span className="text-blue-200/70 italic text-xs">(খালি রাখা হয়েছে — পরবর্তীতে বসানো হবে)</span>
                    )}
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Phone className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-white block">হটলাইন ও ফোন:</strong>
                    {clubInfo.phone ? (
                      <span>{clubInfo.phone}</span>
                    ) : (
                      <span className="text-blue-200/70 italic text-xs">(খালি রাখা হয়েছে — পরবর্তীতে বসানো হবে)</span>
                    )}
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Clock className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-white block">কার্যালয় খোলা:</strong>
                    <span>প্রতিদিন সকাল ১০:০০ টা থেকে রাত ৯:০০ টা পর্যন্ত</span>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-blue-900/80 text-xs text-blue-200 flex items-center justify-between">
                <span>সুবর্ণজয়ন্তী ২০২৭ সমন্বয়</span>
                <span className="text-amber-300 font-bold">সৌজন্যে: {clubInfo.sponsor}</span>
              </div>
            </div>

            {/* Leadership & Media Cell - Bento Card */}
            <div className="bg-white rounded-2xl p-6 border border-slate-200 border-l-4 border-amber-500 shadow-sm text-sm space-y-2">
              <div className="flex items-center gap-3">
                <UserCheck className="w-5 h-5 text-[#0d3b66]" />
                <h4 className="font-bold text-[#0d3b66] font-serif">মিডিয়া সমন্বয় ও তথ্য সেল</h4>
              </div>
              <p className="text-slate-600 text-xs leading-relaxed">
                জরুরি প্রেস বিজ্ঞপ্তি বা সংবাদের জন্য সরাসরি সাধারণ সম্পাদক ও প্রেসক্লাব দপ্তরে যোগাযোগ করা যাবে। ঠিকানা: <span className="font-semibold text-[#0d3b66]">{clubInfo.address}</span>
              </p>
            </div>

          </div>

          {/* Right Column: Contact Message Form - Bento Card */}
          <div className="lg:col-span-7">
            <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm border-t-4 border-t-amber-500">
              <h3 className="text-xl font-bold text-[#0d3b66] font-serif mb-2">
                বার্তা পাঠান বা মতামত জানান
              </h3>
              <p className="text-xs sm:text-sm text-slate-500 mb-6">
                আপনার বার্তাটি সরাসরি উল্লাপাড়া প্রেসক্লাবের দপ্তরে পৌঁছে যাবে।
              </p>

              {submitted ? (
                <div className="p-8 text-center space-y-4 bg-emerald-50 rounded-2xl border border-emerald-200 animate-in fade-in duration-200">
                  <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-inner">
                    <CheckCircle className="w-8 h-8" />
                  </div>
                  <h4 className="text-xl font-bold text-emerald-950 font-serif">
                    আপনার বার্তাটি সফলভাবে পাঠানো হয়েছে!
                  </h4>
                  <p className="text-xs text-emerald-800 max-w-md mx-auto">
                    উল্লাপাড়া প্রেসক্লাবের সাথে যোগাযোগের জন্য ধন্যবাদ। সংশ্লিষ্ট কর্মকর্তা আপনার সাথে দ্রুত যোগাযোগ করবেন।
                  </p>
                  <div className="pt-2">
                    <button
                      onClick={handleReset}
                      className="px-6 py-2 bg-[#0d3b66] text-white text-xs font-bold rounded-lg hover:bg-slate-800 transition"
                    >
                      আরেকটি বার্তা পাঠান
                    </button>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-[#0d3b66] mb-1">
                        আপনার নাম *
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder="আপনার পূর্ণ নাম"
                        className="w-full text-xs sm:text-sm bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:bg-white transition"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-[#0d3b66] mb-1">
                        মোবাইল বা ইমেইল *
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.emailOrPhone}
                        onChange={(e) => setFormData({ ...formData, emailOrPhone: e.target.value })}
                        placeholder="যোগাযোগের নম্বর বা ইমেইল"
                        className="w-full text-xs sm:text-sm bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:bg-white transition"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#0d3b66] mb-1">
                      বার্তার বিষয়
                    </label>
                    <input
                      type="text"
                      value={formData.subject}
                      onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                      placeholder="যেমন: সুবর্ণজয়ন্তী শুভেচ্ছা / প্রেস বিজ্ঞপ্তি"
                      className="w-full text-xs sm:text-sm bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:bg-white transition"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#0d3b66] mb-1">
                      বিস্তারিত বার্তা *
                    </label>
                    <textarea
                      required
                      rows={4}
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      placeholder="আপনার বার্তা বা মন্তব্য লিখুন..."
                      className="w-full text-xs sm:text-sm bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:bg-white transition"
                    ></textarea>
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-sm rounded-xl shadow-md flex items-center justify-center gap-2 transition"
                  >
                    <Send className="w-4 h-4" />
                    <span>বার্তা প্রেরণ করুন</span>
                  </button>
                </form>
              )}
            </div>
          </div>

        </div>

        {/* Interactive Club Location Pinpoint Map */}
        <ClubLocationMap />

      </div>
    </section>
  );
}
