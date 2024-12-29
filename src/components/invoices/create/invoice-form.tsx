import React from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Plus,
  Trash2,
  Calendar,
  Building,
  FileText,
  DollarSign,
  ListPlus,
  Users,
  Info,
  Loader2,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  generateInvoiceNumber,
  formatCurrency,
  formatDateForInput,
} from "@/lib/utils";
import type { Company, Customer } from "@/lib/pocketbase";
import { useToast } from "@/lib/hooks/useToast";

const invoiceSchema = z.object({
  number: z.string().min(1, "Invoice number is required"),
  type: z.enum(["Tax Invoice", "Simplified Tax Invoice"]),
  date: z.string().min(1, "Issue date is required"),
  dueDate: z.string().min(1, "Due date is required"),
  companyId: z.string().min(1, "Company is required"),
  customerId: z.string().min(1, "Customer is required"),
  currency: z.string().min(1, "Currency is required"),
  exchangeRate: z.number().optional(),
  paymentTerms: z.string().min(1, "Payment terms are required"),
  items: z.array(
    z.object({
      description: z.string().min(1, "Description is required"),
      quantity: z.number().min(1, "Quantity must be at least 1"),
      price: z.number().min(0, "Price must be non-negative"),
      vat: z.number().min(0, "VAT must be non-negative"),
      total: z.number(),
    })
  ),
  subtotal: z.number(),
  vatAmount: z.number(),
  total: z.number(),
  adjustments: z.number().default(0),
  reverseCharge: z.boolean().default(false),
  purchaseOrderNumber: z.string().optional(),
  referenceNumber: z.string().optional(),
  termsAndConditions: z.string().optional(),
  paymentInformation: z.string().optional(),
  notes: z.string().optional(),
});

type InvoiceFormData = z.infer<typeof invoiceSchema>;

interface InvoiceFormProps {
  companies: Company[];
  customers: Customer[];
  onSubmit: (data: InvoiceFormData) => Promise<void>;
  isSubmitting: boolean;
  onCancel: () => void;
  defaultValues?: Partial<InvoiceFormData>;
  mode?: "view" | "edit" | "create";
}

export function InvoiceForm({
  companies,
  customers,
  onSubmit,
  isSubmitting,
  onCancel,
  defaultValues,
  mode = "create",
}: InvoiceFormProps) {
  const { addToast } = useToast();

  const {
    register,
    control,
    handleSubmit,
    setValue,
    getValues,
    watch,
    formState: { errors },
  } = useForm<InvoiceFormData>({
    resolver: zodResolver(invoiceSchema),
    defaultValues: {
      number: generateInvoiceNumber(),
      type: "Tax Invoice",
      date: formatDateForInput(new Date()),
      currency: "AED",
      paymentTerms: "Net 30",
      dueDate: formatDateForInput(
        new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
      ),
      items: [{ description: "", quantity: 1, price: 0, vat: 5, total: 0 }],
      subtotal: 0,
      vatAmount: 0,
      total: 0,
      reverseCharge: false,
      ...defaultValues,
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "items",
  });

  const updateTotals = React.useCallback(() => {
    const items = getValues("items");
    if (!items?.length) return;

    let subtotal = 0;
    let totalVat = 0;

    items.forEach((item, index) => {
      const quantity = Number(item.quantity) || 0;
      const price = Number(item.price) || 0;
      const vatRate = Number(item.vat) || 5;

      const itemSubtotal = quantity * price;
      const itemVat = (itemSubtotal * vatRate) / 100;
      const itemTotal = itemSubtotal + itemVat;

      subtotal += itemSubtotal;
      totalVat += itemVat;

      setValue(`items.${index}.total`, itemTotal);
    });

    const adjustments = Number(getValues("adjustments")) || 0;
    const total = subtotal + totalVat + adjustments;

    setValue("subtotal", subtotal);
    setValue("vatAmount", totalVat);
    setValue("total", total);
  }, [getValues, setValue]);

  const handleItemBlur = React.useCallback(() => {
    updateTotals();
  }, [updateTotals]);

  const handleAddItem = () => {
    append({
      description: "",
      quantity: 1,
      price: 0,
      vat: 5,
      total: 0,
    });
  };

  const selectedCompany = companies.find((c) => c.id === watch("companyId"));
  const selectedCustomer = customers.find((c) => c.id === watch("customerId"));

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
      {/* Basic Information */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 divide-y divide-gray-200">
        <div className="p-6">
          <div className="flex items-center space-x-2 mb-6">
            <FileText className="w-5 h-5 text-blue-600" />
            <h3 className="text-lg font-semibold text-gray-900">
              Basic Information
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormItem className="space-y-2">
              <FormLabel className="text-sm font-medium text-gray-700 flex items-center">
                Invoice Type
                <span className="text-red-500 ml-1">*</span>
              </FormLabel>
              <Select
                options={[
                  { value: "Tax Invoice", label: "Tax Invoice" },
                  {
                    value: "Simplified Tax Invoice",
                    label: "Simplified Tax Invoice",
                  },
                ]}
                value={watch("type")}
                onChange={(value) => setValue("type", value)}
                error={!!errors.type}
                className="w-full"
              />
              {errors.type && <FormMessage>{errors.type.message}</FormMessage>}
            </FormItem>

            <FormItem className="space-y-2">
              <FormLabel className="text-sm font-medium text-gray-700">
                Invoice Number
              </FormLabel>
              <Input
                {...register("number")}
                disabled={true}
                className="bg-gray-50 font-mono text-gray-600"
              />
            </FormItem>

            <FormItem className="space-y-2">
              <FormLabel className="text-sm font-medium text-gray-700 flex items-center">
                Issue Date
                <span className="text-red-500 ml-1">*</span>
              </FormLabel>
              <Input
                type="date"
                {...register("date")}
                className={errors.date ? "border-red-500" : ""}
              />
              {errors.date && <FormMessage>{errors.date.message}</FormMessage>}
            </FormItem>

            <FormItem className="space-y-2">
              <FormLabel className="text-sm font-medium text-gray-700 flex items-center">
                Due Date
                <span className="text-red-500 ml-1">*</span>
              </FormLabel>
              <Input
                type="date"
                {...register("dueDate")}
                className={errors.dueDate ? "border-red-500" : ""}
              />
              {errors.dueDate && (
                <FormMessage>{errors.dueDate.message}</FormMessage>
              )}
            </FormItem>
          </div>
        </div>

        {/* Company Information */}
        <div className="p-6">
          <div className="flex items-center space-x-2 mb-6">
            <Building className="w-5 h-5 text-blue-600" />
            <h3 className="text-lg font-semibold text-gray-900">
              Company Information
            </h3>
          </div>

          <FormItem className="space-y-2 mb-6">
            <FormLabel className="text-sm font-medium text-gray-700 flex items-center">
              Select Company
              <span className="text-red-500 ml-1">*</span>
            </FormLabel>
            <Select
              options={companies.map((c) => ({
                value: c.id,
                label: c.businessName,
              }))}
              value={watch("companyId")}
              onChange={(value) => setValue("companyId", value)}
              error={!!errors.companyId}
              className="w-full"
            />
            {errors.companyId && (
              <FormMessage>{errors.companyId.message}</FormMessage>
            )}
          </FormItem>

          {selectedCompany && (
            <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-1">
                  <label className="text-sm font-medium text-gray-700">
                    Business Name
                  </label>
                  <p className="text-gray-900 font-medium">
                    {selectedCompany.businessName}
                  </p>
                </div>
                <div className="space-y-1">
                  <label className="text-sm font-medium text-gray-700">
                    TRN
                  </label>
                  <p className="text-gray-900 font-mono font-medium">
                    {selectedCompany.trn}
                  </p>
                </div>
                <div className="space-y-1">
                  <label className="text-sm font-medium text-gray-700">
                    Address
                  </label>
                  <p className="text-gray-900">{selectedCompany.address}</p>
                </div>
                <div className="space-y-1">
                  <label className="text-sm font-medium text-gray-700">
                    Contact
                  </label>
                  <p className="text-gray-900">{selectedCompany.phone}</p>
                  <p className="text-gray-900">{selectedCompany.email}</p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Customer Information */}
        <div className="p-6">
          <div className="flex items-center space-x-2 mb-6">
            <Users className="w-5 h-5 text-blue-600" />
            <h3 className="text-lg font-semibold text-gray-900">
              Customer Information
            </h3>
          </div>

          <FormItem className="space-y-2 mb-6">
            <FormLabel className="text-sm font-medium text-gray-700 flex items-center">
              Select Customer
              <span className="text-red-500 ml-1">*</span>
            </FormLabel>
            <Select
              options={customers.map((c) => ({
                value: c.id,
                label: c.businessName || `${c.firstName} ${c.lastName}`,
              }))}
              value={watch("customerId")}
              onChange={(value) => setValue("customerId", value)}
              error={!!errors.customerId}
              className="w-full"
            />
            {errors.customerId && (
              <FormMessage>{errors.customerId.message}</FormMessage>
            )}
          </FormItem>

          {selectedCustomer && (
            <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-1">
                  <label className="text-sm font-medium text-gray-700">
                    Business Name
                  </label>
                  <p className="text-gray-900 font-medium">
                    {selectedCustomer.businessName ||
                      `${selectedCustomer.firstName} ${selectedCustomer.lastName}`}
                  </p>
                </div>
                <div className="space-y-1">
                  <label className="text-sm font-medium text-gray-700">
                    TRN
                  </label>
                  <p className="text-gray-900 font-mono font-medium">
                    {selectedCustomer.trn || "N/A"}
                  </p>
                </div>
                <div className="space-y-1">
                  <label className="text-sm font-medium text-gray-700">
                    Billing Address
                  </label>
                  <p className="text-gray-900">
                    {selectedCustomer.billingAddress}
                  </p>
                </div>
                <div className="space-y-1">
                  <label className="text-sm font-medium text-gray-700">
                    Contact
                  </label>
                  <p className="text-gray-900">{selectedCustomer.phone}</p>
                  <p className="text-gray-900">{selectedCustomer.email}</p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Financial Information */}
        <div className="p-6">
          <div className="flex items-center space-x-2 mb-6">
            <DollarSign className="w-5 h-5 text-blue-600" />
            <h3 className="text-lg font-semibold text-gray-900">
              Financial Information
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormItem className="space-y-2">
              <FormLabel className="text-sm font-medium text-gray-700 flex items-center">
                Currency
                <span className="text-red-500 ml-1">*</span>
              </FormLabel>
              <Select
                options={[
                  { value: "AED", label: "AED - UAE Dirham" },
                  { value: "USD", label: "USD - US Dollar" },
                  { value: "EUR", label: "EUR - Euro" },
                ]}
                value={watch("currency")}
                onChange={(value) => setValue("currency", value)}
                error={!!errors.currency}
                className="w-full"
              />
              {errors.currency && (
                <FormMessage>{errors.currency.message}</FormMessage>
              )}
            </FormItem>

            {watch("currency") !== "AED" && (
              <FormItem className="space-y-2">
                <FormLabel className="text-sm font-medium text-gray-700 flex items-center">
                  Exchange Rate to AED
                  <span className="text-red-500 ml-1">*</span>
                </FormLabel>
                <Input
                  type="number"
                  step="0.0001"
                  {...register("exchangeRate", { valueAsNumber: true })}
                  className={errors.exchangeRate ? "border-red-500" : ""}
                />
                {errors.exchangeRate && (
                  <FormMessage>{errors.exchangeRate.message}</FormMessage>
                )}
              </FormItem>
            )}

            <FormItem className="space-y-2">
              <FormLabel className="text-sm font-medium text-gray-700 flex items-center">
                Payment Terms
                <span className="text-red-500 ml-1">*</span>
              </FormLabel>
              <Select
                options={[
                  { value: "Net 30", label: "Net 30 days" },
                  { value: "Net 60", label: "Net 60 days" },
                  { value: "Due on Receipt", label: "Due on Receipt" },
                ]}
                value={watch("paymentTerms")}
                onChange={(value) => setValue("paymentTerms", value)}
                error={!!errors.paymentTerms}
                className="w-full"
              />
              {errors.paymentTerms && (
                <FormMessage>{errors.paymentTerms.message}</FormMessage>
              )}
            </FormItem>
          </div>
        </div>

        {/* Invoice Items */}
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-2">
              <ListPlus className="w-5 h-5 text-blue-600" />
              <h3 className="text-lg font-semibold text-gray-900">
                Invoice Items
              </h3>
            </div>
            <Button
              type="button"
              onClick={handleAddItem}
              variant="outline"
              size="sm"
              className="flex items-center text-blue-600 hover:text-blue-700 border-blue-200 hover:border-blue-300"
            >
              <Plus className="w-4 h-4 mr-1" />
              Add Item
            </Button>
          </div>

          <div className="space-y-4">
            {fields.map((field, index) => (
              <div
                key={field.id}
                className="bg-gray-50 rounded-lg p-4 border border-gray-200"
              >
                <div className="grid grid-cols-12 gap-4">
                  <div className="col-span-12 md:col-span-4">
                    <FormItem className="space-y-2">
                      <FormLabel className="text-sm font-medium text-gray-700 flex items-center">
                        Description
                        <span className="text-red-500 ml-1">*</span>
                      </FormLabel>
                      <Input
                        {...register(`items.${index}.description`)}
                        onBlur={handleItemBlur}
                        className={
                          errors.items?.[index]?.description
                            ? "border-red-500"
                            : ""
                        }
                      />
                      {errors.items?.[index]?.description && (
                        <FormMessage>
                          {errors.items[index].description.message}
                        </FormMessage>
                      )}
                    </FormItem>
                  </div>
                  <div className="col-span-6 md:col-span-2">
                    <FormItem className="space-y-2">
                      <FormLabel className="text-sm font-medium text-gray-700 flex items-center">
                        Quantity
                        <span className="text-red-500 ml-1">*</span>
                      </FormLabel>
                      <Input
                        type="number"
                        {...register(`items.${index}.quantity`, {
                          valueAsNumber: true,
                        })}
                        onBlur={handleItemBlur}
                        min="1"
                        className={
                          errors.items?.[index]?.quantity
                            ? "border-red-500"
                            : ""
                        }
                      />
                      {errors.items?.[index]?.quantity && (
                        <FormMessage>
                          {errors.items[index].quantity.message}
                        </FormMessage>
                      )}
                    </FormItem>
                  </div>
                  <div className="col-span-6 md:col-span-2">
                    <FormItem className="space-y-2">
                      <FormLabel className="text-sm font-medium text-gray-700 flex items-center">
                        Price
                        <span className="text-red-500 ml-1">*</span>
                      </FormLabel>
                      <Input
                        type="number"
                        {...register(`items.${index}.price`, {
                          valueAsNumber: true,
                        })}
                        onBlur={handleItemBlur}
                        step="0.01"
                        className={
                          errors.items?.[index]?.price ? "border-red-500" : ""
                        }
                      />
                      {errors.items?.[index]?.price && (
                        <FormMessage>
                          {errors.items[index].price.message}
                        </FormMessage>
                      )}
                    </FormItem>
                  </div>
                  <div className="col-span-6 md:col-span-2">
                    <FormItem className="space-y-2">
                      <FormLabel className="text-sm font-medium text-gray-700">
                        VAT %
                      </FormLabel>
                      <Select
                        options={[
                          { value: "0", label: "0%" },
                          { value: "5", label: "5%" },
                        ]}
                        value={watch(`items.${index}.vat`).toString()}
                        onChange={(value) => {
                          setValue(`items.${index}.vat`, Number(value));
                          handleItemBlur();
                        }}
                        className="w-full"
                      />
                    </FormItem>
                  </div>
                  <div className="col-span-4 md:col-span-1">
                    <FormLabel className="text-sm font-medium text-gray-700">
                      Total
                    </FormLabel>
                    <div className="text-right font-medium pt-2 text-gray-900">
                      {formatCurrency(watch(`items.${index}.total`))}
                    </div>
                  </div>
                  <div className="col-span-2 md:col-span-1 flex justify-end items-start pt-8">
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => remove(index)}
                      className="text-red-600 hover:text-red-700 hover:bg-red-50"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Totals */}
        <div className="p-6 bg-gray-50">
          <div className="flex justify-end">
            <div className="w-full md:w-72">
              <div className="space-y-4">
                <div className="flex justify-between items-center text-gray-600">
                  <span>Subtotal:</span>
                  <span className="font-medium text-gray-900">
                    {formatCurrency(watch("subtotal"))}
                  </span>
                </div>
                <div className="flex justify-between items-center text-gray-600">
                  <span>VAT:</span>
                  <span className="font-medium text-gray-900">
                    {formatCurrency(watch("vatAmount"))}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Adjustments:</span>
                  <Input
                    type="number"
                    {...register("adjustments", { valueAsNumber: true })}
                    onBlur={updateTotals}
                    className="w-32"
                  />
                </div>
                <div className="flex justify-between items-center pt-4 border-t border-gray-200">
                  <span className="text-lg font-semibold text-gray-900">
                    Total:
                  </span>
                  <span className="text-lg font-bold text-blue-600">
                    {formatCurrency(watch("total"))}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Additional Information */}
        <div className="p-6">
          <div className="flex items-center space-x-2 mb-6">
            <Info className="w-5 h-5 text-blue-600" />
            <h3 className="text-lg font-semibold text-gray-900">
              Additional Information
            </h3>
          </div>

          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormItem className="space-y-2">
                <FormLabel className="text-sm font-medium text-gray-700">
                  Purchase Order Number
                </FormLabel>
                <Input {...register("purchaseOrderNumber")} />
              </FormItem>

              <FormItem className="space-y-2">
                <FormLabel className="text-sm font-medium text-gray-700">
                  Reference Number
                </FormLabel>
                <Input {...register("referenceNumber")} />
              </FormItem>
            </div>

            <FormItem className="space-y-2">
              <FormLabel className="text-sm font-medium text-gray-700">
                Terms & Conditions
              </FormLabel>
              <Textarea
                {...register("termsAndConditions")}
                rows={4}
                placeholder="Enter terms and conditions..."
                className="resize-none"
              />
            </FormItem>

            <FormItem className="space-y-2">
              <FormLabel className="text-sm font-medium text-gray-700">
                Payment Information
              </FormLabel>
              <Textarea
                {...register("paymentInformation")}
                rows={4}
                placeholder="Enter payment information..."
                className="resize-none"
              />
            </FormItem>

            <FormItem className="space-y-2">
              <FormLabel className="text-sm font-medium text-gray-700">
                Notes
              </FormLabel>
              <Textarea
                {...register("notes")}
                rows={4}
                placeholder="Enter any additional notes..."
                className="resize-none"
              />
            </FormItem>
          </div>
        </div>
      </div>

      {/* Form Actions */}
      <div className="sticky border rounded bottom-0 bg-white border-t border-gray-200 shadow-lg p-4 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-end space-x-4">
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
              disabled={isSubmitting}
              className="w-32"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-fit bg-blue-600 hover:bg-blue-700"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Saving...
                </>
              ) : mode === "edit" ? (
                "Update Invoice"
              ) : (
                "Create Invoice"
              )}
            </Button>
          </div>
        </div>
      </div>
    </form>
  );
}
