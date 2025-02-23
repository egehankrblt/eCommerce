"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import type { Category, Subcategory } from "@/lib/types"

interface CategoryFormProps {
  category?: Category | null
  onSubmit: (category: Category) => void
  onCancel: () => void
}

export default function CategoryForm({ category, onSubmit, onCancel }: CategoryFormProps) {
  const [formData, setFormData] = useState<Category>({
    id: "",
    name: "",
    subcategories: [],
  })

  useEffect(() => {
    if (category) {
      setFormData(category)
    }
  }, [category])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubcategoryChange = (index: number, field: keyof Subcategory, value: string) => {
    const updatedSubcategories = [...formData.subcategories]
    updatedSubcategories[index] = { ...updatedSubcategories[index], [field]: value }
    setFormData((prev) => ({ ...prev, subcategories: updatedSubcategories }))
  }

  const addSubcategory = () => {
    setFormData((prev) => ({
      ...prev,
      subcategories: [...prev.subcategories, { id: "", name: "", categoryId: prev.id, products: [] }],
    }))
  }

  const removeSubcategory = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      subcategories: prev.subcategories.filter((_, i) => i !== index),
    }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit(formData)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4">{category ? "Edit Category" : "Add New Category"}</h2>

      <div>
        <Label htmlFor="id">ID</Label>
        <Input id="id" name="id" value={formData.id} onChange={handleChange} required />
      </div>

      <div>
        <Label htmlFor="name">Name</Label>
        <Input id="name" name="name" value={formData.name} onChange={handleChange} required />
      </div>

      <div>
        <Label>Subcategories</Label>
        {formData.subcategories.map((subcategory, index) => (
          <div key={index} className="flex items-center space-x-2 mt-2">
            <Input
              value={subcategory.id}
              onChange={(e) => handleSubcategoryChange(index, "id", e.target.value)}
              placeholder="Subcategory ID"
            />
            <Input
              value={subcategory.name}
              onChange={(e) => handleSubcategoryChange(index, "name", e.target.value)}
              placeholder="Subcategory Name"
            />
            <Button type="button" variant="outline" size="sm" onClick={() => removeSubcategory(index)}>
              Remove
            </Button>
          </div>
        ))}
        <Button type="button" variant="outline" size="sm" onClick={addSubcategory} className="mt-2">
          Add Subcategory
        </Button>
      </div>

      <div className="flex justify-end space-x-2">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit">{category ? "Update" : "Add"} Category</Button>
      </div>
    </form>
  )
}

