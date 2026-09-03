'use client'

import React, { useEffect, useCallback, useState } from 'react'
import { cn } from '@/lib/utils'

export type ToastType = 'success' | 'error' | 'info'

interface ToastItem {
  id: string
  message: string
  type: ToastType
  isExiting: boolean
}

interface ToastContextValue {
  toast: (message: string, type?: ToastType) => void
}

const TOAST_DURATION_MS = 4000
const EXIT_ANIMATION_MS = 300

const toastStyles: Record<ToastType, string> = {
  success: 'border-green-200 bg-green-50 text-green-800',
  error: 'border-red-200 bg-red-50 text-red-800',
  info: 'border-blue-200 bg-blue-50 text-blue-800',
}

const toastIcons: Record<ToastType, React.ReactNode> = {
  success: (
    <svg className="h-5 w-5 flex-shrink-0 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
  ),
  error: (
    <svg className="h-5 w-5 flex-shrink-0 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
  ),
  info: (
    <svg className="h-5 w-5 flex-shrink-0 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
  ),
}

type ToastListener = (toast: ToastItem) => void;
let listeners: ToastListener[] = [];

const emitToast = (message: string, type: ToastType = 'info') => {
  const id = `toast-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`
  const newToast: ToastItem = { id, message, type, isExiting: false }
  listeners.forEach((l) => l(newToast));
}

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([])

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.map((t) => (t.id === id ? { ...t, isExiting: true } : t)))
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id))
    }, EXIT_ANIMATION_MS)
  }, [])

  useEffect(() => {
    const handleAdd = (t: ToastItem) => {
      setToasts((prev) => [...prev, t]);
      setTimeout(() => {
        removeToast(t.id);
      }, TOAST_DURATION_MS);
    };
    listeners.push(handleAdd);
    return () => {
      listeners = listeners.filter((l) => l !== handleAdd);
    };
  }, [removeToast]);

  return (
    <>
      {children}
      {toasts.length > 0 && (
        <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2" aria-live="polite">
          {toasts.map((item) => (
            <div key={item.id} className={cn('flex items-center gap-3 rounded-lg border px-4 py-3 shadow-lg min-w-[280px] max-w-[420px] transition-all duration-300 ease-in-out', item.isExiting ? 'translate-x-full opacity-0' : 'translate-x-0 opacity-100', toastStyles[item.type])}>
              {toastIcons[item.type]}
              <p className="flex-1 text-sm font-medium">{item.message}</p>
              <button type="button" onClick={() => removeToast(item.id)} className="flex-shrink-0 rounded-md p-1 opacity-70 transition-opacity hover:opacity-100 focus:outline-none">
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>
          ))}
        </div>
      )}
    </>
  )
}

export function useToast(): ToastContextValue {
  return { toast: emitToast }
}
