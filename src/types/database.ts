/**
 * Tipos de la base de datos Supabase para makisbros.
 *
 * NOTA: En producción, estos tipos se generan automáticamente con:
 *   npx supabase gen types typescript --project-id <PROJECT_ID> > src/types/database.ts
 *
 * Esta definición manual sirve como punto de partida antes de conectar
 * con un proyecto Supabase real.
 */

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          role: 'user' | 'admin'
          created_at: string
        }
        Insert: {
          id: string
          role?: 'user' | 'admin'
          created_at?: string
        }
        Update: {
          id?: string
          role?: 'user' | 'admin'
          created_at?: string
        }
      }
      categories: {
        Row: {
          id: string
          name: string
          slug: string
          sort_order: number
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          slug: string
          sort_order?: number
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          slug?: string
          sort_order?: number
          created_at?: string
        }
      }
      dishes: {
        Row: {
          id: string
          category_id: string
          name: string
          description: string | null
          price: number
          image_url: string | null
          is_available: boolean
          sort_order: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          category_id: string
          name: string
          description?: string | null
          price: number
          image_url?: string | null
          is_available?: boolean
          sort_order?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          category_id?: string
          name?: string
          description?: string | null
          price?: number
          image_url?: string | null
          is_available?: boolean
          sort_order?: number
          created_at?: string
          updated_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
}

// Alias convenientes para uso en la app
export type Profile = Database['public']['Tables']['profiles']['Row']
export type Category = Database['public']['Tables']['categories']['Row']
export type Dish = Database['public']['Tables']['dishes']['Row']
export type DishInsert = Database['public']['Tables']['dishes']['Insert']
export type DishUpdate = Database['public']['Tables']['dishes']['Update']

/** Plato con su categoría embebida (para JOINs) */
export type DishWithCategory = Dish & {
  categories: Category
}

