import React from "react";

type BadgeVariant = "default" | "success" | "warning" | "error" | "brand";

interface BadgeProps {
  children: React.ReactNode;
  variant?: BadgeVariant;
  className?: string;
}

export function Badge({ children, variant = "default", className = "" }: BadgeProps) {
  const baseStyle =
    "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold";

  const variants: Record<BadgeVariant, string> = {
    default: "bg-[#F7F7F7] text-[#717171] border border-[#DDDDDD]",
    success: "bg-emerald-50 text-emerald-700 border border-emerald-200",
    warning: "bg-amber-50 text-amber-700 border border-amber-200",
    error: "bg-rose-50 text-rose-700 border border-rose-200",
    brand: "bg-[#FFF0F3] text-[#C60845] border border-[#FFD0D9]",
  };

  return (
    <span className={`${baseStyle} ${variants[variant]} ${className}`}>
      {children}
    </span>
  );
}
