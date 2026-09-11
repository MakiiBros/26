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
    const itemIds = orderData.items.map((item: any) => item.dish.id);
    const { data: dbDishes, error: dishesError } = await supabase
      .from('dishes')
      .select('id, name, price, discount_percentage')
      .in('id', itemIds);

    if (dishesError || !dbDishes) {
      return NextResponse.json({ error: 'Error al consultar productos' }, { status: 500 });
    }

    let realTotalPrice = 0;
    const validatedItems = orderData.items.map((clientItem: any) => {
      const dbDish = dbDishes.find(d => d.id === clientItem.dish.id);
      if (!dbDish) {
        throw new Error(`Plato no encontrado: ${clientItem.dish.id}`);
      }
      const discount = dbDish.discount_percentage || 0;
      const unitPrice = dbDish.price * (1 - discount / 100);
      realTotalPrice += unitPrice * clientItem.quantity;
      
      return {
        ...clientItem,
        name: dbDish.name,
        price: dbDish.price,
        discount_percentage: discount,
        unitPrice
      };
    });

    const deliveryFee = orderData.deliveryType === 'delivery' ? 5.0 : 0.0;
    realTotalPrice = Number((realTotalPrice + deliveryFee).toFixed(2));

    // 2. Crear la orden pendiente
    const { data: dbOrder, error: dbError } = await supabase
      .from('orders')
      .insert({
        customer_name: orderData.customerName,
        customer_phone: orderData.customerPhone,
        customer_address: orderData.deliveryType === 'delivery' ? orderData.customerAddress : 'Recojo en tienda',
        items: validatedItems,
        total_price: realTotalPrice,
        payment_method: orderData.paymentMethod || 'yape_qr',
        payment_status: 'pending',
      })
      .select('id')
      .single();

    if (dbError) {
      console.error('DB Error:', dbError);
      return NextResponse.json({ error: 'Error al crear orden en BD', details: dbError }, { status: 500 });
    }

    // 3. Generar el mensaje de WhatsApp (usando el backend asegura precios exactos)
    const { data: settings } = await supabase.from('store_settings').select('whatsapp').single();
    const adminPhone = settings?.whatsapp || '51970725307';
    
    let text = `*NUEVO PEDIDO MAKI BROS* 🍣\n\n`;
    text += `*Cliente:* ${orderData.customerName}\n`;
    text += `*Teléfono:* ${orderData.customerPhone}\n`;
    text += `*Tipo:* ${orderData.deliveryType === 'delivery' ? 'Delivery 🛵' : 'Recojo en Tienda 🏪'}\n`;
    if (orderData.deliveryType === 'delivery') text += `*Dirección:* ${orderData.customerAddress}\n`;
    text += `*Método de Pago:* ${orderData.paymentMethod === 'yape' ? 'Yape (QR)' : 'Efectivo'}\n\n`;
    
    text += `*Detalle:* \n`;
    validatedItems.forEach((item: any) => {
      text += `- ${item.quantity}x ${item.name} (S/ ${item.unitPrice.toFixed(2)})\n`;
    });
    
    if (orderData.deliveryType === 'delivery') {
      text += `\nDelivery: S/ 5.00\n`;
    }
    
    if (orderData.orderNotes) {
      text += `\n*Notas:* ${orderData.orderNotes}\n`;
    }
    
    text += `\n*TOTAL A PAGAR: S/ ${realTotalPrice.toFixed(2)}*`;

    if (orderData.paymentMethod === 'yape') {
        text += `\n\n_Te adjunto la captura del pago por Yape!_`;
    }

    const whatsappUrl = `https://api.whatsapp.com/send?phone=${adminPhone}&text=${encodeURIComponent(text)}`;

    return NextResponse.json({ 
      success: true, 
      status: 'pending', 
      orderId: dbOrder.id,
      whatsappUrl 
    });

  } catch (error: any) {
    console.error('Proceso de pedido error:', error);
    return NextResponse.json({ success: false, error: error.message || 'Error al procesar el pedido' }, { status: 500 });
  }
}
