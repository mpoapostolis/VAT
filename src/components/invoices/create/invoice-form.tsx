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
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import {
  generateInvoiceNumber,
  formatCurrency,
  formatDateForInput,
} from "@/lib/utils";
import type { Invoice, InvoiceItem, Category } from "@/lib/pocketbase";
import useSWR from "swr";

type InvoiceFormData = Omit<Invoice, "id">;

interface InvoiceFormProps {
  customers: any[];
  onSubmit: (data: InvoiceFormData) => Promise<void>;
  isSubmitting: boolean;
  onCancel: () => void;
  defaultValues?: Partial<InvoiceFormData>;
}

export function InvoiceForm({
  customers,
  onSubmit,
  isSubmitting,
  onCancel,
  defaultValues,
}: InvoiceFormProps) {
  const { data: categoriesData } = useSWR<{ items: Category[] }>("categories");
  const incomeCategories =
    categoriesData?.items.filter((cat) => cat.type === "income") || [];

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
      items: [{ description: "", quantity: 1, price: 0, vat: 24, total: 0 }],
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

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
      {/* Basic Information */}
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <FormItem>
            <FormLabel className="flex items-center gap-2 text-[#0F172A]">
              <FileText className="h-4 w-4 text-[#3B82F6]" />
              Invoice Number
            </FormLabel>
            <Input
              {...register("number")}
              readOnly
              className="bg-[#F8FAFC] border border-black/10 focus:border-[#3B82F6] focus:ring-1 focus:ring-[#3B82F6]"
            />
            <p className="text-xs text-[#64748B] mt-1">Auto-generated</p>
          </FormItem>

          <FormItem>
            <FormLabel className="flex items-center gap-2 text-[#0F172A]">
              <User className="h-4 w-4 text-[#3B82F6]" />
              Customer
            </FormLabel>
            <Select
              options={customers?.map((c) => ({ value: c.id, label: c.name }))}
              onChange={(value) => setValue("customerId", value)}
              value={watch("customerId")}
              placeholder="Select customer"
              error={!!errors.customerId}
              className="bg-white border border-black/10 focus:border-[#3B82F6] focus:ring-1 focus:ring-[#3B82F6]"
            />
            {errors.customerId && (
              <FormMessage>{errors.customerId.message}</FormMessage>
            )}
          </FormItem>

          <FormItem>
            <FormLabel className="flex items-center gap-2 text-[#0F172A]">
              <Tag className="h-4 w-4 text-[#3B82F6]" />
              Category
            </FormLabel>
            <Select
              options={incomeCategories?.map((cat) => ({
                value: cat.id,
                label: cat.name,
              }))}
              onChange={(value) => setValue("categoryId", value)}
              value={watch("categoryId")}
              placeholder="Select category"
              error={!!errors.categoryId}
              className="bg-white border border-black/10 focus:border-[#3B82F6] focus:ring-1 focus:ring-[#3B82F6]"
            />
            {errors.categoryId && (
              <FormMessage>{errors.categoryId.message}</FormMessage>
            )}
          </FormItem>

          <FormItem>
            <FormLabel className="flex items-center gap-2 text-[#0F172A]">
              <Calendar className="h-4 w-4 text-[#3B82F6]" />
              Issue Date
            </FormLabel>
            <Input
              type="date"
              {...register("date", { required: "Issue date is required" })}
              className="bg-white border border-black/10 focus:border-[#3B82F6] focus:ring-1 focus:ring-[#3B82F6]"
            />
            {errors.date && <FormMessage>{errors.date.message}</FormMessage>}
          </FormItem>

          <FormItem>
            <FormLabel className="flex items-center gap-2 text-[#0F172A]">
              <Calendar className="h-4 w-4 text-[#3B82F6]" />
              Due Date
            </FormLabel>
            <Input
              type="date"
              {...register("dueDate", { required: "Due date is required" })}
              className="bg-white border border-black/10 focus:border-[#3B82F6] focus:ring-1 focus:ring-[#3B82F6]"
            />
            {errors.dueDate && (
              <FormMessage>{errors.dueDate.message}</FormMessage>
            )}
          </FormItem>
        </div>
      </div>

      {/* Invoice Items */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium text-[#0F172A]">Invoice Items</h3>
        <div className="space-y-4">
          {fields.map((field, index) => (
            <div
              key={field.id}
              className="grid grid-cols-12 gap-4 items-start p-4 bg-[#F8FAFC] rounded-lg border border-black/10"
            >
              <div className="col-span-4">
                <FormLabel className="text-[#0F172A]">Description</FormLabel>
                <Input
                  {...register(`items.${index}.description`)}
                  onBlur={handleItemBlur}
                  placeholder="Item description"
                  className="bg-white border border-black/10 focus:border-[#3B82F6] focus:ring-1 focus:ring-[#3B82F6]"
                />
              </div>
              <div className="col-span-2">
                <FormLabel className="text-[#0F172A]">Quantity</FormLabel>
                <Input
                  type="number"
                  {...register(`items.${index}.quantity`)}
                  onBlur={handleItemBlur}
                  min="1"
                  className="bg-white border border-black/10 focus:border-[#3B82F6] focus:ring-1 focus:ring-[#3B82F6]"
                />
              </div>
              <div className="col-span-2">
                <FormLabel className="text-[#0F172A]">Price</FormLabel>
                <Input
                  type="number"
                  {...register(`items.${index}.price`)}
                  onBlur={handleItemBlur}
                  min="0"
                  step="0.01"
                  className="bg-white border border-black/10 focus:border-[#3B82F6] focus:ring-1 focus:ring-[#3B82F6]"
                />
              </div>
              <div className="col-span-2">
                <FormLabel className="text-[#0F172A]">VAT %</FormLabel>
                <Input
                  type="number"
                  {...register(`items.${index}.vat`)}
                  onBlur={handleItemBlur}
                  min="0"
                  max="100"
                  className="bg-white border border-black/10 focus:border-[#3B82F6] focus:ring-1 focus:ring-[#3B82F6]"
                />
              </div>
              <div className="col-span-1">
                <FormLabel className="text-[#0F172A]">Total</FormLabel>
                <div className="text-[#0F172A] font-medium pt-2">
                  {formatCurrency(watch(`items.${index}.total`))}
                </div>
              </div>
              <div className="col-span-1 pt-8">
                <button
                  type="button"
                  onClick={() => remove(index)}
                  className="p-2 text-[#64748B] hover:text-[#EF4444] transition-colors rounded-lg hover:bg-[#FEE2E2]"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}
        </div>

        <button
          type="button"
          onClick={handleAddItem}
          className="inline-flex items-center gap-2 text-sm font-medium text-[#3B82F6] hover:text-[#2563EB] transition-colors"
        >
          <Plus className="h-4 w-4" />
          Add Item
        </button>
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
          <span className="w-32 text-right">{formatCurrency(watch("total"))}</span>
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center justify-end gap-4 pt-4 border-t border-black/10">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 text-sm font-medium text-[#64748B] hover:text-[#0F172A] transition-colors"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className="px-4 py-2 text-sm font-medium text-white bg-[#3B82F6] hover:bg-[#2563EB] transition-colors rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? "Saving..." : "Save Invoice"}
        </button>
      </div>
    </form>
  );
}
