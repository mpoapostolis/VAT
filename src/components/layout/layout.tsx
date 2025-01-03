import { Outlet } from "react-router-dom";
import { Header } from "./header";
import { Sidebar } from "./sidebar";
import { LayoutProvider } from "../../lib/contexts/layout-context";

export function Layout() {
  return (
    <LayoutProvider>
      <div className="h-screen flex bg-gray-50/50">
        {/* Sidebar */}
        <Sidebar />

        {/* Main Content */}
        <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
          {/* Header */}
          <Header />

          {/* Main Scrollable Area */}
          <main className="flex-1 overflow-y-auto">
            <div className="h-full md:p-8 p-2">
              <div className="mx-auto max-w-[1600px]  pb-8">
                <Outlet />
              </div>
            </div>
          </main>
        </div>
      </div>
    </LayoutProvider>
  );
}
