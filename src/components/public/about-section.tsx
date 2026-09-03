import Link from 'next/link';

export function AboutSection() {
  return (
    <section id="nosotros" className="py-24 bg-[#0a0a0a] border-y border-[#1a1a1a]">
      <div className="container mx-auto px-4">
        <div className="flex flex-col lg:flex-row items-center gap-16">
          
          {/* Image Side */}
          <div className="w-full lg:w-1/2 flex justify-center">
            <div className="relative w-72 h-72 md:w-96 md:h-96 rounded-full border-4 border-[#1a1a1a] p-2">
              <div className="w-full h-full rounded-full bg-[#111] overflow-hidden relative flex items-center justify-center">
                <div className="absolute inset-0 bg-gradient-to-tr from-[#1a1a1a] to-[#2a2a2a] opacity-50"></div>
                <div className="text-8xl relative z-10 animate-bounce-slow">🥢</div>
                
                {/* Decorative dots */}
                <div className="absolute top-4 right-10 w-3 h-3 bg-[#e53e3e] rounded-full"></div>
                <div className="absolute bottom-10 left-10 w-2 h-2 bg-[#f6ad55] rounded-full"></div>
              </div>
            </div>
          </div>

          {/* Text Side */}
          <div className="w-full lg:w-1/2 space-y-6">
            <div className="space-y-2">
              <h3 className="text-[#e53e3e] font-medium tracking-wider uppercase text-sm">
                Restaurante de Cocina Fusión
              </h3>
              <h2 className="text-4xl md:text-5xl font-black text-white tracking-tight">
                MakiBros
              </h2>
              <p className="text-xl text-[#f6ad55] font-light italic">
                &ldquo;Diseño Banderilla, Sabor Máximo&rdquo;
              </p>
            </div>
            
            <div className="space-y-4 text-[#a0a0a0] leading-relaxed">
              <p>
                En MakiBros le metemos el verdadero flow peruano a los makis. Nacimos para romperla con nuestras innovadoras banderillas crocantes y rolls bien taypá, combinando el crunch del panko con las salsas más bravas y adictivas de Lima.
              </p>
              <p>
                Aquí no hay floro: seleccionamos la mejor pesca del día, le ponemos harto fuego y nuestra inconfundible salsa acevichada para armar una verdadera fiesta nikkei. ¡Puro sabor crujiente para bajonear y disfrutar con los brothers!
              </p>
            </div>
            
            <div className="pt-4">
              <Link 
                href="/nosotros" 
                className="inline-flex items-center text-white font-medium hover:text-[#e53e3e] transition-colors group"
              >
                Más información 
                <span className="ml-2 transform group-hover:translate-x-1 transition-transform">→</span>
              </Link>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
