import { createClient } from '@/lib/supabase/server';
import { formatPrice } from '@/lib/utils';
import { CheckCircle2, Clock, XCircle, Search } from 'lucide-react';

export const metadata = {
  title: 'Órdenes | MakiBros Admin',
};

// Polling o real-time sería ideal, pero SSR para empezar
export const revalidate = 0; 

export default async function AdminOrdersPage() {
  const supabase = await createClient() as any;
  
  const { data: orders, error } = await supabase
    .from('orders')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching orders:', error);
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'paid':
        return (
          <span className="flex items-center gap-1 text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-md text-xs font-bold border border-emerald-500/20">
            <CheckCircle2 className="w-3.5 h-3.5" />
            Pagado (Verificado)
          </span>
        );
      case 'failed':
        return (
          <span className="flex items-center gap-1 text-red-400 bg-red-500/10 px-2.5 py-1 rounded-md text-xs font-bold border border-red-500/20">
            <XCircle className="w-3.5 h-3.5" />
            Fallido
          </span>
        );
      case 'pending':
      default:
        return (
          <span className="flex items-center gap-1 text-amber-400 bg-amber-500/10 px-2.5 py-1 rounded-md text-xs font-bold border border-amber-500/20">
            <Clock className="w-3.5 h-3.5" />
            Pendiente
          </span>
        );
    }
  };

  const getMethodLabel = (method: string) => {
    const labels: Record<string, string> = {
      yape: 'Yape',
      plin: 'Plin',
      card: 'Tarjeta',
      cash: 'Efectivo'
    };
    return labels[method] || method;
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight text-white">Gestión de Órdenes</h1>
        <p className="text-sm text-gray-400 mt-1">
          Visualiza los pagos realizados y los pedidos pendientes.
        </p>
      </div>

      <div className="bg-[#141414] border border-[#2a2a2a] rounded-xl overflow-hidden shadow-xl">
        <div className="p-4 border-b border-[#2a2a2a] flex items-center justify-between">
          <div className="relative w-64">
            <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input 
              type="text" 
              placeholder="Buscar cliente o teléfono..." 
              className="w-full bg-[#1a1a1a] border border-[#333] rounded-lg pl-9 pr-4 py-2 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-[#e53e3e]"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-gray-300">
            <thead className="bg-[#1a1a1a] text-xs uppercase text-gray-500 border-b border-[#2a2a2a]">
              <tr>
                <th className="px-6 py-4 font-medium">Fecha</th>
                <th className="px-6 py-4 font-medium">Cliente</th>
                <th className="px-6 py-4 font-medium">Teléfono</th>
                <th className="px-6 py-4 font-medium">Método</th>
                <th className="px-6 py-4 font-medium">Total</th>
                <th className="px-6 py-4 font-medium">Estado</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#2a2a2a]">
              {!orders?.length ? (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center text-gray-500">
                    No hay órdenes registradas aún.
                  </td>
                </tr>
              ) : (
                orders.map((order: any) => (
                  <tr key={order.id} className="hover:bg-[#1a1a1a]/50 transition-colors">
                    <td className="px-6 py-4 font-mono text-xs">
                      {new Date(order.created_at).toLocaleString('es-PE', {
                        day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit'
                      })}
                    </td>
                    <td className="px-6 py-4 font-medium text-white">{order.customer_name}</td>
                    <td className="px-6 py-4 font-mono text-xs">{order.customer_phone}</td>
                    <td className="px-6 py-4">
                      <span className="bg-white/5 border border-white/10 px-2 py-1 rounded text-xs">
                        {getMethodLabel(order.payment_method)}
                      </span>
                    </td>
                    <td className="px-6 py-4 font-bold text-white">
                      {formatPrice(order.total_price)}
                    </td>
                    <td className="px-6 py-4">
                      {getStatusBadge(order.payment_status)}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
