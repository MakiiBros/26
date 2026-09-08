import { NextResponse } from 'next/server';
import { MercadoPagoConfig, Payment } from 'mercadopago';
import { createClient } from '@/lib/supabase/server';

const client = new MercadoPagoConfig({
  accessToken: process.env.MERCADOPAGO_ACCESS_TOKEN || 'TEST-0000',
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { orderData, paymentData } = body;

    const supabase = (await createClient()) as any;

    // 1. Crear la orden pendiente
    const { data: dbOrder, error: dbError } = await supabase
      .from('orders')
      .insert({
        customer_name: orderData.customerName,
        customer_phone: orderData.customerPhone,
        customer_address: orderData.deliveryType === 'delivery' ? orderData.customerAddress : 'Recojo en tienda',
        items: orderData.items,
        total_price: orderData.totalPrice,
        payment_method: paymentData?.payment_method_id || orderData.paymentMethod || 'unknown',
        payment_status: 'pending',
      })
      .select('id')
      .single();

    if (dbError) {
      console.error('DB Error:', dbError);
      return NextResponse.json({ error: 'Error al crear orden en BD', details: dbError }, { status: 500 });
    }

    const orderId = dbOrder.id;

    // Si es pago en efectivo (flujo manual) omitimos MP
    if (orderData.paymentMethod === 'cash') {
      return NextResponse.json({ success: true, status: 'pending', orderId });
    }

    // 2. Procesar pago en Mercado Pago
    const payment = new Payment(client);
    const paymentResult = await payment.create({
      body: {
        ...paymentData,
        transaction_amount: Number(orderData.totalPrice),
        external_reference: orderId,
        description: `Pedido de ${orderData.customerName} - MakiBros`,
      },
    });

    // 3. Actualizar estado si es inmediato (Yape suele ser approved al instante)
    if (paymentResult.status === 'approved') {
      await supabase.from('orders').update({ payment_status: 'paid' }).eq('id', orderId);
    } else if (paymentResult.status === 'rejected') {
      await supabase.from('orders').update({ payment_status: 'failed' }).eq('id', orderId);
    }

    return NextResponse.json({
      success: true,
      status: paymentResult.status,
      status_detail: paymentResult.status_detail,
      orderId,
    });
  } catch (error: any) {
    console.error('Error al procesar pago:', error);
    return NextResponse.json({ 
      error: 'Error interno procesando el pago', 
      details: error?.message || String(error) 
    }, { status: 500 });
  }
}
