import useSWR, { mutate } from "swr";
import { pb } from "../pocketbase";
import { isBefore } from "date-fns";
import { Invoice } from "@/types/invoice";
import { useSearchParams } from "react-router-dom";

export function useTotalInvoices() {
  const [searchParams] = useSearchParams();
  const from = searchParams.get("from");
  const to = searchParams.get("to");
  const companyId = searchParams.get("companyId");
  const companyFilter = companyId ? `companyId = '${companyId}'` : "";
  const dateFilter = from && to ? `date >= '${from}' && date <= '${to}'` : "";
  const filter = [companyFilter, `status != 'draft'`, dateFilter]
    .filter(Boolean)
    .join(" && ");

  return useSWR(
    [`total-invoices`, from, to, companyId],
    () =>
      pb.collection("invoices").getList(1, 1, {
        filter,
        sort: "-date",
        requestKey: null,
      }),
    {
      revalidateOnMount: true,
      revalidateOnFocus: true,
    }
  )?.data?.totalItems;
}

export function useTotalPaidPayables() {
  const [searchParams] = useSearchParams();
  const from = searchParams.get("from");
  const to = searchParams.get("to");
  const companyId = searchParams.get("companyId");
  const companyFilter = companyId ? `companyId = '${companyId}'` : "";
  const dateFilter = from && to ? `date >= '${from}' && date <= '${to}'` : "";
  const filter = [
    companyFilter,
    `status = 'paid'`,
    `type = 'payable'`,
    dateFilter,
  ]
    .filter(Boolean)
    .join(" && ");

  return useSWR(
    [`total-paid-payables`, from, to, companyId],
    async () =>
      await pb.collection("invoices").getList(1, 1, {
        filter,
        sort: "-date",
        requestKey: null,
      }),
    {
      revalidateOnMount: true,
      revalidateOnFocus: true,
    }
  )?.data?.totalItems;
}

export function useTotalPaidReceivables() {
  const [searchParams] = useSearchParams();
  const from = searchParams.get("from");
  const to = searchParams.get("to");
  const companyId = searchParams.get("companyId");
  const companyFilter = companyId ? `companyId = '${companyId}'` : "";
  const dateFilter = from && to ? `date >= '${from}' && date <= '${to}'` : "";
  const filter = [
    companyFilter,
    `status = 'paid'`,
    `type = 'receivable'`,
    dateFilter,
  ]
    .filter(Boolean)
    .join(" && ");

  return useSWR(
    [`total-paid-receivables`, from, to, companyId],
    async () =>
      await pb.collection("invoices").getList(1, 1, {
        filter,
        sort: "-date",
        requestKey: null,
      }),
    {
      revalidateOnMount: true,
      revalidateOnFocus: true,
    }
  )?.data?.totalItems;
}

export function useTotalOverdueInvoices() {
  const [searchParams] = useSearchParams();
  const from = searchParams.get("from");
  const to = searchParams.get("to");
  const companyId = searchParams.get("companyId");
  const companyFilter = companyId ? `companyId = '${companyId}'` : "";
  const dateFilter = from && to ? `date >= '${from}' && date <= '${to}'` : "";
  const filter = [
    companyFilter,
    `status = 'overdue'`,
    `type = 'payable'`,
    dateFilter,
  ]
    .filter(Boolean)
    .join(" && ");

  return useSWR(
    [`total-overdue-payable-invoices`, from, to, companyId],
    async () =>
      await pb.collection("invoices").getList(1, 1, {
        filter,
        sort: "-date",
        requestKey: null,
      }),
    {
      revalidateOnMount: true,
      revalidateOnFocus: true,
    }
  )?.data?.totalItems;
}

export function useTotalOverdueReceivables() {
  const [searchParams] = useSearchParams();
  const from = searchParams.get("from");
  const to = searchParams.get("to");
  const companyId = searchParams.get("companyId");
  const companyFilter = companyId ? `companyId = '${companyId}'` : "";
  const dateFilter = from && to ? `date >= '${from}' && date <= '${to}'` : "";
  const filter = [
    companyFilter,
    `status = 'overdue'`,
    `type = 'receivable'`,
    dateFilter,
  ]
    .filter(Boolean)
    .join(" && ");

  return useSWR(
    [`total-overdue-receivable-invoices`, from, to, companyId],
    async () =>
      await pb.collection("invoices").getList(1, 1, {
        filter,
        sort: "-date",
        requestKey: null,
      }),
    {
      revalidateOnMount: true,
      revalidateOnFocus: true,
    }
  )?.data?.totalItems;
}

export function useTotalIssuedInvoicesPayable() {
  const [searchParams] = useSearchParams();
  const from = searchParams.get("from");
  const to = searchParams.get("to");
  const companyId = searchParams.get("companyId");
  const companyFilter = companyId ? `companyId = '${companyId}'` : "";
  const dateFilter = from && to ? `date >= '${from}' && date <= '${to}'` : "";
  const filter = [
    companyFilter,
    `status = 'issued'`,
    `type = 'payable'`,
    dateFilter,
  ]
    .filter(Boolean)
    .join(" && ");

  return useSWR(
    [`total-issued-invoices-payable`, from, to, companyId],
    async () =>
      await pb.collection("invoices").getList(1, 1, {
        filter,
        sort: "-date",
        requestKey: null,
      }),
    {
      revalidateOnMount: true,
      revalidateOnFocus: true,
    }
  )?.data?.totalItems;
}

export function useTotalIssuedInvoicesReceivable() {
  const [searchParams] = useSearchParams();
  const from = searchParams.get("from");
  const to = searchParams.get("to");
  const companyId = searchParams.get("companyId");
  const companyFilter = companyId ? `companyId = '${companyId}'` : "";
  const dateFilter = from && to ? `date >= '${from}' && date <= '${to}'` : "";
  const filter = [
    companyFilter,
    `status = 'issued'`,
    `type = 'receivable'`,
    dateFilter,
  ]
    .filter(Boolean)
    .join(" && ");

  return useSWR(
    [`total-issued-invoices-receivable`, from, to, companyId],
    async () =>
      await pb.collection("invoices").getList(1, 1, {
        filter,
        sort: "-date",
        requestKey: null,
      })
  )?.data?.totalItems;
}

export function useTotalPayableAmount() {
  const [searchParams] = useSearchParams();
  const from = searchParams.get("from");
  const to = searchParams.get("to");
  const companyId = searchParams.get("companyId");
  const companyFilter = companyId ? `companyId = '${companyId}'` : "";
  const dateFilter = from && to ? `date >= '${from}' && date <= '${to}'` : "";
  const filter = [
    companyFilter,
    `status = 'paid'`,
    `type = 'payable'`,
    dateFilter,
  ]
    .filter(Boolean)
    .join(" && ");

  const { data } = useSWR(
    [`total-payable-amount`, from, to, companyId],
    async () =>
      await pb.collection("invoices").getFullList(500, {
        filter,
        sort: "-date",
        requestKey: null,
      })
  );
  return data?.reduce((sum, invoice) => sum + (invoice.total || 0), 0) || 0;
}

export function useTotalReceivableAmount() {
  const [searchParams] = useSearchParams();
  const from = searchParams.get("from");
  const to = searchParams.get("to");
  const companyId = searchParams.get("companyId");
  const companyFilter = companyId ? `companyId = '${companyId}'` : "";
  const dateFilter = from && to ? `date >= '${from}' && date <= '${to}'` : "";
  const filter = [
    companyFilter,
    `status = 'paid'`,
    `type = 'receivable'`,
    dateFilter,
  ]
    .filter(Boolean)
    .join(" && ");

  const { data } = useSWR(
    [`total-receivable-amount`, from, to, companyId],
    async () =>
      await pb.collection("invoices").getFullList(500, {
        filter,
        sort: "-date",
        requestKey: null,
      })
  );
  return data?.reduce((sum, invoice) => sum + (invoice.total || 0), 0) || 0;
}

export function useInvoiceTotals() {
  const { data: invoices } = useSWR(
    ["expiring-invoices"],
    async () => {
      const filter = [`status = 'issued'`].filter(Boolean).join(" && ");
      return await pb.collection("invoices").getFullList<Invoice>(500, {
        filter,
        sort: "-date",
        requestKey: null,
      });
    },
    {
      revalidateOnMount: true,
      revalidateOnFocus: true,
      revalidateOnReconnect: true,
    }
  );

  invoices?.forEach(async (invoice) => {
    if (isBefore(new Date(invoice.dueDate), new Date())) {
      await pb.collection("invoices").update(
        invoice.id!,
        {
          ...invoice,
          status: "overdue",
        },
        {
          requestKey: null,
        }
      );
    }
    mutate(["expiring-invoices"]);
    mutate([`total-invoices`, null, null]);
    mutate([`total-overdue-invoices`, null, null]);
    mutate([`total-issued-invoices-payable`, null, null]);
    mutate([`total-issued-invoices-receivable`, null, null]);
    mutate([`total-overdue-receivables`, null, null]);
    mutate([`total-payable-amount`, null, null]);
    mutate([`total-receivable-amount`, null, null]);
  });

  const totalInvoices = useTotalInvoices();
  const totalOverdueInvoices = useTotalOverdueInvoices();
  const totalIssuedInvoicesPayable = useTotalIssuedInvoicesPayable();
  const totalIssuedInvoicesReceivable = useTotalIssuedInvoicesReceivable();
  const totalOverdueReceivables = useTotalOverdueReceivables();
  const totalPayableAmount = useTotalPayableAmount();
  const totalReceivableAmount = useTotalReceivableAmount();
  const totalPaidPayables = useTotalPaidPayables();
  const totalPaidReceivables = useTotalPaidReceivables();

  return {
    totalInvoices,
    totalOverdueInvoices,
    totalIssuedInvoicesPayable,
    totalIssuedInvoicesReceivable,
    totalOverdueReceivables,
    totalPayableAmount,
    totalReceivableAmount,
    totalPaidPayables,
    totalPaidReceivables,
  };
}
