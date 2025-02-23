"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import type { Category } from "@/lib/types"
import CategoryForm from "@/components/admin/CategoryForm"

export default function AdminCategories() {
  const [categories, setCategories] = useState<Category[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [editingCategory, setEditingCategory] = useState<Category | null>(null)
  const [isFormOpen, setIsFormOpen] = useState(false)

  useEffect(() => {
    fetchCategories()
  }, [])

  const fetchCategories = async () => {
    try {
      const response = await fetch("/api/categories")
      if (!response.ok) throw new Error("Failed to fetch categories")
      const data = await response.json()
      setCategories(data)
    } catch (err) {
      setError("Failed to load categories")
    } finally {
      setIsLoading(false)
    }
  }

  const handleEdit = (category: Category) => {
    setEditingCategory(category)
    setIsFormOpen(true)
  }

  const handleDelete = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this category?")) {
      try {
        const response = await fetch("/api/categories", {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id }),
        })
        if (!response.ok) throw new Error("Failed to delete category")
        fetchCategories() // Refresh the category list
      } catch (err) {
        setError("Failed to delete category")
      }
    }
  }

  const handleSubmit = async (category: Category) => {
    try {
      const url = "/api/categories"
      const method = editingCategory ? "PUT" : "POST"
      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(category),
      })
      if (!response.ok) throw new Error(`Failed to ${editingCategory ? "update" : "add"} category`)
      fetchCategories() // Refresh the category list
      setIsFormOpen(false)
      setEditingCategory(null)
    } catch (err) {
      setError(`Failed to ${editingCategory ? "update" : "add"} category`)
    }
  }

  if (isLoading) return <div>Loading...</div>
  if (error) return <div>Error: {error}</div>

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Categories</h1>
        <Button onClick={() => setIsFormOpen(true)}>Add New Category</Button>
      </div>
      <table className="w-full bg-white shadow-md rounded-lg overflow-hidden">
        <thead className="bg-gray-100">
          <tr>
            <th className="py-2 px-4 text-left">ID</th>
            <th className="py-2 px-4 text-left">Name</th>
            <th className="py-2 px-4 text-left">Subcategories</th>
            <th className="py-2 px-4 text-left">Actions</th>
          </tr>
        </thead>
        <tbody>
          {categories.map((category) => (
            <tr key={category.id} className="border-t">
              <td className="py-2 px-4">{category.id}</td>
              <td className="py-2 px-4">{category.name}</td>
              <td className="py-2 px-4">{category.subcategories.length}</td>
              <td className="py-2 px-4">
                <Button variant="outline" size="sm" className="mr-2" onClick={() => handleEdit(category)}>
                  Edit
                </Button>
                <Button variant="destructive" size="sm" onClick={() => handleDelete(category.id)}>
                  Delete
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {isFormOpen && (
        <CategoryForm
          category={editingCategory}
          onSubmit={handleSubmit}
          onCancel={() => {
            setIsFormOpen(false)
            setEditingCategory(null)
          }}
        />
      )}
    </div>
  )
}

