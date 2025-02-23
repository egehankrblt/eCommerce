import { parseProductsJson } from "@/lib/json-parser"
import { promises as fs } from "fs"
import path from "path"
import CategoryCard from "@/components/categories/category-card"
import Image from "next/image"
import { storeName, welcomeMessage, icon } from "public/data/storeConfig"

export default async function Home() {
  const jsonPath = path.join(process.cwd(), "public", "data", "products.json")
  const jsonContent = await fs.readFile(jsonPath, "utf-8")
  const { categories, products } = await parseProductsJson(jsonContent)

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-start mb-8">
        <div className="flex flex-col items-center mr-8">
          <div className="w-32 h-32 relative mb-4">
            <Image src={icon || "/placeholder.svg"} alt="Store Favicon" fill className="object-contain" />
          </div>
          <h2 className="text-xl font-semibold text-theme-primary">{storeName}</h2>
        </div>
        <div className="flex-1">
          <h1 className="text-4xl font-bold mb-8 text-theme-primary">{welcomeMessage}</h1>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {categories.map((category) => (
              <CategoryCard key={category.id} category={category} />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

