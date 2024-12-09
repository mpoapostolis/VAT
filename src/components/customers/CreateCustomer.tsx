import React from "react";
import { useNavigate } from "react-router-dom";
import {
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { AnimatedPage } from "@/components/AnimatedPage";
import { useToast } from "@/lib/hooks/useToast";
import { motion } from "framer-motion";
import {
  Building2,
  Mail,
  Phone,
  FileText,
  MapPin,
  CreditCard,
} from "lucide-react";
import { useForm } from "react-hook-form";
import { pb } from "@/lib/pocketbase";

export function CreateCustomer() {
  const navigate = useNavigate();
  const { addToast } = useToast();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm();

  const onSubmit = async (data: any) => {
    try {
      await pb.collection("customers").create(data);
      addToast("Customer created successfully", "success");
      navigate("/customers");
    } catch (error) {
      console.error("Failed to create customer:", error);
      addToast("Failed to create customer", "error");
    }
  };

  return (
    <AnimatedPage>
      <div className="space-y-6   mx-auto">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => navigate("/customers")}
              className="inline-flex items-center justify-center h-9 px-3 text-sm font-medium text-gray-700 transition-colors bg-white border rounded-md hover:bg-gray-50 active:bg-gray-100"
            >
              <svg
                className="w-4 h-4 mr-2"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M10 19l-7-7m0 0l7-7m-7 7h18"
                />
              </svg>
              Back to Customers
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Basic Information */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white border border-gray-200/60 shadow-lg shadow-gray-200/20 rounded overflow-hidden"
          >
            <div className="border-b border-gray-200/60 bg-gray-50/50 px-6 py-4">
              <h2 className="font-medium text-gray-800">Basic Information</h2>
              <p className="text-sm text-gray-500">
                Enter the customer's basic details
              </p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-6">
              <FormItem>
                <FormLabel>
                  <Building2 className="h-4 w-4 inline-block mr-2" />
                  <span>Company Name</span>
                </FormLabel>
                <Input
                  {...register("name", {
                    required: "Company name is required",
                  })}
                  className="bg-white"
                  placeholder="Enter company name"
                />
                {errors.name && (
                  <FormMessage>{errors.name.message}</FormMessage>
                )}
              </FormItem>

              <FormItem>
                <FormLabel>
                  <Mail className="h-4 w-4 inline-block mr-2" />
                  <span>Email Address</span>
                </FormLabel>
                <Input
                  {...register("email", {
                    required: "Email is required",
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: "Invalid email address",
                    },
                  })}
                  type="email"
                  className="bg-white"
                  placeholder="Enter email address"
                />
                {errors.email && (
                  <FormMessage>{errors.email.message}</FormMessage>
                )}
              </FormItem>

              <FormItem>
                <FormLabel>
                  <Phone className="h-4 w-4 inline-block mr-2" />
                  <span>Phone Number</span>
                </FormLabel>
                <Input
                  {...register("phone", {
                    required: "Phone number is required",
                  })}
                  className="bg-white"
                  placeholder="Enter phone number"
                />
                {errors.phone && (
                  <FormMessage>{errors.phone.message}</FormMessage>
                )}
              </FormItem>

              <FormItem>
                <FormLabel>
                  <CreditCard className="h-4 w-4 inline-block mr-2" />
                  <span>Tax Registration Number</span>
                </FormLabel>
                <Input
                  {...register("trn", {
                    required: "TRN is required",
                  })}
                  className="bg-white"
                  placeholder="Enter tax registration number"
                />
                {errors.trn && <FormMessage>{errors.trn.message}</FormMessage>}
              </FormItem>

              <div className="flex justify-end space-x-4 pt-4 border-t border-gray-100">
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
                  {isSubmitting ? "Creating..." : "Create Customer"}
                </button>
              </div>
            </form>
          </motion.div>

          {/* Additional Information */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white border border-gray-200/60 shadow-lg shadow-gray-200/20 rounded overflow-hidden"
          >
            <div className="border-b border-gray-200/60 bg-gray-50/50 px-6 py-4">
              <h2 className="font-medium text-gray-800">
                Additional Information
              </h2>
              <p className="text-sm text-gray-500">
                Optional details about the customer
              </p>
            </div>

            <div className="p-6 space-y-6">
              <FormItem>
                <FormLabel>
                  <MapPin className="h-4 w-4 inline-block mr-2" />
                  <span>Business Address</span>
                </FormLabel>
                <Textarea
                  {...register("address", {
                    required: "Address is required",
                  })}
                  className="bg-white resize-none"
                  placeholder="Enter business address"
                  rows={3}
                />
                {errors.address && (
                  <FormMessage>{errors.address.message}</FormMessage>
                )}
              </FormItem>

              <FormItem>
                <FormLabel>
                  <FileText className="h-4 w-4 inline-block mr-2" />
                  <span>Additional Notes</span>
                </FormLabel>
                <Textarea
                  {...register("notes")}
                  className="bg-white resize-none"
                  placeholder="Enter any additional notes"
                  rows={4}
                />
                {errors.notes && (
                  <FormMessage>{errors.notes.message}</FormMessage>
                )}
              </FormItem>
            </div>
          </motion.div>
        </div>
      </div>
    </AnimatedPage>
  );
}
