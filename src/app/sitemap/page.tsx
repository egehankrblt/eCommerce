import { parseProductsJson } from "@/lib/json-parser"
import { promises as fs } from "fs"
import path from "path"
import Link from "next/link"

export default async function Sitemap() {
  const jsonPath = path.join(process.cwd(), "public", "data", "products.json")
  const jsonContent = await fs.readFile(jsonPath, "utf-8")
  const { categories, products } = await parseProductsJson(jsonContent)

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Sitemap</h1>

      <h2 className="text-2xl font-semibold mb-4">Main Pages</h2>
      <ul className="list-disc pl-5 mb-8">
        <li>
          <Link href="/" className="text-primary hover:underline">
            Home
          </Link>
        </li>
      </ul>

      <h2 className="text-2xl font-semibold mb-4">Categories</h2>
      <ul className="list-disc pl-5 mb-8">
        {categories.map((category) => (
          <li key={category.id}>
            <Link href={`/category/${category.id}`} className="text-primary hover:underline">
              {category.name}
            </Link>
          </li>
        ))}
      </ul>

      <h2 className="text-2xl font-semibold mb-4">Products</h2>
      <ul className="list-disc pl-5">
        {products.map((product) => (
          <li key={product.id}>
            <Link href={`/product/${product.id}`} className="text-primary hover:underline">
              {product.name}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  )
}

