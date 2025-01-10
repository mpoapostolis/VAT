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
  Dubai: [
    "Jebel Ali Free Zone (North-South)",
    "Dubai Cars and Automotive Zone (DUCAMZ)",
    "Dubai Textile City",
    "Al Quoz Industrial Free Zone",
    "Dubai Airport Free Zone (DAFZA)",
    "International Humanitarian City (Jebel Ali)",
    "Dubai CommerCity",
  ],
  Sharjah: ["Hamriyah Free Zone", "Sharjah Airport International Free Zone"],
  Ajman: ["Ajman Free Zone"],
  "Umm Al Quwain": ["Umm Al Quwain Free Trade Zone"],
  "Ras Al Khaimah": ["RAK Airport Free Zone", "RAK Maritime City Free Zone"],
  Fujairah: ["Fujairah Free Zone", "Fujairah Oil Industry Zone (FOIZ)"],
} as const;

export type Emirate = (typeof EMIRATES)[number];
export type BusinessType = (typeof BUSINESS_TYPES)[number];
export type ServiceType = (typeof SERVICE_TYPES)[number];
export type FreeZone = (typeof FREE_ZONES)[keyof typeof FREE_ZONES][number];

export interface Address {
  street: string;
  city: string;
  state?: string;
  postalCode?: string;
  country: string;
}

/**
 * Main company interface containing all company information
 */
export interface Company {
  id?: string;
  userId?: string;
  logo?: string | File;
  companyNameEN: string;
  companyNameAR?: string;
  tradeLicenseNumber: string;
  primaryBusinessType: string;
  businessTypeDescription?: string;
  serviceType?: string;
  emirate: string;
  freeZone?: boolean;
  Designated_Zone?: string;
  billingAddress: Address;
  shippingAddress?: Address;
  useShippingAddress?: boolean;
  contactPersonFirstName: string;
  contactPersonLastName: string;
  contactPersonPosition?: string;
  email: string;
  phoneNumber: string;
  website?: string;
  baseCurrency: string;
  defaultVatRate: number;
  defaultPaymentTermsDays: number;
  reverseChargeMechanism?: boolean;
  bankName: string;
  branch: string;
  accountNumber: string;
  swiftCode: string;
  accountCurrency: string;
  created?: string;
  updated?: string;
  registrationStatus?: "pending" | "approved" | "rejected";
  isActive?: boolean;
}

export type CompanyFormData = Omit<Company, "id" | "created" | "updated">;
