"use client";

import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { monthlyCashflowData } from "@/features/dashboard/services/dummy-data";

export default function CashflowTrendChart() {
  return (
    <article className="rounded-xl border border-blue-900/40 bg-slate-900/70 p-5">
      <h3 className="text-base font-semibold text-blue-50">Cashflow Trend</h3>
      <p className="mt-1 text-xs text-blue-200/70">Income vs expense over the last 6 months</p>
      <div className="mt-4 h-72 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={monthlyCashflowData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#1e3a8a" opacity={0.35} />
            <XAxis dataKey="month" tick={{ fontSize: 12, fill: "#93c5fd" }} stroke="#60a5fa" />
            <YAxis tick={{ fontSize: 12, fill: "#93c5fd" }} stroke="#60a5fa" />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="income" stroke="#22c55e" strokeWidth={2.5} dot={false} />
            <Line type="monotone" dataKey="expense" stroke="#60a5fa" strokeWidth={2.5} dot={false} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </article>
  );
}
