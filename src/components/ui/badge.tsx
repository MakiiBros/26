import * as React from "react";
import { cn } from "@/lib/utils";

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "discount" | "popular" | "new" | "unavailable" | "success" | "warning";
}

function Badge({ className, variant = "default", ...props }: BadgeProps) {
  const variants = {
    default: "bg-[#141414] text-white border border-[#2a2a2a]",
    discount: "bg-yellow-500/20 text-yellow-400 border-transparent",
    popular: "bg-[#dc2626]/20 text-[#dc2626] border-transparent",
    new: "bg-green-500/20 text-green-400 border-transparent",
    unavailable: "bg-red-900/30 text-red-400 border-transparent",
    success: "bg-green-500/20 text-green-400 border-transparent",
    warning: "bg-yellow-500/20 text-yellow-400 border-transparent",
  };

  return (
    <div
      className={cn(
        "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-[#dc2626] focus:ring-offset-2",
        variants[variant],
        className
      )}
      {...props}
    />
  );
}

export { Badge };
