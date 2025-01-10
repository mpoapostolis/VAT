import useSWR from "swr";
import { useSearchParams } from "react-router-dom";
import { pb } from "../pocketbase";
import { Customer } from "@/types/customer";

export function useCustomers(
  params: {
    page?: number;
    perPage?: number;
    sort?: string;
    filter?: string;
  } = {}
) {
  const [searchParams] = useSearchParams();

  const page = Number(searchParams.get("page")) || params.page || 1;
  const perPage = Number(searchParams.get("perPage")) || params.perPage || 5;
  const sort = searchParams.get("sort") || params.sort || "-created";
  const filter = searchParams.get("filter") || params.filter || "";

  const cacheKey = `/api/customers?page=${page}&perPage=${perPage}&sort=${sort}&filter=${filter}`;

  const fetcher = async () => {
    try {
      const records = await pb
        .collection("customers")
        .getList<Customer>(page, perPage, {
          filter,
          sort,
          requestKey: null,
        });

      return {
        items: records.items,
        totalItems: records.totalItems,
        totalPages: records.totalPages,
        page: records.page,
      };
    } catch (error) {
      console.error("Error fetching customers:", error);
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

  const reloadCompanies = () => {
    return mutate();
  };

  return {
    customers: data?.items ?? [],
    totalItems: data?.totalItems ?? 0,
    totalPages: data?.totalPages ?? 0,
    currentPage: data?.page ?? page,
    isLoading: !error && !data,
    isError: error,
    mutate: reloadCompanies,
  };
}
