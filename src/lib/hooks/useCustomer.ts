import useSWR from "swr";
import { pb } from "../pocketbase";

export function useCustomer(id?: string) {
  return useSWR(id && `/api/customers/${id}`, () =>
    pb.collection("customers").getOne(id!)
  );
}
