import React from "react";
import { Eye, Download, FileEdit, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { pb } from "@/lib/pocketbase";
import { useToast } from "@/lib/hooks/useToast";
import ReactDOM from "react-dom";
import html2pdf from "html2pdf.js";
import { InvoicePDF } from "../invoice-pdf";

interface InvoiceActionsProps {
  invoiceId: string;
  onDelete?: () => void;
}

export function InvoiceActions({ invoiceId, onDelete }: InvoiceActionsProps) {
  const navigate = useNavigate();
  const { addToast } = useToast();

  const handlePreview = () => {
    navigate(`/invoices/${invoiceId}`);
  };

  const handleDownload = async () => {
    try {
      const response = await pb.collection("invoices").getOne(invoiceId, {
        expand: 'customerId,categoryId'
      });
      
      // Create a temporary div for the PDF
      const tempDiv = document.createElement("div");
      const root = document.createElement("div");
      tempDiv.appendChild(root);
      document.body.appendChild(tempDiv);

      // Render the invoice PDF component
      ReactDOM.render(
        <InvoicePDF invoice={response} />,
        root,
        async () => {
          try {
            const opt = {
              margin: 1,
              filename: `invoice-${response.number}.pdf`,
              image: { type: "jpeg", quality: 0.98 },
              html2canvas: { scale: 2 },
              jsPDF: { unit: "in", format: "a4", orientation: "portrait" },
            };

            await html2pdf().set(opt).from(root).save();
            addToast("Invoice downloaded successfully", "success");
          } catch (error) {
            addToast("Failed to generate PDF", "error");
          } finally {
            document.body.removeChild(tempDiv);
          }
        }
      );
    } catch (error) {
      addToast("Failed to download invoice", "error");
    }
  };

  const handleEdit = () => {
    navigate(`/invoices/${invoiceId}/edit`);
  };

  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to delete this invoice?")) {
      try {
        await pb.collection("invoices").delete(invoiceId);
        addToast("Invoice deleted successfully", "success");
        onDelete?.();
      } catch (error) {
        addToast("Failed to delete invoice", "error");
      }
    }
  };

  return (
    <div className="flex justify-end space-x-2">
      <Button
        variant="ghost"
        size="sm"
        onClick={handlePreview}
        className="text-gray-500 hover:text-gray-700"
      >
        <Eye className="h-4 w-4" />
      </Button>
      <Button
        variant="ghost"
        size="sm"
        onClick={handleDownload}
        className="text-gray-500 hover:text-gray-700"
      >
        <Download className="h-4 w-4" />
      </Button>
      <Button
        variant="ghost"
        size="sm"
        onClick={handleEdit}
        className="text-gray-500 hover:text-gray-700"
      >
        <FileEdit className="h-4 w-4" />
      </Button>
      <Button
        variant="ghost"
        size="sm"
        onClick={handleDelete}
        className="text-red-500 hover:text-red-700"
      >
        <Trash2 className="h-4 w-4" />
      </Button>
    </div>
  );
}
