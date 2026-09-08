import Link from 'next/link';
import Image from 'next/image';
import { Flame, Sparkles, Award, ArrowRight } from 'lucide-react';

export function AboutSection() {
  return (
    <section id="nosotros" className="relative py-24 sm:py-32 bg-[#09090c] border-y border-white/[0.06] overflow-hidden">
      {/* Background glow ambiance */}
      <div className="absolute top-1/2 left-0 -translate-y-1/2 w-96 h-96 bg-[#e53e3e]/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-80 h-80 bg-[#f59e0b]/10 rounded-full blur-3xl pointer-events-none" />

      <div className="container mx-auto px-4 sm:px-6 relative z-10">
        <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-20">
          
          {/* Image Showcase Side */}
          <div className="w-full lg:w-1/2 flex justify-center">
            <div className="relative w-full max-w-md aspect-square rounded-3xl p-3 bg-gradient-to-b from-white/[0.1] to-white/[0.02] border border-white/[0.08] shadow-2xl shadow-black/80">
              <div className="relative w-full h-full rounded-2xl overflow-hidden bg-[#121218]">
                <Image
                  src="https://images.unsplash.com/photo-1579871494447-9811cf80d66c?q=80&w=1000&auto=format&fit=crop"
                  alt="MakiBros Experiencia Gastronómica Nikkei"
                  fill
                  className="object-cover object-center transform hover:scale-105 transition-transform duration-700 ease-out"
                  sizes="(max-width: 768px) 100vw, 500px"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#09090c] via-transparent to-black/30" />

                {/* Floating Japanese Seal */}
                <div className="absolute top-4 right-4 px-3 py-1.5 rounded-full bg-black/60 backdrop-blur-md border border-white/10 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[#e53e3e] animate-pulse" />
                  <span className="text-[11px] font-mono tracking-widest text-[#f59e0b] uppercase font-semibold">
                    伝統と革新
                  </span>
                </div>

                {/* Bottom Floating Badge */}
                <div className="absolute bottom-4 left-4 right-4 p-4 rounded-xl bg-black/75 backdrop-blur-md border border-white/10 shadow-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-[10px] uppercase font-mono tracking-wider text-neutral-400">Filosofía de Cocina</p>
                      <p className="text-sm font-bold text-white tracking-wide">Crunch Panko & Fuego Nikkei</p>
                    </div>
                    <div className="w-10 h-10 rounded-lg bg-[#e53e3e]/20 border border-[#e53e3e]/30 flex items-center justify-center text-[#e53e3e]">
                      <Flame className="w-5 h-5 fill-[#e53e3e]" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Text Content Side */}
          <div className="w-full lg:w-1/2 space-y-7">
            <div className="space-y-3">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#e53e3e]/10 border border-[#e53e3e]/20 text-[#e53e3e] text-xs font-mono uppercase tracking-widest">
                <Sparkles className="w-3.5 h-3.5" />
                Cocina Fusión Urbana
              </div>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight leading-tight">
                El verdadero flow <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#e53e3e] via-red-500 to-[#f59e0b]">Peruano</span>
              </h2>
              <p className="text-lg sm:text-xl text-[#f59e0b] font-medium italic">
                &ldquo;Diseño Banderilla, Sabor Máximo&rdquo;
              </p>
            </div>
            
            <div className="space-y-4 text-neutral-300 text-sm sm:text-base leading-relaxed">
              <p>
                En <strong className="text-white font-semibold">MakiBros</strong> transformamos el concepto de sushi urbano. Nacimos para romper esquemas con nuestras innovadoras banderillas crocantes y rolls generosos bien taypá, fusionando el crujiente rebozado panko con las salsas acevichadas y chimichurris más bravos de Lima.
              </p>
              <p>
                Sin poses ni rodeos: seleccionamos pesca fresca certificada, aplicamos soplete en vivo y montamos cada pieza al momento para garantizar temperatura, textura y adicción en cada mordisco.
              </p>
            </div>

            {/* Craft Pillars */}
            <div className="grid grid-cols-2 gap-3 pt-2">
              <div className="p-3.5 rounded-xl bg-white/[0.03] border border-white/[0.06] flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-[#f59e0b]/15 flex items-center justify-center text-[#f59e0b] shrink-0">
                  <Award className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-xs font-semibold text-white">Pesca del Día</p>
                  <p className="text-[11px] text-neutral-400">100% seleccionada fresca</p>
                </div>
              </div>
              <div className="p-3.5 rounded-xl bg-white/[0.03] border border-white/[0.06] flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-[#e53e3e]/15 flex items-center justify-center text-[#e53e3e] shrink-0">
                  <Flame className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-xs font-semibold text-white">Sabor Ahumado</p>
                  <p className="text-[11px] text-neutral-400">Flambeado al momento</p>
                </div>
              </div>
            </div>
            
            <div className="pt-2">
              <Link 
                href="/nosotros" 
                className="btn-press inline-flex items-center gap-2.5 px-6 py-3 rounded-full bg-white/[0.06] hover:bg-white/[0.12] text-white font-semibold text-sm border border-white/10 hover:border-white/20 transition-all duration-200 group"
              >
                <span>Conoce nuestra historia y cocina</span>
                <ArrowRight className="w-4 h-4 text-[#f59e0b] transform group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}

