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
      description: 'Encuéntranos en el corazón de Comas, Lima Norte. ¡También pedidos por WhatsApp al 924 336 957!'
    }
  ];

  return (
    <section id="nosotros" className="py-24 sm:py-32 relative bg-[#09090c] overflow-hidden">
      {/* Background elements */}
      <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-[#e53e3e]/5 to-transparent pointer-events-none" />
      <div className="absolute -left-32 top-1/4 w-96 h-96 bg-[#f59e0b]/5 rounded-full blur-[100px] pointer-events-none" />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">

          {/* Grilla de imágenes — imágenes reales del cliente */}
          <div className="relative">
            <div className="grid grid-cols-2 gap-4 sm:gap-6 relative z-10">
              <FadeIn delay={0.1} className="space-y-4 sm:space-y-6 mt-8 sm:mt-12">
                {/* Logo grande */}
                <div className="relative aspect-square rounded-3xl overflow-hidden shadow-[0_8px_30px_rgb(0,0,0,0.5)] border border-white/10 group bg-black">
                  <Image
                    src="/images/brand/logo.jpg"
                    alt="Logo MakiBros — Una Vez No Basta"
                    fill
                    className="object-contain p-4 group-hover:scale-105 transition-transform duration-700"
                  />
                </div>
                {/* Flyer promo */}
                <div className="relative aspect-[4/5] rounded-3xl overflow-hidden shadow-[0_8px_30px_rgb(0,0,0,0.5)] border border-white/10 group">
                  <Image
                    src="/images/brand/flyer-promo.jpg"
                    alt="MakiBros — Horarios y contacto"
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors duration-500" />
                </div>
              </FadeIn>

              <FadeIn delay={0.3} className="space-y-4 sm:space-y-6">
                {/* Flyer menú */}
                <div className="relative aspect-[4/5] rounded-3xl overflow-hidden shadow-[0_8px_30px_rgb(0,0,0,0.5)] border border-white/10 group">
                  <Image
                    src="/images/brand/flyer-menu.jpg"
                    alt="Menú MakiBros — Rolls y Precios"
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors duration-500" />
                </div>
                {/* Card de precio */}
                <div className="relative aspect-square rounded-3xl overflow-hidden bg-gradient-to-br from-[#e53e3e] to-[#dc2626] p-6 flex flex-col justify-center items-center text-center shadow-[0_8px_30px_rgba(229,62,62,0.3)]">
                  <span className="text-xs uppercase tracking-widest text-white/70 font-bold mb-1">Desde</span>
                  <span className="text-5xl font-black text-white mb-1 tabular-nums leading-none">S/10</span>
                  <span className="text-white/90 font-bold text-sm uppercase tracking-wider">c/u</span>
                  <span className="text-white/60 text-xs mt-2">5 variedades</span>
                </div>
              </FadeIn>
            </div>
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
                924 336 957
              </a>
            </SlideUp>
          </div>

        </div>
      </div>
    </section>
  );
}
