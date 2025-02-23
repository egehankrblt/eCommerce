"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import type { Product, Category } from "@/lib/types"

interface ProductFormProps {
  product?: Product | null
  onSubmit: (product: Product) => void
  onCancel: () => void
}

export default function ProductForm({ product, onSubmit, onCancel }: ProductFormProps) {
  const [formData, setFormData] = useState<Product>({
    id: "",
    name: "",
    brand: "",
    price: 0,
    description: "",
    sizes: [],
    colors: [],
    category: "",
    subcategory: "",
    specifications: {},
    images: [],
  })
  const [categories, setCategories] = useState<Category[]>([])
  const [subcategories, setSubcategories] = useState<{ id: string; name: string }[]>([])
  const [newAttribute, setNewAttribute] = useState({ name: "", value: "" })
  const [newSize, setNewSize] = useState("")
  const [newColor, setNewColor] = useState("")
  const [newImage, setNewImage] = useState("")

  useEffect(() => {
    if (product) {
      setFormData(product)
    }
    fetchCategories()
  }, [product])

  const fetchCategories = async () => {
    try {
      const response = await fetch("/api/categories")
      if (response.ok) {
        const data = await response.json()
        setCategories(data)
      }
    } catch (error) {
      console.error("Failed to fetch categories:", error)
    }
  }

  useEffect(() => {
    if (formData.category) {
      const selectedCategory = categories.find((c) => c.name === formData.category)
      if (selectedCategory) {
        setSubcategories(selectedCategory.subcategories)
      }
    }
  }, [formData.category, categories])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }))
    if (name === "category") {
      setFormData((prev) => ({ ...prev, subcategory: "" }))
    }
  }

  const handleNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: Number(value) }))
  }

  const handleAttributeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setNewAttribute((prev) => ({ ...prev, [name]: value }))
  }

  const addAttribute = () => {
    if (newAttribute.name && newAttribute.value) {
      setFormData((prev) => ({
        ...prev,
        specifications: { ...prev.specifications, [newAttribute.name]: newAttribute.value },
      }))
      setNewAttribute({ name: "", value: "" })
    }
  }

  const removeAttribute = (attrName: string) => {
    setFormData((prev) => {
      const { [attrName]: _, ...rest } = prev.specifications
      return { ...prev, specifications: rest }
    })
  }

  const addSize = () => {
    if (newSize && !formData.sizes.includes(newSize)) {
      setFormData((prev) => ({ ...prev, sizes: [...prev.sizes, newSize] }))
      setNewSize("")
    }
  }

  const removeSize = (size: string) => {
    setFormData((prev) => ({ ...prev, sizes: prev.sizes.filter((s) => s !== size) }))
  }

  const addColor = () => {
    if (newColor && !formData.colors.includes(newColor)) {
      setFormData((prev) => ({ ...prev, colors: [...prev.colors, newColor] }))
      setNewColor("")
    }
  }

  const removeColor = (color: string) => {
    setFormData((prev) => ({ ...prev, colors: prev.colors.filter((c) => c !== color) }))
  }

  const addImage = () => {
    if (newImage && !formData.images.includes(newImage)) {
      setFormData((prev) => ({ ...prev, images: [...prev.images, newImage] }))
      setNewImage("")
    }
  }

  const removeImage = (image: string) => {
    setFormData((prev) => ({ ...prev, images: prev.images.filter((i) => i !== image) }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit(formData)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4">{product ? "Edit Product" : "Add New Product"}</h2>

      <div>
        <Label htmlFor="id">ID</Label>
        <Input id="id" name="id" value={formData.id} onChange={handleChange} required />
      </div>

      <div>
        <Label htmlFor="name">Name</Label>
        <Input id="name" name="name" value={formData.name} onChange={handleChange} required />
      </div>

      <div>
        <Label htmlFor="brand">Brand</Label>
        <Input id="brand" name="brand" value={formData.brand} onChange={handleChange} required />
      </div>

      <div>
        <Label htmlFor="price">Price</Label>
        <Input id="price" name="price" type="number" value={formData.price} onChange={handleNumberChange} required />
      </div>

      <div>
        <Label htmlFor="description">Description</Label>
        <Textarea id="description" name="description" value={formData.description} onChange={handleChange} required />
      </div>

      <div>
        <Label htmlFor="category">Category</Label>
        <Select
          name="category"
          value={formData.category}
          onValueChange={(value) => handleSelectChange("category", value)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select a category" />
          </SelectTrigger>
          <SelectContent>
            {categories.map((category) => (
              <SelectItem key={category.id} value={category.name}>
                {category.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label htmlFor="subcategory">Subcategory</Label>
        <Select
          name="subcategory"
          value={formData.subcategory}
          onValueChange={(value) => handleSelectChange("subcategory", value)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select a subcategory" />
          </SelectTrigger>
          <SelectContent>
            {subcategories.map((subcategory) => (
              <SelectItem key={subcategory.id} value={subcategory.name}>
                {subcategory.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label>Sizes</Label>
        <div className="flex flex-wrap gap-2 mb-2">
          {formData.sizes.map((size) => (
            <div key={size} className="bg-gray-100 px-2 py-1 rounded flex items-center">
              <span>{size}</span>
              <button type="button" onClick={() => removeSize(size)} className="bg-theme-primary text-white hover:bg-theme-secondary">
                &times;
              </button>
            </div>
          ))}
        </div>
        <div className="flex gap-2">
          <Input value={newSize} onChange={(e) => setNewSize(e.target.value)} placeholder="New size" />
          <Button type="button" onClick={addSize}>
            Add Size
          </Button>
        </div>
      </div>

      <div>
        <Label>Colors</Label>
        <div className="flex flex-wrap gap-2 mb-2">
          {formData.colors.map((color) => (
            <div key={color} className="bg-gray-100 px-2 py-1 rounded flex items-center">
              <span>{color}</span>
              <button type="button" onClick={() => removeColor(color)} className="bg-theme-primary text-white hover:bg-theme-secondary">
                &times;
              </button>
            </div>
          ))}
        </div>
        <div className="flex gap-2">
          <Input value={newColor} onChange={(e) => setNewColor(e.target.value)} placeholder="New color" />
          <Button type="button" onClick={addColor}>
            Add Color
          </Button>
        </div>
      </div>

      <div>
        <Label>Images</Label>
        <div className="flex flex-wrap gap-2 mb-2">
          {formData.images.map((image) => (
            <div key={image} className="bg-gray-100 px-2 py-1 rounded flex items-center">
              <span>{image}</span>
              <button type="button" onClick={() => removeImage(image)} className="bg-theme-primary text-white hover:bg-theme-secondary">
                &times;
              </button>
            </div>
          ))}
        </div>
        <div className="flex gap-2">
          <Input value={newImage} onChange={(e) => setNewImage(e.target.value)} placeholder="New image URL" />
          <Button type="button" onClick={addImage}>
            Add Image
          </Button>
        </div>
      </div>

      <div>
        <Label>Specifications</Label>
        <div className="space-y-2 mb-2">
          {Object.entries(formData.specifications).map(([key, value]) => (
            <div key={key} className="flex items-center gap-2">
              <span>
                {key}: {value}
              </span>
              <button type="button" onClick={() => removeAttribute(key)} className="bg-theme-primary text-white hover:bg-theme-secondary">
                &times;
              </button>
            </div>
          ))}
        </div>
        <div className="flex gap-2">
          <Input name="name" value={newAttribute.name} onChange={handleAttributeChange} placeholder="Attribute name" />
          <Input
            name="value"
            value={newAttribute.value}
            onChange={handleAttributeChange}
            placeholder="Attribute value"
          />
          <Button type="button" onClick={addAttribute}>
            Add Attribute
          </Button>
        </div>
      </div>

      <div className="flex justify-end space-x-2">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit">{product ? "Update" : "Add"} Product</Button>
      </div>
    </form>
  )
}

