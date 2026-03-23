"use client";

import { Cell, Legend, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";
import { expenseBreakdownData } from "@/features/dashboard/services/dummy-data";

const COLORS = ["#22c55e", "#3b82f6", "#8b5cf6", "#f59e0b", "#06b6d4"];

export default function ExpenseBreakdownChart() {
  return (
    <article className="rounded-xl border border-blue-900/40 bg-slate-900/70 p-5">
      <h3 className="text-base font-semibold text-blue-50">Expense Breakdown</h3>
      <p className="mt-1 text-xs text-blue-200/70">Category-wise distribution (%)</p>
      <div className="mt-4 h-72 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie data={expenseBreakdownData} dataKey="value" nameKey="name" innerRadius={62} outerRadius={95} paddingAngle={4}>
              {expenseBreakdownData.map((entry, index) => (
                <Cell key={entry.name} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </article>
  );
}
