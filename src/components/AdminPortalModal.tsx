import React, { useState } from 'react';
import { usePressClub } from '../context/PressClubContext';
import { CommitteeMember, NoticeItem, MemberApplication, AdConfig, NoticeCategory } from '../types';
import {
  Lock,
  Unlock,
  X,
  Save,
  Trash2,
  Plus,
  Edit,
  Building,
  Users,
  Bell,
  Inbox,
  Image as ImageIcon,
  Key,
  CheckCircle2,
  AlertCircle,
  Upload,
  RefreshCw,
  Search,
  ExternalLink,
  ShieldCheck,
  Eye,
  Phone,
  Mail,
  MapPin,
  Download,
  LayoutDashboard,
  UserCheck,
  UserPlus,
  Megaphone,
  Globe,
  Sparkles,
  Copy,
  Check,
  FileText,
  BadgeAlert,
  ArrowRight,
  Code,
  CheckCircle,
  BellRing,
  Radio,
  Facebook
} from 'lucide-react';
import { requestPushPermission, getPushPermission, isPushSupported } from '../utils/pushNotifications';

export default function AdminPortalModal() {
  const {
    isAdminOpen,
    setIsAdminOpen,
    isAdminAuthenticated,
    setIsAdminAuthenticated,
    adminPin,
    setAdminPin,
    clubInfo,
    updateClubInfo,
    resetClubInfo,
    images,
    updateImage,
    resetImages,
    members,
    addMember,
    updateMember,
    deleteMember,
    resetMembers,
    notices,
    addNotice,
    sendBreakingNewsPush,
    updateNotice,
    deleteNotice,
    resetNotices,
    complaints,
    updateComplaintStatus,
    deleteComplaint,
    subscribers,
    deleteSubscriber,
    setIsExportModalOpen,
    memberApplications,
    updateMemberApplicationStatus,
    approveMemberApplication,
    deleteMemberApplication,
    adConfig,
    updateAdConfig,
    resetAdConfig,
    setIsRecruitmentModalOpen,
    tickerItems,
    addTickerItem,
    updateTickerItem,
    deleteTickerItem,
    resetTickerItems,
    popupNotice,
    setPopupNotice,
    setIsPopupNoticeOpen,
    openUrgentNoticePopup,
    cloudSyncStatus,
    lastCloudSyncedAt,
    syncToFirestore,
    appVersion,
    themeSizeMb,
  } = usePressClub();

  // Auth local state
  const [pinInput, setPinInput] = useState('');
  const [authError, setAuthError] = useState(false);
  const [activeTab, setActiveTab] = useState<'dashboard' | 'ticker' | 'applications' | 'ads' | 'subscribers' | 'members' | 'notices' | 'complaints' | 'images' | 'info' | 'security'>('dashboard');
  const [subscriberSearch, setSubscriberSearch] = useState('');

  // Ticker Management state
  const [newTickerText, setNewTickerText] = useState('');
  const [editingTickerIdx, setEditingTickerIdx] = useState<number | null>(null);
  const [editingTickerText, setEditingTickerText] = useState('');
  const [tickerSuccessMsg, setTickerSuccessMsg] = useState<string | null>(null);

  // Member photo upload / facebook sync state
  const [memberFbUrl, setMemberFbUrl] = useState('');
  const [isMemberFbSyncing, setIsMemberFbSyncing] = useState(false);

  // Applications tab state
  const [appSearch, setAppSearch] = useState('');
  const [appFilter, setAppFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all');
  const [selectedAppDetail, setSelectedAppDetail] = useState<MemberApplication | null>(null);
  const [appActionNotice, setAppActionNotice] = useState<string | null>(null);

  // AdConfig tab state
  const [adForm, setAdForm] = useState<AdConfig>(adConfig);
  const [adSavedSuccess, setAdSavedSuccess] = useState(false);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  // Contact Info form state
  const [infoForm, setInfoForm] = useState(clubInfo);
  const [infoSavedSuccess, setInfoSavedSuccess] = useState(false);

  // Member editing state
  const [memberSearch, setMemberSearch] = useState('');
  const [editingMember, setEditingMember] = useState<CommitteeMember | null>(null);
  const [isAddMemberOpen, setIsAddMemberOpen] = useState(false);
  const [newMember, setNewMember] = useState<Omit<CommitteeMember, 'id'>>({
    name: '',
    designation: '',
    media: '',
    phone: '',
    photoUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
    category: 'executive'
  });

  // Notice editing state
  const [editingNotice, setEditingNotice] = useState<NoticeItem | null>(null);
  const [isAddNoticeOpen, setIsAddNoticeOpen] = useState(false);
  const [newNotice, setNewNotice] = useState<Omit<NoticeItem, 'id'>>({
    title: '',
    date: new Date().toLocaleDateString('bn-BD', { day: 'numeric', month: 'long', year: 'numeric' }),
    badge: 'জরুরি প্রেস বিজ্ঞপ্তি',
    category: 'general',
    summary: '',
    fullText: '',
    isImportant: true
  });

  // Security / PIN change state
  const [newPin, setNewPin] = useState('');
  const [pinSuccess, setPinSuccess] = useState(false);

  // Push notification state
  const [sendPushOnCreate, setSendPushOnCreate] = useState(true);
  const [pushTestStatus, setPushTestStatus] = useState<string | null>(null);

  const handleTestPushNotification = async () => {
    setPushTestStatus('অনুমতি যাচাই করা হচ্ছে...');
    const currentPerm = getPushPermission();
    if (currentPerm !== 'granted') {
      const result = await requestPushPermission();
      if (result !== 'granted') {
        setPushTestStatus('❌ ব্রাউজার নোটিফিকেশনের অনুমতি প্রদান করা হয়নি।');
        setTimeout(() => setPushTestStatus(null), 4000);
        return;
      }
    }

    const sent = await sendBreakingNewsPush({
      id: 'test-' + Date.now(),
      title: '🔴 উল্লাপাড়া প্রেসক্লাব: টেস্ট ব্রেকিং নিউজ নোটিফিকেশন',
      summary: 'টেস্ট পুশ নোটিফিকেশন সফলভাবে আপনার ব্রাউজারে পৌঁছেছে। ব্রেকিং নিউজ প্রকাশের সাথে সাথে সাবস্ক্রাইবাররা এই অ্যালার্ট পাবেন।',
      fullText: 'টেস্ট পুশ নোটিফিকেশন সফলভাবে আপনার ব্রাউজারে পৌঁছেছে। ব্রেকিং নিউজ প্রকাশের সাথে সাথে সাবস্ক্রাইবাররা এই অ্যালার্ট পাবেন।',
      date: 'আজ',
      badge: 'ব্রেকিং নিউজ',
      category: 'general',
      type: 'notice',
      isImportant: true
    });

    if (sent) {
      setPushTestStatus('✅ টেস্ট পুশ নোটিফিকেশন পাঠানো হয়েছে!');
    } else {
      setPushTestStatus('⚠️ নোটিফিকেশন ট্রিগার হয়েছে।');
    }
    setTimeout(() => setPushTestStatus(null), 3500);
  };

  // Complaints filter
  const [complaintFilter, setComplaintFilter] = useState<'all' | 'pending' | 'reviewing' | 'resolved'>('all');

  if (!isAdminOpen) return null;

  // Handle PIN authentication
  const handlePinSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (pinInput.trim() === adminPin) {
      setIsAdminAuthenticated(true);
      setAuthError(false);
      setInfoForm(clubInfo);
    } else {
      setAuthError(true);
    }
  };

  const handleSaveInfo = (e: React.FormEvent) => {
    e.preventDefault();
    updateClubInfo(infoForm);
    setInfoSavedSuccess(true);
    setTimeout(() => setInfoSavedSuccess(false), 2500);
  };

  const handleSaveAds = (e: React.FormEvent) => {
    e.preventDefault();
    updateAdConfig(adForm);
    setAdSavedSuccess(true);
    setTimeout(() => setAdSavedSuccess(false), 2500);
  };

  const handleCopyShortcode = (codeText: string) => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(codeText);
      setCopiedCode(codeText);
      setTimeout(() => setCopiedCode(null), 2000);
    }
  };

  const handleApproveApplication = (appId: string) => {
    approveMemberApplication(appId, 'general');
    setAppActionNotice('সদস্য আবেদন অনুমোদিত হয়েছে এবং সক্রিয় সদস্য তালিকায় যুক্ত হয়েছে!');
    setTimeout(() => setAppActionNotice(null), 3000);
    if (selectedAppDetail?.id === appId) {
      setSelectedAppDetail(null);
    }
  };

  const handleRejectApplication = (appId: string) => {
    updateMemberApplicationStatus(appId, 'rejected');
    setAppActionNotice('আবেদন বাতিল করা হয়েছে।');
    setTimeout(() => setAppActionNotice(null), 3000);
    if (selectedAppDetail?.id === appId) {
      setSelectedAppDetail(null);
    }
  };

  const pendingAppsCount = memberApplications.filter(a => a.status === 'pending').length;

  const handleSaveEditedMember = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingMember) return;
    updateMember(editingMember.id, editingMember);
    setEditingMember(null);
  };

  const handleMemberPhotoUpload = (e: React.ChangeEvent<HTMLInputElement>, isEditing: boolean) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const dataUrl = reader.result as string;
        if (isEditing && editingMember) {
          setEditingMember({ ...editingMember, photoUrl: dataUrl });
        } else {
          setNewMember({ ...newMember, photoUrl: dataUrl });
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleMemberFacebookSync = (isEditing: boolean) => {
    if (!memberFbUrl.trim()) return;
    setIsMemberFbSyncing(true);
    setTimeout(() => {
      setIsMemberFbSyncing(false);
      const syncedAvatar = `https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80`;
      if (isEditing && editingMember) {
        setEditingMember({ ...editingMember, photoUrl: syncedAvatar, facebookUrl: memberFbUrl });
      } else {
        setNewMember({ ...newMember, photoUrl: syncedAvatar, facebookUrl: memberFbUrl });
      }
      setMemberFbUrl('');
    }, 600);
  };

  const handleCreateMember = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMember.name || !newMember.designation) return;
    addMember(newMember);
    setIsAddMemberOpen(false);
    setNewMember({
      name: '',
      designation: '',
      media: '',
      phone: '',
      photoUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
      category: 'executive'
    });
  };

  const handleCreateNotice = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNotice.title || !newNotice.summary) return;
    addNotice(newNotice, sendPushOnCreate);
    if (newNotice.isPopup) {
      setPopupNotice(newNotice as any);
      setIsPopupNoticeOpen(true);
    }
    setIsAddNoticeOpen(false);
    setNewNotice({
      title: '',
      date: new Date().toLocaleDateString('bn-BD', { day: 'numeric', month: 'long', year: 'numeric' }),
      badge: 'জরুরি প্রেস বিজ্ঞপ্তি',
      summary: '',
      fullText: '',
      isImportant: true,
      isPopup: false
    });
    setAppActionNotice(
      sendPushOnCreate
        ? 'নতুন নোটিশ প্রকাশিত হয়েছে এবং গ্রাহকদের ডিভাইসে পুশ নোটিফিকেশন পাঠানো হয়েছে!'
        : 'নতুন নোটিশ সফলভাবে প্রকাশিত হয়েছে!'
    );
    setTimeout(() => setAppActionNotice(null), 3500);
  };

  const handleSaveEditedNotice = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingNotice) return;
    updateNotice(editingNotice.id, editingNotice);
    if (editingNotice.isPopup) {
      setPopupNotice(editingNotice);
    }
    setEditingNotice(null);
  };

  const handleFileUpload = (key: keyof typeof images, file: File) => {
    const reader = new FileReader();
    reader.onload = () => {
      if (reader.result) {
        updateImage(key, reader.result as string);
      }
    };
    reader.readAsDataURL(file);
  };

  const handlePinChange = (e: React.FormEvent) => {
    e.preventDefault();
    if (newPin.length >= 4) {
      setAdminPin(newPin);
      setPinSuccess(true);
      setNewPin('');
      setTimeout(() => setPinSuccess(false), 2500);
    }
  };

  if (!isAdminOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="bg-white w-full max-w-5xl h-[92vh] max-h-[850px] rounded-2xl shadow-2xl border border-slate-200 flex flex-col overflow-hidden">
        
        {/* Modal Top Header */}
        <div className="bg-[#0d3b66] text-white px-5 py-4 flex items-center justify-between border-b border-blue-900/60 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500 text-slate-950 flex items-center justify-center font-black shadow-md">
              {isAdminAuthenticated ? <Unlock className="w-5 h-5" /> : <Lock className="w-5 h-5" />}
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h3 className="font-bold text-lg font-serif">উল্লাপাড়া প্রেসক্লাব অ্যাডমিন পোর্টাল</h3>
                <span className="text-[10px] uppercase font-bold bg-amber-400 text-slate-950 px-2 py-0.5 rounded-full">
                  অভ্যন্তরীণ ব্যবস্থাপনা
                </span>
                <span className="text-[10px] font-bold bg-blue-950 border border-blue-600 text-amber-300 px-2 py-0.5 rounded-full font-mono">
                  v{appVersion}
                </span>
                <span className="text-[10px] bg-blue-950/80 border border-blue-700 text-blue-200 px-2 py-0.5 rounded-full hidden sm:inline-block">
                  থিম: {themeSizeMb} MB
                </span>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1 ${
                  cloudSyncStatus === 'syncing'
                    ? 'bg-amber-500 text-slate-950 animate-pulse'
                    : cloudSyncStatus === 'error'
                    ? 'bg-rose-500 text-white'
                    : 'bg-emerald-600 text-white'
                }`}>
                  <span className="w-1.5 h-1.5 rounded-full bg-white animate-ping"></span>
                  <span>
                    {cloudSyncStatus === 'syncing' ? 'ক্লাউডে সিঙ্ক হচ্ছে...' : 'ক্লাউড ডাটাবেজ সয়ংক্রিয় সক্রিয়'}
                  </span>
                </span>
              </div>
              <p className="text-xs text-blue-200 flex items-center gap-2 flex-wrap">
                <span>সদস্য তালিকা, নোটিশ, ছবি ও নাগরিক তথ্য সরাসরি সম্পাদন ও ক্লাউডে সংরক্ষণ করুন।</span>
                {lastCloudSyncedAt && (
                  <span className="text-[11px] text-amber-300/80 font-mono">
                    (সর্বশেষ সিঙ্ক: {lastCloudSyncedAt})
                  </span>
                )}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {isAdminAuthenticated && (
              <button
                onClick={() => setIsAdminAuthenticated(false)}
                className="px-3 py-1.5 rounded-lg bg-blue-900/80 hover:bg-blue-800 text-xs text-blue-200 hover:text-white transition"
                title="লগআউট"
              >
                লক করুন
              </button>
            )}
            <button
              onClick={() => setIsAdminOpen(false)}
              className="p-2 text-blue-200 hover:text-white hover:bg-blue-900/60 rounded-lg transition"
              aria-label="বন্ধ করুন"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Body */}
        {!isAdminAuthenticated ? (
          /* Authentication Screen */
          <div className="flex-1 flex flex-col items-center justify-center p-6 bg-slate-50">
            <div className="w-full max-w-sm bg-white p-8 rounded-2xl border border-slate-200 shadow-lg text-center space-y-5">
              <div className="w-16 h-16 rounded-2xl bg-amber-50 border border-amber-200 text-amber-800 mx-auto flex items-center justify-center shadow-xs">
                <Lock className="w-8 h-8" />
              </div>

              <div>
                <h4 className="text-xl font-bold text-[#0d3b66] font-serif">অ্যাডমিন প্রবেশাধিকার</h4>
                <p className="text-xs text-slate-500 mt-1">
                  তথ্য সম্পাদনার জন্য ৪-ডিজিটের নিরাপত্তা পিন নম্বর প্রবেশ করান।
                </p>
              </div>

              <form onSubmit={handlePinSubmit} className="space-y-4">
                <div>
                  <input
                    type="password"
                    maxLength={8}
                    value={pinInput}
                    onChange={(e) => {
                      setPinInput(e.target.value);
                      setAuthError(false);
                    }}
                    placeholder="নিরাপত্তা পিন দিন"
                    className="w-full text-center text-2xl tracking-widest font-mono py-2.5 px-4 bg-slate-50 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500"
                    autoFocus
                  />
                  {authError && (
                    <p className="text-xs text-rose-600 font-semibold mt-1.5 flex items-center justify-center gap-1">
                      <AlertCircle className="w-3.5 h-3.5" />
                      ভুল পিন নম্বর! আবার চেষ্টা করুন।
                    </p>
                  )}
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-sm rounded-xl shadow-md transition"
                >
                  প্রবেশ করুন
                </button>
              </form>

              <div className="p-3 bg-amber-50/70 border border-amber-200 rounded-xl text-left text-xs text-amber-950 space-y-1">
                <p className="font-bold flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-amber-700" />
                  ক্লাব অ্যাডমিনদের জন্য তথ্য:
                </p>
                <p className="text-slate-600 text-[11px]">
                  ডিফল্ট নিরাপত্তা পিন: <strong className="text-slate-900 font-mono text-xs">1977</strong> (প্রেসক্লাবের প্রতিষ্ঠাকালীন বছর)। ভেতরে প্রবেশ করে পরিবর্তন করতে পারবেন।
                </p>
              </div>
            </div>
          </div>
        ) : (
          /* Authenticated Dashboard */
          <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
            
            {/* Sidebar Navigation */}
            <div className="w-full md:w-64 bg-slate-100 border-r border-slate-200 p-3 flex md:flex-col gap-1.5 overflow-x-auto md:overflow-visible shrink-0">
              <button
                onClick={() => setActiveTab('dashboard')}
                className={`flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-xs font-bold transition text-left shrink-0 md:shrink ${
                  activeTab === 'dashboard'
                    ? 'bg-[#0d3b66] text-white shadow-sm'
                    : 'text-slate-700 hover:bg-slate-200'
                }`}
              >
                <LayoutDashboard className="w-4 h-4 text-amber-400" />
                <span>প্রেসক্লাব ড্যাশবোর্ড</span>
              </button>

              <button
                onClick={() => setActiveTab('applications')}
                className={`flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-xs font-bold transition text-left shrink-0 md:shrink ${
                  activeTab === 'applications'
                    ? 'bg-[#0d3b66] text-white shadow-sm'
                    : 'text-slate-700 hover:bg-slate-200'
                }`}
              >
                <UserCheck className="w-4 h-4 text-blue-400" />
                <span>সদস্য রেজিস্ট্রেশন আবেদন</span>
                {pendingAppsCount > 0 ? (
                  <span className="ml-auto bg-amber-400 text-slate-950 font-black px-1.5 py-0.2 rounded-full text-[10px] animate-pulse">
                    {pendingAppsCount}
                  </span>
                ) : (
                  <span className="ml-auto bg-slate-200 text-slate-700 px-1.5 py-0.2 rounded-full text-[10px]">
                    {memberApplications.length}
                  </span>
                )}
              </button>

              <button
                onClick={() => setActiveTab('ticker')}
                className={`flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-xs font-bold transition text-left shrink-0 md:shrink ${
                  activeTab === 'ticker'
                    ? 'bg-[#0d3b66] text-white shadow-sm'
                    : 'text-slate-700 hover:bg-slate-200'
                }`}
              >
                <Radio className="w-4 h-4 text-amber-400" />
                <span>নিউজ টিকার আপডেট</span>
                <span className="ml-auto bg-amber-400 text-slate-950 px-1.5 py-0.2 rounded-full text-[10px] font-bold">
                  {tickerItems.length}
                </span>
              </button>

              <button
                onClick={() => setActiveTab('ads')}
                className={`flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-xs font-bold transition text-left shrink-0 md:shrink ${
                  activeTab === 'ads'
                    ? 'bg-[#0d3b66] text-white shadow-sm'
                    : 'text-slate-700 hover:bg-slate-200'
                }`}
              >
                <Megaphone className="w-4 h-4 text-emerald-400" />
                <span>গুগল অ্যাডসেন্স ও বিজ্ঞাপন</span>
                <span className={`ml-auto px-1.5 py-0.2 rounded-full text-[10px] font-semibold ${adConfig.enabled ? 'bg-emerald-500 text-white' : 'bg-slate-300 text-slate-700'}`}>
                  {adConfig.enabled ? 'চালু' : 'বন্ধ'}
                </span>
              </button>

              <button
                onClick={() => setActiveTab('subscribers')}
                className={`flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-xs font-bold transition text-left shrink-0 md:shrink ${
                  activeTab === 'subscribers'
                    ? 'bg-[#0d3b66] text-white shadow-sm'
                    : 'text-slate-700 hover:bg-slate-200'
                }`}
              >
                <Mail className="w-4 h-4 text-sky-400" />
                <span>নিউজলেটার ও সাবস্ক্রাইবার</span>
                <span className="ml-auto bg-emerald-600 text-white px-1.5 py-0.2 rounded-full text-[10px]">
                  {subscribers.length}
                </span>
              </button>

              <button
                onClick={() => setActiveTab('members')}
                className={`flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-xs font-bold transition text-left shrink-0 md:shrink ${
                  activeTab === 'members'
                    ? 'bg-[#0d3b66] text-white shadow-sm'
                    : 'text-slate-700 hover:bg-slate-200'
                }`}
              >
                <Users className="w-4 h-4" />
                <span>কমিটি ও সদস্য তালিকা</span>
                <span className="ml-auto bg-amber-400 text-slate-950 px-1.5 py-0.2 rounded-full text-[10px]">
                  {members.length}
                </span>
              </button>

              <button
                onClick={() => setActiveTab('notices')}
                className={`flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-xs font-bold transition text-left shrink-0 md:shrink ${
                  activeTab === 'notices'
                    ? 'bg-[#0d3b66] text-white shadow-sm'
                    : 'text-slate-700 hover:bg-slate-200'
                }`}
              >
                <Bell className="w-4 h-4" />
                <span>নোটিশ ও বিজ্ঞপ্তি</span>
                <span className="ml-auto bg-slate-300 text-slate-800 px-1.5 py-0.2 rounded-full text-[10px]">
                  {notices.length}
                </span>
              </button>

              <button
                onClick={() => setActiveTab('complaints')}
                className={`flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-xs font-bold transition text-left shrink-0 md:shrink ${
                  activeTab === 'complaints'
                    ? 'bg-[#0d3b66] text-white shadow-sm'
                    : 'text-slate-700 hover:bg-slate-200'
                }`}
              >
                <Inbox className="w-4 h-4" />
                <span>নাগরিক তথ্য ও অভিযোগ</span>
                <span className="ml-auto bg-rose-500 text-white px-1.5 py-0.2 rounded-full text-[10px]">
                  {complaints.length}
                </span>
              </button>

              <button
                onClick={() => setActiveTab('info')}
                className={`flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-xs font-bold transition text-left shrink-0 md:shrink ${
                  activeTab === 'info'
                    ? 'bg-[#0d3b66] text-white shadow-sm'
                    : 'text-slate-700 hover:bg-slate-200'
                }`}
              >
                <Building className="w-4 h-4" />
                <span>প্রেসক্লাব ও যোগাযোগ</span>
              </button>

              <button
                onClick={() => setActiveTab('images')}
                className={`flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-xs font-bold transition text-left shrink-0 md:shrink ${
                  activeTab === 'images'
                    ? 'bg-[#0d3b66] text-white shadow-sm'
                    : 'text-slate-700 hover:bg-slate-200'
                }`}
              >
                <ImageIcon className="w-4 h-4" />
                <span>ছবি ও ব্যানার পরিবর্তন</span>
              </button>

              <button
                onClick={() => setActiveTab('security')}
                className={`flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-xs font-bold transition text-left shrink-0 md:shrink ${
                  activeTab === 'security'
                    ? 'bg-[#0d3b66] text-white shadow-sm'
                    : 'text-slate-700 hover:bg-slate-200'
                }`}
              >
                <Key className="w-4 h-4" />
                <span>পিন ও নিরাপত্তা</span>
              </button>

              <button
                onClick={() => {
                  setIsAdminOpen(false);
                  setIsExportModalOpen(true);
                }}
                className="flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-xs font-bold transition text-left shrink-0 md:shrink bg-amber-100 hover:bg-amber-200 text-amber-950 border border-amber-300"
                title="সম্পূর্ণ ওয়েবসাইট জিপ বা ইন্ডেক্স ফাইল ডাউনলোড করুন"
              >
                <Download className="w-4 h-4 text-amber-800" />
                <span>ওয়ার্ডপ্রেস থিম জিপ ডাউনলোড</span>
              </button>

              <div className="mt-auto hidden md:block pt-4 border-t border-slate-200">
                <div className="p-3 bg-white rounded-xl border border-slate-200 text-[11px] text-slate-600 space-y-1">
                  <p className="font-bold text-slate-900">ডিজিটাল পার্টনার:</p>
                  <p className="text-amber-800 font-semibold">{clubInfo.sponsor}</p>
                </div>
              </div>
            </div>

            {/* Main Content Workspace */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-6 bg-white">
              
              {/* TAB 0: Press Club Main Dashboard */}
              {activeTab === 'dashboard' && (
                <div className="max-w-4xl space-y-6">
                  {/* Dashboard Header */}
                  <div className="bg-gradient-to-r from-[#0d3b66] to-[#001f3f] rounded-2xl p-5 text-white shadow-md relative overflow-hidden">
                    <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <div>
                        <div className="inline-flex items-center gap-2 bg-amber-500/20 text-amber-300 border border-amber-500/40 px-3 py-1 rounded-full text-xs font-bold mb-2">
                          <Sparkles className="w-3.5 h-3.5" />
                          <span>ডিজিটাল কন্ট্রোল প্যানেল ও অ্যাডমিন ওএস</span>
                        </div>
                        <h3 className="text-xl sm:text-2xl font-black font-serif tracking-tight">
                          {clubInfo.nameBangla}
                        </h3>
                        <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-xl">
                          প্রেসক্লাবের সদস্য রেজিস্ট্রেশন আবেদন, গুগল অ্যাডসেন্স ও বিজ্ঞাপন স্লট, নোটিশ বোর্ড এবং ওয়ার্ডপ্রেস ওয়েবসাইট একীভূত নিয়ন্ত্রণ কেন্দ্র।
                        </p>
                      </div>

                      <div className="flex flex-wrap items-center gap-2">
                        <button
                          onClick={() => {
                            setIsAdminOpen(false);
                            setIsExportModalOpen(true);
                          }}
                          className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-xl shadow-sm transition flex items-center gap-2"
                        >
                          <Download className="w-3.5 h-3.5" />
                          <span>ওয়ার্ডপ্রেস থিম জিপ</span>
                        </button>
                        <button
                          onClick={() => setActiveTab('applications')}
                          className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white font-bold text-xs rounded-xl border border-white/20 transition flex items-center gap-2"
                        >
                          <UserCheck className="w-3.5 h-3.5 text-blue-300" />
                          <span>আবেদনসমূহ ({pendingAppsCount})</span>
                        </button>
                      </div>
                    </div>

                    <div className="absolute right-0 bottom-0 translate-x-8 translate-y-8 w-48 h-48 bg-amber-500/10 rounded-full blur-2xl pointer-events-none" />
                  </div>

                  {/* Action Notification Banner */}
                  {appActionNotice && (
                    <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center gap-2 text-emerald-900 text-xs font-bold shadow-xs animate-fadeIn">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span>{appActionNotice}</span>
                    </div>
                  )}

                  {/* High-Level Operational Metrics */}
                  <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
                    <div
                      onClick={() => setActiveTab('applications')}
                      className="p-4 rounded-xl border border-blue-200 bg-blue-50/50 hover:bg-blue-50 transition cursor-pointer group shadow-2xs"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-bold text-blue-900">সদস্য রেজিস্ট্রেশন আবেদন</span>
                        <UserCheck className="w-4 h-4 text-blue-600 group-hover:scale-110 transition" />
                      </div>
                      <div className="flex items-baseline gap-2">
                        <span className="text-2xl font-black text-slate-900 font-mono">
                          {memberApplications.length}
                        </span>
                        {pendingAppsCount > 0 && (
                          <span className="text-[11px] font-bold text-amber-700 bg-amber-100 px-2 py-0.5 rounded-full animate-pulse">
                            {pendingAppsCount} টি নতুন
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-blue-800/80 mt-1 flex items-center gap-1 font-medium">
                        <span>আবেদন যাচাই ও অনুমোদন করুন</span>
                        <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition" />
                      </p>
                    </div>

                    <div
                      onClick={() => setActiveTab('ads')}
                      className="p-4 rounded-xl border border-emerald-200 bg-emerald-50/50 hover:bg-emerald-50 transition cursor-pointer group shadow-2xs"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-bold text-emerald-900">গুগল অ্যাডসেন্স ও বিজ্ঞাপন</span>
                        <Megaphone className="w-4 h-4 text-emerald-600 group-hover:scale-110 transition" />
                      </div>
                      <div className="flex items-baseline gap-2">
                        <span className="text-base font-bold text-slate-900">
                          {adConfig.enabled ? 'সক্রিয় (Active)' : 'বন্ধ (Disabled)'}
                        </span>
                        <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${adConfig.adsenseClientId ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'}`}>
                          {adConfig.adsenseClientId ? 'AdSense সংযুক্ত' : 'কাস্টম বিজ্ঞাপন'}
                        </span>
                      </div>
                      <p className="text-[11px] text-emerald-800/80 mt-1 flex items-center gap-1 font-medium">
                        <span>অ্যাড কোড ও স্লট কনফিগার করুন</span>
                        <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition" />
                      </p>
                    </div>

                    <div
                      onClick={() => setActiveTab('subscribers')}
                      className="p-4 rounded-xl border border-sky-200 bg-sky-50/50 hover:bg-sky-50 transition cursor-pointer group shadow-2xs"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-bold text-sky-900">নিউজলেটার গ্রাহক</span>
                        <Mail className="w-4 h-4 text-sky-600 group-hover:scale-110 transition" />
                      </div>
                      <div className="flex items-baseline gap-2">
                        <span className="text-2xl font-black text-slate-900 font-mono">
                          {subscribers.length}
                        </span>
                        <span className="text-[11px] text-slate-500">জন পাঠক ও শুভানুধ্যায়ী</span>
                      </div>
                      <p className="text-[11px] text-sky-800/80 mt-1 flex items-center gap-1 font-medium">
                        <span>ইমেইল তালিকা ও নোটিফিকেশন</span>
                        <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition" />
                      </p>
                    </div>

                    <div
                      onClick={() => setActiveTab('members')}
                      className="p-4 rounded-xl border border-amber-200 bg-amber-50/40 hover:bg-amber-50 transition cursor-pointer group shadow-2xs"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-bold text-amber-950">কমিটি ও সদস্য তালিকা</span>
                        <Users className="w-4 h-4 text-amber-600 group-hover:scale-110 transition" />
                      </div>
                      <div className="flex items-baseline gap-2">
                        <span className="text-2xl font-black text-slate-900 font-mono">
                          {members.length}
                        </span>
                        <span className="text-[11px] text-slate-500">জন সাংবাদিক সদস্য</span>
                      </div>
                      <p className="text-[11px] text-amber-900 mt-1 flex items-center gap-1 font-medium">
                        <span>সদস্য যোগ, সম্পাদনা বা পদবি পরিবর্তন</span>
                        <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition" />
                      </p>
                    </div>

                    <div
                      onClick={() => setActiveTab('notices')}
                      className="p-4 rounded-xl border border-purple-200 bg-purple-50/40 hover:bg-purple-50 transition cursor-pointer group shadow-2xs"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-bold text-purple-950">নোটিশ ও প্রেস বিজ্ঞপ্তি</span>
                        <Bell className="w-4 h-4 text-purple-600 group-hover:scale-110 transition" />
                      </div>
                      <div className="flex items-baseline gap-2">
                        <span className="text-2xl font-black text-slate-900 font-mono">
                          {notices.length}
                        </span>
                        <span className="text-[11px] text-slate-500">টি প্রকাশিত বিজ্ঞপ্তি</span>
                      </div>
                      <p className="text-[11px] text-purple-900 mt-1 flex items-center gap-1 font-medium">
                        <span>জরুরি প্রেস বিজ্ঞপ্তি প্রকাশ করুন</span>
                        <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition" />
                      </p>
                    </div>

                    <div
                      onClick={() => setActiveTab('complaints')}
                      className="p-4 rounded-xl border border-rose-200 bg-rose-50/40 hover:bg-rose-50 transition cursor-pointer group shadow-2xs"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-bold text-rose-950">নাগরিক তথ্য ও অভিযোগ</span>
                        <Inbox className="w-4 h-4 text-rose-600 group-hover:scale-110 transition" />
                      </div>
                      <div className="flex items-baseline gap-2">
                        <span className="text-2xl font-black text-slate-900 font-mono">
                          {complaints.length}
                        </span>
                        <span className="text-[11px] text-slate-500">টি দাখিলকৃত তথ্য</span>
                      </div>
                      <p className="text-[11px] text-rose-900 mt-1 flex items-center gap-1 font-medium">
                        <span>অনুসন্ধানী তথ্য পর্যবেক্ষণ করুন</span>
                        <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition" />
                      </p>
                    </div>
                  </div>

                  {/* WordPress Integration & Shortcodes Section */}
                  <div className="p-5 rounded-2xl border border-slate-200 bg-gradient-to-br from-slate-50 to-blue-50/30 space-y-4">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200 pb-3">
                      <div>
                        <h4 className="font-bold text-slate-900 flex items-center gap-2 text-base font-serif">
                          <Code className="w-4 h-4 text-blue-600" />
                          <span>ওয়ার্ডপ্রেস ড্যাশবোর্ড ও শর্টকোড নিয়ন্ত্রণ (/wp-admin)</span>
                        </h4>
                        <p className="text-xs text-slate-500 mt-0.5">
                          ওয়ার্ডপ্রেস অ্যাডমিন প্যানেলে এই থিমটি সরাসরি "প্রেসক্লাব ড্যাশবোর্ড" মেনু তৈরি করে। যেকোনো পোস্ট বা পেজে নিচের শর্টকোডগুলো বসাতে পারেন:
                        </p>
                      </div>
                      <button
                        onClick={() => {
                          setIsAdminOpen(false);
                          setIsExportModalOpen(true);
                        }}
                        className="px-3 py-1.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-lg shadow-xs flex items-center gap-1.5 shrink-0 self-start sm:self-auto"
                      >
                        <Download className="w-3.5 h-3.5" />
                        <span>১-ক্লিকে ওয়ার্ডপ্রেস থিম নামান</span>
                      </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                      <div className="p-3 bg-white rounded-xl border border-slate-200 shadow-2xs space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-blue-900">মেম্বার রেজিস্ট্রেশন শর্টকোড</span>
                          <button
                            onClick={() => handleCopyShortcode('[pressclub_member_registration]')}
                            className="text-[11px] text-blue-700 hover:text-blue-900 flex items-center gap-1 px-2 py-0.5 rounded bg-blue-50 hover:bg-blue-100 font-mono transition"
                          >
                            {copiedCode === '[pressclub_member_registration]' ? (
                              <>
                                <Check className="w-3 h-3 text-emerald-600" />
                                <span className="text-emerald-700 font-bold">কপি হয়েছে</span>
                              </>
                            ) : (
                              <>
                                <Copy className="w-3 h-3" />
                                <span>কপি</span>
                              </>
                            )}
                          </button>
                        </div>
                        <code className="block p-2 bg-slate-100 rounded text-xs text-slate-800 font-mono select-all">
                          [pressclub_member_registration]
                        </code>
                        <p className="text-[11px] text-slate-500">
                          যেকোনো ওয়ার্ডপ্রেস পেজে অনলাইন সদস্য আবেদন ফর্ম প্রদর্শন করে।
                        </p>
                      </div>

                      <div className="p-3 bg-white rounded-xl border border-slate-200 shadow-2xs space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-emerald-900">নিউজলেটার শর্টকোড</span>
                          <button
                            onClick={() => handleCopyShortcode('[pressclub_newsletter]')}
                            className="text-[11px] text-emerald-700 hover:text-emerald-900 flex items-center gap-1 px-2 py-0.5 rounded bg-emerald-50 hover:bg-emerald-100 font-mono transition"
                          >
                            {copiedCode === '[pressclub_newsletter]' ? (
                              <>
                                <Check className="w-3 h-3 text-emerald-600" />
                                <span className="text-emerald-700 font-bold">কপি হয়েছে</span>
                              </>
                            ) : (
                              <>
                                <Copy className="w-3 h-3" />
                                <span>কপি</span>
                              </>
                            )}
                          </button>
                        </div>
                        <code className="block p-2 bg-slate-100 rounded text-xs text-slate-800 font-mono select-all">
                          [pressclub_newsletter]
                        </code>
                        <p className="text-[11px] text-slate-500">
                          ইমেইল ও ফোন নম্বর সংগ্রহের নিউজলেটার বক্স বসায়।
                        </p>
                      </div>

                      <div className="p-3 bg-white rounded-xl border border-slate-200 shadow-2xs space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-amber-950">গুগল অ্যাডসেন্স শর্টকোড</span>
                          <button
                            onClick={() => handleCopyShortcode('[pressclub_adsense]')}
                            className="text-[11px] text-amber-800 hover:text-amber-950 flex items-center gap-1 px-2 py-0.5 rounded bg-amber-50 hover:bg-amber-100 font-mono transition"
                          >
                            {copiedCode === '[pressclub_adsense]' ? (
                              <>
                                <Check className="w-3 h-3 text-emerald-600" />
                                <span className="text-emerald-700 font-bold">কপি হয়েছে</span>
                              </>
                            ) : (
                              <>
                                <Copy className="w-3 h-3" />
                                <span>কপি</span>
                              </>
                            )}
                          </button>
                        </div>
                        <code className="block p-2 bg-slate-100 rounded text-xs text-slate-800 font-mono select-all">
                          [pressclub_adsense]
                        </code>
                        <p className="text-[11px] text-slate-500">
                          পোস্ট বা আর্টিকেলের ভেতর স্বয়ংক্রিয় বিজ্ঞাপন ব্যানার ইনজেক্ট করে।
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* System Version & Cloud Database Auto-Sync Status Card */}
                  <div className="p-4 sm:p-5 rounded-2xl border border-blue-200 bg-gradient-to-r from-blue-50/70 via-indigo-50/50 to-amber-50/40 space-y-3">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-blue-200/60 pb-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-[#0d3b66] text-white flex items-center justify-center font-bold shadow-xs">
                          <Globe className="w-5 h-5 text-amber-400" />
                        </div>
                        <div>
                          <h4 className="font-bold text-slate-900 text-sm sm:text-base flex items-center gap-2">
                            <span>ক্লাউড ডাটাবেজ সয়ংক্রিয় সংরক্ষণ ও সিস্টেম স্ট্যাটাস</span>
                            <span className="text-[11px] font-mono px-2 py-0.5 rounded-full bg-blue-100 text-blue-900 font-bold border border-blue-300">
                              ভার্সন ২.০ (v{appVersion})
                            </span>
                          </h4>
                          <p className="text-xs text-slate-600 mt-0.5">
                            তথ্য বা নোটিশ পরিবর্তনের সাথে সাথে ব্যাকগ্রাউন্ডে ক্লাউড ফায়ারস্টোর ডাটাবেজে স্বয়ংক্রিয়ভাবে সংরক্ষিত হচ্ছে।
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        <button
                          type="button"
                          onClick={() => {
                            syncToFirestore();
                          }}
                          disabled={cloudSyncStatus === 'syncing'}
                          className="px-3.5 py-2 rounded-xl bg-[#0d3b66] hover:bg-slate-800 text-white font-bold text-xs shadow-xs transition flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                        >
                          <RefreshCw className={`w-3.5 h-3.5 text-amber-400 ${cloudSyncStatus === 'syncing' ? 'animate-spin' : ''}`} />
                          <span>{cloudSyncStatus === 'syncing' ? 'সিঙ্ক হচ্ছে...' : 'এখনই ক্লাউড সিঙ্ক করুন'}</span>
                        </button>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                      <div className="p-2.5 rounded-xl bg-white border border-slate-200">
                        <span className="text-slate-500 block text-[11px]">ক্লাউড ডাটাবেজ অবস্থা:</span>
                        <span className="font-bold text-emerald-700 flex items-center gap-1 mt-0.5">
                          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                          <span>স্বয়ংক্রিয় সংরক্ষণ সক্রিয়</span>
                        </span>
                      </div>
                      <div className="p-2.5 rounded-xl bg-white border border-slate-200">
                        <span className="text-slate-500 block text-[11px]">ওয়ার্ডপ্রেস থিম সাইজ:</span>
                        <span className="font-bold text-blue-900 mt-0.5 block font-mono">
                          ~{themeSizeMb} মেগাবাইট (19 MB)
                        </span>
                      </div>
                      <div className="p-2.5 rounded-xl bg-white border border-slate-200">
                        <span className="text-slate-500 block text-[11px]">ফুল ওয়েবসাইট জিপ সাইজ:</span>
                        <span className="font-bold text-amber-900 mt-0.5 block font-mono">
                          ~২১ মেগাবাইট (21 MB)
                        </span>
                      </div>
                      <div className="p-2.5 rounded-xl bg-white border border-slate-200">
                        <span className="text-slate-500 block text-[11px]">সর্বশেষ ক্লাউড সিঙ্ক:</span>
                        <span className="font-semibold text-slate-800 mt-0.5 block font-mono">
                          {lastCloudSyncedAt || 'এইমাত্র'}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Quick Action Buttons */}
                  <div className="p-4 rounded-xl border border-slate-200 bg-white">
                    <h5 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">
                      দ্রুত সম্পাদনা ও সরাসরি শর্টকাট
                    </h5>
                    <div className="flex flex-wrap gap-2">
                      <button
                        onClick={() => setActiveTab('applications')}
                        className="px-3 py-2 bg-blue-50 hover:bg-blue-100 text-blue-900 rounded-lg text-xs font-bold transition flex items-center gap-1.5"
                      >
                        <UserCheck className="w-3.5 h-3.5 text-blue-600" />
                        <span>সদস্য আবেদন যাচাই করুন</span>
                      </button>
                      <button
                        onClick={() => setActiveTab('ads')}
                        className="px-3 py-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-900 rounded-lg text-xs font-bold transition flex items-center gap-1.5"
                      >
                        <Megaphone className="w-3.5 h-3.5 text-emerald-600" />
                        <span>গুগল অ্যাডসেন্স কোড সেট করুন</span>
                      </button>
                      <button
                        onClick={() => {
                          setActiveTab('members');
                          setIsAddMemberOpen(true);
                        }}
                        className="px-3 py-2 bg-amber-50 hover:bg-amber-100 text-amber-950 rounded-lg text-xs font-bold transition flex items-center gap-1.5"
                      >
                        <Plus className="w-3.5 h-3.5 text-amber-700" />
                        <span>নতুন সদস্য যোগ করুন</span>
                      </button>
                      <button
                        onClick={() => {
                          setActiveTab('notices');
                          setIsAddNoticeOpen(true);
                        }}
                        className="px-3 py-2 bg-purple-50 hover:bg-purple-100 text-purple-950 rounded-lg text-xs font-bold transition flex items-center gap-1.5"
                      >
                        <Bell className="w-3.5 h-3.5 text-purple-700" />
                        <span>নতুন নোটিশ জারি করুন</span>
                      </button>
                      <button
                        onClick={() => setActiveTab('subscribers')}
                        className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-lg text-xs font-bold transition flex items-center gap-1.5"
                      >
                        <Mail className="w-3.5 h-3.5 text-slate-600" />
                        <span>নিউজলেটার গ্রাহক এক্সপোর্ট</span>
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB: News Ticker Management */}
              {activeTab === 'ticker' && (
                <div className="max-w-3xl space-y-6">
                  <div className="border-b border-slate-200 pb-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div>
                      <h4 className="text-lg font-bold text-[#0d3b66] font-serif flex items-center gap-2">
                        <Radio className="w-5 h-5 text-amber-500" />
                        <span>ব্রেকিং নিউজ টিকার ব্যবস্থাপনা ও আপডেট</span>
                      </h4>
                      <p className="text-xs text-slate-500 mt-0.5">
                        ওয়েবসাইটের শীর্ষ ব্রেকিং নিউজ হেডলাইন যোগ, সম্পাদনা ও পরিবর্তন করুন।
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => {
                          resetTickerItems();
                          setTickerSuccessMsg('টিকার সংবাদ ডিফল্ট অবস্থায় রিস্টোর করা হয়েছে!');
                          setTimeout(() => setTickerSuccessMsg(null), 3000);
                        }}
                        className="px-3 py-1.5 text-xs text-slate-600 hover:text-slate-900 border border-slate-300 rounded-xl hover:bg-slate-50 transition flex items-center gap-1 cursor-pointer"
                      >
                        <RefreshCw className="w-3.5 h-3.5" />
                        <span>রিসেট</span>
                      </button>
                    </div>
                  </div>

                  {tickerSuccessMsg && (
                    <div className="p-3 bg-emerald-50 border border-emerald-300 rounded-xl text-xs font-semibold text-emerald-800 flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      <span>{tickerSuccessMsg}</span>
                    </div>
                  )}

                  {/* Add New Ticker Item Box */}
                  <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200 space-y-3">
                    <h5 className="font-bold text-xs sm:text-sm text-slate-900 flex items-center gap-1.5">
                      <Plus className="w-4 h-4 text-amber-600" />
                      <span>নতুন টিকার হেডলাইন যোগ করুন:</span>
                    </h5>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={newTickerText}
                        onChange={(e) => setNewTickerText(e.target.value)}
                        placeholder="যেমন: উল্লাপাড়া প্রেসক্লাবের নতুন সদস্য অন্তর্ভুক্তি ফরম জমা শুরু হয়েছে..."
                        className="flex-1 text-xs sm:text-sm px-3.5 py-2 bg-white border border-amber-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:outline-none"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          if (newTickerText.trim()) {
                            addTickerItem(newTickerText.trim());
                            setNewTickerText('');
                            setTickerSuccessMsg('নতুন টিকার সংবাদ সফলভাবে যুক্ত করা হয়েছে!');
                            setTimeout(() => setTickerSuccessMsg(null), 3000);
                          }
                        }}
                        className="px-4 py-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-xs rounded-xl shadow-xs transition flex items-center gap-1.5 shrink-0 cursor-pointer"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>যোগ করুন</span>
                      </button>
                    </div>
                  </div>

                  {/* Current Ticker Items List */}
                  <div className="space-y-3">
                    <h5 className="font-bold text-xs uppercase tracking-wider text-slate-500">
                      বর্তমান সক্রিয় টিকার সংবাদসমূহ ({tickerItems.length})
                    </h5>

                    <div className="divide-y divide-slate-100 border border-slate-200 rounded-2xl overflow-hidden bg-white shadow-xs">
                      {tickerItems.map((item, idx) => (
                        <div key={idx} className="p-3.5 flex items-center justify-between gap-3 hover:bg-slate-50/80 transition">
                          {editingTickerIdx === idx ? (
                            <div className="flex-1 flex items-center gap-2">
                              <input
                                type="text"
                                value={editingTickerText}
                                onChange={(e) => setEditingTickerText(e.target.value)}
                                className="flex-1 text-xs px-3 py-1.5 border border-blue-400 rounded-lg focus:outline-none"
                              />
                              <button
                                type="button"
                                onClick={() => {
                                  if (editingTickerText.trim()) {
                                    updateTickerItem(idx, editingTickerText.trim());
                                    setEditingTickerIdx(null);
                                    setTickerSuccessMsg('টিকার সংবাদ আপডেট সফল হয়েছে!');
                                    setTimeout(() => setTickerSuccessMsg(null), 2500);
                                  }
                                }}
                                className="px-3 py-1 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-lg shadow-xs cursor-pointer"
                              >
                                সংরক্ষণ
                              </button>
                              <button
                                type="button"
                                onClick={() => setEditingTickerIdx(null)}
                                className="px-2.5 py-1 text-slate-600 hover:bg-slate-200 text-xs rounded-lg cursor-pointer"
                              >
                                বাতিল
                              </button>
                            </div>
                          ) : (
                            <>
                              <div className="flex items-start gap-2.5 flex-1 min-w-0">
                                <span className="w-5 h-5 rounded-full bg-slate-100 text-slate-700 text-[10px] font-bold flex items-center justify-center shrink-0 mt-0.5">
                                  {idx + 1}
                                </span>
                                <p className="text-xs sm:text-sm text-slate-800 leading-relaxed font-medium">
                                  {item}
                                </p>
                              </div>

                              <div className="flex items-center gap-1 shrink-0">
                                <button
                                  type="button"
                                  onClick={() => {
                                    setEditingTickerIdx(idx);
                                    setEditingTickerText(item);
                                  }}
                                  className="p-1.5 text-blue-700 hover:bg-blue-50 rounded-lg transition cursor-pointer"
                                  title="সম্পাদনা"
                                >
                                  <Edit className="w-4 h-4" />
                                </button>
                                <button
                                  type="button"
                                  onClick={() => {
                                    if (confirm('আপনি কি এই টিকার আইটেমটি মুছে ফেলতে চান?')) {
                                      deleteTickerItem(idx);
                                    }
                                  }}
                                  className="p-1.5 text-rose-600 hover:bg-rose-50 rounded-lg transition cursor-pointer"
                                  title="মুছুন"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </div>
                            </>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* TAB: Member Registration Applications */}
              {activeTab === 'applications' && (
                <div className="space-y-6">
                  <div className="border-b border-slate-200 pb-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div>
                      <h4 className="text-lg font-bold text-[#0d3b66] font-serif flex items-center gap-2">
                        <UserCheck className="w-5 h-5 text-blue-600" />
                        <span>অনলাইন সদস্য রেজিস্ট্রেশন আবেদনসমূহ</span>
                      </h4>
                      <p className="text-xs text-slate-500">
                        ওয়েবসাইটের মেম্বারশিপ ফর্ম থেকে সাংবাদিকদের দাখিলকৃত আবেদন পর্যালোচনা ও ১-ক্লিকে অনুমোদন।
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setIsRecruitmentModalOpen(true)}
                        className="px-3.5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5 shadow-xs"
                      >
                        <UserPlus className="w-3.5 h-3.5" />
                        <span>আবেদন ফর্ম খুলুন</span>
                      </button>
                    </div>
                  </div>

                  {/* Action Notification Banner */}
                  {appActionNotice && (
                    <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center gap-2 text-emerald-900 text-xs font-bold shadow-xs animate-fadeIn">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span>{appActionNotice}</span>
                    </div>
                  )}

                  {/* Search and Filter bar */}
                  <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
                    <div className="relative w-full sm:w-72">
                      <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        placeholder="নাম, মিডিয়া বা ফোন দিয়ে খুঁজুন..."
                        value={appSearch}
                        onChange={(e) => setAppSearch(e.target.value)}
                        className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-blue-500 focus:outline-none"
                      />
                    </div>

                    <div className="flex items-center gap-1.5 self-start sm:self-auto overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
                      <button
                        onClick={() => setAppFilter('all')}
                        className={`px-3 py-1.5 rounded-lg text-xs font-bold transition shrink-0 ${
                          appFilter === 'all'
                            ? 'bg-[#0d3b66] text-white'
                            : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                        }`}
                      >
                        সকল ({memberApplications.length})
                      </button>
                      <button
                        onClick={() => setAppFilter('pending')}
                        className={`px-3 py-1.5 rounded-lg text-xs font-bold transition shrink-0 ${
                          appFilter === 'pending'
                            ? 'bg-amber-500 text-slate-950'
                            : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                        }`}
                      >
                        অপেক্ষমাণ ({pendingAppsCount})
                      </button>
                      <button
                        onClick={() => setAppFilter('approved')}
                        className={`px-3 py-1.5 rounded-lg text-xs font-bold transition shrink-0 ${
                          appFilter === 'approved'
                            ? 'bg-emerald-600 text-white'
                            : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                        }`}
                      >
                        অনুমোদিত ({memberApplications.filter(a => a.status === 'approved').length})
                      </button>
                      <button
                        onClick={() => setAppFilter('rejected')}
                        className={`px-3 py-1.5 rounded-lg text-xs font-bold transition shrink-0 ${
                          appFilter === 'rejected'
                            ? 'bg-rose-600 text-white'
                            : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                        }`}
                      >
                        বাতিলকৃত ({memberApplications.filter(a => a.status === 'rejected').length})
                      </button>
                    </div>
                  </div>

                  {/* Applications List */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {memberApplications
                      .filter(app => {
                        if (appFilter !== 'all' && app.status !== appFilter) return false;
                        if (!appSearch) return true;
                        const q = appSearch.toLowerCase();
                        const appName = (app.fullName || (app as any).name || '').toLowerCase();
                        const appMedia = (app.mediaName || (app as any).media || '').toLowerCase();
                        return (
                          appName.includes(q) ||
                          appMedia.includes(q) ||
                          app.phone.includes(q) ||
                          app.email.toLowerCase().includes(q)
                        );
                      })
                      .map((app) => {
                        const displayName = app.fullName || (app as any).name || 'আবেদনকারী';
                        const displayMedia = app.mediaName || (app as any).media || 'গণমাধ্যম';
                        return (
                          <div
                            key={app.id}
                            className="p-4 rounded-xl border border-slate-200 bg-white hover:border-blue-300 transition shadow-xs flex flex-col justify-between gap-3 relative"
                          >
                            <div className="space-y-2">
                              <div className="flex items-center justify-between gap-2">
                                <span
                                  className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                                    app.status === 'pending'
                                      ? 'bg-amber-100 text-amber-900 border border-amber-300'
                                      : app.status === 'approved'
                                      ? 'bg-emerald-100 text-emerald-900 border border-emerald-300'
                                      : 'bg-rose-100 text-rose-900 border border-rose-300'
                                  }`}
                                >
                                  {app.status === 'pending'
                                    ? '⏳ অপেক্ষমাণ পর্যালোচনা'
                                    : app.status === 'approved'
                                    ? '✓ অনুমোদিত সদস্য'
                                    : '✕ বাতিলকৃত'}
                                </span>
                                <span className="text-[11px] text-slate-400 font-mono">
                                  আবেদন: {app.appliedAt}
                                </span>
                              </div>

                              <div>
                                <h5 className="font-bold text-sm text-slate-900 font-serif">
                                  {displayName}
                                </h5>
                                <p className="text-xs font-semibold text-blue-800">
                                  {app.designation}, <span className="text-slate-700">{displayMedia}</span>
                                </p>
                              </div>

                              <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-600 bg-slate-50 p-2.5 rounded-lg">
                                <p className="flex items-center gap-1 truncate">
                                  <Phone className="w-3 h-3 text-slate-400 shrink-0" />
                                  <a href={`tel:${app.phone}`} className="hover:underline font-mono">
                                    {app.phone}
                                  </a>
                                </p>
                                <p className="flex items-center gap-1 truncate">
                                  <Mail className="w-3 h-3 text-slate-400 shrink-0" />
                                  <a href={`mailto:${app.email}`} className="hover:underline truncate">
                                    {app.email}
                                  </a>
                                </p>
                                <p className="truncate">
                                  অভিজ্ঞতা: <span className="font-medium text-slate-900">{app.experienceYears}</span>
                                </p>
                                <p className="truncate">
                                  মাধ্যম: <span className="font-medium text-slate-900">{app.mediaType}</span>
                                </p>
                              </div>

                              {app.reportsSummary && (
                                <p className="text-xs text-slate-600 line-clamp-2 italic bg-amber-50/50 p-2 rounded border border-amber-100/60">
                                  "{app.reportsSummary}"
                                </p>
                              )}
                            </div>

                            <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-xs">
                              <button
                                onClick={() => setSelectedAppDetail(app)}
                                className="text-blue-700 hover:text-blue-900 font-bold flex items-center gap-1 py-1 px-2 rounded hover:bg-blue-50 cursor-pointer"
                              >
                                <Eye className="w-3.5 h-3.5" />
                                <span>বিস্তারিত আবেদনপত্র</span>
                              </button>

                              <div className="flex items-center gap-1.5">
                                {app.status === 'pending' && (
                                  <>
                                    <button
                                      onClick={() => handleApproveApplication(app.id)}
                                      className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold transition flex items-center gap-1 shadow-2xs cursor-pointer"
                                      title="অনুমোদন করুন ও সদস্য তালিকায় অন্তর্ভুক্ত করুন"
                                    >
                                      <Check className="w-3 h-3" />
                                      <span>অনুমোদন</span>
                                    </button>
                                    <button
                                      onClick={() => handleRejectApplication(app.id)}
                                      className="px-2 py-1 bg-rose-50 hover:bg-rose-100 text-rose-700 rounded-lg text-xs font-bold transition cursor-pointer"
                                      title="আবেদন বাতিল করুন"
                                    >
                                      বাতিল
                                    </button>
                                  </>
                                )}

                                <button
                                  onClick={() => {
                                    if (confirm(`আপনি কি "${displayName}" এর আবেদনটি স্থায়ীভাবে মুছে ফেলতে চান?`)) {
                                      deleteMemberApplication(app.id);
                                    }
                                  }}
                                  className="text-slate-400 hover:text-rose-600 p-1 rounded hover:bg-rose-50 transition cursor-pointer"
                                  title="মুছে ফেলুন"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                  </div>

                  {memberApplications.length === 0 && (
                    <div className="p-8 text-center bg-slate-50 rounded-2xl border border-dashed border-slate-200">
                      <UserCheck className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                      <p className="text-xs text-slate-500">এখনো কোনো সদস্যপদের আবেদন জমা হয়নি।</p>
                    </div>
                  )}

                  {/* Detail Application Modal */}
                  {selectedAppDetail && (
                    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
                      <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
                        <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                          <div>
                            <span className="text-[10px] font-bold uppercase tracking-wider text-blue-800">
                              আবেদনকারী ডসিয়ার (ID: {selectedAppDetail.id})
                            </span>
                            <h3 className="text-lg font-bold text-slate-900 font-serif">
                              {selectedAppDetail.fullName || (selectedAppDetail as any).name || 'আবেদনকারী'}
                            </h3>
                          </div>
                          <button
                            onClick={() => setSelectedAppDetail(null)}
                            className="p-1 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100 cursor-pointer"
                          >
                            <X className="w-5 h-5" />
                          </button>
                        </div>

                        <div className="space-y-3 text-xs">
                          {/* Photo and Verification Status Header */}
                          <div className="flex items-center gap-3.5 p-3 rounded-xl bg-slate-50 border border-slate-200">
                            <div className="relative shrink-0">
                              <img
                                src={selectedAppDetail.photoUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80'}
                                alt="আবেদনকারী ছবি"
                                className="w-16 h-16 rounded-xl object-cover border-2 border-amber-400 bg-white"
                              />
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 flex-wrap">
                                {selectedAppDetail.isOtpVerified ? (
                                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
                                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                                    <span>ওটিপি (OTP) ভেরিফায়েড</span>
                                  </span>
                                ) : (
                                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-100 text-amber-800 border border-amber-300">
                                    <AlertCircle className="w-3.5 h-3.5 text-amber-600" />
                                    <span>ওটিপি যাচাই অপেক্ষমান</span>
                                  </span>
                                )}

                                {selectedAppDetail.facebookUrl && (
                                  <a
                                    href={selectedAppDetail.facebookUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-blue-100 text-blue-700 hover:bg-blue-200 transition"
                                  >
                                    <span>ফেসবুক প্রোফাইল</span>
                                    <ExternalLink className="w-3 h-3" />
                                  </a>
                                )}
                              </div>
                              <p className="text-[11px] text-slate-500 mt-1">
                                {selectedAppDetail.photoUrl ? 'আবেদনকারী সরাসরি ছবি বা ফেসবুক সিঙ্ক সংযুক্ত করেছেন।' : 'ডিফল্ট অবতার সংরক্ষিত রয়েছে।'}
                              </p>
                            </div>
                          </div>

                          <div className="grid grid-cols-2 gap-3 bg-slate-50 p-3 rounded-xl">
                            <div>
                              <p className="text-slate-500 text-[11px]">পিতার নাম:</p>
                              <p className="font-bold text-slate-900">{selectedAppDetail.fatherName || 'উল্লেখ নেই'}</p>
                            </div>
                            <div>
                              <p className="text-slate-500 text-[11px]">জন্ম তারিখ:</p>
                              <p className="font-bold text-slate-900">{selectedAppDetail.dob || (selectedAppDetail as any).dateOfBirth || 'উল্লেখ নেই'}</p>
                            </div>
                            <div>
                              <p className="text-slate-500 text-[11px]">জাতীয় পরিচয়পত্র (NID):</p>
                              <p className="font-bold text-slate-900 font-mono">{selectedAppDetail.nid || (selectedAppDetail as any).nidNumber || 'উল্লেখ নেই'}</p>
                            </div>
                            <div>
                              <p className="text-slate-500 text-[11px]">শিক্ষাগত যোগ্যতা:</p>
                              <p className="font-bold text-slate-900">{selectedAppDetail.education || 'উল্লেখ নেই'}</p>
                            </div>
                          </div>

                          <div className="p-3 bg-blue-50/50 rounded-xl space-y-2 border border-blue-100">
                            <h5 className="font-bold text-blue-950 text-xs">মিডিয়া ও পেশাগত তথ্য</h5>
                            <div className="grid grid-cols-2 gap-2">
                              <div>
                                <p className="text-slate-500 text-[11px]">কর্মরত মিডিয়া:</p>
                                <p className="font-bold text-slate-900">{selectedAppDetail.mediaName || (selectedAppDetail as any).media || 'গণমাধ্যম'}</p>
                              </div>
                              <div>
                                <p className="text-slate-500 text-[11px]">বর্তমান পদবি:</p>
                                <p className="font-bold text-slate-900">{selectedAppDetail.designation}</p>
                              </div>
                              <div>
                                <p className="text-slate-500 text-[11px]">মিডিয়ার ধরন:</p>
                                <p className="font-bold text-slate-900">{selectedAppDetail.mediaType}</p>
                              </div>
                              <div>
                                <p className="text-slate-500 text-[11px]">সাংবাদিকতার অভিজ্ঞতা:</p>
                                <p className="font-bold text-slate-900">{selectedAppDetail.experienceYears}</p>
                              </div>
                            </div>
                          </div>

                          <div className="space-y-1">
                            <p className="text-slate-500 text-[11px]">যোগাযোগ ও ঠিকানা:</p>
                            <p className="text-slate-800 font-medium">
                              মোবাইল: <strong className="font-mono">{selectedAppDetail.phone}</strong> | ইমেইল: {selectedAppDetail.email}
                            </p>
                            <p className="text-slate-700">
                              বর্তমান ঠিকানা: {selectedAppDetail.presentAddress || 'উল্লাপাড়া'}
                            </p>
                            {selectedAppDetail.permanentAddress && (
                              <p className="text-slate-600 text-[11px]">
                                স্থায়ী ঠিকানা: {selectedAppDetail.permanentAddress}
                              </p>
                            )}
                          </div>

                          {selectedAppDetail.reportsSummary && (
                            <div className="p-3 bg-slate-100 rounded-xl space-y-1">
                              <p className="font-bold text-slate-700 text-[11px]">প্রকাশিত প্রতিবেদনের সংক্ষিপ্ত বিবরণ:</p>
                              <p className="text-slate-800 italic leading-relaxed">
                                {selectedAppDetail.reportsSummary}
                              </p>
                            </div>
                          )}
                        </div>

                        <div className="flex items-center justify-between pt-3 border-t border-slate-200">
                          <button
                            onClick={() => {
                              const delName = selectedAppDetail.fullName || (selectedAppDetail as any).name || 'আবেদন';
                              if (confirm(`আপনি কি "${delName}" এর আবেদন মুছে ফেলতে চান?`)) {
                                deleteMemberApplication(selectedAppDetail.id);
                                setSelectedAppDetail(null);
                              }
                            }}
                            className="text-rose-600 hover:text-rose-800 text-xs font-bold flex items-center gap-1 cursor-pointer"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                            <span>মুছে ফেলুন</span>
                          </button>

                          <div className="flex items-center gap-2">
                            {selectedAppDetail.status === 'pending' && (
                              <>
                                <button
                                  onClick={() => handleRejectApplication(selectedAppDetail.id)}
                                  className="px-3 py-1.5 border border-slate-300 text-slate-700 rounded-xl text-xs font-bold hover:bg-slate-100 cursor-pointer"
                                >
                                  আবেদন বাতিল
                                </button>
                                <button
                                  onClick={() => handleApproveApplication(selectedAppDetail.id)}
                                  className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-sm flex items-center gap-1.5 cursor-pointer"
                                >
                                  <Check className="w-3.5 h-3.5" />
                                  <span>অনুমোদন ও সদস্যভুক্তি</span>
                                </button>
                              </>
                            )}
                            {selectedAppDetail.status !== 'pending' && (
                              <button
                                onClick={() => setSelectedAppDetail(null)}
                                className="px-4 py-1.5 bg-slate-800 hover:bg-slate-900 text-white rounded-xl text-xs font-bold cursor-pointer"
                              >
                                বন্ধ করুন
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* TAB: AdSense & Commercial Advertising */}
              {activeTab === 'ads' && (
                <div className="max-w-3xl space-y-6">
                  <div className="border-b border-slate-200 pb-3 flex items-center justify-between">
                    <div>
                      <h4 className="text-lg font-bold text-[#0d3b66] font-serif flex items-center gap-2">
                        <Megaphone className="w-5 h-5 text-emerald-600" />
                        <span>বিজ্ঞাপন ও গুগল অ্যাডসেন্স (Google AdSense) কনফিগারেশন</span>
                      </h4>
                      <p className="text-xs text-slate-500">
                        ওয়েবসাইটের শীর্ষ ব্যানার, আর্টিকেল ইন-ফিড ও সাইডবারে বাণিজ্যিক বিজ্ঞাপন বা গুগল অ্যাড কোড প্রদর্শন করুন।
                      </p>
                    </div>

                    {adSavedSuccess && (
                      <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-700 bg-emerald-100 px-3 py-1 rounded-full animate-bounce">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        সংরক্ষিত হয়েছে!
                      </span>
                    )}
                  </div>

                  <form onSubmit={handleSaveAds} className="space-y-6">
                    {/* Master Switch */}
                    <div className="p-4 bg-emerald-50/60 border border-emerald-200 rounded-2xl flex items-center justify-between">
                      <div>
                        <h5 className="font-bold text-emerald-950 text-sm">বিজ্ঞাপন স্লট সক্রিয় রাখুন</h5>
                        <p className="text-xs text-emerald-800/80">
                          সক্রিয় থাকলে ওয়েবসাইটের হেডার ও কন্টেন্টে ব্যানার ও বিজ্ঞাপন প্রদর্শিত হবে।
                        </p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={adForm.enabled}
                          onChange={(e) => setAdForm({ ...adForm, enabled: e.target.checked })}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
                      </label>
                    </div>

                    {/* Google AdSense Section */}
                    <div className="p-5 border border-slate-200 rounded-2xl bg-white shadow-2xs space-y-4">
                      <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                        <div className="flex items-center gap-2">
                          <Globe className="w-4 h-4 text-blue-600" />
                          <h5 className="font-bold text-slate-900 text-sm">গুগল অ্যাডসেন্স সেটিংস (Google AdSense)</h5>
                        </div>
                        <span className="text-[11px] text-blue-700 bg-blue-50 px-2 py-0.5 rounded font-mono">
                          অ্যাডসেন্স ফ্রেন্ডলি আর্কিটেকচার
                        </span>
                      </div>

                      <div className="space-y-4">
                        <div>
                          <label className="block text-xs font-bold text-slate-700 mb-1">
                            অ্যাডসেন্স পাবলিশার ক্লায়েন্ট আইডি (Publisher Client ID)
                          </label>
                          <input
                            type="text"
                            placeholder="ca-pub-1234567890123456"
                            value={adForm.adsenseClientId || ''}
                            onChange={(e) => setAdForm({ ...adForm, adsenseClientId: e.target.value })}
                            className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-300 rounded-lg font-mono focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                          />
                          <p className="text-[11px] text-slate-400 mt-1">
                            আপনার গুগল অ্যাডসেন্স অ্যাকাউন্টের পাবলিশার আইডি (যেমন: ca-pub-xxxxxxxxxxxxxx)।
                          </p>
                        </div>

                        <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-200">
                          <div>
                            <span className="font-bold text-xs text-slate-800 block">অটো-অ্যাডস (Auto Ads) চালু রাখুন</span>
                            <span className="text-[11px] text-slate-500">
                              গুগল এআই স্বয়ংক্রিয়ভাবে ওয়েবসাইটের উপযুক্ত স্থানে বিজ্ঞাপন প্রদর্শন করবে।
                            </span>
                          </div>
                          <input
                            type="checkbox"
                            checked={!!adForm.adsenseAutoAds}
                            onChange={(e) => setAdForm({ ...adForm, adsenseAutoAds: e.target.checked })}
                            className="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500"
                          />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                          <div>
                            <label className="block text-xs font-bold text-slate-700 mb-1">
                              হেডার ব্যানার স্লট আইডি
                            </label>
                            <input
                              type="text"
                              placeholder="1234567890"
                              value={adForm.adsenseHeaderSlot || ''}
                              onChange={(e) => setAdForm({ ...adForm, adsenseHeaderSlot: e.target.value })}
                              className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-lg font-mono focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                            />
                            <p className="text-[10px] text-slate-400 mt-0.5">সাইজ: 728x90 Leaderboard</p>
                          </div>

                          <div>
                            <label className="block text-xs font-bold text-slate-700 mb-1">
                              ইন-ফিড ব্যানার স্লট আইডি
                            </label>
                            <input
                              type="text"
                              placeholder="2345678901"
                              value={adForm.adsenseInfeedSlot || ''}
                              onChange={(e) => setAdForm({ ...adForm, adsenseInfeedSlot: e.target.value })}
                              className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-lg font-mono focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                            />
                            <p className="text-[10px] text-slate-400 mt-0.5">নিউজ বা কন্টেন্টের মাঝে</p>
                          </div>

                          <div>
                            <label className="block text-xs font-bold text-slate-700 mb-1">
                              সাইডবার স্লট আইডি
                            </label>
                            <input
                              type="text"
                              placeholder="3456789012"
                              value={adForm.adsenseSidebarSlot || ''}
                              onChange={(e) => setAdForm({ ...adForm, adsenseSidebarSlot: e.target.value })}
                              className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-lg font-mono focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                            />
                            <p className="text-[10px] text-slate-400 mt-0.5">সাইজ: 300x250 Medium Rect</p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Commercial Advertising Booking Hotline */}
                    <div className="p-5 border border-slate-200 rounded-2xl bg-white shadow-2xs space-y-4">
                      <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                        <div className="flex items-center gap-2">
                          <Phone className="w-4 h-4 text-amber-600" />
                          <h5 className="font-bold text-slate-900 text-sm">বাণিজ্যিক বিজ্ঞাপন ও স্পন্সরশিপ বুকিং তথ্য</h5>
                        </div>
                        <span className="text-[11px] text-slate-500">বিজ্ঞাপন না থাকলে বুকিং নম্বর দেখাবে</span>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                        <div>
                          <label className="block text-xs font-bold text-slate-700 mb-1">
                            বিজ্ঞাপন সেলস মোবাইল *
                          </label>
                          <input
                            type="text"
                            value={adForm.bannerPhone}
                            onChange={(e) => setAdForm({ ...adForm, bannerPhone: e.target.value })}
                            className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-slate-700 mb-1">
                            বিজ্ঞাপন সেলস ইমেইল *
                          </label>
                          <input
                            type="email"
                            value={adForm.bannerEmail}
                            onChange={(e) => setAdForm({ ...adForm, bannerEmail: e.target.value })}
                            className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-slate-700 mb-1">
                            দায়িত্বপ্রাপ্ত কর্মকর্তা / বিভাগ
                          </label>
                          <input
                            type="text"
                            value={adForm.contactPerson || ''}
                            onChange={(e) => setAdForm({ ...adForm, contactPerson: e.target.value })}
                            className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Custom HTML / 3rd Party Ads */}
                    <div className="p-5 border border-slate-200 rounded-2xl bg-white shadow-2xs space-y-4">
                      <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                        <div className="flex items-center gap-2">
                          <Code className="w-4 h-4 text-purple-600" />
                          <h5 className="font-bold text-slate-900 text-sm">কাস্টম বিজ্ঞাপন স্ক্রিপ্ট বা এইচটিএমএল (ঐচ্ছিক)</h5>
                        </div>
                        <span className="text-[11px] text-slate-400">লোকাল ব্যানার ইমেজ বা থার্ড-পার্টি অ্যাড নেটওয়ার্ক</span>
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">
                          হেডার ব্যানার কাস্টম কোড (HTML/Script)
                        </label>
                        <textarea
                          rows={3}
                          placeholder='<a href="https://..." target="_blank"><img src="..." alt="বিজ্ঞাপন" /></a>'
                          value={adForm.customHeaderHtml || ''}
                          onChange={(e) => setAdForm({ ...adForm, customHeaderHtml: e.target.value })}
                          className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-lg font-mono focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                        />
                      </div>
                    </div>

                    {/* Save Buttons */}
                    <div className="flex items-center gap-3 pt-2">
                      <button
                        type="submit"
                        className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-md transition flex items-center gap-2"
                      >
                        <Save className="w-4 h-4" />
                        <span>বিজ্ঞাপন সেটিংস সংরক্ষণ করুন</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          if (confirm('আপনি কি বিজ্ঞাপন সেটিংস ডিফল্ট মানে রিসেট করতে চান?')) {
                            resetAdConfig();
                            setAdForm({
                              enabled: true,
                              adsenseClientId: '',
                              adsenseAutoAds: false,
                              adsenseHeaderSlot: '',
                              adsenseInfeedSlot: '',
                              adsenseSidebarSlot: '',
                              customHeaderHtml: '',
                              customInfeedHtml: '',
                              customSidebarHtml: '',
                              bannerPhone: '০১৭১২-৩৪৫৬৭৮',
                              bannerEmail: 'ads@ullaparapressclub.org',
                              contactPerson: 'বিজ্ঞাপন ও বাণিজ্যিক শাখা'
                            });
                          }
                        }}
                        className="px-4 py-2.5 text-slate-600 hover:text-slate-900 text-xs font-semibold rounded-xl hover:bg-slate-100 transition"
                      >
                        রিসেট করুন
                      </button>
                    </div>
                  </form>
                </div>
              )}

              {/* TAB 1: General Info & Contacts */}
              {activeTab === 'info' && (
                <div className="max-w-2xl space-y-6">
                  <div className="border-b border-slate-200 pb-3 flex items-center justify-between">
                    <div>
                      <h4 className="text-lg font-bold text-[#0d3b66] font-serif">প্রেসক্লাব পরিচিতি ও যোগাযোগের তথ্য</h4>
                      <p className="text-xs text-slate-500">
                        এখানে পরিবর্তিত তথ্য তাৎক্ষণিকভাবে ওয়েবসাইটের ব্যানার, হেডার, ফুটার ও যোগাযোগ অংশে আপডেট হবে।
                      </p>
                    </div>
                    {infoSavedSuccess && (
                      <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-700 bg-emerald-100 px-3 py-1 rounded-full animate-bounce">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        সংরক্ষিত হয়েছে!
                      </span>
                    )}
                  </div>

                  <form onSubmit={handleSaveInfo} className="space-y-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        প্রেসক্লাবের পূর্ণ নাম (বাংলা)
                      </label>
                      <input
                        type="text"
                        value={infoForm.nameBangla}
                        onChange={(e) => setInfoForm({ ...infoForm, nameBangla: e.target.value })}
                        className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        প্রেসক্লাবের পূর্ণ ঠিকানা *
                      </label>
                      <textarea
                        rows={2}
                        value={infoForm.address}
                        onChange={(e) => setInfoForm({ ...infoForm, address: e.target.value })}
                        className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:outline-none"
                        placeholder="যেমন: উল্লাপাড়া প্রেসক্লাব (থানা সংলগ্ন), উল্লাপাড়া-৬৭৬০, সিরাজগঞ্জ।"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">
                          হটলাইন / মোবাইল নম্বর
                        </label>
                        <input
                          type="text"
                          value={infoForm.phone}
                          onChange={(e) => setInfoForm({ ...infoForm, phone: e.target.value })}
                          placeholder="খালি রয়েছে — নম্বর লিখুন"
                          className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:outline-none"
                        />
                        <span className="text-[11px] text-slate-500 mt-0.5 block">
                          খালি রাখলে ওয়েবসাইটে "(ফোন নং সংযোজনযোগ্য)" দেখাবে
                        </span>
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">
                          অফিসিয়াল ইমেইল
                        </label>
                        <input
                          type="email"
                          value={infoForm.email}
                          onChange={(e) => setInfoForm({ ...infoForm, email: e.target.value })}
                          placeholder="খালি রয়েছে — ইমেইল লিখুন"
                          className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:outline-none"
                        />
                        <span className="text-[11px] text-slate-500 mt-0.5 block">
                          খালি রাখলে ওয়েবসাইটে "(ইমেইল সংযোজনযোগ্য)" দেখাবে
                        </span>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">
                          স্পনসর ও ডিজিটাল পার্টনার
                        </label>
                        <input
                          type="text"
                          value={infoForm.sponsor}
                          onChange={(e) => setInfoForm({ ...infoForm, sponsor: e.target.value })}
                          className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:outline-none font-semibold text-[#0d3b66]"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">
                          স্থাপিত সাল
                        </label>
                        <input
                          type="text"
                          value={infoForm.establishedYear}
                          onChange={(e) => setInfoForm({ ...infoForm, establishedYear: e.target.value })}
                          className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:outline-none"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        স্লোগান / মূল প্রতিপাদ্য
                      </label>
                      <input
                        type="text"
                        value={infoForm.tagline}
                        onChange={(e) => setInfoForm({ ...infoForm, tagline: e.target.value })}
                        className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        প্রেসক্লাব পরিচিতি সংক্ষেপ
                      </label>
                      <textarea
                        rows={3}
                        value={infoForm.aboutBrief}
                        onChange={(e) => setInfoForm({ ...infoForm, aboutBrief: e.target.value })}
                        className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:outline-none"
                      />
                    </div>

                    <div className="pt-4 flex items-center justify-between">
                      <button
                        type="button"
                        onClick={resetClubInfo}
                        className="text-xs text-rose-600 hover:underline flex items-center gap-1"
                      >
                        <RefreshCw className="w-3.5 h-3.5" />
                        ডিফল্ট তথ্যে ফিরে যান
                      </button>

                      <button
                        type="submit"
                        className="px-6 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-sm rounded-xl shadow-md flex items-center gap-2 transition"
                      >
                        <Save className="w-4 h-4" />
                        পরিবর্তনসমূহ সংরক্ষণ করুন
                      </button>
                    </div>
                  </form>
                </div>
              )}

              {/* TAB 2: Members Management */}
              {activeTab === 'members' && (
                <div className="space-y-6">
                  <div className="border-b border-slate-200 pb-3 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                    <div>
                      <h4 className="text-lg font-bold text-[#0d3b66] font-serif">কমিটি ও সদস্য তালিকা ব্যবস্থাপনা</h4>
                      <p className="text-xs text-slate-500">
                        সদস্যদের নাম, পদবী, সংবাদমাধ্যম, ফোন নম্বর যোগ, পরিবর্তন বা ডিলিট করুন।
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={resetMembers}
                        className="px-3 py-1.5 text-xs text-slate-600 hover:text-slate-900 border border-slate-300 rounded-lg hover:bg-slate-50 transition flex items-center gap-1"
                        title="ডিফল্ট সদস্যদের তালিকা পুনরুদ্ধার"
                      >
                        <RefreshCw className="w-3.5 h-3.5" />
                        রিসেট
                      </button>
                      <button
                        onClick={() => setIsAddMemberOpen(true)}
                        className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-xl shadow-sm flex items-center gap-1.5 transition"
                      >
                        <Plus className="w-4 h-4" />
                        নতুন সদস্য যোগ করুন
                      </button>
                    </div>
                  </div>

                  {/* Search Bar */}
                  <div className="relative max-w-md">
                    <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      value={memberSearch}
                      onChange={(e) => setMemberSearch(e.target.value)}
                      placeholder="নাম, পদবী বা মিডিয়া দিয়ে ফিল্টার করুন..."
                      className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-amber-500 focus:outline-none"
                    />
                  </div>

                  {/* Members Table */}
                  <div className="border border-slate-200 rounded-xl overflow-hidden shadow-xs">
                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-xs">
                        <thead className="bg-slate-100 text-slate-700 uppercase font-semibold border-b border-slate-200">
                          <tr>
                            <th className="p-3">ছবি ও নাম</th>
                            <th className="p-3">পদবী</th>
                            <th className="p-3">সংবাদমাধ্যম</th>
                            <th className="p-3">ফোন নম্বর</th>
                            <th className="p-3">ক্যাটাগরি</th>
                            <th className="p-3 text-right">পদক্ষেপ</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                          {members
                            .filter(m => 
                              m.name.toLowerCase().includes(memberSearch.toLowerCase()) ||
                              m.designation.toLowerCase().includes(memberSearch.toLowerCase()) ||
                              m.media.toLowerCase().includes(memberSearch.toLowerCase())
                            )
                            .map((member) => (
                              <tr key={member.id} className="hover:bg-slate-50/80 transition">
                                <td className="p-3">
                                  <div className="flex items-center gap-2.5">
                                    {member.photoUrl ? (
                                      <img
                                        src={member.photoUrl}
                                        alt={member.name}
                                        className="w-8 h-8 rounded-full object-cover border border-slate-200 shrink-0"
                                      />
                                    ) : (
                                      <div className="w-8 h-8 rounded-full bg-slate-200 text-slate-700 flex items-center justify-center font-bold text-xs shrink-0">
                                        {member.name.charAt(0) || 'স'}
                                      </div>
                                    )}
                                    <span className="font-bold text-slate-900">{member.name}</span>
                                  </div>
                                </td>
                                <td className="p-3 font-medium text-amber-900">
                                  <span className="bg-amber-50 border border-amber-200 px-2 py-0.5 rounded text-[11px]">
                                    {member.designation}
                                  </span>
                                </td>
                                <td className="p-3 text-slate-600">{member.media}</td>
                                <td className="p-3 text-slate-500">
                                  {member.phone || <span className="italic text-slate-400">খালি</span>}
                                </td>
                                <td className="p-3">
                                  <span className="text-[10px] uppercase font-bold text-slate-500">
                                    {member.category}
                                  </span>
                                </td>
                                <td className="p-3 text-right">
                                  <div className="flex items-center justify-end gap-1.5">
                                    <button
                                      onClick={() => setEditingMember(member)}
                                      className="p-1.5 text-blue-700 hover:bg-blue-50 rounded-lg transition"
                                      title="সম্পাদনা করুন"
                                    >
                                      <Edit className="w-4 h-4" />
                                    </button>
                                    <button
                                      onClick={() => deleteMember(member.id)}
                                      className="p-1.5 text-rose-600 hover:bg-rose-50 rounded-lg transition"
                                      title="মুছে ফেলুন"
                                    >
                                      <Trash2 className="w-4 h-4" />
                                    </button>
                                  </div>
                                </td>
                              </tr>
                            ))}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  {/* Add Member Modal */}
                  {isAddMemberOpen && (
                    <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4">
                      <div className="bg-white rounded-2xl shadow-xl border border-slate-200 p-6 max-w-md w-full space-y-4">
                        <div className="flex items-center justify-between border-b pb-2">
                          <h5 className="font-bold text-base text-[#0d3b66]">নতুন সদস্য যোগ করুন</h5>
                          <button onClick={() => setIsAddMemberOpen(false)} className="text-slate-400 hover:text-slate-700">
                            <X className="w-5 h-5" />
                          </button>
                        </div>

                        <form onSubmit={handleCreateMember} className="space-y-3">
                          <div>
                            <label className="block text-xs font-bold text-slate-700 mb-1">নাম *</label>
                            <input
                              type="text"
                              required
                              value={newMember.name}
                              onChange={(e) => setNewMember({ ...newMember, name: e.target.value })}
                              placeholder="যেমন: মো. কামরুল হাসান"
                              className="w-full text-xs px-3 py-2 bg-slate-50 border rounded-lg focus:ring-2 focus:ring-amber-500 focus:outline-none"
                            />
                          </div>

                          <div>
                            <label className="block text-xs font-bold text-slate-700 mb-1">পদবী *</label>
                            <input
                              type="text"
                              required
                              value={newMember.designation}
                              onChange={(e) => setNewMember({ ...newMember, designation: e.target.value })}
                              placeholder="যেমন: সদস্য / সহ-সভাপতি"
                              className="w-full text-xs px-3 py-2 bg-slate-50 border rounded-lg focus:ring-2 focus:ring-amber-500 focus:outline-none"
                            />
                          </div>

                          <div className="grid grid-cols-2 gap-2">
                            <div>
                              <label className="block text-xs font-bold text-slate-700 mb-1">সংবাদমাধ্যম</label>
                              <input
                                type="text"
                                value={newMember.media}
                                onChange={(e) => setNewMember({ ...newMember, media: e.target.value })}
                                placeholder="যেমন: প্রথম আলো"
                                className="w-full text-xs px-3 py-2 bg-slate-50 border rounded-lg focus:ring-2 focus:ring-amber-500 focus:outline-none"
                              />
                            </div>
                            <div>
                              <label className="block text-xs font-bold text-slate-700 mb-1">ফোন নম্বর</label>
                              <input
                                type="text"
                                value={newMember.phone}
                                onChange={(e) => setNewMember({ ...newMember, phone: e.target.value })}
                                placeholder="০১৭১১-XXXXXX"
                                className="w-full text-xs px-3 py-2 bg-slate-50 border rounded-lg focus:ring-2 focus:ring-amber-500 focus:outline-none"
                              />
                            </div>
                          </div>

                          <div>
                            <label className="block text-xs font-bold text-slate-700 mb-1">ক্যাটাগরি</label>
                            <select
                              value={newMember.category}
                              onChange={(e) => setNewMember({ ...newMember, category: e.target.value as any })}
                              className="w-full text-xs px-3 py-2 bg-slate-50 border rounded-lg focus:ring-2 focus:ring-amber-500 focus:outline-none"
                            >
                              <option value="executive">কার্যনির্বাহী পরিষদ</option>
                              <option value="senior">উপদেষ্টা ও জ্যেষ্ঠ সদস্য</option>
                              <option value="photojournalist">ফটোসাংবাদিক</option>
                              <option value="general">সাধারণ সদস্য</option>
                            </select>
                          </div>

                          {/* Member Photo Controls */}
                          <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
                            <label className="block text-xs font-bold text-slate-700">সদস্যের ছবি (ডিভাইস থেকে আপলোড / ফেসবুক সিঙ্ক / URL)</label>
                            <div className="flex items-center gap-3">
                              <img
                                src={newMember.photoUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80'}
                                alt="Preview"
                                className="w-12 h-12 rounded-xl object-cover border border-slate-300 shrink-0"
                              />
                              <div className="flex-1 space-y-1.5">
                                <input
                                  type="file"
                                  accept="image/*"
                                  onChange={(e) => handleMemberPhotoUpload(e, false)}
                                  className="w-full text-xs text-slate-500 file:mr-2 file:py-1 file:px-2.5 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-[#0d3b66] file:text-white hover:file:bg-[#144272] cursor-pointer"
                                />
                                <div className="flex gap-1.5">
                                  <input
                                    type="text"
                                    value={memberFbUrl}
                                    onChange={(e) => setMemberFbUrl(e.target.value)}
                                    placeholder="ফেসবুক প্রোফাইল লিংক..."
                                    className="flex-1 text-xs px-2.5 py-1 bg-white border border-slate-300 rounded-lg focus:outline-none"
                                  />
                                  <button
                                    type="button"
                                    onClick={() => handleMemberFacebookSync(false)}
                                    disabled={isMemberFbSyncing}
                                    className="px-2.5 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold transition flex items-center gap-1 shrink-0 cursor-pointer"
                                  >
                                    <Facebook className="w-3 h-3" />
                                    <span>সিঙ্ক</span>
                                  </button>
                                </div>
                                <input
                                  type="text"
                                  value={newMember.photoUrl}
                                  onChange={(e) => setNewMember({ ...newMember, photoUrl: e.target.value })}
                                  placeholder="সরাসরি ছবির URL লিংক..."
                                  className="w-full text-xs px-2.5 py-1 bg-white border border-slate-300 rounded-lg focus:outline-none text-slate-600"
                                />
                              </div>
                            </div>
                          </div>

                          <div className="pt-2 flex justify-end gap-2">
                            <button
                              type="button"
                              onClick={() => setIsAddMemberOpen(false)}
                              className="px-3 py-1.5 text-xs text-slate-600 hover:bg-slate-100 rounded-lg"
                            >
                              বাতিল
                            </button>
                            <button
                              type="submit"
                              className="px-4 py-1.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-lg shadow-sm"
                            >
                              যোগ করুন
                            </button>
                          </div>
                        </form>
                      </div>
                    </div>
                  )}

                  {/* Edit Member Modal */}
                  {editingMember && (
                    <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4">
                      <div className="bg-white rounded-2xl shadow-xl border border-slate-200 p-6 max-w-md w-full space-y-4">
                        <div className="flex items-center justify-between border-b pb-2">
                          <h5 className="font-bold text-base text-[#0d3b66]">সদস্য তথ্য সম্পাদনা</h5>
                          <button onClick={() => setEditingMember(null)} className="text-slate-400 hover:text-slate-700">
                            <X className="w-5 h-5" />
                          </button>
                        </div>

                        <form onSubmit={handleSaveEditedMember} className="space-y-3">
                          <div>
                            <label className="block text-xs font-bold text-slate-700 mb-1">নাম</label>
                            <input
                              type="text"
                              value={editingMember.name}
                              onChange={(e) => setEditingMember({ ...editingMember, name: e.target.value })}
                              className="w-full text-xs px-3 py-2 bg-slate-50 border rounded-lg focus:ring-2 focus:ring-amber-500 focus:outline-none"
                            />
                          </div>

                          <div>
                            <label className="block text-xs font-bold text-slate-700 mb-1">পদবী</label>
                            <input
                              type="text"
                              value={editingMember.designation}
                              onChange={(e) => setEditingMember({ ...editingMember, designation: e.target.value })}
                              className="w-full text-xs px-3 py-2 bg-slate-50 border rounded-lg focus:ring-2 focus:ring-amber-500 focus:outline-none"
                            />
                          </div>

                          <div className="grid grid-cols-2 gap-2">
                            <div>
                              <label className="block text-xs font-bold text-slate-700 mb-1">সংবাদমাধ্যম</label>
                              <input
                                type="text"
                                value={editingMember.media}
                                onChange={(e) => setEditingMember({ ...editingMember, media: e.target.value })}
                                className="w-full text-xs px-3 py-2 bg-slate-50 border rounded-lg focus:ring-2 focus:ring-amber-500 focus:outline-none"
                              />
                            </div>
                            <div>
                              <label className="block text-xs font-bold text-slate-700 mb-1">ফোন নম্বর</label>
                              <input
                                type="text"
                                value={editingMember.phone || ''}
                                onChange={(e) => setEditingMember({ ...editingMember, phone: e.target.value })}
                                className="w-full text-xs px-3 py-2 bg-slate-50 border rounded-lg focus:ring-2 focus:ring-amber-500 focus:outline-none"
                              />
                            </div>
                          </div>

                          <div>
                            <label className="block text-xs font-bold text-slate-700 mb-1">ক্যাটাগরি</label>
                            <select
                              value={editingMember.category}
                              onChange={(e) => setEditingMember({ ...editingMember, category: e.target.value as any })}
                              className="w-full text-xs px-3 py-2 bg-slate-50 border rounded-lg focus:ring-2 focus:ring-amber-500 focus:outline-none"
                            >
                              <option value="executive">কার্যনির্বাহী পরিষদ</option>
                              <option value="senior">উপদেষ্টা ও জ্যেষ্ঠ সদস্য</option>
                              <option value="photojournalist">ফটোসাংবাদিক</option>
                              <option value="general">সাধারণ সদস্য</option>
                            </select>
                          </div>

                          {/* Member Photo Controls */}
                          <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
                            <label className="block text-xs font-bold text-slate-700">সদস্যের ছবি (ডিভাইস থেকে আপলোড / ফেসবুক সিঙ্ক / URL)</label>
                            <div className="flex items-center gap-3">
                              <img
                                src={editingMember.photoUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80'}
                                alt="Preview"
                                className="w-12 h-12 rounded-xl object-cover border border-slate-300 shrink-0"
                              />
                              <div className="flex-1 space-y-1.5">
                                <input
                                  type="file"
                                  accept="image/*"
                                  onChange={(e) => handleMemberPhotoUpload(e, true)}
                                  className="w-full text-xs text-slate-500 file:mr-2 file:py-1 file:px-2.5 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-[#0d3b66] file:text-white hover:file:bg-[#144272] cursor-pointer"
                                />
                                <div className="flex gap-1.5">
                                  <input
                                    type="text"
                                    value={memberFbUrl}
                                    onChange={(e) => setMemberFbUrl(e.target.value)}
                                    placeholder="ফেসবুক প্রোফাইল লিংক..."
                                    className="flex-1 text-xs px-2.5 py-1 bg-white border border-slate-300 rounded-lg focus:outline-none"
                                  />
                                  <button
                                    type="button"
                                    onClick={() => handleMemberFacebookSync(true)}
                                    disabled={isMemberFbSyncing}
                                    className="px-2.5 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold transition flex items-center gap-1 shrink-0 cursor-pointer"
                                  >
                                    <Facebook className="w-3 h-3" />
                                    <span>সিঙ্ক</span>
                                  </button>
                                </div>
                                <input
                                  type="text"
                                  value={editingMember.photoUrl}
                                  onChange={(e) => setEditingMember({ ...editingMember, photoUrl: e.target.value })}
                                  placeholder="সরাসরি ছবির URL লিংক..."
                                  className="w-full text-xs px-2.5 py-1 bg-white border border-slate-300 rounded-lg focus:outline-none text-slate-600"
                                />
                              </div>
                            </div>
                          </div>

                          <div className="pt-2 flex justify-end gap-2">
                            <button
                              type="button"
                              onClick={() => setEditingMember(null)}
                              className="px-3 py-1.5 text-xs text-slate-600 hover:bg-slate-100 rounded-lg"
                            >
                              বাতিল
                            </button>
                            <button
                              type="submit"
                              className="px-4 py-1.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-lg shadow-sm"
                            >
                              আপডেট সংরক্ষণ
                            </button>
                          </div>
                        </form>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* TAB 3: Notices Management */}
              {activeTab === 'notices' && (
                <div className="space-y-6">
                  <div className="border-b border-slate-200 pb-3 flex items-center justify-between">
                    <div>
                      <h4 className="text-lg font-bold text-[#0d3b66] font-serif">নোটিশ ও প্রেস বিজ্ঞপ্তি ব্যবস্থাপনা</h4>
                      <p className="text-xs text-slate-500">
                        প্রেসক্লাব নোটিশ বোর্ডে নতুন ঘোষণা প্রকাশ করুন বা বিদ্যমান নোটিশ সংশোধন করুন।
                      </p>
                    </div>

                    <div className="flex flex-wrap items-center gap-2">
                      <button
                        type="button"
                        onClick={handleTestPushNotification}
                        className="px-3 py-1.5 text-xs text-red-700 bg-red-50 hover:bg-red-100 border border-red-200 rounded-lg transition flex items-center gap-1.5 font-bold cursor-pointer"
                        title="সাবস্ক্রাইবার ব্রাউজার পুশ নোটিফিকেশন টেস্ট করুন"
                      >
                        <BellRing className="w-3.5 h-3.5 text-red-600" />
                        <span>টেস্ট পুশ পাঠান</span>
                      </button>
                      <button
                        onClick={resetNotices}
                        className="px-3 py-1.5 text-xs text-slate-600 hover:text-slate-900 border border-slate-300 rounded-lg hover:bg-slate-50 transition flex items-center gap-1"
                      >
                        <RefreshCw className="w-3.5 h-3.5" />
                        রিসেট
                      </button>
                      <button
                        onClick={() => setIsAddNoticeOpen(true)}
                        className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-xl shadow-sm flex items-center gap-1.5 transition"
                      >
                        <Plus className="w-4 h-4" />
                        নতুন নোটিশ দিন
                      </button>
                    </div>
                  </div>

                  {pushTestStatus && (
                    <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-xs font-semibold text-red-900 flex items-center gap-2">
                      <BellRing className="w-4 h-4 text-red-600 animate-pulse" />
                      <span>{pushTestStatus}</span>
                    </div>
                  )}

                  {/* Notices List */}
                  <div className="space-y-3">
                    {notices.map((notice) => (
                      <div
                        key={notice.id}
                        className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 hover:bg-slate-50 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3"
                      >
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-[#0d3b66] text-white">
                              {notice.badge}
                            </span>
                            <span className="text-xs text-slate-500">{notice.date}</span>
                            {notice.isImportant && (
                              <span className="text-[10px] font-bold text-amber-900 bg-amber-300 px-1.5 py-0.2 rounded">
                                শীর্ষ
                              </span>
                            )}
                          </div>
                          <h5 className="font-bold text-sm text-slate-900 font-serif">{notice.title}</h5>
                          <p className="text-xs text-slate-600 line-clamp-1">{notice.summary}</p>
                        </div>

                        <div className="flex items-center gap-1.5 shrink-0">
                          <button
                            type="button"
                            onClick={() => {
                              openUrgentNoticePopup(notice);
                            }}
                            className="px-2 py-1 bg-red-50 hover:bg-red-100 text-red-700 text-xs font-bold rounded-lg border border-red-200 transition flex items-center gap-1 cursor-pointer"
                            title="জরুরি পপ-আপ নোটিশ হিসেবে দেখুন"
                          >
                            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                            <span>পপ-আপ দেখুন</span>
                          </button>
                          <button
                            type="button"
                            onClick={async () => {
                              await sendBreakingNewsPush(notice);
                              setAppActionNotice(`"🔴 ${notice.title}" নোটিফিকেশনটি সকল গ্রাহকের ব্রাউজারে পুশ করা হয়েছে!`);
                              setTimeout(() => setAppActionNotice(null), 3500);
                            }}
                            className="p-1.5 text-amber-600 hover:bg-amber-100 rounded-lg transition"
                            title="ব্রাউজারে পুশ নোটিফিকেশন পাঠান"
                          >
                            <BellRing className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => setEditingNotice(notice)}
                            className="p-1.5 text-blue-700 hover:bg-blue-100 rounded-lg transition"
                            title="সম্পাদনা"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => deleteNotice(notice.id)}
                            className="p-1.5 text-rose-600 hover:bg-rose-100 rounded-lg transition"
                            title="মুছুন"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Add Notice Modal */}
                  {isAddNoticeOpen && (
                    <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4">
                      <div className="bg-white rounded-2xl shadow-xl border border-slate-200 p-6 max-w-lg w-full space-y-4">
                        <div className="flex items-center justify-between border-b pb-2">
                          <h5 className="font-bold text-base text-[#0d3b66]">নতুন নোটিশ তৈরি করুন</h5>
                          <button onClick={() => setIsAddNoticeOpen(false)} className="text-slate-400 hover:text-slate-700">
                            <X className="w-5 h-5" />
                          </button>
                        </div>

                        <form onSubmit={handleCreateNotice} className="space-y-3">
                          <div>
                            <label className="block text-xs font-bold text-slate-700 mb-1">নোটিশের শিরোনাম *</label>
                            <input
                              type="text"
                              required
                              value={newNotice.title}
                              onChange={(e) => setNewNotice({ ...newNotice, title: e.target.value })}
                              placeholder="যেমন: সুবর্ণজয়ন্তী ২০২৭ উপলক্ষে প্রস্তুতি সভা আহ্বান"
                              className="w-full text-xs px-3 py-2 bg-slate-50 border rounded-lg focus:ring-2 focus:ring-amber-500 focus:outline-none"
                            />
                          </div>

                          <div className="grid grid-cols-3 gap-2">
                            <div>
                              <label className="block text-xs font-bold text-slate-700 mb-1">ক্যাটাগরি টাইপ</label>
                              <select
                                value={newNotice.category || 'general'}
                                onChange={(e) => setNewNotice({ ...newNotice, category: e.target.value as NoticeCategory })}
                                className="w-full text-xs px-2.5 py-2 bg-slate-50 border rounded-lg focus:ring-2 focus:ring-amber-500 focus:outline-none font-medium text-slate-800"
                              >
                                <option value="local_news">Local News (স্থানীয় সংবাদ)</option>
                                <option value="general">General (সাধারণ)</option>
                                <option value="training">Training (প্রশিক্ষণ)</option>
                                <option value="meeting">Meeting (সভা)</option>
                                <option value="award">Award (পুরস্কার)</option>
                              </select>
                            </div>
                            <div>
                              <label className="block text-xs font-bold text-slate-700 mb-1">ক্যাটাগরি ব্যাজ</label>
                              <input
                                type="text"
                                value={newNotice.badge}
                                onChange={(e) => setNewNotice({ ...newNotice, badge: e.target.value })}
                                className="w-full text-xs px-3 py-2 bg-slate-50 border rounded-lg focus:ring-2 focus:ring-amber-500 focus:outline-none"
                              />
                            </div>
                            <div>
                              <label className="block text-xs font-bold text-slate-700 mb-1">তারিখ</label>
                              <input
                                type="text"
                                value={newNotice.date}
                                onChange={(e) => setNewNotice({ ...newNotice, date: e.target.value })}
                                className="w-full text-xs px-3 py-2 bg-slate-50 border rounded-lg focus:ring-2 focus:ring-amber-500 focus:outline-none"
                              />
                            </div>
                          </div>

                          <div>
                            <label className="block text-xs font-bold text-slate-700 mb-1">সংক্ষেপ বিবরণ *</label>
                            <input
                              type="text"
                              required
                              value={newNotice.summary}
                              onChange={(e) => setNewNotice({ ...newNotice, summary: e.target.value })}
                              placeholder="১-২ বাক্যে নোটিশের সারসংক্ষেপ"
                              className="w-full text-xs px-3 py-2 bg-slate-50 border rounded-lg focus:ring-2 focus:ring-amber-500 focus:outline-none"
                            />
                          </div>

                          <div>
                            <label className="block text-xs font-bold text-slate-700 mb-1">পূর্ণাঙ্গ বিজ্ঞপ্তি বা আদেশ</label>
                            <textarea
                              rows={4}
                              value={newNotice.fullText}
                              onChange={(e) => setNewNotice({ ...newNotice, fullText: e.target.value })}
                              placeholder="বিস্তারিত বক্তব্য..."
                              className="w-full text-xs px-3 py-2 bg-slate-50 border rounded-lg focus:ring-2 focus:ring-amber-500 focus:outline-none"
                            />
                          </div>

                          <div className="flex items-center gap-2">
                            <input
                              type="checkbox"
                              id="isImportant"
                              checked={newNotice.isImportant}
                              onChange={(e) => setNewNotice({ ...newNotice, isImportant: e.target.checked })}
                              className="rounded text-amber-500 focus:ring-amber-500"
                            />
                            <label htmlFor="isImportant" className="text-xs text-slate-700 font-medium cursor-pointer">
                              জরুরি ও শীর্ষ নোটিশ হিসেবে চিহ্নিত করুন
                            </label>
                          </div>

                          <div className="flex items-center gap-2 p-2.5 bg-red-50/80 border border-red-200 rounded-xl">
                            <input
                              type="checkbox"
                              id="isNoticePopup"
                              checked={newNotice.isPopup || false}
                              onChange={(e) => setNewNotice({ ...newNotice, isPopup: e.target.checked })}
                              className="rounded text-red-600 focus:ring-red-500 w-4 h-4"
                            />
                            <label htmlFor="isNoticePopup" className="text-xs text-red-900 font-bold cursor-pointer">
                              ওয়েবসাইটে জরুরি পপ-আপ নোটিশ হিসেবে সরাসরি প্রদর্শন করুন (Pop-up Modal)
                            </label>
                          </div>

                          <div className="p-3 bg-red-50/80 border border-red-200 rounded-xl space-y-1">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <BellRing className="w-4 h-4 text-red-600 shrink-0" />
                                <span className="text-xs font-bold text-red-950">
                                  গ্রাহকদের ডিভাইসে স্বয়ংক্রিয় পুশ নোটিফিকেশন পাঠান
                                </span>
                              </div>
                              <input
                                type="checkbox"
                                id="sendPushOnCreate"
                                checked={sendPushOnCreate}
                                onChange={(e) => setSendPushOnCreate(e.target.checked)}
                                className="w-4 h-4 rounded text-red-600 focus:ring-red-500"
                              />
                            </div>
                            <p className="text-[11px] text-red-800/80 pl-6">
                              নোটিশটি প্রকাশের সাথে সাথে সকল গ্রাহক ও পাঠকের ব্রাউজারে ইনস্ট্যান্ট পুশ অ্যালার্ট পাঠানো হবে।
                            </p>
                          </div>

                          <div className="pt-2 flex justify-end gap-2">
                            <button
                              type="button"
                              onClick={() => setIsAddNoticeOpen(false)}
                              className="px-3 py-1.5 text-xs text-slate-600 hover:bg-slate-100 rounded-lg"
                            >
                              বাতিল
                            </button>
                            <button
                              type="submit"
                              className="px-4 py-1.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-lg shadow-sm"
                            >
                              প্রকাশ করুন
                            </button>
                          </div>
                        </form>
                      </div>
                    </div>
                  )}

                  {/* Edit Notice Modal */}
                  {editingNotice && (
                    <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4">
                      <div className="bg-white rounded-2xl shadow-xl border border-slate-200 p-6 max-w-lg w-full space-y-4">
                        <div className="flex items-center justify-between border-b pb-2">
                          <h5 className="font-bold text-base text-[#0d3b66]">নোটিশ সম্পাদনা</h5>
                          <button onClick={() => setEditingNotice(null)} className="text-slate-400 hover:text-slate-700">
                            <X className="w-5 h-5" />
                          </button>
                        </div>

                        <form onSubmit={handleSaveEditedNotice} className="space-y-3">
                          <div>
                            <label className="block text-xs font-bold text-slate-700 mb-1">নোটিশের শিরোনাম</label>
                            <input
                              type="text"
                              value={editingNotice.title}
                              onChange={(e) => setEditingNotice({ ...editingNotice, title: e.target.value })}
                              className="w-full text-xs px-3 py-2 bg-slate-50 border rounded-lg focus:ring-2 focus:ring-amber-500 focus:outline-none"
                            />
                          </div>

                          <div className="grid grid-cols-3 gap-2">
                            <div>
                              <label className="block text-xs font-bold text-slate-700 mb-1">ক্যাটাগরি টাইপ</label>
                              <select
                                value={editingNotice.category || 'general'}
                                onChange={(e) => setEditingNotice({ ...editingNotice, category: e.target.value as NoticeCategory })}
                                className="w-full text-xs px-2.5 py-2 bg-slate-50 border rounded-lg focus:ring-2 focus:ring-amber-500 focus:outline-none font-medium text-slate-800"
                              >
                                <option value="local_news">Local News (স্থানীয় সংবাদ)</option>
                                <option value="general">General (সাধারণ)</option>
                                <option value="training">Training (প্রশিক্ষণ)</option>
                                <option value="meeting">Meeting (সভা)</option>
                                <option value="award">Award (পুরস্কার)</option>
                              </select>
                            </div>
                            <div>
                              <label className="block text-xs font-bold text-slate-700 mb-1">ক্যাটাগরি ব্যাজ</label>
                              <input
                                type="text"
                                value={editingNotice.badge}
                                onChange={(e) => setEditingNotice({ ...editingNotice, badge: e.target.value })}
                                className="w-full text-xs px-3 py-2 bg-slate-50 border rounded-lg focus:ring-2 focus:ring-amber-500 focus:outline-none"
                              />
                            </div>
                            <div>
                              <label className="block text-xs font-bold text-slate-700 mb-1">তারিখ</label>
                              <input
                                type="text"
                                value={editingNotice.date}
                                onChange={(e) => setEditingNotice({ ...editingNotice, date: e.target.value })}
                                className="w-full text-xs px-3 py-2 bg-slate-50 border rounded-lg focus:ring-2 focus:ring-amber-500 focus:outline-none"
                              />
                            </div>
                          </div>

                          <div>
                            <label className="block text-xs font-bold text-slate-700 mb-1">সংক্ষেপ বিবরণ</label>
                            <input
                              type="text"
                              value={editingNotice.summary}
                              onChange={(e) => setEditingNotice({ ...editingNotice, summary: e.target.value })}
                              className="w-full text-xs px-3 py-2 bg-slate-50 border rounded-lg focus:ring-2 focus:ring-amber-500 focus:outline-none"
                            />
                          </div>

                          <div>
                            <label className="block text-xs font-bold text-slate-700 mb-1">পূর্ণাঙ্গ বিজ্ঞপ্তি বা আদেশ</label>
                            <textarea
                              rows={4}
                              value={editingNotice.fullText}
                              onChange={(e) => setEditingNotice({ ...editingNotice, fullText: e.target.value })}
                              className="w-full text-xs px-3 py-2 bg-slate-50 border rounded-lg focus:ring-2 focus:ring-amber-500 focus:outline-none"
                            />
                          </div>

                          <div className="flex items-center gap-2">
                            <input
                              type="checkbox"
                              id="editIsImportant"
                              checked={editingNotice.isImportant}
                              onChange={(e) => setEditingNotice({ ...editingNotice, isImportant: e.target.checked })}
                              className="rounded text-amber-500 focus:ring-amber-500"
                            />
                            <label htmlFor="editIsImportant" className="text-xs text-slate-700 font-medium cursor-pointer">
                              জরুরি ও শীর্ষ নোটিশ হিসেবে চিহ্নিত করুন
                            </label>
                          </div>

                          <div className="flex items-center gap-2 p-2.5 bg-red-50/80 border border-red-200 rounded-xl">
                            <input
                              type="checkbox"
                              id="editIsNoticePopup"
                              checked={editingNotice.isPopup || false}
                              onChange={(e) => setEditingNotice({ ...editingNotice, isPopup: e.target.checked })}
                              className="rounded text-red-600 focus:ring-red-500 w-4 h-4"
                            />
                            <label htmlFor="editIsNoticePopup" className="text-xs text-red-900 font-bold cursor-pointer">
                              ওয়েবসাইটে জরুরি পপ-আপ নোটিশ হিসেবে সরাসরি প্রদর্শন করুন (Pop-up Modal)
                            </label>
                          </div>

                          <div className="pt-2 flex justify-end gap-2">
                            <button
                              type="button"
                              onClick={() => setEditingNotice(null)}
                              className="px-3 py-1.5 text-xs text-slate-600 hover:bg-slate-100 rounded-lg"
                            >
                              বাতিল
                            </button>
                            <button
                              type="submit"
                              className="px-4 py-1.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-lg shadow-sm"
                            >
                              আপডেট সংরক্ষণ
                            </button>
                          </div>
                        </form>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* TAB 4: Citizen Grievances & Submissions */}
              {activeTab === 'complaints' && (
                <div className="space-y-6">
                  <div className="border-b border-slate-200 pb-3 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                    <div>
                      <h4 className="text-lg font-bold text-[#0d3b66] font-serif">নাগরিক তথ্য ও অভিযোগ ইনবক্স</h4>
                      <p className="text-xs text-slate-500">
                        সাধারণ জনগণের প্রেরিত অভিযোগ ও জনস্বার্থমূলক তথ্যের পর্যালোচনা ও স্ট্যাটাস আপডেট।
                      </p>
                    </div>

                    <div className="flex items-center gap-1.5">
                      {(['all', 'pending', 'reviewing', 'resolved'] as const).map((st) => (
                        <button
                          key={st}
                          onClick={() => setComplaintFilter(st)}
                          className={`px-3 py-1 text-xs font-bold rounded-lg transition ${
                            complaintFilter === st
                              ? 'bg-[#0d3b66] text-white'
                              : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                          }`}
                        >
                          {st === 'all' && 'সকল'}
                          {st === 'pending' && 'নতুন'}
                          {st === 'reviewing' && 'পর্যালোচনাধীন'}
                          {st === 'resolved' && 'নিষ্পত্তি'}
                        </button>
                      ))}
                    </div>
                  </div>

                  {complaints.length === 0 ? (
                    <div className="py-12 text-center text-slate-500">
                      <Inbox className="w-10 h-10 mx-auto text-slate-300 mb-2" />
                      <p className="text-sm">কোনো নাগরিক অভিযোগ জমা হয়নি।</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {complaints
                        .filter(c => complaintFilter === 'all' || c.status === complaintFilter)
                        .map((c) => (
                          <div
                            key={c.id}
                            className="bg-slate-50 border border-slate-200 rounded-xl p-4 sm:p-5 space-y-3"
                          >
                            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-200/80 pb-2">
                              <div className="flex items-center gap-2">
                                <span className="font-mono text-xs font-black text-blue-900 bg-blue-100 px-2.5 py-0.5 rounded">
                                  {c.id}
                                </span>
                                <span className="text-xs font-bold text-amber-900 bg-amber-100 px-2 py-0.5 rounded">
                                  {c.category}
                                </span>
                                <span className="text-xs text-slate-500">{c.date}</span>
                              </div>

                              <div className="flex items-center gap-2">
                                <span className="text-xs font-bold text-slate-700">স্ট্যাটাস:</span>
                                <select
                                  value={c.status}
                                  onChange={(e) => updateComplaintStatus(c.id, e.target.value as any)}
                                  className="text-xs font-bold py-1 px-2.5 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500"
                                >
                                  <option value="pending">নতুন জমা</option>
                                  <option value="reviewing">পর্যালোচনাধীন / তদন্ত চলছে</option>
                                  <option value="resolved">নিষ্পত্তিকৃত / প্রতিবেদন প্রকাশিত</option>
                                </select>
                                <button
                                  onClick={() => deleteComplaint(c.id)}
                                  className="p-1 text-rose-500 hover:text-rose-700 hover:bg-rose-50 rounded"
                                  title="মুছুন"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </div>
                            </div>

                            <div>
                              <h5 className="font-bold text-base text-[#0d3b66] font-serif">{c.title}</h5>
                              <p className="text-xs sm:text-sm text-slate-700 mt-1 leading-relaxed">{c.details}</p>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs bg-white p-2.5 rounded-lg border border-slate-200 text-slate-600">
                              <div>
                                <strong>প্রেরক:</strong>{' '}
                                {c.isAnonymous ? (
                                  <span className="text-amber-800 font-semibold">গোপন নাগরিক (উৎস সুরক্ষিত)</span>
                                ) : (
                                  <span>{c.name}</span>
                                )}
                              </div>
                              <div>
                                <strong>এলাকা / স্থান:</strong> {c.location}
                              </div>
                              <div>
                                <strong>যোগাযোগ:</strong>{' '}
                                {c.contact ? <span className="text-blue-900 font-medium">{c.contact}</span> : 'দেওয়া হয়নি'}
                              </div>
                            </div>

                            {/* Internal Investigator Notes */}
                            <div className="space-y-1">
                              <label className="block text-[11px] font-bold text-slate-600">
                                সাংবাদিকদের অনুসন্ধান নোট / মন্তব্য (নাগরিকদের দৃশ্যমান):
                              </label>
                              <div className="flex gap-2">
                                <input
                                  type="text"
                                  defaultValue={c.investigatorNotes || ''}
                                  onBlur={(e) => updateComplaintStatus(c.id, c.status, e.target.value)}
                                  placeholder="যেমন: প্রতিনিধি দল সরেজমিনে গেছে..."
                                  className="flex-1 text-xs px-3 py-1.5 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500"
                                />
                                <span className="text-[10px] text-slate-400 self-center">কার্সর সরালে অটো সেভ হবে</span>
                              </div>
                            </div>
                          </div>
                        ))}
                    </div>
                  )}
                </div>
              )}

              {/* TAB 5: Image & Asset Manager */}
              {activeTab === 'images' && (
                <div className="space-y-6">
                  <div className="border-b border-slate-200 pb-3 flex items-center justify-between">
                    <div>
                      <h4 className="text-lg font-bold text-[#0d3b66] font-serif">ছবি ও ব্যানার পরিবর্তন ব্যবস্থাপনা</h4>
                      <p className="text-xs text-slate-500">
                        লোগো, ভবন, সদস্যদের ছবি ও ব্যানার যেকোনো সময় আপনার ডিভাইস থেকে সরাসরি আপলোড করে প্রতিস্থাপন করুন।
                      </p>
                    </div>
                    <button
                      onClick={resetImages}
                      className="px-3 py-1.5 text-xs text-slate-600 hover:text-slate-900 border border-slate-300 rounded-lg hover:bg-slate-50 transition flex items-center gap-1"
                    >
                      <RefreshCw className="w-3.5 h-3.5" />
                      ডিফল্ট ছবিতে ফিরুন
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {[
                      {
                        key: 'logo' as const,
                        label: 'প্রেসক্লাব লোগো',
                        desc: 'হেডার, ফুটার ও সুবর্ণজয়ন্তী প্রতীকে প্রদর্শিত গোল লোগো'
                      },
                      {
                        key: 'building' as const,
                        label: 'প্রেসক্লাব ভবন (থানা সংলগ্ন)',
                        desc: 'আমাদের পরিচিতি ও যোগাযোগ সেকশনে প্রদর্শিত ভবনের ছবি'
                      },
                      {
                        key: 'membersGroup' as const,
                        label: 'সম্মানিত সদস্যদের গ্রুপ ছবি',
                        desc: 'কার্যনির্বাহী পরিষদ ও সদস্য সেকশনের প্রধান গ্রুপ ছবি'
                      },
                      {
                        key: 'executiveLeaders' as const,
                        label: 'কার্যনির্বাহী নেতৃবৃন্দের ফুলের মালা ছবি',
                        desc: 'নেতৃত্ব ও সংবর্ধনা স্পটলাইট ফটো'
                      },
                      {
                        key: 'recruitmentBanner' as const,
                        label: 'সদস্য সংগ্রহ ও নবায়ন ব্যানার',
                        desc: 'সুবর্ণজয়ন্তী ৫০ সদস্য সংগ্রহ ক্যাম্পেইন ব্যানার'
                      },
                      {
                        key: 'applicationForm' as const,
                        label: 'অনলাইন সদস্য আবেদন ফরম ড্রাফট',
                        desc: 'সদস্য আবেদনের ডিজাইন ও ফরম প্রিভিউ'
                      }
                    ].map((item) => (
                      <div
                        key={item.key}
                        className="p-4 rounded-xl border border-slate-200 bg-slate-50 flex flex-col justify-between space-y-3"
                      >
                        <div>
                          <div className="flex items-center justify-between mb-1">
                            <span className="font-bold text-xs text-[#0d3b66] font-serif">{item.label}</span>
                            <span className="text-[10px] text-slate-400 font-mono">{item.key}</span>
                          </div>
                          <p className="text-[11px] text-slate-500 mb-3">{item.desc}</p>
                          
                          <div className="h-40 rounded-lg border border-slate-300 bg-slate-200 overflow-hidden flex items-center justify-center relative group">
                            {images[item.key] ? (
                              <img
                                src={images[item.key]}
                                alt={item.label}
                                className="w-full h-full object-contain bg-slate-900/5 group-hover:scale-105 transition duration-300"
                              />
                            ) : (
                              <div className="text-slate-400 text-xs flex flex-col items-center gap-1">
                                <ImageIcon className="w-8 h-8 text-slate-400" />
                                <span>ছবি সংযুক্ত নেই</span>
                              </div>
                            )}
                          </div>
                        </div>

                        <div className="space-y-2 pt-2 border-t border-slate-200">
                          <label className="w-full py-2 px-3 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-lg shadow-xs flex items-center justify-center gap-2 cursor-pointer transition">
                            <Upload className="w-3.5 h-3.5" />
                            <span>কম্পিউটার/মোবাইল থেকে ছবি আপলোড করুন</span>
                            <input
                              type="file"
                              accept="image/*"
                              className="hidden"
                              onChange={(e) => {
                                if (e.target.files && e.target.files[0]) {
                                  handleFileUpload(item.key, e.target.files[0]);
                                }
                              }}
                            />
                          </label>

                          <div className="flex gap-1.5">
                            <input
                              type="text"
                              value={images[item.key]}
                              onChange={(e) => updateImage(item.key, e.target.value)}
                              placeholder="বা ছবির URL দিন..."
                              className="flex-1 text-[11px] px-2.5 py-1.5 bg-white border border-slate-300 rounded-lg focus:ring-1 focus:ring-amber-500"
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* TAB 6: Security & PIN Settings */}
              {activeTab === 'security' && (
                <div className="max-w-md space-y-6">
                  <div className="border-b border-slate-200 pb-3">
                    <h4 className="text-lg font-bold text-[#0d3b66] font-serif">নিরাপত্তা ও পিন পরিবর্তন</h4>
                    <p className="text-xs text-slate-500">
                      অ্যাডমিন পোর্টালে প্রবেশের নিরাপত্তা পিন পরিবর্তন করুন।
                    </p>
                  </div>

                  <form onSubmit={handlePinChange} className="space-y-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        বর্তমান পিন
                      </label>
                      <input
                        type="text"
                        disabled
                        value={adminPin}
                        className="w-full px-3 py-2 text-sm bg-slate-100 border border-slate-200 rounded-lg text-slate-500 font-mono"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        নতুন পিন (কমপক্ষে ৪ সংখ্যা)
                      </label>
                      <input
                        type="password"
                        required
                        minLength={4}
                        maxLength={8}
                        value={newPin}
                        onChange={(e) => setNewPin(e.target.value)}
                        placeholder="যেমন: ১৯৭৭"
                        className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:outline-none font-mono"
                      />
                    </div>

                    {pinSuccess && (
                      <div className="p-3 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-xl text-xs font-semibold flex items-center gap-1.5">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                        পিন সফলভাবে পরিবর্তিত হয়েছে! পরবর্তী লগইনে এই পিন ব্যবহার করুন।
                      </div>
                    )}

                    <button
                      type="submit"
                      className="w-full py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-xl shadow-md transition"
                    >
                      পিন আপডেট করুন
                    </button>
                  </form>
                </div>
              )}

              {/* TAB 7: Newsletter & Member Signups */}
              {activeTab === 'subscribers' && (
                <div className="space-y-5">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 pb-3">
                    <div>
                      <h4 className="text-lg font-bold text-[#0d3b66] font-serif">
                        নিউজলেটার ও সদস্য সংযোগ তালিকা ({subscribers.length} জন)
                      </h4>
                      <p className="text-xs text-slate-500">
                        ওয়েবসাইট ফুটার থেকে ইমেইল আপডেট ও প্রাথমিক সদস্য হিসেবে তালিকাভুক্ত গ্রাহকবৃন্দের তালিকা।
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => {
                          const csvContent = "data:text/csv;charset=utf-8,\uFEFF" 
                            + "ID,Name,Email,Phone,Category,Interests,SubscribedAt\n"
                            + subscribers.map(s => `"${s.id}","${s.name}","${s.email}","${s.phone || ''}","${s.category}","${(s.interests || []).join('; ')}","${s.subscribedAt}"`).join("\n");
                          const encodedUri = encodeURI(csvContent);
                          const link = document.createElement("a");
                          link.setAttribute("href", encodedUri);
                          link.setAttribute("download", `ullapara_pressclub_subscribers_${Date.now()}.csv`);
                          document.body.appendChild(link);
                          link.click();
                          document.body.removeChild(link);
                        }}
                        className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-lg shadow-sm transition flex items-center gap-1.5"
                      >
                        <Download className="w-3.5 h-3.5" />
                        <span>CSV রপ্তানি করুন</span>
                      </button>
                    </div>
                  </div>

                  {/* Search Bar */}
                  <div className="relative">
                    <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                    <input
                      type="text"
                      placeholder="নাম, ইমেইল অথবা মোবাইল নম্বর দিয়ে খুঁজুন..."
                      value={subscriberSearch}
                      onChange={(e) => setSubscriberSearch(e.target.value)}
                      className="w-full pl-9 pr-4 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500"
                    />
                  </div>

                  {/* Subscribers Cards Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-[500px] overflow-y-auto pr-1">
                    {subscribers
                      .filter(s => 
                        s.name.toLowerCase().includes(subscriberSearch.toLowerCase()) ||
                        s.email.toLowerCase().includes(subscriberSearch.toLowerCase()) ||
                        (s.phone && s.phone.includes(subscriberSearch))
                      )
                      .map((sub) => {
                        const categoryLabels: Record<string, { label: string; bg: string; text: string }> = {
                          member_applicant: { label: 'সদস্য হতে ইচ্ছুক', bg: 'bg-amber-100', text: 'text-amber-900' },
                          journalist: { label: 'কর্মরত সাংবাদিক', bg: 'bg-blue-100', text: 'text-blue-900' },
                          citizen: { label: 'নাগরিক পাঠক / সুধীসমাজ', bg: 'bg-purple-100', text: 'text-purple-900' },
                          student: { label: 'শিক্ষার্থী / শিক্ষানবিস', bg: 'bg-emerald-100', text: 'text-emerald-900' }
                        };
                        const cat = categoryLabels[sub.category] || { label: sub.category, bg: 'bg-slate-100', text: 'text-slate-800' };

                        return (
                          <div
                            key={sub.id}
                            className="p-4 rounded-xl border border-slate-200 bg-white hover:border-blue-300 transition shadow-xs flex flex-col justify-between gap-3 relative"
                          >
                            <div className="space-y-1.5">
                              <div className="flex items-center justify-between gap-2">
                                <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${cat.bg} ${cat.text}`}>
                                  {cat.label}
                                </span>
                                <span className="text-[10px] text-slate-400 font-mono">
                                  {sub.subscribedAt}
                                </span>
                              </div>

                              <h5 className="font-bold text-sm text-slate-900 font-serif">
                                {sub.name}
                              </h5>

                              <div className="text-xs text-slate-600 space-y-0.5">
                                <p className="flex items-center gap-1.5 text-blue-800 font-medium">
                                  <Mail className="w-3.5 h-3.5 text-slate-400" />
                                  <a href={`mailto:${sub.email}`} className="hover:underline">
                                    {sub.email}
                                  </a>
                                </p>
                                {sub.phone && (
                                  <p className="flex items-center gap-1.5 text-slate-600">
                                    <Phone className="w-3.5 h-3.5 text-slate-400" />
                                    <span>{sub.phone}</span>
                                  </p>
                                )}
                              </div>

                              {sub.interests && sub.interests.length > 0 && (
                                <div className="flex flex-wrap gap-1 pt-1">
                                  {sub.interests.map((interest, idx) => (
                                    <span key={idx} className="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded">
                                      {interest}
                                    </span>
                                  ))}
                                </div>
                              )}
                            </div>

                            <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-[11px]">
                              <span className="text-slate-400 font-mono text-[10px]">ID: {sub.id}</span>
                              <button
                                onClick={() => {
                                  if (confirm(`আপনি কি "${sub.name}" এর সাবস্ক্রিপশন মুছে ফেলতে চান?`)) {
                                    deleteSubscriber(sub.id);
                                  }
                                }}
                                className="text-rose-600 hover:text-rose-800 font-semibold p-1 hover:bg-rose-50 rounded transition flex items-center gap-1"
                                title="মুছে ফেলুন"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                                <span>মুছুন</span>
                              </button>
                            </div>
                          </div>
                        );
                      })}
                  </div>
                </div>
              )}

            </div>
          </div>
        )}

      </div>
    </div>
  );
}
