import React, { useState } from 'react';
import { usePressClub } from '../context/PressClubContext';
import SectionActionToolbar from './SectionActionToolbar';
import { 
  ShieldAlert, 
  Send, 
  CheckCircle2, 
  Lock, 
  FileText, 
  MapPin, 
  Eye, 
  EyeOff, 
  Clock, 
  AlertTriangle, 
  HelpCircle,
  Sparkles,
  Inbox,
  Search,
  Copy,
  Check,
  Scale,
  Building,
  UserCheck,
  MessageSquare
} from 'lucide-react';

export default function CitizenGrievanceSection() {
  const { complaints, addComplaint, clubInfo, setIsAdminOpen } = usePressClub();

  const [activeTab, setActiveTab] = useState<'submit' | 'track' | 'stories' | 'policy'>('submit');

  const [formData, setFormData] = useState({
    name: '',
    contact: '',
    category: 'নাগরিক দুর্ভোগ ও সড়ক',
    title: '',
    location: '',
    details: '',
    isAnonymous: true,
  });

  const [submittedId, setSubmittedId] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState(false);

  // Status Search State
  const [searchTrackingId, setSearchTrackingId] = useState('');
  const [searchResult, setSearchResult] = useState<any | null>(null);
  const [searchError, setSearchError] = useState(false);

  const categories = [
    'নাগরিক দুর্ভোগ ও সড়ক',
    'অনিয়ম ও দুর্নীতি',
    'নদী ও পরিবেশ দূষণ',
    'শিক্ষা ও স্বাস্থ্যসেবা',
    'বিদ্যুৎ ও পৌর নাগরিক সেবা',
    'আইনশৃঙ্খলা ও সাধারণ নিরাপত্তা',
    'অন্যান্য জনস্বার্থমূলক অনুসন্ধান'
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim() || !formData.details.trim()) {
      return;
    }

    const newId = addComplaint({
      name: formData.isAnonymous ? 'গোপন নাগরিক' : (formData.name.trim() || 'বেনামী নাগরিক'),
      contact: formData.contact.trim(),
      category: formData.category,
      title: formData.title.trim(),
      location: formData.location.trim() || 'উল্লাপাড়া',
      details: formData.details.trim(),
      isAnonymous: formData.isAnonymous,
      investigatorNotes: 'প্রেসক্লাব তথ্য ও অভিযোগ সেল কর্তৃক নতুন এন্ট্রি হিসেবে গৃহীত হয়েছে। দায়িত্বপ্রাপ্ত সাংবাদিক দল দ্রুত পর্যালোচনা করবেন।'
    });

    setSubmittedId(newId);
    setFormData({
      name: '',
      contact: '',
      category: 'নাগরিক দুর্ভোগ ও সড়ক',
      title: '',
      location: '',
      details: '',
      isAnonymous: true,
    });
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(true);
    setTimeout(() => setCopiedId(false), 2000);
  };

  const handleTrackSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const query = searchTrackingId.trim().toUpperCase();
    if (!query) return;

    const found = complaints.find(c => c.id.toUpperCase() === query);
    if (found) {
      setSearchResult(found);
      setSearchError(false);
    } else {
      setSearchResult(null);
      setSearchError(true);
    }
  };

  return (
    <section id="complaint" className="py-20 bg-slate-50 border-t border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="flex items-center justify-center gap-3 mb-3 flex-wrap">
            <span className="text-amber-950 bg-amber-100 border border-amber-300 px-3.5 py-1 rounded-full text-xs font-extrabold uppercase tracking-wider inline-flex items-center gap-1.5 shadow-xs">
              <ShieldAlert className="w-3.5 h-3.5 text-amber-700" />
              জনস্বার্থ ও নাগরিক সেবা
            </span>
            <SectionActionToolbar sectionId="complaint" sectionTitle="নাগরিক অভিযোগ ও তথ্য প্রদান সেল" />
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#0d3b66] mt-1 font-serif">
            তথ্য ও নাগরিক অভিযোগ সেল
          </h2>
          <p className="text-slate-600 mt-3 text-sm sm:text-base leading-relaxed">
            উল্লাপাড়ার যেকোনো জনদুর্ভোগ, সামাজিক সমস্যা, অনিয়ম কিংবা উন্নয়নমূলক অনুসন্ধানী তথ্য নির্ভয়ে প্রেসক্লাবকে জানান। আপনার পরিচয় সম্পূর্ণ গোপন রাখা হবে।
          </p>
          <div className="w-20 h-1 bg-amber-500 mx-auto mt-4 rounded-full"></div>
        </div>

        {/* Dedicated Navigation Tabs */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-10 max-w-3xl mx-auto bg-white p-1.5 rounded-2xl border border-slate-200 shadow-xs">
          <button
            onClick={() => setActiveTab('submit')}
            className={`px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center gap-2 ${
              activeTab === 'submit'
                ? 'bg-[#0d3b66] text-white shadow-sm'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <Send className="w-4 h-4 text-amber-400" />
            <span>তথ্য ও অভিযোগ প্রদান</span>
          </button>

          <button
            onClick={() => setActiveTab('track')}
            className={`px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center gap-2 ${
              activeTab === 'track'
                ? 'bg-[#0d3b66] text-white shadow-sm'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <Search className="w-4 h-4 text-amber-400" />
            <span>অভিযোগের অগ্রগতি ও ট্র্যাকিং</span>
          </button>

          <button
            onClick={() => setActiveTab('stories')}
            className={`px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center gap-2 ${
              activeTab === 'stories'
                ? 'bg-[#0d3b66] text-white shadow-sm'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>জনস্বার্থে প্রকাশিত অনুসন্ধান ({complaints.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('policy')}
            className={`px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center gap-2 ${
              activeTab === 'policy'
                ? 'bg-[#0d3b66] text-white shadow-sm'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <Lock className="w-4 h-4 text-amber-500" />
            <span>গোপনীয়তা ও সুরক্ষা নীতি</span>
          </button>
        </div>

        {/* TAB 1: Information & Grievance Submission */}
        {activeTab === 'submit' && (
          <div className="grid lg:grid-cols-12 gap-8 items-start">
            
            {/* Left Column: Guidelines & Guarantees (5 Cols) */}
            <div className="lg:col-span-5 space-y-6">
              
              {/* Bento Card: Confidentiality Assurance */}
              <div className="bg-[#0d3b66] text-white p-6 sm:p-8 rounded-2xl shadow-md border-l-4 border-l-amber-500 relative overflow-hidden">
                <div className="flex items-center gap-2.5 mb-4 text-amber-300">
                  <Lock className="w-5 h-5 shrink-0" />
                  <h3 className="font-bold text-lg font-serif">
                    শতভাগ গোপনীয়তার প্রতিশ্রুতি
                  </h3>
                </div>
                <p className="text-xs sm:text-sm text-blue-100 leading-relaxed">
                  উল্লাপাড়া প্রেসক্লাব সংবিধান ও সাংবাদিকতার আন্তর্জাতিক নৈতিক মানদণ্ড অনুসরণ করে। তথ্যপ্রদানকারী নিজের পরিচয় প্রকাশ না করতে চাইলে তার নাম বা উৎস কখনোই প্রকাশ করা হবে না।
                </p>

                <div className="mt-6 space-y-3 pt-6 border-t border-blue-900/80 text-xs text-blue-200">
                  <div className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                    <span>যেকোনো অনিয়ম, নাগরিক দুর্ভোগ বা দুর্নীতির তথ্য যাচাই সাপেক্ষে গণমাধ্যমে প্রকাশ</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                    <span>সরেজমিনে সাংবাদিক প্রতিনিধি দলের সত্যতা অনুসন্ধান ও প্রতিবেদন তৈরি</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                    <span>প্রশাসন ও স্থানীয় কর্তৃপক্ষের দৃষ্টি আকর্ষণ করে নাগরিক সমস্যার সমাধান</span>
                  </div>
                </div>
              </div>

              {/* Bento Card: Direct Location */}
              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
                <h4 className="font-bold text-[#0d3b66] font-serif text-sm flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-amber-600" />
                  সরাসরি তথ্য বা অভিযোগ প্রদানের ঠিকানা
                </h4>
                <p className="text-xs text-slate-700 leading-relaxed font-medium">
                  {clubInfo.address}
                </p>
                <div className="p-3 bg-amber-50/70 border border-amber-200 rounded-xl text-xs text-amber-950 flex items-center gap-2">
                  <Clock className="w-4 h-4 text-amber-600 shrink-0" />
                  <span>প্রেসক্লাব অভিযোগ সেল ২৪/৭ সক্রিয় পর্যবেক্ষণ করে।</span>
                </div>
              </div>

              {/* Discreet Link to Internal Admin Monitor */}
              <div className="pt-2 text-center">
                <button
                  onClick={() => setIsAdminOpen(true)}
                  className="text-xs text-slate-500 hover:text-[#0d3b66] font-semibold underline transition flex items-center justify-center gap-1.5 mx-auto"
                >
                  <Inbox className="w-3.5 h-3.5" />
                  <span>প্রেসক্লাব অফিসিয়াল অভিযোগ মনিটরিং (অ্যাডমিন)</span>
                </button>
              </div>

            </div>

            {/* Right Column: Clear Interface Form (7 Cols) */}
            <div className="lg:col-span-7">
              <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-sm border-t-4 border-t-amber-500">
                
                {submittedId ? (
                  <div className="py-8 text-center space-y-5 animate-in fade-in zoom-in-95 duration-200">
                    <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-2xl flex items-center justify-center mx-auto shadow-inner">
                      <CheckCircle2 className="w-9 h-9" />
                    </div>

                    <div>
                      <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
                        তথ্য সফলভাবে জমা হয়েছে
                      </span>
                      <h3 className="text-2xl font-bold text-[#0d3b66] mt-3 font-serif">
                        আপনার তথ্য ও অভিযোগ উল্লাপাড়া প্রেসক্লাবে গৃহীত হয়েছে!
                      </h3>
                      <p className="text-sm text-slate-600 max-w-md mx-auto leading-relaxed mt-2">
                        আমাদের অনুসন্ধানী সাংবাদিক দল বিষয়টি অত্যন্ত গুরুত্বের সাথে পর্যালোচনা করবে।
                      </p>
                    </div>
                    
                    <div className="p-5 bg-slate-50 border border-slate-200 rounded-2xl max-w-sm mx-auto text-center space-y-2">
                      <p className="text-xs text-slate-500 font-medium">আপনার ডিজিটাল ট্র্যাকিং কোড:</p>
                      <div className="flex items-center justify-center gap-2">
                        <span className="text-2xl font-mono font-black text-[#0d3b66] tracking-wider">
                          {submittedId}
                        </span>
                        <button
                          onClick={() => handleCopy(submittedId)}
                          className="p-1.5 bg-white border border-slate-300 rounded-lg hover:bg-slate-100 text-slate-600 transition"
                          title="কোড কপি করুন"
                        >
                          {copiedId ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                        </button>
                      </div>
                      <p className="text-[11px] text-slate-500">
                        এই কোডটি সংরক্ষণ করুন। উপরের "অভিযোগের অগ্রগতি ও ট্র্যাকিং" ট্যাবে গিয়ে যেকোনো সময় অবস্থা দেখতে পারবেন।
                      </p>
                    </div>

                    <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
                      <button
                        onClick={() => {
                          setSearchTrackingId(submittedId);
                          setActiveTab('track');
                          setSubmittedId(null);
                        }}
                        className="px-5 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-xl shadow-sm transition"
                      >
                        অগ্রগতি ট্র্যাক করুন
                      </button>
                      <button
                        onClick={() => setSubmittedId(null)}
                        className="px-5 py-2.5 bg-[#0d3b66] text-white text-xs font-bold rounded-xl hover:bg-[#082846] transition shadow-sm"
                      >
                        আরেকটি তথ্য প্রদান করুন
                      </button>
                    </div>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                      <h3 className="text-xl font-bold text-[#0d3b66] font-serif mb-1">
                        জনস্বার্থে তথ্য বা অভিযোগ ফর্ম
                      </h3>
                      <p className="text-xs text-slate-500 mb-4">
                        তথ্য প্রদানে কোনো দ্বিধা রাখবেন না। সঠিক তথ্য দিয়ে বস্তুনিষ্ঠ সাংবাদিকতায় সহযোগিতা করুন।
                      </p>
                    </div>

                    {/* Category Selection */}
                    <div>
                      <label className="block text-xs font-bold text-[#0d3b66] mb-1.5">
                        তথ্যের ধরণ বা বিষয়শ্রেণী *
                      </label>
                      <select
                        value={formData.category}
                        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                        className="w-full text-xs sm:text-sm bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:bg-white transition"
                      >
                        {categories.map((cat, i) => (
                          <option key={i} value={cat}>{cat}</option>
                        ))}
                      </select>
                    </div>

                    {/* Title */}
                    <div>
                      <label className="block text-xs font-bold text-[#0d3b66] mb-1.5">
                        অভিযোগ বা তথ্যের শিরোনাম *
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.title}
                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                        placeholder="যেমন: উল্লাপাড়া পৌর বাজারের প্রধান ড্রেনেজ সংস্কারের দাবি"
                        className="w-full text-xs sm:text-sm bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:bg-white transition"
                      />
                    </div>

                    {/* Location */}
                    <div>
                      <label className="block text-xs font-bold text-[#0d3b66] mb-1.5">
                        স্থান বা সংশ্লিষ্ট এলাকা
                      </label>
                      <div className="relative">
                        <MapPin className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                        <input
                          type="text"
                          value={formData.location}
                          onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                          placeholder="যেমন: উল্লাপাড়া রেলওয়ে স্টেশন সংলগ্ন এলাকা বা ঘাটিনা"
                          className="w-full text-xs sm:text-sm bg-slate-50 border border-slate-300 rounded-xl pl-10 pr-3.5 py-2.5 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:bg-white transition"
                        />
                      </div>
                    </div>

                    {/* Details */}
                    <div>
                      <label className="block text-xs font-bold text-[#0d3b66] mb-1.5">
                        ঘটনার বিস্তারিত বিবরণ *
                      </label>
                      <textarea
                        required
                        rows={4}
                        value={formData.details}
                        onChange={(e) => setFormData({ ...formData, details: e.target.value })}
                        placeholder="সমস্যাটির বিস্তারিত লিখুন, যাতে সাংবাদিকরা সহজে বিষয়টি যাচাই ও সরেজমিনে তদন্ত করতে পারেন..."
                        className="w-full text-xs sm:text-sm bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:bg-white transition"
                      ></textarea>
                    </div>

                    {/* Anonymity Toggle Card */}
                    <div className="bg-amber-50/60 border border-amber-200 rounded-xl p-4 flex items-center justify-between gap-4">
                      <div className="space-y-0.5">
                        <div className="flex items-center gap-1.5 text-xs font-bold text-amber-950">
                          {formData.isAnonymous ? (
                            <>
                              <EyeOff className="w-4 h-4 text-amber-700" />
                              <span>পরিচয় গোপন রাখা হবে (প্রস্তাবিত)</span>
                            </>
                          ) : (
                            <>
                              <Eye className="w-4 h-4 text-slate-700" />
                              <span>প্রকাশ্যে নাম ও পরিচয় যুক্ত হবে</span>
                            </>
                          )}
                        </div>
                        <p className="text-[11px] text-slate-600">
                          {formData.isAnonymous 
                            ? 'আপনার ব্যক্তিগত নাম ও ফোন নম্বর গোপন থাকবে এবং কোনো প্রতিবেদনে উল্লেখ হবে না।' 
                            : 'প্রতিবেদনে আপনার নাম উদ্ধৃত করার অনুমতি দিচ্ছেন।'}
                        </p>
                      </div>

                      <button
                        type="button"
                        onClick={() => setFormData({ ...formData, isAnonymous: !formData.isAnonymous })}
                        className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition ${
                          formData.isAnonymous
                            ? 'bg-amber-500 text-slate-950 border-amber-500 shadow-xs'
                            : 'bg-white text-slate-700 border-slate-300'
                        }`}
                      >
                        {formData.isAnonymous ? 'গোপন' : 'প্রকাশ্য'}
                      </button>
                    </div>

                    {/* Optional Name and Contact */}
                    {!formData.isAnonymous && (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 animate-in fade-in duration-150">
                        <div>
                          <label className="block text-xs font-bold text-slate-700 mb-1">আপনার নাম</label>
                          <input
                            type="text"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            placeholder="আপনার নাম"
                            className="w-full text-xs px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-bold text-slate-700 mb-1">যোগাযোগ (মোবাইল/মেইল)</label>
                          <input
                            type="text"
                            value={formData.contact}
                            onChange={(e) => setFormData({ ...formData, contact: e.target.value })}
                            placeholder="০১৭১১-XXXXXX"
                            className="w-full text-xs px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                          />
                        </div>
                      </div>
                    )}

                    {formData.isAnonymous && (
                      <div>
                        <label className="block text-xs font-medium text-slate-600 mb-1">
                          সাংবাদিকদের প্রয়োজনে যোগাযোগের নম্বর (ঐচ্ছিক — সম্পূর্ণ গোপন থাকবে):
                        </label>
                        <input
                          type="text"
                          value={formData.contact}
                          onChange={(e) => setFormData({ ...formData, contact: e.target.value })}
                          placeholder="প্রয়োজনীয় তথ্যের বিস্তারিত জানতে চাইলে সাংবাদিক দল যোগাযোগ করতে পারে"
                          className="w-full text-xs px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                        />
                      </div>
                    )}

                    {/* Submit Button */}
                    <div className="pt-2">
                      <button
                        type="submit"
                        className="w-full py-3.5 px-6 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-sm rounded-xl shadow-md flex items-center justify-center gap-2 transition"
                      >
                        <Send className="w-4 h-4" />
                        <span>তথ্য ও অভিযোগ জমা দিন</span>
                      </button>
                    </div>

                  </form>
                )}

              </div>
            </div>

          </div>
        )}

        {/* TAB 2: Grievance Status Tracking */}
        {activeTab === 'track' && (
          <div className="max-w-2xl mx-auto space-y-6">
            <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-sm space-y-6">
              <div className="text-center space-y-2">
                <div className="w-12 h-12 rounded-2xl bg-blue-50 text-[#0d3b66] mx-auto flex items-center justify-center font-bold">
                  <Search className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-[#0d3b66] font-serif">
                  নাগরিক অভিযোগ ট্র্যাকিং ও অগ্রগতি অনুসন্ধান
                </h3>
                <p className="text-xs text-slate-500">
                  আপনার আবেদনের ট্র্যাকিং আইডি প্রবেশ করিয়ে সর্বশেষ তদন্ত ও পর্যালোচনার অবস্থা জানুন।
                </p>
              </div>

              <form onSubmit={handleTrackSearch} className="flex gap-2">
                <input
                  type="text"
                  required
                  value={searchTrackingId}
                  onChange={(e) => setSearchTrackingId(e.target.value)}
                  placeholder="যেমন: UPC-2026-081"
                  className="flex-1 text-sm font-mono uppercase px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:outline-none"
                />
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-[#0d3b66] hover:bg-slate-800 text-white font-bold text-xs sm:text-sm rounded-xl transition flex items-center gap-1.5 shrink-0"
                >
                  <Search className="w-4 h-4" />
                  <span>অনুসন্ধান</span>
                </button>
              </form>

              {searchError && (
                <div className="p-4 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-700 flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
                  <span>এই ট্র্যাকিং নম্বরে কোনো তথ্য খুঁজে পাওয়া যায়নি। সঠিক নম্বর দিয়ে পুনরায় চেষ্টা করুন।</span>
                </div>
              )}

              {searchResult && (
                <div className="p-5 bg-slate-50 border border-slate-200 rounded-2xl space-y-4 animate-in fade-in">
                  <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-200 pb-3">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-black text-blue-900 bg-blue-100 px-2.5 py-1 rounded-lg">
                        {searchResult.id}
                      </span>
                      <span className="text-xs text-slate-500">{searchResult.date}</span>
                    </div>

                    <div>
                      {searchResult.status === 'pending' && (
                        <span className="inline-flex items-center gap-1 text-xs font-bold text-amber-800 bg-amber-100 px-3 py-1 rounded-full border border-amber-300">
                          <Clock className="w-3.5 h-3.5" />
                          নতুন জমা (পর্যালোচনাধীন)
                        </span>
                      )}
                      {searchResult.status === 'reviewing' && (
                        <span className="inline-flex items-center gap-1 text-xs font-bold text-blue-800 bg-blue-100 px-3 py-1 rounded-full border border-blue-300">
                          <Search className="w-3.5 h-3.5" />
                          সাংবাদিকদের তদন্ত চলছে
                        </span>
                      )}
                      {searchResult.status === 'resolved' && (
                        <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-800 bg-emerald-100 px-3 py-1 rounded-full border border-emerald-300">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          নিষ্পত্তিকৃত / প্রতিবেদন প্রকাশিত
                        </span>
                      )}
                    </div>
                  </div>

                  <div>
                    <span className="text-[11px] font-bold text-amber-900 uppercase">
                      বিষয়: {searchResult.category}
                    </span>
                    <h4 className="text-base font-bold text-[#0d3b66] font-serif mt-0.5">
                      {searchResult.title}
                    </h4>
                    <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                      {searchResult.details}
                    </p>
                  </div>

                  <div className="p-3 bg-white border border-slate-200 rounded-xl space-y-1">
                    <p className="text-xs font-bold text-[#0d3b66] flex items-center gap-1.5">
                      <MessageSquare className="w-3.5 h-3.5 text-amber-600" />
                      প্রেসক্লাব অনুসন্ধান ডেস্কের মন্তব্য:
                    </p>
                    <p className="text-xs text-slate-700 italic">
                      {searchResult.investigatorNotes || 'দায়িত্বপ্রাপ্ত সাংবাদিক দল সরেজমিনে তথ্যের সত্যতা যাচাই করছেন।'}
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Demo Helper */}
            <div className="p-4 bg-amber-50/70 border border-amber-200 rounded-xl text-xs text-slate-700 flex items-center justify-between">
              <span>পরীক্ষার জন্য নমুনা আইডি: <strong className="font-mono text-slate-900">UPC-2026-081</strong> অথবা <strong className="font-mono text-slate-900">UPC-2026-092</strong></span>
              <button
                onClick={() => {
                  setSearchTrackingId('UPC-2026-081');
                  const found = complaints.find(c => c.id === 'UPC-2026-081');
                  setSearchResult(found || complaints[0]);
                }}
                className="text-xs text-blue-900 font-bold underline ml-2 shrink-0"
              >
                নমুনা দেখুন
              </button>
            </div>
          </div>
        )}

        {/* TAB 3: Public Impact & Solved Issues */}
        {activeTab === 'stories' && (
          <div className="space-y-6 max-w-4xl mx-auto">
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {complaints.map((item) => (
                <div
                  key={item.id}
                  className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs hover:shadow-md transition flex flex-col justify-between space-y-3"
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-mono font-bold text-slate-500">{item.id}</span>
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        item.status === 'resolved' 
                          ? 'bg-emerald-100 text-emerald-800' 
                          : item.status === 'reviewing' 
                          ? 'bg-blue-100 text-blue-800' 
                          : 'bg-amber-100 text-amber-800'
                      }`}>
                        {item.status === 'resolved' ? 'নিষ্পত্তি' : item.status === 'reviewing' ? 'তদন্তাধীন' : 'নতুন'}
                      </span>
                    </div>

                    <h4 className="font-bold text-sm text-[#0d3b66] font-serif leading-snug">
                      {item.title}
                    </h4>

                    <p className="text-xs text-slate-600 line-clamp-3 leading-relaxed">
                      {item.details}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-slate-100 text-[11px] text-slate-500 flex items-center justify-between">
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-amber-600" />
                      {item.location}
                    </span>
                    <span>{item.date}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 4: Whistleblower Protection & Ethics */}
        {activeTab === 'policy' && (
          <div className="max-w-3xl mx-auto bg-white p-6 sm:p-10 rounded-3xl border border-slate-200 shadow-sm space-y-6">
            <div className="text-center space-y-2 border-b border-slate-100 pb-6">
              <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-800 mx-auto flex items-center justify-center font-bold">
                <Lock className="w-6 h-6" />
              </div>
              <h3 className="text-2xl font-bold text-[#0d3b66] font-serif">
                সাংবাদিকতায় তথ্যের উৎস গোপন রাখার সুরক্ষা নীতি
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 max-w-xl mx-auto">
                গণপ্রজাতন্ত্রী বাংলাদেশের সংবিধানের ৩৯ অনুচ্ছেদ ও আন্তর্জাতিক প্রেস ফ্রিডম সনদ অনুযায়ী উল্লাপাড়া প্রেসক্লাবের অঙ্গীকার
              </p>
            </div>

            <div className="space-y-4 text-xs sm:text-sm text-slate-700 leading-relaxed">
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                <h5 className="font-bold text-[#0d3b66] text-sm">১. তথ্যের উৎসের শতভাগ গোপনীয়তা</h5>
                <p>
                  কোনো নাগরিক যদি তার পরিচয় গোপন রেখে কোনো অনিয়ম বা নাগরিক দুর্ভোগের তথ্য প্রদান করেন, তবে উল্লাপাড়া প্রেসক্লাব কোনো অবস্থাতেই তার নাম, পরিচয় বা ফোন নম্বর জনসমক্ষে প্রকাশ করবে না।
                </p>
              </div>

              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                <h5 className="font-bold text-[#0d3b66] text-sm">২. নিরপেক্ষ সত্যতা যাচাই</h5>
                <p>
                  প্রাপ্ত অভিযোগ বা তথ্যের ভিত্তিতে প্রেসক্লাব প্রতিনিধি দল নিরপেক্ষভাবে উভয় পক্ষের বক্তব্য ও সরেজমিনে প্রমাণ যাচাই করবে, যাতে কোনো নির্দোষ ব্যক্তি হয়রানির শিকার না হন।
                </p>
              </div>

              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                <h5 className="font-bold text-[#0d3b66] text-sm">৩. জনকল্যাণে প্রতিবেদন প্রকাশ</h5>
                <p>
                  তদন্তে সত্য প্রমাণিত হলে সংশ্লিষ্ট গণমাধ্যমে সংবাদ পরিবেশন করা হবে এবং উপজেলা প্রশাসন, পৌরসভা ও সংশ্লিষ্ট কর্তৃপক্ষের দৃষ্টি আকর্ষণ করে দ্রুত সমাধানের উদ্যোগ গ্রহণ করা হবে।
                </p>
              </div>
            </div>

            <div className="pt-4 text-center">
              <button
                onClick={() => setActiveTab('submit')}
                className="px-6 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs sm:text-sm rounded-xl transition shadow-sm"
              >
                এখনই তথ্য ও অভিযোগ জানান
              </button>
            </div>
          </div>
        )}

      </div>
    </section>
  );
}
