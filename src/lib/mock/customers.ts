import { Customer } from '@/types';

export const mockCustomers: Customer[] = [
  {
    id: '1',
    name: 'Acme Corporation',
    vatNumber: 'GB123456789',
    email: 'billing@acme.com',
    address: {
      street: '123 Business Avenue',
      city: 'London',
      postalCode: 'EC1A 1BB',
      country: 'United Kingdom'
    },
    isZeroRated: false,
    currency: 'GBP'
  },
  {
    id: '2',
    name: 'TechStart Solutions',
    vatNumber: 'DE987654321',
    email: 'accounts@techstart.de',
    address: {
      street: 'Innovationstraße 42',
      city: 'Berlin',
      postalCode: '10115',
      country: 'Germany'
    },
    isZeroRated: false,
    currency: 'EUR'
  },
  {
    id: '3',
    name: 'Global Exports Ltd',
    vatNumber: 'FR456789123',
    email: 'finance@globalexports.fr',
    address: {
      street: '789 Avenue des Affaires',
      city: 'Paris',
      postalCode: '75001',
      country: 'France'
    },
    isZeroRated: true,
    currency: 'EUR'
  }
];