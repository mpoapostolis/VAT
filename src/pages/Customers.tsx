import { Routes, Route } from "react-router-dom";
import { AnimatedPage } from "@/components/AnimatedPage";
import { CustomerList } from "@/components/customers/customer-list";
import { CustomerForm } from "@/components/customers/customer-form";

export function Customers() {
  return (
    <Routes>
      <Route
        path="/"
        element={
          <AnimatedPage>
            <CustomerList />
          </AnimatedPage>
        }
      />
      <Route
        path=":id/edit"
        element={
          <AnimatedPage>
            <CustomerForm />
          </AnimatedPage>
        }
      />

      <Route
        path="new"
        element={
          <AnimatedPage>
            <CustomerForm />
          </AnimatedPage>
        }
      />
    </Routes>
  );
}
