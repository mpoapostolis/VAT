import { Invoice, AccountingCategory, CategoryTotal } from '@/types';

export const calculateCategoryTotals = (
  invoices: Invoice[],
  categories: AccountingCategory[]
): CategoryTotal[] => {
  const totals: Record<string, CategoryTotal> = {};

  // Initialize totals for all categories
  categories.forEach((category) => {
    totals[category.id] = {
      categoryId: category.id,
      total: 0,
      count: 0
    };
  });

  // Calculate totals
  invoices.forEach((invoice) => {
    if (invoice.categoryId && totals[invoice.categoryId]) {
      totals[invoice.categoryId].total += invoice.totalIncVat;
      totals[invoice.categoryId].count += 1;
    }
  });

  return Object.values(totals).filter((total) => total.count > 0);
};

export const getCategoryHierarchy = (
  categories: AccountingCategory[],
  parentId?: string
): AccountingCategory[] => {
  return categories
    .filter((category) => category.parentId === parentId)
    .map((category) => ({
      ...category,
      children: getCategoryHierarchy(categories, category.id)
    }));
};

export const flattenCategoryHierarchy = (
  categories: AccountingCategory[],
  level = 0
): (AccountingCategory & { level: number })[] => {
  return categories.reduce((acc, category) => {
    const children = getCategoryHierarchy(categories, category.id);
    return [
      ...acc,
      { ...category, level },
      ...flattenCategoryHierarchy(children, level + 1)
    ];
  }, [] as (AccountingCategory & { level: number })[]);
};