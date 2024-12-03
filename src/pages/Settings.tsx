import React from 'react';
import { AnimatedPage } from '@/components/AnimatedPage';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select } from '@/components/ui/select';
import { FormItem, FormLabel } from '@/components/ui/form';
import { Building2, Mail, Phone, Globe, CreditCard } from 'lucide-react';

const currencyOptions = [
  { value: 'USD', label: 'USD ($)' },
  { value: 'EUR', label: 'EUR (€)' },
  { value: 'GBP', label: 'GBP (£)' },
];

const timezoneOptions = [
  { value: 'UTC-5', label: 'UTC-5 (Eastern Time)' },
  { value: 'UTC+0', label: 'UTC+0 (GMT)' },
  { value: 'UTC+1', label: 'UTC+1 (Central European Time)' },
];

export function Settings() {
  return (
    <AnimatedPage>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Settings</h1>
          <p className="text-sm text-gray-500 mt-1">Manage your account settings and preferences</p>
        </div>

        <div className="grid grid-cols-3 gap-6">
          <div className="col-span-2 space-y-6">
            <div className="bg-white border border-gray-200/60 shadow-lg shadow-gray-200/20 p-6">
              <h2 className="text-lg font-medium mb-6">Company Information</h2>
              <div className="space-y-4">
                <FormItem>
                  <FormLabel>Company Name</FormLabel>
                  <div className="relative">
                    <Building2 className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input className="pl-10" defaultValue="Acme Inc" />
                  </div>
                </FormItem>

                <FormItem>
                  <FormLabel>Email Address</FormLabel>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input className="pl-10" type="email" defaultValue="contact@acme.com" />
                  </div>
                </FormItem>

                <div className="grid grid-cols-2 gap-4">
                  <FormItem>
                    <FormLabel>Phone Number</FormLabel>
                    <div className="relative">
                      <Phone className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input className="pl-10" defaultValue="+1 (555) 000-0000" />
                    </div>
                  </FormItem>

                  <FormItem>
                    <FormLabel>Website</FormLabel>
                    <div className="relative">
                      <Globe className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input className="pl-10" defaultValue="https://acme.com" />
                    </div>
                  </FormItem>
                </div>
              </div>
            </div>

            <div className="bg-white border border-gray-200/60 shadow-lg shadow-gray-200/20 p-6">
              <h2 className="text-lg font-medium mb-6">Payment Settings</h2>
              <div className="space-y-4">
                <FormItem>
                  <FormLabel>Default Payment Method</FormLabel>
                  <div className="relative">
                    <CreditCard className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input className="pl-10" defaultValue="**** **** **** 4242" />
                  </div>
                </FormItem>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-white border border-gray-200/60 shadow-lg shadow-gray-200/20 p-6">
              <h2 className="text-lg font-medium mb-6">Preferences</h2>
              <div className="space-y-4">
                <FormItem>
                  <FormLabel>Currency</FormLabel>
                  <Select
                    options={currencyOptions}
                    value="USD"
                    placeholder="Select currency"
                  />
                </FormItem>

                <FormItem>
                  <FormLabel>Time Zone</FormLabel>
                  <Select
                    options={timezoneOptions}
                    value="UTC-5"
                    placeholder="Select timezone"
                  />
                </FormItem>
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-end space-x-4">
          <Button variant="outline">Cancel</Button>
          <Button>Save Changes</Button>
        </div>
      </div>
    </AnimatedPage>
  );
}