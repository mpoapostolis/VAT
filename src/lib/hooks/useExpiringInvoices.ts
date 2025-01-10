import { addDays } from "date-fns";
import useSWR from "swr";
import { pb } from "../pocketbase";

export function useExpiringInvoices() {
  const today = new Date();
  const fiveDaysFromNow = addDays(today, 5);

  return useSWR(`expiring-invoices`, () =>
    pb.collection("invoices").getFullList(500, {
      filter: `status = 'issued'  `,
      sort: "-date",
    })
  );
}
