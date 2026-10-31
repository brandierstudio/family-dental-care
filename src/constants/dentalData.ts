export type TreatmentId =
  | 'Whitening'
  | 'Aligners'
  | 'Implants'
  | 'Braces'
  | 'Root Canal'
  | 'Veneers'
  | 'Cleaning'
  | 'Kids Care'
  | 'Gum Care';

export type CategoryId = 'Cosmetic' | 'Orthodontic' | 'Surgical';

export interface TreatmentOption {
  id: TreatmentId;
  name: TreatmentId;
  category: CategoryId;
  suiteTitle: string;
  tagline: string;
  description: string;
  durationPerVisit: string;
  visitsCount: string;
  specialistsCount: string;
  consultationNote: string;
  priceEstimate: string;
  leadDoctor: string;
  floorLocation: string;
  progressStage: 1 | 2 | 3 | 4;
  accentHue: string;
  clinicalHighlights: [string, string, string];
  modelMode:
    | 'whitening-arch'
    | 'aligner-arch'
    | 'implant-assembly'
    | 'braces-arch'
    | 'root-canal-molar'
    | 'veneer-incisors'
    | 'airflow-arch'
    | 'pediatric-arch'
    | 'laser-gum-arch';
}

export interface CategoryCardData {
  id: CategoryId;
  title: CategoryId;
  subtitle: string;
  activePatientsText: string;
  treatments: TreatmentId[];
  specialistLead: string;
  completionRate: string;
}

export interface BeforeAfterCase {
  id: string;
  patientName: string;
  age: number;
  treatment: TreatmentId;
  duration: string;
  shadeImprovement: string;
  summary: string;
  rotationDeg: number;
  offsetX: number;
  offsetY: number;
  beforeNote: string;
  afterNote: string;
}

export interface AvatarProfile {
  id: string;
  name: string;
  role: string;
  initials: string;
  bgTint: string;
  accentTint: string;
  quote?: string;
}

export const CLINIC_INFO = {
  name: 'Family Dental Care',
  shortName: 'FDC Karachi',
  rating: 4.9,
  reviewsCount: '4.9 ★ Google Verified',
  phone: '+92 318 2014124',
  phoneDial: '+923182014124',
  address:
    'Shop 1 & 2, 3 Jamshed Road, near Yadgar Fish, Jamshed Quarters, Jail Road, Karachi, 69000',
  shortAddress: 'Shop 1 & 2, 3 Jamshed Rd, near Yadgar Fish, Karachi',
  plusCode: 'V3P2+96 Government Quarters, Jail Road, Karachi',
  coordinates: { lat: 24.8859921, lng: 67.0505936 },
  hours: 'Open Daily · Closes 11:30 PM',
  kgmid: '/g/11k9hf26k6',
} as const;

export const CLINIC_LOCATIONS = [
  {
    id: 'jamshed-main',
    name: 'Jamshed Rd (Main)',
    address: 'Shop 1 & 2, 3 Jamshed Rd, near Yadgar Fish, Jail Rd, Karachi',
    NextSlot: 'Today, 6:30 PM',
  },
  {
    id: 'implant-wing',
    name: 'Implant & Crown Suite',
    address: 'Suite 2, 3 Jamshed Rd, Jamshed Quarters, Karachi',
    NextSlot: 'Today, 8:00 PM',
  },
  {
    id: 'dha-wing',
    name: 'DHA Phase 6 Consult',
    address: 'Lane 1, Shahbaz Commercial, Phase 6 DHA, Karachi',
    NextSlot: 'Tomorrow, 5:00 PM',
  },
  {
    id: 'shaheed-millat',
    name: 'Shaheed-e-Millat Wing',
    address: 'Block 3, Shaheed-e-Millat Rd, Karachi',
    NextSlot: 'Tomorrow, 7:30 PM',
  },
] as const;

export const PREFERRED_DATES = [
  'Tonight, 7:30 PM',
  'Tomorrow, 5:00 PM',
  'This Friday Evening',
  'This Saturday',
  'Emergency Same-Day',
] as const;

export const HERO_CONTENT = {
  headlineLines: ['A New Way', 'To Smile'],
  introParagraph:
    'Family Dental Care on Jamshed Road, Karachi delivers 4.9-star rated implantology, cosmetic veneers, single-sitting root canals, and gentle family dentistry — open daily until 11:30 PM.',
  bottomLeftCard: {
    title: 'Family Dental Care · Karachi',
    body: 'Located at Shop 1 & 2, 3 Jamshed Road near Yadgar Fish (Jail Road). Trusted by families across Karachi for painless, precision dental care.',
    statTarget: 10,
    statSuffix: 'K+',
    statCaption: 'Happy Patients · 4.9 ★ Rating',
  },
  rightGlassCard: {
    defaultTitle: 'Implant & Smile Makeover Suite',
    location: 'Shop 1 & 2, 3 Jamshed Rd, Jail Road, Karachi',
    description:
      'Complete 3D-guided titanium implants, monolithic zirconia crowns, ultrasonic scaling, and photo-activated whitening with evening appointments until 11:30 PM.',
    meta: [
      { id: 'time', label: 'Open till 11:30 PM', icon: 'clock' },
      { id: 'visits', label: '4.9 ★ Google Rated', icon: 'calendar' },
      { id: 'specialists', label: '+92 318 2014124', icon: 'users' },
      { id: 'consult', label: 'Same-day emergency', icon: 'sparkles' },
    ],
    initialLikes: 4900,
    initialBookmarks: 312,
  },
} as const;

export const DOCTOR_PROFILE: AvatarProfile = {
  id: 'dr-lead',
  name: 'Dr. Salman & Associates, BDS, RDS',
  role: 'Lead Implantologist & Family Dental Surgeon — Karachi',
  initials: 'FD',
  bgTint: '#E6E4F8',
  accentTint: '#1E1750',
  quote:
    'We stay open until 11:30 PM every night on Jamshed Road so working families and emergency patients never have to wait in pain.',
};

export const PATIENT_AVATARS: AvatarProfile[] = [
  {
    id: 'pat-1',
    name: 'Tariq Mahmood',
    role: 'Front Incisor Titanium Implant & Crown',
    initials: 'TM',
    bgTint: '#FDE8DF',
    accentTint: '#F28B5B',
    quote: 'Got my front tooth implant abutment and zirconia crown placed seamlessly with zero pain.',
  },
  {
    id: 'pat-2',
    name: 'Ayesha Siddiqui',
    role: 'Laser Teeth Whitening & Scaling',
    initials: 'AS',
    bgTint: '#DDF6F1',
    accentTint: '#1E1750',
    quote: 'Spotless sterilization, gentle ultrasonic polishing, and convenient 9 PM appointment slot.',
  },
  {
    id: 'pat-3',
    name: 'Bilal Ahmed',
    role: 'Single-Sitting Rotary Root Canal',
    initials: 'BA',
    bgTint: '#E5E3F9',
    accentTint: '#1E1750',
    quote: 'Visited at 10 PM with severe molar pain—relieved in 45 minutes with digital endo.',
  },
];

export const TREATMENTS: TreatmentOption[] = [
  {
    id: 'Implants',
    name: 'Implants',
    category: 'Surgical',
    suiteTitle: 'Titanium Dental Implants & Zirconia Crowns',
    tagline: 'Permanent root replacement with natural shade-matched German zirconia crowns',
    description:
      'Replace missing teeth permanently at Family Dental Care Karachi. We use biocompatible Grade-5 titanium root fixtures paired with precision-milled custom abutments and natural monolithic zirconia crowns.',
    durationPerVisit: '45–60 min per visit',
    visitsCount: '2–3 visits',
    specialistsCount: '2 implant surgeons',
    consultationNote: 'Digital X-ray assessment',
    priceEstimate: 'PKR 75,000 – 135,000 per implant',
    leadDoctor: 'Dr. Salman & Implant Team · Jamshed Rd',
    floorLocation: 'Shop 1 & 2, 3 Jamshed Rd, Jail Road, Karachi',
    progressStage: 3,
    accentHue: '#F28B5B',
    clinicalHighlights: [
      'Swiss & Korean Grade-5 SLA titanium fixtures',
      'Custom-milled emergence abutment for healthy gums',
      'German monolithic zirconia crown matched to natural teeth',
    ],
    imageUrl:
      'https://images.unsplash.com/photo-1629909613654-28e377c37b09?auto=format&fit=crop&w=1200&q=85',
    imageAlt: 'Modern dental implant and restorative suite at Family Dental Care',
    recoveryTime: '24–48 hrs mild recovery',
    warrantyNote: '10-Year Fixture Warranty',
    modelMode: 'implant-assembly',
  },
  {
    id: 'Whitening',
    name: 'Whitening',
    category: 'Cosmetic',
    suiteTitle: 'Laser & LED Teeth Whitening + Ultrasonic Polish',
    tagline: 'Up to 8 shades brighter in a single 45-minute evening session',
    description:
      'Safe cold-light LED activation combined with full-mouth ultrasonic scaling and desensitizing mineral gel removes tea, coffee, and tough staining without harming enamel.',
    durationPerVisit: '45 min per visit',
    visitsCount: '1 visit',
    specialistsCount: '2 specialists',
    consultationNote: 'Free shade evaluation',
    priceEstimate: 'PKR 15,000 – 25,000 complete session',
    leadDoctor: 'Cosmetic Dental Team · Jamshed Rd',
    floorLocation: 'Shop 1 & 2, 3 Jamshed Rd, Karachi',
    progressStage: 1,
    accentHue: '#5CD6C0',
    clinicalHighlights: [
      'Includes full-mouth ultrasonic scaling & polishing',
      'Desensitizing hydroxyapatite mineral enamel seal',
      'Available daily until 11:30 PM on Jamshed Road',
    ],
    imageUrl:
      'https://images.unsplash.com/photo-1606811841689-23dfddce3e95?auto=format&fit=crop&w=1200&q=85',
    imageAlt: 'Bright healthy smile after professional dental whitening session',
    recoveryTime: 'Immediate normal diet (white diet 24h)',
    warrantyNote: 'Shade-guide verified results',
    modelMode: 'whitening-arch',
  },
  {
    id: 'Aligners',
    name: 'Aligners',
    category: 'Orthodontic',
    suiteTitle: 'Clear Aligners & Invisible Orthodontics',
    tagline: 'Removable transparent trays mapped with digital arch scanning',
    description:
      'Straighten crowded or spaced teeth discreetly without metal brackets. Custom-fabricated clear aligner trays gently guide teeth into alignment while remaining removable for meals.',
    durationPerVisit: '30 min check-in',
    visitsCount: '4–6 check-ins',
    specialistsCount: '2 orthodontists',
    consultationNote: 'Digital arch consult',
    priceEstimate: 'PKR 130,000 – 220,000 full arch',
    leadDoctor: 'Orthodontic Consultant · FDC Karachi',
    floorLocation: 'Shop 1 & 2, 3 Jamshed Rd, Karachi',
    progressStage: 2,
    accentHue: '#8A84E2',
    clinicalHighlights: [
      'Virtually invisible BPA-free medical polymer trays',
      'Removable for meals, brushing, and family events',
      'Flexible monthly installment plans available',
    ],
    imageUrl:
      'https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?auto=format&fit=crop&w=1200&q=85',
    imageAlt: 'Specialist examining clear orthodontic aligner progress',
    recoveryTime: 'Zero downtime',
    warrantyNote: 'Refinement trays included',
    modelMode: 'aligner-arch',
  },
  {
    id: 'Braces',
    name: 'Braces',
    category: 'Orthodontic',
    suiteTitle: 'Ceramic & Metal Orthodontic Braces',
    tagline: 'Precision bracket alignment for teens and adults',
    description:
      'Low-profile American metallic or tooth-colored ceramic brackets paired with gentle nickel-titanium archwires for reliable bite and crowding correction.',
    durationPerVisit: '30 min adjustment',
    visitsCount: 'Monthly check-ups',
    specialistsCount: '2 orthodontists',
    consultationNote: 'Free ortho consult',
    priceEstimate: 'PKR 70,000 – 125,000 complete treatment',
    leadDoctor: 'Orthodontic Consultant · FDC Karachi',
    floorLocation: 'Shop 1 & 2, 3 Jamshed Rd, Karachi',
    progressStage: 2,
    accentHue: '#74B3CE',
    clinicalHighlights: [
      'Choice of crystal-clear ceramic or low-profile metal',
      'Gentle thermal NiTi wires reduce adjustment soreness',
      'Evening adjustment slots after school and office hours',
    ],
    imageUrl:
      'https://images.unsplash.com/photo-1598256989800-fe5f95da9787?auto=format&fit=crop&w=1200&q=85',
    imageAlt: 'Orthodontic braces consultation and adjustment',
    recoveryTime: '1–2 days mild adjustment pressure',
    warrantyNote: 'Retainers included on completion',
    modelMode: 'braces-arch',
  },
  {
    id: 'Root Canal',
    name: 'Root Canal',
    category: 'Surgical',
    suiteTitle: 'Single-Sitting Rotary Root Canal (RCT)',
    tagline: 'Painless digital rotary endodontics for immediate toothache relief',
    description:
      'Save infected or deeply decayed natural teeth in a single comfortable sitting using electronic apex locators, rotary NiTi files, and protective zirconia or PFM crowns.',
    durationPerVisit: '45 min per visit',
    visitsCount: '1–2 visits',
    specialistsCount: '2 endodontists',
    consultationNote: 'Same-day emergency slot',
    priceEstimate: 'PKR 12,000 – 22,000 (RCT) + Crown options',
    leadDoctor: 'Endodontic Specialist · FDC Karachi',
    floorLocation: 'Shop 1 & 2, 3 Jamshed Rd, Karachi',
    progressStage: 3,
    accentHue: '#F28B5B',
    clinicalHighlights: [
      'Digital apex locator & rotary NiTi root cleaning',
      'Profound local anesthesia for pain-free treatment',
      'Late-night emergency toothache relief until 11:30 PM',
    ],
    imageUrl:
      'https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&w=1200&q=85',
    imageAlt: 'Endodontic specialist performing precision root canal therapy',
    recoveryTime: 'Immediate pain relief',
    warrantyNote: 'Digital radiograph verified',
    modelMode: 'root-canal-molar',
  },
  {
    id: 'Veneers',
    name: 'Veneers',
    category: 'Cosmetic',
    suiteTitle: 'E-Max Porcelain & Composite Veneers',
    tagline: 'Ultra-thin ceramic shells for gaps, chipped teeth, and lasting symmetry',
    description:
      'Transform worn, chipped, or spaced front teeth using custom lithium-disilicate E-Max porcelain veneers or single-visit nano-hybrid composite bonding.',
    durationPerVisit: '45 min per visit',
    visitsCount: '2 visits',
    specialistsCount: '2 aesthetic dentists',
    consultationNote: 'Smile design preview',
    priceEstimate: 'PKR 18,000 – 38,000 per unit',
    leadDoctor: 'Aesthetic Prosthodontist · FDC Karachi',
    floorLocation: 'Shop 1 & 2, 3 Jamshed Rd, Karachi',
    progressStage: 4,
    accentHue: '#5CD6C0',
    clinicalHighlights: [
      'Natural enamel translucency and custom shade matching',
      'Minimal-prep enamel conservation technique',
      'Stain-resistant glazed E-Max ceramic finish',
    ],
    imageUrl:
      'https://images.unsplash.com/photo-1537368910025-700350fe46c7?auto=format&fit=crop&w=1200&q=85',
    imageAlt: 'Cosmetic dentist consulting with patient on porcelain veneers',
    recoveryTime: 'Zero downtime',
    warrantyNote: '5-Year Ceramic Integrity Guarantee',
    modelMode: 'veneer-incisors',
  },
  {
    id: 'Cleaning',
    name: 'Cleaning',
    category: 'Cosmetic',
    suiteTitle: 'Ultrasonic Scaling & Stain Polishing',
    tagline: 'Gentle piezoelectric tartar removal and fluoride enamel polish',
    description:
      'Remove hardened calculus, plaque biofilm, and surface stains around the gumline using fine ultrasonic vibrations and smooth prophy paste polishing.',
    durationPerVisit: '30 min session',
    visitsCount: '1 visit',
    specialistsCount: '1 dental surgeon',
    consultationNote: 'Walk-ins welcome',
    priceEstimate: 'PKR 4,500 – 8,000 full mouth scaling & polish',
    leadDoctor: 'Preventive Care Team · FDC Karachi',
    floorLocation: 'Shop 1 & 2, 3 Jamshed Rd, Karachi',
    progressStage: 1,
    accentHue: '#5CD6C0',
    clinicalHighlights: [
      'Piezoelectric ultrasonic tip protects enamel surface',
      'Stops gum bleeding and freshens breath immediately',
      'Includes full 32-tooth clinical check-up',
    ],
    imageUrl:
      'https://images.unsplash.com/photo-1609840114035-3c981b782dfe?auto=format&fit=crop&w=1200&q=85',
    imageAlt: 'Dental hygiene and ultrasonic scaling instruments',
    recoveryTime: 'Immediate normal routine',
    warrantyNote: 'Recommended every 6 months',
    modelMode: 'airflow-arch',
  },
  {
    id: 'Kids Care',
    name: 'Kids Care',
    category: 'Orthodontic',
    suiteTitle: 'Gentle Pediatric & Family Dentistry',
    tagline: 'Fear-free check-ups, fissure sealants, and painless milk-tooth care',
    description:
      'Warm, patient dental care for children of all ages—covering protective fluoride varnish, tooth-colored fillings, space maintainers, and gentle extractions.',
    durationPerVisit: '25 min per visit',
    visitsCount: '1 visit',
    specialistsCount: '2 family dentists',
    consultationNote: 'Family check-up plans',
    priceEstimate: 'PKR 3,000 – 6,500 pediatric procedure',
    leadDoctor: 'Family Dental Surgeon · FDC Karachi',
    floorLocation: 'Shop 1 & 2, 3 Jamshed Rd, Karachi',
    progressStage: 2,
    accentHue: '#98D8C8',
    clinicalHighlights: [
      'Flavored topical numbing gel before any procedure',
      'Protective molar fissure sealants against cavities',
      'Convenient evening hours after school until 11:30 PM',
    ],
    imageUrl:
      'https://images.unsplash.com/photo-1588776814546-daab30f310ce?auto=format&fit=crop&w=1200&q=85',
    imageAlt: 'Friendly pediatric dental care in a calm clinic setting',
    recoveryTime: 'Zero downtime',
    warrantyNote: 'BPA-free pediatric sealants',
    modelMode: 'pediatric-arch',
  },
  {
    id: 'Gum Care',
    name: 'Gum Care',
    category: 'Surgical',
    suiteTitle: 'Periodontal Gum Therapy & Deep Curettage',
    tagline: 'Restore firm, healthy pink gums and stop gum bleeding',
    description:
      'Targeted sub-gingival root planing, antibacterial irrigation, and gum contouring to treat bleeding gums, recession, and periodontal sensitivity.',
    durationPerVisit: '40 min per visit',
    visitsCount: '1–2 visits',
    specialistsCount: '2 specialists',
    consultationNote: 'Gum health charting',
    priceEstimate: 'PKR 8,000 – 18,000 periodontal therapy',
    leadDoctor: 'Periodontal Specialist · FDC Karachi',
    floorLocation: 'Shop 1 & 2, 3 Jamshed Rd, Karachi',
    progressStage: 4,
    accentHue: '#F28B5B',
    clinicalHighlights: [
      'Stops gum bleeding, swelling, and recession',
      'Deep pocket disinfection around natural roots',
      'Gentle gum-line contouring for balanced smiles',
    ],
    imageUrl:
      'https://images.unsplash.com/photo-1551076805-e1869033e561?auto=format&fit=crop&w=1200&q=85',
    imageAlt: 'Specialist periodontal care and clinical consultation',
    recoveryTime: '24 hrs gentle rinse protocol',
    warrantyNote: 'Includes follow-up gum review',
    modelMode: 'laser-gum-arch',
  },
];

export const TREATMENT_CHIPS: TreatmentId[] = [
  'Implants',
  'Whitening',
  'Aligners',
  'Braces',
  'Root Canal',
  'Veneers',
  'Cleaning',
  'Kids Care',
  'Gum Care',
];

export const CATEGORY_STACK: CategoryCardData[] = [
  {
    id: 'Cosmetic',
    title: 'Cosmetic',
    subtitle: 'E-Max Veneers, LED Whitening & Scaling',
    activePatientsText: '4.2K Karachi smiles brightened',
    treatments: ['Whitening', 'Veneers', 'Cleaning'],
    specialistLead: 'Aesthetic Team · Jamshed Rd',
    completionRate: '4.9 ★ Google Rating',
  },
  {
    id: 'Orthodontic',
    title: 'Orthodontic',
    subtitle: 'Clear Aligners, Ceramic Braces & Kids',
    activePatientsText: '3.6K aligned arches',
    treatments: ['Aligners', 'Braces', 'Kids Care'],
    specialistLead: 'Ortho Consultant · FDC',
    completionRate: 'Flexible monthly plans',
  },
  {
    id: 'Surgical',
    title: 'Surgical',
    subtitle: 'Titanium Implants, Rotary RCT & Gum Care',
    activePatientsText: '2.9K implants & root rescues',
    treatments: ['Implants', 'Root Canal', 'Gum Care'],
    specialistLead: 'Implant & Endo Surgeons',
    completionRate: 'Open daily till 11:30 PM',
  },
];

export const BEFORE_AFTER_CASES: BeforeAfterCase[] = [
  {
    id: 'case-1',
    patientName: 'Tariq M. (Karachi)',
    age: 52,
    treatment: 'Implants',
    duration: 'Titanium Post + Zirconia Crown',
    shadeImprovement: 'Upper Right Central Incisor',
    summary:
      'Placed a precision titanium implant fixture and custom milled abutment for a missing upper right central incisor, finished with a natural shade-matched zirconia crown.',
    rotationDeg: -12,
    offsetX: -36,
    offsetY: 8,
    beforeNote: 'Missing upper front incisor with titanium abutment prep',
    afterNote: 'Seamless monolithic zirconia crown matching adjacent teeth',
    imageUrl:
      'https://images.unsplash.com/photo-1629909613654-28e377c37b09?auto=format&fit=crop&w=480&q=80',
  },
  {
    id: 'case-2',
    patientName: 'Zainab K.',
    age: 29,
    treatment: 'Veneers',
    duration: '2 Visits (7 Days)',
    shadeImprovement: '+6 VITA Shades (E-Max)',
    summary:
      'Closed front gap and restored chipped enamel edges with 6 ultra-thin E-Max porcelain veneers at our Jamshed Road clinic.',
    rotationDeg: -4,
    offsetX: -12,
    offsetY: 2,
    beforeNote: 'Midline diastema & uneven incisal edges',
    afterNote: 'Balanced arch symmetry with natural enamel translucency',
    imageUrl:
      'https://images.unsplash.com/photo-1606811841689-23dfddce3e95?auto=format&fit=crop&w=480&q=80',
  },
  {
    id: 'case-3',
    patientName: 'Usman A.',
    age: 34,
    treatment: 'Whitening',
    duration: '1 Evening Visit (45 Min)',
    shadeImprovement: '+7 Shades + Scaling',
    summary:
      'Full-mouth piezoelectric scaling and photo-activated LED whitening lifting years of tea and coffee staining in one sitting.',
    rotationDeg: 5,
    offsetX: 14,
    offsetY: 3,
    beforeNote: 'Heavy calculus & extrinsic tea/coffee staining',
    afterNote: 'Clean gingival margins & luminous B1 enamel shade',
    imageUrl:
      'https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?auto=format&fit=crop&w=480&q=80',
  },
  {
    id: 'case-4',
    patientName: 'Hina S.',
    age: 23,
    treatment: 'Aligners',
    duration: '16 Weeks',
    shadeImprovement: 'Digital Arch Alignment',
    summary:
      'Corrected anterior crowding using 16 sequential transparent aligner trays with evening progress check-ins.',
    rotationDeg: 13,
    offsetX: 38,
    offsetY: 10,
    beforeNote: 'Rotated upper lateral incisors & lower crowding',
    afterNote: 'Broad, aligned smile arch without metal brackets',
    imageUrl:
      'https://images.unsplash.com/photo-1598256989800-fe5f95da9787?auto=format&fit=crop&w=480&q=80',
  },
];
