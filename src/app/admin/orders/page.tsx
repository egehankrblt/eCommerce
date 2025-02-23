"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { getAdminOrders } from "@/lib/adminStorage"
import type { Order } from "@/lib/databaseUtils"
import { formatDate } from "@/lib/utils"

export default function AdminOrders() {
  const [orders, setOrders] = useState<Order[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchOrders = async () => {
      const adminOrders = await getAdminOrders()
      setOrders(adminOrders)
      setIsLoading(false)
    }
    fetchOrders()
  }, [])

  if (isLoading) {
    return <div>Loading orders...</div>
  }

  if (orders.length === 0) {
    return (
      <div>
        <h1 className="text-3xl font-bold mb-6">Orders</h1>
        <p>No orders found.</p>
      </div>
    )
  }

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Orders</h1>
      <div className="overflow-x-auto">
        <table className="w-full bg-white shadow-md rounded-lg overflow-hidden">
          <thead className="bg-gray-100">
            <tr>
              <th className="py-2 px-4 text-left">ID</th>
              <th className="py-2 px-4 text-left">Customer</th>
              <th className="py-2 px-4 text-left">Total</th>
              <th className="py-2 px-4 text-left">Date</th>
              <th className="py-2 px-4 text-left">Items</th>
              <th className="py-2 px-4 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order.id} className="border-t">
                <td className="py-2 px-4">{order.id}</td>
                <td className="py-2 px-4">{order.shippingAddress.fullName}</td>
                <td className="py-2 px-4">${order.total.toFixed(2)}</td>
                <td className="py-2 px-4">{formatDate(order.date)}</td>
                <td className="py-2 px-4">
                  {order.items.map((item) => (
                    <div key={item.id}>
                      {item.name} x {item.quantity}
                    </div>
                  ))}
                </td>
                <td className="py-2 px-4">
                  <Button variant="outline" size="sm">
                    View Details
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

