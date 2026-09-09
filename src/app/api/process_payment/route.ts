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
    const supabaseKey = SUPABASE_SERVICE_ROLE_KEY || SUPABASE_ANON_KEY;
    const supabase = createSupabaseClient(SUPABASE_URL, supabaseKey);

    // 1. Validar precios reales desde la Base de Datos
    const itemIds = orderData.items.map((item: any) => item.id);
    const { data: dbDishes, error: dishesError } = await supabase
      .from('dishes')
      .select('id, price, discount_percentage')
      .in('id', itemIds);

    if (dishesError || !dbDishes) {
      return NextResponse.json({ error: 'Error al consultar productos' }, { status: 500 });
    }

    let realTotalPrice = 0;
    const validatedItems = orderData.items.map((clientItem: any) => {
      const dbDish = dbDishes.find(d => d.id === clientItem.id);
      if (!dbDish) {
        throw new Error(`Plato no encontrado: ${clientItem.id}`);
      }
      const discount = dbDish.discount_percentage || 0;
      const unitPrice = dbDish.price * (1 - discount / 100);
      realTotalPrice += unitPrice * clientItem.quantity;
      
      return {
        ...clientItem,
        price: dbDish.price,
        discount_percentage: discount
      };
    });

    const deliveryFee = orderData.deliveryType === 'delivery' ? 5.0 : 0.0;
    realTotalPrice = Number((realTotalPrice + deliveryFee).toFixed(2));

    if (Math.abs(realTotalPrice - orderData.totalPrice) > 0.1) {
      console.warn(`[Seguridad] Discrepancia de precios. Cliente: ${orderData.totalPrice}, Servidor: ${realTotalPrice}`);
    }

    // 2. Crear la orden pendiente
    const { data: dbOrder, error: dbError } = await supabase
      .from('orders')
      .insert({
        customer_name: orderData.customerName,
        customer_phone: orderData.customerPhone,
        customer_address: orderData.deliveryType === 'delivery' ? orderData.customerAddress : 'Recojo en tienda',
        items: validatedItems,
        total_price: realTotalPrice,
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

    // Si es Yape, debemos tokenizar el OTP antes de procesar el pago
    let finalToken = paymentData?.token;
    if (paymentData?.payment_method_id === 'yape') {
      const publicKey = process.env.NEXT_PUBLIC_MERCADOPAGO_PUBLIC_KEY || 'APP_USR-26ff591d-42da-41ae-b199-b0bc0d63536c';
      if (!publicKey) {
        return NextResponse.json({ success: false, error: 'Falta configurar NEXT_PUBLIC_MERCADOPAGO_PUBLIC_KEY' }, { status: 500 });
      }
      
      const yapeTokenRes = await fetch(`https://api.mercadopago.com/platforms/pci/yape/v1/payment?public_key=${publicKey}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          otp: finalToken, // el frontend envía el código OTP aquí
          phoneNumber: cleanPhone,
          email: payerEmail,
          totalAmount: realTotalPrice
        })
      });
      
      const yapeTokenData = await yapeTokenRes.json();
      if (!yapeTokenRes.ok || !yapeTokenData.id) {
        throw new Error(yapeTokenData.message || yapeTokenData.error || 'Error al validar el código de Yape (OTP).');
      }
      finalToken = yapeTokenData.id;
    }

    const paymentResult = await payment.create({
      body: {
        ...paymentData,
        installments: paymentData?.installments || 1,
        token: finalToken,
        payer: {
          ...paymentData?.payer,
          email: payerEmail,
        },
        transaction_amount: realTotalPrice,
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
