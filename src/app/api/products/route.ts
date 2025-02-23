import { NextResponse } from "next/server"
import { promises as fs } from "fs"
import path from "path"
import { parseProductsJson } from "@/lib/json-parser"
import type { Product, Category } from "@/lib/types"

const JSON_PATH = path.join(process.cwd(), "public", "data", "products.json")

async function readJsonFile() {
  const jsonContent = await fs.readFile(JSON_PATH, "utf-8")
  return JSON.parse(jsonContent)
}

async function writeJsonFile(data: any) {
  await fs.writeFile(JSON_PATH, JSON.stringify(data, null, 2))
}

export async function GET() {
  try {
    const { products } = await parseProductsJson(await fs.readFile(JSON_PATH, "utf-8"))
    return NextResponse.json(products)
  } catch (error) {
    console.error("Error reading products:", error)
    return NextResponse.json({ error: "Failed to fetch products" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const newProduct: Product = await request.json()
    const data = await readJsonFile()

    // Find the correct category and subcategory
    const category = data.products.category.find((c: Category) => c.name === newProduct.category)
    if (!category) {
      return NextResponse.json({ error: "Category not found" }, { status: 400 })
    }

    const subcategory = category.subcategories.find((s: any) => s.name === newProduct.subcategory)
    if (!subcategory) {
      return NextResponse.json({ error: "Subcategory not found" }, { status: 400 })
    }

    // Add the new product
    subcategory.products.push(newProduct)

    await writeJsonFile(data)
    return NextResponse.json({ message: "Product added successfully" })
  } catch (error) {
    console.error("Error adding product:", error)
    return NextResponse.json({ error: "Failed to add product" }, { status: 500 })
  }
}

export async function PUT(request: Request) {
  try {
    const updatedProduct: Product = await request.json()
    const data = await readJsonFile()

    // Find and update the product
    let productUpdated = false
    data.products.category.forEach((category: Category) => {
      category.subcategories.forEach((subcategory: any) => {
        const index = subcategory.products.findIndex((p: Product) => p.id === updatedProduct.id)
        if (index !== -1) {
          subcategory.products[index] = updatedProduct
          productUpdated = true
        }
      })
    })

    if (!productUpdated) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 })
    }

    await writeJsonFile(data)
    return NextResponse.json({ message: "Product updated successfully" })
  } catch (error) {
    console.error("Error updating product:", error)
    return NextResponse.json({ error: "Failed to update product" }, { status: 500 })
  }
}

export async function DELETE(request: Request) {
  try {
    const { id } = await request.json()
    const data = await readJsonFile()

    // Find and remove the product
    let productDeleted = false
    data.products.category.forEach((category: Category) => {
      category.subcategories.forEach((subcategory: any) => {
        const index = subcategory.products.findIndex((p: Product) => p.id === id)
        if (index !== -1) {
          subcategory.products.splice(index, 1)
          productDeleted = true
        }
      })
    })

    if (!productDeleted) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 })
    }

    await writeJsonFile(data)
    return NextResponse.json({ message: "Product deleted successfully" })
  } catch (error) {
    console.error("Error deleting product:", error)
    return NextResponse.json({ error: "Failed to delete product" }, { status: 500 })
  }
}

