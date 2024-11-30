import { jsPDF } from 'jspdf';
import { Invoice } from '@/types';
import { formatCurrency, formatDate } from '@/lib/utils';

export const downloadInvoicePdf = (invoice: Invoice) => {
  const doc = new jsPDF();
  const margin = 20;
  let y = margin;

  // Header
  doc.setFontSize(24);
  doc.text('Invoice', margin, y);
  y += 10;

  doc.setFontSize(12);
  doc.text(invoice.number, margin, y);
  y += 20;

  // Dates
  doc.setFontSize(10);
  doc.text(`Date Issued: ${formatDate(invoice.date)}`, margin, y);
  doc.text(`Due Date: ${formatDate(invoice.dueDate)}`, margin, y + 5);
  y += 20;

  // Customer Details
  doc.setFontSize(12);
  doc.text('Bill To:', margin, y);
  y += 5;
  doc.setFontSize(10);
  doc.text('Customer Name', margin, y);
  doc.text('123 Street Name', margin, y + 5);
  doc.text('City, Country', margin, y + 10);
  doc.text(`VAT: ${invoice.customerId}`, margin, y + 15);
  y += 30;

  // Line Items
  doc.setFontSize(10);
  const headers = ['Description', 'Qty', 'Price', 'VAT', 'Total'];
  const columnWidths = [80, 20, 25, 20, 25];
  let x = margin;

  headers.forEach((header, i) => {
    doc.text(header, x, y);
    x += columnWidths[i];
  });
  y += 5;

  doc.line(margin, y, 190, y);
  y += 5;

  invoice.lines.forEach(line => {
    x = margin;
    doc.text(line.description, x, y);
    x += columnWidths[0];
    doc.text(line.quantity.toString(), x, y);
    x += columnWidths[1];
    doc.text(formatCurrency(line.unitPrice, invoice.currency), x, y);
    x += columnWidths[2];
    doc.text(`${line.vatRate}%`, x, y);
    x += columnWidths[3];
    doc.text(formatCurrency(line.totalIncVat, invoice.currency), x, y);
    y += 5;
  });

  y += 10;
  doc.line(margin, y, 190, y);
  y += 10;

  // Totals
  const totalsX = 150;
  doc.text('Subtotal:', totalsX, y);
  doc.text(formatCurrency(invoice.totalExVat, invoice.currency), totalsX + 25, y);
  y += 5;
  doc.text('VAT:', totalsX, y);
  doc.text(formatCurrency(invoice.totalVat, invoice.currency), totalsX + 25, y);
  y += 5;
  doc.setFontSize(12);
  doc.text('Total:', totalsX, y);
  doc.text(formatCurrency(invoice.totalIncVat, invoice.currency), totalsX + 25, y);

  // Save the PDF
  doc.save(`invoice-${invoice.number}.pdf`);
};