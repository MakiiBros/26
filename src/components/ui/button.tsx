"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "secondary" | "outline" | "ghost" | "destructive" | "order";
  size?: "default" | "sm" | "lg" | "icon";
  isLoading?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "default", size = "default", isLoading, children, disabled, ...props }, ref) => {
    
    const variants = {
      default: "bg-[#dc2626] text-white hover:bg-[#b91c1c] shadow-sm",
      secondary: "bg-[#141414] text-white border border-[#2a2a2a] hover:bg-[#252525]",
      outline: "bg-transparent border border-white text-white hover:bg-white/10",
      ghost: "bg-transparent text-[#a0a0a0] hover:bg-white/5",
      destructive: "bg-red-900 text-red-200 hover:bg-red-800",
      order: "bg-[#dc2626] text-white hover:bg-[#b91c1c] shadow-lg animate-pulse-glow",
    };

    const sizes = {
      default: "h-10 px-4 py-2",
      sm: "h-9 rounded-md px-3 text-sm",
      lg: "h-12 rounded-md px-8 text-lg",
      icon: "h-10 w-10 justify-center",
    };

    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={cn(
          "inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#dc2626] disabled:pointer-events-none disabled:opacity-50",
          variants[variant],
          sizes[size],
          className
        )}
        {...props}
      >
        {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        {children}
      </button>
    );
  }
);
Button.displayName = "Button";

export { Button };
