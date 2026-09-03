export function HeroSection() {
  return (
    <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden bg-[#0a0a0a]">
      {/* Decorative Circles Background */}
      <div className="absolute inset-0 z-0 flex items-center justify-center pointer-events-none opacity-20">
        <div className="absolute w-[300px] h-[300px] rounded-full border border-white/10 animate-spin-slow"></div>
        <div className="absolute w-[500px] h-[500px] rounded-full border border-[#e53e3e]/20 animate-reverse-spin-slow"></div>
        <div className="absolute w-[700px] h-[700px] rounded-full border border-white/5 animate-spin-slow"></div>
      </div>
      
      {/* Radial Gradient Overlay */}
      <div className="absolute inset-0 bg-radial-gradient from-transparent to-[#0a0a0a] z-0 pointer-events-none"></div>

      <div className="container relative z-10 px-4 py-32 mx-auto text-center">
        <div className="animate-fade-in-up space-y-6 max-w-4xl mx-auto">
          <p className="text-[#e53e3e] font-semibold tracking-widest uppercase text-sm md:text-base">
            MakiBros — Fusión Peruano-Japonesa
          </p>
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-black text-white uppercase tracking-tighter leading-tight">
            Descubre el <br className="hidden md:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-500">
              sabor de Japón
            </span>
            <br className="hidden md:block" />
            en cada bocado
          </h1>
          <p className="mt-6 text-xl text-gray-400 max-w-2xl mx-auto font-light">
            Experiencia culinaria única donde la tradición japonesa se encuentra con la pasión de los sabores peruanos.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-8">
            <a 
              href="#menu"
              className="w-full sm:w-auto px-8 py-4 text-white font-medium bg-[#e53e3e] hover:bg-red-700 rounded-md transition-all hover:scale-105 inline-flex items-center justify-center"
            >
              Ordenar Ahora
            </a>
            <a 
              href="#menu"
              className="w-full sm:w-auto px-8 py-4 text-white font-medium border border-white/20 hover:border-white/50 hover:bg-white/5 rounded-md transition-all inline-flex items-center justify-center"
            >
              Ver Menú
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
