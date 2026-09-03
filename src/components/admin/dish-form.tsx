'use client'

import { useActionState, useState, useRef } from 'react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent } from '@/components/ui/card'
import type { DishWithCategory, Category, FormState } from '@/types'
import { createDish, updateDish } from '@/actions/dish-actions'
import { ROUTES } from '@/lib/constants'
import { useToast } from '@/components/ui/toast'

interface DishFormProps {
  initialData?: DishWithCategory
  categories: Category[]
}

export function DishForm({ initialData, categories }: DishFormProps) {
  const router = useRouter()
  const { toast } = useToast()
  const isEditing = !!initialData
  
  const [imagePreview, setImagePreview] = useState<string | null>(initialData?.image_url || null)
  const [removeImage, setRemoveImage] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Enlazar la acción al estado (bindeamos el ID si es edición)
  const action = isEditing 
    ? updateDish.bind(null, initialData.id) 
    : createDish

  const [state, formAction, isPending] = useActionState(action, { success: false })

  // Si el formAction se completa y tiene éxito, no redirigimos aquí porque 
  // la redirección se hace en el server action con `redirect()`.
  
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast('La imagen supera los 5MB', 'error')
        if (fileInputRef.current) fileInputRef.current.value = ''
        return
      }
      setImagePreview(URL.createObjectURL(file))
      setRemoveImage(false)
    }
  }

  const handleRemoveImage = () => {
    setImagePreview(null)
    setRemoveImage(true)
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  return (
    <form action={formAction} encType="multipart/form-data" className="space-y-6 max-w-2xl">
      {state.error && (
        <div className="bg-red-50 text-red-700 p-4 rounded-md">
          {state.error}
        </div>
      )}

      {/* Flag oculto para remover imagen */}
      <input type="hidden" name="remove_image" value={removeImage.toString()} />

      <Card>
        <CardContent className="pt-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Input
                label="Nombre del Plato"
                id="name"
                name="name"
                defaultValue={initialData?.name}
                error={state.fieldErrors?.name?.[0]}
                required
              />
            </div>

            <div className="space-y-2">
              <Input
                label="Precio (S/)"
                id="price"
                name="price"
                type="number"
                step="0.01"
                min="0"
                defaultValue={initialData?.price}
                error={state.fieldErrors?.price?.[0]}
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <label htmlFor="description" className="block text-sm font-medium text-gray-700">
              Descripción
            </label>
            <textarea
              id="description"
              name="description"
              rows={3}
              className={`flex w-full rounded-md border bg-white px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 ${
                state.fieldErrors?.description ? 'border-red-500' : 'border-gray-300'
              }`}
              defaultValue={initialData?.description || ''}
            />
            {state.fieldErrors?.description && (
              <p className="text-sm text-red-500">{state.fieldErrors.description[0]}</p>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label htmlFor="category_id" className="block text-sm font-medium text-gray-700">
                Categoría
              </label>
              <select
                id="category_id"
                name="category_id"
                className={`flex h-10 w-full rounded-md border bg-white px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 ${
                  state.fieldErrors?.category_id ? 'border-red-500' : 'border-gray-300'
                }`}
                defaultValue={initialData?.category_id || ''}
                required
              >
                <option value="" disabled>Selecciona una categoría...</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
              {state.fieldErrors?.category_id && (
                <p className="text-sm text-red-500">{state.fieldErrors.category_id[0]}</p>
              )}
            </div>

            <div className="space-y-2">
              <Input
                label="Orden de visualización"
                id="sort_order"
                name="sort_order"
                type="number"
                min="0"
                defaultValue={initialData?.sort_order ?? 0}
                error={state.fieldErrors?.sort_order?.[0]}
                required
              />
            </div>
          </div>

          <div className="flex items-center space-x-2 pt-2">
            <input
              type="checkbox"
              id="is_available"
              name="is_available"
              value="true"
              defaultChecked={initialData ? initialData.is_available : true}
              className="h-4 w-4 rounded border-gray-300 text-orange-600 focus:ring-orange-500"
            />
            <label htmlFor="is_available" className="text-sm font-medium text-gray-700">
              Disponible para la venta
            </label>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="pt-6">
          <div className="space-y-4">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Imagen del Plato</label>
            
            {/* Input de archivo SIEMPRE montado en el DOM para que viaje en FormData */}
            <input 
              id="image" 
              name="image" 
              type="file" 
              className="sr-only" 
              accept="image/png, image/jpeg, image/webp, image/avif"
              onChange={handleImageChange}
              ref={fileInputRef}
            />

            {imagePreview ? (
              <div className="space-y-3">
                <div className="relative aspect-video w-full max-w-sm rounded-lg overflow-hidden border border-gray-300 dark:border-gray-700 bg-black/10">
                  <Image 
                    src={imagePreview} 
                    alt="Preview" 
                    fill 
                    className="object-cover"
                  />
                </div>
                <div className="flex gap-2">
                  <Button 
                    type="button" 
                    variant="outline" 
                    size="sm"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    Cambiar Imagen
                  </Button>
                  <Button 
                    type="button" 
                    variant="destructive" 
                    size="sm" 
                    onClick={handleRemoveImage}
                  >
                    Eliminar Imagen
                  </Button>
                </div>
              </div>
            ) : (
              <div 
                onClick={() => fileInputRef.current?.click()}
                className="flex justify-center rounded-lg border border-dashed border-gray-300 dark:border-gray-700 px-6 py-10 cursor-pointer hover:border-orange-500 transition-colors"
              >
                <div className="text-center">
                  <svg className="mx-auto h-12 w-12 text-gray-400" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                    <path fillRule="evenodd" d="M1.5 6a2.25 2.25 0 012.25-2.25h16.5A2.25 2.25 0 0122.5 6v12a2.25 2.25 0 01-2.25 2.25H3.75A2.25 2.25 0 011.5 18V6zM3 16.06V18c0 .414.336.75.75.75h16.5A.75.75 0 0021 18v-1.94l-2.69-2.689a1.5 1.5 0 00-2.12 0l-.88.879.97.97a.75.75 0 11-1.06 1.06l-5.16-5.159a1.5 1.5 0 00-2.12 0L3 16.061zm10.125-7.81a1.125 1.125 0 112.25 0 1.125 1.125 0 01-2.25 0z" clipRule="evenodd" />
                  </svg>
                  <div className="mt-4 flex text-sm leading-6 text-gray-600 dark:text-gray-400 justify-center">
                    <span className="relative font-semibold text-orange-600 hover:text-orange-500">
                      Sube un archivo
                    </span>
                  </div>
                  <p className="text-xs leading-5 text-gray-500">PNG, JPG, WebP hasta 5MB</p>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <div className="flex gap-4 justify-end">
        <Button 
          type="button" 
          variant="outline" 
          onClick={() => router.push(ROUTES.ADMIN_DISHES)}
          disabled={isPending}
        >
          Cancelar
        </Button>
        <Button type="submit" isLoading={isPending}>
          {isEditing ? 'Guardar Cambios' : 'Crear Plato'}
        </Button>
      </div>
    </form>
  )
}

