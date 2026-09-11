'use client'

import { useRouter } from 'next/navigation'
import { useState, useEffect } from 'react'
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
  const [customerEmail, setCustomerEmail] = useState('')
  const [customerAddress, setCustomerAddress] = useState('')
  const [orderNotes, setOrderNotes] = useState('')

  // Método de pago: Yape o Efectivo
  const [paymentMethod, setPaymentMethod] = useState<'yape' | 'cash'>('yape')

  // Estados de proceso
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)

  const deliveryFee = deliveryType === 'delivery' ? 5.0 : 0.0
  const finalTotal = totalPrice + deliveryFee

  // Validación común de campos de contacto y entrega
  const validateCommonFields = (): boolean => {
    if (!customerName.trim()) {
      toast('Por favor, ingresa tu nombre completo.', 'error')
      return false
    }
    if (!customerPhone.trim()) {
      toast('Por favor, ingresa tu número de teléfono / WhatsApp.', 'error')
      return false
    }
    if (deliveryType === 'delivery' && !customerAddress.trim()) {
      toast('Por favor, ingresa la dirección de entrega.', 'error')
      return false
    }
    return true
  }

  // Procesar Pedido (WhatsApp)
  const handleCheckoutSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validateCommonFields()) return

    setIsProcessing(true)
    try {
      // Registrar orden en la base de datos como pendiente
      await fetch('/api/process_payment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          orderData: {
            customerName: customerName.trim(),
            customerPhone: customerPhone.trim(),
            customerEmail: customerEmail.trim(),
            customerAddress: customerAddress.trim(),
            orderNotes: orderNotes.trim(),
            deliveryType,
            totalPrice: finalTotal,
            items,
            paymentMethod,
          },
        }),
      })
    } catch (err) {
      console.warn('Registro preliminar en BD falló, continuando con WhatsApp:', err)
    }

    const orderLines = items
      .map((item) => {
        const isDiscounted = (item.dish.discount_percentage ?? 0) > 0
        const itemPrice = isDiscounted
          ? item.dish.price * (1 - (item.dish.discount_percentage ?? 0) / 100)
          : item.dish.price
        return `• ${item.quantity}x ${item.dish.name} - ${formatPrice(itemPrice * item.quantity)}`
      })
      .join('\n')

    const paymentText = paymentMethod === 'yape' ? 'Yape (Transferencia manual)' : 'Efectivo (Contraentrega)'

    const message =
      `🍱 *¡HOLA MAKIBROS! NUEVO PEDIDO*\n\n` +
      `👤 *Cliente:* ${customerName}\n` +
      `📱 *Teléfono:* ${customerPhone}\n` +
      `🛵 *Modalidad:* ${deliveryType === 'delivery' ? 'Delivery a domicilio' : 'Recojo en local'}\n` +
      (deliveryType === 'delivery' ? `📍 *Dirección:* ${customerAddress}\n` : '') +
      `💵 *Método de Pago:* ${paymentText}\n\n` +
      `📝 *Platos:* \n${orderLines}\n\n` +
      (deliveryType === 'delivery' ? `🛵 *Costo de envío:* ${formatPrice(deliveryFee)}\n` : '') +
      `💰 *TOTAL A PAGAR:* ${formatPrice(finalTotal)}\n` +
      (orderNotes.trim() ? `\n📌 *Notas:* ${orderNotes}\n` : '') +
      `\n¡Por favor confirmar mi pedido! Muchas gracias.`

    const encodedMessage = encodeURIComponent(message)
    const whatsappUrl = `https://wa.me/51970725307?text=${encodedMessage}`

    clearCart()
    setIsSubmitted(true)
    setIsProcessing(false)

    if (typeof window !== 'undefined') {
      window.open(whatsappUrl, '_blank')
    }
  }

  return (
    <div className="min-h-screen bg-[#09090c] text-white flex flex-col selection:bg-[#e53e3e] selection:text-white">
      <Navbar />

      <main className="flex-1 py-10 sm:py-16 px-4 sm:px-6">
        <div className="max-w-5xl mx-auto">
          {/* Botón Volver */}
          <div className="mb-8 sm:mb-10 space-y-2">
            <Link
              href="/#menu"
              className="btn-press inline-flex items-center gap-2 text-xs font-mono text-neutral-400 hover:text-white transition-colors uppercase tracking-wider"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Volver a la Carta</span>
            </Link>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight">
              Finalizar <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#e53e3e] to-[#f59e0b]">Pedido</span>
            </h1>
          </div>

          {isSubmitted ? (
            <div className="bg-[#121217] border border-white/[0.08] rounded-3xl p-8 sm:p-12 text-center max-w-lg mx-auto space-y-6 shadow-2xl shadow-black/80">
              <div className="w-20 h-20 bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 rounded-2xl flex items-center justify-center mx-auto shadow-lg shadow-emerald-500/20">
                <CheckCircle2 className="w-10 h-10" />
              </div>
              <div className="space-y-2">
                <h2 className="text-2xl sm:text-3xl font-black text-white">¡Pedido Enviado!</h2>
                <p className="text-neutral-400 text-sm leading-relaxed">
                  Tu orden ha sido transferida a nuestro WhatsApp oficial (<strong className="text-white font-mono">+51 970 725 307</strong>). Nuestro chef ya está revisando tu pedido para meterle candela al soplete.
                </p>
              </div>
              <div className="pt-2 flex flex-col sm:flex-row gap-3 justify-center">
                <Link
                  href="/"
                  className="btn-press px-6 py-3.5 bg-[#e53e3e] hover:bg-[#c53030] text-white font-bold rounded-full transition-all text-sm shadow-md shadow-[#e53e3e]/20"
                >
                  Volver al Inicio
                </Link>
                <Link
                  href="/#menu"
                  className="btn-press px-6 py-3.5 bg-white/[0.05] hover:bg-white/[0.1] border border-white/10 text-white font-bold rounded-full transition-all text-sm"
                >
                  Ver Menú
                </Link>
              </div>
            </div>
          ) : items.length === 0 ? (
            <div className="bg-[#121217] border border-white/[0.08] rounded-3xl p-12 text-center max-w-md mx-auto space-y-5 shadow-2xl shadow-black/80">
              <div className="w-16 h-16 bg-white/[0.04] border border-white/10 text-neutral-500 rounded-2xl flex items-center justify-center mx-auto">
                <ShoppingBag className="w-8 h-8" />
              </div>
              <div className="space-y-1">
                <h2 className="text-xl font-black text-white">Tu carrito está vacío</h2>
                <p className="text-sm text-neutral-400">
                  Añade tus makis, rolls especiales, ceviches o banderillas favoritas para continuar.
                </p>
              </div>
              <div className="pt-3">
                <Link
                  href="/#menu"
                  className="btn-press px-6 py-3.5 bg-[#e53e3e] hover:bg-[#c53030] text-white font-bold rounded-full transition-all text-sm shadow-md shadow-[#e53e3e]/20 inline-block"
                >
                  Explorar la Carta
                </Link>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              {/* Lista de Platos en el Carrito */}
              <div className="lg:col-span-7 space-y-4">
                <div className="bg-[#121217] border border-white/[0.08] rounded-3xl p-5 sm:p-6 shadow-xl shadow-black/40">
                  <div className="flex items-center justify-between pb-4 border-b border-white/[0.06] mb-4">
                    <h2 className="font-black text-lg text-white">
                      Tus Platos (<span className="text-[#f59e0b] font-mono tabular-nums">{totalItems}</span>)
                    </h2>
                    <button
                      type="button"
                      onClick={clearCart}
                      className="text-xs text-neutral-400 hover:text-red-400 transition-colors font-mono cursor-pointer"
                    >
                      Vaciar carrito
                    </button>
                  </div>

                  <div className="divide-y divide-white/[0.06] space-y-3">
                    {items.map(({ dish, quantity }) => {
                      const isDiscounted = (dish.discount_percentage ?? 0) > 0
                      const itemPrice = isDiscounted
                        ? dish.price * (1 - (dish.discount_percentage ?? 0) / 100)
                        : dish.price

                      return (
                        <div key={dish.id} className="pt-3 flex items-center gap-3.5 sm:gap-4">
                          <div className="relative w-16 h-16 rounded-xl overflow-hidden bg-[#09090c] shrink-0 border border-white/10">
                            {dish.image_url ? (
                              <Image
                                src={dish.image_url}
                                alt={dish.name}
                                fill
                                className="object-cover"
                                sizes="64px"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-xs text-neutral-600 font-mono">
                                🍣
                              </div>
                            )}
                          </div>

                          <div className="flex-1 min-w-0">
                            <h3 className="text-sm font-bold text-white truncate">{dish.name}</h3>
                            <p className="text-xs text-[#f59e0b] font-mono tabular-nums font-semibold mt-0.5">
                              {formatPrice(itemPrice)} c/u
                            </p>
                          </div>

                          {/* Controles de Cantidad */}
                          <div className="flex items-center bg-[#09090c] border border-white/10 rounded-full p-0.5">
                            <button
                              type="button"
                              onClick={() => updateQuantity(dish.id, quantity - 1)}
                              aria-label="Reducir cantidad"
                              className="btn-press p-1.5 hover:bg-white/10 rounded-full text-neutral-400 hover:text-white transition-colors"
                            >
                              <Minus className="w-3 h-3" />
                            </button>
                            <span className="w-6 text-center text-xs font-mono font-bold text-white tabular-nums">
                              {quantity}
                            </span>
                            <button
                              type="button"
                              onClick={() => updateQuantity(dish.id, quantity + 1)}
                              aria-label="Aumentar cantidad"
                              className="btn-press p-1.5 hover:bg-white/10 rounded-full text-neutral-400 hover:text-white transition-colors"
                            >
                              <Plus className="w-3 h-3" />
                            </button>
                          </div>

                          <span className="text-sm font-bold font-mono tabular-nums text-white w-20 text-right shrink-0">
                            {formatPrice(itemPrice * quantity)}
                          </span>

                          <button
                            type="button"
                            onClick={() => removeItem(dish.id)}
                            className="btn-press p-2 text-neutral-500 hover:text-red-400 transition-colors cursor-pointer"
                            title="Eliminar plato"
                            aria-label={`Eliminar ${dish.name}`}
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      )
                    })}
                  </div>
                </div>
              </div>

              {/* Panel de Checkout: Entrega + Método de Pago */}
              <div className="lg:col-span-5 space-y-4">
                <div className="bg-[#121217] border border-white/[0.08] rounded-3xl p-5 sm:p-6 space-y-5 shadow-xl shadow-black/40">
                  <h2 className="font-black text-lg text-white">Detalles del Pedido</h2>

                  {/* Selector Delivery / Recojo */}
                  <div className="grid grid-cols-2 gap-2 bg-[#09090c] p-1.5 rounded-2xl border border-white/10">
                    <button
                      type="button"
                      onClick={() => setDeliveryType('delivery')}
                      className={`btn-press py-2.5 px-3 text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-2 ${
                        deliveryType === 'delivery'
                          ? 'bg-[#e53e3e] text-white shadow-md shadow-[#e53e3e]/30'
                          : 'text-neutral-400 hover:text-white'
                      }`}
                    >
                      <Bike className="w-4 h-4" />
                      <span>Delivery</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setDeliveryType('pickup')}
                      className={`btn-press py-2.5 px-3 text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-2 ${
                        deliveryType === 'pickup'
                          ? 'bg-[#e53e3e] text-white shadow-md shadow-[#e53e3e]/30'
                          : 'text-neutral-400 hover:text-white'
                      }`}
                    >
                      <Store className="w-4 h-4" />
                      <span>Recojo</span>
                    </button>
                  </div>

                  {/* Datos del Cliente */}
                  <div className="space-y-3 text-sm">
                    <div>
                      <label className="block text-xs font-mono uppercase tracking-wider text-neutral-400 mb-1 font-medium">
                        Tu Nombre Completo *
                      </label>
                      <input
                        type="text"
                        required
                        value={customerName}
                        onChange={(e) => setCustomerName(e.target.value)}
                        placeholder="Ej. Carlos García"
                        className="w-full bg-[#09090c] border border-white/10 rounded-xl px-3.5 py-2 text-white placeholder-neutral-600 focus:outline-none focus:border-[#e53e3e] focus:ring-1 focus:ring-[#e53e3e]/30 text-sm transition-all"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-mono uppercase tracking-wider text-neutral-400 mb-1 font-medium">
                          Teléfono / WhatsApp *
                        </label>
                        <input
                          type="tel"
                          required
                          value={customerPhone}
                          onChange={(e) => setCustomerPhone(e.target.value)}
                          placeholder="Ej. 987 654 321"
                          className="w-full bg-[#09090c] border border-white/10 rounded-xl px-3.5 py-2 text-white placeholder-neutral-600 focus:outline-none focus:border-[#e53e3e] focus:ring-1 focus:ring-[#e53e3e]/30 text-sm font-mono transition-all"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-mono uppercase tracking-wider text-neutral-400 mb-1 font-medium">
                          Correo Electrónico
                        </label>
                        <input
                          type="email"
                          value={customerEmail}
                          onChange={(e) => setCustomerEmail(e.target.value)}
                          placeholder="cliente@ejemplo.com"
                          className="w-full bg-[#09090c] border border-white/10 rounded-xl px-3.5 py-2 text-white placeholder-neutral-600 focus:outline-none focus:border-[#e53e3e] focus:ring-1 focus:ring-[#e53e3e]/30 text-sm transition-all"
                        />
                      </div>
                    </div>

                    {deliveryType === 'delivery' && (
                      <div>
                        <label className="block text-xs font-mono uppercase tracking-wider text-neutral-400 mb-1 font-medium">
                          Dirección de Entrega y Referencia *
                        </label>
                        <input
                          type="text"
                          required
                          value={customerAddress}
                          onChange={(e) => setCustomerAddress(e.target.value)}
                          placeholder="Ej. Av. Universitaria 1420 dpto 302, frente al parque"
                          className="w-full bg-[#09090c] border border-white/10 rounded-xl px-3.5 py-2 text-white placeholder-neutral-600 focus:outline-none focus:border-[#e53e3e] focus:ring-1 focus:ring-[#e53e3e]/30 text-sm transition-all"
                        />
                      </div>
                    )}

                    <div>
                      <label className="block text-xs font-mono uppercase tracking-wider text-neutral-400 mb-1 font-medium">
                        Notas especiales (opcional)
                      </label>
                      <input
                        type="text"
                        value={orderNotes}
                        onChange={(e) => setOrderNotes(e.target.value)}
                        placeholder="Ej. Sin palillos, extra salsa acevichada"
                        className="w-full bg-[#09090c] border border-white/10 rounded-xl px-3.5 py-2 text-white placeholder-neutral-600 focus:outline-none focus:border-[#e53e3e] focus:ring-1 focus:ring-[#e53e3e]/30 text-xs transition-all"
                      />
                    </div>
                  </div>

                  {/* Resumen de Costos */}
                  <div className="pt-3 border-t border-white/[0.06] space-y-1.5 text-sm font-mono">
                    <div className="flex justify-between text-neutral-400">
                      <span>Subtotal</span>
                      <span className="text-white font-medium tabular-nums">{formatPrice(totalPrice)}</span>
                    </div>
                    {deliveryType === 'delivery' && (
                      <div className="flex justify-between text-neutral-400">
                        <span>Costo de envío</span>
                        <span className="text-white font-medium tabular-nums">{formatPrice(deliveryFee)}</span>
                      </div>
                    )}
                    <div className="flex justify-between text-base font-bold text-white pt-2 border-t border-white/[0.06]">
                      <span>Total a Pagar</span>
                      <span className="text-[#f59e0b] text-xl tabular-nums">{formatPrice(finalTotal)}</span>
                    </div>
                  </div>

                  {/* Selector de Métodos de Pago */}
                  <div className="pt-3 border-t border-white/[0.06]">
                    <label className="block text-xs font-mono uppercase tracking-wider text-neutral-400 mb-2 font-medium">
                      Elige tu Método de Pago
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      {/* Opción Yape */}
                      <button
                        type="button"
                        onClick={() => setPaymentMethod('yape')}
                        className={`btn-press p-2.5 rounded-xl border text-xs font-bold text-center transition-all flex flex-col items-center justify-center gap-1 cursor-pointer ${
                          paymentMethod === 'yape'
                            ? 'border-[#732282] bg-[#732282]/20 text-white ring-1 ring-[#a332b8]'
                            : 'text-neutral-400 bg-white/[0.03] border-white/10 hover:text-white hover:bg-white/[0.06]'
                        }`}
                      >
                        <span className="w-5 h-5 rounded-full bg-[#732282] text-white flex items-center justify-center font-black text-[11px]">
                          Y
                        </span>
                        <span>Yape</span>
                      </button>

                      {/* Opción Efectivo */}
                      <button
                        type="button"
                        onClick={() => setPaymentMethod('cash')}
                        className={`btn-press p-2.5 rounded-xl border text-xs font-bold text-center transition-all flex flex-col items-center justify-center gap-1 cursor-pointer ${
                          paymentMethod === 'cash'
                            ? 'border-emerald-500 bg-emerald-500/20 text-white ring-1 ring-emerald-500/60'
                            : 'text-neutral-400 bg-white/[0.03] border-white/10 hover:text-white hover:bg-white/[0.06]'
                        }`}
                      >
                        <Banknote className="w-5 h-5 text-emerald-400" />
                        <span>Efectivo</span>
                      </button>
                    </div>
                  </div>

                  {/* FORMULARIO: CONFIRMACIÓN YAPE Y EFECTIVO */}
                  <form onSubmit={handleCheckoutSubmit} className="space-y-4 pt-2">
                    {paymentMethod === 'yape' && (
                      <div className="bg-[#732282]/10 border border-[#732282]/30 rounded-2xl p-4 text-xs text-neutral-300 space-y-3">
                        <div className="flex items-center gap-2 font-bold text-white mb-2">
                          <span className="w-4 h-4 rounded-full bg-[#732282] flex items-center justify-center text-[10px]">
                            Y
                          </span>
                          <span>Escanea y Paga con Yape</span>
                        </div>
                        
                        <div className="bg-white p-2 rounded-xl w-32 h-32 mx-auto relative shadow-lg">
                          <Image 
                            src="/images/qr-yape.svg" 
                            alt="QR de Yape Makibros" 
                            fill 
                            className="object-contain p-1"
                          />
                        </div>
                        
                        <div className="text-center space-y-1 mt-2 bg-black/40 p-2.5 rounded-xl">
                          <p>1. Escanea el QR o yapea al <strong>970 725 307</strong></p>
                          <p>2. Dale clic a <strong>Confirmar Pedido</strong></p>
                          <p>3. Envía la <strong>captura del yapeo</strong> por WhatsApp</p>
                        </div>
                      </div>
                    )}

                    {paymentMethod === 'cash' && (
                      <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-2xl p-4 text-xs text-neutral-300 space-y-1.5">
                        <p className="font-bold text-white flex items-center gap-2">
                          <Banknote className="w-4 h-4 text-emerald-400" />
                          <span>Pago Contraentrega en Efectivo</span>
                        </p>
                        <p className="text-neutral-400 leading-relaxed text-[11px]">
                          Pagarás en efectivo al recibir tu pedido. Al presionar el botón se abrirá WhatsApp con el resumen para confirmar.
                        </p>
                      </div>
                    )}

                    <button
                      type="submit"
                      disabled={isProcessing}
                      className="btn-press w-full py-3.5 bg-gradient-to-r from-[#e53e3e] to-[#f59e0b] hover:from-[#c53030] hover:to-[#d97706] text-white font-black rounded-xl transition-all shadow-xl shadow-[#e53e3e]/20 flex items-center justify-center gap-2 text-sm sm:text-base cursor-pointer disabled:opacity-50"
                    >
                      <Send className="w-4 h-4" />
                      <span>{isProcessing ? 'Enviando...' : `Confirmar Pedido por WhatsApp`}</span>
                    </button>
                  </form>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  )
}
