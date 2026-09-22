import { useState } from 'react';
import { 
  X, 
  Download, 
  Archive, 
  FileCode, 
  CheckCircle2, 
  Globe, 
  Laptop, 
  Server, 
  ExternalLink,
  HelpCircle,
  FolderArchive,
  Info,
  Smartphone,
  Sparkles,
  Layers
} from 'lucide-react';
import { usePressClub } from '../context/PressClubContext';

export default function WebsiteExportModal() {
  const { isExportModalOpen, setIsExportModalOpen, setIsAndroidModalOpen, clubInfo } = usePressClub();
  const [downloadingWp, setDownloadingWp] = useState(false);
  const [downloadedWp, setDownloadedWp] = useState(false);
  const [downloadingZip, setDownloadingZip] = useState(false);
  const [downloadedZip, setDownloadedZip] = useState(false);
  const [downloadingHtml, setDownloadingHtml] = useState(false);
  const [downloadedHtml, setDownloadedHtml] = useState(false);

  if (!isExportModalOpen) return null;

  const handleDownloadWpTheme = () => {
    setDownloadingWp(true);
    const link = document.createElement('a');
    link.href = '/ullapara-pressclub-wp-theme.zip';
    link.download = 'ullapara-pressclub-wp-theme.zip';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    setTimeout(() => {
      setDownloadingWp(false);
      setDownloadedWp(true);
    }, 1200);
  };

  const handleDownloadZip = () => {
    setDownloadingZip(true);
    const link = document.createElement('a');
    link.href = '/ullapara-pressclub-website.zip';
    link.download = 'ullapara-pressclub-website.zip';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    setTimeout(() => {
      setDownloadingZip(false);
      setDownloadedZip(true);
    }, 1200);
  };

  const handleDownloadHtml = () => {
    setDownloadingHtml(true);
    const link = document.createElement('a');
    link.href = '/index-download.html';
    link.download = 'index.html';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    setTimeout(() => {
      setDownloadingHtml(false);
      setDownloadedHtml(true);
    }, 800);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in duration-200">
      <div 
        className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-slate-200 relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-[#0d3b66] to-slate-900 text-white p-6 sm:p-7 rounded-t-3xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-48 h-48 bg-amber-500/10 rounded-full blur-3xl pointer-events-none"></div>

          <div className="flex items-start justify-between relative z-10">
            <div className="space-y-1">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-400/30 text-xs font-bold">
                <FolderArchive className="w-3.5 h-3.5" />
                <span>অফলাইন প্যাকেজ ও ডাউনলোড কেন্দ্র</span>
              </div>
              <h3 className="text-xl sm:text-2xl font-bold font-serif text-white flex items-center gap-2">
                <Download className="w-6 h-6 text-amber-400" />
                ল্যান্ডিং পেজ ডাউনলোড করুন
              </h3>
              <p className="text-xs sm:text-sm text-blue-100 max-w-lg">
                সম্পূর্ণ ওয়েবসাইটটি অফলাইনে চালাতে অথবা যেকোনো সার্ভারে (cPanel / হোস্টিং) আপলোড করার জন্য জিপ ফাইল বা ইন্ডেক্স ফাইল নামিয়ে নিন।
              </p>
            </div>

            <button
              onClick={() => setIsExportModalOpen(false)}
              className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition shrink-0"
              aria-label="বন্ধ করুন"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content Options */}
        <div className="p-6 sm:p-7 space-y-6">
          
          {/* Option 1: One-Click WordPress Theme (Primary Highlight) */}
          <div className="p-5 sm:p-6 rounded-2xl border-2 border-blue-600 bg-blue-50/50 relative shadow-sm hover:shadow-md transition">
            <div className="absolute -top-3 right-5 bg-blue-600 text-white font-bold text-[11px] px-3.5 py-0.5 rounded-full shadow-xs uppercase tracking-wider flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-amber-300" />
              <span>ওয়ার্ডপ্রেস থিম (১-ক্লিকে ইনস্টলযোগ্য)</span>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-start gap-3.5">
                <div className="w-12 h-12 rounded-2xl bg-blue-600 text-white flex items-center justify-center shrink-0 shadow-sm font-bold">
                  <Layers className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="text-base sm:text-lg font-bold text-[#0d3b66] font-serif flex items-center gap-2">
                    ওয়ার্ডপ্রেস অফিশিয়াল থিম প্যাকেজ (WordPress Theme ZIP)
                  </h4>
                  <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                    ওয়ার্ডপ্রেসের <strong className="text-slate-900">Appearance &gt; Themes &gt; Upload Theme</strong> থেকে সরাসরি আপলোড করে ১-ক্লিকেই এক্টিভ করুন। সাইটের সকল ডিজাইন, ব্যানার, নোটিশ বোর্ড, অ্যাডমিন পোর্টাল ও কমিটি হুবহু একই রূপে সক্রিয় হবে।
                  </p>
                  <div className="flex flex-wrap items-center gap-2 mt-2.5 text-[11px] text-slate-500">
                    <span className="bg-white border border-blue-200 px-2 py-0.5 rounded-md font-mono text-blue-900 font-semibold">
                      ullapara-pressclub-wp-theme.zip
                    </span>
                    <span className="bg-blue-100 text-blue-900 px-2 py-0.5 rounded-md font-semibold">
                      WordPress 5.0 - 6.7+ রেডি
                    </span>
                    <span className="bg-emerald-100 text-emerald-900 px-2 py-0.5 rounded-md font-semibold">
                      প্লাগিন নষ্ট হবে না
                    </span>
                  </div>
                </div>
              </div>

              <div className="shrink-0 sm:self-center">
                <button
                  onClick={handleDownloadWpTheme}
                  disabled={downloadingWp}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-blue-700 hover:bg-blue-800 text-white font-bold px-5 py-3 rounded-xl text-xs sm:text-sm shadow-md transition transform active:scale-95 disabled:opacity-50 cursor-pointer"
                >
                  {downloadingWp ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>ডাউনলোড হচ্ছে...</span>
                    </>
                  ) : downloadedWp ? (
                    <>
                      <CheckCircle2 className="w-4 h-4 text-emerald-300" />
                      <span>আবার নামান (WP Theme)</span>
                    </>
                  ) : (
                    <>
                      <Download className="w-4 h-4 text-amber-300" />
                      <span>ওয়ার্ডপ্রেস থিম নামান</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Option 2: Complete Website ZIP (cPanel / Static Hosting) */}
          <div className="p-5 sm:p-6 rounded-2xl border-2 border-amber-400 bg-amber-50/40 relative shadow-sm hover:shadow-md transition">
            <div className="absolute -top-3 right-5 bg-amber-500 text-slate-950 font-bold text-[11px] px-3 py-0.5 rounded-full shadow-xs uppercase tracking-wider">
              cPanel / সাধারণ হোস্টিং প্যাকেজ
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-start gap-3.5">
                <div className="w-12 h-12 rounded-2xl bg-amber-500 text-slate-950 flex items-center justify-center shrink-0 shadow-sm font-bold">
                  <Archive className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="text-base sm:text-lg font-bold text-[#0d3b66] font-serif flex items-center gap-2">
                    সম্পূর্ণ ওয়েবসাইট জিপ ফাইল (ZIP Archive)
                  </h4>
                  <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                    এতে রয়েছে <span className="font-semibold text-slate-800">index.html</span>, সমস্ত সিএসএস স্টাইল, জাভাস্ক্রিপ্ট এবং সকল ছবি ও লোগো। আনজিপ করে সরাসরি চালু করা যাবে।
                  </p>
                  <div className="flex flex-wrap items-center gap-2 mt-2.5 text-[11px] text-slate-500">
                    <span className="bg-white border border-slate-200 px-2 py-0.5 rounded-md font-mono">
                      ফাইলের নাম: ullapara-pressclub-website.zip
                    </span>
                    <span className="bg-amber-100 text-amber-900 px-2 py-0.5 rounded-md font-semibold">
                      সাইজ: ~১৩.৬ মেগাবাইট
                    </span>
                  </div>
                </div>
              </div>

              <div className="shrink-0 sm:self-center">
                <button
                  onClick={handleDownloadZip}
                  disabled={downloadingZip}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-[#0d3b66] hover:bg-slate-800 text-white font-bold px-5 py-3 rounded-xl text-xs sm:text-sm shadow-md transition transform active:scale-95 disabled:opacity-50"
                >
                  {downloadingZip ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>ডাউনলোড হচ্ছে...</span>
                    </>
                  ) : downloadedZip ? (
                    <>
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                      <span>আবার নামান (ZIP)</span>
                    </>
                  ) : (
                    <>
                      <Download className="w-4 h-4 text-amber-400" />
                      <span>জিপ ফাইল নামান</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Option 2: Standalone index.html */}
          <div className="p-5 sm:p-6 rounded-2xl border border-slate-200 bg-white hover:border-slate-300 transition">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-start gap-3.5">
                <div className="w-12 h-12 rounded-2xl bg-blue-50 text-[#0d3b66] border border-blue-200 flex items-center justify-center shrink-0 font-bold">
                  <FileCode className="w-6 h-6 text-[#0d3b66]" />
                </div>
                <div>
                  <h4 className="text-base sm:text-lg font-bold text-[#0d3b66] font-serif flex items-center gap-2">
                    ইন্ডেক্স এইচটিএমএল ফাইল (index.html)
                  </h4>
                  <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                    শুধুমাত্র মূল এইচটিএমএল এন্ট্রি ফাইল। এটি বিদ্যমান অ্যাসেট ফোল্ডারের সাথে অথবা কোড এডিটরে পর্যালোচনার জন্য উপযুক্ত।
                  </p>
                  <div className="flex items-center gap-2 mt-2.5 text-[11px] text-slate-500 font-mono">
                    <span className="bg-slate-100 border border-slate-200 px-2 py-0.5 rounded-md">
                      ফাইলের নাম: index.html
                    </span>
                  </div>
                </div>
              </div>

              <div className="shrink-0 sm:self-center">
                <button
                  onClick={handleDownloadHtml}
                  disabled={downloadingHtml}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold px-4 py-2.5 rounded-xl text-xs sm:text-sm border border-slate-300 transition disabled:opacity-50"
                >
                  {downloadingHtml ? (
                    <>
                      <div className="w-4 h-4 border-2 border-slate-600 border-t-transparent rounded-full animate-spin"></div>
                      <span>ডাউনলোড হচ্ছে...</span>
                    </>
                  ) : downloadedHtml ? (
                    <>
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      <span>নামানো হয়েছে</span>
                    </>
                  ) : (
                    <>
                      <Download className="w-4 h-4 text-slate-600" />
                      <span>index.html নামান</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Option 3: Android App Package & APK */}
          <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-200 text-xs text-slate-700 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-sm">
                <Smartphone className="w-5 h-5" />
              </div>
              <div className="space-y-0.5">
                <h5 className="font-bold text-sm text-emerald-950 font-serif">
                  অ্যান্ড্রয়েড অ্যাপ্লিকেশন (PWA / APK / Play Store)
                </h5>
                <p className="text-slate-600 leading-relaxed text-xs">
                  ওয়েবসাইটটি সরাসরি ফোনে ইনস্টল করা অথবা Google Play Store এর জন্য প্যাকেজিং করতে চান?
                </p>
              </div>
            </div>
            <button
              onClick={() => {
                setIsExportModalOpen(false);
                setIsAndroidModalOpen(true);
              }}
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl text-xs transition shrink-0 shadow-xs flex items-center gap-1.5"
            >
              <Smartphone className="w-3.5 h-3.5" />
              <span>অ্যাপ কন্ট্রোল প্যানেল</span>
            </button>
          </div>

          {/* Option 4: AI Studio Full Source Code Export Info */}
          <div className="p-4 sm:p-5 rounded-2xl bg-slate-50 border border-slate-200/80 text-xs text-slate-700 space-y-2">
            <div className="flex items-center gap-2 font-bold text-[#0d3b66]">
              <Info className="w-4 h-4 text-amber-600" />
              <span>ডেভেলপার সোর্স কোড (React + TypeScript) এক্সপোর্ট করবেন কীভাবে?</span>
            </div>
            <p className="text-slate-600 leading-relaxed">
              আপনি যদি এই প্রোজেক্টের সম্পূর্ণ রিয়্যাক্ট ও টাইপস্ক্রিপ্ট সোর্স কোড (Node.js, Vite, Tailwind CSS সহ) ডাউনলোড করতে চান, তবে স্ক্রিনের উপরের ডানদিকের <strong className="text-slate-900">Google AI Studio Settings মেনু</strong> থেকে <strong className="text-[#0d3b66]">"Export to GitHub"</strong> অথবা <strong className="text-[#0d3b66]">"Export to ZIP"</strong> নির্বাচন করুন।
            </p>
          </div>

          {/* Usage Instructions */}
          <div className="border-t border-slate-200 pt-5 space-y-3">
            <h5 className="font-bold text-[#0d3b66] text-xs uppercase tracking-wider flex items-center gap-1.5">
              <HelpCircle className="w-4 h-4 text-amber-600" />
              কীভাবে ডাউনলোড করা ফাইল ব্যবহার করবেন?
            </h5>

            {/* WordPress Step-by-Step Installation Banner */}
            <div className="bg-blue-50/70 p-4 rounded-2xl border border-blue-200 space-y-2">
              <div className="flex items-center gap-2 font-bold text-blue-950 text-xs">
                <Layers className="w-4 h-4 text-blue-700" />
                <span>ওয়ার্ডপ্রেসে ১-ক্লিক থিম ইনস্টল করার নিয়ম (খুব সহজ):</span>
              </div>
              <div className="grid sm:grid-cols-4 gap-2 text-[11px] text-slate-700 pt-1">
                <div className="bg-white p-2.5 rounded-xl border border-blue-100 shadow-2xs">
                  <span className="font-bold text-blue-700 block mb-1">ধাপ ১:</span>
                  আপনার WordPress ড্যাশবোর্ডে লগইন করুন (<code className="text-blue-900 bg-blue-50 px-1 rounded">/wp-admin</code>)।
                </div>
                <div className="bg-white p-2.5 rounded-xl border border-blue-100 shadow-2xs">
                  <span className="font-bold text-blue-700 block mb-1">ধাপ ২:</span>
                  বামপাশের <strong className="text-slate-900">Appearance &gt; Themes</strong>-এ প্রবেশ করুন।
                </div>
                <div className="bg-white p-2.5 rounded-xl border border-blue-100 shadow-2xs">
                  <span className="font-bold text-blue-700 block mb-1">ধাপ ৩:</span>
                  উপরে <strong className="text-slate-900">Add New Theme &gt; Upload Theme</strong> চাপুন।
                </div>
                <div className="bg-white p-2.5 rounded-xl border border-blue-100 shadow-2xs">
                  <span className="font-bold text-blue-700 block mb-1">ধাপ ৪:</span>
                  <strong className="text-blue-900">ullapara-pressclub-wp-theme.zip</strong> আপলোড করে <strong className="text-emerald-700">Activate</strong> করুন!
                </div>
              </div>
            </div>

            <div className="grid sm:grid-cols-3 gap-3 text-xs">
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 space-y-1">
                <div className="flex items-center gap-1.5 font-bold text-slate-900">
                  <Laptop className="w-4 h-4 text-blue-600" />
                  <span>১. অফলাইনে দেখা</span>
                </div>
                <p className="text-slate-500 text-[11px] leading-relaxed">
                  জিপ ফাইলটি আনজিপ করুন এবং ফোল্ডারের ভেতর থাকা <span className="font-mono text-slate-700">index.html</span> ফাইলে ডাবল ক্লিক করে যেকোনো ব্রাউজারে খুলুন।
                </p>
              </div>

              <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 space-y-1">
                <div className="flex items-center gap-1.5 font-bold text-slate-900">
                  <Server className="w-4 h-4 text-emerald-600" />
                  <span>২. cPanel হোস্টিং</span>
                </div>
                <p className="text-slate-500 text-[11px] leading-relaxed">
                  আনজিপ করা সমস্ত ফাইল ও ফোল্ডার আপনার হোস্টিং সার্ভারের <span className="font-mono text-slate-700">public_html</span> ডিরেক্টরিতে আপলোড করে দিন।
                </p>
              </div>

              <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 space-y-1">
                <div className="flex items-center gap-1.5 font-bold text-slate-900">
                  <Globe className="w-4 h-4 text-amber-600" />
                  <span>৩. ফ্রি ক্লাউড হোস্টিং</span>
                </div>
                <p className="text-slate-500 text-[11px] leading-relaxed">
                  Netlify বা Vercel এ আনজিপ করা ফোল্ডারটি ড্র্যাগ অ্যান্ড ড্রপ করলেই কোনো কনফিগারেশন ছাড়াই সাইট লাইভ হয়ে যাবে।
                </p>
              </div>
            </div>
          </div>

        </div>

        {/* Footer Actions */}
        <div className="bg-slate-50 px-6 py-4 rounded-b-3xl border-t border-slate-200 flex items-center justify-between text-xs">
          <span className="text-slate-500">
            {clubInfo.nameBangla} • স্থাপিত {clubInfo.establishedYear}
          </span>

          <button
            onClick={() => setIsExportModalOpen(false)}
            className="px-5 py-2 bg-slate-200 hover:bg-slate-300 text-slate-800 font-bold rounded-xl transition"
          >
            বন্ধ করুন
          </button>
        </div>

      </div>
    </div>
  );
}
