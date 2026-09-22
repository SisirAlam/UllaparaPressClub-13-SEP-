import React, { createContext, useContext, useState, useEffect } from 'react';
import { ClubInfo, CommitteeMember, NoticeItem, CitizenComplaint, ImageAssets, DistinguishedMember, MeetingAttendance, NewsletterSubscriber, MemberApplication, AdConfig } from '../types';
import { CLUB_INFO as DEFAULT_CLUB_INFO, COMMITTEE_MEMBERS as DEFAULT_MEMBERS, NOTICES as DEFAULT_NOTICES, DISTINGUISHED_MEMBERS as DEFAULT_DISTINGUISHED, MEETING_EVENTS as DEFAULT_MEETINGS } from '../data/pressClubData';
import { db, testFirestoreConnection } from '../lib/firebase';
import { doc, setDoc, writeBatch } from 'firebase/firestore';

const DEFAULT_IMAGES: ImageAssets = {
  logo: '/pressclub_official_logo.jpg',
  building: '/FB_IMG_1779510322600.jpg',
  membersGroup: '/IMG_20260525_085738.png',
  membersGroupAlt: '/FB_IMG_1779509963054.jpg',
  executiveLeaders: '/IMG_20260525_085916.jpg',
  recruitmentBanner: '/IMG_20260516_043820.png',
  applicationForm: '/IMG_20260516_043337.png',
};

const DEFAULT_INFO: ClubInfo = {
  ...DEFAULT_CLUB_INFO,
  establishedYear: '১৯৭৭',
  officeHours: 'প্রতিদিন সকাল ১০:০০ টা থেকে রাত ৯:০০ টা পর্যন্ত',
};

const DEFAULT_COMPLAINTS: CitizenComplaint[] = [
  {
    id: 'UPC-2026-081',
    date: '০৩ মে, ২০২৬',
    name: 'সচেতন উল্লাপাড়াবাসী',
    contact: '',
    category: 'নাগরিক দুর্ভোগ ও সড়ক',
    title: 'উল্লাপাড়া পৌর বাজারের প্রধান ড্রেনেজ ব্যবস্থা সংস্কারের দাবি',
    location: 'পৌর বাজার সংলগ্ন এলাকা',
    details: 'বৃষ্টির দিনে ড্রেন উপচে বাজারে পানি জমে ক্রেতা ও পথচারীদের চরম ভোগান্তি পোহাতে হয়। বিষয়টি সাংবাদিকদের প্রতিবেদনে তুলে ধরার অনুরোধ করছি।',
    isAnonymous: true,
    status: 'reviewing',
    investigatorNotes: 'প্রেসক্লাব প্রতিনিধি দল সরেজমিনে পরিদর্শন করেছে। পৌর মেয়রের দৃষ্টি আকর্ষণ করে রিপোর্ট তৈরির কাজ চলছে।'
  },
  {
    id: 'UPC-2026-092',
    date: '১২ মে, ২০২৬',
    name: 'আব্দুল মোত্তালিব',
    contact: '০১৭১২-XXXXXX',
    category: 'নদী ও পরিবেশ দূষণ',
    title: 'ফুলজোড় নদীতে বর্জ্য ফেলা বন্ধের দাবি',
    location: 'ঘাটিনা রেল সেতু সংলগ্ন ঘাট',
    details: 'স্থানীয় কিছু ব্যবসায়ী রাতে নদীতে পলিথিন ও কারখানার বর্জ্য ফেলছে। এতে পরিবেশ মারাত্মকভাবে ব্যাহত হচ্ছে।',
    isAnonymous: false,
    status: 'pending',
    investigatorNotes: 'পরিবেশ অধিদপ্তরের সংশ্লিষ্ট কর্মকর্তার সাথে কথা বলা হচ্ছে।'
  },
  {
    id: 'UPC-2026-054',
    date: '২৫ এপ্রিল, ২০২৬',
    name: 'বেনামী নাগরিক',
    contact: '',
    category: 'শিক্ষা ও স্বাস্থ্যসেবা',
    title: 'উপজেলা স্বাস্থ্য কমপ্লেক্সে জরুরি বিভাগের ডাক্তার উপস্থিতি নিশ্চিতকরণ',
    location: 'উল্লাপাড়া স্বাস্থ্য কমপ্লেক্স',
    details: 'জরুরি বিভাগে রাতের শিফটে চিকিৎসক অনুপস্থিত থাকার অভিযোগ নিয়ে সাংবাদিকরা অনুসন্ধান করেছিলেন।',
    isAnonymous: true,
    status: 'resolved',
    investigatorNotes: 'প্রেসক্লাবের অনুসন্ধানী সংবাদ প্রকাশের পর উপজেলা স্বাস্থ্য কর্মকর্তা সার্বক্ষণিক চিকিৎসকের রোস্টার নিশ্চিত করেছেন।'
  }
];

const DEFAULT_SUBSCRIBERS: NewsletterSubscriber[] = [
  {
    id: 'SUB-2026-001',
    name: 'মুহাম্মদ তানভীর আহমেদ',
    email: 'tanvir.ullapara@gmail.com',
    phone: '০১৭১১-২২৩৩৪৪',
    category: 'journalist',
    interests: ['প্রেস বিজ্ঞপ্তি', 'মিডিয়া কর্মশালা'],
    subscribedAt: '১০ মে, ২০২৬'
  },
  {
    id: 'SUB-2026-002',
    name: 'ফারহানা ইয়াসমিন',
    email: 'farhana.press@outlook.com',
    category: 'member_applicant',
    interests: ['সদস্যপদ আহ্বান', 'প্রেস বিজ্ঞপ্তি', 'সাধারণ সভা'],
    subscribedAt: '০২ জুন, ২০২৬'
  }
];

const DEFAULT_APPLICATIONS: MemberApplication[] = [
  {
    id: 'UPC-MEM-2026-1082',
    fullName: 'মো. রফিকুল ইসলাম',
    fatherName: 'মরহুম আব্দুল খালেক',
    dob: '১৫ মার্চ, ১৯৯০',
    nid: '১৯৯০৭৬১২৩৪৫৬৭৮৯০১',
    education: 'স্নাতকোত্তর (সাংবাদিকতা ও গণযোগাযোগ)',
    presentAddress: 'পৌরসভা রোড, উল্লাপাড়া, সিরাজগঞ্জ',
    permanentAddress: 'গ্রাম: চর ঘাটিনা, উল্লাপাড়া',
    mediaName: 'দৈনিক করতোয়া',
    designation: 'উপজেলা প্রতিনিধি',
    mediaType: 'জাতীয় দৈনিক পত্রিকা',
    experienceYears: '৬ বছর',
    phone: '০১৭১২-৩৪৫৬৭৮',
    email: 'rafiqul.karatoa@gmail.com',
    reportsSummary: 'উল্লাপাড়ায় রেল যোগাযোগ ও কৃষিপণ্য বিপণন নিয়ে অনুসন্ধানী ধারাবাহিক প্রতিবেদন প্রকাশ।',
    appliedAt: '১২ মে, ২০২৬',
    status: 'pending'
  },
  {
    id: 'UPC-MEM-2026-1085',
    fullName: 'তাহমিনা পারভীন',
    fatherName: 'মো. তোজাম্মেল হক',
    dob: '২২ জুন, ১৯৯৫',
    nid: '১৯৯৫৭৬১২৩৪৫৬৭৮৯১০',
    education: 'স্নাতক (বাংলা সাহিত্য)',
    presentAddress: 'রেলওয়ে কলোনি সংলগ্ন, উল্লাপাড়া',
    permanentAddress: 'উল্লাপাড়া সদর',
    mediaName: 'চ্যানেল ২৪ অনলাইন',
    designation: 'স্টাফ রিপোর্টার',
    mediaType: 'স্যাটেলাইট টিভি / অনলাইন',
    experienceYears: '৪ বছর',
    phone: '০১৭৩৩-৯৮৭৬৫৪',
    email: 'tahmina.c24@gmail.com',
    reportsSummary: 'নারী উদ্যোক্তা ও পরিবেশ দূষণ প্রতিরোধে জনসচেতনতামূলক প্রতিবেদন।',
    appliedAt: '১৮ মে, ২০২৬',
    status: 'pending'
  }
];

const DEFAULT_AD_CONFIG: AdConfig = {
  enabled: true,
  adsenseClientId: '',
  adsenseAutoAds: false,
  adsenseHeaderSlot: '',
  adsenseInfeedSlot: '',
  adsenseSidebarSlot: '',
  customHeaderHtml: '',
  customInfeedHtml: '',
  customSidebarHtml: '',
  bannerPhone: '০১৭১১-২২৩৩৪৪',
  bannerEmail: 'ads@ullaparapressclub.org',
  contactPerson: 'বিজ্ঞাপন ও বাণিজ্যিক বিভাগ, উল্লাপাড়া প্রেসক্লাব'
};

interface PressClubContextType {
  clubInfo: ClubInfo;
  updateClubInfo: (updates: Partial<ClubInfo>) => void;
  resetClubInfo: () => void;
  
  images: ImageAssets;
  updateImage: (key: keyof ImageAssets, urlOrDataUrl: string) => void;
  resetImages: () => void;

  members: CommitteeMember[];
  addMember: (member: Omit<CommitteeMember, 'id'>) => void;
  updateMember: (id: string, updates: Partial<CommitteeMember>) => void;
  deleteMember: (id: string) => void;
  resetMembers: () => void;
  resetMembersToDefault: () => void;

  distinguishedMembers: DistinguishedMember[];

  meetings: MeetingAttendance[];
  updateAttendance: (meetingId: string, memberId: string, status: 'present' | 'absent' | 'leave', note?: string) => void;
  markAllAttendance: (meetingId: string, status: 'present' | 'absent') => void;
  resetMeetingsToDefault: () => void;

  notices: NoticeItem[];
  addNotice: (notice: Omit<NoticeItem, 'id'>) => void;
  updateNotice: (id: string, updates: Partial<NoticeItem>) => void;
  deleteNotice: (id: string) => void;
  resetNotices: () => void;

  complaints: CitizenComplaint[];
  addComplaint: (complaint: Omit<CitizenComplaint, 'id' | 'date' | 'status'>) => string;
  updateComplaintStatus: (id: string, status: 'pending' | 'reviewing' | 'resolved', notes?: string) => void;
  deleteComplaint: (id: string) => void;

  // Newsletter & Member Signups
  subscribers: NewsletterSubscriber[];
  addSubscriber: (subscriber: Omit<NewsletterSubscriber, 'id' | 'subscribedAt'>) => { success: boolean; message: string };
  deleteSubscriber: (id: string) => void;

  // Member Applications & Online Registration
  memberApplications: MemberApplication[];
  addMemberApplication: (appData: Omit<MemberApplication, 'id' | 'appliedAt' | 'status'>) => string;
  updateMemberApplicationStatus: (id: string, status: 'pending' | 'approved' | 'rejected', notes?: string) => void;
  deleteMemberApplication: (id: string) => void;
  approveMemberApplication: (id: string, category?: 'executive' | 'general') => void;

  // Advertisement & Google AdSense
  adConfig: AdConfig;
  updateAdConfig: (updates: Partial<AdConfig>) => void;
  resetAdConfig: () => void;

  // Admin Overlay controls
  isAdminOpen: boolean;
  setIsAdminOpen: (open: boolean) => void;
  isAdminAuthenticated: boolean;
  setIsAdminAuthenticated: (auth: boolean) => void;
  adminPin: string;
  setAdminPin: (pin: string) => void;

  // Membership Application Modal
  isRecruitmentModalOpen: boolean;
  setIsRecruitmentModalOpen: (open: boolean) => void;

  // Website Download / Export Modal
  isExportModalOpen: boolean;
  setIsExportModalOpen: (open: boolean) => void;

  // Android App Modal
  isAndroidModalOpen: boolean;
  setIsAndroidModalOpen: (open: boolean) => void;

  // Member Dashboard & Authentication State
  isMemberDashboardOpen: boolean;
  setIsMemberDashboardOpen: (open: boolean) => void;
  authenticatedMember: CommitteeMember | null;
  memberLogin: (identifier: string, pin: string) => { success: boolean; message: string; member?: CommitteeMember };
  quickSwitchMember: (memberId: string) => void;
  memberLogout: () => void;
  updateCurrentMemberProfile: (updates: Partial<CommitteeMember>) => { success: boolean; message: string };

  // Google Workspace Hub Modal
  isWorkspaceModalOpen: boolean;
  setIsWorkspaceModalOpen: (open: boolean) => void;

  // Cloud & Firestore Integration State
  isFirestoreConnected: boolean;
  syncToFirestore: () => Promise<void>;
}

declare global {
  interface Window {
    PRESSCLUB_WP_CONFIG?: {
      clubInfo?: Partial<ClubInfo>;
      members?: CommitteeMember[];
      notices?: NoticeItem[];
      memberApplications?: MemberApplication[];
      subscribers?: NewsletterSubscriber[];
      adConfig?: Partial<AdConfig>;
    };
  }
}

const PressClubContext = createContext<PressClubContextType | undefined>(undefined);

export function PressClubProvider({ children }: { children: React.ReactNode }) {
  // 1. Club Info (ensures no null or missing properties)
  const [clubInfo, setClubInfo] = useState<ClubInfo>(() => {
    if (typeof window !== 'undefined' && window.PRESSCLUB_WP_CONFIG?.clubInfo) {
      return { ...DEFAULT_INFO, ...window.PRESSCLUB_WP_CONFIG.clubInfo };
    }
    try {
      const saved = localStorage.getItem('upc_club_info');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed && typeof parsed === 'object') {
          return { ...DEFAULT_INFO, ...parsed };
        }
      }
    } catch (e) {
      console.warn('Error reading upc_club_info from localStorage:', e);
    }
    return DEFAULT_INFO;
  });

  // 2. Images (strictly ensures NO empty strings or undefined images)
  const [images, setImages] = useState<ImageAssets>(() => {
    try {
      const saved = localStorage.getItem('upc_image_assets');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed && typeof parsed === 'object') {
          const result: ImageAssets = { ...DEFAULT_IMAGES };
          (Object.keys(DEFAULT_IMAGES) as (keyof ImageAssets)[]).forEach((key) => {
            if (parsed[key] && typeof parsed[key] === 'string' && parsed[key].trim() !== '') {
              result[key] = parsed[key];
            }
          });
          return result;
        }
      }
    } catch (e) {
      console.warn('Error reading upc_image_assets from localStorage:', e);
    }
    return DEFAULT_IMAGES;
  });

  // 3. Committee Members (ensures valid photoUrl and never empty string)
  const [members, setMembers] = useState<CommitteeMember[]>(() => {
    if (typeof window !== 'undefined' && Array.isArray(window.PRESSCLUB_WP_CONFIG?.members) && window.PRESSCLUB_WP_CONFIG.members.length > 0) {
      return window.PRESSCLUB_WP_CONFIG.members;
    }
    try {
      const saved = localStorage.getItem('ullapara_pressclub_members_v4');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed.map((m: any, idx: number) => ({
            id: m.id || String(idx + 1),
            serialNumber: m.serialNumber || idx + 1,
            name: m.name || 'সদস্য',
            designation: m.designation || 'সদস্য',
            media: m.media || 'সংবাদমাধ্যম',
            phone: m.phone || '',
            photoUrl: (m.photoUrl && typeof m.photoUrl === 'string' && m.photoUrl.trim() !== '')
              ? m.photoUrl
              : 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
            category: m.category || 'executive',
            listType: m.listType || 'list1_executive'
          }));
        }
      }
    } catch (e) {
      console.warn('Error reading ullapara_pressclub_members_v4 from localStorage:', e);
    }
    return DEFAULT_MEMBERS;
  });

  // Distinguished Members (permanent pioneers)
  const distinguishedMembers = DEFAULT_DISTINGUISHED;

  // Meeting Attendance & Events Tracker
  const [meetings, setMeetings] = useState<MeetingAttendance[]>(() => {
    try {
      const saved = localStorage.getItem('upc_meetings_attendance');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch (e) {
      console.warn('Error reading upc_meetings_attendance:', e);
    }
    return DEFAULT_MEETINGS;
  });

  // 4. Notices
  const [notices, setNotices] = useState<NoticeItem[]>(() => {
    if (typeof window !== 'undefined' && Array.isArray(window.PRESSCLUB_WP_CONFIG?.notices) && window.PRESSCLUB_WP_CONFIG.notices.length > 0) {
      return window.PRESSCLUB_WP_CONFIG.notices;
    }
    try {
      const saved = localStorage.getItem('upc_notices');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch (e) {
      console.warn('Error reading upc_notices from localStorage:', e);
    }
    return DEFAULT_NOTICES;
  });

  // 5. Complaints
  const [complaints, setComplaints] = useState<CitizenComplaint[]>(() => {
    try {
      const saved = localStorage.getItem('ullapara_pressclub_complaints');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch (e) {
      console.warn('Error reading ullapara_pressclub_complaints from localStorage:', e);
    }
    return DEFAULT_COMPLAINTS;
  });

  // 6. Admin State
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(false);
  const [adminPin, setAdminPinState] = useState(() => {
    try {
      return localStorage.getItem('upc_admin_pin') || '1977';
    } catch {
      return '1977';
    }
  });

  // 7. Recruitment Modal
  const [isRecruitmentModalOpen, setIsRecruitmentModalOpen] = useState(false);

  // 8. Website Export / Download Modal
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);

  // 9. Android App Modal
  const [isAndroidModalOpen, setIsAndroidModalOpen] = useState(false);

  // 10. Google Workspace Hub Modal
  const [isWorkspaceModalOpen, setIsWorkspaceModalOpen] = useState(false);

  // 11. Firestore Connection State
  const [isFirestoreConnected, setIsFirestoreConnected] = useState(false);

  useEffect(() => {
    testFirestoreConnection().then((connected) => {
      setIsFirestoreConnected(connected);
    });
  }, []);

  // Sync current data to Firebase Firestore
  const syncToFirestore = async () => {
    try {
      const batch = writeBatch(db);

      // 1. Sync Club Info
      const infoRef = doc(db, 'club_info', 'main');
      batch.set(infoRef, {
        name: clubInfo.nameBangla,
        established: clubInfo.establishedYear,
        regNo: clubInfo.jubileeYear,
        address: clubInfo.address,
        phone: clubInfo.phone,
        email: clubInfo.email,
        president: clubInfo.president,
        generalSecretary: clubInfo.generalSecretary,
        lastUpdated: new Date().toISOString()
      }, { merge: true });

      // 2. Sync Subscribers
      subscribers.forEach((sub) => {
        const subRef = doc(db, 'subscribers', sub.id);
        batch.set(subRef, {
          id: sub.id,
          name: sub.name,
          email: sub.email,
          phone: sub.phone || '',
          category: sub.category,
          subscribedAt: sub.subscribedAt
        }, { merge: true });
      });

      // 3. Sync Notices
      notices.slice(0, 10).forEach((notice) => {
        const noticeRef = doc(db, 'notices', notice.id);
        batch.set(noticeRef, {
          id: notice.id,
          title: notice.title,
          date: notice.date,
          badge: notice.badge,
          summary: notice.summary,
          fullText: notice.fullText,
          isImportant: notice.isImportant || false
        }, { merge: true });
      });

      await batch.commit();
      setIsFirestoreConnected(true);
    } catch (error) {
      console.error('Firestore sync error:', error);
      throw error;
    }
  };

  // 12. Newsletter & Member Signups
  const [subscribers, setSubscribers] = useState<NewsletterSubscriber[]>(() => {
    if (typeof window !== 'undefined' && Array.isArray(window.PRESSCLUB_WP_CONFIG?.subscribers) && window.PRESSCLUB_WP_CONFIG.subscribers.length > 0) {
      return window.PRESSCLUB_WP_CONFIG.subscribers;
    }
    try {
      const saved = localStorage.getItem('upc_newsletter_subscribers');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch (e) {
      console.warn('Error reading upc_newsletter_subscribers from localStorage:', e);
    }
    return DEFAULT_SUBSCRIBERS;
  });

  // Sync to local storage
  useEffect(() => {
    try {
      localStorage.setItem('upc_club_info', JSON.stringify(clubInfo));
    } catch (e) {
      console.warn('Failed to save upc_club_info:', e);
    }
  }, [clubInfo]);

  useEffect(() => {
    try {
      localStorage.setItem('upc_image_assets', JSON.stringify(images));
    } catch (e) {
      console.warn('Failed to save upc_image_assets:', e);
    }
  }, [images]);

  useEffect(() => {
    try {
      localStorage.setItem('ullapara_pressclub_members_v4', JSON.stringify(members));
    } catch (e) {
      console.warn('Failed to save ullapara_pressclub_members_v4:', e);
    }
  }, [members]);

  useEffect(() => {
    try {
      localStorage.setItem('upc_meetings_attendance', JSON.stringify(meetings));
    } catch (e) {
      console.warn('Failed to save upc_meetings_attendance:', e);
    }
  }, [meetings]);

  useEffect(() => {
    try {
      localStorage.setItem('upc_notices', JSON.stringify(notices));
    } catch (e) {
      console.warn('Failed to save upc_notices:', e);
    }
  }, [notices]);

  useEffect(() => {
    try {
      localStorage.setItem('ullapara_pressclub_complaints', JSON.stringify(complaints));
    } catch (e) {
      console.warn('Failed to save ullapara_pressclub_complaints:', e);
    }
  }, [complaints]);

  useEffect(() => {
    try {
      localStorage.setItem('upc_newsletter_subscribers', JSON.stringify(subscribers));
    } catch (e) {
      console.warn('Failed to save upc_newsletter_subscribers:', e);
    }
  }, [subscribers]);

  const updateClubInfo = (updates: Partial<ClubInfo>) => {
    setClubInfo(prev => ({ ...prev, ...updates }));
  };

  const resetClubInfo = () => {
    setClubInfo(DEFAULT_INFO);
    try {
      localStorage.removeItem('upc_club_info');
    } catch (e) {
      console.warn(e);
    }
  };

  const updateImage = (key: keyof ImageAssets, urlOrDataUrl: string) => {
    if (!urlOrDataUrl || urlOrDataUrl.trim() === '') {
      // Fallback to default
      setImages(prev => ({ ...prev, [key]: DEFAULT_IMAGES[key] }));
    } else {
      setImages(prev => ({ ...prev, [key]: urlOrDataUrl }));
    }
  };

  const resetImages = () => {
    setImages(DEFAULT_IMAGES);
    try {
      localStorage.removeItem('upc_image_assets');
    } catch (e) {
      console.warn(e);
    }
  };

  const addMember = (newMem: Omit<CommitteeMember, 'id'>) => {
    const member: CommitteeMember = {
      ...newMem,
      id: Date.now().toString(),
      photoUrl: (newMem.photoUrl && newMem.photoUrl.trim() !== '')
        ? newMem.photoUrl
        : 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80'
    };
    setMembers(prev => [...prev, member]);
  };

  const updateMember = (id: string, updates: Partial<CommitteeMember>) => {
    setMembers(prev => prev.map(m => {
      if (m.id !== id) return m;
      const updated = { ...m, ...updates };
      if (!updated.photoUrl || updated.photoUrl.trim() === '') {
        updated.photoUrl = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80';
      }
      return updated;
    }));
  };

  const deleteMember = (id: string) => {
    setMembers(prev => prev.filter(m => m.id !== id));
  };

  const resetMembers = () => {
    setMembers(DEFAULT_MEMBERS);
    try {
      localStorage.removeItem('ullapara_pressclub_members');
    } catch (e) {
      console.warn(e);
    }
  };

  const addNotice = (newNotice: Omit<NoticeItem, 'id'>) => {
    const notice: NoticeItem = {
      ...newNotice,
      id: Date.now().toString()
    };
    setNotices(prev => [notice, ...prev]);
  };

  const updateNotice = (id: string, updates: Partial<NoticeItem>) => {
    setNotices(prev => prev.map(n => n.id === id ? { ...n, ...updates } : n));
  };

  const deleteNotice = (id: string) => {
    setNotices(prev => prev.filter(n => n.id !== id));
  };

  const resetNotices = () => {
    setNotices(DEFAULT_NOTICES);
    try {
      localStorage.removeItem('upc_notices');
    } catch (e) {
      console.warn(e);
    }
  };

  const addComplaint = (complaint: Omit<CitizenComplaint, 'id' | 'date' | 'status'>): string => {
    const random = Math.floor(100 + Math.random() * 900);
    const newId = `UPC-2026-${random}`;
    const newEntry: CitizenComplaint = {
      ...complaint,
      id: newId,
      date: new Date().toLocaleDateString('bn-BD', { day: 'numeric', month: 'long', year: 'numeric' }),
      status: 'pending'
    };
    setComplaints(prev => [newEntry, ...prev]);
    return newId;
  };

  const updateComplaintStatus = (id: string, status: 'pending' | 'reviewing' | 'resolved', notes?: string) => {
    setComplaints(prev => prev.map(c => {
      if (c.id !== id) return c;
      return {
        ...c,
        status,
        ...(notes !== undefined ? { investigatorNotes: notes } : {})
      };
    }));
  };

  const deleteComplaint = (id: string) => {
    setComplaints(prev => prev.filter(c => c.id !== id));
  };

  const updateAttendance = (meetingId: string, memberId: string, status: 'present' | 'absent' | 'leave', note?: string) => {
    setMeetings(prev => prev.map(meeting => {
      if (meeting.meetingId !== meetingId) return meeting;
      return {
        ...meeting,
        attendees: meeting.attendees.map(att => {
          if (att.memberId !== memberId) return att;
          return {
            ...att,
            status,
            ...(note !== undefined ? { note } : {})
          };
        })
      };
    }));
  };

  const markAllAttendance = (meetingId: string, status: 'present' | 'absent') => {
    setMeetings(prev => prev.map(meeting => {
      if (meeting.meetingId !== meetingId) return meeting;
      return {
        ...meeting,
        attendees: meeting.attendees.map(att => ({
          ...att,
          status
        }))
      };
    }));
  };

  const resetMeetingsToDefault = () => {
    setMeetings(DEFAULT_MEETINGS);
    try {
      localStorage.removeItem('upc_meetings_attendance');
    } catch (e) {
      console.warn(e);
    }
  };

  const setAdminPin = (newPin: string) => {
    setAdminPinState(newPin);
    try {
      localStorage.setItem('upc_admin_pin', newPin);
    } catch (e) {
      console.warn(e);
    }
  };

  const addSubscriber = (newSub: Omit<NewsletterSubscriber, 'id' | 'subscribedAt'>): { success: boolean; message: string } => {
    const trimmedEmail = newSub.email.trim().toLowerCase();
    const existing = subscribers.find(s => s.email.toLowerCase() === trimmedEmail);
    if (existing) {
      return {
        success: false,
        message: 'এই ইমেইল ঠিকানাটি ইতোমধ্যে সাবস্ক্রাইব করা হয়েছে!'
      };
    }

    const todayBengali = new Date().toLocaleDateString('bn-BD', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });

    const createdSubscriber: NewsletterSubscriber = {
      ...newSub,
      id: `SUB-${Date.now().toString().slice(-6)}`,
      email: trimmedEmail,
      name: newSub.name.trim(),
      subscribedAt: todayBengali
    };

    setSubscribers(prev => [createdSubscriber, ...prev]);

    // If running in WordPress environment, notify WordPress REST API
    if (typeof window !== 'undefined' && window.PRESSCLUB_WP_CONFIG) {
      fetch('/wp-json/pressclub/v1/subscribers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(createdSubscriber)
      }).catch(err => console.warn('WordPress subscriber sync note:', err));
    }

    return {
      success: true,
      message: 'অভিনন্দন! আপনার সাবস্ক্রিপশন ও তথ্য সফলভাবে নথিভুক্ত হয়েছে।'
    };
  };

  const deleteSubscriber = (id: string) => {
    setSubscribers(prev => prev.filter(s => s.id !== id));
  };

  // Member Applications State
  const [memberApplications, setMemberApplications] = useState<MemberApplication[]>(() => {
    if (typeof window !== 'undefined' && Array.isArray(window.PRESSCLUB_WP_CONFIG?.memberApplications) && window.PRESSCLUB_WP_CONFIG.memberApplications.length > 0) {
      return window.PRESSCLUB_WP_CONFIG.memberApplications;
    }
    try {
      const saved = localStorage.getItem('upc_member_applications');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {
      console.warn(e);
    }
    return DEFAULT_APPLICATIONS;
  });

  const addMemberApplication = (appData: Omit<MemberApplication, 'id' | 'appliedAt' | 'status'>): string => {
    const random = Math.floor(1000 + Math.random() * 9000);
    const newId = `UPC-MEM-2026-${random}`;
    const todayBengali = new Date().toLocaleDateString('bn-BD', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
    const newApp: MemberApplication = {
      ...appData,
      id: newId,
      appliedAt: todayBengali,
      status: 'pending'
    };
    setMemberApplications(prev => {
      const updated = [newApp, ...prev];
      try {
        localStorage.setItem('upc_member_applications', JSON.stringify(updated));
      } catch (e) {
        console.warn(e);
      }
      return updated;
    });

    // If running in WordPress environment, notify WordPress REST API
    if (typeof window !== 'undefined' && window.PRESSCLUB_WP_CONFIG) {
      fetch('/wp-json/pressclub/v1/applications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newApp)
      }).catch(err => console.warn('WordPress application sync note:', err));
    }

    return newId;
  };

  const updateMemberApplicationStatus = (id: string, status: 'pending' | 'approved' | 'rejected', notes?: string) => {
    setMemberApplications(prev => {
      const updated = prev.map(a => a.id === id ? { ...a, status, ...(notes !== undefined ? { notes } : {}) } : a);
      try {
        localStorage.setItem('upc_member_applications', JSON.stringify(updated));
      } catch (e) {
        console.warn(e);
      }
      return updated;
    });
  };

  const deleteMemberApplication = (id: string) => {
    setMemberApplications(prev => {
      const updated = prev.filter(a => a.id !== id);
      try {
        localStorage.setItem('upc_member_applications', JSON.stringify(updated));
      } catch (e) {
        console.warn(e);
      }
      return updated;
    });
  };

  const approveMemberApplication = (id: string, category: 'executive' | 'general' = 'general') => {
    const app = memberApplications.find(a => a.id === id);
    if (!app) return;
    const newMemberItem: Omit<CommitteeMember, 'id'> = {
      name: app.fullName,
      designation: app.designation || 'সাধারণ সদস্য',
      media: app.mediaName,
      phone: app.phone,
      photoUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
      category: category,
      listType: category === 'executive' ? 'list1_executive' : 'list2_general'
    };
    addMember(newMemberItem);
    updateMemberApplicationStatus(id, 'approved', 'প্রেসক্লাব ড্যাশবোর্ড থেকে অনুমোদিত ও মূল সদস্য তালিকায় অন্তর্ভুক্ত');
  };

  // Advertisement & Google AdSense State
  const [adConfig, setAdConfig] = useState<AdConfig>(() => {
    if (typeof window !== 'undefined' && window.PRESSCLUB_WP_CONFIG?.adConfig) {
      return { ...DEFAULT_AD_CONFIG, ...window.PRESSCLUB_WP_CONFIG.adConfig };
    }
    try {
      const saved = localStorage.getItem('upc_ad_config');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed && typeof parsed === 'object') {
          return { ...DEFAULT_AD_CONFIG, ...parsed };
        }
      }
    } catch (e) {
      console.warn(e);
    }
    return DEFAULT_AD_CONFIG;
  });

  const updateAdConfig = (updates: Partial<AdConfig>) => {
    setAdConfig(prev => {
      const updated = { ...prev, ...updates };
      try {
        localStorage.setItem('upc_ad_config', JSON.stringify(updated));
      } catch (e) {
        console.warn(e);
      }
      return updated;
    });
  };

  const resetAdConfig = () => {
    setAdConfig(DEFAULT_AD_CONFIG);
    try {
      localStorage.removeItem('upc_ad_config');
    } catch (e) {
      console.warn(e);
    }
  };

  // 13. Member Dashboard & Authentication
  const [isMemberDashboardOpen, setIsMemberDashboardOpen] = useState(false);
  const [authenticatedMemberId, setAuthenticatedMemberId] = useState<string | null>(() => {
    try {
      return localStorage.getItem('upc_auth_member_id') || null;
    } catch {
      return null;
    }
  });

  const authenticatedMember = members.find(m => m.id === authenticatedMemberId) || null;

  const normalizePhone = (str: string) => {
    return str.replace(/[^0-9০-৯]/g, '').replace(/[০-৯]/g, d => String('০১২৩৪৫৬৭৮৯'.indexOf(d)));
  };

  const memberLogin = (identifier: string, pin: string) => {
    const cleanId = identifier.trim();
    const cleanPin = pin.trim();
    if (!cleanId) {
      return { success: false, message: 'সদস্য আইডি, মোবাইল নম্বর বা ইমেইল লিখুন।' };
    }

    const normInput = normalizePhone(cleanId);

    // Find candidate member
    const found = members.find(m => {
      if (m.id.toLowerCase() === cleanId.toLowerCase()) return true;
      if (String(m.serialNumber) === cleanId) return true;
      if (m.phone && normInput.length >= 6 && normalizePhone(m.phone).includes(normInput)) return true;
      if (m.email && m.email.toLowerCase() === cleanId.toLowerCase()) return true;
      if (m.name.toLowerCase().includes(cleanId.toLowerCase())) return true;
      return false;
    });

    if (!found) {
      return { success: false, message: 'প্রদত্ত তথ্যে কোনো নিবন্ধিত সদস্য খুঁজে পাওয়া যায়নি।' };
    }

    const customPin = found.pin || '1977';
    const phoneDigits = found.phone ? normalizePhone(found.phone) : '';
    const last4Phone = phoneDigits.slice(-4);

    const isPinValid = cleanPin === customPin || cleanPin === '1977' || (last4Phone && cleanPin === last4Phone);

    if (!isPinValid) {
      return { success: false, message: 'ভুল পিন নম্বর! প্রেসক্লাবের ডিফল্ট সদস্য পিন (১৯৭৭) ব্যবহার করুন।' };
    }

    setAuthenticatedMemberId(found.id);
    try {
      localStorage.setItem('upc_auth_member_id', found.id);
    } catch (e) {
      console.warn(e);
    }

    return {
      success: true,
      message: `স্বাগতম, ${found.name}! আপনি সফলভাবে সদস্য ড্যাশবোর্ডে প্রবেশ করেছেন।`,
      member: found
    };
  };

  const quickSwitchMember = (memberId: string) => {
    const found = members.find(m => m.id === memberId);
    if (found) {
      setAuthenticatedMemberId(found.id);
      try {
        localStorage.setItem('upc_auth_member_id', found.id);
      } catch (e) {
        console.warn(e);
      }
    }
  };

  const memberLogout = () => {
    setAuthenticatedMemberId(null);
    try {
      localStorage.removeItem('upc_auth_member_id');
    } catch (e) {
      console.warn(e);
    }
  };

  const updateCurrentMemberProfile = (updates: Partial<CommitteeMember>) => {
    if (!authenticatedMemberId) {
      return { success: false, message: 'আপনি লগইন অবস্থায় নেই।' };
    }
    updateMember(authenticatedMemberId, updates);
    return { success: true, message: 'আপনার প্রোফাইল ও যোগাযোগের তথ্য সফলভাবে হালনাগাদ করা হয়েছে।' };
  };

  return (
    <PressClubContext.Provider
      value={{
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
        resetMembersToDefault: resetMembers,
        distinguishedMembers,
        meetings,
        updateAttendance,
        markAllAttendance,
        resetMeetingsToDefault,
        notices,
        addNotice,
        updateNotice,
        deleteNotice,
        resetNotices,
        complaints,
        addComplaint,
        updateComplaintStatus,
        deleteComplaint,
        subscribers,
        addSubscriber,
        deleteSubscriber,
        memberApplications,
        addMemberApplication,
        updateMemberApplicationStatus,
        deleteMemberApplication,
        approveMemberApplication,
        adConfig,
        updateAdConfig,
        resetAdConfig,
        isAdminOpen,
        setIsAdminOpen,
        isAdminAuthenticated,
        setIsAdminAuthenticated,
        adminPin,
        setAdminPin,
        isRecruitmentModalOpen,
        setIsRecruitmentModalOpen,
        isExportModalOpen,
        setIsExportModalOpen,
        isAndroidModalOpen,
        setIsAndroidModalOpen,
        isMemberDashboardOpen,
        setIsMemberDashboardOpen,
        authenticatedMember,
        memberLogin,
        quickSwitchMember,
        memberLogout,
        updateCurrentMemberProfile,
        isWorkspaceModalOpen,
        setIsWorkspaceModalOpen,
        isFirestoreConnected,
        syncToFirestore,
      }}
    >
      {children}
    </PressClubContext.Provider>
  );
}

export function usePressClub(): PressClubContextType {
  const context = useContext(PressClubContext);
  if (!context) {
    throw new Error('usePressClub must be used within a PressClubProvider');
  }
  return context;
}
