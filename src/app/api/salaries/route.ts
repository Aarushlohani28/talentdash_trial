import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";
import { Level } from "@prisma/client";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);

  const page = Math.max(1, parseInt(searchParams.get("page") || "1", 10));
  const limit = Math.min(100, Math.max(1, parseInt(searchParams.get("limit") || "20", 10)));
  const sortBy = searchParams.get("sort") === "total_compensation" ? "total_compensation" : "created_at";
  const sortOrder = searchParams.get("order") === "asc" ? "asc" : "desc";

  const company = searchParams.get("company");
  const role = searchParams.get("role");
  const level = searchParams.get("level");
  const location = searchParams.get("location");

  const where: any = {};
  if (company) {
    where.normalized_company = company.toLowerCase();
  }
  if (role) {
    where.role = { contains: role, mode: "insensitive" };
  }
  if (level && Object.values(Level).includes(level as Level)) {
    where.level_standardized = level as Level;
  }
  if (location) {
    where.location = { contains: location, mode: "insensitive" };
  }

  try {
    const skip = (page - 1) * limit;

    const [data, total] = await Promise.all([
      prisma.salary.findMany({
        where,
        orderBy: { [sortBy]: sortOrder },
        skip,
        take: limit,
      }),
      prisma.salary.count({ where }),
    ]);

    return NextResponse.json(
      {
        data,
        meta: {
          total,
          page,
          limit,
          totalPages: Math.ceil(total / limit),
        },
      },
      {
        headers: {
          // Publicly cacheable, revalidated every 60 seconds by CDN
          "Cache-Control": "public, s-maxage=60, stale-while-revalidate=300",
        },
      }
    );
  } catch (error) {
    console.error("Fetch Salaries Error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
