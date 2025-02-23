"use client"

import { useState, useEffect } from "react"
import dynamic from "next/dynamic"
import Link from "next/link"

const DynamicShoppingCart = dynamic(() => import("@/components/ShoppingCart"), {
  loading: () => <p>Loading cart...</p>,
})

export default function CartPage() {
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Your Shopping Cart</h1>
      {isClient && <DynamicShoppingCart />}
      <div className="mt-8">
        <Link href="/" className="text-blue-600 hover:underline">
          Continue Shopping
        </Link>
      </div>
    </div>
  )
}

