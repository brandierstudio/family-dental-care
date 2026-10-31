import React, { useState, useRef, useEffect } from 'react';
import {
  ArrowUpLeft,
  ArrowUpRight,
  ChevronDown,
  Menu,
  X,
  Check,
} from 'lucide-react';
import {
  CLINIC_LOCATIONS,
  PREFERRED_DATES,
  TREATMENT_CHIPS,
  TreatmentId,
} from '../constants/dentalData';

interface TopBarProps {
  selectedLocation: string;
  onSelectLocation: (loc: string) => void;
  selectedTreatment: TreatmentId;
  onSelectTreatment: (treatment: TreatmentId) => void;
  selectedDate: string;
  onSelectDate: (date: string) => void;
  onOpenBookingModal: () => void;
  onOpenCallModal: () => void;
}

type OpenDropdown = 'location' | 'treatment' | 'date' | null;

export const TopBar: React.FC<TopBarProps> = ({
  selectedLocation,
  onSelectLocation,
  selectedTreatment,
  onSelectTreatment,
  selectedDate,
  onSelectDate,
  onOpenBookingModal,
  onOpenCallModal,
}) => {
  const [openDropdown, setOpenDropdown] = useState<OpenDropdown>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const barRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (barRef.current && !barRef.current.contains(e.target as Node)) {
        setOpenDropdown(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const toggleDropdown = (key: OpenDropdown) => {
    setOpenDropdown((prev) => (prev === key ? null : key));
  };

  return (
    <header
      ref={barRef}
      className="absolute top-[20px] inset-x-0 z-40 px-4 sm:px-7"
    >
      <div className="flex flex-wrap items-center justify-between gap-3">
        {/* LEFT PILL: Book Visit with coral arrow-up-left icon */}
        <button
          type="button"
          onClick={onOpenBookingModal}
          className="group ceramic-surface rounded-full px-5 py-2.5 shadow-[0_12px_30px_rgba(20,20,60,0.14)] flex items-center gap-2.5 text-sm font-medium transition-all duration-200 hover:-translate-y-0.5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#F28B5B] cursor-pointer whitespace-nowrap shrink-0"
        >
          <span className="w-6 h-6 rounded-full bg-[#F28B5B]/15 flex items-center justify-center">
            <ArrowUpLeft
              className="w-3.5 h-3.5 text-[#F28B5B] transition-transform duration-200 group-hover:rotate-45"
               aria-hidden="true"
            />
          </span>
          <span>Book Visit</span>
        </button>

        {/* MOBILE HAMBURGER BUTTON (< 640px) */}
        <div className="flex sm:hidden items-center gap-2">
          <button
            type="button"
            onClick={() => setMobileMenuOpen((prev) => !prev)}
            aria-label={mobileMenuOpen ? 'Close clinic filters' : 'Open clinic filters'}
            aria-expanded={mobileMenuOpen}
            className="ceramic-surface rounded-full p-2.5 shadow-md focus-visible:outline-2 focus-visible:outline-[#F28B5B]"
          >
            {mobileMenuOpen ? (
              <X className="w-5 h-5" />
            ) : (
              <Menu className="w-5 h-5" />
            )}
          </button>
        </div>

        {/* CENTRE GLASS-WHITE FILTER BAR (Desktop & Tablet) */}
        <div
          className="hidden sm:flex items-center liquid-glass rounded-full px-3 py-1.5 gap-1 md:gap-3 order-3 lg:order-2 mx-auto lg:mx-0"
          role="group"
          aria-label="Quick appointment filter bar"
        >
          {/* Field 1: Location */}
          <div className="relative">
            <button
              type="button"
              onClick={() => toggleDropdown('location')}
              aria-expanded={openDropdown === 'location'}
              aria-haspopup="listbox"
              className="flex items-center gap-3 px-4 py-1.5 rounded-full hover:bg-white/40 dark:hover:bg-white/10 transition-colors text-left focus-visible:outline-2 focus-visible:outline-[#1E1750] cursor-pointer"
            >
              <div>
                <span className="block text-[10px] leading-tight text-[#1B1B2F]/60 dark:text-white/60">
                  Location
                </span>
                <span className="block text-xs font-semibold text-[#1B1B2F] dark:text-white whitespace-nowrap">
                  {selectedLocation}
                </span>
              </div>
              <ChevronDown
                className={`w-3.5 h-3.5 text-[#1B1B2F]/60 dark:text-white/60 transition-transform duration-200 ${
                  openDropdown === 'location' ? 'rotate-180' : ''
                }`}
              />
            </button>

            {openDropdown === 'location' && (
              <div
                role="listbox"
                aria-label="Select clinic location"
                className="absolute left-0 mt-2 w-60 rounded-[22px] ceramic-surface p-2 shadow-2xl border border-white/60 dark:border-white/10 z-50"
              >
                {CLINIC_LOCATIONS.map((loc) => {
                  const active = loc.name === selectedLocation;
                  return (
                    <button
                      key={loc.id}
                      type="button"
                      role="option"
                      aria-selected={active}
                      onClick={() => {
                        onSelectLocation(loc.name);
                        setOpenDropdown(null);
                      }}
                      className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-2xl text-left text-xs transition-colors cursor-pointer ${
                        active
                          ? 'bg-[#1E1750] text-white font-medium'
                          : 'hover:bg-[#1B1B2F]/5 dark:hover:bg-white/5 text-[#1B1B2F] dark:text-white'
                      }`}
                    >
                      <div>
                        <div className="font-medium">{loc.name}</div>
                        <div
                          className={`text-[10px] ${
                            active ? 'text-white/75' : 'text-[#1B1B2F]/60 dark:text-white/60'
                          }`}
                        >
                          {loc.address}
                        </div>
                      </div>
                      {active && <Check className="w-3.5 h-3.5 text-[#5CD6C0] shrink-0" />}
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          <div className="h-6 w-px bg-[#1B1B2F]/12 dark:bg-white/15" aria-hidden="true" />

          {/* Field 2: Treatment */}
          <div className="relative">
            <button
              type="button"
              onClick={() => toggleDropdown('treatment')}
              aria-expanded={openDropdown === 'treatment'}
              aria-haspopup="listbox"
              className="flex items-center gap-3 px-4 py-1.5 rounded-full hover:bg-white/40 dark:hover:bg-white/10 transition-colors text-left focus-visible:outline-2 focus-visible:outline-[#1E1750] cursor-pointer"
            >
              <div>
                <span className="block text-[10px] leading-tight text-[#1B1B2F]/60 dark:text-white/60">
                  Treatment
                </span>
                <span className="block text-xs font-semibold text-[#1B1B2F] dark:text-white whitespace-nowrap">
                  {selectedTreatment}
                </span>
              </div>
              <ChevronDown
                className={`w-3.5 h-3.5 text-[#1B1B2F]/60 dark:text-white/60 transition-transform duration-200 ${
                  openDropdown === 'treatment' ? 'rotate-180' : ''
                }`}
              />
            </button>

            {openDropdown === 'treatment' && (
              <div
                role="listbox"
                aria-label="Select dental treatment"
                className="absolute left-1/2 -translate-x-1/2 mt-2 w-56 rounded-[22px] ceramic-surface p-2 shadow-2xl border border-white/60 dark:border-white/10 z-50 max-h-72 overflow-y-auto"
              >
                {TREATMENT_CHIPS.map((item) => {
                  const active = item === selectedTreatment;
                  return (
                    <button
                      key={item}
                      type="button"
                      role="option"
                      aria-selected={active}
                      onClick={() => {
                        onSelectTreatment(item);
                        setOpenDropdown(null);
                      }}
                      className={`w-full flex items-center justify-between px-3.5 py-2 rounded-xl text-left text-xs transition-colors cursor-pointer ${
                        active
                          ? 'bg-[#1E1750] text-white font-medium'
                          : 'hover:bg-[#1B1B2F]/5 dark:hover:bg-white/5 text-[#1B1B2F] dark:text-white'
                      }`}
                    >
                      <span>{item}</span>
                      {active && <Check className="w-3.5 h-3.5 text-[#5CD6C0]" />}
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          <div className="h-6 w-px bg-[#1B1B2F]/12 dark:bg-white/15" aria-hidden="true" />

          {/* Field 3: Preferred Date */}
          <div className="relative">
            <button
              type="button"
              onClick={() => toggleDropdown('date')}
              aria-expanded={openDropdown === 'date'}
              aria-haspopup="listbox"
              className="flex items-center gap-3 px-4 py-1.5 rounded-full hover:bg-white/40 dark:hover:bg-white/10 transition-colors text-left focus-visible:outline-2 focus-visible:outline-[#1E1750] cursor-pointer"
            >
              <div>
                <span className="block text-[10px] leading-tight text-[#1B1B2F]/60 dark:text-white/60">
                  Preferred Date
                </span>
                <span className="block text-xs font-semibold text-[#1B1B2F] dark:text-white whitespace-nowrap">
                  {selectedDate}
                </span>
              </div>
              <ChevronDown
                className={`w-3.5 h-3.5 text-[#1B1B2F]/60 dark:text-white/60 transition-transform duration-200 ${
                  openDropdown === 'date' ? 'rotate-180' : ''
                }`}
              />
            </button>

            {openDropdown === 'date' && (
              <div
                role="listbox"
                aria-label="Select preferred appointment date"
                className="absolute right-0 mt-2 w-52 rounded-[22px] ceramic-surface p-2 shadow-2xl border border-white/60 dark:border-white/10 z-50"
              >
                {PREFERRED_DATES.map((dateStr) => {
                  const active = dateStr === selectedDate;
                  return (
                    <button
                      key={dateStr}
                      type="button"
                      role="option"
                      aria-selected={active}
                      onClick={() => {
                        onSelectDate(dateStr);
                        setOpenDropdown(null);
                      }}
                      className={`w-full flex items-center justify-between px-3.5 py-2 rounded-xl text-left text-xs transition-colors cursor-pointer ${
                        active
                          ? 'bg-[#1E1750] text-white font-medium'
                          : 'hover:bg-[#1B1B2F]/5 dark:hover:bg-white/5 text-[#1B1B2F] dark:text-white'
                      }`}
                    >
                      <span>{dateStr}</span>
                      {active && <Check className="w-3.5 h-3.5 text-[#5CD6C0]" />}
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* RIGHT PILL: Call Now with coral arrow-up-right icon */}
        <button
          type="button"
          onClick={onOpenCallModal}
          className="hidden sm:flex group ceramic-surface rounded-full px-5 py-2.5 shadow-[0_12px_30px_rgba(20,20,60,0.14)] items-center gap-2.5 text-sm font-medium transition-all duration-200 hover:-translate-y-0.5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#F28B5B] order-2 lg:order-3 cursor-pointer whitespace-nowrap shrink-0"
        >
          <span>Call Now</span>
          <span className="w-6 h-6 rounded-full bg-[#F28B5B]/15 flex items-center justify-center">
            <ArrowUpRight
              className="w-3.5 h-3.5 text-[#F28B5B] transition-transform duration-200 group-hover:rotate-45"
              aria-hidden="true"
            />
          </span>
        </button>
      </div>

      {/* MOBILE COLLAPSIBLE FILTER & CALL MENU */}
      {mobileMenuOpen && (
        <div className="sm:hidden mt-3 rounded-[28px] ceramic-surface p-4 shadow-2xl border border-white/60 dark:border-white/10 space-y-3">
          <div className="grid grid-cols-1 gap-2.5">
            <label className="block">
              <span className="text-[11px] text-[#1B1B2F]/60 dark:text-white/60">
                Location
              </span>
              <select
                value={selectedLocation}
                onChange={(e) => onSelectLocation(e.target.value)}
                className="mt-1 w-full rounded-xl bg-black/5 dark:bg-white/10 px-3 py-2 text-xs font-semibold"
              >
                {CLINIC_LOCATIONS.map((l) => (
                  <option key={l.id} value={l.name}>
                    {l.name}
                  </option>
                ))}
              </select>
            </label>
            <label className="block">
              <span className="text-[11px] text-[#1B1B2F]/60 dark:text-white/60">
                Treatment
              </span>
              <select
                value={selectedTreatment}
                onChange={(e) => onSelectTreatment(e.target.value as TreatmentId)}
                className="mt-1 w-full rounded-xl bg-black/5 dark:bg-white/10 px-3 py-2 text-xs font-semibold"
              >
                {TREATMENT_CHIPS.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
            </label>
            <label className="block">
              <span className="text-[11px] text-[#1B1B2F]/60 dark:text-white/60">
                Preferred Date
              </span>
              <select
                value={selectedDate}
                onChange={(e) => onSelectDate(e.target.value)}
                className="mt-1 w-full rounded-xl bg-black/5 dark:bg-white/10 px-3 py-2 text-xs font-semibold"
              >
                {PREFERRED_DATES.map((d) => (
                  <option key={d} value={d}>
                    {d}
                  </option>
                ))}
              </select>
            </label>
          </div>

          <button
            type="button"
            onClick={() => {
              setMobileMenuOpen(false);
              onOpenCallModal();
            }}
            className="w-full rounded-full bg-[#1E1750] text-white py-2.5 px-4 text-xs font-medium flex items-center justify-center gap-2"
          >
            <span>Call Now</span>
            <ArrowUpRight className="w-3.5 h-3.5 text-[#F28B5B]" />
          </button>
        </div>
      )}
    </header>
  );
};
