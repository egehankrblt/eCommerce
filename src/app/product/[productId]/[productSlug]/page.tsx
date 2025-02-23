import { parseProductsJson } from "@/lib/json-parser"
import { promises as fs } from "fs"
import path from "path"
import { notFound } from "next/navigation"
import type { Product } from "@/lib/types"
import ProductDetails from "@/components/ProductDetails"

async function getProduct(productId: string): Promise<Product | undefined> {
  try {
    const jsonPath = path.join(process.cwd(), "public", "data", "products.json")
    const jsonContent = await fs.readFile(jsonPath, "utf-8")
    const { products } = await parseProductsJson(jsonContent)
    return products.find((p: Product) => p.id === productId)
  } catch (error) {
    console.error("Error fetching product:", error)
    return undefined
  }
}

export default async function ProductPage({ params }: { params: Promise<{ productId: string; productSlug: string }> }) {
  const { productId } = await params
  const product = await getProduct(productId)

  if (!product) {
    notFound()
  }

  return <ProductDetails product={product} />
}

export async function generateStaticParams() {
  try {
    const jsonPath = path.join(process.cwd(), "public", "data", "products.json")
    const jsonContent = await fs.readFile(jsonPath, "utf-8")
    const { products } = await parseProductsJson(jsonContent)

    return products.map((product: Product) => ({
      productId: product.id,
      productSlug: product.name.toLowerCase().replace(/\s+/g, "-"),
    }))
  } catch (error) {
    console.error("Error generating static params:", error)
    return []
  }
}

export const dynamicParams = true

