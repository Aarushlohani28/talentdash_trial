import Link from "next/link";
import prisma from "@/lib/db";

export default async function Home() {
  const count = await prisma.salary.count();

  // Get distinct companies
  const distinctCompanies = await prisma.salary.findMany({
    select: { company: true, normalized_company: true },
    distinct: ["normalized_company"],
    take: 12,
  });

  const stats = await prisma.salary.aggregate({
    _avg: { total_compensation: true },
    _max: { total_compensation: true },
  });

  const avgTc = stats._avg.total_compensation ?? 0;

  return (
    <main className="page-wrapper">
      {/* Hero Section */}
      <section className="relative bg-white overflow-hidden">
        {/* Subtle background decoration */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute -top-32 -right-32 w-[600px] h-[600px] rounded-full bg-gradient-to-br from-[#FF385C]/8 to-[#FF5A5F]/4 blur-3xl" />
          <div className="absolute -bottom-24 -left-24 w-[400px] h-[400px] rounded-full bg-gradient-to-tr from-[#FF385C]/6 to-transparent blur-3xl" />
        </div>

        <div className="max-w-7xl mx-auto px-6 pt-20 pb-24 relative">
          <div className="max-w-4xl">
            {/* Live badge */}
            <div className="inline-flex items-center gap-2 bg-[#FFF0F3] border border-[#FFD0D9] text-[#C60845] text-sm font-medium px-4 py-1.5 rounded-full mb-8">
              <span className="w-2 h-2 rounded-full bg-[#FF385C] animate-pulse" />
              {count.toLocaleString()} verified salary records
            </div>

            <h1 className="text-5xl md:text-7xl font-extrabold text-[#222222] leading-[1.1] tracking-tight mb-6">
              Know your worth.{" "}
              <span className="gradient-text">
                Get paid fairly.
              </span>
            </h1>

            <p className="text-xl text-[#717171] max-w-2xl leading-relaxed mb-10 font-normal">
              Browse real, community-submitted compensation data from top tech companies. 
              Transparent salary insights to help you negotiate with confidence.
            </p>

            <div className="flex flex-wrap gap-4">
              <Link
                href="/salaries"
                id="hero-explore-btn"
                className="inline-flex items-center gap-2 bg-[#FF385C] hover:bg-[#E31C5F] text-white font-semibold text-base px-8 py-4 rounded-full transition-all shadow-lg shadow-[#FF385C]/30 hover:shadow-xl hover:shadow-[#FF385C]/40 hover:-translate-y-0.5"
              >
                Explore All Salaries
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                </svg>
              </Link>
              <Link
                href="/compare"
                id="hero-compare-btn"
                className="inline-flex items-center gap-2 bg-white hover:bg-[#F7F7F7] text-[#222222] font-semibold text-base px-8 py-4 rounded-full border-2 border-[#DDDDDD] hover:border-[#222222] transition-all"
              >
                Compare TC
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 21L3 16.5m0 0L7.5 12M3 16.5h13.5m0-13.5L21 7.5m0 0L16.5 12M21 7.5H7.5" />
                </svg>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats bar */}
      <section className="border-y border-[#DDDDDD] bg-[#F7F7F7]">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex flex-wrap gap-8 md:gap-16 items-center justify-center md:justify-start">
            {[
              { label: "Salary Records", value: count.toLocaleString() },
              { label: "Companies", value: `${distinctCompanies.length}+` },
              { label: "Avg Total Comp", value: `$${(avgTc / 1000).toFixed(0)}k` },
              { label: "Community Driven", value: "100%" },
            ].map((stat) => (
              <div key={stat.label} className="text-center md:text-left">
                <p className="text-2xl font-bold text-[#222222]">{stat.value}</p>
                <p className="text-sm text-[#717171] mt-0.5">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Company Grid Section */}
      <section className="max-w-7xl mx-auto px-6 py-20">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-bold text-[#222222]">Browse by company</h2>
            <p className="text-[#717171] mt-1">Explore verified compensation data from top employers</p>
          </div>
          <Link
            href="/salaries"
            className="hidden sm:inline-flex items-center gap-1 text-sm font-semibold text-[#222222] underline underline-offset-2 hover:text-[#FF385C] transition-colors"
          >
            View all
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
            </svg>
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {distinctCompanies.map((c, i) => (
            <Link
              key={c.normalized_company}
              href={`/companies/${c.normalized_company}`}
              className="airbnb-card group p-5 flex flex-col gap-3"
              style={{ animationDelay: `${i * 50}ms` }}
              id={`company-card-${c.normalized_company}`}
            >
              {/* Company avatar */}
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#FF385C]/10 to-[#FF5A5F]/5 flex items-center justify-center border border-[#FF385C]/10">
                <span className="text-lg font-bold text-[#FF385C]">
                  {c.company.charAt(0).toUpperCase()}
                </span>
              </div>
              <div>
                <p className="font-semibold text-[#222222] group-hover:text-[#FF385C] transition-colors text-sm leading-tight">
                  {c.company}
                </p>
                <p className="text-xs text-[#717171] mt-0.5">View salaries →</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section className="bg-[#F7F7F7] border-t border-[#DDDDDD]">
        <div className="max-w-7xl mx-auto px-6 py-20">
          <div className="text-center mb-14">
            <h2 className="text-3xl font-bold text-[#222222]">How TalentDash works</h2>
            <p className="text-[#717171] mt-3 text-lg">Transparent data, real insights</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: (
                  <svg className="w-7 h-7 text-[#FF385C]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                ),
                title: "Browse & Filter",
                desc: "Search salaries by company, role, level, and location across hundreds of verified records.",
              },
              {
                icon: (
                  <svg className="w-7 h-7 text-[#FF385C]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                ),
                title: "Compare Offers",
                desc: "Side-by-side compensation breakdowns — base, bonus, stock, and total comp in one view.",
              },
              {
                icon: (
                  <svg className="w-7 h-7 text-[#FF385C]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                ),
                title: "Contribute",
                desc: "Add your own salary data anonymously to help the community make better decisions.",
              },
            ].map((item) => (
              <div key={item.title} className="airbnb-card p-8">
                <div className="w-14 h-14 rounded-2xl bg-[#FFF0F3] flex items-center justify-center mb-5">
                  {item.icon}
                </div>
                <h3 className="text-lg font-bold text-[#222222] mb-2">{item.title}</h3>
                <p className="text-[#717171] leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="max-w-7xl mx-auto px-6 py-20">
        <div className="bg-gradient-to-r from-[#FF385C] to-[#BD1E59] rounded-3xl p-12 text-center text-white">
          <h2 className="text-3xl md:text-4xl font-extrabold mb-4">Ready to know your worth?</h2>
          <p className="text-white/80 text-lg mb-8 max-w-xl mx-auto">
            Join thousands of tech workers who use TalentDash to negotiate better offers.
          </p>
          <Link
            href="/salaries"
            className="inline-flex items-center gap-2 bg-white text-[#FF385C] font-bold text-base px-8 py-4 rounded-full hover:bg-[#F7F7F7] transition-all shadow-lg hover:-translate-y-0.5"
          >
            Get Started Free
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
            </svg>
          </Link>
        </div>
      </section>
    </main>
  );
}
