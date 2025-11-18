import { useState, useEffect } from "react";
import Navbar from "../Components/Nav";
import ProfileRight from "../Components/Profile";
import SideLeft from "../Components/Sideleft";
import { Outlet } from "react-router-dom";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export function Layout() {
  const [isSidebarVisible, setIsSidebarVisible] = useState(() => {
    // Initialize from localStorage
    const saved = localStorage.getItem("sidebarVisible");
    return saved !== null ? JSON.parse(saved) : true;
  });

  // Persist sidebar state to localStorage
  useEffect(() => {
    localStorage.setItem("sidebarVisible", JSON.stringify(isSidebarVisible));
  }, [isSidebarVisible]);

  // Auto-show sidebar on desktop when window is resized
  useEffect(() => {
    const handleResize = () => {
      const isDesktop = window.innerWidth >= 768; // md breakpoint
      if (isDesktop) {
        setIsSidebarVisible(true);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div className="flex h-screen w-full bg-background text-foreground">
      {/* Sidebar */}
      <aside
        className={`
          transition-all duration-500 ease-in-out
          ${isSidebarVisible ? "w-24 md:w-[10%] opacity-100" : "w-0 opacity-0"} 
          overflow-hidden
          bg-card
          border-r border-border
          shadow-lg
        `}
      >
        <SideLeft />
      </aside>

      {/* Toggle Button */}
      <Button
        onClick={() => setIsSidebarVisible(!isSidebarVisible)}
        variant="outline"
        size="icon"
        className="
          h-screen w-10 md:hidden
          rounded-none border-l border-r border-border
          bg-card hover:bg-card/80
          text-primary
        "
        aria-label={isSidebarVisible ? "Hide sidebar" : "Show sidebar"}
      >
        {isSidebarVisible ? (
          <ChevronLeft className="h-4 w-4" />
        ) : (
          <ChevronRight className="h-4 w-4" />
        )}
      </Button>

      {/* Main Content */}
      <div className="flex flex-col flex-1 overflow-hidden">
        {/* Navbar */}
        <nav className="border-b border-border shadow-sm">
          <Navbar />
        </nav>

        <div className="flex flex-1 overflow-hidden">
          {/* Main Area */}
          <main className="flex-1 overflow-y-auto">
            <div className="h-full bg-background p-4 md:p-6 lg:p-8">
              <div className="max-w-7xl mx-auto">
                <Outlet />
              </div>
            </div>
          </main>

          {/* Right Sidebar */}
          <aside className="hidden lg:flex flex-col w-64 xl:w-80 border-l border-border bg-card shadow-sm overflow-y-auto">
            <ProfileRight />
          </aside>
        </div>
      </div>
    </div>
  );
}