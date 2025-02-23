import type React from "react"
import type { Metadata } from "next"
import { AuthProvider } from "@/contexts/AuthContext"
import { CartProvider } from "@/contexts/CartContext"
import Header from "@/components/layout/header"
import Footer from "@/components/layout/footer"
import { ThemeProvider } from "@/components/ThemeProvider"
import { parseProductsJson } from "@/lib/json-parser"
import { promises as fs } from "fs"
import path from "path"
import { storeName, welcomeMessage } from "public/data/storeConfig"

import "./globals.css"

export const metadata: Metadata = {
  title: storeName,
  description: welcomeMessage,
}

async function getCategories() {
  const jsonPath = path.join(process.cwd(), "public", "data", "products.json")
  const jsonContent = await fs.readFile(jsonPath, "utf-8")
  const { categories } = await parseProductsJson(jsonContent)
  return categories
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const categories = await getCategories()

  return (
    <html lang="en">
      <body>
        <ThemeProvider>
          <AuthProvider>
            <CartProvider>
              <div className="flex flex-col min-h-screen">
                <Header categories={categories} />
                <main className="flex-grow">{children}</main>
                <Footer />
              </div>
            </CartProvider>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}

