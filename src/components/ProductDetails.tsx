"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import type { Product } from "@/lib/types"
import AddToCartButton from "@/components/AddToCartButton"
import { Button } from "@/components/ui/button"
import { ChevronLeft } from "lucide-react"

interface ProductDetailsProps {
  product: Product
}

export default function ProductDetails({ product }: ProductDetailsProps) {
  const [selectedSize, setSelectedSize] = useState<string | undefined>()
  const [selectedColor, setSelectedColor] = useState<string | undefined>()
  const [selectedImage, setSelectedImage] = useState<string>(
    product.images[0] || `https://via.placeholder.com/600x600?text=${encodeURIComponent(product.name)}`,
  )

  useEffect(() => {
    console.log("ProductDetails - product:", product)
  }, [product])

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <Link href="/" className="inline-flex items-center text-sm text-muted-foreground hover:text-primary">
          <ChevronLeft className="w-4 h-4 mr-1" />
          Back to Products
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-12 gap-y-8">
        <div className="space-y-4">
          <div className="relative aspect-square overflow-hidden rounded-lg bg-gray-100">
            <Image
              src={selectedImage || "/placeholder.svg"}
              alt={product.name}
              fill
              className="object-cover"
              sizes="(min-width: 1024px) 40vw, 80vw"
              priority
            />
          </div>
          <div className="grid grid-cols-4 gap-4">
            {product.images.map((image, index) => (
              <button
                key={index}
                onClick={() => setSelectedImage(image)}
                className={`relative aspect-square overflow-hidden rounded-lg bg-gray-100 ${
                  selectedImage === image ? "ring-2 ring-primary" : ""
                }`}
                aria-label={`View ${product.name} - Image ${index + 1}`}
              >
                <Image
                  src={image || `https://via.placeholder.com/150x150?text=${encodeURIComponent(product.name)}`}
                  alt={`${product.name} - View ${index + 1}`}
                  fill
                  className="object-cover"
                  sizes="(min-width: 1024px) 10vw, 20vw"
                />
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold">{product.name}</h1>
            <p className="text-xl font-semibold mt-2">${product.price.toFixed(2)}</p>
            <p className="text-muted-foreground mt-4">{product.description}</p>
          </div>

          {product.specifications && Object.keys(product.specifications).length > 0 && (
            <div>
              <h2 className="text-lg font-semibold mb-3">Specifications</h2>
              <dl className="grid grid-cols-1 gap-x-4 gap-y-2 sm:grid-cols-2">
                {Object.entries(product.specifications).map(([key, value]) => (
                  <div key={key} className="grid grid-cols-2">
                    <dt className="font-medium text-muted-foreground">{key}:</dt>
                    <dd>{value}</dd>
                  </div>
                ))}
              </dl>
            </div>
          )}

          {product.sizes.length > 0 && (
            <div>
              <h2 className="text-lg font-semibold mb-3">Size</h2>
              <div className="flex flex-wrap gap-3">
                {product.sizes.map((size) => (
                  <Button
                    key={size}
                    variant="outline"
                    size="lg"
                    onClick={() => setSelectedSize(size)}
                    className={selectedSize === size ? "border-primary" : ""}
                    aria-pressed={selectedSize === size}
                  >
                    {size}
                  </Button>
                ))}
              </div>
            </div>
          )}

          {product.colors.length > 0 && (
            <div>
              <h2 className="text-lg font-semibold mb-3">Color</h2>
              <div className="flex flex-wrap gap-3">
                {product.colors.map((color) => (
                  <Button
                    key={color}
                    variant="outline"
                    size="lg"
                    onClick={() => setSelectedColor(color)}
                    className={selectedColor === color ? "border-primary" : ""}
                    aria-pressed={selectedColor === color}
                  >
                    {color}
                  </Button>
                ))}
              </div>
            </div>
          )}

          <div className="pt-6">
            <AddToCartButton product={product} selectedSize={selectedSize} selectedColor={selectedColor} />
          </div>
        </div>
      </div>
    </div>
  )
}

