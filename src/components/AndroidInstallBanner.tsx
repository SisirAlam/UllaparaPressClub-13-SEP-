import { useState, useEffect } from 'react';
import { usePWAInstall } from '../hooks/usePWAInstall';
import { Smartphone, Download, X, Sparkles } from 'lucide-react';

interface AndroidInstallBannerProps {
  onOpenModal: () => void;
}

export default function AndroidInstallBanner({ onOpenModal }: AndroidInstallBannerProps) {
  const { isInstallable, isInstalled, isAndroid, install } = usePWAInstall();
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    const isDismissed = sessionStorage.getItem('upc_android_banner_dismissed');
    if (isDismissed) {
      setDismissed(true);
    }
  }, []);

  // Do not show if already installed in standalone mode or dismissed
  if (isInstalled || dismissed) {
    return null;
  }

  const handleDismiss = () => {
    setDismissed(true);
    sessionStorage.setItem('upc_android_banner_dismissed', 'true');
  };

  const handleQuickInstall = async () => {
    if (isInstallable) {
      await install();
    } else {
      onOpenModal();
    }
  };

  return (
    <div className="fixed bottom-3 left-3 right-3 sm:left-auto sm:right-4 sm:max-w-md z-40 animate-in slide-in-from-bottom-5 duration-300">
      <div className="bg-[#07203d] text-white p-3.5 sm:p-4 rounded-2xl shadow-2xl border border-amber-400/40 flex items-center justify-between gap-3 backdrop-blur-md">
        
        {/* Left icon & text */}
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-500 to-amber-300 text-slate-950 flex items-center justify-center shrink-0 shadow-md">
            <Smartphone className="w-5 h-5 text-slate-950" />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-1.5 text-[11px] text-amber-300 font-bold uppercase tracking-wider">
              <Sparkles className="w-3 h-3" />
              <span>{isAndroid ? 'অ্যান্ড্রয়েড অ্যাপ' : 'মোবাইল অ্যাপ'}</span>
            </div>
            <h4 className="text-xs sm:text-sm font-bold text-white truncate font-serif">
              উল্লাপাড়া প্রেসক্লাব অ্যাপ
            </h4>
            <p className="text-[11px] text-blue-200/80 truncate">
              ফোনে ইনস্টল করে দ্রুত নোটিশ ও তথ্য পান
            </p>
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex items-center gap-1.5 shrink-0">
          <button
            onClick={handleQuickInstall}
            className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-400 hover:to-emerald-500 text-white font-bold text-xs shadow-sm transition flex items-center gap-1"
          >
            <Download className="w-3.5 h-3.5" />
            <span>ইনস্টল</span>
          </button>
          <button
            onClick={onOpenModal}
            className="px-2.5 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-medium text-xs transition"
            title="বিস্তারিত দেখুন"
          >
            বিবরণ
          </button>
          <button
            onClick={handleDismiss}
            className="p-1 rounded-lg text-blue-300/60 hover:text-white transition"
            title="বন্ধ করুন"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

      </div>
    </div>
  );
}
