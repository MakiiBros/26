/**
 * Constantes de la aplicación makisbros.
 */

/** Tags de caché para revalidación on-demand */
export const CACHE_TAGS = {
  DISHES: 'dishes',
  CATEGORIES: 'categories',
  MENU: 'menu',
} as const

export const SUPABASE_URL =
  process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://usxhvlchkuzmbrqkgpqn.supabase.co'

export const SUPABASE_ANON_KEY =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'sb_publishable_7YQxGQBsq6Sy1fPiMn85SA_uWAdyoso'


/** Rutas de la aplicación */
export const ROUTES = {
  HOME: '/',
  MENU: '/menu',
  ABOUT: '/about',
  LOGIN: '/auth/login',
  REGISTER: '/auth/register',
  CHECKOUT: '/checkout',
  ADMIN: '/admin',
  ADMIN_DISHES: '/admin/dishes',
  ADMIN_ORDERS: '/admin/orders',
  ADMIN_SETTINGS: '/admin/settings',
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

