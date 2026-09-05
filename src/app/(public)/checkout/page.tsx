'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { ArrowLeft, Trash2, Plus, Minus, ShoppingBag, Send, CheckCircle2 } from 'lucide-react'
import { Navbar } from '@/components/public/navbar'
import { Footer } from '@/components/public/footer'
import { useCart } from '@/context/cart-context'
import { formatPrice } from '@/lib/utils'
import { useToast } from '@/components/ui/toast'

export default function CheckoutPage() {
  const { items, updateQuantity, removeItem, clearCart, totalPrice, totalItems } = useCart()
  const { toast } = useToast()

  const [deliveryType, setDeliveryType] = useState<'delivery' | 'pickup'>('delivery')
  const [customerName, setCustomerName] = useState('')
  const [customerPhone, setCustomerPhone] = useState('')
  const [customerAddress, setCustomerAddress] = useState('')
  const [orderNotes, setOrderNotes] = useState('')
  const [paymentMethod, setPaymentMethod] = useState<'yape' | 'plin' | 'card' | 'cash'>('yape')
  const [isSubmitted, setIsSubmitted] = useState(false)

  const deliveryFee = deliveryType === 'delivery' ? 5.0 : 0.0
  const finalTotal = totalPrice + deliveryFee

  const handleSendWhatsAppOrder = (e: React.FormEvent) => {
    e.preventDefault()

    if (!customerName.trim()) {
      toast('Por favor, ingresa tu nombre.', 'error')
      return
    }

    if (!customerPhone.trim()) {
      toast('Por favor, ingresa tu número de WhatsApp.', 'error')
      return
    }

    if (deliveryType === 'delivery' && !customerAddress.trim()) {
      toast('Por favor, ingresa la dirección de entrega.', 'error')
      return
    }

    // Build the WhatsApp message
    const orderLines = items
      .map((item) => {
        const isDiscounted = (item.dish.discount_percentage ?? 0) > 0
        const itemPrice = isDiscounted
          ? item.dish.price * (1 - (item.dish.discount_percentage ?? 0) / 100)
          : item.dish.price
        return `• ${item.quantity}x ${item.dish.name} - ${formatPrice(itemPrice * item.quantity)}`
      })
      .join('\n')

    const paymentLabels = {
      yape: 'Yape',
      plin: 'Plin',
      card: 'Tarjeta (Visa/Mastercard)',
      cash: 'Efectivo',
    }

    const message = `🍱 *¡HOLA MAKIBROS! NUEVO PEDIDO*\n\n` +
      `👤 *Cliente:* ${customerName}\n` +
      `📱 *Teléfono:* ${customerPhone}\n` +
      `🛵 *Modalidad:* ${deliveryType === 'delivery' ? 'Delivery a domicilio' : 'Recojo en local'}\n` +
      (deliveryType === 'delivery' ? `📍 *Dirección:* ${customerAddress}\n` : '') +
      `💳 *Método de Pago:* ${paymentLabels[paymentMethod]}\n\n` +
      `📝 *Platos:* \n${orderLines}\n\n` +
      (deliveryType === 'delivery' ? `🛵 *Costo de envío:* ${formatPrice(deliveryFee)}\n` : '') +
      `💰 *TOTAL:* ${formatPrice(finalTotal)}\n` +
      (orderNotes.trim() ? `\n📌 *Notas:* ${orderNotes}\n` : '') +
      `\n¡Por favor confirmar mi pedido! Muchas gracias.`

    const encodedMessage = encodeURIComponent(message)
    const whatsappUrl = `https://wa.me/51987654321?text=${encodedMessage}`

    // Clear cart and show success state
    clearCart()
    setIsSubmitted(true)

    // Open WhatsApp in a new tab
    if (typeof window !== 'undefined') {
      window.open(whatsappUrl, '_blank')
    }
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white flex flex-col">
      <Navbar />

      <main className="flex-1 py-12 px-4">
        <div className="max-w-4xl mx-auto">
          {/* Header Back */}
          <div className="mb-8">
            <Link
              href="/#menu"
              className="inline-flex items-center gap-2 text-sm text-[#a0a0a0] hover:text-white transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Volver al Menú
            </Link>
            <h1 className="text-3xl md:text-4xl font-black text-white mt-3 tracking-tight">
              Finalizar Pedido
            </h1>
          </div>

          {isSubmitted ? (
            <div className="bg-[#141414] border border-[#2a2a2a] rounded-2xl p-8 text-center max-w-lg mx-auto space-y-6 animate-fade-in-up">
              <div className="w-16 h-16 bg-[#48bb78]/20 text-[#48bb78] rounded-full flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-10 h-10" />
              </div>
              <h2 className="text-2xl font-bold text-white">¡Pedido Enviado con Éxito!</h2>
              <p className="text-[#a0a0a0] text-sm leading-relaxed">
                Hemos preparado tu orden y abierto WhatsApp con nuestro número (+51 987 654 321) para confirmar la preparación de tus makis al instante.
              </p>
              <div className="pt-4 flex flex-col sm:flex-row gap-3 justify-center">
                <Link
                  href="/"
                  className="px-6 py-3 bg-[#e53e3e] hover:bg-[#c53030] text-white font-bold rounded-lg transition-colors inline-block"
                >
                  Volver al Inicio
                </Link>
                <Link
                  href="/menu"
                  className="px-6 py-3 bg-[#1a1a1a] hover:bg-[#252525] border border-[#2a2a2a] text-white font-bold rounded-lg transition-colors inline-block"
                >
                  Ver Menú
                </Link>
              </div>
            </div>
          ) : items.length === 0 ? (
            <div className="bg-[#141414] border border-[#2a2a2a] rounded-2xl p-12 text-center max-w-md mx-auto space-y-4">
              <div className="w-16 h-16 bg-[#222] text-[#888] rounded-full flex items-center justify-center mx-auto">
                <ShoppingBag className="w-8 h-8" />
              </div>
              <h2 className="text-xl font-bold text-white">Tu carrito está vacío</h2>
              <p className="text-sm text-[#a0a0a0]">
                Añade tus makis, rolls especiales, ceviches o bebidas favoritas para continuar.
              </p>
              <div className="pt-4">
                <Link
                  href="/#menu"
                  className="px-6 py-3 bg-[#e53e3e] hover:bg-[#c53030] text-white font-bold rounded-full transition-colors inline-block text-sm"
                >
                  Explorar la Carta
                </Link>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              {/* Order Items List */}
              <div className="lg:col-span-7 space-y-4">
                <div className="bg-[#141414] border border-[#2a2a2a] rounded-2xl p-6">
                  <div className="flex items-center justify-between pb-4 border-b border-[#222] mb-4">
                    <h2 className="font-bold text-lg text-white">
                      Tus Platos ({totalItems})
                    </h2>
                    <button
                      onClick={clearCart}
                      className="text-xs text-red-400 hover:text-red-300 transition-colors"
                    >
                      Vaciar carrito
                    </button>
                  </div>

                  <div className="divide-y divide-[#222] space-y-3">
                    {items.map(({ dish, quantity }) => {
                      const isDiscounted = (dish.discount_percentage ?? 0) > 0
                      const itemPrice = isDiscounted
                        ? dish.price * (1 - (dish.discount_percentage ?? 0) / 100)
                        : dish.price

                      return (
                        <div key={dish.id} className="pt-3 flex items-center gap-4">
                          <div className="relative w-16 h-16 rounded-xl overflow-hidden bg-[#222] shrink-0 border border-[#2a2a2a]">
                            {dish.image_url ? (
                              <Image
                                src={dish.image_url}
                                alt={dish.name}
                                fill
                                className="object-cover"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-xs text-gray-500">
                                🍣
                              </div>
                            )}
                          </div>

                          <div className="flex-1 min-w-0">
                            <h3 className="text-sm font-bold text-white truncate">{dish.name}</h3>
                            <p className="text-xs text-[#f6ad55] font-semibold mt-0.5">
                              {formatPrice(itemPrice)} c/u
                            </p>
                          </div>

                          {/* Quantity controls */}
                          <div className="flex items-center gap-2 bg-[#222] border border-[#333] rounded-lg p-1">
                            <button
                              type="button"
                              onClick={() => updateQuantity(dish.id, quantity - 1)}
                              className="p-1 hover:bg-[#333] rounded text-gray-300 hover:text-white transition-colors"
                            >
                              <Minus className="w-3.5 h-3.5" />
                            </button>
                            <span className="w-6 text-center text-xs font-bold text-white">
                              {quantity}
                            </span>
                            <button
                              type="button"
                              onClick={() => updateQuantity(dish.id, quantity + 1)}
                              className="p-1 hover:bg-[#333] rounded text-gray-300 hover:text-white transition-colors"
                            >
                              <Plus className="w-3.5 h-3.5" />
                            </button>
                          </div>

                          <span className="text-sm font-bold text-white w-20 text-right">
                            {formatPrice(itemPrice * quantity)}
                          </span>

                          <button
                            type="button"
                            onClick={() => removeItem(dish.id)}
                            className="p-1.5 text-gray-500 hover:text-red-400 transition-colors"
                            title="Eliminar plato"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      )
                    })}
                  </div>
                </div>
              </div>

              {/* Delivery & WhatsApp Order Form */}
              <div className="lg:col-span-5 space-y-4">
                <form
                  onSubmit={handleSendWhatsAppOrder}
                  className="bg-[#141414] border border-[#2a2a2a] rounded-2xl p-6 space-y-5"
                >
                  <h2 className="font-bold text-lg text-white">Detalles de Entrega</h2>

                  {/* Delivery / Pickup switcher */}
                  <div className="grid grid-cols-2 gap-2 bg-[#1a1a1a] p-1 rounded-xl border border-[#2a2a2a]">
                    <button
                      type="button"
                      onClick={() => setDeliveryType('delivery')}
                      className={`py-2 text-xs font-bold rounded-lg transition-all ${
                        deliveryType === 'delivery'
                          ? 'bg-[#e53e3e] text-white shadow'
                          : 'text-gray-400 hover:text-white'
                      }`}
                    >
                      🛵 Delivery
                    </button>
                    <button
                      type="button"
                      onClick={() => setDeliveryType('pickup')}
                      className={`py-2 text-xs font-bold rounded-lg transition-all ${
                        deliveryType === 'pickup'
                          ? 'bg-[#e53e3e] text-white shadow'
                          : 'text-gray-400 hover:text-white'
                      }`}
                    >
                      🥡 Recojo en Local
                    </button>
                  </div>

                  <div className="space-y-3 text-sm">
                    <div>
                      <label className="block text-xs font-medium text-gray-400 mb-1">
                        Tu Nombre Completo *
                      </label>
                      <input
                        type="text"
                        required
                        value={customerName}
                        onChange={(e) => setCustomerName(e.target.value)}
                        placeholder="Ej. Juan Pérez"
                        className="w-full bg-[#1e1e1e] border border-[#2e2e2e] rounded-lg px-3.5 py-2.5 text-white placeholder-gray-500 focus:outline-none focus:border-[#e53e3e]"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-gray-400 mb-1">
                        Teléfono / WhatsApp *
                      </label>
                      <input
                        type="tel"
                        required
                        value={customerPhone}
                        onChange={(e) => setCustomerPhone(e.target.value)}
                        placeholder="Ej. 987 654 321"
                        className="w-full bg-[#1e1e1e] border border-[#2e2e2e] rounded-lg px-3.5 py-2.5 text-white placeholder-gray-500 focus:outline-none focus:border-[#e53e3e]"
                      />
                    </div>

                    {deliveryType === 'delivery' && (
                      <div>
                        <label className="block text-xs font-medium text-gray-400 mb-1">
                          Dirección de Entrega y Referencia *
                        </label>
                        <input
                          type="text"
                          required
                          value={customerAddress}
                          onChange={(e) => setCustomerAddress(e.target.value)}
                          placeholder="Ej. Av. Universitaria con Retablo, dpto 301"
                          className="w-full bg-[#1e1e1e] border border-[#2e2e2e] rounded-lg px-3.5 py-2.5 text-white placeholder-gray-500 focus:outline-none focus:border-[#e53e3e]"
                        />
                      </div>
                    )}

                    <div>
                      <label className="block text-xs font-medium text-gray-400 mb-1">
                        Método de Pago
                      </label>
                      <div className="grid grid-cols-2 gap-2 pt-1">
                        {(
                          [
                            { id: 'yape', label: '💜 Yape' },
                            { id: 'plin', label: '🩵 Plin' },
                            { id: 'card', label: '💳 Tarjeta (POS)' },
                            { id: 'cash', label: '💵 Efectivo' },
                          ] as const
                        ).map((m) => (
                          <button
                            key={m.id}
                            type="button"
                            onClick={() => setPaymentMethod(m.id)}
                            className={`py-2 px-3 rounded-lg border text-xs font-semibold text-left transition-all ${
                              paymentMethod === m.id
                                ? 'border-[#e53e3e] bg-[#e53e3e]/10 text-white'
                                : 'border-[#2a2a2a] bg-[#1e1e1e] text-gray-400 hover:text-white'
                            }`}
                          >
                            {m.label}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-gray-400 mb-1">
                        Notas especiales (opcional)
                      </label>
                      <input
                        type="text"
                        value={orderNotes}
                        onChange={(e) => setOrderNotes(e.target.value)}
                        placeholder="Ej. Sin palillo, salsa acevichada extra"
                        className="w-full bg-[#1e1e1e] border border-[#2e2e2e] rounded-lg px-3.5 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-[#e53e3e] text-xs"
                      />
                    </div>
                  </div>

                  {/* Pricing breakdown */}
                  <div className="pt-4 border-t border-[#222] space-y-2 text-sm">
                    <div className="flex justify-between text-[#a0a0a0]">
                      <span>Subtotal</span>
                      <span className="text-white font-medium">{formatPrice(totalPrice)}</span>
                    </div>
                    {deliveryType === 'delivery' && (
                      <div className="flex justify-between text-[#a0a0a0]">
                        <span>Costo de envío</span>
                        <span className="text-white font-medium">{formatPrice(deliveryFee)}</span>
                      </div>
                    )}
                    <div className="flex justify-between text-base font-bold text-white pt-2 border-t border-[#222]">
                      <span>Total a Pagar</span>
                      <span className="text-[#f6ad55] text-lg">{formatPrice(finalTotal)}</span>
                    </div>
                  </div>

                  {/* WhatsApp Action Button */}
                  <button
                    type="submit"
                    className="w-full py-4 bg-[#25D366] hover:bg-[#20ba5a] text-black font-extrabold rounded-xl transition-all shadow-lg flex items-center justify-center gap-2 text-base cursor-pointer hover:scale-[1.02] active:scale-[0.98]"
                  >
                    <Send className="w-5 h-5" />
                    Enviar Pedido por WhatsApp
                  </button>

                  <p className="text-[11px] text-center text-gray-500">
                    Tu pedido se enviará directamente a nuestro WhatsApp oficial (+51 987 654 321) para confirmación inmediata.
                  </p>
                </form>
              </div>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  )
}
