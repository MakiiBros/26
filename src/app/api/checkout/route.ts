import { NextResponse } from 'next/server';
import { MercadoPagoConfig, Preference } from 'mercadopago';
import { createClient } from '@/lib/supabase/server';

// Inicializar MercadoPago (asegúrate de que en producción MERCADOPAGO_ACCESS_TOKEN esté definido)
const client = new MercadoPagoConfig({
  accessToken: process.env.MERCADOPAGO_ACCESS_TOKEN || 'TEST-0000000000000000-000000-00000000000000000000000000000000-000000000',
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { items, customerName, customerPhone, customerAddress, deliveryType, totalPrice, paymentMethod } = body;

    const supabase = await createClient();

    // 1. Guardar la orden en Supabase como "pending"
    const { data: orderData, error: dbError } = await supabase
      .from('orders')
      .insert({
        customer_name: customerName,
        customer_phone: customerPhone,
        customer_address: deliveryType === 'delivery' ? customerAddress : 'Recojo en tienda',
        items: items,
        total_price: totalPrice,
        payment_method: paymentMethod,
        payment_status: 'pending',
      })
      .select('id')
      .single();

    if (dbError) {
      console.error('Error insertando orden en Supabase:', dbError);
      return NextResponse.json({ error: 'Error al crear la orden.' }, { status: 500 });
    }

    const orderId = orderData.id;

    // Si el pago es en efectivo o no es a través de Mercado Pago, podríamos retornar directo
    if (paymentMethod !== 'yape' && paymentMethod !== 'card' && paymentMethod !== 'plin') {
      return NextResponse.json({ success: true, orderId });
    }

    // 2. Crear Preferencia de MercadoPago
    const preference = new Preference(client);
    
    // Configurar URL de retorno (dinámica según entorno)
    const host = request.headers.get('host') || 'localhost:3000';
    const protocol = host.includes('localhost') ? 'http' : 'https';
    const baseUrl = `${protocol}://${host}`;

    const preferenceResult = await preference.create({
      body: {
        items: [
          {
            id: 'pedido-makibros',
            title: `Pedido de ${customerName}`,
            quantity: 1,
            unit_price: totalPrice,
            currency_id: 'PEN',
          },
        ],
        external_reference: orderId, // Para identificar la orden en el webhook
        back_urls: {
          success: `${baseUrl}/checkout/success`,
          failure: `${baseUrl}/checkout`,
          pending: `${baseUrl}/checkout/success`,
        },
        auto_return: 'approved',
        notification_url: `${baseUrl}/api/webhooks/mercadopago`,
      },
    });

    // 3. Actualizar la orden con el preference_id
    if (preferenceResult.id) {
      await supabase
        .from('orders')
        .update({ preference_id: preferenceResult.id })
        .eq('id', orderId);
    }

    return NextResponse.json({
      success: true,
      orderId,
      init_point: preferenceResult.init_point, // URL de checkout de MP
    });
  } catch (error) {
    console.error('Error al procesar el checkout:', error);
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
}
