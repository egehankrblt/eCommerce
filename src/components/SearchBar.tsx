"use client"

import type React from "react"
import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Search } from "lucide-react"
import SearchResults from "./SearchResults"
import type { Product } from "@/lib/types"

export default function SearchBar() {
  const [searchTerm, setSearchTerm] = useState("")
  const [searchResults, setSearchResults] = useState<Product[]>([])
  const [showResults, setShowResults] = useState(false)
  const router = useRouter()
  const searchBarRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchBarRef.current && !searchBarRef.current.contains(event.target as Node)) {
        setShowResults(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (searchTerm) {
        fetchSearchResults(searchTerm)
      } else {
        setSearchResults([])
      }
    }, 300)

    return () => clearTimeout(delayDebounceFn)
  }, [searchTerm])

  const fetchSearchResults = async (term: string) => {
    try {
      const response = await fetch(`/api/search?q=${encodeURIComponent(term)}`)
      if (!response.ok) throw new Error("Failed to fetch search results")
      const data = await response.json()
      setSearchResults(data.products)
      setShowResults(true)
    } catch (error) {
      console.error("Error fetching search results:", error)
      setSearchResults([])
    }
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchTerm.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchTerm.trim())}`)
      setShowResults(false)
    }
  }

  const handleResultClick = () => {
    setShowResults(false)
    setSearchTerm("")
  }

  return (
    <div ref={searchBarRef} className="relative w-full max-w-sm">
      <form onSubmit={handleSearch} className="flex items-center space-x-2">
        <Input
          type="text"
          placeholder="Search products..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="flex-grow"
        />
        <Button type="submit" className="bg-theme-primary text-white hover:bg-theme-secondary" size="icon">
          <Search className="h-4 w-4" />
          <span className="sr-only">Search</span>
        </Button>
      </form>
      {showResults && <SearchResults results={searchResults} onResultClick={handleResultClick} />}
    </div>
  )
}

