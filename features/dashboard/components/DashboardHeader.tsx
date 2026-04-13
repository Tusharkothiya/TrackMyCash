"use client";

import { usePathname } from "next/navigation";
import { Bell, Menu, Search, ChevronLeft } from "lucide-react";
import { useCurrentUser } from "@/hooks/useAuth";
import { getUserInitials } from "@/lib/utils/helper";

type DashboardHeaderProps = {
  onMenuClick: () => void;
  sidebarCollapsed?: boolean;
  onToggleSidebar?: () => void;
};

const titleMap: Record<string, string> = {
  "/dashboard": "Overview",
  "/transactions": "Transactions",
  "/reports": "Reports",
  "/budgets": "Budgets",
  "/settings": "Settings",
};

function resolveTitle(pathname: string): string {
  if (pathname.startsWith("/transactions/")) return "Transaction Details";
  if (pathname.startsWith("/reports/")) return "Report Details";
  return titleMap[pathname] ?? "Dashboard";
}

export default function DashboardHeader({ onMenuClick, sidebarCollapsed = false, onToggleSidebar }: DashboardHeaderProps) {
  const pathname = usePathname();
  const { data, isLoading } = useCurrentUser();
  const userInitials = getUserInitials(data?.data?.fullName);

  return (
    <header className="sticky top-0 z-30  bg-[#0A0E14]  backdrop-blur">
      <div className="flex h-16 items-center justify-between px-4 sm:px-6">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onMenuClick}
            className="inline-flex rounded-md border border-blue-900/50 p-2 text-blue-100 hover:bg-blue-900/40 lg:hidden"
            aria-label="Open menu"
          >
            <Menu className="h-4 w-4" />
          </button>
          {/* Desktop sidebar collapse toggle - only on lg screens */}
          {onToggleSidebar && (
            <button
              type="button"
              onClick={onToggleSidebar}
              className="hidden cursor-pointer rounded-md border border-blue-900/50 p-2 text-blue-100 hover:bg-blue-900/40 lg:inline-flex"
              aria-label={sidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
              title={sidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
            >
              <ChevronLeft className={`h-4 w-4 transition-transform duration-300 ${sidebarCollapsed ? "rotate-180" : ""}`} />
            </button>
          )}
          <div>
            <h1 className="text-lg font-semibold text-blue-100">{resolveTitle(pathname)}</h1>
            <p className="text-xs text-blue-300/70">Welcome back, here is your latest financial snapshot.</p>
          </div>
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          <button type="button" className="hidden items-center gap-2 rounded-md border border-blue-900/50 px-3 py-2 text-sm text-blue-100/80 hover:bg-blue-900/40 sm:flex">
            <Search className="h-4 w-4" /> Search
          </button>
          <button type="button" className="inline-flex rounded-md border border-blue-900/50 p-2 text-blue-100 hover:bg-blue-900/40" aria-label="Notifications">
            <Bell className="h-4 w-4" />
          </button>
          {isLoading ? (
            <div className="hidden h-8 w-8 animate-pulse rounded-full bg-blue-900/50 sm:block" />
          ) : (
            <div className="hidden rounded-full bg-blue-600 px-3 py-1.5 text-xs font-semibold text-white sm:block">{userInitials || "U"}</div>
          )}
        </div>
      </div>
    </header>
  );
}
