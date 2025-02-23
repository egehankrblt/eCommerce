"use client"

import { useState, useCallback } from "react"
import Link from "next/link"
import ProductCard from "@/components/products/product-card"
import { ProductFilters } from "@/components/ProductFilters"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import type { Product, Category, Subcategory } from "@/lib/types"

interface SubcategoryContentProps {
  category: Category
  subcategory: Subcategory
  products: Product[]
}

export default function SubcategoryContent({ category, subcategory, products }: SubcategoryContentProps) {
  const [filteredProducts, setFilteredProducts] = useState(products)
  const [sortOption, setSortOption] = useState("featured")

  const handleFilterChange = useCallback(
    (filters: { [key: string]: string | number | string[] }) => {
      const filtered = products.filter((product) => {
        if (product.price < (filters.minPrice as number) || product.price > (filters.maxPrice as number)) {
          return false
        }

        for (const [key, value] of Object.entries(filters)) {
          if (key === "minPrice" || key === "maxPrice") continue

          if (Array.isArray(value) && value.length > 0) {
            if (key === "size" && !value.some((v) => product.sizes.includes(v))) return false
            if (key === "color" && !value.some((v) => product.colors.includes(v))) return false
            if (key in product.specifications && !value.includes(product.specifications[key])) return false
          }
        }

        return true
      })

      setFilteredProducts(filtered)
    },
    [products],
  )

  const handleSortChange = useCallback((sort: string) => {
    setSortOption(sort)
    setFilteredProducts((prev) => {
      const sorted = [...prev]
      switch (sort) {
        case "price_asc":
          sorted.sort((a, b) => a.price - b.price)
          break
        case "price_desc":
          sorted.sort((a, b) => b.price - a.price)
          break
        case "name_asc":
          sorted.sort((a, b) => a.name.localeCompare(b.name))
          break
        case "name_desc":
          sorted.sort((a, b) => b.name.localeCompare(a.name))
          break
      }
      return sorted
    })
  }, [])

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <Link href={`/category/${category.id}`} className="text-blue-600 hover:underline cursor-pointer">
          &larr; Back to {category.name}
        </Link>
      </div>
      <h1 className="text-3xl font-bold mb-6">{subcategory.name}</h1>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="md:col-span-1">
          <ProductFilters products={products} onFilterChange={handleFilterChange} />
        </div>
        <div className="md:col-span-3">
          <div className="flex justify-end mb-4">
            <Select value={sortOption} onValueChange={handleSortChange}>
              <SelectTrigger className="w-[200px] border rounded-md px-4 py-2 bg-white">
                <SelectValue placeholder="Sort by best results" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="featured">Best Results</SelectItem>
                <SelectItem value="price_asc">Price: Low to High</SelectItem>
                <SelectItem value="price_desc">Price: High to Low</SelectItem>
                <SelectItem value="name_asc">Name: A to Z</SelectItem>
                <SelectItem value="name_desc">Name: Z to A</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
          {filteredProducts.length === 0 && (
            <div className="text-center py-8 text-gray-500">No products found matching your filters.</div>
          )}
        </div>
      </div>
    </div>
  )
}

