"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import {
  CircleDollarSign,
  LayoutDashboard,
  ReceiptText,
  PieChart,
  Wallet,
  Settings,
  type LucideIcon,
} from "lucide-react";
import { getRequest } from "@/lib/apiService";
import { apiList } from "@/lib/apiList";
import { getUserInitials } from "@/lib/utils/helper";

type DashboardSidebarProps = {
  onNavigate?: () => void;
};

type NavItem = {
  label: string;
  href: string;
  icon: LucideIcon;
};

type UserData = {
  fullName: string;
  email: string;
  role: string;
};

const navItems: NavItem[] = [
  { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { label: "Transactions", href: "/transactions", icon: ReceiptText },
  { label: "Reports", href: "/reports", icon: PieChart },
  { label: "Budgets", href: "/budgets", icon: Wallet },
  {  label: "Categories", href: "/categories", icon: CircleDollarSign },
  { label: "Accounts", href: "/accounts", icon: CircleDollarSign },
  { label: "Settings", href: "/settings", icon: Settings },
];

export default function DashboardSidebar({ onNavigate }: DashboardSidebarProps) {
  const pathname = usePathname();
  const { data: userData } = useQuery({
    queryKey: ["currentUser"],
    queryFn: () => getRequest(apiList.currentUser),
  });

  const user: UserData | undefined = userData?.data;
  const userInitials = getUserInitials(user?.fullName);
  const roleDisplay = user?.role === "ADMIN" ? "Admin" : "Pro Member";

  return (
    <aside className="flex flex-col h-full w-72 bg-[#0A0E14] backdrop-blur">
      <div className="flex items-center gap-2 border-b border-[#FFB596] px-5 py-3">
        <CircleDollarSign className="h-6 w-6 text-blue-400" />
        <div>
          <p className="text-base font-semibold text-blue-100 m-0!">TrackMyCash</p>
          <p className="text-xs text-blue-300/70 m-0!">Finance Dashboard</p>
        </div>
      </div>

      <nav className="flex-1 space-y-1 p-3 overflow-y-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = pathname === item.href || pathname.startsWith(`${item.href}/`);

          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onNavigate}
              className={`flex items-center gap-3 rounded-sm px-3 py-2.5 text-sm font-medium transition-colors border-l-4 ${
                active ? "border-l-blue-400 text-blue-100 bg-blue-400/10" : "border-l-transparent text-blue-100/80 hover:bg-blue-400/5 hover:text-blue-100"
              }`}
            >
              <Icon className="h-4 w-4" />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* User Profile Section */}
      <div className="border-t border-blue-400/20 p-3">
        <div className="flex items-center gap-3 rounded-lg bg-blue-400/10 p-3">
          <div className="shrink-0">
            <div className="h-10 w-10 rounded-full bg-blue-400 flex items-center justify-center text-xs font-bold text-[#0A0E14]">
              {userInitials}
            </div>
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-sm font-semibold text-blue-100 truncate">
              {user?.fullName || "User"}
            </p>
            <p className="text-xs text-blue-300/70">{roleDisplay}</p>
          </div>
        </div>
      </div>
    </aside>
  );
}
