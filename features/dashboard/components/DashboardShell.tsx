"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import DashboardHeader from "@/features/dashboard/components/DashboardHeader";
import DashboardSidebar from "@/features/dashboard/components/DashboardSidebar";

type DashboardShellProps = {
  children: React.ReactNode;
};

export default function DashboardShell({ children }: DashboardShellProps) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  return (
    <div className="min-h-screen bg-transparent">
      <div className="flex">
        {/* Desktop Sidebar - Always visible, can be collapsed */}
        <div className="hidden lg:sticky lg:top-0 lg:block lg:h-screen">
          <DashboardSidebar 
            isCollapsed={sidebarCollapsed}
            onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
            isMobileOverlay={false}
          />
        </div>

        {/* Tablet & Mobile Sidebar - Modal overlay shown on demand */}
        {mobileOpen ? (
          <div className="fixed inset-0 z-40 lg:hidden">
            <button
              aria-label="Close sidebar"
              className="absolute inset-0 bg-black/70"
              onClick={() => setMobileOpen(false)}
            />
            <div className="relative h-full w-72">
              <DashboardSidebar 
                onNavigate={() => setMobileOpen(false)}
                isMobileOverlay={true}
              />
            </div>
          </div>
        ) : null}

        <div className="min-w-0 flex-1">
          <DashboardHeader 
            onMenuClick={() => setMobileOpen(true)}
            sidebarCollapsed={sidebarCollapsed}
            onToggleSidebar={() => setSidebarCollapsed(!sidebarCollapsed)}
          />
          <main className="p-4 sm:p-6">{children}</main>
        </div>
      </div>
    </div>
  );
}
