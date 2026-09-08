'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function deleteOrder(id: string) {
  const supabase = (await createClient()) as any
  const { error } = await supabase.from('orders').delete().eq('id', id)
  if (error) throw new Error(error.message)
  revalidatePath('/admin/orders')
}

export async function clearOldPendingOrders() {
  const supabase = (await createClient()) as any
  // 30 mins ago
  const limitDate = new Date(Date.now() - 30 * 60 * 1000).toISOString()
  
  const { error } = await supabase
    .from('orders')
    .delete()
    .eq('payment_status', 'pending')
    .lt('created_at', limitDate)
    
  if (error) throw new Error(error.message)
  revalidatePath('/admin/orders')
}
