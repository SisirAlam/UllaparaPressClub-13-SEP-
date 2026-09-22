import React, { useState } from 'react';
import { usePressClub } from '../context/PressClubContext';
import { 
  X, 
  Send, 
  CheckCircle2, 
  FileText, 
  Award, 
  Calendar, 
  Sparkles, 
  Download, 
  Printer, 
  UserCheck, 
  ShieldCheck,
  AlertCircle
} from 'lucide-react';

export default function MembershipRecruitmentModal() {
  const { isRecruitmentModalOpen, setIsRecruitmentModalOpen, images, clubInfo, addMemberApplication } = usePressClub();

  const [activeTab, setActiveTab] = useState<'banner' | 'apply'>('apply');
  const [submittedId, setSubmittedId] = useState<string | null>(null);

  const [form, setForm] = useState({
    fullName: '',
    fatherName: '',
    dob: '',
    nid: '',
    education: '',
    presentAddress: '',
    permanentAddress: '',
    mediaName: '',
    designation: '',
    mediaType: 'জাতীয় দৈনিক পত্রিকা',
    experienceYears: '',
    phone: '',
    email: '',
    reportsSummary: '',
    agreedTerms: false
  });

  if (!isRecruitmentModalOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.fullName || !form.phone || !form.mediaName || !form.agreedTerms) return;

    const appId = addMemberApplication({
      fullName: form.fullName,
      fatherName: form.fatherName,
      dob: form.dob,
      nid: form.nid,
      education: form.education,
      presentAddress: form.presentAddress,
      permanentAddress: form.permanentAddress,
      mediaName: form.mediaName,
      designation: form.designation,
      mediaType: form.mediaType,
      experienceYears: form.experienceYears,
      phone: form.phone,
      email: form.email,
      reportsSummary: form.reportsSummary
    });
    setSubmittedId(appId);
  };

  const handleReset = () => {
    setSubmittedId(null);
    setForm({
      fullName: '',
      fatherName: '',
      dob: '',
      nid: '',
      education: '',
      presentAddress: '',
      permanentAddress: '',
      mediaName: '',
      designation: '',
      mediaType: 'জাতীয় দৈনিক পত্রিকা',
      experienceYears: '',
      phone: '',
      email: '',
      reportsSummary: '',
      agreedTerms: false
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-4xl max-h-[92vh] rounded-3xl shadow-2xl border border-slate-200 flex flex-col overflow-hidden">
        
        {/* Header */}
        <div className="bg-[#0d3b66] text-white px-6 py-4 flex items-center justify-between border-b border-blue-900 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500 text-slate-950 flex items-center justify-center font-bold shadow-md">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-lg font-serif">সদস্য সংগ্রহ ও নবায়ন কার্যক্রম</h3>
                <span className="text-[10px] uppercase font-bold bg-amber-400 text-slate-950 px-2 py-0.5 rounded-full">
                  সুবর্ণজয়ন্তী ৫০
                </span>
              </div>
              <p className="text-xs text-blue-200">
                বস্তুনিষ্ঠ সাংবাদিকতায় ৫০ বছরের গৌরবময় পথচলায় অংশীদার হোন
              </p>
            </div>
          </div>

          <button
            onClick={() => setIsRecruitmentModalOpen(false)}
            className="p-2 text-blue-200 hover:text-white hover:bg-blue-900/60 rounded-xl transition"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Navigation Tabs */}
        <div className="flex items-center bg-slate-100 border-b border-slate-200 px-6 pt-2 gap-2 shrink-0">
          <button
            onClick={() => setActiveTab('apply')}
            className={`px-4 py-2.5 text-xs sm:text-sm font-bold border-b-2 transition flex items-center gap-1.5 ${
              activeTab === 'apply'
                ? 'border-[#0d3b66] text-[#0d3b66] bg-white rounded-t-xl'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>অনলাইন আবেদন ফরম</span>
          </button>

          <button
            onClick={() => setActiveTab('banner')}
            className={`px-4 py-2.5 text-xs sm:text-sm font-bold border-b-2 transition flex items-center gap-1.5 ${
              activeTab === 'banner'
                ? 'border-[#0d3b66] text-[#0d3b66] bg-white rounded-t-xl'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <Award className="w-4 h-4" />
            <span>অফিসিয়াল বিজ্ঞপ্তি ও নির্দেশিকা</span>
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-6 bg-slate-50">
          {activeTab === 'banner' ? (
            <div className="space-y-6 max-w-3xl mx-auto">
              {/* Actual Uploaded Recruitment Banner */}
              {images?.recruitmentBanner ? (
                <div className="rounded-2xl overflow-hidden border-2 border-amber-400 shadow-lg">
                  <img
                    src={images.recruitmentBanner}
                    alt="সদস্য সংগ্রহ ও নবায়ন ব্যানার"
                    className="w-full h-auto object-cover"
                  />
                </div>
              ) : null}

              {/* Tablet Application Mockup */}
              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-900 flex items-center justify-center font-bold">
                    <UserCheck className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-base text-[#0d3b66] font-serif">সদস্য পদ প্রাপ্তির যোগ্যতা ও শর্তাবলী</h4>
                    <p className="text-xs text-slate-500">উল্লাপাড়া প্রেসক্লাব গঠনতন্ত্র অনুযায়ী</p>
                  </div>
                </div>

                <ul className="space-y-2.5 text-xs text-slate-700 list-disc list-inside">
                  <li>আবেদনকারীকে অবশ্যই জাতীয়, আঞ্চলিক বা অনুমোদিত অনলাইন গণমাধ্যমে উল্লাপাড়া উপজেলা প্রতিনিধি হিসেবে কর্মরত থাকতে হবে।</li>
                  <li>বস্তুনিষ্ঠ ও দায়িত্বশীল সাংবাদিকতায় নূন্যতম ৩ বছরের বাস্তব অভিজ্ঞতা থাকতে হবে।</li>
                  <li>কোনো রাজনৈতিক পদে প্রত্যক্ষভাবে যুক্ত বা সাংবাদিকতার নীতিবিরোধী কোনো কর্মকাণ্ডে জড়িত থাকা যাবে না।</li>
                  <li>আবেদনের শেষ তারিখ: <strong>১৫ জুন, ২০২৬</strong>।</li>
                  <li>আবেদনপত্র সরাসরি প্রেসক্লাব কার্যালয়ে জমা দেওয়া যাবে অথবা অনলাইনে পূরণ করা যাবে।</li>
                </ul>

                <div className="pt-2">
                  <button
                    onClick={() => setActiveTab('apply')}
                    className="w-full py-3 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs sm:text-sm rounded-xl shadow-md transition flex items-center justify-center gap-2"
                  >
                    <span>অনলাইন আবেদন ফরমে যান</span>
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="max-w-2xl mx-auto">
              {submittedId ? (
                <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-lg text-center space-y-5">
                  <div className="w-16 h-16 bg-emerald-100 text-emerald-700 rounded-2xl mx-auto flex items-center justify-center shadow-inner">
                    <CheckCircle2 className="w-10 h-10" />
                  </div>

                  <div>
                    <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
                      আবেদন সফলভাবে গৃহীত হয়েছে
                    </span>
                    <h4 className="text-2xl font-bold text-[#0d3b66] mt-3 font-serif">
                      উল্লাপাড়া প্রেসক্লাব সদস্য পদ আবেদন
                    </h4>
                    <p className="text-xs text-slate-600 mt-1">
                      আপনার আবেদনটি যাচাই-বাছাই কমিটির নিকট পাঠানো হয়েছে।
                    </p>
                  </div>

                  <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl inline-block text-left space-y-1">
                    <p className="text-xs text-slate-500 font-medium">আপনার আবেদন ট্র্যাকিং নম্বর:</p>
                    <p className="text-xl font-mono font-black text-amber-600 tracking-wider">
                      {submittedId}
                    </p>
                    <p className="text-[11px] text-slate-500">
                      আবেদনকারী: <strong>{form.fullName}</strong> ({form.mediaName})
                    </p>
                  </div>

                  <div className="p-4 bg-amber-50/70 border border-amber-200 rounded-xl text-xs text-slate-700 text-left space-y-1">
                    <p className="font-bold text-amber-950 flex items-center gap-1">
                      <ShieldCheck className="w-4 h-4 text-amber-700" />
                      পরবর্তী পদক্ষেপ:
                    </p>
                    <p className="text-[11px] leading-relaxed">
                      আবেদনের প্রিন্ট কপি, শিক্ষাগত সনদের ফটোকপি এবং ২টি প্রকাশিত সংবাদের কাটিং আগামী ১৫ জুনের মধ্যে প্রেসক্লাব কার্যালয়ে (থানা সংলগ্ন, উল্লাপাড়া) জমা দিন।
                    </p>
                  </div>

                  <div className="flex items-center justify-center gap-3 pt-2">
                    <button
                      onClick={handleReset}
                      className="px-5 py-2.5 bg-[#0d3b66] text-white font-bold text-xs rounded-xl shadow-sm hover:bg-slate-800 transition"
                    >
                      আরেকটি আবেদন করুন
                    </button>
                    <button
                      onClick={() => setIsRecruitmentModalOpen(false)}
                      className="px-5 py-2.5 border border-slate-300 text-slate-700 font-bold text-xs rounded-xl hover:bg-slate-100 transition"
                    >
                      বন্ধ করুন
                    </button>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-md space-y-6">
                  <div className="border-b border-slate-200 pb-4">
                    <div className="flex items-center gap-2 text-amber-600 text-xs font-bold mb-1">
                      <Sparkles className="w-4 h-4" />
                      সুবর্ণজয়ন্তী ৫০ সদস্য নবায়ন ও অন্তর্ভুক্তি
                    </div>
                    <h4 className="text-xl font-bold text-[#0d3b66] font-serif">সদস্য পদের অনলাইন আবেদন ফরম</h4>
                    <p className="text-xs text-slate-500 mt-1">
                      সকল তারকা (*) চিহ্নিত ঘরগুলো সঠিকভাবে পূরণ করুন।
                    </p>
                  </div>

                  {/* Step 1: Personal Info */}
                  <div className="space-y-4">
                    <h5 className="text-xs font-bold uppercase tracking-wider text-slate-400 border-b pb-1">
                      ১. ব্যক্তিগত তথ্যাদি
                    </h5>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">পূর্ণ নাম *</label>
                        <input
                          type="text"
                          required
                          value={form.fullName}
                          onChange={(e) => setForm({ ...form, fullName: e.target.value })}
                          placeholder="জাতীয় পরিচয়পত্র অনুযায়ী"
                          className="w-full text-xs px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">পিতার নাম</label>
                        <input
                          type="text"
                          value={form.fatherName}
                          onChange={(e) => setForm({ ...form, fatherName: e.target.value })}
                          placeholder="পিতার নাম লিখুন"
                          className="w-full text-xs px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:outline-none"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">মোবাইল নম্বর *</label>
                        <input
                          type="tel"
                          required
                          value={form.phone}
                          onChange={(e) => setForm({ ...form, phone: e.target.value })}
                          placeholder="০১৭১১-XXXXXX"
                          className="w-full text-xs px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">ইমেইল</label>
                        <input
                          type="email"
                          value={form.email}
                          onChange={(e) => setForm({ ...form, email: e.target.value })}
                          placeholder="example@mail.com"
                          className="w-full text-xs px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:outline-none"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Step 2: Professional Info */}
                  <div className="space-y-4">
                    <h5 className="text-xs font-bold uppercase tracking-wider text-slate-400 border-b pb-1">
                      ২. পেশাগত তথ্যাদি
                    </h5>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">কর্মরত গণমাধ্যমের নাম *</label>
                        <input
                          type="text"
                          required
                          value={form.mediaName}
                          onChange={(e) => setForm({ ...form, mediaName: e.target.value })}
                          placeholder="যেমন: দৈনিক ইত্তেফাক / সময় টিভি"
                          className="w-full text-xs px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">বর্তমান পদবী *</label>
                        <input
                          type="text"
                          required
                          value={form.designation}
                          onChange={(e) => setForm({ ...form, designation: e.target.value })}
                          placeholder="উপজেলা প্রতিনিধি / নিজস্ব সংবাদদাতা"
                          className="w-full text-xs px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:outline-none"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">মিডিয়া টাইপ</label>
                        <select
                          value={form.mediaType}
                          onChange={(e) => setForm({ ...form, mediaType: e.target.value })}
                          className="w-full text-xs px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:outline-none"
                        >
                          <option value="জাতীয় দৈনিক পত্রিকা">জাতীয় দৈনিক পত্রিকা</option>
                          <option value="স্যাটেলাইট টেলিভিশন">স্যাটেলাইট টেলিভিশন</option>
                          <option value="অনলাইন নিউজ পোর্টাল">অনলাইন নিউজ পোর্টাল</option>
                          <option value="আঞ্চলিক দৈনিক">আঞ্চলিক দৈনিক</option>
                          <option value="নিউজ এজেন্সি / রেডিও">নিউজ এজেন্সি / রেডিও</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">সাংবাদিকতায় অভিজ্ঞতা (বছর)</label>
                        <input
                          type="text"
                          value={form.experienceYears}
                          onChange={(e) => setForm({ ...form, experienceYears: e.target.value })}
                          placeholder="যেমন: ৪ বছর"
                          className="w-full text-xs px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:outline-none"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">প্রকাশিত গুরুত্বপূর্ণ প্রতিবেদন বা অর্জন</label>
                      <textarea
                        rows={2}
                        value={form.reportsSummary}
                        onChange={(e) => setForm({ ...form, reportsSummary: e.target.value })}
                        placeholder="আপনার উল্লেখযোগ্য অনুসন্ধানমূলক প্রতিবেদনের সংক্ষেপ বিবরণ..."
                        className="w-full text-xs px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:outline-none"
                      />
                    </div>
                  </div>

                  {/* Declaration Checkbox */}
                  <div className="p-3 bg-amber-50/70 border border-amber-200 rounded-xl">
                    <label className="flex items-start gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        required
                        checked={form.agreedTerms}
                        onChange={(e) => setForm({ ...form, agreedTerms: e.target.checked })}
                        className="mt-0.5 rounded text-amber-600 focus:ring-amber-500"
                      />
                      <span className="text-[11px] text-slate-700 leading-relaxed">
                        আমি অঙ্গীকার করছি যে, উপরে প্রদত্ত সকল তথ্য সত্য ও নির্ভুল। আমি উল্লাপাড়া প্রেসক্লাবের গঠনতন্ত্র ও সাংবাদিকতার পেশাগত নৈতিকতা মেনে চলব।
                      </span>
                    </label>
                  </div>

                  <div className="flex items-center justify-between pt-2">
                    <span className="text-xs text-slate-400">আবেদনের শেষ তারিখ: ১৫ জুন ২০২৬</span>
                    <button
                      type="submit"
                      className="px-6 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs sm:text-sm rounded-xl shadow-md flex items-center gap-2 transition"
                    >
                      <Send className="w-4 h-4" />
                      আবেদন জমা দিন
                    </button>
                  </div>
                </form>
              )}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
