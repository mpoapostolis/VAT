import { pb } from "@/lib/pocketbase";
import {
  UseInvoicesOptions,
  UseInvoicesReturn,
  Invoice,
} from "@/types/invoice";
import useSWR from "swr";
import { useSearchParams } from "react-router-dom";

export function useInvoices(
  params: UseInvoicesOptions = {}
): UseInvoicesReturn {
  const [searchParams] = useSearchParams();

  // Get parameters from URL or fallback to passed params
  const type =
    (searchParams.get("type") as "receivable" | "payable" | "all") ||
    params.type ||
    "all";

  const search = searchParams.get("search") || params.search;

  const customerId = searchParams.get("customerId") || params.customerId;
  const status =
    (searchParams.get("status") as
      | "draft"
      | "pending"
      | "sent"
      | "paid"
      | "overdue"
      | "cancelled"
      | undefined) || params.status;
  const from = searchParams.get("from");
  const to = searchParams.get("to");
  const currency = searchParams.get("currency") || params.currency;
  const minAmount = searchParams.get("minAmount") || params.minAmount;
  const maxAmount = searchParams.get("maxAmount") || params.maxAmount;
  const companyId = searchParams.get("companyId") || params.companyId;

  // Build cache key
  const cacheKey = `/api/invoices?${type ? `type=${type}` : ""}${
    search ? `&search=${search}` : ""
  }${customerId ? `&customerId=${customerId}` : ""}${
    status ? `&status=${status}` : ""
  }${from ? `&from=${from}` : ""}${to ? `&to=${to}` : ""}${
    currency ? `&currency=${currency}` : ""
  }${minAmount ? `&minAmount=${minAmount}` : ""}${
    maxAmount ? `&maxAmount=${maxAmount}` : ""
  }${companyId ? `&companyId=${companyId}` : ""}`;

  const fetcher = async () => {
    try {
      // Initialize filters array
      const filters: string[] = [];

      // Handle `type` filter
      if (type) {
        if (type === "all") {
          filters.push(`(type = 'receivable' || type = 'payable')`);
        } else {
          filters.push(`type = '${type}'`);
        }
      }

      // Handle `search` filter (case-insensitive search across fields)
      if (search) {
        const searchTerm = search.toLowerCase();
        filters.push(
          `(
            number ?~ '${searchTerm}'
          )`
        );
      }

      // Add other filters
      if (customerId) filters.push(`customerId = '${customerId}'`);
      if (status) filters.push(`status = '${status}'`);
      if (from) filters.push(`date >= '${from}'`);
      if (to) filters.push(`date <= '${to}'`);
      if (currency) filters.push(`currency = '${currency}'`);
      if (companyId) filters.push(`companyId = '${companyId}'`);

      // Validate and add amount filters
      if (minAmount) {
        const amount = Number(minAmount);
        if (!isNaN(amount)) filters.push(`total >= ${amount}`);
      }
      if (maxAmount) {
        const amount = Number(maxAmount);
        if (!isNaN(amount)) filters.push(`total <= ${amount}`);
      }

      // Join filters into a single query string
      const filter = filters.length > 0 ? filters.join(" && ") : undefined;

      // Fetch invoices with filters, sorting, and pagination
      const response = await pb.collection("invoices").getList<Invoice>(1, 50, {
        sort: "-created", // Sort by the latest created first
        filter, // Apply the filters
        expand: "customerId", // Expand related customer data
        requestKey: cacheKey,
      });

      // Return the formatted result
      return {
        items: response.items,
        totalItems: response.totalItems,
        totalPages: response.totalPages,
        page: response.page,
      };
    } catch (error) {
      // Log the error with additional context
      console.error("Error fetching invoices with filters:", {
        type,
        search,
        customerId,
        status,
        from,
        to,
        currency,
        minAmount,
        maxAmount,
        error,
      });
      throw error;
    }
  };

  const { data, error, mutate } = useSWR(cacheKey, fetcher, {
    revalidateOnFocus: true,
    revalidateOnMount: true,
    refreshInterval: 0,
    onErrorRetry: (error, key, config, revalidate, { retryCount }) => {
      if (retryCount >= 3) return;
      setTimeout(() => revalidate({ retryCount }), 5000);
    },
  });

  const reloadInvoices = () => {
    return mutate();
  };

  const invoices = data?.items ?? [];

  const duplicateInvoice = async (invoiceId: string) => {
    const invoice = invoices?.find((inv) => inv.id === invoiceId);
    if (!invoice) throw new Error("Invoice not found");

    // Fields to exclude from duplication
    const fieldsToExclude = [
      "id",
      "created",
      "updated",
      "number",
      "status",
      "date",
      "dueDate",
      "paid",
      "paidDate",
      "sent",
      "sentDate",
    ];

    // Create new invoice object without excluded fields
    const newInvoiceData = Object.entries(invoice).reduce(
      (acc, [key, value]) => {
        if (!fieldsToExclude.includes(key)) {
          acc[key] = value;
        }
        return acc;
      },
      {} as Partial<Invoice>
    );

    // Add required fields with new values
    const now = new Date().toISOString();
    const dueDate = new Date();
    dueDate.setDate(dueDate.getDate() + 30); // 30 days from now

    const duplicatedInvoice = {
      ...newInvoiceData,
      number: `${invoice.number}-COPY`,
      status: "draft",
      date: now,
      dueDate: dueDate.toISOString(),
      paid: false,
      paidDate: null,
      sent: false,
      sentDate: null,
    };

    try {
      const response = await pb
        .collection("invoices")
        .create(duplicatedInvoice);
      await mutate();
      return response.id;
    } catch (error) {
      console.error("Error duplicating invoice:", error);
      throw error;
    }
  };

  return {
    invoices,
    totalItems: data?.totalItems ?? 0,
    totalPages: data?.totalPages ?? 0,
    isLoading: !error && !data,
    error,
    mutate: reloadInvoices,
    duplicateInvoice,
    stats: undefined,
  };
}
