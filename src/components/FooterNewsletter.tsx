import React, { useState } from 'react';
import { 
  Mail, 
  Send, 
  CheckCircle2, 
  User, 
  Phone, 
  Sparkles, 
  ShieldCheck, 
  BellRing, 
  FileText, 
  Check, 
  AlertCircle,
  Users
} from 'lucide-react';
import { usePressClub } from '../context/PressClubContext';
import { NewsletterSubscriber } from '../types';

export default function FooterNewsletter() {
  const { addSubscriber, setIsRecruitmentModalOpen } = usePressClub();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [category, setCategory] = useState<NewsletterSubscriber['category']>('member_applicant');
  const [selectedInterests, setSelectedInterests] = useState<string[]>([
    'প্রেস বিজ্ঞপ্তি ও নোটিশ',
    'সদস্যপদ ও সাধারণ সভা'
  ]);
  const [agreedToTerms, setAgreedToTerms] = useState(true);

  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [feedbackMessage, setFeedbackMessage] = useState('');
  const [lastSubscribed, setLastSubscribed] = useState<{ name: string; email: string } | null>(null);

  const availableInterests = [
    { id: 'notices', label: 'প্রেস বিজ্ঞপ্তি ও নোটিশ' },
    { id: 'membership', label: 'সদস্যপদ ও সাধারণ সভা' },
    { id: 'workshops', label: 'মিডিয়া কর্মশালা ও প্রশিক্ষণ' },
    { id: 'reports', label: 'অনুসন্ধানী প্রতিবেদন ও সংকলন' }
  ];

  const handleInterestToggle = (interestLabel: string) => {
    setSelectedInterests(prev => 
      prev.includes(interestLabel)
        ? prev.filter(item => item !== interestLabel)
        : [...prev, interestLabel]
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFeedbackMessage('');

    if (!name.trim()) {
      setStatus('error');
      setFeedbackMessage('অনুগ্রহ করে আপনার পূর্ণ নাম লিখুন।');
      return;
    }

    if (!email.trim() || !email.includes('@') || !email.includes('.')) {
      setStatus('error');
      setFeedbackMessage('অনুগ্রহ করে একটি সঠিক ইমেইল ঠিকানা প্রদান করুন।');
      return;
    }

    if (!agreedToTerms) {
      setStatus('error');
      setFeedbackMessage('ইমেইল আপডেট গ্রহণের সম্মতি বক্সে টিক দিন।');
      return;
    }

    setStatus('loading');

    // Simulate standard brief network processing
    setTimeout(() => {
      const res = addSubscriber({
        name: name.trim(),
        email: email.trim(),
        phone: phone.trim() || undefined,
        category,
        interests: selectedInterests.length > 0 ? selectedInterests : ['সাধারণ আপডেট']
      });

      if (res.success) {
        setStatus('success');
        setFeedbackMessage(res.message);
        setLastSubscribed({ name: name.trim(), email: email.trim() });
        setName('');
        setEmail('');
        setPhone('');
      } else {
        setStatus('error');
        setFeedbackMessage(res.message);
      }
    }, 450);
  };

  const handleReset = () => {
    setStatus('idle');
    setFeedbackMessage('');
    setLastSubscribed(null);
  };

  return (
    <div className="relative mb-14 overflow-hidden rounded-3xl bg-gradient-to-br from-[#0c2f52] via-[#08223c] to-[#05172a] border border-blue-800/80 shadow-2xl">
      {/* Decorative ambient background accents */}
      <div className="absolute -top-24 -right-24 w-72 h-72 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -left-24 w-72 h-72 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative p-6 sm:p-8 lg:p-10">
        
        {/* Top Header Row */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-8 border-b border-blue-800/60">
          <div className="space-y-2 max-w-2xl">
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-amber-400/20 text-amber-300 border border-amber-400/30">
                <BellRing className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
                <span>নিউজলেটার ও সদস্য সংযোগ</span>
              </span>
              <span className="text-xs text-blue-300/80 font-medium">
                • সুবর্ণজয়ন্তী ২০২৭
              </span>
            </div>

            <h3 className="text-2xl sm:text-3xl font-bold font-serif text-white tracking-tight leading-snug">
              প্রেসক্লাবের নিয়মিত কার্যক্রম ও সংবাদের আপডেট পান সরাসরি ইমেইলে
            </h3>

            <p className="text-sm text-blue-100/80 leading-relaxed">
              জরুরি প্রেস বিজ্ঞপ্তি, সাধারণ সভার নোটিশ, মিডিয়া কর্মশালা এবং নতুন সদস্যপদ আহ্বানের তথ্য সবার আগে আপনার ইনবক্সে পেতে সাবস্ক্রাইব করুন অথবা প্রাথমিক সদস্য তালিকায় নাম অন্তর্ভুক্ত করুন।
            </p>
          </div>

          {/* Quick info / Membership recruitment trigger */}
          <div className="flex flex-col sm:flex-row lg:flex-col items-start lg:items-end gap-3 shrink-0">
            <button
              onClick={() => setIsRecruitmentModalOpen(true)}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 font-bold text-xs shadow-md transition transform active:scale-95"
            >
              <FileText className="w-4 h-4 text-slate-950" />
              <span>পূর্ণাঙ্গ সদস্য আবেদন ফরম (PDF / অনলাইন)</span>
            </button>
            <div className="flex items-center gap-2 text-[11px] text-blue-200/70">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>১০০% স্প্যামমুক্ত • যেকোনো সময় আনসাবস্ক্রাইব সুবিধা</span>
            </div>
          </div>
        </div>

        {/* Form Body or Success State */}
        <div className="pt-8">
          {status === 'success' && lastSubscribed ? (
            <div className="p-6 rounded-2xl bg-emerald-950/40 border border-emerald-500/50 text-emerald-100 flex flex-col md:flex-row items-start md:items-center justify-between gap-5 animate-in fade-in duration-300">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-2xl bg-emerald-500 text-slate-950 flex items-center justify-center shrink-0 shadow-lg">
                  <CheckCircle2 className="w-7 h-7" />
                </div>
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-400/40">
                      সাবস্ক্রিপশন সফল
                    </span>
                    <span className="text-xs text-emerald-300/80 font-mono">
                      {new Date().toLocaleDateString('bn-BD')}
                    </span>
                  </div>
                  <h4 className="text-lg font-bold text-white font-serif">
                    ধন্যবাদ, {lastSubscribed.name}!
                  </h4>
                  <p className="text-xs sm:text-sm text-emerald-200/90 leading-relaxed max-w-2xl">
                    আপনার ইমেইল (<strong className="text-white underline">{lastSubscribed.email}</strong>) উল্লাপাড়া প্রেসক্লাবের ডিজিটাল আপডেট ও নোটিশ তালিকায় সফলভাবে যুক্ত হয়েছে। ক্লাবের সকল আনুষ্ঠানিক প্রকাশনা ও বিজ্ঞপ্তি আপনার ইনবক্সে নিয়মিত পৌঁছাবে।
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 shrink-0 w-full md:w-auto">
                <button
                  onClick={handleReset}
                  className="w-full md:w-auto px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs transition border border-white/20"
                >
                  আরেকটি ইমেইল যুক্ত করুন
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              
              {/* Error Banner */}
              {status === 'error' && feedbackMessage && (
                <div className="p-3.5 rounded-xl bg-rose-950/50 border border-rose-500/50 text-rose-200 text-xs flex items-center gap-2.5 animate-in fade-in duration-200">
                  <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
                  <span>{feedbackMessage}</span>
                </div>
              )}

              {/* Input Fields Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                
                {/* 1. Full Name */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-blue-100 flex items-center gap-1.5">
                    <User className="w-3.5 h-3.5 text-amber-400" />
                    <span>আপনার পূর্ণ নাম <span className="text-amber-400">*</span></span>
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      value={name}
                      onChange={e => setName(e.target.value)}
                      placeholder="যেমন: মোঃ রফিকুল ইসলাম"
                      className="w-full pl-3.5 pr-3 py-2.5 rounded-xl bg-slate-900/80 border border-blue-700/60 focus:border-amber-400 focus:outline-none text-white text-xs placeholder:text-blue-200/40 transition shadow-inner"
                      required
                    />
                  </div>
                </div>

                {/* 2. Email Address */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-blue-100 flex items-center gap-1.5">
                    <Mail className="w-3.5 h-3.5 text-amber-400" />
                    <span>ইমেইল ঠিকানা <span className="text-amber-400">*</span></span>
                  </label>
                  <div className="relative">
                    <input
                      type="email"
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      placeholder="যেমন: rafique@example.com"
                      className="w-full pl-3.5 pr-3 py-2.5 rounded-xl bg-slate-900/80 border border-blue-700/60 focus:border-amber-400 focus:outline-none text-white text-xs placeholder:text-blue-200/40 transition shadow-inner"
                      required
                    />
                  </div>
                </div>

                {/* 3. Mobile Number (Optional) */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-blue-100 flex items-center gap-1.5">
                    <Phone className="w-3.5 h-3.5 text-amber-400" />
                    <span>মোবাইল নম্বর <span className="text-blue-300/60 font-normal">(ঐচ্ছিক)</span></span>
                  </label>
                  <div className="relative">
                    <input
                      type="tel"
                      value={phone}
                      onChange={e => setPhone(e.target.value)}
                      placeholder="যেমন: ০১৭১১-XXXXXX"
                      className="w-full pl-3.5 pr-3 py-2.5 rounded-xl bg-slate-900/80 border border-blue-700/60 focus:border-amber-400 focus:outline-none text-white text-xs placeholder:text-blue-200/40 transition shadow-inner"
                    />
                  </div>
                </div>

              </div>

              {/* Second Row: Role & Interests Selection */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 pt-1">
                
                {/* Connection Category / Role (5 cols) */}
                <div className="lg:col-span-5 space-y-1.5">
                  <label className="text-xs font-bold text-blue-100 flex items-center gap-1.5">
                    <Users className="w-3.5 h-3.5 text-amber-400" />
                    <span>আপনার সংযোগের ধরণ / পদমর্যাদা</span>
                  </label>
                  <select
                    value={category}
                    onChange={e => setCategory(e.target.value as NewsletterSubscriber['category'])}
                    className="w-full px-3 py-2.5 rounded-xl bg-slate-900/80 border border-blue-700/60 focus:border-amber-400 focus:outline-none text-white text-xs transition shadow-inner"
                  >
                    <option value="member_applicant">সদস্য হতে আগ্রহী / প্রাথমিক তালিকাভুক্তি (Member Sign-up)</option>
                    <option value="journalist">কর্মরত সাংবাদিক ও গণমাধ্যমকর্মী (Journalist)</option>
                    <option value="citizen">নাগরিক পাঠক ও সুধীসমাজ (Citizen Reader / Civil Society)</option>
                    <option value="student">শিক্ষার্থী বা শিক্ষানবিস সাংবাদিক (Media Student / Intern)</option>
                  </select>
                </div>

                {/* Topics of Interest (7 cols) */}
                <div className="lg:col-span-7 space-y-1.5">
                  <label className="text-xs font-bold text-blue-100 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                    <span>যেসব বিষয়ের নিয়মিত আপডেট চান (পছন্দ নির্বাচন করুন)</span>
                  </label>
                  <div className="flex flex-wrap items-center gap-2 pt-0.5">
                    {availableInterests.map(interest => {
                      const isChecked = selectedInterests.includes(interest.label);
                      return (
                        <button
                          type="button"
                          key={interest.id}
                          onClick={() => handleInterestToggle(interest.label)}
                          className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition flex items-center gap-1.5 border ${
                            isChecked
                              ? 'bg-amber-400 text-slate-950 border-amber-300 shadow-sm'
                              : 'bg-slate-900/60 hover:bg-slate-800 text-blue-200/80 border-blue-800/80'
                          }`}
                        >
                          {isChecked ? (
                            <Check className="w-3 h-3 text-slate-950 font-bold" />
                          ) : (
                            <span className="w-2 h-2 rounded-full bg-blue-500/50" />
                          )}
                          <span>{interest.label}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

              </div>

              {/* Bottom Actions Row */}
              <div className="pt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-t border-blue-800/40">
                
                {/* Agreement Checkbox */}
                <label className="flex items-center gap-2.5 cursor-pointer text-xs text-blue-200/90 select-none">
                  <input
                    type="checkbox"
                    checked={agreedToTerms}
                    onChange={e => setAgreedToTerms(e.target.checked)}
                    className="w-4 h-4 rounded text-amber-500 bg-slate-900 border-blue-700 focus:ring-amber-400 focus:ring-offset-0"
                  />
                  <span>আমি উল্লাপাড়া প্রেসক্লাবের আনুষ্ঠানিক প্রেস বিজ্ঞপ্তি ও কার্যক্রমের আপডেট ইমেইলে গ্রহণে সম্মত।</span>
                </label>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={status === 'loading'}
                  className="px-6 py-3 rounded-xl bg-gradient-to-r from-amber-400 via-amber-300 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 font-bold text-xs sm:text-sm shadow-lg transition flex items-center justify-center gap-2 disabled:opacity-50 shrink-0 transform active:scale-95"
                >
                  {status === 'loading' ? (
                    <>
                      <div className="w-4 h-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
                      <span>সংরক্ষণ করা হচ্ছে...</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4 text-slate-950" />
                      <span>সাবস্ক্রাইব ও তালিকায় যুক্ত হোন</span>
                    </>
                  )}
                </button>

              </div>

            </form>
          )}
        </div>

        {/* Feature Highlights Grid */}
        <div className="mt-8 pt-6 border-t border-blue-800/60 grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs text-blue-200/80">
          <div className="flex items-center gap-3 p-3 rounded-xl bg-blue-900/20 border border-blue-800/40">
            <div className="w-8 h-8 rounded-lg bg-amber-400/20 text-amber-300 flex items-center justify-center shrink-0">
              <Mail className="w-4 h-4" />
            </div>
            <div>
              <strong className="block text-white font-medium">সরাসরি প্রেস বিজ্ঞপ্তি</strong>
              <span>উপজেলা ও জাতীয় সকল জরুরি ঘোষণা</span>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3 rounded-xl bg-blue-900/20 border border-blue-800/40">
            <div className="w-8 h-8 rounded-lg bg-emerald-400/20 text-emerald-300 flex items-center justify-center shrink-0">
              <User className="w-4 h-4" />
            </div>
            <div>
              <strong className="block text-white font-medium">সদস্য আবেদন সতর্কতা</strong>
              <span>নতুন সদস্য আহ্বান ও সভার নোটিশ</span>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3 rounded-xl bg-blue-900/20 border border-blue-800/40">
            <div className="w-8 h-8 rounded-lg bg-blue-400/20 text-blue-300 flex items-center justify-center shrink-0">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div>
              <strong className="block text-white font-medium">১০০% গোপনীয়তা ও সুরক্ষা</strong>
              <span>আপনার ইমেইল তথ্য সম্পূর্ণ সুরক্ষিত</span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
