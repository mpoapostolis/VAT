import React, { useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { Navigation } from "@/components/layout/Navigation";
import { Dashboard } from "@/components/dashboard/Dashboard";
import { InvoiceList } from "@/components/invoices/InvoiceList";
import { InvoiceCreate } from "@/components/invoices/InvoiceCreate";
import { CategoryList } from "@/components/categories/CategoryList";
import { CustomerList } from "@/components/customers/CustomerList";
import { Toaster } from "react-hot-toast";
import { SWRConfig } from "swr";
import { LoginForm } from "@/components/auth/LoginForm";
import { RegisterForm } from "@/components/auth/RegisterForm";
import { AuthGuard } from "@/components/auth/AuthGuard";
import MobileDrawer from "./components/navigation/MobileDrawer";
import MobileHeader from "./components/navigation/MobileHeader";

export default function App() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

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
          {/* Mobile navigation - only visible on mobile */}
          <div className="lg:hidden">
            <MobileDrawer isOpen={mobileMenuOpen} setIsOpen={setMobileMenuOpen} />
            <MobileHeader openDrawer={() => setMobileMenuOpen(true)} title="VAT Management" />
          </div>

          {/* Desktop navigation - only visible on desktop */}
          <div className="hidden lg:block">
            <Navigation />
          </div>

          {/* Main content */}
          <main className="lg:max-w-7xl lg:mx-auto py-6 px-4 sm:px-6 lg:px-8 animate-fade-in">
            {/* Mobile padding adjustment */}
            <div className="pt-16 lg:pt-0">
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
            </div>
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
