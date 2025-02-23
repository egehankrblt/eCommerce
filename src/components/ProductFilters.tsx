"use client"

import { useState, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { Input } from "@/components/ui/input"
import { Filter, ChevronDown, ChevronUp } from "lucide-react"
import type { Product } from "@/lib/types"

interface ProductFiltersProps {
  products: Product[]
  onFilterChange: (filters: FilterOptions) => void
}

interface FilterOptions {
  [key: string]: string | number | string[]
  minPrice: number
  maxPrice: number
}

export function ProductFilters({ products, onFilterChange }: ProductFiltersProps) {
  const maxCategoryPrice = Math.ceil(Math.max(...products.map((p) => p.price)) / 100) * 100

  const attributes = new Map<string, Set<string>>()
  products.forEach((product) => {
    if (product.sizes.length > 0) {
      if (!attributes.has("size")) attributes.set("size", new Set())
      product.sizes.forEach((size) => attributes.get("size")!.add(size))
    }
    if (product.colors.length > 0) {
      if (!attributes.has("color")) attributes.set("color", new Set())
      product.colors.forEach((color) => attributes.get("color")!.add(color))
    }
    Object.entries(product.specifications).forEach(([key, value]) => {
      if (!attributes.has(key)) attributes.set(key, new Set())
      attributes.get(key)!.add(value)
    })
  })

  const [expandedSections, setExpandedSections] = useState<{ [key: string]: boolean }>({
    price: true,
    ...Object.fromEntries([...attributes.keys()].map((key) => [key, true])),
  })

  const [filters, setFilters] = useState<FilterOptions>({
    minPrice: 0,
    maxPrice: maxCategoryPrice,
    ...Object.fromEntries([...attributes.keys()].map((key) => [key, []])),
  })

  const [priceRange, setPriceRange] = useState([0, maxCategoryPrice])

  const toggleSection = (section: string) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }))
  }

  const handleSliderChange = (value: number[]) => {
    setPriceRange(value)
    setFilters((prev) => ({
      ...prev,
      minPrice: value[0],
      maxPrice: value[1],
    }))
  }

  const handleInputChange = (type: "min" | "max", value: string) => {
    const numValue = Number.parseInt(value) || 0
    const newRange = type === "min" ? [numValue, priceRange[1]] : [priceRange[0], numValue]
    setPriceRange(newRange)
    setFilters((prev) => ({
      ...prev,
      minPrice: newRange[0],
      maxPrice: newRange[1],
    }))
  }

  const handleAttributeChange = (attribute: string, value: string) => {
    setFilters((prev) => {
      const currentValues = prev[attribute] as string[]
      const newValues = currentValues.includes(value)
        ? currentValues.filter((v) => v !== value)
        : [...currentValues, value]
      return {
        ...prev,
        [attribute]: newValues,
      }
    })
  }

  const applyFilters = useCallback(() => {
    onFilterChange(filters)
  }, [filters, onFilterChange])

  return (
    <div className="space-y-6">
      {/* Price Range Filter */}
      <div className="space-y-4">
        <div className="flex justify-between items-center cursor-pointer" onClick={() => toggleSection("price")}>
          <h3 className="font-semibold text-lg">Price Range</h3>
          {expandedSections.price ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
        </div>

        {expandedSections.price && (
          <div className="space-y-4">
            <div className="flex gap-4">
              <div className="flex-1">
                <Input
                  type="number"
                  value={priceRange[0]}
                  onChange={(e) => handleInputChange("min", e.target.value)}
                  className="w-full border rounded-md p-2"
                  placeholder="Min"
                />
              </div>
              <div className="flex-1">
                <Input
                  type="number"
                  value={priceRange[1]}
                  onChange={(e) => handleInputChange("max", e.target.value)}
                  className="w-full border rounded-md p-2"
                  placeholder="Max"
                />
              </div>
            </div>

            <Slider
              min={0}
              max={maxCategoryPrice}
              step={10}
              value={priceRange}
              onValueChange={handleSliderChange}
              className="w-full"
            />
          </div>
        )}
      </div>

      {/* Dynamic Attribute Filters */}
      {[...attributes.entries()].map(([attribute, values]) => (
        <div key={attribute} className="space-y-4">
          <div className="flex justify-between items-center cursor-pointer" onClick={() => toggleSection(attribute)}>
            <h3 className="font-semibold text-lg capitalize">{attribute}</h3>
            {expandedSections[attribute] ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
          </div>

          {expandedSections[attribute] && (
            <div className="space-y-2">
              {[...values].map((value) => (
                <div key={value} className="flex items-center">
                  <input
                    type="checkbox"
                    id={`${attribute}-${value}`}
                    checked={(filters[attribute] as string[]).includes(value)}
                    onChange={() => handleAttributeChange(attribute, value)}
                    className="mr-2"
                  />
                  <label htmlFor={`${attribute}-${value}`}>{value}</label>
                </div>
              ))}
            </div>
          )}
        </div>
      ))}

      <Button onClick={applyFilters} className="w-full" variant="default">
        <Filter className="w-4 h-4 mr-2" />
        Apply Filters
      </Button>
    </div>
  )
}

