"use client";

import { usePathname } from "next/navigation";
import { Bell, Menu, Search } from "lucide-react";

type DashboardHeaderProps = {
  onMenuClick: () => void;
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

export default function DashboardHeader({ onMenuClick }: DashboardHeaderProps) {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-30 border-b border-blue-900/40 bg-slate-950/85 backdrop-blur">
      <div className="flex h-16 items-center justify-between px-4 sm:px-6">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onMenuClick}
            className="inline-flex rounded-md border border-blue-900/50 p-2 text-blue-100 hover:bg-blue-900/40 md:hidden"
            aria-label="Open menu"
          >
            <Menu className="h-4 w-4" />
          </button>
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
          <div className="hidden rounded-full bg-blue-600 px-3 py-1.5 text-xs font-semibold text-white sm:block">TM</div>
        </div>
      </div>
    </header>
  );
}
