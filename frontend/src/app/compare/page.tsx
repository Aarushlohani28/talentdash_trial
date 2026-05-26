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

function CompareCard({ salary, label, color }: { salary: SalaryOption; label: string; color: "coral" | "dark" }) {
  const breakdown = [
    { label: "Base Salary", value: salary.base_salary },
    { label: "Bonus", value: salary.bonus },
    { label: "Stock (RSU/ESOP)", value: salary.stock },
  ];

  const accentColor = color === "coral" ? "#FF385C" : "#222222";
  const accentBg = color === "coral" ? "bg-[#FF385C]" : "bg-[#222222]";
  const accentText = color === "coral" ? "text-[#FF385C]" : "text-[#222222]";
  const accentBgLight = color === "coral" ? "bg-[#FFF0F3]" : "bg-[#F7F7F7]";

  return (
    <div className="airbnb-card p-8 flex flex-col gap-6">
      {/* Label chip */}
      <div className="flex items-center gap-3">
        <span
          className={`text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full text-white ${accentBg}`}
        >
          {label}
        </span>
      </div>

      {/* Company & role info */}
      <div>
        <h2 className="text-2xl font-extrabold text-[#222222] capitalize">{salary.company}</h2>
        <p className="text-[#717171] font-medium mt-1">
          {salary.role} · {salary.level_standardized}
        </p>
        <p className="text-[#717171] text-sm mt-0.5">
          {salary.location} · {salary.experience_years} yrs experience
        </p>
      </div>

      {/* Total compensation highlight */}
      <div className={`${accentBgLight} rounded-2xl p-6 text-center border border-[#DDDDDD]`}>
        <p className="text-xs font-semibold text-[#717171] uppercase tracking-widest mb-2">
          Total Compensation
        </p>
        <p className={`text-4xl font-black ${accentText}`}>
          ${formatCurrency(salary.total_compensation)}
        </p>
      </div>

      {/* Breakdown bars */}
      <div className="space-y-4">
        {breakdown.map((item) => (
          <div key={item.label}>
            <div className="flex justify-between text-sm mb-2">
              <span className="font-medium text-[#222222]">{item.label}</span>
              <span className="text-[#717171] font-semibold">${formatCurrency(item.value)}</span>
            </div>
            <div className="w-full bg-[#F7F7F7] rounded-full h-2.5 overflow-hidden">
              <div
                className={`${accentBg} h-2.5 rounded-full transition-all duration-700`}
                style={{
                  width: `${salary.total_compensation > 0 ? (item.value / salary.total_compensation) * 100 : 0}%`,
                }}
              />
            </div>
          </div>
        ))}
      </div>

      {/* Confidence */}
      <div className="flex items-center gap-2 text-sm text-[#717171] border-t border-[#DDDDDD] pt-4">
        <div className="w-2 h-2 rounded-full bg-emerald-500" />
        <span>Confidence score: <span className="font-semibold text-[#222222]">{(salary.confidence_score * 100).toFixed(0)}%</span></span>
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
    <main className="min-h-screen bg-white page-wrapper">
      {/* Page header */}
      <div className="border-b border-[#DDDDDD] bg-white">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-sm text-[#717171] hover:text-[#222222] transition-colors mb-6 group"
          >
            <svg className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
            </svg>
            Back to home
          </Link>

          <h1 className="text-3xl font-extrabold text-[#222222] tracking-tight">
            Compare Compensation
          </h1>
          <p className="text-[#717171] mt-1.5">
            Select two salary records to see a side-by-side breakdown
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-10 space-y-10">
        {loading ? (
          /* Loading skeleton */
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[1, 2].map((i) => (
                <div key={i} className="airbnb-card p-5 space-y-3 animate-pulse">
                  <div className="h-4 bg-[#F7F7F7] rounded-full w-20" />
                  <div className="h-8 bg-[#F7F7F7] rounded-full w-48" />
                </div>
              ))}
            </div>
            <div className="flex items-center justify-center py-20">
              <div className="flex items-center gap-3 text-[#717171]">
                <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                <span className="font-medium">Loading records…</span>
              </div>
            </div>
          </div>
        ) : (
          <>
            {/* Selector row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[
                { value: leftId, setter: setLeftId, label: "Record A", color: "coral" as const },
                { value: rightId, setter: setRightId, label: "Record B", color: "dark" as const },
              ].map(({ value, setter, label, color }) => (
                <div key={label} className="flex flex-col gap-2">
                  <label
                    htmlFor={`select-${label}`}
                    className="text-xs font-bold text-[#717171] uppercase tracking-widest"
                  >
                    {label}
                  </label>
                  <select
                    id={`select-${label}`}
                    value={value}
                    onChange={(e) => setter(e.target.value)}
                    className="airbnb-input font-medium"
                  >
                    {salaries.map((s) => (
                      <option key={s.id} value={s.id}>
                        {optionLabel(s)}
                      </option>
                    ))}
                  </select>
                </div>
              ))}
            </div>

            {/* VS divider */}
            {leftSalary && rightSalary && (
              <div className="flex items-center gap-4">
                <div className="flex-1 h-px bg-[#DDDDDD]" />
                <span className="text-sm font-extrabold text-[#717171] bg-[#F7F7F7] border border-[#DDDDDD] px-4 py-1.5 rounded-full">
                  VS
                </span>
                <div className="flex-1 h-px bg-[#DDDDDD]" />
              </div>
            )}

            {/* Compare cards */}
            {leftSalary && rightSalary && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <CompareCard salary={leftSalary} label="Record A" color="coral" />
                <CompareCard salary={rightSalary} label="Record B" color="dark" />
              </div>
            )}

            {/* Delta summary */}
            {leftSalary && rightSalary && (
              <div className="airbnb-card p-6">
                <h3 className="text-lg font-bold text-[#222222] mb-5">Delta Summary</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {[
                    { label: "Base Salary", diff: leftSalary.base_salary - rightSalary.base_salary },
                    { label: "Bonus", diff: leftSalary.bonus - rightSalary.bonus },
                    { label: "Stock", diff: leftSalary.stock - rightSalary.stock },
                    { label: "Total TC", diff: leftSalary.total_compensation - rightSalary.total_compensation },
                  ].map(({ label, diff }) => (
                    <div key={label} className="bg-[#F7F7F7] rounded-2xl p-5 text-center border border-[#DDDDDD]">
                      <p className="text-xs font-semibold text-[#717171] uppercase tracking-widest mb-2">
                        {label}
                      </p>
                      <p
                        className={`text-2xl font-extrabold ${
                          diff > 0
                            ? "text-emerald-600"
                            : diff < 0
                            ? "text-[#FF385C]"
                            : "text-[#717171]"
                        }`}
                      >
                        {diff === 0 ? "—" : `${diff > 0 ? "+" : ""}$${formatCurrency(Math.abs(diff))}`}
                      </p>
                      <p className="text-xs text-[#717171] mt-1 font-medium">
                        {diff > 0 ? "A leads" : diff < 0 ? "B leads" : "Tied"}
                      </p>
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
