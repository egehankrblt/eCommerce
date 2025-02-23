"use client"

import type React from "react"
import { createContext, useContext, useReducer, useEffect } from "react"
import { useAuth } from "./AuthContext"
import { readDatabase, updateDatabase, type CartItem, type Address, type Order } from "@/lib/databaseUtils"

interface CartState {
  items: CartItem[]
}

type CartAction =
  | { type: "ADD_TO_CART"; payload: CartItem }
  | { type: "REMOVE_FROM_CART"; payload: string }
  | { type: "UPDATE_QUANTITY"; payload: { id: string; quantity: number } }
  | { type: "CLEAR_CART" }
  | { type: "LOAD_CART"; payload: CartItem[] }

const CartContext = createContext<
  | {
      state: CartState
      dispatch: React.Dispatch<CartAction>
      createOrder: (shippingAddress: Address) => Promise<void>
      getOrders: () => Promise<Order[]>
      getUserAddresses: () => Promise<Address[]>
      addUserAddress: (address: Address) => Promise<void>
    }
  | undefined
>(undefined)

const cartReducer = (state: CartState, action: CartAction): CartState => {
  switch (action.type) {
    case "ADD_TO_CART":
      const existingItemIndex = state.items.findIndex(
        (item) =>
          item.id === action.payload.id &&
          item.selectedSize === action.payload.selectedSize &&
          item.selectedColor === action.payload.selectedColor,
      )
      if (existingItemIndex > -1) {
        const newItems = [...state.items]
        newItems[existingItemIndex].quantity += 1
        return { ...state, items: newItems }
      }
      return { ...state, items: [...state.items, { ...action.payload, quantity: 1 }] }
    case "REMOVE_FROM_CART":
      return { ...state, items: state.items.filter((item) => item.id !== action.payload) }
    case "UPDATE_QUANTITY":
      return {
        ...state,
        items: state.items.map((item) =>
          item.id === action.payload.id ? { ...item, quantity: action.payload.quantity } : item,
        ),
      }
    case "CLEAR_CART":
      return { items: [] }
    case "LOAD_CART":
      return { items: action.payload }
    default:
      return state
  }
}

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth()
  const [state, dispatch] = useReducer(cartReducer, { items: [] })

  useEffect(() => {
    const loadCart = async () => {
      if (user) {
        const data = await readDatabase()
        const userData = data.users[user.email]
        if (userData) {
          dispatch({ type: "LOAD_CART", payload: userData.cart })
        }
      }
    }
    loadCart()
  }, [user])

  useEffect(() => {
    const saveCart = async () => {
      if (user) {
        await updateDatabase((data) => ({
          ...data,
          users: {
            ...data.users,
            [user.email]: {
              ...data.users[user.email],
              cart: state.items,
            },
          },
        }))
      }
    }
    saveCart()
  }, [state.items, user])

  const createOrder = async (shippingAddress: Address) => {
    if (!user) {
      throw new Error("User must be logged in to create an order")
    }

    const data = await readDatabase()
    const userData = data.users[user.email]
    const newOrderId = userData.orders.length > 0 ? Math.max(...userData.orders.map((o: Order) => o.id)) + 1 : 1
    const total = state.items.reduce((sum, item) => sum + item.price * item.quantity, 0)

    const newOrder: Order = {
      id: newOrderId,
      items: [...state.items],
      total,
      date: new Date().toISOString(),
      shippingAddress,
      userEmail: user.email,
    }

    await updateDatabase((data) => ({
      ...data,
      users: {
        ...data.users,
        [user.email]: {
          ...data.users[user.email],
          orders: [...data.users[user.email].orders, newOrder],
          cart: [],
        },
      },
      adminOrders: [...data.adminOrders, newOrder],
    }))

    dispatch({ type: "CLEAR_CART" })
  }

  const getOrders = async (): Promise<Order[]> => {
    if (!user) {
      return []
    }
    const data = await readDatabase()
    return data.users[user.email]?.orders || []
  }

  const getUserAddresses = async (): Promise<Address[]> => {
    if (!user) {
      return []
    }
    const data = await readDatabase()
    return data.users[user.email]?.addresses || []
  }

  const addUserAddress = async (address: Address) => {
    if (!user) {
      throw new Error("User must be logged in to add an address")
    }
    await updateDatabase((data) => ({
      ...data,
      users: {
        ...data.users,
        [user.email]: {
          ...data.users[user.email],
          addresses: [...(data.users[user.email].addresses || []), address],
        },
      },
    }))
  }

  return (
    <CartContext.Provider value={{ state, dispatch, createOrder, getOrders, getUserAddresses, addUserAddress }}>
      {children}
    </CartContext.Provider>
  )
}

export const useCart = () => {
  const context = useContext(CartContext)
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider")
  }
  return context
}

