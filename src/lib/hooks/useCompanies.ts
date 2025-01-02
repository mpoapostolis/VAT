import useSWR from "swr";
import { pb } from "../pocketbase";
import { Company } from "@/types/company";

export function useCompanies(filter = "") {
  const fetcher = async () => {
    try {
      const records = await pb.collection("companies").getList<Company>(1, 50, {
        filter: filter,
        sort: "+companyNameEN", // Changed to use '+' for ascending order
      });
      return records.items;
    } catch (error) {
      console.error("Error fetching companies:", error);
      throw error;
    }
  };

  const { data, error, mutate } = useSWR("/api/companies", fetcher, {
    onErrorRetry: (error, key, config, revalidate, { retryCount }) => {
      // Only retry up to 3 times.
      if (retryCount >= 3) return;
      // Retry after 5 seconds.
      setTimeout(() => revalidate({ retryCount }), 5000);
    },
  });

  return {
    companies: data,
    isLoading: !error && !data,
    isError: error,
    mutate,
  };
}
