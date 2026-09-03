'use client'

import React, { createContext, useContext, useEffect, useState } from 'react'
import type { Dish } from '@/types'

export interface CartItem {
  dish: Dish
  quantity: number
}

interface CartContextType {
  items: CartItem[]
  addItem: (dish: Dish, quantity?: number) => void
  removeItem: (dishId: string) => void
  updateQuantity: (dishId: string, quantity: number) => void
  clearCart: () => void
  totalItems: number
  totalPrice: number
}

const CartContext = createContext<CartContextType | undefined>(undefined)

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>(() => {
    if (typeof window === 'undefined') return []
    try {
      const saved = localStorage.getItem('makibros_cart')
      return saved ? JSON.parse(saved) : []
    } catch {
      return []
    }
  })

  // Save to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('makibros_cart', JSON.stringify(items))
    } catch (e) {
      console.warn('Could not save cart to localStorage', e)
    }
  }, [items])

  const addItem = (dish: Dish, quantity = 1) => {
    setItems((prev) => {
      const existing = prev.find((item) => item.dish.id === dish.id)
      if (existing) {
        return prev.map((item) =>
          item.dish.id === dish.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        )
      }
      return [...prev, { dish, quantity }]
    })
  }

  const removeItem = (dishId: string) => {
    setItems((prev) => prev.filter((item) => item.dish.id !== dishId))
  }

  const updateQuantity = (dishId: string, quantity: number) => {
    if (quantity <= 0) {
      removeItem(dishId)
      return
    }
    setItems((prev) =>
      prev.map((item) =>
        item.dish.id === dishId ? { ...item, quantity } : item
      )
    )
  }

  const clearCart = () => {
    setItems([])
  }

  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0)
  
  const totalPrice = items.reduce((sum, item) => {
    const isDiscounted = (item.dish.discount_percentage ?? 0) > 0
    const price = isDiscounted
      ? item.dish.price * (1 - (item.dish.discount_percentage ?? 0) / 100)
      : item.dish.price
    return sum + price * item.quantity
  }, 0)

  return (
    <CartContext.Provider
      value={{
        items,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        totalItems,
        totalPrice,
      }}
    >
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const context = useContext(CartContext)
  if (!context) {
    throw new Error('useCart must be used within a CartProvider')
  }
  return context
}
