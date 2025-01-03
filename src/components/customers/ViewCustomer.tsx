import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import useSWR from "swr";
import { motion } from "framer-motion";
import { customerService } from "@/lib/services/customer-service";
import {
  ArrowLeft,
  Edit,
  Users,
  Phone,
  Mail,
  MapPin,
  Building2,
  CreditCard,
  FileText,
  Clock,
  Globe,
  MapPinned,
  Building,
  Briefcase,
  UserCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { AnimatedPage } from "@/components/AnimatedPage";
import { formatDate } from "@/lib/utils";

export function ViewCustomer() {
  const { id } = useParams();
  const navigate = useNavigate();

  const { data: customer } = useSWR(id ? `customers/${id}` : null, () =>
    customerService.getById(id!)
  );

  if (!customer) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
      </div>
    );
  }

  const getRelationshipLabel = (relationship: string) => {
    const labels = {
      client: "Client",
      supplier: "Supplier",
      both: "Client & Supplier",
    };
    return labels[relationship as keyof typeof labels] || relationship;
  };

  return (
    <AnimatedPage>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-6"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate("/customers")}
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Customers
            </Button>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate(`/customers/${id}/edit`)}
            >
              <Edit className="w-4 h-4 mr-2" />
              Edit Customer
            </Button>
          </div>
        </div>

        <div className="bg-white border border-black/10 rounded overflow-hidden">
          <div className="border-b border-black/10 bg-slate-50/50 px-6 py-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded bg-[#F1F5F9]">
                {customer.isCompany ? (
                  <Building2 className="w-5 h-5 text-[#3B82F6]" />
                ) : (
                  <UserCircle className="w-5 h-5 text-[#3B82F6]" />
                )}
              </div>
              <div>
                <h2 className="font-medium text-[#0F172A] text-lg">
                  {customer.isCompany
                    ? customer.companyName
                    : `${customer.firstName} ${customer.lastName}`}
                </h2>
                <div className="flex items-center gap-2 text-sm text-[#64748B]">
                  <Clock className="w-4 h-4" />
                  <span>Customer since {formatDate(customer.created)}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="p-6 space-y-8">
            {/* Contact Information */}
            <div>
              <h3 className="text-sm font-medium text-[#0F172A] mb-4 flex items-center gap-2">
                <Users className="w-4 h-4 text-[#3B82F6]" />
                Contact Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded bg-[#F1F5F9]">
                    <UserCircle className="w-4 h-4 text-[#3B82F6]" />
                  </div>
                  <div>
                    <div className="text-sm font-medium text-[#0F172A]">
                      Contact Person
                    </div>
                    <div className="text-sm text-[#64748B]">
                      {customer.contact?.firstName} {customer.contact?.lastName}
                    </div>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded bg-[#F1F5F9]">
                    <Mail className="w-4 h-4 text-[#3B82F6]" />
                  </div>
                  <div>
                    <div className="text-sm font-medium text-[#0F172A]">
                      Email Address
                    </div>
                    <div className="text-sm text-[#64748B]">
                      {customer.contact?.email}
                    </div>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded bg-[#F1F5F9]">
                    <Phone className="w-4 h-4 text-[#3B82F6]" />
                  </div>
                  <div>
                    <div className="text-sm font-medium text-[#0F172A]">
                      Phone Number
                    </div>
                    <div className="text-sm text-[#64748B]">
                      {customer.contact?.phone}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Address Information */}
            <div>
              <h3 className="text-sm font-medium text-[#0F172A] mb-4 flex items-center gap-2">
                <MapPin className="w-4 h-4 text-[#3B82F6]" />
                Address Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded bg-[#F1F5F9]">
                    <Building className="w-4 h-4 text-[#3B82F6]" />
                  </div>
                  <div>
                    <div className="text-sm font-medium text-[#0F172A]">
                      Billing Address
                    </div>
                    <div className="text-sm text-[#64748B] whitespace-pre-wrap">
                      {customer.billingAddress}
                    </div>
                  </div>
                </div>
                {customer.shippingAddress && (
                  <div className="flex items-start gap-3">
                    <div className="p-2 rounded bg-[#F1F5F9]">
                      <MapPinned className="w-4 h-4 text-[#3B82F6]" />
                    </div>
                    <div>
                      <div className="text-sm font-medium text-[#0F172A]">
                        Shipping Address
                      </div>
                      <div className="text-sm text-[#64748B] whitespace-pre-wrap">
                        {customer.shippingAddress}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Business Information */}
            <div>
              <h3 className="text-sm font-medium text-[#0F172A] mb-4 flex items-center gap-2">
                <Building2 className="w-4 h-4 text-[#3B82F6]" />
                Business Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded bg-[#F1F5F9]">
                    <CreditCard className="w-4 h-4 text-[#3B82F6]" />
                  </div>
                  <div>
                    <div className="text-sm font-medium text-[#0F172A]">
                      Tax Registration Number
                    </div>
                    <div className="text-sm text-[#64748B]">{customer.trn}</div>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded bg-[#F1F5F9]">
                    <Globe className="w-4 h-4 text-[#3B82F6]" />
                  </div>
                  <div>
                    <div className="text-sm font-medium text-[#0F172A]">
                      Location
                    </div>
                    <div className="text-sm text-[#64748B]">
                      {customer.country}
                      {customer.emirate && ` - ${customer.emirate}`}
                      {customer.freeZone && ` (${customer.freeZone})`}
                    </div>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded bg-[#F1F5F9]">
                    <Briefcase className="w-4 h-4 text-[#3B82F6]" />
                  </div>
                  <div>
                    <div className="text-sm font-medium text-[#0F172A]">
                      Business Type
                    </div>
                    <div className="text-sm text-[#64748B]">
                      {customer.businessType}
                      {customer.businessTypeDescription &&
                        ` - ${customer.businessTypeDescription}`}
                    </div>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded bg-[#F1F5F9]">
                    <Users className="w-4 h-4 text-[#3B82F6]" />
                  </div>
                  <div>
                    <div className="text-sm font-medium text-[#0F172A]">
                      Relationship
                    </div>
                    <div className="text-sm text-[#64748B]">
                      {getRelationshipLabel(customer.relationship)}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Additional Information */}
            {customer.notes && (
              <div>
                <h3 className="text-sm font-medium text-[#0F172A] mb-4 flex items-center gap-2">
                  <FileText className="w-4 h-4 text-[#3B82F6]" />
                  Additional Notes
                </h3>
                <div className="bg-[#F8FAFC] border border-black/5 rounded p-4">
                  <div className="text-sm text-[#64748B] whitespace-pre-wrap">
                    {customer.notes}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </motion.div>
    </AnimatedPage>
  );
}
