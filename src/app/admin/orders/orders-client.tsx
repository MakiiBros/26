'use client'

import { useState } from 'react'
import { formatPrice } from '@/lib/utils'
import { CheckCircle2, Clock, XCircle, Search, Trash2, AlertCircle, RefreshCw } from 'lucide-react'
import { deleteOrder, clearOldPendingOrders } from './actions'

export default function OrdersClient({ initialOrders }: { initialOrders: any[] }) {
  const [search, setSearch] = useState('')
  const [isClearing, setIsClearing] = useState(false)
  const [deletingId, setDeletingId] = useState<string | null>(null)

  const filteredOrders = initialOrders.filter((order) => {
    const term = search.toLowerCase()
    return (
      order.customer_name?.toLowerCase().includes(term) ||
      order.customer_phone?.includes(term) ||
      order.id.toLowerCase().includes(term)
    )
  })

  const handleDelete = async (id: string) => {
    if (!confirm('¿Estás seguro de eliminar esta orden?')) return
    setDeletingId(id)
    try {
      await deleteOrder(id)
    } catch (e) {
      alert('Error al eliminar orden')
    }
    setDeletingId(null)
  }

  const handleClearOld = async () => {
    if (!confirm('Esto eliminará todas las órdenes "Pendientes" creadas hace más de 30 minutos. ¿Continuar?')) return
    setIsClearing(true)
    try {
      await clearOldPendingOrders()
    } catch (e) {
      alert('Error al limpiar órdenes')
    }
    setIsClearing(false)
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'paid':
        return (
          <span className="inline-flex items-center gap-1.5 text-emerald-400 bg-emerald-400/10 px-2.5 py-1 rounded-full text-xs font-semibold border border-emerald-400/20 shadow-[0_0_10px_rgba(52,211,153,0.1)]">
            <CheckCircle2 className="w-3.5 h-3.5" />
            Pagado (Verificado)
          </span>
        )
      case 'failed':
        return (
          <span className="inline-flex items-center gap-1.5 text-red-400 bg-red-400/10 px-2.5 py-1 rounded-full text-xs font-semibold border border-red-400/20 shadow-[0_0_10px_rgba(248,113,113,0.1)]">
            <XCircle className="w-3.5 h-3.5" />
            Fallido
          </span>
        )
      case 'pending':
      default:
        return (
          <span className="inline-flex items-center gap-1.5 text-amber-400 bg-amber-400/10 px-2.5 py-1 rounded-full text-xs font-semibold border border-amber-400/20 shadow-[0_0_10px_rgba(251,191,36,0.1)]">
            <Clock className="w-3.5 h-3.5" />
            Pendiente
          </span>
        )
    }
  }

  const getMethodLabel = (method: string) => {
    const labels: Record<string, string> = {
      online: 'Pago Online',
      yape: 'Yape',
      plin: 'Plin',
      card: 'Tarjeta',
      cash: 'Efectivo',
    }
    return labels[method] || method
  }

  return (
    <div className="space-y-6">
      {/* Header & Controls */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center bg-[#141414] p-5 rounded-2xl border border-white/5 shadow-2xl">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar por cliente o teléfono..."
            className="w-full bg-[#0a0a0a] border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder-neutral-500 focus:outline-none focus:border-[#e53e3e] focus:ring-1 focus:ring-[#e53e3e]/30 transition-all shadow-inner"
          />
        </div>
        
        <button
          onClick={handleClearOld}
          disabled={isClearing}
          className="flex items-center gap-2 px-4 py-2.5 bg-neutral-900 hover:bg-neutral-800 text-neutral-300 hover:text-white text-sm font-medium rounded-xl border border-white/5 hover:border-white/10 transition-all disabled:opacity-50"
        >
          {isClearing ? <RefreshCw className="w-4 h-4 animate-spin" /> : <AlertCircle className="w-4 h-4 text-amber-500" />}
          Limpiar Pendientes Expirados (30m)
        </button>
      </div>

      {/* Table Card */}
      <div className="bg-[#141414] border border-white/5 rounded-2xl overflow-hidden shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-[#0a0a0a] text-xs uppercase tracking-wider text-neutral-500 border-b border-white/5">
              <tr>
                <th className="px-6 py-5 font-semibold">Fecha</th>
                <th className="px-6 py-5 font-semibold">Cliente</th>
                <th className="px-6 py-5 font-semibold">Teléfono</th>
                <th className="px-6 py-5 font-semibold">Método</th>
                <th className="px-6 py-5 font-semibold">Total</th>
                <th className="px-6 py-5 font-semibold">Estado</th>
                <th className="px-6 py-5 font-semibold text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {!filteredOrders.length ? (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-neutral-500">
                    <div className="flex flex-col items-center justify-center gap-3">
                      <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center">
                        <Search className="w-5 h-5 text-neutral-600" />
                      </div>
                      <p>No se encontraron órdenes.</p>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-white/[0.02] transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex flex-col">
                        <span className="text-neutral-300">
                          {new Date(order.created_at).toLocaleDateString('es-PE', { day: '2-digit', month: 'short' })}
                        </span>
                        <span className="text-xs text-neutral-500 font-mono">
                          {new Date(order.created_at).toLocaleTimeString('es-PE', { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 font-medium text-neutral-200">{order.customer_name}</td>
                    <td className="px-6 py-4 font-mono text-neutral-400 text-xs">{order.customer_phone}</td>
                    <td className="px-6 py-4">
                      <span className="bg-white/5 border border-white/10 px-2.5 py-1 rounded-md text-[11px] font-medium text-neutral-300">
                        {getMethodLabel(order.payment_method)}
                      </span>
                    </td>
                    <td className="px-6 py-4 font-bold text-white tracking-tight">
                      {formatPrice(order.total_price)}
                    </td>
                    <td className="px-6 py-4">
                      {getStatusBadge(order.payment_status)}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={() => handleDelete(order.id)}
                        disabled={deletingId === order.id}
                        className="p-2 text-neutral-500 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-all opacity-0 group-hover:opacity-100 focus:opacity-100 disabled:opacity-50"
                        title="Eliminar Orden"
                      >
                        {deletingId === order.id ? (
                          <RefreshCw className="w-4 h-4 animate-spin" />
                        ) : (
                          <Trash2 className="w-4 h-4" />
                        )}
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
