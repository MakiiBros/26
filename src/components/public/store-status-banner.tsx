'use client';

import { useState, useEffect } from 'react';
import { X, Clock, Flame } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StoreStatusBannerProps {
  isOpen: boolean;
  openTime: string;
  closeTime: string;
}

// Días de apertura: Lunes(1), Miércoles(3), Viernes(5), Sábado(6)
const OPEN_DAYS = [1, 3, 5, 6];
const DAY_NAMES: Record<number, string> = {
  1: 'Lunes', 3: 'Miércoles', 5: 'Viernes', 6: 'Sábado',
};

function getNextOpenDay(currentDay: number): string {
  for (let i = 1; i <= 7; i++) {
    const next = (currentDay + i) % 7;
    if (OPEN_DAYS.includes(next)) return DAY_NAMES[next];
  }
  return 'Lunes';
}

export function StoreStatusBanner({ isOpen }: StoreStatusBannerProps) {
  const [isVisible, setIsVisible] = useState(true);
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => {
    setMounted(true);
  }, []);

  const day = new Date().getDay(); // 0=Dom, 1=Lun, …, 6=Sáb
  const isOpenDay = OPEN_DAYS.includes(day);
  const effectivelyOpen = isOpen && isOpenDay;
  const nextOpenDay = getNextOpenDay(day);

  if (!isVisible || !mounted) return null;

  return (
    <aside
      aria-label="Estado del restaurante"
      className={cn(
        'w-full py-2.5 px-4 text-xs sm:text-sm font-medium transition-all duration-300 relative border-b backdrop-blur-md z-40',
        effectivelyOpen
          ? 'bg-emerald-950/40 border-emerald-500/20 text-emerald-300'
          : 'bg-[#1a0a0a]/60 border-[#e53e3e]/20 text-red-300'
      )}
    >
      <div className="container mx-auto flex items-center justify-center gap-3 text-center px-6">
        <div className="flex items-center gap-2 flex-wrap justify-center">
          <span className="relative flex h-2.5 w-2.5 shrink-0" aria-hidden="true">
            {effectivelyOpen && (
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
            )}
            <span
              className={cn(
                'relative inline-flex rounded-full h-2.5 w-2.5',
                effectivelyOpen ? 'bg-emerald-400' : 'bg-[#e53e3e]'
              )}
            />
          </span>

          {effectivelyOpen ? (
            <span className="flex items-center gap-1.5 flex-wrap justify-center">
              <span className="font-bold text-emerald-300">🔥 Abierto ahora</span>
              <span className="text-emerald-500/60 hidden sm:inline">•</span>
              <span className="text-emerald-200/90 font-normal">Hasta agotar stock</span>
              <span className="text-emerald-500/60 hidden sm:inline">•</span>
              <span className="text-emerald-200/90 font-normal hidden sm:inline">Desde las 5:30 PM</span>
            </span>
          ) : (
            <span className="flex items-center gap-1.5 flex-wrap justify-center">
              <Clock className="w-3.5 h-3.5 text-[#e53e3e]" />
              <span className="font-bold text-white">Abrimos el {nextOpenDay}</span>
              <span className="text-red-500/60 hidden sm:inline">•</span>
              <span className="text-red-200/80 font-normal">Lun · Mié · Vie · Sáb desde 5:30 PM</span>
            </span>
          )}
        </div>

        <div className="hidden md:flex items-center gap-1 text-[#f59e0b] text-xs bg-[#f59e0b]/10 border border-[#f59e0b]/20 px-2.5 py-0.5 rounded-full">
          <Flame className="w-3 h-3" />
          <span>Desde S/ 10 c/u</span>
        </div>
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
