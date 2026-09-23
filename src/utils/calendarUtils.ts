/**
 * Calendar calculation and Bengali formatting helpers
 */

export const BANGLA_MONTHS = [
  'জানুয়ারি',
  'ফেব্রুয়ারি',
  'মার্চ',
  'এপ্রিল',
  'মে',
  'জুন',
  'জুলাই',
  'আগস্ট',
  'সেপ্টেম্বর',
  'অক্টোবর',
  'নভেম্বর',
  'ডিসেম্বর'
];

export const BANGLA_DAYS_SAT_START = [
  { short: 'শনি', full: 'শনিবার', en: 'Sat' },
  { short: 'রবি', full: 'রবিবার', en: 'Sun' },
  { short: 'সোম', full: 'সোমবার', en: 'Mon' },
  { short: 'মঙ্গল', full: 'মঙ্গলবার', en: 'Tue' },
  { short: 'বুধ', full: 'বুধবার', en: 'Wed' },
  { short: 'বৃহঃ', full: 'বৃহস্পতিবার', en: 'Thu' },
  { short: 'শুক্র', full: 'শুক্রবার', en: 'Fri' }
];

export const toBanglaNumber = (num: number | string): string => {
  const banglaDigits = ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯'];
  return String(num).replace(/\d/g, (digit) => banglaDigits[parseInt(digit, 10)]);
};

export interface CalendarDay {
  date: Date;
  dateString: string; // YYYY-MM-DD
  dayNumber: number;
  isCurrentMonth: boolean;
  isToday: boolean;
  isWeekend: boolean; // Friday or Saturday in BD
}

/**
 * Generate 35 or 42 grid cells starting on Saturday (Bangladesh standard)
 */
export function getCalendarGrid(year: number, month: number, todayString: string = '2026-09-22'): CalendarDay[] {
  // Month is 0-indexed (0 = Jan, 8 = Sep)
  const firstDayOfMonth = new Date(year, month, 1);
  const lastDayOfMonth = new Date(year, month + 1, 0);

  // Day of week: 0 = Sun, 1 = Mon, ..., 6 = Sat
  // Convert so Saturday = 0, Sunday = 1, ..., Friday = 6
  const startDayOfWeek = (firstDayOfMonth.getDay() + 1) % 7;

  const days: CalendarDay[] = [];

  // Previous month trailing days
  const prevMonthLastDate = new Date(year, month, 0).getDate();
  for (let i = startDayOfWeek - 1; i >= 0; i--) {
    const dayNumber = prevMonthLastDate - i;
    const d = new Date(year, month - 1, dayNumber);
    const dateString = formatDateString(d);
    const dayOfWeek = d.getDay();
    days.push({
      date: d,
      dateString,
      dayNumber,
      isCurrentMonth: false,
      isToday: dateString === todayString,
      isWeekend: dayOfWeek === 5 || dayOfWeek === 6 // Friday or Saturday
    });
  }

  // Current month days
  const totalDaysCurrentMonth = lastDayOfMonth.getDate();
  for (let d = 1; d <= totalDaysCurrentMonth; d++) {
    const currentDate = new Date(year, month, d);
    const dateString = formatDateString(currentDate);
    const dayOfWeek = currentDate.getDay();
    days.push({
      date: currentDate,
      dateString,
      dayNumber: d,
      isCurrentMonth: true,
      isToday: dateString === todayString,
      isWeekend: dayOfWeek === 5 || dayOfWeek === 6
    });
  }

  // Next month leading days to round out 5 or 6 weeks (multiple of 7)
  const remainingCells = (7 - (days.length % 7)) % 7;
  // If fewer than 35 cells, add an extra week for comfortable view
  const targetLength = days.length + remainingCells < 35 ? days.length + remainingCells + 7 : days.length + remainingCells;
  
  let nextDayNum = 1;
  while (days.length < targetLength) {
    const d = new Date(year, month + 1, nextDayNum);
    const dateString = formatDateString(d);
    const dayOfWeek = d.getDay();
    days.push({
      date: d,
      dateString,
      dayNumber: nextDayNum,
      isCurrentMonth: false,
      isToday: dateString === todayString,
      isWeekend: dayOfWeek === 5 || dayOfWeek === 6
    });
    nextDayNum++;
  }

  return days;
}

export function formatDateString(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

/**
 * Generate a standard .ics calendar invite file content
 */
export function generateIcsFile(event: {
  title: string;
  description: string;
  location: string;
  date: string; // YYYY-MM-DD
  time?: string;
}): string {
  const dateParts = event.date.split('-');
  const y = dateParts[0];
  const m = dateParts[1];
  const d = dateParts[2];

  const dtStart = `${y}${m}${d}T040000Z`; // Default morning time UTC
  const dtEnd = `${y}${m}${d}T080000Z`;

  const escapeIcs = (str: string) => (str || '').replace(/[,;\\]/g, '\\$&').replace(/\n/g, '\\n');

  return [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Ullapara Press Club//Events Calendar//BN',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    'BEGIN:VEVENT',
    `UID:upc-${event.date}-${Date.now()}@ullaparapressclub.org`,
    `DTSTAMP:${y}${m}${d}T000000Z`,
    `DTSTART:${dtStart}`,
    `DTEND:${dtEnd}`,
    `SUMMARY:${escapeIcs(event.title)}`,
    `DESCRIPTION:${escapeIcs(event.description)}`,
    `LOCATION:${escapeIcs(event.location)}`,
    'STATUS:CONFIRMED',
    'END:VEVENT',
    'END:VCALENDAR'
  ].join('\r\n');
}

/**
 * Generate Google Calendar Web URL
 */
export function getGoogleCalendarUrl(event: {
  title: string;
  description: string;
  location: string;
  date: string; // YYYY-MM-DD
}): string {
  const dateCompact = event.date.replace(/-/g, '');
  const datesParam = `${dateCompact}T040000Z/${dateCompact}T080000Z`;
  
  const params = new URLSearchParams({
    action: 'TEMPLATE',
    text: event.title,
    dates: datesParam,
    details: `${event.description}\n\nস্থান: ${event.location}\nউল্লাপাড়া প্রেসক্লাব`,
    location: event.location,
    add: 'ullaparapressclub1977@gmail.com'
  });

  return `https://calendar.google.com/calendar/render?${params.toString()}`;
}
