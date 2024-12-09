export interface ContactPerson {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
}

export interface Address {
  street: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
}

export interface BankDetails {
  bankName: string;
  branch: string;
  accountNumber: string;
  swiftCode?: string;
}

export interface Company {
  id?: string;
  companyNameEn: string;
  companyNameAr: string;
  tradeLicenseNumber: string;
  primaryBusinessType: string;
  businessTypeDescription?: string;
  emirate: string;
  freeZone?: string;
  billingAddress: Address;
  shippingAddress?: Address;
  contactPerson: ContactPerson;
  website?: string;
  logo?: string;
  baseCurrency: string;
  defaultVatRate: number;
  bankDetails?: BankDetails;
  defaultPaymentTerms: number;
  reverseChargeMechanism: boolean;
  created?: string;
  updated?: string;
}

export const EMIRATES = [
  'Abu Dhabi',
  'Dubai',
  'Sharjah',
  'Ajman',
  'Umm Al Quwain',
  'Ras Al Khaimah',
  'Fujairah'
] as const;

export const BUSINESS_TYPES = [
  'Trading',
  'Manufacturing',
  'Services',
  'Real Estate',
  'Technology',
  'Retail',
  'Other'
] as const;

export const FREE_ZONES = {
  'Dubai': [
    'Dubai Multi Commodities Centre (DMCC)',
    'Dubai International Financial Centre (DIFC)',
    'Jebel Ali Free Zone (JAFZA)',
    'Dubai Airport Free Zone (DAFZA)',
    'Dubai Silicon Oasis (DSO)'
  ],
  'Abu Dhabi': [
    'Abu Dhabi Global Market (ADGM)',
    'Khalifa Industrial Zone Abu Dhabi (KIZAD)',
    'twofour54'
  ]
} as const;
