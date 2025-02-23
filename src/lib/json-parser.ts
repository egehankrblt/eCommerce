import type { Product, Category } from "@/lib/types"

interface RawSpecification {
  name: string
  text: string
}

interface RawProduct {
  id: string
  name: string
  brand: string
  price: number
  description: string
  sizes: string[]
  colors: string[]
  category: string
  subcategory: string
  specifications: Record<string, string>
  images: string[]
}

interface RawSubcategory {
  id: string
  name: string
  categoryId: string
  products: RawProduct[]
}

interface RawCategory {
  id: string
  name: string
  image: string
  subcategories: RawSubcategory[]
}

interface RawData {
  products: {
    category: RawCategory[]
  }
}

export async function parseProductsJson(jsonContent: string): Promise<{ categories: Category[]; products: Product[] }> {
  try {
    const result: RawData = JSON.parse(jsonContent)
    console.log("Parsed JSON:", JSON.stringify(result, null, 2)) // Debug log

    const categories: Category[] = result.products.category.map((rawCategory) => ({
      id: rawCategory.id,
      name: rawCategory.name,
      image: rawCategory.image,
      subcategories: rawCategory.subcategories.map((rawSubcategory) => ({
        id: rawSubcategory.id,
        name: rawSubcategory.name,
        categoryId: rawSubcategory.categoryId,
        products: [],
      })),
    }))

    const products: Product[] = result.products.category.flatMap((rawCategory) =>
      rawCategory.subcategories.flatMap((rawSubcategory) =>
        rawSubcategory.products.map((rawProduct) => ({
          id: rawProduct.id,
          name: rawProduct.name,
          brand: rawProduct.brand,
          price: rawProduct.price,
          description: rawProduct.description,
          sizes: rawProduct.sizes,
          colors: rawProduct.colors,
          category: rawProduct.category,
          subcategory: rawProduct.subcategory,
          specifications: rawProduct.specifications,
          images: rawProduct.images,
        })),
      ),
    )

    console.log("Processed products:", JSON.stringify(products, null, 2)) // Debug log

    // Assign products to their respective subcategories
    categories.forEach((category) => {
      category.subcategories.forEach((subcategory) => {
        subcategory.products = products.filter(
          (product) =>
            product.category.toLowerCase() === category.name.toLowerCase() &&
            product.subcategory.toLowerCase() === subcategory.name.toLowerCase(),
        )
      })
    })

    return { categories, products }
  } catch (error) {
    console.error("Error parsing JSON:", error)
    return { categories: [], products: [] }
  }
}

