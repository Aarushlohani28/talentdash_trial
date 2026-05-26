/*
  SalaryIngestSection.tsx
  A small UI component that provides a button to open a salary ingestion form.
  Designed with a premium glassmorphism style to match the overall look of the app.
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
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "experience_years" || name === "base_salary" || name === "bonus" || name === "stock"
        ? Number(value)
        : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);
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
      const { data } = await res.json();
      setMessage("✅ Salary entry added!");
      // Close form after success and refresh data
      setOpen(false);
      router.refresh();
    } catch (err) {
      setMessage("❌ Unexpected error");
    }
  };

  return (
    <div className="relative inline-block ml-4">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-4 rounded-lg shadow-md transition-all"
      >
        {open ? "Close" : "Add Salary"}
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-96 bg-white/80 backdrop-blur-md border border-white/40 rounded-xl shadow-lg p-4 z-10">
          <h2 className="text-lg font-semibold mb-3 text-slate-800">New Salary Entry</h2>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-3">
            <input
              name="company"
              placeholder="Company"
              required
              className="w-full p-2 border rounded bg-white/70"
              onChange={handleChange}
            />
            <input
              name="role"
              placeholder="Role"
              required
              className="w-full p-2 border rounded bg-white/70"
              onChange={handleChange}
            />
            <select name="level" value={formData.level} onChange={handleChange} className="w-full p-2 border rounded bg-white/70">
              {Array.from({ length: 6 }, (_, i) => `L${i + 3}`).map((lvl) => (
                <option key={lvl} value={lvl}>
                  {lvl}
                </option>
              ))}
            </select>
            <input
              name="location"
              placeholder="Location"
              required
              className="w-full p-2 border rounded bg-white/70"
              onChange={handleChange}
            />
            <input
              name="experience_years"
              type="number"
              placeholder="Experience (years)"
              min={0}
              className="w-full p-2 border rounded bg-white/70"
              onChange={handleChange}
            />
            <input
              name="base_salary"
              type="number"
              placeholder="Base Salary"
              min={0}
              className="w-full p-2 border rounded bg-white/70"
              onChange={handleChange}
            />
            <input
              name="bonus"
              type="number"
              placeholder="Bonus (optional)"
              min={0}
              className="w-full p-2 border rounded bg-white/70"
              onChange={handleChange}
            />
            <input
              name="stock"
              type="number"
              placeholder="Stock (optional)"
              min={0}
              className="w-full p-2 border rounded bg-white/70"
              onChange={handleChange}
            />
            <button
              type="submit"
              className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-4 rounded transition-colors"
            >
              Submit
            </button>
          </form>
          {message && <p className="mt-2 text-sm">{message}</p>}
        </div>
      )}
    </div>
  );
}
