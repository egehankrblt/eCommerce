export default function OrderConfirmation() {
  return (
    <div className="text-center">
      <h2 className="text-2xl font-semibold mb-4">Order Confirmed</h2>
      <p className="mb-4">Thank you for your purchase!</p>
      <p>Your order number is: #123456</p>
      <p className="mt-4">
        We'll send you an email with your order details and tracking information once your package has shipped.
      </p>
    </div>
  )
}

