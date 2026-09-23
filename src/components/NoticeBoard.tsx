import { useState } from 'react';
import { usePressClub } from '../context/PressClubContext';
import AdvertisementBanner from './AdvertisementBanner';
import PrintFriendlyArticleModal from './PrintFriendlyArticleModal';
import { NoticeItem, NoticeCategory } from '../types';
import { requestPushPermission, getPushPermission, isPushSupported, sendLocalPushNotification } from '../utils/pushNotifications';
import { 
  BellRing, 
  Calendar as CalendarIcon, 
  FileText, 
  ChevronRight, 
  X, 
  Printer, 
  Download,
  AlertCircle,
  PlusCircle,
  CheckCircle2,
  XCircle,
  Clock,
  MapPin,
  Users,
  Search,
  CheckCheck,
  RotateCcw,
  Sparkles,
  ClipboardCheck,
  Newspaper,
  EyeOff,
  GraduationCap,
  Award,
  Layers,
  Filter
} from 'lucide-react';

export type NoticeFilterType = 'all' | 'local_news' | 'general' | 'training' | 'meeting' | 'award' | 'important';

// Helper function to resolve category accurately for any notice
export const getNoticeCategory = (n: NoticeItem): NoticeCategory => {
  if (n.category) {
    if (n.category === 'local_news') return 'local_news';
    if (n.category === 'general') return 'general';
    if (n.category === 'training') return 'training';
    if (n.category === 'meeting') return 'meeting';
    if (n.category === 'award') return 'award';
  }

  const text = `${n.title || ''} ${n.badge || ''} ${n.summary || ''} ${n.fullText || ''}`.toLowerCase();

  if (text.includes('পুরস্কার') || text.includes('স্বর্ণপদক') || text.includes('সম্মাননা') || text.includes('ফেলোশিপ') || text.includes('award')) {
    return 'award';
  }
  if (text.includes('প্রশিক্ষণ') || text.includes('কর্মশালা') || text.includes('ওয়ার্কশপ') || text.includes('মাস্টারক্লাস') || text.includes('training')) {
    return 'training';
  }
  if (text.includes('সভা') || text.includes('অধিবেশন') || text.includes('পরিষদ') || text.includes('বৈঠক') || text.includes('meeting')) {
    return 'meeting';
  }
  if (n.type === 'news' || text.includes('সংবাদ') || text.includes('প্রতিবেদন') || text.includes('ফিচার') || text.includes('রিপোর্ট') || text.includes('চলনবিল') || text.includes('নদী') || text.includes('বাঁধ') || text.includes('local')) {
    return 'local_news';
  }
  return 'general';
};

export const CATEGORY_DEFINITIONS: {
  id: NoticeFilterType;
  labelEn: string;
  labelBn: string;
  icon: typeof FileText;
  description: string;
  badgeBg: string;
  badgeText: string;
  badgeBorder: string;
  activeBtnClass: string;
}[] = [
  {
    id: 'all',
    labelEn: 'All',
    labelBn: 'সকল',
    icon: Layers,
    description: 'প্রেসক্লাবের সকল নোটিশ, সাধারণ ঘোষণা ও সংবাদ প্রতিবেদন',
    badgeBg: 'bg-slate-100',
    badgeText: 'text-slate-700',
    badgeBorder: 'border-slate-200',
    activeBtnClass: 'bg-[#0d3b66] text-white border-[#0d3b66] shadow-sm ring-2 ring-[#0d3b66]/20'
  },
  {
    id: 'local_news',
    labelEn: 'Local News',
    labelBn: 'স্থানীয় সংবাদ',
    icon: Newspaper,
    description: 'উল্লাপাড়া, চলনবিল ও সিরাজগঞ্জের স্থানীয় সংবাদ ও অনুসন্ধানী প্রতিবেদন',
    badgeBg: 'bg-blue-50',
    badgeText: 'text-blue-700',
    badgeBorder: 'border-blue-200',
    activeBtnClass: 'bg-blue-600 text-white border-blue-700 shadow-sm ring-2 ring-blue-500/20'
  },
  {
    id: 'general',
    labelEn: 'General',
    labelBn: 'সাধারণ',
    icon: FileText,
    description: 'সাধারণ নোটিশ, স্মারক প্রকাশনা, প্রশাসনিক বিজ্ঞপ্তি ও সদস্য সংক্রান্ত তথ্য',
    badgeBg: 'bg-emerald-50',
    badgeText: 'text-emerald-700',
    badgeBorder: 'border-emerald-200',
    activeBtnClass: 'bg-emerald-600 text-white border-emerald-700 shadow-sm ring-2 ring-emerald-500/20'
  },
  {
    id: 'training',
    labelEn: 'Training',
    labelBn: 'প্রশিক্ষণ',
    icon: GraduationCap,
    description: 'সাংবাদিকদের মোবাইল জার্নালিজম, ফ্যাক্ট-চেকিং ও দক্ষতা উন্নয়ন কর্মশালা',
    badgeBg: 'bg-indigo-50',
    badgeText: 'text-indigo-700',
    badgeBorder: 'border-indigo-200',
    activeBtnClass: 'bg-indigo-600 text-white border-indigo-700 shadow-sm ring-2 ring-indigo-500/20'
  },
  {
    id: 'meeting',
    labelEn: 'Meeting',
    labelBn: 'সভা ও অধিবেশন',
    icon: Users,
    description: 'কার্যনির্বাহী পরিষদ, সাধারণ সভা, সুবর্ণজয়ন্তী প্রস্তুতি ও জরুরি অধিবেশন',
    badgeBg: 'bg-purple-50',
    badgeText: 'text-purple-700',
    badgeBorder: 'border-purple-200',
    activeBtnClass: 'bg-purple-600 text-white border-purple-700 shadow-sm ring-2 ring-purple-500/20'
  },
  {
    id: 'award',
    labelEn: 'Award',
    labelBn: 'পুরস্কার ও সম্মাননা',
    icon: Award,
    description: 'বার্ষিক সাংবাদিকতা পুরস্কার, স্বর্ণপদক ও পেশাগত ফেলোশিপ ঘোষণা',
    badgeBg: 'bg-amber-100',
    badgeText: 'text-amber-900',
    badgeBorder: 'border-amber-300',
    activeBtnClass: 'bg-amber-500 text-slate-950 border-amber-600 font-black shadow-sm ring-2 ring-amber-500/30'
  },
  {
    id: 'important',
    labelEn: 'Urgent',
    labelBn: 'জরুরি',
    icon: Sparkles,
    description: 'সর্বোচ্চ অগ্রাধিকারপ্রাপ্ত জরুরি নোটিশ ও প্রেস রিলিজ',
    badgeBg: 'bg-rose-50',
    badgeText: 'text-rose-800',
    badgeBorder: 'border-rose-200',
    activeBtnClass: 'bg-rose-600 text-white border-rose-700 shadow-sm ring-2 ring-rose-500/20'
  }
];

export default function NoticeBoard() {
  const { 
    notices, 
    meetings, 
    updateAttendance, 
    markAllAttendance, 
    resetMeetingsToDefault,
    setIsAdminOpen 
  } = usePressClub();

  const [activeTab, setActiveTab] = useState<'notices' | 'calendar'>('calendar');
  const [selectedNotice, setSelectedNotice] = useState<NoticeItem | null>(null);
  const [printArticle, setPrintArticle] = useState<NoticeItem | null>(null);
  const [noticeSearch, setNoticeSearch] = useState<string>('');
  const [noticeFilter, setNoticeFilter] = useState<NoticeFilterType>('all');
  const [selectedMeetingId, setSelectedMeetingId] = useState<string>(meetings[0]?.meetingId || 'meet-01');
  const [attendeeSearch, setAttendeeSearch] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'present' | 'absent' | 'leave'>('all');
  const [attendanceSavedToast, setAttendanceSavedToast] = useState(false);

  // Push notification subscription state
  const [pushPermission, setPushPermission] = useState<NotificationPermission>(() => getPushPermission());
  const [pushMessage, setPushMessage] = useState<string | null>(null);

  const handleSubscribePush = async () => {
    const result = await requestPushPermission();
    setPushPermission(result);
    if (result === 'granted') {
      setPushMessage('নোটিফিকেশন সক্রিয় হয়েছে! এখন থেকে ব্রেকিং নিউজ সরাসরি স্ক্রিনে আসবে।');
    } else if (result === 'denied') {
      setPushMessage('নোটিফিকেশন পারমিশন বন্ধ। অনুগ্রহ করে ব্রাউজার সেটিংস থেকে Allow করুন।');
    }
    setTimeout(() => setPushMessage(null), 4000);
  };

  const handleTestPushNotice = async () => {
    await sendLocalPushNotification({
      title: '🔴 উল্লাপাড়া প্রেসক্লাব: ব্রেকিং নিউজ নোটিফিকেশন স্যাম্পল',
      body: 'প্রেসক্লাব নোটিশ বোর্ডে নতুন কোনো ব্রেকিং নিউজ বা জরুরি প্রেস বিজ্ঞপ্তি পোস্ট হলে এভাবেই আপনার স্ক্রিনে লাইভ অ্যালার্ট আসবে।',
      tag: 'sample-breaking',
      url: '#notices',
      isBreaking: true
    });
    setPushMessage('টেস্ট নোটিফিকেশন পাঠানো হয়েছে!');
    setTimeout(() => setPushMessage(null), 3500);
  };

  const currentMeeting = meetings.find(m => m.meetingId === selectedMeetingId) || meetings[0];

  // Attendance metrics calculation
  const totalAttendees = currentMeeting?.attendees?.length || 0;
  const presentCount = currentMeeting?.attendees?.filter(a => a.status === 'present').length || 0;
  const absentCount = currentMeeting?.attendees?.filter(a => a.status === 'absent').length || 0;
  const leaveCount = currentMeeting?.attendees?.filter(a => a.status === 'leave').length || 0;
  const attendancePercentage = totalAttendees > 0 ? Math.round((presentCount / totalAttendees) * 100) : 0;

  const filteredAttendees = currentMeeting?.attendees?.filter(att => {
    const matchesSearch = 
      att.memberName.toLowerCase().includes(attendeeSearch.toLowerCase()) ||
      att.designation.toLowerCase().includes(attendeeSearch.toLowerCase()) ||
      att.media.toLowerCase().includes(attendeeSearch.toLowerCase());
    const matchesFilter = statusFilter === 'all' || att.status === statusFilter;
    return matchesSearch && matchesFilter;
  }) || [];

  // Category counts
  const categoryCounts: Record<NoticeFilterType, number> = {
    all: notices.length,
    local_news: notices.filter(n => getNoticeCategory(n) === 'local_news').length,
    general: notices.filter(n => getNoticeCategory(n) === 'general').length,
    training: notices.filter(n => getNoticeCategory(n) === 'training').length,
    meeting: notices.filter(n => getNoticeCategory(n) === 'meeting').length,
    award: notices.filter(n => getNoticeCategory(n) === 'award').length,
    important: notices.filter(n => !!n.isImportant).length,
  };

  const filteredNotices = notices.filter(n => {
    const q = noticeSearch.trim().toLowerCase();
    const matchesSearch = 
      !q ||
      n.title.toLowerCase().includes(q) ||
      n.summary.toLowerCase().includes(q) ||
      (n.reporter && n.reporter.toLowerCase().includes(q)) ||
      (n.refNumber && n.refNumber.toLowerCase().includes(q)) ||
      (n.badge && n.badge.toLowerCase().includes(q));

    if (!matchesSearch) return false;
    if (noticeFilter === 'all') return true;
    if (noticeFilter === 'important') return !!n.isImportant;

    const noticeCat = getNoticeCategory(n);
    return noticeCat === noticeFilter;
  });

  const handleToggleStatus = (memberId: string, currentStatus: 'present' | 'absent' | 'leave') => {
    // Cycles smoothly: present -> absent -> leave -> present
    let nextStatus: 'present' | 'absent' | 'leave' = 'present';
    if (currentStatus === 'present') nextStatus = 'absent';
    else if (currentStatus === 'absent') nextStatus = 'leave';
    else nextStatus = 'present';

    updateAttendance(currentMeeting.meetingId, memberId, nextStatus);
    showSavedFeedback();
  };

  const showSavedFeedback = () => {
    setAttendanceSavedToast(true);
    setTimeout(() => setAttendanceSavedToast(false), 1500);
  };

  return (
    <section id="notices" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-10">
          <span className="text-amber-950 bg-amber-100 border border-amber-300 px-3.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider inline-flex items-center gap-1.5 shadow-xs">
            <ClipboardCheck className="w-3.5 h-3.5 text-amber-700" />
            সাংগঠনিক কার্যক্রম ও বিজ্ঞপ্তি
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#0d3b66] mt-3 font-serif">
            ইভেন্ট ক্যালেন্ডার, সভা ও নোটিশ বোর্ড
          </h2>
          <p className="text-slate-600 mt-3 text-base">
            প্রেসক্লাবের নিয়মিত কার্যবিবরণী, সভার উপস্থিতি পর্যবেক্ষণ ও গুরুত্বপূর্ণ প্রেস বিজ্ঞপ্তি
          </p>
          <div className="w-20 h-1 bg-amber-500 mx-auto mt-4 rounded-full"></div>
        </div>

        {/* Tab Switcher: Event Calendar & Attendance Tracker vs Notices */}
        <div className="flex justify-center mb-10">
          <div className="inline-flex p-1.5 bg-slate-100 rounded-2xl border border-slate-200 shadow-inner">
            <button
              onClick={() => setActiveTab('calendar')}
              className={`px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center gap-2 ${
                activeTab === 'calendar'
                  ? 'bg-[#0d3b66] text-white shadow-md'
                  : 'text-slate-600 hover:text-[#0d3b66] hover:bg-slate-200/60'
              }`}
            >
              <CalendarIcon className="w-4 h-4 text-amber-400" />
              <span>ইভেন্ট ক্যালেন্ডার ও উপস্থিতি ট্র্যাকার</span>
              <span className="px-2 py-0.5 text-[10px] rounded-full bg-amber-400 text-slate-950 font-extrabold">
                লাইভ ট্র্যাকার
              </span>
            </button>

            <button
              onClick={() => setActiveTab('notices')}
              className={`px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center gap-2 ${
                activeTab === 'notices'
                  ? 'bg-[#0d3b66] text-white shadow-md'
                  : 'text-slate-600 hover:text-[#0d3b66] hover:bg-slate-200/60'
              }`}
            >
              <Newspaper className="w-4 h-4 text-amber-400" />
              <span>সংবাদ, প্রেস রিলিজ ও নোটিশ ({notices.length})</span>
            </button>
          </div>
        </div>

        {/* TAB 1: EVENT CALENDAR & ATTENDANCE TRACKER */}
        {activeTab === 'calendar' && (
          <div className="space-y-8 animate-in fade-in duration-300">
            
            {/* Meeting Selector & Active Event Card */}
            <div className="bg-slate-50 border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-sm">
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-6 border-b border-slate-200">
                
                {/* Event Selector dropdown */}
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                    <CalendarIcon className="w-3.5 h-3.5 text-amber-600" />
                    সভা বা অনুষ্ঠানের বিবরণী নির্বাচন করুন:
                  </label>
                  <select
                    value={selectedMeetingId}
                    onChange={(e) => setSelectedMeetingId(e.target.value)}
                    className="w-full sm:w-auto px-4 py-2.5 text-sm font-bold text-[#0d3b66] bg-white border border-slate-300 rounded-xl shadow-xs focus:ring-2 focus:ring-amber-500 focus:outline-none"
                  >
                    {meetings.map((m) => (
                      <option key={m.meetingId} value={m.meetingId}>
                        {m.meetingTitle} ({m.date})
                      </option>
                    ))}
                  </select>
                </div>

                {/* Quick actions: Mark all present & Reset */}
                <div className="flex flex-wrap items-center gap-2.5">
                  <button
                    onClick={() => {
                      markAllAttendance(currentMeeting.meetingId, 'present');
                      showSavedFeedback();
                    }}
                    className="px-3.5 py-2 text-xs font-bold text-slate-950 bg-emerald-400 hover:bg-emerald-500 rounded-xl shadow-xs transition flex items-center gap-1.5"
                  >
                    <CheckCheck className="w-4 h-4" />
                    <span>সবাইকে উপস্থিত করুন</span>
                  </button>

                  <button
                    onClick={() => {
                      if (window.confirm('উপস্থিতি তালিকা পূর্বনির্ধারিত অবস্থায় ফিরিয়ে নিতে চান?')) {
                        resetMeetingsToDefault();
                        showSavedFeedback();
                      }
                    }}
                    className="px-3 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 bg-white border border-slate-300 rounded-xl transition flex items-center gap-1"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>রিসেট</span>
                  </button>
                </div>
              </div>

              {/* Event Details Overview */}
              <div className="mt-6 grid md:grid-cols-12 gap-6 items-center">
                <div className="md:col-span-8 space-y-3">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold bg-blue-100 text-[#0d3b66]">
                    <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                    অফিসিয়াল কার্যবিবরণী ও উপস্থিতি খাতা
                  </div>
                  <h3 className="text-xl sm:text-2xl font-bold font-serif text-[#0d3b66]">
                    {currentMeeting.meetingTitle}
                  </h3>
                  <div className="flex flex-wrap items-center gap-4 text-xs text-slate-600">
                    <span className="flex items-center gap-1 font-semibold text-amber-800 bg-amber-50 px-2.5 py-1 rounded-lg border border-amber-200">
                      <CalendarIcon className="w-3.5 h-3.5 text-amber-600" />
                      তারিখ: {currentMeeting.date}
                    </span>
                    <span className="flex items-center gap-1 text-slate-700 bg-white px-2.5 py-1 rounded-lg border border-slate-200">
                      <Clock className="w-3.5 h-3.5 text-blue-600" />
                      সময়: {currentMeeting.time}
                    </span>
                    <span className="flex items-center gap-1 text-slate-700 bg-white px-2.5 py-1 rounded-lg border border-slate-200">
                      <MapPin className="w-3.5 h-3.5 text-rose-500" />
                      স্থান: {currentMeeting.location}
                    </span>
                  </div>
                  <p className="text-xs sm:text-sm text-slate-600 bg-white p-3 rounded-xl border border-slate-200">
                    <strong className="text-slate-800">সভার আলোচ্যসূচি:</strong> {currentMeeting.agenda}
                  </p>
                </div>

                {/* Attendance Summary Stat Card */}
                <div className="md:col-span-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-500">উপস্থিতির হার</span>
                    <span className="text-lg font-extrabold text-[#0d3b66]">{attendancePercentage}%</span>
                  </div>
                  {/* Progress bar */}
                  <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-emerald-500 rounded-full transition-all duration-300"
                      style={{ width: `${attendancePercentage}%` }}
                    ></div>
                  </div>

                  <div className="grid grid-cols-3 gap-2 pt-2 text-center text-xs">
                    <div className="bg-emerald-50 border border-emerald-200 p-2 rounded-xl">
                      <div className="font-extrabold text-emerald-700 text-sm">{presentCount}</div>
                      <div className="text-[10px] text-emerald-900 font-semibold">উপস্থিত</div>
                    </div>
                    <div className="bg-rose-50 border border-rose-200 p-2 rounded-xl">
                      <div className="font-extrabold text-rose-700 text-sm">{absentCount}</div>
                      <div className="text-[10px] text-rose-900 font-semibold">অনুপস্থিত</div>
                    </div>
                    <div className="bg-amber-50 border border-amber-200 p-2 rounded-xl">
                      <div className="font-extrabold text-amber-700 text-sm">{leaveCount}</div>
                      <div className="text-[10px] text-amber-900 font-semibold">ছুটি</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Attendance Filter & Search Bar */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
              <div className="flex flex-wrap items-center gap-1.5 w-full sm:w-auto">
                <button
                  onClick={() => setStatusFilter('all')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                    statusFilter === 'all'
                      ? 'bg-[#0d3b66] text-white'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  সকল সদস্য ({totalAttendees})
                </button>
                <button
                  onClick={() => setStatusFilter('present')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                    statusFilter === 'present'
                      ? 'bg-emerald-600 text-white'
                      : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
                  }`}
                >
                  উপস্থিত ({presentCount})
                </button>
                <button
                  onClick={() => setStatusFilter('absent')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                    statusFilter === 'absent'
                      ? 'bg-rose-600 text-white'
                      : 'bg-rose-50 text-rose-700 hover:bg-rose-100'
                  }`}
                >
                  অনুপস্থিত ({absentCount})
                </button>
                <button
                  onClick={() => setStatusFilter('leave')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                    statusFilter === 'leave'
                      ? 'bg-amber-600 text-white'
                      : 'bg-amber-50 text-amber-800 hover:bg-amber-100'
                  }`}
                >
                  ছুটিতে ({leaveCount})
                </button>
              </div>

              <div className="relative w-full sm:w-64">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={attendeeSearch}
                  onChange={(e) => setAttendeeSearch(e.target.value)}
                  placeholder="সদস্যের নাম বা গণমাধ্যম..."
                  className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>
            </div>

            {/* Attendance Toggle Roster List */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
              <div className="px-6 py-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
                <div className="text-xs font-bold text-slate-700 flex items-center gap-2">
                  <Users className="w-4 h-4 text-[#0d3b66]" />
                  <span>সদস্যদের উপস্থিতি তালিকা (টগল বাটনে চাপ দিয়ে উপস্থিতি নির্ধারণ করুন):</span>
                </div>
                {attendanceSavedToast && (
                  <span className="text-[11px] font-bold text-emerald-700 bg-emerald-100 px-2.5 py-0.5 rounded-full animate-in fade-in">
                    উপস্থিতি হালনাগাদ সংরক্ষিত!
                  </span>
                )}
              </div>

              <div className="divide-y divide-slate-100">
                {filteredAttendees.map((att, index) => (
                  <div 
                    key={att.memberId}
                    className="p-4 sm:px-6 hover:bg-slate-50/80 transition flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <span className="w-6 text-xs font-mono font-bold text-slate-400 shrink-0">
                        {index + 1}.
                      </span>
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <h4 className="text-sm font-bold text-[#0d3b66] font-serif truncate">
                            {att.memberName}
                          </h4>
                          <span className="px-2 py-0.5 text-[10px] font-semibold bg-slate-100 text-slate-700 rounded-md shrink-0">
                            {att.designation}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-xs text-slate-500 mt-0.5">
                          <span className="truncate">{att.media}</span>
                          {att.note && (
                            <span className="text-[11px] text-amber-700 bg-amber-50 px-1.5 py-0.2 rounded border border-amber-200 italic">
                              {att.note}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Simple Toggle-Based Segmented Control */}
                    <div className="flex items-center gap-1.5 self-end sm:self-center shrink-0">
                      {/* 1. Present Button */}
                      <button
                        onClick={() => {
                          updateAttendance(currentMeeting.meetingId, att.memberId, 'present');
                          showSavedFeedback();
                        }}
                        className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
                          att.status === 'present'
                            ? 'bg-emerald-600 text-white shadow-xs'
                            : 'bg-slate-100 text-slate-500 hover:bg-emerald-50 hover:text-emerald-700'
                        }`}
                        title="উপস্থিত চিহ্নিত করুন"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>উপস্থিত</span>
                      </button>

                      {/* 2. Absent Button */}
                      <button
                        onClick={() => {
                          updateAttendance(currentMeeting.meetingId, att.memberId, 'absent');
                          showSavedFeedback();
                        }}
                        className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
                          att.status === 'absent'
                            ? 'bg-rose-600 text-white shadow-xs'
                            : 'bg-slate-100 text-slate-500 hover:bg-rose-50 hover:text-rose-700'
                        }`}
                        title="অনুপস্থিত চিহ্নিত করুন"
                      >
                        <XCircle className="w-3.5 h-3.5" />
                        <span>অনুপস্থিত</span>
                      </button>

                      {/* 3. Leave Button */}
                      <button
                        onClick={() => {
                          updateAttendance(currentMeeting.meetingId, att.memberId, 'leave');
                          showSavedFeedback();
                        }}
                        className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
                          att.status === 'leave'
                            ? 'bg-amber-500 text-slate-950 shadow-xs'
                            : 'bg-slate-100 text-slate-500 hover:bg-amber-50 hover:text-amber-800'
                        }`}
                        title="ছুটি বা অনুমতিপ্রাপ্ত"
                      >
                        <Clock className="w-3.5 h-3.5" />
                        <span>ছুটি</span>
                      </button>

                      {/* Quick One-Click Cycle Toggle */}
                      <button
                        onClick={() => handleToggleStatus(att.memberId, att.status)}
                        className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-200 rounded-lg transition ml-1"
                        title="পরবর্তী স্ট্যাটাসে টগল করুন (Click to cycle status)"
                      >
                        <RotateCcw className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        )}

        {/* TAB 2: NOTICES & NEWS LIST */}
        {activeTab === 'notices' && (
          <div className="space-y-6 animate-in fade-in duration-300">
            
            {/* Filter, Search & Print Notice Bar */}
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 sm:p-5 shadow-xs">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                
                {/* Search Box */}
                <div className="relative flex-1">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={noticeSearch}
                    onChange={(e) => setNoticeSearch(e.target.value)}
                    placeholder="সংবাদ, বিজ্ঞপ্তি বা স্মারক নম্বর দিয়ে অনুসন্ধান করুন..."
                    className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-[#0d3b66] transition placeholder:text-slate-400"
                  />
                  {noticeSearch && (
                    <button
                      onClick={() => setNoticeSearch('')}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 text-xs"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </div>

                {/* Filter Categories */}
                <div className="flex flex-wrap items-center gap-1.5">
                  {CATEGORY_DEFINITIONS.map((cat) => {
                    const Icon = cat.icon;
                    const isActive = noticeFilter === cat.id;
                    const count = categoryCounts[cat.id];

                    return (
                      <button
                        key={cat.id}
                        onClick={() => setNoticeFilter(cat.id)}
                        className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                          isActive
                            ? cat.activeBtnClass
                            : 'bg-white text-slate-700 hover:bg-slate-200/70 border border-slate-200'
                        }`}
                        title={cat.description}
                      >
                        <Icon className="w-3.5 h-3.5 shrink-0" />
                        <span>{cat.labelEn}</span>
                        <span className="hidden sm:inline text-[11px] opacity-75">({cat.labelBn})</span>
                        <span className={`ml-0.5 px-1.5 py-0.2 rounded-full text-[10px] ${
                          isActive ? 'bg-black/20 text-white font-mono' : 'bg-slate-100 text-slate-600 font-mono'
                        }`}>
                          {count}
                        </span>
                      </button>
                    );
                  })}
                </div>

              </div>

              {/* Print feature callout notice banner */}
              <div className="mt-3 pt-3 border-t border-slate-200/80 flex items-center justify-between text-[11px] sm:text-xs text-slate-600">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                  <span>
                    কাগজে বা ফাইলে সংরক্ষণের জন্য প্রতিটি সংবাদের <strong>'প্রিন্ট'</strong> বাটনে ক্লিক করে বিজ্ঞাপন ও হেডারমুক্ত পরিচ্ছন্ন সংস্করণ সংগ্রহ করা যাবে।
                  </span>
                </div>
                <div className="hidden sm:flex items-center gap-1 text-slate-500 font-medium">
                  <Printer className="w-3.5 h-3.5 text-amber-600" />
                  <span>A4 পেজ ও পিডিএফ প্রস্তুত</span>
                </div>
              </div>
            </div>

            {/* Active filter / results summary banner */}
            {(noticeFilter !== 'all' || noticeSearch.trim()) && (
              <div className="flex flex-wrap items-center justify-between gap-2 px-4 py-2.5 bg-slate-100/80 rounded-xl text-xs text-slate-700 border border-slate-200">
                <div className="flex items-center gap-2">
                  <Filter className="w-3.5 h-3.5 text-[#0d3b66]" />
                  <span>
                    ফিল্টার: <strong>{CATEGORY_DEFINITIONS.find(c => c.id === noticeFilter)?.labelEn} ({CATEGORY_DEFINITIONS.find(c => c.id === noticeFilter)?.labelBn})</strong>
                    {noticeSearch.trim() && <> • অনুসন্ধান: "{noticeSearch}"</>}
                    {' • '}
                    ফলাফল: <strong>{filteredNotices.length}টি</strong>
                  </span>
                </div>
                <button
                  onClick={() => {
                    setNoticeFilter('all');
                    setNoticeSearch('');
                  }}
                  className="text-xs text-[#0d3b66] hover:underline font-bold cursor-pointer"
                >
                  সকল দেখুন (ফিল্টার রিসেট)
                </button>
              </div>
            )}

            <div className="grid lg:grid-cols-12 gap-8 items-start">
              
              {/* Articles List */}
              <div className="lg:col-span-8 space-y-4">
                {filteredNotices.length === 0 ? (
                  <div className="p-12 text-center bg-slate-50 rounded-2xl border border-slate-200 text-slate-500">
                    <AlertCircle className="w-10 h-10 text-slate-400 mx-auto mb-3" />
                    <p className="text-sm font-bold text-slate-700">কোনো নোটিশ বা সংবাদ খুঁজে পাওয়া যায়নি</p>
                    <p className="text-xs text-slate-500 mt-1">
                      '{CATEGORY_DEFINITIONS.find(c => c.id === noticeFilter)?.labelEn}' ক্যাটাগরিতে এই ফিল্টারে কোনো তথ্য মেলেনি।
                    </p>
                    <button
                      onClick={() => {
                        setNoticeFilter('all');
                        setNoticeSearch('');
                      }}
                      className="mt-4 px-4 py-2 bg-[#0d3b66] text-white text-xs font-bold rounded-xl hover:bg-slate-800 transition cursor-pointer"
                    >
                      সকল ক্যাটাগরি দেখুন (Reset)
                    </button>
                  </div>
                ) : (
                  filteredNotices.map((notice) => {
                    const noticeCat = getNoticeCategory(notice);
                    const catDef = CATEGORY_DEFINITIONS.find(c => c.id === noticeCat);
                    const CatIcon = catDef?.icon || FileText;

                    return (
                      <div 
                        key={notice.id}
                        onClick={() => setSelectedNotice(notice)}
                        className={`p-5 sm:p-6 rounded-2xl border transition-all duration-200 cursor-pointer flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 ${
                          notice.isImportant 
                            ? 'bg-amber-50/40 border-slate-200 border-l-4 border-l-amber-500 hover:shadow-md' 
                            : 'bg-white border-slate-200 border-l-4 border-l-[#0d3b66] hover:shadow-md'
                        }`}
                      >
                        <div className="space-y-2 flex-1">
                          <div className="flex flex-wrap items-center gap-2">
                            {/* Category Badge Pill */}
                            {catDef && (
                              <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded text-[11px] font-bold border ${catDef.badgeBg} ${catDef.badgeText} ${catDef.badgeBorder}`}>
                                <CatIcon className="w-3 h-3" />
                                <span>{catDef.labelEn}</span>
                                <span className="opacity-70 text-[10px]">({catDef.labelBn})</span>
                              </span>
                            )}

                            <span className={`px-2.5 py-0.5 rounded text-[11px] font-bold ${
                              notice.isImportant 
                                ? 'bg-amber-500 text-slate-950' 
                                : 'bg-[#0d3b66] text-white'
                            }`}>
                              {notice.badge}
                            </span>
                            
                            <span className="flex items-center gap-1 text-xs text-slate-500 font-medium">
                              <CalendarIcon className="w-3.5 h-3.5 text-amber-600" />
                              {notice.date}
                            </span>

                            {notice.refNumber && (
                              <span className="text-[10px] font-mono bg-slate-100 text-slate-600 px-2 py-0.5 rounded border border-slate-200">
                                স্মারক: {notice.refNumber}
                              </span>
                            )}

                            {notice.reporter && (
                              <span className="text-[11px] text-slate-500 font-medium">
                                • {notice.reporter}
                              </span>
                            )}
                          </div>

                          <h3 className="text-base sm:text-lg font-bold text-[#0d3b66] font-serif hover:text-amber-600 transition leading-snug">
                            {notice.title}
                          </h3>

                          <p className="text-xs sm:text-sm text-slate-600 line-clamp-2 leading-relaxed">
                            {notice.summary}
                          </p>
                        </div>

                        {/* Action buttons: Print Utility Button + Full View */}
                        <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setPrintArticle(notice);
                            }}
                            className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-bold text-slate-900 bg-amber-400 hover:bg-amber-300 rounded-xl transition shadow-xs border border-amber-500/30 cursor-pointer"
                            title="বিজ্ঞাপন ও হেডার মুক্ত প্রিন্ট-বান্ধব সংস্করণ ও মুদ্রণ"
                          >
                            <Printer className="w-3.5 h-3.5 text-slate-950" />
                            <span>প্রিন্ট</span>
                          </button>

                          <button 
                            onClick={() => setSelectedNotice(notice)}
                            className="inline-flex items-center gap-1 px-3.5 py-2 text-xs font-bold text-[#0d3b66] bg-slate-100 hover:bg-[#0d3b66] hover:text-white rounded-xl transition shadow-xs cursor-pointer"
                          >
                            <span>সম্পূর্ণ পড়ুন</span>
                            <ChevronRight className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    );
                  })
                )}

                {/* Quick Notice Admin Trigger */}
                <div className="pt-2 text-center">
                  <button
                    onClick={() => setIsAdminOpen(true)}
                    className="inline-flex items-center gap-2 text-xs text-slate-500 hover:text-[#0d3b66] font-semibold transition cursor-pointer"
                  >
                    <PlusCircle className="w-4 h-4" />
                    <span>নতুন নোটিশ বা প্রেস বিজ্ঞপ্তি প্রকাশ করতে অ্যাডমিন প্যানেলে যান</span>
                  </button>
                </div>
              </div>

              {/* Sidebar Ad, Push Notifications & Notice Info */}
              <div className="lg:col-span-4 space-y-5">
                {/* Push Notification Subscription Widget */}
                <div className="p-5 rounded-2xl bg-gradient-to-br from-red-950 via-[#0d3b66] to-slate-900 text-white shadow-lg border border-red-500/40 space-y-3 relative overflow-hidden">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-lg bg-red-600 flex items-center justify-center text-white shadow-sm shrink-0">
                        <BellRing className="w-4 h-4 animate-pulse" />
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-white font-serif leading-tight">
                          ব্রেকিং নিউজ পুশ অ্যালার্ট
                        </h4>
                        <p className="text-[11px] text-red-200">তাৎক্ষণিক ব্রাউজার নোটিফিকেশন</p>
                      </div>
                    </div>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      pushPermission === 'granted'
                        ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                        : 'bg-amber-400/20 text-amber-300 border border-amber-400/40'
                    }`}>
                      {pushPermission === 'granted' ? 'সক্রিয়' : 'বন্ধ'}
                    </span>
                  </div>

                  <p className="text-xs text-slate-200 leading-relaxed">
                    {pushPermission === 'granted'
                      ? 'আপনার ডিভাইসে পুশ নোটিফিকেশন সক্রিয় রয়েছে। নতুন কোনো ব্রেকিং নিউজ বা জরুরি প্রেস বিজ্ঞপ্তি প্রকাশের সাথে সাথেই স্বয়ংক্রিয়ভাবে আপনার ডিভাইসে নোটিফিকেশন পৌঁছে যাবে।'
                      : 'প্রেসক্লাব নোটিশ বোর্ডে নতুন কোনো ব্রেকিং নিউজ বা জরুরি বিজ্ঞপ্তি প্রকাশিত হওয়ামাত্রই সবার আগে আপনার ডিভাইসে নোটিফিকেশন পান।'}
                  </p>

                  {pushMessage && (
                    <div className="p-2.5 bg-white/10 rounded-lg text-xs text-amber-300 border border-white/15 font-medium">
                      {pushMessage}
                    </div>
                  )}

                  <div className="pt-1">
                    {pushPermission !== 'granted' ? (
                      <button
                        onClick={handleSubscribePush}
                        className="w-full py-2 bg-gradient-to-r from-red-600 to-amber-500 hover:from-red-500 hover:to-amber-400 text-slate-950 font-bold text-xs rounded-xl shadow-md transition flex items-center justify-center gap-1.5 cursor-pointer"
                      >
                        <BellRing className="w-3.5 h-3.5 text-slate-950" />
                        <span>নোটিফিকেশন সক্রিয় করুন</span>
                      </button>
                    ) : (
                      <button
                        onClick={handleTestPushNotice}
                        className="w-full py-2 bg-white/10 hover:bg-white/20 text-white font-bold text-xs rounded-xl border border-white/20 transition flex items-center justify-center gap-1.5 cursor-pointer"
                      >
                        <BellRing className="w-3.5 h-3.5 text-amber-400" />
                        <span>নোটিফিকেশন টেস্ট করুন</span>
                      </button>
                    )}
                  </div>
                </div>

                <AdvertisementBanner variant="sidebar" />

                <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                  <div className="flex items-center gap-2 text-[#0d3b66]">
                    <Printer className="w-4 h-4 text-amber-600" />
                    <h4 className="text-xs font-bold uppercase tracking-wider">
                      প্রিন্ট ও ডিজিটাল আর্কাইভ
                    </h4>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    উল্লাপাড়া প্রেসক্লাবের সকল আনুষ্ঠানিক বিজ্ঞপ্তি, রেজোলিউশন ও প্রেস রিলিজ অফিসিয়াল স্মারক নম্বরসহ ডিজিটাল আর্কাইভে সংরক্ষিত থাকে। যেকোনো সংবাদ বা বিজ্ঞপ্তি বিজ্ঞাপনমুক্ত পরিচ্ছন্ন লেআউটে সরাসরি প্রিন্ট অথবা পিডিএফ হিসেবে সংরক্ষণ করা যায়।
                  </p>
                  <div className="pt-2 border-t border-slate-200/60 text-[11px] text-slate-500">
                    আইসিটি পার্টনার: <strong>Sristi Communication</strong>
                  </div>
                </div>
              </div>

            </div>
          </div>
        )}

        {/* Modal for viewing notice details */}
        {selectedNotice && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
            <div className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]">
              
              {/* Modal Header */}
              <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
                <div className="flex flex-wrap items-center gap-2">
                  <FileText className="w-5 h-5 text-amber-600 shrink-0" />
                  {(() => {
                    const noticeCat = getNoticeCategory(selectedNotice);
                    const catDef = CATEGORY_DEFINITIONS.find(c => c.id === noticeCat);
                    return catDef ? (
                      <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-bold border ${catDef.badgeBg} ${catDef.badgeText} ${catDef.badgeBorder}`}>
                        {catDef.labelEn} ({catDef.labelBn})
                      </span>
                    ) : null;
                  })()}
                  <span className="text-xs font-bold uppercase tracking-wider text-[#0d3b66]">
                    {selectedNotice.badge}
                  </span>
                  {selectedNotice.refNumber && (
                    <span className="text-[10px] font-mono bg-white text-slate-600 px-2 py-0.5 rounded border border-slate-200">
                      {selectedNotice.refNumber}
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      setPrintArticle(selectedNotice);
                    }}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-slate-900 bg-amber-400 hover:bg-amber-300 rounded-lg transition shadow-xs cursor-pointer"
                    title="বিজ্ঞাপন ও হেডার মুক্ত প্রিন্ট সংস্করণ খুলুন"
                  >
                    <Printer className="w-3.5 h-3.5 text-slate-950" />
                    <span>প্রিন্ট ভিউ</span>
                  </button>

                  <button
                    onClick={() => setSelectedNotice(null)}
                    className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-200 transition cursor-pointer"
                    aria-label="Close"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Modal Body */}
              <div className="p-6 overflow-y-auto space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-slate-500 font-medium">
                  <div className="flex items-center gap-1.5">
                    <CalendarIcon className="w-4 h-4 text-amber-600" />
                    <span>প্রকাশের তারিখ: {selectedNotice.date}</span>
                  </div>
                  {selectedNotice.location && (
                    <span className="text-slate-600">স্থান: {selectedNotice.location}</span>
                  )}
                </div>

                <h3 className="text-xl font-bold text-[#0d3b66] font-serif leading-snug">
                  {selectedNotice.title}
                </h3>

                {selectedNotice.reporter && (
                  <p className="text-xs text-slate-600 font-medium">
                    প্রতিবেদক: <strong className="text-slate-800">{selectedNotice.reporter}</strong>
                  </p>
                )}

                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 text-sm text-slate-700 leading-relaxed whitespace-pre-line">
                  {selectedNotice.fullText || selectedNotice.content}
                </div>

                {selectedNotice.signatory && (
                  <div className="pt-4 border-t border-slate-100 flex justify-end">
                    <div className="text-right">
                      <p className="text-xs font-bold text-slate-800">আদেশক্রমে</p>
                      <p className="text-sm font-serif font-bold text-[#0d3b66]">{selectedNotice.signatory}</p>
                      <p className="text-xs text-slate-500">উল্লাপাড়া প্রেসক্লাব কার্যনির্বাহী পরিষদ</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Modal Footer */}
              <div className="px-6 py-3 border-t border-slate-100 bg-slate-50 flex items-center justify-between">
                <button
                  onClick={() => {
                    setPrintArticle(selectedNotice);
                  }}
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-900 bg-amber-400 hover:bg-amber-300 px-3.5 py-2 rounded-xl transition border border-amber-500/40 shadow-xs cursor-pointer"
                >
                  <Printer className="w-4 h-4 text-slate-950" />
                  <span>বিজ্ঞাপনমুক্ত প্রিন্ট সংস্করণ (Print View)</span>
                </button>

                <button
                  onClick={() => setSelectedNotice(null)}
                  className="px-4 py-2 text-xs font-bold text-white bg-[#0d3b66] hover:bg-slate-800 rounded-xl transition cursor-pointer"
                >
                  বন্ধ করুন
                </button>
              </div>

            </div>
          </div>
        )}

        {/* Print-Friendly Article Modal */}
        <PrintFriendlyArticleModal 
          article={printArticle} 
          onClose={() => setPrintArticle(null)} 
        />

      </div>
    </section>
  );
}
