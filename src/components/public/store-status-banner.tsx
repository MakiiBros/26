'use client';

import { useState } from 'react';
import { X, Bike } from 'lucide-react';
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
    <aside
      aria-label="Estado del restaurante"
      className={cn(
        "w-full py-2 px-4 text-xs sm:text-sm font-medium transition-all duration-300 relative border-b backdrop-blur-md z-40",
        isOpen
          ? "bg-emerald-950/40 border-emerald-500/20 text-emerald-300"
          : "bg-red-950/40 border-red-500/20 text-red-300"
      )}
    >
      <div className="container mx-auto flex items-center justify-center gap-3 text-center px-6">
        <div className="flex items-center gap-2">
          <span className="relative flex h-2.5 w-2.5 shrink-0" aria-hidden="true">
            {isOpen && (
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            )}
            <span
              className={cn(
                "relative inline-flex rounded-full h-2.5 w-2.5",
                isOpen ? "bg-emerald-400" : "bg-red-400"
              )}
            ></span>
          </span>

          <span className="font-semibold tracking-wide">
            {isOpen ? (
              <span className="flex items-center gap-1.5 flex-wrap justify-center">
                <span>Local Abierto</span>
                <span className="text-emerald-500/60 hidden sm:inline">•</span>
                <span className="text-emerald-200/90 font-normal">Pedidos hasta las {closeTime}</span>
              </span>
            ) : (
              <span className="flex items-center gap-1.5 flex-wrap justify-center">
                <span>Local Cerrado</span>
                <span className="text-red-500/60 hidden sm:inline">•</span>
                <span className="text-red-200/90 font-normal">Abrimos hoy a las {openTime}</span>
              </span>
            )}
          </span>
        </div>

        {isOpen && (
          <div className="hidden md:flex items-center gap-1 text-emerald-400/80 text-xs bg-emerald-950/60 border border-emerald-500/20 px-2.5 py-0.5 rounded-full">
            <Bike className="w-3 h-3" />
            <span>Delivery activo</span>
          </div>
        )}
      </div>

      <button
        onClick={() => setIsVisible(false)}
        className="absolute right-3 sm:right-4 top-1/2 -translate-y-1/2 p-1 text-white/60 hover:text-white hover:bg-white/10 rounded-full transition-colors cursor-pointer btn-press"
        aria-label="Cerrar aviso de horario"
      >
        <X className="h-3.5 w-3.5" />
      </button>
    </aside>
  );
}

