-- CreateEnum
CREATE TYPE "Level" AS ENUM ('L3', 'L4', 'L5', 'L6', 'L7', 'L8');

-- CreateTable
CREATE TABLE "Salary" (
    "id" TEXT NOT NULL,
    "company" TEXT NOT NULL,
    "normalized_company" TEXT NOT NULL,
    "role" TEXT NOT NULL,
    "level_standardized" "Level" NOT NULL,
    "location" TEXT NOT NULL,
    "experience_years" INTEGER NOT NULL,
    "base_salary" INTEGER NOT NULL,
    "bonus" INTEGER NOT NULL,
    "stock" INTEGER NOT NULL,
    "total_compensation" INTEGER NOT NULL,
    "confidence_score" DOUBLE PRECISION NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Salary_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Salary_normalized_company_idx" ON "Salary"("normalized_company");

-- CreateIndex
CREATE INDEX "Salary_level_standardized_idx" ON "Salary"("level_standardized");

-- CreateIndex
CREATE INDEX "Salary_location_idx" ON "Salary"("location");

-- CreateIndex
CREATE INDEX "Salary_total_compensation_idx" ON "Salary"("total_compensation");
