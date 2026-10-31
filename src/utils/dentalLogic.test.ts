import test from 'node:test';
import assert from 'node:assert/strict';
import {
  bringCategoryToFront,
  formatCompactCount,
  generateConciergeReply,
  getProgressSegmentForTreatment,
  getTreatmentById,
  toggleMetricCounter,
  validateBookingRequest,
} from './dentalLogic';

test('getTreatmentById returns matching treatment data with 3D modelMode', () => {
  const implants = getTreatmentById('Implants');
  assert.equal(implants.id, 'Implants');
  assert.equal(implants.category, 'Surgical');
  assert.equal(implants.modelMode, 'implant-assembly');
});

test('bringCategoryToFront moves target category to the front of the stack (last index)', () => {
  const initial: ('Cosmetic' | 'Orthodontic' | 'Surgical')[] = [
    'Surgical',
    'Orthodontic',
    'Cosmetic',
  ];
  const updated = bringCategoryToFront(initial, 'Surgical');
  assert.deepEqual(updated, ['Orthodontic', 'Cosmetic', 'Surgical']);
});

test('getProgressSegmentForTreatment maps treatments across all 4 segments', () => {
  assert.equal(getProgressSegmentForTreatment('Whitening'), 1);
  assert.equal(getProgressSegmentForTreatment('Aligners'), 2);
  assert.equal(getProgressSegmentForTreatment('Implants'), 3);
  assert.equal(getProgressSegmentForTreatment('Veneers'), 4);
});

test('toggleMetricCounter and formatCompactCount update and format counts accurately', () => {
  assert.equal(formatCompactCount(4900), '4.9K');
  const liked = toggleMetricCounter(4900, false);
  assert.equal(liked.active, true);
  assert.equal(liked.count, 4901);
  assert.equal(formatCompactCount(liked.count, true), '4.90K');

  const unliked = toggleMetricCounter(liked.count, true);
  assert.equal(unliked.active, false);
  assert.equal(unliked.count, 4900);
});

test('generateConciergeReply responds to pricing and location queries for Family Dental Care Karachi', () => {
  const priceReply = generateConciergeReply(
    'How much do implants cost?',
    'Whitening',
    'Jamshed Rd (Main)',
    'Tonight, 7:30 PM'
  );
  assert.equal(priceReply.suggestedTreatment, 'Implants');
  assert.ok(priceReply.replyText.includes('PKR 75,000'));

  const addressReply = generateConciergeReply(
    'Where is the Jamshed Road clinic located?',
    'Implants',
    'Jamshed Rd (Main)',
    'Tonight, 7:30 PM'
  );
  assert.ok(addressReply.replyText.includes('Jamshed Road'));
  assert.ok(addressReply.replyText.includes('+92 318 2014124'));
});

test('validateBookingRequest rejects empty inputs and accepts valid patient details', () => {
  const invalidName = validateBookingRequest({
    patientName: ' ',
    phoneOrEmail: '03182014124',
    location: 'Jamshed Rd (Main)',
    treatment: 'Implants',
    preferredDate: 'Tonight, 7:30 PM',
  });
  assert.equal(invalidName.valid, false);

  const valid = validateBookingRequest({
    patientName: 'Tariq Mahmood',
    phoneOrEmail: '+92 318 2014124',
    location: 'Jamshed Rd (Main)',
    treatment: 'Implants',
    preferredDate: 'Tonight, 7:30 PM',
  });
  assert.equal(valid.valid, true);
});
