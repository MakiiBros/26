import { NextResponse } from 'next/server';
import { MercadoPagoConfig, Payment } from 'mercadopago';
import { createClient as createSupabaseClient } from '@supabase/supabase-js';
import { SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, SUPABASE_ANON_KEY } from '@/lib/constants';

const client = new MercadoPagoConfig({
  accessToken: process.env.MERCADOPAGO_ACCESS_TOKEN || 'TEST-0000',
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { orderData, paymentData } = body;

    // Usar Service Role Key para saltarse RLS en el backend y poder actualizar la orden
    // Si no hay service role, cae al anon key pero requerirá políticas públicas (no recomendado)
    const supabaseKey = SUPABASE_SERVICE_ROLE_KEY || SUPABASE_ANON_KEY;
    const supabase = createSupabaseClient(SUPABASE_URL, supabaseKey);

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

    const host = request.headers.get('host') || 'localhost:3000';
    const protocol = host.includes('localhost') ? 'http' : 'https';
    const baseUrl = `${protocol}://${host}`;
    const notificationUrl = host.includes('localhost') ? 'https://makibros-test.vercel.app/api/webhooks/mercadopago' : `${baseUrl}/api/webhooks/mercadopago`;

    // 2. Procesar pago en Mercado Pago (Checkout API)
    const payment = new Payment(client);

    // Asegurar payer.email obligatorio para la API de Mercado Pago
    const cleanPhone = (orderData.customerPhone || '').replace(/\D/g, '');
    const payerEmail = paymentData?.payer?.email || orderData.customerEmail || `${cleanPhone || 'cliente'}@makibros.pe`;

    const paymentResult = await payment.create({
      body: {
        ...paymentData,
        payer: {
          ...paymentData?.payer,
          email: payerEmail,
        },
        transaction_amount: Number(orderData.totalPrice),
        external_reference: orderId,
        description: `Pedido de ${orderData.customerName} - MakiBros`,
        notification_url: notificationUrl,
      },
    });

    // Guardar referencia de pago de Mercado Pago en la orden
    if (paymentResult.id) {
      await supabase.from('orders').update({ preference_id: String(paymentResult.id) }).eq('id', orderId);
    }

    // 3. Actualizar estado si es inmediato (Yape / Tarjetas autorizadas)
    if (paymentResult.status === 'approved') {
      await supabase.from('orders').update({ payment_status: 'paid' }).eq('id', orderId);
    } else if (paymentResult.status === 'rejected') {
      await supabase.from('orders').update({ payment_status: 'failed' }).eq('id', orderId);
    }

    const statusMessages: Record<string, string> = {
      cc_rejected_bad_filled_security_code: 'Código de seguridad o de aprobación incorrecto.',
      cc_rejected_bad_filled_date: 'Fecha de caducidad incorrecta.',
      cc_rejected_bad_filled_other: 'Por favor, revisa los datos ingresados.',
      cc_rejected_insufficient_amount: 'Saldo o fondos insuficientes en la cuenta o tarjeta.',
      cc_rejected_call_for_authorize: 'Debes autorizar el pago llamando a tu banco.',
      cc_rejected_card_disabled: 'La tarjeta está inactiva o bloqueada.',
      cc_rejected_other_reason: 'El pago no pudo ser procesado. Verifica tus datos o intenta con otro método.',
    };

    return NextResponse.json({
      success: paymentResult.status === 'approved',
      status: paymentResult.status,
      status_detail: paymentResult.status_detail,
      message: paymentResult.status_detail ? (statusMessages[paymentResult.status_detail] || 'El pago no pudo ser procesado.') : undefined,
      paymentId: paymentResult.id,
      orderId,
    });
  } catch (error: any) {
    console.error('Error al procesar pago en Mercado Pago:', error);
    
    // Verifica si la llave es de prueba
    if (process.env.MERCADOPAGO_ACCESS_TOKEN === undefined) {
      return NextResponse.json({ 
        success: false,
        error: 'El token de acceso de Mercado Pago no está configurado (.env).', 
      }, { status: 500 });
    }

    // Extraer mensaje detallado de la SDK de MP
    const mpError = error.cause || error.message;

    return NextResponse.json({ 
      success: false,
      error: mpError || String(error), 
      details: mpError || String(error) 
    }, { status: 500 });
  }
}
