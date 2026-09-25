import { useState } from 'react';
import { Share2, Printer, Check, Copy, ExternalLink, Facebook, MessageCircle } from 'lucide-react';
import { usePressClub } from '../context/PressClubContext';

interface SectionActionToolbarProps {
  sectionId: string;
  sectionTitle: string;
  sectionSubtitle?: string;
  className?: string;
  variant?: 'light' | 'dark' | 'transparent';
}

export default function SectionActionToolbar({
  sectionId,
  sectionTitle,
  sectionSubtitle,
  className = '',
  variant = 'light'
}: SectionActionToolbarProps) {
  const { clubInfo } = usePressClub();
  const [copied, setCopied] = useState(false);
  const [showShareMenu, setShowShareMenu] = useState(false);

  const getSectionUrl = () => {
    return `${window.location.origin}/#${sectionId}`;
  };

  const handleShareClick = () => {
    const url = getSectionUrl();
    const text = `${clubInfo.nameBangla} - ${sectionTitle}`;

    if (navigator.share) {
      navigator.share({
        title: text,
        text: `${text}\n${sectionSubtitle || ''}`,
        url: url
      }).catch(() => {
        setShowShareMenu(prev => !prev);
      });
    } else {
      setShowShareMenu(prev => !prev);
    }
  };

  const handleCopyLink = () => {
    const url = getSectionUrl();
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2200);
    setShowShareMenu(false);
  };

  const handleFacebookShare = () => {
    const url = encodeURIComponent(getSectionUrl());
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${url}`, '_blank', 'width=600,height=400');
    setShowShareMenu(false);
  };

  const handleWhatsAppShare = () => {
    const url = encodeURIComponent(getSectionUrl());
    const text = encodeURIComponent(`${clubInfo.nameBangla} - ${sectionTitle}: `);
    window.open(`https://api.whatsapp.com/send?text=${text}${url}`, '_blank');
    setShowShareMenu(false);
  };

  const handlePrintSection = () => {
    const sectionElement = document.getElementById(sectionId);
    if (!sectionElement) {
      window.print();
      return;
    }

    // Create a dedicated clean print window with official header
    const printWindow = window.open('', '_blank', 'width=850,height=900');
    if (!printWindow) {
      window.print();
      return;
    }

    // Clone element content without buttons or interactive controls
    const clone = sectionElement.cloneNode(true) as HTMLElement;
    const unwanted = clone.querySelectorAll('.no-print, button, .section-action-toolbar, input, textarea');
    unwanted.forEach(el => el.remove());

    printWindow.document.write(`
      <!DOCTYPE html>
      <html lang="bn">
      <head>
        <title>${sectionTitle} - ${clubInfo.nameBangla}</title>
        <meta charset="utf-8" />
        <style>
          @page { margin: 15mm 20mm; size: A4 portrait; }
          body { 
            font-family: 'SolaimanLipi', 'Kalpurush', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            color: #0f172a;
            background: #ffffff;
            margin: 0;
            padding: 24px;
            font-size: 13pt;
            line-height: 1.6;
          }
          .official-header {
            text-align: center;
            border-bottom: 2px solid #0d3b66;
            padding-bottom: 16px;
            margin-bottom: 24px;
          }
          .official-header h1 {
            font-size: 22pt;
            color: #0d3b66;
            margin: 0;
            font-weight: bold;
          }
          .official-header p {
            font-size: 11pt;
            color: #475569;
            margin: 4px 0 0;
          }
          .section-badge {
            display: inline-block;
            background: #0d3b66;
            color: #ffffff;
            font-size: 10pt;
            padding: 4px 12px;
            border-radius: 9999px;
            margin-bottom: 12px;
            font-weight: bold;
          }
          .section-heading {
            font-size: 18pt;
            font-weight: bold;
            color: #0f172a;
            margin: 0 0 16px 0;
          }
          .official-footer {
            margin-top: 40px;
            border-top: 1px solid #cbd5e1;
            padding-top: 16px;
            font-size: 10pt;
            color: #64748b;
            display: flex;
            justify-content: space-between;
          }
          img { max-width: 100%; height: auto; }
          table { width: 100%; border-collapse: collapse; margin-top: 12px; }
          th, td { border: 1px solid #cbd5e1; padding: 8px 12px; text-align: left; }
          th { background: #f1f5f9; }
        </style>
      </head>
      <body>
        <div class="official-header">
          <h1>${clubInfo.nameBangla}</h1>
          <p>${clubInfo.address} • সুবর্ণজয়ন্তী ২০২৭ (১৯৭৭-২০২৭)</p>
          <p>ওয়েবসাইট: ${window.location.origin}</p>
        </div>
        <div class="section-badge">${sectionTitle}</div>
        <div>
          ${clone.innerHTML}
        </div>
        <div class="official-footer">
          <div>মুদ্রণের তারিখ ও সময়: ${new Date().toLocaleString('bn-BD')}</div>
          <div>তথ্য প্রকাশনা বিভাগ, উল্লাপাড়া প্রেসক্লাব</div>
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

  const isDark = variant === 'dark';

  return (
    <div className={`section-action-toolbar no-print inline-flex items-center gap-1.5 relative ${className}`}>
      {/* Share Button */}
      <div className="relative">
        <button
          onClick={handleShareClick}
          className={`px-3 py-1.5 rounded-xl font-medium text-xs transition flex items-center gap-1.5 shadow-xs ${
            isDark
              ? 'bg-white/10 hover:bg-white/20 text-blue-100 border border-white/15'
              : 'bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 hover:border-slate-300'
          }`}
          title={`${sectionTitle} সেকশন শেয়ার করুন`}
        >
          {copied ? (
            <>
              <Check className="w-3.5 h-3.5 text-emerald-600" />
              <span className="text-emerald-700 font-bold">কপি হয়েছে</span>
            </>
          ) : (
            <>
              <Share2 className="w-3.5 h-3.5 text-blue-600" />
              <span>শেয়ার</span>
            </>
          )}
        </button>

        {/* Share Popover Menu */}
        {showShareMenu && (
          <div className="absolute top-full right-0 mt-2 w-48 bg-white rounded-2xl shadow-xl border border-slate-200 p-2 z-50 animate-in fade-in zoom-in-95 duration-150">
            <div className="text-[11px] font-bold text-slate-400 px-2 py-1 uppercase tracking-wider">
              সেকশন শেয়ার করুন
            </div>
            <button
              onClick={handleCopyLink}
              className="w-full text-left px-2.5 py-1.5 rounded-lg text-xs text-slate-700 hover:bg-slate-100 flex items-center gap-2 transition"
            >
              <Copy className="w-3.5 h-3.5 text-slate-500" />
              <span>লিংক কপি করুন</span>
            </button>
            <button
              onClick={handleFacebookShare}
              className="w-full text-left px-2.5 py-1.5 rounded-lg text-xs text-blue-700 hover:bg-blue-50 flex items-center gap-2 transition"
            >
              <Facebook className="w-3.5 h-3.5 text-blue-600" />
              <span>ফেসবুকে শেয়ার</span>
            </button>
            <button
              onClick={handleWhatsAppShare}
              className="w-full text-left px-2.5 py-1.5 rounded-lg text-xs text-emerald-700 hover:bg-emerald-50 flex items-center gap-2 transition"
            >
              <MessageCircle className="w-3.5 h-3.5 text-emerald-600" />
              <span>হোয়াটসঅ্যাপে শেয়ার</span>
            </button>
          </div>
        )}
      </div>

      {/* Print Button */}
      <button
        onClick={handlePrintSection}
        className={`px-3 py-1.5 rounded-xl font-medium text-xs transition flex items-center gap-1.5 shadow-xs ${
          isDark
            ? 'bg-white/10 hover:bg-white/20 text-blue-100 border border-white/15'
            : 'bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 hover:border-slate-300'
        }`}
        title={`${sectionTitle} প্রিন্ট করুন`}
      >
        <Printer className="w-3.5 h-3.5 text-slate-600" />
        <span>প্রিন্ট</span>
      </button>
    </div>
  );
}
