"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useCart } from "@/contexts/CartContext"
import { Button } from "@/components/ui/button"
import Image from "next/image"
import { Trash2, Plus, Minus } from "lucide-react"
import Link from "next/link"

const ShoppingCart: React.FC = () => {
  const { state, dispatch } = useCart()
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  const removeFromCart = (id: string) => {
    dispatch({ type: "REMOVE_FROM_CART", payload: id })
  }

  const updateQuantity = (id: string, quantity: number) => {
    dispatch({ type: "UPDATE_QUANTITY", payload: { id, quantity } })
  }

  const clearCart = () => {
    dispatch({ type: "CLEAR_CART" })
  }

  const total = state.items.reduce((sum, item) => sum + item.price * item.quantity, 0)

  if (!isClient) {
    return <div className="bg-white p-6 rounded-lg shadow-lg">Loading...</div>
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-4">Shopping Cart</h2>
      {state.items.length === 0 ? (
        <p>Your cart is empty.</p>
      ) : (
        <>
          {state.items.map((item) => (
            <div
              key={`${item.id}-${item.selectedSize}-${item.selectedColor}`}
              className="flex items-center mb-4 border-b pb-4"
            >
              <Image
                src={item.images[0] || "/placeholder.svg"}
                alt={item.name}
                width={80}
                height={80}
                className="object-cover rounded-md mr-4"
              />
              <div className="flex-grow">
                <h3 className="font-semibold">{item.name}</h3>
                <p className="text-gray-600">
                  ${item.price.toFixed(2)} x {item.quantity}
                </p>
                {item.selectedSize && <p className="text-sm text-gray-500">Size: {item.selectedSize}</p>}
                {item.selectedColor && <p className="text-sm text-gray-500">Color: {item.selectedColor}</p>}
              </div>
              <div className="flex items-center">
                <Button
                  onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))}
                  variant="outline"
                  size="icon"
                >
                  <Minus className="h-4 w-4" />
                </Button>
                <span className="mx-2">{item.quantity}</span>
                <Button onClick={() => updateQuantity(item.id, item.quantity + 1)} variant="outline" size="icon">
                  <Plus className="h-4 w-4" />
                </Button>
                <Button
                  onClick={() => removeFromCart(item.id)}
                  variant="ghost"
                  size="icon"
                  className="ml-4 text-red-500"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
          <div className="border-t pt-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold">Total:</h3>
              <p className="text-xl">${total.toFixed(2)}</p>
            </div>
            <div className="flex justify-between items-center">
              <Button onClick={clearCart} variant="outline">
                Clear Cart
              </Button>
              <Link href="/checkout">
                <Button size="lg">Proceed to Checkout</Button>
              </Link>
            </div>
          </div>
        </>
      )}
    </div>
  )
}

export default ShoppingCart

