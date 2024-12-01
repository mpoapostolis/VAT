import React from "react";
import { motion, AnimatePresence, useAnimation } from "framer-motion";
import { useInvoices } from "@/lib/hooks/useInvoices";
import { useCategories } from "@/lib/hooks/useCategories";
import { calculateCategoryTotals } from "@/lib/utils/category-utils";
import { formatCurrency } from "@/lib/utils";
import { ArrowUpIcon, ArrowDownIcon, MinusIcon } from "@heroicons/react/24/solid";
import { useInView } from 'react-intersection-observer';
import { useEffect } from 'react';

interface Category {
  name: string;
  value: number;
  percentage: number;
  trend: "up" | "down" | "neutral";
}

interface Props {
  data: Category[];
}

export function CategorySummary() {
  const { invoices } = useInvoices();
  const { categories } = useCategories();

  const categoryTotals = calculateCategoryTotals(invoices, categories);
  const data = categoryTotals.map((total) => ({
    name: categories.find((c) => c.id === total.categoryId)?.name || "Unknown",
    value: total.total,
    percentage:
      (total.total /
        categoryTotals.reduce((acc, curr) => acc + curr.total, 0)) *
      100,
    trend: total.total > 0 ? "up" : total.total < 0 ? "down" : "neutral",
  }));

  const controls = useAnimation();
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  useEffect(() => {
    if (inView) {
      controls.start('visible');
    }
  }, [controls, inView]);

  const containerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: {
      opacity: 0,
      y: 20,
      scale: 0.95,
    },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        type: 'spring',
        stiffness: 100,
        damping: 12,
      },
    },
  };

  const progressVariants = {
    hidden: { scaleX: 0, originX: 0 },
    visible: {
      scaleX: 1,
      transition: {
        duration: 1,
        ease: [0.6, 0.05, -0.01, 0.9],
      },
    },
  };

  const numberVariants = {
    hidden: { opacity: 0, scale: 0.5 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        type: 'spring',
        stiffness: 200,
        damping: 20,
      },
    },
  };

  const trendVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: 'spring',
        stiffness: 300,
        damping: 20,
      },
    },
  };

  const hoverVariants = {
    hover: {
      scale: 1.02,
      boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
      transition: {
        type: 'spring',
        stiffness: 400,
        damping: 20,
      },
    },
  };

  const getGradient = (index: number) => {
    const gradients = [
      "from-violet-500 to-violet-600",
      "from-blue-500 to-blue-600",
      "from-indigo-500 to-indigo-600",
      "from-purple-500 to-purple-600",
      "from-pink-500 to-pink-600",
    ];
    return gradients[index % gradients.length];
  };

  const getTrendIcon = (trend: "up" | "down" | "neutral") => {
    switch (trend) {
      case "up":
        return <ArrowUpIcon className="h-4 w-4 text-emerald-500" />;
      case "down":
        return <ArrowDownIcon className="h-4 w-4 text-red-500" />;
      default:
        return <MinusIcon className="h-4 w-4 text-gray-400" />;
    }
  };

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={controls}
      variants={containerVariants}
      className="space-y-6"
    >
      <motion.h2
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{
          type: 'spring',
          stiffness: 200,
          damping: 20,
        }}
        className="text-2xl font-bold bg-gradient-to-r from-violet-600 to-violet-800 bg-clip-text text-transparent"
      >
        Category Summary
      </motion.h2>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <AnimatePresence>
          {data.map((category, index) => (
            <motion.div
              key={category.name}
              variants={itemVariants}
              whileHover="hover"
              variants={hoverVariants}
              className="relative overflow-hidden bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 transition-all duration-200"
            >
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r"
                style={{ backgroundImage: `linear-gradient(to right, ${getGradient(index)}50, ${getGradient(index)})` }}
              />
              
              <div className="flex items-center justify-between mb-4">
                <motion.h3
                  className="text-lg font-semibold text-gray-900 dark:text-white"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: index * 0.1 }}
                >
                  {category.name}
                </motion.h3>
                <motion.div
                  variants={trendVariants}
                  className={`flex items-center space-x-1 ${
                    category.trend === "up" ? 'text-emerald-500' : category.trend === "down" ? 'text-red-500' : 'text-gray-400'
                  }`}
                >
                  {getTrendIcon(category.trend)}
                  <span className="text-sm font-medium">
                    {category.trend === "up" ? "+" : category.trend === "down" ? "-" : ""}
                    {Math.abs(category.percentage)}%
                  </span>
                </motion.div>
              </div>

              <div className="relative pt-2">
                <div className="flex justify-between mb-2">
                  <motion.span
                    variants={numberVariants}
                    className="text-2xl font-bold text-gray-900 dark:text-white"
                  >
                    {formatCurrency(category.value)}
                  </motion.span>
                  <motion.span
                    variants={numberVariants}
                    className="text-sm font-medium text-gray-500 dark:text-gray-400 self-end"
                  >
                    {category.percentage}%
                  </motion.span>
                </div>

                <div className="relative h-2 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
                  <motion.div
                    variants={progressVariants}
                    className="absolute top-0 left-0 h-full rounded-full"
                    style={{
                      width: `${category.percentage}%`,
                      backgroundColor: getGradient(index),
                    }}
                  />
                </div>
              </div>

              <motion.div
                className="absolute bottom-0 right-0 w-32 h-32 opacity-5"
                style={{
                  backgroundColor: getGradient(index),
                  borderRadius: '100% 0 0 0',
                }}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{
                  type: 'spring',
                  stiffness: 100,
                  damping: 20,
                  delay: index * 0.1,
                }}
              />
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
