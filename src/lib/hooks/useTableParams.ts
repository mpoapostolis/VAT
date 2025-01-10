import { useSearchParams } from "react-router-dom";

export interface TableParams {
  page: number;
  perPage: number;
  sort?: string;
  search?: string;
  startDate?: string;
  endDate?: string;
}

export function useTableParams(defaultPerPage = 5) {
  const [searchParams, setSearchParams] = useSearchParams();

  const page = parseInt(searchParams.get("page") || "1", 10);
  const perPage = parseInt(
    searchParams.get("perPage") || String(defaultPerPage),
    10
  );
  const sort = searchParams.get("sort") || "";
  const search = searchParams.get("search") || "";
  const startDate = searchParams.get("startDate") || "";
  const endDate = searchParams.get("endDate") || "";

  const setPage = (newPage: number) => {
    searchParams.set("page", String(newPage));
    setSearchParams(searchParams);
  };

  const setPerPage = (newPerPage: number) => {
    searchParams.set("perPage", String(newPerPage));
    searchParams.set("page", "1"); // Reset to first page when changing page size
    setSearchParams(searchParams);
  };

  const setSort = (newSort: string) => {
    if (newSort) {
      searchParams.set("sort", newSort);
    } else {
      searchParams.delete("sort");
    }
    setSearchParams(searchParams);
  };

  const setSearch = (newSearch: string) => {
    if (newSearch) {
      searchParams.set("search", newSearch);
    } else {
      searchParams.delete("search");
    }
    searchParams.set("page", "1"); // Reset to first page when searching
    setSearchParams(searchParams);
  };

  const setDateRange = (start?: string, end?: string) => {
    if (start) {
      searchParams.set("startDate", start);
    } else {
      searchParams.delete("startDate");
    }
    if (end) {
      searchParams.set("endDate", end);
    } else {
      searchParams.delete("endDate");
    }
    searchParams.set("page", "1"); // Reset to first page when changing dates
    setSearchParams(searchParams);
  };

  return {
    page,
    perPage,
    sort,
    search,
    startDate,
    endDate,
    setPage,
    setPerPage,
    setSort,
    setSearch,
    setDateRange,
  };
}

export function buildPocketBaseParams(params: TableParams) {
  const { page, perPage, sort, search, startDate, endDate } = params;

  return {
    page,
    perPage,
    sort: sort || undefined,
    filter: search ? `title ~ "${search}"` : undefined,
    ...(startDate && { startDate }),
    ...(endDate && { endDate }),
  };
}
