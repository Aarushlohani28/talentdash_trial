import Link from "next/link";
import { notFound } from "next/navigation";
import { SalaryTable } from "@/components/salaries/SalaryTable";
import prisma from "@/lib/db";

// generateStaticParams calls Prisma directly at BUILD TIME only — this is standard Next.js pattern
export async function generateStaticParams() {
  const distinctCompanies = await prisma.salary.findMany({
    select: { normalized_company: true },
    distinct: ["normalized_company"],
  });
  return distinctCompanies.map((c) => ({ slug: c.normalized_company }));
}

interface PageProps {
  params: Promise<{ slug: string }>;
}

async function getCompanyData(slug: string) {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL ?? "http://localhost:3000"}/api/companies/${slug}`,
    { next: { revalidate: 300 } }
  );
  if (res.status === 404) return null;
  if (!res.ok) throw new Error("Failed to fetch company data");
  return res.json() as Promise<{
    company: string;
    normalized_company: string;
    totalRecords: number;
    medianTc: number;
    levelDistribution: Record<string, number>;
    salaries: any[];
  }>;
}

export default async function CompanyPage({ params }: PageProps) {
  const { slug } = await params;
  const data = await getCompanyData(slug.toLowerCase());

  if (!data) notFound();

  const { company, totalRecords, medianTc, levelDistribution, salaries } = data;

  return (
    <main className="min-h-screen p-8 bg-gradient-to-br from-slate-50 to-violet-50/40 text-slate-900">
      <div className="max-w-6xl mx-auto space-y-8">
        <header className="space-y-6">
          <Link href="/" className="inline-flex items-center text-indigo-600 hover:text-indigo-800 transition-colors font-medium">
            <svg className="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back home
          </Link>

          <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-xl shadow-indigo-100/50 border border-white/50 p-10 flex flex-col md:flex-row gap-8 items-start justify-between relative overflow-hidden">
            <div className="absolute -top-24 -right-24 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
            <div className="space-y-2 z-10">
              <h1 className="text-5xl font-black tracking-tight text-slate-900 capitalize">{company}</h1>
              <p className="text-lg text-slate-500 font-medium">{totalRecords} verified compensation records</p>
            </div>
            <div className="z-10 bg-indigo-50 border border-indigo-100 rounded-2xl p-6 flex flex-col items-center justify-center min-w-[200px] shadow-sm">
              <span className="text-sm font-semibold text-indigo-600 uppercase tracking-wider mb-1">Median TC</span>
              <span className="text-4xl font-extrabold text-indigo-900">${(medianTc / 1000).toFixed(0)}k</span>
            </div>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <aside className="lg:col-span-1">
            <div className="bg-white/70 backdrop-blur-md rounded-2xl shadow-lg shadow-slate-200/40 border border-white/50 p-6 sticky top-8">
              <h3 className="text-lg font-bold text-slate-800 mb-6 border-b border-slate-100 pb-3">Level Distribution</h3>
              <div className="space-y-4">
                {Object.entries(levelDistribution).sort().map(([level, count]) => (
                  <div key={level} className="space-y-1.5">
                    <div className="flex justify-between text-sm">
                      <span className="font-semibold text-slate-700">{level}</span>
                      <span className="text-slate-500">{count} {count === 1 ? "record" : "records"}</span>
                    </div>
                    <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
                      <div
                        className="bg-indigo-500 h-2.5 rounded-full"
                        style={{ width: `${(count / totalRecords) * 100}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </aside>
          <section className="lg:col-span-3">
            <SalaryTable salaries={salaries} hideCompany={true} />
          </section>
        </div>
      </div>
    </main>
  );
}
