import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  weight: ["300", "400", "500", "600", "700", "800", "900"],
});

export const metadata: Metadata = {
  title: "TalentDash — Discover Real Compensation",
  description: "Empowering tech workers with transparent, verified salary data. Browse compensation by company, role, and level.",
  keywords: ["salary", "compensation", "tech salary", "software engineer salary", "total compensation"],
  openGraph: {
    title: "TalentDash — Discover Real Compensation",
    description: "Browse verified tech compensation data by company, role, and level.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} h-full`}>
      <body className="min-h-full flex flex-col bg-white text-[#222222] antialiased">
        <Navbar />
        <div className="flex-1">
          {children}
        </div>
        <footer className="border-t border-[#DDDDDD] bg-[#F7F7F7] mt-auto">
          <div className="max-w-7xl mx-auto px-6 py-8">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              <div className="flex items-center gap-2">
                <span className="text-[#FF385C] font-bold text-xl">Talent</span>
                <span className="font-bold text-xl text-[#222222]">Dash</span>
              </div>
              <p className="text-sm text-[#717171]">
                © {new Date().getFullYear()} TalentDash. Transparent compensation data for everyone.
              </p>
              <div className="flex gap-6 text-sm text-[#717171]">
                <a href="/salaries" className="hover:text-[#222222] transition-colors">Salaries</a>
                <a href="/compare" className="hover:text-[#222222] transition-colors">Compare</a>
              </div>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
