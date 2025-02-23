import { NextResponse } from "next/server"
import { promises as fs } from "fs"
import path from "path"
import { parseProductsJson } from "@/lib/json-parser"

export async function GET() {
  try {
    const jsonPath = path.join(process.cwd(), "public", "data", "products.json")
    const jsonContent = await fs.readFile(jsonPath, "utf-8")
    const { categories, products } = await parseProductsJson(jsonContent)

    return NextResponse.json({ categories, products })
  } catch (error) {
    console.error("Error reading products:", error)
    return NextResponse.json({ error: "Failed to fetch products" }, { status: 500 })
  }
}

