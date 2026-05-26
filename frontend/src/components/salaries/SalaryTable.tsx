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
      <div className="airbnb-card flex flex-col items-center justify-center py-20 px-4 text-center">
        <div className="w-16 h-16 bg-[#F7F7F7] border border-[#DDDDDD] rounded-full flex items-center justify-center mb-5">
          <svg
            className="w-8 h-8 text-[#717171]"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={1.5}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
            />
          </svg>
        </div>
        <h3 className="text-lg font-bold text-[#222222]">No salaries found</h3>
        <p className="text-[#717171] max-w-sm mt-1.5 text-sm">
          We couldn't find any compensation records matching your current filters.
        </p>
      </div>
    );
  }

  return (
    <div className="airbnb-card overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm whitespace-nowrap">
          <thead className="bg-[#F7F7F7] border-b border-[#DDDDDD]">
            <tr>
              {!hideCompany && (
                <th className="px-6 py-4 text-xs font-semibold text-[#717171] uppercase tracking-wider">
                  Company
                </th>
              )}
              <th className="px-6 py-4 text-xs font-semibold text-[#717171] uppercase tracking-wider">
                Role
              </th>
              <th className="px-6 py-4 text-xs font-semibold text-[#717171] uppercase tracking-wider">
                Level
              </th>
              <th className="px-6 py-4 text-xs font-semibold text-[#717171] uppercase tracking-wider">
                Location
              </th>
              <th className="px-6 py-4 text-xs font-semibold text-[#717171] uppercase tracking-wider">
                Experience
              </th>
              <th className="px-6 py-4 text-xs font-semibold text-[#717171] uppercase tracking-wider text-right">
                Total Comp
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#DDDDDD]/60">
            {salaries.map((s) => (
              <tr
                key={s.id}
                className="hover:bg-[#F7F7F7] transition-colors duration-150 group"
              >
                {!hideCompany && (
                  <td className="px-6 py-4">
                    <Link
                      href={`/companies/${s.normalized_company}`}
                      className="font-semibold text-[#222222] group-hover:text-[#FF385C] transition-colors hover:underline"
                    >
                      {s.company}
                    </Link>
                  </td>
                )}
                <td className="px-6 py-4 font-medium text-[#222222]">{s.role}</td>
                <td className="px-6 py-4">
                  <Badge variant="brand">{s.level_standardized}</Badge>
                </td>
                <td className="px-6 py-4 text-[#717171]">{s.location}</td>
                <td className="px-6 py-4 text-[#717171]">{s.experience_years} yrs</td>
                <td className="px-6 py-4 text-right">
                  <span className="font-bold text-[#222222]">
                    ${s.total_compensation.toLocaleString()}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
