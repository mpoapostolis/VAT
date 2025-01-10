import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  FileText,
  Users,
  Info,
  Loader2,
  Building2,
  Phone,
  Receipt,
  User2,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { formatDateForInput } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { useCustomers } from "@/lib/hooks/useCustomers";
import { useNavigate, useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { pb } from "@/lib/pocketbase";
import { useCategories } from "@/lib/hooks/useCategories";

const invoiceFormSchema = z.object({
  type: z.literal("payable"),
  number: z.string().min(1, "Invoice number is required"),
  date: z.string().min(1, "Issue date is required"),
  dueDate: z.string().min(1, "Due date is required"),
  customerId: z.string().min(1, "Vendor is required"),
  currency: z.string().min(1, "Currency is required"),
  exchangeRate: z.number().optional(),
  paymentTerms: z.string().min(1, "Payment terms are required"),
  categoryId: z.string().min(1, "Category is required"),
  subtotal: z.number().min(0),
  vatAmount: z.number().min(0),
  total: z.number().min(0),
  purchaseOrderNumber: z.string().optional(),
  referenceNumber: z.string().optional(),
  notes: z.string().optional(),
});

type InvoiceFormData = z.infer<typeof invoiceFormSchema>;

export function InvoiceForm() {
  const navigate = useNavigate();
  const { id } = useParams();

  const { customers, isLoading: isLoadingCustomers } = useCustomers({
    perPage: 500,
    filter: 'relationship = "Vendor"',
  });
  const { categories } = useCategories({
    perPage: 500,
  });
  const [isSubmittingForm, setIsSubmittingForm] = useState(false);
  const mode = id ? "edit" : "create";

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
    reset,
  } = useForm<InvoiceFormData>({
    resolver: zodResolver(invoiceFormSchema),
    defaultValues: {
      type: "payable",
      date: formatDateForInput(new Date()),
      currency: "AED",
      paymentTerms: "Net 30",
      dueDate: formatDateForInput(
        new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
      ),
      subtotal: 0,
      vatAmount: 0,
      total: 0,
    },
  });

  useEffect(() => {
    async function fetchInvoice() {
      if (mode === "edit" && id) {
        try {
          const invoice = await pb.collection("invoices").getOne(id, {
            expand: "customerId,companyId",
          });
          reset({
            ...invoice,
            date: formatDateForInput(new Date(invoice.date)),
            dueDate: formatDateForInput(new Date(invoice.dueDate)),
          });
        } catch (error) {
          console.error("Error fetching invoice:", error);
        }
      }
    }

    fetchInvoice();
  }, [mode, id, reset]);

  const onSubmitForm = async (data: InvoiceFormData) => {
    try {
      setIsSubmittingForm(true);
      if (mode === "edit" && id) {
        await pb.collection("invoices").update(id, data);
      } else {
        await pb
          .collection("invoices")
          .create({ ...data, userId: pb.authStore.model?.id, status: "draft" });
      }
      navigate("/payables");
    } catch (error) {
      console.error("Error saving invoice:", error);
    } finally {
      setIsSubmittingForm(false);
    }
  };

  const selectedSupplier = customers?.find((c) => c.id === watch("customerId"));

  if (isLoadingCustomers) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="flex flex-col items-center space-y-4">
          <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
          <p className="text-xs text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmitForm)} className="space-y-6">
      <div className="bg-white  border border-black/10 shadow-sm overflow-hidden">
        {/* Header */}
        <div className="p-4 md:p-8 space-y-6 md:space-y-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-blue-50 ">
                <FileText className="h-5 w-5 text-blue-500" />
              </div>
              <div>
                <h2 className="text-xs font-medium text-gray-900">
                  {mode === "edit"
                    ? "Edit Purchase Invoice"
                    : "Create Purchase Invoice"}
                </h2>
                <p className="text-xs text-gray-500 mt-1">
                  Fill in the information below to{" "}
                  {mode === "edit" ? "update" : "create"} your purchase invoice
                </p>
              </div>
            </div>
            <Badge
              variant="secondary"
              className="bg-blue-50 text-blue-700 border-blue-200 text-xs px-3 py-1"
            >
              Purchase Invoice
            </Badge>
          </div>

          {/* Basic Invoice Details */}
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            <FormItem>
              <FormLabel className="text-gray-700 font-medium">
                Invoice Number
                <span className="text-red-500 ml-1">*</span>
              </FormLabel>
              <Input
                {...register("number")}
                placeholder="Enter invoice number"
                className={cn(errors.number ? "border-red-500" : "")}
              />
              {errors.number && (
                <FormMessage>{errors.number.message}</FormMessage>
              )}
            </FormItem>

            <FormItem>
              <FormLabel className="text-gray-700 font-medium">
                Issue Date
                <span className="text-red-500 ml-1">*</span>
              </FormLabel>
              <Input
                type="date"
                {...register("date")}
                className={cn(errors.date ? "border-red-500" : "")}
              />
              {errors.date && <FormMessage>{errors.date.message}</FormMessage>}
            </FormItem>

            <FormItem>
              <FormLabel className="text-gray-700 font-medium">
                Due Date
                <span className="text-red-500 ml-1">*</span>
              </FormLabel>
              <Input
                type="date"
                {...register("dueDate")}
                className={cn(errors.dueDate ? "border-red-500" : "")}
              />
              {errors.dueDate && (
                <FormMessage>{errors.dueDate.message}</FormMessage>
              )}
            </FormItem>

            <FormItem>
              <FormLabel className="text-gray-700 font-medium">
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
            <FormItem>
              <FormLabel className="text-gray-700 font-medium">
                Category
                <span className="text-red-500 ml-1">*</span>
              </FormLabel>
              <Select
                options={
                  categories?.map((category) => ({
                    value: category.id,
                    label: category.name,
                  })) || []
                }
                value={watch("categoryId")}
                onChange={(value) => setValue("categoryId", value)}
                error={!!errors.categoryId}
                className="w-full"
              />
              {errors.categoryId && (
                <FormMessage>{errors.categoryId.message}</FormMessage>
              )}
            </FormItem>
          </div>
        </div>

        {/* Company & Vendor Section */}
        <div className="border-t border-gray-200">
          <div className="p-4 md:p-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Company Information (Being Invoiced) */}

              {/* Vendor Information */}
              <div className="space-y-6">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-blue-50 ">
                    <Users className="h-5 w-5 text-blue-500" />
                  </div>
                  <h3 className="text-xs font-medium text-xs text-gray-900">
                    Vendor Information
                  </h3>
                </div>

                <FormItem>
                  <FormLabel className="text-gray-700 font-medium text-xs">
                    Vendor
                    <span className="text-red-500 ml-1">*</span>
                  </FormLabel>
                  <Select
                    options={(customers || []).map((supplier) => ({
                      value: supplier.id,
                      label:
                        supplier.companyName ||
                        `${supplier.contactFirstName} ${supplier.contactLastName}`,
                    }))}
                    value={watch("customerId")}
                    onChange={(value) => setValue("customerId", value)}
                    error={!!errors.customerId}
                    className="w-full"
                    placeholder="Select supplier"
                  />
                  {errors.customerId && (
                    <FormMessage>{errors.customerId.message}</FormMessage>
                  )}
                </FormItem>

                {selectedSupplier && (
                  <div
                    className={cn(
                      // Layout
                      "flex flex-col gap-4",
                      // Visual
                      " border border-gray-200/50 bg-gray-50",
                      // Spacing
                      "p-4"
                    )}
                  >
                    {/* Company/Individual Name */}
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <Building2 className="h-4 w-4 text-blue-600" />
                        <h4 className="text-xs font-medium text-gray-900">
                          {selectedSupplier.companyName ||
                            `${selectedSupplier.contactFirstName} ${selectedSupplier.contactLastName}`}
                        </h4>
                      </div>
                      {selectedSupplier.businessType && (
                        <div className="flex items-center gap-2 ml-6">
                          <span className="h-1.5 w-1.5 -full bg-gray-400" />
                          <p className="text-xs text-gray-600">
                            {selectedSupplier.businessType}
                          </p>
                        </div>
                      )}
                    </div>

                    {/* Registration Details */}
                    {selectedSupplier.taxRegistrationNumber && (
                      <div className="text-xs text-gray-600 border-t border-gray-200/50 pt-3">
                        <div className="flex items-center gap-2">
                          <Receipt className="h-4 w-4 text-blue-600" />
                          <p className="font-medium text-xs">
                            Registration Details
                          </p>
                        </div>
                        <div className="flex items-center gap-2 mt-2 ml-6">
                          <span className="h-1.5 w-1.5 -full bg-gray-400" />
                          <p className="text-xs">
                            TRN: {selectedSupplier.taxRegistrationNumber}
                          </p>
                        </div>
                      </div>
                    )}

                    {/* Contact Information */}
                    <div className="text-xs text-gray-600 border-t border-gray-200/50 pt-3">
                      <div className="flex items-center gap-2">
                        <User2 className="h-4 w-4 text-blue-600" />
                        <p className="font-medium text-xs">
                          Contact Information
                        </p>
                      </div>
                      <div className="mt-2 space-y-2 ml-6">
                        <div className="flex items-center gap-2">
                          <span className="h-1.5 w-1.5 -full bg-gray-400" />
                          <p className="text-xs">
                            {selectedSupplier.contactFirstName}{" "}
                            {selectedSupplier.contactLastName}
                          </p>
                        </div>
                        {selectedSupplier.phoneNumber && (
                          <div className="flex items-center gap-2">
                            <Phone className="h-3.5 w-3.5 text-gray-500" />
                            <p className="text-xs">
                              {selectedSupplier.phoneNumber}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Invoice Amounts */}
        <div className="border-t border-gray-200">
          <div className="p-4 md:p-8 space-y-6">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-blue-50 ">
                <Info className="h-5 w-5 text-blue-500" />
              </div>
              <h3 className="text-xs font-medium text-gray-900">
                Invoice Amounts
              </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <FormItem>
                <FormLabel className="text-gray-700 font-medium">
                  Subtotal
                  <span className="text-red-500 ml-1">*</span>
                </FormLabel>
                <Input
                  type="number"
                  step="0.01"
                  min="0"
                  {...register("subtotal", { valueAsNumber: true })}
                  className={cn(errors.subtotal ? "border-red-500" : "")}
                  onChange={(e) => {
                    const subtotal = parseFloat(e.target.value) || 0;
                    setValue("subtotal", subtotal);
                    setValue("vatAmount", subtotal * 0.05);
                    setValue("total", subtotal + subtotal * 0.05);
                  }}
                />
                {errors.subtotal && (
                  <FormMessage>{errors.subtotal.message}</FormMessage>
                )}
              </FormItem>

              <FormItem>
                <FormLabel className="text-gray-700 font-medium">
                  VAT Amount (5%)
                </FormLabel>
                <Input
                  type="number"
                  step="0.01"
                  min="0"
                  {...register("vatAmount", { valueAsNumber: true })}
                  className="bg-gray-50"
                  readOnly
                />
              </FormItem>

              <FormItem>
                <FormLabel className="text-gray-700 font-medium">
                  Total Amount
                </FormLabel>
                <Input
                  type="number"
                  step="0.01"
                  min="0"
                  {...register("total", { valueAsNumber: true })}
                  className="bg-gray-50 font-medium"
                  readOnly
                />
              </FormItem>
            </div>
          </div>
        </div>

        {/* Additional Information */}
        <div className="border-t border-gray-200">
          <div className="p-4 md:p-8 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormItem>
                <FormLabel className="text-gray-700 font-medium">
                  Purchase Order Number
                </FormLabel>
                <Input
                  {...register("purchaseOrderNumber")}
                  className="text-xs"
                />
              </FormItem>

              <FormItem>
                <FormLabel className="text-gray-700 font-medium">
                  Reference Number
                </FormLabel>
                <Input {...register("referenceNumber")} className="text-xs" />
              </FormItem>
            </div>

            <FormItem>
              <FormLabel className="text-gray-700 font-medium">Notes</FormLabel>
              <Textarea
                {...register("notes")}
                rows={4}
                placeholder="Enter any additional notes..."
                className="resize-none text-xs"
              />
            </FormItem>
          </div>
        </div>

        {/* Form Actions */}
        <div className="border-t border-gray-200/50 bg-gray-50 px-8 py-5">
          <div className="flex items-center justify-end space-x-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate("/invoices")}
              className="text-xs"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmittingForm}
              className="min-w-[120px] text-xs"
            >
              {isSubmittingForm ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  {mode === "create" ? "Creating..." : "Updating..."}
                </>
              ) : mode === "create" ? (
                "Create Invoice"
              ) : (
                "Update Invoice"
              )}
            </Button>
          </div>
        </div>
      </div>
    </form>
  );
}
