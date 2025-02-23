import type { ReactNode } from "react"
import Link from "next/link"

export default function AdminLayoutContent({ children }: { children: ReactNode }) {
  return (
    <div className="flex h-screen bg-gray-100">
      <aside className="w-64 bg-white shadow-md">
        <div className="p-4">
          <h1 className="text-2xl font-bold">Admin Panel</h1>
        </div>
        <nav className="mt-4">
          <Link href="/admin" className="block py-2 px-4 hover:bg-gray-200">
            Dashboard
          </Link>
          <Link href="/admin/products" className="block py-2 px-4 hover:bg-gray-200">
            Products
          </Link>
          <Link href="/admin/categories" className="block py-2 px-4 hover:bg-gray-200">
            Categories
          </Link>
          <Link href="/admin/orders" className="block py-2 px-4 hover:bg-gray-200">
            Orders
          </Link>
        </nav>
      </aside>
      <main className="flex-1 p-8 overflow-y-auto">{children}</main>
    </div>
  )
}

