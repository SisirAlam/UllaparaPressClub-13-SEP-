import React, { useState } from 'react';
import { usePressClub } from '../context/PressClubContext';
import { 
  BellRing, 
  X, 
  Printer, 
  Share2, 
  AlertTriangle, 
  CheckCircle2, 
  FileText, 
  Calendar, 
  ExternalLink,
  ShieldAlert,
  Sparkles,
  Copy
} from 'lucide-react';

export default function UrgentNoticePopupModal() {
  const { 
    isPopupNoticeOpen, 
    setIsPopupNoticeOpen, 
    popupNotice, 
    notices, 
    clubInfo 
  } = usePressClub();

  const [copied, setCopied] = useState(false);

  // If no specific popup notice is designated, fallback to first important notice or first notice
  const notice = popupNotice || notices.find(n => n.isPopup) || notices.find(n => n.isImportant) || notices[0];

  if (!isPopupNoticeOpen || !notice) return null;

  const handleClose = () => {
    setIsPopupNoticeOpen(false);
  };

  const handleDismissForSession = () => {
    try {
      sessionStorage.setItem('upc_urgent_popup_seen', 'true');
    } catch {}
    setIsPopupNoticeOpen(false);
  };

  const handleShare = () => {
    const shareUrl = `${window.location.origin}/#notices`;
    const shareText = `[জরুরি বিজ্ঞপ্তি - ${clubInfo.nameBangla}]: ${notice.title}`;
    
    if (navigator.share) {
      navigator.share({
        title: notice.title,
        text: shareText,
        url: shareUrl
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(`${shareText}\n${shareUrl}`);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  const handlePrint = () => {
    const printWindow = window.open('', '_blank', 'width=800,height=900');
    if (!printWindow) {
      window.print();
      return;
    }

    printWindow.document.write(`
      <!DOCTYPE html>
      <html lang="bn">
      <head>
        <title>জরুরি বিজ্ঞপ্তি - ${clubInfo.nameBangla}</title>
        <style>
          body { font-family: 'SolaimanLipi', 'Kalpurush', 'Segoe UI', Tahoma, sans-serif; padding: 40px; color: #1e293b; }
          .header { text-align: center; border-bottom: 2px solid #0d3b66; padding-bottom: 16px; margin-bottom: 24px; }
          .club-name { font-size: 24px; font-weight: bold; color: #0d3b66; margin: 0; }
          .sub-title { font-size: 13px; color: #64748b; margin-top: 4px; }
          .badge { display: inline-block; background: #dc2626; color: white; padding: 4px 12px; border-radius: 9999px; font-size: 12px; font-weight: bold; margin-bottom: 16px; }
          .title { font-size: 20px; font-weight: bold; color: #0f172a; margin-bottom: 12px; line-height: 1.4; }
          .meta { font-size: 12px; color: #64748b; margin-bottom: 20px; border-bottom: 1px dashed #cbd5e1; padding-bottom: 10px; }
          .content { font-size: 15px; line-height: 1.8; color: #334155; white-space: pre-line; }
          .footer { margin-top: 50px; border-top: 1px solid #e2e8f0; padding-top: 20px; display: flex; justify-content: space-between; font-size: 12px; color: #64748b; }
          .stamp { border: 1px solid #0d3b66; padding: 8px 16px; border-radius: 8px; color: #0d3b66; font-weight: bold; }
        </style>
      </head>
      <body>
        <div class="header">
          <h1 class="club-name">${clubInfo.nameBangla}</h1>
          <div class="sub-title">${clubInfo.address} • সুবর্ণজয়ন্তী ২০২৭</div>
        </div>
        <div class="badge">জরুরি বিজ্ঞপ্তি / নোটিশ</div>
        <h2 class="title">${notice.title}</h2>
        <div class="meta">
          <span>তারিখ: ${notice.date}</span> &nbsp;|&nbsp; 
          <span>স্মারক: ${notice.refNumber || 'ইউপিসি-বিজ্ঞপ্তি/২০২৬'}</span>
        </div>
        <div class="content">${notice.fullText || notice.summary}</div>
        <div class="footer">
          <div class="stamp">প্রেসক্লাব কার্যনির্বাহী দপ্তর</div>
          <div>স্বাক্ষরিত: ${notice.signatory || clubInfo.generalSecretary || 'সাধারণ সম্পাদক'}</div>
        </div>
      </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.focus();
    setTimeout(() => {
      printWindow.print();
      printWindow.close();
    }, 400);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border-2 border-red-500/30 overflow-hidden my-auto animate-in zoom-in-95 duration-200">
        
        {/* Urgent Header Banner */}
        <div className="bg-gradient-to-r from-red-700 via-red-600 to-rose-700 text-white p-5 sm:p-6 relative">
          <button
            onClick={handleClose}
            className="absolute top-4 right-4 p-2 rounded-full bg-black/20 hover:bg-black/30 text-white transition focus:outline-none"
            title="বন্ধ করুন"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-start gap-3 sm:gap-4">
            <div className="w-12 h-12 rounded-2xl bg-white text-red-600 flex items-center justify-center shrink-0 shadow-lg animate-pulse">
              <BellRing className="w-6 h-6" />
            </div>
            <div className="pr-6">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="px-2.5 py-0.5 rounded-full bg-amber-400 text-slate-950 font-black text-[11px] tracking-wider uppercase flex items-center gap-1 shadow-xs">
                  <AlertTriangle className="w-3.5 h-3.5" />
                  জরুরি ঘোষণা / নোটিশ
                </span>
                <span className="text-xs text-red-100 flex items-center gap-1">
                  <Calendar className="w-3 h-3" />
                  {notice.date}
                </span>
              </div>
              <h3 className="text-lg sm:text-xl font-bold font-serif text-white mt-1.5 leading-snug">
                {notice.title}
              </h3>
            </div>
          </div>
        </div>

        {/* Notice Body */}
        <div className="p-5 sm:p-6 max-h-[60vh] overflow-y-auto space-y-4 text-slate-700">
          <div className="p-4 rounded-2xl bg-red-50/70 border border-red-200/80 text-sm leading-relaxed whitespace-pre-line font-medium text-slate-800">
            {notice.fullText || notice.summary}
          </div>

          {notice.summary && notice.fullText && (
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-600">
              <span className="font-bold text-slate-800">সারসংক্ষেপ: </span>
              {notice.summary}
            </div>
          )}

          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 pt-3 border-t border-slate-200 text-xs text-slate-500">
            <div>
              <span className="font-semibold text-slate-700">প্রকাশক:</span> {notice.signatory || `${clubInfo.nameBangla} কার্যনির্বাহী পরিষদ`}
            </div>
            {notice.refNumber && (
              <div className="text-slate-500">
                স্মারক নং: {notice.refNumber}
              </div>
            )}
          </div>
        </div>

        {/* Action Footer */}
        <div className="bg-slate-50 px-5 sm:px-6 py-4 border-t border-slate-200 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="px-3.5 py-2 rounded-xl bg-white hover:bg-slate-100 text-slate-700 font-semibold text-xs border border-slate-300 shadow-xs transition flex items-center gap-1.5"
            >
              <Printer className="w-3.5 h-3.5 text-slate-600" />
              <span>প্রিন্ট করুন</span>
            </button>

            <button
              onClick={handleShare}
              className="px-3.5 py-2 rounded-xl bg-white hover:bg-slate-100 text-slate-700 font-semibold text-xs border border-slate-300 shadow-xs transition flex items-center gap-1.5"
            >
              {copied ? (
                <>
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  <span className="text-emerald-700">কপি হয়েছে!</span>
                </>
              ) : (
                <>
                  <Share2 className="w-3.5 h-3.5 text-slate-600" />
                  <span>শেয়ার করুন</span>
                </>
              )}
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleDismissForSession}
              className="px-3 py-2 text-xs text-slate-500 hover:text-slate-800 font-medium transition"
            >
              আজ আর দেখাবেন না
            </button>
            <button
              onClick={handleClose}
              className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs shadow-sm transition"
            >
              বুঝেছি / বন্ধ করুন
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
