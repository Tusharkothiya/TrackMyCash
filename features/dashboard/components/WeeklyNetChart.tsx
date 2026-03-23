"use client";

import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { weeklyNetData } from "@/features/dashboard/services/dummy-data";

export default function WeeklyNetChart() {
  return (
    <article className="rounded-xl border border-blue-900/40 bg-slate-900/70 p-5">
      <h3 className="text-base font-semibold text-blue-50">Weekly Net Movement</h3>
      <p className="mt-1 text-xs text-blue-200/70">Net amount trend by week</p>
      <div className="mt-4 h-72 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={weeklyNetData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#1e3a8a" opacity={0.35} />
            <XAxis dataKey="week" tick={{ fontSize: 12, fill: "#93c5fd" }} stroke="#60a5fa" />
            <YAxis tick={{ fontSize: 12, fill: "#93c5fd" }} stroke="#60a5fa" />
            <Tooltip />
            <Bar dataKey="net" radius={[8, 8, 0, 0]} fill="#3b82f6" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </article>
  );
}
