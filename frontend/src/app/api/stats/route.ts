import { NextResponse } from "next/server";
import prisma from "@/lib/db";

export const dynamic = "force-dynamic";

function median(values: number[]): number {
  if (values.length === 0) return 0;
  const sorted = [...values].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  return sorted.length % 2 !== 0
    ? sorted[mid]
    : Math.round((sorted[mid - 1] + sorted[mid]) / 2);
}

export async function GET() {
  try {
    const [totalRecords, allSalaries] = await Promise.all([
      prisma.salary.count(),
      prisma.salary.findMany({
        select: { normalized_company: true, company: true, total_compensation: true },
      }),
    ]);

    // Group by normalized_company
    const companyMap = new Map<string, { name: string; tcs: number[] }>();
    for (const s of allSalaries) {
      if (!companyMap.has(s.normalized_company)) {
        companyMap.set(s.normalized_company, { name: s.company, tcs: [] });
      }
      companyMap.get(s.normalized_company)!.tcs.push(s.total_compensation);
    }

    const uniqueCompanies = companyMap.size;

    const topCompanies = Array.from(companyMap.entries())
      .map(([, { name, tcs }]) => ({ name, medianTC: median(tcs) }))
      .sort((a, b) => b.medianTC - a.medianTC)
      .slice(0, 10);

    return NextResponse.json({ totalRecords, uniqueCompanies, topCompanies });
  } catch (error) {
    console.error("Stats Error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
