"use client"

import { useCart } from "@/contexts/CartContext"
import Image from "next/image"

export default function CartReview() {
  const { state } = useCart()

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-4">Cart Review</h2>
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
          <p className="font-semibold">${(item.price * item.quantity).toFixed(2)}</p>
        </div>
      ))}
      <div className="mt-4 text-right">
        <p className="text-xl font-semibold">
          Total: ${state.items.reduce((sum, item) => sum + item.price * item.quantity, 0).toFixed(2)}
        </p>
      </div>
    </div>
  )
}

