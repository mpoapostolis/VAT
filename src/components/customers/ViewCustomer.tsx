import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import useSWR from 'swr';
import { Building2, Mail, Phone, MapPin, FileText, Printer, Send, FileEdit } from 'lucide-react';
import { AnimatedPage } from '@/components/AnimatedPage';
import { Button } from '@/components/ui/button';
import { PageHeader } from '@/components/ui/page-header';
import { customerService } from '@/lib/services/customer-service';
import { formatDate } from '@/lib/utils';
import type { Customer } from '@/lib/pocketbase';

export function ViewCustomer() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data: customer } = useSWR<Customer>(
    id ? `customers/${id}` : null,
    () => customerService.getById(id!)
  );

  if (!customer) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
      </div>
    );
  }

  const headerActions = (
    <>
      <Button variant="outline" size="sm" onClick={() => window.print()}>
        <Printer className="h-4 w-4 mr-2" />
        Print
      </Button>
      <Button variant="outline" size="sm">
        <Send className="h-4 w-4 mr-2" />
        Send Email
      </Button>
      <Button variant="outline" size="sm" onClick={() => navigate(`/customers/${id}/edit`)}>
        <FileEdit className="h-4 w-4 mr-2" />
        Edit
      </Button>
    </>
  );

  return (
    <AnimatedPage>
      <div className="space-y-6">
        <PageHeader
          title={customer.name}
          subtitle="Customer Details"
          onBack={() => navigate('/customers')}
          actions={headerActions}
        />

        <div className="grid grid-cols-2 gap-6">
          <div className="bg-white border border-gray-200/60 shadow-lg shadow-gray-200/20 p-6 space-y-6">
            <div>
              <h2 className="text-lg font-medium text-gray-900 mb-4">Basic Information</h2>
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <Building2 className="h-5 w-5 text-gray-400 mt-0.5" />
                  <div>
                    <div className="font-medium text-gray-900">{customer.name}</div>
                    <div className="text-sm text-gray-500">Company Name</div>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <Mail className="h-5 w-5 text-gray-400 mt-0.5" />
                  <div>
                    <div className="font-medium text-gray-900">{customer.email}</div>
                    <div className="text-sm text-gray-500">Email Address</div>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <Phone className="h-5 w-5 text-gray-400 mt-0.5" />
                  <div>
                    <div className="font-medium text-gray-900">{customer.phone}</div>
                    <div className="text-sm text-gray-500">Phone Number</div>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <MapPin className="h-5 w-5 text-gray-400 mt-0.5" />
                  <div>
                    <div className="font-medium text-gray-900">{customer.address}</div>
                    <div className="text-sm text-gray-500">Address</div>
                  </div>
                </div>

                {customer.notes && (
                  <div className="flex items-start space-x-3">
                    <FileText className="h-5 w-5 text-gray-400 mt-0.5" />
                    <div>
                      <div className="font-medium text-gray-900">{customer.notes}</div>
                      <div className="text-sm text-gray-500">Additional Notes</div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="pt-6 border-t border-gray-200">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <div className="text-gray-500">Created</div>
                  <div className="font-medium text-gray-900">{formatDate(customer.created)}</div>
                </div>
                <div>
                  <div className="text-gray-500">Last Updated</div>
                  <div className="font-medium text-gray-900">{formatDate(customer.updated)}</div>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-white border border-gray-200/60 shadow-lg shadow-gray-200/20 p-6">
              <h2 className="text-lg font-medium text-gray-900 mb-4">Tax Information</h2>
              <div className="space-y-4">
                <div>
                  <div className="text-sm text-gray-500">Tax Registration Number (TRN)</div>
                  <div className="font-medium text-gray-900 mt-1">{customer.trn}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AnimatedPage>
  );
}