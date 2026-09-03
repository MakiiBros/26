'use client'

import { useActionState, useState, useRef } from 'react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import type { DishWithCategory, Category } from '@/types'
import { createDish, updateDish } from '@/actions/dish-actions'
import { ROUTES, STORAGE } from '@/lib/constants'
import { useToast } from '@/components/ui/toast'
import { RotateCw, Video, UploadCloud, Link as LinkIcon, Sparkles } from 'lucide-react'

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

  // Estados para Video 3D / 360
  const [videoPreview, setVideoPreview] = useState<string | null>(initialData?.video_360_url || null)
  const [removeVideo360, setRemoveVideo360] = useState(false)
  const [videoMode, setVideoMode] = useState<'file' | 'url'>('file')
  const [videoUrlInput, setVideoUrlInput] = useState<string>(initialData?.video_360_url || '')
  const videoFileInputRef = useRef<HTMLInputElement>(null)

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

  const handleVideoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      if (file.size > STORAGE.MAX_VIDEO_SIZE) {
        toast(`El video supera los ${STORAGE.MAX_VIDEO_SIZE / (1024 * 1024)}MB`, 'error')
        if (videoFileInputRef.current) videoFileInputRef.current.value = ''
        return
      }
      setVideoPreview(URL.createObjectURL(file))
      setRemoveVideo360(false)
      setVideoUrlInput('')
    }
  }

  const handleRemoveVideo = () => {
    setVideoPreview(null)
    setRemoveVideo360(true)
    setVideoUrlInput('')
    if (videoFileInputRef.current) videoFileInputRef.current.value = ''
  }

  return (
    <form action={formAction} encType="multipart/form-data" className="space-y-6 max-w-3xl">
      {state.error && (
        <div className="bg-red-950/40 border border-red-500/50 text-red-200 p-4 rounded-xl text-sm flex items-center gap-2">
          <span className="font-bold">⚠️ Error:</span> {state.error}
        </div>
      )}

      {/* Flag oculto para remover imagen */}
      <input type="hidden" name="remove_image" value={removeImage.toString()} />
      {/* Flag oculto para remover video 360 */}
      <input type="hidden" name="remove_video_360" value={removeVideo360.toString()} />

      {/* Tarjeta 1: Información Principal */}
      <div className="bg-[#141414] border border-[#2a2a2a] rounded-xl p-6 space-y-5 shadow-xl">
        <h2 className="text-lg font-bold text-white border-b border-[#222222] pb-3 flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-[#e53e3e]" />
          Información Básica
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="space-y-2">
            <label htmlFor="name" className="block text-sm font-medium text-gray-200">
              Nombre del Plato <span className="text-[#e53e3e]">*</span>
            </label>
            <input
              id="name"
              name="name"
              type="text"
              defaultValue={initialData?.name}
              placeholder="Ej. Acevichado Maki"
              className={`flex h-11 w-full rounded-lg border bg-[#1a1a1a] px-3.5 py-2 text-sm text-white placeholder:text-gray-500 focus-visible:outline-none focus:border-[#e53e3e] focus:ring-1 focus:ring-[#e53e3e] transition-colors ${
                state.fieldErrors?.name ? 'border-red-500' : 'border-[#2a2a2a]'
              }`}
              required
            />
            {state.fieldErrors?.name && (
              <p className="text-xs text-red-400">{state.fieldErrors.name[0]}</p>
            )}
          </div>

          <div className="space-y-2">
            <label htmlFor="price" className="block text-sm font-medium text-gray-200">
              Precio (S/) <span className="text-[#e53e3e]">*</span>
            </label>
            <input
              id="price"
              name="price"
              type="number"
              step="0.01"
              min="0"
              defaultValue={initialData?.price}
              placeholder="28.00"
              className={`flex h-11 w-full rounded-lg border bg-[#1a1a1a] px-3.5 py-2 text-sm text-white placeholder:text-gray-500 focus-visible:outline-none focus:border-[#e53e3e] focus:ring-1 focus:ring-[#e53e3e] transition-colors ${
                state.fieldErrors?.price ? 'border-red-500' : 'border-[#2a2a2a]'
              }`}
              required
            />
            {state.fieldErrors?.price && (
              <p className="text-xs text-red-400">{state.fieldErrors.price[0]}</p>
            )}
          </div>
        </div>

        <div className="space-y-2">
          <label htmlFor="description" className="block text-sm font-medium text-gray-200">
            Descripción
          </label>
          <textarea
            id="description"
            name="description"
            rows={3}
            className={`flex w-full rounded-lg border bg-[#1a1a1a] px-3.5 py-2.5 text-sm text-white placeholder:text-gray-500 focus-visible:outline-none focus:border-[#e53e3e] focus:ring-1 focus:ring-[#e53e3e] transition-colors ${
              state.fieldErrors?.description ? 'border-red-500' : 'border-[#2a2a2a]'
            }`}
            placeholder="Relleno de langostino empanizado y palta, cubierto con láminas de atún y salsa acevichada..."
            defaultValue={initialData?.description || ''}
          />
          {state.fieldErrors?.description && (
            <p className="text-xs text-red-400">{state.fieldErrors.description[0]}</p>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="space-y-2">
            <label htmlFor="category_id" className="block text-sm font-medium text-gray-200">
              Categoría <span className="text-[#e53e3e]">*</span>
            </label>
            <select
              id="category_id"
              name="category_id"
              className={`flex h-11 w-full rounded-lg border bg-[#1a1a1a] px-3.5 py-2 text-sm text-white focus-visible:outline-none focus:border-[#e53e3e] focus:ring-1 focus:ring-[#e53e3e] transition-colors ${
                state.fieldErrors?.category_id ? 'border-red-500' : 'border-[#2a2a2a]'
              }`}
              defaultValue={initialData?.category_id || ''}
              required
            >
              <option value="" disabled className="bg-[#1a1a1a] text-gray-400">Selecciona una categoría...</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id} className="bg-[#1a1a1a] text-white py-1">
                  {c.name}
                </option>
              ))}
            </select>
            {state.fieldErrors?.category_id && (
              <p className="text-xs text-red-400">{state.fieldErrors.category_id[0]}</p>
            )}
          </div>

          <div className="space-y-2">
            <label htmlFor="sort_order" className="block text-sm font-medium text-gray-200">
              Orden de visualización
            </label>
            <input
              id="sort_order"
              name="sort_order"
              type="number"
              min="0"
              defaultValue={initialData?.sort_order ?? 0}
              className={`flex h-11 w-full rounded-lg border bg-[#1a1a1a] px-3.5 py-2 text-sm text-white focus-visible:outline-none focus:border-[#e53e3e] focus:ring-1 focus:ring-[#e53e3e] transition-colors ${
                state.fieldErrors?.sort_order ? 'border-red-500' : 'border-[#2a2a2a]'
              }`}
              required
            />
            {state.fieldErrors?.sort_order && (
              <p className="text-xs text-red-400">{state.fieldErrors.sort_order[0]}</p>
            )}
          </div>
        </div>

        <div className="flex items-center gap-3 pt-2">
          <input
            type="checkbox"
            id="is_available"
            name="is_available"
            value="true"
            defaultChecked={initialData ? initialData.is_available : true}
            className="h-4 w-4 rounded border-[#3a3a3a] bg-[#1a1a1a] text-[#e53e3e] focus:ring-[#e53e3e] accent-[#e53e3e]"
          />
          <label htmlFor="is_available" className="text-sm font-medium text-gray-300 select-none cursor-pointer">
            Disponible para la venta (visible en el menú)
          </label>
        </div>
      </div>

      {/* Tarjeta 2: Imagen del Plato */}
      <div className="bg-[#141414] border border-[#2a2a2a] rounded-xl p-6 space-y-4 shadow-xl">
        <h2 className="text-lg font-bold text-white border-b border-[#222222] pb-3 flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-[#f6ad55]" />
          Fotografía del Plato
        </h2>
        
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
          <div className="space-y-4">
            <div className="relative aspect-video w-full max-w-md rounded-xl overflow-hidden border border-[#2a2a2a] bg-black shadow-inner">
              <Image 
                src={imagePreview} 
                alt="Preview" 
                fill 
                className="object-cover"
              />
            </div>
            <div className="flex gap-3">
              <Button 
                type="button" 
                variant="outline" 
                size="sm"
                className="bg-[#1a1a1a] hover:bg-[#252525] text-white border-[#2a2a2a]"
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
            className="flex justify-center rounded-xl border-2 border-dashed border-[#2a2a2a] hover:border-[#e53e3e] bg-[#1a1a1a]/40 px-6 py-10 cursor-pointer transition-all hover:bg-[#1a1a1a]/70 group"
          >
            <div className="text-center">
              <svg className="mx-auto h-12 w-12 text-gray-500 group-hover:text-[#e53e3e] transition-colors" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path fillRule="evenodd" d="M1.5 6a2.25 2.25 0 012.25-2.25h16.5A2.25 2.25 0 0122.5 6v12a2.25 2.25 0 01-2.25 2.25H3.75A2.25 2.25 0 011.5 18V6zM3 16.06V18c0 .414.336.75.75.75h16.5A.75.75 0 0021 18v-1.94l-2.69-2.689a1.5 1.5 0 00-2.12 0l-.88.879.97.97a.75.75 0 11-1.06 1.06l-5.16-5.159a1.5 1.5 0 00-2.12 0L3 16.061zm10.125-7.81a1.125 1.125 0 112.25 0 1.125 1.125 0 01-2.25 0z" clipRule="evenodd" />
              </svg>
              <div className="mt-4 flex text-sm leading-6 text-gray-300 justify-center">
                <span className="relative font-semibold text-[#f6ad55] group-hover:underline">
                  Haz clic para subir una imagen
                </span>
              </div>
              <p className="text-xs leading-5 text-gray-500 mt-1">PNG, JPG, WebP o AVIF hasta 5MB</p>
            </div>
          </div>
        )}
      </div>

      {/* Tarjeta 3: Video 3D / 360° del Plato */}
      <div className="bg-[#141414] border border-[#2a2a2a] rounded-xl p-6 space-y-4 shadow-xl">
        <div className="border-b border-[#222222] pb-3 flex items-center justify-between">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <RotateCw className="w-4 h-4 text-amber-400 animate-spin" style={{ animationDuration: '8s' }} />
            Video 3D 360° del Plato <span className="text-xs font-normal text-gray-400">(Opcional)</span>
          </h2>
          <span className="text-[11px] font-bold bg-amber-500/10 text-amber-300 border border-amber-500/20 px-2.5 py-0.5 rounded-full flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-amber-400" />
            Visor Interactivo
          </span>
        </div>

        <p className="text-xs text-gray-400 leading-relaxed">
          Ofrece a tus clientes una experiencia inmersiva. Puedes subir un video en 360° (rotación de plato o panorama esférico) 
          en formato MP4 o WebM de hasta 50MB, o ingresar un enlace directo o de YouTube 360.
        </p>

        {/* Selector de modo: Subir Archivo vs Enlace URL */}
        <div className="flex gap-2 p-1 bg-[#1a1a1a] rounded-lg border border-[#2a2a2a] w-fit">
          <button
            type="button"
            onClick={() => setVideoMode('file')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-md text-xs font-semibold transition-all ${
              videoMode === 'file'
                ? 'bg-[#e53e3e] text-white shadow'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            <UploadCloud className="w-3.5 h-3.5" />
            Subir Archivo de Video
          </button>
          <button
            type="button"
            onClick={() => setVideoMode('url')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-md text-xs font-semibold transition-all ${
              videoMode === 'url'
                ? 'bg-[#e53e3e] text-white shadow'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            <LinkIcon className="w-3.5 h-3.5" />
            Enlace URL / YouTube
          </button>
        </div>

        {/* Input de archivo SIEMPRE en el DOM para FormData */}
        <input 
          id="video_360_file" 
          name="video_360_file" 
          type="file" 
          className="sr-only" 
          accept="video/mp4, video/webm, video/ogg, video/quicktime"
          onChange={handleVideoChange}
          ref={videoFileInputRef}
        />

        {/* Modo 1: Subir Archivo */}
        {videoMode === 'file' && (
          <div>
            {videoPreview && !videoUrlInput ? (
              <div className="space-y-4">
                <div className="relative aspect-video w-full max-w-md rounded-xl overflow-hidden border border-[#2a2a2a] bg-black shadow-inner">
                  <video 
                    src={videoPreview} 
                    controls 
                    playsInline 
                    className="w-full h-full object-contain"
                  />
                </div>
                <div className="flex gap-3">
                  <Button 
                    type="button" 
                    variant="outline" 
                    size="sm"
                    className="bg-[#1a1a1a] hover:bg-[#252525] text-white border-[#2a2a2a]"
                    onClick={() => videoFileInputRef.current?.click()}
                  >
                    Cambiar Video
                  </Button>
                  <Button 
                    type="button" 
                    variant="destructive" 
                    size="sm" 
                    onClick={handleRemoveVideo}
                  >
                    Eliminar Video
                  </Button>
                </div>
              </div>
            ) : (
              <div 
                onClick={() => videoFileInputRef.current?.click()}
                className="flex justify-center rounded-xl border-2 border-dashed border-[#2a2a2a] hover:border-amber-500 bg-[#1a1a1a]/40 px-6 py-10 cursor-pointer transition-all hover:bg-[#1a1a1a]/70 group"
              >
                <div className="text-center">
                  <Video className="mx-auto h-12 w-12 text-gray-500 group-hover:text-amber-400 transition-colors" />
                  <div className="mt-4 flex text-sm leading-6 text-gray-300 justify-center">
                    <span className="relative font-semibold text-amber-300 group-hover:underline">
                      Haz clic para subir un video 360°
                    </span>
                  </div>
                  <p className="text-xs leading-5 text-gray-500 mt-1">MP4, WebM o MOV hasta 50MB</p>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Modo 2: Enlace URL */}
        {videoMode === 'url' && (
          <div className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="video_360_url" className="block text-sm font-medium text-gray-200">
                URL del Video 360° o YouTube
              </label>
              <input
                id="video_360_url"
                name="video_360_url"
                type="url"
                value={videoUrlInput}
                onChange={(e) => {
                  const url = e.target.value
                  setVideoUrlInput(url)
                  setVideoPreview(url ? url : null)
                  setRemoveVideo360(false)
                }}
                placeholder="https://.../video.mp4 o https://youtube.com/watch?v=..."
                className="flex h-11 w-full rounded-lg border border-[#2a2a2a] bg-[#1a1a1a] px-3.5 py-2 text-sm text-white placeholder:text-gray-500 focus-visible:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-colors"
              />
              <p className="text-xs text-gray-400">
                Acepta enlaces a archivos de video MP4/WebM o videos de YouTube con soporte 360°.
              </p>
            </div>

            {videoPreview && (
              <div className="space-y-4">
                <div className="relative aspect-video w-full max-w-md rounded-xl overflow-hidden border border-[#2a2a2a] bg-black shadow-inner">
                  {videoPreview.includes('youtube.com') || videoPreview.includes('youtu.be') ? (
                    <div className="w-full h-full flex flex-col items-center justify-center text-center p-4 text-gray-300 text-xs gap-2">
                      <Sparkles className="w-6 h-6 text-amber-400" />
                      <span>Enlace de YouTube detectado. Se reproducirá con visor interactivo en el menú.</span>
                      <span className="font-mono text-gray-400 truncate max-w-xs">{videoPreview}</span>
                    </div>
                  ) : (
                    <video 
                      src={videoPreview} 
                      controls 
                      playsInline 
                      className="w-full h-full object-contain"
                    />
                  )}
                </div>
                <Button 
                  type="button" 
                  variant="destructive" 
                  size="sm" 
                  onClick={handleRemoveVideo}
                >
                  Quitar URL
                </Button>
              </div>
            )}
          </div>
        )}
      </div>

      <div className="flex gap-4 justify-end pt-2">
        <Button 
          type="button" 
          variant="outline" 
          onClick={() => router.push(ROUTES.ADMIN_DISHES)}
          disabled={isPending}
          className="border-[#2a2a2a] bg-[#1a1a1a] hover:bg-[#252525] text-white h-11 px-6 rounded-lg"
        >
          Cancelar
        </Button>
        <Button 
          type="submit" 
          isLoading={isPending}
          className="bg-[#e53e3e] hover:bg-red-700 text-white font-semibold h-11 px-8 rounded-lg shadow-lg shadow-red-950/30"
        >
          {isEditing ? 'Guardar Cambios' : 'Crear Plato'}
        </Button>
      </div>
    </form>
  )
}

