import { NextResponse } from 'next/server';
import { MercadoPagoConfig, Preference } from 'mercadopago';
import { createClient as createSupabaseClient } from '@supabase/supabase-js';
import { SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, SUPABASE_ANON_KEY } from '@/lib/constants';

const client = new MercadoPagoConfig({
  accessToken: process.env.MERCADOPAGO_ACCESS_TOKEN || 'TEST-0000',
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { items, customerName, customerPhone, customerAddress, deliveryType, totalPrice } = body;

    const supabaseKey = SUPABASE_SERVICE_ROLE_KEY || SUPABASE_ANON_KEY;
    const supabase = createSupabaseClient(SUPABASE_URL, supabaseKey);

    // 1. Validar precios reales desde la Base de Datos
    const itemIds = items.map((item: any) => item.id);
    const { data: dbDishes, error: dishesError } = await supabase
      .from('dishes')
      .select('id, price, discount_percentage')
      .in('id', itemIds);

    if (dishesError || !dbDishes) {
      return NextResponse.json({ error: 'Error al consultar productos' }, { status: 500 });
    }

    let realTotalPrice = 0;
    const validatedItems = items.map((clientItem: any) => {
      const dbDish = dbDishes.find((d: any) => d.id === clientItem.id);
      if (!dbDish) throw new Error(`Plato no encontrado: ${clientItem.id}`);
      
      const discount = dbDish.discount_percentage || 0;
      const unitPrice = dbDish.price * (1 - discount / 100);
      realTotalPrice += unitPrice * clientItem.quantity;
      
      return {
        ...clientItem,
        price: dbDish.price,
        discount_percentage: discount
      };
    });

    const deliveryFee = deliveryType === 'delivery' ? 5.0 : 0.0;
    realTotalPrice = Number((realTotalPrice + deliveryFee).toFixed(2));

    // 2. Guardar orden pendiente en DB (con Service Role Key saltamos RLS público)
    const { data: dbOrder, error: dbError } = await supabase
      .from('orders')
      .insert({
        customer_name: customerName,
        customer_phone: customerPhone,
        customer_address: deliveryType === 'delivery' ? customerAddress : 'Recojo en tienda',
        items: validatedItems,
        total_price: realTotalPrice,
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

    // 3. Crear Preferencia en Mercado Pago
    const preference = new Preference(client);
    const prefResult = await preference.create({
      body: {
        items: [
          {
            id: 'makibros-pedido',
            title: `Pedido de ${customerName}`,
            quantity: 1,
            unit_price: realTotalPrice,
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
