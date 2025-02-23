import { readDatabase, updateDatabase } from "./databaseUtils"
import type { Order } from "./databaseUtils"

export async function getAdminOrders(): Promise<Order[]> {
  const data = await readDatabase()
  return data.adminOrders
}

export async function saveAdminOrders(orders: Order[]): Promise<void> {
  await updateDatabase((data) => ({
    ...data,
    adminOrders: orders,
  }))
}

export async function addAdminOrder(order: Order): Promise<void> {
  await updateDatabase((data) => ({
    ...data,
    adminOrders: [...data.adminOrders, order],
  }))
}

