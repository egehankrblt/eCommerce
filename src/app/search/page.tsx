import { parseProductsJson } from "@/lib/json-parser"
import { promises as fs } from "fs"
import path from "path"
import SearchContent from "./SearchContent"
import type { Product, Subcategory } from "@/lib/types"

async function getSearchResults(query: string): Promise<{ products: Product[]; subcategories: Subcategory[] }> {
  const jsonPath = path.join(process.cwd(), "public", "data", "products.json")
  const jsonContent = await fs.readFile(jsonPath, "utf-8")
  const { products, categories } = await parseProductsJson(jsonContent)

  const searchResults = products.filter(
    (product: Product) =>
      product.name.toLowerCase().includes(query.toLowerCase()) ||
      product.description.toLowerCase().includes(query.toLowerCase()),
  )

  const subcategories = new Set<Subcategory>()
  searchResults.forEach((product: Product) => {
    const category = categories.find((c) => c.name === product.category)
    if (category) {
      const subcategory = category.subcategories.find((s) => s.name === product.subcategory)
      if (subcategory) {
        subcategories.add(subcategory)
      }
    }
  })

  return {
    products: searchResults,
    subcategories: Array.from(subcategories),
  }
}

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ q: string }>
}) {
  const { q: query } = await searchParams
  const { products, subcategories } = await getSearchResults(query)

  return <SearchContent query={query} products={products} subcategories={subcategories} />
}

