'use client';

import { useState } from 'react';
import { X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StoreStatusBannerProps {
  isOpen: boolean;
  openTime: string;
  closeTime: string;
}

export function StoreStatusBanner({ isOpen, openTime, closeTime }: StoreStatusBannerProps) {
  const [isVisible, setIsVisible] = useState(true);

  if (!isVisible) return null;

  return (
    <div className={cn(
      "w-full py-2 px-4 text-sm font-medium flex items-center justify-center relative",
      isOpen ? "bg-[#112211] text-[#48bb78]" : "bg-[#221111] text-[#fc8181]"
    )}>
      <div className="flex items-center gap-2">
        <span className="relative flex h-2.5 w-2.5">
          {isOpen && (
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#48bb78] opacity-75"></span>
          )}
          <span className={cn(
            "relative inline-flex rounded-full h-2.5 w-2.5",
            isOpen ? "bg-[#48bb78]" : "bg-[#fc8181]"
          )}></span>
        </span>
        
        <span>
          {isOpen 
            ? `Abierto — Aceptando pedidos hasta las ${closeTime}`
            : `Cerrado — Solo reservaciones (Abrimos a las ${openTime})`
          }
        </span>
      </div>
      
      <button 
        onClick={() => setIsVisible(false)}
        className="absolute right-4 top-1/2 -translate-y-1/2 p-1 hover:bg-black/20 rounded-md transition-colors"
        aria-label="Cerrar banner"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  );
}
