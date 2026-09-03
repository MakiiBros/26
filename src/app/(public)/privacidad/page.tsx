import Link from 'next/link'
import { Navbar } from '@/components/public/navbar'
import { Footer } from '@/components/public/footer'
import { ShieldCheck, ArrowLeft } from 'lucide-react'

export const metadata = {
  title: 'Política de Privacidad — MakiBros',
  description: 'Conoce los términos y condiciones sobre el tratamiento de datos personales y pedidos en MakiBros.',
}

export default function PrivacidadPage() {
  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white flex flex-col">
      <Navbar />

      <main className="flex-1 py-16 px-4">
        <div className="max-w-3xl mx-auto space-y-8">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm text-[#a0a0a0] hover:text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Volver al Inicio
          </Link>

          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#e53e3e]/10 border border-[#e53e3e]/20 text-[#e53e3e] text-xs font-semibold uppercase tracking-wider">
              <ShieldCheck className="w-3.5 h-3.5" />
              Términos & Privacidad
            </div>
            <h1 className="text-3xl md:text-4xl font-black text-white tracking-tight">
              Política de Privacidad
            </h1>
            <p className="text-xs text-[#a0a0a0]">
              Última actualización: Septiembre de 2026
            </p>
          </div>

          <div className="bg-[#141414] border border-[#262626] rounded-2xl p-6 md:p-8 space-y-6 text-sm text-[#c0c0c0] leading-relaxed">
            <section className="space-y-2">
              <h2 className="text-base font-bold text-white">1. Responsable del Tratamiento</h2>
              <p>
                MakiBros, con domicilio en Av. Universitaria con Retablo, Lima, Perú, es responsable de la recopilación y tratamiento de los datos personales suministrados para la gestión de pedidos, entregas y atención al cliente.
              </p>
            </section>

            <section className="space-y-2">
              <h2 className="text-base font-bold text-white">2. Información que Recopilamos</h2>
              <p>
                Al realizar un pedido a través de nuestro sitio web o canal de WhatsApp oficial (+51 987 654 321), podemos recopilar:
              </p>
              <ul className="list-disc pl-5 space-y-1 text-xs text-[#a0a0a0]">
                <li>Nombre y apellido del cliente.</li>
                <li>Número telefónico y de WhatsApp.</li>
                <li>Dirección de entrega y referencias de domicilio.</li>
                <li>Detalle de platos, preferencias culinarias y método de pago seleccionado.</li>
              </ul>
            </section>

            <section className="space-y-2">
              <h2 className="text-base font-bold text-white">3. Finalidad del Uso de los Datos</h2>
              <p>
                Sus datos son utilizados exclusivamente para:
              </p>
              <ul className="list-disc pl-5 space-y-1 text-xs text-[#a0a0a0]">
                <li>Procesar, preparar y despachar sus pedidos de forma exacta y puntual.</li>
                <li>Comunicar el estado de su orden y coordinar con el repartidor.</li>
                <li>Brindar soporte y atención post-venta.</li>
              </ul>
            </section>

            <section className="space-y-2">
              <h2 className="text-base font-bold text-white">4. Seguridad y No Divulgación</h2>
              <p>
                MakiBros no vende, arrienda ni comparte sus datos con terceros con fines publicitarios. Sus datos son confidenciales y se almacenan bajo estrictos estándares de seguridad tecnológica.
              </p>
            </section>

            <section className="space-y-2">
              <h2 className="text-base font-bold text-white">5. Contacto</h2>
              <p>
                Para cualquier consulta, rectificación o eliminación de sus datos de nuestros registros, puede contactarnos directamente a través de nuestro correo soporte@MakiBros.pe o vía WhatsApp al +51 987 654 321.
              </p>
            </section>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
