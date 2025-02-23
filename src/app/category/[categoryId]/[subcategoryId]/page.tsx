import { notFound } from "next/navigation"
import { promises as fs } from "fs"
import path from "path"
import { parseProductsJson } from "@/lib/json-parser"
import SubcategoryContent from "./SubcategoryContent"
import type { Product, Category } from "@/lib/types"

async function getData(): Promise<{ categories: Category[]; products: Product[] }> {
  const jsonPath = path.join(process.cwd(), "public", "data", "products.json")
  const jsonContent = await fs.readFile(jsonPath, "utf-8")
  return parseProductsJson(jsonContent)
}

export default async function SubcategoryPage({
  params,
}: {
  params: Promise<{ categoryId: string; subcategoryId: string }>
}) {
  const { categories, products } = await getData()
  const { categoryId, subcategoryId } = await params

  const category = categories.find((c) => c.id === categoryId)

  if (!category) {
    notFound()
  }

  const subcategory = category.subcategories.find((s) => s.id === subcategoryId)

  if (!subcategory) {
    notFound()
  }

  const subcategoryProducts = products.filter(
    (product) =>
      product.category.toLowerCase() === category.name.toLowerCase() &&
      product.subcategory.toLowerCase() === subcategory.name.toLowerCase(),
  )

  return <SubcategoryContent category={category} subcategory={subcategory} products={subcategoryProducts} />
}

