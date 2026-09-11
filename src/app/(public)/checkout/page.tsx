'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import {
  ArrowLeft,
  Trash2,
  Plus,
  Minus,
  ShoppingBag,
  Send,
  CheckCircle2,
  Bike,
  Store,
  Banknote,
  Smartphone,
  ShieldCheck,
  QrCode,
  Lock
} from 'lucide-react'
import { Navbar } from '@/components/public/navbar'
import { Footer } from '@/components/public/footer'
import { useCart } from '@/context/cart-context'
import { formatPrice } from '@/lib/utils'
import { useToast } from '@/components/ui/toast'

export default function CheckoutPage() {
  const { items, updateQuantity, removeItem, clearCart, totalPrice, totalItems } = useCart()
  const { toast } = useToast()
  const router = useRouter()

  // Entrega y datos del cliente
  const [deliveryType, setDeliveryType] = useState<'delivery' | 'pickup'>('delivery')
  const [customerName, setCustomerName] = useState('')
  const [customerPhone, setCustomerPhone] = useState('')
  const [customerAddress, setCustomerAddress] = useState('')
  const [orderNotes, setOrderNotes] = useState('')

  // Método de pago: Yape Tradicional (QR) o Efectivo
  const [paymentMethod, setPaymentMethod] = useState<'yape' | 'cash'>('yape')

  // Estados de proceso
  const [isProcessing, setIsProcessing] = useState(false)

  const deliveryFee = deliveryType === 'delivery' ? 5.0 : 0.0
  const finalTotal = totalPrice + deliveryFee

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (items.length === 0) {
      toast('Tu carrito está vacío', 'error')
      return
    }

    if (!customerName || !customerPhone || (deliveryType === 'delivery' && !customerAddress)) {
      toast('Completa todos los datos de entrega', 'error')
      return
    }

    setIsProcessing(true)

    try {
      const orderData = {
        deliveryType,
        customerName,
        customerPhone,
        customerAddress,
        orderNotes,
        totalPrice: finalTotal,
        paymentMethod,
        items,
      }

      const res = await fetch('/api/process_payment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderData }),
      })

      const data = await res.json()

      if (data.success) {
        clearCart()
        // Redirigir a WhatsApp directamente
        window.location.href = data.whatsappUrl;
      } else {
        toast(data.error || 'Error al procesar el pedido', 'error')
        setIsProcessing(false)
      }
    } catch (error) {
      console.error(error)
      toast('Ocurrió un error inesperado', 'error')
      setIsProcessing(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#09090c] text-white flex flex-col font-sans">
      <Navbar />

      <main className="flex-grow container mx-auto px-4 py-8 max-w-6xl mt-20">
        <Link 
          href="/#menu" 
          className="inline-flex items-center text-sm font-semibold text-gray-400 hover:text-white mb-6 group transition-colors"
        >
          <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
          Volver al menú
        </Link>

        <h1 className="text-3xl font-black mb-8 tracking-tight flex items-center gap-3">
          Completa tu Orden
          <div className="h-1 flex-grow bg-gradient-to-r from-[#e53e3e] to-transparent rounded-full opacity-20 ml-4 hidden sm:block"></div>
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
          {/* Columna Izquierda: Formulario de Datos y Pago */}
          <div className="lg:col-span-7 space-y-8">
            <form id="checkout-form" onSubmit={handleSubmit} className="space-y-8">
              
              {/* Sección 1: Tipo de Entrega */}
              <div className="bg-[#121217] p-6 rounded-3xl border border-white/5 shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 blur-3xl pointer-events-none"></div>
                <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                  <span className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-sm">1</span>
                  Datos de Entrega
                </h2>

                <div className="grid grid-cols-2 gap-4 mb-6">
                  <button
                    type="button"
                    onClick={() => setDeliveryType('delivery')}
                    className={`flex flex-col items-center justify-center p-4 rounded-2xl border-2 transition-all ${
                      deliveryType === 'delivery' 
                        ? 'border-[#e53e3e] bg-[#e53e3e]/10 text-[#e53e3e]' 
                        : 'border-white/10 bg-white/5 text-gray-400 hover:bg-white/10'
                    }`}
                  >
                    <Bike className="w-6 h-6 mb-2" />
                    <span className="font-bold text-sm">Delivery</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setDeliveryType('pickup')}
                    className={`flex flex-col items-center justify-center p-4 rounded-2xl border-2 transition-all ${
                      deliveryType === 'pickup' 
                        ? 'border-[#e53e3e] bg-[#e53e3e]/10 text-[#e53e3e]' 
                        : 'border-white/10 bg-white/5 text-gray-400 hover:bg-white/10'
                    }`}
                  >
                    <Store className="w-6 h-6 mb-2" />
                    <span className="font-bold text-sm">Recojo en local</span>
                  </button>
                </div>

                <div className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-gray-400 mb-1.5 uppercase tracking-wider">Nombre Completo *</label>
                      <input 
                        type="text" 
                        required
                        value={customerName}
                        onChange={(e) => setCustomerName(e.target.value)}
                        placeholder="Juan Pérez"
                        className="w-full bg-[#1a1a24] border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#e53e3e] focus:ring-1 focus:ring-[#e53e3e] transition-all text-white placeholder-gray-500"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-400 mb-1.5 uppercase tracking-wider">Teléfono *</label>
                      <input 
                        type="tel" 
                        required
                        value={customerPhone}
                        onChange={(e) => setCustomerPhone(e.target.value)}
                        placeholder="999 888 777"
                        className="w-full bg-[#1a1a24] border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#e53e3e] focus:ring-1 focus:ring-[#e53e3e] transition-all text-white placeholder-gray-500"
                      />
                    </div>
                  </div>

                  {deliveryType === 'delivery' && (
                    <div>
                      <label className="block text-xs font-bold text-gray-400 mb-1.5 uppercase tracking-wider">Dirección de Entrega *</label>
                      <input 
                        type="text" 
                        required
                        value={customerAddress}
                        onChange={(e) => setCustomerAddress(e.target.value)}
                        placeholder="Av. Universitaria 123, Comas"
                        className="w-full bg-[#1a1a24] border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#e53e3e] focus:ring-1 focus:ring-[#e53e3e] transition-all text-white placeholder-gray-500"
                      />
                    </div>
                  )}

                  <div>
                    <label className="block text-xs font-bold text-gray-400 mb-1.5 uppercase tracking-wider">Notas del pedido (Opcional)</label>
                    <textarea 
                      value={orderNotes}
                      onChange={(e) => setOrderNotes(e.target.value)}
                      placeholder="Ej: Sin palta, extra sillao, timbre malogrado..."
                      rows={2}
                      className="w-full bg-[#1a1a24] border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#e53e3e] focus:ring-1 focus:ring-[#e53e3e] transition-all text-white placeholder-gray-500 resize-none"
                    />
                  </div>
                </div>
              </div>

              {/* Sección 2: Método de Pago */}
              <div className="bg-[#121217] p-6 rounded-3xl border border-white/5 shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 left-0 w-32 h-32 bg-purple-500/5 blur-3xl pointer-events-none"></div>
                <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                  <span className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-sm">2</span>
                  Pago Directo
                </h2>
                
                <div className="space-y-3 mb-6">
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('yape')}
                    className={`w-full flex items-center justify-between p-4 rounded-xl border-2 transition-all ${
                      paymentMethod === 'yape' 
                        ? 'border-purple-500 bg-purple-500/10' 
                        : 'border-white/5 bg-[#1a1a24] hover:bg-white/5'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-lg ${paymentMethod === 'yape' ? 'bg-purple-500/20 text-purple-400' : 'bg-white/5 text-gray-400'}`}>
                        <Smartphone className="w-5 h-5" />
                      </div>
                      <div className="text-left">
                        <div className="font-bold text-sm text-white">Yape (QR)</div>
                        <div className="text-xs text-gray-400">Escanea y envía por WhatsApp</div>
                      </div>
                    </div>
                    {paymentMethod === 'yape' && <CheckCircle2 className="w-5 h-5 text-purple-400" />}
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentMethod('cash')}
                    className={`w-full flex items-center justify-between p-4 rounded-xl border-2 transition-all ${
                      paymentMethod === 'cash' 
                        ? 'border-emerald-500 bg-emerald-500/10' 
                        : 'border-white/5 bg-[#1a1a24] hover:bg-white/5'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-lg ${paymentMethod === 'cash' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-white/5 text-gray-400'}`}>
                        <Banknote className="w-5 h-5" />
                      </div>
                      <div className="text-left">
                        <div className="font-bold text-sm text-white">Pago en Efectivo</div>
                        <div className="text-xs text-gray-400">Pagas al recibir tu pedido</div>
                      </div>
                    </div>
                    {paymentMethod === 'cash' && <CheckCircle2 className="w-5 h-5 text-emerald-400" />}
                  </button>
                </div>

                {/* Yape Tradicional Info */}
                {paymentMethod === 'yape' && (
                  <div className="bg-[#1a1a24] p-5 rounded-2xl border border-purple-500/20 text-center animate-in slide-in-from-top-2 duration-300">
                    <div className="bg-white p-2 rounded-xl w-32 h-32 mx-auto relative shadow-lg mb-4">
                      <Image 
                        src="/images/qr-yape.svg" 
                        alt="QR de Yape Makibros" 
                        fill 
                        className="object-contain p-1"
                      />
                    </div>
                    <h3 className="font-bold text-white mb-2">Escanea y Paga con Yape</h3>
                    <p className="text-xs text-gray-400 mb-4 px-4 leading-relaxed">
                      1. Escanea el código o yapea al <strong>970 725 307</strong>.<br/>
                      2. Dale a "Confirmar Pedido".<br/>
                      3. ¡Envíanos la captura del yapeo por WhatsApp!
                    </p>
                    <div className="text-xs font-mono text-purple-400 bg-purple-500/10 py-1.5 px-3 rounded-lg inline-block border border-purple-500/20">
                      Rápido, fácil y sin comisiones.
                    </div>
                  </div>
                )}
                
                {paymentMethod === 'cash' && (
                  <div className="bg-[#1a1a24] p-4 rounded-2xl border border-emerald-500/20 flex items-start gap-3 animate-in slide-in-from-top-2 duration-300">
                    <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                    <p className="text-xs text-gray-300 leading-relaxed">
                      El repartidor llevará el cambio si lo necesitas. Por favor, asegúrate de tener el monto exacto o cercano para agilizar la entrega.
                    </p>
                  </div>
                )}
              </div>
            </form>
          </div>

          {/* Columna Derecha: Resumen de Orden */}
          <div className="lg:col-span-5">
            <div className="bg-[#121217] p-6 rounded-3xl border border-white/5 shadow-2xl sticky top-24">
              <h2 className="text-xl font-bold mb-6 flex items-center gap-2 pb-4 border-b border-white/5">
                <ShoppingBag className="w-5 h-5 text-[#e53e3e]" />
                Tu Orden
                <span className="ml-auto bg-[#e53e3e]/20 text-[#e53e3e] text-xs px-2.5 py-1 rounded-full">
                  {totalItems} ítems
                </span>
              </h2>

              {items.length === 0 ? (
                <div className="text-center py-12">
                  <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4">
                    <ShoppingBag className="w-6 h-6 text-gray-500" />
                  </div>
                  <p className="text-gray-400 mb-6 text-sm">Tu carrito está hambriento</p>
                  <Link href="/menu">
                    <button className="bg-white/10 hover:bg-white/20 text-white px-6 py-2.5 rounded-xl font-medium text-sm transition-colors">
                      Explorar Menú
                    </button>
                  </Link>
                </div>
              ) : (
                <>
                  <div className="max-h-[35vh] overflow-y-auto pr-2 space-y-4 mb-6 custom-scrollbar">
                    {items.map((item) => (
                      <div key={item.dish.id} className="flex gap-4 bg-white/[0.02] p-3 rounded-2xl border border-white/5">
                        <div className="relative w-16 h-16 rounded-xl overflow-hidden shrink-0 bg-[#1a1a24]">
                          {item.dish.image_url ? (
                            <Image src={item.dish.image_url} alt={item.dish.name} fill className="object-cover" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-xs text-gray-600">Sin img</div>
                          )}
                        </div>
                        <div className="flex-grow flex flex-col justify-between py-0.5">
                          <div>
                            <h3 className="font-bold text-sm text-white line-clamp-1">{item.dish.name}</h3>
                            <p className="text-xs text-[#e53e3e] font-black">{formatPrice(item.dish.price)}</p>
                          </div>
                          <div className="flex items-center gap-3">
                            <button 
                              onClick={() => updateQuantity(item.dish.id, item.quantity - 1)}
                              className="w-6 h-6 rounded-md bg-white/10 flex items-center justify-center hover:bg-[#e53e3e] transition-colors"
                            >
                              <Minus className="w-3 h-3 text-white" />
                            </button>
                            <span className="text-sm font-bold w-4 text-center">{item.quantity}</span>
                            <button 
                              onClick={() => updateQuantity(item.dish.id, item.quantity + 1)}
                              className="w-6 h-6 rounded-md bg-white/10 flex items-center justify-center hover:bg-[#e53e3e] transition-colors"
                            >
                              <Plus className="w-3 h-3 text-white" />
                            </button>
                            <button 
                              onClick={() => removeItem(item.dish.id)}
                              className="ml-auto text-gray-500 hover:text-red-400 p-1"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="border-t border-white/5 pt-5 space-y-3 mb-6">
                    <div className="flex justify-between text-sm text-gray-400">
                      <span>Subtotal</span>
                      <span className="font-mono text-white">{formatPrice(totalPrice)}</span>
                    </div>
                    <div className="flex justify-between text-sm text-gray-400">
                      <span>Delivery</span>
                      <span className="font-mono text-white">
                        {deliveryType === 'delivery' ? formatPrice(deliveryFee) : 'Gratis'}
                      </span>
                    </div>
                    <div className="flex justify-between text-lg font-black text-white pt-2 border-t border-white/5">
                      <span>Total a Pagar</span>
                      <span className="text-[#e53e3e]">{formatPrice(finalTotal)}</span>
                    </div>
                  </div>

                  <button
                    type="submit"
                    form="checkout-form"
                    disabled={isProcessing || items.length === 0}
                    className="w-full py-4 rounded-xl bg-gradient-to-r from-[#e53e3e] to-[#dc2626] hover:from-red-500 hover:to-red-700 text-white font-black text-base transition-all shadow-[0_0_20px_rgba(229,62,62,0.3)] hover:shadow-[0_0_30px_rgba(229,62,62,0.5)] flex items-center justify-center gap-2 disabled:opacity-50 disabled:pointer-events-none active:scale-[0.98]"
                  >
                    {isProcessing ? (
                      <span className="flex items-center gap-2">
                        <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Procesando...
                      </span>
                    ) : (
                      <>
                        <Send className="w-5 h-5" />
                        Confirmar Pedido por WhatsApp
                      </>
                    )}
                  </button>
                  
                  <div className="mt-4 text-center">
                    <p className="text-[10px] text-gray-500 flex items-center justify-center gap-1.5">
                      <Lock className="w-3 h-3" />
                      Tus datos están seguros y protegidos.
                    </p>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
