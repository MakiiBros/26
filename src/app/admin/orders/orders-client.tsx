'use client'

import React, { useState, useMemo } from 'react'
import { formatPrice } from '@/lib/utils'
import { 
  CheckCircle2, Clock, XCircle, Search, Trash2, 
  AlertCircle, RefreshCw, Eye, MapPin, Utensils, 
  StickyNote, Mail, CreditCard, ChevronRight, X,
  TrendingUp, PackageOpen, AlertTriangle
} from 'lucide-react'
import { deleteOrder, clearOldPendingOrders } from './actions'

export default function OrdersClient({ initialOrders }: { initialOrders: any[] }) {
  const [search, setSearch] = useState('')
  const [isClearing, setIsClearing] = useState(false)
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [selectedOrder, setSelectedOrder] = useState<any | null>(null)

  const filteredOrders = useMemo(() => {
    return initialOrders.filter((order) => {
      const term = search.toLowerCase()
      return (
        order.customer_name?.toLowerCase().includes(term) ||
        order.customer_phone?.includes(term) ||
        order.id.toLowerCase().includes(term)
      )
    })
  }, [initialOrders, search])

  const metrics = useMemo(() => {
    const total = filteredOrders.length;
    const pending = filteredOrders.filter(o => o.payment_status === 'pending').length;
    const revenue = filteredOrders
      .filter(o => o.payment_status === 'paid')
      .reduce((sum, order) => sum + Number(order.total_price || 0), 0);
    
    return { total, pending, revenue };
  }, [filteredOrders]);

  const handleDelete = async (id: string) => {
    if (!confirm('¿Estás seguro de eliminar esta orden de forma permanente?')) return
    setDeletingId(id)
    try {
      await deleteOrder(id)
      if (selectedOrder?.id === id) setSelectedOrder(null)
    } catch (e) {
      alert('Error al eliminar orden')
    }
    setDeletingId(null)
  }

  const handleClearOld = async () => {
    if (!confirm('Esto eliminará todas las órdenes "Pendientes" creadas hace más de 20 minutos. Esta acción no se puede deshacer.')) return
    setIsClearing(true)
    try {
      await clearOldPendingOrders()
      setSelectedOrder(null)
    } catch (e) {
      alert('Error al limpiar órdenes')
    }
    setIsClearing(false)
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'paid':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            <CheckCircle2 className="w-3.5 h-3.5" />
            Pagado
          </span>
        )
      case 'failed':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-red-500/10 text-red-400 border border-red-500/20">
            <XCircle className="w-3.5 h-3.5" />
            Fallido
          </span>
        )
      case 'pending':
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-amber-500/10 text-amber-400 border border-amber-500/20">
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
    <div className="space-y-8 pb-10">
      
      {/* 1. KPIs / Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-[#111] border border-white/5 p-6 rounded-2xl shadow-xl flex items-center justify-between">
          <div>
            <p className="text-neutral-500 text-sm font-medium mb-1">Total Órdenes</p>
            <h3 className="text-3xl font-bold text-white">{metrics.total}</h3>
          </div>
          <div className="w-12 h-12 bg-blue-500/10 rounded-full flex items-center justify-center border border-blue-500/20">
            <PackageOpen className="w-6 h-6 text-blue-400" />
          </div>
        </div>
        
        <div className="bg-[#111] border border-white/5 p-6 rounded-2xl shadow-xl flex items-center justify-between">
          <div>
            <p className="text-neutral-500 text-sm font-medium mb-1">Ingresos (Pagados)</p>
            <h3 className="text-3xl font-bold text-emerald-400">{formatPrice(metrics.revenue)}</h3>
          </div>
          <div className="w-12 h-12 bg-emerald-500/10 rounded-full flex items-center justify-center border border-emerald-500/20">
            <TrendingUp className="w-6 h-6 text-emerald-400" />
          </div>
        </div>

        <div className="bg-[#111] border border-white/5 p-6 rounded-2xl shadow-xl flex items-center justify-between">
          <div>
            <p className="text-neutral-500 text-sm font-medium mb-1">Pendientes</p>
            <h3 className="text-3xl font-bold text-amber-400">{metrics.pending}</h3>
          </div>
          <div className="w-12 h-12 bg-amber-500/10 rounded-full flex items-center justify-center border border-amber-500/20">
            <AlertTriangle className="w-6 h-6 text-amber-400" />
          </div>
        </div>
      </div>

      {/* 2. Controls */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center bg-[#111] p-2 pr-2 sm:pr-4 sm:p-2 rounded-2xl border border-white/5 shadow-xl">
        <div className="relative w-full sm:w-96">
          <Search className="w-4 h-4 text-neutral-500 absolute left-4 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar por cliente, teléfono o ID..."
            className="w-full bg-transparent border-none rounded-xl pl-11 pr-4 py-3 text-sm text-white placeholder-neutral-600 focus:outline-none focus:ring-0 transition-all"
          />
        </div>
        
        <button
          onClick={handleClearOld}
          disabled={isClearing}
          className="w-full sm:w-auto flex items-center justify-center gap-2 px-5 py-2.5 bg-[#1a1a1a] hover:bg-[#222] text-neutral-300 hover:text-white text-sm font-medium rounded-xl border border-white/5 hover:border-white/10 transition-all disabled:opacity-50"
        >
          {isClearing ? <RefreshCw className="w-4 h-4 animate-spin" /> : <AlertCircle className="w-4 h-4 text-amber-500" />}
          <span>Limpiar Expirados</span>
        </button>
      </div>

      {/* 3. Main Table */}
      <div className="bg-[#111] border border-white/5 rounded-2xl shadow-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-[#0a0a0a] text-xs uppercase tracking-wider text-neutral-500 border-b border-white/5">
              <tr>
                <th className="px-6 py-4 font-semibold">Cliente</th>
                <th className="px-6 py-4 font-semibold">Contacto</th>
                <th className="px-6 py-4 font-semibold">Método</th>
                <th className="px-6 py-4 font-semibold">Total</th>
                <th className="px-6 py-4 font-semibold">Estado</th>
                <th className="px-6 py-4 font-semibold">Fecha</th>
                <th className="px-6 py-4 font-semibold text-right"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {!filteredOrders.length ? (
                <tr>
                  <td colSpan={7} className="px-6 py-20 text-center">
                    <div className="flex flex-col items-center justify-center gap-4">
                      <div className="w-16 h-16 rounded-full bg-[#1a1a1a] flex items-center justify-center border border-white/5">
                        <Search className="w-6 h-6 text-neutral-600" />
                      </div>
                      <p className="text-neutral-500 font-medium">No se encontraron órdenes</p>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredOrders.map((order) => {
                  return (
                    <tr 
                      key={order.id} 
                      onClick={() => setSelectedOrder(order)}
                      className="hover:bg-[#1a1a1a] transition-colors cursor-pointer group"
                    >
                      <td className="px-6 py-4">
                        <p className="font-semibold text-neutral-200">{order.customer_name}</p>
                        <p className="text-xs text-neutral-500 font-mono mt-0.5">#{order.id.split('-')[0]}</p>
                      </td>
                      <td className="px-6 py-4">
                        <p className="font-mono text-neutral-300">{order.customer_phone}</p>
                      </td>
                      <td className="px-6 py-4">
                        <span className="bg-[#1a1a1a] border border-white/5 px-2.5 py-1 rounded-md text-[11px] font-medium text-neutral-400">
                          {getMethodLabel(order.payment_method)}
                        </span>
                      </td>
                      <td className="px-6 py-4 font-bold text-white">
                        {formatPrice(order.total_price)}
                      </td>
                      <td className="px-6 py-4">
                        {getStatusBadge(order.payment_status)}
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-neutral-400 text-xs">
                          {new Date(order.created_at).toLocaleString('es-PE', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDelete(order.id);
                            }}
                            disabled={deletingId === order.id}
                            className="p-2 text-neutral-500 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-all"
                            title="Eliminar permanentemente"
                          >
                            {deletingId === order.id ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                          </button>
                          <ChevronRight className="w-5 h-5 text-neutral-600" />
                        </div>
                      </td>
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* 4. Slide-over Drawer for Order Details */}
      {selectedOrder && (
        <div className="fixed inset-0 z-[100] flex justify-end">
          {/* Backdrop */}
          <div 
            className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
            onClick={() => setSelectedOrder(null)}
          />
          
          {/* Panel */}
          <div className="relative w-full max-w-md bg-[#0a0a0a] h-full border-l border-white/10 shadow-2xl overflow-y-auto animate-in slide-in-from-right duration-300 flex flex-col">
            
            {/* Drawer Header */}
            <div className="sticky top-0 bg-[#0a0a0a]/90 backdrop-blur-md border-b border-white/5 p-6 flex items-start justify-between z-10">
              <div>
                <h2 className="text-xl font-bold text-white">Detalle de Orden</h2>
                <p className="text-sm text-neutral-500 font-mono mt-1">#{selectedOrder.id}</p>
              </div>
              <button 
                onClick={() => setSelectedOrder(null)}
                className="p-2 bg-white/5 hover:bg-white/10 rounded-full transition-colors text-neutral-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Drawer Body */}
            <div className="p-6 space-y-8 flex-1">
              
              {/* Customer Info */}
              <div className="space-y-4">
                <h3 className="text-xs font-bold text-neutral-500 uppercase tracking-wider">Cliente</h3>
                <div className="bg-[#111] border border-white/5 rounded-xl p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-neutral-400 text-sm">Nombre</span>
                    <span className="font-medium text-white">{selectedOrder.customer_name}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-neutral-400 text-sm">Teléfono</span>
                    <span className="font-mono text-white">{selectedOrder.customer_phone}</span>
                  </div>
                  {selectedOrder.customer_email && (
                    <div className="flex items-center justify-between">
                      <span className="text-neutral-400 text-sm">Email</span>
                      <span className="text-sm text-white">{selectedOrder.customer_email}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Delivery Info */}
              <div className="space-y-4">
                <h3 className="text-xs font-bold text-neutral-500 uppercase tracking-wider">Entrega</h3>
                <div className="bg-[#111] border border-white/5 rounded-xl p-4 flex gap-3 items-start">
                  <MapPin className="w-5 h-5 text-blue-400 shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm text-white leading-relaxed">
                      {selectedOrder.customer_address || 'Recojo en tienda'}
                    </p>
                  </div>
                </div>
              </div>

              {/* Items List */}
              <div className="space-y-4">
                <h3 className="text-xs font-bold text-neutral-500 uppercase tracking-wider flex items-center gap-2">
                  <Utensils className="w-4 h-4" />
                  Pedido
                </h3>
                <div className="bg-[#111] border border-white/5 rounded-xl overflow-hidden">
                  <ul className="divide-y divide-white/5">
                    {selectedOrder.items?.map((item: any, idx: number) => {
                      const itemName = item.dish?.name || item.name || 'Producto';
                      const itemPrice = item.dish?.price || item.price || 0;
                      const itemQuantity = item.quantity || 1;
                      
                      return (
                        <li key={idx} className="p-4 flex gap-4 items-center justify-between hover:bg-white/[0.02] transition-colors">
                          <div className="flex items-center gap-3">
                            <span className="bg-neutral-800 text-neutral-300 text-xs font-bold w-6 h-6 rounded flex items-center justify-center shrink-0">
                              {itemQuantity}
                            </span>
                            <span className="text-sm font-medium text-neutral-200">{itemName}</span>
                          </div>
                          <span className="text-sm font-bold text-neutral-400 whitespace-nowrap">
                            {formatPrice(itemPrice * itemQuantity)}
                          </span>
                        </li>
                      );
                    })}
                  </ul>
                  <div className="p-4 bg-white/[0.02] border-t border-white/5 flex items-center justify-between">
                    <span className="text-sm font-bold text-neutral-400">Total</span>
                    <span className="text-lg font-black text-white">{formatPrice(selectedOrder.total_price)}</span>
                  </div>
                </div>
              </div>

              {/* Notes */}
              {selectedOrder.order_notes && (
                <div className="space-y-4">
                  <h3 className="text-xs font-bold text-amber-500/70 uppercase tracking-wider flex items-center gap-2">
                    <StickyNote className="w-4 h-4" />
                    Notas Adicionales
                  </h3>
                  <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl p-4 text-sm text-amber-200/90 leading-relaxed">
                    {selectedOrder.order_notes}
                  </div>
                </div>
              )}

              {/* Payment Details */}
              <div className="space-y-4">
                <h3 className="text-xs font-bold text-neutral-500 uppercase tracking-wider flex items-center gap-2">
                  <CreditCard className="w-4 h-4" />
                  Transacción
                </h3>
                <div className="bg-[#111] border border-white/5 rounded-xl p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-neutral-400 text-sm">Estado</span>
                    {getStatusBadge(selectedOrder.payment_status)}
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-neutral-400 text-sm">Método</span>
                    <span className="text-sm font-medium text-white">{getMethodLabel(selectedOrder.payment_method)}</span>
                  </div>
                  {selectedOrder.preference_id && (
                    <div className="flex flex-col gap-1 pt-2 border-t border-white/5 mt-2">
                      <span className="text-neutral-500 text-xs">ID de Referencia (MercadoPago)</span>
                      <span className="text-xs font-mono text-neutral-400 break-all bg-black/50 p-2 rounded border border-white/5">
                        {selectedOrder.preference_id}
                      </span>
                    </div>
                  )}
                </div>
              </div>

            </div>

            {/* Drawer Footer Actions */}
            <div className="p-6 border-t border-white/5 bg-[#0a0a0a]">
               <button
                  onClick={() => handleDelete(selectedOrder.id)}
                  disabled={deletingId === selectedOrder.id}
                  className="w-full flex items-center justify-center gap-2 px-5 py-3.5 bg-red-500/10 hover:bg-red-500/20 text-red-500 font-bold rounded-xl border border-red-500/20 transition-all disabled:opacity-50"
                >
                  {deletingId === selectedOrder.id ? (
                    <RefreshCw className="w-5 h-5 animate-spin" />
                  ) : (
                    <>
                      <Trash2 className="w-5 h-5" />
                      Eliminar Orden Definitivamente
                    </>
                  )}
                </button>
            </div>

          </div>
        </div>
      )}

    </div>
  )
}
