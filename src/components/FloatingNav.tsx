import React, { useState } from 'react';
import {
  Home,
  Search,
  LayoutGrid,
  MessageSquare,
  Bell,
  Settings,
  Moon,
  Sun,
  Check,
  PanelLeftOpen,
} from 'lucide-react';
import { DOCTOR_PROFILE } from '../constants/dentalData';

export type ActiveNavTab = 'home' | 'search' | 'services' | 'chat';

interface FloatingNavProps {
  activeTab: ActiveNavTab;
  onSelectTab: (tab: ActiveNavTab) => void;
  isDark: boolean;
  onToggleTheme: (dark: boolean) => void;
  isCollapsed: boolean;
  onExpandSidebar: () => void;
  onOpenBookingModal: () => void;
}

type ActivePopover = 'doctor' | 'notifications' | 'settings' | null;

export const FloatingNav: React.FC<FloatingNavProps> = ({
  activeTab,
  onSelectTab,
  isDark,
  onToggleTheme,
  isCollapsed,
  onExpandSidebar,
  onOpenBookingModal,
}) => {
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);
  const [openPopover, setOpenPopover] = useState<ActivePopover>(null);
  const [ambientAudio, setAmbientAudio] = useState(true);
  const [highContrastGlass, setHighContrastGlass] = useState(false);

  const navButtons: {
    id: ActiveNavTab;
    label: string;
    icon: React.FC<{ className?: string }>;
  }[] = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'search', label: 'Search Treatments', icon: Search },
    { id: 'services', label: 'Bento Services', icon: LayoutGrid },
    { id: 'chat', label: 'Clinic Concierge', icon: MessageSquare },
  ];

  const togglePopover = (popover: ActivePopover) => {
    setOpenPopover((prev) => (prev === popover ? null : popover));
  };

  return (
    <>
      {/* DESKTOP LEFT FLOATING NAV (Fixed/Sticky vertically centred on left inside full-bleed viewport) */}
      <nav
        aria-label="Primary clinic navigation"
        className="hidden lg:flex fixed left-5 top-1/2 -translate-y-1/2 z-40 flex-col items-center gap-3"
      >
        {isCollapsed ? (
          <button
            type="button"
            onClick={onExpandSidebar}
            aria-label="Expand sidebar navigation"
            className="ceramic-surface rounded-full p-3 shadow-xl border border-white/60 dark:border-white/15 hover:scale-110 transition-transform cursor-pointer"
          >
            <PanelLeftOpen className="w-4 h-4 text-[#1E1750] dark:text-white" />
          </button>
        ) : (
          <>
            {/* PILL 1: Home, Search, Grid/Services, Chat, Divider, Doctor Avatar, Bell */}
            <div className="ceramic-surface rounded-full p-1.5 shadow-[0_18px_40px_rgba(20,20,60,0.16)] border border-white/70 dark:border-white/10 flex flex-col items-center gap-1.5">
              {navButtons.map((btn) => {
                const Icon = btn.icon;
                const isActive = activeTab === btn.id;
                return (
                  <div key={btn.id} className="relative flex items-center">
                    <button
                      type="button"
                      aria-label={btn.label}
                      aria-current={isActive ? 'page' : undefined}
                      onClick={() => {
                        setOpenPopover(null);
                        onSelectTab(btn.id);
                      }}
                      onMouseEnter={() => setHoveredItem(btn.id)}
                      onMouseLeave={() => setHoveredItem(null)}
                      onFocus={() => setHoveredItem(btn.id)}
                      onBlur={() => setHoveredItem(null)}
                      className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-200 hover:scale-110 focus-visible:outline-2 focus-visible:outline-[#F28B5B] cursor-pointer ${
                        isActive
                          ? 'bg-[#1E1750] text-white shadow-md'
                          : 'text-[#1B1B2F]/75 dark:text-white/75 hover:bg-[#1B1B2F]/8 dark:hover:bg-white/10'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                    </button>

                    {hoveredItem === btn.id && (
                      <div
                        role="tooltip"
                        className="absolute left-full ml-3 px-2.5 py-1 rounded-lg bg-[#1E1750] text-white text-[11px] font-medium whitespace-nowrap shadow-lg pointer-events-none z-50"
                      >
                        {btn.label}
                      </div>
                    )}
                  </div>
                );
              })}

              {/* Divider */}
              <div
                className="w-6 h-px bg-[#1B1B2F]/15 dark:bg-white/15 my-0.5"
                 role="separator"
              />

              {/* Round Doctor Avatar */}
              <div className="relative flex items-center">
                <button
                  type="button"
                  aria-label={`Lead Specialist: ${DOCTOR_PROFILE.name}`}
                  aria-expanded={openPopover === 'doctor'}
                  onClick={() => togglePopover('doctor')}
                  onMouseEnter={() => setHoveredItem('doctor')}
                  onMouseLeave={() => setHoveredItem(null)}
                  className="w-10 h-10 rounded-full overflow-hidden border-2 border-[#5CD6C0] flex items-center justify-center bg-[#1E1750] text-white font-display font-semibold text-xs shadow-[inset_0_2px_6px_rgba(255,255,255,0.45)] transition-transform duration-200 hover:scale-110 focus-visible:outline-2 focus-visible:outline-[#F28B5B] cursor-pointer"
                >
                  <span>FD</span>
                </button>

                {hoveredItem === 'doctor' && openPopover !== 'doctor' && (
                  <div
                    role="tooltip"
                    className="absolute left-full ml-3 px-2.5 py-1 rounded-lg bg-[#1E1750] text-white text-[11px] font-medium whitespace-nowrap shadow-lg pointer-events-none z-50"
                  >
                    {DOCTOR_PROFILE.name}
                  </div>
                )}

                {openPopover === 'doctor' && (
                  <div className="absolute left-full ml-3.5 w-64 rounded-[24px] ceramic-surface p-4 shadow-2xl border border-white/70 dark:border-white/15 z-50 text-left">
                    <div className="text-xs font-semibold text-[#1B1B2F] dark:text-white">
                      {DOCTOR_PROFILE.name}
                    </div>
                    <div className="text-[11px] text-[#1B1B2F]/60 dark:text-white/60 mt-0.5">
                      {DOCTOR_PROFILE.role}
                    </div>
                    <p className="text-[11px] leading-relaxed text-[#1B1B2F]/80 dark:text-white/80 mt-2 italic">
                      "{DOCTOR_PROFILE.quote}"
                    </p>
                    <button
                      type="button"
                      onClick={() => {
                        setOpenPopover(null);
                        onOpenBookingModal();
                      }}
                      className="mt-3 w-full rounded-full bg-[#1E1750] text-white py-1.5 px-3 text-[11px] font-medium hover:opacity-95 cursor-pointer"
                    >
                      Book at Family Dental Care
                    </button>
                  </div>
                )}
              </div>

              {/* Bell Button */}
              <div className="relative flex items-center">
                <button
                  type="button"
                  aria-label="Clinic notifications"
                  aria-expanded={openPopover === 'notifications'}
                  onClick={() => togglePopover('notifications')}
                  onMouseEnter={() => setHoveredItem('bell')}
                  onMouseLeave={() => setHoveredItem(null)}
                  className="w-10 h-10 rounded-full flex items-center justify-center text-[#1B1B2F]/75 dark:text-white/75 hover:bg-[#1B1B2F]/8 dark:hover:bg-white/10 transition-transform duration-200 hover:scale-110 focus-visible:outline-2 focus-visible:outline-[#F28B5B] cursor-pointer"
                >
                  <Bell className="w-4 h-4" />
                </button>

                {hoveredItem === 'bell' && openPopover !== 'notifications' && (
                  <div
                    role="tooltip"
                    className="absolute left-full ml-3 px-2.5 py-1 rounded-lg bg-[#1E1750] text-white text-[11px] font-medium whitespace-nowrap shadow-lg pointer-events-none z-50"
                  >
                    Clinic Alerts
                  </div>
                )}

                {openPopover === 'notifications' && (
                  <div className="absolute left-full ml-3.5 w-64 rounded-[24px] ceramic-surface p-4 shadow-2xl border border-white/70 dark:border-white/15 z-50 text-left">
                    <div className="text-xs font-semibold text-[#1B1B2F] dark:text-white">
                      Jamshed Road Clinic Hours
                    </div>
                    <p className="text-[11px] text-[#1B1B2F]/70 dark:text-white/70 mt-1 leading-relaxed">
                      Family Dental Care (Shop 1 &amp; 2, 3 Jamshed Road, Karachi) is open daily until 11:30 PM. Same-day 3D implant &amp; zirconia consultations available.
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* PILL 2: Settings, Moon, Sun (Theme Toggle) */}
            <div className="ceramic-surface rounded-full p-1.5 shadow-[0_18px_40px_rgba(20,20,60,0.16)] border border-white/70 dark:border-white/10 flex flex-col items-center gap-1.5">
              {/* Settings */}
              <div className="relative flex items-center">
                <button
                  type="button"
                  aria-label="Display and comfort settings"
                  aria-expanded={openPopover === 'settings'}
                  onClick={() => togglePopover('settings')}
                  onMouseEnter={() => setHoveredItem('settings')}
                  onMouseLeave={() => setHoveredItem(null)}
                  className="w-10 h-10 rounded-full flex items-center justify-center text-[#1B1B2F]/75 dark:text-white/75 hover:bg-[#1B1B2F]/8 dark:hover:bg-white/10 transition-transform duration-200 hover:scale-110 focus-visible:outline-2 focus-visible:outline-[#F28B5B] cursor-pointer"
                >
                  <Settings className="w-4 h-4" />
                </button>

                {hoveredItem === 'settings' && openPopover !== 'settings' && (
                  <div
                    role="tooltip"
                    className="absolute left-full ml-3 px-2.5 py-1 rounded-lg bg-[#1E1750] text-white text-[11px] font-medium whitespace-nowrap shadow-lg pointer-events-none z-50"
                  >
                    Suite Preferences
                  </div>
                )}

                {openPopover === 'settings' && (
                  <div className="absolute left-full ml-3.5 w-60 rounded-[24px] ceramic-surface p-4 shadow-2xl border border-white/70 dark:border-white/15 z-50 text-left space-y-2.5">
                    <div className="text-xs font-semibold text-[#1B1B2F] dark:text-white">
                      Experience Preferences
                    </div>
                    <button
                      type="button"
                      onClick={() => setAmbientAudio((v) => !v)}
                      className="w-full flex items-center justify-between text-[11px] text-[#1B1B2F]/80 dark:text-white/80 py-1 cursor-pointer"
                    >
                      <span>Acoustic Suite Ambience</span>
                      {ambientAudio && <Check className="w-3.5 h-3.5 text-[#5CD6C0]" />}
                    </button>
                    <button
                      type="button"
                      onClick={() => setHighContrastGlass((v) => !v)}
                      className="w-full flex items-center justify-between text-[11px] text-[#1B1B2F]/80 dark:text-white/80 py-1 cursor-pointer"
                    >
                      <span>Enhanced Glass Frost</span>
                      {highContrastGlass && <Check className="w-3.5 h-3.5 text-[#5CD6C0]" />}
                    </button>
                  </div>
                )}
              </div>

              {/* Moon (Dark Mode) */}
              <div className="relative flex items-center">
                <button
                  type="button"
                  aria-label="Switch to dark glass theme"
                  aria-pressed={isDark}
                  onClick={() => onToggleTheme(true)}
                  onMouseEnter={() => setHoveredItem('moon')}
                  onMouseLeave={() => setHoveredItem(null)}
                  className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-200 hover:scale-110 focus-visible:outline-2 focus-visible:outline-[#F28B5B] cursor-pointer ${
                    isDark
                      ? 'bg-white text-[#1E1750] shadow-md'
                      : 'text-[#1B1B2F]/70 hover:bg-[#1B1B2F]/8'
                  }`}
                >
                  <Moon className="w-4 h-4" />
                </button>
                {hoveredItem === 'moon' && (
                  <div
                    role="tooltip"
                    className="absolute left-full ml-3 px-2.5 py-1 rounded-lg bg-[#1E1750] text-white text-[11px] font-medium whitespace-nowrap shadow-lg pointer-events-none z-50"
                  >
                    Deep Navy Glass
                  </div>
                )}
              </div>

              {/* Sun (Light Mode) */}
              <div className="relative flex items-center">
                <button
                  type="button"
                  aria-label="Switch to light ceramic glass theme"
                  aria-pressed={!isDark}
                  onClick={() => onToggleTheme(false)}
                  onMouseEnter={() => setHoveredItem('sun')}
                  onMouseLeave={() => setHoveredItem(null)}
                  className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-200 hover:scale-110 focus-visible:outline-2 focus-visible:outline-[#F28B5B] cursor-pointer ${
                    !isDark
                      ? 'bg-white text-[#1E1750] shadow-md ring-1 ring-[#1E1750]/10'
                      : 'text-white/70 hover:bg-white/10'
                  }`}
                >
                  <Sun className="w-4 h-4" />
                </button>
                {hoveredItem === 'sun' && (
                  <div
                    role="tooltip"
                    className="absolute left-full ml-3 px-2.5 py-1 rounded-lg bg-[#1E1750] text-white text-[11px] font-medium whitespace-nowrap shadow-lg pointer-events-none z-50"
                  >
                    Ceramic Light Glass
                  </div>
                )}
              </div>
            </div>
          </>
        )}
      </nav>

      {/* TABLET & MOBILE FLOATING BOTTOM DOCK (< 1024px) */}
      <nav
        aria-label="Mobile clinic navigation dock"
        className="lg:hidden fixed bottom-4 left-1/2 -translate-x-1/2 z-40 ceramic-surface rounded-full px-2.5 py-1.5 shadow-2xl border border-white/70 dark:border-white/15 flex items-center gap-1.5"
      >
        {navButtons.map((btn) => {
          const Icon = btn.icon;
          const isActive = activeTab === btn.id;
          return (
            <button
              key={btn.id}
              type="button"
              aria-label={btn.label}
              onClick={() => onSelectTab(btn.id)}
              className={`w-9 h-9 rounded-full flex items-center justify-center transition-colors ${
                isActive
                  ? 'bg-[#1E1750] text-white'
                  : 'text-[#1B1B2F]/75 dark:text-white/75'
              }`}
            >
              <Icon className="w-4 h-4" />
            </button>
          );
        })}
        <div className="w-px h-5 bg-[#1B1B2F]/15 dark:bg-white/15 mx-0.5" />
        <button
          type="button"
          aria-label={isDark ? 'Switch to light theme' : 'Switch to dark theme'}
          onClick={() => onToggleTheme(!isDark)}
          className="w-9 h-9 rounded-full flex items-center justify-center bg-white dark:bg-[#1E1750] text-[#1E1750] dark:text-white shadow-sm"
        >
          {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
        </button>
      </nav>
    </>
  );
};
