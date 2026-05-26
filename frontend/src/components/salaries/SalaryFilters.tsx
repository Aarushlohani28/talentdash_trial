"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useState } from "react";

export function SalaryFilters() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const [level, setLevel] = useState(searchParams.get("level") || "");
  
  const handleApply = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams(searchParams.toString());
    
    if (level) params.set("level", level);
    else params.delete("level");
    
    // Reset to page 1 on new filter
    params.delete("page");
    
    router.push(`?${params.toString()}`);
  }, [level, router, searchParams]);

  const handleClear = useCallback(() => {
    setLevel("");
    router.push(`?`);
  }, [router]);

  return (
    <form onSubmit={handleApply} className="bg-white/60 backdrop-blur-md border border-white/40 p-4 rounded-xl shadow-lg shadow-indigo-100/20 flex flex-wrap gap-4 items-end">
      <div className="flex-1 min-w-[200px]">
        <label className="block text-sm font-medium text-slate-700 mb-1">Filter by Level</label>
        <select 
          value={level}
          onChange={(e) => setLevel(e.target.value)}
          className="w-full bg-white/80 border border-slate-200 text-slate-800 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 outline-none transition-all"
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
        <button type="submit" className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-6 rounded-lg shadow-md shadow-indigo-200 transition-all hover:scale-105 active:scale-95">
          Apply
        </button>
        <button type="button" onClick={handleClear} className="bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 font-medium py-2 px-6 rounded-lg transition-all hover:scale-105 active:scale-95">
          Clear
        </button>
      </div>
    </form>
  );
}
