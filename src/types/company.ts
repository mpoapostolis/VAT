/**
 * Constants and types for company-related data
 */

export const EMIRATES = [
  "Abu Dhabi",
  "Dubai",
  "Sharjah",
  "Ajman",
  "Umm Al Quwain",
  "Ras Al Khaimah",
  "Fujairah",
] as const;

export const BUSINESS_TYPES = [
  "Manufacturer",
  "Distributor",
  "Service Provider",
  "Importer",
  "Exporter",
  "Logistics Provider",
  "Construction Contractor",
  "Retailer",
  "Financial Services Provider",
  "Education Provider",
  "Healthcare Provider",
  "Other",
] as const;

export const SERVICE_TYPES = [
  "Trading (Involves the sale or resale of goods)",
  "Manufacturing (Production or assembly of goods)",
  "Logistics and Warehousing (Transport, storage, and distribution of goods)",
  "Professional Services (Consulting, IT services, legal, and other expertise-based offerings)",
  "Construction and Real Estate (Includes commercial and residential property development)",
  "Education (Schools, universities, and training providers)",
  "Healthcare (Hospitals, clinics, and related medical services)",
  "Financial Services (Banks, insurance companies, and other financial institutions)",
  "Hospitality and Tourism (Hotels, restaurants, and travel agencies)",
  "Oil, Gas, and Energy (Extraction, refining, and distribution of energy-related resources)",
  "Non-Profit and Charitable Activities (Registered charities and not-for-profit organizations)",
  "Retail and E-Commerce (Sale of goods directly to consumers via stores or online platforms)",
  "Free Zone Business (Activities within Free Zones or Designated Zones)",
  "Transportation (Includes air, sea, and land transport of passengers or goods)",
] as const;

export const FREE_ZONES: Record<string, readonly string[]> = {
  "Abu Dhabi": [
    "Free Trade Zone of Khalifa Port",
    "Abu Dhabi Airport Free Zone",
    "Khalifa Industrial Zone",
    "Al Ain International Airport Free Zone",
    "Al Bateen Executive Airport Free Zone",
  ],
  "Dubai": [
    "Jebel Ali Free Zone (North-South)",
    "Dubai Cars and Automotive Zone (DUCAMZ)",
    "Dubai Textile City",
    "Al Quoz Industrial Free Zone",
    "Dubai Airport Free Zone (DAFZA)",
    "International Humanitarian City (Jebel Ali)",
    "Dubai CommerCity",
  ],
  "Sharjah": [
    "Hamriyah Free Zone",
    "Sharjah Airport International Free Zone",
  ],
  "Ajman": [
    "Ajman Free Zone",
  ],
  "Umm Al Quwain": [
    "Umm Al Quwain Free Trade Zone",
  ],
  "Ras Al Khaimah": [
    "RAK Airport Free Zone",
    "RAK Maritime City Free Zone",
  ],
  "Fujairah": [
    "Fujairah Free Zone",
    "Fujairah Oil Industry Zone (FOIZ)",
  ],
} as const;

export type Emirate = typeof EMIRATES[number];
export type BusinessType = typeof BUSINESS_TYPES[number];
export type ServiceType = typeof SERVICE_TYPES[number];
export type FreeZone = typeof FREE_ZONES[keyof typeof FREE_ZONES][number];

/**
 * Address information for a company
 */
export interface Address {
  street: string;
  city: string;
  state?: string;
  postalCode?: string;
  country: string;
}

/**
 * Contact person information
 */
export interface ContactPerson {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  position?: string;
}

/**
 * Bank account details
 */
export interface BankDetails {
  bankName: string;
  branch: string;
  accountNumber: string; // IBAN for UAE accounts
  swiftCode: string; // BIC/SWIFT code for international transactions
  accountCurrency?: string;
}

/**
 * Main company interface containing all company information
 */
export interface Company {
  id?: string;
  
  // Basic Information
  companyNameEn: string;          // Full registered name in English
  companyNameAr: string;          // Full registered name in Arabic
  tradeLicenseNumber: string;     // Unique license number
  primaryBusinessType: BusinessType;
  serviceType: ServiceType;
  businessTypeDescription?: string; // Mandatory if primaryBusinessType is "Other"
  
  // Location Information
  emirate: Emirate;               // Mandatory
  freeZone?: FreeZone;           // Optional - Designated Zone
  billingAddress: Address;        // Mandatory
  useShippingAddress?: boolean;
  shippingAddress?: Address;      // Optional
  
  // Contact Information
  contactPerson: ContactPerson;
  website?: string;              // Optional
  logo?: string;                 // Optional
  
  // Financial Information
  baseCurrency: string;          // Fixed as "AED"
  defaultVatRate: number;        // Default: 5%
  defaultPaymentTerms: number;   // In calendar days
  reverseChargeMechanism: boolean;
  bankDetails?: BankDetails;     // Optional
  
  // System Fields
  createdAt?: string;
  updatedAt?: string;
  isActive?: boolean;
  registrationStatus?: "pending" | "active" | "suspended" | "cancelled";
}
