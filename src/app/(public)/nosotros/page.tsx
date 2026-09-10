import Link from 'next/link'
import { Navbar } from '@/components/public/navbar'
import { Footer } from '@/components/public/footer'
import { Flame, Sparkles, Award, Heart, ArrowRight, MessageCircle } from 'lucide-react'

export const metadata = {
  title: 'Sobre Nosotros — MakiBros | Sabor Peruano',
  description: 'Conoce la historia, el flow y la propuesta gastronómica de MakiBros. Fusión peruano-japonesa con diseño banderilla y sabor máximo.',
}

export default function NosotrosPage() {
  return (
    <div className="min-h-screen bg-[#09090c] text-white flex flex-col selection:bg-[#e53e3e] selection:text-white">
      <Navbar />

      <main className="flex-1">
        {/* Header Hero */}
        <section className="py-24 sm:py-32 px-4 sm:px-6 bg-gradient-to-b from-[#121217] to-[#09090c] border-b border-white/[0.06] text-center relative overflow-hidden">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-[#e53e3e]/10 rounded-full blur-3xl pointer-events-none" />

          <div className="max-w-3xl mx-auto space-y-5 relative z-10">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#e53e3e]/10 border border-[#e53e3e]/20 text-[#e53e3e] text-xs font-mono uppercase tracking-widest font-semibold">
              <Sparkles className="w-3.5 h-3.5" />
              Nuestra Historia & Esencia
            </div>

            <h1 className="text-4xl sm:text-6xl font-black text-white tracking-tight">
              MakiBr<span className="text-[#e53e3e]">o</span>s
            </h1>

            <p className="text-xl sm:text-2xl text-[#f59e0b] font-medium italic">
              &ldquo;Diseño Banderilla, Sabor Máximo&rdquo;
            </p>

            <p className="text-neutral-300 text-base sm:text-lg max-w-2xl mx-auto leading-relaxed pt-2">
              En MakiBros le metemos el verdadero flow peruano a los makis. Nacimos para romper esquemas con nuestras innovadoras banderillas crocantes y rolls bien taypá, combinando el crujiente rebozado panko con las salsas acevichadas y chimichurris más bravos de Lima Norte.
            </p>
          </div>
        </section>

        {/* Pillars / Values */}
        <section className="py-24 sm:py-32 px-4 sm:px-6 relative">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16 space-y-3">
              <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
                ¿Por qué elegir <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#e53e3e] to-[#f59e0b]">MakiBros</span>?
              </h2>
              <p className="text-neutral-400 text-sm sm:text-base max-w-lg mx-auto">
                Los 4 pilares artesanales que hacen única e inconfundible nuestra propuesta .
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-[#121217] border border-white/[0.08] p-7 rounded-3xl space-y-4 hover:border-[#e53e3e]/40 transition-all duration-300 shadow-xl shadow-black/40">
                <div className="w-12 h-12 bg-[#e53e3e]/15 text-[#e53e3e] border border-[#e53e3e]/30 rounded-2xl flex items-center justify-center">
                  <Flame className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-white">Fuego y Pasión</h3>
                <p className="text-xs sm:text-sm text-neutral-400 leading-relaxed">
                  Sopleteamos cada roll con maestría para liberar notas ahumadas intensas y toques caramelizados que despiertan el paladar en cada bocado.
                </p>
              </div>

              <div className="bg-[#121217] border border-white/[0.08] p-7 rounded-3xl space-y-4 hover:border-[#f59e0b]/40 transition-all duration-300 shadow-xl shadow-black/40">
                <div className="w-12 h-12 bg-[#f59e0b]/15 text-[#f59e0b] border border-[#f59e0b]/30 rounded-2xl flex items-center justify-center">
                  <Sparkles className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-white">Crunch Inigualable</h3>
                <p className="text-xs sm:text-sm text-neutral-400 leading-relaxed">
                  Panko artesanal dorado al punto exacto para nuestras banderillas y rolls crocantes que conservan su textura crocante hasta el último instante.
                </p>
              </div>

              <div className="bg-[#121217] border border-white/[0.08] p-7 rounded-3xl space-y-4 hover:border-emerald-500/40 transition-all duration-300 shadow-xl shadow-black/40">
                <div className="w-12 h-12 bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 rounded-2xl flex items-center justify-center">
                  <Award className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-white">Pesca Fresca del Día</h3>
                <p className="text-xs sm:text-sm text-neutral-400 leading-relaxed">
                  Aquí no hay floro: seleccionamos trucha, atún y mariscos frescos de primera calidad para garantizar una textura y sabor insuperables.
                </p>
              </div>

              <div className="bg-[#121217] border border-white/[0.08] p-7 rounded-3xl space-y-4 hover:border-purple-500/40 transition-all duration-300 shadow-xl shadow-black/40">
                <div className="w-12 h-12 bg-purple-500/15 text-purple-400 border border-purple-500/30 rounded-2xl flex items-center justify-center">
                  <Heart className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-white">Flow Puro</h3>
                <p className="text-xs sm:text-sm text-neutral-400 leading-relaxed">
                  Nuestra inconfundible salsa acevichada, reducciones de maracuyá y toques picantes de ají amarillo unen lo mejor del Perú y Japón.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA section */}
        <section className="py-24 px-4 sm:px-6 bg-[#0c0c10] border-t border-white/[0.06] text-center relative overflow-hidden">
          <div className="max-w-2xl mx-auto space-y-6 relative z-10">
            <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
              ¿Listo para vivir la experiencia MakiBros?
            </h2>
            <p className="text-neutral-400 text-sm sm:text-base">
              Visítanos en Av. Universitaria con Retablo, Comas o pide por delivery con entrega rápida a todo Lima Norte.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-3.5 pt-2">
              <Link
                href="/#menu"
                className="btn-press inline-flex items-center justify-center gap-2 px-8 py-3.5 bg-[#e53e3e] hover:bg-[#c53030] text-white font-bold rounded-full transition-all text-sm shadow-xl shadow-[#e53e3e]/25"
              >
                <span>Ver Nuestra Carta</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <a
                href="https://wa.me/51924336957?text=Hola%20MakiBros!%20Deseo%20hacer%20un%20pedido."
                target="_blank"
                rel="noreferrer"
                className="btn-press inline-flex items-center justify-center gap-2 px-8 py-3.5 bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-400 font-bold rounded-full transition-all text-sm border border-emerald-500/30"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Contactar por WhatsApp</span>
              </a>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}

