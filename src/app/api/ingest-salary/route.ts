import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import prisma from "@/lib/db";
import { normalizeCompanyName } from "@/lib/normalization/company";
import { computeConfidenceScore } from "@/lib/analytics/confidence";
import { Level } from "@prisma/client";

// Ensure this route is always dynamically handled (never cached)
export const dynamic = "force-dynamic";

const IngestSalarySchema = z.object({
  company: z.string().min(1, "Company name is required"),
  role: z.string().min(1, "Role is required"),
  level: z.string().min(1, "Level is required"),
  location: z.string().min(1, "Location is required"),
  experience_years: z.number().min(0, "Experience cannot be negative"),
  base_salary: z.number().min(0, "Base salary must be positive"),
  bonus: z.number().min(0).optional().default(0),
  stock: z.number().min(0).optional().default(0),
});

// A simple mapper to map raw inputs to our L3-L8 standard
function mapToStandardLevel(rawLevel: string): Level | null {
  const normalized = rawLevel.toUpperCase().trim().replace(/\s+/g, "_");
  if (Object.values(Level).includes(normalized as Level)) {
    return normalized as Level;
  }
  
  // Basic heuristic mapping for common titles
  if (normalized.includes("JUNIOR") || normalized === "SDE_I" || normalized === "L3") return Level.L3;
  if (normalized === "SDE_II" || normalized === "MID" || normalized === "L4") return Level.L4;
  if (normalized === "SENIOR" || normalized === "SDE_III" || normalized === "L5") return Level.L5;
  if (normalized.includes("STAFF") || normalized === "L6") return Level.L6;
  if (normalized.includes("SENIOR_STAFF") || normalized === "L7") return Level.L7;
  if (normalized.includes("PRINCIPAL") || normalized === "L8") return Level.L8;

  return null;
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = IngestSalarySchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid payload", issues: parsed.error.issues },
        { status: 400 }
      );
    }

    const { company, role, level, location, experience_years, base_salary, bonus, stock } = parsed.data;

    const level_standardized = mapToStandardLevel(level);
    if (!level_standardized) {
      return NextResponse.json(
        { error: `Could not map level '${level}' to standard bands (L3-L8)` },
        { status: 400 }
      );
    }

    const total_compensation = base_salary + bonus + stock;
    const confidence_score = computeConfidenceScore({ base_salary, bonus, stock });
    const normalized_company = normalizeCompanyName(company);

    const salary = await prisma.salary.create({
      data: {
        company,
        normalized_company,
        role,
        level_standardized,
        location,
        experience_years,
        base_salary,
        bonus,
        stock,
        total_compensation,
        confidence_score,
      },
    });

    return NextResponse.json({ data: salary }, { status: 201 });
  } catch (error: any) {
    console.error("Ingest Error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
