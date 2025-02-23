import type React from "react"
import { formatDate } from "@/lib/utils"
import Image from "next/image"
import type { Order } from "@/lib/databaseUtils" // Update this import

interface OrderHistoryProps {
  orders: Order[]
}

const OrderHistory: React.FC<OrderHistoryProps> = ({ orders }) => {
  if (!orders || orders.length === 0) {
    return <p>No orders yet.</p>
  }

  return (
    <div className="space-y-4">
      {orders.map((order) => (
        <div key={order.id} className="border rounded-lg p-4">
          <h3 className="text-lg font-semibold mb-2">Order #{order.id}</h3>
          <p className="text-sm text-gray-500 mb-2">Placed on {formatDate(order.date)}</p>
          <div className="mb-2">
            <h4 className="font-semibold">Shipping Address:</h4>
            <p>{order.shippingAddress.fullName}</p>
            <p>{order.shippingAddress.streetAddress}</p>
            <p>
              {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.zipCode}
            </p>
            <p>{order.shippingAddress.country}</p>
          </div>
          <ul className="space-y-2 mb-2">
            {order.items.map((item) => (
              <li key={item.id} className="flex items-center space-x-2">
                <Image
                  src={item.images[0] || "/placeholder.svg"}
                  alt={item.name}
                  width={50}
                  height={50}
                  className="object-cover rounded"
                />
                <div>
                  <p>{item.name}</p>
                  <p>
                    Quantity: {item.quantity} - ${item.price.toFixed(2)}
                  </p>
                </div>
              </li>
            ))}
          </ul>
          <p className="font-semibold">Total: ${order.total.toFixed(2)}</p>
        </div>
      ))}
    </div>
  )
}

export default OrderHistory

