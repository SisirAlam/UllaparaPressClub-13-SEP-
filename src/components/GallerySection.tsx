import { useState } from 'react';
import { usePressClub } from '../context/PressClubContext';
import { GALLERY_ITEMS } from '../data/pressClubData';
import { GalleryItem } from '../types';
import SectionActionToolbar from './SectionActionToolbar';
import { 
  Image as ImageIcon, 
  X, 
  Maximize2, 
  Calendar,
  Sparkles,
  Award
} from 'lucide-react';

export default function GallerySection() {
  const { images } = usePressClub();
  const [activeCategory, setActiveCategory] = useState<string>('সকল');
  const [activeItem, setActiveItem] = useState<GalleryItem | null>(null);

  const categories = ['সকল', 'প্রেসক্লাব অ্যালবাম', 'সভা ও সম্মেলন', 'সংবাদ সম্মেলন', 'প্রশিক্ষণ কর্মশালা', 'জাতীয় উৎসব', 'সমাজসেবা'];

  // Combine official image assets with gallery items
  const customOfficialGallery: GalleryItem[] = [
    {
      id: 'custom-1',
      title: 'উল্লাপাড়া প্রেসক্লাব সাংবাদিক সদস্যবৃন্দ (গ্রুপ ছবি)',
      category: 'প্রেসক্লাব অ্যালবাম',
      date: 'মে ২০২৬',
      imageUrl: images.membersGroup,
      description: 'প্রেসক্লাবের সুবর্ণজয়ন্তী প্রস্তুতি ও সাধারণ সভা পরবর্তী সদস্যদের গ্রুপ ছবি।'
    },
    {
      id: 'custom-2',
      title: 'উল্লাপাড়া প্রেসক্লাব স্থায়ী ভবন (থানা সংলগ্ন)',
      category: 'প্রেসক্লাব অ্যালবাম',
      date: 'ঐতিহাসিক স্থাপনা',
      imageUrl: images.building,
      description: 'সিরাজগঞ্জ জেলার উল্লাপাড়া থানা সংলগ্ন উল্লাপাড়া প্রেসক্লাবের নিজস্ব সুসজ্জিত কার্যালয়।'
    },
    {
      id: 'custom-3',
      title: 'সুবর্ণজয়ন্তী ৫০ সদস্য সংগ্রহ ও নবায়ন ক্যাম্পেইন',
      category: 'প্রেসক্লাব অ্যালবাম',
      date: 'মে ২০২৬',
      imageUrl: images.recruitmentBanner,
      description: 'উল্লাপাড়া প্রেসক্লাবের ৫০ বছর পূর্তি উপলক্ষে নতুন সদস্য আহ্বান ও নবায়ন বিজ্ঞপ্তি।'
    }
  ];

  const allItems = [...customOfficialGallery, ...GALLERY_ITEMS];

  const filteredItems = allItems.filter((item) => {
    if (activeCategory === 'সকল') return true;
    return item.category === activeCategory;
  });

  return (
    <section id="gallery" className="py-20 bg-slate-50 border-t border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="flex items-center justify-center gap-3 mb-3 flex-wrap">
            <span className="text-amber-950 bg-amber-100 border border-amber-300 px-3.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider inline-flex items-center gap-1.5 shadow-xs">
              <ImageIcon className="w-3.5 h-3.5 text-amber-700" />
              স্মৃতি ও কার্যক্রম
            </span>
            <SectionActionToolbar sectionId="gallery" sectionTitle="প্রেসক্লাব ফটো ও মিডিয়া গ্যালারি" />
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#0d3b66] mt-1 font-serif">
            প্রেসক্লাব ফটো ও মিডিয়া গ্যালারি
          </h2>
          <p className="text-slate-600 mt-3 text-base">
            উল্লাপাড়া প্রেসক্লাবের ঐতিহাসিক ভবন, সদস্য সম্মেলন, জাতীয় দিবস ও সমাজ বিনির্মাণের স্থিরচিত্র
          </p>
          <div className="w-20 h-1 bg-amber-500 mx-auto mt-4 rounded-full"></div>
        </div>

        {/* Category Filters */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-10">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-2 text-xs sm:text-sm font-bold rounded-xl transition-all ${
                activeCategory === cat
                  ? 'bg-[#0d3b66] text-white shadow-sm'
                  : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Photo Grid - Bento Style */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredItems.map((item) => (
            <div
              key={item.id}
              onClick={() => setActiveItem(item)}
              className="group relative bg-white rounded-2xl overflow-hidden border border-slate-200 shadow-sm hover:shadow-lg border-b-4 hover:border-b-amber-500 transition-all duration-300 cursor-pointer flex flex-col"
            >
              <div className="relative h-60 overflow-hidden bg-slate-100 flex items-center justify-center">
                {item.imageUrl ? (
                  <img
                    src={item.imageUrl}
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    referrerPolicy="no-referrer"
                  />
                ) : (
                  <div className="text-slate-400 flex flex-col items-center gap-1">
                    <Maximize2 className="w-8 h-8 text-slate-300" />
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-[#0d3b66]/80 via-transparent to-transparent opacity-60 group-hover:opacity-85 transition-opacity"></div>
                
                <span className="absolute top-3 left-3 px-2.5 py-1 rounded-md text-[10px] font-bold bg-amber-500 text-slate-950 shadow-xs">
                  {item.category}
                </span>

                <div className="absolute bottom-3 right-3 w-8 h-8 rounded-full bg-white/20 backdrop-blur-xs text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <Maximize2 className="w-4 h-4" />
                </div>
              </div>

              <div className="p-5 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="text-base font-bold text-[#0d3b66] font-serif group-hover:text-amber-600 transition">
                    {item.title}
                  </h3>
                  <p className="text-xs text-slate-500 line-clamp-2 mt-1.5 leading-relaxed">
                    {item.description}
                  </p>
                </div>

                <div className="flex items-center gap-1.5 text-xs text-slate-400 mt-4 pt-3 border-t border-slate-100">
                  <Calendar className="w-3.5 h-3.5 text-amber-600" />
                  <span>{item.date}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Lightbox Modal */}
        {activeItem && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-slate-900 text-white w-full max-w-3xl rounded-2xl overflow-hidden shadow-2xl border border-slate-800 flex flex-col max-h-[90vh]">
              
              <div className="relative bg-black flex items-center justify-center max-h-[60vh] overflow-hidden">
                {activeItem.imageUrl ? (
                  <img
                    src={activeItem.imageUrl}
                    alt={activeItem.title}
                    className="w-full h-auto max-h-[60vh] object-contain"
                    referrerPolicy="no-referrer"
                  />
                ) : null}
                <button
                  onClick={() => setActiveItem(null)}
                  className="absolute top-3 right-3 p-2 bg-black/60 hover:bg-black/90 rounded-full text-white transition"
                  aria-label="Close"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="p-6 space-y-2 bg-slate-900">
                <div className="flex items-center justify-between text-xs text-amber-400 font-semibold">
                  <span>{activeItem.category}</span>
                  <span className="text-slate-400">{activeItem.date}</span>
                </div>
                <h3 className="text-xl font-bold font-serif text-white">
                  {activeItem.title}
                </h3>
                <p className="text-sm text-slate-300 leading-relaxed">
                  {activeItem.description}
                </p>
              </div>

            </div>
          </div>
        )}

      </div>
    </section>
  );
}
