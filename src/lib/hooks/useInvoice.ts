import useSWR from "swr";
import { pb } from "../pocketbase";

export function useInvoice(id?: string) {
  return useSWR(id && `/api/invoices/${id}`, () =>
    pb.collection("invoices").getOne(id!)
  );
}
