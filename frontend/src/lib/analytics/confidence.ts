import { Salary } from '@prisma/client';

/**
 * Computes a confidence score (0.0 to 1.0) for a salary record based on completeness and logical consistency.
 * A real application would compare against aggregated distributions, but for MVP we use heuristics.
 */
export function computeConfidenceScore(data: Partial<Salary>): number {
  let score = 0.5; // Base score

  // Reward completeness
  if (data.base_salary && data.base_salary > 0) score += 0.2;
  if (data.bonus !== undefined) score += 0.05;
  if (data.stock !== undefined) score += 0.05;

  // Penalty for unusual ratios
  if (data.base_salary && data.total_compensation) {
    if (data.total_compensation < data.base_salary) {
      // Impossible, total comp should be at least base
      score -= 0.3;
    } else if (data.total_compensation > data.base_salary * 5) {
      // Extremely high non-base compensation (could be real for high levels, but lowers confidence slightly for typical entries)
      score -= 0.1;
    }
  }

  // Ensure score is within [0, 1] range
  return Math.max(0, Math.min(1, Number(score.toFixed(2))));
}
