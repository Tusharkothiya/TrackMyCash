"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  CircleDollarSign,
  LayoutDashboard,
  ReceiptText,
  PieChart,
  Wallet,
  Settings,
  type LucideIcon,
} from "lucide-react";

type DashboardSidebarProps = {
  onNavigate?: () => void;
};

type NavItem = {
  label: string;
  href: string;
  icon: LucideIcon;
};

const navItems: NavItem[] = [
  { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { label: "Transactions", href: "/transactions", icon: ReceiptText },
  { label: "Reports", href: "/reports", icon: PieChart },
  { label: "Budgets", href: "/budgets", icon: Wallet },
  { label: "Settings", href: "/settings", icon: Settings },
];

export default function DashboardSidebar({ onNavigate }: DashboardSidebarProps) {
  const pathname = usePathname();

  return (
    <aside className="h-full w-72 border-r border-blue-900/40 bg-slate-950/95 backdrop-blur">
      <div className="flex items-center gap-2 border-b border-blue-900/40 px-5 py-3">
        <CircleDollarSign className="h-6 w-6 text-blue-400" />
        <div>
          <p className="text-base font-semibold text-blue-100 m-0!">TrackMyCash</p>
          <p className="text-xs text-blue-300/70 m-0!">Finance Dashboard</p>
        </div>
      </div>

      <nav className="space-y-1 p-3">
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = pathname === item.href || pathname.startsWith(`${item.href}/`);

          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onNavigate}
              className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                active ? "bg-blue-600 text-white" : "text-blue-100/80 hover:bg-blue-900/40 hover:text-blue-100"
              }`}
            >
              <Icon className="h-4 w-4" />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
