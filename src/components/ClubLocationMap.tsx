import { useState } from 'react';
import { 
  MapPin, 
  Navigation, 
  ExternalLink, 
  Copy, 
  Check, 
  RotateCcw, 
  Building, 
  Train, 
  Bus, 
  Clock, 
  Compass,
  Layers,
  PhoneCall
} from 'lucide-react';
import { usePressClub } from '../context/PressClubContext';

type ZoomLevel = 'close' | 'town' | 'regional';

interface ViewPreset {
  id: ZoomLevel;
  label: string;
  subLabel: string;
  bbox: string;
}

const VIEW_PRESETS: ViewPreset[] = [
  {
    id: 'close',
    label: 'প্রেসক্লাব ও থানা রোড',
    subLabel: 'নিকটবর্তী বিস্তারিত ভিউ',
    // Tight bounding box around Ullapara Thana & Press Club
    bbox: '89.5620%2C24.3155%2C89.5715%2C24.3218'
  },
  {
    id: 'town',
    label: 'উল্লাপাড়া পৌর এলাকা',
    subLabel: 'শহরের সামগ্রিক মানচিত্র',
    // Ullapara municipality / railway station
    bbox: '89.5480%2C24.3050%2C89.5850%2C24.3310'
  },
  {
    id: 'regional',
    label: 'সিরাজগঞ্জ আঞ্চলিক রুট',
    subLabel: 'মহাসড়ক ও প্রবেশ পথ',
    // Regional perspective
    bbox: '89.4900%2C24.2600%2C89.6450%2C24.3750'
  }
];

export default function ClubLocationMap() {
  const { clubInfo } = usePressClub();
  const [activePreset, setActivePreset] = useState<ZoomLevel>('close');
  const [copied, setCopied] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  const lat = clubInfo.coordinates?.lat ?? 24.3187;
  const lng = clubInfo.coordinates?.lng ?? 89.5667;
  const coordinatesString = `${lat}, ${lng}`;

  const currentPreset = VIEW_PRESETS.find(p => p.id === activePreset) || VIEW_PRESETS[0];

  // OpenStreetMap embed URL with pinpoint marker at Ullapara Press Club coordinates
  const mapIframeSrc = `https://www.openstreetmap.org/export/embed.html?bbox=${currentPreset.bbox}&layer=mapnik&marker=${lat}%2C${lng}`;

  // Direct navigation links
  const googleMapsDirectionsUrl = `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`;
  const googleMapsViewUrl = `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`;

  const handleCopyCoordinates = () => {
    navigator.clipboard.writeText(coordinatesString).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }).catch(() => {
      // Fallback
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    });
  };

  const landmarks = [
    {
      icon: Building,
      title: 'উল্লাপাড়া মডেল থানা',
      distance: 'সংলগ্ন (১ মিনিটের হাঁটা পথ)',
      detail: 'প্রেসক্লাব কার্যালয় থানা ভবনের ঠিক বিপরীত/সংলগ্ন সড়কে অবস্থিত।',
      color: 'text-amber-600 bg-amber-50 border-amber-200'
    },
    {
      icon: Train,
      title: 'উল্লাপাড়া রেলওয়ে স্টেশন',
      distance: '১.৫ কিমি (৫–৭ মিনিট)',
      detail: 'রেলওয়ে প্ল্যাটফর্ম থেকে রিকশা বা সিএনজি যোগে সরাসরি থানা মোড় প্রেসক্লাবে আসা যায়।',
      color: 'text-emerald-600 bg-emerald-50 border-emerald-200'
    },
    {
      icon: Bus,
      title: 'পৌর বাস টার্মিনাল ও বাজার',
      distance: '৮০০ মিটার (৩–৪ মিনিট)',
      detail: 'ঢাকা-পাবনা মহাসড়ক সংলগ্ন বাসস্টপ থেকে প্রধান বাজার রোড দিয়ে সহজ প্রবেশপথ।',
      color: 'text-blue-600 bg-blue-50 border-blue-200'
    },
    {
      icon: Compass,
      title: 'উপজেলা পরিষদ চত্বর',
      distance: '১.২ কিমি (৫ মিনিট)',
      detail: 'উপজেলা প্রশাসন ও সাব-রেজিস্ট্রার কার্যালয় থেকে সহজেই যোগাযোগযোগ্য।',
      color: 'text-purple-600 bg-purple-50 border-purple-200'
    }
  ];

  return (
    <div id="club-location-map" className="mt-12 bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
      
      {/* Top Header Strip */}
      <div className="bg-gradient-to-r from-[#0d3b66] to-slate-900 text-white p-6 sm:p-8 relative overflow-hidden">
        <div className="absolute -top-12 -right-12 w-48 h-48 bg-amber-500/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
          <div>
            <div className="inline-flex items-center gap-2 bg-amber-500/20 text-amber-300 border border-amber-400/30 px-3 py-1 rounded-full text-xs font-semibold mb-2">
              <Compass className="w-3.5 h-3.5 animate-spin-slow" />
              <span>ইন্টারেক্টিভ ভৌগোলিক অবস্থান ও মানচিত্র</span>
            </div>
            <h3 className="text-2xl sm:text-3xl font-extrabold font-serif text-white flex items-center gap-2.5">
              <MapPin className="w-7 h-7 text-amber-400 shrink-0" />
              প্রেসক্লাব কার্যালয় পিনপয়েন্ট
            </h3>
            <p className="text-blue-100 text-xs sm:text-sm mt-1 max-w-2xl">
              উল্লাপাড়া পৌরসভার কেন্দ্রস্থলে থানা সংলগ্ন উল্লাপাড়া প্রেসক্লাব ভবন। নিচের ইন্টারেক্টিভ ম্যাপ ও দিকনির্দেশনার মাধ্যমে সহজেই আমাদের কার্যালয়ে পৌঁছান।
            </p>
          </div>

          {/* Action CTAs */}
          <div className="flex flex-wrap items-center gap-2.5 shrink-0">
            <a
              href={googleMapsDirectionsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold px-4 py-2.5 rounded-xl text-xs sm:text-sm shadow-md transition transform active:scale-95"
            >
              <Navigation className="w-4 h-4 fill-slate-950" />
              <span>দিকনির্দেশনা পান</span>
            </a>

            <a
              href={googleMapsViewUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white font-semibold px-3.5 py-2.5 rounded-xl text-xs sm:text-sm border border-white/20 transition"
            >
              <ExternalLink className="w-4 h-4" />
              <span>গুগল ম্যাপে দেখুন</span>
            </a>
          </div>
        </div>
      </div>

      {/* View Presets & Coordinates Bar */}
      <div className="bg-slate-50 border-b border-slate-200 px-4 sm:px-6 py-3.5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
        
        {/* Preset zoom toggles */}
        <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
          <span className="text-slate-500 font-semibold flex items-center gap-1 shrink-0 mr-1">
            <Layers className="w-3.5 h-3.5 text-[#0d3b66]" />
            ম্যাপ ভিউ:
          </span>
          {VIEW_PRESETS.map((preset) => (
            <button
              key={preset.id}
              onClick={() => setActivePreset(preset.id)}
              className={`px-3 py-1.5 rounded-lg font-medium transition shrink-0 flex items-center gap-1.5 ${
                activePreset === preset.id
                  ? 'bg-[#0d3b66] text-white shadow-xs font-bold'
                  : 'bg-white text-slate-600 hover:bg-slate-200 border border-slate-200'
              }`}
            >
              <span>{preset.label}</span>
            </button>
          ))}
          
          <button
            onClick={() => setActivePreset('close')}
            title="মূল অবস্থানে ফেরত যান"
            className="p-1.5 bg-white hover:bg-slate-200 text-slate-600 rounded-lg border border-slate-200 transition shrink-0"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* GPS Coordinates Badge with Copy Button */}
        <div className="flex items-center gap-2 w-full sm:w-auto justify-between sm:justify-end">
          <div className="flex items-center gap-1.5 bg-white border border-slate-200 px-3 py-1 rounded-lg text-slate-700 shadow-2xs font-mono">
            <MapPin className="w-3.5 h-3.5 text-amber-600 shrink-0" />
            <span className="text-slate-500 text-[11px]">GPS:</span>
            <span className="font-semibold text-slate-900">{lat.toFixed(4)}° N, {lng.toFixed(4)}° E</span>
          </div>

          <button
            onClick={handleCopyCoordinates}
            className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold transition ${
              copied
                ? 'bg-emerald-600 text-white'
                : 'bg-slate-200 hover:bg-slate-300 text-slate-700'
            }`}
            title="স্থানাঙ্ক কপি করুন"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5" />
                <span>কপি হয়েছে</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span>কপি</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Map Interactive Canvas */}
      <div className="relative">
        <div className={`w-full transition-all duration-300 ${isExpanded ? 'h-[550px]' : 'h-[380px] sm:h-[440px]'}`}>
          <iframe
            title="উল্লাপাড়া প্রেসক্লাব মানচিত্র অবস্থান"
            src={mapIframeSrc}
            className="w-full h-full border-0"
            loading="lazy"
          ></iframe>
        </div>

        {/* Floating Pin Card Over Map */}
        <div className="absolute top-4 left-4 max-w-xs sm:max-w-sm bg-white/95 backdrop-blur-md p-3.5 sm:p-4 rounded-2xl shadow-lg border border-slate-200/80 pointer-events-auto">
          <div className="flex items-start gap-3">
            <div className="w-9 h-9 rounded-xl bg-amber-500 text-slate-950 flex items-center justify-center shrink-0 shadow-xs font-bold">
              <Building className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h4 className="text-sm font-bold text-[#0d3b66] font-serif">উল্লাপাড়া প্রেসক্লাব</h4>
                <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                  খোলা আছে
                </span>
              </div>
              <p className="text-xs text-slate-600 mt-0.5 leading-snug">
                {clubInfo.address}
              </p>
              <div className="mt-2.5 flex items-center gap-2 pt-2 border-t border-slate-100">
                <a
                  href={googleMapsDirectionsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[11px] font-bold text-amber-600 hover:text-amber-700 flex items-center gap-1"
                >
                  <Navigation className="w-3 h-3" />
                  রুট ম্যাপ খুলুন
                </a>
                <span className="text-slate-300">•</span>
                <span className="text-[11px] text-slate-500">
                  {clubInfo.establishedYear} থেকে প্রতিষ্ঠিত
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Expand / Collapse Map View toggle */}
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="absolute bottom-4 right-4 bg-white/95 backdrop-blur-md hover:bg-white text-slate-700 font-medium px-3 py-1.5 rounded-xl shadow-md border border-slate-200 text-xs flex items-center gap-1.5 transition"
        >
          <span>{isExpanded ? 'সংকুচিত করুন' : 'মানচিত্র বড় করুন'}</span>
        </button>
      </div>

      {/* Bottom Section: Nearby Landmarks & Wayfinding Guide */}
      <div className="p-6 sm:p-8 bg-slate-50/70 border-t border-slate-200">
        <div className="mb-5">
          <h4 className="text-base sm:text-lg font-bold text-[#0d3b66] font-serif flex items-center gap-2">
            <Compass className="w-5 h-5 text-amber-600" />
            কীভাবে প্রেসক্লাব কার্যালয়ে আসবেন (নিকটবর্তী ল্যান্ডমার্ক)
          </h4>
          <p className="text-xs text-slate-500 mt-0.5">
            উল্লাপাড়ার প্রধান যোগাযোগ কেন্দ্রগুলো থেকে প্রেসক্লাব ভবনে পৌঁছানোর সহজ পথনির্দেশনা
          </p>
        </div>

        {/* 4-column landmark cards */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {landmarks.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={idx}
                className="bg-white rounded-xl p-4 border border-slate-200 shadow-2xs hover:shadow-sm transition space-y-2"
              >
                <div className="flex items-center justify-between">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center border ${item.color}`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <span className="text-[11px] font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md">
                    {item.distance}
                  </span>
                </div>
                <h5 className="font-bold text-[#0d3b66] text-sm font-serif">
                  {item.title}
                </h5>
                <p className="text-xs text-slate-600 leading-relaxed">
                  {item.detail}
                </p>
              </div>
            );
          })}
        </div>

        {/* Visitor Help Note */}
        <div className="mt-6 bg-amber-50/80 rounded-xl p-4 border border-amber-200/80 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-amber-200/60 text-amber-900 flex items-center justify-center shrink-0">
              <Clock className="w-4 h-4" />
            </div>
            <div>
              <span className="font-bold text-slate-900">কার্যালয় পরিদর্শন সময়সূচি:</span>{' '}
              <span className="text-slate-700">{clubInfo.officeHours || 'প্রতিদিন সকাল ১০:০০ টা থেকে রাত ৯:০০ টা পর্যন্ত খোলা থাকে।'}</span>
            </div>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            {clubInfo.phone && (
              <a
                href={`tel:${clubInfo.phone}`}
                className="inline-flex items-center gap-1.5 font-bold text-[#0d3b66] hover:text-amber-600 transition"
              >
                <PhoneCall className="w-3.5 h-3.5" />
                <span>{clubInfo.phone}</span>
              </a>
            )}
            <a
              href={googleMapsDirectionsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="font-bold text-amber-700 hover:underline inline-flex items-center gap-1"
            >
              <span>লাইভ নেভিগেশন চালু করুন</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>

      </div>

    </div>
  );
}
