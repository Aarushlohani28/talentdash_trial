import Link from "next/link";
import { SalaryTable } from "@/components/salaries/SalaryTable";
import { SalaryFilters } from "@/components/salaries/SalaryFilters";
import { Level } from "@prisma/client";
import SalaryIngestSection from "@/components/salaries/SalaryIngestSection";

interface PageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

import prisma from "@/lib/db";

async function getSalaries(searchParams: Record<string, string | string[] | undefined>) {
  const levelParam = typeof searchParams.level === "string" ? searchParams.level : "";
  const locationParam = typeof searchParams.location === "string" ? searchParams.location : "";
  const roleParam = typeof searchParams.role === "string" ? searchParams.role : "";
  const pageParam = typeof searchParams.page === "string" ? searchParams.page : "1";

  const page = Math.max(1, parseInt(pageParam, 10));
  const limit = 20;

  const where: any = {};
  if (levelParam && Object.values(Level).includes(levelParam as Level)) {
    where.level_standardized = levelParam as Level;
  }
  if (locationParam) {
    where.location = { contains: locationParam, mode: "insensitive" };
  }
  if (roleParam) {
    where.role = { contains: roleParam, mode: "insensitive" };
  }

  const skip = (page - 1) * limit;

  const [data, total] = await Promise.all([
    prisma.salary.findMany({
      where,
      orderBy: { created_at: "desc" },
      skip,
      take: limit,
    }),
    prisma.salary.count({ where }),
  ]);

  return {
    data,
    meta: { total, page, limit, totalPages: Math.ceil(total / limit) },
  };
}

export default async function SalariesPage({ searchParams }: PageProps) {
  const resolvedParams = await searchParams;
  const { data: salaries, meta } = await getSalaries(resolvedParams);

  return (
    <main className="min-h-screen bg-white page-wrapper">
      {/* Page header */}
      <div className="border-b border-[#DDDDDD] bg-white">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              <h1 className="text-3xl font-extrabold text-[#222222] tracking-tight">
                Compensation Intelligence
              </h1>
              <p className="text-[#717171] mt-1.5">
                Showing{" "}
                <span className="font-semibold text-[#222222]">{salaries.length}</span>{" "}
                of{" "}
                <span className="font-semibold text-[#222222]">{meta.total.toLocaleString()}</span>{" "}
                records
              </p>
            </div>
            <div className="flex items-center gap-3">
              <Link
                href="/compare"
                id="compare-tc-btn"
                className="inline-flex items-center gap-2 bg-white hover:bg-[#F7F7F7] text-[#222222] font-semibold text-sm px-5 py-2.5 rounded-full border-2 border-[#DDDDDD] hover:border-[#222222] transition-all"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 21L3 16.5m0 0L7.5 12M3 16.5h13.5m0-13.5L21 7.5m0 0L16.5 12M21 7.5H7.5" />
                </svg>
                Compare TC
              </Link>
              <SalaryIngestSection />
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8 space-y-6">
        {/* Filters */}
        <SalaryFilters />

        {/* Table */}
        <SalaryTable salaries={salaries} />

        {/* Pagination */}
        {meta.totalPages > 1 && (
          <nav className="flex justify-center items-center gap-2 mt-8 flex-wrap" aria-label="Pagination">
            {Array.from({ length: meta.totalPages }, (_, i) => i + 1).map((p) => (
              <Link
                key={p}
                href={`?page=${p}${typeof resolvedParams.level === "string" ? `&level=${resolvedParams.level}` : ""}`}
                aria-current={p === meta.page ? "page" : undefined}
                className={`w-10 h-10 flex items-center justify-center rounded-full text-sm font-semibold transition-all ${
                  p === meta.page
                    ? "bg-[#222222] text-white"
                    : "bg-white text-[#717171] border border-[#DDDDDD] hover:border-[#222222] hover:text-[#222222]"
                }`}
              >
                {p}
              </Link>
            ))}
          </nav>
        )}
      </div>
    </main>
  );
}
