import React from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Plus } from "lucide-react";
import { Button } from "../button";
import { Card } from "../card";

interface ListPageProps {
  title: string;
  subtitle: string;
  createRoute?: string;
  createButtonLabel?: string;
  children: React.ReactNode;
}

export function ListPage({
  title,
  subtitle,
  createRoute,
  createButtonLabel = "Create New",
  children,
}: ListPageProps) {
  const navigate = useNavigate();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">{title}</h1>
          <p className="text-sm text-gray-500 mt-1">{subtitle}</p>
        </div>
        {createRoute && (
          <Button size="sm" onClick={() => navigate(createRoute)}>
            <Plus className="h-4 w-4 mr-2" />
            {createButtonLabel}
          </Button>
        )}
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <Card>
          {children}
        </Card>
      </motion.div>
    </div>
  );
}