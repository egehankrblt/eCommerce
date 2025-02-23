"use server"

import { promises as fs } from "fs"
import path from "path"

export interface UserData {
  email: string
  username: string
  password: string
  role: "user" | "admin"
  orders: Order[]
  cart: CartItem[]
  addresses: Address[]
  name: string
  surname: string
  phoneNumber: string
}

export interface AdminUserData {
  email: string
  username: string
  password: string
  role: "admin"
}

export interface Order {
  id: number
  items: CartItem[]
  total: number
  date: string
  shippingAddress: Address
  userEmail: string
}

export interface CartItem {
  id: string
  name: string
  price: number
  quantity: number
  selectedSize?: string
  selectedColor?: string
  images: string[]
}

export interface Address {
  fullName: string
  streetAddress: string
  city: string
  state: string
  zipCode: string
  country: string
}

export interface DatabaseStructure {
  users: Record<string, UserData>
  adminUsers: Record<string, AdminUserData>
  adminOrders: Order[]
}

const DB_PATH = path.join(process.cwd(), "public", "data", "database.json")

export async function readDatabase(): Promise<DatabaseStructure> {
  try {
    const data = await fs.readFile(DB_PATH, "utf-8")
    return JSON.parse(data)
  } catch (error) {
    console.error("Error reading database:", error)
    return {
      users: {},
      adminUsers: {},
      adminOrders: [],
    }
  }
}

export async function updateDatabase(
  updateFn: (data: DatabaseStructure) => DatabaseStructure,
): Promise<DatabaseStructure> {
  try {
    const data = await readDatabase()
    const updatedData = updateFn(data)
    await fs.writeFile(DB_PATH, JSON.stringify(updatedData, null, 2))
    return updatedData
  } catch (error) {
    console.error("Error updating database:", error)
    return await readDatabase()
  }
}

