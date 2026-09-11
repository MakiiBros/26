'use client';

import Image from 'next/image';
import { Flame, Clock, Award, MapPin, MessageCircle } from 'lucide-react';
import { SlideUp, FadeIn, StaggerContainer, StaggerItem } from '@/components/ui/motion-wrappers';

const WA_LINK = 'https://wa.me/51924336957?text=Hola%20MakiBros!%20Quiero%20hacer%20un%20pedido.';

export function AboutSection() {
  const features = [
    {
      icon: <Flame className="w-6 h-6 text-[#e53e3e]" />,
      title: 'Makis en Banderilla',
      description: 'El crunch perfecto entre el panko artesanal y nuestro relleno exclusivo. Frito al instante para máximo sabor.'
    },
    {
      icon: <Award className="w-6 h-6 text-[#f59e0b]" />,
      title: 'Desde S/ 10 c/u',
      description: 'Precio justo, sabor premium. Cinco variedades: Crispy Hot, Salmón Furai, California Furai, Supremo y Fit.'
    },
    {
      icon: <Clock className="w-6 h-6 text-emerald-500" />,
      title: 'Lun · Mié · Vie · Sáb',
      description: 'Abrimos desde las 5:30 PM hasta agotar stock. Llega temprano para no quedarte sin tu maki favorito.'
    },
    {
      icon: <MapPin className="w-6 h-6 text-teal-400" />,
      title: 'Av. El Retablo 115, Comas',
      description: 'Encuéntranos en el corazón de Comas, Lima Norte. ¡También aceptamos pedidos por WhatsApp!'
    }
  ];

  return (
    <section id="nosotros" className="py-24 sm:py-32 relative bg-[#09090c] overflow-hidden">
      {/* Background elements */}
      <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-[#e53e3e]/5 to-transparent pointer-events-none" />
      <div className="absolute -left-32 top-1/4 w-96 h-96 bg-[#f59e0b]/5 rounded-full blur-[100px] pointer-events-none" />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">

          {/* Showcase visual del Chef y la Marca — Presentación Editorial */}
          <div className="relative">
            <FadeIn delay={0.1} className="relative z-10">
              <div className="relative rounded-3xl overflow-hidden border border-white/10 bg-gradient-to-b from-[#161622] via-[#101017] to-[#0a0a0f] shadow-[0_20px_60px_rgba(0,0,0,0.6)] group">
                {/* Resplandores ambientales de fondo */}
                <div className="absolute -top-16 -right-16 w-64 h-64 bg-[#e53e3e]/20 rounded-full blur-[80px] pointer-events-none" />
                <div className="absolute -bottom-16 -left-16 w-64 h-64 bg-[#f59e0b]/15 rounded-full blur-[80px] pointer-events-none" />

                {/* Sello kanji artesanal tenue */}
                <div className="absolute right-4 top-8 select-none pointer-events-none font-black text-white/[0.03] text-[140px] sm:text-[180px] leading-none z-0">
                  巻
                </div>

                {/* Badge flotante superior izquierdo: Nuevo Isotipo MakiBros */}
                <div className="absolute top-4 left-4 sm:top-5 sm:left-5 z-20 flex items-center gap-2.5 px-3.5 py-2 rounded-2xl bg-[#09090c]/85 border border-white/15 backdrop-blur-xl shadow-xl">
                  <div className="relative w-8 h-8 shrink-0">
                    <Image
                      src="/images/brand/logo.png"
                      alt="Logo MakiBros"
                      fill
                      sizes="32px"
                      className="object-contain"
                    />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-white leading-tight">MakiBros</p>
                    <p className="text-[10px] font-semibold text-amber-400 tracking-wide">Receta Original</p>
                  </div>
                </div>

                {/* Badge flotante superior derecho: Chip de calidad */}
                <div className="absolute top-4 right-4 sm:top-5 sm:right-5 z-20 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#e53e3e]/90 text-white font-extrabold text-[10px] uppercase tracking-wider shadow-lg shadow-[#e53e3e]/30">
                  <Flame className="w-3 h-3 fill-white" />
                  <span>Maestro Maki</span>
                </div>

                {/* Retrato del Chef en tamaño de alto impacto */}
                <div className="relative w-full h-[440px] sm:h-[520px] flex items-end justify-center pt-16">
                  <Image
                    src="/images/brand/chef.png"
                    alt="Chef MakiBros — Pasión y Sabor en Comas"
                    fill
                    priority
                    sizes="(max-width: 768px) 100vw, 50vw"
                    className="object-contain object-bottom transition-transform duration-700 ease-out group-hover:scale-[1.03]"
                  />
                  {/* Difuminado suave inferior para fusionar con el marco */}
                  <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-[#0a0a0f] via-[#0a0a0f]/60 to-transparent pointer-events-none" />
                </div>

                {/* Tarjeta flotante inferior: Declaración de calidad artesanal */}
                <div className="absolute bottom-4 inset-x-4 sm:bottom-5 sm:inset-x-5 z-20 p-4 rounded-2xl bg-[#121218]/90 border border-white/15 backdrop-blur-xl shadow-2xl space-y-2">
                  <p className="text-xs sm:text-sm text-slate-200 font-medium leading-snug italic">
                    &ldquo;El crunch perfecto: panko artesanal frito al instante, porciones generosas y sazón nikkei que solo encuentras en Comas.&rdquo;
                  </p>
                  <div className="flex items-center justify-between pt-2 border-t border-white/[0.08] text-[11px]">
                    <span className="font-semibold text-slate-300 flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                      100% Hecho al Momento
                    </span>
                    <span className="font-extrabold text-[#f59e0b] tracking-wider uppercase">
                      Desde S/ 10 c/u
                    </span>
                  </div>
                </div>
              </div>
            </FadeIn>
          </div>

          {/* Contenido textual */}
          <div className="space-y-8 lg:pl-10">
            <SlideUp>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/[0.05] border border-white/10 text-neutral-300 text-xs font-mono uppercase tracking-widest font-semibold mb-2">
                <Flame className="w-3.5 h-3.5 text-[#e53e3e]" />
                Nuestra Historia
              </div>
              <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight leading-[1.1]">
                No vendemos comida,{' '}<br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#e53e3e] to-[#f59e0b]">
                  repartimos flow.
                </span>
              </h2>
            </SlideUp>

            <SlideUp delay={0.1}>
              <p className="text-neutral-400 text-base sm:text-lg leading-relaxed">
                MakiBros nació en las calles de Comas con una misión clara: democratizar el buen maki. Combinamos la precisión japonesa con la sazón y las porciones generosas que el barrio exige. Encuentra la diferencia en cada mordida.
              </p>
            </SlideUp>

            <StaggerContainer className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-6">
              {features.map((feature, idx) => (
                <StaggerItem key={idx} className="flex gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-white/[0.04] border border-white/10 flex items-center justify-center shrink-0 shadow-inner">
                    {feature.icon}
                  </div>
                  <div>
                    <h4 className="text-white font-bold text-sm mb-1">{feature.title}</h4>
                    <p className="text-neutral-500 text-xs leading-relaxed">{feature.description}</p>
                  </div>
                </StaggerItem>
              ))}
            </StaggerContainer>

            <SlideUp delay={0.3} className="pt-4 flex flex-col sm:flex-row gap-3">
              <a
                href="#menu"
                className="btn-press inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-white text-black font-bold text-sm hover:bg-neutral-200 transition-colors shadow-[0_0_20px_rgba(255,255,255,0.2)]"
              >
                Ver Nuestra Carta
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </a>
              <a
                href={WA_LINK}
                target="_blank"
                rel="noreferrer"
                className="btn-press inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-emerald-600/20 text-emerald-400 border border-emerald-500/30 font-bold text-sm hover:bg-emerald-600/30 transition-colors"
              >
                <MessageCircle className="w-4 h-4" />
                Pedir por WhatsApp
              </a>
            </SlideUp>
          </div>

        </div>
      </div>
    </section>
  );
}
