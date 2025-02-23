import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export default function PaymentForm() {
  return (
    <div>
      <h2 className="text-2xl font-semibold mb-4">Payment Information</h2>
      <form className="space-y-4">
        <div>
          <Label htmlFor="cardNumber">Card Number</Label>
          <Input id="cardNumber" placeholder="1234 5678 9012 3456" />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="expirationDate">Expiration Date</Label>
            <Input id="expirationDate" placeholder="MM/YY" />
          </div>
          <div>
            <Label htmlFor="cvv">CVV</Label>
            <Input id="cvv" placeholder="123" />
          </div>
        </div>
        <div>
          <Label htmlFor="nameOnCard">Name on Card</Label>
          <Input id="nameOnCard" placeholder="John Doe" />
        </div>
      </form>
    </div>
  )
}

