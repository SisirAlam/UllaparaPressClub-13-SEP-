/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { PressClubProvider, usePressClub } from './context/PressClubContext';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import BentoGridShowcase from './components/BentoGridShowcase';
import GoldenJubilee from './components/GoldenJubilee';
import AboutSection from './components/AboutSection';
import CommitteeSection from './components/CommitteeSection';
import DistinguishedMembersSection from './components/DistinguishedMembersSection';
import NoticeBoard from './components/NoticeBoard';
import EventCalendar from './components/EventCalendar';
import CitizenGrievanceSection from './components/CitizenGrievanceSection';
import GallerySection from './components/GallerySection';
import ContactSection from './components/ContactSection';
import Footer from './components/Footer';
import AdvertisementBanner from './components/AdvertisementBanner';
import AdminPortalModal from './components/AdminPortalModal';
import MembershipRecruitmentModal from './components/MembershipRecruitmentModal';
import MemberDashboardModal from './components/MemberDashboardModal';
import WebsiteExportModal from './components/WebsiteExportModal';
import AndroidAppModal from './components/AndroidAppModal';
import AndroidInstallBanner from './components/AndroidInstallBanner';
import GoogleWorkspaceModal from './components/GoogleWorkspaceModal';
import BreakingNewsToast from './components/BreakingNewsToast';
import { ErrorBoundary } from './components/ErrorBoundary';

function PressClubApp() {
  const { isAndroidModalOpen, setIsAndroidModalOpen } = usePressClub();
  const [activeSection, setActiveSection] = useState<string>('home');

  const scrollToSection = (sectionId: string) => {
    setActiveSection(sectionId);
    const element = document.getElementById(sectionId);
    if (element) {
      const navOffset = 80;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - navOffset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  };

  // Observe which section is currently on screen for active nav styling
  useEffect(() => {
    const handleScroll = () => {
      const sections = ['home', 'jubilee', 'about', 'committee', 'distinguished', 'notices', 'events', 'complaint', 'gallery', 'contact'];
      const scrollPosition = window.scrollY + 200;

      for (const sectionId of sections) {
        const el = document.getElementById(sectionId);
        if (el) {
          const top = el.offsetTop;
          const height = el.offsetHeight;
          if (scrollPosition >= top && scrollPosition < top + height) {
            setActiveSection(sectionId);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-800 selection:bg-amber-500 selection:text-slate-950 font-sans relative">
      {/* Navigation */}
      <Navbar onNavigate={scrollToSection} activeSection={activeSection} />

      {/* Main Content Sections */}
      <main className="flex-grow">
        <Hero onNavigate={scrollToSection} />
        <AdvertisementBanner variant="hero-bottom" />
        <BentoGridShowcase onNavigate={scrollToSection} />
        <GoldenJubilee />
        <AboutSection />
        <CommitteeSection />
        <DistinguishedMembersSection />
        <AdvertisementBanner variant="inline" />
        <NoticeBoard />
        <EventCalendar />
        <CitizenGrievanceSection />
        <GallerySection />
        <ContactSection />
      </main>

      {/* Pre-Footer Responsive Ad Area */}
      <AdvertisementBanner variant="footer-pre" />

      {/* Footer */}
      <Footer onNavigate={scrollToSection} />

      {/* Overlays / Modals */}
      <AdminPortalModal />
      <MemberDashboardModal />
      <MembershipRecruitmentModal />
      <WebsiteExportModal />
      <GoogleWorkspaceModal />
      <AndroidAppModal
        isOpen={isAndroidModalOpen}
        onClose={() => setIsAndroidModalOpen(false)}
      />
      <AndroidInstallBanner onOpenModal={() => setIsAndroidModalOpen(true)} />
      <BreakingNewsToast />
    </div>
  );
}

export default function App() {
  return (
    <ErrorBoundary>
      <PressClubProvider>
        <PressClubApp />
      </PressClubProvider>
    </ErrorBoundary>
  );
}
