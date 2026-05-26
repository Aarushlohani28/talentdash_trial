import React from "react";
import Link from "next/link";
import { Badge } from "@/components/ui/Badge";
import { Salary } from "@prisma/client";

interface SalaryTableProps {
  salaries: Salary[];
  hideCompany?: boolean;
}

export function SalaryTable({ salaries, hideCompany = false }: SalaryTableProps) {
  if (salaries.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 px-4 bg-white/50 backdrop-blur-md border border-white/20 rounded-2xl shadow-xl shadow-slate-200/50 text-center">
        <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-4">
          <svg className="w-8 h-8 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
          </svg>
        </div>
        <h3 className="text-lg font-semibold text-slate-900">No salaries found</h3>
        <p className="text-slate-500 max-w-sm mt-1">We couldn't find any compensation records matching your current filters.</p>
      </div>
    );
  }

  return (
    <div className="bg-white/70 backdrop-blur-xl border border-white/40 shadow-2xl shadow-indigo-100/40 rounded-2xl overflow-hidden transition-all duration-300">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm whitespace-nowrap">
          <thead className="bg-slate-50/80 border-b border-slate-200/60 text-slate-600">
            <tr>
              {!hideCompany && <th className="px-6 py-4 font-medium tracking-wide">Company</th>}
              <th className="px-6 py-4 font-medium tracking-wide">Role</th>
              <th className="px-6 py-4 font-medium tracking-wide">Level</th>
              <th className="px-6 py-4 font-medium tracking-wide">Location</th>
              <th className="px-6 py-4 font-medium tracking-wide">Experience</th>
              <th className="px-6 py-4 font-medium tracking-wide text-right">Total Comp</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {salaries.map((s) => (
              <tr key={s.id} className="hover:bg-slate-50/80 transition-colors group">
                {!hideCompany && (
                  <td className="px-6 py-4">
                    <Link href={`/companies/${s.normalized_company}`} className="font-semibold text-slate-900 group-hover:text-indigo-600 transition-colors">
                      {s.company}
                    </Link>
                  </td>
                )}
                <td className="px-6 py-4 font-medium text-slate-700">{s.role}</td>
                <td className="px-6 py-4">
                  <Badge variant="brand">{s.level_standardized}</Badge>
                </td>
                <td className="px-6 py-4 text-slate-600">{s.location}</td>
                <td className="px-6 py-4 text-slate-600">{s.experience_years} yrs</td>
                <td className="px-6 py-4 font-bold text-slate-900 text-right">
                  ${s.total_compensation.toLocaleString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
