import React from "react";
import { useForm, useFieldArray } from "react-hook-form";
import {
  Plus,
  Trash2,
  Calendar,
  User,
  Tag,
  FileText,
  DollarSign,
  ArrowLeft,
  Download,
  Edit2,
} from "lucide-react";
import { Input } from "../../../components/ui/input";
import { Select } from "../../../components/ui/select";
import { FormItem, FormLabel, FormMessage } from "../../../components/ui/form";
import { Button } from "../../../components/ui/button";
import {
  generateInvoiceNumber,
  formatCurrency,
  formatDateForInput,
} from "../../../lib/utils";
import type { Invoice, InvoiceItem, Category } from "../../../lib/pocketbase";
import useSWR from "swr";
import { useNavigate } from "react-router-dom";
import { useToast } from "../../../lib/hooks/useToast";
import html2pdf from "html2pdf.js";
import { InvoicePDF } from "../invoice-pdf";
import ReactDOM from "react-dom";
import { FolderOpen } from "lucide-react";

type InvoiceFormData = Omit<Invoice, "id">;

interface InvoiceFormProps {
  customers: any[];
  onSubmit: (data: InvoiceFormData) => Promise<void>;
  isSubmitting: boolean;
  onCancel: () => void;
  defaultValues?: Partial<InvoiceFormData>;
  mode?: "view" | "edit";
}

export function InvoiceForm({
  customers,
  onSubmit,
  isSubmitting,
  onCancel,
  defaultValues,
  mode = "edit",
}: InvoiceFormProps) {
  const { data: categoriesData } = useSWR<{ items: Category[] }>("categories");
  const incomeCategories =
    categoriesData?.items.filter((cat) => cat.type === "income") || [];
  const navigate = useNavigate();
  const formRef = React.useRef<HTMLFormElement>(null);
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
    defaultValues: {
      number: generateInvoiceNumber(),
      status: "draft",
      date: formatDateForInput(defaultValues?.date || new Date()),
      dueDate: formatDateForInput(
        defaultValues?.dueDate ||
          new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
      ),
      items: defaultValues?.items || [
        { description: "", quantity: 1, price: 0, vat: 24, total: 0 },
      ],
      subtotal: 0,
      vat: 0,
      total: 0,
      ...defaultValues,
      ...(defaultValues?.date && {
        date: formatDateForInput(defaultValues.date),
      }),
      ...(defaultValues?.dueDate && {
        dueDate: formatDateForInput(defaultValues.dueDate),
      }),
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
      const vatRate = Number(item.vat) || 24;

      const itemSubtotal = quantity * price;
      const itemVat = (itemSubtotal * vatRate) / 100;
      const itemTotal = itemSubtotal + itemVat;

      subtotal += itemSubtotal;
      totalVat += itemVat;

      setValue(`items.${index}.total`, itemTotal);
    });

    const total = subtotal + totalVat;

    setValue("subtotal", subtotal);
    setValue("vat", totalVat);
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
      vat: 24,
      total: 0,
    });
  };

  const handleDownload = async () => {
    if (!formRef.current || !defaultValues) return;

    // Find customer data
    const customer = customers.find((c) => c.id === defaultValues.customerId);
    if (!customer) {
      addToast("Customer not found", "error");
      return;
    }

    // Create a temporary div for the PDF
    const tempDiv = document.createElement("div");
    document.body.appendChild(tempDiv);

    // Render the PDF component
    const root = ReactDOM.createRoot(tempDiv);
    root.render(<InvoicePDF invoice={defaultValues} customer={customer} />);

    // Wait for images to load
    await new Promise((resolve) => setTimeout(resolve, 500));

    const opt = {
      margin: [10, 10],
      filename: `invoice-${defaultValues.number}.pdf`,
      image: { type: "jpeg", quality: 0.98 },
      html2canvas: { 
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: "#ffffff",
      },
      jsPDF: { 
        unit: "mm", 
        format: "a4", 
        orientation: "portrait",
        compress: true,
      },
    };

    try {
      addToast("Generating PDF...", "info");
      await html2pdf().set(opt).from(tempDiv).save();
      addToast("PDF downloaded successfully", "success");
    } catch (error) {
      addToast("Failed to generate PDF", "error");
      console.error("PDF generation error:", error);
    } finally {
      // Clean up
      document.body.removeChild(tempDiv);
    }
  };

  return (
    <form ref={formRef} id="invoice-form" onSubmit={handleSubmit(onSubmit)}>
      <div className="bg-white rounded -2xl border border-black/10 shadow-sm overflow-hidden">
        {/* Header */}
        <div className="border-b border-gray-200 bg-gray-50/50 px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                type="button"
                onClick={onCancel}
                className="inline-flex items-center space-x-2 text-gray-600 hover:text-gray-900"
              >
                <ArrowLeft className="h-5 w-5" />
                <span>Back</span>
              </button>
              {mode === "view" && (
                <div className="ml-8">
                  <h1 className="text-xl font-semibold text-gray-900">
                    Invoice #{defaultValues?.number}
                  </h1>
                  <p className="text-sm text-gray-600 mt-1">
                    Created on {new Date(defaultValues?.date || "").toLocaleDateString()}
                  </p>
                </div>
              )}
            </div>
            <div className="flex items-center space-x-4">
              {mode === "view" ? (
                <>
                  <Button
                    type="button"
                    onClick={() => navigate(`/invoices/${defaultValues?.id}/edit`)}
                    className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl flex items-center space-x-2"
                  >
                    <Edit2 className="h-4 w-4" />
                    <span>Edit</span>
                  </Button>
                  <Button
                    type="button"
                    onClick={handleDownload}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl flex items-center space-x-2"
                  >
                    <FileText className="h-4 w-4" />
                    <span>Export PDF</span>
                  </Button>
                </>
              ) : (
                <Button
                  type="submit"
                  variant="primary"
                  disabled={isSubmitting}
                  className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl"
                >
                  {isSubmitting ? (
                    <div className="flex items-center space-x-2">
                      <span className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></span>
                      <span>Saving...</span>
                    </div>
                  ) : defaultValues?.id ? (
                    "Update Invoice"
                  ) : (
                    "Create Invoice"
                  )}
                </Button>
              )}
            </div>
          </div>
        </div>

        <div className="p-8 space-y-8">
          {/* Basic Information */}
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-6">
              <FormItem>
                <FormLabel className="text-[#0F172A]">Customer</FormLabel>
                {mode === "view" ? (
                  <div className="flex items-center space-x-3 mt-2">
                    <img
                      src={`https://ui-avatars.com/api/?name=${customers.find(c => c.id === watch("customerId"))?.name || ""}&background=random`}
                      alt={customers.find(c => c.id === watch("customerId"))?.name}
                      className="w-8 h-8 rounded-lg border border-black/10"
                    />
                    <div>
                      <div className="font-medium text-gray-900">
                        {customers.find(c => c.id === watch("customerId"))?.name}
                      </div>
                      <div className="text-sm text-gray-600">
                        {customers.find(c => c.id === watch("customerId"))?.email}
                      </div>
                    </div>
                  </div>
                ) : (
                  <Select
                    options={customers?.map((c) => ({
                      value: c.id,
                      label: c.name,
                    }))}
                    onChange={(value) => setValue("customerId", value)}
                    value={watch("customerId")}
                    placeholder="Select customer"
                    disabled={mode === "view"}
                  />
                )}
                {errors.customerId && (
                  <FormMessage>{errors.customerId.message}</FormMessage>
                )}
              </FormItem>

              <FormItem>
                <FormLabel className="text-[#0F172A]">Category</FormLabel>
                {mode === "view" ? (
                  <div className="flex items-center space-x-3 mt-2">
                    <div className="p-2 rounded-lg bg-[#F1F5F9]">
                      <FolderOpen className="w-4 h-4 text-[#3B82F6]" />
                    </div>
                    <div>
                      <div className="font-medium text-gray-900">
                        {incomeCategories.find(c => c.id === watch("categoryId"))?.name}
                      </div>
                      <div className="text-sm text-gray-600">Income</div>
                    </div>
                  </div>
                ) : (
                  <Select
                    options={incomeCategories?.map((c) => ({
                      value: c.id,
                      label: c.name,
                    }))}
                    onChange={(value) => setValue("categoryId", value)}
                    value={watch("categoryId")}
                    placeholder="Select category"
                    disabled={mode === "view"}
                  />
                )}
                {errors.categoryId && (
                  <FormMessage>{errors.categoryId.message}</FormMessage>
                )}
              </FormItem>

              <FormItem>
                <FormLabel className="text-[#0F172A]">Issue Date</FormLabel>
                {mode === "view" ? (
                  <div className="mt-2 font-medium text-gray-900">
                    {new Date(watch("date")).toLocaleDateString()}
                  </div>
                ) : (
                  <Input
                    type="date"
                    {...register("date", { required: "Issue date is required" })}
                    className="bg-white border border-black/10 focus:border-[#3B82F6] focus:ring-1 focus:ring-[#3B82F6]"
                  />
                )}
                {errors.date && <FormMessage>{errors.date.message}</FormMessage>}
              </FormItem>

              <FormItem>
                <FormLabel className="text-[#0F172A]">Due Date</FormLabel>
                {mode === "view" ? (
                  <div className="mt-2 font-medium text-gray-900">
                    {new Date(watch("dueDate")).toLocaleDateString()}
                  </div>
                ) : (
                  <Input
                    type="date"
                    {...register("dueDate", { required: "Due date is required" })}
                    className="bg-white border border-black/10 focus:border-[#3B82F6] focus:ring-1 focus:ring-[#3B82F6]"
                  />
                )}
                {errors.dueDate && (
                  <FormMessage>{errors.dueDate.message}</FormMessage>
                )}
              </FormItem>
            </div>
          </div>

          {/* Invoice Items */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-[#0F172A]">
              Invoice Items
            </h3>
            <div className="space-y-4">
              {fields.map((field, index) => (
                <div
                  key={field.id}
                  className="grid grid-cols-12 gap-4 items-start p-4 bg-[#F8FAFC] rounded -lg border border-black/10"
                >
                  <div className="col-span-4">
                    <FormLabel className="text-[#0F172A]">
                      Description
                    </FormLabel>
                    {mode === "view" ? (
                      <div className="mt-2 font-medium text-gray-900">
                        {watch(`items.${index}.description`)}
                      </div>
                    ) : (
                      <Input
                        {...register(`items.${index}.description`)}
                        onBlur={handleItemBlur}
                        placeholder="Item description"
                        className="bg-white border border-black/10 focus:border-[#3B82F6] focus:ring-1 focus:ring-[#3B82F6]"
                      />
                    )}
                  </div>
                  <div className="col-span-2">
                    <FormLabel className="text-[#0F172A]">Quantity</FormLabel>
                    {mode === "view" ? (
                      <div className="mt-2 font-medium text-gray-900">
                        {watch(`items.${index}.quantity`)}
                      </div>
                    ) : (
                      <Input
                        type="number"
                        {...register(`items.${index}.quantity`)}
                        onBlur={handleItemBlur}
                        min="1"
                        className="bg-white border border-black/10 focus:border-[#3B82F6] focus:ring-1 focus:ring-[#3B82F6]"
                      />
                    )}
                  </div>
                  <div className="col-span-2">
                    <FormLabel className="text-[#0F172A]">Price</FormLabel>
                    {mode === "view" ? (
                      <div className="mt-2 font-medium text-gray-900">
                        {formatCurrency(watch(`items.${index}.price`))}
                      </div>
                    ) : (
                      <Input
                        type="number"
                        {...register(`items.${index}.price`)}
                        onBlur={handleItemBlur}
                        min="0"
                        step="0.01"
                        className="bg-white border border-black/10 focus:border-[#3B82F6] focus:ring-1 focus:ring-[#3B82F6]"
                      />
                    )}
                  </div>
                  <div className="col-span-2">
                    <FormLabel className="text-[#0F172A]">VAT %</FormLabel>
                    {mode === "view" ? (
                      <div className="mt-2 font-medium text-gray-900">
                        {watch(`items.${index}.vat`)}%
                      </div>
                    ) : (
                      <Input
                        type="number"
                        {...register(`items.${index}.vat`)}
                        onBlur={handleItemBlur}
                        min="0"
                        max="100"
                        className="bg-white border border-black/10 focus:border-[#3B82F6] focus:ring-1 focus:ring-[#3B82F6]"
                      />
                    )}
                  </div>
                  <div className="col-span-1">
                    <FormLabel className="text-[#0F172A]">Total</FormLabel>
                    <div className="text-[#0F172A] font-medium pt-2">
                      {formatCurrency(watch(`items.${index}.total`))}
                    </div>
                  </div>
                  <div className="col-span-1 pt-8">
                    {mode !== "view" && (
                      <button
                        type="button"
                        onClick={() => remove(index)}
                        className="p-2 text-[#64748B] hover:text-[#EF4444] transition-colors rounded -lg hover:bg-[#FEE2E2]"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {mode !== "view" && (
              <button
                type="button"
                onClick={handleAddItem}
                className="inline-flex items-center gap-2 text-sm font-medium text-[#3B82F6] hover:text-[#2563EB] transition-colors"
              >
                <Plus className="h-4 w-4" />
                Add Item
              </button>
            )}
          </div>

          {/* Totals */}
          <div className="flex flex-col gap-2 items-end">
            <div className="flex items-center gap-4 text-[#64748B]">
              <span>Subtotal:</span>
              <span className="font-medium text-[#0F172A] w-32 text-right">
                {formatCurrency(watch("subtotal"))}
              </span>
            </div>
            <div className="flex items-center gap-4 text-[#64748B]">
              <span>VAT:</span>
              <span className="font-medium text-[#0F172A] w-32 text-right">
                {formatCurrency(watch("vat"))}
              </span>
            </div>
            <div className="flex items-center gap-4 text-lg font-medium text-[#0F172A]">
              <span>Total:</span>
              <span className="w-32 text-right">
                {formatCurrency(watch("total"))}
              </span>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-4 pt-4 border-t border-black/10">
            {mode === "view" ? (
              <Button
                type="button"
                onClick={() => navigate(`/invoices/${defaultValues?.id}/edit`)}
                className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl flex items-center space-x-2"
              >
                <Edit2 className="h-4 w-4" />
                <span>Edit</span>
              </Button>
            ) : (
              <>
                <button
                  type="button"
                  onClick={onCancel}
                  className="px-4 py-2 text-sm font-medium text-[#64748B] hover:text-[#0F172A] transition-colors"
                >
                  Cancel
                </button>
                <Button
                  type="submit"
                  variant="primary"
                  disabled={isSubmitting}
                  className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl"
                >
                  {isSubmitting ? (
                    <div className="flex items-center space-x-2">
                      <span className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></span>
                      <span>Saving...</span>
                    </div>
                  ) : defaultValues?.id ? (
                    "Update Invoice"
                  ) : (
                    "Create Invoice"
                  )}
                </Button>
              </>
            )}
          </div>
        </div>
      </div>
    </form>
  );
}
