import jsPDF from "jspdf";
import "jspdf-autotable";
import { format } from "date-fns";

interface InvoiceItem {
  description: string;
  quantity: number;
  unitPrice: number;
  details?: string;
}

interface Company {
  companyNameEN: string;
  vatNumber: string;
  address?: string;
  city?: string;
  country?: string;
  email?: string;
  phone?: string;
}

interface Customer {
  companyName?: string;
  contactFirstName?: string;
  contactLastName?: string;
  type?: string;
  address?: string;
  city?: string;
  country?: string;
  email?: string;
  phone?: string;
}

interface Invoice {
  number: string;
  date: string;
  dueDate: string;
  type: "receivable" | "payable";
  status: string;
  paymentTerms?: string;
  reference?: string;
  items: InvoiceItem[];
  total: number;
  vatRate: number;
  vatAmount: number;
}

export const generateInvoicePDF = async (
  invoice: Invoice,
  company: Company,
  customer: Customer
): Promise<void> => {
  return new Promise((resolve, reject) => {
    try {
      // Validate required data
      if (!invoice.number || !invoice.date || !invoice.dueDate) {
        throw new Error("Missing required invoice data");
      }

      if (!company.companyNameEN) {
        throw new Error("Missing required company data");
      }

      // Create new PDF document
      const doc = new jsPDF();

      // Colors based on style guide
      const colors = {
        primary: "#6366F1", // blue-600
        success: "#10B981", // emerald-500
        error: "#EF4444", // rose-500
        warning: "#F59E0B", // amber-500
        gray: {
          50: "#F9FAFB",
          100: "#F3F4F6",
          500: "#6B7280",
          600: "#4B5563",
          900: "#111827",
        },
      };

      // Document margins
      const margin = {
        top: 20,
        right: 20,
        bottom: 20,
        left: 20,
      };

      // Helper function to add a divider line
      const addDivider = (y: number) => {
        doc.setDrawColor(colors.gray[100]);
        doc.setLineWidth(0.5);
        doc.line(margin.left, y, doc.internal.pageSize.width - margin.right, y);
      };

      // Set default font
      doc.setFont("helvetica");

      // Header Section
      let y = margin.top;

      // Company logo/name
      doc.setFontSize(24);
      doc.setTextColor(colors.gray[900]);
      doc.text(company.companyNameEN || "", margin.left, y);

      // Invoice details on the right
      const rightColumn = doc.internal.pageSize.width - margin.right;
      doc.setFontSize(20);
      doc.setTextColor(colors.primary);
      doc.text("INVOICE", rightColumn - doc.getTextWidth("INVOICE"), y);

      y += 10;
      doc.setFontSize(12);
      doc.setTextColor(colors.gray[600]);
      const invoiceNumber = `#${invoice.number}`;
      doc.text(invoiceNumber, rightColumn - doc.getTextWidth(invoiceNumber), y);

      // Status badge
      y += 8;
      const statusColor =
        invoice.status?.toLowerCase() === "paid"
          ? colors.success
          : invoice.status?.toLowerCase() === "overdue"
          ? colors.error
          : colors.warning;

      const statusText = (invoice.status || "PENDING").toUpperCase();
      const statusWidth = doc.getTextWidth(statusText) + 10;
      doc.setFillColor(statusColor);
      doc.Rect(rightColumn - statusWidth, y - 5, statusWidth, 7, 1, 1, "F");
      doc.setTextColor("#FFFFFF");
      doc.setFontSize(9);
      const statusX = rightColumn - statusWidth + statusWidth / 2;
      doc.text(statusText, statusX - doc.getTextWidth(statusText) / 2, y);

      // Add divider
      y += 15;
      addDivider(y);
      y += 10;

      // Billing Information Section
      doc.setTextColor(colors.gray[900]);
      doc.setFontSize(10);

      // From section (Company)
      doc.setFontSize(12);
      doc.text("From:", margin.left, y);
      y += 7;
      doc.setFontSize(10);
      doc.text(company.companyNameEN || "", margin.left, y);
      y += 5;
      if (company.address) {
        doc.text(company.address, margin.left, y);
        y += 5;
      }
      if (company.city || company.country) {
        const location = [company.city, company.country]
          .filter(Boolean)
          .join(", ");
        if (location) {
          doc.text(location, margin.left, y);
          y += 5;
        }
      }
      if (company.vatNumber) {
        doc.text(`VAT: ${company.vatNumber}`, margin.left, y);
        y += 5;
      }

      // To section (Customer)
      y += 10;
      doc.setFontSize(12);
      doc.text("Bill To:", margin.left, y);
      y += 7;
      doc.setFontSize(10);
      const customerName =
        [
          customer.companyName,
          customer.contactFirstName && customer.contactLastName
            ? `${customer.contactFirstName} ${customer.contactLastName}`
            : null,
        ].filter(Boolean)[0] || "N/A";

      doc.text(customerName, margin.left, y);
      y += 5;
      if (customer.address) {
        doc.text(customer.address, margin.left, y);
        y += 5;
      }
      if (customer.city || customer.country) {
        const location = [customer.city, customer.country]
          .filter(Boolean)
          .join(", ");
        if (location) {
          doc.text(location, margin.left, y);
          y += 5;
        }
      }

      // Invoice Details
      y += 15;
      addDivider(y);
      y += 15;

      // Invoice details in a grid
      const detailsStartX = margin.left;
      const columnWidth =
        (doc.internal.pageSize.width - margin.left - margin.right) / 2;

      doc.setFontSize(10);
      doc.setTextColor(colors.gray[500]);
      doc.text("Invoice Date:", detailsStartX, y);
      doc.setTextColor(colors.gray[900]);
      doc.text(
        format(new Date(invoice.date), "MMM dd, yyyy"),
        detailsStartX + 60,
        y
      );

      doc.setTextColor(colors.gray[500]);
      doc.text("Due Date:", detailsStartX + columnWidth, y);
      doc.setTextColor(colors.gray[900]);
      doc.text(
        format(new Date(invoice.dueDate), "MMM dd, yyyy"),
        detailsStartX + columnWidth + 60,
        y
      );

      // Items Table
      y += 20;
      const items = Array.isArray(invoice.items) ? invoice.items : [];
      doc.autoTable({
        startY: y,
        head: [["Description", "Quantity", "Unit Price", "Total"]],
        body: items.map((item) => [
          item.description || "",
          (item.quantity || 0).toString(),
          `€${(item.unitPrice || 0).toFixed(2)}`,
          `€${((item.quantity || 0) * (item.unitPrice || 0)).toFixed(2)}`,
        ]),
        styles: {
          fontSize: 10,
          cellPadding: 5,
        },
        headStyles: {
          fillColor: [249, 250, 251],
          textColor: [17, 24, 39],
          fontStyle: "bold",
        },
        columnStyles: {
          0: { cellWidth: "auto" },
          1: { cellWidth: 30, halign: "right" },
          2: { cellWidth: 40, halign: "right" },
          3: { cellWidth: 40, halign: "right" },
        },
      });

      // Totals section
      const finalY = (doc as any)["lastAutoTable"].finalY + 10;
      const totalsX = rightColumn - 80;

      // Subtotal
      doc.setFontSize(10);
      doc.setTextColor(colors.gray[500]);
      doc.text("Subtotal:", totalsX, finalY);
      const subtotalText = `€${(invoice.total || 0).toFixed(2)}`;
      doc.setTextColor(colors.gray[900]);
      doc.text(
        subtotalText,
        rightColumn - doc.getTextWidth(subtotalText),
        finalY
      );

      // VAT
      doc.setTextColor(colors.gray[500]);
      doc.text(`VAT (${invoice.vatRate || 0}%):`, totalsX, finalY + 7);
      const vatText = `€${(invoice.vatAmount || 0).toFixed(2)}`;
      doc.setTextColor(colors.gray[900]);
      doc.text(vatText, rightColumn - doc.getTextWidth(vatText), finalY + 7);

      // Total
      doc.setFontSize(12);
      doc.setTextColor(colors.gray[900]);
      doc.text("Total:", totalsX, finalY + 20);
      const totalText = `€${(
        (invoice.total || 0) + (invoice.vatAmount || 0)
      ).toFixed(2)}`;
      doc.setTextColor(colors.primary);
      doc.text(
        totalText,
        rightColumn - doc.getTextWidth(totalText),
        finalY + 20
      );

      // Footer
      const footerY = doc.internal.pageSize.height - margin.bottom;
      doc.setFontSize(8);
      doc.setTextColor(colors.gray[500]);
      const footerText = "Thank you for your business";
      const footerX = doc.internal.pageSize.width / 2;
      doc.text(footerText, footerX - doc.getTextWidth(footerText) / 2, footerY);

      // Save the PDF
      doc.save(`invoice-${invoice.number}.pdf`);
      resolve();
    } catch (error) {
      console.error("PDF Generation Error:", error);
      reject(error);
    }
  });
};
