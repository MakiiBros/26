export type { Database, Profile, Category, Dish, DishInsert, DishUpdate, DishWithCategory, StoreSettings } from './database'

/** Resultado genérico de Server Actions */
export type ActionResult = {
  success: boolean
  error?: string
}

/** Estado del formulario para useActionState */
export type FormState = {
  success: boolean
  error?: string
  fieldErrors?: Record<string, string[]>
}

