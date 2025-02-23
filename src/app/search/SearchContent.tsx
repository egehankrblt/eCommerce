"use client"

import { useState, useCallback } from "react"
import Link from "next/link"
import ProductCard from "@/components/products/product-card"
import { ProductFilters } from "@/components/ProductFilters"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import type { Product, Subcategory } from "@/lib/types"

interface SearchContentProps {
  query: string
  products: Product[]
  subcategories: Subcategory[]
}

export default function SearchContent({ query, products, subcategories }: SearchContentProps) {
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

  if (products.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">Search Results for "{query}"</h1>
        <div className="text-center py-8 text-gray-500 text-xl">No items found for your search query.</div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Search Results for "{query}"</h1>

      {/* Subcategories Navigation */}
      {subcategories.length > 0 && (
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4">Related Subcategories</h2>
          <div className="flex flex-wrap gap-4">
            {subcategories.map((subcategory) => (
              <Link
                key={subcategory.id}
                href={`/category/${subcategory.categoryId}/${subcategory.id}`}
                className="px-4 py-2 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors cursor-pointer"
              >
                {subcategory.name}
              </Link>
            ))}
          </div>
        </div>
      )}

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

