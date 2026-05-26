"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

interface SalaryOption {
  id: string;
  company: string;
  role: string;
  level_standardized: string;
  location: string;
  experience_years: number;
  base_salary: number;
  bonus: number;
  stock: number;
  total_compensation: number;
  confidence_score: number;
}

function formatCurrency(val: number) {
  if (val >= 1_000_000) return `${(val / 1_000_000).toFixed(1)}M`;
  if (val >= 1_000) return `${(val / 1_000).toFixed(0)}k`;
  return `${val}`;
}

function CompareCard({ salary, label }: { salary: SalaryOption; label: string }) {
  const breakdown = [
    { label: "Base Salary", value: salary.base_salary, color: "bg-indigo-500" },
    { label: "Bonus", value: salary.bonus, color: "bg-violet-500" },
    { label: "Stock (RSU/ESOP)", value: salary.stock, color: "bg-purple-400" },
  ];

  return (
    <div className="bg-white/80 backdrop-blur-xl rounded-3xl border border-white/60 shadow-2xl shadow-indigo-100/50 p-8 flex flex-col gap-6 relative overflow-hidden">
      <div className="absolute -top-16 -right-16 w-48 h-48 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="z-10">
        <span className="text-xs font-bold uppercase tracking-widest text-indigo-500 mb-2 block">{label}</span>
        <h2 className="text-2xl font-black text-slate-900 capitalize">{salary.company}</h2>
        <p className="text-slate-500 font-medium mt-1">{salary.role} · {salary.level_standardized}</p>
        <p className="text-slate-400 text-sm">{salary.location} · {salary.experience_years} yrs exp</p>
      </div>

      {/* Total */}
      <div className="z-10 bg-gradient-to-br from-indigo-600 to-violet-600 rounded-2xl p-5 text-white text-center shadow-lg shadow-indigo-300/40">
        <p className="text-xs font-semibold uppercase tracking-widest opacity-80 mb-1">Total Compensation</p>
        <p className="text-4xl font-black">${formatCurrency(salary.total_compensation)}</p>
      </div>

      {/* Breakdown bars */}
      <div className="z-10 space-y-4">
        {breakdown.map((item) => (
          <div key={item.label}>
            <div className="flex justify-between text-sm mb-1.5">
              <span className="font-semibold text-slate-700">{item.label}</span>
              <span className="text-slate-500">${formatCurrency(item.value)}</span>
            </div>
            <div className="w-full bg-slate-100 rounded-full h-3 overflow-hidden">
              <div
                className={`${item.color} h-3 rounded-full transition-all duration-700`}
                style={{ width: `${salary.total_compensation > 0 ? (item.value / salary.total_compensation) * 100 : 0}%` }}
              />
            </div>
          </div>
        ))}
      </div>

      <div className="z-10 flex items-center gap-2 text-xs text-slate-400 border-t border-slate-100 pt-4">
        <div className="w-2 h-2 rounded-full bg-emerald-400" />
        Confidence: {(salary.confidence_score * 100).toFixed(0)}%
      </div>
    </div>
  );
}

export default function ComparePage() {
  const [salaries, setSalaries] = useState<SalaryOption[]>([]);
  const [leftId, setLeftId] = useState<string>("");
  const [rightId, setRightId] = useState<string>("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/salaries?limit=100")
      .then((r) => r.json())
      .then((json) => {
        const data: SalaryOption[] = json.data ?? [];
        setSalaries(data);
        if (data.length >= 2) {
          setLeftId(data[0].id);
          setRightId(data[1].id);
        }
      })
      .finally(() => setLoading(false));
  }, []);

  const leftSalary = salaries.find((s) => s.id === leftId);
  const rightSalary = salaries.find((s) => s.id === rightId);

  function optionLabel(s: SalaryOption) {
    return `${s.company} — ${s.role} (${s.level_standardized}) · $${formatCurrency(s.total_compensation)}`;
  }

  return (
    <main className="min-h-screen p-8 bg-gradient-to-br from-slate-50 to-violet-50/40 text-slate-900">
      <div className="max-w-6xl mx-auto space-y-10">
        <header className="space-y-4">
          <Link href="/" className="inline-flex items-center text-indigo-600 hover:text-indigo-800 transition-colors font-medium">
            <svg className="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back home
          </Link>
          <h1 className="text-4xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-indigo-700 to-violet-600">
            Compare Compensation
          </h1>
          <p className="text-slate-500 text-lg">Select two salary records to see a side-by-side TC breakdown.</p>
        </header>

        {loading ? (
          <div className="flex items-center justify-center py-32 text-slate-400 font-medium animate-pulse">Loading records…</div>
        ) : (
          <>
            {/* Dropdowns */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[
                { value: leftId, setter: setLeftId, label: "Record A" },
                { value: rightId, setter: setRightId, label: "Record B" },
              ].map(({ value, setter, label }) => (
                <div key={label} className="flex flex-col gap-2">
                  <label className="text-sm font-semibold text-slate-600 uppercase tracking-wide">{label}</label>
                  <select
                    id={`select-${label}`}
                    value={value}
                    onChange={(e) => setter(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white/80 backdrop-blur-md shadow-sm text-slate-800 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-indigo-400 transition"
                  >
                    {salaries.map((s) => (
                      <option key={s.id} value={s.id}>{optionLabel(s)}</option>
                    ))}
                  </select>
                </div>
              ))}
            </div>

            {/* Cards */}
            {leftSalary && rightSalary && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <CompareCard salary={leftSalary} label="Record A" />

                {/* VS divider */}
                <div className="hidden md:flex absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-20 pointer-events-none">
                </div>

                <CompareCard salary={rightSalary} label="Record B" />
              </div>
            )}

            {/* Delta summary */}
            {leftSalary && rightSalary && (
              <div className="bg-white/70 backdrop-blur-xl rounded-2xl border border-white/50 shadow-lg shadow-slate-100/60 p-6">
                <h3 className="text-lg font-bold text-slate-800 mb-4">Delta Summary</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {[
                    { label: "Base", diff: leftSalary.base_salary - rightSalary.base_salary },
                    { label: "Bonus", diff: leftSalary.bonus - rightSalary.bonus },
                    { label: "Stock", diff: leftSalary.stock - rightSalary.stock },
                    { label: "Total TC", diff: leftSalary.total_compensation - rightSalary.total_compensation },
                  ].map(({ label, diff }) => (
                    <div key={label} className="bg-slate-50 rounded-xl p-4 text-center">
                      <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1">{label}</p>
                      <p className={`text-xl font-extrabold ${diff > 0 ? "text-emerald-600" : diff < 0 ? "text-rose-500" : "text-slate-400"}`}>
                        {diff > 0 ? "+" : ""}{diff === 0 ? "—" : `$${formatCurrency(Math.abs(diff))}`}
                      </p>
                      <p className="text-xs text-slate-400 mt-0.5">{diff > 0 ? "A leads" : diff < 0 ? "B leads" : "Tied"}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </main>
  );
}
