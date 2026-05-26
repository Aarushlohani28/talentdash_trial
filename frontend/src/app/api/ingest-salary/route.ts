import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import prisma from "@/lib/db";
import { normalizeCompanyName } from "@/lib/normalization/company";
import { Level } from "@prisma/client";

// Ensure this route is always dynamically handled (never cached)
export const dynamic = "force-dynamic";

const levelMap: Record<string, Level> = {
  "L3": Level.L3,
  "L4": Level.L4,
  "L5": Level.L5,
  "L6": Level.L6,
  "SDE-I": Level.SDE_I,
  "SDE-II": Level.SDE_II,
  "SDE-III": Level.SDE_III,
  "Staff": Level.Staff,
  "Principal": Level.Principal,
};

const IngestSalarySchema = z.object({
  company: z.string().min(1, "Company name is required").transform(s => s.toLowerCase().trim()),
  role: z.string().min(1, "Role is required"),
  level_standardized: z.enum(["L3", "L4", "L5", "L6", "SDE-I", "SDE-II", "SDE-III", "Staff", "Principal"] as const, {
    message: "Invalid level_standardized",
  }).transform(val => levelMap[val]),
  location: z.string().min(1, "Location is required"),
  experience_years: z.number().int("Must be integer").min(0, "Experience cannot be negative").max(50, "Experience max 50"),
  base_salary: z.number().positive("Base salary must be positive"),
  bonus: z.number().min(0).optional().default(0),
  stock: z.number().min(0).optional().default(0),
  confidence_score: z.number().min(0.0).max(1.0, "Confidence score must be between 0.0 and 1.0"),
});

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

    const { company, role, level_standardized, location, experience_years, base_salary, bonus, stock, confidence_score } = parsed.data;

    const total_compensation = base_salary + bonus + stock;
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
