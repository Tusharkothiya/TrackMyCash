"use client";

import { useState } from "react";
import {
  LayoutDashboard,
  Receipt,
  Landmark,
  Wallet,
  BarChart3,
  Tags,
  Settings,
  LogOut,
  Search,
  Bell,
  Upload,
  Plus,
  FileText,
  FileSpreadsheet,
  Calendar as CalendarIcon,
  Sparkles,
  X,
  ArrowRight,
  History,
  Share2,
  ChevronDown,
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import CreateReportModal from "./components/CreateReportModal";

export type ReportPeriod = "Monthly" | "Quartely" | "Yearly";

export interface Report {
  id: string;
  title: string;
  period: ReportPeriod;
  description: string;
  revenue: number;
  expense: number;
  updatedAt: string;
}

const MOCK_REPORTS: Report[] = [
  {
    id: "1",
    title: "Monthly Financial Pulse",
    period: "Monthly",
    description: "Comprehensive summary of all cash flows for October.",
    revenue: 12450.0,
    expense: 8120.45,
    updatedAt: "2 hours ago",
  },
  {
    id: "2",
    title: "Portfolio Dividend Yield",
    period: "Quartely",
    description: "Investment performance and passive income tracking.",
    revenue: 2840.12,
    expense: 142.0,
    updatedAt: "Oct 24, 2023",
  },
  {
    id: "3",
    title: "Operational Overheads",
    period: "Monthly",
    description: "Subscription, utilities, and recurring monthly burns.",
    revenue: 0.0,
    expense: 3150.2,
    updatedAt: "1 day ago",
  },
  {
    id: "4",
    title: "Annual Wealth Trajectory",
    period: "Yearly",
    description: "Year-over-year net worth and savings rate analysis.",
    revenue: 148200,
    expense: 94300,
    updatedAt: "Jan 01, 2023",
  },
];

const Reports = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSmartInsights, setIsSmartInsights] = useState(true);
  const [activeTab, setActiveTab] = useState("Reports");
  const [filterPeriod, setFilterPeriod] = useState<ReportPeriod | "All">(
    "Monthly",
  );

  return (
    <div className="flex min-h-screen bg-background text-on-surface">
      {/* Main Canvas */}
      <main className="flex-1 flex flex-col min-h-screen w-full max-w-7xl mx-auto">
        {/* Page Content */}
        <div className=" py-10">
          {/* Header Section */}
          <div className="flex justify-between items-end mb-12">
            <div>
              <span className="text-[10px] font-bold tracking-[0.2em] text-primary uppercase mb-2 block">
                Insights & Analytics
              </span>
              <h2 className="text-4xl font-extrabold text-on-surface tracking-tight">
                Reports
              </h2>
            </div>
            <div className="flex items-center gap-3">
              <button className="bg-surface-container-high text-on-surface px-5 py-2.5 rounded-xl text-sm font-semibold flex items-center gap-2 hover:bg-surface-bright transition-all active:scale-95">
                <Upload className="w-4 h-4" />
                Export
              </button>
              <button
                onClick={() => setIsModalOpen(true)}
                className="primary-gradient cursor-pointer text-white px-6 py-2.5 rounded-xl text-sm font-bold shadow-lg shadow-primary-container/20 flex items-center gap-2 hover:opacity-90 transition-all active:scale-95"
              >
                <Plus className="w-4 h-4" />
                New Report
              </button>
            </div>
          </div>

          {/* Filter Bar */}
          <div className="bg-surface-container-low rounded-2xl p-4 mb-10 flex flex-wrap items-center justify-between gap-6">
            <div className="flex items-center gap-2 bg-surface-lowest p-1 rounded-xl">
              {["Monthly", "Quarterly", "Yearly"].map((p) => (
                <button
                  key={p}
                  onClick={() => setFilterPeriod(p as ReportPeriod)}
                  className={`px-5 py-2 rounded-lg text-xs font-bold transition-all ${
                    filterPeriod === p
                      ? "bg-surface-container text-on-surface shadow-sm"
                      : "text-on-surface-variant hover:text-on-surface"
                  }`}
                >
                  {p}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-4 flex-1 max-w-md">
              <div className="relative w-full">
                <CalendarIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant w-4 h-4" />
                <div className="bg-surface-container-highest/30 rounded-xl py-2.5 pl-11 pr-4 text-sm font-medium text-on-surface cursor-pointer flex justify-between items-center group">
                  <span>Oct 01, 2023 - Oct 31, 2023</span>
                  <ChevronDown className="w-4 h-4 opacity-50 group-hover:opacity-100" />
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 border-l border-outline-variant/20 pl-6">
              <button
                className="w-10 h-10 flex items-center justify-center rounded-xl bg-surface-container-highest/40 text-on-surface-variant hover:text-on-surface transition-all"
                title="Download PDF"
              >
                <FileText className="w-5 h-5" />
              </button>
              <button
                className="w-10 h-10 flex items-center justify-center rounded-xl bg-surface-container-highest/40 text-on-surface-variant hover:text-on-surface transition-all"
                title="Download CSV"
              >
                <FileSpreadsheet className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Reports Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {MOCK_REPORTS.map((report) => (
              <motion.div
                key={report.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="group bg-surface-container hover:bg-surface-container-high transition-all duration-300 rounded-xl p-8 relative overflow-hidden"
              >
                <div className="absolute top-6 right-6 flex gap-2">
                  <button className="text-on-surface-variant hover:text-primary transition-colors">
                    <Share2 className="w-4 h-4" />
                  </button>
                </div>
                <div className="mb-8">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-xl font-bold text-on-surface">
                      {report.title}
                    </h3>
                    <span
                      className={`text-[10px] px-2 py-0.5 rounded font-black border ${
                        report.period === "Monthly"
                          ? "bg-primary-container/10 text-primary border-primary/20"
                          : report.period === "Quartely"
                            ? "bg-tertiary-container/10 text-tertiary! border-tertiary/20"
                            : "bg-surface-container-highest text-on-surface! border-outline-variant/20"
                      }`}
                    >
                      {report.period}
                    </span>
                  </div>
                  <p className="text-xs text-on-surface-variant">
                    {report.description}
                  </p>
                </div>
                <div className="grid grid-cols-3 gap-6 mb-10">
                  <div className="space-y-1">
                    <p className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider">
                      Revenue
                    </p>
                    <p className="text-lg font-bold text-primary">
                      {report.revenue > 0
                        ? `+$${report.revenue.toLocaleString()}`
                        : `$${report.revenue.toFixed(2)}`}
                    </p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider">
                      Expense
                    </p>
                    <p className="text-lg font-bold text-error">
                      -${Math.abs(report.expense).toLocaleString()}
                    </p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider">
                      Net Growth
                    </p>
                    <p
                      className={`text-lg font-bold ${report.revenue - report.expense >= 0 ? "text-on-surface" : "text-error"}`}
                    >
                      {report.revenue - report.expense >= 0 ? "+" : ""}$
                      {(report.revenue - report.expense).toLocaleString()}
                    </p>
                  </div>
                </div>
                <div className="flex items-center justify-between pt-6 border-t border-outline-variant/10">
                  <span className="text-[11px] text-on-surface-variant flex items-center gap-1.5 italic">
                    <History className="w-3 h-3" /> Updated {report.updatedAt}
                  </span>
                  <a
                    href="#"
                    className="text-sm font-bold text-primary flex items-center gap-1 group-hover:gap-2 transition-all"
                  >
                    Open report <ArrowRight className="w-4 h-4" />
                  </a>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Empty State / Add More */}
          <div className="mt-12">
            <button className="flex flex-col items-center gap-4 group cursor-pointer p-10 rounded-2xl border-2 border-dashed border-outline-variant/20 hover:border-primary/50 hover:bg-primary/5 transition-all w-full">
              <div className="w-12 h-12 rounded-full bg-surface-container-highest flex items-center justify-center text-on-surface-variant group-hover:text-primary transition-colors">
                <Plus className="w-6 h-6" />
              </div>
              <div className="text-center">
                <p className="text-sm font-bold text-on-surface">
                  Create Custom Report Template
                </p>
                <p className="text-xs text-on-surface-variant">
                  Tailor your financial insights with custom metrics and filters
                </p>
              </div>
            </button>
          </div>
        </div>
      </main>

      {/* Modal Overlay */}
      {isModalOpen && (
        <CreateReportModal
          onClose={() => setIsModalOpen(false)}
          isOpen={isModalOpen}
        />
      )}
    </div>
  );
};

export default Reports;
