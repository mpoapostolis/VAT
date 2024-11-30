import React, { useState } from "react";
import { useJotaiStore } from "@/lib/hooks/useJotaiStore";
import { FunnelIcon, PlusIcon } from "@heroicons/react/24/outline";
import { CategoryForm } from "./CategoryForm";
import { LoadingSpinner } from "../ui/LoadingSpinner";
import { motion, AnimatePresence } from "framer-motion";
import { Modal } from "../ui/Modal";
import { Dropdown } from "../ui/Dropdown";
import { toast } from "react-hot-toast";
import { useCategories } from "@/lib/hooks/useCategories";
import {
  PencilIcon,
  TrashIcon,
  CurrencyDollarIcon,
} from "@heroicons/react/24/outline";

const TYPE_OPTIONS = [
  { value: "", label: "All Types" },
  { value: "REVENUE", label: "Revenue" },
  { value: "EXPENSE", label: "Expense" },
];

const LOGISTICS_TYPES = [
  { value: "", label: "All Types", emoji: "🔍" },
  { value: "TRANSPORTATION", label: "Transportation", emoji: "🚛" },
  { value: "WAREHOUSING", label: "Warehousing", emoji: "🏭" },
  { value: "FREIGHT", label: "Freight", emoji: "🚢" },
  { value: "CUSTOMS", label: "Customs", emoji: "📋" },
  { value: "PACKAGING", label: "Packaging", emoji: "📦" },
  { value: "HANDLING", label: "Handling", emoji: "🔧" },
  { value: "DISTRIBUTION", label: "Distribution", emoji: "🚚" },
  { value: "OTHER", label: "Other", emoji: "📝" },
];

export function CategoryList() {
  const { categories, addCategory, updateCategory, deleteCategory } =
    useCategories();
  const [showModal, setShowModal] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState("");
  const [logisticsTypeFilter, setLogisticsTypeFilter] = useState("");

  if (!categories) {
    return <LoadingSpinner />;
  }

  const filteredCategories = categories.filter((category) => {
    const matchesSearch =
      !searchTerm ||
      category.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      category.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      category.metadata?.tags?.some((tag) =>
        tag.toLowerCase().includes(searchTerm.toLowerCase())
      );
    const matchesType = !typeFilter || category.type === typeFilter;
    const matchesLogistics =
      !logisticsTypeFilter || category.logisticsType === logisticsTypeFilter;
    return matchesSearch && matchesType && matchesLogistics;
  });

  const handleSubmit = async (data) => {
    try {
      if (selectedCategory) {
        await updateCategory(selectedCategory.id, data);
        toast.success("Category updated successfully");
      } else {
        await addCategory(data);
        toast.success("Category created successfully");
      }
      handleCloseModal();
    } catch (error) {
      console.error("Error saving category:", error);
      toast.error("Failed to save category");
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedCategory(null);
  };

  const handleEdit = (category) => {
    setSelectedCategory(category);
    setShowModal(true);
  };

  const handleDelete = async (categoryId) => {
    if (window.confirm("Are you sure you want to delete this category?")) {
      try {
        await deleteCategory(categoryId);
        toast.success("Category deleted successfully");
      } catch (error) {
        console.error("Error deleting category:", error);
        toast.error("Failed to delete category");
      }
    }
  };

  const getLogisticsEmoji = (type) => {
    const logisticsType = LOGISTICS_TYPES.find((lt) => lt.value === type);
    return logisticsType?.emoji || "📝";
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6"
    >
      <div className="flex justify-between items-center">
        <motion.h1
          initial={{ x: -20 }}
          animate={{ x: 0 }}
          className="text-2xl font-semibold text-gray-900 dark:text-white"
        >
          Categories
        </motion.h1>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => setShowModal(true)}
          className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg shadow-sm hover:from-indigo-700 hover:to-purple-700 transition-all duration-200"
        >
          <PlusIcon className="h-5 w-5 mr-2" />
          New Category
        </motion.button>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="grid gap-4"
        >
          <div className="flex gap-4 items-center">
            <div className="max-w-lg mr-auto flex-1">
              <input
                type="text"
                placeholder="Search categories..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="block px-4 py-2 w-full rounded-md border-gray-300 dark:border-gray-700 dark:bg-gray-800 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              />
            </div>
            <Dropdown
              options={TYPE_OPTIONS}
              value={typeFilter}
              onChange={setTypeFilter}
              placeholder="Filter by type"
              className="w-48 ml-auto h-8 border-none"
            />
            <Dropdown
              options={LOGISTICS_TYPES}
              value={logisticsTypeFilter}
              onChange={setLogisticsTypeFilter}
              placeholder="Filter by logistics"
              className="w-48 h-8 border-none"
            />
          </div>

          <div className="bg-white dark:bg-gray-800 shadow-sm rounded-lg overflow-hidden">
            <div className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <div className="bg-gray-50 dark:bg-gray-900">
                <div className="grid grid-cols-5 gap-4 px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  <div className="col-span-2">Name</div>
                  <div>Type</div>
                  <div>Total</div>
                  <div className="text-right">Actions</div>
                </div>
              </div>
              <div className="divide-y divide-gray-200 dark:divide-gray-700">
                {filteredCategories.map((category) => {
                  const emoji = getLogisticsEmoji(category.logisticsType);
                  return (
                    <motion.div
                      key={category.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="grid grid-cols-5 gap-4 px-6 py-4 hover:bg-gray-50 dark:hover:bg-gray-700/50"
                    >
                      <div className="col-span-2 flex items-center">
                        <div className="flex-shrink-0 text-2xl">{emoji}</div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
                            {category.name}
                          </div>
                          {category.description && (
                            <div className="text-sm text-gray-500 dark:text-gray-400">
                              {category.description}
                            </div>
                          )}
                          {category.metadata?.tags && (
                            <div className="mt-1 flex flex-wrap gap-1">
                              {category.metadata.tags.map((tag) => (
                                <span
                                  key={tag}
                                  className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200"
                                >
                                  {tag}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
                            ${
                              category.type === "REVENUE"
                                ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
                                : "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400"
                            }`}
                        >
                          {category.type === "REVENUE" ? "Revenue" : "Expense"}
                        </span>
                      </div>
                      <div className="flex items-center text-sm text-gray-900 dark:text-gray-100">
                        <CurrencyDollarIcon className="h-4 w-4 text-gray-400 mr-1" />
                        {category.total || "0.00"}
                      </div>
                      <div className="flex items-center justify-end space-x-3">
                        <button
                          onClick={() => handleEdit(category)}
                          className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-900 dark:hover:text-indigo-300"
                        >
                          <PencilIcon className="h-5 w-5" />
                        </button>
                        <button
                          onClick={() => handleDelete(category.id)}
                          className="text-red-600 dark:text-red-400 hover:text-red-900 dark:hover:text-red-300"
                        >
                          <TrashIcon className="h-5 w-5" />
                        </button>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>

      <Modal
        maxWidth="4xl"
        isOpen={showModal}
        title={selectedCategory ? "Edit Category" : "New Category"}
        onClose={handleCloseModal}
      >
        <CategoryForm
          initialData={selectedCategory}
          onSubmit={handleSubmit}
          onCancel={handleCloseModal}
        />
      </Modal>
    </motion.div>
  );
}
