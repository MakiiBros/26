'use client'

import { useRouter } from 'next/navigation'
import { useState, useEffect } from 'react'
import { loadMercadoPago } from '@mercadopago/sdk-js'
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
  CreditCard,
  Banknote,
  Smartphone,
  ShieldCheck,
  HelpCircle,
  Lock,
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

  // Método de pago: Yape (Checkout API), Tarjeta (Checkout API) o Efectivo
  const [paymentMethod, setPaymentMethod] = useState<'yape' | 'card' | 'cash'>('yape')

  // Datos específicos para Yape
  const [yapePhone, setYapePhone] = useState('')
  const [yapeOtp, setYapeOtp] = useState('')
  const [showYapeHelp, setShowYapeHelp] = useState(false)

  // Datos específicos para Tarjeta
  const [cardNumber, setCardNumber] = useState('')
  const [cardholderName, setCardholderName] = useState('')
  const [cardExp, setCardExp] = useState('')
  const [cardCvv, setCardCvv] = useState('')
  const [docType, setDocType] = useState<'DNI' | 'CE' | 'Pasaporte'>('DNI')
  const [docNumber, setDocNumber] = useState('')

  // Estados de proceso
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)
  const [mpLoaded, setMpLoaded] = useState(false)

  // Cargar SDK de Mercado Pago para Checkout API
  useEffect(() => {
    let isMounted = true
    const initMP = async () => {
      try {
        await loadMercadoPago()
        const publicKey =
          process.env.NEXT_PUBLIC_MERCADOPAGO_PUBLIC_KEY ||
          'APP_USR-26ff591d-42da-41ae-b199-b0bc0d63536c'
        if (typeof window !== 'undefined' && (window as any).MercadoPago) {
          new (window as any).MercadoPago(publicKey, { locale: 'es-PE' })
          if (isMounted) setMpLoaded(true)
        }
      } catch (err) {
        console.error('Error inicializando MercadoPago JS:', err)
      }
    }
    initMP()
    return () => {
      isMounted = false
    }
  }, [])

  // Sincronizar número de teléfono con Yape si está vacío
  useEffect(() => {
    if (!yapePhone && customerPhone) {
      setYapePhone(customerPhone)
    }
  }, [customerPhone, yapePhone])

  const deliveryFee = deliveryType === 'delivery' ? 5.0 : 0.0
  const finalTotal = totalPrice + deliveryFee

  // Detección de franquicia de tarjeta
  const getCardBrand = (number: string): string => {
    const clean = number.replace(/\s+/g, '')
    if (/^4/.test(clean)) return 'Visa'
    if (/^(5[1-5]|2[2-7])/.test(clean)) return 'Mastercard'
    if (/^3[47]/.test(clean)) return 'Amex'
    if (/^(36|38)/.test(clean)) return 'Diners'
    return ''
  }

  // Formateadores de inputs
  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const digits = e.target.value.replace(/\D/g, '').slice(0, 16)
    const formatted = digits.replace(/(\d{4})(?=\d)/g, '$1 ')
    setCardNumber(formatted)
  }

  const handleCardExpChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const digits = e.target.value.replace(/\D/g, '').slice(0, 4)
    if (digits.length >= 3) {
      setCardExp(`${digits.slice(0, 2)}/${digits.slice(2)}`)
    } else {
      setCardExp(digits)
    }
  }

  const handleCardCvvChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const digits = e.target.value.replace(/\D/g, '').slice(0, 4)
    setCardCvv(digits)
  }

  const handleYapeOtpChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const digits = e.target.value.replace(/\D/g, '').slice(0, 6)
    setYapeOtp(digits)
  }

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

  // Procesar Pago con YAPE (Checkout API de Mercado Pago)
  const handlePayWithYape = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validateCommonFields()) return

    const phoneToUse = yapePhone.trim() || customerPhone.trim()
    const cleanOtp = yapeOtp.trim()

    if (!phoneToUse) {
      toast('Por favor ingresa tu celular registrado en Yape.', 'error')
      return
    }

    if (cleanOtp.length !== 6) {
      toast('El código de aprobación de Yape debe tener exactamente 6 dígitos.', 'error')
      return
    }

    setIsProcessing(true)
    try {
      const cleanPhoneDigits = phoneToUse.replace(/\D/g, '')
      const res = await fetch('/api/process_payment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          orderData: {
            customerName: customerName.trim(),
            customerPhone: phoneToUse,
            customerEmail: customerEmail.trim(),
            customerAddress: customerAddress.trim(),
            orderNotes: orderNotes.trim(),
            deliveryType,
            totalPrice: finalTotal,
            items,
            paymentMethod: 'yape',
          },
          paymentData: {
            payment_method_id: 'yape',
            token: cleanOtp,
            payer: {
              email:
                customerEmail.trim() ||
                `${cleanPhoneDigits || 'cliente'}@makibros.pe`,
            },
          },
        }),
      })

      const data = await res.json()
      if (data.success && data.status === 'approved') {
        toast('¡Pago con Yape completado con éxito!', 'success')
        clearCart()
        router.push('/checkout/success')
      } else {
        const errorMsg =
          data.message ||
          data.error ||
          'No se pudo procesar el pago con Yape. Por favor verifica tu código de aprobación o saldo.'
        toast(errorMsg, 'error')
      }
    } catch (err) {
      console.error('Error procesando pago Yape:', err)
      toast('Error de conexión al procesar el pago con Yape.', 'error')
    } finally {
      setIsProcessing(false)
    }
  }

  // Procesar Pago con TARJETA (Checkout API de Mercado Pago)
  const handlePayWithCard = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validateCommonFields()) return

    const cleanCard = cardNumber.replace(/\s+/g, '')
    if (cleanCard.length < 13) {
      toast('Ingresa un número de tarjeta válido.', 'error')
      return
    }
    if (!cardholderName.trim()) {
      toast('Ingresa el nombre del titular de la tarjeta.', 'error')
      return
    }
    if (!cardExp.includes('/') || cardExp.length < 5) {
      toast('Ingresa la fecha de vencimiento (MM/AA).', 'error')
      return
    }
    if (cardCvv.trim().length < 3) {
      toast('Ingresa el código de seguridad (CVV).', 'error')
      return
    }
    if (!docNumber.trim()) {
      toast('Ingresa tu número de documento.', 'error')
      return
    }

    setIsProcessing(true)
    try {
      const publicKey =
        process.env.NEXT_PUBLIC_MERCADOPAGO_PUBLIC_KEY ||
        'APP_USR-26ff591d-42da-41ae-b199-b0bc0d63536c'

      if (typeof window === 'undefined' || !(window as any).MercadoPago) {
        throw new Error('El sistema de pago seguro está iniciando. Por favor, intenta de nuevo en unos segundos.')
      }

      const mp = new (window as any).MercadoPago(publicKey, { locale: 'es-PE' })
      const [month, year] = cardExp.split('/')
      const fullYear = year.trim().length === 2 ? `20${year.trim()}` : year.trim()

      // Tokenizar tarjeta en el cliente de forma segura (PCI compliant)
      const tokenResponse = await mp.createCardToken({
        cardNumber: cleanCard,
        cardholderName: cardholderName.trim(),
        cardExpirationMonth: month.trim(),
        cardExpirationYear: fullYear,
        securityCode: cardCvv.trim(),
        identificationType: docType,
        identificationNumber: docNumber.trim(),
      })

      if (!tokenResponse || !tokenResponse.id) {
        throw new Error('No se pudo validar la tarjeta. Revisa los datos ingresados.')
      }

      const cleanPhoneDigits = customerPhone.replace(/\D/g, '')
      const res = await fetch('/api/process_payment', {
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
            paymentMethod: 'card',
          },
          paymentData: {
            token: tokenResponse.id,
            installments: 1,
            payer: {
              email:
                customerEmail.trim() ||
                `${cleanPhoneDigits || 'cliente'}@makibros.pe`,
              identification: {
                type: docType,
                number: docNumber.trim(),
              },
            },
          },
        }),
      })

      const data = await res.json()
      if (data.success && data.status === 'approved') {
        toast('¡Pago con tarjeta aprobado exitosamente!', 'success')
        clearCart()
        router.push('/checkout/success')
      } else {
        const errorMsg =
          data.message ||
          data.error ||
          'El pago fue rechazado por el banco. Por favor intenta con otra tarjeta o con Yape.'
        toast(errorMsg, 'error')
      }
    } catch (err: any) {
      console.error('Error procesando pago con tarjeta:', err)
      toast(err?.message || 'Ocurrió un error al procesar la tarjeta.', 'error')
    } finally {
      setIsProcessing(false)
    }
  }

  // Procesar Pedido en EFECTIVO (Vía WhatsApp)
  const handleSendCashOrder = async (e: React.FormEvent) => {
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
            paymentMethod: 'cash',
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

    const message =
      `🍱 *¡HOLA MAKIBROS! NUEVO PEDIDO*\n\n` +
      `👤 *Cliente:* ${customerName}\n` +
      `📱 *Teléfono:* ${customerPhone}\n` +
      `🛵 *Modalidad:* ${deliveryType === 'delivery' ? 'Delivery a domicilio' : 'Recojo en local'}\n` +
      (deliveryType === 'delivery' ? `📍 *Dirección:* ${customerAddress}\n` : '') +
      `💵 *Método de Pago:* Efectivo (Contraentrega)\n\n` +
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

  const cardBrand = getCardBrand(cardNumber)

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

              {/* Panel de Checkout: Entrega + Método de Pago API */}
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
                    <div className="grid grid-cols-3 gap-2">
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

                      {/* Opción Tarjeta */}
                      <button
                        type="button"
                        onClick={() => setPaymentMethod('card')}
                        className={`btn-press p-2.5 rounded-xl border text-xs font-bold text-center transition-all flex flex-col items-center justify-center gap-1 cursor-pointer ${
                          paymentMethod === 'card'
                            ? 'border-[#e53e3e] bg-[#e53e3e]/20 text-white ring-1 ring-[#e53e3e]/60'
                            : 'text-neutral-400 bg-white/[0.03] border-white/10 hover:text-white hover:bg-white/[0.06]'
                        }`}
                      >
                        <CreditCard className="w-5 h-5 text-[#e53e3e]" />
                        <span>Tarjeta</span>
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

                  {/* FORMULARIO: PAGO CON YAPE (Checkout API) */}
                  {paymentMethod === 'yape' && (
                    <form onSubmit={handlePayWithYape} className="space-y-4 pt-2">
                      <div className="bg-[#732282]/10 border border-[#732282]/30 rounded-2xl p-3.5 text-xs text-neutral-300 space-y-2">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2 font-bold text-white">
                            <span className="w-4 h-4 rounded-full bg-[#732282] text-white flex items-center justify-center text-[10px]">
                              Y
                            </span>
                            <span>Pago Inmediato con Yape</span>
                          </div>
                          <button
                            type="button"
                            onClick={() => setShowYapeHelp(!showYapeHelp)}
                            className="text-[#a332b8] hover:text-purple-300 flex items-center gap-1 cursor-pointer"
                          >
                            <HelpCircle className="w-3.5 h-3.5" />
                            <span>¿Dónde veo el código?</span>
                          </button>
                        </div>

                        {showYapeHelp && (
                          <div className="pt-2 border-t border-[#732282]/20 text-[11px] text-neutral-300 space-y-1 bg-black/40 p-2.5 rounded-xl">
                            <p>1. Abre tu aplicación <strong>Yape</strong> en tu celular.</p>
                            <p>2. En el menú superior o barra lateral, presiona <strong>&quot;Código de aprobación&quot;</strong>.</p>
                            <p>3. Copia el código de <strong>6 dígitos</strong> y escríbelo aquí abajo (es válido por 90 segundos).</p>
                          </div>
                        )}
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label className="block text-xs font-mono uppercase tracking-wider text-neutral-400 mb-1 font-medium">
                            Celular Yape *
                          </label>
                          <input
                            type="tel"
                            required
                            value={yapePhone}
                            onChange={(e) => setYapePhone(e.target.value)}
                            placeholder="Ej. 987 654 321"
                            className="w-full bg-[#09090c] border border-white/10 rounded-xl px-3.5 py-2 text-white placeholder-neutral-600 focus:outline-none focus:border-[#732282] focus:ring-1 focus:ring-[#732282]/50 text-sm font-mono transition-all"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-mono uppercase tracking-wider text-neutral-400 mb-1 font-medium flex items-center justify-between">
                            <span>Código de Aprobación *</span>
                            <span className="text-[10px] text-purple-400 lowercase">6 dígitos</span>
                          </label>
                          <input
                            type="text"
                            inputMode="numeric"
                            required
                            maxLength={6}
                            value={yapeOtp}
                            onChange={handleYapeOtpChange}
                            placeholder="000000"
                            className="w-full bg-[#09090c] border border-[#732282]/40 rounded-xl px-3.5 py-2 text-white placeholder-neutral-600 focus:outline-none focus:border-[#a332b8] focus:ring-2 focus:ring-[#732282]/50 text-base font-mono font-bold tracking-[0.25em] text-center transition-all"
                          />
                        </div>
                      </div>

                      <button
                        type="submit"
                        disabled={isProcessing}
                        className="btn-press w-full py-3.5 bg-gradient-to-r from-[#732282] to-[#912d9b] hover:from-[#822792] hover:to-[#a332b8] text-white font-bold rounded-xl transition-all shadow-lg shadow-[#732282]/25 flex items-center justify-center gap-2 text-sm disabled:opacity-50 cursor-pointer"
                      >
                        <Smartphone className="w-4 h-4" />
                        <span>{isProcessing ? 'Verificando con Yape...' : `Pagar ${formatPrice(finalTotal)} con Yape`}</span>
                      </button>
                    </form>
                  )}

                  {/* FORMULARIO: PAGO CON TARJETA (Checkout API) */}
                  {paymentMethod === 'card' && (
                    <form onSubmit={handlePayWithCard} className="space-y-3.5 pt-2">
                      <div>
                        <label className="block text-xs font-mono uppercase tracking-wider text-neutral-400 mb-1 font-medium flex items-center justify-between">
                          <span>Número de Tarjeta *</span>
                          {cardBrand && (
                            <span className="text-[10px] font-bold text-[#f59e0b] uppercase font-mono px-2 py-0.5 rounded bg-white/5 border border-white/10">
                              {cardBrand}
                            </span>
                          )}
                        </label>
                        <div className="relative">
                          <input
                            type="text"
                            inputMode="numeric"
                            required
                            value={cardNumber}
                            onChange={handleCardNumberChange}
                            placeholder="4000 1234 5678 9010"
                            className="w-full bg-[#09090c] border border-white/10 rounded-xl pl-3.5 pr-10 py-2 text-white placeholder-neutral-600 focus:outline-none focus:border-[#e53e3e] focus:ring-1 focus:ring-[#e53e3e]/30 text-sm font-mono tracking-wider transition-all"
                          />
                          <CreditCard className="w-4 h-4 text-neutral-500 absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-mono uppercase tracking-wider text-neutral-400 mb-1 font-medium">
                          Nombre del Titular de la Tarjeta *
                        </label>
                        <input
                          type="text"
                          required
                          value={cardholderName}
                          onChange={(e) => setCardholderName(e.target.value.toUpperCase())}
                          placeholder="COMO APARECE EN LA TARJETA"
                          className="w-full bg-[#09090c] border border-white/10 rounded-xl px-3.5 py-2 text-white placeholder-neutral-600 focus:outline-none focus:border-[#e53e3e] focus:ring-1 focus:ring-[#e53e3e]/30 text-xs font-mono uppercase transition-all"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-xs font-mono uppercase tracking-wider text-neutral-400 mb-1 font-medium">
                            Vencimiento *
                          </label>
                          <input
                            type="text"
                            inputMode="numeric"
                            required
                            maxLength={5}
                            value={cardExp}
                            onChange={handleCardExpChange}
                            placeholder="MM/AA"
                            className="w-full bg-[#09090c] border border-white/10 rounded-xl px-3.5 py-2 text-white placeholder-neutral-600 focus:outline-none focus:border-[#e53e3e] focus:ring-1 focus:ring-[#e53e3e]/30 text-sm font-mono text-center transition-all"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-mono uppercase tracking-wider text-neutral-400 mb-1 font-medium">
                            CVV / CVC *
                          </label>
                          <input
                            type="password"
                            inputMode="numeric"
                            required
                            maxLength={4}
                            value={cardCvv}
                            onChange={handleCardCvvChange}
                            placeholder="123"
                            className="w-full bg-[#09090c] border border-white/10 rounded-xl px-3.5 py-2 text-white placeholder-neutral-600 focus:outline-none focus:border-[#e53e3e] focus:ring-1 focus:ring-[#e53e3e]/30 text-sm font-mono text-center tracking-widest transition-all"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-3 gap-2">
                        <div>
                          <label className="block text-xs font-mono uppercase tracking-wider text-neutral-400 mb-1 font-medium">
                            Doc.
                          </label>
                          <select
                            value={docType}
                            onChange={(e) => setDocType(e.target.value as any)}
                            className="w-full bg-[#09090c] border border-white/10 rounded-xl px-2.5 py-2 text-white text-xs font-mono focus:outline-none focus:border-[#e53e3e] transition-all cursor-pointer"
                          >
                            <option value="DNI">DNI</option>
                            <option value="CE">C.E.</option>
                            <option value="Pasaporte">PAS</option>
                          </select>
                        </div>
                        <div className="col-span-2">
                          <label className="block text-xs font-mono uppercase tracking-wider text-neutral-400 mb-1 font-medium">
                            Nro de Documento *
                          </label>
                          <input
                            type="text"
                            required
                            value={docNumber}
                            onChange={(e) => setDocNumber(e.target.value)}
                            placeholder="Número de DNI"
                            className="w-full bg-[#09090c] border border-white/10 rounded-xl px-3.5 py-2 text-white placeholder-neutral-600 focus:outline-none focus:border-[#e53e3e] focus:ring-1 focus:ring-[#e53e3e]/30 text-sm font-mono transition-all"
                          />
                        </div>
                      </div>

                      <div className="flex items-center gap-2 pt-1 text-[11px] text-neutral-400">
                        <Lock className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                        <span>Pago cifrado y procesado de forma segura por Mercado Pago.</span>
                      </div>

                      <button
                        type="submit"
                        disabled={isProcessing}
                        className="btn-press w-full py-3.5 bg-[#e53e3e] hover:bg-[#c53030] text-white font-bold rounded-xl transition-all shadow-lg shadow-[#e53e3e]/25 flex items-center justify-center gap-2 text-sm disabled:opacity-50 cursor-pointer"
                      >
                        <ShieldCheck className="w-4 h-4" />
                        <span>{isProcessing ? 'Validando con el banco...' : `Pagar ${formatPrice(finalTotal)}`}</span>
                      </button>
                    </form>
                  )}

                  {/* FORMULARIO: PAGO EN EFECTIVO (WhatsApp) */}
                  {paymentMethod === 'cash' && (
                    <form onSubmit={handleSendCashOrder} className="space-y-4 pt-2">
                      <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-2xl p-4 text-xs text-neutral-300 space-y-1.5">
                        <p className="font-bold text-white flex items-center gap-2">
                          <Banknote className="w-4 h-4 text-emerald-400" />
                          <span>Pago Contraentrega en Efectivo</span>
                        </p>
                        <p className="text-neutral-400 leading-relaxed text-[11px]">
                          Pagarás en efectivo al recibir tu pedido en tu puerta o al recogerlo en nuestro local. Al presionar el botón se abrirá WhatsApp con el resumen de tu pedido.
                        </p>
                      </div>

                      <button
                        type="submit"
                        disabled={isProcessing}
                        className="btn-press w-full py-3.5 bg-emerald-500 hover:bg-emerald-400 text-neutral-950 font-black rounded-xl transition-all shadow-xl shadow-emerald-500/20 flex items-center justify-center gap-2 text-sm sm:text-base cursor-pointer disabled:opacity-50"
                      >
                        <Send className="w-4 h-4" />
                        <span>{isProcessing ? 'Enviando...' : 'Confirmar Pedido por WhatsApp'}</span>
                      </button>
                    </form>
                  )}
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
