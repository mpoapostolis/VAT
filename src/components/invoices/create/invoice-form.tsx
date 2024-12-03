import React from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
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
      items: [{ description: "", quantity: 1, price: 0, vat: 5, total: 0 }],
      subtotal: 0,
      vat: 0,
      total: 0,
      ...defaultValues,
      // Ensure dates are properly formatted even if they come from defaultValues
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
      const vatRate = Number(item.vat) || 5;

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
      vat: 5,
      total: 0,
    });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="bg-white rounded-xl shadow-sm border border-gray-200/60">
        <div className="p-5 grid grid-cols-2 md:grid-cols-3 gap-5 border-b border-gray-200/60">
          <FormItem>
            <FormLabel className="text-sm font-medium text-gray-700">
              Invoice Number
            </FormLabel>
            <Input
              {...register("number")}
              readOnly
              className="bg-gray-50/50 text-sm"
            />
            <p className="text-xs text-gray-500 mt-1">Auto-generated</p>
          </FormItem>

          <FormItem>
            <FormLabel className="text-sm font-medium text-gray-700">
              Customer
            </FormLabel>
            <Select
              options={customers.map((c) => ({ value: c.id, label: c.name }))}
              onChange={(value) => setValue("customerId", value)}
              value={defaultValues?.customerId}
              placeholder="Select customer"
              error={!!errors.customerId}
            />
          </FormItem>

          <FormItem>
            <FormLabel className="text-sm font-medium text-gray-700">
              Category
            </FormLabel>
            <Select
              options={incomeCategories.map((cat) => ({
                value: cat.id,
                label: cat.name,
              }))}
              onChange={(value) => setValue("categoryId", value)}
              value={defaultValues?.categoryId}
              placeholder="Select category"
              error={!!errors.categoryId}
            />
          </FormItem>

          <FormItem>
            <FormLabel className="text-sm font-medium text-gray-700">
              Issue Date
            </FormLabel>
            <Input
              type="date"
              {...register("date", { required: "Issue date is required" })}
              className="text-sm"
            />
          </FormItem>

          <FormItem>
            <FormLabel className="text-sm font-medium text-gray-700">
              Due Date
            </FormLabel>
            <Input
              type="date"
              {...register("dueDate", { required: "Due date is required" })}
              className="text-sm"
            />
          </FormItem>
        </div>

        <div className="p-5 border-b border-gray-200/60">
          <div className="flex justify-between items-center mb-4">
            <div>
              <h2 className="text-lg font-semibold text-gray-900">
                Invoice Items
              </h2>
              <p className="text-sm text-gray-500">Add products or services</p>
            </div>
            <Button
              type="button"
              onClick={handleAddItem}
              className="bg-blue-50 text-blue-600 hover:bg-blue-100 border-blue-200"
              variant="outline"
              size="sm"
            >
              <Plus className="h-4 w-4 mr-1.5" />
              Add Item
            </Button>
          </div>

          <div className="rounded-lg border border-gray-200 overflow-hidden">
            <div className="grid grid-cols-[3fr,1fr,1.5fr,1fr,1fr,1fr,0.5fr] gap-4 px-4 py-2.5 bg-gray-50/80 border-b border-gray-200 text-xs font-medium text-gray-500 uppercase tracking-wider">
              <div>Description</div>
              <div>Qty</div>
              <div>Price</div>
              <div>VAT %</div>
              <div className="text-right">VAT</div>
              <div className="text-right">Total</div>
              <div></div>
            </div>

            {fields.map((field, index) => {
              const total =
                watch(`items.${index}.price`) *
                watch(`items.${index}.quantity`);
              const vat = total * (watch(`items.${index}.vat`) / 100);
              return (
                <div
                  key={field.id}
                  className="grid grid-cols-[3fr,1fr,1.5fr,1fr,1fr,1fr,0.5fr] gap-4 px-4 py-2.5 border-b border-gray-200 last:border-0 hover:bg-gray-50/50"
                >
                  <div>
                    <Input
                      {...register(`items.${index}.description` as const, {
                        required: "Description is required",
                      })}
                      placeholder="Enter item description"
                      className="text-sm"
                    />
                  </div>
                  <div>
                    <Input
                      type="number"
                      {...register(`items.${index}.quantity` as const, {
                        valueAsNumber: true,
                        min: 1,
                      })}
                      placeholder="Qty"
                      onBlur={handleItemBlur}
                      className="text-sm"
                    />
                  </div>
                  <div>
                    <Input
                      type="number"
                      step="0.01"
                      {...register(`items.${index}.price` as const, {
                        valueAsNumber: true,
                        min: 0,
                      })}
                      placeholder="0.00"
                      onBlur={handleItemBlur}
                      className="text-sm"
                    />
                  </div>
                  <div>
                    <Input
                      type="number"
                      {...register(`items.${index}.vat` as const, {
                        valueAsNumber: true,
                        min: 0,
                        max: 100,
                      })}
                      placeholder="5%"
                      onBlur={handleItemBlur}
                      className="text-sm"
                    />
                  </div>
                  <div className="flex items-center text-xs justify-end font-medium">
                    {formatCurrency(total + vat || 0)}
                  </div>
                  <div className="flex items-center text-xs justify-end font-medium">
                    {formatCurrency(vat || 0)}
                  </div>

                  <div className="flex items-center justify-end">
                    <Button
                      type="button"
                      variant="ghost"
                      onClick={() => {
                        remove(index);
                        updateTotals();
                      }}
                      className="text-red-500 hover:text-red-700"
                      disabled={fields.length === 1}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="flex justify-end mt-4">
            <div className="w-72 space-y-3 bg-gray-50/80 p-4 rounded-lg">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Subtotal:</span>
                <span className="font-medium">
                  {formatCurrency(watch("subtotal") || 0)}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">VAT:</span>
                <span className="font-medium">
                  {formatCurrency(watch("vat") || 0)}
                </span>
              </div>
              <div className="flex justify-between pt-3 border-t border-gray-200">
                <span className="font-medium text-gray-900">Total:</span>
                <span className="font-medium text-[#0066FF]">
                  {formatCurrency(watch("total") || 0)}
                </span>
              </div>
            </div>
          </div>
        </div>

        <FormItem className="p-5">
          <FormLabel className="text-sm font-medium text-gray-700">
            Notes
          </FormLabel>
          <textarea
            {...register("notes")}
            className="w-full h-24 px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0066FF] focus:border-transparent resize-none text-sm"
            placeholder="Add any additional notes or payment instructions..."
          />
        </FormItem>

        <div className="flex justify-end space-x-4 p-5 border-t border-gray-200/60">
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            className="border-gray-200 hover:bg-gray-50"
          >
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={isSubmitting}
            className="bg-[#0066FF] hover:bg-blue-700"
          >
            {isSubmitting
              ? defaultValues
                ? "Saving..."
                : "Creating..."
              : defaultValues
              ? "Save Changes"
              : "Create Invoice"}
          </Button>
        </div>
      </div>
    </form>
  );
}
