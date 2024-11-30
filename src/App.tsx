import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { SWRConfig } from "swr";
import { Toaster } from "react-hot-toast";
import { Navigation } from "@/components/layout/Navigation";
import { Dashboard } from "@/components/dashboard/Dashboard";
import { InvoiceList } from "@/components/invoices/InvoiceList";
import { InvoiceCreate } from "@/components/invoices/InvoiceCreate";
import { CategoryList } from "@/components/categories/CategoryList";
import { CustomerList } from "@/components/customers/CustomerList";
import { LoginForm } from "@/components/auth/LoginForm";
import { RegisterForm } from "@/components/auth/RegisterForm";
import { AuthGuard } from "@/components/auth/AuthGuard";

export default function App() {
  return (
    <SWRConfig
      value={{
        revalidateOnFocus: false,
        revalidateOnReconnect: false,
        shouldRetryOnError: false,
      }}
    >
      <Router>
        <div className="min-h-screen bg-background text-foreground">
          <Navigation />
          <main className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8 animate-fade-in">
            <Routes>
              {/* Public routes */}
              <Route path="/login" element={<LoginForm />} />
              <Route path="/register" element={<RegisterForm />} />

              {/* Protected routes */}
              <Route
                path="/"
                element={
                  <AuthGuard>
                    <Dashboard />
                  </AuthGuard>
                }
              />
              <Route
                path="/invoices"
                element={
                  <AuthGuard>
                    <InvoiceList />
                  </AuthGuard>
                }
              />
              <Route
                path="/invoices/new"
                element={
                  <AuthGuard>
                    <InvoiceCreate />
                  </AuthGuard>
                }
              />
              <Route
                path="/customers"
                element={
                  <AuthGuard>
                    <CustomerList />
                  </AuthGuard>
                }
              />

              <Route
                path="/categories"
                element={
                  <AuthGuard>
                    <CategoryList />
                  </AuthGuard>
                }
              />

              {/* Catch all route */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </main>
          <Toaster
            position="top-right"
            toastOptions={{
              className: "animate-slide-up",
              duration: 4000,
              style: {
                background: "var(--background)",
                color: "var(--foreground)",
                border: "1px solid var(--border)",
              },
            }}
          />
        </div>
      </Router>
    </SWRConfig>
  );
}
