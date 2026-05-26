import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
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
  const salaries = await prisma.salary.findMany({
    where: { normalized_company: slug },
    orderBy: { created_at: "desc" },
  });

  if (salaries.length === 0) return null;

  const sorted = salaries.map((s) => s.total_compensation).sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  const medianTc =
    sorted.length % 2 !== 0 ? sorted[mid] : Math.round((sorted[mid - 1] + sorted[mid]) / 2);

  const levelDistribution = salaries.reduce(
    (acc, curr) => {
      acc[curr.level_standardized] = (acc[curr.level_standardized] || 0) + 1;
      return acc;
    },
    {} as Record<string, number>
  );

  const avgBase =
    salaries.reduce((sum, s) => sum + s.base_salary, 0) / salaries.length;

  return {
    company: salaries[0].company,
    normalized_company: slug,
    totalRecords: salaries.length,
    medianTc,
    avgBase,
    levelDistribution,
    salaries,
  };
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const company = slug.charAt(0).toUpperCase() + slug.slice(1);
  return {
    title: `${company} Salaries & Compensation | TalentDash`,
    description: `Browse verified compensation data for ${company}. See base salary, bonus, stock, and total compensation broken down by level and role.`,
  };
}

export default async function CompanyPage({ params }: PageProps) {
  const { slug } = await params;
  const data = await getCompanyData(slug.toLowerCase());

  if (!data) notFound();

  const { company, normalized_company, totalRecords, medianTc, avgBase, levelDistribution, salaries } = data;

  // JSON-LD structured data for SEO
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Dataset",
    name: `${company} Compensation Data`,
    description: `Verified salary and compensation records for ${company}, including base salary, bonus, stock, and total compensation by level.`,
    url: `https://talentdash.vercel.app/companies/${normalized_company}`,
    keywords: [company, "salary", "compensation", "tech salary", "total compensation"],
    creator: {
      "@type": "Organization",
      name: "TalentDash",
    },
    variableMeasured: [
      { "@type": "PropertyValue", name: "Median Total Compensation", value: medianTc },
      { "@type": "PropertyValue", name: "Number of Records", value: totalRecords },
    ],
  };

  return (
    <main className="min-h-screen bg-white page-wrapper">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Company hero header */}
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

          <div className="flex flex-col md:flex-row gap-8 items-start md:items-center justify-between">
            <div className="flex items-center gap-5">
              {/* Company avatar */}
              <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-[#FFF0F3] to-[#FFE4EB] border border-[#FFD0D9] flex items-center justify-center shadow-sm flex-shrink-0">
                <span className="text-3xl font-extrabold text-[#FF385C]">
                  {company.charAt(0).toUpperCase()}
                </span>
              </div>
              <div>
                <h1 className="text-4xl font-extrabold text-[#222222] capitalize">{company}</h1>
                <p className="text-[#717171] mt-1">
                  <span className="font-semibold text-[#222222]">{totalRecords}</span> verified compensation records
                </p>
              </div>
            </div>

            {/* Stats pills */}
            <div className="flex flex-wrap gap-4">
              <div className="bg-[#F7F7F7] border border-[#DDDDDD] rounded-2xl px-6 py-4 text-center">
                <p className="text-xs font-semibold text-[#717171] uppercase tracking-wider mb-1">Median TC</p>
                <p className="text-2xl font-extrabold text-[#FF385C]">
                  ${(medianTc / 1000).toFixed(0)}k
                </p>
              </div>
              <div className="bg-[#F7F7F7] border border-[#DDDDDD] rounded-2xl px-6 py-4 text-center">
                <p className="text-xs font-semibold text-[#717171] uppercase tracking-wider mb-1">Avg Base</p>
                <p className="text-2xl font-extrabold text-[#222222]">
                  ${(avgBase / 1000).toFixed(0)}k
                </p>
              </div>
              <div className="bg-[#F7F7F7] border border-[#DDDDDD] rounded-2xl px-6 py-4 text-center">
                <p className="text-xs font-semibold text-[#717171] uppercase tracking-wider mb-1">Records</p>
                <p className="text-2xl font-extrabold text-[#222222]">{totalRecords}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <aside className="lg:col-span-1">
            <div className="airbnb-card p-6 sticky top-24">
              <h3 className="text-base font-bold text-[#222222] mb-5 pb-4 border-b border-[#DDDDDD]">
                Level Distribution
              </h3>
              <div className="space-y-4">
                {Object.entries(levelDistribution)
                  .sort()
                  .map(([level, count]) => (
                    <div key={level} className="space-y-2">
                      <div className="flex justify-between items-center text-sm">
                        <span className="font-semibold text-[#222222]">{level}</span>
                        <span className="text-[#717171] text-xs">
                          {count} {count === 1 ? "record" : "records"}
                        </span>
                      </div>
                      <div className="w-full bg-[#F7F7F7] rounded-full h-2 overflow-hidden">
                        <div
                          className="bg-[#FF385C] h-2 rounded-full transition-all duration-700"
                          style={{ width: `${(count / totalRecords) * 100}%` }}
                        />
                      </div>
                    </div>
                  ))}
              </div>

              <div className="mt-6 pt-5 border-t border-[#DDDDDD]">
                <Link
                  href="/compare"
                  className="w-full inline-flex items-center justify-center gap-2 bg-[#FF385C] hover:bg-[#E31C5F] text-white font-semibold text-sm px-4 py-2.5 rounded-full transition-all"
                >
                  Compare with others
                </Link>
              </div>
            </div>
          </aside>

          {/* Table */}
          <section className="lg:col-span-3">
            <SalaryTable salaries={salaries} hideCompany={true} />
          </section>
        </div>
      </div>
    </main>
  );
}
