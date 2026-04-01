"use client";

import { useState } from "react";
import {
  Bell,
  ChevronRight,
  LucideIcon,
  User,
  ShieldCheck,
  CreditCard,
  Code2,
} from "lucide-react";
import ProfileSettings from "./components/ProfileSettings";
import SecuritySettings from "./components/SecuritySettings";
import NotificationSettings from "./components/NotificationSettings";
import { cn } from "@/lib/utils/helper";
import BillingSettings from "./components/BillingsSettings";
import ApiAccessSettings from "./components/ApiAccessSettings";

export const SETTINGS_TABS: SettingsTab[] = [
  { id: "profile", label: "Profile", icon: User },
  { id: "security", label: "Security", icon: ShieldCheck },
  { id: "notifications", label: "Notifications", icon: Bell },
  { id: "billing", label: "Billing", icon: CreditCard },
  { id: "api", label: "API Access", icon: Code2 },
];

export type TabId =
  | "profile"
  | "security"
  | "notifications"
  | "billing"
  | "api";

export interface NavItem {
  id: string;
  label: string;
  icon: LucideIcon;
  active?: boolean;
}

export interface SettingsTab {
  id: TabId;
  label: string;
  icon: LucideIcon;
}

const Settings = () => {
  const [activeTab, setActiveTab] = useState<TabId>("profile");

  const renderTabContent = () => {
   switch (activeTab) {
      case "profile":
        return <ProfileSettings />;
      case "security":
        return <SecuritySettings />;
      case "notifications":
        return <NotificationSettings />;
      case "billing":
        return <BillingSettings />;
      case "api":
        return <ApiAccessSettings />;
      default:
        return (
          <div className="bg-surface-container rounded-xl p-8 text-center text-on-surface-variant">
            Content for {activeTab} is coming soon.
          </div>
        );
    }
  };

  return (
    <div className="flex min-h-screen bg-background text-on-surface">
      {/* Main Content Area */}
      <main className="flex-1 flex flex-col max-w-7xl mx-auto">
        {/* Content Canvas */}
        <div className=" flex-1 max-w-7xl mx-auto w-full">
          <header className="mb-10">
            <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-primary mb-2">
              System Configuration
            </p>
            <h2 className="text-4xl font-extrabold tracking-tight text-on-surface">
              Settings
            </h2>
          </header>

          <div className="grid grid-cols-12 gap-10">
            {/* Settings Navigation Rail */}
            <div className="col-span-12 lg:col-span-3">
              <nav className="sticky top-24 space-y-2">
                {SETTINGS_TABS.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as TabId)}
                    className={cn(
                      "w-full flex items-center justify-between px-5 py-4 rounded-xl transition-all group",
                      activeTab === tab.id
                        ? "bg-surface-container text-on-surface font-semibold shadow-sm border-l-4 border-primary"
                        : "text-on-surface-variant hover:bg-surface-container-low hover:text-on-surface",
                    )}
                  >
                    <div className="flex items-center gap-3">
                      <tab.icon
                        className={cn(
                          "w-5 h-5 transition-colors",
                          activeTab === tab.id
                            ? "text-primary"
                            : "group-hover:text-primary",
                        )}
                      />
                      <span>{tab.label}</span>
                    </div>
                    {activeTab === tab.id && (
                      <ChevronRight className="w-4 h-4 text-on-surface-variant" />
                    )}
                  </button>
                ))}
              </nav>
            </div>

            {/* Active Tab Content */}
            <div className="col-span-12 lg:col-span-9">
              {renderTabContent()}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Settings;
