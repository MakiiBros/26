import { NextResponse } from 'next/server';
import { MercadoPagoConfig, Payment } from 'mercadopago';
import { createClient } from '@/lib/supabase/server';

const client = new MercadoPagoConfig({
  accessToken: process.env.MERCADOPAGO_ACCESS_TOKEN || 'TEST-0000000000000000-000000-00000000000000000000000000000000-000000000',
});

export async function POST(request: Request) {
  try {
    const url = new URL(request.url);
    const type = url.searchParams.get('type') || url.searchParams.get('topic');
    const id = url.searchParams.get('data.id') || url.searchParams.get('id');

    if (type === 'payment' && id) {
      const payment = new Payment(client);
      const paymentInfo = await payment.get({ id });

      if (paymentInfo.status === 'approved' && paymentInfo.external_reference) {
        // El pago fue aprobado
        const orderId = paymentInfo.external_reference;
        const supabase = await createClient();

        // Si quisieras ser súper seguro, usarías la service role key aquí, 
        // pero la DB tiene políticas permisivas para modificar/ver órdenes o puedes usar RLS.
        // Asumiendo que el cliente por defecto tiene acceso:
        const { error } = await supabase
          .from('orders')
          .update({ payment_status: 'paid' })
          .eq('id', orderId);

        if (error) {
          console.error('Error al actualizar estado de la orden:', error);
          return NextResponse.json({ error: 'DB update error' }, { status: 500 });
        }
        console.log(`Orden ${orderId} marcada como pagada (Yape/MP) exitosamente.`);
      }
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error en webhook de MercadoPago:', error);
    return NextResponse.json({ error: 'Webhook handler failed' }, { status: 500 });
  }
}
