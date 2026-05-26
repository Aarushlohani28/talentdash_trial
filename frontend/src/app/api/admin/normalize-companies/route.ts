import { NextResponse } from "next/server";
import prisma from "@/lib/db";
import { normalizeCompanyName } from "@/lib/normalization/company";

export const dynamic = "force-dynamic";

export async function POST() {
  try {
    // Fetch all salaries with their current company names
    const salaries = await prisma.salary.findMany({
      select: { id: true, company: true, normalized_company: true },
    });

    let updated = 0;
    const updates: Promise<any>[] = [];

    for (const salary of salaries) {
      const freshNormalized = normalizeCompanyName(salary.company);
      if (freshNormalized !== salary.normalized_company) {
        updates.push(
          prisma.salary.update({
            where: { id: salary.id },
            data: { normalized_company: freshNormalized },
          })
        );
        updated++;
      }
    }

    await Promise.all(updates);

    // Build a summary of distinct normalized companies after the fix
    const distinctCompanies = await prisma.salary.findMany({
      select: { normalized_company: true, company: true },
      distinct: ["normalized_company"],
    });

    return NextResponse.json({
      message: "Normalization complete",
      recordsUpdated: updated,
      totalDistinctCompanies: distinctCompanies.length,
      companies: distinctCompanies.map((c) => ({
        normalized: c.normalized_company,
        sample: c.company,
      })),
    });
  } catch (error) {
    console.error("Normalize Error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
