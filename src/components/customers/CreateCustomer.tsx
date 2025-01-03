import React from "react";
import { useNavigate } from "react-router-dom";
import { AnimatedPage } from "@/components/AnimatedPage";
import { useToast } from "@/lib/hooks/useToast";
import type { Customer } from "@/lib/pocketbase";
import { customerService } from "@/lib/services/customer-service";
import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CustomerForm } from "./customer-form";

export function CreateCustomer() {
  const navigate = useNavigate();
  const { addToast } = useToast();
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const handleSubmit = async (data: Omit<Customer, "id">) => {
    setIsSubmitting(true);
    try {
      const customer = await customerService.create(data);
      addToast("Customer created successfully", "success");
      navigate(`/customers/${customer.id}`);
    } catch (error) {
      console.error("Failed to create customer:", error);
      addToast("Failed to create customer", "error");
      setIsSubmitting(false);
    }
  };

  return (
    <AnimatedPage>
      <div className="space-y-6">
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
        </div>

        <div className="grid grid-cols-1 gap-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white border border-black/10 rounded overflow-hidden"
          >
            <div className="border-b border-black/10 bg-slate-50/50 px-6 py-4">
              <h2 className="font-medium text-[#0F172A]">
                Customer Information
              </h2>
              <p className="text-sm text-[#64748B]">
                Create a new customer with contact and tax details
              </p>
            </div>

            <div className="p-6">
              <CustomerForm
                onSubmit={handleSubmit}
                isSubmitting={isSubmitting}
                onCancel={() => navigate("/customers")}
              />
            </div>
          </motion.div>
        </div>
      </div>
    </AnimatedPage>
  );
}
