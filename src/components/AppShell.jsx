import { useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { useEffect } from "react";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";
import Chatbot from "./Chatbot";
import { SearchProvider } from "../context/SearchContext";

export default function AppShell() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    setSidebarOpen(false);
    window.scrollTo({ top: 0 });
  }, [location.pathname]);

  return (
    <SearchProvider>
      <div className="min-h-screen overflow-x-hidden bg-cream font-sans text-ink antialiased">
        <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

        <div className="flex min-h-screen flex-col lg:pl-[255px]">
          <Topbar onMenu={() => setSidebarOpen(true)} />
          <main className="mx-auto w-full max-w-[1180px] flex-1 px-4 pt-5 pb-28 sm:px-6 sm:pt-6 lg:px-8 lg:py-8">
            <Outlet />
          </main>
        </div>

        <Chatbot />
      </div>
    </SearchProvider>
  );
}
