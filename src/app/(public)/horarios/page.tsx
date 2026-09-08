import Link from 'next/link'
import { Navbar } from '@/components/public/navbar'
import { Footer } from '@/components/public/footer'
import { Clock, MapPin, Calendar, ArrowRight, MessageCircle } from 'lucide-react'

export const metadata = {
  title: 'Horarios de Atención — MakiBros | Lima Norte',
  description: 'Consulta nuestros horarios de atención para salón, delivery y recojo en local en MakiBros Lima.',
}

export default function HorariosPage() {
  const currentDayIndex = new Date().getDay() // 0 = Domingo, 1 = Lunes...
  const dayIndexMap: Record<number, number> = {
    1: 0, // Lunes
    2: 1, // Martes
    3: 2, // Miércoles
    4: 3, // Jueves
    5: 4, // Viernes
    6: 5, // Sábado
    0: 6, // Domingo
  }
  const todayHighlightIndex = dayIndexMap[currentDayIndex] ?? 0

  const scheduleDays = [
    { day: 'Lunes', hours: '12:00 PM – 10:00 PM', status: 'Abierto' },
    { day: 'Martes', hours: '12:00 PM – 10:00 PM', status: 'Abierto' },
    { day: 'Miércoles', hours: '12:00 PM – 10:00 PM', status: 'Abierto' },
    { day: 'Jueves', hours: '12:00 PM – 10:00 PM', status: 'Abierto' },
    { day: 'Viernes', hours: '12:00 PM – 10:00 PM', status: 'Abierto' },
    { day: 'Sábado', hours: '12:00 PM – 10:00 PM', status: 'Abierto' },
    { day: 'Domingo', hours: '12:00 PM – 08:00 PM', status: 'Abierto' },
  ]

  return (
    <div className="min-h-screen bg-[#09090c] text-white flex flex-col selection:bg-[#e53e3e] selection:text-white">
      <Navbar />

      <main className="flex-1 py-16 sm:py-24 px-4 sm:px-6">
        <div className="max-w-4xl mx-auto space-y-12">
          {/* Header */}
          <div className="text-center space-y-4">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-mono uppercase tracking-widest font-semibold">
              <Clock className="w-3.5 h-3.5" />
              <span>Atención Continua Todos los Días</span>
            </div>
            <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
              Horarios de <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#e53e3e] to-[#f59e0b]">Atención</span>
            </h1>
            <p className="text-neutral-400 text-sm sm:text-base max-w-xl mx-auto leading-relaxed">
              Estamos listos para preparar tus makis favoritos de lunes a domingo. Consulta nuestros turnos para delivery y salón.
            </p>
          </div>

          {/* Schedule Table Card */}
          <div className="bg-[#121217] border border-white/[0.08] rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl shadow-black/40">
            <div className="flex items-center justify-between pb-4 border-b border-white/[0.06]">
              <div className="flex items-center gap-3">
                <Calendar className="w-5 h-5 text-[#e53e3e]" />
                <h2 className="text-lg sm:text-xl font-black text-white">Días y Turnos de Cocina</h2>
              </div>
              <span className="text-xs font-mono uppercase text-neutral-400">Lima, Perú (GMT-5)</span>
            </div>

            <div className="divide-y divide-white/[0.06]">
              {scheduleDays.map((item, idx) => {
                const isToday = idx === todayHighlightIndex;
                return (
                  <div 
                    key={item.day} 
                    className={`py-3.5 sm:py-4 px-3 sm:px-4 rounded-xl flex items-center justify-between transition-colors ${
                      isToday ? 'bg-white/[0.04] border border-white/[0.08]' : ''
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      {isToday && (
                        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shrink-0" />
                      )}
                      <span className={`font-semibold text-sm sm:text-base ${isToday ? 'text-white' : 'text-neutral-300'}`}>
                        {item.day}
                      </span>
                      {isToday && (
                        <span className="text-[10px] uppercase font-mono tracking-wider font-bold text-emerald-400 bg-emerald-500/15 border border-emerald-500/30 px-2 py-0.5 rounded-full">
                          Hoy
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-3 sm:gap-4">
                      <span className="text-neutral-300 font-mono text-xs sm:text-sm tabular-nums">
                        {item.hours}
                      </span>
                      <span className="text-[11px] font-mono font-bold px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/25">
                        {item.status}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Service modalities */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-[#121217] border border-white/[0.08] rounded-3xl p-6 space-y-3 shadow-xl shadow-black/30">
              <div className="w-10 h-10 rounded-xl bg-[#e53e3e]/15 text-[#e53e3e] border border-[#e53e3e]/30 flex items-center justify-center">
                <MapPin className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-white">Local y Recojo</h3>
              <p className="text-xs sm:text-sm text-neutral-400 leading-relaxed">
                Av. Universitaria con Retablo, Comas, Lima. Puedes realizar tu pedido con anticipación por la web y recogerlo caliente sin hacer cola.
              </p>
            </div>

            <div className="bg-[#121217] border border-white/[0.08] rounded-3xl p-6 space-y-3 shadow-xl shadow-black/30">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 flex items-center justify-center">
                <MessageCircle className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-white">Delivery Express</h3>
              <p className="text-xs sm:text-sm text-neutral-400 leading-relaxed">
                Envío a domicilio en toda la zona norte. Aceptamos pedidos hasta las 22:00 hrs o agotar STOCK. Comunícate al WhatsApp <strong className="text-white font-mono">+51 987 654 321</strong>.
              </p>
            </div>
          </div>

          {/* Quick CTA */}
          <div className="text-center pt-4">
            <Link
              href="/#menu"
              className="btn-press inline-flex items-center gap-2.5 px-8 py-4 bg-[#e53e3e] hover:bg-[#c53030] text-white font-bold rounded-full transition-all text-sm sm:text-base shadow-xl shadow-[#e53e3e]/25"
            >
              <span>Explorar el Menú y Pedir Ahora</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}

