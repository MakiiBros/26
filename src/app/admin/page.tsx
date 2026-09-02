import Link from 'next/link';
import { Button } from '@/components/ui/button';



export const metadata = {
  title: 'Dashboard | Makisbros Admin',
};

export default function AdminDashboardPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-gray-100">
          Dashboard
        </h1>
      </div>
      
      <div className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
        <h2 className="text-xl font-semibold mb-2">Bienvenido al panel de administración de Makisbros.</h2>
        <p className="text-gray-600 dark:text-gray-400 mb-6">
          Desde aquí puedes gestionar el catálogo de platos, categorías y la configuración de tu plataforma.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          {/* Tarjetas de estadísticas de ejemplo */}
          <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg border border-gray-100 dark:border-gray-600">
            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Platos</h3>
            <p className="text-2xl font-bold mt-1">--</p>
          </div>
          <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg border border-gray-100 dark:border-gray-600">
            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Categorías</h3>
            <p className="text-2xl font-bold mt-1">--</p>
          </div>
          <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg border border-gray-100 dark:border-gray-600">
            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Pedidos Hoy</h3>
            <p className="text-2xl font-bold mt-1">--</p>
          </div>
        </div>

        <Link href="/admin/dishes">
          <Button>
            Gestionar Platos
          </Button>
        </Link>
      </div>
    </div>
  );
}
