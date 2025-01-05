import useSWR from "swr";
import { pb } from "../pocketbase";

export function useCompany(id?: string) {
  return useSWR(id && `/api/companies/${id}`, () =>
    pb.collection("companies").getOne(id!)
  );
}
