import React, { useState } from 'react';
import {
  X,
  CheckCircle2,
  Phone,
  MapPin,
  Sparkles,
  Clock,
  Navigation,
} from 'lucide-react';
import {
  BEFORE_AFTER_CASES,
  CLINIC_INFO,
  CLINIC_LOCATIONS,
  PREFERRED_DATES,
  TREATMENT_CHIPS,
  TreatmentId,
} from '../constants/dentalData';
import { validateBookingRequest } from '../utils/dentalLogic';

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedLocation: string;
  onSelectLocation: (loc: string) => void;
  selectedTreatment: TreatmentId;
  onSelectTreatment: (t: TreatmentId) => void;
  selectedDate: string;
  onSelectDate: (d: string) => void;
}

export const BookingModal: React.FC<BookingModalProps> = ({
  isOpen,
  onClose,
  selectedLocation,
  onSelectLocation,
  selectedTreatment,
  onSelectTreatment,
  selectedDate,
  onSelectDate,
}) => {
  const [patientName, setPatientName] = useState('');
  const [phoneOrEmail, setPhoneOrEmail] = useState('');
  const [notes, setNotes] = useState('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const validation = validateBookingRequest({
      patientName,
      phoneOrEmail,
      location: selectedLocation,
      treatment: selectedTreatment,
      preferredDate: selectedDate,
    });

    if (!validation.valid) {
      setErrorMsg(validation.error ?? 'Please check your details.');
      return;
    }

    setErrorMsg(null);
    setIsSubmitted(true);
  };

  const resetAndClose = () => {
    setIsSubmitted(false);
    setErrorMsg(null);
    onClose();
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="booking-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0D0C20]/75"
    >
      <div className="w-full max-w-md rounded-[32px] ceramic-surface p-6 sm:p-7 shadow-2xl border border-white/80 dark:border-white/15 relative">
        <button
          type="button"
          onClick={resetAndClose}
          aria-label="Close booking dialog"
          className="absolute top-5 right-5 w-9 h-9 rounded-full bg-black/5 dark:bg-white/10 flex items-center justify-center hover:bg-black/10 cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>

        {isSubmitted ? (
          <div className="py-4 text-center space-y-3" data-testid="booking-confirmation">
            <div className="w-12 h-12 rounded-full bg-[#5CD6C0]/20 text-[#1E1750] dark:text-[#5CD6C0] flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-6 h-6 text-[#5CD6C0]" />
            </div>
            <h2
              id="booking-modal-title"
              className="font-display font-medium text-2xl text-[#1E1750] dark:text-white"
            >
              Visit Reserved
            </h2>
            <p className="text-xs text-[#1B1B2F]/75 dark:text-white/75 leading-relaxed">
              Thank you, <strong>{patientName}</strong>. Your{' '}
              <strong>{selectedTreatment}</strong> appointment at{' '}
              <strong>{CLINIC_INFO.name}</strong> ({selectedLocation}) is booked for{' '}
              <strong>{selectedDate}</strong>. Confirmation sent to{' '}
              <span className="underline">{phoneOrEmail}</span>.
            </p>
            <div className="rounded-2xl bg-black/5 dark:bg-white/5 p-3 text-[11px] text-[#1B1B2F]/70 dark:text-white/70">
              <div>{CLINIC_INFO.address}</div>
              <div className="mt-1 font-semibold text-[#1E1750] dark:text-[#5CD6C0]">
                Helpline: {CLINIC_INFO.phone} · {CLINIC_INFO.hours}
              </div>
            </div>
            <button
              type="button"
              onClick={resetAndClose}
              className="mt-4 w-full rounded-full bg-[#1E1750] text-white py-2.5 text-xs font-medium cursor-pointer"
            >
              Done
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4" noValidate>
            <div>
              <span className="text-[11px] font-medium text-[#F28B5B]">
                {CLINIC_INFO.name} · {CLINIC_INFO.reviewsCount}
              </span>
              <h2
                id="booking-modal-title"
                className="font-display font-medium text-2xl text-[#1E1750] dark:text-white"
              >
                Book Your Visit
              </h2>
              <p className="text-[11px] text-[#1B1B2F]/65 dark:text-white/65 mt-0.5">
                {CLINIC_INFO.shortAddress} · {CLINIC_INFO.hours}
              </p>
            </div>

            {errorMsg && (
              <div
                role="alert"
                className="rounded-2xl bg-[#F28B5B]/15 border border-[#F28B5B] px-3.5 py-2.5 text-xs text-[#1B1B2F] dark:text-white"
              >
                {errorMsg}
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
              <label className="block">
                <span className="text-[10px] text-[#1B1B2F]/60 dark:text-white/60">
                  Location
                </span>
                <select
                  value={selectedLocation}
                  onChange={(e) => onSelectLocation(e.target.value)}
                  className="mt-1 w-full rounded-xl bg-black/5 dark:bg-white/10 px-2.5 py-2 text-xs font-medium"
                >
                  {CLINIC_LOCATIONS.map((l) => (
                    <option key={l.id} value={l.name}>
                      {l.name}
                    </option>
                  ))}
                </select>
              </label>

              <label className="block">
                <span className="text-[10px] text-[#1B1B2F]/60 dark:text-white/60">
                  Treatment
                </span>
                <select
                  value={selectedTreatment}
                  onChange={(e) => onSelectTreatment(e.target.value as TreatmentId)}
                  className="mt-1 w-full rounded-xl bg-black/5 dark:bg-white/10 px-2.5 py-2 text-xs font-medium"
                >
                  {TREATMENT_CHIPS.map((t) => (
                    <option key={t} value={t}>
                      {t}
                    </option>
                  ))}
                </select>
              </label>

              <label className="block">
                <span className="text-[10px] text-[#1B1B2F]/60 dark:text-white/60">
                  Preferred Date
                </span>
                <select
                  value={selectedDate}
                  onChange={(e) => onSelectDate(e.target.value)}
                  className="mt-1 w-full rounded-xl bg-black/5 dark:bg-white/10 px-2.5 py-2 text-xs font-medium"
                >
                  {PREFERRED_DATES.map((d) => (
                    <option key={d} value={d}>
                      {d}
                    </option>
                  ))}
                </select>
              </label>
            </div>

            <label className="block">
              <span className="text-xs font-medium text-[#1B1B2F] dark:text-white">
                Patient Full Name
              </span>
              <input
                type="text"
                required
                value={patientName}
                onChange={(e) => setPatientName(e.target.value)}
                placeholder="Tariq Mahmood"
                className="mt-1 w-full rounded-2xl bg-black/5 dark:bg-white/10 px-3.5 py-2.5 text-xs focus:outline-2 focus:outline-[#1E1750]"
              />
            </label>

            <label className="block">
              <span className="text-xs font-medium text-[#1B1B2F] dark:text-white">
                Mobile / WhatsApp Number or Email
              </span>
              <input
                type="text"
                required
                value={phoneOrEmail}
                onChange={(e) => setPhoneOrEmail(e.target.value)}
                placeholder="0318-2014124 or patient@email.com"
                className="mt-1 w-full rounded-2xl bg-black/5 dark:bg-white/10 px-3.5 py-2.5 text-xs focus:outline-2 focus:outline-[#1E1750]"
              />
            </label>

            <label className="block">
              <span className="text-xs font-medium text-[#1B1B2F]/70 dark:text-white/70">
                Symptoms or Treatment Notes (Optional)
              </span>
              <input
                type="text"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="e.g., Front tooth implant crown or evening RCT"
                className="mt-1 w-full rounded-2xl bg-black/5 dark:bg-white/10 px-3.5 py-2 text-xs focus:outline-2 focus:outline-[#1E1750]"
              />
            </label>

            <button
              type="submit"
              className="w-full rounded-full bg-[#1E1750] text-white py-3 text-xs font-medium hover:opacity-95 transition-opacity cursor-pointer"
            >
              Confirm Appointment Slot
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

interface CallModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CallModal: React.FC<CallModalProps> = ({ isOpen, onClose }) => {
  const [callbackPhone, setCallbackPhone] = useState('');
  const [callbackRequested, setCallbackRequested] = useState(false);

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="call-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0D0C20]/75"
    >
      <div className="w-full max-w-md rounded-[32px] ceramic-surface p-6 shadow-2xl border border-white/80 dark:border-white/15 relative space-y-4">
        <button
          type="button"
          onClick={onClose}
          aria-label="Close call dialog"
          className="absolute top-5 right-5 w-9 h-9 rounded-full bg-black/5 dark:bg-white/10 flex items-center justify-center cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-full bg-[#F28B5B]/15 text-[#F28B5B] flex items-center justify-center shrink-0">
            <Phone className="w-5 h-5" />
          </div>
          <div>
            <h2
              id="call-modal-title"
              className="font-display font-medium text-xl text-[#1E1750] dark:text-white"
            >
              {CLINIC_INFO.name}
            </h2>
            <p className="text-xs text-[#1B1B2F]/65 dark:text-white/65">
              {CLINIC_INFO.hours} · {CLINIC_INFO.reviewsCount}
            </p>
          </div>
        </div>

        <div className="rounded-2xl bg-black/5 dark:bg-white/5 p-3.5 space-y-1.5 text-xs">
          <div className="flex items-start gap-2 text-[#1B1B2F] dark:text-white">
            <MapPin className="w-4 h-4 text-[#F28B5B] shrink-0 mt-0.5" />
            <span>{CLINIC_INFO.address}</span>
          </div>
          <div className="flex items-center gap-2 text-[#1B1B2F]/65 dark:text-white/65 pl-6">
            <Navigation className="w-3.5 h-3.5 text-[#5CD6C0] shrink-0" />
            <span>Plus Code: {CLINIC_INFO.plusCode}</span>
          </div>
        </div>

        <a
          href={`tel:${CLINIC_INFO.phoneDial}`}
          className="block w-full rounded-2xl bg-[#1E1750] text-white py-3 px-4 text-center font-display font-medium text-base tracking-wide"
        >
          {CLINIC_INFO.phone}
        </a>

        {callbackRequested ? (
          <div className="rounded-2xl bg-[#5CD6C0]/20 p-3 text-xs text-center font-medium">
            Our Jamshed Road reception desk will call you within 3 minutes.
          </div>
        ) : (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (callbackPhone.trim().length >= 5) {
                setCallbackRequested(true);
              }
            }}
            className="space-y-2 pt-2 border-t border-[#1B1B2F]/10 dark:border-white/10"
          >
            <label className="block text-xs text-[#1B1B2F]/75 dark:text-white/75">
              Or request an instant WhatsApp / phone callback:
              <input
                type="tel"
                required
                value={callbackPhone}
                onChange={(e) => setCallbackPhone(e.target.value)}
                placeholder="03XX-XXXXXXX"
                className="mt-1.5 w-full rounded-xl bg-black/5 dark:bg-white/10 px-3 py-2 text-xs"
              />
            </label>
            <button
              type="submit"
              className="w-full rounded-full bg-[#F28B5B] text-[#1B1B2F] font-semibold py-2.5 text-xs cursor-pointer"
            >
              Call Me Back Now
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

interface GalleryModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialCaseId?: string;
  onBookTreatment: (treatment: TreatmentId) => void;
}

export const GalleryModal: React.FC<GalleryModalProps> = ({
  isOpen,
  onClose,
  initialCaseId,
  onBookTreatment,
}) => {
  const [selectedCaseId, setSelectedCaseId] = useState(
    initialCaseId || BEFORE_AFTER_CASES[0].id
  );

  if (!isOpen) return null;

  const activeCase =
    BEFORE_AFTER_CASES.find((c) => c.id === selectedCaseId) ||
    BEFORE_AFTER_CASES[0];

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="gallery-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0D0C20]/80"
    >
      <div className="w-full max-w-2xl rounded-[36px] ceramic-surface p-6 sm:p-8 shadow-2xl border border-white/80 dark:border-white/15 relative space-y-5">
        <button
          type="button"
          onClick={onClose}
          aria-label="Close smile gallery"
          className="absolute top-6 right-6 w-9 h-9 rounded-full bg-black/5 dark:bg-white/10 flex items-center justify-center cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>

        <div>
          <span className="text-xs font-medium text-[#F28B5B]">
            {CLINIC_INFO.name} · Jamshed Road Case Archive
          </span>
          <h2
            id="gallery-modal-title"
            className="font-display font-medium text-2xl text-[#1E1750] dark:text-white"
          >
            3D Implant & Smile Transformations
          </h2>
        </div>

        {/* Case Selector Tabs */}
        <div className="flex flex-wrap gap-2">
          {BEFORE_AFTER_CASES.map((item) => {
            const active = item.id === activeCase.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => setSelectedCaseId(item.id)}
                className={`px-4 py-2 rounded-full text-xs font-medium transition-colors cursor-pointer ${
                  active
                    ? 'bg-[#1E1750] text-white'
                    : 'bg-black/5 dark:bg-white/10 text-[#1B1B2F] dark:text-white'
                }`}
              >
                {item.patientName} ({item.treatment})
              </button>
            );
          })}
        </div>

        {/* Active Case Comparison Card */}
        <div className="rounded-[24px] bg-[#F6F7FC] dark:bg-[#1E1750] text-[#1B1B2F] dark:text-white p-5 space-y-4 border border-[#1E1750]/10">
          <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 items-center">
            <div className="sm:col-span-5 h-40 rounded-2xl overflow-hidden bg-white border border-[#1E1750]/10">
              <img
                src={activeCase.imageUrl}
                alt={`${activeCase.patientName} ${activeCase.treatment}`}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="sm:col-span-7 grid grid-cols-1 gap-3">
              <div className="rounded-2xl bg-white dark:bg-white/10 p-3.5 border border-[#1E1750]/10 dark:border-white/15">
                <div className="text-[11px] text-[#1B1B2F]/60 dark:text-white/60">
                  Initial Presentation
                </div>
                <div className="mt-1 text-xs font-medium text-[#1B1B2F] dark:text-white">
                  {activeCase.beforeNote}
                </div>
              </div>
              <div className="rounded-2xl bg-[#5CD6C0]/15 p-3.5 border border-[#5CD6C0]/40">
                <div className="text-[11px] font-semibold text-[#1E1750] dark:text-[#5CD6C0]">
                  Completed {activeCase.treatment} Result
                </div>
                <div className="mt-1 text-xs font-medium text-[#1B1B2F] dark:text-white">
                  {activeCase.afterNote}
                </div>
              </div>
            </div>
          </div>

          <p className="text-xs text-[#1B1B2F]/80 dark:text-white/80 leading-relaxed">
            {activeCase.summary}
          </p>

          <div className="pt-3 border-t border-white/15 flex flex-wrap items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-1.5 text-[#5CD6C0]">
                <Sparkles className="w-3.5 h-3.5" />
                {activeCase.shadeImprovement}
              </span>
              <span className="flex items-center gap-1.5 text-white/75">
                <Clock className="w-3.5 h-3.5" />
                {activeCase.duration}
              </span>
            </div>

            <button
              type="button"
              onClick={() => {
                onClose();
                onBookTreatment(activeCase.treatment);
              }}
              className="rounded-full bg-[#F6F7FC] text-[#1E1750] px-4 py-2 text-xs font-semibold cursor-pointer"
            >
              Book {activeCase.treatment} Consultation
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
