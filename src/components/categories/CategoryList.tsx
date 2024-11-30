import React, { useState } from "react";
import { useCategories } from "@/lib/hooks/useCategories";
import { Category } from "@/types";
import {
  PlusIcon,
  PencilIcon,
  TrashIcon,
  TagIcon,
} from "@heroicons/react/24/outline";
import { CategoryForm } from "./CategoryForm";
import { Modal } from "../ui/Modal";
import { LoadingSpinner } from "../ui/LoadingSpinner";
import { motion, AnimatePresence } from "framer-motion";
import { PageHeader } from "../ui/PageHeader";
import { SearchInput } from "../ui/SearchInput";
import { DataTable } from "../ui/DataTable";
import { ActionButton } from "../ui/ActionButton";

export function CategoryList() {
  const { categories, deleteCategory } = useCategories();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(
    null
  );
  const [isModalOpen, setIsModalOpen] = useState(false);

  if (!categories) {
    return <LoadingSpinner />;
  }

  const filteredCategories = categories.filter(
    (category) =>
      searchTerm === "" ||
      category.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      category.description?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDelete = async (category: Category) => {
    if (window.confirm("Are you sure you want to delete this category?")) {
      await deleteCategory(category.id);
    }
  };

  const columns = [
    {
      key: "name",
      title: "Category",
      render: (_, category: Category) => (
        <div className="flex items-center">
          <div className="flex-shrink-0">
            <div
              className={`w-10 h-10 rounded-lg flex items-center justify-center bg-gradient-to-br from-indigo-500 to-purple-600`}
            >
              <TagIcon className="h-5 w-5 text-white" />
            </div>
          </div>
          <div className="ml-4">
            <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
              {category.name}
            </div>
            {category.description && (
              <div className="text-sm text-gray-500 dark:text-gray-400">
                {category.description}
              </div>
            )}
          </div>
        </div>
      ),
    },
    {
      key: "type",
      title: "Type",
      render: (type: string) => (
        <span className="capitalize">{type.toLowerCase()}</span>
      ),
    },
    {
      key: "vatRate",
      title: "VAT Rate",
      render: (vatRate: number) => `${vatRate}%`,
    },
  ];

  const renderActions = (category: Category) => (
    <div className="flex items-center justify-end gap-2">
      <ActionButton
        variant="secondary"
        size="sm"
        icon={<PencilIcon className="h-4 w-4" />}
        onClick={() => {
          setSelectedCategory(category);
          setIsModalOpen(true);
        }}
        className="!p-1.5 !shadow-none border-0 !bg-gray-100 hover:!bg-gray-200 dark:!bg-gray-800 dark:hover:!bg-gray-700"
      />
      <ActionButton
        variant="danger"
        size="sm"
        icon={<TrashIcon className="h-4 w-4" />}
        onClick={() => handleDelete(category)}
        className="!p-1.5 !shadow-none border-0 !bg-red-100 hover:!bg-red-200 dark:!bg-red-900/30 dark:hover:!bg-red-800/40"
      />
    </div>
  );

  return (
    <div className="px-4 sm:px-6 lg:px-8">
      <PageHeader
        title="Categories"
        description="Manage your expense and income categories"
      >
        <ActionButton
          icon={<PlusIcon className="h-5 w-5" />}
          onClick={() => {
            setSelectedCategory(null);
            setIsModalOpen(true);
          }}
        >
          Add Category
        </ActionButton>
      </PageHeader>

      <div className="mb-4">
        <SearchInput
          value={searchTerm}
          onChange={setSearchTerm}
          placeholder="Search categories..."
          className="max-w-lg"
        />
      </div>

      <div className="mt-4 flex flex-col">
        <div className=" ">
          <div className="inline-block min-w-full py-2 align-middle">
            <DataTable
              columns={columns}
              data={filteredCategories}
              keyField="id"
              actions={renderActions}
            />
          </div>
        </div>
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedCategory(null);
        }}
        title={selectedCategory ? "Edit Category" : "New Category"}
      >
        <CategoryForm
          category={selectedCategory}
          onClose={() => {
            setIsModalOpen(false);
            setSelectedCategory(null);
          }}
        />
      </Modal>
    </div>
  );
}
