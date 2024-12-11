import React from "react";
import { useForm } from "react-hook-form";
import type { Customer } from "@/lib/pocketbase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Building2,
  Mail,
  Phone,
  FileText,
  MapPin,
  CreditCard,
} from "lucide-react";

interface CustomerFormProps {
  customer?: Customer;
  onSubmit: (data: Omit<Customer, "id">) => Promise<void>;
  isSubmitting: boolean;
  onCancel: () => void;
}

export function CustomerForm({
  customer,
  onSubmit,
  isSubmitting,
  onCancel,
}: CustomerFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Omit<Customer, "id">>({
    defaultValues: customer,
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="grid grid-cols-2 gap-6">
        <FormItem>
          <FormLabel>
            <Building2 className="w-4 h-4 inline-block mr-2 text-[#64748B]" />
            Company Name
          </FormLabel>
          <Input
            {...register("name", {
              required: "Company name is required",
            })}
            className="bg-white"
            placeholder="Enter company name"
          />
          {errors.name && <FormMessage>{errors.name.message}</FormMessage>}
        </FormItem>

        <FormItem>
          <FormLabel>
            <Mail className="w-4 h-4 inline-block mr-2 text-[#64748B]" />
            Email Address
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
          {errors.email && <FormMessage>{errors.email.message}</FormMessage>}
        </FormItem>

        <FormItem>
          <FormLabel>
            <Phone className="w-4 h-4 inline-block mr-2 text-[#64748B]" />
            Phone Number
          </FormLabel>
          <Input
            {...register("phone", {
              required: "Phone number is required",
            })}
            className="bg-white"
            placeholder="Enter phone number"
          />
          {errors.phone && <FormMessage>{errors.phone.message}</FormMessage>}
        </FormItem>

        <FormItem>
          <FormLabel>
            <CreditCard className="w-4 h-4 inline-block mr-2 text-[#64748B]" />
            Tax Registration Number
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

        <FormItem className="col-span-2">
          <FormLabel>
            <MapPin className="w-4 h-4 inline-block mr-2 text-[#64748B]" />
            Business Address
          </FormLabel>
          <Textarea
            {...register("address", {
              required: "Address is required",
            })}
            className="bg-white resize-none"
            placeholder="Enter business address"
            rows={3}
          />
          {errors.address && <FormMessage>{errors.address.message}</FormMessage>}
        </FormItem>

        <FormItem className="col-span-2">
          <FormLabel>
            <FileText className="w-4 h-4 inline-block mr-2 text-[#64748B]" />
            Additional Notes
          </FormLabel>
          <Textarea
            {...register("notes")}
            className="bg-white resize-none"
            placeholder="Enter any additional notes"
            rows={3}
          />
          {errors.notes && <FormMessage>{errors.notes.message}</FormMessage>}
        </FormItem>
      </div>

      <div className="flex justify-end gap-3 pt-6 border-t border-black/10">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          className="bg-white"
        >
          Cancel
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting
            ? customer
              ? "Saving..."
              : "Creating..."
            : customer
            ? "Save Changes"
            : "Create Customer"}
        </Button>
      </div>
    </form>
  );
}
