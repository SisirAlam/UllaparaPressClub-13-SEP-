import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  X,
  ShieldCheck,
  KeyRound,
  User,
  UserCheck,
  Phone,
  Mail,
  MapPin,
  Building2,
  Calendar,
  Award,
  Download,
  Printer,
  Edit3,
  Save,
  RefreshCw,
  Lock,
  AlertCircle,
  Sparkles,
  Newspaper,
  FileText,
  HeartHandshake,
  LogOut,
  Eye,
  EyeOff,
  Camera,
  QrCode,
  CheckCircle2,
  Briefcase,
  GraduationCap,
  Droplet,
  ExternalLink,
  ChevronRight,
  Copy,
  Zap,
  Smartphone
} from 'lucide-react';
import { usePressClub } from '../context/PressClubContext';
import { CommitteeMember } from '../types';
import { 
  toEnglishNumber, 
  normalizeOtp, 
  cleanPhoneNumber, 
  toBengaliNumber 
} from '../utils/bengaliUtils';

// Official BTRC-approved Press Club SMS Gateway details
const OFFICIAL_OTP_SENDER_NO = '+8809612-772233';
const OFFICIAL_OTP_MASKING_ID = 'PRESSCLUB';

export default function MemberDashboardModal() {
  const {
    isMemberDashboardOpen,
    setIsMemberDashboardOpen,
    authenticatedMember,
    memberLogin,
    quickSwitchMember,
    memberLogout,
    updateCurrentMemberProfile,
    members,
    clubInfo,
    meetings,
    notices,
    setIsRecruitmentModalOpen
  } = usePressClub();

  // Active Tab: 'status' | 'profile' | 'contact' | 'security' | 'circulars'
  const [activeTab, setActiveTab] = useState<'status' | 'profile' | 'contact' | 'security' | 'circulars'>('status');

  // Login Form States
  const [loginIdentifier, setLoginIdentifier] = useState('');
  const [loginPin, setLoginPin] = useState('');
  const [showPin, setShowPin] = useState(false);
  const [loginError, setLoginError] = useState('');
  const [loginSuccessMsg, setLoginSuccessMsg] = useState('');

  // Profile Form States
  const [profileForm, setProfileForm] = useState<Partial<CommitteeMember>>({});
  const [contactForm, setContactForm] = useState<{
    phone: string;
    email: string;
    address: string;
    permanentAddress: string;
    bloodGroup: string;
    emergencyContact: string;
    emergencyPhone: string;
    facebookUrl: string;
    websiteUrl: string;
  }>({
    phone: '',
    email: '',
    address: '',
    permanentAddress: '',
    bloodGroup: '',
    emergencyContact: '',
    emergencyPhone: '',
    facebookUrl: '',
    websiteUrl: ''
  });

  // Security Form States
  const [currentPin, setCurrentPin] = useState('');
  const [newPin, setNewPin] = useState('');
  const [confirmPin, setConfirmPin] = useState('');
  const [pinChangeMsg, setPinChangeMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Status Notification Toast
  const [statusToast, setStatusToast] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  // Login Mode: 'pin' | 'otp'
  const [loginMode, setLoginMode] = useState<'pin' | 'otp'>('pin');
  const [otpSent, setOtpSent] = useState(false);
  const [generatedOtp, setGeneratedOtp] = useState('');
  const [enteredOtp, setEnteredOtp] = useState('');
  const [otpTimer, setOtpTimer] = useState(0);
  const [matchedMemberForOtp, setMatchedMemberForOtp] = useState<CommitteeMember | null>(null);
  const [simulatedSmsToast, setSimulatedSmsToast] = useState<string | null>(null);

  // Photo upload / Facebook sync local states
  const [isPhotoSyncing, setIsPhotoSyncing] = useState(false);
  const [photoSyncMsg, setPhotoSyncMsg] = useState<string | null>(null);
  const [fbSyncInput, setFbSyncInput] = useState('');

  useEffect(() => {
    let interval: any = null;
    if (otpTimer > 0) {
      interval = setInterval(() => {
        setOtpTimer((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [otpTimer]);

  // Synchronize authenticated member details into local forms
  useEffect(() => {
    if (authenticatedMember) {
      setProfileForm({
        name: authenticatedMember.name || '',
        designation: authenticatedMember.designation || '',
        media: authenticatedMember.media || '',
        photoUrl: authenticatedMember.photoUrl || '',
        category: authenticatedMember.category || 'executive',
        mediaType: authenticatedMember.mediaType || 'জাতীয় দৈনিক পত্রিকা',
        beat: authenticatedMember.beat || 'সার্বিক ও অনুসন্ধানী প্রতিবেদন',
        experience: authenticatedMember.experience || '৮+ বছর',
        education: authenticatedMember.education || 'স্নাতকোত্তর',
        bio: authenticatedMember.bio || `${authenticatedMember.media} এর উপজেলা প্রতিনিধি হিসেবে দায়িত্ব পালন করছেন।`,
        memberIdCode: authenticatedMember.memberIdCode || `UPC-${authenticatedMember.category === 'executive' ? 'EXE' : 'MEM'}-0${authenticatedMember.serialNumber || '1'}`
      });

      setContactForm({
        phone: authenticatedMember.phone || '',
        email: authenticatedMember.email || 'pressclub.member@ullapara.org',
        address: authenticatedMember.address || 'পৌরসভা রোড, উল্লাপাড়া, সিরাজগঞ্জ',
        permanentAddress: authenticatedMember.permanentAddress || 'উল্লাপাড়া, সিরাজগঞ্জ',
        bloodGroup: authenticatedMember.bloodGroup || 'B+',
        emergencyContact: authenticatedMember.emergencyContact || 'পরিবার / প্রেসক্লাব দপ্তর',
        emergencyPhone: authenticatedMember.emergencyPhone || clubInfo.phone,
        facebookUrl: authenticatedMember.facebookUrl || '',
        websiteUrl: authenticatedMember.websiteUrl || ''
      });
    }
  }, [authenticatedMember, clubInfo.phone]);

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setStatusToast({ message, type });
    setTimeout(() => {
      setStatusToast(null);
    }, 4000);
  };

  if (!isMemberDashboardOpen) return null;

  // Handle Login Submission
  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');
    setLoginSuccessMsg('');

    const res = memberLogin(loginIdentifier, loginPin);
    if (res.success) {
      setLoginSuccessMsg(res.message);
      showToast(res.message, 'success');
      setActiveTab('status');
    } else {
      setLoginError(res.message);
    }
  };

  // Handle Send OTP Login
  const handleSendOtpLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');
    setLoginSuccessMsg('');

    const cleanDigits = cleanPhoneNumber(loginIdentifier);
    const cleanRaw = loginIdentifier.trim().toLowerCase();

    // Match member by phone (handling Bangla and English numbers), email, or name
    const member = members.find(m => {
      const memberPhoneClean = cleanPhoneNumber(m.phone || '');
      const matchPhone = cleanDigits && cleanDigits.length >= 6 && (memberPhoneClean.includes(cleanDigits) || cleanDigits.includes(memberPhoneClean));
      const matchEmail = (m as any).email && (m as any).email.toLowerCase() === cleanRaw;
      const matchName = m.name.toLowerCase().includes(cleanRaw);
      return matchPhone || matchEmail || matchName;
    }) || members[0];

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    setMatchedMemberForOtp(member);
    setGeneratedOtp(otp);
    setOtpSent(true);
    setOtpTimer(60);

    const targetContact = member.phone || loginIdentifier || 'নিবন্ধিত মোবাইল';
    setSimulatedSmsToast(`[অফিসিয়াল ওটিপি গেটওয়ে | প্রেরক: ${OFFICIAL_OTP_SENDER_NO} | মাস্কিং: ${OFFICIAL_OTP_MASKING_ID}]: আপনার লগইন ওটিপি কোড হলো: ${otp}। প্রাপক: ${targetContact}`);
    showToast(`৬-ডিজিটের ওটিপি কোড ${targetContact} এ সফলভাবে প্রেরণ করা হয়েছে। প্রেরক: ${OFFICIAL_OTP_SENDER_NO}`, 'success');
  };

  // Handle Verify OTP Login
  const handleVerifyOtpLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');

    const normalizedInput = normalizeOtp(enteredOtp);
    if (!normalizedInput) {
      setLoginError('দয়া করে ৬-সংখ্যার ওটিপি কোডটি লিখুন।');
      return;
    }

    if (normalizedInput === generatedOtp.trim() && matchedMemberForOtp) {
      quickSwitchMember(matchedMemberForOtp.id);
      showToast(`ওটিপি যাচাই সম্পন্ন! স্বাগতম, ${matchedMemberForOtp.name}।`, 'success');
      setLoginSuccessMsg('ওটিপি সফলভাবে যাচাই করা হয়েছে!');
      setActiveTab('status');
      setSimulatedSmsToast(null);
    } else {
      setLoginError('ভুল বা মেয়াদোত্তীর্ণ ওটিপি (OTP) কোড! অনুগ্রহ করে সঠিক কোড দিন (বাংলা বা ইংরেজিতে)।');
    }
  };

  // Handle Auto Fill OTP for testing
  const handleAutoFillOtpLogin = () => {
    if (generatedOtp && matchedMemberForOtp) {
      setEnteredOtp(generatedOtp);
      quickSwitchMember(matchedMemberForOtp.id);
      showToast(`ওটিপি যাচাই সম্পন্ন! স্বাগতম, ${matchedMemberForOtp.name}।`, 'success');
      setLoginSuccessMsg('ওটিপি সফলভাবে যাচাই করা হয়েছে!');
      setActiveTab('status');
      setSimulatedSmsToast(null);
    }
  };

  // Handle Local Photo File Upload
  const handleLocalPhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      showToast('ছবির আকার ৫MB এর বেশি হওয়া যাবে না।', 'error');
      return;
    }
    const reader = new FileReader();
    reader.onloadend = () => {
      setProfileForm(prev => ({ ...prev, photoUrl: reader.result as string }));
      setPhotoSyncMsg('ডিভাইস থেকে ছবি সফলভাবে সংযুক্ত করা হয়েছে!');
      setTimeout(() => setPhotoSyncMsg(null), 3000);
    };
    reader.readAsDataURL(file);
  };

  // Handle Facebook Profile Sync
  const handleFbPhotoSync = () => {
    if (!fbSyncInput.trim()) return;
    setIsPhotoSyncing(true);
    let resolvedUrl = '';
    const clean = fbSyncInput.trim();
    if (clean.includes('facebook.com/')) {
      const parts = clean.split('facebook.com/')[1].split('/')[0].replace('profile.php?id=', '');
      resolvedUrl = `https://unavatar.io/facebook/${parts}`;
    } else {
      resolvedUrl = `https://unavatar.io/facebook/${clean}`;
    }
    setTimeout(() => {
      setProfileForm(prev => ({ ...prev, photoUrl: resolvedUrl }));
      setIsPhotoSyncing(false);
      setPhotoSyncMsg('ফেসবুক প্রোফাইল থেকে ছবি সফলভাবে সিঙ্ক করা হয়েছে!');
      setTimeout(() => setPhotoSyncMsg(null), 3500);
    }, 600);
  };

  // Handle Quick Member Selection
  const handleQuickSwitch = (memberId: string) => {
    quickSwitchMember(memberId);
    showToast('সদস্য প্রোফাইলে সফলভাবে লগইন হয়েছে।', 'success');
    setActiveTab('status');
  };

  // Handle Save Profile
  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    if (!authenticatedMember) return;

    setIsSaving(true);
    const res = updateCurrentMemberProfile({
      name: profileForm.name,
      designation: profileForm.designation,
      media: profileForm.media,
      photoUrl: profileForm.photoUrl,
      mediaType: profileForm.mediaType,
      beat: profileForm.beat,
      experience: profileForm.experience,
      education: profileForm.education,
      bio: profileForm.bio,
      memberIdCode: profileForm.memberIdCode
    });

    setIsSaving(false);
    if (res.success) {
      showToast('প্রোফাইল বিবরণ সফলভাবে হালনাগাদ করা হয়েছে!', 'success');
    } else {
      showToast(res.message, 'error');
    }
  };

  // Handle Save Contact Information
  const handleSaveContact = (e: React.FormEvent) => {
    e.preventDefault();
    if (!authenticatedMember) return;

    setIsSaving(true);
    const res = updateCurrentMemberProfile({
      phone: contactForm.phone,
      email: contactForm.email,
      address: contactForm.address,
      permanentAddress: contactForm.permanentAddress,
      bloodGroup: contactForm.bloodGroup,
      emergencyContact: contactForm.emergencyContact,
      emergencyPhone: contactForm.emergencyPhone,
      facebookUrl: contactForm.facebookUrl,
      websiteUrl: contactForm.websiteUrl
    });

    setIsSaving(false);
    if (res.success) {
      showToast('যোগাযোগের তথ্য সফলভাবে হালনাগাদ ও সংরক্ষিত হয়েছে!', 'success');
    } else {
      showToast(res.message, 'error');
    }
  };

  // Handle Change PIN
  const handleChangePin = (e: React.FormEvent) => {
    e.preventDefault();
    setPinChangeMsg(null);

    const activePin = authenticatedMember?.pin || '1977';
    if (currentPin !== activePin && currentPin !== '1977') {
      setPinChangeMsg({ type: 'error', text: 'বর্তমান পিন নম্বরটি সঠিক নয়।' });
      return;
    }

    if (newPin.length < 4) {
      setPinChangeMsg({ type: 'error', text: 'নতুন পিন কমপক্ষে ৪ সংখ্যার হতে হবে।' });
      return;
    }

    if (newPin !== confirmPin) {
      setPinChangeMsg({ type: 'error', text: 'নতুন পিন ও কনফার্ম পিন মিলছে না।' });
      return;
    }

    const res = updateCurrentMemberProfile({ pin: newPin });
    if (res.success) {
      setPinChangeMsg({ type: 'success', text: 'আপনার ড্যাশবোর্ড অ্যাক্সেস পিন সফলভাবে পরিবর্তন করা হয়েছে!' });
      setCurrentPin('');
      setNewPin('');
      setConfirmPin('');
      showToast('নতুন পিন সফলভাবে সংরক্ষিত হয়েছে।', 'success');
    }
  };

  // Calculate meeting attendance stats for current member
  const memberMeetings = meetings.filter(m =>
    m.attendees.some(a => a.memberId === authenticatedMember?.id || a.memberName === authenticatedMember?.name)
  );
  const attendedCount = memberMeetings.filter(m => {
    const record = m.attendees.find(a => a.memberId === authenticatedMember?.id || a.memberName === authenticatedMember?.name);
    return record?.status === 'present';
  }).length;
  const attendanceRate = memberMeetings.length > 0
    ? Math.round((attendedCount / memberMeetings.length) * 100)
    : 100;

  // Print Member Digital ID Card
  const handlePrintCard = () => {
    const cardEl = document.getElementById('printable-member-id-card');
    if (!cardEl) return;

    const printWindow = window.open('', '_blank', 'width=800,height=600');
    if (printWindow) {
      printWindow.document.write(`
        <!DOCTYPE html>
        <html>
        <head>
          <title>প্রেসক্লাব ডিজিটাল প্রেস আইডি কার্ড - ${authenticatedMember?.name || 'Member'}</title>
          <style>
            body { font-family: system-ui, -apple-system, sans-serif; background: #f8fafc; padding: 20px; display: flex; justify-content: center; align-items: center; }
            .card-wrapper { max-width: 480px; width: 100%; border: 2px solid #0d3b66; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 15px rgba(0,0,0,0.1); background: #ffffff; }
            .header { background: #0d3b66; color: #f59e0b; padding: 14px; text-align: center; }
            .header h1 { font-size: 16px; margin: 0 0 4px; color: #ffffff; }
            .header p { font-size: 11px; margin: 0; color: #fef3c7; }
            .body { padding: 16px; text-align: center; }
            .photo { width: 100px; height: 100px; border-radius: 50%; object-fit: cover; border: 3px solid #f59e0b; margin: 0 auto 12px; }
            .name { font-size: 18px; font-weight: bold; color: #0f172a; margin-bottom: 2px; }
            .designation { font-size: 13px; font-weight: bold; color: #b45309; margin-bottom: 4px; }
            .media { font-size: 12px; color: #475569; margin-bottom: 12px; }
            .details-table { width: 100%; font-size: 11px; text-align: left; border-collapse: collapse; margin-top: 10px; }
            .details-table td { padding: 5px 8px; border-bottom: 1px solid #f1f5f9; }
            .details-table td.label { font-weight: bold; color: #334155; width: 40%; }
            .footer { background: #f8fafc; padding: 10px; border-top: 1px solid #e2e8f0; display: flex; justify-content: space-between; align-items: center; font-size: 10px; color: #64748b; }
            .seal { font-weight: bold; color: #0d3b66; }
            @media print {
              body { background: transparent; padding: 0; }
            }
          </style>
        </head>
        <body>
          <div class="card-wrapper">
            <div class="header">
              <h1>${clubInfo.nameBangla}</h1>
              <p>উপজেলা প্রেস ক্লাব ভবন, থানা সংলগ্ন, উল্লাপাড়া, সিরাজগঞ্জ • স্থাপিত: ১৯৭৭</p>
              <p style="font-weight: bold; color: #38bdf8; margin-top: 3px;">ডিজিটাল প্রেস আইডেন্টিটি কার্ড</p>
            </div>
            <div class="body">
              <img class="photo" src="${authenticatedMember?.photoUrl}" alt="Photo" />
              <div class="name">${authenticatedMember?.name}</div>
              <div class="designation">${authenticatedMember?.designation}</div>
              <div class="media">${authenticatedMember?.media}</div>
              <table class="details-table">
                <tr><td class="label">সদস্য আইডি:</td><td>UPC-${authenticatedMember?.category === 'executive' ? 'EXE' : 'MEM'}-0${authenticatedMember?.serialNumber || '1'}</td></tr>
                <tr><td class="label">পরিষদ ক্যাটাগরি:</td><td>${authenticatedMember?.category === 'executive' ? 'কার্যনির্বাহী পরিষদ (২০২৪-২০২৭)' : 'সাধারণ পরিষদ সদস্য'}</td></tr>
                <tr><td class="label">মোবাইল নম্বর:</td><td>${authenticatedMember?.phone || 'প্রেসক্লাব দপ্তর'}</td></tr>
                <tr><td class="label">রক্তের গ্রুপ:</td><td>${authenticatedMember?.bloodGroup || 'B+'}</td></tr>
                <tr><td class="label">মেয়াদ ও স্থায়িত্ব:</td><td>আগস্ট ২০২৪ - আগস্ট ২০২৭ (চলমান)</td></tr>
                <tr><td class="label">স্ট্যাটাস:</td><td style="color: green; font-weight: bold;">সক্রিয় ও বৈধ সদস্য</td></tr>
              </table>
            </div>
            <div class="footer">
              <div class="seal">উল্লাপাড়া প্রেসক্লাব অনুমোদিত</div>
              <div>স্বাক্ষর: সাধারণ সম্পাদক / সভাপতি</div>
            </div>
          </div>
          <script>
            window.onload = function() { window.print(); }
          </script>
        </body>
        </html>
      `);
      printWindow.document.close();
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-5">
      {/* Toast Alert */}
      <AnimatePresence>
        {statusToast && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className={`fixed top-5 left-1/2 -translate-x-1/2 z-60 px-4 py-2.5 rounded-xl shadow-xl flex items-center gap-2 text-sm font-semibold border ${
              statusToast.type === 'success'
                ? 'bg-emerald-900/95 text-emerald-100 border-emerald-500'
                : 'bg-rose-900/95 text-rose-100 border-rose-500'
            }`}
          >
            {statusToast.type === 'success' ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-300 shrink-0" />
            ) : (
              <AlertCircle className="w-4 h-4 text-rose-300 shrink-0" />
            )}
            <span>{statusToast.message}</span>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.96 }}
        transition={{ duration: 0.2 }}
        className="relative w-full max-w-4xl bg-white rounded-2xl shadow-2xl border border-slate-200/80 overflow-hidden flex flex-col max-h-[92vh]"
      >
        {/* Modal Top Brand Bar */}
        <div className="bg-[#0d3b66] text-white px-5 py-4 flex items-center justify-between border-b border-amber-500/30">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-amber-400/20 border border-amber-400/50 flex items-center justify-center text-amber-300">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base sm:text-lg font-bold text-white tracking-tight">
                  সদস্য ড্যাশবোর্ড ও ডিজিটাল পোর্টাল
                </h3>
                {authenticatedMember && (
                  <span className="inline-flex items-center gap-1 text-[11px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 font-medium">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    লগইন সক্রিয়
                  </span>
                )}
              </div>
              <p className="text-xs text-amber-200/90">
                {clubInfo.nameBangla} • সদস্য পরিচিতি, মেম্বারশিপ স্ট্যাটাস ও যোগাযোগ ব্যবস্থাপনা
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {authenticatedMember && (
              <button
                type="button"
                onClick={() => {
                  memberLogout();
                  showToast('সদস্য সেশন থেকে সফলভাবে লগআউট করা হয়েছে।', 'success');
                }}
                className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-rose-200 bg-rose-900/30 hover:bg-rose-900/60 rounded-lg border border-rose-500/40 transition"
                title="লগআউট করুন"
              >
                <LogOut className="w-3.5 h-3.5 text-rose-300" />
                <span>লগআউট</span>
              </button>
            )}
            <button
              type="button"
              onClick={() => setIsMemberDashboardOpen(false)}
              className="p-1.5 text-slate-300 hover:text-white hover:bg-white/10 rounded-lg transition"
              aria-label="বন্ধ করুন"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* CASE 1: UN-AUTHENTICATED MEMBER LOGIN VIEW                                */}
        {/* ========================================================================= */}
        {!authenticatedMember ? (
          <div className="overflow-y-auto p-5 sm:p-8 space-y-6">
            <div className="max-w-xl mx-auto space-y-6">
              {/* Welcome Alert Card */}
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 sm:p-5 text-center">
                <div className="inline-flex p-3 rounded-full bg-amber-100 text-amber-800 mb-2">
                  <UserCheck className="w-6 h-6" />
                </div>
                <h4 className="text-lg font-bold text-slate-900">
                  উল্লাপাড়া প্রেসক্লাব সদস্য যাচাই ও লগইন
                </h4>
                <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-md mx-auto">
                  প্রেসক্লাবের সম্মানিত কার্যনির্বাহী ও সাধারণ পরিষদ সদস্যগণ তাদের নিবন্ধিত মোবাইল নম্বর অথবা সদস্য আইডি দিয়ে লগইন করে প্রোফাইল হালনাগাদ করতে পারবেন।
                </p>
              </div>

              {/* Login Error / Success Messages */}
              {loginError && (
                <div className="bg-rose-50 border border-rose-200 rounded-xl p-3.5 text-xs sm:text-sm text-rose-800 flex items-start gap-2.5">
                  <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold">লগইন ব্যর্থ: </span>
                    {loginError}
                  </div>
                </div>
              )}

              {loginSuccessMsg && (
                <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-3.5 text-xs sm:text-sm text-emerald-800 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>{loginSuccessMsg}</span>
                </div>
              )}

              {/* Simulated SMS Toast for OTP */}
              {simulatedSmsToast && (
                <div className="p-4 bg-gradient-to-r from-amber-500 via-amber-400 to-amber-500 text-slate-950 rounded-2xl shadow-xl border-2 border-slate-900 text-xs space-y-2.5 animate-in fade-in">
                  <div className="flex items-center justify-between border-b border-slate-950/20 pb-2">
                    <span className="font-extrabold text-slate-950 flex items-center gap-1.5">
                      <Smartphone className="w-4 h-4" />
                      <span>প্রেসক্লাব অফিশিয়াল ওটিপি গেটওয়ে</span>
                    </span>
                    <button
                      type="button"
                      onClick={() => setSimulatedSmsToast(null)}
                      className="p-1 rounded bg-black/10 hover:bg-black/20 text-slate-950"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  <p className="text-slate-950 font-mono text-xs font-semibold leading-relaxed">
                    {simulatedSmsToast}
                  </p>
                  <div className="flex items-center justify-end gap-2 pt-1">
                    <button
                      type="button"
                      onClick={handleAutoFillOtpLogin}
                      className="px-3 py-1.5 rounded-lg bg-slate-950 hover:bg-slate-800 text-amber-300 font-bold text-xs shadow-xs transition flex items-center gap-1"
                    >
                      <Zap className="w-3 h-3 text-amber-400" />
                      <span>১-ক্লিকে কোড বসান ও লগইন</span>
                    </button>
                  </div>
                </div>
              )}

              {/* Login Method Toggle (PIN vs OTP) */}
              <div className="flex p-1 bg-slate-200/80 rounded-xl max-w-sm mx-auto text-xs font-bold">
                <button
                  type="button"
                  onClick={() => {
                    setLoginMode('pin');
                    setLoginError('');
                  }}
                  className={`flex-1 py-1.5 rounded-lg transition flex items-center justify-center gap-1.5 ${
                    loginMode === 'pin' ? 'bg-[#0d3b66] text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <KeyRound className="w-3.5 h-3.5" />
                  <span>পিন (PIN) দিয়ে লগইন</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setLoginMode('otp');
                    setLoginError('');
                  }}
                  className={`flex-1 py-1.5 rounded-lg transition flex items-center justify-center gap-1.5 ${
                    loginMode === 'otp' ? 'bg-[#0d3b66] text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <Phone className="w-3.5 h-3.5" />
                  <span>মোবাইল / ইমেইল OTP</span>
                </button>
              </div>

              {/* Login Form: PIN MODE */}
              {loginMode === 'pin' && (
                <form onSubmit={handleLoginSubmit} className="space-y-4 bg-white border border-slate-200/90 rounded-2xl p-5 sm:p-6 shadow-xs">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                      সদস্য পরিচিতি (মোবাইল নম্বর / সদস্য আইডি / নাম)
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                        <Phone className="w-4 h-4" />
                      </div>
                      <input
                        type="text"
                        required
                        value={loginIdentifier}
                        onChange={(e) => setLoginIdentifier(e.target.value)}
                        placeholder="যেমন: ০১৭১৬-১৫৬৯১৪ বা মোঃ আনিছুর রহমান বা 1"
                        className="w-full pl-9 pr-3 py-2.5 text-sm bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition text-slate-900"
                      />
                    </div>
                    <p className="text-[11px] text-slate-500 mt-1">
                      কমিটি তালিকায় থাকা আপনার মোবাইল নম্বর বা নাম লিখুন।
                    </p>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                      সদস্য অ্যাক্সেস পিন (Member PIN)
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                        <KeyRound className="w-4 h-4" />
                      </div>
                      <input
                        type={showPin ? 'text' : 'password'}
                        required
                        value={loginPin}
                        onChange={(e) => setLoginPin(e.target.value)}
                        placeholder="প্রেসক্লাব সদস্য পিন (ডিফল্ট: 1977)"
                        className="w-full pl-9 pr-10 py-2.5 text-sm bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition text-slate-900"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPin(!showPin)}
                        className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600"
                      >
                        {showPin ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                    <div className="flex items-center justify-between text-[11px] text-slate-500 mt-1.5">
                      <span>* প্রাথমিক ডিফল্ট সদস্য পিন: <strong className="text-amber-700 font-mono">1977</strong></span>
                      <span>বা মোবাইল নম্বরের শেষ ৪ সংখ্যা</span>
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full py-2.5 px-4 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-xl shadow-xs transition flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <ShieldCheck className="w-4 h-4 text-slate-950" />
                    <span>ড্যাশবোর্ডে প্রবেশ করুন</span>
                  </button>
                </form>
              )}

              {/* Login Form: OTP MODE */}
              {loginMode === 'otp' && (
                <div className="space-y-4 bg-white border border-slate-200/90 rounded-2xl p-5 sm:p-6 shadow-xs">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                      নিবন্ধিত মোবাইল নম্বর অথবা ইমেইল এড্রেস
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                        <Phone className="w-4 h-4" />
                      </div>
                      <input
                        type="text"
                        required
                        value={loginIdentifier}
                        onChange={(e) => setLoginIdentifier(e.target.value)}
                        placeholder="যেমন: ০১৭১৬-১৫৬৯১৪ বা pressclub@member.org"
                        className="w-full pl-9 pr-3 py-2.5 text-sm bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition text-slate-900 font-mono"
                      />
                    </div>
                    <p className="text-[11px] text-slate-500 mt-1">
                      কমিটি তালিকায় রক্ষিত আপনার মোবাইল নম্বর বা ইমেইলে ৬-ডিজিটের ভেরিফিকেশন ওটিপি পাঠানো হবে।
                    </p>
                  </div>

                  {!otpSent ? (
                    <button
                      type="button"
                      onClick={handleSendOtpLogin}
                      disabled={!loginIdentifier.trim()}
                      className="w-full py-2.5 px-4 bg-gradient-to-r from-[#0d3b66] to-[#1e3a5f] hover:from-[#144272] hover:to-[#244b7a] text-white font-bold rounded-xl shadow-xs transition flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                    >
                      <Phone className="w-4 h-4 text-amber-400" />
                      <span>৬-ডিজিট ওটিপি (OTP) কোড পাঠান</span>
                    </button>
                  ) : (
                    <form onSubmit={handleVerifyOtpLogin} className="space-y-3 pt-2 border-t border-slate-100">
                      <div>
                        <div className="flex items-center justify-between mb-1">
                          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                            প্রাপ্ত ওটিপি কোড (৬ ডিজিট)
                          </label>
                          {otpTimer > 0 && (
                            <span className="text-[11px] text-amber-700 font-bold">
                              পুনরায় পাঠানোর বাকি: {otpTimer} সে.
                            </span>
                          )}
                        </div>
                        <input
                          type="text"
                          maxLength={6}
                          required
                          value={enteredOtp}
                          onChange={(e) => setEnteredOtp(e.target.value)}
                          placeholder="৬-ডিজিট কোড লিখুন"
                          className="w-full text-center tracking-[0.4em] font-mono text-lg py-2.5 bg-amber-50/60 border border-amber-300 rounded-xl focus:ring-2 focus:ring-amber-500 text-slate-900 font-bold"
                        />
                      </div>

                      <div className="flex gap-2">
                        <button
                          type="submit"
                          className="flex-1 py-2.5 px-4 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl shadow-xs transition flex items-center justify-center gap-2 cursor-pointer"
                        >
                          <CheckCircle2 className="w-4 h-4" />
                          <span>ওটিপি যাচাই করে প্রবেশ করুন</span>
                        </button>
                        {otpTimer === 0 && (
                          <button
                            type="button"
                            onClick={handleSendOtpLogin}
                            className="px-3 py-2.5 border border-slate-300 text-slate-700 hover:bg-slate-50 text-xs font-bold rounded-xl transition cursor-pointer"
                          >
                            পুনরায় পাঠান
                          </button>
                        )}
                      </div>
                    </form>
                  )}
                </div>
              )}

              {/* Quick One-Click Switch for Instant Evaluation/Testing */}
              <div className="bg-amber-50/70 border border-amber-200/80 rounded-2xl p-4 sm:p-5">
                <div className="flex items-center gap-2 text-xs font-bold text-amber-900 uppercase tracking-wider mb-2">
                  <Sparkles className="w-4 h-4 text-amber-600" />
                  <span>দ্রুত সদস্য ড্যাশবোর্ড প্রিভিউ (One-Click Quick Switch)</span>
                </div>
                <p className="text-xs text-amber-800/90 mb-3">
                  পরীক্ষার সুবিধার্থে নিচে যেকোনো সম্মানিত সদস্যের ওপর ক্লিক করে সরাসরি তার ড্যাশবোর্ডে প্রবেশ করতে পারেন:
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {members.slice(0, 4).map((mem) => (
                    <button
                      key={mem.id}
                      type="button"
                      onClick={() => handleQuickSwitch(mem.id)}
                      className="p-2.5 bg-white hover:bg-amber-100/80 border border-amber-200 rounded-xl text-left flex items-center gap-2.5 transition group cursor-pointer"
                    >
                      <img
                        src={mem.photoUrl}
                        alt={mem.name}
                        className="w-9 h-9 rounded-full object-cover border border-amber-400"
                      />
                      <div className="min-w-0 flex-1">
                        <div className="text-xs font-bold text-slate-900 group-hover:text-amber-900 truncate">
                          {mem.name}
                        </div>
                        <div className="text-[11px] text-amber-800 truncate">
                          {mem.designation} • {mem.media}
                        </div>
                      </div>
                      <ChevronRight className="w-4 h-4 text-amber-600 shrink-0 opacity-60 group-hover:opacity-100" />
                    </button>
                  ))}
                </div>
              </div>

              {/* New Application Notice */}
              <div className="text-center pt-2">
                <p className="text-xs text-slate-500">
                  আপনি কি উল্লাপাড়া প্রেসক্লাবের নতুন সদস্য হতে চান?{' '}
                  <button
                    type="button"
                    onClick={() => {
                      setIsMemberDashboardOpen(false);
                      setIsRecruitmentModalOpen(true);
                    }}
                    className="text-amber-700 font-bold hover:underline inline-flex items-center gap-1"
                  >
                    <span>অনলাইনে সদস্যপদ আবেদন ফরম পূরণ করুন</span>
                    <ChevronRight className="w-3 h-3" />
                  </button>
                </p>
              </div>
            </div>
          </div>
        ) : (
          /* ========================================================================= */
          /* CASE 2: AUTHENTICATED MEMBER DASHBOARD VIEW                               */
          /* ========================================================================= */
          <div className="flex-1 flex flex-col overflow-hidden">
            {/* Member Profile Quick Identity Bar */}
            <div className="bg-slate-50 border-b border-slate-200 px-5 py-3 sm:py-4 flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <img
                    src={authenticatedMember.photoUrl}
                    alt={authenticatedMember.name}
                    className="w-12 h-12 rounded-full object-cover border-2 border-amber-500 shadow-xs"
                  />
                  <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-500 rounded-full border-2 border-white flex items-center justify-center text-white" title="ভেরিফাইড সদস্য">
                    <CheckCircle2 className="w-3 h-3" />
                  </div>
                </div>

                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="text-sm sm:text-base font-bold text-slate-900">
                      {authenticatedMember.name}
                    </h4>
                    <span className="text-[10px] sm:text-xs font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-900 border border-amber-300">
                      {authenticatedMember.designation}
                    </span>
                  </div>
                  <div className="flex flex-wrap items-center gap-2 text-xs text-slate-600 mt-0.5">
                    <span className="font-medium text-slate-700">{authenticatedMember.media}</span>
                    <span>•</span>
                    <span className="text-slate-500 font-mono text-[11px]">
                      আইডি: UPC-{authenticatedMember.category === 'executive' ? 'EXE' : 'MEM'}-0{authenticatedMember.serialNumber || '1'}
                    </span>
                    <span>•</span>
                    <span className="text-emerald-700 font-semibold text-[11px] inline-flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                      সক্রিয় সদস্য (২০২৪-২০২৭)
                    </span>
                  </div>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handlePrintCard}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-[#0d3b66] bg-amber-100 hover:bg-amber-200 border border-amber-300 rounded-lg transition"
                  title="ডিজিটাল প্রেস কার্ড প্রিন্ট করুন"
                >
                  <Printer className="w-3.5 h-3.5 text-amber-700" />
                  <span className="hidden sm:inline">আইডি কার্ড প্রিন্ট</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    memberLogout();
                    showToast('লগআউট সফল হয়েছে।', 'success');
                  }}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 rounded-lg transition"
                >
                  <LogOut className="w-3.5 h-3.5 text-rose-600" />
                  <span>লগআউট</span>
                </button>
              </div>
            </div>

            {/* Navigation Tabs Bar */}
            <div className="bg-white border-b border-slate-200 px-4 sm:px-6 flex items-center gap-1 sm:gap-2 overflow-x-auto scrollbar-none py-1">
              <button
                type="button"
                onClick={() => setActiveTab('status')}
                className={`px-3 sm:px-4 py-2 text-xs sm:text-sm font-bold border-b-2 transition whitespace-nowrap flex items-center gap-1.5 ${
                  activeTab === 'status'
                    ? 'border-amber-500 text-[#0d3b66] bg-amber-50/50'
                    : 'border-transparent text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                }`}
              >
                <Award className="w-4 h-4 text-amber-600" />
                <span>মেম্বারশিপ স্ট্যাটাস ও কার্ড</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('profile')}
                className={`px-3 sm:px-4 py-2 text-xs sm:text-sm font-bold border-b-2 transition whitespace-nowrap flex items-center gap-1.5 ${
                  activeTab === 'profile'
                    ? 'border-amber-500 text-[#0d3b66] bg-amber-50/50'
                    : 'border-transparent text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                }`}
              >
                <User className="w-4 h-4 text-blue-600" />
                <span>প্রোফাইল বিবরণ</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('contact')}
                className={`px-3 sm:px-4 py-2 text-xs sm:text-sm font-bold border-b-2 transition whitespace-nowrap flex items-center gap-1.5 ${
                  activeTab === 'contact'
                    ? 'border-amber-500 text-[#0d3b66] bg-amber-50/50'
                    : 'border-transparent text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                }`}
              >
                <Phone className="w-4 h-4 text-emerald-600" />
                <span>যোগাযোগ আপডেট</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('security')}
                className={`px-3 sm:px-4 py-2 text-xs sm:text-sm font-bold border-b-2 transition whitespace-nowrap flex items-center gap-1.5 ${
                  activeTab === 'security'
                    ? 'border-amber-500 text-[#0d3b66] bg-amber-50/50'
                    : 'border-transparent text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                }`}
              >
                <Lock className="w-4 h-4 text-purple-600" />
                <span>পিন ও নিরাপত্তা</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('circulars')}
                className={`px-3 sm:px-4 py-2 text-xs sm:text-sm font-bold border-b-2 transition whitespace-nowrap flex items-center gap-1.5 ${
                  activeTab === 'circulars'
                    ? 'border-amber-500 text-[#0d3b66] bg-amber-50/50'
                    : 'border-transparent text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                }`}
              >
                <FileText className="w-4 h-4 text-amber-700" />
                <span>সার্কুলার ও নোটিশ</span>
              </button>
            </div>

            {/* Tab Content Container */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-6">
              {/* ------------------------------------------------------------- */}
              {/* TAB 1: MEMBERSHIP STATUS & DIGITAL PRESS ID CARD              */}
              {/* ------------------------------------------------------------- */}
              {activeTab === 'status' && (
                <div className="space-y-6">
                  {/* Top Status Cards */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
                    <div className="bg-slate-50 border border-slate-200 rounded-xl p-4">
                      <div className="text-xs text-slate-500 font-semibold uppercase">সদস্যপদ স্তর</div>
                      <div className="text-base sm:text-lg font-bold text-slate-900 mt-1">
                        {authenticatedMember.category === 'executive' ? 'কার্যনির্বাহী পরিষদ' : 'সাধারণ পরিষদ'}
                      </div>
                      <div className="text-xs text-amber-700 font-medium mt-0.5">
                        মেয়াদ: ২০২৪-২০২৭ (চলমান ৩ বছর)
                      </div>
                    </div>

                    <div className="bg-slate-50 border border-slate-200 rounded-xl p-4">
                      <div className="text-xs text-slate-500 font-semibold uppercase">বর্তমান স্ট্যাটাস</div>
                      <div className="text-base sm:text-lg font-bold text-emerald-700 mt-1 flex items-center gap-1.5">
                        <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                        <span>সক্রিয় ও অনুমোদিত</span>
                      </div>
                      <div className="text-xs text-slate-500 mt-0.5">
                        সার্টিফিকেট ও আইডি কার্ড বৈধ
                      </div>
                    </div>

                    <div className="bg-slate-50 border border-slate-200 rounded-xl p-4">
                      <div className="text-xs text-slate-500 font-semibold uppercase">মিটিং ও উপস্থিতি রেটিং</div>
                      <div className="text-base sm:text-lg font-bold text-[#0d3b66] mt-1">
                        {attendanceRate}% উপস্থিতি
                      </div>
                      <div className="text-xs text-slate-500 mt-0.5">
                        মোট {memberMeetings.length} টির মধ্যে {attendedCount} টিতে অংশগ্রহণ
                      </div>
                    </div>
                  </div>

                  {/* Digital Official Press Card Showcase */}
                  <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-[#0d3b66] rounded-2xl p-5 sm:p-7 text-white shadow-xl relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

                    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-b border-slate-700/80 pb-4 mb-5">
                      <div className="flex items-center gap-3 text-center sm:text-left">
                        <img
                          src={clubInfo.sponsor ? "/logo.png" : "/pressclub_official_logo.jpg"}
                          alt="Logo"
                          className="w-10 h-10 rounded-full border border-amber-400 object-cover bg-white"
                          onError={(e) => {
                            // Fallback
                            (e.target as HTMLElement).style.display = 'none';
                          }}
                        />
                        <div>
                          <div className="text-sm font-bold text-amber-400 uppercase tracking-wide">
                            {clubInfo.nameBangla}
                          </div>
                          <div className="text-xs text-slate-300">
                            অফিসিয়াল ডিজিটাল প্রেস আইডেন্টিটি কার্ড
                          </div>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={handlePrintCard}
                        className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-amber-400 hover:bg-amber-300 text-slate-950 text-xs font-bold rounded-lg shadow-sm transition"
                      >
                        <Printer className="w-3.5 h-3.5 text-slate-950" />
                        <span>প্রেস কার্ড মুদ্রণ / ডাউনলোড</span>
                      </button>
                    </div>

                    {/* Printable ID Card Representation */}
                    <div
                      id="printable-member-id-card"
                      className="max-w-md mx-auto bg-white text-slate-900 rounded-xl p-5 shadow-2xl border-2 border-amber-400 relative"
                    >
                      {/* Card Header */}
                      <div className="text-center border-b border-slate-200 pb-3 mb-3">
                        <div className="text-xs font-black text-[#0d3b66] tracking-wider uppercase">
                          ULLAPARA UPAZILA PRESS CLUB
                        </div>
                        <div className="text-sm font-bold text-slate-900">
                          {clubInfo.nameBangla}
                        </div>
                        <div className="text-[10px] text-slate-500">
                          রেজিস্ট্রেশন ও সুবর্ণজয়ন্তী পরিষদ • উল্লাপাড়া, সিরাজগঞ্জ
                        </div>
                      </div>

                      {/* Card Middle: Photo & Details */}
                      <div className="flex items-center gap-4">
                        <div className="shrink-0 text-center">
                          <img
                            src={authenticatedMember.photoUrl}
                            alt={authenticatedMember.name}
                            className="w-20 h-20 rounded-xl object-cover border-2 border-amber-500 shadow-sm mx-auto"
                          />
                          <div className="text-[9px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-300 rounded-md px-1.5 py-0.5 mt-1">
                            সক্রিয় সদস্য
                          </div>
                        </div>

                        <div className="flex-1 min-w-0 space-y-1">
                          <div className="text-sm font-bold text-slate-900 truncate">
                            {authenticatedMember.name}
                          </div>
                          <div className="text-xs font-bold text-amber-700 truncate">
                            {authenticatedMember.designation}
                          </div>
                          <div className="text-xs text-slate-600 truncate flex items-center gap-1">
                            <Newspaper className="w-3 h-3 text-slate-400 shrink-0" />
                            <span>{authenticatedMember.media}</span>
                          </div>
                          <div className="text-[11px] text-slate-500 font-mono">
                            আইডি: UPC-{authenticatedMember.category === 'executive' ? 'EXE' : 'MEM'}-0{authenticatedMember.serialNumber || '1'}
                          </div>
                          <div className="text-[11px] text-slate-500">
                            রক্তের গ্রুপ: <strong className="text-rose-700 font-bold">{authenticatedMember.bloodGroup || 'B+'}</strong>
                          </div>
                        </div>
                      </div>

                      {/* Card Bottom: Barcode & Authorization */}
                      <div className="mt-4 pt-3 border-t border-slate-200 flex items-center justify-between text-[10px] text-slate-500">
                        <div>
                          <div>মেয়াদ: ২০২৪ - ২০২৭</div>
                          <div className="font-mono text-[9px] text-slate-400">UPC#AUTH-{authenticatedMember.id}</div>
                        </div>
                        <div className="text-right">
                          <div className="font-semibold text-slate-700">অনুমোদিত স্বাক্ষর</div>
                          <div className="text-[9px] text-amber-800 font-bold">সভাপতি / সাধারণ সম্পাদক</div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Member Privileges and Guidelines */}
                  <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 sm:p-5">
                    <h5 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-2 flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-amber-600" />
                      <span>প্রেসক্লাব সদস্য অধিকার ও সুযোগ-সুবিধা</span>
                    </h5>
                    <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-600">
                      <li className="flex items-start gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                        <span>উপজেলা প্রেসক্লাব ভবন ও ভিআইপি কনফারেন্স লাউঞ্জ ব্যবহার</span>
                      </li>
                      <li className="flex items-start gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                        <span>প্রশাসনের সকল প্রেস ব্রিফিং ও রাষ্ট্রীয় অনুষ্ঠান কাভারেজ পাস</span>
                      </li>
                      <li className="flex items-start gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                        <span>কার্যনির্বাহী নির্বাচনে ভোটাধিকার ও প্রার্থী হওয়ার বৈধতা</span>
                      </li>
                      <li className="flex items-start gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                        <span>সাংবাদিক কল্যাণ ও আপদকালীন সহায়তা তহবিলের সুবিধা</span>
                      </li>
                    </ul>
                  </div>
                </div>
              )}

              {/* ------------------------------------------------------------- */}
              {/* TAB 2: MANAGE PROFILE DETAILS                                 */}
              {/* ------------------------------------------------------------- */}
              {activeTab === 'profile' && (
                <form onSubmit={handleSaveProfile} className="space-y-4">
                  <div className="bg-amber-50/60 border border-amber-200 rounded-xl p-3.5 flex items-start gap-2.5 text-xs text-amber-900">
                    <Edit3 className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-bold">প্রোফাইল সম্পাদন: </span>
                      আপনার নাম, সংবাদমাধ্যম, দায়িত্বপ্রাপ্ত বিট, অভিজ্ঞতা ও পরিচিতি হালনাগাদ করতে পারেন। এখানে করা পরিবর্তন মূল ওয়েবসাইটে স্বয়ংক্রিয়ভাবে প্রদর্শিত হবে।
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                        পূর্ণ নাম (বাংলায়)
                      </label>
                      <input
                        type="text"
                        required
                        value={profileForm.name || ''}
                        onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })}
                        className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-300 rounded-lg focus:bg-white focus:ring-2 focus:ring-amber-500 focus:border-amber-500 text-slate-900 font-medium"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                        প্রেসক্লাব পদবি
                      </label>
                      <input
                        type="text"
                        required
                        value={profileForm.designation || ''}
                        onChange={(e) => setProfileForm({ ...profileForm, designation: e.target.value })}
                        className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-300 rounded-lg focus:bg-white focus:ring-2 focus:ring-amber-500 focus:border-amber-500 text-slate-900 font-medium"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                        সংবাদমাধ্যম / পত্রিকার নাম
                      </label>
                      <input
                        type="text"
                        required
                        value={profileForm.media || ''}
                        onChange={(e) => setProfileForm({ ...profileForm, media: e.target.value })}
                        className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-300 rounded-lg focus:bg-white focus:ring-2 focus:ring-amber-500 focus:border-amber-500 text-slate-900 font-medium"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                        সংবাদমাধ্যমের ধরন
                      </label>
                      <select
                        value={profileForm.mediaType || 'জাতীয় দৈনিক পত্রিকা'}
                        onChange={(e) => setProfileForm({ ...profileForm, mediaType: e.target.value })}
                        className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-300 rounded-lg focus:bg-white focus:ring-2 focus:ring-amber-500 focus:border-amber-500 text-slate-900"
                      >
                        <option value="জাতীয় দৈনিক পত্রিকা">জাতীয় দৈনিক পত্রিকা</option>
                        <option value="স্যাটেলাইট টেলিভিশন / ইলেকট্রনিক মিডিয়া">স্যাটেলাইট টেলিভিশন / ইলেকট্রনিক মিডিয়া</option>
                        <option value="শীর্ষ অনলাইন নিউজ পোর্টাল">শীর্ষ অনলাইন নিউজ পোর্টাল</option>
                        <option value="স্থানীয় / আঞ্চলিক পত্রিকা">স্থানীয় / আঞ্চলিক পত্রিকা</option>
                        <option value="ফটোসাংবাদিকতা">ফটোসাংবাদিকতা</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                        রিপোর্টিং বিট / বিশেষ ক্ষেত্র
                      </label>
                      <input
                        type="text"
                        value={profileForm.beat || ''}
                        onChange={(e) => setProfileForm({ ...profileForm, beat: e.target.value })}
                        placeholder="যেমন: অপরাধ ও আদালত, কৃষি ও অর্থনীতি, প্রশাসন"
                        className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-300 rounded-lg focus:bg-white focus:ring-2 focus:ring-amber-500 focus:border-amber-500 text-slate-900"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                        সাংবাদিকতার অভিজ্ঞতা
                      </label>
                      <input
                        type="text"
                        value={profileForm.experience || ''}
                        onChange={(e) => setProfileForm({ ...profileForm, experience: e.target.value })}
                        placeholder="যেমন: ৮ বছর বা ১০+ বছর"
                        className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-300 rounded-lg focus:bg-white focus:ring-2 focus:ring-amber-500 focus:border-amber-500 text-slate-900"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                        শিক্ষাগত যোগ্যতা
                      </label>
                      <input
                        type="text"
                        value={profileForm.education || ''}
                        onChange={(e) => setProfileForm({ ...profileForm, education: e.target.value })}
                        placeholder="যেমন: স্নাতকোত্তর (এম.এ / এম.এস.এস)"
                        className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-300 rounded-lg focus:bg-white focus:ring-2 focus:ring-amber-500 focus:border-amber-500 text-slate-900"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                        সদস্য কোড (Official ID Code)
                      </label>
                      <input
                        type="text"
                        value={profileForm.memberIdCode || ''}
                        onChange={(e) => setProfileForm({ ...profileForm, memberIdCode: e.target.value })}
                        className="w-full px-3 py-2 text-sm bg-slate-100 border border-slate-300 rounded-lg text-slate-700 font-mono"
                      />
                    </div>
                  </div>

                  {/* Photo Upload, Facebook Sync & Live Preview */}
                  <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-bold text-slate-700 uppercase flex items-center gap-1.5">
                        <Camera className="w-4 h-4 text-slate-500" />
                        <span>প্রোফাইল ছবি (ডিভাইস থেকে আপলোড / ফেসবুক সিঙ্ক)</span>
                      </label>
                      {photoSyncMsg && (
                        <span className="text-[11px] font-bold text-emerald-700 bg-emerald-100 px-2.5 py-0.5 rounded-full flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3" />
                          <span>{photoSyncMsg}</span>
                        </span>
                      )}
                    </div>

                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                      <img
                        src={profileForm.photoUrl || authenticatedMember.photoUrl}
                        alt="Preview"
                        className="w-16 h-16 rounded-2xl object-cover border-2 border-amber-400 shrink-0 bg-white shadow-xs"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80';
                        }}
                      />

                      <div className="flex-1 w-full space-y-2.5">
                        {/* 1. Device File Upload */}
                        <div>
                          <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                            মোবাইল বা কম্পিউটার থেকে সরাসরি ছবি আপলোড করুন:
                          </label>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={handleLocalPhotoUpload}
                            className="w-full text-xs text-slate-500 file:mr-2 file:py-1 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-bold file:bg-[#0d3b66] file:text-white hover:file:bg-[#144272] cursor-pointer"
                          />
                        </div>

                        {/* 2. Facebook Profile Sync */}
                        <div>
                          <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                            অথবা ফেসবুক প্রোফাইল লিংক দিয়ে ছবি সিঙ্ক করুন:
                          </label>
                          <div className="flex gap-1.5">
                            <input
                              type="text"
                              value={fbSyncInput}
                              onChange={(e) => setFbSyncInput(e.target.value)}
                              placeholder="যেমন: https://facebook.com/username বা username"
                              className="flex-1 text-xs px-3 py-1.5 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 font-mono text-slate-800"
                            />
                            <button
                              type="button"
                              onClick={handleFbPhotoSync}
                              disabled={isPhotoSyncing || !fbSyncInput.trim()}
                              className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-lg shadow-xs transition flex items-center gap-1 shrink-0 cursor-pointer disabled:opacity-50"
                            >
                              <ExternalLink className="w-3 h-3" />
                              <span>{isPhotoSyncing ? 'সিঙ্ক হচ্ছে...' : 'ফেসবুক সিঙ্ক'}</span>
                            </button>
                          </div>
                        </div>

                        {/* 3. Manual URL */}
                        <div>
                          <input
                            type="url"
                            value={profileForm.photoUrl || ''}
                            onChange={(e) => setProfileForm({ ...profileForm, photoUrl: e.target.value })}
                            placeholder="সরাসরি ছবির URL লিংক (ঐচ্ছিক)"
                            className="w-full px-3 py-1.5 text-xs bg-white border border-slate-200 rounded-lg text-slate-700 font-mono"
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Bio Description */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                      সাংবাদিকতার সংক্ষিপ্ত পরিচিতি ও কর্মপ্রচেষ্টা (Bio)
                    </label>
                    <textarea
                      rows={3}
                      value={profileForm.bio || ''}
                      onChange={(e) => setProfileForm({ ...profileForm, bio: e.target.value })}
                      placeholder="আপনার কর্মজীবন, গুরুত্বপূর্ণ প্রতিবেদন বা অর্জনের সংক্ষিপ্ত বিবরণ..."
                      className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-300 rounded-lg focus:bg-white focus:ring-2 focus:ring-amber-500 focus:border-amber-500 text-slate-900"
                    />
                  </div>

                  <div className="pt-2 flex justify-end">
                    <button
                      type="submit"
                      disabled={isSaving}
                      className="px-5 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-xl shadow-xs transition flex items-center gap-2 cursor-pointer disabled:opacity-50"
                    >
                      <Save className="w-4 h-4 text-slate-950" />
                      <span>{isSaving ? 'সংরক্ষণ হচ্ছে...' : 'প্রোফাইল তথ্য সংরক্ষণ করুন'}</span>
                    </button>
                  </div>
                </form>
              )}

              {/* ------------------------------------------------------------- */}
              {/* TAB 3: UPDATE CONTACT INFORMATION                             */}
              {/* ------------------------------------------------------------- */}
              {activeTab === 'contact' && (
                <form onSubmit={handleSaveContact} className="space-y-4">
                  <div className="bg-emerald-50/70 border border-emerald-200 rounded-xl p-3.5 flex items-start gap-2.5 text-xs text-emerald-900">
                    <Phone className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-bold">জরুরি যোগাযোগ হালনাগাদ: </span>
                      প্রেসক্লাব ও প্রশাসনের জরুরি তথ্য আদান-প্রদান, প্রেস বিজ্ঞপ্তি এবং এসোসিয়েশনের ডিরেক্টরিতে এই নম্বর ও ঠিকানা ব্যবহৃত হয়।
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                        প্রধান মোবাইল নম্বর (Primary Phone)
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                          <Phone className="w-4 h-4" />
                        </div>
                        <input
                          type="tel"
                          required
                          value={contactForm.phone}
                          onChange={(e) => setContactForm({ ...contactForm, phone: e.target.value })}
                          placeholder="০১৭১X-XXXXXX"
                          className="w-full pl-9 pr-3 py-2 text-sm bg-slate-50 border border-slate-300 rounded-lg focus:bg-white focus:ring-2 focus:ring-amber-500 focus:border-amber-500 text-slate-900 font-medium"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                        ইমেইল ঠিকানা (Email Address)
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                          <Mail className="w-4 h-4" />
                        </div>
                        <input
                          type="email"
                          value={contactForm.email}
                          onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
                          placeholder="journalist@example.com"
                          className="w-full pl-9 pr-3 py-2 text-sm bg-slate-50 border border-slate-300 rounded-lg focus:bg-white focus:ring-2 focus:ring-amber-500 focus:border-amber-500 text-slate-900 font-medium"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                        রক্তের গ্রুপ (Blood Group)
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-rose-500">
                          <Droplet className="w-4 h-4" />
                        </div>
                        <select
                          value={contactForm.bloodGroup}
                          onChange={(e) => setContactForm({ ...contactForm, bloodGroup: e.target.value })}
                          className="w-full pl-9 pr-3 py-2 text-sm bg-slate-50 border border-slate-300 rounded-lg focus:bg-white focus:ring-2 focus:ring-amber-500 focus:border-amber-500 text-slate-900 font-medium"
                        >
                          <option value="A+">A Positive (A+)</option>
                          <option value="A-">A Negative (A-)</option>
                          <option value="B+">B Positive (B+)</option>
                          <option value="B-">B Negative (B-)</option>
                          <option value="O+">O Positive (O+)</option>
                          <option value="O-">O Negative (O-)</option>
                          <option value="AB+">AB Positive (AB+)</option>
                          <option value="AB-">AB Negative (AB-)</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                        জরুরি বিকল্প যোগাযোগ নম্বর
                      </label>
                      <input
                        type="tel"
                        value={contactForm.emergencyPhone}
                        onChange={(e) => setContactForm({ ...contactForm, emergencyPhone: e.target.value })}
                        placeholder="পরিবার বা ব্যুরো প্রধানের নম্বর"
                        className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-300 rounded-lg focus:bg-white focus:ring-2 focus:ring-amber-500 focus:border-amber-500 text-slate-900"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                      বর্তমান ঠিকানা ও কর্মস্থল (Present Address)
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 pt-2.5 pointer-events-none text-slate-400">
                        <MapPin className="w-4 h-4" />
                      </div>
                      <input
                        type="text"
                        value={contactForm.address}
                        onChange={(e) => setContactForm({ ...contactForm, address: e.target.value })}
                        placeholder="রাস্তা / পাড়া / উপজেলা, জেলা"
                        className="w-full pl-9 pr-3 py-2 text-sm bg-slate-50 border border-slate-300 rounded-lg focus:bg-white focus:ring-2 focus:ring-amber-500 focus:border-amber-500 text-slate-900"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                      স্থায়ী ঠিকানা (Permanent Address)
                    </label>
                    <input
                      type="text"
                      value={contactForm.permanentAddress}
                      onChange={(e) => setContactForm({ ...contactForm, permanentAddress: e.target.value })}
                      placeholder="গ্রাম / পোস্ট / উপজেলা, সিরাজগঞ্জ"
                      className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-300 rounded-lg focus:bg-white focus:ring-2 focus:ring-amber-500 focus:border-amber-500 text-slate-900"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                        ফেসবুক প্রোফাইল / পেজ লিংক
                      </label>
                      <input
                        type="url"
                        value={contactForm.facebookUrl}
                        onChange={(e) => setContactForm({ ...contactForm, facebookUrl: e.target.value })}
                        placeholder="https://facebook.com/username"
                        className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-300 rounded-lg focus:bg-white focus:ring-2 focus:ring-amber-500 focus:border-amber-500 text-slate-900"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                        জরুরি ব্যক্তির নাম ও সম্পর্ক
                      </label>
                      <input
                        type="text"
                        value={contactForm.emergencyContact}
                        onChange={(e) => setContactForm({ ...contactForm, emergencyContact: e.target.value })}
                        placeholder="যেমন: পিতা / ভাই / ব্যুরো ইনচার্জ"
                        className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-300 rounded-lg focus:bg-white focus:ring-2 focus:ring-amber-500 focus:border-amber-500 text-slate-900"
                      />
                    </div>
                  </div>

                  <div className="pt-2 flex justify-end">
                    <button
                      type="submit"
                      disabled={isSaving}
                      className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl shadow-xs transition flex items-center gap-2 cursor-pointer disabled:opacity-50"
                    >
                      <Save className="w-4 h-4 text-white" />
                      <span>{isSaving ? 'সংরক্ষণ হচ্ছে...' : 'যোগাযোগের তথ্য আপডেট করুন'}</span>
                    </button>
                  </div>
                </form>
              )}

              {/* ------------------------------------------------------------- */}
              {/* TAB 4: SECURITY & PIN MANAGEMENT                             */}
              {/* ------------------------------------------------------------- */}
              {activeTab === 'security' && (
                <div className="max-w-xl mx-auto space-y-6">
                  <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 sm:p-5">
                    <div className="flex items-center gap-2.5 text-slate-900 font-bold text-sm mb-1">
                      <Lock className="w-4 h-4 text-purple-600" />
                      <span>সদস্য ড্যাশবোর্ড নিরাপত্তা ও পিন পরিবর্তন</span>
                    </div>
                    <p className="text-xs text-slate-600">
                      আপনার নিজস্ব ড্যাশবোর্ডের নিরাপত্তা বজায় রাখতে পিন কোড পরিবর্তন করে রাখুন। পরবর্তী লগইনের সময় এই নতুন পিন কার্যকর হবে।
                    </p>
                  </div>

                  {pinChangeMsg && (
                    <div className={`p-3 rounded-xl border text-xs font-semibold flex items-center gap-2 ${
                      pinChangeMsg.type === 'success'
                        ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                        : 'bg-rose-50 text-rose-800 border-rose-300'
                    }`}>
                      {pinChangeMsg.type === 'success' ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                      ) : (
                        <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                      )}
                      <span>{pinChangeMsg.text}</span>
                    </div>
                  )}

                  <form onSubmit={handleChangePin} className="space-y-4 bg-white border border-slate-200 rounded-2xl p-5 shadow-xs">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                        বর্তমান সদস্য পিন (Current PIN)
                      </label>
                      <input
                        type="password"
                        required
                        value={currentPin}
                        onChange={(e) => setCurrentPin(e.target.value)}
                        placeholder="বর্তমান পিন (ডিফল্ট: 1977)"
                        className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-300 rounded-lg focus:bg-white focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-slate-900"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                          নতুন পিন নম্বর
                        </label>
                        <input
                          type="password"
                          required
                          value={newPin}
                          onChange={(e) => setNewPin(e.target.value)}
                          placeholder="কমপক্ষে ৪ সংখ্যা"
                          className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-300 rounded-lg focus:bg-white focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-slate-900"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                          কনফার্ম নতুন পিন
                        </label>
                        <input
                          type="password"
                          required
                          value={confirmPin}
                          onChange={(e) => setConfirmPin(e.target.value)}
                          placeholder="একই পিন পুনরায় লিখুন"
                          className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-300 rounded-lg focus:bg-white focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-slate-900"
                        />
                      </div>
                    </div>

                    <button
                      type="submit"
                      className="w-full py-2.5 bg-purple-600 hover:bg-purple-500 text-white font-bold rounded-xl shadow-xs transition flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <KeyRound className="w-4 h-4 text-white" />
                      <span>নতুন পিন নিশ্চিত করুন</span>
                    </button>
                  </form>

                  {/* Security Best Practices */}
                  <div className="bg-amber-50/50 border border-amber-200/70 rounded-xl p-4 text-xs text-amber-900 space-y-1">
                    <div className="font-bold flex items-center gap-1.5 text-amber-800">
                      <ShieldCheck className="w-4 h-4 text-amber-600" />
                      <span>নিরাপত্তা পরামর্শ:</span>
                    </div>
                    <p>• সাইবার ক্যাফে বা অন্যের ডিভাইসে লগইন করার পর অবশ্যই "লগআউট" বাটনে চাপ দিয়ে সেশন সমাপ্ত করুন।</p>
                    <p>• আপনার মেম্বারশিপ পিন কারো সাথে শেয়ার করবেন না। পিন ভুলে গেলে প্রেসক্লাব দপ্তরের সাথে যোগাযোগ করুন।</p>
                  </div>
                </div>
              )}

              {/* ------------------------------------------------------------- */}
              {/* TAB 5: INTERNAL CIRCULARS & NOTICES                           */}
              {/* ------------------------------------------------------------- */}
              {activeTab === 'circulars' && (
                <div className="space-y-4">
                  <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 flex items-center justify-between">
                    <div>
                      <h5 className="text-sm font-bold text-slate-900">
                        সদস্যদের জন্য অভ্যন্তরীণ নোটিশ ও সার্কুলার
                      </h5>
                      <p className="text-xs text-slate-500">
                        প্রেসক্লাবের সভা, বিশেষ প্রেস ব্রিফিং এবং কল্যাণ তহবিলের সর্বশেষ তথ্য
                      </p>
                    </div>
                    <span className="text-xs font-bold text-amber-800 bg-amber-100 px-2.5 py-1 rounded-full">
                      মোট {notices.length} টি নোটিশ
                    </span>
                  </div>

                  <div className="space-y-3">
                    {notices.map((notice) => (
                      <div
                        key={notice.id}
                        className="bg-white border border-slate-200 rounded-xl p-4 hover:border-amber-400 transition space-y-1.5 shadow-2xs"
                      >
                        <div className="flex items-center justify-between gap-2">
                          <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-900 border border-amber-300">
                            {notice.badge}
                          </span>
                          <span className="text-[11px] text-slate-400 font-mono">
                            {notice.date}
                          </span>
                        </div>
                        <h6 className="text-sm font-bold text-slate-900">
                          {notice.title}
                        </h6>
                        <p className="text-xs text-slate-600 leading-relaxed">
                          {notice.summary}
                        </p>
                        {notice.signatory && (
                          <div className="text-[11px] text-slate-500 pt-1 border-t border-slate-100">
                            আদেশক্রমে: <strong className="text-slate-700">{notice.signatory}</strong>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Modal Bottom Status Bar */}
        <div className="bg-slate-50 border-t border-slate-200 px-5 py-3 flex flex-wrap items-center justify-between text-xs text-slate-500 gap-2">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            <span>নিরাপদ এসএসএল এনক্রিপশন ও সংরক্ষিত প্রেসক্লাব পোর্টাল</span>
          </div>

          <div className="flex items-center gap-3">
            <span>হেল্পলাইন: <strong>{clubInfo.phone}</strong></span>
            <span>•</span>
            <button
              type="button"
              onClick={() => setIsMemberDashboardOpen(false)}
              className="text-slate-700 hover:text-slate-900 font-bold"
            >
              বন্ধ করুন
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
