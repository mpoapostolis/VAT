import { Routes, Route } from "react-router-dom";
import { AnimatedPage } from "@/components/AnimatedPage";
import { CategoryList } from "@/components/categories/CategoryList";
import { CategoryForm } from "@/components/categories/CategoryForm";

export function Categories() {
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
      <Route path="new" element={<CategoryForm />} />
      <Route path=":id/edit" element={<CategoryForm />} />
    </Routes>
  );
}
