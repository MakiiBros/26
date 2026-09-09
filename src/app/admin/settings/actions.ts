'use server'

import { createClient } from '@/lib/supabase/server'
import { CACHE_TAGS } from '@/lib/constants'

export async function getStoreSettings() {
  const supabase = (await createClient()) as any
  const { data, error } = await supabase
    .from('store_settings')
    .select('*')
    .limit(1)
    .maybeSingle()

  if (error) {
    console.error('Error fetching settings:', error)
    return null
  }
  return data
}

export async function updateStoreSettings(formData: FormData) {
  const supabase = (await createClient()) as any
  
  const id = formData.get('id') as string
  const is_open = formData.get('is_open') === 'true'
  const open_time = formData.get('open_time') as string
  const close_time = formData.get('close_time') as string
  const delivery_enabled = formData.get('delivery_enabled') === 'true'

  const updates = {
    is_open,
    open_time,
    close_time,
    delivery_enabled,
  }

  let error;

  if (id) {
    const { error: updateError } = await supabase
      .from('store_settings')
      .update(updates as any)
      .eq('id', id)
    error = updateError
  } else {
    // Si no hay id, insertar primera fila
    const { error: insertError } = await supabase
      .from('store_settings')
      .insert([updates as any])
    error = insertError
  }

  if (error) {
    console.error('Error updating settings:', error)
    return { error: 'Error al actualizar configuración' }
  }

  // Use revalidatePath instead
  const { revalidatePath } = require('next/cache')
  revalidatePath('/', 'layout')
  
  return { success: true }
}
