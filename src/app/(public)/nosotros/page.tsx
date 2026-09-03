import Link from 'next/link'
import { Navbar } from '@/components/public/navbar'
import { Footer } from '@/components/public/footer'
import { Flame, Sparkles, Award, Heart, ArrowRight } from 'lucide-react'

export const metadata = {
  title: 'Sobre Nosotros — MakiBros',
  description: 'Conoce la historia, el flow nikkei y la propuesta de MakiBros. Fusión peruano-japonesa con diseño banderilla y sabor máximo.',
}

export default function NosotrosPage() {
  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white flex flex-col">
      <Navbar />

      <main className="flex-1">
        {/* Header Hero */}
        <section className="py-20 px-4 bg-gradient-to-b from-[#141414] to-[#0a0a0a] border-b border-[#1f1f1f] text-center">
          <div className="max-w-3xl mx-auto space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#e53e3e]/10 border border-[#e53e3e]/20 text-[#e53e3e] text-xs font-semibold uppercase tracking-wider">
              Nuestra Historia
            </div>
            <h1 className="text-4xl md:text-5xl font-black text-white tracking-tight">
              MakiBros
            </h1>
            <p className="text-xl md:text-2xl text-[#f6ad55] font-bold">
              “Diseño Banderilla, Sabor Máximo”
            </p>
            <p className="text-[#a0a0a0] text-base md:text-lg max-w-2xl mx-auto leading-relaxed pt-2">
              En MakiBros le metemos el verdadero flow peruano a los makis. Nacimos para romperla con nuestras innovadoras banderillas crocantes y rolls bien taypá, combinando el crunch del panko con las salsas más bravas y adictivas de Lima.
            </p>
          </div>
        </section>

        {/* Pillars / Values */}
        <section className="py-20 px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-black text-white">¿Por qué MakiBros?</h2>
              <p className="text-[#a0a0a0] mt-2 text-sm">Los 4 pilares que hacen única nuestra propuesta nikkei</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-[#141414] border border-[#262626] p-6 rounded-2xl space-y-4 hover:border-[#e53e3e]/40 transition-colors">
                <div className="w-12 h-12 bg-[#e53e3e]/10 text-[#e53e3e] rounded-xl flex items-center justify-center">
                  <Flame className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-white">Fuego y Pasión</h3>
                <p className="text-xs text-[#a0a0a0] leading-relaxed">
                  Sopleteamos cada roll con maestría para liberar notas ahumadas intensas y toques caramelizados que despiertan el paladar.
                </p>
              </div>

              <div className="bg-[#141414] border border-[#262626] p-6 rounded-2xl space-y-4 hover:border-[#f6ad55]/40 transition-colors">
                <div className="w-12 h-12 bg-[#f6ad55]/10 text-[#f6ad55] rounded-xl flex items-center justify-center">
                  <Sparkles className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-white">Crunch Inigualable</h3>
                <p className="text-xs text-[#a0a0a0] leading-relaxed">
                  El panko dorado al punto exacto para nuestras banderillas y rolls crocantes que conservan la textura hasta el último bocado.
                </p>
              </div>

              <div className="bg-[#141414] border border-[#262626] p-6 rounded-2xl space-y-4 hover:border-[#48bb78]/40 transition-colors">
                <div className="w-12 h-12 bg-[#48bb78]/10 text-[#48bb78] rounded-xl flex items-center justify-center">
                  <Award className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-white">Pesca Fresca del Día</h3>
                <p className="text-xs text-[#a0a0a0] leading-relaxed">
                  Aquí no hay floro: seleccionamos trucha, atún y mariscos de primera calidad para garantizar una frescura insuperable.
                </p>
              </div>

              <div className="bg-[#141414] border border-[#262626] p-6 rounded-2xl space-y-4 hover:border-purple-500/40 transition-colors">
                <div className="w-12 h-12 bg-purple-500/10 text-purple-400 rounded-xl flex items-center justify-center">
                  <Heart className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-white">Flow Nikkei Puro</h3>
                <p className="text-xs text-[#a0a0a0] leading-relaxed">
                  Nuestra inconfundible salsa acevichada, toques de ají amarillo, maracuyá y un toque ahumado que une dos culturas gastronómicas.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA section */}
        <section className="py-20 px-4 bg-[#111] border-t border-[#222] text-center">
          <div className="max-w-2xl mx-auto space-y-6">
            <h2 className="text-3xl md:text-4xl font-bold text-white">¿Listo para probar la experiencia?</h2>
            <p className="text-[#a0a0a0] text-sm">
              Visítanos en Av. Universitaria con Retablo, Lima o pide por delivery directo a tu casa.
            </p>
            <div className="flex flex-wrap justify-center gap-4 pt-2">
              <Link
                href="/#menu"
                className="px-8 py-3.5 bg-[#e53e3e] hover:bg-[#c53030] text-white font-bold rounded-full transition-colors flex items-center gap-2 text-sm shadow-lg shadow-red-900/20"
              >
                Ver Nuestra Carta
                <ArrowRight className="w-4 h-4" />
              </Link>
              <a
                href="https://wa.me/51987654321"
                target="_blank"
                rel="noreferrer"
                className="px-8 py-3.5 bg-[#1f1f1f] hover:bg-[#2a2a2a] text-white font-bold rounded-full transition-colors text-sm border border-[#333]"
              >
                Contactar por WhatsApp
              </a>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
