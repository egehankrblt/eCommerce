import { NextResponse } from "next/server"
import { promises as fs } from "fs"
import path from "path"
import { parseProductsJson } from "@/lib/json-parser"

const JSON_PATH = path.join(process.cwd(), "public", "data", "products.json")

export async function GET() {
  try {
    const jsonContent = await fs.readFile(JSON_PATH, "utf-8")
    const { categories } = await parseProductsJson(jsonContent)
    return NextResponse.json(categories)
  } catch (error) {
    console.error("Error reading categories:", error)
    return NextResponse.json({ error: "Failed to fetch categories" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const newCategory: Category = await request.json()
    const jsonContent = await fs.readFile(JSON_PATH, "utf-8")
    const { categories, products } = await parseProductsJson(jsonContent)

    // Add new category
    categories.push(newCategory)

    // Update JSON
    const updatedJson = JSON.stringify({ products: { category: categories } }, null, 2)
    await fs.writeFile(JSON_PATH, updatedJson)

    return NextResponse.json({ message: "Category added successfully" })
  } catch (error) {
    console.error("Error adding category:", error)
    return NextResponse.json({ error: "Failed to add category" }, { status: 500 })
  }
}

export async function PUT(request: Request) {
  try {
    const updatedCategory: Category = await request.json()
    const jsonContent = await fs.readFile(JSON_PATH, "utf-8")
    const { categories, products } = await parseProductsJson(jsonContent)

    // Update category
    const index = categories.findIndex((c) => c.id === updatedCategory.id)
    if (index !== -1) {
      categories[index] = updatedCategory
    } else {
      return NextResponse.json({ error: "Category not found" }, { status: 404 })
    }

    // Update JSON
    const updatedJson = JSON.stringify({ products: { category: categories } }, null, 2)
    await fs.writeFile(JSON_PATH, updatedJson)

    return NextResponse.json({ message: "Category updated successfully" })
  } catch (error) {
    console.error("Error updating category:", error)
    return NextResponse.json({ error: "Failed to update category" }, { status: 500 })
  }
}

export async function DELETE(request: Request) {
  try {
    const { id } = await request.json()
    const jsonContent = await fs.readFile(JSON_PATH, "utf-8")
    const { categories, products } = await parseProductsJson(jsonContent)

    // Remove category
    const updatedCategories = categories.filter((c) => c.id !== id)

    // Update JSON
    const updatedJson = JSON.stringify({ products: { category: updatedCategories } }, null, 2)
    await fs.writeFile(JSON_PATH, updatedJson)

    return NextResponse.json({ message: "Category deleted successfully" })
  } catch (error) {
    console.error("Error deleting category:", error)
    return NextResponse.json({ error: "Failed to delete category" }, { status: 500 })
  }
}

