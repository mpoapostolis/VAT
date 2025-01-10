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
  Phone,
  Mail,
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
import { useCompanies } from "@/lib/hooks/useCompanies";
import { useCustomers } from "@/lib/hooks/useCustomers";
import { useNavigate, useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { pb } from "@/lib/pocketbase";
import { useCategories } from "@/lib/hooks/useCategories";

const invoiceFormSchema = z.object({
  type: z.enum(["receivable", "payable"], {
    required_error: "Invoice type is required",
    invalid_type_error: "Invoice type must be either 'receivable' or 'payable'",
  }),
  number: z.string(),
  date: z.string().min(1, "Issue date is required"),
  dueDate: z.string().min(1, "Due date is required"),
  companyId: z.string().min(1, "Company is required"),
  customerId: z.string().min(1, "Customer is required"),
  currency: z.string().min(1, "Currency is required"),
  exchangeRate: z.number().optional(),
  paymentTerms: z.string().min(1, "Payment terms are required"),
  categoryId: z.string().min(1, "Category is required"),
  items: z
    .array(
      z.object({
        itemNo: z.number(),
        description: z.string().min(1, "Description is required"),
        quantity: z
          .number({
            required_error: "Quantity is required",
            invalid_type_error: "Quantity must be a number",
          })
          .min(1, "Quantity must be at least 1"),
        unitPrice: z
          .number({
            required_error: "Unit price is required",
            invalid_type_error: "Unit price must be a number",
          })
          .min(0, "Unit price must be non-negative"),
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
    )
    .min(1, "At least one item is required"),
  invoiceType: z.enum(["simplified_tax_invoice", "tax_invoice"]),
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

const defaultItem = {
  itemNo: 1,
  description: "",
  quantity: 1,
  unitPrice: 0,
  discount: {
    type: "percentage" as const,
    value: 0,
  },
  netAmount: 0,
  taxCode: "standard" as const,
  vatAmount: 0,
  subtotal: 0,
  total: 0,
  reverseCharge: false,
  notes: "",
};

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

export function InvoiceForm() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { companies, isLoading: isLoadingCompanies } = useCompanies({
    perPage: 500,
  });
  const { customers, isLoading: isLoadingCustomers } = useCustomers({
    perPage: 500,
  });
  const { categories } = useCategories({
    perPage: 500,
  });
  const [isSubmittingForm, setIsSubmittingForm] = useState(false);
  const mode = id ? "edit" : "create";
  const {
    register,
    control,
    handleSubmit,
    setValue,
    getValues,
    watch,
    formState: { errors },
    reset,
  } = useForm<InvoiceFormData>({
    resolver: zodResolver(invoiceFormSchema),
    defaultValues: {
      type: "receivable",
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
      const calculatedData = {
        ...data,
        total: data.items.reduce(
          (acc, item) => acc + calculateItemTotal(item),
          0
        ),
        subtotal: data.items.reduce(
          (acc, item) => acc + Number(item.quantity) * Number(item.unitPrice),
          0
        ),
        vat: data.items.reduce((acc, item) => {
          const taxCode = item.taxCode;
          if (taxCode === "standard") {
            return (
              acc + ((Number(item.quantity) * Number(item.unitPrice)) / 100) * 5
            );
          }
          return acc;
        }, 0),
      };

      if (mode === "edit" && id) {
        await pb.collection("invoices").update(id, calculatedData);
      } else {
        await pb.collection("invoices").create({
          ...calculatedData,
          userId: pb.authStore.model?.id,
          status: "draft",
        });
      }
      navigate("/receivables");
    } catch (error) {
      alert(error);
    } finally {
      setIsSubmittingForm(false);
    }
  };

  const { fields, append, remove } = useFieldArray({
    control,
    name: "items",
  });

  const selectedCompany = companies?.find((c) => c.id === watch("companyId"));
  const selectedCustomer = customers?.find((c) => c.id === watch("customerId"));

  if (isLoadingCompanies || isLoadingCustomers) {
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
                  {mode === "edit" ? "Edit Invoice" : "Create New Invoice"}
                </h2>
                <p className="text-xs text-gray-500 mt-1">
                  Fill in the information below to{" "}
                  {mode === "edit" ? "update" : "create"} your invoice
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <Badge
                variant="secondary"
                className={cn(
                  "text-xs px-3 py-1",
                  watch("type") === "receivable"
                    ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                    : "bg-blue-50 text-blue-700 border-blue-200"
                )}
              >
                {watch("type") === "receivable" ? "Receivable" : "Payable"}{" "}
                Invoice
              </Badge>
              <Badge
                variant="secondary"
                className="text-xs font-mono px-3 py-1"
              >
                #{watch("number")}
              </Badge>
            </div>
          </div>

          {/* Invoice Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
            <FormItem>
              <FormLabel className="text-gray-700 font-medium">
                Invoice Number
                <span className="text-red-500 ml-1">*</span>
              </FormLabel>
              <Input
                {...register("number")}
                className={cn(errors.date ? "border-red-500" : "")}
              />
              {errors.date && <FormMessage>{errors.date.message}</FormMessage>}
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
                placeholder="Select payment terms"
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
                Invoice Type
                <span className="text-red-500 ml-1">*</span>
              </FormLabel>
              <Select
                options={[
                  { value: "tax_invoice", label: "Tax Invoice" },
                  {
                    value: "simplified_tax_invoice",
                    label: "Simplified Tax Invoice",
                  },
                ]}
                value={watch("invoiceType")}
                onChange={(value) => setValue("invoiceType", value)}
                error={!!errors.invoiceType}
                className="w-full"
              />
              {errors.invoiceType && (
                <FormMessage>{errors.invoiceType.message}</FormMessage>
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
                    value: category.id ?? "",
                    label: category.name,
                  })) ?? []
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

        {/* Company & Customer Section */}
        <div className="border-t border-gray-200">
          <div className="p-4 md:p-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Company Information */}
              <div className="space-y-6">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-blue-50 ">
                    <Building className="h-5 w-5 text-blue-500" />
                  </div>
                  <h3 className="text-xs font-medium text-gray-900">
                    Company Information
                  </h3>
                </div>

                <FormItem>
                  <FormLabel className="text-gray-700 font-medium">
                    Company
                    <span className="text-red-500 ml-1">*</span>
                  </FormLabel>
                  <Select
                    options={companies?.map((company) => ({
                      value: company.id ?? "",
                      label:
                        company.companyNameEN ||
                        company.companyNameAR ||
                        "Unnamed Company",
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
                  <div className=" border border-gray-200 bg-white p-6 space-y-5 hover:border-blue-200 transition-all duration-200 shadow-sm">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-xs font-medium text-gray-500">
                          Company Profile
                        </p>
                        <p className="text-xs font-semibold text-gray-900 mt-1">
                          {selectedCompany.companyNameEN ||
                            selectedCompany.companyNameAR ||
                            "Unnamed Company"}
                        </p>
                      </div>
                      <div className="bg-blue-50  -full">
                        {pb.getFileUrl(
                          selectedCompany,
                          `${selectedCompany?.logo}`
                        ) ? (
                          <img
                            src={pb.getFileUrl(
                              selectedCompany,
                              `${selectedCompany?.logo}`
                            )}
                            alt="Company Logo"
                            className="w-8 h-8 -full"
                          />
                        ) : (
                          <Building className="w-5 h-5 text-blue-500" />
                        )}
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <p className="text-[11px] font-medium uppercase tracking-wider text-gray-500">
                          TRN
                        </p>
                        <div className="flex items-center space-x-2">
                          <p className="text-xs font-semibold font-mono text-gray-900 bg-gray-50 px-3 py-1.5  border border-gray-200">
                            {selectedCompany.tradeLicenseNumber}
                          </p>
                        </div>
                      </div>

                      <div className="space-y-1">
                        <p className="text-[11px] font-medium uppercase tracking-wider text-gray-500">
                          Industry
                        </p>
                        <p className="text-xs text-gray-900">
                          {selectedCompany.serviceType || "Not specified"}
                        </p>
                      </div>
                    </div>

                    <div className="space-y-1">
                      <p className="text-[11px] font-medium uppercase tracking-wider text-gray-500">
                        Business Address
                      </p>
                      <div className="bg-gray-50 p-3  border border-gray-200">
                        <p className="text-xs text-gray-900">
                          {selectedCompany.billingAddress?.street}
                          {selectedCompany.billingAddress?.city &&
                            `, ${selectedCompany.billingAddress.city}`}
                          {selectedCompany.billingAddress?.state &&
                            `, ${selectedCompany.billingAddress.state}`}
                          {selectedCompany.billingAddress?.country &&
                            `, ${selectedCompany.billingAddress.country}`}
                        </p>
                      </div>
                    </div>

                    <div>
                      <p className="text-[11px] font-medium uppercase tracking-wider text-gray-500 mb-2">
                        Contact Information
                      </p>
                      <div className="bg-gray-50  border border-gray-200 divide-y divide-gray-200">
                        <div className="p-3">
                          <div className="flex items-center justify-between">
                            <p className="text-xs font-medium text-gray-900">
                              {selectedCompany?.contactPersonFirstName}{" "}
                              {selectedCompany?.contactPersonLastName}
                            </p>
                            <Badge variant="secondary" className="text-[10px]">
                              Primary Contact
                            </Badge>
                          </div>
                        </div>
                        <div className="p-3 space-y-1">
                          <p className="text-xs text-gray-600">
                            {selectedCompany.phoneNumber}
                          </p>
                          <p className="text-xs text-gray-600">
                            {selectedCompany.email}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Customer Information */}
              <div className="space-y-6">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-blue-50 ">
                    <Users className="h-5 w-5 text-blue-500" />
                  </div>
                  <h3 className="text-xs font-medium text-gray-900">
                    Customer Information
                  </h3>
                </div>

                <FormItem>
                  <FormLabel className="text-gray-700 font-medium">
                    Customer
                    <span className="text-red-500 ml-1">*</span>
                  </FormLabel>
                  <Select
                    options={(customers || []).map((customer) => ({
                      value: customer.id,
                      label:
                        customer.companyName ||
                        (customer.contactFirstName && customer.contactLastName
                          ? `${customer.contactFirstName} ${customer.contactLastName}`
                          : "Unnamed Customer"),
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
                  <div className=" border border-gray-200 bg-white p-6 space-y-5 hover:border-blue-200 transition-all duration-200 shadow-sm">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-xs font-medium text-gray-500">
                          Customer Profile
                        </p>
                        <p className="text-xs font-semibold text-gray-900 mt-1">
                          {selectedCustomer.contactFirstName ||
                            (selectedCustomer.contactFirstName &&
                            selectedCustomer.contactLastName
                              ? `${selectedCustomer.contactFirstName} ${selectedCustomer.lastName}`
                              : "Unnamed Customer")}
                        </p>
                      </div>
                      <div className="bg-blue-50 p-2 -full">
                        <Users className="w-5 h-5 text-blue-500" />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <p className="text-[11px] font-medium uppercase tracking-wider text-gray-500">
                          TRN
                        </p>
                        <div className="flex items-center space-x-2">
                          <p className="text-xs font-semibold font-mono text-gray-900 bg-gray-50 px-3 py-1.5  border border-gray-200">
                            {selectedCustomer?.taxRegistrationNumber ||
                              "Not registered"}
                          </p>
                        </div>
                      </div>

                      <div className="space-y-1">
                        <p className="text-[11px] font-medium uppercase tracking-wider text-gray-500">
                          Customer Type
                        </p>
                        <p className="text-xs text-gray-900">
                          {selectedCustomer.relationship || "Individual"}
                        </p>
                      </div>
                    </div>

                    <div className="space-y-1">
                      <p className="text-[11px] font-medium uppercase tracking-wider text-gray-500">
                        Billing Address
                      </p>
                      <div className="bg-gray-50 p-3  border border-gray-200">
                        <p className="text-xs text-gray-900">
                          {selectedCustomer.billingAddress ||
                            "Address not provided"}
                        </p>
                      </div>
                    </div>

                    <div>
                      <p className="text-[11px] font-medium uppercase tracking-wider text-gray-500 mb-2">
                        Contact Details
                      </p>
                      <div className="bg-gray-50  border border-gray-200 divide-y divide-gray-200">
                        <div className="p-3 space-y-2">
                          {selectedCustomer.phoneNumber && (
                            <div className="flex items-center space-x-2">
                              <Phone className="w-3.5 h-3.5 text-gray-400" />
                              <p className="text-xs text-gray-600">
                                {selectedCustomer.phoneNumber}
                              </p>
                            </div>
                          )}

                          {selectedCustomer.email && (
                            <div className="flex items-center space-x-2">
                              <Mail className="w-3.5 h-3.5 text-gray-400" />
                              <p className="text-xs text-gray-600">
                                {selectedCustomer.email}
                              </p>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Invoice Items */}
        <div className="border-t border-gray-200">
          <div className="p-4 md:p-8 space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-blue-50 ">
                  <ListPlus className="h-5 w-5 text-blue-500" />
                </div>
                <h3 className="text-xs font-medium text-gray-900">
                  Invoice Items
                </h3>
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

            {fields.length === 0 ? (
              <div className="text-center py-16 border-2 border-dashed border-gray-200  bg-gray-50">
                <div className="space-y-4">
                  <div className="bg-white p-4 -full w-fit mx-auto shadow-sm">
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
              <div className="border border-gray-200  overflow-hidden shadow-sm">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-gray-50">
                      <TableHead className="w-[80px] font-medium text-gray-700">
                        Item No
                      </TableHead>
                      <TableHead className="min-w-[300px] font-medium text-gray-700">
                        Description
                      </TableHead>
                      <TableHead className="font-medium text-gray-700">
                        Quantity
                      </TableHead>
                      <TableHead className="font-medium text-gray-700">
                        Unit Price
                      </TableHead>
                      <TableHead className="font-medium text-gray-700">
                        Discount
                      </TableHead>
                      <TableHead className="font-medium text-gray-700">
                        Tax Code
                      </TableHead>
                      <TableHead className="font-medium text-gray-700">
                        Total
                      </TableHead>
                      <TableHead className="w-[100px]"></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {fields.map((field, index) => (
                      <TableRow key={field.id} className="hover:bg-gray-50">
                        <TableCell className="font-mono text-xs text-gray-600">
                          {String(index + 1).padStart(3, "0")}
                        </TableCell>
                        <TableCell>
                          <div className="space-y-2">
                            <div className="space-y-1">
                              <Input
                                {...register(`items.${index}.description`)}
                                placeholder="Item description"
                                className={cn(
                                  "text-xs",
                                  errors.items?.[index]?.description
                                    ? "border-red-500 focus:ring-red-500"
                                    : ""
                                )}
                              />
                              {errors.items?.[index]?.description && (
                                <p className="text-xs text-red-500">
                                  {errors.items[index]?.description?.message}
                                </p>
                              )}
                            </div>
                            <Input
                              {...register(`items.${index}.notes`)}
                              placeholder="Additional notes (optional)"
                              className="text-xs text-gray-500"
                            />
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="space-y-1">
                            <Input
                              type="number"
                              min="1"
                              step="1"
                              defaultValue="1"
                              {...register(`items.${index}.quantity`, {
                                setValueAs: (value) =>
                                  value === "" ? undefined : Number(value),
                                valueAsNumber: true,
                              })}
                              className={cn(
                                "w-24 text-xs",
                                errors.items?.[index]?.quantity
                                  ? "border-red-500 focus:ring-red-500"
                                  : ""
                              )}
                            />
                            {errors.items?.[index]?.quantity && (
                              <p className="text-xs text-red-500">
                                {errors.items[index]?.quantity?.message}
                              </p>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="space-y-1">
                            <Input
                              type="number"
                              step="0.01"
                              min="0"
                              defaultValue="0"
                              {...register(`items.${index}.unitPrice`, {
                                setValueAs: (value) =>
                                  value === "" ? undefined : Number(value),
                                valueAsNumber: true,
                              })}
                              className={cn(
                                "w-32 text-xs",
                                errors.items?.[index]?.unitPrice
                                  ? "border-red-500 focus:ring-red-500"
                                  : ""
                              )}
                            />
                            {errors.items?.[index]?.unitPrice && (
                              <p className="text-xs text-red-500">
                                {errors.items[index]?.unitPrice?.message}
                              </p>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-2">
                            <div className="space-y-1">
                              <Input
                                type="number"
                                min="0"
                                step="0.01"
                                defaultValue="0"
                                {...register(`items.${index}.discount.value`, {
                                  setValueAs: (value) =>
                                    value === "" ? undefined : Number(value),
                                  valueAsNumber: true,
                                })}
                                className={cn(
                                  "w-24 text-xs",
                                  errors.items?.[index]?.discount?.value
                                    ? "border-red-500 focus:ring-red-500"
                                    : ""
                                )}
                              />
                              {errors.items?.[index]?.discount?.value && (
                                <p className="text-xs text-red-500">
                                  {
                                    errors.items[index]?.discount?.value
                                      ?.message
                                  }
                                </p>
                              )}
                            </div>
                            <Select
                              options={[
                                { value: "percentage", label: "%" },
                                { value: "fixed", label: "Fixed" },
                              ]}
                              value={watch(`items.${index}.discount.type`)}
                              onChange={(value) =>
                                setValue(
                                  `items.${index}.discount.type`,
                                  value as "percentage" | "fixed"
                                )
                              }
                              className="w-24"
                            />
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="space-y-1">
                            <Select
                              options={[
                                { value: "standard", label: "Standard (5%)" },
                                { value: "zero", label: "Zero (0%)" },
                                { value: "exempt", label: "Exempt" },
                              ]}
                              value={watch(`items.${index}.taxCode`)}
                              onChange={(value) =>
                                setValue(
                                  `items.${index}.taxCode`,
                                  value as "standard" | "zero" | "exempt"
                                )
                              }
                              className="w-40"
                            />
                            {errors.items?.[index]?.taxCode && (
                              <p className="text-xs text-red-500">
                                {errors.items[index]?.taxCode?.message}
                              </p>
                            )}
                          </div>
                        </TableCell>
                        <TableCell className="font-medium text-gray-900">
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
                            className="text-gray-400 hover:text-red-600"
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
                <div className="w-96 space-y-4 bg-gray-50 p-6  border border-gray-200">
                  <div className="flex justify-between text-xs">
                    <span className="text-gray-600">Subtotal:</span>
                    <span className="font-medium text-gray-900">
                      {formatCurrency(calculateSubtotal(watch("items")))}
                    </span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-gray-600">VAT:</span>
                    <span className="font-medium text-gray-900">
                      {formatCurrency(calculateVAT(watch("items")))}
                    </span>
                  </div>
                  <Separator />
                  <div className="flex justify-between">
                    <span className="font-medium text-gray-900">Total:</span>
                    <span className="font-bold text-xs text-blue-600">
                      {formatCurrency(calculateTotal(watch("items")))}
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Additional Information */}
        <div className="border-t border-gray-200">
          <div className="p-4 md:p-8 space-y-6">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-blue-50 ">
                <Info className="h-5 w-5 text-blue-500" />
              </div>
              <h3 className="text-xs font-medium text-gray-900">
                Additional Information
              </h3>
            </div>

            <div className="space-y-6">
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
                <FormLabel className="text-gray-700 font-medium">
                  Terms & Conditions
                </FormLabel>
                <Textarea
                  {...register("termsAndConditions")}
                  rows={4}
                  placeholder="Enter terms and conditions..."
                  className="resize-none text-xs"
                />
              </FormItem>

              <FormItem>
                <FormLabel className="text-gray-700 font-medium">
                  Payment Information
                </FormLabel>
                <Textarea
                  {...register("paymentInformation")}
                  rows={4}
                  placeholder="Enter payment information..."
                  className="resize-none text-xs"
                />
              </FormItem>

              <FormItem>
                <FormLabel className="text-gray-700 font-medium">
                  Notes
                </FormLabel>
                <Textarea
                  {...register("notes")}
                  rows={4}
                  placeholder="Enter any additional notes..."
                  className="resize-none text-xs"
                />
              </FormItem>
            </div>
          </div>
        </div>

        {/* Form Actions */}
        <div className="border-t border-gray-200 bg-gray-50 px-8 py-5">
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
                  Creating...
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
