import useSWR from "swr";
import { useSearchParams } from "react-router-dom";
import { pb } from "../pocketbase";
import { Category } from "@/types/category";

export function useCategories() {
  const [searchParams] = useSearchParams();

  const page = Number(searchParams.get("page")) || 1;
  const perPage = Number(searchParams.get("perPage")) || 5;
  const sort = searchParams.get("sort") || "-created";
  const filter = searchParams.get("filter") || "";

  const cacheKey = `/api/categories?page=${page}&perPage=${perPage}&sort=${sort}&filter=${filter}`;

  const fetcher = async () => {
    try {
      const records = await pb
        .collection("categories")
        .getList<Category>(page, perPage, {
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
      console.error("Error fetching categories:", error);
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
    categories: data?.items ?? [],
    totalItems: data?.totalItems ?? 0,
    totalPages: data?.totalPages ?? 0,
    currentPage: data?.page ?? page,
    isLoading: !error && !data,
    isError: error,
    mutate: reloadCompanies,
  };
}
