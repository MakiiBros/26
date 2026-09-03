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

export const SUPABASE_SERVICE_ROLE_KEY =
  process.env.SUPABASE_SERVICE_ROLE_KEY || 'sb_secret_RRZavO895LZIsK0TGbIaSA_ezwZJinw'

export const FIREBASE_CONFIG = {
  apiKey: "AIzaSyAqJ3Mm_fCrOkgiTVlX9YUIt3B5GZTBd6g",
  authDomain: "makibros-75b7b.firebaseapp.com",
  projectId: "makibros-75b7b",
  storageBucket: "makibros-75b7b.firebasestorage.app",
  messagingSenderId: "927240760074",
  appId: "1:927240760074:web:3577f579068fd017ec68f3",
  measurementId: "G-FEH1BKX4R2"
} as const


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
  MAX_FILE_SIZE: 5 * 1024 * 1024, // 5MB para imágenes
  MAX_VIDEO_SIZE: 50 * 1024 * 1024, // 50MB para videos 3D / 360
  ALLOWED_TYPES: ['image/jpeg', 'image/png', 'image/webp', 'image/avif'],
  ALLOWED_VIDEO_TYPES: ['video/mp4', 'video/webm', 'video/quicktime', 'video/x-m4v'],
} as const

/** Configuración del menú */
export const MENU_CONFIG = {
  CURRENCY_SYMBOL: 'S/',
  REVALIDATE_SECONDS: 3600, // 1 hora de cache por defecto
} as const

