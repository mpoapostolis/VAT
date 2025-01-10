// UI Components
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

// Icons
import {
  Download,
  Edit2,
  Calendar,
  CreditCard,
  FileText,
  Building2,
  Phone,
  Mail,
  MapPin,
  Loader2,
  DollarSign,
  ArrowRight,
  Send,
} from "lucide-react";

// Hooks and Utilities
import { useParams, useNavigate } from "react-router-dom";
import { generateInvoicePDF } from "@/lib/utils/generateInvoicePDF";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { useState, memo } from "react";
import { useInvoice } from "@/lib/hooks/useInvoice";
import { useCustomer } from "@/lib/hooks/useCustomer";
import { pb } from "@/lib/pocketbase";
import { Invoice, Customer } from "@/types";

// Types
interface InvoiceViewProps {
  mode?: "view" | "edit";
}

interface InvoiceHeaderProps {
  invoice: Invoice;
  isDownloading: boolean;
  onDownload: () => Promise<void>;
  onMarkAsPaid: () => Promise<void>;
  onMarkAsIssued: () => Promise<void>;
}

interface InvoiceDetailsCardProps {
  invoice: Invoice;
}

interface CustomerCardProps {
  customer: Customer;
}

interface InvoiceSummaryCardProps {
  invoice: Invoice;
}

// Memoized Components
const InvoiceHeader = memo(
  ({
    invoice,
    isDownloading,
    onDownload,
    onMarkAsPaid,
    onMarkAsIssued,
  }: InvoiceHeaderProps) => {
    const navigate = useNavigate();

    return (
      <header
        className={cn(
          // Layout
          "flex flex-col gap-4 md:flex-row md:items-center md:justify-between",
          // Spacing
          "pb-6",
          // Border
          "border-b border-gray-200"
        )}
      >
        <div className="space-y-1.5">
          <div className="flex items-center gap-3">
            <h1 className="text-xs font-semibold tracking-tight text-gray-900">
              Invoice Details
            </h1>
            <Badge
              variant="secondary"
              className="font-mono text-xs px-2.5 py-0.5"
            >
              #{invoice.number}
            </Badge>
          </div>
          <div className="flex items-center gap-2">
            <Badge
              variant="outline"
              className={cn(
                "px-2.5 py-0.5 text-xs font-medium",
                invoice.type === "receivable"
                  ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                  : "bg-blue-50 text-blue-700 border-blue-200"
              )}
            >
              {invoice.type === "receivable" ? "Receivable" : "Payable"}
            </Badge>
            <Badge
              variant="outline"
              className={cn("px-2.5 py-0.5 text-xs font-medium", {
                "bg-emerald-50 text-emerald-700 border-emerald-200":
                  invoice.status === "paid",
                "bg-rose-50 text-rose-700 border-rose-200":
                  invoice.status === "overdue",
                "bg-amber-50 text-amber-700 border-amber-200":
                  invoice.status === "draft" || invoice.status === "issued",
              })}
            >
              {invoice.status}
            </Badge>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {invoice.status === "issued" && (
            <Button
              variant="outline"
              onClick={onMarkAsPaid}
              className={cn(
                // Base
                "h-9 px-4 py-2",
                // Colors
                "bg-white flex items-center text-emerald-700 border-emerald-200",
                // Hover
                "hover:bg-emerald-50 hover:text-emerald-800",
                // Focus
                "focus-visible:ring-emerald-500/30"
              )}
            >
              <DollarSign className="h-4 w-4 mr-2 stroke-[2.5px]" />
              Mark as Paid
            </Button>
          )}
          {invoice.status === "draft" && (
            <>
              <Button
                variant="outline"
                onClick={onMarkAsIssued}
                className={cn(
                  // Base
                  "h-9 px-4 flex py-2 lex items-center"
                )}
              >
                <Send className="h-4 w-4 mr-2 stroke-[2.5px]" />
                Issue Invoice
              </Button>
              <Button
                variant="outline"
                onClick={() => navigate(`/payables/${invoice.id}/edit`)}
                className={cn(
                  // Base
                  "h-9 px-4 py-2",
                  // Colors
                  "bg-white flex items-center text-gray-700 border-gray-200",
                  // Hover
                  "hover:bg-gray-50 hover:text-gray-800",
                  // Focus
                  "focus-visible:ring-gray-500/30"
                )}
              >
                <Edit2 className="h-4 w-4 mr-2 stroke-[2.5px]" />
                Edit Invoice
              </Button>
            </>
          )}
          <Button
            variant="default"
            onClick={onDownload}
            disabled={isDownloading}
            className={cn(
              // Base
              "h-9 px-4 py-2 flex items-center",
              // Colors
              "bg-blue-600 text-white",
              // Hover
              "hover:bg-blue-700",
              // Focus
              "focus-visible:ring-blue-500/30",
              // Disabled
              "disabled:opacity-60"
            )}
          >
            {isDownloading ? (
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <Download className="h-4 w-4 mr-2" />
            )}
            {isDownloading ? "Generating..." : "Download PDF"}
          </Button>
        </div>
      </header>
    );
  }
);

const InvoiceDetailsCard = memo(({ invoice }: InvoiceDetailsCardProps) => (
  <Card
    className={cn(
      // Base
      "overflow-hidden",
      // Border
      "border border-gray-200",
      // Shadow
      "shadow-sm hover:shadow-md",
      // Transition
      "transition-all duration-200"
    )}
  >
    <div
      className={cn(
        // Base
        "px-6 py-4",
        // Border
        "border-b border-gray-200",
        // Background
        "bg-gradient-to-r from-gray-50/80 to-transparent"
      )}
    >
      <h3 className="text-xs font-medium text-gray-900">Invoice Information</h3>
    </div>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6">
      <InfoItem
        icon={Calendar}
        label="Issue Date"
        value={format(new Date(invoice.date), "MMMM d, yyyy")}
      />
      <InfoItem
        icon={Calendar}
        label="Due Date"
        value={format(new Date(invoice.dueDate), "MMMM d, yyyy")}
      />
      <InfoItem
        icon={CreditCard}
        label="Payment Terms"
        value={invoice.paymentTerms || "N/A"}
      />
      <InfoItem
        icon={FileText}
        label="Reference"
        value={invoice.referenceNumber || "N/A"}
      />
    </div>
  </Card>
));

const CustomerCard = memo(({ customer }: CustomerCardProps) => (
  <Card
    className={cn(
      // Base
      "overflow-hidden",
      // Border
      "border border-gray-200",
      // Shadow
      "shadow-sm hover:shadow-md",
      // Transition
      "transition-all duration-200"
    )}
  >
    <div
      className={cn(
        // Base
        "px-6 py-4",
        // Border
        "border-b border-gray-200",
        // Background
        "bg-gradient-to-r from-gray-50/80 to-transparent"
      )}
    >
      <h3 className="text-xs font-medium text-gray-900">
        Customer Information
      </h3>
    </div>
    <div className="p-6 space-y-6">
      <div className="flex items-start gap-4">
        <div
          className={cn(
            // Base
            "p-2.5 ",
            // Colors
            "bg-blue-50 text-blue-600",
            // Transition
            "transition-colors duration-200"
          )}
        >
          <Building2 className="h-5 w-5" />
        </div>
        <div>
          <h4 className="text-xs font-medium text-gray-900">
            {customer.companyName ||
              `${customer.contactFirstName} ${customer.contactLastName}`}
          </h4>
          <p className="text-xs text-gray-500 mt-0.5">
            {customer.relationship || "Individual"}
          </p>
        </div>
      </div>
      <Separator />
      <div className="space-y-4">
        {customer.email && (
          <ContactItem
            icon={Mail}
            href={`mailto:${customer.email}`}
            value={customer.email}
          />
        )}
        {customer.phoneNumber && (
          <ContactItem
            icon={Phone}
            href={`tel:${customer.phoneNumber}`}
            value={customer.phoneNumber}
          />
        )}
        {customer.billingAddress && (
          <div className="flex text-xs text-gray-500">
            <MapPin className="h-5 w-5 mr-3 text-gray-400 shrink-0" />
            <div className="space-y-1">
              <p className="text-xs leading-relaxed">
                {customer.billingAddress}
              </p>
              <p className="text-xs leading-relaxed">{customer.country}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  </Card>
));

const InvoiceSummaryCard = memo(({ invoice }: InvoiceSummaryCardProps) => (
  <Card
    className={cn(
      // Base
      "overflow-hidden",
      // Border
      "border border-gray-200",
      // Shadow
      "shadow-sm hover:shadow-md",
      // Transition
      "transition-all duration-200"
    )}
  >
    <div
      className={cn(
        // Base
        "px-6 py-4",
        // Border
        "border-b border-gray-200",
        // Background
        "bg-gradient-to-r from-gray-50/80 to-transparent"
      )}
    >
      <h3 className="text-xs font-medium text-gray-900">Invoice Summary</h3>
    </div>
    <div className="p-6 space-y-4">
      <SummaryItem label="Subtotal" value={invoice.total.toFixed(2)} />
      <SummaryItem
        label={`VAT (${invoice.vatAmount}%)`}
        value={invoice.vatAmount.toFixed(2)}
      />
      <div
        className={cn(
          // Base
          "flex items-center justify-between",
          // Spacing
          "pt-4",
          // Border
          "border-t border-gray-200"
        )}
      >
        <span className="text-xs font-medium text-gray-900">Total Amount</span>
        <div className="flex items-center gap-3">
          <ArrowRight className="h-4 w-4 text-blue-600" />
          <span className="text-xs font-semibold text-blue-600">
            €{(invoice.total + invoice.vatAmount).toFixed(2)}
          </span>
        </div>
      </div>
    </div>
  </Card>
));

// Helper Components
const InfoItem = memo(
  ({
    icon: Icon,
    label,
    value,
  }: {
    icon: any;
    label: string;
    value: string;
  }) => (
    <div className="space-y-2">
      <div className="flex items-center gap-2 text-xs text-gray-500">
        <Icon className="h-4 w-4" />
        <span>{label}</span>
      </div>
      <p className="text-xs font-medium text-gray-900">{value}</p>
    </div>
  )
);

const ContactItem = memo(
  ({ icon: Icon, href, value }: { icon: any; href: string; value: string }) => (
    <div className="flex items-center text-xs text-gray-500 group">
      <Icon className="h-5 w-5 mr-3 text-gray-400 group-hover:text-blue-500 transition-colors" />
      <a
        href={href}
        className={cn(
          // Base
          "text-gray-600",
          // Hover
          "hover:text-blue-600",
          // Transition
          "transition-colors duration-200"
        )}
      >
        {value}
      </a>
    </div>
  )
);

const SummaryItem = memo(
  ({ label, value }: { label: string; value: string }) => (
    <div className="flex justify-between items-center py-2">
      <span className="text-xs text-gray-500">{label}</span>
      <span className="text-xs font-medium text-gray-900">€{value}</span>
    </div>
  )
);

// Main Component
export function InvoiceView({ mode = "view" }: InvoiceViewProps) {
  const { id } = useParams();
  const [isDownloading, setIsDownloading] = useState(false);
  const { data: invoice, mutate } = useInvoice(id);
  const { data: customer } = useCustomer(invoice?.customerId);

  if (!invoice || !customer) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-6 h-6 animate-spin text-blue-600/50" />
      </div>
    );
  }

  const handleDownloadPDF = async () => {
    if (!invoice || !customer) return;

    try {
      setIsDownloading(true);
      const pdfData = {
        ...invoice,
        items: invoice.items || [],
        vatRate: invoice.vatRate || 0,
        vatAmount: invoice.vatAmount || 0,
        total: invoice.total || 0,
      };

      const companyData = {};
      const customerData = {
        companyName: customer.companyName || "",
        contactFirstName: customer.contactFirstName || "",
        contactLastName: customer.contactLastName || "",
        type: customer.relationship || "",
        address: customer.billingAddress || "",
        country: customer?.country || "",
        email: customer.email || "",
        phone: customer.phoneNumber || "",
      };

      await generateInvoicePDF(pdfData, companyData, customerData);
    } catch (error) {
      console.error("Failed to generate PDF:", error);
    } finally {
      setIsDownloading(false);
    }
  };

  const handleMarkAsPaid = async () => {
    await pb.collection("invoices").update(id!, {
      status: "paid",
    });
    mutate();
  };

  const handleAsIssued = async () => {
    await pb.collection("invoices").update(id!, {
      status: "issued",
    });
    mutate();
  };

  return (
    <div
      className={cn(
        // Base
        " mx-auto",
        // Layout
        "grid grid-cols-1 gap-6",
        // Spacing
        "p-8",
        // Background & Border
        "bg-white  border border-gray-200",
        // Shadow
        "shadow-sm"
      )}
    >
      <InvoiceHeader
        invoice={invoice}
        isDownloading={isDownloading}
        onDownload={handleDownloadPDF}
        onMarkAsPaid={handleMarkAsPaid}
        onMarkAsIssued={handleAsIssued}
      />

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-2">
          <InvoiceDetailsCard invoice={invoice} />
        </div>

        <div className="space-y-6">
          <CustomerCard customer={customer} />
          <InvoiceSummaryCard invoice={invoice} />
        </div>
      </div>
    </div>
  );
}
