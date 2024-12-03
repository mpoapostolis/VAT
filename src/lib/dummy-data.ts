export const dummyInvoices = [
  {
    id: '1',
    number: 'INV-2024-001',
    customerId: '1',
    date: '2024-03-01',
    dueDate: '2024-03-31',
    status: 'pending',
    subtotal: 5000,
    vat: 250,
    total: 5250,
    items: [
      {
        description: 'Web Development Services',
        quantity: 1,
        price: 5000,
        vat: 5,
        total: 5250
      }
    ]
  },
  {
    id: '2',
    number: 'INV-2024-002',
    customerId: '2',
    date: '2024-03-05',
    dueDate: '2024-04-04',
    status: 'paid',
    subtotal: 3000,
    vat: 150,
    total: 3150,
    items: [
      {
        description: 'Consulting Services',
        quantity: 1,
        price: 3000,
        vat: 5,
        total: 3150
      }
    ]
  }
];

export const dummyCustomers = [
  {
    id: '1',
    name: 'Acme Corporation',
    email: 'billing@acme.com',
    phone: '+1 (555) 123-4567',
    trn: 'TRN123456789',
    address: '123 Business Ave, Suite 100',
    notes: 'Key enterprise client'
  },
  {
    id: '2',
    name: 'TechStart Inc',
    email: 'accounts@techstart.com',
    phone: '+1 (555) 987-6543',
    trn: 'TRN987654321',
    address: '456 Innovation Drive',
    notes: 'Startup client'
  }
];

export const dummyCategories = [
  {
    id: '1',
    name: 'Professional Services',
    type: 'income',
    description: 'Consulting and development services',
    budget: 50000
  },
  {
    id: '2',
    name: 'Office Expenses',
    type: 'expense',
    description: 'General office supplies and utilities',
    budget: 5000
  }
];
