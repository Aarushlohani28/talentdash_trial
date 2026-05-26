import Link from "next/link";
import prisma from "@/lib/db";

export default async function Home() {
  const count = await prisma.salary.count();
  
  // Get distinct companies
  const distinctCompanies = await prisma.salary.findMany({
    select: { company: true, normalized_company: true },
    distinct: ['normalized_company'],
    take: 12,
  });

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-900 via-indigo-900 to-slate-900 text-white overflow-hidden relative">
      {/* Decorative background blurs */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-indigo-500/20 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-violet-600/20 rounded-full blur-[120px] pointer-events-none" />
      
      <div className="max-w-6xl mx-auto px-6 py-24 relative z-10">
        <div className="flex flex-col items-center text-center space-y-8 mb-24">
          <div className="inline-flex items-center px-3 py-1 rounded-full bg-white/10 border border-white/20 backdrop-blur-md text-sm font-medium text-indigo-200 mb-4">
            <span className="w-2 h-2 rounded-full bg-emerald-400 mr-2 animate-pulse"></span>
            Database Live & Connected
          </div>
          
          <h1 className="text-6xl md:text-8xl font-black tracking-tight leading-tight">
            Discover Real <br className="hidden md:block"/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-violet-400">
              Compensation
            </span>
          </h1>
          
          <p className="text-xl md:text-2xl text-slate-300 max-w-2xl font-light">
            Empowering tech workers with transparent, verified salary data. Based on {count} community submissions.
          </p>
          
          <div className="pt-8">
            <Link 
              href="/salaries" 
              className="inline-flex items-center justify-center bg-white text-indigo-900 font-bold text-lg px-8 py-4 rounded-xl shadow-[0_0_40px_rgba(255,255,255,0.3)] hover:shadow-[0_0_60px_rgba(255,255,255,0.5)] transition-all hover:scale-105 active:scale-95"
            >
              Explore All Salaries
              <svg className="w-5 h-5 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </Link>
          </div>
        </div>

        <div className="space-y-6">
          <h3 className="text-center text-sm font-semibold tracking-widest text-slate-400 uppercase">
            Browse by Top Companies
          </h3>
          <div className="flex flex-wrap justify-center gap-4">
            {distinctCompanies.map((c) => (
              <Link
                key={c.normalized_company}
                href={`/companies/${c.normalized_company}`}
                className="px-6 py-3 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 backdrop-blur-sm transition-all font-medium text-slate-200 hover:text-white"
              >
                {c.company}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
