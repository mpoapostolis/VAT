import React from "react";
import {
  Building2,
  Mail,
  Phone,
  MapPin,
  CreditCard,
  Calendar,
  Globe,
} from "lucide-react";
import type { Company } from "@/lib/pocketbase";
import { formatDate } from "@/lib/utils";
import { DetailPage } from "../ui/page-templates";

interface CompanyDetailsProps {
  company: Company;
}

export function CompanyDetails({ company }: CompanyDetailsProps) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Basic Information */}
      <div className="bg-white border border-gray-200/60 shadow-lg shadow-gray-200/20 rounded overflow-hidden">
        <div className="border-b border-gray-200/60 bg-gray-50/50 px-6 py-4">
          <h2 className="font-medium text-gray-800">Basic Information</h2>
          <p className="text-sm text-gray-500">
            Company details and registration information
          </p>
        </div>

        <div className="p-6 space-y-6">
          <div className="flex items-start space-x-3">
            <Building2 className="h-5 w-5 text-gray-400 mt-0.5" />
            <div>
              <div className="font-medium text-gray-900">
                {company.companyNameEn}
              </div>
              <div className="text-sm text-gray-500">
                Company Name (English)
              </div>
              {company.companyNameAr && (
                <div className="mt-1 font-medium text-gray-900" dir="rtl">
                  {company.companyNameAr}
                </div>
              )}
            </div>
          </div>

          <div className="flex items-start space-x-3">
            <CreditCard className="h-5 w-5 text-gray-400 mt-0.5" />
            <div>
              <div className="font-medium text-gray-900">
                {company.tradeLicenseNumber}
              </div>
              <div className="text-sm text-gray-500">Trade License Number</div>
            </div>
          </div>

          <div className="flex items-start space-x-3">
            <Globe className="h-5 w-5 text-gray-400 mt-0.5" />
            <div>
              <div className="font-medium text-gray-900">
                {company.primaryBusinessType}
              </div>
              <div className="text-sm text-gray-500">Primary Business Type</div>
              {company.businessTypeDescription && (
                <div className="text-sm text-gray-500 mt-1">
                  {company.businessTypeDescription}
                </div>
              )}
            </div>
          </div>

          <div className="flex items-start space-x-3">
            <MapPin className="h-5 w-5 text-gray-400 mt-0.5" />
            <div>
              <div className="font-medium text-gray-900">
                {company.emirate}
                {company.freeZone && ` - ${company.freeZone}`}
              </div>
              <div className="text-sm text-gray-500">Location</div>
            </div>
          </div>
        </div>
      </div>

      {/* Additional Information */}
      <div className="bg-white border border-gray-200/60 shadow-lg shadow-gray-200/20 rounded overflow-hidden">
        <div className="border-b border-gray-200/60 bg-gray-50/50 px-6 py-4">
          <h2 className="font-medium text-gray-800">Additional Information</h2>
          <p className="text-sm text-gray-500">VAT and payment details</p>
        </div>

        <div className="p-6 space-y-6">
          <div className="flex items-start space-x-3">
            <CreditCard className="h-5 w-5 text-gray-400 mt-0.5" />
            <div>
              <div className="font-medium text-gray-900">
                {company.defaultVatRate}%
              </div>
              <div className="text-sm text-gray-500">Default VAT Rate</div>
            </div>
          </div>

          <div className="flex items-start space-x-3">
            <Calendar className="h-5 w-5 text-gray-400 mt-0.5" />
            <div>
              <div className="font-medium text-gray-900">
                {company.defaultPaymentTerms} days
              </div>
              <div className="text-sm text-gray-500">Default Payment Terms</div>
            </div>
          </div>

          {company.bankDetails && (
            <div className="border-t pt-6 mt-6">
              <h3 className="font-medium text-gray-900 mb-4">Bank Details</h3>
              <div className="space-y-4">
                <div>
                  <div className="text-sm text-gray-500">Bank Name</div>
                  <div className="font-medium text-gray-900">
                    {company.bankDetails.bankName}
                  </div>
                </div>
                <div>
                  <div className="text-sm text-gray-500">Branch</div>
                  <div className="font-medium text-gray-900">
                    {company.bankDetails.branch}
                  </div>
                </div>
                <div>
                  <div className="text-sm text-gray-500">Account Number</div>
                  <div className="font-medium text-gray-900">
                    {company.bankDetails.accountNumber}
                  </div>
                </div>
                <div>
                  <div className="text-sm text-gray-500">SWIFT Code</div>
                  <div className="font-medium text-gray-900">
                    {company.bankDetails.swiftCode}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
