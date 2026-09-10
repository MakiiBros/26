'use client';

import Image from 'next/image';
import { Flame, ArrowRight, Star, Clock, MessageCircle, MapPin } from 'lucide-react';
import { SlideUp, TiltCard, StaggerContainer, StaggerItem, FadeIn } from '@/components/ui/motion-wrappers';

const WA_LINK = 'https://wa.me/51924336957?text=Hola%20MakiBros!%20Quiero%20hacer%20un%20pedido.';

export function HeroSection() {
  return (
    <section id="inicio" className="relative min-h-[90vh] flex items-center justify-center overflow-hidden bg-[#09090c] pt-8 pb-20 scroll-mt-24">
      {/* Glow ambiental rojo-fuego */}
      <div
        className="absolute inset-0 pointer-events-none z-0"
        style={{
          background: 'radial-gradient(ellipse 70% 50% at 50% -10%, rgba(229, 62, 62, 0.28), rgba(245, 158, 11, 0.08) 45%, transparent 75%)'
        }}
      />

      {/* Sello kanji sutil de fondo */}
      <FadeIn delay={0.5} duration={1.5} className="absolute right-4 top-1/4 select-none pointer-events-none font-black text-white/[0.02] text-[180px] lg:text-[280px] leading-none z-0">
        巻兄弟
      </FadeIn>

      <div className="container relative z-10 px-4 sm:px-6 lg:px-8 mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">

          {/* Columna izquierda — Copy & CTAs */}
          <StaggerContainer className="lg:col-span-7 space-y-6 text-center lg:text-left">

            {/* Badge superior */}
            <StaggerItem>
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/[0.04] border border-white/[0.1] backdrop-blur-md text-xs font-semibold tracking-wider text-slate-200 shadow-sm">
                <span className="flex h-2 w-2 rounded-full bg-[#e53e3e] animate-pulse" />
                <span className="text-[#f59e0b] font-bold">MAKIS EN BANDERILLA</span>
                <span className="text-white/30">•</span>
                <span className="text-slate-300">Comas, Lima Norte</span>
              </div>
            </StaggerItem>

            {/* Logo central grande — imagen real del cliente */}
            <StaggerItem>
              <div className="flex justify-center lg:justify-start">
                <div className="relative w-52 h-52 sm:w-60 sm:h-60 lg:w-72 lg:h-72 drop-shadow-[0_0_60px_rgba(229,62,62,0.4)]">
                  <Image
                    src="/images/brand/logo.jpg"
                    alt="MakiBros — Una Vez No Basta"
                    fill
                    priority
                    sizes="(max-width: 640px) 208px, (max-width: 1024px) 240px, 288px"
                    className="object-contain"
                  />
                </div>
              </div>
            </StaggerItem>

            {/* Titular */}
            <StaggerItem>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-[1.05] uppercase text-balance">
                Una Vez{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#e53e3e] to-[#f59e0b]">
                  No Basta
                </span>
              </h1>
            </StaggerItem>

            {/* Descripción */}
            <StaggerItem>
              <p className="text-base sm:text-lg text-slate-300/90 max-w-xl mx-auto lg:mx-0 font-normal leading-relaxed text-pretty">
                Makis en banderilla, hechos a mano en Comas. Ingredientes frescos, crunch real y sabor que te hace volver.
              </p>
            </StaggerItem>

            {/* CTAs */}
            <StaggerItem>
              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2">
                <a
                  href="#menu"
                  className="w-full sm:w-auto px-8 py-4 text-white font-bold text-sm sm:text-base bg-gradient-to-r from-[#e53e3e] to-[#dc2626] hover:from-[#f87171] hover:to-[#e53e3e] rounded-xl transition-all shadow-[0_6px_28px_rgba(229,62,62,0.4)] hover:shadow-[0_8px_32px_rgba(229,62,62,0.6)] hover:-translate-y-1 btn-press flex items-center justify-center gap-2.5 cursor-pointer"
                >
                  <Flame className="w-5 h-5 text-amber-300 fill-amber-300" />
                  <span>Ver Carta</span>
                  <ArrowRight className="w-4 h-4" />
                </a>

                <a
                  href={WA_LINK}
                  target="_blank"
                  rel="noreferrer"
                  className="w-full sm:w-auto px-7 py-4 text-emerald-300 hover:text-white font-semibold text-sm sm:text-base border border-emerald-500/30 bg-emerald-600/10 hover:bg-emerald-600/30 rounded-xl transition-all btn-press flex items-center justify-center gap-2 cursor-pointer backdrop-blur-md"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>Pedir al 924 336 957</span>
                </a>
              </div>
            </StaggerItem>

            {/* Info rápida */}
            <StaggerItem>
              <div className="pt-6 border-t border-white/[0.08] flex flex-wrap items-center justify-center lg:justify-start gap-5 sm:gap-8 text-xs text-slate-400">
                <div className="flex items-center gap-2">
                  <div className="flex text-amber-400">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                  <span className="font-bold text-white">4.9 / 5.0</span>
                </div>

                <div className="flex items-center gap-1.5">
                  <Clock className="w-4 h-4 text-[#f59e0b]" />
                  <span className="font-semibold text-slate-300">Lun · Mié · Vie · Sáb</span>
                </div>

                <div className="flex items-center gap-1.5">
                  <MapPin className="w-4 h-4 text-[#e53e3e]" />
                  <span className="font-semibold text-slate-300">Av. El Retablo 115, Comas</span>
                </div>
              </div>
            </StaggerItem>
          </StaggerContainer>

          {/* Columna derecha — Showcase del producto */}
          <SlideUp delay={0.2} duration={0.8} className="lg:col-span-5 flex justify-center">
            <TiltCard className="relative w-full max-w-md">
              {/* Resplandor cálido */}
              <div className="absolute -inset-4 bg-gradient-to-tr from-[#e53e3e]/30 via-[#f59e0b]/20 to-transparent rounded-3xl blur-2xl opacity-70 pointer-events-none" />

              {/* Tarjeta del producto estrella */}
              <div className="relative rounded-3xl overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.5)] border border-white/[0.12] group">
                {/* Imagen del flyer promo con los rolls reales */}
                <div className="relative h-[420px] sm:h-[500px] w-full overflow-hidden bg-black">
                  <Image
                    src="/images/brand/flyer-menu.jpg"
                    alt="Menú MakiBros — Rolls en Banderilla"
                    fill
                    priority
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    className="object-cover object-center transition-transform duration-700 ease-out group-hover:scale-105"
                  />

                  {/* Overlay sutil para legibilidad */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />

                  {/* Badge top */}
                  <div className="absolute top-4 left-4 right-4 flex items-center justify-between z-10">
                    <span className="inline-flex items-center gap-1 text-[11px] font-extrabold uppercase tracking-wider bg-black/60 backdrop-blur-md border border-white/20 text-white px-3 py-1 rounded-full shadow-lg">
                      <Flame className="w-3 h-3 text-[#e53e3e] fill-[#e53e3e]" />
                      5 variedades
                    </span>
                    <span className="text-[11px] font-black bg-[#e53e3e] text-white px-3 py-1 rounded-full shadow-md">
                      Desde S/ 10
                    </span>
                  </div>
                </div>

                {/* Info inferior */}
                <div className="p-5 bg-gradient-to-b from-[#14141c]/95 to-[#0d0d12]/98 backdrop-blur-xl relative">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <span className="text-[10px] uppercase font-bold tracking-widest text-[#f59e0b]">
                        Nuestros Rolls
                      </span>
                      <h3 className="text-lg font-bold text-white mt-0.5">
                        Makis en Banderilla
                      </h3>
                      <p className="text-xs text-slate-400 mt-1">
                        Pollo Crispy Hot · Salmón Furai · California Furai · Pollo Supremo · Pollo Fit
                      </p>
                    </div>
                    <div className="text-right shrink-0">
                      <span className="text-xs text-slate-400 block">desde</span>
                      <span className="text-2xl font-black text-[#e53e3e] tabular-nums">S/10</span>
                      <span className="text-xs text-slate-400 block">c/u</span>
                    </div>
                  </div>

                  <div className="mt-4 pt-4 border-t border-white/[0.08] flex items-center justify-between">
                    <span className="text-xs text-slate-400 flex items-center gap-1.5">
                      <span className="h-1.5 w-1.5 rounded-full bg-[#e53e3e] animate-pulse" />
                      Disponible Lun · Mié · Vie · Sáb
                    </span>
                    <a
                      href="#menu"
                      className="text-xs font-bold text-white bg-[#e53e3e]/20 hover:bg-[#e53e3e] border border-[#e53e3e]/30 px-3.5 py-1.5 rounded-lg transition-colors btn-press inline-flex items-center gap-1 cursor-pointer"
                    >
                      <span>Ver Carta</span>
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
