"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useState } from "react";

export function SalaryFilters() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [level, setLevel] = useState(searchParams.get("level") || "");

  const handleApply = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      const params = new URLSearchParams(searchParams.toString());

      if (level) params.set("level", level);
      else params.delete("level");

      // Reset to page 1 on new filter
      params.delete("page");

      router.push(`?${params.toString()}`);
    },
    [level, router, searchParams]
  );

  const handleClear = useCallback(() => {
    setLevel("");
    router.push(`?`);
  }, [router]);

  return (
    <form
      onSubmit={handleApply}
      className="airbnb-card p-5 flex flex-wrap gap-4 items-end"
      aria-label="Filter salaries"
    >
      <div className="flex items-center gap-2 text-sm font-semibold text-[#717171]">
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
        </svg>
        Filters
      </div>

      <div className="flex-1 min-w-[200px]">
        <label className="block text-xs font-semibold text-[#717171] uppercase tracking-wider mb-1.5">
          Level
        </label>
        <select
          id="filter-level"
          value={level}
          onChange={(e) => setLevel(e.target.value)}
          className="airbnb-input text-sm"
        >
          <option value="">All Levels</option>
          <option value="L3">L3</option>
          <option value="L4">L4</option>
          <option value="L5">L5</option>
          <option value="L6">L6</option>
          <option value="L7">L7</option>
          <option value="L8">L8</option>
        </select>
      </div>

      <div className="flex gap-2">
        <button
          type="submit"
          id="filter-apply-btn"
          className="bg-[#222222] hover:bg-[#000000] text-white font-semibold text-sm py-2.5 px-6 rounded-full transition-all"
        >
          Apply
        </button>
        <button
          type="button"
          id="filter-clear-btn"
          onClick={handleClear}
          className="bg-white hover:bg-[#F7F7F7] text-[#222222] font-semibold text-sm py-2.5 px-6 rounded-full border-2 border-[#DDDDDD] hover:border-[#222222] transition-all"
        >
          Clear
        </button>
      </div>
    </form>
  );
}
