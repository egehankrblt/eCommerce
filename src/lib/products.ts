import productsData from "@/data/products.json"
import type { Product, Category } from "@/lib/types"

export function getProducts(): Product[] {
  return productsData.products
}

export function getCategories(): Category[] {
  return productsData.categories
}

export function getProductById(id: string): Product | undefined {
  return productsData.products.find((product) => product.id === id)
}

export function getProductsByCategory(categoryId: string): Product[] {
  return productsData.products.filter((product) => product.category === categoryId)
}

// Add more utility functions as needed

