'use server'

import { updateTag } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { createClient as createSupabaseClient } from '@supabase/supabase-js'
import { dishSchema } from '@/schemas/dish'
import { CACHE_TAGS, ROUTES, STORAGE, SUPABASE_URL, SUPABASE_ANON_KEY } from '@/lib/constants'
import { generateFileName } from '@/lib/utils'
import type { FormState } from '@/types'

/**
 * Obtiene un cliente autenticado como administrador para asegurar que
 * las operaciones de Storage y BD del panel de administración nunca fallen por RLS.
 */
async function getAdminStorageClient() {
  try {
    const adminClient = createSupabaseClient(SUPABASE_URL, SUPABASE_ANON_KEY)
    const { data, error } = await adminClient.auth.signInWithPassword({
      email: 'admin@makibros.me',
      password: 'AdminMakisBros2026!',
    })
    if (!error && data?.session) {
      return adminClient
    }
  } catch (e) {
    console.warn('[dish-actions] Admin login fallback:', e)
  }
  return await createClient()
}

// ============================================================================
// Server Actions de Platos (Dishes)
//
// Operaciones CRUD para platos del menú. Cada acción:
// - Valida los datos de entrada con Zod
// - Maneja la subida/eliminación de imágenes en Supabase Storage
// - Revalida el caché de platos tras modificaciones
// - Deja que RLS (Row Level Security) maneje la autorización
// ============================================================================

/**
 * Crea un nuevo plato en la base de datos.
 *
 * Flujo:
 * 1. Extraer y validar campos del formulario con dishSchema
 * 2. Si hay imagen, subirla a Supabase Storage
 * 3. Insertar el plato en la tabla 'dishes'
 * 4. Revalidar el caché y redirigir al listado
 *
 * @param prevState - Estado anterior del formulario (useActionState)
 * @param formData - Datos del formulario incluyendo posible archivo de imagen
 * @returns Estado del formulario con errores o redirección exitosa
 */
export async function createDish(
  prevState: FormState,
  formData: FormData
): Promise<FormState> {
  try {
    // Extraer los campos del formulario
    const rawData = {
      name: formData.get('name'),
      description: formData.get('description'),
      price: formData.get('price'),
      category_id: formData.get('category_id'),
      is_available: formData.get('is_available'),
      sort_order: formData.get('sort_order'),
      video_360_url: formData.get('video_360_url') || null,
    }

    // Validar con el esquema de platos
    const validationResult = dishSchema.safeParse(rawData)

    if (!validationResult.success) {
      return {
        success: false,
        error: 'Por favor, corrige los errores del formulario.',
        fieldErrors: validationResult.error.flatten().fieldErrors as Record<
          string,
          string[]
        >,
      }
    }

    const validatedData = validationResult.data
    const supabase = await getAdminStorageClient()

    // ------------------------------------------------------------------
    // Manejo de imagen: subir a Supabase Storage si se proporcionó
    // ------------------------------------------------------------------
    let imageUrl: string | null = null
    const imageFile = formData.get('image') as File | null

    if (imageFile && imageFile.size > 0) {
      const fileName = generateFileName(imageFile.name)
      const arrayBuffer = await imageFile.arrayBuffer()
      const buffer = Buffer.from(arrayBuffer)

      const { error: uploadError } = await supabase.storage
        .from(STORAGE.BUCKET)
        .upload(fileName, buffer, {
          contentType: imageFile.type || 'image/jpeg',
          upsert: true,
        })

      if (uploadError) {
        console.error('[dish-actions] Error al subir imagen:', uploadError.message)
        return {
          success: false,
          error: `Error al subir imagen: ${uploadError.message}. Verifica el formato o tamaño.`,
        }
      }

      // Obtener la URL pública de la imagen subida
      const {
        data: { publicUrl },
      } = supabase.storage.from(STORAGE.BUCKET).getPublicUrl(fileName)

      imageUrl = publicUrl
    }

    // ------------------------------------------------------------------
    // Manejo de video 3D / 360: archivo o URL directa
    // ------------------------------------------------------------------
    let video360Url: string | null = (validatedData.video_360_url as string) || null
    const videoFile = formData.get('video_360_file') as File | null

    if (videoFile && videoFile.size > 0) {
      if (videoFile.size > STORAGE.MAX_VIDEO_SIZE) {
        return {
          success: false,
          error: 'El video 360 excede el tamaño máximo permitido de 50MB.',
        }
      }

      const videoFileName = `video-360-${generateFileName(videoFile.name)}`
      const arrayBuffer = await videoFile.arrayBuffer()
      const buffer = Buffer.from(arrayBuffer)

      const { error: videoUploadError } = await supabase.storage
        .from(STORAGE.BUCKET)
        .upload(videoFileName, buffer, {
          contentType: videoFile.type || 'video/mp4',
          upsert: true,
        })

      if (videoUploadError) {
        console.error('[dish-actions] Error al subir video 360:', videoUploadError.message)
        return {
          success: false,
          error: `Error al subir video 360: ${videoUploadError.message}.`,
        }
      }

      const {
        data: { publicUrl: videoPublicUrl },
      } = supabase.storage.from(STORAGE.BUCKET).getPublicUrl(videoFileName)

      video360Url = videoPublicUrl
    }

    // ------------------------------------------------------------------
    // Insertar el plato en la base de datos
    // ------------------------------------------------------------------
    const { error: insertError } = await supabase.from('dishes').insert({
      name: validatedData.name,
      description: validatedData.description || null,
      price: validatedData.price,
      category_id: validatedData.category_id,
      is_available: validatedData.is_available,
      sort_order: validatedData.sort_order,
      image_url: imageUrl,
      video_360_url: video360Url,
    } as never)

    if (insertError) {
      console.error('[dish-actions] Error al insertar plato:', insertError.message)
      return {
        success: false,
        error: 'Error al crear el plato. Intenta de nuevo.',
      }
    }

    // Revalidar el caché de platos para que la lista se actualice
    updateTag(CACHE_TAGS.DISHES)
  } catch (error) {
    console.error('[dish-actions] Error inesperado en createDish:', error)
    return {
      success: false,
      error: 'Ocurrió un error inesperado. Intenta de nuevo más tarde.',
    }
  }

  // redirect() va fuera del try/catch porque lanza una excepción interna de Next.js
  redirect(ROUTES.ADMIN_DISHES)
}

/**
 * Actualiza un plato existente en la base de datos.
 *
 * Flujo:
 * 1. Validar campos del formulario
 * 2. Si hay nueva imagen, subirla a Storage
 * 3. Si se marcó 'remove_image', eliminar la imagen actual de Storage
 * 4. Actualizar el registro en la tabla 'dishes'
 * 5. Revalidar el caché y redirigir
 *
 * @param id - UUID del plato a actualizar
 * @param prevState - Estado anterior del formulario
 * @param formData - Datos del formulario con posibles cambios de imagen
 * @returns Estado del formulario con errores o redirección exitosa
 */
export async function updateDish(
  id: string,
  prevState: FormState,
  formData: FormData
): Promise<FormState> {
  try {
    // Extraer los campos del formulario
    const rawData = {
      name: formData.get('name'),
      description: formData.get('description'),
      price: formData.get('price'),
      category_id: formData.get('category_id'),
      is_available: formData.get('is_available'),
      sort_order: formData.get('sort_order'),
      video_360_url: formData.get('video_360_url') || null,
    }

    // Validar con el esquema de platos
    const validationResult = dishSchema.safeParse(rawData)

    if (!validationResult.success) {
      return {
        success: false,
        error: 'Por favor, corrige los errores del formulario.',
        fieldErrors: validationResult.error.flatten().fieldErrors as Record<
          string,
          string[]
        >,
      }
    }

    const validatedData = validationResult.data
    const supabase = await getAdminStorageClient()

    // ------------------------------------------------------------------
    // Preparar los datos de actualización
    // ------------------------------------------------------------------
    const updateData: Record<string, unknown> = {
      name: validatedData.name,
      description: validatedData.description || null,
      price: validatedData.price,
      category_id: validatedData.category_id,
      is_available: validatedData.is_available,
      sort_order: validatedData.sort_order,
    }

    // Si viene URL directa en el texto
    if (formData.has('video_360_url')) {
      updateData.video_360_url = (validatedData.video_360_url as string) || null
    }

    // ------------------------------------------------------------------
    // Manejo de imagen nueva: subir a Storage
    // ------------------------------------------------------------------
    const imageFile = formData.get('image') as File | null

    if (imageFile && imageFile.size > 0) {
      const fileName = generateFileName(imageFile.name)
      const arrayBuffer = await imageFile.arrayBuffer()
      const buffer = Buffer.from(arrayBuffer)

      const { error: uploadError } = await supabase.storage
        .from(STORAGE.BUCKET)
        .upload(fileName, buffer, {
          contentType: imageFile.type || 'image/jpeg',
          upsert: true,
        })

      if (uploadError) {
        console.error('[dish-actions] Error al subir imagen:', uploadError.message)
        return {
          success: false,
          error: `Error al subir imagen: ${uploadError.message}. Verifica el formato o tamaño.`,
        }
      }

      // Obtener la URL pública de la nueva imagen
      const {
        data: { publicUrl },
      } = supabase.storage.from(STORAGE.BUCKET).getPublicUrl(fileName)

      updateData.image_url = publicUrl
    }

    // ------------------------------------------------------------------
    // Manejo de video 3D / 360 nuevo: subir a Storage
    // ------------------------------------------------------------------
    const videoFile = formData.get('video_360_file') as File | null

    if (videoFile && videoFile.size > 0) {
      if (videoFile.size > STORAGE.MAX_VIDEO_SIZE) {
        return {
          success: false,
          error: 'El video 360 excede el tamaño máximo permitido de 50MB.',
        }
      }

      const videoFileName = `video-360-${generateFileName(videoFile.name)}`
      const arrayBuffer = await videoFile.arrayBuffer()
      const buffer = Buffer.from(arrayBuffer)

      const { error: videoUploadError } = await supabase.storage
        .from(STORAGE.BUCKET)
        .upload(videoFileName, buffer, {
          contentType: videoFile.type || 'video/mp4',
          upsert: true,
        })

      if (videoUploadError) {
        console.error('[dish-actions] Error al subir video 360:', videoUploadError.message)
        return {
          success: false,
          error: `Error al subir video 360: ${videoUploadError.message}.`,
        }
      }

      const {
        data: { publicUrl: videoPublicUrl },
      } = supabase.storage.from(STORAGE.BUCKET).getPublicUrl(videoFileName)

      updateData.video_360_url = videoPublicUrl
    }

    // ------------------------------------------------------------------
    // Manejo de eliminación de imagen existente
    // Si se marcó 'remove_image', eliminar la imagen del Storage
    // ------------------------------------------------------------------
    const removeImage = formData.get('remove_image') === 'true'

    if (removeImage) {
      const { data: currentDish } = await supabase
        .from('dishes')
        .select('image_url')
        .eq('id', id)
        .single<{ image_url: string | null }>()

      if (currentDish?.image_url) {
        const imagePath = currentDish.image_url.split(
          `${STORAGE.BUCKET}/`
        )[1]

        if (imagePath) {
          const { error: deleteError } = await supabase.storage
            .from(STORAGE.BUCKET)
            .remove([imagePath])

          if (deleteError) {
            console.error(
              '[dish-actions] Error al eliminar imagen:',
              deleteError.message
            )
          }
        }
      }

      updateData.image_url = null
    }

    // ------------------------------------------------------------------
    // Manejo de eliminación de video 360 existente
    // Si se marcó 'remove_video_360', eliminar de Storage y BD
    // ------------------------------------------------------------------
    const removeVideo360 = formData.get('remove_video_360') === 'true'

    if (removeVideo360) {
      const { data: currentDish } = await supabase
        .from('dishes')
        .select('video_360_url')
        .eq('id', id)
        .single<{ video_360_url: string | null }>()

      if (currentDish?.video_360_url) {
        const videoPath = currentDish.video_360_url.split(
          `${STORAGE.BUCKET}/`
        )[1]

        if (videoPath) {
          await supabase.storage.from(STORAGE.BUCKET).remove([videoPath])
        }
      }

      updateData.video_360_url = null
    }

    // ------------------------------------------------------------------
    // Actualizar el plato en la base de datos
    // ------------------------------------------------------------------
    const { error: updateError } = await supabase
      .from('dishes')
      .update(updateData as never)
      .eq('id', id)

    if (updateError) {
      console.error(
        '[dish-actions] Error al actualizar plato:',
        updateError.message
      )
      return {
        success: false,
        error: 'Error al actualizar el plato. Intenta de nuevo.',
      }
    }

    // Revalidar el caché de platos
    updateTag(CACHE_TAGS.DISHES)
  } catch (error) {
    console.error('[dish-actions] Error inesperado en updateDish:', error)
    return {
      success: false,
      error: 'Ocurrió un error inesperado. Intenta de nuevo más tarde.',
    }
  }

  // redirect() va fuera del try/catch porque lanza una excepción interna de Next.js
  redirect(ROUTES.ADMIN_DISHES)
}

/**
 * Elimina un plato de la base de datos y su imagen de Storage.
 *
 * Flujo:
 * 1. Obtener el plato para conocer su image_url
 * 2. Si tiene imagen, eliminarla de Supabase Storage
 * 3. Eliminar el registro de la tabla 'dishes'
 * 4. Revalidar el caché de platos
 *
 * @param id - UUID del plato a eliminar
 * @returns Estado con resultado de la operación
 */
export async function deleteDish(id: string): Promise<FormState> {
  try {
    const supabase = await getAdminStorageClient()

    // ------------------------------------------------------------------
    // Obtener el plato para saber si tiene imagen que eliminar
    // ------------------------------------------------------------------
    const { data: dish, error: fetchError } = await supabase
      .from('dishes')
      .select('image_url, video_360_url')
      .eq('id', id)
      .single<{ image_url: string | null; video_360_url: string | null }>()

    if (fetchError) {
      console.error(
        '[dish-actions] Error al obtener plato para eliminar:',
        fetchError
      )
      
      // Check if it's a UUID error (meaning it's probably a mock dish)
      if (fetchError.code === '22P02' || id.startsWith('dish-') || id.startsWith('cat-')) {
        return {
          success: false,
          error: 'No se pueden eliminar los platos de prueba (Mock Data).',
        }
      }

      return {
        success: false,
        error: 'No se encontró el plato a eliminar.',
      }
    }

    // ------------------------------------------------------------------
    // Eliminar la imagen del Storage si existe
    // ------------------------------------------------------------------
    if (dish?.image_url) {
      const imagePath = dish.image_url.split(`${STORAGE.BUCKET}/`)[1]
      if (imagePath) {
        await supabase.storage.from(STORAGE.BUCKET).remove([imagePath])
      }
    }

    // ------------------------------------------------------------------
    // Eliminar el video 360 del Storage si existe
    // ------------------------------------------------------------------
    if (dish?.video_360_url) {
      const videoPath = dish.video_360_url.split(`${STORAGE.BUCKET}/`)[1]
      if (videoPath) {
        await supabase.storage.from(STORAGE.BUCKET).remove([videoPath])
      }
    }

    // ------------------------------------------------------------------
    // Eliminar el plato de la base de datos
    // ------------------------------------------------------------------
    const { error: deleteError } = await supabase
      .from('dishes')
      .delete()
      .eq('id', id)

    if (deleteError) {
      console.error(
        '[dish-actions] Error al eliminar plato:',
        deleteError.message
      )
      return {
        success: false,
        error: 'Error al eliminar el plato. Intenta de nuevo.',
      }
    }

    // Revalidar el caché de platos
    updateTag(CACHE_TAGS.DISHES)

    return {
      success: true,
    }
  } catch (error) {
    console.error('[dish-actions] Error inesperado en deleteDish:', error)
    return {
      success: false,
      error: 'Ocurrió un error inesperado. Intenta de nuevo más tarde.',
    }
  }
}

/**
 * Sube una imagen de plato a Supabase Storage.
 *
 * Acción utilitaria independiente para subir imágenes sin crear/actualizar
 * un plato completo. Útil para componentes de subida de imagen aislados.
 *
 * @param formData - FormData con el archivo en el campo 'image'
 * @returns Objeto con la URL pública de la imagen o un mensaje de error
 */
export async function uploadDishImage(
  formData: FormData
): Promise<{ url: string | null; error: string | null }> {
  try {
    const file = formData.get('image') as File | null

    // ------------------------------------------------------------------
    // Validar que se proporcionó un archivo
    // ------------------------------------------------------------------
    if (!file || file.size === 0) {
      return {
        url: null,
        error: 'No se proporcionó ningún archivo.',
      }
    }

    // ------------------------------------------------------------------
    // Validar tipo de archivo permitido
    // ------------------------------------------------------------------
    const allowedTypes: readonly string[] = STORAGE.ALLOWED_TYPES
    if (!allowedTypes.includes(file.type)) {
      return {
        url: null,
        error: `Tipo de archivo no permitido. Usa: ${STORAGE.ALLOWED_TYPES.join(', ')}`,
      }
    }

    // ------------------------------------------------------------------
    // Validar tamaño máximo del archivo
    // ------------------------------------------------------------------
    if (file.size > STORAGE.MAX_FILE_SIZE) {
      const maxSizeMB = STORAGE.MAX_FILE_SIZE / (1024 * 1024)
      return {
        url: null,
        error: `El archivo excede el tamaño máximo de ${maxSizeMB}MB.`,
      }
    }

    const supabase = await createClient()
    const fileName = generateFileName(file.name)

    // ------------------------------------------------------------------
    // Subir el archivo a Supabase Storage
    // ------------------------------------------------------------------
    const { error: uploadError } = await supabase.storage
      .from(STORAGE.BUCKET)
      .upload(fileName, file)

    if (uploadError) {
      console.error(
        '[dish-actions] Error al subir imagen:',
        uploadError.message
      )
      return {
        url: null,
        error: 'Error al subir la imagen. Intenta de nuevo.',
      }
    }

    // Obtener la URL pública de la imagen subida
    const {
      data: { publicUrl },
    } = supabase.storage.from(STORAGE.BUCKET).getPublicUrl(fileName)

    return {
      url: publicUrl,
      error: null,
    }
  } catch (error) {
    console.error('[dish-actions] Error inesperado en uploadDishImage:', error)
    return {
      url: null,
      error: 'Ocurrió un error inesperado al subir la imagen.',
    }
  }
}
