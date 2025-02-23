"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import type { Product } from "@/lib/types"
import ProductForm from "@/components/admin/ProductForm"

export default function AdminProducts() {
  const [products, setProducts] = useState<Product[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)
  const [isFormOpen, setIsFormOpen] = useState(false)

  useEffect(() => {
    fetchProducts()
  }, [])

  const fetchProducts = async () => {
    try {
      const response = await fetch("/api/products")
      if (!response.ok) throw new Error("Failed to fetch products")
      const data = await response.json()
      setProducts(data)
    } catch (err) {
      setError("Failed to load products")
    } finally {
      setIsLoading(false)
    }
  }

  const handleEdit = (product: Product) => {
    setEditingProduct(product)
    setIsFormOpen(true)
  }

  const handleDelete = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      try {
        const response = await fetch("/api/products", {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id }),
        })
        if (!response.ok) throw new Error("Failed to delete product")
        fetchProducts() // Refresh the product list
      } catch (err) {
        setError("Failed to delete product")
      }
    }
  }

  const handleSubmit = async (product: Product) => {
    try {
      const url = "/api/products"
      const method = editingProduct ? "PUT" : "POST"
      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(product),
      })
      if (!response.ok) throw new Error(`Failed to ${editingProduct ? "update" : "add"} product`)
      fetchProducts() // Refresh the product list
      setIsFormOpen(false)
      setEditingProduct(null)
    } catch (err) {
      setError(`Failed to ${editingProduct ? "update" : "add"} product`)
    }
  }

  if (isLoading) return <div>Loading...</div>
  if (error) return <div>Error: {error}</div>

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Products</h1>
        <Button onClick={() => setIsFormOpen(true)}>Add New Product</Button>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full bg-white shadow-md rounded-lg overflow-hidden">
          <thead className="bg-gray-100">
            <tr>
              <th className="py-2 px-4 text-left">ID</th>
              <th className="py-2 px-4 text-left">Name</th>
              <th className="py-2 px-4 text-left">Brand</th>
              <th className="py-2 px-4 text-left">Price</th>
              <th className="py-2 px-4 text-left">Category</th>
              <th className="py-2 px-4 text-left">Subcategory</th>
              <th className="py-2 px-4 text-left">Sizes</th>
              <th className="py-2 px-4 text-left">Colors</th>
              <th className="py-2 px-4 text-left">Specifications</th>
              <th className="py-2 px-4 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr key={product.id} className="border-t">
                <td className="py-2 px-4">{product.id}</td>
                <td className="py-2 px-4">{product.name}</td>
                <td className="py-2 px-4">{product.brand}</td>
                <td className="py-2 px-4">${product.price.toFixed(2)}</td>
                <td className="py-2 px-4">{product.category}</td>
                <td className="py-2 px-4">{product.subcategory}</td>
                <td className="py-2 px-4">{product.sizes.join(", ")}</td>
                <td className="py-2 px-4">{product.colors.join(", ")}</td>
                <td className="py-2 px-4">
                  {Object.entries(product.specifications).map(([key, value]) => (
                    <div key={key}>
                      {key}: {value}
                    </div>
                  ))}
                </td>
                <td className="py-2 px-4">
                  <Button variant="outline" size="sm" className="mr-2" onClick={() => handleEdit(product)}>
                    Edit
                  </Button>
                  <Button className="bg-theme-primary text-white hover:bg-theme-secondary" variant="destructive" size="sm" onClick={() => handleDelete(product.id)}>
                    Delete
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {isFormOpen && (
        <ProductForm
          product={editingProduct}
          onSubmit={handleSubmit}
          onCancel={() => {
            setIsFormOpen(false)
            setEditingProduct(null)
          }}
        />
      )}
    </div>
  )
}

