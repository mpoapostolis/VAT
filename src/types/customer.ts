export interface Customer {
  id: string;
  isCompany: boolean;
  companyName: string;
  billingAddress: string;
  useShippingAddress: boolean;
  shippingAddress?: string;
  contactFirstName: string;
  contactLastName: string;
  email: string;
  phoneNumber: string;
  taxRegistrationNumber?: string;
  country: string;
  businessType: string;
  relationship: "Client" | "Vendor" | "Other";
  isActive?: boolean;
  created: string;
  updated: string;
}
