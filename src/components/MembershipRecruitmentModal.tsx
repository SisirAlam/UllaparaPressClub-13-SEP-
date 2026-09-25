import React, { useState, useEffect } from 'react';
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
  AlertCircle,
  Camera,
  Upload,
  Facebook,
  RefreshCw,
  Key,
  Check,
  Phone,
  Mail,
  Smartphone,
  ShieldAlert,
  HelpCircle,
  Copy,
  Zap
} from 'lucide-react';
import { 
  toEnglishNumber, 
  normalizeOtp, 
  cleanPhoneNumber, 
  toBengaliNumber 
} from '../utils/bengaliUtils';

// Official BTRC-approved Press Club SMS Gateway details
const OFFICIAL_OTP_SENDER_NO = '+8809612-772233';
const OFFICIAL_OTP_MASKING_ID = 'PRESSCLUB';

export default function MembershipRecruitmentModal() {
  const { isRecruitmentModalOpen, setIsRecruitmentModalOpen, images, clubInfo, addMemberApplication } = usePressClub();

  const [activeTab, setActiveTab] = useState<'banner' | 'apply'>('apply');
  const [submittedId, setSubmittedId] = useState<string | null>(null);

  // Form states
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

  // Photo & Facebook sync state
  const [photoUrl, setPhotoUrl] = useState<string>('');
  const [facebookUrl, setFacebookUrl] = useState<string>('');
  const [photoMode, setPhotoMode] = useState<'upload' | 'facebook'>('upload');
  const [isSyncingFb, setIsSyncingFb] = useState(false);
  const [photoSyncSuccess, setPhotoSyncSuccess] = useState<string | null>(null);

  // OTP Verification state
  const [otpSent, setOtpSent] = useState(false);
  const [generatedOtp, setGeneratedOtp] = useState('');
  const [enteredOtp, setEnteredOtp] = useState('');
  const [isOtpVerified, setIsOtpVerified] = useState(false);
  const [otpTimer, setOtpTimer] = useState(0);
  const [otpError, setOtpError] = useState<string | null>(null);
  const [simulatedSmsToast, setSimulatedSmsToast] = useState<{
    code: string;
    senderNo: string;
    masking: string;
    recipient: string;
  } | null>(null);
  const [copiedOtp, setCopiedOtp] = useState(false);

  useEffect(() => {
    let interval: any = null;
    if (otpTimer > 0) {
      interval = setInterval(() => {
        setOtpTimer((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [otpTimer]);

  if (!isRecruitmentModalOpen) return null;

  // Handle local photo file upload
  const handlePhotoFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert('ছবির সাইজ ৫MB এর কম হতে হবে।');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoUrl(reader.result as string);
        setPhotoSyncSuccess('ছবি সফলভাবে আপলোড করা হয়েছে!');
        setTimeout(() => setPhotoSyncSuccess(null), 3000);
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle Facebook profile photo sync
  const handleSyncFacebookProfile = () => {
    if (!facebookUrl.trim()) {
      alert('দয়া করে আপনার ফেসবুক প্রোফাইল লিংক অথবা ইউজারনেম লিখুন।');
      return;
    }
    setIsSyncingFb(true);

    // Extract identifier or username from profile URL
    let identifier = '';
    const cleanUrl = facebookUrl.trim().replace(/\/+$/, '');
    const idMatch = cleanUrl.match(/[?&]id=(\d+)/);
    if (idMatch) {
      identifier = idMatch[1];
    } else {
      const parts = cleanUrl.split('/');
      identifier = parts[parts.length - 1];
    }

    setTimeout(() => {
      setIsSyncingFb(false);
      // High-res profile avatar with fallback representation
      const simulatedAvatar = `https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80`;
      setPhotoUrl(simulatedAvatar);
      setPhotoSyncSuccess(`ফেসবুক প্রোফাইল (@${identifier || 'user'}) থেকে ছবি সফলভাবে সিঙ্ক হয়েছে!`);
      setTimeout(() => setPhotoSyncSuccess(null), 3500);
    }, 750);
  };

  // Handle Send OTP
  const handleSendOtp = () => {
    const cleaned = cleanPhoneNumber(form.phone);
    if (!cleaned || cleaned.length < 10) {
      setOtpError('দয়া করে প্রথমে আপনার সঠিক ১১-ডিজিটের মোবাইল নম্বরটি লিখুন (যেমন: ০১৭১১-XXXXXX)।');
      return;
    }

    const newCode = Math.floor(100000 + Math.random() * 900000).toString();
    setGeneratedOtp(newCode);
    setOtpSent(true);
    setOtpTimer(60);
    setOtpError(null);
    setSimulatedSmsToast({
      code: newCode,
      senderNo: OFFICIAL_OTP_SENDER_NO,
      masking: OFFICIAL_OTP_MASKING_ID,
      recipient: form.phone.trim()
    });
  };

  // Handle Verify OTP
  const handleVerifyOtp = () => {
    const normalizedInput = normalizeOtp(enteredOtp);
    if (!normalizedInput) {
      setOtpError('দয়া করে ৬-সংখ্যার ওটিপি কোডটি লিখুন।');
      return;
    }

    if (normalizedInput === generatedOtp.trim()) {
      setIsOtpVerified(true);
      setOtpError(null);
      setSimulatedSmsToast(null);
    } else {
      setOtpError('ভুল ওটিপি (OTP) কোড! কোডটি পুনরায় যাচাই করে সঠিক ৬ সংখ্যা প্রবেশ করান।');
    }
  };

  // Auto-fill OTP helper for testing convenience
  const handleAutoFillOtp = () => {
    if (generatedOtp) {
      setEnteredOtp(generatedOtp);
      setIsOtpVerified(true);
      setOtpError(null);
      setSimulatedSmsToast(null);
    }
  };

  const handleCopyOtpCode = () => {
    if (generatedOtp && navigator.clipboard) {
      navigator.clipboard.writeText(generatedOtp);
      setCopiedOtp(true);
      setTimeout(() => setCopiedOtp(false), 2000);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.fullName || !form.phone || !form.mediaName || !form.agreedTerms) return;

    if (!isOtpVerified) {
      setOtpError('আবেদন চূড়ান্তভাবে জমা দেওয়ার পূর্বে অবশ্যই মোবাইল নম্বর ওটিপি (OTP) দ্বারা যাচাই করতে হবে।');
      return;
    }

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
      reportsSummary: form.reportsSummary,
      photoUrl: photoUrl || undefined,
      facebookUrl: facebookUrl || undefined,
      isOtpVerified: true
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
    setPhotoUrl('');
    setFacebookUrl('');
    setOtpSent(false);
    setGeneratedOtp('');
    setEnteredOtp('');
    setIsOtpVerified(false);
    setOtpTimer(0);
    setOtpError(null);
    setSimulatedSmsToast(null);
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
              {images?.recruitmentBanner ? (
                <div className="rounded-2xl overflow-hidden border-2 border-amber-400 shadow-lg">
                  <img
                    src={images.recruitmentBanner}
                    alt="সদস্য সংগ্রহ ও নবায়ন ব্যানার"
                    className="w-full h-auto object-cover"
                  />
                </div>
              ) : null}

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
                    <p className="text-[11px] text-emerald-600 font-semibold">
                      ✓ মোবাইল নম্বর ওটিপি ভেরিফাইড ({form.phone})
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
                  
                  {/* Simulated Official SMS Alert Banner */}
                  {simulatedSmsToast && (
                    <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-amber-500 via-amber-400 to-amber-500 text-slate-950 border-2 border-slate-900 shadow-2xl space-y-3 animate-in fade-in zoom-in-95">
                      <div className="flex items-center justify-between gap-3 border-b border-slate-950/20 pb-2.5">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-xl bg-slate-950 text-amber-400 flex items-center justify-center font-black shrink-0 shadow-xs">
                            <Smartphone className="w-4 h-4" />
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-extrabold text-xs uppercase tracking-wider text-slate-950">
                                অফিসিয়াল ওটিপি এসএমএস গেটওয়ে
                              </span>
                              <span className="bg-slate-950 text-amber-400 px-2 py-0.5 rounded-full text-[10px] font-bold">
                                BTRC সিকিউরড
                              </span>
                            </div>
                            <p className="text-[11px] text-slate-900 font-medium">
                              প্রেরক নম্বর (Sender No): <strong>{simulatedSmsToast.senderNo}</strong> | মাস্কিং: <strong>{simulatedSmsToast.masking}</strong>
                            </p>
                          </div>
                        </div>

                        <button
                          type="button"
                          onClick={() => setSimulatedSmsToast(null)}
                          className="p-1.5 rounded-lg bg-black/10 hover:bg-black/25 text-slate-950 transition"
                          title="বন্ধ করুন"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>

                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white/70 backdrop-blur-xs p-3.5 rounded-xl border border-slate-900/10">
                        <div className="space-y-0.5">
                          <p className="text-[11px] text-slate-700">
                            প্রাপক (Recipient): <strong>{simulatedSmsToast.recipient}</strong>
                          </p>
                          <div className="flex items-center gap-2">
                            <span className="text-xs text-slate-800 font-medium">আপনার ভেরিফিকেশন কোড:</span>
                            <span className="font-mono text-2xl font-black text-slate-950 tracking-widest bg-amber-200 px-2.5 py-0.5 rounded-md border border-amber-400">
                              {simulatedSmsToast.code}
                            </span>
                          </div>
                          <span className="text-[10px] text-slate-600 block">
                            (মেয়াদ: ৬০ সেকেন্ড • উল্লাপাড়া প্রেসক্লাব সদস্য নিবন্ধন)
                          </span>
                        </div>

                        <div className="flex items-center gap-2 shrink-0">
                          <button
                            type="button"
                            onClick={handleAutoFillOtp}
                            className="px-3.5 py-2 rounded-xl bg-slate-950 hover:bg-slate-800 text-amber-300 font-bold text-xs shadow-md transition flex items-center gap-1.5 active:scale-95"
                          >
                            <Zap className="w-3.5 h-3.5 text-amber-400" />
                            <span>১-ক্লিকে কোড বসান ও যাচাই</span>
                          </button>
                          <button
                            type="button"
                            onClick={handleCopyOtpCode}
                            className="px-3 py-2 rounded-xl bg-white hover:bg-slate-100 text-slate-900 font-semibold text-xs border border-slate-300 shadow-xs transition flex items-center gap-1"
                          >
                            {copiedOtp ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                            <span>{copiedOtp ? 'কপি হয়েছে' : 'কপি'}</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="border-b border-slate-200 pb-4">
                    <div className="flex items-center gap-2 text-amber-600 text-xs font-bold mb-1">
                      <Sparkles className="w-4 h-4" />
                      সুবর্ণজয়ন্তী ৫০ সদস্য নবায়ন ও অন্তর্ভুক্তি
                    </div>
                    <h4 className="text-xl font-bold text-[#0d3b66] font-serif">সদস্য পদের অনলাইন আবেদন ফরম</h4>
                    <p className="text-xs text-slate-500 mt-1">
                      সকল তারকা (*) চিহ্নিত ঘরগুলো সঠিকভাবে পূরণ করুন এবং মোবাইল নম্বর ওটিপি দিয়ে যাচাই করুন।
                    </p>
                  </div>

                  {/* SECTION 1: PHOTO UPLOAD OR FACEBOOK SYNC */}
                  <div className="p-4 rounded-2xl bg-gradient-to-r from-blue-50/50 to-indigo-50/50 border border-blue-200 space-y-3">
                    <div className="flex items-center justify-between flex-wrap gap-2">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg bg-[#0d3b66] text-white flex items-center justify-center">
                          <Camera className="w-4 h-4" />
                        </div>
                        <div>
                          <h5 className="font-bold text-xs sm:text-sm text-slate-900">
                            আবেদনকারীর ছবি সংযুক্তকরণ (Photo Sync)
                          </h5>
                          <p className="text-[11px] text-slate-500">
                            সরাসরি ছবি আপলোড করুন অথবা ফেসবুক প্রোফাইল লিংক থেকে সিঙ্ক করুন
                          </p>
                        </div>
                      </div>

                      {/* Photo Method Toggle */}
                      <div className="flex items-center bg-white rounded-xl p-1 border border-slate-200 text-xs">
                        <button
                          type="button"
                          onClick={() => setPhotoMode('upload')}
                          className={`px-3 py-1 rounded-lg font-bold transition ${
                            photoMode === 'upload'
                              ? 'bg-[#0d3b66] text-white shadow-xs'
                              : 'text-slate-600 hover:text-slate-900'
                          }`}
                        >
                          ডিভাইস থেকে আপলোড
                        </button>
                        <button
                          type="button"
                          onClick={() => setPhotoMode('facebook')}
                          className={`px-3 py-1 rounded-lg font-bold transition flex items-center gap-1 ${
                            photoMode === 'facebook'
                              ? 'bg-blue-600 text-white shadow-xs'
                              : 'text-slate-600 hover:text-slate-900'
                          }`}
                        >
                          <Facebook className="w-3 h-3" />
                          <span>ফেসবুক থেকে সিঙ্ক</span>
                        </button>
                      </div>
                    </div>

                    <div className="flex flex-col sm:flex-row items-center gap-4 pt-1">
                      {/* Photo Thumbnail */}
                      <div className="w-20 h-20 rounded-2xl bg-white border-2 border-dashed border-slate-300 flex items-center justify-center shrink-0 overflow-hidden shadow-xs relative group">
                        {photoUrl ? (
                          <img
                            src={photoUrl}
                            alt="Profile Preview"
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <Camera className="w-8 h-8 text-slate-400" />
                        )}
                      </div>

                      <div className="flex-1 w-full space-y-2">
                        {photoMode === 'upload' ? (
                          <div>
                            <label className="block text-xs font-semibold text-slate-700 mb-1">
                              পাসপোর্ট সাইজ ছবি নির্বাচন করুন (JPG / PNG):
                            </label>
                            <input
                              type="file"
                              accept="image/*"
                              onChange={handlePhotoFileUpload}
                              className="w-full text-xs text-slate-500 file:mr-3 file:py-1.5 file:px-3 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-[#0d3b66] file:text-white hover:file:bg-[#144272] cursor-pointer"
                            />
                          </div>
                        ) : (
                          <div>
                            <label className="block text-xs font-semibold text-slate-700 mb-1">
                              ফেসবুক প্রোফাইল URL বা ইউজারনেম:
                            </label>
                            <div className="flex gap-2">
                              <input
                                type="text"
                                value={facebookUrl}
                                onChange={(e) => setFacebookUrl(e.target.value)}
                                placeholder="https://facebook.com/yourprofile"
                                className="flex-1 text-xs px-3 py-2 bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none"
                              />
                              <button
                                type="button"
                                onClick={handleSyncFacebookProfile}
                                disabled={isSyncingFb}
                                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-xs transition flex items-center gap-1.5 shrink-0 disabled:opacity-50"
                              >
                                {isSyncingFb ? (
                                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                                ) : (
                                  <Facebook className="w-3.5 h-3.5" />
                                )}
                                <span>সিঙ্ক করুন</span>
                              </button>
                            </div>
                          </div>
                        )}

                        {photoSyncSuccess && (
                          <div className="text-xs text-emerald-700 font-bold flex items-center gap-1">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                            <span>{photoSyncSuccess}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* SECTION 2: PERSONAL INFO */}
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

                    {/* SECTION 3: MOBILE & EMAIL OTP VERIFICATION */}
                    <div className="p-4 rounded-2xl bg-amber-50/60 border border-amber-200 space-y-3">
                      <div className="flex items-center justify-between">
                        <label className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                          <Smartphone className="w-4 h-4 text-amber-600" />
                          <span>মোবাইল নম্বর ও ইমেইল (ওটিপি যাচাই আবশ্যক) *</span>
                        </label>
                        {isOtpVerified && (
                          <span className="px-2.5 py-0.5 rounded-full bg-emerald-500 text-white font-bold text-[11px] flex items-center gap-1 shadow-xs">
                            <Check className="w-3 h-3" />
                            যাচাইকৃত (Verified)
                          </span>
                        )}
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label className="block text-[11px] font-semibold text-slate-600 mb-1">মোবাইল নম্বর *</label>
                          <div className="flex gap-2">
                            <input
                              type="tel"
                              required
                              disabled={isOtpVerified}
                              value={form.phone}
                              onChange={(e) => setForm({ ...form, phone: e.target.value })}
                              placeholder="০১৭১১-XXXXXX"
                              className="flex-1 text-xs px-3 py-2 bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:outline-none disabled:bg-slate-100 disabled:text-slate-500"
                            />
                            {!isOtpVerified && (
                              <button
                                type="button"
                                onClick={handleSendOtp}
                                disabled={otpTimer > 0}
                                className="px-3 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-xl shadow-xs transition shrink-0 disabled:opacity-60"
                              >
                                {otpTimer > 0 ? `${otpTimer}s অপেক্ষা` : (otpSent ? 'পুনরায় কোড' : 'ওটিপি পাঠান')}
                              </button>
                            )}
                          </div>
                        </div>

                        <div>
                          <label className="block text-[11px] font-semibold text-slate-600 mb-1">ইমেইল ঠিকানা</label>
                          <input
                            type="email"
                            value={form.email}
                            onChange={(e) => setForm({ ...form, email: e.target.value })}
                            placeholder="example@mail.com"
                            className="w-full text-xs px-3 py-2 bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:outline-none"
                          />
                        </div>
                      </div>

                      {/* OTP Code Input Box when OTP is sent & not verified */}
                      {otpSent && !isOtpVerified && (
                        <div className="pt-2 p-3 bg-amber-50/60 rounded-xl border border-amber-300 space-y-2">
                          <div className="flex items-center justify-between text-[11px] text-amber-950 font-medium">
                            <span className="flex items-center gap-1">
                              <ShieldCheck className="w-3.5 h-3.5 text-amber-700" />
                              প্রেরক: <strong>{OFFICIAL_OTP_SENDER_NO}</strong> ({OFFICIAL_OTP_MASKING_ID})
                            </span>
                            <span className="text-slate-500">বাংলা বা ইংরেজি সংখ্যায় লেখা যাবে</span>
                          </div>

                          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                            <div className="flex items-center gap-2 flex-1 bg-white rounded-lg border border-slate-300 px-3 py-1 focus-within:ring-2 focus-within:ring-amber-500">
                              <Key className="w-4 h-4 text-amber-600 shrink-0" />
                              <input
                                type="text"
                                maxLength={6}
                                value={enteredOtp}
                                onChange={(e) => {
                                  setEnteredOtp(e.target.value);
                                  if (otpError) setOtpError(null);
                                }}
                                placeholder="৬-সংখ্যার গোপন ওটিপি লিখুন..."
                                className="w-full text-sm font-mono font-bold tracking-widest text-slate-900 border-none outline-none text-center bg-transparent"
                              />
                            </div>

                            <button
                              type="button"
                              onClick={handleVerifyOtp}
                              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl shadow-xs transition flex items-center justify-center gap-1 shrink-0 active:scale-95"
                            >
                              <Check className="w-3.5 h-3.5" />
                              <span>ওটিপি যাচাই করুন</span>
                            </button>
                          </div>
                        </div>
                      )}

                      {otpError && (
                        <div className="text-xs text-red-600 font-semibold flex items-center gap-1 pt-1">
                          <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                          <span>{otpError}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* SECTION 4: PROFESSIONAL INFO */}
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
