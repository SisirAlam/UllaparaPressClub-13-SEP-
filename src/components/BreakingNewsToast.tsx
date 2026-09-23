import { useState, useEffect } from 'react';
import { BellRing, X, ArrowRight, Radio } from 'lucide-react';
import { PushNotificationPayload } from '../utils/pushNotifications';

export default function BreakingNewsToast() {
  const [toast, setToast] = useState<PushNotificationPayload | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const handlePushEvent = (e: Event) => {
      const customEvent = e as CustomEvent<PushNotificationPayload>;
      if (customEvent.detail) {
        setToast(customEvent.detail);
        setVisible(true);

        // Gentle audio chime using Web Audio API
        try {
          const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
          const osc = audioCtx.createOscillator();
          const gain = audioCtx.createGain();
          osc.type = 'sine';
          osc.frequency.setValueAtTime(587.33, audioCtx.currentTime); // D5
          osc.frequency.exponentialRampToValueAtTime(880, audioCtx.currentTime + 0.15); // A5
          gain.gain.setValueAtTime(0.15, audioCtx.currentTime);
          gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.3);
          osc.connect(gain);
          gain.connect(audioCtx.destination);
          osc.start();
          osc.stop(audioCtx.currentTime + 0.35);
        } catch {
          // Audio context might be restricted before interaction; safely ignore
        }
      }
    };

    window.addEventListener('upc-breaking-news-toast', handlePushEvent);
    return () => window.removeEventListener('upc-breaking-news-toast', handlePushEvent);
  }, []);

  if (!visible || !toast) return null;

  const handleAction = () => {
    setVisible(false);
    if (toast.url) {
      if (toast.url.startsWith('#')) {
        const el = document.getElementById(toast.url.substring(1));
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      } else {
        window.location.href = toast.url;
      }
    }
  };

  return (
    <div className="fixed bottom-5 right-5 z-[9999] max-w-md w-[calc(100vw-40px)] animate-bounce-short">
      <div className="bg-slate-950 text-white p-4 rounded-2xl shadow-2xl border-2 border-red-500/80 backdrop-blur-md relative overflow-hidden">
        {/* Top pulse accent */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-red-600 via-amber-400 to-red-600 animate-pulse"></div>

        <div className="flex items-start gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-red-600 flex items-center justify-center shrink-0 shadow-md">
            <Radio className="w-5 h-5 text-white animate-pulse" />
          </div>

          <div className="flex-1 space-y-1 pr-6">
            <div className="flex items-center gap-2">
              <span className="bg-red-600 text-white text-[10px] font-black px-2 py-0.5 rounded-full uppercase tracking-wider flex items-center gap-1">
                <BellRing className="w-3 h-3" />
                ব্রেকিং নোটিফিকেশন
              </span>
              <span className="text-slate-400 text-[11px]">এইমাত্র</span>
            </div>

            <h4 className="font-bold text-sm text-amber-300 line-clamp-2 font-serif leading-snug">
              {toast.title}
            </h4>

            <p className="text-xs text-slate-300 line-clamp-2 leading-relaxed">
              {toast.body}
            </p>

            <div className="pt-2 flex items-center gap-2">
              <button
                onClick={handleAction}
                className="px-3.5 py-1.5 bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs rounded-lg transition shadow-xs flex items-center gap-1 cursor-pointer"
              >
                <span>এখনই পড়ুন</span>
                <ArrowRight className="w-3 h-3" />
              </button>

              <button
                onClick={() => setVisible(false)}
                className="px-3 py-1.5 text-xs text-slate-400 hover:text-white transition cursor-pointer"
              >
                পরে দেখব
              </button>
            </div>
          </div>

          <button
            onClick={() => setVisible(false)}
            className="absolute top-3 right-3 p-1 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition"
            aria-label="Close"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
