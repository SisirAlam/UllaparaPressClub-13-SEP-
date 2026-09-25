import React, { useState } from 'react';
import { usePressClub } from '../context/PressClubContext';
import { CommitteeMember } from '../types';
import SectionActionToolbar from './SectionActionToolbar';
import { 
  Users, 
  Search, 
  Tv, 
  Phone, 
  BadgeCheck,
  Edit,
  Plus,
  Trash2,
  X,
  Check,
  RotateCcw,
  Sparkles,
  UserPlus,
  Shield,
  FileCheck,
  LayoutGrid,
  Table as TableIcon,
  Award,
  Calendar,
  Building,
  CheckCircle2,
  UserCheck
} from 'lucide-react';

export default function CommitteeSection() {
  const { 
    members, 
    addMember, 
    updateMember, 
    deleteMember, 
    resetMembersToDefault, 
    images, 
    clubInfo,
    setIsAdminOpen,
    setIsRecruitmentModalOpen,
    setIsMemberDashboardOpen,
    authenticatedMember,
    quickSwitchMember
  } = usePressClub();

  const [activeTab, setActiveTab] = useState<'all' | 'list1_executive' | 'list2_general' | 'resolution'>('all');
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingMembers, setEditingMembers] = useState<CommitteeMember[]>([]);
  const [saveSuccessMsg, setSaveSuccessMsg] = useState(false);

  // New member draft state
  const [newMember, setNewMember] = useState<{
    name: string;
    designation: string;
    media: string;
    phone: string;
    listType: 'list1_executive' | 'list2_general';
    category: 'executive' | 'senior' | 'general' | 'photojournalist';
  }>({
    name: '',
    designation: '',
    media: '',
    phone: '',
    listType: 'list1_executive',
    category: 'executive'
  });

  const list1Members = members.filter(m => m.listType === 'list1_executive');
  const list2Members = members.filter(m => m.listType === 'list2_general');

  const filteredMembers = members.filter((member) => {
    let matchesTab = true;
    if (activeTab === 'list1_executive') matchesTab = member.listType === 'list1_executive';
    else if (activeTab === 'list2_general') matchesTab = member.listType === 'list2_general';

    const matchesSearch = 
      member.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      member.designation.toLowerCase().includes(searchQuery.toLowerCase()) ||
      member.media.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (member.phone && member.phone.includes(searchQuery));
    return matchesTab && matchesSearch;
  });

  const handleOpenEditModal = () => {
    setEditingMembers(JSON.parse(JSON.stringify(members)));
    setIsEditModalOpen(true);
  };

  const handleUpdateMemberField = (index: number, field: keyof CommitteeMember, value: string) => {
    const updated = [...editingMembers];
    updated[index] = {
      ...updated[index],
      [field]: value
    };
    setEditingMembers(updated);
  };

  const handleDeleteMember = (id: string) => {
    setEditingMembers(editingMembers.filter((m) => m.id !== id));
  };

  const handleAddNewMember = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMember.name.trim() || !newMember.designation.trim()) return;

    const added: CommitteeMember = {
      id: Date.now().toString(),
      serialNumber: editingMembers.length + 1,
      listType: newMember.listType,
      name: newMember.name.trim(),
      designation: newMember.designation.trim(),
      media: newMember.media.trim() || 'সংবাদমাধ্যম',
      phone: newMember.phone.trim(),
      photoUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
      category: newMember.category
    };

    setEditingMembers([...editingMembers, added]);
    setNewMember({
      name: '',
      designation: '',
      media: '',
      phone: '',
      listType: 'list1_executive',
      category: 'executive'
    });
  };

  const handleSaveAll = () => {
    editingMembers.forEach(mem => {
      const exists = members.find(m => m.id === mem.id);
      if (exists) {
        updateMember(mem.id, mem);
      } else {
        addMember(mem);
      }
    });

    const newIds = new Set(editingMembers.map(m => m.id));
    members.forEach(m => {
      if (!newIds.has(m.id)) {
        deleteMember(m.id);
      }
    });

    setSaveSuccessMsg(true);
    setTimeout(() => {
      setSaveSuccessMsg(false);
      setIsEditModalOpen(false);
    }, 800);
  };

  const handleResetToDefault = () => {
    if (window.confirm('আপনি কি সংশোধিত অফিশিয়াল তালিকায় ফিরে যেতে চান?')) {
      resetMembersToDefault();
      setIsEditModalOpen(false);
    }
  };

  // Leaders
  const president = members.find(m => m.designation.includes('সভাপতি') && !m.designation.includes('সহ-সভাপতি')) || members[0];
  const generalSecretary = members.find(m => m.designation.includes('সাধারণ সম্পাদক') && !m.designation.includes('যুগ্ম')) || members[3];

  return (
    <section id="committee" className="py-20 bg-slate-50 border-t border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Reimagined Header with Official Circular Logo Seal */}
        <div className="text-center max-w-4xl mx-auto mb-12">
          {/* Centered Uploaded Circular Logo with Gold Accents */}
          <div className="inline-flex flex-col items-center mb-4">
            <div className="relative">
              <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full p-1 bg-gradient-to-tr from-amber-500 via-amber-300 to-amber-600 shadow-xl flex items-center justify-center">
                <div className="w-full h-full rounded-full bg-white p-1 overflow-hidden flex items-center justify-center">
                  <img
                    src={images?.logo || '/pressclub_official_logo.jpg'}
                    alt="উল্লাপাড়া উপজেলা প্রেসক্লাব প্রাতিষ্ঠানিক প্রতীক"
                    className="w-full h-full object-contain rounded-full"
                    referrerPolicy="no-referrer"
                  />
                </div>
              </div>
              <span className="absolute -bottom-1 -right-1 bg-emerald-600 text-white p-1.5 rounded-full shadow-md border-2 border-white" title="অনুমোদিত কার্যকরী পরিষদ">
                <BadgeCheck className="w-4 h-4" />
              </span>
            </div>

            <div className="mt-3 flex items-center justify-center gap-3 flex-wrap">
              <div className="inline-flex items-center gap-2 bg-amber-100/90 text-amber-950 border border-amber-300/80 px-4 py-1 rounded-full text-xs font-bold tracking-wider uppercase shadow-xs">
                <Sparkles className="w-3.5 h-3.5 text-amber-700" />
                <span>স্থাপিত: ১৯৭৭ ইং • অনুমোদিত কার্যনির্বাহী ও সাধারণ পরিষদ</span>
              </div>
              <SectionActionToolbar sectionId="committee" sectionTitle="কার্যনির্বাহী ও সাধারণ পরিষদ কমিটি" />
            </div>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#0d3b66] font-serif tracking-tight">
            উল্লাপাড়া উপজেলা প্রেসক্লাব কমিটি
          </h2>
          <p className="text-slate-600 mt-3 text-sm sm:text-base max-w-2xl mx-auto leading-relaxed">
            ১২ আগস্ট ২০২৪ তারিখে প্রেসক্লাব মিলনায়তনে অনুষ্ঠিত সর্বসম্মতিক্রমে অনুমোদিত ৩ বছর মেয়াদী (২০২৪-২০২৭) কার্যনির্বাহী ও সাধারণ পরিষদ সদস্যবৃন্দ
          </p>
          <div className="w-24 h-1 bg-amber-500 mx-auto mt-4 rounded-full"></div>
        </div>

        {/* Leadership Spotlight: President & General Secretary */}
        <div className="grid md:grid-cols-2 gap-6 mb-12 max-w-4xl mx-auto">
          {/* President Card */}
          {president && (
            <div className="bg-gradient-to-br from-[#0d3b66] to-slate-900 text-white rounded-3xl p-6 shadow-lg border border-blue-900 relative overflow-hidden flex items-center gap-5">
              <div className="relative shrink-0">
                <img 
                  src={president.photoUrl} 
                  alt={president.name}
                  className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl object-cover border-2 border-amber-400 shadow-md"
                  referrerPolicy="no-referrer"
                />
                <span className="absolute -bottom-2 -right-1 bg-amber-500 text-slate-950 text-[10px] font-extrabold px-2 py-0.5 rounded-full shadow">
                  নেতৃত্ব
                </span>
              </div>
              <div className="space-y-1 min-w-0">
                <span className="inline-block px-2.5 py-0.5 rounded-md bg-amber-400 text-slate-950 text-[11px] font-bold">
                  {president.designation}
                </span>
                <h3 className="text-xl font-bold font-serif truncate text-white">{president.name}</h3>
                <p className="text-xs text-blue-200 flex items-center gap-1">
                  <Tv className="w-3.5 h-3.5 text-amber-400" />
                  {president.media}
                </p>
                {president.phone && (
                  <p className="text-xs text-amber-300 flex items-center gap-1 pt-1 font-mono">
                    <Phone className="w-3 h-3" />
                    {president.phone}
                  </p>
                )}
              </div>
            </div>
          )}

          {/* General Secretary Card */}
          {generalSecretary && (
            <div className="bg-gradient-to-br from-slate-900 to-[#0d3b66] text-white rounded-3xl p-6 shadow-lg border border-blue-900 relative overflow-hidden flex items-center gap-5">
              <div className="relative shrink-0">
                <img 
                  src={generalSecretary.photoUrl} 
                  alt={generalSecretary.name}
                  className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl object-cover border-2 border-amber-400 shadow-md"
                  referrerPolicy="no-referrer"
                />
                <span className="absolute -bottom-2 -right-1 bg-amber-500 text-slate-950 text-[10px] font-extrabold px-2 py-0.5 rounded-full shadow">
                  প্রশাসন
                </span>
              </div>
              <div className="space-y-1 min-w-0">
                <span className="inline-block px-2.5 py-0.5 rounded-md bg-amber-400 text-slate-950 text-[11px] font-bold">
                  {generalSecretary.designation}
                </span>
                <h3 className="text-xl font-bold font-serif truncate text-white">{generalSecretary.name}</h3>
                <p className="text-xs text-blue-200 flex items-center gap-1">
                  <Tv className="w-3.5 h-3.5 text-amber-400" />
                  {generalSecretary.media}
                </p>
                {generalSecretary.phone && (
                  <p className="text-xs text-amber-300 flex items-center gap-1 pt-1 font-mono">
                    <Phone className="w-3 h-3" />
                    {generalSecretary.phone}
                  </p>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Member Self-Service Quick Portal Banner */}
        <div className="bg-gradient-to-r from-blue-900 to-[#0d3b66] text-white rounded-3xl p-5 mb-8 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4 border border-blue-800">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-amber-400 text-slate-950 flex items-center justify-center font-bold shrink-0 shadow-sm">
              <UserCheck className="w-6 h-6 text-slate-950" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h4 className="font-bold text-base text-white font-serif">
                  প্রেসক্লাব সদস্য পোর্টাল ও ড্যাশবোর্ড
                </h4>
                <span className="text-[10px] bg-emerald-500/30 text-emerald-300 font-bold px-2 py-0.5 rounded-full border border-emerald-400/30">
                  সুরক্ষিত পোর্টাল
                </span>
              </div>
              <p className="text-xs text-blue-200 mt-1 leading-relaxed">
                প্রেসক্লাব সদস্যদের প্রোফাইল তথ্য ও মোবাইল নম্বর হালনাগাদ, ব্যক্তিগত ডিজিটাল প্রেস আইডি কার্ড ও সার্কুলার দেখুন
              </p>
            </div>
          </div>
          <button
            onClick={() => setIsMemberDashboardOpen(true)}
            className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs sm:text-sm transition shadow-sm flex items-center justify-center gap-2 shrink-0 cursor-pointer"
          >
            <UserCheck className="w-4 h-4 text-slate-950" />
            <span>{authenticatedMember ? `আমার ড্যাশবোর্ড (${authenticatedMember.name})` : 'সদস্য ড্যাশবোর্ডে প্রবেশ'}</span>
          </button>
        </div>

        {/* Interactive Controls Bar: Tab Selector + View Mode Switch + Search + Edit Trigger */}
        <div className="bg-white rounded-3xl p-4 sm:p-5 border border-slate-200 shadow-sm mb-8 flex flex-col lg:flex-row items-center justify-between gap-4">
          
          {/* List Tabs */}
          <div className="flex flex-wrap items-center gap-2 w-full lg:w-auto">
            <button
              onClick={() => setActiveTab('all')}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition flex items-center gap-1.5 ${
                activeTab === 'all'
                  ? 'bg-[#0d3b66] text-white shadow-xs'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              <Users className="w-4 h-4 text-amber-400" />
              <span>সকল সদস্য ({members.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('list1_executive')}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition flex items-center gap-1.5 ${
                activeTab === 'list1_executive'
                  ? 'bg-[#0d3b66] text-white shadow-xs'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              <Shield className="w-4 h-4 text-amber-400" />
              <span>কার্যনির্বাহী পরিষদ - তালিকা ১ ({list1Members.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('list2_general')}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition flex items-center gap-1.5 ${
                activeTab === 'list2_general'
                  ? 'bg-[#0d3b66] text-white shadow-xs'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              <FileCheck className="w-4 h-4 text-amber-400" />
              <span>সাধারণ পরিষদ সদস্য - তালিকা ২ ({list2Members.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('resolution')}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition flex items-center gap-1.5 ${
                activeTab === 'resolution'
                  ? 'bg-[#0d3b66] text-white shadow-xs'
                  : 'bg-amber-50 text-amber-900 hover:bg-amber-100 border border-amber-200'
              }`}
            >
              <Award className="w-4 h-4 text-amber-600" />
              <span>অনুমোদন সনদ ও রেজল্যুশন</span>
            </button>
          </div>

          {/* Right Action Tools: Search, View Mode & Edit */}
          <div className="flex flex-wrap items-center gap-2.5 w-full lg:w-auto justify-end">
            {/* View Mode Toggle (Grid vs Table) */}
            {activeTab !== 'resolution' && (
              <div className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-1.5 rounded-lg transition ${
                    viewMode === 'grid' 
                      ? 'bg-white text-[#0d3b66] shadow-2xs font-bold' 
                      : 'text-slate-500 hover:text-slate-900'
                  }`}
                  title="কার্ড গ্রিড ভিউ"
                >
                  <LayoutGrid className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewMode('table')}
                  className={`p-1.5 rounded-lg transition ${
                    viewMode === 'table' 
                      ? 'bg-white text-[#0d3b66] shadow-2xs font-bold' 
                      : 'text-slate-500 hover:text-slate-900'
                  }`}
                  title="রেজল্যুশন রোস্টার টেবিল ভিউ"
                >
                  <TableIcon className="w-4 h-4" />
                </button>
              </div>
            )}

            {/* Search Box */}
            {activeTab !== 'resolution' && (
              <div className="relative flex-1 sm:w-56">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="নাম, পদবী বা গণমাধ্যম..."
                  className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-500 transition"
                />
              </div>
            )}

            {/* Edit Button */}
            <button
              onClick={handleOpenEditModal}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold text-slate-900 bg-amber-400 hover:bg-amber-500 rounded-xl shadow-xs transition shrink-0"
              title="কমিটি সদস্য তালিকা সম্পাদনা করুন"
            >
              <Edit className="w-3.5 h-3.5" />
              <span>তালিকা এডিট</span>
            </button>
          </div>

        </div>

        {/* TAB 1 & 2: MEMBERS DISPLAY (GRID OR TABLE) */}
        {activeTab !== 'resolution' && (
          <>
            {filteredMembers.length === 0 ? (
              <div className="text-center py-16 bg-white rounded-3xl border border-slate-200">
                <Users className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                <p className="text-base text-slate-600 font-medium">কোনো সদস্যের তথ্য পাওয়া যায়নি।</p>
                <button 
                  onClick={() => { setActiveTab('all'); setSearchQuery(''); }}
                  className="mt-2 text-xs text-[#0d3b66] font-bold underline hover:text-amber-600"
                >
                  ফিল্টার রিসেট করুন
                </button>
              </div>
            ) : viewMode === 'grid' ? (
              /* CARD GRID VIEW */
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 animate-in fade-in duration-300">
                {filteredMembers.map((member, index) => (
                  <div 
                    key={member.id}
                    className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-md hover:border-amber-400 border-b-4 hover:border-b-amber-500 transition-all duration-200 flex flex-col justify-between group"
                  >
                    <div className="p-6 flex items-start gap-4">
                      {/* Photo / Serial */}
                      <div className="relative shrink-0">
                        <img 
                          src={member.photoUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80'} 
                          alt={member.name}
                          className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl object-cover border-2 border-slate-100 shadow-sm group-hover:scale-105 transition-transform"
                          referrerPolicy="no-referrer"
                        />
                        <span className="absolute -top-2 -left-2 bg-[#0d3b66] text-amber-300 text-[10px] font-mono font-bold w-6 h-6 rounded-full flex items-center justify-center border-2 border-white shadow-xs">
                          {member.serialNumber || index + 1}
                        </span>
                        <span className="absolute -bottom-1 -right-1 bg-white p-0.5 rounded-full shadow-xs">
                          <BadgeCheck className="w-4 h-4 text-emerald-600" />
                        </span>
                      </div>

                      {/* Info */}
                      <div className="space-y-1 min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-1.5">
                          <span className={`inline-block px-2.5 py-0.5 text-[10px] font-bold rounded-full border ${
                            member.listType === 'list1_executive'
                              ? 'bg-amber-50 text-amber-900 border-amber-200'
                              : 'bg-blue-50 text-blue-900 border-blue-200'
                          }`}>
                            {member.designation}
                          </span>
                          <span className="text-[10px] font-bold text-slate-400">
                            {member.listType === 'list1_executive' ? 'তালিকা ১' : 'তালিকা ২'}
                          </span>
                        </div>

                        <h3 className="text-base font-bold text-[#0d3b66] font-serif truncate group-hover:text-amber-700 transition">
                          {member.name}
                        </h3>

                        <div className="flex items-center gap-1 text-xs text-slate-600 pt-0.5">
                          <Tv className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                          <span className="truncate font-medium text-slate-700">{member.media}</span>
                        </div>
                      </div>
                    </div>

                    {/* Bottom Status Bar */}
                    <div className="mt-auto px-6 py-3 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                      {member.phone ? (
                        <a 
                          href={`tel:${member.phone}`}
                          className="flex items-center gap-1.5 font-medium text-slate-700 hover:text-amber-600 transition"
                        >
                          <Phone className="w-3.5 h-3.5 text-emerald-600" />
                          <span>{member.phone}</span>
                        </a>
                      ) : (
                        <span className="text-slate-400 italic flex items-center gap-1 text-[11px]">
                          <Phone className="w-3 h-3 text-slate-300" />
                          মোবাইল নিবন্ধিত
                        </span>
                      )}

                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => {
                            quickSwitchMember(member.id);
                            setIsMemberDashboardOpen(true);
                          }}
                          className="text-[10px] font-bold text-blue-700 bg-blue-50 hover:bg-blue-100 px-2 py-0.5 rounded border border-blue-200 flex items-center gap-1 transition cursor-pointer"
                          title="সদস্য প্রোফাইল ও আইডি কার্ড দেখুন"
                        >
                          <UserCheck className="w-3 h-3 text-blue-600" />
                          প্রোফাইল
                        </button>

                        <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                          অনুমোদিত
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              /* RESOLUTION ROSTER TABLE VIEW */
              <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden animate-in fade-in duration-300">
                <div className="px-6 py-4 bg-gradient-to-r from-slate-900 to-[#0d3b66] text-white flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <h3 className="font-bold font-serif text-base text-amber-300">
                      উল্লাপাড়া উপজেলা প্রেসক্লাব — অনুমোদিত রেজল্যুশন রোস্টার
                    </h3>
                    <p className="text-xs text-slate-300">
                      কার্যনির্বাহী পরিষদ ও সাধারণ পরিষদ সদস্য তালিকা (২০২৪-২০২৭)
                    </p>
                  </div>
                  <span className="px-3 py-1 rounded-full text-xs font-bold bg-amber-400 text-slate-950 self-start sm:self-auto">
                    মোট {filteredMembers.length} জন সদস্য
                  </span>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-slate-100 text-slate-700 text-xs uppercase font-bold border-b border-slate-200">
                        <th className="py-3.5 px-4 text-center w-16">ক্রমিক</th>
                        <th className="py-3.5 px-4">ছবি</th>
                        <th className="py-3.5 px-4">সদস্যের নাম</th>
                        <th className="py-3.5 px-4">প্রেসক্লাব পদবী</th>
                        <th className="py-3.5 px-4">গণমাধ্যম (মিডিয়া)</th>
                        <th className="py-3.5 px-4">মোবাইল নম্বর</th>
                        <th className="py-3.5 px-4 text-center">তালিকা</th>
                        <th className="py-3.5 px-4 text-center">স্ট্যাটাস</th>
                        <th className="py-3.5 px-4 text-center">ড্যাশবোর্ড</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-xs sm:text-sm">
                      {filteredMembers.map((m, idx) => (
                        <tr key={m.id} className="hover:bg-amber-50/40 transition">
                          <td className="py-3.5 px-4 text-center font-mono font-bold text-slate-500">
                            {m.serialNumber || idx + 1}
                          </td>
                          <td className="py-3.5 px-4">
                            <img 
                              src={m.photoUrl} 
                              alt={m.name} 
                              className="w-10 h-10 rounded-xl object-cover border border-slate-200"
                              referrerPolicy="no-referrer"
                            />
                          </td>
                          <td className="py-3.5 px-4 font-bold text-[#0d3b66] font-serif">
                            {m.name}
                          </td>
                          <td className="py-3.5 px-4">
                            <span className="font-bold text-slate-800 bg-amber-50 px-2.5 py-1 rounded-lg border border-amber-200 text-xs">
                              {m.designation}
                            </span>
                          </td>
                          <td className="py-3.5 px-4 text-slate-700 font-medium">
                            {m.media}
                          </td>
                          <td className="py-3.5 px-4 font-mono text-slate-600">
                            {m.phone ? (
                              <a href={`tel:${m.phone}`} className="hover:text-amber-600 flex items-center gap-1">
                                <Phone className="w-3 h-3 text-emerald-600" />
                                {m.phone}
                              </a>
                            ) : (
                              <span className="text-slate-400 italic">(সংরক্ষিত)</span>
                            )}
                          </td>
                          <td className="py-3.5 px-4 text-center">
                            <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700">
                              {m.listType === 'list1_executive' ? 'তালিকা ১' : 'তালিকা ২'}
                            </span>
                          </td>
                          <td className="py-3.5 px-4 text-center">
                            <span className="text-[11px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">
                              সক্রিয়
                            </span>
                          </td>
                          <td className="py-3.5 px-4 text-center">
                            <button
                              onClick={() => {
                                quickSwitchMember(m.id);
                                setIsMemberDashboardOpen(true);
                              }}
                              className="inline-flex items-center gap-1 text-[11px] font-bold text-blue-700 bg-blue-50 hover:bg-blue-100 px-2.5 py-1 rounded-lg border border-blue-200 transition cursor-pointer"
                              title="সদস্য প্রোফাইল ও আইডি কার্ড"
                            >
                              <UserCheck className="w-3.5 h-3.5 text-blue-600" />
                              <span>প্রোফাইল</span>
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </>
        )}

        {/* TAB 3: OFFICIAL RESOLUTION & DOCUMENT OVERVIEW */}
        {activeTab === 'resolution' && (
          <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-10 shadow-sm space-y-8 animate-in fade-in duration-300 max-w-4xl mx-auto">
            <div className="flex flex-col sm:flex-row items-center gap-6 pb-6 border-b border-slate-200">
              <div className="w-24 h-24 rounded-full p-1 bg-gradient-to-tr from-amber-500 to-amber-300 shadow-md shrink-0">
                <img
                  src={images?.logo || '/pressclub_official_logo.jpg'}
                  alt="উল্লাপাড়া উপজেলা প্রেসক্লাব লোগো"
                  className="w-full h-full object-contain rounded-full bg-white p-1"
                  referrerPolicy="no-referrer"
                />
              </div>
              <div className="text-center sm:text-left space-y-1">
                <span className="text-xs font-bold text-amber-700 uppercase tracking-wider bg-amber-50 px-2.5 py-0.5 rounded-md border border-amber-200">
                  ঐতিহাসিক সাধারণ সভার কার্যবিবরণী
                </span>
                <h3 className="text-2xl font-bold font-serif text-[#0d3b66]">
                  উল্লাপাড়া উপজেলা প্রেসক্লাব ত্রি-বার্ষিক কমিটি গঠন রেজল্যুশন
                </h3>
                <p className="text-xs text-slate-500">
                  তারিখ: ১২ আগস্ট ২০২৪ ইং • স্থান: উল্লাপাড়া উপজেলা প্রেসক্লাব মিলনায়তন
                </p>
              </div>
            </div>

            {/* Resolution Text */}
            <div className="space-y-4 text-sm text-slate-700 leading-relaxed bg-slate-50 p-6 rounded-2xl border border-slate-200">
              <p>
                <strong>সভা আহ্বান ও সিদ্ধান্ত:</strong> ১২ আগস্ট ২০২৪ ইং তারিখে উল্লাপাড়া উপজেলা প্রেসক্লাব মিলনায়তনে ক্লাবের সভাপতি মোঃ আনিছুর রহমান (লিটন)-এর সভাপতিত্বে এবং সাধারণ সম্পাদক মোঃ ময়нул হোসাইন-এর পরিচালনায় ক্লাবের এক বিশেষ সাধারণ সভা অনুষ্ঠিত হয়।
              </p>
              <p>
                সভায় উপস্থিত সকল সম্মানিত সদস্যগণের সুচিন্তিত মতামত ও সর্বসম্মত সম্মতিক্রমে ২০২৪-২০২৭ মেয়াদের জন্য কার্যনির্বাহী পরিষদ (তালিকা ১) এবং সাধারণ পরিষদ সদস্যবৃন্দ (তালিকা ২) সম্বলিত পুর্ণাঙ্গ কমিটি আনুষ্ঠানিকভাবে অনুমোদন লাভ করে।
              </p>
              <div className="grid sm:grid-cols-2 gap-4 pt-4 border-t border-slate-200">
                <div className="bg-white p-4 rounded-xl border border-amber-200">
                  <h4 className="font-bold text-[#0d3b66] text-xs uppercase mb-1">তালিকা ১: কার্যনির্বাহী পরিষদ</h4>
                  <p className="text-xs text-slate-600">মোট ১০ জন কর্মকর্তা দায়িত্বপ্রাপ্ত (সভাপতি, সহ-সভাপতি, সাধারণ সম্পাদক, যুগ্ম-সাধারণ সম্পাদক, অর্থ সম্পাদক, দপ্তর ও প্রচার সম্পাদক এবং নির্বাহী সদস্যবৃন্দ)।</p>
                </div>
                <div className="bg-white p-4 rounded-xl border border-blue-200">
                  <h4 className="font-bold text-[#0d3b66] text-xs uppercase mb-1">তালিকা ২: সাধারণ পরিষদ সদস্যবৃন্দ</h4>
                  <p className="text-xs text-slate-600">মোট ৯ জন সক্রিয় সাংবাদিক সদস্য উল্লাপাড়া প্রেসক্লাবকে প্রতিনিধিত্ব করছেন।</p>
                </div>
              </div>
            </div>

            {/* Official Signatures Box */}
            <div className="pt-6 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-6">
              <div className="text-center sm:text-left">
                <div className="font-serif font-bold text-[#0d3b66] text-base">মোঃ ময়нул হোসাইন</div>
                <div className="text-xs text-slate-500">সাধারণ সম্পাদক, উল্লাপাড়া উপজেলা প্রেসক্লাব</div>
                <div className="text-[11px] text-amber-700 font-medium">প্রতিনিধি: মাইটিভি / দৈনিক জনকণ্ঠ</div>
              </div>

              <div className="w-16 h-16 rounded-full border border-amber-300 bg-amber-50 flex items-center justify-center text-center p-1">
                <span className="text-[9px] font-bold text-amber-900 uppercase">প্রেসক্লাব সীলমোহর</span>
              </div>

              <div className="text-center sm:text-right">
                <div className="font-serif font-bold text-[#0d3b66] text-base">মোঃ আনিছুর রহমান (লিটন)</div>
                <div className="text-xs text-slate-500">সভাপতি, উল্লাপাড়া উপজেলা প্রেসক্লাব</div>
                <div className="text-[11px] text-amber-700 font-medium">প্রতিনিধি: দৈনিক ইত্তেফাক / নিউ নেশন</div>
              </div>
            </div>
          </div>
        )}

        {/* Member Management & Edit Modal */}
        {isEditModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
            <div className="bg-white w-full max-w-4xl rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]">
              
              {/* Modal Header */}
              <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-[#0d3b66] text-white">
                <div className="flex items-center gap-2">
                  <Edit className="w-5 h-5 text-amber-400" />
                  <div>
                    <h3 className="font-bold text-base font-serif">
                      কমিটির সদস্য তালিকা ও তথ্য সম্পাদনা
                    </h3>
                    <p className="text-[11px] text-blue-200">
                      সদস্যদের নাম, পদবী, গণমাধ্যম, ফোন নম্বর ও তালিকা পরিবর্তন করুন
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => setIsEditModalOpen(false)}
                  className="p-1 text-white/70 hover:text-white rounded-lg hover:bg-white/10 transition"
                  aria-label="Close"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Modal Body */}
              <div className="p-6 overflow-y-auto space-y-6 flex-1">
                
                {/* Add New Member Mini-Form */}
                <div className="bg-amber-50/60 border border-amber-200 rounded-xl p-4">
                  <h4 className="font-bold text-xs text-[#0d3b66] uppercase tracking-wider mb-3 flex items-center gap-1.5">
                    <Plus className="w-4 h-4 text-amber-700" />
                    নতুন সদস্য যুক্ত করুন
                  </h4>
                  <form onSubmit={handleAddNewMember} className="grid sm:grid-cols-2 md:grid-cols-6 gap-2.5">
                    <input
                      type="text"
                      placeholder="সদস্যের নাম *"
                      value={newMember.name}
                      onChange={(e) => setNewMember({ ...newMember, name: e.target.value })}
                      className="text-xs bg-white border border-slate-300 rounded-lg px-2.5 py-2"
                      required
                    />
                    <input
                      type="text"
                      placeholder="পদবী *"
                      value={newMember.designation}
                      onChange={(e) => setNewMember({ ...newMember, designation: e.target.value })}
                      className="text-xs bg-white border border-slate-300 rounded-lg px-2.5 py-2"
                      required
                    />
                    <input
                      type="text"
                      placeholder="গণমাধ্যমের নাম"
                      value={newMember.media}
                      onChange={(e) => setNewMember({ ...newMember, media: e.target.value })}
                      className="text-xs bg-white border border-slate-300 rounded-lg px-2.5 py-2"
                    />
                    <input
                      type="text"
                      placeholder="মোবাইল নম্বর"
                      value={newMember.phone}
                      onChange={(e) => setNewMember({ ...newMember, phone: e.target.value })}
                      className="text-xs bg-white border border-slate-300 rounded-lg px-2.5 py-2"
                    />
                    <select
                      value={newMember.listType}
                      onChange={(e) => setNewMember({ ...newMember, listType: e.target.value as any })}
                      className="text-xs bg-white border border-slate-300 rounded-lg px-2.5 py-2 font-medium"
                    >
                      <option value="list1_executive">তালিকা ১ (কার্যনির্বাহী)</option>
                      <option value="list2_general">তালিকা ২ (সাধারণ পরিষদ)</option>
                    </select>
                    <button
                      type="submit"
                      className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs py-2 px-3 rounded-lg transition shadow-xs flex items-center justify-center gap-1"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      যোগ করুন
                    </button>
                  </form>
                </div>

                {/* Existing Members Edit List */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-xs text-slate-500 pb-1 border-b border-slate-100">
                    <span className="font-bold">সদস্য তালিকা ({editingMembers.length} জন):</span>
                    <button
                      type="button"
                      onClick={handleResetToDefault}
                      className="text-amber-700 hover:text-amber-800 font-semibold flex items-center gap-1 text-[11px]"
                    >
                      <RotateCcw className="w-3 h-3" />
                      অফিশিয়াল সংশোধিত তালিকায় রিসেট করুন
                    </button>
                  </div>

                  <div className="space-y-3">
                    {editingMembers.map((m, index) => (
                      <div 
                        key={m.id} 
                        className="bg-slate-50 border border-slate-200 rounded-xl p-3 flex flex-col md:flex-row items-stretch md:items-center gap-2.5"
                      >
                        <div className="flex items-center gap-2 md:w-1/4">
                          <span className="text-xs font-mono font-bold text-slate-400 w-5">
                            {index + 1}.
                          </span>
                          <input
                            type="text"
                            value={m.name}
                            onChange={(e) => handleUpdateMemberField(index, 'name', e.target.value)}
                            className="text-xs font-bold bg-white border border-slate-300 rounded-lg px-2 py-1.5 w-full"
                            placeholder="সদস্যের নাম"
                          />
                        </div>

                        <div className="md:w-1/5">
                          <input
                            type="text"
                            value={m.designation}
                            onChange={(e) => handleUpdateMemberField(index, 'designation', e.target.value)}
                            className="text-xs bg-white border border-slate-300 rounded-lg px-2 py-1.5 w-full"
                            placeholder="পদবী"
                          />
                        </div>

                        <div className="md:w-1/5">
                          <input
                            type="text"
                            value={m.media}
                            onChange={(e) => handleUpdateMemberField(index, 'media', e.target.value)}
                            className="text-xs bg-white border border-slate-300 rounded-lg px-2 py-1.5 w-full"
                            placeholder="গণমাধ্যম"
                          />
                        </div>

                        <div className="md:w-1/6">
                          <input
                            type="text"
                            value={m.phone}
                            onChange={(e) => handleUpdateMemberField(index, 'phone', e.target.value)}
                            className="text-xs bg-white border border-slate-300 rounded-lg px-2 py-1.5 w-full font-mono"
                            placeholder="ফোন"
                          />
                        </div>

                        <div className="md:w-1/6">
                          <select
                            value={m.listType || 'list1_executive'}
                            onChange={(e) => handleUpdateMemberField(index, 'listType', e.target.value as any)}
                            className="text-xs bg-white border border-slate-300 rounded-lg px-2 py-1.5 w-full"
                          >
                            <option value="list1_executive">তালিকা ১</option>
                            <option value="list2_general">তালিকা ২</option>
                          </select>
                        </div>

                        <button
                          type="button"
                          onClick={() => handleDeleteMember(m.id)}
                          className="p-2 text-rose-600 hover:bg-rose-50 rounded-lg transition self-end md:self-center"
                          title="সদস্য মুছে ফেলুন"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

              </div>

              {/* Modal Footer */}
              <div className="px-6 py-4 border-t border-slate-200 bg-slate-50 flex items-center justify-between">
                <span className="text-xs text-slate-500">
                  পরিবর্তনগুলো ব্রাউজারে সংরক্ষিত থাকবে
                </span>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setIsEditModalOpen(false)}
                    className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 border border-slate-300 rounded-lg hover:bg-white transition"
                  >
                    বাতিল
                  </button>

                  <button
                    type="button"
                    onClick={handleSaveAll}
                    className="px-5 py-2 text-xs font-bold text-white bg-[#0d3b66] hover:bg-slate-800 rounded-lg shadow-xs flex items-center gap-1.5 transition"
                  >
                    {saveSuccessMsg ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                        সংরক্ষিত হয়েছে!
                      </>
                    ) : (
                      <>
                        <Check className="w-3.5 h-3.5" />
                        পরিবর্তন সংরক্ষণ করুন
                      </>
                    )}
                  </button>
                </div>
              </div>

            </div>
          </div>
        )}

      </div>
    </section>
  );
}
