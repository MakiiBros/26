'use client';

import Image from 'next/image';
import { Flame, Clock, Award, Leaf } from 'lucide-react';
import { SlideUp, FadeIn, StaggerContainer, StaggerItem } from '@/components/ui/motion-wrappers';

export function AboutSection() {
  const features = [
    {
      icon: <Flame className="w-6 h-6 text-[#e53e3e]" />,
      title: 'Banderillas Crocantes',
      description: 'El equilibrio perfecto entre panko artesanal y nuestro relleno exclusivo. Frito al instante.'
    },
    {
      icon: <Award className="w-6 h-6 text-[#f59e0b]" />,
      title: 'Calidad Premium',
      description: 'Cortes frescos del día y salsas caseras como nuestra acevichada brava.'
    },
    {
      icon: <Clock className="w-6 h-6 text-emerald-500" />,
      title: 'Rapidez Extrema',
      description: 'Tu pedido listo en tiempo récord para que el flow no se detenga.'
    },
    {
      icon: <Leaf className="w-6 h-6 text-teal-400" />,
      title: 'Auténtico y Fresco',
      description: 'Ingredientes seleccionados cada mañana en el mercado central.'
    }
  ];

  return (
    <section id="nosotros" className="py-24 sm:py-32 relative bg-[#09090c] overflow-hidden">
      {/* Background elements */}
      <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-[#e53e3e]/5 to-transparent pointer-events-none" />
      <div className="absolute -left-32 top-1/4 w-96 h-96 bg-[#f59e0b]/5 rounded-full blur-[100px] pointer-events-none" />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">
          
          {/* Images Grid */}
          <div className="relative">
            <div className="grid grid-cols-2 gap-4 sm:gap-6 relative z-10">
              <FadeIn delay={0.1} className="space-y-4 sm:space-y-6 mt-8 sm:mt-12">
                <div className="relative aspect-square rounded-3xl overflow-hidden shadow-[0_8px_30px_rgb(0,0,0,0.5)] border border-white/10 group">
                  <Image 
                    src="https://images.unsplash.com/photo-1553621042-f6e147245754?q=80&w=800&auto=format&fit=crop" 
                    alt="Preparación Sushi MakiBros" 
                    fill 
                    className="object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors duration-500" />
                </div>
                <div className="relative aspect-[4/5] rounded-3xl overflow-hidden shadow-[0_8px_30px_rgb(0,0,0,0.5)] border border-white/10 group">
                  <Image 
                    src="https://images.unsplash.com/photo-1582878826629-29b7ad1cdc43?q=80&w=800&auto=format&fit=crop" 
                    alt="Detalle MakiBros" 
                    fill 
                    className="object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors duration-500" />
                </div>
              </FadeIn>

              <FadeIn delay={0.3} className="space-y-4 sm:space-y-6">
                <div className="relative aspect-[4/5] rounded-3xl overflow-hidden shadow-[0_8px_30px_rgb(0,0,0,0.5)] border border-white/10 group">
                  <Image 
                    src="https://images.unsplash.com/photo-1615361200141-f45040f367be?q=80&w=800&auto=format&fit=crop" 
                    alt="Ingredientes MakiBros" 
                    fill 
                    className="object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors duration-500" />
                </div>
                <div className="relative aspect-square rounded-3xl overflow-hidden bg-gradient-to-br from-[#e53e3e] to-[#dc2626] p-6 flex flex-col justify-center items-center text-center shadow-[0_8px_30px_rgba(229,62,62,0.3)]">
                  <span className="text-5xl font-black text-white mb-2">+50k</span>
                  <span className="text-white/90 font-bold text-sm uppercase tracking-wider">Pedidos Entregados</span>
                </div>
              </FadeIn>
            </div>
            
            {/* Decal */}
            <div className="absolute -top-12 -right-12 w-32 h-32 text-white/5 animate-[spin_20s_linear_infinite] pointer-events-none hidden md:block">
              <svg viewBox="0 0 100 100" className="w-full h-full fill-current">
                <path d="M50 0 C77.61 0 100 22.39 100 50 C100 77.61 77.61 100 50 100 C22.39 100 0 77.61 0 50 C0 22.39 22.39 0 50 0 Z" />
              </svg>
            </div>
          </div>

          {/* Text Content */}
          <div className="space-y-8 lg:pl-10">
            <SlideUp>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/[0.05] border border-white/10 text-neutral-300 text-xs font-mono uppercase tracking-widest font-semibold mb-2">
                <Flame className="w-3.5 h-3.5 text-[#e53e3e]" />
                Nuestra Historia
              </div>
              <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight leading-[1.1]">
                No vendemos comida, <br/>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#e53e3e] to-[#f59e0b]">
                  repartimos flow.
                </span>
              </h2>
            </SlideUp>

            <SlideUp delay={0.1}>
              <p className="text-neutral-400 text-base sm:text-lg leading-relaxed">
                MakiBros nació en las calles de Comas con una misión clara: democratizar el buen maki. Combinamos la precisión japonesa con la sazón y porciones generosas que el barrio exige.
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

            <SlideUp delay={0.3} className="pt-4">
              <a 
                href="#menu" 
                className="btn-press inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-white text-black font-bold text-sm hover:bg-neutral-200 transition-colors shadow-[0_0_20px_rgba(255,255,255,0.2)]"
              >
                Probar la Experiencia
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </a>
            </SlideUp>
          </div>

        </div>
      </div>
    </section>
  );
}
