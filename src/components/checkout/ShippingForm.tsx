"use client"

import { useState, useEffect, type ChangeEvent, type FormEvent } from "react"
import { RadioGroup, Radio } from "react-radio-group"
import { useAuth } from "@/contexts/AuthContext"
import { useCart } from "@/contexts/CartContext"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"

interface Address {
  fullName: string
  streetAddress: string
  city: string
  state: string
  zipCode: string
  country: string
}

interface ShippingFormProps {
  onAddressSelect: (address: Address | null) => void
}

export default function ShippingForm({ onAddressSelect }: ShippingFormProps) {
  const { user } = useAuth()
  const { getUserAddresses } = useCart()
  const [selectedAddressIndex, setSelectedAddressIndex] = useState<number | null>(null)
  const [addresses, setAddresses] = useState<Address[]>([])
  const [newAddress, setNewAddress] = useState<Address>({
    fullName: "",
    streetAddress: "",
    city: "",
    state: "",
    zipCode: "",
    country: "",
  })
  const [useNewAddress, setUseNewAddress] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchAddresses = async () => {
      try {
        const fetchedAddresses = await getUserAddresses()
        setAddresses(fetchedAddresses)
      } catch (error) {
        console.error("Failed to fetch addresses:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchAddresses()
  }, [getUserAddresses])

  const handleAddressSelect = (value: string) => {
    const index = Number.parseInt(value)
    setSelectedAddressIndex(index)
    setUseNewAddress(false)
    onAddressSelect(addresses[index])
  }

  const handleNewAddressChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setNewAddress((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (useNewAddress) {
      onAddressSelect(newAddress)
    } else if (selectedAddressIndex !== null) {
      onAddressSelect(addresses[selectedAddressIndex])
    }
  }

  if (isLoading) {
    return <div>Loading addresses...</div>
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <h2 className="text-2xl font-semibold mb-4">Shipping Information</h2>

      {addresses.length > 0 && (
        <div className="mb-4">
          <h3 className="text-lg font-semibold mb-2">Select an existing address:</h3>
          <RadioGroup
            name="selectedAddress"
            selectedValue={selectedAddressIndex?.toString()}
            onChange={handleAddressSelect}
          >
            {addresses.map((address, index) => (
              <div key={index} className="flex items-center space-x-2">
                <Radio value={index.toString()} id={`address-${index}`} />
                <Label htmlFor={`address-${index}`}>
                  {address.fullName}, {address.streetAddress}, {address.city}, {address.state} {address.zipCode},{" "}
                  {address.country}
                </Label>
              </div>
            ))}
          </RadioGroup>
        </div>
      )}

      <div className="flex items-center space-x-2">
        <input
          type="checkbox"
          id="useNewAddress"
          checked={useNewAddress}
          onChange={() => setUseNewAddress(!useNewAddress)}
          aria-label="Use a different address"
        />
        <Label htmlFor="useNewAddress">Use a different address</Label>
      </div>

      {useNewAddress && (
        <div className="space-y-4">
          <div>
            <Label htmlFor="fullName">Full Name</Label>
            <Input
              id="fullName"
              name="fullName"
              value={newAddress.fullName}
              onChange={handleNewAddressChange}
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
              value={newAddress.streetAddress}
              onChange={handleNewAddressChange}
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
                value={newAddress.city}
                onChange={handleNewAddressChange}
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
                value={newAddress.state}
                onChange={handleNewAddressChange}
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
                value={newAddress.zipCode}
                onChange={handleNewAddressChange}
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
                value={newAddress.country}
                onChange={handleNewAddressChange}
                required
                placeholder="United States"
                aria-label="Country"
              />
            </div>
          </div>
        </div>
      )}

      <div className="flex justify-between mt-8">
        <Button type="button" onClick={() => onAddressSelect(null)} variant="outline" size="lg">
          Back
        </Button>
        <Button type="submit" size="lg" className="bg-blue-600 text-white">
          Continue to Payment
        </Button>
      </div>
    </form>
  )
}

