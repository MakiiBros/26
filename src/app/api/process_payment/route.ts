import { NextResponse } from 'next/server';
import { createClient as createSupabaseClient } from '@supabase/supabase-js';
import { SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, SUPABASE_ANON_KEY } from '@/lib/constants';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { orderData } = body;

    // Usar Service Role Key para saltarse RLS en el backend y poder guardar la orden
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
        payment_method: orderData.paymentMethod || 'unknown',
        payment_status: 'pending',
      })
      .select('id')
      .single();

    if (dbError) {
      console.error('DB Error:', dbError);
      return NextResponse.json({ error: 'Error al crear orden en BD', details: dbError }, { status: 500 });
    }

    // Retornamos éxito de inmediato, ya que el flujo continúa por WhatsApp
    return NextResponse.json({ success: true, status: 'pending', orderId: dbOrder.id });

  } catch (error: any) {
    console.error('Error al procesar orden:', error);
    return NextResponse.json({ 
      success: false,
      error: error.message || String(error), 
      details: error.message || String(error) 
    }, { status: 500 });
  }
}
