import { NextResponse } from 'next/server';
import { MercadoPagoConfig, Preference } from 'mercadopago';
import { createClient } from '@/lib/supabase/server';

const client = new MercadoPagoConfig({
  accessToken: process.env.MERCADOPAGO_ACCESS_TOKEN || 'TEST-0000',
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { items, customerName, customerPhone, customerAddress, deliveryType, totalPrice } = body;

    const supabase = (await createClient()) as any;

    // 1. Guardar orden pendiente en DB
    const { data: dbOrder, error: dbError } = await supabase
      .from('orders')
      .insert({
        customer_name: customerName,
        customer_phone: customerPhone,
        customer_address: deliveryType === 'delivery' ? customerAddress : 'Recojo en tienda',
        items: items,
        total_price: totalPrice,
        payment_method: 'online',
        payment_status: 'pending',
      })
      .select('id')
      .single();

    if (dbError) throw dbError;
    const orderId = dbOrder.id;

    const host = request.headers.get('host') || 'localhost:3000';
    const protocol = host.includes('localhost') ? 'http' : 'https';
    const baseUrl = `${protocol}://${host}`;

    // 2. Crear Preferencia en Mercado Pago
    const preference = new Preference(client);
    const prefResult = await preference.create({
      body: {
        items: [
          {
            id: 'makibros-pedido',
            title: `Pedido de ${customerName}`,
            quantity: 1,
            unit_price: Number(totalPrice),
            currency_id: 'PEN',
          }
        ],
        external_reference: orderId,
        back_urls: {
          success: `${baseUrl}/checkout/success`,
          failure: `${baseUrl}/checkout`,
          pending: `${baseUrl}/checkout/success`,
        },
        auto_return: 'approved',
        notification_url: `${baseUrl}/api/webhooks/mercadopago`,
      }
    });

    // 3. Actualizar la orden con el preference_id
    if (prefResult.id) {
      await supabase.from('orders').update({ preference_id: prefResult.id }).eq('id', orderId);
    }

    return NextResponse.json({ success: true, preferenceId: prefResult.id, orderId });
  } catch (error: any) {
    console.error(error);
    return NextResponse.json({ error: 'Error interno' }, { status: 500 });
  }
}
