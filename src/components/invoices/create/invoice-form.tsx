import React from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Plus,
  Trash2,
  Building,
  FileText,
  ListPlus,
  Users,
  Info,
  Loader2,
  ShoppingCart,
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
import type { Customer } from "@/lib/pocketbase";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";
import { Separator } from "@/components/ui/separator";
import { Company } from "@/types/company";

const invoiceFormSchema = z.object({
  type: z.string().min(1, "Invoice type is required"),
  number: z.string(),
  date: z.string().min(1, "Issue date is required"),
  dueDate: z.string().min(1, "Due date is required"),
  companyId: z.string().min(1, "Company is required"),
  customerId: z.string().min(1, "Customer is required"),
  currency: z.string().min(1, "Currency is required"),
  exchangeRate: z.number().optional(),
  paymentTerms: z.string().min(1, "Payment terms are required"),
  items: z.array(
    z.object({
      itemNo: z.number(),
      description: z.string().min(1, "Description is required"),
      quantity: z.number().min(1, "Quantity must be at least 1"),
      unitPrice: z.number().min(0, "Unit price must be non-negative"),
      discount: z.object({
        type: z.enum(["percentage", "fixed"]),
        value: z.number().min(0),
      }),
      netAmount: z.number(),
      taxCode: z.enum(["standard", "zero", "exempt"]),
      vatAmount: z.number(),
      subtotal: z.number(),
      total: z.number(),
      reverseCharge: z.boolean(),
      notes: z.string().optional(),
    })
  ),
  subtotal: z.number(),
  vatAmount: z.number(),
  total: z.number(),
  purchaseOrderNumber: z.string().optional(),
  referenceNumber: z.string().optional(),
  termsAndConditions: z.string().optional(),
  paymentInformation: z.string().optional(),
  notes: z.string().optional(),
});

type InvoiceFormData = z.infer<typeof invoiceFormSchema>;

interface InvoiceFormProps {
  companies: Company[];
  customers: Customer[];
  onSubmit: (data: InvoiceFormData) => Promise<void>;
  isSubmitting: boolean;
  onCancel: () => void;
  defaultValues?: Partial<InvoiceFormData>;
  mode?: "view" | "edit" | "create";
}

const defaultItem = {
  itemNo: 1,
  description: "",
  quantity: 1,
  unitPrice: 0,
  discount: { type: "percentage", value: 0 },
  netAmount: 0,
  taxCode: "standard",
  vatAmount: 0,
  subtotal: 0,
  total: 0,
  reverseCharge: false,
  notes: "",
} as const;
const calculateItemTotal = (item: any) => {
  if (!item) return 0;
  const quantity = Number(item.quantity) || 0;
  const unitPrice = Number(item.unitPrice) || 0;
  const discountType = item?.discount?.type || "percentage";
  const discountValue = Number(item?.discount?.value) || 0;
  const taxCode = item.taxCode;

  let netAmount = quantity * unitPrice;
  if (discountType === "percentage") {
    netAmount -= (netAmount * discountValue) / 100;
  } else {
    netAmount -= discountValue;
  }

  let vatAmount = 0;
  if (taxCode === "standard") {
    vatAmount = (netAmount * 5) / 100;
  }

  return netAmount + vatAmount;
};

const calculateSubtotal = (items: any[]) => {
  return items.reduce(
    (acc, item) => acc + Number(item.quantity) * Number(item.unitPrice),
    0
  );
};

const calculateVAT = (items: any[]) => {
  return items.reduce((acc, item) => {
    const taxCode = item.taxCode;
    if (taxCode === "standard") {
      return acc + ((Number(item.quantity) * Number(item.unitPrice)) / 100) * 5;
    }
    return acc;
  }, 0);
};

const calculateTotal = (items: any[]) => {
  return items.reduce((acc, item) => acc + calculateItemTotal(item), 0);
};

export function InvoiceForm({
  companies,
  customers,
  onSubmit,
  isSubmitting,
  onCancel,
  defaultValues,
  mode = "create",
}: InvoiceFormProps) {
  const {
    register,
    control,
    handleSubmit,
    setValue,
    getValues,
    watch,
    formState: { errors },
  } = useForm<InvoiceFormData>({
    resolver: zodResolver(invoiceFormSchema),
    defaultValues: {
      type: "Tax Invoice",
      number: generateInvoiceNumber(),
      date: formatDateForInput(new Date()),
      currency: "AED",
      paymentTerms: "Net 30",
      dueDate: formatDateForInput(
        new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
      ),
      items: [defaultItem],
      subtotal: 0,
      vatAmount: 0,
      total: 0,
      ...defaultValues,
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "items",
  });

  const selectedCompany = companies.find((c) => c.id === watch("companyId"));
  const selectedCustomer = customers.find((c) => c.id === watch("customerId"));

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="bg-white rounded shadow-lg border border-gray-200 divide-y divide-gray-200">
        {/* Header */}
        <div className="p-8">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center space-x-4">
              <div className="bg-blue-50 p-3 rounded">
                <FileText className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-gray-900">
                  {mode === "edit" ? "Edit Invoice" : "Create New Invoice"}
                </h3>
                <p className="text-sm text-gray-500 mt-1">
                  Fill in the information below to{" "}
                  {mode === "edit" ? "update" : "create"} your invoice
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <Badge variant="secondary" className="text-sm px-3 py-1">
                {watch("type")}
              </Badge>
              <Badge
                variant="secondary"
                className="text-sm font-mono px-3 py-1"
              >
                #{watch("number")}
              </Badge>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
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
                Issue Date
                <span className="text-red-500 ml-1">*</span>
              </FormLabel>
              <Input
                type="date"
                {...register("date")}
                className={cn("w-full", errors.date ? "border-red-500" : "")}
              />
              {errors.date && <FormMessage>{errors.date.message}</FormMessage>}
            </FormItem>

            <FormItem className="space-y-2">
              <FormLabel className="text-sm font-medium text-gray-700">
                Due Date
                <span className="text-red-500 ml-1">*</span>
              </FormLabel>
              <Input
                type="date"
                {...register("dueDate")}
                className={cn("w-full", errors.dueDate ? "border-red-500" : "")}
              />
              {errors.dueDate && (
                <FormMessage>{errors.dueDate.message}</FormMessage>
              )}
            </FormItem>

            <FormItem className="space-y-2">
              <FormLabel className="text-sm font-medium text-gray-700">
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

        {/* Company & Customer Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-8">
          {/* Company Information */}
          <div className="space-y-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="bg-blue-50 p-2 rounded">
                <Building className="w-5 h-5 text-blue-600" />
              </div>
              <span className="text-lg font-semibold text-gray-900">
                Company Information
              </span>
            </div>

            <FormItem className="space-y-2">
              <FormLabel className="text-sm font-medium text-gray-700">
                Company
                <span className="text-red-500 ml-1">*</span>
              </FormLabel>
              <Select
                options={companies.map((company) => ({
                  value: company.id,
                  label: company.companyNameEn || company.name,
                }))}
                value={watch("companyId")}
                onChange={(value) => setValue("companyId", value)}
                error={!!errors.companyId}
                className="w-full"
                placeholder="Select company"
              />
              {errors.companyId && (
                <FormMessage>{errors.companyId.message}</FormMessage>
              )}
            </FormItem>

            {selectedCompany && (
              <div className="rounded border border-gray-200 bg-gray-50 p-6 space-y-5 hover:bg-gray-100 transition-colors">
                <div>
                  <p className="text-sm font-medium text-gray-500 mb-2">TRN</p>
                  <p className="text-base font-semibold font-mono text-gray-900">
                    {selectedCompany.tradeLicenseNumber}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500 mb-2">
                    Address
                  </p>
                  <p className="text-base text-gray-900">
                    {selectedCompany.billingAddress?.street},{" "}
                    {selectedCompany.billingAddress?.city}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500 mb-2">
                    Contact
                  </p>
                  <div className="space-y-2">
                    <p className="text-base text-gray-900">
                      {selectedCompany.contactPerson?.firstName}{" "}
                      {selectedCompany.contactPerson?.lastName}
                    </p>
                    <p className="text-base text-gray-900">
                      {selectedCompany.contactPerson?.phoneNumber}
                    </p>
                    <p className="text-base text-gray-900">
                      {selectedCompany.contactPerson?.email}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Customer Information */}
          <div className="space-y-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="bg-blue-50 p-2 rounded">
                <Users className="w-5 h-5 text-blue-600" />
              </div>
              <span className="text-lg font-semibold text-gray-900">
                Customer Information
              </span>
            </div>

            <FormItem className="space-y-2">
              <FormLabel className="text-sm font-medium text-gray-700">
                Customer
                <span className="text-red-500 ml-1">*</span>
              </FormLabel>
              <Select
                options={customers.map((customer) => ({
                  value: customer.id,
                  label:
                    customer.name ||
                    `${customer.firstName} ${customer.lastName}`,
                }))}
                value={watch("customerId")}
                onChange={(value) => setValue("customerId", value)}
                error={!!errors.customerId}
                className="w-full"
                placeholder="Select customer"
              />
              {errors.customerId && (
                <FormMessage>{errors.customerId.message}</FormMessage>
              )}
            </FormItem>

            {selectedCustomer && (
              <div className="rounded border border-gray-200 bg-gray-50 p-6 space-y-5 hover:bg-gray-100 transition-colors">
                <div>
                  <p className="text-sm font-medium text-gray-500 mb-2">TRN</p>
                  <p className="text-base font-semibold font-mono text-gray-900">
                    {selectedCustomer.vatNumber || "N/A"}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500 mb-2">
                    Address
                  </p>
                  <p className="text-base text-gray-900">
                    {selectedCustomer.address || "N/A"}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500 mb-2">
                    Contact
                  </p>
                  <div className="space-y-1">
                    <p className="text-base text-gray-900">
                      {selectedCustomer.phone}
                    </p>
                    <p className="text-base text-gray-900">
                      {selectedCustomer.email}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Invoice Details */}
        <div className="bg-white rounded shadow-sm border border-gray-100 p-8 space-y-6">
          <div className="flex items-center gap-3 text-gray-400">
            <FileText className="w-5 h-5" />
            <span className="font-medium tracking-wide">Invoice Details</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <FormItem className="space-y-2">
              <FormLabel className="text-sm font-medium text-gray-700">
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
                onChange={(value) => {
                  console.log(value);
                  setValue("type", value);
                }}
                error={!!errors.type}
                className="w-full"
              />
              {errors.type && <FormMessage>{errors.type.message}</FormMessage>}
            </FormItem>

            <FormItem className="space-y-2">
              <FormLabel className="text-sm font-medium text-gray-700">
                Invoice Number
                <span className="text-red-500 ml-1">*</span>
              </FormLabel>
              <Input
                {...register("number")}
                className={cn(
                  "w-full font-mono",
                  errors.number ? "border-red-500" : ""
                )}
                readOnly
              />
              {errors.number && (
                <FormMessage>{errors.number.message}</FormMessage>
              )}
            </FormItem>

            <FormItem className="space-y-2">
              <FormLabel className="text-sm font-medium text-gray-700">
                Issue Date
                <span className="text-red-500 ml-1">*</span>
              </FormLabel>
              <Input
                type="date"
                {...register("date")}
                className={cn("w-full", errors.date ? "border-red-500" : "")}
              />
              {errors.date && <FormMessage>{errors.date.message}</FormMessage>}
            </FormItem>

            <FormItem className="space-y-2">
              <FormLabel className="text-sm font-medium text-gray-700">
                Due Date
                <span className="text-red-500 ml-1">*</span>
              </FormLabel>
              <Input
                type="date"
                {...register("dueDate")}
                className={cn("w-full", errors.dueDate ? "border-red-500" : "")}
              />
              {errors.dueDate && (
                <FormMessage>{errors.dueDate.message}</FormMessage>
              )}
            </FormItem>

            <FormItem className="space-y-2">
              <FormLabel className="text-sm font-medium text-gray-700">
                Currency
                <span className="text-red-500 ml-1">*</span>
              </FormLabel>
              <Select
                options={[
                  { value: "AED", label: "AED - UAE Dirham" },
                  { value: "USD", label: "USD - US Dollar" },
                  { value: "EUR", label: "EUR - Euro" },
                  { value: "GBP", label: "GBP - British Pound" },
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

            <FormItem className="space-y-2">
              <FormLabel className="text-sm font-medium text-gray-700">
                Payment Terms
                <span className="text-red-500 ml-1">*</span>
              </FormLabel>
              <Select
                options={[
                  { value: "Net 30", label: "Net 30" },
                  { value: "Net 15", label: "Net 15" },
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
        <div className="p-8">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center space-x-4">
              <div className="bg-blue-50 p-2 rounded">
                <ListPlus className="w-5 h-5 text-blue-600" />
              </div>
              <h4 className="text-lg font-semibold text-gray-900">
                Invoice Items
              </h4>
            </div>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => append(defaultItem)}
              className="flex items-center space-x-2 border-blue-200 text-blue-600 hover:bg-blue-50"
            >
              <Plus className="w-4 h-4" />
              <span>Add Item</span>
            </Button>
          </div>

          <div className="space-y-6">
            {fields.length === 0 ? (
              <div className="text-center py-16 border-2 border-dashed border-gray-200 rounded bg-gray-50">
                <div className="space-y-4">
                  <div className="bg-white p-4 rounded-full w-fit mx-auto shadow-sm">
                    <ShoppingCart className="w-8 h-8 text-gray-400" />
                  </div>
                  <div>
                    <p className="text-gray-600 mb-2">No items added yet</p>
                    <Button
                      type="button"
                      variant="link"
                      onClick={() => append(defaultItem)}
                      className="text-blue-600 hover:text-blue-700 font-medium"
                    >
                      Add your first item
                    </Button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="border border-gray-200 rounded overflow-hidden shadow-sm">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-gray-50">
                      <TableHead className="w-[80px] font-semibold">
                        Item No
                      </TableHead>
                      <TableHead className="min-w-[300px] font-semibold">
                        Description
                      </TableHead>
                      <TableHead className="font-semibold">Quantity</TableHead>
                      <TableHead className="font-semibold">
                        Unit Price
                      </TableHead>
                      <TableHead className="font-semibold">Discount</TableHead>
                      <TableHead className="font-semibold">Tax Code</TableHead>
                      <TableHead className="font-semibold">Total</TableHead>
                      <TableHead className="w-[100px]"></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {fields.map((field, index) => (
                      <TableRow key={field.id}>
                        <TableCell className="font-mono">
                          {String(index + 1).padStart(3, "0")}
                        </TableCell>
                        <TableCell>
                          <div className="space-y-2">
                            <Input
                              {...register(`items.${index}.description`)}
                              placeholder="Item description"
                              className={cn(
                                errors.items?.[index]?.description
                                  ? "border-red-500"
                                  : ""
                              )}
                            />
                            <Input
                              {...register(`items.${index}.notes`)}
                              placeholder="Additional notes (optional)"
                              className="text-sm"
                            />
                          </div>
                        </TableCell>
                        <TableCell>
                          <Input
                            type="number"
                            min="1"
                            {...register(`items.${index}.quantity`)}
                            className={cn(
                              "w-24",
                              errors.items?.[index]?.quantity
                                ? "border-red-500"
                                : ""
                            )}
                          />
                        </TableCell>
                        <TableCell>
                          <Input
                            type="number"
                            step="0.01"
                            min="0"
                            {...register(`items.${index}.unitPrice`)}
                            className={cn(
                              "w-32",
                              errors.items?.[index]?.unitPrice
                                ? "border-red-500"
                                : ""
                            )}
                          />
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-2">
                            <Input
                              type="number"
                              min="0"
                              {...register(`items.${index}.discount.value`)}
                              className="w-24"
                            />
                            <Select
                              options={[
                                { value: "percentage", label: "%" },
                                { value: "fixed", label: "Fixed" },
                              ]}
                              value={watch(`items.${index}.discount.type`)}
                              onChange={(value) =>
                                setValue(`items.${index}.discount.type`, value)
                              }
                              className="w-24"
                            />
                          </div>
                        </TableCell>
                        <TableCell>
                          <Select
                            options={[
                              { value: "standard", label: "Standard (5%)" },
                              { value: "zero", label: "Zero (0%)" },
                              { value: "exempt", label: "Exempt" },
                            ]}
                            value={watch(`items.${index}.taxCode`)}
                            onChange={(value) =>
                              setValue(`items.${index}.taxCode`, value)
                            }
                            className="w-40"
                          />
                        </TableCell>
                        <TableCell className="font-medium">
                          {formatCurrency(
                            calculateItemTotal(watch(`items.${index}`))
                          )}
                        </TableCell>
                        <TableCell>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => remove(index)}
                            className="text-red-600 hover:text-red-700"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}

            {/* Totals */}
            {fields.length > 0 && (
              <div className="flex justify-end mt-8">
                <div className="w-96 space-y-4 bg-gray-50 p-6 rounded border border-gray-200">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Subtotal:</span>
                    <span className="font-semibold text-gray-900">
                      {formatCurrency(calculateSubtotal(watch("items")))}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">VAT:</span>
                    <span className="font-semibold text-gray-900">
                      {formatCurrency(calculateVAT(watch("items")))}
                    </span>
                  </div>
                  <Separator className="my-2" />
                  <div className="flex justify-between">
                    <span className="font-semibold text-gray-900">Total:</span>
                    <span className="font-bold text-lg text-blue-600">
                      {formatCurrency(calculateTotal(watch("items")))}
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Additional Information */}
        <div className="p-8">
          <div className="flex items-center space-x-4 mb-8">
            <div className="bg-blue-50 p-2 rounded">
              <Info className="w-5 h-5 text-blue-600" />
            </div>
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
      <div className="sticky bottom-0 bg-white border-t border-gray-200 shadow-lg py-4 z-10">
        <div className="max-w-7xl mx-auto px-8">
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
              className="w-fit bg-blue-600 hover:bg-blue-700 min-w-[120px]"
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
