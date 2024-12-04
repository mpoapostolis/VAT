import React from "react";
import { Routes, Route, Link, useNavigate } from "react-router-dom";
import { Plus } from "lucide-react";
import { AnimatedPage } from "@/components/AnimatedPage";
import { Button } from "@/components/ui/button";
import { CustomersList } from "@/components/customers/CustomersList";
import { CreateCustomer } from "@/components/customers/CreateCustomer";
import { ViewCustomer } from "@/components/customers/ViewCustomer";
import { EditCustomer } from "@/components/customers/EditCustomer";

export function Customers() {
  const navigate = useNavigate();
  return (
    <Routes>
      <Route
        path="/"
        element={
          <AnimatedPage>
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-2xl font-semibold text-gray-900">
                    Customers
                  </h1>
                  <p className="text-sm text-gray-500 mt-1">
                    Manage your customer relationships
                  </p>
                </div>
                <Button size="sm" onClick={() => navigate("new")}>
                  <Plus className="h-4 w-4 mr-2" />
                  New Customer
                </Button>
              </div>
              <div className="bg-white border border-gray-200/60 shadow-lg shadow-gray-200/20">
                <CustomersList />
              </div>
            </div>
          </AnimatedPage>
        }
      />
      <Route path="/new" element={<CreateCustomer />} />
      <Route path="/:id" element={<ViewCustomer />} />
      <Route path="/:id/edit" element={<EditCustomer />} />
    </Routes>
  );
}
