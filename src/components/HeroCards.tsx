import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import {
  ArrowUpRight,
  MapPin,
  Clock,
  Star,
  Phone,
  Sparkles,
  Heart,
  Bookmark,
  Share2,
  Check,
} from 'lucide-react';
import {
  CLINIC_INFO,
  HERO_CONTENT,
  PATIENT_AVATARS,
  TreatmentOption,
} from '../constants/dentalData';
import { formatCompactCount, toggleMetricCounter } from '../utils/dentalLogic';

interface HeroCardsProps {
  activeTreatment: TreatmentOption;
  selectedLocation: string;
  onExploreTreatments: () => void;
  onOpenBookingModal: () => void;
}

export const HeroCards: React.FC<HeroCardsProps> = ({
  activeTreatment,
  selectedLocation,
  onExploreTreatments,
  onOpenBookingModal,
}) => {
  const [statCount, setStatCount] = useState(0);
  const [avatarsHovered, setAvatarsHovered] = useState(false);

  const [likeState, setLikeState] = useState({
    count: HERO_CONTENT.rightGlassCard.initialLikes,
    active: false,
  });
  const [bookmarkState, setBookmarkState] = useState({
    count: HERO_CONTENT.rightGlassCard.initialBookmarks,
    active: false,
  });
  const [sharedCopied, setSharedCopied] = useState(false);

  useEffect(() => {
    const durationMs = 1100;
    const target = HERO_CONTENT.bottomLeftCard.statTarget;
    const startTime = performance.now();
    let rafId: number;

    const tick = (now: number) => {
      const progress = Math.min(1, (now - startTime) / durationMs);
      const eased = 1 - Math.pow(1 - progress, 3);
      setStatCount(Math.round(eased * target));
      if (progress < 1) {
        rafId = requestAnimationFrame(tick);
      }
    };

    rafId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId);
  }, []);

  const handleLikeClick = () => {
    setLikeState((prev) => toggleMetricCounter(prev.count, prev.active));
  };

  const handleBookmarkClick = () => {
    setBookmarkState((prev) => toggleMetricCounter(prev.count, prev.active));
  };

  const handleShareClick = () => {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href).catch(() => {});
    }
    setSharedCopied(true);
    setTimeout(() => setSharedCopied(false), 2200);
  };

  return (
    <div className="relative z-30 w-full px-4 sm:px-8 pb-7 -mt-12 sm:-mt-16 lg:mt-0 lg:pt-0 lg:absolute lg:inset-x-0 lg:bottom-0 flex flex-col lg:flex-row lg:items-end justify-between gap-6 pointer-events-none max-w-[1600px] mx-auto">
      {/* LEFT COLUMN: Intro Paragraph (above) + Bottom-Left White Card (below) */}
      <div className="flex flex-col items-start gap-4 pointer-events-auto lg:pl-16">
        {/* 4. INTRO PARAGRAPH */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.65, delay: 0.24, ease: [0.16, 1, 0.3, 1] }}
          className="max-w-[300px] rounded-2xl bg-[#13112B]/80 px-4 py-3 border border-white/15 shadow-lg"
        >
          <p className="text-[12px] leading-[1.6] text-white/90 font-normal">
            {HERO_CONTENT.introParagraph}
          </p>
        </motion.div>

        {/* 5. BOTTOM-LEFT CARD */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.65, delay: 0.32, ease: [0.16, 1, 0.3, 1] }}
          className="relative w-full sm:w-[328px] ceramic-surface rounded-[28px] p-5 shadow-[0_24px_50px_rgba(12,12,38,0.35)] border border-white/80 dark:border-white/10 transition-transform duration-200 hover:-translate-y-1"
        >
          <div className="flex items-center justify-between gap-2">
            <h2 className="font-display font-medium text-lg text-[#1E1750] dark:text-white tracking-tight">
              {HERO_CONTENT.bottomLeftCard.title}
            </h2>
            <span className="text-xs font-semibold text-[#F28B5B] tabular-nums">
              {CLINIC_INFO.rating} ★
            </span>
          </div>

          <p className="mt-1.5 text-xs leading-relaxed text-[#1B1B2F]/70 dark:text-white/70 line-clamp-2">
            {HERO_CONTENT.bottomLeftCard.body}
          </p>

          <div className="mt-4 pt-3 border-t border-[#1B1B2F]/10 dark:border-white/10 flex items-center justify-between gap-2">
            <div>
              <div
                className="font-display font-medium text-[44px] leading-none text-[#1E1750] dark:text-white tabular-nums"
                data-testid="hero-stat-counter"
              >
                {statCount}
                {HERO_CONTENT.bottomLeftCard.statSuffix}
              </div>
              <div className="mt-1 text-[11px] font-medium text-[#1B1B2F]/65 dark:text-white/65">
                {HERO_CONTENT.bottomLeftCard.statCaption}
              </div>
            </div>

            {/* 3 Overlapping Round Avatars + Round Arrow-Up-Right Button */}
            <div className="flex items-center gap-2">
              <div
                className="flex items-center"
                onMouseEnter={() => setAvatarsHovered(true)}
                onMouseLeave={() => setAvatarsHovered(false)}
                aria-label="Verified happy patients at Family Dental Care Karachi"
              >
                {PATIENT_AVATARS.map((avatar, idx) => (
                  <div
                    key={avatar.id}
                    title={`${avatar.name} — ${avatar.role}`}
                    style={{
                      backgroundColor: avatar.bgTint,
                      color: avatar.accentTint,
                      marginLeft: idx === 0 ? 0 : avatarsHovered ? '-4px' : '-10px',
                    }}
                    className="w-9 h-9 rounded-full border-2 border-[#F6F7FC] dark:border-[#171B34] flex items-center justify-center text-[11px] font-display font-semibold shadow-sm transition-all duration-200"
                  >
                    {avatar.initials}
                  </div>
                ))}
              </div>

              <button
                type="button"
                onClick={onExploreTreatments}
                aria-label="Explore 3D dental treatments"
                className="group w-10 h-10 rounded-full bg-[#E9ECF6] dark:bg-white/10 text-[#1B1B2F] dark:text-white flex items-center justify-center hover:bg-[#1E1750] hover:text-white transition-colors cursor-pointer shrink-0"
              >
                <ArrowUpRight className="w-4 h-4 transition-transform duration-200 group-hover:rotate-45" />
              </button>
            </div>
          </div>
        </motion.div>
      </div>

      {/* RIGHT CLUSTER: 7. BRAND BADGE (88px circle overlapping gap) + 6. RIGHT GLASS CARD */}
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.65, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
        className="relative flex flex-col sm:flex-row items-center sm:items-end gap-4 pointer-events-auto"
      >
        {/* 7. BRAND BADGE: 88px circle, indigo #1E1750, 3D specular tooth-mark badge */}
        <button
          type="button"
          onClick={onExploreTreatments}
          aria-label="Family Dental Care Karachi — scroll to 3D treatment studio"
          className="lg:-mr-7 lg:mb-6 z-20 w-[88px] h-[88px] rounded-full bg-[#1E1750] text-white flex flex-col items-center justify-center shadow-[0_20px_45px_rgba(12,10,40,0.6)] ring-8 ring-white/25 dark:ring-white/10 transition-transform duration-300 hover:scale-105 cursor-pointer shrink-0"
          style={{
            background:
              'radial-gradient(circle at 32% 28%, #3A2F8F 0%, #1E1750 65%, #110D30 100%)',
          }}
        >
          <span className="font-display font-semibold text-2xl tracking-tight text-white leading-none">
            FDC
          </span>
          <span className="mt-1 text-[10px] font-medium text-[#5CD6C0] tracking-wide">
            4.9 ★ KHI
          </span>
        </button>

        {/* 6. RIGHT GLASS CARD (frosted, ~372px wide, bottom-right) */}
        <div className="w-full sm:w-[376px] liquid-glass rounded-[28px] p-5 transition-all duration-200 hover:-translate-y-1">
          {/* Card Header */}
          <div className="flex items-start justify-between gap-3">
            <div>
              <h2 className="font-display font-medium text-lg text-[#1B1B2F] dark:text-white tracking-tight">
                {HERO_CONTENT.rightGlassCard.defaultTitle}
              </h2>
              <div className="mt-1 flex items-center gap-1.5 text-xs text-[#1B1B2F]/75 dark:text-white/75">
                <MapPin className="w-3.5 h-3.5 text-[#F28B5B] shrink-0" />
                <span className="truncate">{CLINIC_INFO.shortAddress}</span>
              </div>
            </div>

            <button
              type="button"
              onClick={onOpenBookingModal}
              aria-label="Book Implant & Smile Makeover Suite"
              className="group w-10 h-10 rounded-full bg-white dark:bg-white/15 text-[#1B1B2F] dark:text-white flex items-center justify-center shadow-sm hover:bg-[#1E1750] hover:text-white transition-colors cursor-pointer shrink-0"
            >
              <ArrowUpRight className="w-4 h-4 transition-transform duration-200 group-hover:rotate-45" />
            </button>
          </div>

          {/* 3-line Description */}
          <p className="mt-3 text-xs leading-relaxed text-[#1B1B2F]/80 dark:text-white/80 line-clamp-3">
            {HERO_CONTENT.rightGlassCard.description}
          </p>

          {/* 2x2 Meta Row with tiny icons */}
          <div className="mt-4 grid grid-cols-2 gap-2.5 pt-3 border-t border-[#1B1B2F]/10 dark:border-white/10">
            <div className="flex items-center gap-2 text-xs text-[#1B1B2F] dark:text-white/90">
              <Clock className="w-3.5 h-3.5 text-[#1E1750] dark:text-[#5CD6C0] shrink-0" />
              <span className="truncate">Open till 11:30 PM</span>
            </div>
            <div className="flex items-center gap-2 text-xs text-[#1B1B2F] dark:text-white/90">
              <Star className="w-3.5 h-3.5 text-[#F28B5B] shrink-0" />
              <span className="truncate">{CLINIC_INFO.reviewsCount}</span>
            </div>
            <div className="flex items-center gap-2 text-xs text-[#1B1B2F] dark:text-white/90">
              <Phone className="w-3.5 h-3.5 text-[#1E1750] dark:text-[#5CD6C0] shrink-0" />
              <span className="truncate">{CLINIC_INFO.phone}</span>
            </div>
            <div className="flex items-center gap-2 text-xs text-[#1B1B2F] dark:text-white/90">
              <Sparkles className="w-3.5 h-3.5 text-[#F28B5B] shrink-0" />
              <span className="truncate">{activeTreatment.name} Suite</span>
            </div>
          </div>

          {/* Footer Row: Three round glass buttons - Heart (4.9K), Bookmark (312), Share */}
          <div className="mt-4 pt-3 border-t border-[#1B1B2F]/10 dark:border-white/10 flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <motion.button
                type="button"
                whileTap={{ scale: 1.22 }}
                transition={{ type: 'spring', stiffness: 450, damping: 14 }}
                onClick={handleLikeClick}
                aria-pressed={likeState.active}
                aria-label={`Like Family Dental Care Suite (${formatCompactCount(
                  likeState.count,
                  likeState.active
                )} likes)`}
                className={`h-9 px-3.5 rounded-full flex items-center gap-1.5 text-xs font-medium transition-colors cursor-pointer ${
                  likeState.active
                    ? 'bg-[#F28B5B]/20 text-[#1B1B2F] dark:text-white border border-[#F28B5B]'
                    : 'bg-white dark:bg-white/10 text-[#1B1B2F] dark:text-white hover:bg-white/90 shadow-xs'
                }`}
              >
                <Heart
                  className={`w-3.5 h-3.5 transition-colors ${
                    likeState.active
                      ? 'fill-[#F28B5B] text-[#F28B5B]'
                      : 'text-[#1B1B2F]/75 dark:text-white/75'
                  }`}
                />
                <span className="tabular-nums">
                  {formatCompactCount(likeState.count, likeState.active)}
                </span>
              </motion.button>

              <button
                type="button"
                onClick={handleBookmarkClick}
                aria-pressed={bookmarkState.active}
                aria-label={`Bookmark suite (${bookmarkState.count} saves)`}
                className={`h-9 px-3.5 rounded-full flex items-center gap-1.5 text-xs font-medium transition-colors cursor-pointer ${
                  bookmarkState.active
                    ? 'bg-[#1E1750] text-white'
                    : 'bg-white dark:bg-white/10 text-[#1B1B2F] dark:text-white hover:bg-white/90 shadow-xs'
                }`}
              >
                <Bookmark
                  className={`w-3.5 h-3.5 ${
                    bookmarkState.active ? 'fill-[#5CD6C0] text-[#5CD6C0]' : ''
                  }`}
                />
                <span className="tabular-nums">{bookmarkState.count}</span>
              </button>
            </div>

            <button
              type="button"
              onClick={handleShareClick}
              aria-label="Share Family Dental Care Karachi location"
              className="h-9 px-3.5 rounded-full bg-white dark:bg-white/10 text-[#1B1B2F] dark:text-white hover:bg-white/90 flex items-center gap-1.5 text-xs font-medium transition-colors shadow-xs cursor-pointer"
            >
              {sharedCopied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-[#5CD6C0]" />
                  <span>Copied</span>
                </>
              ) : (
                <>
                  <Share2 className="w-3.5 h-3.5" />
                  <span>Share</span>
                </>
              )}
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
