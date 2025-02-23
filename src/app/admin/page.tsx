import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { promises as fs } from "fs"
import path from "path"
import { parseProductsJson } from "@/lib/json-parser"
import { getAdminOrders } from "@/lib/adminStorage"


async function getDashboardData() {
  const jsonPath = path.join(process.cwd(), "public", "data", "products.json")
  const jsonContent = await fs.readFile(jsonPath, "utf-8")
  const { categories, products } = await parseProductsJson(jsonContent)
  const orders = await getAdminOrders() // Await the getAdminOrders function

  return {
    totalProducts: products.length,
    totalCategories: categories.length,
    totalOrders: orders.length,
  }
}

export default async function AdminDashboard() {
  const { totalProducts, totalCategories, totalOrders } = await getDashboardData()

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Total Products</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{totalProducts}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Total Categories</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{totalCategories}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Total Orders</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{totalOrders}</p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

