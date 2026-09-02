import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

/**
 * Combina clases de Tailwind de forma inteligente.
 * Usa clsx para condicionales y tailwind-merge para resolver conflictos.
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Formatea un número como precio en Soles peruanos.
 * @example formatPrice(25.9) => "S/ 25.90"
 */
export function formatPrice(price: number): string {
  return `S/ ${price.toFixed(2)}`
}

/**
 * Genera un slug URL-safe a partir de un texto.
 * @example slugify("Rolls Especiales") => "rolls-especiales"
 */
export function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // Eliminar acentos
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)+/g, '')
}

/**
 * Construye la URL pública de una imagen en Supabase Storage.
 */
export function getStorageUrl(path: string): string {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  return `${supabaseUrl}/storage/v1/object/public/dish-images/${path}`
}

/**
 * Genera un nombre de archivo único para subir a Storage.
 * Preserva la extensión original.
 */
export function generateFileName(originalName: string): string {
  const ext = originalName.split('.').pop()?.toLowerCase() ?? 'jpg'
  const timestamp = Date.now()
  const random = Math.random().toString(36).substring(2, 8)
  return `${timestamp}-${random}.${ext}`
}

/**
 * Valida si un archivo es una imagen permitida.
 */
export function isValidImageFile(file: File): boolean {
  const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/avif']
  const maxSize = 5 * 1024 * 1024 // 5MB
  return allowedTypes.includes(file.type) && file.size <= maxSize
}

