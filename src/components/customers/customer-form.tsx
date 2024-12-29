import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Card } from "@/components/ui/card";
import { FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Building2, Mail, Phone, MapPin, CreditCard, User } from "lucide-react";

const businessTypes = [
  "Retail Trade",
  "Wholesale Trade",
  "Manufacturing",
  "Services",
  "Construction",
  "Real Estate",
  "Technology",
  "Healthcare",
  "Education",
  "Other",
] as const;

const emirates = [
  "Abu Dhabi",
  "Dubai",
  "Sharjah",
  "Ajman",
  "Umm Al Quwain",
  "Ras Al Khaimah",
  "Fujairah",
] as const;

const freeZonesByEmirate = {
  "Abu Dhabi": [
    "Abu Dhabi Airport Free Zone",
    "Khalifa Industrial Zone",
    "twofour54",
    "Masdar City Free Zone",
  ],
  Dubai: [
    "Dubai International Financial Centre",
    "Dubai Multi Commodities Centre",
    "Dubai Airport Free Zone",
    "Jebel Ali Free Zone",
  ],
  Sharjah: ["Sharjah Airport Free Zone", "Hamriyah Free Zone"],
  // Add other emirates' free zones
} as const;

const schema = z
  .object({
    // Company or Individual fields
    isCompany: z.boolean(),
    companyName: z.string().optional(),
    firstName: z.string().optional(),
    lastName: z.string().optional(),

    // Address fields
    billingAddress: z.string().min(1, "Billing address is required"),
    shippingAddress: z.string().optional(),
    useShippingAsBilling: z.boolean(),

    // Contact fields
    contact: z.object({
      firstName: z.string().min(1, "Contact first name is required"),
      lastName: z.string().min(1, "Contact last name is required"),
      email: z.string().email("Invalid email address"),
      phone: z.string().min(1, "Phone number is required"),
    }),

    // Business fields
    trn: z.string().min(1, "Tax Registration Number is required"),
    country: z.string().min(1, "Country is required"),
    emirate: z.string().optional(),
    freeZone: z.string().optional(),
    businessType: z.enum(businessTypes),
    businessTypeDescription: z.string().optional(),
    relationship: z.enum(["client", "supplier", "both"]),
  })
  .refine(
    (data) => {
      if (!data.isCompany) {
        return data.firstName && data.lastName;
      }
      return data.companyName && data.companyName.length > 0;
    },
    {
      message: "Either company name or first/last name is required",
      path: ["companyName"],
    }
  )
  .refine(
    (data) => {
      if (data.country === "UAE") {
        return data.emirate;
      }
      return true;
    },
    {
      message: "Emirate is required for UAE",
      path: ["emirate"],
    }
  )
  .refine(
    (data) => {
      if (data.businessType === "Other") {
        return data.businessTypeDescription;
      }
      return true;
    },
    {
      message: "Business type description is required when 'Other' is selected",
      path: ["businessTypeDescription"],
    }
  );

type FormData = z.infer<typeof schema>;

interface CustomerFormProps {
  customer?: FormData;
  onSubmit: (data: FormData) => Promise<void>;
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
    watch,
    setValue,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      isCompany: true,
      useShippingAsBilling: false,
      relationship: "client",
      ...customer,
    },
  });

  const isCompany = watch("isCompany");
  const country = watch("country");
  const emirate = watch("emirate");
  const businessType = watch("businessType");
  const useShippingAsBilling = watch("useShippingAsBilling");

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
      {/* Entity Type Selection */}
      <Card className="p-6">
        <div className="space-y-6">
          <FormItem>
            <div className="flex items-center gap-4">
              <Checkbox
                checked={isCompany}
                onChange={(e) => setValue("isCompany", e.target.checked)}
              />
              <FormLabel>Register as Company</FormLabel>
            </div>
          </FormItem>

          {isCompany ? (
            <FormItem>
              <FormLabel>
                <Building2 className="w-4 h-4 inline-block mr-2 text-[#64748B]" />
                Company Name
              </FormLabel>
              <Input
                {...register("companyName")}
                className="bg-white"
                placeholder="Enter company name"
              />
              {errors.companyName && (
                <FormMessage>{errors.companyName.message}</FormMessage>
              )}
            </FormItem>
          ) : (
            <div className="grid grid-cols-2 gap-4">
              <FormItem>
                <FormLabel>
                  <User className="w-4 h-4 inline-block mr-2 text-[#64748B]" />
                  First Name
                </FormLabel>
                <Input
                  {...register("firstName")}
                  className="bg-white"
                  placeholder="Enter first name"
                />
                {errors.firstName && (
                  <FormMessage>{errors.firstName.message}</FormMessage>
                )}
              </FormItem>
              <FormItem>
                <FormLabel>
                  <User className="w-4 h-4 inline-block mr-2 text-[#64748B]" />
                  Last Name
                </FormLabel>
                <Input
                  {...register("lastName")}
                  className="bg-white"
                  placeholder="Enter last name"
                />
                {errors.lastName && (
                  <FormMessage>{errors.lastName.message}</FormMessage>
                )}
              </FormItem>
            </div>
          )}
        </div>
      </Card>

      {/* Address Information */}
      <Card className="p-6">
        <div className="space-y-6">
          <FormItem>
            <FormLabel>
              <MapPin className="w-4 h-4 inline-block mr-2 text-[#64748B]" />
              Billing Address
            </FormLabel>
            <Input
              {...register("billingAddress")}
              className="bg-white"
              placeholder="Enter billing address"
            />
            {errors.billingAddress && (
              <FormMessage>{errors.billingAddress.message}</FormMessage>
            )}
          </FormItem>

          <FormItem>
            <div className="flex items-center gap-4">
              <Checkbox
                checked={useShippingAsBilling}
                onChange={(e) =>
                  setValue("useShippingAsBilling", e.target.checked)
                }
              />
              <FormLabel>Use different shipping address</FormLabel>
            </div>
          </FormItem>

          {useShippingAsBilling && (
            <FormItem>
              <FormLabel>
                <MapPin className="w-4 h-4 inline-block mr-2 text-[#64748B]" />
                Shipping Address
              </FormLabel>
              <Input
                {...register("shippingAddress")}
                className="bg-white"
                placeholder="Enter shipping address"
              />
              {errors.shippingAddress && (
                <FormMessage>{errors.shippingAddress.message}</FormMessage>
              )}
            </FormItem>
          )}
        </div>
      </Card>

      {/* Contact Information */}
      <Card className="p-6">
        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <FormItem>
              <FormLabel>
                <User className="w-4 h-4 inline-block mr-2 text-[#64748B]" />
                Contact First Name
              </FormLabel>
              <Input
                {...register("contact.firstName")}
                className="bg-white"
                placeholder="Enter contact first name"
              />
              {errors.contact?.firstName && (
                <FormMessage>{errors.contact.firstName.message}</FormMessage>
              )}
            </FormItem>
            <FormItem>
              <FormLabel>
                <User className="w-4 h-4 inline-block mr-2 text-[#64748B]" />
                Contact Last Name
              </FormLabel>
              <Input
                {...register("contact.lastName")}
                className="bg-white"
                placeholder="Enter contact last name"
              />
              {errors.contact?.lastName && (
                <FormMessage>{errors.contact.lastName.message}</FormMessage>
              )}
            </FormItem>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <FormItem>
              <FormLabel>
                <Mail className="w-4 h-4 inline-block mr-2 text-[#64748B]" />
                Email
              </FormLabel>
              <Input
                {...register("contact.email")}
                type="email"
                className="bg-white"
                placeholder="Enter email address"
              />
              {errors.contact?.email && (
                <FormMessage>{errors.contact.email.message}</FormMessage>
              )}
            </FormItem>
            <FormItem>
              <FormLabel>
                <Phone className="w-4 h-4 inline-block mr-2 text-[#64748B]" />
                Phone
              </FormLabel>
              <Input
                {...register("contact.phone")}
                className="bg-white"
                placeholder="Enter phone number"
              />
              {errors.contact?.phone && (
                <FormMessage>{errors.contact.phone.message}</FormMessage>
              )}
            </FormItem>
          </div>
        </div>
      </Card>

      {/* Business Information */}
      <Card className="p-6">
        <div className="space-y-6">
          <FormItem>
            <FormLabel>
              <CreditCard className="w-4 h-4 inline-block mr-2 text-[#64748B]" />
              Tax Registration Number (TRN)
            </FormLabel>
            <Input
              {...register("trn")}
              className="bg-white"
              placeholder="Enter TRN"
            />
            {errors.trn && <FormMessage>{errors.trn.message}</FormMessage>}
          </FormItem>

          <FormItem>
            <FormLabel>Country</FormLabel>
            <Select
              options={[
                { value: "", label: "Select Country" },
                { value: "UAE", label: "United Arab Emirates" },
              ]}
              value={country}
              onChange={(value) => setValue("country", value)}
              placeholder="Select Country"
              className="bg-white"
            />
            {errors.country && (
              <FormMessage>{errors.country.message}</FormMessage>
            )}
          </FormItem>

          {country === "UAE" && (
            <>
              <FormItem>
                <FormLabel>Emirate</FormLabel>
                <Select
                  options={[
                    { value: "", label: "Select Emirate" },
                    ...emirates.map((e) => ({ value: e, label: e })),
                  ]}
                  value={emirate}
                  onChange={(value) => setValue("emirate", value)}
                  placeholder="Select Emirate"
                  className="bg-white"
                />
                {errors.emirate && (
                  <FormMessage>{errors.emirate.message}</FormMessage>
                )}
              </FormItem>

              {emirate &&
                freeZonesByEmirate[
                  emirate as keyof typeof freeZonesByEmirate
                ] && (
                  <FormItem>
                    <FormLabel>Free Zone</FormLabel>
                    <Select
                      options={[
                        { value: "", label: "Select Free Zone" },
                        ...freeZonesByEmirate[
                          emirate as keyof typeof freeZonesByEmirate
                        ].map((fz) => ({ value: fz, label: fz })),
                      ]}
                      value={watch("freeZone")}
                      onChange={(value) => setValue("freeZone", value)}
                      placeholder="Select Free Zone"
                      className="bg-white"
                    />
                    {errors.freeZone && (
                      <FormMessage>{errors.freeZone.message}</FormMessage>
                    )}
                  </FormItem>
                )}
            </>
          )}

          <FormItem>
            <FormLabel>Business Type</FormLabel>
            <Select
              options={[
                { value: "", label: "Select Business Type" },
                ...businessTypes.map((type) => ({ value: type, label: type })),
              ]}
              value={businessType}
              onChange={(value) =>
                setValue(
                  "businessType",
                  value as (typeof businessTypes)[number]
                )
              }
              placeholder="Select Business Type"
              className="bg-white"
            />
            {errors.businessType && (
              <FormMessage>{errors.businessType.message}</FormMessage>
            )}
          </FormItem>

          {businessType === "Other" && (
            <FormItem>
              <FormLabel>Business Type Description</FormLabel>
              <Input
                {...register("businessTypeDescription")}
                className="bg-white"
                placeholder="Enter business type description"
              />
              {errors.businessTypeDescription && (
                <FormMessage>
                  {errors.businessTypeDescription.message}
                </FormMessage>
              )}
            </FormItem>
          )}

          <FormItem>
            <FormLabel>Relationship</FormLabel>
            <Select
              options={[
                { value: "client", label: "Client" },
                { value: "supplier", label: "Supplier" },
                { value: "both", label: "Both" },
              ]}
              value={watch("relationship")}
              onChange={(value) =>
                setValue(
                  "relationship",
                  value as "client" | "supplier" | "both"
                )
              }
              placeholder="Select Relationship"
              className="bg-white"
            />
            {errors.relationship && (
              <FormMessage>{errors.relationship.message}</FormMessage>
            )}
          </FormItem>
        </div>
      </Card>

      <div className="flex justify-end gap-3 pt-6 border-t border-black/10">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          className="bg-white"
        >
          Cancel
        </Button>
        <Button variant="primary" type="submit" disabled={isSubmitting}>
          {isSubmitting
            ? customer
              ? "Saving..."
              : "Creating..."
            : customer
            ? "Save Changes"
            : "Create"}
        </Button>
      </div>
    </form>
  );
}
