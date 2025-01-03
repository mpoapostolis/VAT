import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Building2, User, MapPin, CreditCard } from "lucide-react";
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
import { useNavigate, useParams } from "react-router-dom";
import { useCompanies } from "@/lib/hooks/useCompanies";
import { pb } from "@/lib/pocketbase";

interface CompanyFormProps {
  onSuccess: () => void;
  mode?: "view" | "edit";
}

export function CompanyForm({ onSuccess, mode = "edit" }: CompanyFormProps) {
  const { companies } = useCompanies();
  const id = useParams().id;
  const company = companies?.find((c) => c.id === id);
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
    setValue,
    trigger,
    reset,
  } = useForm<Company>({
    defaultValues: {
      baseCurrency: "AED",
      defaultVatRate: 5,
      reverseChargeMechanism: false,
      defaultPaymentTermsDays: 30,
      billingAddress: {
        country: "United Arab Emirates",
      },
      shippingAddress: {
        country: "United Arab Emirates",
      },
      freeZone: false,
      registrationStatus: "pending",
      isActive: true,
      logo: pb.getFileUrl(company ?? {}, company?.logo as string),
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

  useEffect(() => {
    if (company) {
      reset(company);
    }
  }, [company, reset]);

  const [logoPreview, setLogoPreview] = useState<string | null>(null);

  useEffect(() => {
    if (company?.logo && typeof company.logo === "string") {
      setLogoPreview(pb.getFileUrl(company, company.logo));
    }
  }, [company]);

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

      setValue("logo", file);

      if (logoPreview) {
        URL.revokeObjectURL(logoPreview);
      }
      const newPreviewUrl = URL.createObjectURL(file);
      setLogoPreview(newPreviewUrl);
    } catch (error) {
      console.error("Error uploading logo:", error);
    }
  };

  useEffect(() => {
    return () => {
      if (logoPreview && !company?.logo) {
        URL.revokeObjectURL(logoPreview);
      }
    };
  }, [logoPreview, company]);

  const handleRemoveLogo = () => {
    setValue("logo", undefined);
    if (logoPreview) {
      URL.revokeObjectURL(logoPreview);
      setLogoPreview(null);
    }
  };

  const { mutate: mutateCompanies } = useCompanies();

  const onSubmit = async (data: Company) => {
    try {
      const formData = new FormData();

      Object.entries(data).forEach(([key, value]) => {
        if (key === "logo" && value instanceof File) {
          formData.append("logo", value);
        } else if (key === "billingAddress" || key === "shippingAddress") {
          formData.append(key, JSON.stringify(value));
        } else if (value !== undefined && value !== null) {
          formData.append(key, String(value));
        }
      });

      if (company?.id) {
        await companyService.update(company.id, formData);
      } else {
        await companyService.create(formData);
        reset({
          baseCurrency: "AED",
          defaultVatRate: 5,
          reverseChargeMechanism: false,
          defaultPaymentTermsDays: 30,
          billingAddress: {
            country: "United Arab Emirates",
          },
          shippingAddress: {
            country: "United Arab Emirates",
          },
          freeZone: false,
          registrationStatus: "pending",
          isActive: true,
        });
      }
      await mutateCompanies();
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

  const freeZoneOptions = [
    { value: "", label: "Select Free Zone" },
    ...(selectedEmirate &&
    FREE_ZONES[selectedEmirate as keyof typeof FREE_ZONES]
      ? FREE_ZONES[selectedEmirate as keyof typeof FREE_ZONES].map((zone) => ({
          value: zone,
          label: zone,
        }))
      : []),
  ];

  return (
    <form
      id="company-form"
      onSubmit={handleSubmit(onSubmit)}
      encType="multipart/form-data"
    >
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
                <div className="mt-2 flex items-start space-x-6">
                  <div className="flex-shrink-0">
                    {logoPreview ? (
                      <div className="relative h-24 w-24">
                        <img
                          src={logoPreview}
                          alt="Company logo"
                          className="h-24 w-24 rounded-lg object-cover border border-gray-200"
                        />
                        {!mode || mode === "edit" ? (
                          <button
                            type="button"
                            onClick={handleRemoveLogo}
                            className="absolute -top-2 -right-2 rounded-full bg-white p-1 text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                          >
                            <span className="sr-only">Remove logo</span>
                            <svg
                              className="h-4 w-4"
                              fill="none"
                              viewBox="0 0 24 24"
                              strokeWidth="1.5"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M6 18L18 6M6 6l12 12"
                              />
                            </svg>
                          </button>
                        ) : null}
                      </div>
                    ) : (
                      <div className="h-24 w-24 rounded-lg border-2 border-dashed border-gray-300 bg-white p-2 flex items-center justify-center">
                        <svg
                          className="h-8 w-8 text-gray-400"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth="1.5"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z"
                          />
                        </svg>
                      </div>
                    )}
                  </div>
                  <div className="flex-1">
                    <input
                      type="file"
                      accept="image/jpeg,image/png,image/gif"
                      onChange={handleLogoUpload}
                      disabled={mode === "view"}
                      className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                    />
                    <p className="mt-2 text-sm text-gray-500">
                      Upload a company logo (JPEG, PNG, or GIF, max 5MB)
                    </p>
                    <FormMessage>{errors.logo?.message}</FormMessage>
                  </div>
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
              <div className="p-2 bg-green-50 rounded-lg">
                <MapPin className="h-5 w-5 text-green-500" />
              </div>
              <h2 className="text-lg font-medium text-gray-900">
                Location Information
              </h2>
            </div>

            <div className="space-y-6">
              {/* Emirate Selection */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormItem className="space-y-1.5">
                  <FormLabel className="text-gray-700 font-medium block">
                    Emirate
                  </FormLabel>
                  <Select
                    options={emirateOptions}
                    value={selectedEmirate}
                    onChange={(value) => {
                      setValue("emirate", value);
                      setValue("Designated_Zone", undefined);
                    }}
                    disabled={mode === "view"}
                    error={!!errors.emirate}
                    placeholder="Select Emirate"
                    className="rounded-lg"
                  />
                  <FormMessage>{errors.emirate?.message}</FormMessage>
                </FormItem>
              </div>

              {/* Free Zone Section */}
              <div className="space-y-4 bg-gray-50 p-4 rounded-lg">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="freeZone"
                      {...register("freeZone")}
                      disabled={mode === "view"}
                      className="rounded"
                    />
                    <label
                      htmlFor="freeZone"
                      className="text-sm font-medium text-gray-700 cursor-pointer select-none"
                    >
                      This company operates in a Free Zone
                    </label>
                  </div>
                </div>

                {watch("freeZone") &&
                  selectedEmirate &&
                  freeZoneOptions.length > 1 && (
                    <div className="pl-6">
                      <FormItem className="space-y-1.5">
                        <FormLabel className="text-gray-600 text-sm block">
                          Select Free Zone
                        </FormLabel>
                        <Select
                          options={freeZoneOptions}
                          value={watch("Designated_Zone") || ""}
                          onChange={(value) =>
                            setValue("Designated_Zone", value)
                          }
                          error={!!errors.Designated_Zone}
                          placeholder="Select Free Zone"
                          className="rounded-lg"
                        />
                        <FormMessage>
                          {errors.Designated_Zone?.message}
                        </FormMessage>
                      </FormItem>
                    </div>
                  )}
              </div>
            </div>

            {/* Billing Address */}
            <div className="space-y-4 mt-6">
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
                  {...register("contactPersonFirstName", {
                    required: "First name is required",
                  })}
                  error={errors.contactPersonFirstName?.message}
                  disabled={mode === "view"}
                  placeholder="Enter first name"
                  className="rounded xl border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                />
                <FormMessage>
                  {errors.contactPersonFirstName?.message}
                </FormMessage>
              </FormItem>

              <FormItem>
                <FormLabel className="text-gray-700 font-medium">
                  Contact Person Last Name
                </FormLabel>
                <Input
                  {...register("contactPersonLastName", {
                    required: "Last name is required",
                  })}
                  error={errors.contactPersonLastName?.message}
                  disabled={mode === "view"}
                  placeholder="Enter last name"
                  className="rounded xl border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                />
                <FormMessage>
                  {errors.contactPersonLastName?.message}
                </FormMessage>
              </FormItem>

              <FormItem>
                <FormLabel className="text-gray-700 font-medium">
                  Contact Person Position
                </FormLabel>
                <Input
                  {...register("contactPersonPosition")}
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
                  {...register("email", {
                    required: "Email is required",
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: "Invalid email address",
                    },
                  })}
                  error={errors.email?.message}
                  disabled={mode === "view"}
                  placeholder="Enter email address"
                  className="rounded xl border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                />
                <FormMessage>{errors.email?.message}</FormMessage>
              </FormItem>

              <FormItem>
                <FormLabel className="text-gray-700 font-medium">
                  Phone Number
                </FormLabel>
                <Input
                  {...register("phoneNumber", {
                    required: "Phone number is required",
                  })}
                  error={errors.phoneNumber?.message}
                  disabled={mode === "view"}
                  placeholder="Enter phone number"
                  className="rounded xl border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                />
                <FormMessage>{errors.phoneNumber?.message}</FormMessage>
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
                  {...register("defaultPaymentTermsDays", {
                    required: "Payment terms are required",
                    min: {
                      value: 0,
                      message: "Payment terms cannot be negative",
                    },
                  })}
                  error={errors.defaultPaymentTermsDays?.message}
                  disabled={mode === "view"}
                  className="rounded xl border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                />
                <FormMessage>
                  {errors.defaultPaymentTermsDays?.message}
                </FormMessage>
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
                    {...register("bankName", {
                      required: "Bank name is required",
                    })}
                    disabled={mode === "view"}
                    placeholder="Enter bank name"
                    className="rounded xl border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                  />
                  <FormMessage>{errors.bankName?.message}</FormMessage>
                </FormItem>

                <FormItem>
                  <FormLabel className="text-gray-700 font-medium">
                    Branch
                  </FormLabel>
                  <Input
                    {...register("branch", {
                      required: "Branch name is required",
                    })}
                    disabled={mode === "view"}
                    placeholder="Enter branch name"
                    className="rounded xl border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                  />
                  <FormMessage>{errors.branch?.message}</FormMessage>
                </FormItem>

                <FormItem>
                  <FormLabel className="text-gray-700 font-medium">
                    Account Number
                  </FormLabel>
                  <Input
                    {...register("accountNumber", {
                      required: "Account number is required",
                    })}
                    disabled={mode === "view"}
                    placeholder="Enter account number"
                    className="rounded xl border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                  />
                  <FormMessage>{errors.accountNumber?.message}</FormMessage>
                </FormItem>

                <FormItem>
                  <FormLabel className="text-gray-700 font-medium">
                    SWIFT Code
                  </FormLabel>
                  <Input
                    {...register("swiftCode", {
                      required: "SWIFT code is required",
                    })}
                    disabled={mode === "view"}
                    placeholder="Enter SWIFT code"
                    className="rounded xl border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                  />
                  <FormMessage>{errors.swiftCode?.message}</FormMessage>
                </FormItem>

                <FormItem>
                  <FormLabel className="text-gray-700 font-medium">
                    Account Currency
                  </FormLabel>
                  <Input
                    {...register("accountCurrency", {
                      required: "Account currency is required",
                    })}
                    disabled={mode === "view"}
                    placeholder="Enter account currency"
                    className="rounded xl border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                  />
                  <FormMessage>{errors.accountCurrency?.message}</FormMessage>
                </FormItem>
              </div>
            </div>
          </div>
        </div>

        {/* Form Actions */}
        <div className="border-t border-gray-200 bg-gray-50 px-8 py-5">
          <div className="flex justify-end gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate(-1)}
              className="px-4 py-2"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              disabled={isSubmitting || mode === "view"}
              className="px-4 py-2 bg-blue-500 text-white hover:bg-blue-600"
            >
              {isSubmitting ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        </div>
      </div>
    </form>
  );
}
