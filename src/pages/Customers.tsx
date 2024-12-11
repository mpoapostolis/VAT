import React from "react";
import { Routes, Route } from "react-router-dom";
import { AnimatedPage } from "@/components/AnimatedPage";
import { CustomersList } from "@/components/customers/CustomersList";
import { CreateCustomer } from "@/components/customers/CreateCustomer";
import { ViewCustomer } from "@/components/customers/ViewCustomer";
import { EditCustomer } from "@/components/customers/EditCustomer";

export function Customers() {
  return (
    <Routes>
      <Route
        path="/"
        element={
          <AnimatedPage>
            <CustomersList />
          </AnimatedPage>
        }
      />
      <Route path="/new" element={<CreateCustomer />} />
      <Route path="/:id" element={<ViewCustomer />} />
      <Route path="/:id/edit" element={<EditCustomer />} />
    </Routes>
  );
}
