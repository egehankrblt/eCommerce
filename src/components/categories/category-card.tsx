import Link from "next/link"
import Image from "next/image"
import type { Category } from "@/lib/types"

export default function CategoryCard({ category }: { category: Category }) {
  return (
    <Link href={`/category/${category.id}`}>
      <div className="border rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300">
        <div className="relative h-48">
          <Image src={category.image || "/placeholder.svg"} alt={category.name} fill className="object-cover" />
        </div>
        <div className="p-4">
          <h3 className="text-xl font-semibold mb-2 text-theme-primary">{category.name}</h3>
          <p className="text-gray-600">{category.description}</p>
        </div>
      </div>
    </Link>
  )
}

