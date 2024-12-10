import { useSearchParams } from 'react-router-dom';

export interface TableParams {
  page: number;
  perPage: number;
  sort?: string;
}

export function useTableParams(defaultPerPage = 10) {
  const [searchParams, setSearchParams] = useSearchParams();

  const page = parseInt(searchParams.get('page') || '1', 10);
  const perPage = parseInt(searchParams.get('perPage') || String(defaultPerPage), 10);
  const sort = searchParams.get('sort') || '';

  const setPage = (newPage: number) => {
    searchParams.set('page', String(newPage));
    setSearchParams(searchParams);
  };

  const setPerPage = (newPerPage: number) => {
    searchParams.set('perPage', String(newPerPage));
    searchParams.set('page', '1'); // Reset to first page when changing page size
    setSearchParams(searchParams);
  };

  const setSort = (newSort: string) => {
    if (newSort) {
      searchParams.set('sort', newSort);
    } else {
      searchParams.delete('sort');
    }
    setSearchParams(searchParams);
  };

  return {
    page,
    perPage,
    sort,
    setPage,
    setPerPage,
    setSort,
  };
}

export function buildPocketBaseParams(params: TableParams) {
  const { page, perPage, sort } = params;

  return {
    page,
    perPage,
    sort: sort || undefined,
  };
}