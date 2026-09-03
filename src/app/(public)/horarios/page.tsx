import Link from 'next/link'
import { Navbar } from '@/components/public/navbar'
import { Footer } from '@/components/public/footer'
import { Clock, MapPin, Phone, Calendar, ArrowRight } from 'lucide-react'

export const metadata = {
  title: 'Horarios de Atención — MakiBros',
  description: 'Consulta nuestros horarios de atención para salón, delivery y recojo en local en MakiBros Lima.',
}

export default function HorariosPage() {
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
    <div className="min-h-screen bg-[#0a0a0a] text-white flex flex-col">
      <Navbar />

      <main className="flex-1 py-16 px-4">
        <div className="max-w-4xl mx-auto space-y-12">
          {/* Header */}
          <div className="text-center space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#48bb78]/10 border border-[#48bb78]/20 text-[#48bb78] text-xs font-semibold uppercase tracking-wider">
              <Clock className="w-3.5 h-3.5" />
              Atención Continua
            </div>
            <h1 className="text-3xl md:text-5xl font-black text-white tracking-tight">
              Horarios de Atención
            </h1>
            <p className="text-[#a0a0a0] text-sm md:text-base max-w-xl mx-auto">
              Estamos listos para preparar tus makis favoritos todos los días. Consulta nuestros turnos para delivery y salón.
            </p>
          </div>

          {/* Schedule Table Card */}
          <div className="bg-[#141414] border border-[#262626] rounded-2xl p-6 md:p-8 space-y-6">
            <div className="flex items-center gap-3 pb-4 border-b border-[#222]">
              <Calendar className="w-5 h-5 text-[#e53e3e]" />
              <h2 className="text-xl font-bold text-white">Días y Horarios</h2>
            </div>

            <div className="divide-y divide-[#222]">
              {scheduleDays.map((item) => (
                <div key={item.day} className="py-3.5 flex items-center justify-between text-sm">
                  <span className="font-semibold text-white">{item.day}</span>
                  <div className="flex items-center gap-4">
                    <span className="text-gray-300 font-mono text-xs md:text-sm">{item.hours}</span>
                    <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-[#48bb78]/10 text-[#48bb78] border border-[#48bb78]/30">
                      {item.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Service modalities */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-[#141414] border border-[#262626] rounded-2xl p-6 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-[#e53e3e]/10 text-[#e53e3e] flex items-center justify-center">
                <MapPin className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-white">Local y Recojo</h3>
              <p className="text-xs text-[#a0a0a0] leading-relaxed">
                Av. Universitaria con Retablo, Lima, Perú. Puedes hacer tu pedido con anticipación y recogerlo caliente sin hacer cola.
              </p>
            </div>

            <div className="bg-[#141414] border border-[#262626] rounded-2xl p-6 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-[#48bb78]/10 text-[#48bb78] flex items-center justify-center">
                <Phone className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-white">Delivery Express</h3>
              <p className="text-xs text-[#a0a0a0] leading-relaxed">
                Envío a domicilio en toda la zona. Aceptamos pedidos hasta las 22:00 hrs. Pide directo al WhatsApp +51 987 654 321.
              </p>
            </div>
          </div>

          {/* Quick CTA */}
          <div className="text-center pt-4">
            <Link
              href="/#menu"
              className="inline-flex items-center gap-2 px-8 py-4 bg-[#e53e3e] hover:bg-[#c53030] text-white font-bold rounded-full transition-colors text-sm shadow-lg shadow-red-900/20"
            >
              Explorar el Menú y Pedir Ahora
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
