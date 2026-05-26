/*
  SalaryIngestSection.tsx
  A small UI component that provides a button to open a salary ingestion form.
  Redesigned with Airbnb-inspired clean aesthetic.
*/
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function SalaryIngestSection() {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    company: "",
    role: "",
    level: "L3",
    location: "",
    experience_years: 0,
    base_salary: 0,
    bonus: 0,
    stock: 0,
  });
  const [message, setMessage] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]:
        name === "experience_years" ||
        name === "base_salary" ||
        name === "bonus" ||
        name === "stock"
          ? Number(value)
          : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);
    setSubmitting(true);
    try {
      const res = await fetch("/api/ingest-salary", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      if (!res.ok) {
        const err = await res.json();
        setMessage(`Error: ${err.error ?? "Failed to ingest"}`);
        return;
      }
      await res.json();
      setMessage("✅ Salary entry added!");
      setOpen(false);
      router.refresh();
    } catch {
      setMessage("❌ Unexpected error");
    } finally {
      setSubmitting(false);
    }
  };

  const inputClass =
    "w-full px-3.5 py-2.5 border-2 border-[#DDDDDD] rounded-xl bg-white text-[#222222] text-sm placeholder:text-[#AAAAAA] focus:outline-none focus:border-[#222222] transition-colors";

  return (
    <div className="relative inline-block">
      <button
        type="button"
        id="add-salary-btn"
        onClick={() => setOpen(!open)}
        className="inline-flex items-center gap-2 bg-[#FF385C] hover:bg-[#E31C5F] text-white font-semibold text-sm py-2.5 px-5 rounded-full transition-all shadow-sm hover:shadow-md"
      >
        {open ? (
          <>
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
            Close
          </>
        ) : (
          <>
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
            </svg>
            Add Salary
          </>
        )}
      </button>

      {open && (
        <div className="absolute right-0 mt-3 w-96 airbnb-card p-6 z-50 animate-fade-in">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-lg font-bold text-[#222222]">Add Salary Record</h2>
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-[#F7F7F7] transition-colors text-[#717171] hover:text-[#222222]"
              aria-label="Close form"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-3.5">
            <div>
              <label className="block text-xs font-semibold text-[#717171] uppercase tracking-wider mb-1.5">Company *</label>
              <input
                name="company"
                placeholder="e.g. Google"
                required
                className={inputClass}
                onChange={handleChange}
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-[#717171] uppercase tracking-wider mb-1.5">Role *</label>
              <input
                name="role"
                placeholder="e.g. Software Engineer"
                required
                className={inputClass}
                onChange={handleChange}
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-[#717171] uppercase tracking-wider mb-1.5">Level</label>
                <select name="level" value={formData.level} onChange={handleChange} className={inputClass}>
                  {Array.from({ length: 6 }, (_, i) => `L${i + 3}`).map((lvl) => (
                    <option key={lvl} value={lvl}>
                      {lvl}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-[#717171] uppercase tracking-wider mb-1.5">Exp. (yrs)</label>
                <input
                  name="experience_years"
                  type="number"
                  placeholder="0"
                  min={0}
                  className={inputClass}
                  onChange={handleChange}
                />
              </div>
            </div>
            <div>
              <label className="block text-xs font-semibold text-[#717171] uppercase tracking-wider mb-1.5">Location *</label>
              <input
                name="location"
                placeholder="e.g. San Francisco, CA"
                required
                className={inputClass}
                onChange={handleChange}
              />
            </div>

            <div className="border-t border-[#DDDDDD] pt-3.5">
              <p className="text-xs font-semibold text-[#717171] uppercase tracking-wider mb-3">Compensation (USD/yr)</p>
              <div className="grid grid-cols-1 gap-3">
                <div>
                  <label className="block text-xs text-[#717171] mb-1">Base Salary</label>
                  <input
                    name="base_salary"
                    type="number"
                    placeholder="e.g. 150000"
                    min={0}
                    className={inputClass}
                    onChange={handleChange}
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs text-[#717171] mb-1">Bonus</label>
                    <input
                      name="bonus"
                      type="number"
                      placeholder="Optional"
                      min={0}
                      className={inputClass}
                      onChange={handleChange}
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-[#717171] mb-1">Stock (RSU)</label>
                    <input
                      name="stock"
                      type="number"
                      placeholder="Optional"
                      min={0}
                      className={inputClass}
                      onChange={handleChange}
                    />
                  </div>
                </div>
              </div>
            </div>

            <button
              type="submit"
              id="submit-salary-btn"
              disabled={submitting}
              className="w-full bg-[#FF385C] hover:bg-[#E31C5F] disabled:opacity-60 disabled:cursor-not-allowed text-white font-semibold py-3 px-4 rounded-full transition-all mt-1"
            >
              {submitting ? "Submitting…" : "Submit Salary"}
            </button>
          </form>

          {message && (
            <p className={`mt-3 text-sm font-medium text-center ${message.startsWith("✅") ? "text-emerald-600" : "text-[#FF385C]"}`}>
              {message}
            </p>
          )}
        </div>
      )}
    </div>
  );
}
