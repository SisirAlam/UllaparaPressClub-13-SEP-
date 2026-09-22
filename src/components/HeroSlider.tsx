import React, { useState, useEffect, useRef } from 'react';
import { 
  ChevronLeft, 
  ChevronRight, 
  Sparkles, 
  Play, 
  Pause, 
  Edit3, 
  Plus, 
  Trash2, 
  RotateCcw, 
  X, 
  Check, 
  Image as ImageIcon,
  ExternalLink,
  ShieldCheck
} from 'lucide-react';
import { HeroSlide } from '../types';
import { DEFAULT_HERO_SLIDES, CLUB_INFO } from '../data/pressClubData';
import { usePressClub } from '../context/PressClubContext';

interface HeroSliderProps {
  onNavigate?: (sectionId: string) => void;
}

export default function HeroSlider({ onNavigate }: HeroSliderProps) {
  const { clubInfo } = usePressClub();

  // Load slides from localStorage or fallback to DEFAULT_HERO_SLIDES
  const [slides, setSlides] = useState<HeroSlide[]>(() => {
    try {
      const saved = localStorage.getItem('upc_hero_slides_v2');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch (e) {
      console.warn('Error reading hero slides from localStorage:', e);
    }
    return DEFAULT_HERO_SLIDES;
  });

  // Save slides when changed
  useEffect(() => {
    try {
      localStorage.setItem('upc_hero_slides_v2', JSON.stringify(slides));
    } catch (e) {
      console.warn('Error saving hero slides to localStorage:', e);
    }
  }, [slides]);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isManageModalOpen, setIsManageModalOpen] = useState(false);

  // Edit / Add Slide state
  const [editingSlideId, setEditingSlideId] = useState<string | null>(null);
  const [slideFormTitle, setSlideFormTitle] = useState('');
  const [slideFormSubtitle, setSlideFormSubtitle] = useState('');
  const [slideFormBadge, setSlideFormBadge] = useState('');
  const [slideFormImage, setSlideFormImage] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Auto slide effect
  useEffect(() => {
    if (!isPlaying || slides.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [isPlaying, slides.length]);

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % slides.length);
  };

  // Open modal for adding a new slide
  const openAddSlideModal = () => {
    setEditingSlideId('new');
    setSlideFormTitle('');
    setSlideFormSubtitle('');
    setSlideFormBadge('কার্যকরী পরিষদ');
    setSlideFormImage('/ullapara_press_club_running_committee_1.jpg');
    setIsManageModalOpen(true);
  };

  // Open modal for editing existing slide
  const openEditSlideModal = (slide: HeroSlide) => {
    setEditingSlideId(slide.id);
    setSlideFormTitle(slide.title);
    setSlideFormSubtitle(slide.subtitle);
    setSlideFormBadge(slide.badge);
    setSlideFormImage(slide.imageUrl);
    setIsManageModalOpen(true);
  };

  // Handle local image file upload
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setSlideFormImage(event.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // Save slide (either add or edit)
  const handleSaveSlide = (e: React.FormEvent) => {
    e.preventDefault();
    if (!slideFormTitle || !slideFormImage) return;

    if (editingSlideId === 'new') {
      const newSlide: HeroSlide = {
        id: `slide-${Date.now()}`,
        title: slideFormTitle,
        subtitle: slideFormSubtitle,
        badge: slideFormBadge || 'প্রেসক্লাব কার্যক্রম',
        imageUrl: slideFormImage
      };
      setSlides((prev) => [...prev, newSlide]);
      setCurrentIndex(slides.length); // go to newly added slide
    } else if (editingSlideId) {
      setSlides((prev) =>
        prev.map((s) =>
          s.id === editingSlideId
            ? {
                ...s,
                title: slideFormTitle,
                subtitle: slideFormSubtitle,
                badge: slideFormBadge,
                imageUrl: slideFormImage
              }
            : s
        )
      );
    }

    setEditingSlideId(null);
  };

  // Delete slide
  const handleDeleteSlide = (id: string) => {
    if (slides.length <= 1) {
      alert('কমপক্ষে একটি স্লাইড সংরক্ষিত থাকতে হবে।');
      return;
    }
    const updated = slides.filter((s) => s.id !== id);
    setSlides(updated);
    if (currentIndex >= updated.length) {
      setCurrentIndex(0);
    }
  };

  // Reset to default uploaded committee photos
  const handleResetSlides = () => {
    if (window.confirm('আপনি কি মূল সরকারি স্লাইড ও ছবিতে ফিরে যেতে চান?')) {
      setSlides(DEFAULT_HERO_SLIDES);
      setCurrentIndex(0);
      setEditingSlideId(null);
    }
  };

  const currentSlide = slides[currentIndex] || slides[0] || DEFAULT_HERO_SLIDES[0];

  return (
    <div className="relative w-full rounded-3xl overflow-hidden shadow-2xl border-2 border-slate-700/80 bg-slate-950 group">
      
      {/* Slide Container */}
      <div 
        className="relative h-72 sm:h-96 md:h-[460px] lg:h-[500px] w-full overflow-hidden select-none"
        onMouseEnter={() => setIsPlaying(false)}
        onMouseLeave={() => setIsPlaying(true)}
      >
        {slides.map((slide, idx) => {
          const isActive = idx === currentIndex;
          return (
            <div
              key={slide.id}
              className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${
                isActive ? 'opacity-100 z-10' : 'opacity-0 z-0 pointer-events-none'
              }`}
            >
              {/* Background Image */}
              <img
                src={slide.imageUrl}
                alt={slide.title}
                className="w-full h-full object-cover object-center transform transition-transform duration-700 hover:scale-105"
                referrerPolicy="no-referrer"
              />

              {/* Sophisticated Gradient Overlay for perfect typography contrast */}
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/60 to-transparent"></div>
              <div className="absolute inset-0 bg-gradient-to-r from-slate-950/80 via-slate-950/30 to-transparent"></div>

              {/* Slide Content Caption */}
              <div className="absolute bottom-0 left-0 right-0 p-5 sm:p-8 md:p-10 z-20 text-white flex flex-col justify-end">
                
                {/* Badge & ICT Partner */}
                <div className="flex flex-wrap items-center gap-2 mb-3">
                  <span className="inline-flex items-center gap-1 bg-amber-500 text-slate-950 px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider shadow-sm">
                    <Sparkles className="w-3.5 h-3.5" />
                    {slide.badge}
                  </span>

                  <span className="bg-[#0d3b66] border border-blue-400/40 text-blue-200 px-3 py-1 rounded-full text-xs font-bold">
                    আইসিটি পার্টনার: Sristi Communication
                  </span>

                  <span className="bg-red-600/90 text-white px-2.5 py-1 rounded-full text-[11px] font-extrabold tracking-wide">
                    সুবর্ণজয়ন্তী ২০২৭ (১৯৭৭-২০২৭)
                  </span>
                </div>

                {/* Slide Title */}
                <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-extrabold text-white font-serif leading-tight max-w-3xl drop-shadow-md">
                  {slide.title}
                </h2>

                {/* Slide Subtitle */}
                {slide.subtitle && (
                  <p className="text-xs sm:text-sm md:text-base text-slate-200 mt-2 max-w-2xl font-normal leading-relaxed drop-shadow-sm line-clamp-2 sm:line-clamp-none">
                    {slide.subtitle}
                  </p>
                )}

                {/* Quick actions on slide */}
                <div className="flex flex-wrap items-center gap-3 mt-4 pt-3 border-t border-white/20 text-xs">
                  {onNavigate && (
                    <button
                      onClick={() => onNavigate('committee')}
                      className="px-4 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold shadow-md transition"
                    >
                      কমিটি বিবরণী দেখুন →
                    </button>
                  )}
                  
                  <a
                    href="https://facebook.com/UllaparaPressClub"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3.5 py-1.5 rounded-lg bg-blue-600/90 hover:bg-blue-600 text-white font-bold flex items-center gap-1.5 transition"
                  >
                    <span>facebook.com/UllaparaPressClub</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>

              </div>
            </div>
          );
        })}
      </div>

      {/* Navigation Arrows */}
      {slides.length > 1 && (
        <>
          <button
            onClick={handlePrev}
            className="absolute left-3 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-slate-900/70 hover:bg-amber-500 text-white hover:text-slate-950 flex items-center justify-center transition backdrop-blur-xs border border-white/20 shadow-lg cursor-pointer"
            aria-label="Previous Slide"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>

          <button
            onClick={handleNext}
            className="absolute right-3 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-slate-900/70 hover:bg-amber-500 text-white hover:text-slate-950 flex items-center justify-center transition backdrop-blur-xs border border-white/20 shadow-lg cursor-pointer"
            aria-label="Next Slide"
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        </>
      )}

      {/* Bottom Controls Bar: Dots, Counter, Play/Pause & Manage Trigger */}
      <div className="absolute top-4 right-4 z-20 flex items-center gap-2">
        
        {/* Manage / Edit Slides Button */}
        <button
          onClick={() => {
            setEditingSlideId(null);
            setIsManageModalOpen(true);
          }}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-900/80 hover:bg-amber-500 text-slate-200 hover:text-slate-950 text-xs font-bold transition backdrop-blur-xs border border-white/20 shadow-md cursor-pointer"
          title="স্লাইডার এডিট ও ছবি আপলোড/ডিলেট করুন"
        >
          <Edit3 className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">স্লাইডার ছবি এডিট ও যোগ</span>
        </button>

        {/* Play / Pause Toggle */}
        <button
          onClick={() => setIsPlaying(!isPlaying)}
          className="p-1.5 rounded-full bg-slate-900/80 hover:bg-white text-white hover:text-slate-950 transition backdrop-blur-xs border border-white/20"
          title={isPlaying ? 'স্লাইড থামান' : 'অটো স্লাইডিং চালু করুন'}
          aria-label="Toggle Slide Playback"
        >
          {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
        </button>

        {/* Slide Counter */}
        <span className="px-2.5 py-1 rounded-full bg-slate-900/80 text-amber-300 text-xs font-mono font-bold border border-white/20 backdrop-blur-xs">
          {currentIndex + 1} / {slides.length}
        </span>
      </div>

      {/* Dot Indicators */}
      <div className="absolute bottom-3 right-6 z-20 flex items-center gap-1.5">
        {slides.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setCurrentIndex(idx)}
            className={`h-2 rounded-full transition-all duration-300 cursor-pointer ${
              idx === currentIndex ? 'w-6 bg-amber-400' : 'w-2 bg-white/50 hover:bg-white'
            }`}
            aria-label={`Go to slide ${idx + 1}`}
          />
        ))}
      </div>

      {/* Full Manage Slides Modal */}
      {isManageModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl border border-slate-200 max-h-[90vh] overflow-y-auto text-slate-900">
            
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-200">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-amber-500 text-slate-950 flex items-center justify-center font-bold">
                  <ImageIcon className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-[#0d3b66] font-serif">
                    মেইন ব্যানার স্লাইডার ব্যবস্থাপনা
                  </h3>
                  <p className="text-xs text-slate-500">
                    কমিটির ছবি আপলোড, সম্পাদনা, মুছে ফেলা ও নতুন স্লাইড যোগ করুন
                  </p>
                </div>
              </div>
              <button
                onClick={() => {
                  setIsManageModalOpen(false);
                  setEditingSlideId(null);
                }}
                className="p-2 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* If Form is Active (Add or Edit) */}
            {editingSlideId !== null ? (
              <form onSubmit={handleSaveSlide} className="space-y-4">
                <div className="bg-amber-50 p-3 rounded-xl border border-amber-200 text-xs text-amber-900 font-bold">
                  {editingSlideId === 'new' ? '➕ নতুন স্লাইড ও ছবি যুক্ত করুন' : '✏️ বর্তমান স্লাইড তথ্য ও ছবি সম্পাদনা'}
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    স্লাইড শিরোনাম *
                  </label>
                  <input
                    type="text"
                    required
                    value={slideFormTitle}
                    onChange={(e) => setSlideFormTitle(e.target.value)}
                    placeholder="উদাঃ উল্লাপাড়া উপজেলা প্রেসক্লাব কার্যকরী কমিটি ২০২৪-২০২৭"
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    উপ-শিরোনাম / বিবরণ
                  </label>
                  <textarea
                    rows={2}
                    value={slideFormSubtitle}
                    onChange={(e) => setSlideFormSubtitle(e.target.value)}
                    placeholder="উদাঃ ১২ আগস্ট ২০২৪ খ্রিস্টাব্দে গঠিত পূর্ণাঙ্গ কার্যকরী কমিটি"
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      ব্যাজ / ট্যাগ
                    </label>
                    <input
                      type="text"
                      value={slideFormBadge}
                      onChange={(e) => setSlideFormBadge(e.target.value)}
                      placeholder="উদাঃ বর্তমান কার্যকরী পরিষদ"
                      className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      ডিভাইস থেকে ছবি আপলোড করুন
                    </label>
                    <input
                      type="file"
                      ref={fileInputRef}
                      accept="image/*"
                      onChange={handleFileChange}
                      className="w-full text-xs text-slate-600 file:mr-2 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-amber-100 file:text-amber-900 hover:file:bg-amber-200"
                    />
                  </div>
                </div>

                {/* Or image URL input */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    অথবা ছবির লিংক (URL)
                  </label>
                  <input
                    type="text"
                    value={slideFormImage}
                    onChange={(e) => setSlideFormImage(e.target.value)}
                    placeholder="উদাঃ /ullapara_press_club_running_committee_1.jpg বা ওয়েব লিংক"
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500 font-mono"
                  />
                </div>

                {/* Preview Image */}
                {slideFormImage && (
                  <div className="mt-2">
                    <span className="block text-[11px] font-bold text-slate-500 mb-1">ছবি প্রিভিউ:</span>
                    <div className="h-32 w-full rounded-xl overflow-hidden border border-slate-300 bg-slate-100">
                      <img
                        src={slideFormImage}
                        alt="Preview"
                        className="w-full h-full object-cover"
                        referrerPolicy="no-referrer"
                      />
                    </div>
                  </div>
                )}

                <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-200">
                  <button
                    type="button"
                    onClick={() => setEditingSlideId(null)}
                    className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl transition"
                  >
                    বাতিল
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 text-xs font-bold text-slate-950 bg-amber-500 hover:bg-amber-400 rounded-xl shadow-md transition flex items-center gap-1"
                  >
                    <Check className="w-4 h-4" />
                    <span>সংরক্ষণ করুন</span>
                  </button>
                </div>
              </form>
            ) : (
              /* Slides List Overview */
              <div className="space-y-4">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-xs font-bold text-slate-700">
                    মোট সক্রিয় স্লাইড: {slides.length} টি
                  </span>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={handleResetSlides}
                      className="px-3 py-1.5 text-xs font-bold text-red-700 bg-red-50 hover:bg-red-100 rounded-lg border border-red-200 transition flex items-center gap-1"
                      title="ডিফল্ট কমিট ছবির স্লাইডারে পুনঃস্থাপন করুন"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      <span>রিসেট করুন</span>
                    </button>
                    <button
                      onClick={openAddSlideModal}
                      className="px-3.5 py-1.5 text-xs font-bold text-slate-950 bg-amber-500 hover:bg-amber-400 rounded-lg shadow-xs transition flex items-center gap-1"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>নতুন ছবি ও স্লাইড যুক্ত করুন</span>
                    </button>
                  </div>
                </div>

                <div className="divide-y divide-slate-100 border border-slate-200 rounded-2xl overflow-hidden bg-white">
                  {slides.map((slide, idx) => (
                    <div key={slide.id} className="p-3 sm:p-4 flex items-center justify-between gap-3 hover:bg-slate-50 transition">
                      <div className="flex items-center gap-3">
                        <div className="w-16 h-12 rounded-lg overflow-hidden border border-slate-200 bg-slate-100 shrink-0">
                          <img
                            src={slide.imageUrl}
                            alt={slide.title}
                            className="w-full h-full object-cover"
                            referrerPolicy="no-referrer"
                          />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-100 text-amber-900 border border-amber-300">
                              {slide.badge}
                            </span>
                            <span className="text-xs text-slate-400 font-mono">#{idx + 1}</span>
                          </div>
                          <h4 className="text-xs sm:text-sm font-bold text-[#0d3b66] mt-0.5 line-clamp-1">
                            {slide.title}
                          </h4>
                          <p className="text-[11px] text-slate-500 line-clamp-1">
                            {slide.subtitle}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-1.5 shrink-0">
                        <button
                          onClick={() => openEditSlideModal(slide)}
                          className="p-1.5 rounded-lg text-slate-600 hover:text-[#0d3b66] hover:bg-slate-100 transition"
                          title="সম্পাদনা করুন"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteSlide(slide.id)}
                          className="p-1.5 rounded-lg text-red-500 hover:text-red-700 hover:bg-red-50 transition"
                          title="মুছে ফেলুন"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="p-3 bg-slate-50 rounded-xl text-xs text-slate-600 flex items-center justify-between border border-slate-200">
                  <span className="flex items-center gap-1 font-medium">
                    <ShieldCheck className="w-4 h-4 text-emerald-600" />
                    আইসিটি পার্টনার: <strong>Sristi Communication</strong>
                  </span>
                  <span>স্বয়ংক্রিয় স্লাইডিং সময়: ৫ সেকেন্ড</span>
                </div>
              </div>
            )}

          </div>
        </div>
      )}

    </div>
  );
}
