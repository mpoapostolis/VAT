import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import useSWR from "swr";
import { AnimatedPage } from "@/components/AnimatedPage";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { CustomerHeader } from "./customer-header";
import { customerService } from "@/lib/services/customer-service";
import { useToast } from "@/lib/hooks/useToast";
import type { Customer } from "@/lib/pocketbase";
import { motion } from "framer-motion";
import {
  Building2,
  Mail,
  Phone,
  FileText,
  MapPin,
  FileEdit,
} from "lucide-react";

export function EditCustomer() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToast } = useToast();
  const { data: customer } = useSWR<Customer>(
    id ? `customers/${id}` : null,
    () => customerService.getById(id!)
  );

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<Customer>({
    defaultValues: customer,
  });

  const onSubmit = async (data: Partial<Customer>) => {
    if (!id) return;
    try {
      await customerService.update(id, data);
      addToast("Customer updated successfully", "success");
      navigate("/customers");
    } catch (error) {
      addToast("Failed to update customer", "error");
    }
  };

  if (!customer) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
      </div>
    );
  }

  const headerActions = (
    <div className="flex items-center space-x-3">
      <Button
        variant="outline"
        onClick={() => navigate("/customers")}
        className="border-gray-200 hover:bg-gray-50"
      >
        Cancel
      </Button>
      <Button
        type="submit"
        form="customer-form"
        className="bg-[#0066FF] hover:bg-blue-600"
        disabled={isSubmitting}
      >
        {isSubmitting ? "Saving..." : "Save Changes"}
      </Button>
    </div>
  );

  return (
    <AnimatedPage>
      <div className="space-y-6   mx-auto">
        <CustomerHeader mode="edit" actions={headerActions} />

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white border border-gray-200/60 shadow-lg shadow-gray-200/20 rounded-xl overflow-hidden"
        >
          <div className="border-b border-gray-200/60 bg-gray-50/50 px-6 py-4">
            <h2 className="font-medium text-gray-800">Customer Details</h2>
            <p className="text-sm text-gray-500">
              Basic information about the customer
            </p>
          </div>

          <form
            id="customer-form"
            onSubmit={handleSubmit(onSubmit)}
            className="p-6 space-y-8"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormItem>
                <FormLabel className="flex items-center space-x-2 text-gray-700">
                  <Building2 className="w-4 h-4 text-gray-400" />
                  <span>Company Name</span>
                </FormLabel>
                <Input
                  {...register("name", {
                    required: "Company name is required",
                  })}
                  defaultValue={customer.name}
                  className="bg-white"
                  placeholder="Enter company name"
                />
                {errors.name && (
                  <FormMessage>{errors.name.message}</FormMessage>
                )}
              </FormItem>

              <FormItem>
                <FormLabel className="flex items-center space-x-2 text-gray-700">
                  <Mail className="w-4 h-4 text-gray-400" />
                  <span>Email Address</span>
                </FormLabel>
                <Input
                  type="email"
                  {...register("email", {
                    required: "Email is required",
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: "Invalid email address",
                    },
                  })}
                  defaultValue={customer.email}
                  className="bg-white"
                  placeholder="Enter email address"
                />
                {errors.email && (
                  <FormMessage>{errors.email.message}</FormMessage>
                )}
              </FormItem>

              <FormItem>
                <FormLabel className="flex items-center space-x-2 text-gray-700">
                  <Phone className="w-4 h-4 text-gray-400" />
                  <span>Phone Number</span>
                </FormLabel>
                <Input
                  {...register("phone", {
                    required: "Phone number is required",
                  })}
                  defaultValue={customer.phone}
                  className="bg-white"
                  placeholder="Enter phone number"
                />
                {errors.phone && (
                  <FormMessage>{errors.phone.message}</FormMessage>
                )}
              </FormItem>

              <FormItem>
                <FormLabel className="flex items-center space-x-2 text-gray-700">
                  <FileText className="w-4 h-4 text-gray-400" />
                  <span>Tax Registration Number</span>
                </FormLabel>
                <Input
                  {...register("trn", { required: "TRN is required" })}
                  defaultValue={customer.trn}
                  className="bg-white"
                  placeholder="Enter tax registration number"
                />
                {errors.trn && <FormMessage>{errors.trn.message}</FormMessage>}
              </FormItem>
            </div>

            <div className="space-y-6 pt-4 border-t border-gray-200/60">
              <FormItem>
                <FormLabel className="flex items-center space-x-2 text-gray-700">
                  <MapPin className="w-4 h-4 text-gray-400" />
                  <span>Business Address</span>
                </FormLabel>
                <Input
                  {...register("address", { required: "Address is required" })}
                  defaultValue={customer.address}
                  className="bg-white"
                  placeholder="Enter business address"
                />
                {errors.address && (
                  <FormMessage>{errors.address.message}</FormMessage>
                )}
              </FormItem>

              <FormItem>
                <FormLabel className="flex items-center space-x-2 text-gray-700">
                  <FileEdit className="w-4 h-4 text-gray-400" />
                  <span>Additional Notes</span>
                </FormLabel>
                <textarea
                  {...register("notes")}
                  defaultValue={customer.notes}
                  placeholder="Enter any additional notes about the customer"
                  className="w-full h-24 px-3 py-2 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none text-sm"
                />
              </FormItem>
            </div>

            <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
              <button
                type="button"
                onClick={() => navigate("/customers")}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                {isSubmitting ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatedPage>
  );
}
