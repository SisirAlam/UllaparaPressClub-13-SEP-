import { useState, useMemo } from 'react';
import { usePressClub } from '../context/PressClubContext';
import { PressClubEvent, EventCategory } from '../types';
import SectionActionToolbar from './SectionActionToolbar';
import {
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
  Clock,
  MapPin,
  Users,
  UserCheck,
  PlusCircle,
  Download,
  Share2,
  CheckCircle2,
  CalendarCheck,
  BookOpen,
  Mic,
  Sparkles,
  Search,
  Filter,
  X,
  ExternalLink,
  Info
} from 'lucide-react';
import {
  BANGLA_MONTHS,
  BANGLA_DAYS_SAT_START,
  toBanglaNumber,
  getCalendarGrid,
  generateIcsFile,
  getGoogleCalendarUrl,
  formatDateString
} from '../utils/calendarUtils';

const CATEGORY_CONFIG: Record<EventCategory, { label: string; bg: string; text: string; border: string; dot: string }> = {
  meeting: {
    label: 'সভা ও সম্মেলন',
    bg: 'bg-blue-50',
    text: 'text-blue-700',
    border: 'border-blue-200',
    dot: 'bg-blue-600'
  },
  training: {
    label: 'প্রশিক্ষণ ও কর্মশালা',
    bg: 'bg-emerald-50',
    text: 'text-emerald-700',
    border: 'border-emerald-200',
    dot: 'bg-emerald-600'
  },
  press_briefing: {
    label: 'প্রেস ব্রিফিং',
    bg: 'bg-amber-50',
    text: 'text-amber-800',
    border: 'border-amber-200',
    dot: 'bg-amber-500'
  },
  cultural: {
    label: 'সাংস্কৃতিক অনুষ্ঠান',
    bg: 'bg-purple-50',
    text: 'text-purple-700',
    border: 'border-purple-200',
    dot: 'bg-purple-600'
  },
  jubilee: {
    label: 'সুবর্ণজয়ন্তী ২০২৭',
    bg: 'bg-rose-50',
    text: 'text-rose-700',
    border: 'border-rose-200',
    dot: 'bg-rose-600'
  }
};

export default function EventCalendar() {
  const { events, addEvent, isAdminAuthenticated } = usePressClub();

  // Current simulation reference date: September 2026
  const TODAY_STR = '2026-09-22';
  const [currentYear, setCurrentYear] = useState<number>(2026);
  const [currentMonth, setCurrentMonth] = useState<number>(8); // 8 = September (0-indexed)
  const [selectedDateStr, setSelectedDateStr] = useState<string>('2026-09-25');
  const [activeCategoryFilter, setActiveCategoryFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  
  // Modals & Feedback
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isRsvpModalOpen, setIsRsvpModalOpen] = useState(false);
  const [selectedEventForRsvp, setSelectedEventForRsvp] = useState<PressClubEvent | null>(null);
  const [rsvpFormData, setRsvpFormData] = useState({ name: '', media: '', phone: '', note: '' });
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // New Event Form State
  const [newEventForm, setNewEventForm] = useState({
    title: '',
    date: '2026-10-15',
    time: 'সকাল ১০:০০ ঘটিকা',
    location: 'উল্লাপাড়া প্রেসক্লাব মিলনায়তন',
    category: 'training' as EventCategory,
    organizer: 'উল্লাপাড়া প্রেসক্লাব',
    chiefGuest: '',
    speaker: '',
    description: '',
    registrationOpen: true,
    contactPerson: 'মোঃ আলমগীর হোসেন',
    contactPhone: '০১৭৫৩-৯৭২৮৮৯',
    tags: 'প্রশিক্ষণ, কর্মশালা'
  });

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Filter events according to category & search
  const filteredEvents = useMemo(() => {
    return events.filter(evt => {
      const matchCategory = activeCategoryFilter === 'all' || evt.category === activeCategoryFilter;
      const matchSearch = searchQuery.trim() === '' || 
        evt.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        evt.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        evt.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (evt.chiefGuest && evt.chiefGuest.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (evt.tags && evt.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase())));
      return matchCategory && matchSearch;
    });
  }, [events, activeCategoryFilter, searchQuery]);

  // Map events by date string 'YYYY-MM-DD'
  const eventsByDate = useMemo(() => {
    const map = new Map<string, PressClubEvent[]>();
    filteredEvents.forEach(evt => {
      const existing = map.get(evt.date) || [];
      existing.push(evt);
      map.set(evt.date, existing);
    });
    return map;
  }, [filteredEvents]);

  // Calendar cells for current active month & year
  const calendarDays = useMemo(() => {
    return getCalendarGrid(currentYear, currentMonth, TODAY_STR);
  }, [currentYear, currentMonth]);

  // Events on the currently selected date
  const selectedDateEvents = useMemo(() => {
    return events.filter(evt => evt.date === selectedDateStr);
  }, [events, selectedDateStr]);

  // Upcoming events from today onwards (sorted chronologically)
  const upcomingEvents = useMemo(() => {
    return [...events]
      .filter(evt => evt.date >= TODAY_STR)
      .sort((a, b) => a.date.localeCompare(b.date))
      .slice(0, 5);
  }, [events]);

  // Navigation handlers
  const handlePrevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear(prev => prev - 1);
    } else {
      setCurrentMonth(prev => prev - 1);
    }
  };

  const handleNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear(prev => prev + 1);
    } else {
      setCurrentMonth(prev => prev + 1);
    }
  };

  const handleJumpToToday = () => {
    const today = new Date(2026, 8, 22); // Simulated Sep 22, 2026
    setCurrentYear(today.getFullYear());
    setCurrentMonth(today.getMonth());
    setSelectedDateStr(TODAY_STR);
  };

  const handleSelectEvent = (evt: PressClubEvent) => {
    setSelectedDateStr(evt.date);
    const [y, m] = evt.date.split('-').map(Number);
    setCurrentYear(y);
    setCurrentMonth(m - 1);
  };

  const handleExportIcs = (evt: PressClubEvent) => {
    const icsContent = generateIcsFile({
      title: evt.title,
      description: evt.description,
      location: evt.location,
      date: evt.date,
      time: evt.time
    });
    const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `pressclub-event-${evt.date}.ics`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    showToast('ইভেন্টের .ics ক্যালেন্ডার ফাইল সফলভাবে ডাউনলোড হয়েছে!');
  };

  const handleCopyEventLink = (evt: PressClubEvent) => {
    const shareText = `📌 উল্লাপাড়া প্রেসক্লাব ইভেন্ট:\n${evt.title}\n🗓 তারিখ: ${evt.dateBangla}\n⏰ সময়: ${evt.time}\n📍 স্থান: ${evt.location}`;
    if (navigator.clipboard) {
      navigator.clipboard.writeText(shareText);
      showToast('ইভেন্টের বিস্তারিত ক্লিপবোর্ডে কপি হয়েছে!');
    }
  };

  const handleOpenRsvp = (evt: PressClubEvent) => {
    setSelectedEventForRsvp(evt);
    setIsRsvpModalOpen(true);
  };

  const handleSubmitRsvp = (e: React.FormEvent) => {
    e.preventDefault();
    if (!rsvpFormData.name || !rsvpFormData.media) {
      alert('অনুগ্রহ করে নাম এবং গণমাধ্যমের নাম প্রদান করুন।');
      return;
    }
    setIsRsvpModalOpen(false);
    setRsvpFormData({ name: '', media: '', phone: '', note: '' });
    showToast(`ধন্যবাদ ${rsvpFormData.name}! "${selectedEventForRsvp?.title.slice(0, 25)}..." ইভেন্টে আপনার আসন সংরক্ষিত হয়েছে।`);
  };

  const handleCreateEvent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEventForm.title.trim() || !newEventForm.date) {
      alert('অনুগ্রহ করে ইভেন্টের শিরোনাম এবং তারিখ প্রদান করুন।');
      return;
    }

    const dateObj = new Date(newEventForm.date);
    const banglaDay = toBanglaNumber(dateObj.getDate());
    const banglaMonth = BANGLA_MONTHS[dateObj.getMonth()];
    const banglaYear = toBanglaNumber(dateObj.getFullYear());
    const dateBangla = `${banglaDay} ${banglaMonth}, ${banglaYear}`;

    addEvent({
      title: newEventForm.title.trim(),
      date: newEventForm.date,
      dateBangla,
      time: newEventForm.time,
      location: newEventForm.location,
      category: newEventForm.category,
      categoryName: CATEGORY_CONFIG[newEventForm.category].label,
      organizer: newEventForm.organizer,
      chiefGuest: newEventForm.chiefGuest || undefined,
      speaker: newEventForm.speaker || undefined,
      description: newEventForm.description,
      registrationOpen: newEventForm.registrationOpen,
      contactPerson: newEventForm.contactPerson,
      contactPhone: newEventForm.contactPhone,
      badge: 'নতুন ইভেন্ট',
      tags: newEventForm.tags.split(',').map(t => t.trim()).filter(Boolean)
    });

    setIsAddModalOpen(false);
    setSelectedDateStr(newEventForm.date);
    const [y, m] = newEventForm.date.split('-').map(Number);
    setCurrentYear(y);
    setCurrentMonth(m - 1);
    showToast('নতুন ইভেন্টটি ক্যালেন্ডারে সফলভাবে যুক্ত হয়েছে!');
  };

  return (
    <section id="events" className="py-16 bg-slate-50 border-b border-slate-200 scroll-mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-10">
          <div className="flex items-center justify-center gap-3 mb-3 flex-wrap">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-100 text-blue-800 text-xs font-semibold border border-blue-200">
              <CalendarIcon className="w-3.5 h-3.5 text-blue-700" />
              <span>কার্যক্রম ও একাডেমি ক্যালেন্ডার</span>
            </div>
            <SectionActionToolbar sectionId="events" sectionTitle="ইভেন্ট ও সময়সূচী ক্যালেন্ডার" />
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
            প্রেসক্লাব ইভেন্ট ও সময়সূচী
          </h2>
          <p className="mt-3 text-slate-600 text-sm sm:text-base leading-relaxed">
            উল্লাপাড়া প্রেসক্লাবের সকল আনুষ্ঠানিক সাধারণ সভা, সাংবাদিকদের প্রশিক্ষণ কর্মশালা, প্রেস ব্রিফিং ও সুবর্ণজয়ন্তী ২০২৭ উদযাপনের বিস্তারিত সময়সূচী। তারিখে ক্লিক করে ইভেন্টের পূর্ণাঙ্গ তথ্য দেখুন।
          </p>
        </div>

        {/* Filter Bar & Controls */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-4 sm:p-5 mb-8">
          <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4">
            {/* Category Filter Tabs */}
            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={() => setActiveCategoryFilter('all')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  activeCategoryFilter === 'all'
                    ? 'bg-[#0d3b66] text-white shadow-sm'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                সব ইভেন্ট ({events.length})
              </button>
              {(Object.keys(CATEGORY_CONFIG) as EventCategory[]).map(catKey => {
                const config = CATEGORY_CONFIG[catKey];
                const count = events.filter(e => e.category === catKey).length;
                return (
                  <button
                    key={catKey}
                    type="button"
                    onClick={() => setActiveCategoryFilter(catKey)}
                    className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all border ${
                      activeCategoryFilter === catKey
                        ? `${config.bg} ${config.text} ${config.border} ring-2 ring-blue-500/20 shadow-xs`
                        : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    <span className={`w-2 h-2 rounded-full ${config.dot}`} />
                    <span>{config.label}</span>
                    <span className="text-[10px] opacity-70">({count})</span>
                  </button>
                );
              })}
            </div>

            {/* Search and Action Buttons */}
            <div className="flex items-center gap-2">
              <div className="relative flex-grow sm:flex-grow-0 sm:w-64">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="ইভেন্ট বা কর্মশালা খুঁজুন..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-800"
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery('')}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              <button
                type="button"
                onClick={() => setIsAddModalOpen(true)}
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs transition-colors shrink-0"
              >
                <PlusCircle className="w-4 h-4" />
                <span>ইভেন্ট যোগ করুন</span>
              </button>
            </div>
          </div>
        </div>

        {/* Main Grid: Calendar on Left, Event Inspector on Right */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Calendar View (7 cols on lg) */}
          <div className="lg:col-span-7 bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
            {/* Calendar Month Header */}
            <div className="p-4 sm:p-5 border-b border-slate-200 bg-slate-50/70 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <h3 className="text-lg sm:text-xl font-bold text-slate-900">
                  {BANGLA_MONTHS[currentMonth]} {toBanglaNumber(currentYear)}
                </h3>
                <span className="text-xs text-slate-500 font-medium hidden sm:inline">
                  ({new Date(currentYear, currentMonth, 1).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })})
                </span>
              </div>

              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={handleJumpToToday}
                  className="px-2.5 py-1 text-xs font-semibold bg-white border border-slate-200 rounded-md text-slate-700 hover:bg-slate-100 hover:text-blue-700 transition-colors"
                  title="চলতি তারিখে ফিরে যান"
                >
                  আজ
                </button>
                <button
                  type="button"
                  onClick={handlePrevMonth}
                  className="p-1.5 text-slate-600 hover:text-slate-900 hover:bg-slate-200 rounded-md transition-colors"
                  title="পূর্ববর্তী মাস"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button
                  type="button"
                  onClick={handleNextMonth}
                  className="p-1.5 text-slate-600 hover:text-slate-900 hover:bg-slate-200 rounded-md transition-colors"
                  title="পরবর্তী মাস"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Weekdays Header (Saturday to Friday) */}
            <div className="grid grid-cols-7 border-b border-slate-200 text-center bg-slate-100/60">
              {BANGLA_DAYS_SAT_START.map((day, idx) => (
                <div
                  key={day.short}
                  className={`py-2 text-xs font-bold ${
                    idx === 5 || idx === 6 ? 'text-rose-600' : 'text-slate-700'
                  }`}
                >
                  <span className="block sm:hidden">{day.short}</span>
                  <span className="hidden sm:block">{day.full}</span>
                </div>
              ))}
            </div>

            {/* Calendar Cells */}
            <div className="grid grid-cols-7 divide-x divide-y divide-slate-100">
              {calendarDays.map((cell, index) => {
                const dayEvents = eventsByDate.get(cell.dateString) || [];
                const hasEvents = dayEvents.length > 0;
                const isSelected = selectedDateStr === cell.dateString;

                return (
                  <div
                    key={cell.dateString + index}
                    onClick={() => setSelectedDateStr(cell.dateString)}
                    className={`min-h-[78px] sm:min-h-[92px] p-1.5 sm:p-2 cursor-pointer transition-all relative flex flex-col justify-between group ${
                      !cell.isCurrentMonth
                        ? 'bg-slate-50/50 text-slate-400'
                        : cell.isWeekend
                        ? 'bg-rose-50/20 text-slate-800'
                        : 'bg-white text-slate-800'
                    } ${
                      isSelected
                        ? 'ring-2 ring-blue-600 ring-inset bg-blue-50/40 z-10'
                        : 'hover:bg-slate-50'
                    }`}
                  >
                    {/* Date Number & Today marker */}
                    <div className="flex items-center justify-between">
                      <span
                        className={`inline-flex items-center justify-center w-6 h-6 rounded-full text-xs font-semibold ${
                          cell.isToday
                            ? 'bg-[#0d3b66] text-white font-bold'
                            : isSelected
                            ? 'bg-blue-600 text-white'
                            : cell.isWeekend && cell.isCurrentMonth
                            ? 'text-rose-600'
                            : ''
                        }`}
                      >
                        {toBanglaNumber(cell.dayNumber)}
                      </span>

                      {cell.isToday && (
                        <span className="hidden sm:inline-block text-[10px] font-bold text-blue-700 bg-blue-100/80 px-1 rounded">
                          আজ
                        </span>
                      )}
                    </div>

                    {/* Events indicators */}
                    <div className="mt-1 space-y-1">
                      {hasEvents && (
                        <div className="flex flex-col gap-0.5">
                          {dayEvents.slice(0, 2).map((evt) => {
                            const conf = CATEGORY_CONFIG[evt.category];
                            return (
                              <div
                                key={evt.id}
                                className={`text-[10px] leading-tight truncate px-1 py-0.5 rounded font-medium ${conf.bg} ${conf.text} border ${conf.border}`}
                                title={evt.title}
                              >
                                {evt.title}
                              </div>
                            );
                          })}
                          {dayEvents.length > 2 && (
                            <span className="text-[9px] text-blue-700 font-semibold px-1">
                              +{toBanglaNumber(dayEvents.length - 2)}টি আরো
                            </span>
                          )}
                        </div>
                      )}
                    </div>

                    {/* Subtle dot when cell has events */}
                    {hasEvents && (
                      <div className="absolute top-1.5 right-1.5 flex gap-1">
                        {dayEvents.slice(0, 3).map((e, idx) => (
                          <span
                            key={idx}
                            className={`w-1.5 h-1.5 rounded-full ${CATEGORY_CONFIG[e.category].dot}`}
                          />
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Calendar Footer Legend */}
            <div className="p-3 bg-slate-50 border-t border-slate-200 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-600">
              <div className="flex flex-wrap items-center gap-3">
                <span className="font-semibold text-slate-700">চিহ্ন নির্দেশিকা:</span>
                <span className="inline-flex items-center gap-1">
                  <span className="w-2.5 h-2.5 rounded-full bg-blue-600" />
                  <span>সভা</span>
                </span>
                <span className="inline-flex items-center gap-1">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-600" />
                  <span>প্রশিক্ষণ</span>
                </span>
                <span className="inline-flex items-center gap-1">
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                  <span>প্রেস ব্রিফিং</span>
                </span>
                <span className="inline-flex items-center gap-1">
                  <span className="w-2.5 h-2.5 rounded-full bg-rose-600" />
                  <span>সুবর্ণজয়ন্তী</span>
                </span>
              </div>
              <div className="text-[11px] text-slate-500">
                * তারিখের ঘরে ক্লিক করে বিস্তারিত দেখুন
              </div>
            </div>
          </div>

          {/* Event Inspector / Details View (5 cols on lg) */}
          <div className="lg:col-span-5 space-y-6">
            {/* Selected Date Header Panel */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-5">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
                <div className="flex items-center gap-2">
                  <div className="w-9 h-9 rounded-xl bg-blue-100 text-blue-800 flex items-center justify-center font-bold">
                    <CalendarCheck className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-xs font-semibold uppercase text-slate-500">নির্বাচিত তারিখের কর্মসূচি</h4>
                    <p className="text-base font-bold text-slate-900">
                      {toBanglaNumber(selectedDateStr.split('-')[2])}{' '}
                      {BANGLA_MONTHS[parseInt(selectedDateStr.split('-')[1], 10) - 1]},{' '}
                      {toBanglaNumber(selectedDateStr.split('-')[0])}
                    </p>
                  </div>
                </div>

                <span className="text-xs px-2.5 py-1 rounded-full bg-slate-100 font-semibold text-slate-700">
                  {selectedDateEvents.length > 0
                    ? `${toBanglaNumber(selectedDateEvents.length)}টি ইভেন্ট`
                    : 'কোনো ইভেন্ট নেই'}
                </span>
              </div>

              {/* Event Cards or Empty State */}
              {selectedDateEvents.length > 0 ? (
                <div className="space-y-4">
                  {selectedDateEvents.map((event) => {
                    const categoryConf = CATEGORY_CONFIG[event.category];
                    const googleCalUrl = getGoogleCalendarUrl({
                      title: event.title,
                      description: event.description,
                      location: event.location,
                      date: event.date
                    });

                    return (
                      <div
                        key={event.id}
                        className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 hover:bg-white hover:shadow-md transition-all space-y-3"
                      >
                        {/* Badges & Category */}
                        <div className="flex items-center justify-between gap-2">
                          <span
                            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-bold ${categoryConf.bg} ${categoryConf.text} border ${categoryConf.border}`}
                          >
                            <span className={`w-2 h-2 rounded-full ${categoryConf.dot}`} />
                            {categoryConf.label}
                          </span>

                          {event.badge && (
                            <span className="text-[11px] font-semibold text-amber-700 bg-amber-100/80 px-2 py-0.5 rounded">
                              {event.badge}
                            </span>
                          )}
                        </div>

                        {/* Title */}
                        <h4 className="text-base font-bold text-slate-900 leading-snug">
                          {event.title}
                        </h4>

                        {/* Event Metadata (Time & Location) */}
                        <div className="space-y-1.5 text-xs text-slate-600">
                          <div className="flex items-center gap-2">
                            <Clock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                            <span>{event.time}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                            <span>{event.location}</span>
                          </div>
                          {event.chiefGuest && (
                            <div className="flex items-center gap-2 text-slate-700 font-medium">
                              <Mic className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                              <span>প্রধান অতিথি/বক্তা: {event.chiefGuest}</span>
                            </div>
                          )}
                          {event.organizer && (
                            <div className="flex items-center gap-2 text-slate-500">
                              <BookOpen className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                              <span>আয়োজক: {event.organizer}</span>
                            </div>
                          )}
                        </div>

                        {/* Description */}
                        <p className="text-xs text-slate-600 leading-relaxed pt-1 border-t border-slate-200/60">
                          {event.description}
                        </p>

                        {/* Interactive Buttons */}
                        <div className="pt-2 flex flex-wrap items-center gap-2">
                          {event.registrationOpen && (
                            <button
                              type="button"
                              onClick={() => handleOpenRsvp(event)}
                              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold bg-blue-700 hover:bg-blue-800 text-white transition-colors"
                            >
                              <UserCheck className="w-3.5 h-3.5" />
                              <span>আসন সংরক্ষণ / RSVP</span>
                            </button>
                          )}

                          <a
                            href={googleCalUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-semibold bg-white border border-slate-300 text-slate-700 hover:bg-slate-50 hover:text-blue-700 transition-colors"
                            title="গুগল ক্যালেন্ডারে যোগ করুন"
                          >
                            <ExternalLink className="w-3 h-3" />
                            <span>Google Calendar</span>
                          </a>

                          <button
                            type="button"
                            onClick={() => handleExportIcs(event)}
                            className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-semibold bg-white border border-slate-300 text-slate-700 hover:bg-slate-50 hover:text-emerald-700 transition-colors"
                            title=".ics ফাইল ডাউনলোড করুন"
                          >
                            <Download className="w-3 h-3" />
                            <span>.ics ফাইল</span>
                          </button>

                          <button
                            type="button"
                            onClick={() => handleCopyEventLink(event)}
                            className="p-1.5 rounded-lg text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-colors"
                            title="ইভেন্ট তথ্য কপি করুন"
                          >
                            <Share2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="py-8 text-center bg-slate-50 rounded-xl border border-dashed border-slate-200 p-6">
                  <Info className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                  <p className="text-sm font-semibold text-slate-700">এই তারিখে কোনো কর্মসূচি নির্ধারিত নেই</p>
                  <p className="text-xs text-slate-500 mt-1 max-w-xs mx-auto">
                    ক্যালেন্ডারের দাগাঙ্কিত তারিখগুলোতে ক্লিক করে আসন্ন মিটিং ও প্রশিক্ষণ কর্মশালার বিবরণ দেখুন।
                  </p>
                  {upcomingEvents.length > 0 && (
                    <button
                      type="button"
                      onClick={() => handleSelectEvent(upcomingEvents[0])}
                      className="mt-4 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-blue-50 text-blue-700 hover:bg-blue-100 border border-blue-200 transition-colors"
                    >
                      <span>পরবর্তী আসন্ন ইভেন্ট দেখুন</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              )}
            </div>

            {/* Upcoming Highlights Quick List */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-5">
              <div className="flex items-center justify-between mb-3 pb-2 border-b border-slate-100">
                <h4 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-amber-500" />
                  <span>আসন্ন প্রধান ইভেন্টসমূহ</span>
                </h4>
                <span className="text-[11px] text-slate-400">শিগগিরই অনুষ্ঠিতব্য</span>
              </div>

              <div className="space-y-2.5">
                {upcomingEvents.map((evt) => {
                  const conf = CATEGORY_CONFIG[evt.category];
                  const isCurrentSelected = selectedDateStr === evt.date;

                  return (
                    <div
                      key={evt.id}
                      onClick={() => handleSelectEvent(evt)}
                      className={`p-3 rounded-xl border transition-all cursor-pointer flex items-start gap-3 ${
                        isCurrentSelected
                          ? 'border-blue-500 bg-blue-50/50 shadow-xs'
                          : 'border-slate-100 hover:border-slate-300 hover:bg-slate-50'
                      }`}
                    >
                      <div className="w-11 text-center shrink-0 rounded-lg bg-slate-100 py-1 border border-slate-200">
                        <span className="block text-[10px] uppercase font-bold text-slate-500">
                          {BANGLA_MONTHS[parseInt(evt.date.split('-')[1], 10) - 1].slice(0, 3)}
                        </span>
                        <span className="block text-sm font-black text-slate-800">
                          {toBanglaNumber(evt.date.split('-')[2])}
                        </span>
                      </div>

                      <div className="flex-grow min-w-0">
                        <div className="flex items-center gap-1.5 mb-0.5">
                          <span className={`w-1.5 h-1.5 rounded-full ${conf.dot}`} />
                          <span className="text-[10px] font-semibold text-slate-500">{conf.label}</span>
                        </div>
                        <h5 className="text-xs font-bold text-slate-900 truncate" title={evt.title}>
                          {evt.title}
                        </h5>
                        <p className="text-[11px] text-slate-500 flex items-center gap-2 mt-0.5">
                          <span>{evt.time}</span>
                          <span>•</span>
                          <span className="truncate">{evt.location}</span>
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Add New Event Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center">
                  <PlusCircle className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">নতুন ইভেন্ট যুক্ত করুন</h3>
                  <p className="text-xs text-slate-500">প্রেসক্লাব ক্যালেন্ডারে নতুন সভা বা প্রশিক্ষণ অন্তর্ভুক্ত করুন</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsAddModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateEvent} className="mt-4 space-y-3.5">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">ইভেন্টের শিরোনাম *</label>
                <input
                  type="text"
                  required
                  placeholder="যেমন: মোবাইল সাংবাদিকতা কর্মশালা বা জরুরি সাধারণ সভা"
                  value={newEventForm.title}
                  onChange={(e) => setNewEventForm({ ...newEventForm, title: e.target.value })}
                  className="w-full text-xs px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">ক্যাটাগরি *</label>
                  <select
                    value={newEventForm.category}
                    onChange={(e) => setNewEventForm({ ...newEventForm, category: e.target.value as EventCategory })}
                    className="w-full text-xs px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none bg-white"
                  >
                    <option value="meeting">সভা ও সম্মেলন</option>
                    <option value="training">প্রশিক্ষণ ও কর্মশালা</option>
                    <option value="press_briefing">প্রেস ব্রিফিং</option>
                    <option value="cultural">সাংস্কৃতিক অনুষ্ঠান</option>
                    <option value="jubilee">সুবর্ণজয়ন্তী ২০২৭</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">তারিখ (YYYY-MM-DD) *</label>
                  <input
                    type="date"
                    required
                    value={newEventForm.date}
                    onChange={(e) => setNewEventForm({ ...newEventForm, date: e.target.value })}
                    className="w-full text-xs px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">সময় *</label>
                  <input
                    type="text"
                    required
                    placeholder="সকাল ১০:০০ ঘটিকা"
                    value={newEventForm.time}
                    onChange={(e) => setNewEventForm({ ...newEventForm, time: e.target.value })}
                    className="w-full text-xs px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">স্থান / ভেন্যু *</label>
                  <input
                    type="text"
                    required
                    placeholder="প্রেসক্লাব মিলনায়তন"
                    value={newEventForm.location}
                    onChange={(e) => setNewEventForm({ ...newEventForm, location: e.target.value })}
                    className="w-full text-xs px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">প্রধান অতিথি / ট্রেইনার</label>
                  <input
                    type="text"
                    placeholder="নাম ও পদবি (ঐচ্ছিক)"
                    value={newEventForm.chiefGuest}
                    onChange={(e) => setNewEventForm({ ...newEventForm, chiefGuest: e.target.value })}
                    className="w-full text-xs px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">আয়োজক উইং</label>
                  <input
                    type="text"
                    value={newEventForm.organizer}
                    onChange={(e) => setNewEventForm({ ...newEventForm, organizer: e.target.value })}
                    className="w-full text-xs px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">বিস্তারিত বিবরণ ও এজেন্ডা</label>
                <textarea
                  rows={3}
                  placeholder="ইভেন্টের উদ্দেশ্য, প্রধান আলোচ্যসূচী বা অংশগ্রহণের যোগ্যতা..."
                  value={newEventForm.description}
                  onChange={(e) => setNewEventForm({ ...newEventForm, description: e.target.value })}
                  className="w-full text-xs px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="regOpenCheck"
                  checked={newEventForm.registrationOpen}
                  onChange={(e) => setNewEventForm({ ...newEventForm, registrationOpen: e.target.checked })}
                  className="rounded text-blue-600 focus:ring-blue-500 h-4 w-4"
                />
                <label htmlFor="regOpenCheck" className="text-xs text-slate-700 font-medium">
                  সাংবাদিক ও সদস্যদের অনলাইন রেজিস্ট্রেশন / আসন সংরক্ষণ উন্মুক্ত রাখুন
                </label>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
                >
                  বাতিল
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-bold text-white bg-blue-700 hover:bg-blue-800 rounded-lg shadow-sm transition-colors"
                >
                  ইভেন্ট প্রকাশ করুন
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* RSVP / Registration Modal */}
      {isRsvpModalOpen && selectedEventForRsvp && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-800 flex items-center justify-center">
                  <UserCheck className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">আসন সংরক্ষণ / RSVP</h3>
                  <p className="text-xs text-slate-500 truncate max-w-[220px]">
                    {selectedEventForRsvp.title}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsRsvpModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmitRsvp} className="mt-4 space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">আপনার নাম *</label>
                <input
                  type="text"
                  required
                  placeholder="মোঃ শফিকুল ইসলাম"
                  value={rsvpFormData.name}
                  onChange={(e) => setRsvpFormData({ ...rsvpFormData, name: e.target.value })}
                  className="w-full text-xs px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">গণমাধ্যমের নাম ও পদবি *</label>
                <input
                  type="text"
                  required
                  placeholder="দৈনিক করতোয়া / জেলা প্রতিনিধি"
                  value={rsvpFormData.media}
                  onChange={(e) => setRsvpFormData({ ...rsvpFormData, media: e.target.value })}
                  className="w-full text-xs px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">মোবাইল নম্বর</label>
                <input
                  type="tel"
                  placeholder="০১৭১২-XXXXXX"
                  value={rsvpFormData.phone}
                  onChange={(e) => setRsvpFormData({ ...rsvpFormData, phone: e.target.value })}
                  className="w-full text-xs px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">বিশেষ কোনো মন্তব্য বা নোট</label>
                <input
                  type="text"
                  placeholder="যেমন: কর্মশালায় ভিডিও ক্যামেরা সাথে আনব"
                  value={rsvpFormData.note}
                  onChange={(e) => setRsvpFormData({ ...rsvpFormData, note: e.target.value })}
                  className="w-full text-xs px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsRsvpModalOpen(false)}
                  className="px-3.5 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
                >
                  বাতিল
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 text-xs font-bold text-white bg-blue-700 hover:bg-blue-800 rounded-lg shadow-sm transition-colors"
                >
                  উপস্থিতি নিশ্চিত করুন
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Floating Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-5 right-5 z-50 flex items-center gap-2 bg-slate-900 text-white px-4 py-2.5 rounded-xl shadow-xl border border-slate-800 text-xs animate-bounce">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}
    </section>
  );
}
