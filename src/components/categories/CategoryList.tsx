import React, { useState } from "react";
import { motion, AnimatePresence, useAnimation } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { useCategories } from "@/lib/hooks/useCategories";
import { LoadingSpinner } from "../ui/LoadingSpinner";
import {
  PlusIcon,
  PencilIcon,
  TrashIcon,
  ChartBarIcon,
  ArrowTrendingUpIcon,
  BanknotesIcon,
} from "@heroicons/react/24/outline";
import { CategoryForm } from "./CategoryForm";
import { Modal } from "../ui/Modal";
import { PageHeader } from "../ui/PageHeader";
import { SearchInput } from "../ui/SearchInput";
import { DataTable } from "../ui/DataTable";
import { ActionButton } from "../ui/ActionButton";
import { Dropdown } from "../ui/Dropdown";
import {
  ArrowsUpDownIcon,
  ClockIcon,
  CurrencyEuroIcon,
  TagIcon,
} from "@heroicons/react/24/outline";

export function CategoryList() {
  const { categories, isLoading, deleteCategory } = useCategories();
  const [showForm, setShowForm] = useState(false);
  const [editingCategory, setEditingCategory] = useState<any>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortType, setSortType] = useState("");
  const controls = useAnimation();
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: {
      opacity: 0,
      y: 20,
      scale: 0.95,
      rotateX: -10,
    },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      rotateX: 0,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 15,
      },
    },
  };

  const iconVariants = {
    hidden: { scale: 0, rotate: -180 },
    visible: {
      scale: 1,
      rotate: 0,
      transition: {
        type: "spring",
        stiffness: 200,
        damping: 20,
      },
    },
  };

  const progressVariants = {
    hidden: { scaleX: 0, originX: 0 },
    visible: {
      scaleX: 1,
      transition: {
        duration: 0.8,
        ease: [0.6, 0.05, -0.01, 0.9],
      },
    },
  };

  const getCategoryIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case "income":
        return <ArrowTrendingUpIcon className="w-6 h-6 text-emerald-500" />;
      case "expense":
        return <BanknotesIcon className="w-6 h-6 text-red-500" />;
      default:
        return <TagIcon className="w-6 h-6 text-violet-500" />;
    }
  };

  const columns = [
    {
      key: "name",
      title: "Category",
      render: (_, category: any) => (
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

  const renderActions = (category: any) => (
    <div className="flex items-center justify-end gap-2">
      <ActionButton
        variant="secondary"
        size="sm"
        icon={<PencilIcon className="h-4 w-4" />}
        onClick={() => {
          setEditingCategory(category);
          setShowForm(true);
        }}
        className="!p-1.5 !shadow-none border-0 !bg-gray-100 hover:!bg-gray-200 dark:!bg-gray-800 dark:hover:!bg-gray-700"
      />
      <ActionButton
        variant="danger"
        size="sm"
        icon={<TrashIcon className="h-4 w-4" />}
        onClick={() => deleteCategory(category.id)}
        className="!p-1.5 !shadow-none border-0 !bg-red-100 hover:!bg-red-200 dark:!bg-red-900/30 dark:hover:!bg-red-800/40"
      />
    </div>
  );

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  const filteredCategories = categories.filter(
    (category) =>
      searchTerm === "" ||
      category.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      category.description?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <PageHeader
        title="Categories"
        description="Manage your expense and income categories"
      >
        <ActionButton
          icon={<PlusIcon className="h-5 w-5" />}
          onClick={() => {
            setEditingCategory(null);
            setShowForm(true);
          }}
        >
          Add Category
        </ActionButton>
      </PageHeader>

      <div className="mb-4 flex items-center gap-4">
        <SearchInput
          value={searchTerm}
          onChange={setSearchTerm}
          placeholder="Search categories..."
          className="max-w-lg"
        />
        <div className="flex ml-auto items-center gap-2">
          <Dropdown
            value={sortType}
            onChange={setSortType}
            placeholder="Sort By"
            options={[
              {
                value: "",
                label: "Sort By",
                icon: <ArrowsUpDownIcon className="w-4 h-4 text-gray-400" />,
              },
              {
                value: "name",
                label: "Name",
                icon: <TagIcon className="w-4 h-4" />,
              },
              {
                value: "recent",
                label: "Recently Added",
                icon: <ClockIcon className="w-4 h-4" />,
              },
              {
                value: "amount",
                label: "Amount",
                icon: <CurrencyEuroIcon className="w-4 h-4" />,
              },
            ]}
          />
        </div>
      </div>

      <motion.div
        ref={ref}
        variants={containerVariants}
        initial="hidden"
        animate={inView ? "visible" : "hidden"}
        className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
      >
        <AnimatePresence mode="wait">
          {filteredCategories?.map((category, index) => (
            <motion.div
              key={category.id}
              variants={itemVariants}
              layout
              whileHover={{
                scale: 1.02,
                rotateX: 5,
                transition: {
                  type: "spring",
                  stiffness: 400,
                  damping: 10,
                },
              }}
              className="relative group bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden hover:shadow-lg transition-all duration-300"
            >
              <div
                className="absolute inset-0 bg-gradient-to-br opacity-5"
                style={{
                  backgroundImage: `linear-gradient(to bottom right, ${category.color}, ${category.color}88)`,
                }}
              />

              <div className="relative p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <motion.div
                      variants={iconVariants}
                      className="flex-shrink-0"
                    >
                      {getCategoryIcon(category.type)}
                    </motion.div>

                    <motion.h3
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: index * 0.1 }}
                      className="text-lg font-semibold text-gray-900 dark:text-white"
                    >
                      {category.name}
                    </motion.h3>
                  </div>

                  <div className="flex items-center space-x-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                    <motion.button
                      whileHover={{ scale: 1.1, rotate: 15 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => setEditingCategory(category)}
                      className="p-1 rounded-full text-gray-400 hover:text-violet-600 dark:hover:text-violet-400"
                    >
                      <PencilIcon className="h-5 w-5" />
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.1, rotate: -15 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => deleteCategory(category.id)}
                      className="p-1 rounded-full text-gray-400 hover:text-red-600 dark:hover:text-red-400"
                    >
                      <TrashIcon className="h-5 w-5" />
                    </motion.button>
                  </div>
                </div>

                <motion.p
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 + 0.2 }}
                  className="text-sm text-gray-500 dark:text-gray-400"
                >
                  {category.description || "No description provided"}
                </motion.p>

                <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-700">
                  <div className="flex items-center justify-between text-sm">
                    <motion.div
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 + 0.3 }}
                      className="text-gray-500 dark:text-gray-400"
                    >
                      Usage
                    </motion.div>
                    <motion.div
                      initial={{ opacity: 0, x: 10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 + 0.3 }}
                      className="font-medium text-gray-900 dark:text-white"
                    >
                      {Math.floor(Math.random() * 100)}%
                    </motion.div>
                  </div>

                  <div className="mt-2 relative h-2 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
                    <motion.div
                      variants={progressVariants}
                      className="absolute top-0 left-0 h-full rounded-full"
                      style={{
                        width: `${Math.floor(Math.random() * 100)}%`,
                        backgroundColor: category.color,
                      }}
                    />
                  </div>
                </div>

                <motion.div
                  className="absolute bottom-0 right-0 w-32 h-32 opacity-5"
                  style={{
                    backgroundColor: category.color,
                    borderRadius: "100% 0 0 0",
                  }}
                  initial={{ scale: 0, rotate: 45 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{
                    type: "spring",
                    stiffness: 100,
                    damping: 20,
                    delay: index * 0.1,
                  }}
                />
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>

      {showForm && (
        <Modal
          isOpen={showForm}
          onClose={() => {
            setShowForm(false);
            setEditingCategory(null);
          }}
          title={editingCategory ? "Edit Category" : "New Category"}
        >
          <CategoryForm
            category={editingCategory}
            onClose={() => {
              setShowForm(false);
              setEditingCategory(null);
            }}
          />
        </Modal>
      )}
    </div>
  );
}
