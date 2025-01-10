import { useInvoices } from "@/lib/hooks/useInvoices";
import { PieChart, Pie, Cell, ResponsiveContainer, Sector } from "recharts";
import { useState, useCallback } from "react";
import { formatCurrency } from "@/lib/utils";
import cn from "classnames";

const COLORS = {
  primary: {
    main: "#6366f1", // Primary blue-600
    light: "#818cf8",
    bg: "#eef2ff",
  },
  secondary: {
    main: "#4b5563", // Gray-600
    light: "#6b7280",
    bg: "#f9fafb",
  },
  success: {
    main: "#10b981", // Emerald-500
    light: "#34d399",
    bg: "#ecfdf5",
  },
  warning: {
    main: "#f59e0b", // Amber-500
    light: "#fbbf24",
    bg: "#fffbeb",
  },
  info: {
    main: "#3b82f6", // Blue-500
    light: "#60a5fa",
    bg: "#eff6ff",
  },
};

const COLOR_PAIRS = Object.values(COLORS);

const RADIAN = Math.PI / 180;
const renderActiveShape = (props: any) => {
  const {
    cx,
    cy,
    innerRadius,
    outerRadius,
    startAngle,
    endAngle,
    fill,
    payload,
    percent,
    value,
  } = props;

  return (
    <g>
      {/* Center circle */}
      <circle cx={cx} cy={cy} r={innerRadius} fill="#fff" />
      <circle
        cx={cx}
        cy={cy}
        r={innerRadius - 2}
        fill={`url(#${fill.substring(1)}Gradient)`}
        opacity={0.06}
      />

      {/* Center text */}
      <text
        x={cx}
        y={cy - 20}
        textAnchor="middle"
        fill="#374151"
        className="text-xs font-semibold"
      >
        {payload.name}
      </text>
      <text
        x={cx}
        y={cy + 4}
        textAnchor="middle"
        fill="#111827"
        className="text-xs font-bold"
      >
        {formatCurrency(value)}
      </text>
      <text
        x={cx}
        y={cy + 24}
        textAnchor="middle"
        fill="#6b7280"
        className="text-xs font-medium"
      >
        {`${(percent * 100).toFixed(1)}%`}
      </text>

      {/* Active sector */}
      <Sector
        cx={cx}
        cy={cy}
        innerRadius={innerRadius}
        outerRadius={outerRadius}
        startAngle={startAngle}
        endAngle={endAngle}
        fill={fill}
        className="transition-all duration-300"
      />
      <Sector
        cx={cx}
        cy={cy}
        startAngle={startAngle}
        endAngle={endAngle}
        innerRadius={outerRadius + 4}
        outerRadius={outerRadius + 8}
        fill={fill}
        className="transition-all duration-300 opacity-50"
      />
    </g>
  );
};

export function CategorySections() {
  const [activeIndex, setActiveIndex] = useState(0);
  const { invoices } = useInvoices({
    status: "paid",
  });

  // Process data for the chart
  const categoryData = invoices.reduce(
    (acc, invoice) => {
      const categoryName = invoice.expand?.categoryId?.name || "Uncategorized";
      acc.categories[categoryName] =
        (acc.categories[categoryName] || 0) + invoice.total;
      acc.total += invoice.total;
      return acc;
    },
    { categories: {} as Record<string, number>, total: 0 }
  );

  const chartData = Object.entries(categoryData.categories)
    .map(([name, value]) => ({
      name,
      value,
      percentage: (value / categoryData.total) * 100,
    }))
    .sort((a, b) => b.value - a.value);

  const onPieEnter = useCallback(
    (_: any, index: number) => {
      setActiveIndex(index);
    },
    [setActiveIndex]
  );

  if (invoices.length === 0) {
    return (
      <div className="w-full bg-white border-x border-y border-gray-100 overflow-hidden">
        <div className="p-6 border-b border-gray-100">
          <div className="flex items-center justify-between">
            <div className="space-y-2 w-full">
              <div className="flex w-full items-center gap-2">
                <h2 className="text-xs font-semibold tracking-tight text-gray-900">
                  Expenses by Category
                </h2>
                <div className="h-4 w-px bg-gray-200" />
                <span className="text-xs text-gray-500 font-medium">
                  No Categories
                </span>
              </div>
            </div>
          </div>
        </div>
        <div className="flex flex-col items-center justify-center p-6 min-h-[350px] text-center gap-2">
          <svg className="w-12 h-12 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
          <span className="text-xs font-medium text-gray-900">No expense data available</span>
          <span className="text-xs text-gray-500">Add some invoices to see your spending categories</span>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full bg-white border-x border-y border-gray-100 overflow-hidden">
      <div className="p-6 border-b border-gray-100">
        <div className="flex items-center justify-between">
          <div className="space-y-2 w-full">
            <div className="flex w-full items-center gap-2">
              <h2 className="text-xs font-semibold tracking-tight text-gray-900">
                Expenses by Category
              </h2>
              <div className="h-4 w-px bg-gray-200" />
              <span className="text-xs text-gray-500 font-medium">
                {chartData.length} Categories
              </span>

              <span className="text-xs  ml-auto text-gray-900 font-semibold">
                Total: {formatCurrency(categoryData.total)}
              </span>
            </div>
          </div>
        </div>
      </div>
      <div className="relative">
        <div className="flex h-full items-start">
          <div className="w-full p-6">
            <ResponsiveContainer width="100%" height={350}>
              <PieChart>
                <defs>
                  {Object.entries(COLORS).map(([key, value]) => (
                    <linearGradient
                      key={key}
                      id={`${value.main.substring(1)}Gradient`}
                      x1="0"
                      y1="0"
                      x2="1"
                      y2="1"
                    >
                      <stop
                        offset="0%"
                        stopColor={value.main}
                        stopOpacity={1}
                      />
                      <stop
                        offset="100%"
                        stopColor={value.light}
                        stopOpacity={0.9}
                      />
                    </linearGradient>
                  ))}
                </defs>
                <Pie
                  activeIndex={activeIndex}
                  activeShape={renderActiveShape}
                  data={chartData}
                  cx="50%"
                  cy="50%"
                  innerRadius="62%"
                  outerRadius="73%"
                  paddingAngle={4}
                  dataKey="value"
                  onMouseEnter={onPieEnter}
                  className="transition-all duration-300"
                >
                  {chartData?.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLOR_PAIRS[index % COLOR_PAIRS.length].main}
                      className="transition-all focus-within:outline-none outline-none duration-500 hover:opacity-90 hover:cursor-pointer"
                    />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
      <div className="border-t border-gray-100">
        <div className="relative">
          <div className="overflow-x-auto scrollbar-thin scrollbar-thumb-gray-200 scrollbar-track-transparent">
            <div className="flex gap-3 p-2 min-w-full">
              {chartData.map((entry, index) => (
                <div
                  key={entry.name}
                  onClick={() => setActiveIndex(index)}
                  className={cn(
                    "flex items-start gap-3 px-2 py-1 text-xs cursor-pointer transition-all duration-200",
                    "border border-gray-100 outline-none shadow-sm backdrop-blur-sm",
                    activeIndex === index
                      ? "bg-gray-50/90 border-gray-200 shadow-inner"
                      : "hover:bg-gray-50/60 hover:border-gray-200 hover:shadow"
                  )}
                  role="button"
                  tabIndex={0}
                  aria-pressed={activeIndex === index}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      setActiveIndex(index);
                    }
                  }}
                >
                  <div className="flex flex-col gap-2 min-w-0 flex-1">
                    <div className="flex w-full items-center gap-3">
                      <div
                        className={cn(
                          "w-2.5 h-2.5 shrink-0 transition-all duration-300",
                          activeIndex === index && "scale-110"
                        )}
                        style={{
                          backgroundColor:
                            COLOR_PAIRS[index % COLOR_PAIRS.length].main,
                        }}
                      />
                      <span className="text-xs text-gray-700 truncate font-medium">
                        {entry.name}
                      </span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-xs font-semibold text-gray-900">
                        {formatCurrency(entry.value)}
                      </span>
                      <span className="text-xs text-gray-500">
                        ({entry.percentage.toFixed(1)}%)
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
