export interface Product {
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

export interface Subcategory {
  id: string
  name: string
  categoryId: string
  products: Product[]
}

export interface Category {
  id: string
  name: string
  subcategories: Subcategory[]
  image: string
}

export interface CountryCode {
  code: string
  name: string
  dial_code: string
}

