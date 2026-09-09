import { getStoreSettings } from './actions'
import { SettingsForm } from './settings-form'
import { Settings } from 'lucide-react'

export const metadata = {
  title: 'Configuración | Admin',
}

export default async function SettingsPage() {
  const settings = await getStoreSettings()

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 border-b border-white/10 pb-5">
        <div className="bg-blue-500/10 p-2 rounded-xl">
          <Settings className="w-6 h-6 text-blue-500" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Configuración de Tienda</h1>
          <p className="text-sm text-neutral-400 mt-1">Controla los horarios, delivery y estado general.</p>
        </div>
      </div>
      
      <div className="max-w-2xl">
        <SettingsForm initialData={settings} />
      </div>
    </div>
  )
}
