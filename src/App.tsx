import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { SWRConfig } from "swr";
import { AnimatePresence } from "framer-motion";
import { Layout } from "./components/layout/layout";
import { Dashboard } from "./pages/Dashboard";
import { Invoices } from "./pages/Invoices";
import { Customers } from "./pages/Customers";
import { Categories } from "./pages/Categories";
import { Companies } from "./pages/Companies";
import { VatReturn } from "./pages/VatReturn";
import { Settings } from "./pages/Settings";
import { Reports } from "./pages/Reports";
import { Login } from "./pages/Login";
import { ErrorBoundary } from "./components/ui/error-boundary";
import { ToastContainer } from "./components/ui/toast-container";
import { AuthProvider, useAuth } from "./lib/auth";
import { ToastProvider } from "./lib/contexts/toast-context";
import { pb } from "./lib/pocketbase";
import { Loading } from "./components/ui/loading";

function PrivateRoute({ children }: { children: React.ReactNode }) {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return <Loading className="min-h-screen" />;
  }

  if (!user) {
    return <Navigate to="/login" />;
  }

  return children;
}

export default function App() {
  return (
    <ErrorBoundary>
      <ToastProvider>
        <AuthProvider>
          <SWRConfig
            value={{
              provider: () => new Map(),
              fetcher: (url) => pb.collection(url).getList(1, 50),
              revalidateOnFocus: false,
              shouldRetryOnError: false,
            }}
          >
            <Router>
              <AnimatePresence mode="wait">
                <Routes>
                  <Route path="/login" element={<Login />} />
                  <Route
                    path="/"
                    element={
                      <PrivateRoute>
                        <Layout />
                      </PrivateRoute>
                    }
                  >
                    <Route index element={<Dashboard />} />
                    <Route path="invoices/*" element={<Invoices />} />
                    <Route path="customers/*" element={<Customers />} />
                    <Route path="categories/*" element={<Categories />} />
                    <Route path="companies/*" element={<Companies />} />
                    <Route path="vat-return/*" element={<VatReturn />} />
                    <Route path="reports/*" element={<Reports />} />
                    <Route path="settings" element={<Settings />} />
                  </Route>
                </Routes>
              </AnimatePresence>
            </Router>
            <ToastContainer />
          </SWRConfig>
        </AuthProvider>
      </ToastProvider>
    </ErrorBoundary>
  );
}
