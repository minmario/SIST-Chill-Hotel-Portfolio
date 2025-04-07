"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"

// 장바구니 아이템 타입 정의
export interface CartItem {
  id: number
  name: string
  price: number
  image: string
  quantity: number
  category?: string
  subcategory?: string
}

// 장바구니 컨텍스트 타입 정의
interface CartContextType {
  cartItems: CartItem[]
  addToCart: (item: CartItem) => void
  removeFromCart: (itemId: number) => void
  updateQuantity: (itemId: number, quantity: number) => void
  clearCart: () => void
  getCartTotal: () => number
}

// 기본값 생성
const defaultCartContext: CartContextType = {
  cartItems: [],
  addToCart: () => {},
  removeFromCart: () => {},
  updateQuantity: () => {},
  clearCart: () => {},
  getCartTotal: () => 0,
}

// 컨텍스트 생성
const CartContext = createContext<CartContextType>(defaultCartContext)

// 컨텍스트 프로바이더 컴포넌트
export function CartProvider({ children }: { children: ReactNode }) {
  const [cartItems, setCartItems] = useState<CartItem[]>([])
  const [isClient, setIsClient] = useState(false)

  // 클라이언트 사이드에서만 로컬 스토리지 접근
  useEffect(() => {
    setIsClient(true)
    try {
      const storedCartItems = localStorage.getItem("cartItems")
      if (storedCartItems) {
        setCartItems(JSON.parse(storedCartItems))
      }
    } catch (error) {
      console.error("장바구니 데이터를 불러오는 중 오류가 발생했습니다:", error)
    }
  }, [])

  // 장바구니 상태가 변경될 때마다 로컬 스토리지 업데이트
  useEffect(() => {
    if (isClient) {
      try {
        localStorage.setItem("cartItems", JSON.stringify(cartItems))
      } catch (error) {
        console.error("장바구니 데이터를 저장하는 중 오류가 발생했습니다:", error)
      }
    }
  }, [cartItems, isClient])

  // 장바구니에 상품 추가
  const addToCart = (item: CartItem) => {
    setCartItems((prevItems) => {
      const existingItemIndex = prevItems.findIndex((i) => i.id === item.id)

      if (existingItemIndex >= 0) {
        // 이미 있는 상품이면 수량만 증가
        const updatedItems = [...prevItems]
        updatedItems[existingItemIndex].quantity += item.quantity
        return updatedItems
      } else {
        // 새 상품이면 추가
        return [...prevItems, item]
      }
    })
  }

  // 장바구니에서 상품 제거
  const removeFromCart = (itemId: number) => {
    setCartItems((prevItems) => prevItems.filter((item) => item.id !== itemId))
  }

  // 상품 수량 업데이트
  const updateQuantity = (itemId: number, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(itemId)
      return
    }

    setCartItems((prevItems) => prevItems.map((item) => (item.id === itemId ? { ...item, quantity } : item)))
  }

  // 장바구니 비우기
  const clearCart = () => {
    setCartItems([])
    if (isClient) {
      try {
        localStorage.setItem("cartItems", JSON.stringify([]))
      } catch (error) {
        console.error("장바구니 데이터를 비우는 중 오류가 발생했습니다:", error)
      }
    }
  }

  // 총 가격 계산
  const getCartTotal = () => {
    return cartItems.reduce((total, item) => total + item.price * item.quantity, 0)
  }

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        getCartTotal,
      }}
    >
      {children}
    </CartContext.Provider>
  )
}

// 커스텀 훅
export function useCart() {
  const context = useContext(CartContext)
  return context
}

