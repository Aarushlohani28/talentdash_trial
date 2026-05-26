"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Navbar() {
  const pathname = usePathname();

  const isActive = (path: string) => pathname === path || pathname.startsWith(path + "/");

  return (
    <header className="airbnb-navbar">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-1 group" aria-label="TalentDash Home">
            <svg
              viewBox="0 0 32 32"
              className="w-8 h-8 fill-[#FF385C] group-hover:scale-110 transition-transform"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M16 1C7.163 1 0 8.163 0 17c0 5.477 2.658 10.33 6.763 13.344L16 31l9.237-.656A15.962 15.962 0 0 0 32 17C32 8.163 24.837 1 16 1zm0 2c7.732 0 14 6.268 14 14 0 4.63-2.25 8.733-5.713 11.268L16 29l-8.287-.732A13.96 13.96 0 0 1 2 17C2 9.268 8.268 3 16 3z" />
              <circle cx="16" cy="17" r="5" />
            </svg>
            <span className="font-bold text-xl text-[#FF385C]">Talent</span>
            <span className="font-bold text-xl text-[#222222]">Dash</span>
          </Link>

          {/* Nav links */}
          <nav className="hidden md:flex items-center gap-1" aria-label="Main navigation">
            <Link
              href="/salaries"
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                isActive("/salaries")
                  ? "bg-[#F7F7F7] text-[#222222]"
                  : "text-[#717171] hover:text-[#222222] hover:bg-[#F7F7F7]"
              }`}
            >
              Browse Salaries
            </Link>
            <Link
              href="/compare"
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                isActive("/compare")
                  ? "bg-[#F7F7F7] text-[#222222]"
                  : "text-[#717171] hover:text-[#222222] hover:bg-[#F7F7F7]"
              }`}
            >
              Compare TC
            </Link>
          </nav>

          {/* CTA */}
          <div className="flex items-center gap-3">
            <Link
              href="/salaries"
              className="hidden sm:inline-flex items-center gap-2 bg-[#FF385C] hover:bg-[#E31C5F] text-white text-sm font-semibold px-5 py-2.5 rounded-full transition-all shadow-sm hover:shadow-md"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              Explore Data
            </Link>

            {/* Mobile menu button */}
            <button
              className="md:hidden p-2 rounded-full border border-[#DDDDDD] hover:shadow-md transition-shadow"
              aria-label="Open menu"
            >
              <svg className="w-4 h-4 text-[#222222]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
