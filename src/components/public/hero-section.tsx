'use client';

import Image from 'next/image';
import { Flame, ArrowRight, Star, Clock, Sparkles, Utensils } from 'lucide-react';
import { SlideUp, TiltCard, StaggerContainer, StaggerItem, FadeIn } from '@/components/ui/motion-wrappers';

export function HeroSection() {
  return (
    <section id="inicio" className="relative min-h-[90vh] flex items-center justify-center overflow-hidden bg-[#09090c] pt-8 pb-20 scroll-mt-24">
      {/* Glow ambiental de brasa y carbón */}
      <div 
        className="absolute inset-0 pointer-events-none z-0"
        style={{
          background: 'radial-gradient(ellipse 70% 50% at 50% -10%, rgba(229, 62, 62, 0.22), rgba(245, 158, 11, 0.08) 45%, transparent 75%)'
        }}
      />

      {/* Sello Kanji sutil de fondo */}
      <FadeIn delay={0.5} duration={1.5} className="absolute right-4 top-1/4 select-none pointer-events-none font-black text-white/[0.02] text-[180px] lg:text-[280px] leading-none z-0">
        巻兄弟
      </FadeIn>

      <div className="container relative z-10 px-4 sm:px-6 lg:px-8 mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* Columna Izquierda: Editorial y Copywriting Gastronómico */}
          <StaggerContainer className="lg:col-span-7 space-y-6 text-center lg:text-left">
            {/* Pill Badge */}
            <StaggerItem>
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/[0.04] border border-white/[0.1] backdrop-blur-md text-xs font-semibold tracking-wider text-slate-200 shadow-sm">
                <span className="flex h-2 w-2 rounded-full bg-[#e53e3e] animate-pulse"></span>
                <span className="text-[#f59e0b] font-bold">FUSIÓN </span>
                <span className="text-white/30">•</span>
                <span className="text-slate-300">Banderillas Crocantes & Rolls Taypá</span>
              </div>
            </StaggerItem>

            {/* Titular Principal con Impacto */}
            <StaggerItem>
              <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black text-white tracking-tight leading-[1.08] uppercase text-balance">
                El verdadero <br className="hidden sm:inline" />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-slate-100 to-slate-400">
                  flow 
                </span>{' '}
                en cada bocado
              </h1>
            </StaggerItem>

            {/* Párrafo con esencia auténtica de MakiBros */}
            <StaggerItem>
              <p className="text-base sm:text-lg text-slate-300/90 max-w-xl mx-auto lg:mx-0 font-normal leading-relaxed text-pretty">
                Maki en banderilla, hecho a mano en Comas. Ingredientes frescos, listo para pedir cuando se te antoje
              </p>
            </StaggerItem>

            {/* CTAs con física táctil */}
            <StaggerItem>
              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2">
                <a
                  href="#menu"
                  className="w-full sm:w-auto px-8 py-4 text-white font-bold text-sm sm:text-base bg-gradient-to-r from-[#e53e3e] to-[#dc2626] hover:from-[#f87171] hover:to-[#e53e3e] rounded-xl transition-all shadow-[0_6px_28px_rgba(229,62,62,0.4)] hover:shadow-[0_8px_32px_rgba(229,62,62,0.6)] hover:-translate-y-1 btn-press flex items-center justify-center gap-2.5 cursor-pointer"
                >
                  <Flame className="w-5 h-5 text-amber-300 fill-amber-300" />
                  <span>Ordenar Ahora</span>
                  <ArrowRight className="w-4 h-4" />
                </a>

                <a
                  href="#menu"
                  className="w-full sm:w-auto px-7 py-4 text-slate-200 hover:text-white font-semibold text-sm sm:text-base border border-white/[0.12] bg-white/[0.04] hover:bg-white/[0.08] hover:border-white/[0.25] rounded-xl transition-all btn-press flex items-center justify-center gap-2 cursor-pointer backdrop-blur-md"
                >
                  <Utensils className="w-4 h-4 text-[#f59e0b]" />
                  <span>Explorar Menú</span>
                </a>
              </div>
            </StaggerItem>

            {/* Métricas de Confianza (Social Proof) */}
            <StaggerItem>
              <div className="pt-6 border-t border-white/[0.08] flex flex-wrap items-center justify-center lg:justify-start gap-6 sm:gap-8 text-xs text-slate-400">
                <div className="flex items-center gap-2">
                  <div className="flex text-amber-400">
                    <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                    <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                    <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                    <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                    <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                  </div>
                  <span className="font-bold text-white">4.9 / 5.0</span>
                  <span className="text-slate-500">(+1,274 reseñas)</span>
                </div>

                <div className="flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-[#e53e3e]" />
                  <span className="font-semibold text-slate-300">+5,000 rolls preparados</span>
                </div>

                <div className="flex items-center gap-1.5">
                  <Clock className="w-4 h-4 text-[#f59e0b]" />
                  <span className="font-semibold text-slate-300">Entrega rápida en ~35 min</span>
                </div>
              </div>
            </StaggerItem>
          </StaggerContainer>

          {/* Columna Derecha: Showcase Fotográfico de Platillo */}
          <SlideUp delay={0.2} duration={0.8} className="lg:col-span-5 flex justify-center">
            <TiltCard className="relative w-full max-w-md">
              {/* Resplandor cálido detrás de la tarjeta */}
              <div className="absolute -inset-4 bg-gradient-to-tr from-[#e53e3e]/30 via-[#f59e0b]/20 to-transparent rounded-3xl blur-2xl opacity-70 pointer-events-none"></div>

              {/* Tarjeta de platillo estrella */}
              <div className="relative glass-rounded-3xl overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.5)] border border-white/[0.12] group rounded-3xl">
                {/* Imagen del plato estrella */}
                <div className="relative h-72 sm:h-80 w-full overflow-hidden bg-black/40">
                  <Image
                    src="https://images.unsplash.com/photo-1579871494447-9811cf80d66c?q=80&w=900&auto=format&fit=crop"
                    alt="Acevichado Roll MakiBros Especial"
                    fill
                    priority
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    className="object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                  />

                  {/* Badges superiores flotantes */}
                  <div className="absolute top-4 left-4 right-4 flex items-center justify-between z-10">
                    <span className="inline-flex items-center gap-1 text-[11px] font-extrabold uppercase tracking-wider bg-black/60 backdrop-blur-md border border-white/20 text-white px-3 py-1 rounded-full shadow-lg">
                      <Flame className="w-3 h-3 text-[#e53e3e] fill-[#e53e3e]" />
                      Favorito de Lima
                    </span>

                    <span className="text-[11px] font-bold bg-[#f59e0b] text-black px-2.5 py-1 rounded-full shadow-md">
                      -15% HOY
                    </span>
                  </div>
                </div>

                {/* Info inferior con precio y detalles */}
                <div className="p-6 bg-gradient-to-b from-[#14141c]/90 to-[#0d0d12]/95 backdrop-blur-xl relative">
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent pointer-events-none" />
                  <div className="relative z-10 flex items-start justify-between gap-4">
                    <div>
                      <span className="text-[10px] uppercase font-bold tracking-widest text-[#f59e0b]">
                        Signature Roll • 10 Cortes
                      </span>
                      <h3 className="text-xl font-bold text-white mt-0.5">
                        Acevichado Maki Imperial
                      </h3>
                    </div>

                    <div className="text-right">
                      <span className="text-xs text-slate-400 line-through block">S/ 38.00</span>
                      <span className="text-xl font-black text-[#f59e0b] tabular-nums">S/ 32.00</span>
                    </div>
                  </div>

                  <p className="relative z-10 text-xs text-slate-300/80 mt-2 leading-relaxed">
                    Langostino al panko crocante, palta selecta, atún sellado al soplete y nuestra inconfundible salsa acevichada brava con togarashi.
                  </p>

                  <div className="relative z-10 mt-4 pt-4 border-t border-white/[0.08] flex items-center justify-between">
                    <span className="text-xs text-slate-400 flex items-center gap-1.5">
                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                      Disponible para ordenar
                    </span>

                    <a
                      href="#menu"
                      className="text-xs font-bold text-white bg-white/[0.08] hover:bg-[#e53e3e] border border-white/10 px-3.5 py-1.5 rounded-lg transition-colors btn-press inline-flex items-center gap-1 cursor-pointer"
                    >
                      <span>Pedir en Carta</span>
                      <span>→</span>
                    </a>
                  </div>
                </div>
              </div>
            </TiltCard>
          </SlideUp>

        </div>
      </div>
    </section>
  );
}
