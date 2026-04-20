"use client";

import { usePathname, useRouter } from "next/navigation";
import { useRef, useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { Bell, Menu, Search, ChevronLeft, LogOut, Settings } from "lucide-react";
import { useCurrentUser } from "@/hooks/useAuth";
import { getUserInitials, logout } from "@/lib/utils/helper";
import { ConfirmActionModal } from "@/components/ui/ConfirmActionModal";

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
  const router = useRouter();
  const { data, isLoading } = useCurrentUser();
  const userInitials = getUserInitials(data?.data?.fullName);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Mount component in browser
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };

    if (isDropdownOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      return () => document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [isDropdownOpen]);

  const handleMyProfile = () => {
    router.push("/settings");
    setIsDropdownOpen(false);
  };

  const handleLogoutConfirm = () => {
    console.log("User logout confirmed");
    setIsLogoutModalOpen(false);
    setIsDropdownOpen(false);
    logout();
  };

  return (
    <>
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
            
            {/* User Profile Dropdown */}
            <div className="relative" ref={dropdownRef}>
              {isLoading ? (
                <div className="hidden h-8 w-8 animate-pulse rounded-full bg-blue-900/50 sm:block" />
              ) : (
                <button
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="hidden sm:flex items-center justify-center rounded-full bg-linear-to-br from-blue-500 to-blue-700 px-3 py-1.5 text-xs font-semibold text-white hover:from-blue-600 hover:to-blue-800 transition-all cursor-pointer"
                >
                  {userInitials || "U"}
                </button>
              )}

              {/* Dropdown Menu */}
              {isDropdownOpen && !isLoading && (
                <div className="absolute right-0 mt-2 w-48 rounded-lg border border-blue-800/50 bg-slate-900 shadow-lg overflow-hidden">
                  <div className="py-1">
                    <button
                      onClick={handleMyProfile}
                      className="w-full cursor-pointer flex items-center gap-3 px-4 py-2.5 text-sm text-blue-100 hover:bg-blue-800/40 transition-colors"
                    >
                      <Settings className="h-4 w-4" />
                      My Profile
                    </button>
                    <div className="border-t border-blue-800/30" />
                    <button
                      onClick={() => {
                        setIsLogoutModalOpen(true);
                        setIsDropdownOpen(false);
                      }}
                      className="w-full cursor-pointer flex items-center gap-3 px-4 py-2.5 text-sm text-red-400 hover:bg-red-900/20 transition-colors"
                    >
                      <LogOut className="h-4 w-4" />
                      Logout
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {isMounted && createPortal(
        <ConfirmActionModal
          isOpen={isLogoutModalOpen}
          title="Logout"
          description="Are you sure you want to logout? You will need to login again to access your account."
          confirmLabel="Logout"
          cancelLabel="Cancel"
          variant="danger"
          intent="logout"
          onConfirm={handleLogoutConfirm}
          onClose={() => setIsLogoutModalOpen(false)}
        />,
        document.body
      )}
    </>
  );
}
