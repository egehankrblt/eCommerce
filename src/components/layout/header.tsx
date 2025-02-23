"use client"

import Link from "next/link"
import { useState, useEffect } from "react"
import { ShoppingCart, User, Menu, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import type { Category } from "@/lib/types"
import { useCart } from "@/contexts/CartContext"
import { useAuth } from "@/contexts/AuthContext"
import SearchBar from "@/components/SearchBar"
import Image from "next/image"
import { storeName, icon } from "public/data/storeConfig"

export default function Header({ categories }: { categories: Category[] }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const { state } = useCart()
  const { user, logout } = useAuth()
  const [itemCount, setItemCount] = useState(0)

  useEffect(() => {
    setItemCount(state.items.reduce((sum, item) => sum + item.quantity, 0))
  }, [state.items])

  return (
    <header className="border-b bg-white shadow-sm">
      <nav className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between flex-wrap">
          <div className="flex items-center flex-shrink-0 mr-6">
            <Link href="/" className="flex items-center">
              <Image src={icon || "/placeholder.svg"} alt="Logo" width={50} height={50} className="mr-2" />
              <span className="text-3xl font-bold text-theme-primary">{storeName}</span>
            </Link>
          </div>

          <div className="w-full flex-grow lg:flex lg:items-center lg:w-auto">
            <div className="text-sm lg:flex-grow">
              {categories.map((category) => (
                <Link
                  key={category.id}
                  href={`/category/${category.id}`}
                  className="block mt-4 lg:inline-block lg:mt-0 hover:text-theme-blue mr-4 text-lg font-semibold"
                >
                  {category.name}
                </Link>
              ))}
            </div>
            <div className="mt-4 lg:mt-0">
              <SearchBar />
            </div>
          </div>

          <div className="hidden lg:flex items-center space-x-4">
            <Link href="/cart">
              <Button variant="ghost" size="icon" className="relative">
                <ShoppingCart className="h-5 w-5 text-theme-secondary" />
                {itemCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-theme-primary text-white rounded-full px-2 py-1 text-xs">
                    {itemCount}
                  </span>
                )}
              </Button>
            </Link>
            {user ? (
              <div className="flex items-center space-x-2">
                <span>Welcome, {user.username}!</span>
                <Link href="/profile">
                  <Button variant="ghost" size="sm" className="text-theme-blue">
                    Profile
                  </Button>
                </Link>
                {user.role === "admin" && (
                  <Link href="/admin">
                    <Button variant="ghost" size="sm" className="text-theme-blue">
                      Admin
                    </Button>
                  </Link>
                )}
                <Button variant="ghost" size="sm" onClick={logout} className="text-theme-blue">
                  Log Out
                </Button>
              </div>
            ) : (
              <Link href="/signin">
                <Button variant="ghost" size="icon">
                  <User className="h-5 w-5 text-theme-blue" />
                </Button>
              </Link>
            )}
          </div>

          <Button variant="ghost" size="icon" className="lg:hidden" onClick={() => setIsMenuOpen(!isMenuOpen)}>
            {isMenuOpen ? <X className="h-5 w-5 text-theme-blue" /> : <Menu className="h-5 w-5 text-theme-blue" />}
          </Button>
        </div>

        {/* Mobile menu */}
        {isMenuOpen && (
          <div className="lg:hidden mt-4 space-y-4">
            {categories.map((category) => (
              <Link key={category.id} href={`/category/${category.id}`} className="block py-2 hover:text-theme-blue">
                {category.name}
              </Link>
            ))}
            <Link href="/cart" className="block py-2 hover:text-theme-blue">
              Cart ({itemCount})
            </Link>
            {user && user.role === "admin" && (
              <Link href="/admin" className="block py-2 hover:text-theme-blue">
                Admin
              </Link>
            )}
            {user ? (
              <Button variant="link" onClick={logout} className="block py-2 hover:text-theme-blue">
                Log Out
              </Button>
            ) : (
              <Link href="/signin" className="block py-2 hover:text-theme-blue">
                Sign In
              </Link>
            )}
          </div>
        )}
      </nav>
    </header>
  )
}

