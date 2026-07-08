import { useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { Menu } from "lucide-react";
import Sidebar from "./Sidebar";

const pageTitles: Record<string, string> = {
  "/dashboard": "Dashboard",
  "/accounts": "Social Accounts",
  "/scheduler": "Post Scheduler",
  "/ai-composer": "AI Composer",
};

const Layout = () => {
  const location = useLocation();

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const title = pageTitles[location.pathname] ?? "FlowPost AI";

  return (
    <div className="flex h-screen bg-slate-50">
      {/* Mobile Overlay */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/40 md:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      <Sidebar
        isOpen={isMobileMenuOpen}
        setIsOpen={setIsMobileMenuOpen}
      />

      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Header */}
        <header className="flex h-16 items-center gap-4 border-b border-slate-200 bg-white px-4 md:px-8">
          <button
            onClick={() => setIsMobileMenuOpen(true)}
            className="rounded-lg p-2 hover:bg-slate-100 md:hidden"
          >
            <Menu className="h-6 w-6 text-slate-700" />
          </button>

          <div>
            <h1 className="text-2xl font-bold text-slate-900">{title}</h1>

            <p className="hidden text-sm text-slate-500 sm:block">
              Create • Schedule • Publish • Grow
            </p>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-6 md:p-8 xl:p-10">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Layout;