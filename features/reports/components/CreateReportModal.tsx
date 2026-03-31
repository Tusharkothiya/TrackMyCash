"use client"

import { CalendarIcon, ChevronDown, FileSpreadsheet, FileText, Sparkles, X } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import React, { useState } from "react";

interface CreateReportModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const CreateReportModal : React.FC<CreateReportModalProps> = ({
    isOpen, onClose
}) => {
    const [isSmartInsights, setIsSmartInsights] = useState(true);
  return (
    <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-100 flex items-center justify-center bg-surface-container-lowest/80 backdrop-blur-sm px-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="glass-effect w-full max-w-xl rounded-xl shadow-[0_20px_40px_rgba(0,0,0,0.6)] bg-[#10141A] overflow-hidden border border-outline-variant/10"
            >
              {/* Modal Header */}
              <div className="px-8 pt-8 pb-6">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <p className="text-[10px] font-bold text-primary tracking-[0.2em] uppercase mb-1">
                      Configuration
                    </p>
                    <h3 className="text-2xl font-bold tracking-tight text-on-surface">
                      Generate New Report
                    </h3>
                  </div>
                  <button
                    onClick={onClose}
                    className="text-on-surface-variant hover:text-on-surface transition-colors cursor-pointer"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>
                <p className="text-on-surface-variant text-sm">
                  Select your parameters to compile a high-fidelity financial
                  statement.
                </p>
              </div>

              {/* Modal Body */}
              <div className="px-8 pb-8 space-y-6">
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-on-surface-variant uppercase tracking-wider">
                    Report Title
                  </label>
                  <input
                    type="text"
                    defaultValue="Q3 Expenditure Analysis"
                    className="w-full bg-surface-container-highest border-none rounded-lg py-3 px-4 text-on-surface focus:ring-1 focus:ring-primary/50 transition-all"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-xs font-semibold text-on-surface-variant uppercase tracking-wider">
                      Report Type
                    </label>
                    <div className="relative">
                      <select className="w-full bg-surface-container-highest border-none rounded-lg py-3 px-4 text-on-surface focus:ring-1 focus:ring-primary/50 transition-all appearance-none cursor-pointer">
                        <option>Summary</option>
                        <option selected>Expense Breakdown</option>
                        <option>Cashflow</option>
                      </select>
                      <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-on-surface-variant pointer-events-none" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-semibold text-on-surface-variant uppercase tracking-wider">
                      Format
                    </label>
                    <div className="flex gap-2">
                      <button className="flex-1 bg-primary-container text-white py-3 rounded-lg text-sm font-bold flex items-center justify-center gap-2">
                        <FileText className="w-4 h-4" /> PDF
                      </button>
                      <button className="flex-1 bg-surface-container-high text-on-surface-variant py-3 rounded-lg text-sm font-semibold hover:text-on-surface transition-colors flex items-center justify-center gap-2">
                        <FileSpreadsheet className="w-4 h-4" /> CSV
                      </button>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-semibold text-on-surface-variant uppercase tracking-wider">
                    Date Range
                  </label>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="relative">
                      <CalendarIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant w-4 h-4" />
                      <input
                        type="date"
                        defaultValue="2023-07-01"
                        className="w-full bg-surface-container-highest border-none rounded-lg py-3 pl-10 pr-4 text-on-surface text-sm focus:ring-1 focus:ring-primary/50 transition-all"
                      />
                    </div>
                    <div className="relative">
                      <CalendarIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant w-4 h-4" />
                      <input
                        type="date"
                        defaultValue="2023-09-30"
                        className="w-full bg-surface-container-highest border-none rounded-lg py-3 pl-10 pr-4 text-on-surface text-sm focus:ring-1 focus:ring-primary/50 transition-all"
                      />
                    </div>
                  </div>
                </div>

                <div className="pt-2">
                  <div className="flex items-center justify-between p-4 bg-surface-container-low rounded-lg">
                    <div className="flex items-center gap-3">
                      <Sparkles className="w-5 h-5 text-primary" />
                      <div>
                        <p className="text-sm font-bold">Smart Insights</p>
                        <p className="text-[11px] text-on-surface-variant">
                          Include AI-generated recommendations
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => setIsSmartInsights(!isSmartInsights)}
                      className={`w-10 h-5 rounded-full relative cursor-pointer transition-colors ${isSmartInsights ? "bg-primary" : "bg-surface-container-highest"}`}
                    >
                      <motion.div
                        animate={{ x: isSmartInsights ? 20 : 4 }}
                        initial={false}
                        className="absolute top-1 w-3 h-3 bg-white rounded-full"
                      />
                    </button>
                  </div>
                </div>
              </div>

              {/* Modal Footer */}
              <div className="px-8 py-6 bg-surface-container-low/50 flex items-center justify-end gap-4">
                <button
                  onClick={onClose}
                  className="px-6 py-2.5 rounded-lg text-sm cursor-pointer font-semibold text-on-surface-variant hover:text-on-surface hover:bg-surface-bright transition-all"
                >
                  Cancel
                </button>
                <button className="primary-gradient px-8 cursor-pointer py-2.5 rounded-lg text-sm font-bold text-white shadow-lg shadow-primary-container/20 active:scale-95 transition-all">
                  Generate Report
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
  )
}

export default CreateReportModal