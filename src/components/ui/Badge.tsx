import React from "react";

type BadgeVariant = "default" | "success" | "warning" | "error" | "brand";

interface BadgeProps {
  children: React.ReactNode;
  variant?: BadgeVariant;
  className?: string;
}

export function Badge({ children, variant = "default", className = "" }: BadgeProps) {
  const baseStyle = "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border";
  
  const variants = {
    default: "bg-gray-100 text-gray-800 border-gray-200",
    success: "bg-emerald-50 text-emerald-700 border-emerald-200",
    warning: "bg-amber-50 text-amber-700 border-amber-200",
    error: "bg-rose-50 text-rose-700 border-rose-200",
    brand: "bg-indigo-50 text-indigo-700 border-indigo-200",
  };

  return (
    <span className={`${baseStyle} ${variants[variant]} ${className}`}>
      {children}
    </span>
  );
}
