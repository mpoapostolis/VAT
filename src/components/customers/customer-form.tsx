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
import {
  Building2,
  Mail,
  Phone,
  MapPin,
  CreditCard,
  User,
  Loader2,
} from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { useNavigate, useParams } from "react-router-dom";
import { pb } from "@/lib/pocketbase";
import { toast } from "sonner";
import { useEffect } from "react";

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
    companyName: z.string(),
    contactFirstName: z.string(),
    contactLastName: z.string(),

    // Address fields
    billingAddress: z.string().min(1, "Billing address is required"),
    shippingAddress: z.string().optional(),
    useShippingAsBilling: z.boolean(),

    // Contact fields
    email: z.string().email("Invalid email address"),
    phoneNumber: z.string().min(1, "Phone number is required"),

    // Business fields
    taxRegistrationNumber: z.string().optional(),
    country: z.string().min(1, "Country is required"),
    emirate: z.string().optional(),
    freeZone: z.string().optional(),
    businessType: z.enum(businessTypes),
    relationship: z.enum(["Client", "Vendor", "Other"]),
  })
  .refine(
    (data) => {
      if (data.isCompany) {
        return data.companyName.length > 0;
      } else {
        return (
          data.contactFirstName.length > 0 && data.contactLastName.length > 0
        );
      }
    },
    {
      message: "Either company name or first and last name must be provided",
      path: ["companyName"], // this shows the error under company name field
    }
  );

type FormData = z.infer<typeof schema>;

export function CustomerForm() {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditing = Boolean(id);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      isCompany: true,
      useShippingAsBilling: false,
      relationship: "Client",
      businessType: "Other" as const,
      country: "UAE",
      emirate: "",
      freeZone: "",
      companyName: "",
      contactFirstName: "",
      contactLastName: "",
      billingAddress: "",
      shippingAddress: "",
      email: "",
      phoneNumber: "",
      taxRegistrationNumber: "",
    },
  });

  useEffect(() => {
    async function loadCustomer() {
      if (id) {
        try {
          const customer = await pb.collection("customers").getOne(id);
          // Reset the form with all customer data at once
          reset({
            ...customer,
            useShippingAsBilling: Boolean(customer.shippingAddress),
            shippingAddress: customer.shippingAddress || "",
            contactFirstName: customer.contactFirstName || "",
            contactLastName: customer.contactLastName || "",
            email: customer.email || "",
            phoneNumber: customer.phoneNumber || "",
            taxRegistrationNumber: customer.taxRegistrationNumber || "",
            country: customer.country || "UAE",
            emirate: customer.emirate || "",
            freeZone: customer.freeZone || "",
            businessType: customer.businessType || "Other",
            relationship: customer.relationship || "Client",
          });
        } catch (error) {
          console.error("Error loading customer:", error);
          toast.error("Failed to load customer");
        }
      }
    }
    loadCustomer();
  }, [id, reset]);

  const onSubmit = async (data: FormData) => {
    try {
      const formData = {
        ...data,
        // Handle shipping address based on useShippingAsBilling flag
        shippingAddress: data.useShippingAsBilling ? data.shippingAddress : "",
        // Ensure proper typing for relationship and businessType
        relationship: data.relationship as "Client" | "Vendor" | "Other",
        businessType: data.businessType as (typeof businessTypes)[number],
      };

      if (isEditing && id) {
        await pb.collection("customers").update(id, formData);
        toast.success("Customer updated successfully");
      } else {
        await pb
          .collection("customers")
          .create({ ...formData, userId: pb.authStore.model?.id });
        toast.success("Customer created successfully");
      }
      navigate("/customers");
    } catch (error: any) {
      console.error("Error saving customer:", error);
      if (error.data?.data) {
        // Handle validation errors from PocketBase
        const firstError = Object.entries(error.data.data)[0];
        const [field, message] = firstError;
        toast.error(`${field}: ${message}`);
      } else {
        toast.error(
          `Failed to ${isEditing ? "update" : "create"} customer: ${
            error.message || "Unknown error"
          }`
        );
      }
    }
  };

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
                onChange={(e) => {
                  setValue("isCompany", e.target.checked);
                  // Clear the opposite fields when switching
                  if (e.target.checked) {
                    setValue("contactFirstName", "");
                    setValue("contactLastName", "");
                  } else {
                    setValue("companyName", "");
                  }
                }}
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
                  {...register("contactFirstName")}
                  className="bg-white"
                  placeholder="Enter first name"
                />
                {errors.contactFirstName && (
                  <FormMessage>{errors.contactFirstName.message}</FormMessage>
                )}
              </FormItem>
              <FormItem>
                <FormLabel>
                  <User className="w-4 h-4 inline-block mr-2 text-[#64748B]" />
                  Last Name
                </FormLabel>
                <Input
                  {...register("contactLastName")}
                  className="bg-white"
                  placeholder="Enter last name"
                />
                {errors.contactLastName && (
                  <FormMessage>{errors.contactLastName.message}</FormMessage>
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
            <Textarea
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
              <Textarea
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
                {...register("contactFirstName")}
                className="bg-white"
                placeholder="Enter contact first name"
              />
              {errors.contactFirstName && (
                <FormMessage>{errors.contactFirstName.message}</FormMessage>
              )}
            </FormItem>
            <FormItem>
              <FormLabel>
                <User className="w-4 h-4 inline-block mr-2 text-[#64748B]" />
                Contact Last Name
              </FormLabel>
              <Input
                {...register("contactLastName")}
                className="bg-white"
                placeholder="Enter contact last name"
              />
              {errors.contactLastName && (
                <FormMessage>{errors.contactLastName.message}</FormMessage>
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
                {...register("email")}
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
                <Phone className="w-4 h-4 inline-block mr-2 text-[#64748B]" />
                Phone
              </FormLabel>
              <Input
                {...register("phoneNumber")}
                className="bg-white"
                placeholder="Enter phone number"
              />
              {errors.phoneNumber && (
                <FormMessage>{errors.phoneNumber.message}</FormMessage>
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
              {...register("taxRegistrationNumber")}
              className="bg-white"
              placeholder="Enter TRN"
            />
            {errors.taxRegistrationNumber && (
              <FormMessage>{errors.taxRegistrationNumber.message}</FormMessage>
            )}
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

          <FormItem>
            <FormLabel>Relationship</FormLabel>
            <Select
              options={[
                { value: "Client", label: "Client" },
                { value: "Vendor", label: "Vendor" },
                { value: "Other", label: "Other" },
              ]}
              value={watch("relationship")}
              onChange={(value) =>
                setValue("relationship", value as "Client" | "Vendor" | "Other")
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
          onClick={() => navigate("/customers")}
          className="bg-white"
        >
          Cancel
        </Button>
        <Button variant="primary" type="submit" disabled={isSubmitting}>
          {isSubmitting ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              {isEditing ? "Updating..." : "Creating..."}
            </>
          ) : isEditing ? (
            "Update Customer"
          ) : (
            "Create Customer"
          )}
        </Button>
      </div>
    </form>
  );
}
