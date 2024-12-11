import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import useSWR from "swr";
import { motion } from "framer-motion";
import type { Customer } from "@/lib/pocketbase";
import { useToast } from "@/lib/hooks/useToast";
import { customerService } from "@/lib/services/customer-service";
import { 
  ArrowLeft, 
  Edit, 
  Users, 
  Phone, 
  Mail, 
  MapPin, 
  CalendarDays, 
  Building2,
  CreditCard,
  FileText,
  Clock
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { AnimatedPage } from "@/components/AnimatedPage";
import { formatDate } from "@/lib/utils";

export function ViewCustomer() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToast } = useToast();

  const { data: customer } = useSWR(
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

        <div className="bg-white border border-black/10 rounded-lg overflow-hidden">
          <div className="border-b border-black/10 bg-slate-50/50 px-6 py-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-[#F1F5F9]">
                <Building2 className="w-5 h-5 text-[#3B82F6]" />
              </div>
              <div>
                <h2 className="font-medium text-[#0F172A] text-lg">{customer.name}</h2>
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
                  <div className="p-2 rounded-lg bg-[#F1F5F9]">
                    <Mail className="w-4 h-4 text-[#3B82F6]" />
                  </div>
                  <div>
                    <div className="text-sm font-medium text-[#0F172A]">Email Address</div>
                    <div className="text-sm text-[#64748B]">{customer.email}</div>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-lg bg-[#F1F5F9]">
                    <Phone className="w-4 h-4 text-[#3B82F6]" />
                  </div>
                  <div>
                    <div className="text-sm font-medium text-[#0F172A]">Phone Number</div>
                    <div className="text-sm text-[#64748B]">{customer.phone}</div>
                  </div>
                </div>
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
                  <div className="p-2 rounded-lg bg-[#F1F5F9]">
                    <MapPin className="w-4 h-4 text-[#3B82F6]" />
                  </div>
                  <div>
                    <div className="text-sm font-medium text-[#0F172A]">Business Address</div>
                    <div className="text-sm text-[#64748B] whitespace-pre-wrap">{customer.address}</div>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-lg bg-[#F1F5F9]">
                    <CreditCard className="w-4 h-4 text-[#3B82F6]" />
                  </div>
                  <div>
                    <div className="text-sm font-medium text-[#0F172A]">Tax Registration Number</div>
                    <div className="text-sm text-[#64748B]">{customer.trn}</div>
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
                <div className="bg-[#F8FAFC] border border-black/5 rounded-lg p-4">
                  <div className="text-sm text-[#64748B] whitespace-pre-wrap">{customer.notes}</div>
                </div>
              </div>
            )}
          </div>
        </div>
      </motion.div>
    </AnimatedPage>
  );
}
