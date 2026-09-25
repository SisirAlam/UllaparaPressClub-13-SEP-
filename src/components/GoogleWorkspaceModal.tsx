import React, { useState, useEffect } from 'react';
import { 
  X, 
  Sparkles, 
  FileText, 
  Table, 
  Presentation, 
  FolderKanban, 
  CheckSquare, 
  Mail, 
  StickyNote, 
  ExternalLink, 
  Loader2, 
  LogOut, 
  CheckCircle2, 
  AlertCircle, 
  Database,
  Send,
  Search,
  RefreshCw,
  Plus
} from 'lucide-react';
import { usePressClub } from '../context/PressClubContext';
import { 
  googleSignIn, 
  logoutGoogle, 
  getAccessToken, 
  initAuth 
} from '../lib/workspaceAuth';
import { 
  listDriveFiles, 
  createDriveFolder, 
  createGoogleDoc, 
  createGoogleSheet, 
  createGooglePresentation, 
  createGoogleForm, 
  sendGmail,
  DriveFileItem,
  GoogleDocResult,
  GoogleSheetResult,
  GoogleSlideResult,
  GoogleFormResult
} from '../lib/workspaceApi';
import { User } from 'firebase/auth';

type WorkspaceTab = 'drive' | 'docs' | 'sheets' | 'slides' | 'forms' | 'gmail' | 'keep' | 'cloud';

export default function GoogleWorkspaceModal() {
  const { 
    isWorkspaceModalOpen, 
    setIsWorkspaceModalOpen, 
    members, 
    notices, 
    subscribers, 
    clubInfo,
    isFirestoreConnected,
    syncToFirestore 
  } = usePressClub();

  const [activeTab, setActiveTab] = useState<WorkspaceTab>('drive');
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isSigningIn, setIsSigningIn] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Drive state
  const [driveFiles, setDriveFiles] = useState<DriveFileItem[]>([]);
  const [isDriveLoading, setIsDriveLoading] = useState(false);
  const [driveSearch, setDriveSearch] = useState('');
  const [newFolderName, setNewFolderName] = useState('উল্লাপাড়া প্রেসক্লাব প্রেস আর্কাইভ');

  // Docs state
  const [docTitle, setDocTitle] = useState('প্রেস বিজ্ঞপ্তি: উল্লাপাড়া প্রেসক্লাবের জরুরি কার্যনির্বাহী সভা');
  const [docContent, setDocContent] = useState(
    'উল্লাপাড়া প্রেসক্লাবের সকল সম্মানিত সদস্য ও গণমাধ্যমকর্মীদের অবগতির জন্য জানানো যাচ্ছে যে...\nতারিখ: ' +
    new Date().toLocaleDateString('bn-BD', { day: 'numeric', month: 'long', year: 'numeric' })
  );
  const [createdDoc, setCreatedDoc] = useState<GoogleDocResult | null>(null);
  const [isDocCreating, setIsDocCreating] = useState(false);

  // Sheets state
  const [createdSheet, setCreatedSheet] = useState<GoogleSheetResult | null>(null);
  const [isSheetCreating, setIsSheetCreating] = useState(false);

  // Slides state
  const [slideTitle, setSlideTitle] = useState('উল্লাপাড়া প্রেসক্লাব - বার্ষিক প্রেস কনফারেন্স ও সাধারণ সভা');
  const [createdSlide, setCreatedSlide] = useState<GoogleSlideResult | null>(null);
  const [isSlideCreating, setIsSlideCreating] = useState(false);

  // Forms state
  const [formTitle, setFormTitle] = useState('উল্লাপাড়া প্রেসক্লাব নতুন সদস্যপদ আবেদন ফর্ম ২০২৬');
  const [formDesc, setFormDesc] = useState('উল্লাপাড়া উপজেলায় কর্মরত সক্রিয় সাংবাদিকদের প্রেসক্লাবে তালিকাভুক্তির জন্য অনলাইন আবেদন ফর্ম।');
  const [createdForm, setCreatedForm] = useState<GoogleFormResult | null>(null);
  const [isFormCreating, setIsFormCreating] = useState(false);

  // Gmail state
  const [emailTo, setEmailTo] = useState('');
  const [emailSubject, setEmailSubject] = useState('উল্লাপাড়া প্রেসক্লাব: জরুরি প্রেস বিজ্ঞপ্তি ও আপডেট');
  const [emailBody, setEmailBody] = useState(
    'শ্রদ্ধেয় সাংবাদিক ও সুধী,\n\nউল্লাপাড়া প্রেসক্লাবের পক্ষ থেকে শুভেচ্ছা। প্রেসক্লাবের সর্বশেষ কার্যক্রম ও প্রেস বিজ্ঞপ্তি অবগতির জন্য পাঠানো হলো।\n\nবিনীত,\nসাধারণ সম্পাদক,\nউল্লাপাড়া প্রেসক্লাব'
  );
  const [isEmailSending, setIsEmailSending] = useState(false);

  // Keep / Quick notes state
  const [scratchNotes, setScratchNotes] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('upc_keep_notes');
      return saved ? JSON.parse(saved) : [
        'অনুসন্ধানী প্রতিবেদন: ফুলজোড় নদী সংরক্ষণ ও দূষণ প্রতিরোধ উদ্যোগ',
        'আসন্ন প্রেস ব্রিফিংয়ের প্রশ্নাবলী খসড়া তৈরি',
        'উপজেলা নির্বাহী কর্মকর্তার সাথে মাসিক মতবিনিময় বৈঠকের আলোচ্যসূচি'
      ];
    } catch {
      return [];
    }
  });
  const [newNote, setNewNote] = useState('');

  // Firestore Sync state
  const [isSyncingFirestore, setIsSyncingFirestore] = useState(false);

  useEffect(() => {
    const unsubscribe = initAuth(
      (currentUser, currentToken) => {
        setUser(currentUser);
        setToken(currentToken);
      },
      () => {
        setUser(null);
        setToken(null);
      }
    );
    return () => unsubscribe();
  }, []);

  // Flash message helper
  const notifySuccess = (msg: string) => {
    setSuccessMsg(msg);
    setErrorMsg(null);
    setTimeout(() => setSuccessMsg(null), 4000);
  };

  const notifyError = (msg: string) => {
    setErrorMsg(msg);
    setSuccessMsg(null);
    setTimeout(() => setErrorMsg(null), 5000);
  };

  const handleSignIn = async () => {
    setIsSigningIn(true);
    setErrorMsg(null);
    try {
      const result = await googleSignIn();
      if (result) {
        setUser(result.user);
        setToken(result.accessToken);
        notifySuccess('গুগল অ্যাকাউন্টে সফলভাবে সাইন-ইন সম্পন্ন হয়েছে!');
      }
    } catch (err: any) {
      notifyError(err?.message || 'সাইন-ইন করতে সমস্যা হয়েছে। পপ-আপ ব্লকার চালু থাকলে তা বন্ধ করুন।');
    } finally {
      setIsSigningIn(false);
    }
  };

  const handleSignOut = async () => {
    await logoutGoogle();
    setUser(null);
    setToken(null);
    setDriveFiles([]);
    notifySuccess('সফলভাবে গুগল অ্যাকাউন্ট থেকে সাইন-আউট হয়েছে।');
  };

  // Load Drive files
  const loadDriveFiles = async () => {
    if (!token) return;
    setIsDriveLoading(true);
    try {
      const files = await listDriveFiles(driveSearch ? `name contains '${driveSearch}'` : undefined);
      setDriveFiles(files);
    } catch (err: any) {
      notifyError(err?.message || 'ড্রাইভ ফাইল লোড করা সম্ভব হয়নি');
    } finally {
      setIsDriveLoading(false);
    }
  };

  useEffect(() => {
    if (activeTab === 'drive' && token && driveFiles.length === 0) {
      loadDriveFiles();
    }
  }, [activeTab, token]);

  // Create folder
  const handleCreateFolder = async () => {
    if (!newFolderName.trim()) return;
    try {
      const folder = await createDriveFolder(newFolderName.trim());
      notifySuccess(`ফোল্ডার "${folder.name}" সফলভাবে ড্রাইভে তৈরি হয়েছে!`);
      loadDriveFiles();
    } catch (err: any) {
      notifyError(err?.message || 'ফোল্ডার তৈরি করতে ব্যর্থ');
    }
  };

  // Create Google Doc
  const handleCreateDoc = async () => {
    if (!docTitle.trim()) return;
    setIsDocCreating(true);
    try {
      const result = await createGoogleDoc(docTitle.trim(), docContent);
      setCreatedDoc(result);
      notifySuccess('গুগল ডক সফলভাবে তৈরি হয়েছে!');
    } catch (err: any) {
      notifyError(err?.message || 'গুগল ডক তৈরিতে ব্যর্থ');
    } finally {
      setIsDocCreating(false);
    }
  };

  // Create Sheets for Members
  const handleExportMembersToSheets = async () => {
    setIsSheetCreating(true);
    try {
      const headers = ['ক্রমিক', 'নাম', 'পদবী', 'গণমাধ্যম / পত্রিকা', 'মোবাইল নম্বর', 'ক্যাটাগরি'];
      const rows = members.map((m, idx) => [
        String(idx + 1),
        m.name,
        m.designation,
        m.media,
        m.phone || 'N/A',
        m.category
      ]);

      const result = await createGoogleSheet(`উল্লাপাড়া প্রেসক্লাব - কমিটি ও সদস্য তালিকা (${new Date().getFullYear()})`, headers, rows);
      setCreatedSheet(result);
      notifySuccess('কমিটি সদস্য তালিকা গুগল শিটে সফলভাবে এক্সপোর্ট হয়েছে!');
    } catch (err: any) {
      notifyError(err?.message || 'গুগল শিট তৈরিতে ব্যর্থ');
    } finally {
      setIsSheetCreating(false);
    }
  };

  // Create Sheets for Subscribers
  const handleExportSubscribersToSheets = async () => {
    setIsSheetCreating(true);
    try {
      const headers = ['সাবস্ক্রিপশন আইডি', 'পূর্ণ নাম', 'ইমেইল ঠিকানা', 'ফোন', 'ক্যাটাগরি', 'আগ্রহের বিষয়', 'তারিখ'];
      const rows = subscribers.map(s => [
        s.id,
        s.name,
        s.email,
        s.phone || 'N/A',
        s.category,
        (s.interests || []).join(', '),
        s.subscribedAt
      ]);

      const result = await createGoogleSheet(`উল্লাপাড়া প্রেসক্লাব - নিউজলেটার ও সদস্য সাবস্ক্রাইবার তালিকা`, headers, rows);
      setCreatedSheet(result);
      notifySuccess('নিউজলেটার সাবস্ক্রাইবার তালিকা গুগল শিটে সফলভাবে এক্সপোর্ট হয়েছে!');
    } catch (err: any) {
      notifyError(err?.message || 'গুগল শিট তৈরিতে ব্যর্থ');
    } finally {
      setIsSheetCreating(false);
    }
  };

  // Create Google Slides
  const handleCreateSlides = async () => {
    if (!slideTitle.trim()) return;
    setIsSlideCreating(true);
    try {
      const slides = [
        {
          title: 'কার্যনির্বাহী কমিটির পরিচিতি',
          body: `সভাপতি: ${clubInfo.president || 'মোঃ আনিছুর রহমান লিটন'}\nসাধারণ সম্পাদক: ${clubInfo.generalSecretary || 'মোঃ ময়দুল হোসাইন'}\nপ্রতিষ্ঠিত: ${clubInfo.establishedYear} খ্রি.\nমোট সদস্য সংখ্যা: ${members.length} জন`
        },
        {
          title: 'প্রেসক্লাবের প্রধান ঘোষণাবলী ও কর্মসূচি',
          body: notices.slice(0, 3).map(n => `• ${n.title} (${n.date})`).join('\n')
        }
      ];

      const result = await createGooglePresentation(slideTitle.trim(), slides);
      setCreatedSlide(result);
      notifySuccess('গুগল স্লাইডস প্রেজেন্টেশন সফলভাবে তৈরি হয়েছে!');
    } catch (err: any) {
      notifyError(err?.message || 'গুগল স্লাইডস তৈরিতে ব্যর্থ');
    } finally {
      setIsSlideCreating(false);
    }
  };

  // Create Google Form
  const handleCreateForm = async () => {
    if (!formTitle.trim()) return;
    setIsFormCreating(true);
    try {
      const result = await createGoogleForm(formTitle.trim(), formDesc);
      setCreatedForm(result);
      notifySuccess('গুগল ফর্ম সফলভাবে তৈরি হয়েছে!');
    } catch (err: any) {
      notifyError(err?.message || 'গুগল ফর্ম তৈরিতে ব্যর্থ');
    } finally {
      setIsFormCreating(false);
    }
  };

  // Send Email via Gmail API with explicit confirmation dialog
  const handleSendEmail = async () => {
    if (!emailTo.trim() || !emailSubject.trim() || !emailBody.trim()) {
      notifyError('ইমেইল প্রাপক, বিষয় এবং বিস্তারিত বার্তা পূরণ করুন');
      return;
    }

    const confirmed = window.confirm(
      `আপনি কি নিশ্চিত যে আপনার জিমেইল (${user?.email}) থেকে "${emailTo}" ঠিকানায় এই ইমেইলটি পাঠাতে চান?`
    );
    if (!confirmed) return;

    setIsEmailSending(true);
    try {
      await sendGmail(emailTo.trim(), emailSubject.trim(), emailBody.trim());
      notifySuccess(`ইমেইল সফলভাবে "${emailTo}" ঠিকানায় পাঠানো হয়েছে!`);
      setEmailTo('');
    } catch (err: any) {
      notifyError(err?.message || 'জিমেইল পাঠাতে ব্যর্থ হয়েছে');
    } finally {
      setIsEmailSending(false);
    }
  };

  // Keep Notes Handler
  const handleAddNote = () => {
    if (!newNote.trim()) return;
    const updated = [newNote.trim(), ...scratchNotes];
    setScratchNotes(updated);
    localStorage.setItem('upc_keep_notes', JSON.stringify(updated));
    setNewNote('');
    notifySuccess('সংবাদ নোট সংরক্ষিত হয়েছে!');
  };

  const handleDeleteNote = (idx: number) => {
    const updated = scratchNotes.filter((_, i) => i !== idx);
    setScratchNotes(updated);
    localStorage.setItem('upc_keep_notes', JSON.stringify(updated));
  };

  // Handle Firestore Sync
  const handleFirestoreSync = async () => {
    setIsSyncingFirestore(true);
    try {
      await syncToFirestore();
      notifySuccess('ফায়ারবেস ফায়ারস্টোর ক্লাউডে সকল তথ্য সফলভাবে সিঙ্ক হয়েছে!');
    } catch (err: any) {
      notifyError(err?.message || 'ক্লাউড সিঙ্ক করতে সমস্যা হয়েছে');
    } finally {
      setIsSyncingFirestore(false);
    }
  };

  if (!isWorkspaceModalOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="bg-white w-full max-w-5xl h-[92vh] max-h-[850px] rounded-2xl shadow-2xl border border-slate-200 flex flex-col overflow-hidden">
        
        {/* Modal Header */}
        <div className="bg-[#0b2847] text-white px-5 py-4 flex items-center justify-between border-b border-blue-900/60 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-400 to-amber-200 text-slate-950 flex items-center justify-center font-black shadow-md shrink-0">
              <Sparkles className="w-5 h-5 text-slate-900" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-lg font-serif">গুগল ওয়ার্কস্পেস ও ক্লাউড হাব</h3>
                <span className="text-[10px] font-bold bg-amber-400 text-slate-950 px-2 py-0.5 rounded-full">
                  Google Workspace & Firebase
                </span>
              </div>
              <p className="text-xs text-blue-200">
                ড্রাইভ, ডক্স, শিট, স্লাইডস, ফর্ম, জিমেইল ও ফায়ারবেস ক্লাউড ডেটাবেস সমন্বিত কেন্দ্র
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {user && (
              <div className="hidden sm:flex items-center gap-2 px-2.5 py-1 bg-blue-900/50 rounded-lg border border-blue-800/60 text-xs text-blue-100">
                {user.photoURL && (
                  <img 
                    src={user.photoURL} 
                    alt={user.displayName || 'Google User'} 
                    className="w-5 h-5 rounded-full"
                    referrerPolicy="no-referrer"
                  />
                )}
                <span className="truncate max-w-[140px] font-medium">{user.displayName || user.email}</span>
                <button
                  onClick={handleSignOut}
                  className="p-1 hover:bg-blue-800 rounded text-amber-300 hover:text-amber-200 transition"
                  title="গুগল সাইন-আউট"
                >
                  <LogOut className="w-3.5 h-3.5" />
                </button>
              </div>
            )}
            <button
              onClick={() => setIsWorkspaceModalOpen(false)}
              className="p-2 rounded-xl bg-blue-900/60 hover:bg-blue-800 text-blue-200 hover:text-white transition"
              title="বন্ধ করুন"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Notifications Bar */}
        {successMsg && (
          <div className="bg-emerald-50 text-emerald-900 px-4 py-2 text-xs font-semibold flex items-center gap-2 border-b border-emerald-200 animate-in fade-in">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{successMsg}</span>
          </div>
        )}
        {errorMsg && (
          <div className="bg-rose-50 text-rose-900 px-4 py-2 text-xs font-semibold flex items-center gap-2 border-b border-rose-200 animate-in fade-in">
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
          
          {/* Navigation Sidebar */}
          <div className="w-full md:w-60 bg-slate-50 border-r border-slate-200 p-2.5 flex md:flex-col gap-1 overflow-x-auto md:overflow-visible shrink-0">
            <button
              onClick={() => setActiveTab('drive')}
              className={`flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-bold transition text-left shrink-0 md:shrink ${
                activeTab === 'drive'
                  ? 'bg-[#0d3b66] text-white shadow-sm'
                  : 'text-slate-700 hover:bg-slate-200/70'
              }`}
            >
              <FolderKanban className="w-4 h-4 text-amber-400" />
              <span>গুগল ড্রাইভ (Drive)</span>
            </button>

            <button
              onClick={() => setActiveTab('docs')}
              className={`flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-bold transition text-left shrink-0 md:shrink ${
                activeTab === 'docs'
                  ? 'bg-[#0d3b66] text-white shadow-sm'
                  : 'text-slate-700 hover:bg-slate-200/70'
              }`}
            >
              <FileText className="w-4 h-4 text-blue-400" />
              <span>গুগল ডক্স (Docs)</span>
            </button>

            <button
              onClick={() => setActiveTab('sheets')}
              className={`flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-bold transition text-left shrink-0 md:shrink ${
                activeTab === 'sheets'
                  ? 'bg-[#0d3b66] text-white shadow-sm'
                  : 'text-slate-700 hover:bg-slate-200/70'
              }`}
            >
              <Table className="w-4 h-4 text-emerald-500" />
              <span>গুগল শিট (Sheets)</span>
            </button>

            <button
              onClick={() => setActiveTab('slides')}
              className={`flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-bold transition text-left shrink-0 md:shrink ${
                activeTab === 'slides'
                  ? 'bg-[#0d3b66] text-white shadow-sm'
                  : 'text-slate-700 hover:bg-slate-200/70'
              }`}
            >
              <Presentation className="w-4 h-4 text-amber-500" />
              <span>গুগল স্লাইডস (Slides)</span>
            </button>

            <button
              onClick={() => setActiveTab('forms')}
              className={`flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-bold transition text-left shrink-0 md:shrink ${
                activeTab === 'forms'
                  ? 'bg-[#0d3b66] text-white shadow-sm'
                  : 'text-slate-700 hover:bg-slate-200/70'
              }`}
            >
              <CheckSquare className="w-4 h-4 text-purple-500" />
              <span>গুগল ফর্ম (Forms)</span>
            </button>

            <button
              onClick={() => setActiveTab('gmail')}
              className={`flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-bold transition text-left shrink-0 md:shrink ${
                activeTab === 'gmail'
                  ? 'bg-[#0d3b66] text-white shadow-sm'
                  : 'text-slate-700 hover:bg-slate-200/70'
              }`}
            >
              <Mail className="w-4 h-4 text-rose-500" />
              <span>জিমেইল (Gmail API)</span>
            </button>

            <button
              onClick={() => setActiveTab('keep')}
              className={`flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-bold transition text-left shrink-0 md:shrink ${
                activeTab === 'keep'
                  ? 'bg-[#0d3b66] text-white shadow-sm'
                  : 'text-slate-700 hover:bg-slate-200/70'
              }`}
            >
              <StickyNote className="w-4 h-4 text-amber-600" />
              <span>গুগল কিপ (Keep)</span>
            </button>

            <button
              onClick={() => setActiveTab('cloud')}
              className={`flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-bold transition text-left shrink-0 md:shrink ${
                activeTab === 'cloud'
                  ? 'bg-[#0d3b66] text-white shadow-sm'
                  : 'text-slate-700 hover:bg-slate-200/70'
              }`}
            >
              <Database className="w-4 h-4 text-cyan-600" />
              <span>ক্লাউড ও ডেটাবেস</span>
              {isFirestoreConnected && (
                <span className="ml-auto w-2 h-2 rounded-full bg-emerald-500" title="Firestore Connected" />
              )}
            </button>
          </div>

          {/* Workspace Body */}
          <div className="flex-1 p-4 sm:p-6 overflow-y-auto bg-white">
            
            {/* Google Authentication Banner if not signed in */}
            {!user && activeTab !== 'cloud' && (
              <div className="mb-6 p-4 rounded-xl border border-blue-200 bg-blue-50/60 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="space-y-1 text-center sm:text-left">
                  <h4 className="text-sm font-bold text-slate-900 font-serif">গুগল অ্যাকাউন্ট সংযুক্ত করুন</h4>
                  <p className="text-xs text-slate-600">
                    গুগল ড্রাইভ, ডক্স, শিট, স্লাইডস, ফর্ম ও জিমেইল পরিচালনা করতে আপনার গুগল অ্যাকাউন্ট দিয়ে সাইন-ইন করুন।
                  </p>
                </div>

                <button
                  onClick={handleSignIn}
                  disabled={isSigningIn}
                  className="px-4 py-2.5 bg-white hover:bg-slate-50 border border-slate-300 rounded-xl shadow-xs font-medium text-xs text-slate-800 flex items-center gap-2.5 transition shrink-0"
                >
                  {isSigningIn ? (
                    <Loader2 className="w-4 h-4 animate-spin text-blue-600" />
                  ) : (
                    <svg className="w-4 h-4" viewBox="0 0 48 48">
                      <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z" />
                      <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z" />
                      <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z" />
                      <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z" />
                    </svg>
                  )}
                  <span>Sign in with Google</span>
                </button>
              </div>
            )}

            {/* TAB 1: GOOGLE DRIVE */}
            {activeTab === 'drive' && (
              <div className="space-y-5">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 pb-3">
                  <div>
                    <h4 className="text-base font-bold text-[#0d3b66] font-serif flex items-center gap-2">
                      <FolderKanban className="w-5 h-5 text-amber-500" />
                      <span>গুগল ড্রাইভ প্রেস ফাইল ম্যানেজার</span>
                    </h4>
                    <p className="text-xs text-slate-500">
                      প্রেসক্লাবের অফিসিয়াল ছবি, প্রেস রিলিজ ও ডকুমেন্ট গুগল ড্রাইভে ব্রাউজ ও সংরক্ষণ করুন।
                    </p>
                  </div>

                  {user && (
                    <button
                      onClick={loadDriveFiles}
                      disabled={isDriveLoading}
                      className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs rounded-lg transition flex items-center gap-1.5 self-start"
                    >
                      <RefreshCw className={`w-3.5 h-3.5 ${isDriveLoading ? 'animate-spin' : ''}`} />
                      <span>রিফ্রেশ</span>
                    </button>
                  )}
                </div>

                {user && (
                  <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-3">
                    <h5 className="text-xs font-bold text-slate-800">ড্রাইভে নতুন ফোল্ডার তৈরি করুন:</h5>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={newFolderName}
                        onChange={(e) => setNewFolderName(e.target.value)}
                        placeholder="ফোল্ডারের নাম..."
                        className="flex-1 px-3 py-1.5 text-xs bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500"
                      />
                      <button
                        onClick={handleCreateFolder}
                        className="px-3 py-1.5 bg-[#0d3b66] hover:bg-blue-900 text-white font-bold text-xs rounded-lg transition flex items-center gap-1"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>ফোল্ডার বানান</span>
                      </button>
                    </div>
                  </div>
                )}

                {/* Drive search */}
                {user && (
                  <div className="relative">
                    <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                    <input
                      type="text"
                      placeholder="ড্রাইভের ফাইল বা ফোল্ডার খুঁজুন..."
                      value={driveSearch}
                      onChange={(e) => setDriveSearch(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && loadDriveFiles()}
                      className="w-full pl-9 pr-4 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500"
                    />
                  </div>
                )}

                {/* Files List */}
                {user ? (
                  isDriveLoading ? (
                    <div className="py-12 text-center text-slate-400 flex flex-col items-center gap-2">
                      <Loader2 className="w-6 h-6 animate-spin text-amber-500" />
                      <p className="text-xs">গুগল ড্রাইভ ফাইল লোড হচ্ছে...</p>
                    </div>
                  ) : driveFiles.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 max-h-[400px] overflow-y-auto pr-1">
                      {driveFiles.map((file) => (
                        <div
                          key={file.id}
                          className="p-3 rounded-xl border border-slate-200 bg-white hover:border-blue-300 hover:shadow-xs transition flex items-center justify-between gap-2"
                        >
                          <div className="min-w-0 flex items-center gap-2.5">
                            {file.iconLink ? (
                              <img src={file.iconLink} alt="" className="w-4 h-4 shrink-0" referrerPolicy="no-referrer" />
                            ) : (
                              <FolderKanban className="w-4 h-4 text-amber-500 shrink-0" />
                            )}
                            <div className="min-w-0">
                              <p className="text-xs font-bold text-slate-800 truncate" title={file.name}>
                                {file.name}
                              </p>
                              <p className="text-[10px] text-slate-400 truncate">
                                {file.mimeType.split('.').pop()?.replace('vnd.google-apps.', '')}
                              </p>
                            </div>
                          </div>

                          {file.webViewLink && (
                            <a
                              href={file.webViewLink}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition shrink-0"
                              title="ড্রাইভে খুলুন"
                            >
                              <ExternalLink className="w-3.5 h-3.5" />
                            </a>
                          )}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="py-8 text-center text-slate-400 text-xs bg-slate-50 rounded-xl border border-dashed border-slate-200">
                      কোনো ফাইল বা ফোল্ডার পাওয়া যায়নি।
                    </div>
                  )
                ) : (
                  <div className="py-8 text-center text-slate-500 text-xs">
                    ড্রাইভ ফাইল দেখতে উপরে গুগল অ্যাকাউন্টে সাইন-ইন করুন।
                  </div>
                )}
              </div>
            )}

            {/* TAB 2: GOOGLE DOCS */}
            {activeTab === 'docs' && (
              <div className="space-y-5">
                <div className="border-b border-slate-200 pb-3">
                  <h4 className="text-base font-bold text-[#0d3b66] font-serif flex items-center gap-2">
                    <FileText className="w-5 h-5 text-blue-500" />
                    <span>গুগল ডক্স প্রেস বিজ্ঞপ্তি তৈরি ও ড্রাফটার</span>
                  </h4>
                  <p className="text-xs text-slate-500">
                    প্রেসক্লাবের জরুরি বিজ্ঞপ্তি বা খবর সরাসরি গুগল ডক্সে তৈরি করে ক্লাউডে সংরক্ষণ করুন।
                  </p>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      ডকুমেন্টের শিরোনাম (Title)
                    </label>
                    <input
                      type="text"
                      value={docTitle}
                      onChange={(e) => setDocTitle(e.target.value)}
                      placeholder="প্রেস বিজ্ঞপ্তির শিরোনাম..."
                      className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 font-medium"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      বিজ্ঞপ্তির খসড়া বিবরণ (Body Content)
                    </label>
                    <textarea
                      rows={5}
                      value={docContent}
                      onChange={(e) => setDocContent(e.target.value)}
                      placeholder="বিস্তারিত প্রেস বিজ্ঞপ্তি..."
                      className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 leading-relaxed font-sans"
                    />
                  </div>

                  <button
                    onClick={handleCreateDoc}
                    disabled={isDocCreating || !user}
                    className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-300 text-white font-bold text-xs rounded-xl shadow-sm transition flex items-center gap-2"
                  >
                    {isDocCreating ? <Loader2 className="w-4 h-4 animate-spin" /> : <FileText className="w-4 h-4" />}
                    <span>গুগল ডক্সে নতুন ডকুমেন্ট তৈরি করুন</span>
                  </button>

                  {createdDoc && (
                    <div className="p-4 bg-blue-50 border border-blue-200 rounded-xl space-y-2">
                      <div className="flex items-center gap-2 text-xs font-bold text-blue-900">
                        <CheckCircle2 className="w-4 h-4 text-blue-600" />
                        <span>ডকুমেন্ট সফলভাবে প্রস্তুত হয়েছে:</span>
                      </div>
                      <p className="text-xs text-slate-700 font-medium">{createdDoc.title}</p>
                      <a
                        href={createdDoc.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-lg transition"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                        <span>Google Docs এ সরাসরি খুলুন</span>
                      </a>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* TAB 3: GOOGLE SHEETS */}
            {activeTab === 'sheets' && (
              <div className="space-y-5">
                <div className="border-b border-slate-200 pb-3">
                  <h4 className="text-base font-bold text-[#0d3b66] font-serif flex items-center gap-2">
                    <Table className="w-5 h-5 text-emerald-600" />
                    <span>গুগল শিট ডেটা সিঙ্ক ও এক্সপোর্ট</span>
                  </h4>
                  <p className="text-xs text-slate-500">
                    প্রেসক্লাব কমিটি সদস্য তালিকা ও নিউজলেটার গ্রাহক তালিকা এক ক্লিকে গুগল শিটে রূপান্তর করুন।
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="p-4 bg-emerald-50/70 border border-emerald-200 rounded-xl space-y-3">
                    <div className="flex items-center gap-2 text-emerald-900 font-bold text-sm">
                      <Table className="w-4 h-4 text-emerald-600" />
                      <h5>কমিটি সদস্য তালিকা শিট</h5>
                    </div>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      প্রেসক্লাবের সকল {members.length} জন সদস্যের নাম, পদবী, পত্রিকা ও মোবাইল নম্বর সহ স্বয়ংক্রিয় শিট তৈরি করুন।
                    </p>
                    <button
                      onClick={handleExportMembersToSheets}
                      disabled={isSheetCreating || !user}
                      className="w-full py-2 bg-emerald-600 hover:bg-emerald-700 disabled:bg-slate-300 text-white font-bold text-xs rounded-lg shadow-sm transition flex items-center justify-center gap-2"
                    >
                      {isSheetCreating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
                      <span>সদস্য তালিকা শিট তৈরি করুন</span>
                    </button>
                  </div>

                  <div className="p-4 bg-blue-50/70 border border-blue-200 rounded-xl space-y-3">
                    <div className="flex items-center gap-2 text-blue-900 font-bold text-sm">
                      <Table className="w-4 h-4 text-blue-600" />
                      <h5>নিউজলেটার গ্রাহক শিট</h5>
                    </div>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      ওয়েবসাইট ফুটার থেকে তালিকাভুক্ত {subscribers.length} জন গ্রাহক ও আবেদনকারীর ইমেইল রোস্টার শিটে আনুন।
                    </p>
                    <button
                      onClick={handleExportSubscribersToSheets}
                      disabled={isSheetCreating || !user}
                      className="w-full py-2 bg-[#0d3b66] hover:bg-blue-900 disabled:bg-slate-300 text-white font-bold text-xs rounded-lg shadow-sm transition flex items-center justify-center gap-2"
                    >
                      {isSheetCreating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
                      <span>গ্রাহক রোস্টার শিট তৈরি করুন</span>
                    </button>
                  </div>
                </div>

                {createdSheet && (
                  <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl space-y-2">
                    <div className="flex items-center gap-2 text-xs font-bold text-emerald-900">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      <span>গুগল শিট সফলভাবে তৈরি হয়েছে!</span>
                    </div>
                    <p className="text-xs text-slate-700 font-medium">{createdSheet.title}</p>
                    <a
                      href={createdSheet.spreadsheetUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-lg transition"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                      <span>Google Sheets এ সরাসরি খুলুন</span>
                    </a>
                  </div>
                )}
              </div>
            )}

            {/* TAB 4: GOOGLE SLIDES */}
            {activeTab === 'slides' && (
              <div className="space-y-5">
                <div className="border-b border-slate-200 pb-3">
                  <h4 className="text-base font-bold text-[#0d3b66] font-serif flex items-center gap-2">
                    <Presentation className="w-5 h-5 text-amber-500" />
                    <span>গুগল স্লাইডস প্রেস কনফারেন্স ও প্রেজেন্টেশন</span>
                  </h4>
                  <p className="text-xs text-slate-500">
                    প্রেসক্লাবের বার্ষিক সাধারণ সভা, সাংবাদিক কর্মশালা ও সংবাদ সম্মেলনের জন্য স্লাইড ডেক তৈরি করুন।
                  </p>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      স্লাইড প্রেজেন্টেশনের শিরোনাম
                    </label>
                    <input
                      type="text"
                      value={slideTitle}
                      onChange={(e) => setSlideTitle(e.target.value)}
                      placeholder="প্রেস কনফারেন্স শিরোনাম..."
                      className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 font-medium"
                    />
                  </div>

                  <div className="p-3 bg-amber-50/70 border border-amber-200 rounded-xl text-xs text-amber-950 space-y-1">
                    <p className="font-bold">স্লাইড ডেকের অন্তর্ভুক্ত বিষয়সমূহ:</p>
                    <ul className="list-disc list-inside space-y-0.5 text-slate-700 text-[11px]">
                      <li>কভার স্লাইড: {slideTitle}</li>
                      <li>কমিটি পরিচিতি স্লাইড: সভাপতি, সাধারণ সম্পাদক ও নেতৃত্ব</li>
                      <li>ঘোষণাবলী স্লাইড: বর্তমান নোটিশ ও প্রেস রিলিজের পয়েন্টার</li>
                    </ul>
                  </div>

                  <button
                    onClick={handleCreateSlides}
                    disabled={isSlideCreating || !user}
                    className="px-4 py-2.5 bg-amber-500 hover:bg-amber-400 disabled:bg-slate-300 text-slate-950 font-bold text-xs rounded-xl shadow-sm transition flex items-center gap-2"
                  >
                    {isSlideCreating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Presentation className="w-4 h-4" />}
                    <span>গুগল স্লাইডস প্রেজেন্টেশন তৈরি করুন</span>
                  </button>

                  {createdSlide && (
                    <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl space-y-2">
                      <div className="flex items-center gap-2 text-xs font-bold text-amber-950">
                        <CheckCircle2 className="w-4 h-4 text-amber-600" />
                        <span>স্লাইড প্রেজেন্টেশন সফলভাবে তৈরি হয়েছে!</span>
                      </div>
                      <p className="text-xs text-slate-700 font-medium">{createdSlide.title}</p>
                      <a
                        href={createdSlide.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold rounded-lg transition"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                        <span>Google Slides এ সরাসরি উপস্থাপনা দেখুন</span>
                      </a>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* TAB 5: GOOGLE FORMS */}
            {activeTab === 'forms' && (
              <div className="space-y-5">
                <div className="border-b border-slate-200 pb-3">
                  <h4 className="text-base font-bold text-[#0d3b66] font-serif flex items-center gap-2">
                    <CheckSquare className="w-5 h-5 text-purple-600" />
                    <span>গুগল ফর্ম - অনলাইন আবেদন ও জরিপ</span>
                  </h4>
                  <p className="text-xs text-slate-500">
                    সদস্যপদের অনলাইন আবেদন ও নাগরিক মতামতের জন্য গুগল ফর্ম তৈরি করুন।
                  </p>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      ফর্মের নাম (Form Title)
                    </label>
                    <input
                      type="text"
                      value={formTitle}
                      onChange={(e) => setFormTitle(e.target.value)}
                      placeholder="ফর্মের নাম..."
                      className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-lg focus:ring-2 focus:ring-purple-500 font-medium"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      ফর্মের বিবরণ ও নির্দেশনাবলী
                    </label>
                    <textarea
                      rows={3}
                      value={formDesc}
                      onChange={(e) => setFormDesc(e.target.value)}
                      className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                    />
                  </div>

                  <button
                    onClick={handleCreateForm}
                    disabled={isFormCreating || !user}
                    className="px-4 py-2.5 bg-purple-600 hover:bg-purple-700 disabled:bg-slate-300 text-white font-bold text-xs rounded-xl shadow-sm transition flex items-center gap-2"
                  >
                    {isFormCreating ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckSquare className="w-4 h-4" />}
                    <span>গুগল ফর্ম তৈরি করুন</span>
                  </button>

                  {createdForm && (
                    <div className="p-4 bg-purple-50 border border-purple-200 rounded-xl space-y-3">
                      <div className="flex items-center gap-2 text-xs font-bold text-purple-950">
                        <CheckCircle2 className="w-4 h-4 text-purple-600" />
                        <span>গুগল ফর্ম প্রস্তুত হয়েছে!</span>
                      </div>
                      <p className="text-xs text-slate-700 font-medium">{createdForm.title}</p>
                      
                      <div className="flex flex-wrap gap-2 pt-1">
                        <a
                          href={createdForm.responderUri}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold rounded-lg transition"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                          <span>আবেদনকারীদের জন্য ফর্ম লিংক</span>
                        </a>
                        <a
                          href={createdForm.editUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white border border-purple-300 hover:bg-purple-100 text-purple-900 text-xs font-bold rounded-lg transition"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                          <span>ফর্ম এডিট করুন</span>
                        </a>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* TAB 6: GMAIL API */}
            {activeTab === 'gmail' && (
              <div className="space-y-5">
                <div className="border-b border-slate-200 pb-3">
                  <h4 className="text-base font-bold text-[#0d3b66] font-serif flex items-center gap-2">
                    <Mail className="w-5 h-5 text-rose-500" />
                    <span>জিমেইল দিয়ে প্রেস বিজ্ঞপ্তি ও ইমেইল প্রেরণ</span>
                  </h4>
                  <p className="text-xs text-slate-500">
                    আপনার সংযুক্ত গুগল অ্যাকাউন্ট থেকে সরাসরি সাংবাদিক বা সংবাদ সংস্থায় প্রেস রিলিজ পাঠান।
                  </p>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      প্রাপকের ইমেইল ঠিকানা (Recipient Email)
                    </label>
                    <input
                      type="email"
                      value={emailTo}
                      onChange={(e) => setEmailTo(e.target.value)}
                      placeholder="newsdesk@media.com অথবা সাংবাদিকের ইমেইল..."
                      className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-lg focus:ring-2 focus:ring-rose-500"
                    />
                    {subscribers.length > 0 && (
                      <div className="flex items-center gap-1.5 mt-1.5 overflow-x-auto text-[10px] text-slate-500">
                        <span>দ্রুত প্রাপক নির্বাচন:</span>
                        {subscribers.slice(0, 3).map(s => (
                          <button
                            key={s.id}
                            type="button"
                            onClick={() => setEmailTo(s.email)}
                            className="bg-slate-100 hover:bg-slate-200 text-slate-700 px-2 py-0.5 rounded font-mono"
                          >
                            {s.name} ({s.email})
                          </button>
                        ))}
                      </div>
                    )}
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      ইমেইলের বিষয় (Subject)
                    </label>
                    <input
                      type="text"
                      value={emailSubject}
                      onChange={(e) => setEmailSubject(e.target.value)}
                      placeholder="ইমেইল বিষয়..."
                      className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-lg focus:ring-2 focus:ring-rose-500 font-medium"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      বার্তার মূল অংশ (Body)
                    </label>
                    <textarea
                      rows={5}
                      value={emailBody}
                      onChange={(e) => setEmailBody(e.target.value)}
                      placeholder="ইমেইলের বিস্তারিত..."
                      className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-lg focus:ring-2 focus:ring-rose-500 font-sans leading-relaxed"
                    />
                  </div>

                  <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-950">
                    <p className="font-semibold flex items-center gap-1">
                      <AlertCircle className="w-3.5 h-3.5 text-rose-600" />
                      নিরাপত্তা নিশ্চিতকরণ:
                    </p>
                    <p className="text-slate-600 text-[11px] mt-0.5">
                      ইমেইল প্রেরণের পূর্বে সম্মতি নিশ্চিত করতে পপ-আপ বার্তা দেখানো হবে। ইমেইলটি আপনার জিমেইল ({user?.email || 'Google Account'}) থেকে সরাসরি প্রেরিত হবে।
                    </p>
                  </div>

                  <button
                    onClick={handleSendEmail}
                    disabled={isEmailSending || !user}
                    className="px-5 py-2.5 bg-rose-600 hover:bg-rose-700 disabled:bg-slate-300 text-white font-bold text-xs rounded-xl shadow-sm transition flex items-center gap-2"
                  >
                    {isEmailSending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                    <span>জিমেইল পাঠিয়ে দিন</span>
                  </button>
                </div>
              </div>
            )}

            {/* TAB 7: GOOGLE KEEP */}
            {activeTab === 'keep' && (
              <div className="space-y-5">
                <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                  <div>
                    <h4 className="text-base font-bold text-[#0d3b66] font-serif flex items-center gap-2">
                      <StickyNote className="w-5 h-5 text-amber-600" />
                      <span>গুগল কিপ প্রেস মেমো ও ফিল্ড নোট</span>
                    </h4>
                    <p className="text-xs text-slate-500">
                      সাংবাদিকদের জন্য মাঠপর্যায়ের অনুসন্ধানী নোটপ্যাড ও কিপ ক্লাউড নোটস সিঙ্ক।
                    </p>
                  </div>

                  <a
                    href="https://keep.google.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3 py-1.5 bg-amber-100 hover:bg-amber-200 text-amber-900 font-bold text-xs rounded-lg transition flex items-center gap-1.5"
                  >
                    <ExternalLink className="w-3.5 h-3.5 text-amber-700" />
                    <span>Google Keep খুলুন</span>
                  </a>
                </div>

                <div className="space-y-3">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={newNote}
                      onChange={(e) => setNewNote(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handleAddNote()}
                      placeholder="নতুন সংবাদের বিষয় বা তথ্য টুকে রাখুন..."
                      className="flex-1 px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500"
                    />
                    <button
                      onClick={handleAddNote}
                      className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-lg transition flex items-center gap-1"
                    >
                      <Plus className="w-4 h-4" />
                      <span>সংরক্ষণ</span>
                    </button>
                  </div>

                  <div className="space-y-2 pt-2">
                    {scratchNotes.map((note, idx) => (
                      <div
                        key={idx}
                        className="p-3 bg-amber-50/50 border border-amber-200 rounded-xl flex items-center justify-between gap-3 text-xs text-slate-800"
                      >
                        <p className="flex-1 leading-relaxed font-medium">{note}</p>
                        <button
                          onClick={() => handleDeleteNote(idx)}
                          className="text-rose-500 hover:text-rose-700 p-1 hover:bg-rose-50 rounded text-[11px]"
                          title="মুছুন"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* TAB 8: CLOUD & DATABASE STATUS */}
            {activeTab === 'cloud' && (
              <div className="space-y-5">
                <div className="border-b border-slate-200 pb-3">
                  <h4 className="text-base font-bold text-[#0d3b66] font-serif flex items-center gap-2">
                    <Database className="w-5 h-5 text-cyan-600" />
                    <span>ক্লাউড ডেটাবেস স্ট্যাটাস ও সিঙ্ক হাব</span>
                  </h4>
                  <p className="text-xs text-slate-500">
                    ফায়ারবেস ফায়ারস্টোর ক্লাউড ডেটাবেস এবং ক্লাউড এসকিউএল ইন্টিগ্রেশন অবস্থা।
                  </p>
                </div>

                {/* Firestore card */}
                <div className="p-4 rounded-xl border border-emerald-200 bg-emerald-50/60 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-emerald-950 font-bold text-sm">
                      <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                      <h5>ফায়ারবেস ফায়ারস্টোর (Firebase Firestore)</h5>
                    </div>
                    <span className="text-[10px] font-bold bg-emerald-200 text-emerald-900 px-2 py-0.5 rounded-full">
                      সক্রিয় (Active)
                    </span>
                  </div>

                  <div className="text-xs text-slate-700 space-y-1">
                    <p><strong>প্রজেক্ট আইডি:</strong> <span className="font-mono text-[11px]">gen-lang-client-0313843127</span></p>
                    <p><strong>ক্লাউড রিজিয়ন:</strong> <span className="font-mono text-[11px]">us-west1</span></p>
                    <p><strong>সংরক্ষণাগার কালেকশন:</strong> members, notices, complaints, subscribers, club_info</p>
                    <p><strong>নিরাপত্তা রুলস:</strong> firestore.rules সফলভাবে ডেপলয় করা হয়েছে।</p>
                  </div>

                  <button
                    onClick={handleFirestoreSync}
                    disabled={isSyncingFirestore}
                    className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 disabled:bg-slate-400 text-white font-bold text-xs rounded-lg shadow-sm transition flex items-center gap-2"
                  >
                    {isSyncingFirestore ? <Loader2 className="w-4 h-4 animate-spin" /> : <RefreshCw className="w-4 h-4" />}
                    <span>প্রেসক্লাবের সমস্ত ডেটা ফায়ারস্টোরে সিঙ্ক করুন</span>
                  </button>
                </div>

                {/* Cloud SQL Card */}
                <div className="p-4 rounded-xl border border-amber-200 bg-amber-50/50 space-y-2 text-xs text-amber-950">
                  <div className="flex items-center justify-between">
                    <h5 className="font-bold flex items-center gap-1.5">
                      <Database className="w-4 h-4 text-amber-700" />
                      <span>গুগল ক্লাউড এসকিউএল (Cloud SQL - us-west1)</span>
                    </h5>
                    <span className="text-[10px] font-bold bg-amber-200 text-amber-900 px-2 py-0.5 rounded-full">
                      GCP বিলিং রিকুয়্যার্ড
                    </span>
                  </div>
                  <p className="text-slate-700 text-[11px] leading-relaxed">
                    ক্লাউড এসকিউএল (PostgreSQL / MySQL) ডেডিকেটেড রিলেশনাল ডাটাবেস ইনস্ট্যান্স প্রভিশন করতে গুগল ক্লাউড প্রোজেক্টে ওনার পারমিশন ও বিলিং একাউন্ট অ্যাক্টিভেশন প্রয়োজন। ওয়েবসাইটের সমস্ত ডেটা বর্তমানে দ্রুততম ও নিরাপদ ফায়ারবেস ক্লাউড স্টোরেজে সক্রিয় রয়েছে।
                  </p>
                </div>
              </div>
            )}

          </div>
        </div>

      </div>
    </div>
  );
}
