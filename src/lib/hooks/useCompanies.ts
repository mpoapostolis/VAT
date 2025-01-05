import useSWR from "swr";
import { useSearchParams } from "react-router-dom";
import { pb } from "../pocketbase";
import { Company } from "@/types/company";

export function useCompanies(
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

  const cacheKey = `/api/companies?page=${page}&perPage=${perPage}&sort=${sort}&filter=${filter}`;

  const fetcher = async () => {
    try {
      const records = await pb
        .collection("companies")
        .getList<Company>(page, perPage, {
          filter,
          sort,
          requestKey: cacheKey,
        });

      return {
        items: records.items,
        totalItems: records.totalItems,
        totalPages: records.totalPages,
        page: records.page,
      };
    } catch (error) {
      console.error("Error fetching companies:", error);
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
    companies: data?.items ?? [],
    totalItems: data?.totalItems ?? 0,
    totalPages: data?.totalPages ?? 0,
    currentPage: data?.page ?? page,
    isLoading: !error && !data,
    isError: error,
    mutate: reloadCompanies,
  };
}
