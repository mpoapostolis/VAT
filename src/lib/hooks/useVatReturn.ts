import useSWR from "swr";
import { pb } from "../pocketbase";
import { VATReturn } from "@/types/vat-return";
import { TableParams } from "./useTableParams";
import { useSearchParams } from "react-router-dom";

export interface VatReturnParams extends TableParams {
  status?: VATReturn["status"];
}

export function useVatReturn(id?: string) {
  return useSWR<VATReturn>(
    id && id !== "new" ? `/api/vat-returns/${id}` : null,
    async () => (id ? pb.collection("vat_returns").getOne(id) : null)
  );
}

export function useVatReturns(params?: Partial<VatReturnParams>) {
  const [searchParams] = useSearchParams();

  const page = params?.page || Number(searchParams.get("page")) || 1;
  const perPage = params?.perPage || Number(searchParams.get("perPage")) || 10;
  const search = params?.search || searchParams.get("search") || "";
  const sort = params?.sort || searchParams.get("sort") || "-created";
  const status = (params?.status || searchParams.get("status")) as
    | VATReturn["status"]
    | undefined;
  const startDate = params?.startDate || searchParams.get("startDate");
  const endDate = params?.endDate || searchParams.get("endDate");

  const queryParams = {
    page,
    perPage,
    search,
    sort,
    status,
    startDate,
    endDate,
  };

  return useSWR(["/api/vat-returns", queryParams], () =>
    pb.collection<VATReturn>("vat_returns").getList(page, perPage, {
      sort,
      filter: [
        search && `period ~ "${search}"`,
        status && `status = "${status}"`,
        startDate && `startDate >= "${startDate}"`,
        endDate && `endDate <= "${endDate}"`,
      ]
        .filter(Boolean)
        .join(" && "),
    })
  );
}
