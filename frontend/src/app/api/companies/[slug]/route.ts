import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";

interface Params {
  params: Promise<{ slug: string }>;
}

export async function GET(_req: NextRequest, { params }: Params) {
  const { slug } = await params;
  const normalizedSlug = slug.toLowerCase();

  try {
    const salaries = await prisma.salary.findMany({
      where: { normalized_company: normalizedSlug },
      orderBy: { created_at: "desc" },
    });

    if (salaries.length === 0) {
      return NextResponse.json(
        { error: `Company '${slug}' not found` },
        { status: 404 }
      );
    }

    // Compute median TC
    const sorted = salaries.map((s) => s.total_compensation).sort((a, b) => a - b);
    const mid = Math.floor(sorted.length / 2);
    const medianTc =
      sorted.length % 2 !== 0 ? sorted[mid] : Math.round((sorted[mid - 1] + sorted[mid]) / 2);

    // Level distribution
    const levelDistribution = salaries.reduce(
      (acc, curr) => {
        acc[curr.level_standardized] = (acc[curr.level_standardized] || 0) + 1;
        return acc;
      },
      {} as Record<string, number>
    );

    return NextResponse.json(
      {
        company: salaries[0].company,
        normalized_company: normalizedSlug,
        totalRecords: salaries.length,
        medianTc,
        levelDistribution,
        salaries,
      },
      {
        headers: {
          // Company pages are fairly stable — cache for 5 minutes
          "Cache-Control": "public, s-maxage=300, stale-while-revalidate=600",
        },
      }
    );
  } catch (error) {
    console.error("Company fetch error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
