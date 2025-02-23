import { notFound } from "next/navigation"
import { promises as fs } from "fs"
import path from "path"
import { parseProductsJson } from "@/lib/json-parser"
import CategoryContent from "./CategoryContent"
import type { Product, Category } from "@/lib/types"

async function getData(): Promise<{ categories: Category[]; products: Product[] }> {
  const jsonPath = path.join(process.cwd(), "public", "data", "products.json")
  const jsonContent = await fs.readFile(jsonPath, "utf-8")
  return parseProductsJson(jsonContent)
}

export default async function CategoryPage({ params }: { params: Promise<{ categoryId: string }> }) {
  const { categories, products } = await getData()
  const { categoryId } = await params

  const category = categories.find((c) => c.id === categoryId)

  if (!category) {
    notFound()
  }

  const categoryProducts = products.filter((p) => p.category.toLowerCase() === category.name.toLowerCase())

  return <CategoryContent category={category} products={categoryProducts} />
}

