import { useSearchParams } from 'react-router-dom';
import { useMemo } from 'react';

export interface TableParams {
  page: number;
  perPage: number;
  sort?: string;
  filter?: Record<string, string>;
}

export function useTableParams(defaultPerPage = 10): TableParams {
  const [searchParams] = useSearchParams();

  return useMemo(() => {
    const page = parseInt(searchParams.get('page') || '1', 10);
    const perPage = parseInt(searchParams.get('perPage') || String(defaultPerPage), 10);
    const sort = searchParams.get('sort') || undefined;
    
    // Parse filter parameters (filter[field]=value)
    const filter: Record<string, string> = {};
    for (const [key, value] of searchParams.entries()) {
      if (key.startsWith('filter[') && key.endsWith(']')) {
        const field = key.slice(7, -1); // Remove 'filter[' and ']'
        filter[field] = value;
      }
    }

    return {
      page,
      perPage,
      sort,
      filter: Object.keys(filter).length > 0 ? filter : undefined,
    };
  }, [searchParams, defaultPerPage]);
}

export function buildPocketBaseParams(params: TableParams) {
  const { page, perPage, sort, filter } = params;

  const pocketBaseParams: Record<string, any> = {
    page,
    perPage,
  };

  if (sort) {
    // Convert sort parameter (field:desc/asc) to PocketBase format (-field/field)
    const [field, direction] = sort.split(':');
    pocketBaseParams.sort = direction === 'desc' ? `-${field}` : field;
  }

  if (filter) {
    // Convert filter parameters to PocketBase filter format
    const filterRules: string[] = [];
    for (const [field, value] of Object.entries(filter)) {
      filterRules.push(`${field}~'${value}'`);
    }
    if (filterRules.length > 0) {
      pocketBaseParams.filter = filterRules.join('&&');
    }
  }

  return pocketBaseParams;
}