
import { Outlet } from "react-router-dom";
import { AppSidebar } from "./AppSidebar";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { ThemeToggle } from "./ThemeToggle";
import { UserFontSettings } from "./UserFontSettings";
import { useEffect, useState } from "react";

export default function AppLayout() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    
    // Add smooth scroll behavior to body
    document.body.style.scrollBehavior = 'smooth';
    
    return () => {
      document.body.style.scrollBehavior = '';
    };
  }, []);

  if (!mounted) return null;

  return (
    <div className="min-h-screen flex w-full">
      <AppSidebar />
      <div className="flex-1 overflow-auto">
        <header className="sticky top-0 z-10 h-16 flex items-center justify-between border-b bg-background/80 backdrop-blur-md px-6">
          <div className="flex items-center gap-2">
            <SidebarTrigger />
          </div>
          <div className="flex items-center gap-4">
            <UserFontSettings />
            <ThemeToggle />
          </div>
        </header>
        <main className="flex-1 mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 pb-12">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
