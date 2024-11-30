import PocketBase from 'pocketbase';

// Initialize PocketBase
export const pb = new PocketBase('https://api.vxlverse.com');

// Collection names
export const collections = {
  users: 'users',
  customers: 'customers',
  suppliers: 'suppliers',
  invoices: 'invoices',
  vatReturns: 'vat_returns',
  payments: 'payments',
} as const;

// Helper function to check if user is authenticated
export const isAuthenticated = () => {
  if (process.env.NODE_ENV === 'development') {
    return true; // Always return true in development
  }
  return pb.authStore.isValid;
};

// Helper function to get current user
export const getCurrentUser = () => {
  if (process.env.NODE_ENV === 'development') {
    return {
      id: '1',
      email: 'dev@example.com',
      name: 'Development User',
    };
  }
  return pb.authStore.model;
};

// Helper function to handle API errors
export const handleApiError = (error: any) => {
  if (process.env.NODE_ENV === 'development') {
    console.warn('API Error in development mode:', error);
    return 'Development mode: Operation would have failed in production';
  }
  console.error('API Error:', error);
  if (error.response?.data?.message) {
    return error.response.data.message;
  }
  return 'An unexpected error occurred';
};