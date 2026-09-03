"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, label, error, ...props }, ref) => {
    return (
      <div className="w-full flex flex-col gap-1.5">
        {label && (
          <label className="text-sm font-medium text-[#a0a0a0]">
            {label}
          </label>
        )}
        <input
          type={type}
          className={cn(
            "flex h-10 w-full rounded-md border border-[#2a2a2a] bg-[#141414] px-3 py-2 text-sm text-white placeholder:text-[#6b7280] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#dc2626] disabled:cursor-not-allowed disabled:opacity-50",
            error && "border-red-500 focus-visible:ring-red-500",
            className
          )}
          ref={ref}
          {...props}
        />
        {error && (
          <span className="text-xs text-red-400">{error}</span>
        )}
      </div>
    );
  }
);
Input.displayName = "Input";

export { Input };
