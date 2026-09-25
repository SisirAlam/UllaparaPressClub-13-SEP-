import { useState } from 'react';
import { usePWAInstall } from '../hooks/usePWAInstall';
import { usePressClub } from '../context/PressClubContext';
import { 
  Smartphone, 
  Download, 
  CheckCircle2, 
  Sparkles, 
  ExternalLink, 
  X, 
  Copy, 
  Check, 
  ShieldCheck, 
  Zap, 
  WifiOff, 
  Bell, 
  Layers, 
  Code2, 
  HelpCircle,
  FileCode2,
  Share2,
  Lock,
  Unlock,
  Key,
  AlertTriangle,
  Eye,
  EyeOff
} from 'lucide-react';

interface AndroidAppModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AndroidAppModal({ isOpen, onClose }: AndroidAppModalProps) {
  const { isInstallable, isInstalled, isAndroid, isIOS, install } = usePWAInstall();
  const { clubInfo, images, adminPin, isAdminAuthenticated, setIsAdminOpen } = usePressClub();

  const [activeTab, setActiveTab] = useState<'install' | 'apk' | 'features'>('install');
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const [installSuccess, setInstallSuccess] = useState(false);

  // Security gate states
  const [enteredPin, setEnteredPin] = useState('');
  const [pinUnlocked, setPinUnlocked] = useState(false);
  const [pinError, setPinError] = useState<string | null>(null);
  const [pinSuccessMsg, setPinSuccessMsg] = useState<string | null>(null);
  const [showPin, setShowPin] = useState(false);

  const isAuthorized = isAdminAuthenticated || pinUnlocked;

  if (!isOpen) return null;

  const handleUnlockWithPin = (e: React.FormEvent) => {
    e.preventDefault();
    if (enteredPin.trim() === adminPin.trim()) {
      setPinUnlocked(true);
      setPinError(null);
      setPinSuccessMsg('সিকিউরিটি পিন সঠিক! অ্যাপ ডাউনলোড ও ইনস্টলেশন অনুমোদিত হয়েছে।');
      setTimeout(() => setPinSuccessMsg(null), 3500);
    } else {
      setPinError('ভুল সিকিউরিটি পিন! সঠিক অ্যাডমিন পিন প্রদান করুন।');
    }
  };

  const handleInstallClick = async () => {
    if (!isAuthorized) {
      setPinError('নিরাপত্তা নীতি: শুধুমাত্র অ্যাডমিন প্যানেল অথবা সঠিক পিন (PIN) প্রদান করে ডাউনলোড আনলক করতে হবে।');
      return;
    }
    const success = await install();
    if (success) {
      setInstallSuccess(true);
      setTimeout(() => setInstallSuccess(false), 4000);
    }
  };

  const copyToClipboard = (text: string, id: string) => {
    if (!isAuthorized) {
      setPinError('অ্যাডমিন পিন বা অনুমতি ব্যতীত ফাইল বা কোড অ্যাক্সেস সুরক্ষিত।');
      return;
    }
    navigator.clipboard.writeText(text);
    setCopiedCode(id);
    setTimeout(() => setCopiedCode(null), 2500);
  };

  const downloadAndroidConfigZip = () => {
    if (!isAuthorized) {
      setPinError('অ্যাডমিন পিন ব্যতীত ফাইল ডাউনলোড করা যাবে না।');
      return;
    }
    // Generate a standalone android package bundle JSON
    const twaManifest = {
      packageId: "org.ullaparapressclub.app",
      host: window.location.hostname || "ullaparapressclub.org",
      name: "উল্লাপাড়া প্রেসক্লাব",
      launcherName: "প্রেসক্লাব",
      themeColor: "#0d3b66",
      navigationColor: "#07203d",
      backgroundColor: "#07203d",
      startUrl: "/",
      iconUrl: "/pwa-512x512.png",
      maskableIconUrl: "/pwa-maskable-512x512.png",
      appVersion: "2.0.0",
      appVersionCode: 2,
      shortcuts: [
        {
          name: "নোটিশ বোর্ড",
          short_name: "নোটিশ",
          url: "/#notices",
          icon: "/pwa-192x192.png"
        },
        {
          name: "অভিযোগ জমা",
          short_name: "অভিযোগ",
          url: "/#complaint",
          icon: "/pwa-192x192.png"
        }
      ]
    };

    const blob = new Blob([JSON.stringify(twaManifest, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'twa-manifest.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const downloadAssetLinks = () => {
    if (!isAuthorized) {
      setPinError('অ্যাডমিন পিন ব্যতীত AssetLinks ফাইল ডাউনলোড করা যাবে না।');
      return;
    }
    const assetlinks = [
      {
        relation: ["delegate_permission/common.handle_all_urls"],
        target: {
          namespace: "android_app",
          package_name: "org.ullaparapressclub.app",
          sha256_cert_fingerprints: [
            "14:6D:E9:7D:0F:52:AB:E0:44:A2:38:EC:37:A6:DC:9D:2F:3A:45:B6:77:A3:4C:E6:C9:8F:BC:67:89:01:23:45"
          ]
        }
      }
    ];
    const blob = new Blob([JSON.stringify(assetlinks, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'assetlinks.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const bubblewrapCommand = `npm install -g @bubblewrap/cli
bubblewrap init --manifest=${window.location.origin}/manifest.webmanifest
bubblewrap build`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-sm overflow-y-auto animate-in fade-in duration-200">
      <div className="relative w-full max-w-3xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden my-auto">
        
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-[#07203d] via-[#0d3b66] to-[#144272] text-white p-5 sm:p-6 relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition focus:outline-none"
            title="বন্ধ করুন"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-3 sm:gap-4">
            <div className="w-14 h-14 rounded-2xl bg-white p-1 border-2 border-amber-400 shadow-lg flex items-center justify-center shrink-0 overflow-hidden">
              {images?.logo ? (
                <img
                  src={images.logo}
                  alt="App Icon"
                  className="w-full h-full object-contain rounded-xl"
                  referrerPolicy="no-referrer"
                />
              ) : (
                <Smartphone className="w-8 h-8 text-[#0d3b66]" />
              )}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 text-[11px] font-bold uppercase tracking-wider bg-emerald-500 text-slate-950 rounded-full">
                  অ্যান্ড্রয়েড অ্যাপ্লিকেশন
                </span>
                <span className="text-xs text-amber-300 font-semibold">
                  v2.0 (WebAPK / TWA / PWA)
                </span>
              </div>
              <h2 className="text-xl sm:text-2xl font-bold font-serif text-white mt-1">
                {clubInfo.nameBangla} মোবাইল অ্যাপ
              </h2>
              <p className="text-xs sm:text-sm text-blue-100/80 mt-0.5">
                স্মার্টফোনে সরাসরি ইনস্টল করুন • কোনো প্লে স্টোর চার্জ বা বাড়তি জায়গা ছাড়া
              </p>
            </div>
          </div>

          {/* Tab Navigation */}
          <div className="flex items-center gap-2 mt-5 pt-3 border-t border-white/10 overflow-x-auto text-xs sm:text-sm">
            <button
              onClick={() => setActiveTab('install')}
              className={`px-3.5 py-1.5 rounded-xl font-bold transition flex items-center gap-1.5 whitespace-nowrap ${
                activeTab === 'install'
                  ? 'bg-amber-400 text-slate-950 shadow-sm'
                  : 'bg-white/10 hover:bg-white/20 text-white'
              }`}
            >
              <Smartphone className="w-4 h-4" />
              <span>ফোনে সরাসরি ইনস্টল</span>
            </button>
            <button
              onClick={() => setActiveTab('apk')}
              className={`px-3.5 py-1.5 rounded-xl font-bold transition flex items-center gap-1.5 whitespace-nowrap ${
                activeTab === 'apk'
                  ? 'bg-amber-400 text-slate-950 shadow-sm'
                  : 'bg-white/10 hover:bg-white/20 text-white'
              }`}
            >
              <Code2 className="w-4 h-4" />
              <span>APK ও প্লে স্টোর বিল্ড</span>
            </button>
            <button
              onClick={() => setActiveTab('features')}
              className={`px-3.5 py-1.5 rounded-xl font-bold transition flex items-center gap-1.5 whitespace-nowrap ${
                activeTab === 'features'
                  ? 'bg-amber-400 text-slate-950 shadow-sm'
                  : 'bg-white/10 hover:bg-white/20 text-white'
              }`}
            >
              <Sparkles className="w-4 h-4" />
              <span>অ্যাপের সুবিধাসমূহ</span>
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-5 sm:p-6 max-h-[70vh] overflow-y-auto space-y-6">

          {/* Security PIN Gateway Banner */}
          {!isAuthorized ? (
            <div className="p-5 rounded-2xl bg-gradient-to-r from-amber-500/10 via-amber-50 to-orange-50 border-2 border-amber-400 shadow-sm space-y-3">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl bg-amber-500 text-slate-950 flex items-center justify-center shrink-0 shadow-xs">
                  <Lock className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-bold text-slate-900 text-sm sm:text-base">
                      অ্যাপ ডাউনলোড ও ইনস্টলেশন সুরক্ষিত (পিন দ্বারা সংরক্ষিত)
                    </h3>
                    <span className="px-2 py-0.5 text-[10px] font-extrabold bg-amber-500 text-slate-950 rounded-md uppercase">
                      লক করা
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                    উল্লাপাড়া প্রেসক্লাবের সুরক্ষা নীতি অনুযায়ী <strong>অ্যাডমিন প্যানেল এক্সেস অথবা অনুমোদিত সিকিউরিটি পিন (PIN)</strong> ব্যতীত কেউ মোবাইল অ্যাপ ডাউনলোড বা ইনস্টল করতে পারবে না।
                  </p>
                </div>
              </div>

              {/* PIN Input Form */}
              <form onSubmit={handleUnlockWithPin} className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                <div className="relative flex-1">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                    <Key className="w-4 h-4" />
                  </div>
                  <input
                    type={showPin ? "text" : "password"}
                    value={enteredPin}
                    onChange={(e) => {
                      setEnteredPin(e.target.value);
                      if (pinError) setPinError(null);
                    }}
                    placeholder="অ্যাডমিন সিকিউরিটি পিন (PIN) লিখুন..."
                    className="w-full pl-9 pr-10 py-2 rounded-xl border border-amber-300 focus:outline-none focus:ring-2 focus:ring-amber-500 bg-white text-xs sm:text-sm font-mono text-slate-900"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPin(!showPin)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600"
                  >
                    {showPin ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>

                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-gradient-to-r from-[#0d3b66] to-[#07203d] hover:from-[#144272] hover:to-[#0d3b66] text-white font-bold text-xs shadow-sm transition flex items-center justify-center gap-1.5 shrink-0"
                >
                  <Unlock className="w-3.5 h-3.5 text-amber-400" />
                  <span>পিন যাচাই ও আনলক করুন</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    setIsAdminOpen(true);
                  }}
                  className="px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs transition shrink-0"
                >
                  অ্যাডমিন প্যানেল খুলুন
                </button>
              </form>

              {pinError && (
                <div className="flex items-center gap-1.5 text-xs text-red-600 font-medium pt-1">
                  <AlertTriangle className="w-4 h-4 shrink-0" />
                  <span>{pinError}</span>
                </div>
              )}
            </div>
          ) : (
            <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-300 flex items-center justify-between gap-3 text-emerald-900 text-xs sm:text-sm">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-emerald-500 text-white flex items-center justify-center shrink-0">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <span className="font-bold">✓ অ্যাডমিন অনুমোদন সক্রিয়: </span>
                  <span className="text-emerald-800 text-xs">
                    অ্যাপ ডাউনলোড, ইনস্টলেশন ও সোর্স বান্ডেল অ্যাক্সেস উন্মুক্ত রয়েছে।
                  </span>
                </div>
              </div>
              <span className="px-2 py-0.5 bg-emerald-200 text-emerald-900 rounded font-bold text-[11px] shrink-0">
                অনুমোদিত
              </span>
            </div>
          )}

          {/* TAB 1: DIRECT INSTALL (PWA / WebAPK) */}
          {activeTab === 'install' && (
            <div className="space-y-6 animate-in fade-in duration-200">
              
              {/* Status Banner */}
              {isInstalled ? (
                <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-500 text-white flex items-center justify-center shrink-0">
                    <CheckCircle2 className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="font-bold text-emerald-900 text-sm">
                      অ্যাপ্লিকেশনটি সফলভাবে ইনস্টল করা আছে!
                    </h4>
                    <p className="text-xs text-emerald-700">
                      আপনি বর্তমানে ক্লাবের অফিসিয়াল অ্যাপ মোডে আছেন অথবা এটি আপনার ফোনের হোমস্ক্রিনে যুক্ত রয়েছে।
                    </p>
                  </div>
                </div>
              ) : (
                <div className="p-4 rounded-2xl bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-amber-500 text-slate-950 flex items-center justify-center shrink-0 shadow-sm">
                      <Zap className="w-6 h-6" />
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-900 text-sm sm:text-base">
                        ১-ক্লিকে অ্যান্ড্রয়েড ফোনে অ্যাপটি ইনস্টল করুন
                      </h4>
                      <p className="text-xs text-slate-600">
                        কোনো থার্ড-পার্টি ফাইল ডাউনলোড ছাড়াই গুগলের আধুনিক PWA প্রযুক্তিতে নিরাপদ ইনস্টলেশন
                      </p>
                    </div>
                  </div>

                  {isInstallable ? (
                    <button
                      onClick={handleInstallClick}
                      className={`w-full sm:w-auto px-5 py-3 rounded-xl font-bold text-sm shadow-md transition flex items-center justify-center gap-2 shrink-0 ${
                        isAuthorized
                          ? 'bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-500 hover:to-emerald-600 text-white'
                          : 'bg-amber-500 hover:bg-amber-400 text-slate-950'
                      }`}
                    >
                      {isAuthorized ? <Download className="w-4 h-4" /> : <Lock className="w-4 h-4" />}
                      <span>{isAuthorized ? 'এখনই ইনস্টল করুন' : 'পিন দিয়ে আনলক করে ইনস্টল করুন'}</span>
                    </button>
                  ) : (
                    <div className="text-right">
                      <span className="inline-block px-3 py-1 bg-amber-200 text-amber-900 rounded-full text-xs font-bold">
                        ব্রাউজার থেকে যোগ করার সুবিধা প্রস্তুত
                      </span>
                    </div>
                  )}
                </div>
              )}

              {installSuccess && (
                <div className="p-3 bg-emerald-100 text-emerald-900 rounded-xl text-xs font-semibold flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-700" />
                  অ্যাপ ইনস্টল রিকোয়েস্ট সফল হয়েছে! অনুগ্রহ করে আপনার ফোনের হোম স্ক্রিন লক্ষ্য করুন।
                </div>
              )}

              {/* Step by Step Visual Guide */}
              <div className="space-y-3">
                <h3 className="text-sm font-bold uppercase tracking-wider text-[#0d3b66] flex items-center gap-2">
                  <HelpCircle className="w-4 h-4 text-amber-500" />
                  <span>অ্যান্ড্রয়েড ফোনে কিভাবে ইনস্টল করবেন (৩টি সহজ ধাপ)</span>
                </h3>

                <div className="grid sm:grid-cols-3 gap-3">
                  <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 hover:border-amber-400 transition space-y-2">
                    <div className="w-7 h-7 rounded-full bg-[#0d3b66] text-white flex items-center justify-center text-xs font-bold">
                      ১
                    </div>
                    <h5 className="font-bold text-xs text-slate-900">Chrome ব্রাউজার ব্যবহার করুন</h5>
                    <p className="text-[11px] text-slate-600 leading-relaxed">
                      অ্যান্ড্রয়েড ফোনের Google Chrome ব্রাউজারে এই ওয়েবসাইটটি ওপেন করুন।
                    </p>
                  </div>

                  <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 hover:border-amber-400 transition space-y-2">
                    <div className="w-7 h-7 rounded-full bg-amber-500 text-slate-950 flex items-center justify-center text-xs font-bold">
                      ২
                    </div>
                    <h5 className="font-bold text-xs text-slate-900">মেন্যু থেকে সিলেক্ট করুন</h5>
                    <p className="text-[11px] text-slate-600 leading-relaxed">
                      উপরে ডানপাশের থ্রি-ডট (<strong>⋮</strong>) মেন্যুতে ক্লিক করে <strong className="text-[#0d3b66]">"Install app"</strong> বা <strong className="text-[#0d3b66]">"Add to Home screen"</strong> চাপুন।
                    </p>
                  </div>

                  <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 hover:border-amber-400 transition space-y-2">
                    <div className="w-7 h-7 rounded-full bg-emerald-600 text-white flex items-center justify-center text-xs font-bold">
                      ৩
                    </div>
                    <h5 className="font-bold text-xs text-slate-900">ইনস্টল নিশ্চিত করুন</h5>
                    <p className="text-[11px] text-slate-600 leading-relaxed">
                      "Install" চাপলেই ফোনের অ্যাপ ড্রয়ারে উল্লাপাড়া প্রেসক্লাবের নিজস্ব লোগো সহ অ্যাপটি চলে আসবে।
                    </p>
                  </div>
                </div>
              </div>

              {/* iOS / iPhone note */}
              <div className="p-3.5 rounded-xl bg-blue-50 border border-blue-200 text-xs text-blue-900 flex items-start gap-2.5">
                <Share2 className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <strong className="font-bold">আইফোন (iOS / iPad) ব্যবহারকারীদের জন্য:</strong>
                  <p className="text-[11px] text-blue-800 leading-relaxed">
                    Safari ব্রাউজারের নিচে <strong>Share (শেয়ার)</strong> বাটনে ক্লিক করে <strong>"Add to Home Screen"</strong> চাপুন।
                  </p>
                </div>
              </div>

            </div>
          )}

          {/* TAB 2: APK & PLAY STORE GENERATION */}
          {activeTab === 'apk' && (
            <div className="space-y-6 animate-in fade-in duration-200">
              
              <div className="p-4 rounded-2xl bg-slate-900 text-white space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4" />
                    গুগল প্লে স্টোর ও ইনস্টলেবল APK প্যাকেজিং
                  </span>
                  <span className="text-[11px] text-slate-400">
                    আইসিটি পার্টনার: Sristi Communication
                  </span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  এই ওয়েবসাইটটি গুগল প্লে স্টোরের সকল নির্দেশিকা ও PWA স্ট্যান্ডার্ড অনুযায়ী নির্মিত। আপনি সহজেই এটি সরাসরি একটি স্বাক্ষরিত (Signed) অ্যান্ড্রয়েড অ্যাপ বান্ডেল (AAB) বা ইনস্টলেবল APK-তে রূপান্তর করতে পারবেন।
                </p>
              </div>

              {/* Option A: PWABuilder (Fastest, No Code) */}
              <div className="p-5 rounded-2xl border border-slate-200 hover:border-amber-400 transition space-y-3 bg-white">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 bg-blue-100 text-blue-800 font-bold rounded text-xs">
                      পদ্ধতি ১ (সুপার সহজ)
                    </span>
                    <h4 className="font-bold text-sm text-[#0d3b66]">
                      PWABuilder.com দিয়ে ১-ক্লিকে APK ও Play Store AAB
                    </h4>
                  </div>
                  <a
                    href="https://www.pwabuilder.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-xs font-bold text-blue-600 hover:text-blue-700"
                  >
                    <span>PWABuilder খুলুন</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  PWABuilder (মাইক্রোসফটের অফিসিয়াল ওপেন সোর্স টুল) এ এই ওয়েবসাইটের URL দিলে সরাসরি গুগল প্লে স্টোরের জন্য রেডি-টু-আপলোড <strong>Android App Bundle (.aab)</strong> এবং টেস্টিং <strong>APK</strong> প্যাকেজ ডাউনলোড করা যায়।
                </p>
                <div className="pt-2 flex flex-wrap items-center gap-2">
                  <button
                    onClick={() => copyToClipboard(window.location.origin, 'site-url')}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold transition"
                  >
                    {copiedCode === 'site-url' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>ওয়েবসাইট URL কপি করুন</span>
                  </button>
                  <button
                    onClick={downloadAndroidConfigZip}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-400 hover:bg-amber-300 text-slate-950 text-xs font-bold transition shadow-xs"
                  >
                    {isAuthorized ? <Download className="w-3.5 h-3.5" /> : <Lock className="w-3.5 h-3.5 text-slate-800" />}
                    <span>TWA Manifest JSON নামান {!isAuthorized && '(লকড)'}</span>
                  </button>
                  <button
                    onClick={downloadAssetLinks}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-800 text-xs font-bold transition border border-blue-200"
                  >
                    {isAuthorized ? <FileCode2 className="w-3.5 h-3.5" /> : <Lock className="w-3.5 h-3.5 text-blue-800" />}
                    <span>AssetLinks JSON নামান {!isAuthorized && '(লকড)'}</span>
                  </button>
                </div>
              </div>

              {/* Option B: Google Bubblewrap CLI */}
              <div className="p-5 rounded-2xl border border-slate-200 hover:border-amber-400 transition space-y-3 bg-white">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 font-bold rounded text-xs">
                      পদ্ধতি ২ (অফিসিয়াল গুগল টুল)
                    </span>
                    <h4 className="font-bold text-sm text-[#0d3b66]">
                      Google Bubblewrap CLI দিয়ে নেটিভ TWA APK বিল্ড
                    </h4>
                  </div>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  গুগল ক্রোম টিমের অফিসিয়াল কমান্ড-লাইন টুল Bubblewrap দিয়ে টার্মিনালে মাত্র ২টি কমান্ডেই সম্পূর্ণ অ্যান্ড্রয়েড স্টুডিও প্রজেক্ট ও APK প্রস্তুত করা যায়:
                </p>
                <div className="relative bg-slate-950 text-emerald-400 p-3 rounded-xl font-mono text-xs overflow-x-auto">
                  <button
                    onClick={() => copyToClipboard(bubblewrapCommand, 'bubblewrap')}
                    className="absolute top-2 right-2 p-1.5 rounded bg-white/10 hover:bg-white/20 text-white transition"
                    title="কমান্ড কপি করুন"
                  >
                    {copiedCode === 'bubblewrap' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                  <pre>{bubblewrapCommand}</pre>
                </div>
              </div>

              {/* Package Identification Details */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs space-y-2 font-mono">
                <div className="text-slate-500 font-sans font-semibold">অ্যান্ড্রয়েড প্রজেক্ট কনফিগারেশন মেটাডাটা:</div>
                <div className="grid sm:grid-cols-2 gap-2 text-slate-700">
                  <div><strong>Package Name:</strong> org.ullaparapressclub.app</div>
                  <div><strong>App Title:</strong> উল্লাপাড়া প্রেসক্লাব</div>
                  <div><strong>Theme Color:</strong> #0d3b66</div>
                  <div><strong>Display Mode:</strong> standalone (fullscreen)</div>
                  <div><strong>Target Android SDK:</strong> 34+ (Android 14/15)</div>
                  <div><strong>Architecture:</strong> WebAPK / TWA Native Wrapper</div>
                </div>
              </div>

            </div>
          )}

          {/* TAB 3: FEATURES */}
          {activeTab === 'features' && (
            <div className="space-y-4 animate-in fade-in duration-200">
              <div className="grid sm:grid-cols-2 gap-3.5">
                
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                  <div className="w-9 h-9 rounded-xl bg-amber-500/10 text-amber-600 flex items-center justify-center">
                    <WifiOff className="w-5 h-5" />
                  </div>
                  <h4 className="font-bold text-sm text-[#0d3b66]">অফলাইন মোড সাপোর্ট</h4>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    ইন্টারনেট সাময়িক না থাকলেও ক্লাবের পূর্ববর্তী নোটিশ, কমিটির তালিকা ও তথ্য অফলাইনে দেখতে পারবেন।
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                  <div className="w-9 h-9 rounded-xl bg-blue-500/10 text-blue-600 flex items-center justify-center">
                    <Zap className="w-5 h-5" />
                  </div>
                  <h4 className="font-bold text-sm text-[#0d3b66]">সুপার-ফাস্ট গতি ও কম সাইজ</h4>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    অ্যাপটির সাইজ মাত্র কয়েক কিলোবাইট! ফোনের র‍্যাম বা স্টোরেজে কোনো বাড়তি চাপ পড়ে না।
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                  <div className="w-9 h-9 rounded-xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center">
                    <Bell className="w-5 h-5" />
                  </div>
                  <h4 className="font-bold text-sm text-[#0d3b66]">জরুরি বিজ্ঞপ্তি পুশ নোটিফিকেশন</h4>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    প্রেসক্লাবের যেকোনো জরুরি প্রেস বিজ্ঞপ্তি, সভা বা ঘোষণার নোটিফিকেশন সরাসরি মোবাইল স্ক্রিনে পাওয়া যাবে।
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                  <div className="w-9 h-9 rounded-xl bg-purple-500/10 text-purple-600 flex items-center justify-center">
                    <Layers className="w-5 h-5" />
                  </div>
                  <h4 className="font-bold text-sm text-[#0d3b66]">সম্পূর্ণ নেটিভ অ্যাপ ফিল</h4>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    কোনো ব্রাউজার অ্যাড্রেস বার বা অপ্রয়োজনীয় বাটন ছাড়া পূর্ণাঙ্গ সফটওয়্যার অভিজ্ঞতা।
                  </p>
                </div>

              </div>

              {/* Dedication footer */}
              <div className="p-4 rounded-2xl bg-blue-50 border border-blue-200 flex items-center justify-between text-xs">
                <span className="text-blue-900 font-medium">
                  কারিগরি ও অ্যান্ড্রয়েড প্যাকেজিং উন্নয়ন: <strong>Sristi Communication</strong>
                </span>
                <span className="text-amber-700 font-bold">
                  সুবর্ণজয়ন্তী ২০২৭ (১৯৭৭-২০২৭)
                </span>
              </div>
            </div>
          )}

        </div>

        {/* Modal Footer */}
        <div className="bg-slate-50 px-5 py-3.5 border-t border-slate-200 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2 text-slate-500">
            <Smartphone className="w-4 h-4 text-emerald-600" />
            <span>সাপোর্টেড ওএস: Android 8.0 থেকে Android 15+ ও HarmonyOS</span>
          </div>

          <div className="flex items-center gap-2">
            {isInstallable && (
              <button
                onClick={handleInstallClick}
                className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold transition shadow-xs flex items-center gap-1.5"
              >
                <Download className="w-3.5 h-3.5" />
                <span>ফোনে ইনস্টল</span>
              </button>
            )}
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-800 font-bold transition"
            >
              বন্ধ করুন
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
