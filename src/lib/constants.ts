/**
 * Constantes de la aplicación makisbros.
 */

/** Tags de caché para revalidación on-demand */
export const CACHE_TAGS = {
  DISHES: 'dishes',
  CATEGORIES: 'categories',
  MENU: 'menu',
} as const

/** Rutas de la aplicación */
export const ROUTES = {
  HOME: '/',
  LOGIN: '/auth/login',
  AUTH_CALLBACK: '/auth/callback',
  ADMIN: '/admin',
  ADMIN_DISHES: '/admin/dishes',
  ADMIN_DISHES_NEW: '/admin/dishes/new',
  adminDishEdit: (id: string) => `/admin/dishes/${id}/edit` as const,
} as const

/** Configuración de Storage */
export const STORAGE = {
  BUCKET: 'dish-images',
  MAX_FILE_SIZE: 5 * 1024 * 1024, // 5MB
  ALLOWED_TYPES: ['image/jpeg', 'image/png', 'image/webp', 'image/avif'],
} as const

/** Configuración del menú */
export const MENU_CONFIG = {
  CURRENCY_SYMBOL: 'S/',
  REVALIDATE_SECONDS: 3600, // 1 hora de cache por defecto
} as const

