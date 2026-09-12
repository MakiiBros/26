import { SUPABASE_SERVICE_ROLE_KEY } from '@/lib/server/secrets'
'use server'

import { createClient as createSupabaseClient } from '@supabase/supabase-js'
import { revalidatePath } from 'next/cache'
import { SUPABASE_URL, SUPABASE_ANON_KEY } from '@/lib/constants'

// Usamos el cliente directamente con Service Role para saltar políticas RLS (Row Level Security)
// Ya que el panel de administración no está usando un sistema de usuarios de Supabase Auth
function getAdminSupabase() {
  const supabaseKey = SUPABASE_SERVICE_ROLE_KEY || SUPABASE_ANON_KEY
  return createSupabaseClient(SUPABASE_URL, supabaseKey)
}

export async function deleteOrder(id: string) {
  const supabase = getAdminSupabase()
  
  const { error } = await supabase.from('orders').delete().eq('id', id)
  
  if (error) throw new Error(error.message)
  revalidatePath('/admin/orders')
}

export async function clearOldPendingOrders() {
  const supabase = getAdminSupabase()
  
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
