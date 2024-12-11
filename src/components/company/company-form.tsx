import React from "react";
import { useForm } from "react-hook-form";
import {
  Building2,
  User,
  MapPin,
  CreditCard,
  Globe,
  FileText,
  Percent,
  ArrowLeft,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import type { Company } from "@/types/company";
import { EMIRATES, BUSINESS_TYPES, FREE_ZONES } from "@/types/company";
import { companyService } from "@/lib/services/company";
import { useNavigate } from "react-router-dom";

interface CompanyFormProps {
  company?: Company;
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
  } = useForm<Company>({
    defaultValues: {
      baseCurrency: "AED",
      defaultVatRate: 5,
      reverseChargeMechanism: false,
      defaultPaymentTerms: 30,
      billingAddress: {
        country: "United Arab Emirates",
      },
      bankDetails: {
        bankName: "",
        branch: "",
        accountNumber: "",
        swiftCode: "",
      },
      ...company,
    },
  });

  const selectedEmirate = watch("emirate");
  const selectedBusinessType = watch("primaryBusinessType");

  const businessTypeOptions = BUSINESS_TYPES.map((type) => ({
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

  const onSubmit = async (data: Company) => {
    try {
      const formattedData = {
        ...data,
        defaultPaymentTerms: Number(data.defaultPaymentTerms),
        defaultVatRate: Number(data.defaultVatRate),
        reverseChargeMechanism: data.reverseChargeMechanism === true,
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

  return (
    <form id="company-form" onSubmit={handleSubmit(onSubmit)}>
      <div className="bg-white rounded 2xl border border-black/10 shadow-sm overflow-hidden">
        {/* Header */}
        <div className="border-b border-gray-200 bg-gray-50/50 px-8 py-6">
          <div className="flex items-center justify-between">
            <h1 className="text-xl font-semibold text-gray-900">
              <Button
                type="button"
                variant="ghost"
                onClick={() => navigate("/companies")}
                className="border-gray-200 hover:bg-gray-50"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
              </Button>
              {company?.id ? "Edit Company" : "New Company"}
            </h1>
            <Button
              type="submit"
              variant="primary"
              disabled={isSubmitting || mode === "view"}
              className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded xl"
            >
              {isSubmitting ? (
                <div className="flex items-center space-x-2">
                  <span className="animate-spin rounded full h-4 w-4 border-b-2 border-white"></span>
                  <span>Saving...</span>
                </div>
              ) : company?.id ? (
                "Update Company"
              ) : (
                "Create Company"
              )}
            </Button>
          </div>
        </div>

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
              <FormItem>
                <FormLabel className="text-gray-700 font-medium">
                  Company Name (EN)
                </FormLabel>
                <Input
                  {...register("companyNameEn", {
                    required: "Company name is required",
                  })}
                  error={errors.companyNameEn?.message}
                  disabled={mode === "view"}
                  placeholder="Enter company name in English"
                  className="rounded xl border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                />
                <FormMessage>{errors.companyNameEn?.message}</FormMessage>
              </FormItem>

              <FormItem>
                <FormLabel className="text-gray-700 font-medium">
                  Company Name (AR)
                </FormLabel>
                <Input
                  {...register("companyNameAr", {
                    required: "Arabic name is required",
                  })}
                  error={errors.companyNameAr?.message}
                  disabled={mode === "view"}
                  placeholder="Enter company name in Arabic"
                  dir="rtl"
                  className="rounded xl border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                />
                <FormMessage>{errors.companyNameAr?.message}</FormMessage>
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
                  {...register("businessTypeDescription")}
                  disabled={mode === "view"}
                  placeholder="Enter business type description"
                  className="rounded xl border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                />
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
              </div>
            </div>
          </div>
        </div>
      </div>
    </form>
  );
}
