import { useState, type ChangeEvent, type FormEvent } from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import type { Address } from "@/types"

interface AddressFormProps {
  onSubmit: (address: Address) => void
  onCancel: () => void
}

export default function AddressForm({ onSubmit, onCancel }: AddressFormProps) {
  const [address, setAddress] = useState<Address>({
    fullName: "",
    streetAddress: "",
    city: "",
    state: "",
    zipCode: "",
    country: "",
  })

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setAddress((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    onSubmit(address)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
      <div>
        <Label htmlFor="fullName">Full Name</Label>
        <Input
          id="fullName"
          name="fullName"
          value={address.fullName}
          onChange={handleChange}
          required
          placeholder="John Doe"
          aria-label="Full Name"
        />
      </div>
      <div>
        <Label htmlFor="streetAddress">Street Address</Label>
        <Input
          id="streetAddress"
          name="streetAddress"
          value={address.streetAddress}
          onChange={handleChange}
          required
          placeholder="123 Main St"
          aria-label="Street Address"
        />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="city">City</Label>
          <Input
            id="city"
            name="city"
            value={address.city}
            onChange={handleChange}
            required
            placeholder="New York"
            aria-label="City"
          />
        </div>
        <div>
          <Label htmlFor="state">State</Label>
          <Input
            id="state"
            name="state"
            value={address.state}
            onChange={handleChange}
            required
            placeholder="NY"
            aria-label="State"
          />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="zipCode">Zip Code</Label>
          <Input
            id="zipCode"
            name="zipCode"
            value={address.zipCode}
            onChange={handleChange}
            required
            placeholder="10001"
            aria-label="Zip Code"
          />
        </div>
        <div>
          <Label htmlFor="country">Country</Label>
          <Input
            id="country"
            name="country"
            value={address.country}
            onChange={handleChange}
            required
            placeholder="United States"
            aria-label="Country"
          />
        </div>
      </div>
      <div className="flex justify-end space-x-2">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit">Save Address</Button>
      </div>
    </form>
  )
}

