export interface CommitteeMember {
  id: string;
  serialNumber?: number;
  name: string;
  designation: string;
  media: string;
  phone?: string;
  photoUrl: string;
  category: 'executive' | 'senior' | 'general' | 'photojournalist';
  listType?: 'list1_executive' | 'list2_general';
  email?: string;
  bloodGroup?: string;
  address?: string;
  permanentAddress?: string;
  bio?: string;
  education?: string;
  mediaType?: string;
  beat?: string;
  experience?: string;
  memberIdCode?: string;
  joiningYear?: string;
  membershipStatus?: 'active' | 'leave' | 'honorary';
  emergencyContact?: string;
  emergencyPhone?: string;
  pin?: string;
  facebookUrl?: string;
  websiteUrl?: string;
}

export interface DistinguishedMember {
  id: string;
  name: string;
  title: string;
  affiliation: string;
  headshotUrl: string;
  bio: string;
  achievements: string[];
  awards: string[];
  tenure: string;
  featuredQuote?: string;
  beat?: string;
}

export interface MeetingAttendance {
  meetingId: string;
  meetingTitle: string;
  date: string;
  time: string;
  location: string;
  agenda: string;
  attendees: {
    memberId: string;
    memberName: string;
    designation: string;
    media: string;
    status: 'present' | 'absent' | 'leave';
    note?: string;
  }[];
}

export type EventCategory = 'meeting' | 'training' | 'press_briefing' | 'cultural' | 'jubilee';

export interface PressClubEvent {
  id: string;
  title: string;
  date: string; // Format: 'YYYY-MM-DD'
  dateBangla: string;
  time: string;
  endTime?: string;
  location: string;
  category: EventCategory;
  categoryName: string;
  organizer: string;
  chiefGuest?: string;
  speaker?: string;
  description: string;
  registrationOpen?: boolean;
  registrationDeadline?: string;
  attendeesCount?: number;
  contactPerson?: string;
  contactPhone?: string;
  bannerImage?: string;
  badge?: string;
  tags?: string[];
}

export type NoticeCategory = 'local_news' | 'general' | 'training' | 'meeting' | 'award';

export interface NoticeItem {
  id: string;
  title: string;
  date: string;
  badge: string;
  summary: string;
  fullText: string;
  content?: string;
  signatory?: string;
  isImportant?: boolean;
  isPopup?: boolean;
  type?: 'news' | 'notice' | 'press_release';
  category?: NoticeCategory | string;
  refNumber?: string;
  reporter?: string;
  location?: string;
}

export interface GalleryItem {
  id: string;
  title: string;
  category: string;
  imageUrl: string;
  date: string;
  description: string;
}

export interface TimelineEvent {
  year: string;
  title: string;
  description: string;
}

export interface CitizenComplaint {
  id: string;
  date: string;
  name: string;
  contact: string;
  category: string;
  title: string;
  location: string;
  details: string;
  isAnonymous: boolean;
  status: 'pending' | 'reviewing' | 'resolved';
  investigatorNotes?: string;
}

export interface HeroSlide {
  id: string;
  imageUrl: string;
  title: string;
  subtitle: string;
  badge: string;
}

export interface ImageAssets {
  logo: string;
  building: string;
  membersGroup: string;
  membersGroupAlt: string;
  executiveLeaders: string;
  recruitmentBanner: string;
  applicationForm: string;
}

export interface ClubInfo {
  nameBangla: string;
  nameEnglish: string;
  district: string;
  division: string;
  establishedYear: string;
  jubileeYear: string;
  email: string;
  phone: string;
  address: string;
  sponsor: string;
  facebook?: string;
  website?: string;
  tagline: string;
  motto?: string;
  aboutBrief: string;
  officeHours: string;
  president?: string;
  generalSecretary?: string;
  coordinates?: {
    lat: number;
    lng: number;
    latText: string;
    lngText: string;
    dms: string;
  };
}

export interface NewsletterSubscriber {
  id: string;
  name: string;
  email: string;
  phone?: string;
  category: 'member_applicant' | 'journalist' | 'citizen' | 'student';
  interests: string[];
  subscribedAt: string;
}

export interface MemberApplication {
  id: string;
  fullName: string;
  fatherName: string;
  dob: string;
  nid: string;
  education: string;
  presentAddress: string;
  permanentAddress: string;
  mediaName: string;
  designation: string;
  mediaType: string;
  experienceYears: string;
  phone: string;
  email: string;
  reportsSummary: string;
  photoUrl?: string;
  facebookUrl?: string;
  isOtpVerified?: boolean;
  appliedAt: string;
  status: 'pending' | 'approved' | 'rejected';
  notes?: string;
}

export interface AdConfig {
  enabled: boolean;
  adsenseClientId: string; // e.g. "ca-pub-1234567890123456"
  adsenseAutoAds: boolean;
  adsenseHeaderSlot: string; // e.g. "1234567890"
  adsenseInfeedSlot: string;
  adsenseSidebarSlot: string;
  customHeaderHtml: string;
  customInfeedHtml: string;
  customSidebarHtml: string;
  bannerPhone: string;
  bannerEmail: string;
  contactPerson: string;
}


