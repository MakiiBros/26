'use server'

import { revalidatePath } from 'next/cache'
import { verifyAdmin } from '@/lib/supabase/server'

export async function deleteOrder(id: string) {
  const { supabase } = await verifyAdmin()
  
  const { error } = await supabase.from('orders').delete().eq('id', id)
  
  if (error) throw new Error(error.message)
  revalidatePath('/admin/orders')
}

export async function clearOldPendingOrders() {
  const { supabase } = await verifyAdmin()
  
  // 20 mins ago (ajustado según requerimiento)
  const limitDate = new Date(Date.now() - 20 * 60 * 1000).toISOString()
  
  const { error, count } = await supabase
    .from('orders')
    .delete()
    .eq('payment_status', 'pending')
    .lt('created_at', limitDate)
    
  if (error) throw new Error(error.message)
  revalidatePath('/admin/orders')
  return count;
}
