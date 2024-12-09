import { useForm } from "react-hook-form";
import type { Company } from "../../types/company";
import { EMIRATES, BUSINESS_TYPES, FREE_ZONES } from "../../types/company";
import { companyService } from "../../lib/services/company";
import { Input } from "../ui/input";
import { Select } from "../ui/select";
import { Button } from "../ui/button";
import { Checkbox } from "../ui/checkbox";
import { Building2, User, CreditCard, Landmark } from "lucide-react";

interface CompanyFormProps {
  company?: Company;
  onSuccess: () => void;
}

export function CompanyForm({ company, onSuccess }: CompanyFormProps) {
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
      ...company, // Spread the company data last to override defaults if editing
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
      // Convert numeric strings to numbers and ensure boolean for reverseChargeMechanism
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

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="max-w-5xl mx-auto space-y-8 bg-white p-6"
    >
      {/* Basic Information */}
      <div className="space-y-6">
        <div className="flex items-center space-x-2 pb-4 border-b">
          <Building2 className="h-5 w-5 text-gray-400" />
          <h2 className="text-lg font-medium text-gray-900">
            Basic Information
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Company Name (EN)
            </label>
            <Input
              {...register("companyNameEn", {
                required: "Company name is required",
              })}
              error={errors.companyNameEn?.message}
              className="w-full"
              placeholder="Enter company name in English"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Company Name (AR)
            </label>
            <Input
              {...register("companyNameAr", {
                required: "Arabic name is required",
              })}
              error={errors.companyNameAr?.message}
              className="w-full"
              placeholder="Enter company name in Arabic"
              dir="rtl"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Trade License Number
            </label>
            <Input
              {...register("tradeLicenseNumber", {
                required: "License number is required",
              })}
              error={errors.tradeLicenseNumber?.message}
              className="w-full"
              placeholder="Enter trade license number"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Primary Business Type
            </label>
            <Select
              options={businessTypeOptions}
              value={watch("primaryBusinessType")}
              onChange={(value) => {
                register("primaryBusinessType").onChange({
                  target: { value, name: "primaryBusinessType" },
                });
              }}
              error={!!errors.primaryBusinessType}
              placeholder="Select business type"
            />
          </div>
          {selectedBusinessType === "Other" && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Business Type Description
              </label>
              <Input
                {...register("businessTypeDescription", {
                  required: "Description is required for Other business type",
                })}
                error={errors.businessTypeDescription?.message}
                className="w-full"
                placeholder="Describe your business type"
              />
            </div>
          )}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Emirate
            </label>
            <Select
              options={emirateOptions}
              value={watch("emirate")}
              onChange={(value) => {
                register("emirate").onChange({
                  target: { value, name: "emirate" },
                });
              }}
              error={!!errors.emirate}
              placeholder="Select emirate"
            />
          </div>
          {selectedEmirate &&
            FREE_ZONES[selectedEmirate as keyof typeof FREE_ZONES] && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Free Zone
                </label>
                <Select
                  options={freeZoneOptions}
                  value={watch("freeZone")}
                  onChange={(value) => {
                    register("freeZone").onChange({
                      target: { value, name: "freeZone" },
                    });
                  }}
                  placeholder="Select free zone"
                />
              </div>
            )}
        </div>
      </div>

      {/* Contact Information */}
      <div className="space-y-6 pt-4">
        <div className="flex items-center space-x-2 pb-4 border-b">
          <User className="h-5 w-5 text-gray-400" />
          <h2 className="text-lg font-medium text-gray-900">
            Contact Information
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              First Name
            </label>
            <Input
              {...register("contactPerson.firstName", {
                required: "First name is required",
              })}
              error={errors.contactPerson?.firstName?.message}
              className="w-full"
              placeholder="Enter first name"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Last Name
            </label>
            <Input
              {...register("contactPerson.lastName", {
                required: "Last name is required",
              })}
              error={errors.contactPerson?.lastName?.message}
              className="w-full"
              placeholder="Enter last name"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <Input
              type="email"
              {...register("contactPerson.email", {
                required: "Email is required",
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: "Invalid email address",
                },
              })}
              error={errors.contactPerson?.email?.message}
              className="w-full"
              placeholder="Enter email address"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Phone Number
            </label>
            <Input
              {...register("contactPerson.phoneNumber", {
                required: "Phone number is required",
              })}
              error={errors.contactPerson?.phoneNumber?.message}
              className="w-full"
              placeholder="Enter phone number"
            />
          </div>
        </div>
      </div>

      {/* Payment and VAT Settings */}
      <div className="space-y-6 pt-4">
        <div className="flex items-center space-x-2 pb-4 border-b">
          <CreditCard className="h-5 w-5 text-gray-400" />
          <h2 className="text-lg font-medium text-gray-900">
            Payment and VAT Settings
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Default Payment Terms (Days)
            </label>
            <Input
              type="number"
              min="0"
              max="365"
              {...register("defaultPaymentTerms", {
                required: "Payment terms are required",
                min: {
                  value: 0,
                  message: "Must be at least 0 days",
                },
                max: {
                  value: 365,
                  message: "Must be less than 365 days",
                },
              })}
              error={errors.defaultPaymentTerms?.message}
              className="w-full"
              placeholder="Enter payment terms"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Default VAT Rate (%)
            </label>
            <Input
              type="number"
              min="0"
              max="100"
              step="0.01"
              {...register("defaultVatRate", {
                required: "VAT rate is required",
                min: {
                  value: 0,
                  message: "Must be at least 0%",
                },
                max: {
                  value: 100,
                  message: "Must be less than 100%",
                },
              })}
              error={errors.defaultVatRate?.message}
              className="w-full"
              placeholder="Enter VAT rate"
            />
          </div>
          <div className="flex items-center bg-gray-50 p-4">
            <label className="flex items-center space-x-2 text-sm font-medium text-gray-700 cursor-pointer">
              <input
                type="checkbox"
                className="h-4 w-4 text-primary border-gray-300 focus:ring-primary"
                {...register("reverseChargeMechanism")}
                onChange={(e) => {
                  setValue("reverseChargeMechanism", e.target.checked);
                }}
              />
              <span>Reverse Charge Mechanism</span>
            </label>
          </div>
        </div>
      </div>

      {/* Bank Details */}
      <div className="space-y-6 pt-4">
        <div className="flex items-center space-x-2 pb-4 border-b">
          <Landmark className="h-5 w-5 text-gray-400" />
          <h2 className="text-lg font-medium text-gray-900">Bank Details</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Bank Name
            </label>
            <Input
              {...register("bankDetails.bankName")}
              className="w-full"
              placeholder="Enter bank name"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Branch
            </label>
            <Input
              {...register("bankDetails.branch")}
              className="w-full"
              placeholder="Enter branch name"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Account Number
            </label>
            <Input
              {...register("bankDetails.accountNumber")}
              className="w-full"
              placeholder="Enter account number"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              SWIFT Code
            </label>
            <Input
              {...register("bankDetails.swiftCode")}
              className="w-full"
              placeholder="Enter SWIFT code"
            />
          </div>
        </div>
      </div>

      {/* Submit Button */}
      <div className="flex justify-end pt-6 border-t">
        <Button
          type="submit"
          variant="primary"
          disabled={isSubmitting}
          className="px-6 py-2"
        >
          {isSubmitting ? (
            <div className="flex items-center space-x-2">
              <span className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></span>
              <span>Saving...</span>
            </div>
          ) : company?.id ? (
            "Update Company"
          ) : (
            "Create Company"
          )}
        </Button>
      </div>
    </form>
  );
}
