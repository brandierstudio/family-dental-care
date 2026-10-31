/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import {
  CLINIC_LOCATIONS,
  PREFERRED_DATES,
  TreatmentId,
} from './constants/dentalData';
import { getTreatmentById } from './utils/dentalLogic';
import { ClinicArchitectureScene } from './components/ClinicArchitectureScene';
import { TopBar } from './components/TopBar';
import { FloatingNav, ActiveNavTab } from './components/FloatingNav';
import { HeroCards } from './components/HeroCards';
import { BentoSection } from './components/BentoSection';
import { BookingModal, CallModal, GalleryModal } from './components/Modals';

export default function App() {
  // Filter & Treatment State (Defaulting to Implants — flagship specialty of Family Dental Care Karachi)
  const [selectedLocation, setSelectedLocation] = useState<string>(
    CLINIC_LOCATIONS[0].name
  );
  const [selectedTreatmentId, setSelectedTreatmentId] =
    useState<TreatmentId>('Implants');
  const [selectedDate, setSelectedDate] = useState<string>(PREFERRED_DATES[0]);

  // Navigation & Theme State
  const [activeTab, setActiveTab] = useState<ActiveNavTab>('home');
  const [isDark, setIsDark] = useState<boolean>(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState<boolean>(false);

  // Modals State
  const [bookingModalOpen, setBookingModalOpen] = useState<boolean>(false);
  const [callModalOpen, setCallModalOpen] = useState<boolean>(false);
  const [galleryModalState, setGalleryModalState] = useState<{
    open: boolean;
    caseId?: string;
  }>({ open: false });

  const heroSectionRef = useRef<HTMLDivElement>(null);
  const bentoSectionRef = useRef<HTMLDivElement>(null);
  const conciergeInputRef = useRef<HTMLInputElement>(null);

  const activeTreatment = getTreatmentById(selectedTreatmentId);

  // Sync dark mode class on <html>
  useEffect(() => {
    const root = document.documentElement;
    if (isDark) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [isDark]);

  // Update active nav icon based on scroll position
  useEffect(() => {
    const handleScroll = () => {
      if (!bentoSectionRef.current) return;
      const rect = bentoSectionRef.current.getBoundingClientRect();
      if (rect.top <= window.innerHeight * 0.45) {
        setActiveTab((prev) =>
          prev === 'chat' || prev === 'search' ? prev : 'services'
        );
      } else {
        setActiveTab('home');
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleSelectNavTab = (tab: ActiveNavTab) => {
    setActiveTab(tab);
    if (tab === 'home') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else if (tab === 'services') {
      bentoSectionRef.current?.scrollIntoView({ behavior: 'smooth' });
    } else if (tab === 'search' || tab === 'chat') {
      bentoSectionRef.current?.scrollIntoView({ behavior: 'smooth' });
      setTimeout(() => {
        conciergeInputRef.current?.focus();
      }, 450);
    }
  };

  const scrollToBento = () => {
    setActiveTab('services');
    bentoSectionRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="relative min-h-screen w-full overflow-x-hidden bg-[#13112B] dark:bg-[#090A18] pb-16 lg:pb-0">
      {/* FIXED LEFT FLOATING NAV (Edge-aligned for full-screen immersion) */}
      <FloatingNav
        activeTab={activeTab}
        onSelectTab={handleSelectNavTab}
        isDark={isDark}
        onToggleTheme={setIsDark}
        isCollapsed={isSidebarCollapsed}
        onExpandSidebar={() => setIsSidebarCollapsed(false)}
        onOpenBookingModal={() => setBookingModalOpen(true)}
      />

      {/* FULL-SCREEN IMMERSIVE VIEWPORT (Zero outer border or screenshot padding) */}
      <main className="relative w-full min-h-screen overflow-hidden">
        {/* SECTION 1 — FULL-SCREEN 3D HERO */}
        <div
          ref={heroSectionRef}
          className="relative w-full lg:h-screen lg:min-h-[760px] overflow-hidden bg-[#13112B]"
        >
          {/* 1. TOP BAR */}
          <TopBar
            selectedLocation={selectedLocation}
            onSelectLocation={setSelectedLocation}
            selectedTreatment={selectedTreatmentId}
            onSelectTreatment={setSelectedTreatmentId}
            selectedDate={selectedDate}
            onSelectDate={setSelectedDate}
            onOpenBookingModal={() => setBookingModalOpen(true)}
            onOpenCallModal={() => setCallModalOpen(true)}
          />

          {/* 3. HEADLINE + REAL-TIME THREE.JS 3D DENTAL PAVILION & IMPLANT SCENE */}
          <ClinicArchitectureScene selectedTreatment={selectedTreatmentId} />

          {/* 4. INTRO PARAGRAPH + 5. BOTTOM-LEFT CARD + 6. RIGHT GLASS CARD + 7. BRAND BADGE */}
          <HeroCards
            activeTreatment={activeTreatment}
            selectedLocation={selectedLocation}
            onExploreTreatments={scrollToBento}
            onOpenBookingModal={() => setBookingModalOpen(true)}
          />
        </div>

        {/* SECTION 2 — CLEAN LIGHT-THEMED BENTO SERVICES GRID */}
        <div
          ref={bentoSectionRef}
          className="relative w-full bg-[#F4F5FA] dark:bg-[#0E1024] border-t border-[#1E1750]/10"
        >
          <BentoSection
            selectedTreatment={activeTreatment}
            onSelectTreatment={setSelectedTreatmentId}
            selectedLocation={selectedLocation}
            selectedDate={selectedDate}
            isSidebarCollapsed={isSidebarCollapsed}
            onToggleSidebar={() => setIsSidebarCollapsed((prev) => !prev)}
            onOpenBookingModal={() => setBookingModalOpen(true)}
            onOpenGalleryModal={(caseId) =>
              setGalleryModalState({ open: true, caseId })
            }
            conciergeInputRef={conciergeInputRef}
          />
        </div>
      </main>

      {/* INTERACTIVE DIALOG MODALS */}
      <BookingModal
        isOpen={bookingModalOpen}
        onClose={() => setBookingModalOpen(false)}
        selectedLocation={selectedLocation}
        onSelectLocation={setSelectedLocation}
        selectedTreatment={selectedTreatmentId}
        onSelectTreatment={setSelectedTreatmentId}
        selectedDate={selectedDate}
        onSelectDate={setSelectedDate}
      />

      <CallModal
        isOpen={callModalOpen}
        onClose={() => setCallModalOpen(false)}
      />

      <GalleryModal
        isOpen={galleryModalState.open}
        onClose={() => setGalleryModalState({ open: false })}
        initialCaseId={galleryModalState.caseId}
        onBookTreatment={(t) => {
          setSelectedTreatmentId(t);
          setBookingModalOpen(true);
        }}
      />
    </div>
  );
}
