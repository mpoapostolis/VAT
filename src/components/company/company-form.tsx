import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { Building2, User, MapPin, CreditCard, ArrowLeft } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import type { Company } from "@/types/company";
import {
  EMIRATES,
  BUSINESS_TYPES,
  FREE_ZONES,
  SERVICE_TYPES,
} from "@/types/company";
import { companyService } from "@/lib/services/company";
import { useNavigate } from "react-router-dom";

interface CompanyFormProps {
  company?: Company | null;
  onSuccess: () => void;
  mode?: "view" | "edit";
}

export function CompanyForm({
  company,
  onSuccess,
  mode = "edit",
}: CompanyFormProps) {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
    setValue,
    trigger,
  } = useForm<Company>({
    defaultValues: {
      baseCurrency: "AED",
      defaultVatRate: 5,
      reverseChargeMechanism: false,
      defaultPaymentTerms: 30,
      billingAddress: {
        country: "United Arab Emirates",
      },
      shippingAddress: {
        country: "United Arab Emirates",
      },
      bankDetails: {
        bankName: "",
        branch: "",
        accountNumber: "",
        swiftCode: "",
        accountCurrency: "AED",
      },
      registrationStatus: "pending",
      isActive: true,
      ...company,
    },
  });

  const selectedEmirate = watch("emirate");
  const selectedBusinessType = watch("primaryBusinessType");
  const useShippingAddress = watch("useShippingAddress") || false;

  useEffect(() => {
    if (selectedBusinessType === "Other") {
      trigger("businessTypeDescription");
    }
  }, [selectedBusinessType, trigger]);

  const handleLogoUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    try {
      const file = event.target.files?.[0];
      if (!file) return;

      const validTypes = ["image/jpeg", "image/png", "image/gif"];
      if (!validTypes.includes(file.type)) {
        throw new Error("Please upload a valid image file (JPEG, PNG, or GIF)");
      }

      const maxSize = 5 * 1024 * 1024; // 5MB
      if (file.size > maxSize) {
        throw new Error("File size should not exceed 5MB");
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        setValue("logo", reader.result as string);
      };
      reader.readAsDataURL(file);
    } catch (error) {
      console.error("Error uploading logo:", error);
    }
  };

  const onSubmit = async (data: Company) => {
    try {
      const formattedData = {
        ...data,
        defaultPaymentTerms: Number(data.defaultPaymentTerms),
        defaultVatRate: Number(data.defaultVatRate),
        reverseChargeMechanism: data.reverseChargeMechanism === true,
        ...((!data.useShippingAddress || !data.shippingAddress?.street) && {
          shippingAddress: undefined,
        }),
      };

      if (company?.id) {
        await companyService.update(company.id, formattedData);
      } else {
        await companyService.create(formattedData);
      }
      onSuccess();
    } catch (error) {
      console.error("Failed to save company:", error);
    }
  };

  const navigate = useNavigate();

  const businessTypeOptions = BUSINESS_TYPES.map((type) => ({
    value: type,
    label: type,
  }));

  const serviceTypeOptions = SERVICE_TYPES.map((type) => ({
    value: type,
    label: type,
  }));

  const emirateOptions = EMIRATES.map((emirate) => ({
    value: emirate,
    label: emirate,
  }));

  const freeZoneOptions =
    selectedEmirate && FREE_ZONES[selectedEmirate as keyof typeof FREE_ZONES]
      ? FREE_ZONES[selectedEmirate as keyof typeof FREE_ZONES].map((zone) => ({
          value: zone,
          label: zone,
        }))
      : [];

  return (
    <form id="company-form" onSubmit={handleSubmit(onSubmit)}>
      <div className="bg-white rounded 2xl border border-black/10 shadow-sm overflow-hidden">
        {/* Header */}

        <div className="p-8 space-y-8">
          {/* Basic Information */}
          <div className="space-y-6">
            <div className="flex items-center space-x-3 mb-6">
              <div className="p-2 bg-blue-50 rounded lg">
                <Building2 className="h-5 w-5 text-blue-500" />
              </div>
              <h2 className="text-lg font-medium text-gray-900">
                Basic Information
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Logo Upload */}
              <FormItem className="col-span-2">
                <FormLabel className="text-gray-700 font-medium">
                  Company Logo
                </FormLabel>
                <div className="mt-1 flex items-center space-x-4">
                  {watch("logo") && (
                    <img
                      src={watch("logo")}
                      alt="Company logo"
                      className="h-12 w-12 object-contain rounded"
                    />
                  )}
                  <Input
                    type="file"
                    accept="image/jpeg,image/png,image/gif"
                    onChange={handleLogoUpload}
                    disabled={mode === "view"}
                    className="rounded xl border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                  />
                  <FormMessage>{errors.logo?.message}</FormMessage>
                </div>
              </FormItem>

              <FormItem>
                <FormLabel className="text-gray-700 font-medium">
                  Company Name (EN)
                </FormLabel>
                <Input
                  {...register("companyNameEN", {
                    required: "Company name is required",
                  })}
                  error={errors.companyNameEN?.message}
                  disabled={mode === "view"}
                  placeholder="Enter company name in English"
                  className="rounded xl border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                />
                <FormMessage>{errors.companyNameEN?.message}</FormMessage>
              </FormItem>

              <FormItem>
                <FormLabel className="text-gray-700 font-medium">
                  Company Name (AR)
                </FormLabel>
                <Input
                  {...register("companyNameAR", {
                    required: "Arabic name is required",
                  })}
                  error={errors.companyNameAR?.message}
                  disabled={mode === "view"}
                  placeholder="Enter company name in Arabic"
                  dir="rtl"
                  className="rounded xl border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                />
                <FormMessage>{errors.companyNameAR?.message}</FormMessage>
              </FormItem>

              <FormItem>
                <FormLabel className="text-gray-700 font-medium">
                  Trade License Number
                </FormLabel>
                <Input
                  {...register("tradeLicenseNumber", {
                    required: "License number is required",
                  })}
                  error={errors.tradeLicenseNumber?.message}
                  disabled={mode === "view"}
                  placeholder="Enter trade license number"
                  className="rounded xl border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                />
                <FormMessage>{errors.tradeLicenseNumber?.message}</FormMessage>
              </FormItem>

              <FormItem>
                <FormLabel className="text-gray-700 font-medium">
                  Primary Business Type
                </FormLabel>
                <Select
                  options={businessTypeOptions}
                  value={selectedBusinessType}
                  onChange={(value) => setValue("primaryBusinessType", value)}
                  disabled={mode === "view"}
                  error={!!errors.primaryBusinessType}
                  className="rounded xl"
                />
                <FormMessage>{errors.primaryBusinessType?.message}</FormMessage>
              </FormItem>

              <FormItem>
                <FormLabel className="text-gray-700 font-medium">
                  Business Type Description
                </FormLabel>
                <Input
                  {...register("businessTypeDescription", {
                    required:
                      selectedBusinessType === "Other"
                        ? "Business type description is required when 'Other' is selected"
                        : false,
                  })}
                  disabled={mode === "view"}
                  placeholder="Enter business type description"
                  className="rounded xl border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                />
                <FormMessage>
                  {errors.businessTypeDescription?.message}
                </FormMessage>
              </FormItem>

              <FormItem>
                <FormLabel className="text-gray-700 font-medium">
                  Service Type
                </FormLabel>
                <Select
                  options={serviceTypeOptions}
                  value={watch("serviceType")}
                  onChange={(value) => setValue("serviceType", value)}
                  disabled={mode === "view"}
                  error={!!errors.serviceType}
                  className="rounded xl"
                />
                <FormMessage>{errors.serviceType?.message}</FormMessage>
              </FormItem>

              <FormItem>
                <FormLabel className="text-gray-700 font-medium">
                  Website
                </FormLabel>
                <Input
                  {...register("website")}
                  disabled={mode === "view"}
                  placeholder="Enter company website"
                  className="rounded xl border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                />
              </FormItem>
            </div>
          </div>

          {/* Location Information */}
          <div className="space-y-6 pt-6 border-t border-gray-100">
            <div className="flex items-center space-x-3 mb-6">
              <div className="p-2 bg-green-50 rounded lg">
                <MapPin className="h-5 w-5 text-green-500" />
              </div>
              <h2 className="text-lg font-medium text-gray-900">
                Location Information
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormItem>
                <FormLabel className="text-gray-700 font-medium">
                  Emirate
                </FormLabel>
                <Select
                  options={emirateOptions}
                  value={selectedEmirate}
                  onChange={(value) => {
                    setValue("emirate", value);
                    setValue("freeZone", "");
                  }}
                  disabled={mode === "view"}
                  error={!!errors.emirate}
                  className="rounded xl"
                />
                <FormMessage>{errors.emirate?.message}</FormMessage>
              </FormItem>

              {selectedEmirate && freeZoneOptions.length > 0 && (
                <FormItem>
                  <FormLabel className="text-gray-700 font-medium">
                    Free Zone
                  </FormLabel>
                  <Select
                    options={freeZoneOptions}
                    value={watch("freeZone")}
                    onChange={(value) => setValue("freeZone", value)}
                    disabled={mode === "view"}
                    error={!!errors.freeZone}
                    className="rounded xl"
                  />
                  <FormMessage>{errors.freeZone?.message}</FormMessage>
                </FormItem>
              )}
            </div>

            <div className="space-y-4">
              <h3 className="text-base font-medium text-gray-900">
                Billing Address
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormItem>
                  <FormLabel className="text-gray-700 font-medium">
                    Street
                  </FormLabel>
                  <Input
                    {...register("billingAddress.street", {
                      required: "Street is required",
                    })}
                    error={errors.billingAddress?.street?.message}
                    disabled={mode === "view"}
                    placeholder="Enter street address"
                    className="rounded xl border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                  />
                  <FormMessage>
                    {errors.billingAddress?.street?.message}
                  </FormMessage>
                </FormItem>

                <FormItem>
                  <FormLabel className="text-gray-700 font-medium">
                    City
                  </FormLabel>
                  <Input
                    {...register("billingAddress.city", {
                      required: "City is required",
                    })}
                    error={errors.billingAddress?.city?.message}
                    disabled={mode === "view"}
                    placeholder="Enter city"
                    className="rounded xl border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                  />
                  <FormMessage>
                    {errors.billingAddress?.city?.message}
                  </FormMessage>
                </FormItem>

                <FormItem>
                  <FormLabel className="text-gray-700 font-medium">
                    State
                  </FormLabel>
                  <Input
                    {...register("billingAddress.state")}
                    disabled={mode === "view"}
                    placeholder="Enter state"
                    className="rounded xl border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                  />
                </FormItem>

                <FormItem>
                  <FormLabel className="text-gray-700 font-medium">
                    Postal Code
                  </FormLabel>
                  <Input
                    {...register("billingAddress.postalCode")}
                    disabled={mode === "view"}
                    placeholder="Enter postal code"
                    className="rounded xl border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                  />
                </FormItem>
              </div>
            </div>

            {/* Shipping Address */}
            <div className="space-y-4 mt-6">
              <div className="flex items-center justify-between">
                <h3 className="text-base font-medium text-gray-900">
                  Shipping Address
                </h3>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    {...register("useShippingAddress")}
                    disabled={mode === "view"}
                  />
                  <span className="text-sm text-gray-500">
                    Use different shipping address
                  </span>
                </div>
              </div>

              {useShippingAddress && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormItem>
                    <FormLabel className="text-gray-700 font-medium">
                      Street
                    </FormLabel>
                    <Input
                      {...register("shippingAddress.street")}
                      disabled={mode === "view"}
                      placeholder="Enter street address"
                      className="rounded xl border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                    />
                  </FormItem>

                  <FormItem>
                    <FormLabel className="text-gray-700 font-medium">
                      City
                    </FormLabel>
                    <Input
                      {...register("shippingAddress.city")}
                      disabled={mode === "view"}
                      placeholder="Enter city"
                      className="rounded xl border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                    />
                  </FormItem>

                  <FormItem>
                    <FormLabel className="text-gray-700 font-medium">
                      State
                    </FormLabel>
                    <Input
                      {...register("shippingAddress.state")}
                      disabled={mode === "view"}
                      placeholder="Enter state"
                      className="rounded xl border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                    />
                  </FormItem>

                  <FormItem>
                    <FormLabel className="text-gray-700 font-medium">
                      Postal Code
                    </FormLabel>
                    <Input
                      {...register("shippingAddress.postalCode")}
                      disabled={mode === "view"}
                      placeholder="Enter postal code"
                      className="rounded xl border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                    />
                  </FormItem>
                </div>
              )}
            </div>
          </div>

          {/* Contact Information */}
          <div className="space-y-6 pt-6 border-t border-gray-100">
            <div className="flex items-center space-x-3 mb-6">
              <div className="p-2 bg-purple-50 rounded lg">
                <User className="h-5 w-5 text-purple-500" />
              </div>
              <h2 className="text-lg font-medium text-gray-900">
                Contact Information
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormItem>
                <FormLabel className="text-gray-700 font-medium">
                  Contact Person First Name
                </FormLabel>
                <Input
                  {...register("contactPerson.firstName", {
                    required: "First name is required",
                  })}
                  error={errors.contactPerson?.firstName?.message}
                  disabled={mode === "view"}
                  placeholder="Enter first name"
                  className="rounded xl border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                />
                <FormMessage>
                  {errors.contactPerson?.firstName?.message}
                </FormMessage>
              </FormItem>

              <FormItem>
                <FormLabel className="text-gray-700 font-medium">
                  Contact Person Last Name
                </FormLabel>
                <Input
                  {...register("contactPerson.lastName", {
                    required: "Last name is required",
                  })}
                  error={errors.contactPerson?.lastName?.message}
                  disabled={mode === "view"}
                  placeholder="Enter last name"
                  className="rounded xl border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                />
                <FormMessage>
                  {errors.contactPerson?.lastName?.message}
                </FormMessage>
              </FormItem>

              <FormItem>
                <FormLabel className="text-gray-700 font-medium">
                  Contact Person Position
                </FormLabel>
                <Input
                  {...register("contactPerson.position")}
                  disabled={mode === "view"}
                  placeholder="Enter position"
                  className="rounded xl border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                />
              </FormItem>

              <FormItem>
                <FormLabel className="text-gray-700 font-medium">
                  Email
                </FormLabel>
                <Input
                  {...register("contactPerson.email", {
                    required: "Email is required",
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: "Invalid email address",
                    },
                  })}
                  error={errors.contactPerson?.email?.message}
                  disabled={mode === "view"}
                  placeholder="Enter email address"
                  className="rounded xl border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                />
                <FormMessage>
                  {errors.contactPerson?.email?.message}
                </FormMessage>
              </FormItem>

              <FormItem>
                <FormLabel className="text-gray-700 font-medium">
                  Phone Number
                </FormLabel>
                <Input
                  {...register("contactPerson.phoneNumber", {
                    required: "Phone number is required",
                  })}
                  error={errors.contactPerson?.phoneNumber?.message}
                  disabled={mode === "view"}
                  placeholder="Enter phone number"
                  className="rounded xl border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                />
                <FormMessage>
                  {errors.contactPerson?.phoneNumber?.message}
                </FormMessage>
              </FormItem>
            </div>
          </div>

          {/* Financial Information */}
          <div className="space-y-6 pt-6 border-t border-gray-100">
            <div className="flex items-center space-x-3 mb-6">
              <div className="p-2 bg-orange-50 rounded lg">
                <CreditCard className="h-5 w-5 text-orange-500" />
              </div>
              <h2 className="text-lg font-medium text-gray-900">
                Financial Information
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormItem>
                <FormLabel className="text-gray-700 font-medium">
                  Base Currency
                </FormLabel>
                <Input
                  {...register("baseCurrency")}
                  disabled={true}
                  value="AED"
                  className="rounded xl border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                />
              </FormItem>

              <FormItem>
                <FormLabel className="text-gray-700 font-medium">
                  Default VAT Rate (%)
                </FormLabel>
                <Input
                  type="number"
                  {...register("defaultVatRate", {
                    required: "VAT rate is required",
                    min: {
                      value: 0,
                      message: "VAT rate cannot be negative",
                    },
                    max: {
                      value: 100,
                      message: "VAT rate cannot exceed 100%",
                    },
                  })}
                  error={errors.defaultVatRate?.message}
                  disabled={mode === "view"}
                  className="rounded xl border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                />
                <FormMessage>{errors.defaultVatRate?.message}</FormMessage>
              </FormItem>

              <FormItem>
                <FormLabel className="text-gray-700 font-medium">
                  Default Payment Terms (Days)
                </FormLabel>
                <Input
                  type="number"
                  {...register("defaultPaymentTerms", {
                    required: "Payment terms are required",
                    min: {
                      value: 0,
                      message: "Payment terms cannot be negative",
                    },
                  })}
                  error={errors.defaultPaymentTerms?.message}
                  disabled={mode === "view"}
                  className="rounded xl border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                />
                <FormMessage>{errors.defaultPaymentTerms?.message}</FormMessage>
              </FormItem>

              <FormItem>
                <FormLabel className="text-gray-700 font-medium">
                  Reverse Charge Mechanism
                </FormLabel>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    {...register("reverseChargeMechanism")}
                    disabled={mode === "view"}
                  />
                  <span className="text-sm text-gray-500">
                    Enable reverse charge mechanism
                  </span>
                </div>
              </FormItem>
            </div>

            <div className="space-y-4 mt-6">
              <h3 className="text-base font-medium text-gray-900">
                Bank Details
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormItem>
                  <FormLabel className="text-gray-700 font-medium">
                    Bank Name
                  </FormLabel>
                  <Input
                    {...register("bankDetails.bankName")}
                    disabled={mode === "view"}
                    placeholder="Enter bank name"
                    className="rounded xl border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                  />
                </FormItem>

                <FormItem>
                  <FormLabel className="text-gray-700 font-medium">
                    Branch
                  </FormLabel>
                  <Input
                    {...register("bankDetails.branch")}
                    disabled={mode === "view"}
                    placeholder="Enter branch name"
                    className="rounded xl border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                  />
                </FormItem>

                <FormItem>
                  <FormLabel className="text-gray-700 font-medium">
                    Account Number
                  </FormLabel>
                  <Input
                    {...register("bankDetails.accountNumber")}
                    disabled={mode === "view"}
                    placeholder="Enter account number"
                    className="rounded xl border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                  />
                </FormItem>

                <FormItem>
                  <FormLabel className="text-gray-700 font-medium">
                    SWIFT Code
                  </FormLabel>
                  <Input
                    {...register("bankDetails.swiftCode")}
                    disabled={mode === "view"}
                    placeholder="Enter SWIFT code"
                    className="rounded xl border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                  />
                </FormItem>

                <FormItem>
                  <FormLabel className="text-gray-700 font-medium">
                    Account Currency
                  </FormLabel>
                  <Input
                    {...register("bankDetails.accountCurrency")}
                    disabled={mode === "view"}
                    placeholder="Enter account currency"
                    className="rounded xl border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                  />
                </FormItem>
              </div>
            </div>
          </div>
        </div>
      </div>
    </form>
  );
}
