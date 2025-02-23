import type React from "react"
import Image from "next/image"
import Link from "next/link"
import type { Product } from "@/lib/types"

interface SearchResultsProps {
  results: Product[]
  onResultClick: () => void
}

const SearchResults: React.FC<SearchResultsProps> = ({ results, onResultClick }) => {
  if (results.length === 0) return null

  return (
    <div className="absolute z-10 mt-1 w-full bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-auto">
      {results.map((product) => (
        <Link
          key={product.id}
          href={`/product/${product.id}/${encodeURIComponent(product.name.toLowerCase().replace(/\s+/g, "-"))}`}
          className="flex items-center p-2 hover:bg-gray-100 transition-colors duration-150 ease-in-out"
          onClick={onResultClick}
        >
          <Image
            src={product.images[0] || "/placeholder.svg"}
            alt={product.name}
            width={40}
            height={40}
            className="object-cover rounded-md mr-3"
          />
          <span className="text-sm">{product.name}</span>
        </Link>
      ))}
    </div>
  )
}

export default SearchResults

