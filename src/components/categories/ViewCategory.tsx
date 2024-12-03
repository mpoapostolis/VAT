import { useParams, useNavigate, Link } from "react-router-dom";
import useSWR from "swr";
import { FolderOpen, FileText, Printer, Send, FileEdit } from "lucide-react";
import { AnimatedPage } from "@/components/AnimatedPage";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/ui/page-header";
import { categoryService } from "@/lib/services/category-service";
import { formatCurrency, formatDate } from "@/lib/utils";

export function ViewCategory() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data: categoryData, isLoading } = useSWR(
    id ? `categories/${id}` : null,
    () => categoryService.getWithInvoices(id!)
  );

  if (isLoading || !categoryData) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
      </div>
    );
  }

  const { stats } = categoryData;

  const headerActions = (
    <>
      <Button variant="outline" size="sm" onClick={() => window.print()}>
        <Printer className="h-4 w-4 mr-2" />
        Print
      </Button>
      <Button variant="outline" size="sm">
        <Send className="h-4 w-4 mr-2" />
        Share
      </Button>
      <Button
        variant="outline"
        size="sm"
        onClick={() => navigate(`/categories/${id}/edit`)}
      >
        <FileEdit className="h-4 w-4 mr-2" />
        Edit
      </Button>
    </>
  );

  return (
    <AnimatedPage>
      <div className="space-y-6">
        <PageHeader
          title={categoryData.name}
          subtitle={`${categoryData.type.charAt(0).toUpperCase() + categoryData.type.slice(1)} Category`}
          onBack={() => navigate("/categories")}
          actions={headerActions}
          type={categoryData.type}
        />

        <div className="grid grid-cols-3 gap-6">
          <div className="col-span-2 bg-white border border-gray-200/60 shadow-lg shadow-gray-200/20 p-6 space-y-6">
            <div>
              <h2 className="text-lg font-medium text-gray-900 mb-4">
                Basic Information
              </h2>
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <div
                    className={`p-2 rounded-lg ${
                      categoryData.type === "income"
                        ? "bg-green-50"
                        : "bg-red-50"
                    }`}
                  >
                    <FolderOpen
                      className={`h-5 w-5 ${
                        categoryData.type === "income"
                          ? "text-green-500"
                          : "text-red-500"
                      }`}
                    />
                  </div>
                  <div>
                    <div className="font-medium text-gray-900">
                      {categoryData.name}
                    </div>
                    <div className="text-sm text-gray-500">Category Name</div>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <div className="p-2 rounded-lg bg-gray-50">
                    <FileText className="h-5 w-5 text-gray-400" />
                  </div>
                  <div>
                    <div className="font-medium text-gray-900">
                      {categoryData.description}
                    </div>
                    <div className="text-sm text-gray-500">Description</div>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <div
                    className={`p-2 rounded-lg ${
                      categoryData.type === "income"
                        ? "bg-green-50"
                        : "bg-red-50"
                    }`}
                  >
                    <div
                      className={`h-5 w-5 rounded-full border-2 ${
                        categoryData.type === "income"
                          ? "border-green-500 bg-green-100"
                          : "border-red-500 bg-red-100"
                      }`}
                    />
                  </div>
                  <div>
                    <div className="font-medium text-gray-900">
                      {categoryData.type.charAt(0).toUpperCase() +
                        categoryData.type.slice(1)}
                    </div>
                    <div className="text-sm text-gray-500">Type</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-6 border-t border-gray-200">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <div className="text-gray-500">Created</div>
                  <div className="font-medium text-gray-900">
                    {formatDate(categoryData.created)}
                  </div>
                </div>
                <div>
                  <div className="text-gray-500">Last Updated</div>
                  <div className="font-medium text-gray-900">
                    {formatDate(categoryData.updated)}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-white border border-gray-200/60 shadow-lg shadow-gray-200/20 p-6">
              <h2 className="text-lg font-medium text-gray-900 mb-4">
                Statistics
              </h2>
              <div className="space-y-4">
                <div>
                  <div className="text-sm text-gray-500">Total Amount</div>
                  <div
                    className={`text-2xl font-semibold mt-1 ${
                      categoryData.type === "income"
                        ? "text-green-600"
                        : "text-red-600"
                    }`}
                  >
                    {formatCurrency(stats.totalAmount)}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-100">
                  <div>
                    <div className="text-sm text-gray-500">Paid</div>
                    <div className="font-medium text-green-600 mt-1">
                      {formatCurrency(stats.paidAmount)}
                    </div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-500">Pending</div>
                    <div className="font-medium text-yellow-600 mt-1">
                      {formatCurrency(stats.pendingAmount)}
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-gray-100">
                  <div className="text-sm text-gray-500">Total Invoices</div>
                  <div className="font-medium text-gray-900 mt-1">
                    {stats.invoiceCount}{" "}
                    {stats.invoiceCount === 1 ? "invoice" : "invoices"}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AnimatedPage>
  );
}
