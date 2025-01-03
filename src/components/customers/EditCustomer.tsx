import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import { AnimatedPage } from "@/components/AnimatedPage";
import { useToast } from "@/lib/hooks/useToast";
import useSWR from "swr";
import type { Customer } from "@/lib/pocketbase";
import { customerService } from "@/lib/services/customer-service";
import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CustomerForm } from "./customer-form";

export function EditCustomer() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { addToast } = useToast();
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const { data: customer } = useSWR(id ? `customers/${id}` : null, () =>
    customerService.getById(id!)
  );

  const handleSubmit = async (data: Omit<Customer, "id">) => {
    if (!id) return;
    setIsSubmitting(true);
    try {
      await customerService.update(id, data);
      addToast("Customer updated successfully", "success");
      navigate(`/customers/${id}`);
    } catch (error) {
      console.error("Failed to update customer:", error);
      addToast("Failed to update customer", "error");
      setIsSubmitting(false);
    }
  };

  if (!customer) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
      </div>
    );
  }

  return (
    <AnimatedPage>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate(`/customers/${id}`)}
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Customer
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white border border-black/10 rounded overflow-hidden"
          >
            <div className="border-b border-black/10 bg-slate-50/50 px-6 py-4">
              <h2 className="font-medium text-[#0F172A]">Edit Customer</h2>
              <p className="text-sm text-[#64748B]">
                Update customer information and details
              </p>
            </div>

            <div className="p-6">
              <CustomerForm
                customer={customer}
                onSubmit={handleSubmit}
                isSubmitting={isSubmitting}
                onCancel={() => navigate(`/customers/${id}`)}
              />
            </div>
          </motion.div>
        </div>
      </div>
    </AnimatedPage>
  );
}
