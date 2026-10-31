import {
  CATEGORY_STACK,
  CLINIC_INFO,
  CategoryCardData,
  CategoryId,
  TREATMENTS,
  TreatmentId,
  TreatmentOption,
} from '../constants/dentalData';

/**
 * Retrieve the full treatment details by treatment ID.
 */
export function getTreatmentById(id: TreatmentId): TreatmentOption {
  const found = TREATMENTS.find((t) => t.id === id);
  return found ?? TREATMENTS[0];
}

/**
 * Reorder the 3 stacked category cards so the clicked category moves to the front (last element rendered on top).
 */
export function bringCategoryToFront(
  currentOrder: CategoryId[],
  targetId: CategoryId
): CategoryId[] {
  if (!currentOrder.includes(targetId)) {
    return currentOrder;
  }
  const withoutTarget = currentOrder.filter((id) => id !== targetId);
  return [...withoutTarget, targetId];
}

/**
 * Resolve ordered CategoryCardData objects from an array of CategoryIds.
 */
export function getOrderedCategories(order: CategoryId[]): CategoryCardData[] {
  return order
    .map((id) => CATEGORY_STACK.find((c) => c.id === id))
    .filter((c): c is CategoryCardData => Boolean(c));
}

/**
 * Map a treatment to its active 4-segment progress bar index (1..4).
 */
export function getProgressSegmentForTreatment(id: TreatmentId): 1 | 2 | 3 | 4 {
  return getTreatmentById(id).progressStage;
}

/**
 * Format compact metric counters (e.g., 4900 -> "4.9K").
 */
export function formatCompactCount(count: number, showExactDelta = false): string {
  if (count >= 1000) {
    if (showExactDelta && count % 100 !== 0) {
      return `${(count / 1000).toFixed(2)}K`;
    }
    return `${(count / 1000).toFixed(1)}K`;
  }
  return String(count);
}

/**
 * Toggle a like/bookmark counter and return next state.
 */
export function toggleMetricCounter(currentCount: number, isCurrentlyActive: boolean): {
  count: number;
  active: boolean;
} {
  return {
    count: isCurrentlyActive ? Math.max(0, currentCount - 1) : currentCount + 1,
    active: !isCurrentlyActive,
  };
}

/**
 * Generate a deterministic, clinically accurate concierge reply for Family Dental Care Karachi.
 */
export function generateConciergeReply(
  query: string,
  activeTreatmentId: TreatmentId,
  selectedLocation: string,
  selectedDate: string
): {
  replyText: string;
  suggestedTreatment: TreatmentId;
  estimatedPrice: string;
  recommendedSlot: string;
} {
  const trimmed = query.trim().toLowerCase();
  const currentTreatment = getTreatmentById(activeTreatmentId);

  const matchedTreatment =
    TREATMENTS.find((t) => trimmed.includes(t.id.toLowerCase())) ??
    (trimmed.includes('implant') || trimmed.includes('missing') || trimmed.includes('crown') || trimmed.includes('post')
      ? getTreatmentById('Implants')
      : trimmed.includes('veneer') || trimmed.includes('makeover')
      ? getTreatmentById('Veneers')
      : trimmed.includes('whiten') || trimmed.includes('bleach') || trimmed.includes('shade')
      ? getTreatmentById('Whitening')
      : trimmed.includes('aligner') || trimmed.includes('invisalign') || trimmed.includes('straight')
      ? getTreatmentById('Aligners')
      : trimmed.includes('brace')
      ? getTreatmentById('Braces')
      : trimmed.includes('root') || trimmed.includes('pain') || trimmed.includes('rct')
      ? getTreatmentById('Root Canal')
      : trimmed.includes('kid') || trimmed.includes('child')
      ? getTreatmentById('Kids Care')
      : trimmed.includes('gum') || trimmed.includes('bleed')
      ? getTreatmentById('Gum Care')
      : trimmed.includes('clean') || trimmed.includes('scal') || trimmed.includes('polish')
      ? getTreatmentById('Cleaning')
      : currentTreatment);

  if (
    trimmed.includes('address') ||
    trimmed.includes('where') ||
    trimmed.includes('location') ||
    trimmed.includes('jamshed') ||
    trimmed.includes('phone') ||
    trimmed.includes('hour')
  ) {
    return {
      replyText: `${CLINIC_INFO.name} (${CLINIC_INFO.reviewsCount}) is located at ${CLINIC_INFO.address}. We are ${CLINIC_INFO.hours}. Direct line / WhatsApp: ${CLINIC_INFO.phone}.`,
      suggestedTreatment: matchedTreatment.id,
      estimatedPrice: matchedTreatment.priceEstimate,
      recommendedSlot: `${selectedDate} (Open till 11:30 PM)`,
    };
  }

  if (trimmed.includes('price') || trimmed.includes('cost') || trimmed.includes('much') || trimmed.includes('pkr')) {
    return {
      replyText: `${matchedTreatment.name} at ${CLINIC_INFO.name} (${selectedLocation}) is ${matchedTreatment.priceEstimate} (${matchedTreatment.visitsCount}, ${matchedTreatment.durationPerVisit}). Includes ${matchedTreatment.consultationNote.toLowerCase()}.`,
      suggestedTreatment: matchedTreatment.id,
      estimatedPrice: matchedTreatment.priceEstimate,
      recommendedSlot: `${selectedDate} · Open till 11:30 PM`,
    };
  }

  if (trimmed.includes('book') || trimmed.includes('slot') || trimmed.includes('appointment') || trimmed.includes('schedule')) {
    return {
      replyText: `Evening & daytime slots are open for ${matchedTreatment.name} at ${CLINIC_INFO.shortAddress} (${selectedDate}, open daily until 11:30 PM). Call ${CLINIC_INFO.phone} or confirm right here.`,
      suggestedTreatment: matchedTreatment.id,
      estimatedPrice: matchedTreatment.priceEstimate,
      recommendedSlot: `${selectedDate} · 8:00 PM`,
    };
  }

  return {
    replyText: `${matchedTreatment.suiteTitle}: ${matchedTreatment.tagline}. Typically ${matchedTreatment.visitsCount} (${matchedTreatment.durationPerVisit}) at ${matchedTreatment.priceEstimate}. Open daily till 11:30 PM on Jamshed Rd, Karachi.`,
    suggestedTreatment: matchedTreatment.id,
    estimatedPrice: matchedTreatment.priceEstimate,
    recommendedSlot: `${selectedDate} · 7:30 PM`,
  };
}

export interface BookingFormInput {
  patientName: string;
  phoneOrEmail: string;
  location: string;
  treatment: TreatmentId;
  preferredDate: string;
}

export interface BookingValidationResult {
  valid: boolean;
  error?: string;
}

/**
 * Validate booking request form inputs without silently substituting empty fields.
 */
export function validateBookingRequest(input: BookingFormInput): BookingValidationResult {
  const name = input.patientName.trim();
  const contact = input.phoneOrEmail.trim();

  if (name.length < 2) {
    return { valid: false, error: 'Please enter your full name (at least 2 characters).' };
  }
  if (contact.length < 5 || (!contact.includes('@') && !/\d{3,}/.test(contact))) {
    return {
      valid: false,
      error: 'Please provide a valid mobile number (e.g. 0318-2014124) or email.',
    };
  }
  return { valid: true };
}
