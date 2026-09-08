import { createClient } from '@/lib/supabase/server';
import OrdersClient from './orders-client';

export const metadata = {
  title: 'Órdenes | MakiBros Admin',
};

export const revalidate = 0;

export default async function AdminOrdersPage() {
  const supabase = (await createClient()) as any;
  
  const { data: orders, error } = await supabase
    .from('orders')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching orders:', error);
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight text-white">Gestión de Órdenes</h1>
        <p className="text-sm text-neutral-400 mt-1">
          Visualiza los pagos realizados y administra los pedidos.
        </p>
      </div>

      <OrdersClient initialOrders={orders || []} />
    </div>
  );
}
