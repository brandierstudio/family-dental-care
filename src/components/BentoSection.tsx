import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Sparkles,
  ArrowUpRight,
  ChevronLeft,
  ChevronRight,
  Send,
  Layers,
  ShieldCheck,
  Smile,
  CheckCircle2,
  Clock,
  MapPin,
  Award,
  X,
} from 'lucide-react';
import {
  BEFORE_AFTER_CASES,
  CLINIC_INFO,
  CategoryId,
  TREATMENT_CHIPS,
  TreatmentId,
  TreatmentOption,
} from '../constants/dentalData';
import {
  bringCategoryToFront,
  generateConciergeReply,
  getOrderedCategories,
  getProgressSegmentForTreatment,
} from '../utils/dentalLogic';

interface BentoSectionProps {
  selectedTreatment: TreatmentOption;
  onSelectTreatment: (id: TreatmentId) => void;
  selectedLocation: string;
  selectedDate: string;
  isSidebarCollapsed: boolean;
  onToggleSidebar: () => void;
  onOpenBookingModal: () => void;
  onOpenGalleryModal: (initialCaseId?: string) => void;
  conciergeInputRef: React.RefObject<HTMLInputElement | null>;
}

export const BentoSection: React.FC<BentoSectionProps> = ({
  selectedTreatment,
  onSelectTreatment,
  selectedLocation,
  selectedDate,
  isSidebarCollapsed,
  onToggleSidebar,
  onOpenBookingModal,
  onOpenGalleryModal,
  conciergeInputRef,
}) => {
  // Concierge state
  const [query, setQuery] = useState('');
  const [conciergeReply, setConciergeReply] = useState<{
    replyText: string;
    suggestedTreatment: TreatmentId;
    estimatedPrice: string;
    recommendedSlot: string;
  } | null>(null);

  // D. Right Column Middle: 3 stacked overlapping category cards (back to front)
  const [categoryOrder, setCategoryOrder] = useState<CategoryId[]>([
    'Orthodontic',
    'Cosmetic',
    'Surgical',
  ]);
  const [isStackHovered, setIsStackHovered] = useState(false);

  // E. Right Column Bottom: fanned before/after cards hover state
  const [isFanHovered, setIsFanHovered] = useState(false);

  const activeProgressStage = getProgressSegmentForTreatment(selectedTreatment.id);
  const orderedCategories = getOrderedCategories(categoryOrder);

  const handleConciergeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    const result = generateConciergeReply(
      query,
      selectedTreatment.id,
      selectedLocation,
      selectedDate
    );
    setConciergeReply(result);
    if (result.suggestedTreatment !== selectedTreatment.id) {
      onSelectTreatment(result.suggestedTreatment);
    }
  };

  const handleCategoryCardClick = (catId: CategoryId, defaultTreatment: TreatmentId) => {
    setCategoryOrder((prev) => bringCategoryToFront(prev, catId));
    onSelectTreatment(defaultTreatment);
  };

  return (
    <section
      id="bento-studio"
      aria-label="Clinical treatments and services showcase"
      className="relative w-full min-h-screen px-4 sm:px-8 py-10 lg:pl-24 flex flex-col justify-center bg-[#F4F5FA] dark:bg-[#0E1024] text-[#1B1B2F] dark:text-white transition-colors duration-300"
    >
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch max-w-[1600px] mx-auto w-full">
        {/* A. MAIN PANEL (large, 40px radius, clean Light Theme with real clinical photography & realistic data) */}
        <div className="lg:col-span-8 relative rounded-[40px] bg-white dark:bg-[#151836] overflow-hidden min-h-[640px] lg:min-h-[690px] flex flex-col justify-between p-5 sm:p-7 border border-[#1E1750]/10 dark:border-white/10 shadow-[0_24px_60px_rgba(30,23,80,0.08)]">
          {/* Small circular notch/handle on its left edge that collapses/expands the sidebar */}
          <button
            type="button"
            onClick={onToggleSidebar}
            aria-label={
              isSidebarCollapsed
                ? 'Expand left navigation sidebar'
                : 'Collapse left navigation sidebar'
            }
            title={isSidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            className="hidden lg:flex absolute left-2.5 top-1/2 -translate-y-1/2 z-30 w-8 h-14 rounded-full bg-[#F6F7FC] dark:bg-[#1E1750] shadow-md border border-[#1E1750]/12 dark:border-white/15 items-center justify-center text-[#1E1750] dark:text-white hover:scale-105 transition-transform cursor-pointer"
          >
            {isSidebarCollapsed ? (
              <ChevronRight className="w-4 h-4" />
            ) : (
              <ChevronLeft className="w-4 h-4" />
            )}
          </button>

          {/* TOP AREA: Real Clinical Photography + Realistic Treatment Data & Pricing */}
          <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-stretch">
            {/* Left/Main Photo Showcase inside Main Panel */}
            <div className="xl:col-span-5 relative rounded-[28px] overflow-hidden bg-[#EEF0F8] dark:bg-[#1E1A44] min-h-[250px] sm:min-h-[300px] border border-[#1E1750]/8">
              <AnimatePresence mode="wait">
                <motion.img
                  key={`photo-${selectedTreatment.id}`}
                  src={selectedTreatment.imageUrl}
                  alt={selectedTreatment.imageAlt}
                  initial={{ opacity: 0, scale: 1.03 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.35 }}
                  className="w-full h-full object-cover"
                  loading="eager"
                />
              </AnimatePresence>

              {/* Subtle Bottom Location & Rating Badge over Photo */}
              <div className="absolute inset-x-3 bottom-3 rounded-2xl bg-white/95 dark:bg-[#14132B]/92 px-3.5 py-2.5 shadow-md border border-[#1E1750]/10 flex items-center justify-between gap-2">
                <div className="flex items-center gap-1.5 text-[11px] font-medium text-[#1E1750] dark:text-white truncate">
                  <MapPin className="w-3.5 h-3.5 text-[#F28B5B] shrink-0" />
                  <span className="truncate">{CLINIC_INFO.shortAddress}</span>
                </div>
                <span className="text-[11px] font-semibold text-[#1E1750] dark:text-[#5CD6C0] bg-[#5CD6C0]/20 px-2 py-0.5 rounded-full shrink-0">
                  4.9 ★
                </span>
              </div>
            </div>

            {/* Right Clinical Details & Realistic Clinic Data */}
            <div className="xl:col-span-7 flex flex-col justify-between gap-4">
              <motion.div
                key={`info-${selectedTreatment.id}`}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.28 }}
                className="space-y-3"
              >
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-[#1E1750]/8 dark:bg-white/10 px-3 py-1 text-xs font-medium text-[#1E1750] dark:text-[#5CD6C0]">
                    {selectedTreatment.category} Department · {CLINIC_INFO.name}
                  </span>
                  <span className="text-xs font-medium text-[#1B1B2F]/60 dark:text-white/60 flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-[#F28B5B]" />
                    {CLINIC_INFO.hours}
                  </span>
                </div>

                <h2
                  className="font-display font-medium text-2xl sm:text-3xl text-[#1E1750] dark:text-white tracking-tight"
                  data-testid="bento-main-title"
                >
                  {selectedTreatment.suiteTitle}
                </h2>

                <p className="text-xs sm:text-sm text-[#1B1B2F]/75 dark:text-white/75 leading-relaxed">
                  {selectedTreatment.description}
                </p>

                {/* 3 Realistic Clinical Highlights */}
                <div className="pt-1 grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                  {selectedTreatment.clinicalHighlights.map((highlight) => (
                    <div
                      key={highlight}
                      className="rounded-2xl bg-[#F6F7FC] dark:bg-white/5 p-3 border border-[#1E1750]/8 dark:border-white/10 flex items-start gap-2 text-xs text-[#1B1B2F]/85 dark:text-white/85 leading-snug"
                    >
                      <CheckCircle2 className="w-4 h-4 text-[#5CD6C0] shrink-0 mt-0.5" />
                      <span>{highlight}</span>
                    </div>
                  ))}
                </div>
              </motion.div>

              {/* Realistic Pricing, Recovery & Direct Booking Bar */}
              <div className="rounded-[24px] bg-[#F6F7FC] dark:bg-[#1E1A44] p-4 border border-[#1E1750]/10 dark:border-white/12 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex flex-wrap items-center gap-2 text-[11px] text-[#1B1B2F]/60 dark:text-white/60">
                    <span>Estimated Clinic Fee ({selectedTreatment.visitsCount})</span>
                    <span>·</span>
                    <span className="inline-flex items-center gap-1 text-[#1E1750] dark:text-[#5CD6C0] font-medium">
                      <Award className="w-3 h-3" />
                      {selectedTreatment.warrantyNote}
                    </span>
                  </div>
                  <div className="font-display font-semibold text-lg sm:text-xl text-[#1E1750] dark:text-white tabular-nums">
                    {selectedTreatment.priceEstimate}
                  </div>
                  <div className="text-[11px] text-[#1B1B2F]/70 dark:text-white/70">
                    {selectedTreatment.leadDoctor} · {selectedTreatment.recoveryTime}
                  </div>
                </div>

                <button
                  type="button"
                  onClick={onOpenBookingModal}
                  className="rounded-full bg-[#1E1750] text-white py-3 px-5 text-xs font-medium flex items-center justify-center gap-2 hover:bg-[#2A216B] transition-colors shrink-0 cursor-pointer shadow-sm"
                >
                  <span>Book {selectedTreatment.name}</span>
                  <ArrowUpRight className="w-4 h-4 text-[#F28B5B]" />
                </button>
              </div>
            </div>
          </div>

          {/* BOTTOM ROW INSIDE MAIN PANEL: Bottom-Left Pill AI Input Bar + B. Bottom-Middle Treatment Selector Card */}
          <div className="relative z-10 mt-6 pt-5 border-t border-[#1E1750]/8 dark:border-white/10 grid grid-cols-1 xl:grid-cols-12 gap-5 items-end">
            {/* BOTTOM-LEFT INSIDE MAIN PANEL: Pill AI Input Bar + Reply Bubble */}
            <div className="xl:col-span-6 flex flex-col gap-3">
              <AnimatePresence>
                {conciergeReply && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.98 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 8, scale: 0.98 }}
                    data-testid="concierge-reply-bubble"
                    className="rounded-[24px] bg-[#F6F7FC] dark:bg-[#1E1A44] p-4 shadow-md border border-[#1E1750]/15 dark:border-[#5CD6C0]/40 text-xs leading-relaxed"
                  >
                    <div className="flex items-center justify-between gap-2 mb-1.5">
                      <span className="font-semibold text-[#1E1750] dark:text-[#5CD6C0] flex items-center gap-1.5">
                        <Sparkles className="w-3.5 h-3.5 text-[#F28B5B]" />
                        Family Dental Care Reception · Karachi
                      </span>
                      <button
                        type="button"
                        onClick={() => setConciergeReply(null)}
                        aria-label="Dismiss reception reply"
                        className="p-1 rounded-full hover:bg-black/5 dark:hover:bg-white/10 cursor-pointer"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                    <p className="text-[#1B1B2F]/85 dark:text-white/85">
                      {conciergeReply.replyText}
                    </p>
                    <div className="mt-2.5 pt-2 border-t border-[#1B1B2F]/10 dark:border-white/10 flex items-center justify-between gap-2">
                      <span className="text-[11px] font-medium text-[#1B1B2F]/65 dark:text-white/65">
                        Available Slot: {conciergeReply.recommendedSlot}
                      </span>
                      <button
                        type="button"
                        onClick={onOpenBookingModal}
                        className="text-[11px] font-semibold text-[#1E1750] dark:text-[#5CD6C0] underline cursor-pointer"
                      >
                        Book this slot
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Quick suggestion prompts */}
              <div className="flex flex-wrap items-center gap-1.5">
                {[
                  'Implant price in PKR?',
                  'Where on Jamshed Road?',
                  'Book whitening tonight',
                ].map((sample) => (
                  <button
                    key={sample}
                    type="button"
                    onClick={() => {
                      setQuery(sample);
                      const res = generateConciergeReply(
                        sample,
                        selectedTreatment.id,
                        selectedLocation,
                        selectedDate
                      );
                      setConciergeReply(res);
                      if (res.suggestedTreatment !== selectedTreatment.id) {
                        onSelectTreatment(res.suggestedTreatment);
                      }
                    }}
                    className="text-[11px] px-3 py-1 rounded-full bg-[#F6F7FC] hover:bg-[#EAECEF] dark:bg-white/10 dark:hover:bg-white/15 text-[#1E1750] dark:text-white border border-[#1E1750]/12 dark:border-white/15 transition-colors cursor-pointer"
                  >
                    {sample}
                  </button>
                ))}
              </div>

              {/* Pill Input Bar */}
              <form
                onSubmit={handleConciergeSubmit}
                className="w-full bg-[#F6F7FC] dark:bg-[#1E1A44] rounded-full p-1.5 pl-4 shadow-sm border border-[#1E1750]/15 dark:border-white/15 flex items-center gap-2"
              >
                <Sparkles className="w-4 h-4 text-[#F28B5B] shrink-0" aria-hidden="true" />
                <label htmlFor="concierge-input" className="sr-only">
                  Ask about treatments, pricing or book a slot
                </label>
                <input
                  id="concierge-input"
                  ref={conciergeInputRef}
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Ask about treatments, pricing or book a slot..."
                  className="w-full bg-transparent text-xs text-[#1B1B2F] dark:text-white placeholder:text-[#1B1B2F]/50 dark:placeholder:text-white/50 focus:outline-none"
                />
                <button
                  type="submit"
                  aria-label="Submit question"
                  className="w-9 h-9 rounded-full bg-[#1E1750] text-white flex items-center justify-center hover:bg-[#2c2270] transition-colors shrink-0 cursor-pointer"
                >
                  <Send className="w-3.5 h-3.5" />
                </button>
              </form>
            </div>

            {/* B. BOTTOM-MIDDLE CARD: Pill title "Choose your treatment", 3-column chip grid (9 chips), 4-segment progress line */}
            <div className="xl:col-span-6 rounded-[28px] bg-[#F6F7FC] dark:bg-[#1E1A44] p-4 sm:p-5 border border-[#1E1750]/10 dark:border-white/15">
              <div className="flex items-center justify-between gap-2 mb-3">
                <span className="inline-block rounded-full bg-white dark:bg-[#14132B] px-3.5 py-1 text-xs font-medium text-[#1E1750] dark:text-white shadow-xs border border-[#1E1750]/10">
                  Choose your treatment
                </span>
                <span className="text-[11px] text-[#1B1B2F]/70 dark:text-white/75 font-medium tabular-nums">
                  {selectedTreatment.durationPerVisit}
                </span>
              </div>

              {/* 3-Column Chip Grid on desktop, horizontal scroll on mobile */}
              <div
                role="radiogroup"
                aria-label="Choose your treatment"
                className="flex sm:grid sm:grid-cols-3 gap-2 overflow-x-auto no-scrollbar pb-1 sm:pb-0"
              >
                {TREATMENT_CHIPS.map((chipName) => {
                  const isSelected = selectedTreatment.id === chipName;
                  return (
                    <button
                      key={chipName}
                      type="button"
                      role="radio"
                      aria-checked={isSelected}
                      onClick={() => onSelectTreatment(chipName)}
                      className={`px-3 py-2 rounded-full text-xs transition-all duration-200 whitespace-nowrap shrink-0 cursor-pointer text-center ${
                        isSelected
                          ? 'bg-[#1E1750] text-white font-semibold shadow-sm'
                          : 'bg-white dark:bg-white/5 border border-[#1E1750]/15 dark:border-white/20 text-[#1B1B2F] dark:text-white hover:bg-[#1E1750]/5 font-normal'
                      }`}
                    >
                      {chipName}
                    </button>
                  );
                })}
              </div>

              {/* Thin 4-segment progress line under the chips */}
              <div
                className="mt-4 grid grid-cols-4 gap-2"
                aria-label={`Clinical pathway stage ${activeProgressStage} of 4`}
              >
                {[1, 2, 3, 4].map((segment) => {
                  const active = segment <= activeProgressStage;
                  return (
                    <div
                      key={segment}
                      className={`h-1.5 rounded-full transition-all duration-300 ${
                        active
                          ? segment === activeProgressStage
                            ? 'bg-[#5CD6C0]'
                            : 'bg-[#1E1750] dark:bg-white'
                          : 'bg-[#1E1750]/12 dark:bg-white/20'
                      }`}
                    />
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN (spans 4 cols on desktop): C (Top), D (Middle), E (Bottom) in clean Light Theme */}
        <div className="lg:col-span-4 flex flex-col justify-between gap-5">
          {/* C. RIGHT COLUMN TOP: Slim pill bar showing the selected treatment name */}
          <div className="rounded-full bg-white dark:bg-[#151836] px-5 py-3.5 border border-[#1E1750]/10 dark:border-white/10 shadow-[0_12px_30px_rgba(30,23,80,0.06)] flex items-center justify-between gap-3">
            <div className="flex items-center gap-2.5 min-w-0">
              <span
                className="w-2.5 h-2.5 rounded-full shrink-0"
                style={{ backgroundColor: selectedTreatment.accentHue }}
              />
              <span className="text-xs text-[#1B1B2F]/60 dark:text-white/60 shrink-0">
                Selected Service:
              </span>
              <span
                className="font-display font-medium text-sm text-[#1E1750] dark:text-white truncate"
                data-testid="right-top-treatment-pill"
              >
                {selectedTreatment.name}
              </span>
            </div>
            <span className="text-[11px] font-medium text-[#1B1B2F]/70 dark:text-white/70 whitespace-nowrap">
              {selectedTreatment.visitsCount}
            </span>
          </div>

          {/* D. RIGHT COLUMN MIDDLE: Three stacked, overlapping cards (back to front: darker to lighter) */}
          <div
            className="relative rounded-[28px] bg-white dark:bg-[#151836] p-5 border border-[#1E1750]/10 dark:border-white/10 shadow-[0_16px_40px_rgba(30,23,80,0.06)] flex flex-col justify-between"
            onMouseEnter={() => setIsStackHovered(true)}
            onMouseLeave={() => setIsStackHovered(false)}
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-medium text-[#1E1750] dark:text-white">
                Clinic Departments
              </span>
              <span className="text-[11px] text-[#1B1B2F]/55 dark:text-white/55">
                Jamshed Rd · Karachi
              </span>
            </div>

            <div className="relative h-[225px] w-full flex items-end justify-center">
              {orderedCategories.map((cat, idx) => {
                // idx 0 = back (darkest), idx 1 = middle, idx 2 = front (lightest)
                const isFront = idx === 2;
                const yOffset = isStackHovered
                  ? (2 - idx) * -66
                  : (2 - idx) * -52;
                const scale = 1 - (2 - idx) * 0.035;

                const surfaceClasses =
                  idx === 0
                    ? 'bg-[#1E1750] text-white border-white/15'
                    : idx === 1
                    ? 'bg-[#383078] text-white border-white/25'
                    : 'bg-[#F6F7FC] dark:bg-[#221E52] text-[#1B1B2F] dark:text-white border-[#1E1750]/12 dark:border-white/20';

                const IconComponent =
                  cat.id === 'Cosmetic'
                    ? Smile
                    : cat.id === 'Orthodontic'
                    ? Layers
                    : ShieldCheck;

                return (
                  <motion.button
                    key={cat.id}
                    type="button"
                    layout
                    onClick={() => handleCategoryCardClick(cat.id, cat.treatments[0])}
                    animate={{
                      y: yOffset,
                      scale,
                      zIndex: idx + 1,
                    }}
                    transition={{ type: 'spring', stiffness: 320, damping: 26 }}
                    aria-label={`${cat.title} department — ${cat.subtitle}`}
                    className={`absolute inset-x-0 bottom-0 rounded-[24px] p-4 border shadow-md text-left flex items-center justify-between gap-3 cursor-pointer ${surfaceClasses}`}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      {/* Small pill icon on the left */}
                      <span
                        className={`px-3 py-2 rounded-full flex items-center justify-center shrink-0 ${
                          isFront
                            ? 'bg-[#1E1750] text-white'
                            : 'bg-white/15 text-[#5CD6C0]'
                        }`}
                      >
                        <IconComponent className="w-4 h-4" />
                      </span>
                      <div className="min-w-0">
                        <div className="font-display font-medium text-base truncate">
                          {cat.title}
                        </div>
                        <div
                          className={`text-xs truncate ${
                            isFront
                              ? 'text-[#1B1B2F]/65 dark:text-white/65'
                              : 'text-white/75'
                          }`}
                        >
                          {cat.subtitle}
                        </div>
                      </div>
                    </div>

                    <div className="text-right shrink-0">
                      <div
                        className={`text-[11px] font-medium tabular-nums ${
                          isFront ? 'text-[#1E1750] dark:text-[#5CD6C0]' : 'text-[#5CD6C0]'
                        }`}
                      >
                        {cat.completionRate}
                      </div>
                      <div
                        className={`text-[10px] ${
                          isFront
                            ? 'text-[#1B1B2F]/55 dark:text-white/55'
                            : 'text-white/65'
                        }`}
                      >
                        {cat.specialistLead}
                      </div>
                    </div>
                  </motion.button>
                );
              })}
            </div>
          </div>

          {/* E. RIGHT COLUMN BOTTOM: Fanned before/after photo cards (4 cards with real dental photography) + round "view all" button top-right */}
          <div
            className="rounded-[28px] bg-white dark:bg-[#151836] p-5 border border-[#1E1750]/10 dark:border-white/10 shadow-[0_16px_40px_rgba(30,23,80,0.06)] flex flex-col justify-between overflow-hidden"
            onMouseEnter={() => setIsFanHovered(true)}
            onMouseLeave={() => setIsFanHovered(false)}
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <h3 className="font-display font-medium text-base text-[#1E1750] dark:text-white">
                  Before &amp; After Cases
                </h3>
                <p className="text-xs text-[#1B1B2F]/60 dark:text-white/60">
                  Real patient smile results · Jamshed Rd
                </p>
              </div>

              <button
                type="button"
                onClick={() => onOpenGalleryModal()}
                aria-label="View all before and after smile cases"
                className="group w-10 h-10 rounded-full bg-[#F6F7FC] dark:bg-white/10 border border-[#1E1750]/10 flex items-center justify-center text-[#1E1750] dark:text-white hover:bg-[#1E1750] hover:text-white transition-colors cursor-pointer shrink-0"
              >
                <ArrowUpRight className="w-4 h-4 transition-transform duration-200 group-hover:rotate-45" />
              </button>
            </div>

            {/* 4 Fanned Before/After Photo Cards */}
            <div className="relative h-44 mt-3 flex items-center justify-center">
              {BEFORE_AFTER_CASES.map((item, index) => {
                const spreadMultiplier = isFanHovered ? 1.55 : 1;
                const rotate = item.rotationDeg * spreadMultiplier;
                const x = item.offsetX * spreadMultiplier;
                const y = isFanHovered ? item.offsetY - 6 : item.offsetY;

                return (
                  <motion.button
                    key={item.id}
                    type="button"
                    onClick={() => onOpenGalleryModal(item.id)}
                    animate={{ rotate, x, y }}
                    whileHover={{ scale: 1.07, zIndex: 20 }}
                    transition={{ type: 'spring', stiffness: 300, damping: 22 }}
                    style={{ zIndex: index + 1 }}
                    aria-label={`Inspect ${item.patientName} ${item.treatment} result`}
                    className="absolute w-32 h-36 rounded-2xl bg-white dark:bg-[#1E1A44] p-2 shadow-lg border border-[#1E1750]/12 dark:border-white/15 flex flex-col justify-between text-left cursor-pointer"
                  >
                    {/* Real Clinical Case Photograph */}
                    <div className="w-full h-20 rounded-xl overflow-hidden relative bg-[#EEF0F8]">
                      <img
                        src={item.imageUrl}
                        alt={`${item.patientName} ${item.treatment}`}
                        className="w-full h-full object-cover"
                        loading="lazy"
                      />
                      <span className="absolute top-1.5 left-1.5 rounded-md bg-[#1E1750]/85 text-white text-[9px] font-medium px-1.5 py-0.5">
                        {item.treatment}
                      </span>
                    </div>

                    <div className="px-0.5">
                      <div className="text-[11px] font-semibold text-[#1B1B2F] dark:text-white truncate">
                        {item.patientName}
                      </div>
                      <div className="text-[9px] text-[#1B1B2F]/60 dark:text-white/60 truncate">
                        {item.shadeImprovement}
                      </div>
                    </div>
                  </motion.button>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
