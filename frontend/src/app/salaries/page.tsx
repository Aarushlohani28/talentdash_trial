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
    <main className="min-h-screen p-8 bg-gradient-to-br from-slate-50 to-indigo-50/30 text-slate-900">
      <div className="max-w-6xl mx-auto space-y-8">
        <header className="flex justify-between items-end">
          <div className="space-y-3">
            <Link href="/" className="inline-flex items-center text-indigo-600 hover:text-indigo-800 transition-colors font-medium">
              <svg className="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Back home
            </Link>
            <h1 className="text-4xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-indigo-700 to-violet-600">
              Compensation Intelligence
            </h1>
            <p className="text-slate-500 text-lg">
              Showing {salaries.length} of {meta.total} records
            </p>
          </div>
          <SalaryIngestSection />
        </header>

        <section className="space-y-6">
          <SalaryFilters />
          <SalaryTable salaries={salaries} />

          {meta.totalPages > 1 && (
            <div className="flex justify-center gap-3 mt-8 flex-wrap">
              {Array.from({ length: meta.totalPages }, (_, i) => i + 1).map((p) => (
                <Link
                  key={p}
                  href={`?page=${p}${typeof resolvedParams.level === "string" ? `&level=${resolvedParams.level}` : ""}`}
                  className={`px-4 py-2 rounded-lg border font-medium text-sm transition-all ${
                    p === meta.page
                      ? "bg-indigo-600 text-white border-indigo-600 shadow-md"
                      : "bg-white text-slate-700 border-slate-200 hover:border-indigo-400"
                  }`}
                >
                  {p}
                </Link>
              ))}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
