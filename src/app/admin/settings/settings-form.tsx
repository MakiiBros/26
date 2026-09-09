'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { updateStoreSettings } from './actions'
import { Store, Clock, Truck, Save } from 'lucide-react'
import { useToast } from '@/components/ui/toast'

export function SettingsForm({ initialData }: { initialData: any }) {
  const router = useRouter()
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    
    const formData = new FormData(e.currentTarget)
    if (initialData?.id) {
      formData.append('id', initialData.id)
    }

    const res = await updateStoreSettings(formData)
    
    setLoading(false)
    if (res?.error) {
      toast(res.error, 'error')
    } else {
      toast('Configuración actualizada', 'success')
      router.refresh()
    }
  }

  return (
    <form onSubmit={handleSubmit} className="bg-[#121217] border border-white/5 rounded-2xl p-6 space-y-8 shadow-xl">
      {/* Tienda Status */}
      <div className="space-y-4">
        <h3 className="text-lg font-bold text-white flex items-center gap-2">
          <Store className="w-5 h-5 text-emerald-400" />
          Estado Principal
        </h3>
        <div className="flex items-center gap-4 bg-white/5 p-4 rounded-xl">
          <div className="flex-1">
            <p className="text-sm font-medium text-white">¿La tienda está abierta?</p>
            <p className="text-xs text-neutral-400">Si está cerrada, los usuarios verán un banner y no podrán pedir.</p>
          </div>
          <select 
            name="is_open"
            defaultValue={initialData?.is_open ? 'true' : 'false'}
            className="bg-black border border-white/20 text-white rounded-lg px-4 py-2 focus:border-red-500 outline-none transition-colors"
          >
            <option value="true">Sí, Abierta</option>
            <option value="false">No, Cerrada</option>
          </select>
        </div>
      </div>

      {/* Horarios */}
      <div className="space-y-4 pt-4 border-t border-white/5">
        <h3 className="text-lg font-bold text-white flex items-center gap-2">
          <Clock className="w-5 h-5 text-blue-400" />
          Horario de Atención
        </h3>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-xs text-neutral-400 font-bold uppercase tracking-wider">Apertura</label>
            <input 
              type="time" 
              name="open_time" 
              defaultValue={initialData?.open_time?.substring(0,5) || '17:30'} 
              className="w-full bg-black border border-white/20 text-white rounded-xl px-4 py-3 focus:border-red-500 outline-none"
            />
          </div>
          <div className="space-y-2">
            <label className="text-xs text-neutral-400 font-bold uppercase tracking-wider">Cierre</label>
            <input 
              type="time" 
              name="close_time" 
              defaultValue={initialData?.close_time?.substring(0,5) || '22:00'} 
              className="w-full bg-black border border-white/20 text-white rounded-xl px-4 py-3 focus:border-red-500 outline-none"
            />
          </div>
        </div>
      </div>

      {/* Delivery */}
      <div className="space-y-4 pt-4 border-t border-white/5">
        <h3 className="text-lg font-bold text-white flex items-center gap-2">
          <Truck className="w-5 h-5 text-purple-400" />
          Delivery
        </h3>
        <div className="flex items-center gap-4 bg-white/5 p-4 rounded-xl">
          <div className="flex-1">
            <p className="text-sm font-medium text-white">¿Delivery Habilitado?</p>
            <p className="text-xs text-neutral-400">Permite envíos a domicilio.</p>
          </div>
          <select 
            name="delivery_enabled"
            defaultValue={initialData?.delivery_enabled ? 'true' : 'false'}
            className="bg-black border border-white/20 text-white rounded-lg px-4 py-2 focus:border-red-500 outline-none"
          >
            <option value="true">Sí</option>
            <option value="false">No</option>
          </select>
        </div>
      </div>

      <div className="pt-6">
        <button 
          type="submit" 
          disabled={loading}
          className="w-full py-4 bg-[#e53e3e] hover:bg-red-600 disabled:opacity-50 text-white font-bold rounded-xl flex items-center justify-center gap-2 transition-all shadow-lg shadow-red-900/20"
        >
          <Save className="w-5 h-5" />
          {loading ? 'Guardando...' : 'Guardar Configuración'}
        </button>
      </div>
    </form>
  )
}
