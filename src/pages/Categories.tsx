import React from "react";
import { Routes, Route, Link, useNavigate } from "react-router-dom";
import { AnimatedPage } from "@/components/AnimatedPage";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { CategoryList } from "@/components/categories/CategoryList";
import { CreateCategory } from "@/components/categories/CreateCategory";
import { EditCategory } from "@/components/categories/EditCategory";
import { ViewCategory } from "@/components/categories/ViewCategory";

export function Categories() {
  const navigate = useNavigate();
  return (
    <Routes>
      <Route
        index
        element={
          <AnimatedPage>
            <CategoryList />
          </AnimatedPage>
        }
      />
      <Route path="new" element={<CreateCategory />} />
      <Route path="/:id/view" element={<ViewCategory />} />
      <Route path="/:id/edit" element={<EditCategory />} />
    </Routes>
  );
}
