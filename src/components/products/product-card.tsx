"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import type { Product } from "@/lib/types"
import AddToCartButton from "@/components/AddToCartButton"
import { Button } from "@/components/ui/button"

export default function ProductCard({ product }: { product: Product }) {
  const [selectedSize, setSelectedSize] = useState<string | undefined>()
  const [selectedColor, setSelectedColor] = useState<string | undefined>()
  const productSlug = encodeURIComponent(product.name.toLowerCase().replace(/\s+/g, "-"))

  useEffect(() => {
    if (product.sizes.length === 1) {
      setSelectedSize(product.sizes[0])
    }
    if (product.colors.length === 1) {
      setSelectedColor(product.colors[0])
    }
  }, [product])

  return (
    <div className="border rounded-lg overflow-hidden transition-shadow hover:shadow-lg p-4">
      <Link href={`/product/${product.id}/${productSlug}`} className="block group">
        <div className="relative aspect-square mb-4 overflow-hidden rounded-lg bg-gray-100">
          <Image
            src={product.images[0] || `https://via.placeholder.com/400x400?text=${encodeURIComponent(product.name)}`}
            alt={product.name}
            fill
            className="object-cover transition-transform group-hover:scale-105"
            sizes="(min-width: 1024px) 20vw, (min-width: 768px) 25vw, (min-width: 640px) 33vw, 50vw"
          />
        </div>
        <div className="space-y-1">
          <h3 className="font-medium text-lg group-hover:text-primary transition-colors">{product.name}</h3>
          <p className="text-sm text-muted-foreground">{product.brand}</p>
          <p className="font-semibold text-lg">${product.price.toFixed(2)}</p>
          <p className="text-sm text-muted-foreground line-clamp-2">{product.description}</p>
        </div>
      </Link>

      <div className="mt-4 space-y-4">
        {product.sizes.length > 0 && (
          <div>
            <h4 className="text-sm font-medium mb-2">Size</h4>
            <div className="flex flex-wrap gap-2">
              {product.sizes.map((size) => (
                <Button
                  key={size}
                  variant="outline"
                  size="sm"
                  onClick={() => setSelectedSize(size)}
                  className={`min-w-[3rem] ${selectedSize === size ? "border-black border-2" : ""}`}
                >
                  {size}
                </Button>
              ))}
            </div>
          </div>
        )}

        {product.colors.length > 0 && (
          <div>
            <h4 className="text-sm font-medium mb-2">Color</h4>
            <div className="flex flex-wrap gap-2">
              {product.colors.map((color) => (
                <Button
                  key={color}
                  variant="outline"
                  size="sm"
                  onClick={() => setSelectedColor(color)}
                  className={`min-w-[3rem] ${selectedColor === color ? "border-black border-2" : ""}`}
                >
                  {color}
                </Button>
              ))}
            </div>
          </div>
        )}

        <div className="pt-4">
          <AddToCartButton product={product} selectedSize={selectedSize} selectedColor={selectedColor} />
        </div>
      </div>
    </div>
  )
}

