"use client"

import type React from "react"
import { useCart } from "@/contexts/CartContext"
import type { Product } from "@/lib/types"
import { Button } from "@/components/ui/button"
import { ShoppingCart } from "lucide-react"

interface AddToCartButtonProps {
  product: Product
  selectedSize?: string
  selectedColor?: string
}

const AddToCartButton: React.FC<AddToCartButtonProps> = ({ product, selectedSize, selectedColor }) => {
  const { dispatch } = useCart()

  const handleAddToCart = () => {
    dispatch({
      type: "ADD_TO_CART",
      payload: {
        ...product,
        selectedSize,
        selectedColor,
        quantity: 1, // Add this line
      },
    })
  }

  return (
    <Button
      onClick={handleAddToCart}
      className="w-full bg-red-600 bg-theme-primary text-white hover:bg-theme-secondary"
      disabled={!selectedSize || !selectedColor}
    >
      <ShoppingCart className="mr-2 h-5 w-5" /> Add to Cart
    </Button>
  )
}

export default AddToCartButton

