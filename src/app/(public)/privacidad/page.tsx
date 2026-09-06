import Link from 'next/link'
import { Navbar } from '@/components/public/navbar'
import { Footer } from '@/components/public/footer'
import { ShieldCheck, ArrowLeft } from 'lucide-react'

export const metadata = {
  title: 'Política de Privacidad — MakiBros | Términos y Protección de Datos',
  description: 'Conoce los términos y condiciones sobre el tratamiento de datos personales y pedidos en MakiBros Lima.',
}

export default function PrivacidadPage() {
  return (
    <div className="min-h-screen bg-[#09090c] text-white flex flex-col selection:bg-[#e53e3e] selection:text-white">
      <Navbar />

      <main className="flex-1 py-16 sm:py-24 px-4 sm:px-6">
        <div className="max-w-3xl mx-auto space-y-8">
          <Link
            href="/"
            className="btn-press inline-flex items-center gap-2 text-xs font-mono text-neutral-400 hover:text-white transition-colors uppercase tracking-wider"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Volver al Inicio</span>
          </Link>

          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#e53e3e]/10 border border-[#e53e3e]/20 text-[#e53e3e] text-xs font-mono uppercase tracking-widest font-semibold">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Términos & Privacidad</span>
            </div>
            <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
              Política de <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#e53e3e] to-[#f59e0b]">Privacidad</span>
            </h1>
            <p className="text-xs font-mono text-neutral-500">
              Última actualización: Septiembre de 2026 • Lima, Perú
            </p>
          </div>

          <div className="bg-[#121217] border border-white/[0.08] rounded-3xl p-6 sm:p-10 space-y-7 text-sm text-neutral-300 leading-relaxed shadow-2xl shadow-black/40">
            <section className="space-y-2">
              <h2 className="text-base font-black text-white">1. Responsable del Tratamiento</h2>
              <p>
                MakiBros, con establecimiento en Av. Universitaria con Retablo, Comas, Lima, Perú, es responsable de la recopilación y tratamiento de los datos personales suministrados para la gestión de pedidos, despachos a domicilio y atención al cliente.
              </p>
            </section>

            <section className="space-y-2">
              <h2 className="text-base font-black text-white">2. Información que Recopilamos</h2>
              <p>
                Al realizar un pedido a través de nuestra web o canal de WhatsApp oficial (<span className="text-white font-mono">+51 987 654 321</span>), recopilamos únicamente los datos indispensables:
              </p>
              <ul className="list-disc pl-5 space-y-1.5 text-xs text-neutral-400">
                <li>Nombre y apellido de contacto.</li>
                <li>Número telefónico y de WhatsApp para coordinación de entrega.</li>
                <li>Dirección de entrega y referencias de ubicación.</li>
                <li>Detalle de platos elegidos, notas culinarias y modalidad de pago seleccionada.</li>
              </ul>
            </section>

            <section className="space-y-2">
              <h2 className="text-base font-black text-white">3. Finalidad del Uso de los Datos</h2>
              <p>
                Sus datos son tratados con la máxima confidencialidad para:
              </p>
              <ul className="list-disc pl-5 space-y-1.5 text-xs text-neutral-400">
                <li>Procesar, preparar y despachar sus makis de forma puntual y caliente.</li>
                <li>Notificar el estado de su orden en tiempo real con el repartidor.</li>
                <li>Atender solicitudes, cambios o soporte post-venta de su experiencia gastronómica.</li>
              </ul>
            </section>

            <section className="space-y-2">
              <h2 className="text-base font-black text-white">4. Seguridad y No Divulgación</h2>
              <p>
                En MakiBros no vendemos, alquilamos ni transferimos sus datos personales a terceros ni a plataformas de publicidad invasiva. La información se almacena bajo estrictos protocolos de protección técnica.
              </p>
            </section>

            <section className="space-y-2">
              <h2 className="text-base font-black text-white">5. Canales de Contacto</h2>
              <p>
                Para cualquier duda, rectificación o cancelación de sus datos de nuestros sistemas, comuníquese con nuestro equipo mediante el correo <strong className="text-white font-mono">soporte@MakiBros.pe</strong> o vía WhatsApp al <strong className="text-white font-mono">+51 987 654 321</strong>.
              </p>
            </section>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}

