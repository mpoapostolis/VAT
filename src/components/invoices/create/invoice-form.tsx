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
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Basic Information */}
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <FormItem>
            <FormLabel>
              <FileText className="h-4 w-4 inline-block mr-2" />
              <span>Invoice Number</span>
            </FormLabel>
            <Input {...register("number")} readOnly className="bg-gray-50/50" />
            <p className="text-xs text-gray-500 mt-1">Auto-generated</p>
          </FormItem>

          <FormItem>
            <FormLabel>
              <User className="h-4 w-4 inline-block mr-2" />
              <span>Customer</span>
            </FormLabel>
            <Select
              options={customers?.map((c) => ({ value: c.id, label: c.name }))}
              onChange={(value) => setValue("customerId", value)}
              value={watch("customerId")}
              placeholder="Select customer"
              error={!!errors.customerId}
              className="bg-white"
            />
            {errors.customerId && (
              <FormMessage>{errors.customerId.message}</FormMessage>
            )}
          </FormItem>

          <FormItem>
            <FormLabel>
              <Tag className="h-4 w-4 inline-block mr-2" />
              <span>Category</span>
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
              className="bg-white"
            />
            {errors.categoryId && (
              <FormMessage>{errors.categoryId.message}</FormMessage>
            )}
          </FormItem>

          <FormItem>
            <FormLabel>
              <Calendar className="h-4 w-4 inline-block mr-2" />
              <span>Issue Date</span>
            </FormLabel>
            <Input
              type="date"
              {...register("date", { required: "Issue date is required" })}
              className="bg-white"
            />
            {errors.date && <FormMessage>{errors.date.message}</FormMessage>}
          </FormItem>

          <FormItem>
            <FormLabel>
              <Calendar className="h-4 w-4 inline-block mr-2" />
              <span>Due Date</span>
            </FormLabel>
            <Input
              type="date"
              {...register("dueDate", { required: "Due date is required" })}
              className="bg-white"
            />
            {errors.dueDate && (
              <FormMessage>{errors.dueDate.message}</FormMessage>
            )}
          </FormItem>
        </div>
      </div>

      {/* Invoice Items */}
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <div>
            <h3 className="text-lg font-medium text-gray-900">Invoice Items</h3>
            <p className="text-sm text-gray-500">Add products or services</p>
          </div>
          <button
            type="button"
            onClick={handleAddItem}
            className="inline-flex items-center px-3 py-2 text-sm font-medium text-blue-700 bg-blue-50 border border-blue-200 rounded-md hover:bg-blue-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Item
          </button>
        </div>

        <div className="space-y-4">
          {fields?.map((field, index) => (
            <div
              key={field.id}
              className="grid grid-cols-1 md:grid-cols-[1fr_1fr_1fr_1fr_1fr_32px] gap-4 p-4 bg-gray-50/50 rounded border border-gray-200/60"
            >
              <FormItem className="md:col-span-2">
                <FormLabel>Description</FormLabel>
                <Input
                  {...register(`items.${index}.description` as const, {
                    required: "Description is required",
                  })}
                  placeholder="Item description"
                  className="bg-white"
                  onBlur={handleItemBlur}
                />
              </FormItem>

              <FormItem>
                <FormLabel>Quantity</FormLabel>
                <Input
                  type="number"
                  {...register(`items.${index}.quantity` as const, {
                    required: "Quantity is required",
                    min: { value: 1, message: "Minimum quantity is 1" },
                  })}
                  placeholder="Quantity"
                  className="bg-white"
                  onBlur={handleItemBlur}
                />
              </FormItem>

              <FormItem>
                <FormLabel>Price</FormLabel>
                <Input
                  type="number"
                  step="0.01"
                  {...register(`items.${index}.price` as const, {
                    required: "Price is required",
                    min: { value: 0, message: "Price cannot be negative" },
                  })}
                  placeholder="Price"
                  className="bg-white"
                  onBlur={handleItemBlur}
                />
              </FormItem>

              <FormItem>
                <FormLabel>VAT Rate</FormLabel>
                <Select
                  options={[
                    { value: "0", label: "0%" },
                    { value: "24", label: "24%" },
                    { value: "13", label: "13%" },
                  ]}
                  value={watch(`items.${index}.vat`)}
                  onChange={(value) => {
                    setValue(`items.${index}.vat`, value);
                    handleItemBlur();
                  }}
                  error={!!errors.items?.[index]?.vat}
                  className="bg-white"
                />
              </FormItem>

              {fields.length > 1 && (
                <button
                  type="button"
                  onClick={() => remove(index)}
                  className="p-1 pt-10 pl-2 h-full w-full grid place-self-center items-center  text-xs font-medium text-red-700 "
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Totals */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div></div>
        <div className="space-y-4 bg-gray-50/50 p-4 rounded border border-gray-200/60">
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">Subtotal:</span>
            <span className="text-sm font-medium">
              {formatCurrency(watch("subtotal"))}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">VAT:</span>
            <span className="text-sm font-medium">
              {formatCurrency(watch("vat"))}
            </span>
          </div>
          <div className="flex justify-between items-center pt-4 border-t border-gray-200">
            <span className="text-base font-medium text-gray-900">Total:</span>
            <span className="text-base font-medium text-gray-900">
              {formatCurrency(watch("total"))}
            </span>
          </div>
        </div>
      </div>

      {/* Form Actions */}
      <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          {isSubmitting ? "Creating..." : "Create Invoice"}
        </button>
      </div>
    </form>
  );
}
