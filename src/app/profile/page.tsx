"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useAuth } from "@/contexts/AuthContext"
import { useCart } from "@/contexts/CartContext"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { PhoneInput } from "@/components/PhoneInput"
import OrderHistory from "@/components/OrderHistory"
import AddressForm from "@/components/AddressForm"
import type { Address, Order } from "@/lib/databaseUtils"
import { isValidPhoneNumber } from "libphonenumber-js"

export default function ProfilePage() {
  const { user, logout, updateUserProfile } = useAuth()
  const { getOrders, getUserAddresses, addUserAddress } = useCart()
  const router = useRouter()
  const [showAddressForm, setShowAddressForm] = useState(false)
  const [orders, setOrders] = useState<Order[]>([])
  const [addresses, setAddresses] = useState<Address[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isEditing, setIsEditing] = useState(false)
  const [profileData, setProfileData] = useState({
    name: "",
    surname: "",
    username: "",
    email: "",
    phoneNumber: "",
  })
  const [error, setError] = useState("")

  useEffect(() => {
    const fetchData = async () => {
      if (user) {
        const fetchedOrders = await getOrders()
        const fetchedAddresses = await getUserAddresses()
        setOrders(fetchedOrders)
        setAddresses(fetchedAddresses)
        setProfileData({
          name: user.name || "",
          surname: user.surname || "",
          username: user.username,
          email: user.email,
          phoneNumber: user.phoneNumber || "",
        })
        setIsLoading(false)
      } else {
        router.push("/signin")
      }
    }
    fetchData()
  }, [user, getOrders, getUserAddresses, router])

  if (isLoading) {
    return <div>Loading...</div>
  }

  if (!user) {
    return null
  }

  const handleAddAddress = async (address: Address) => {
    await addUserAddress(address)
    const updatedAddresses = await getUserAddresses()
    setAddresses(updatedAddresses)
    setShowAddressForm(false)
  }

  const handleLogout = () => {
    logout()
    router.push("/")
  }

  const handleEdit = () => {
    setIsEditing(true)
    setError("")
  }

  const handleSave = async () => {
    if (!isValidPhoneNumber(profileData.phoneNumber)) {
      setError("Invalid phone number")
      return
    }
    if (await updateUserProfile(profileData)) {
      setIsEditing(false)
      setError("")
    } else {
      setError("Failed to update profile")
    }
  }

  const handleCancel = () => {
    setIsEditing(false)
    setProfileData({
      name: user.name || "",
      surname: user.surname || "",
      username: user.username,
      email: user.email,
      phoneNumber: user.phoneNumber || "",
    })
    setError("")
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setProfileData((prev) => ({ ...prev, [name]: value }))
  }

  const handlePhoneChange = (value: string) => {
    setProfileData((prev) => ({ ...prev, phoneNumber: value }))
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">User Profile</h1>
      <div className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
        {error && <p className="text-red-500 mb-4">{error}</p>}
        <div className="mb-4">
          <p className="font-bold">Name:</p>
          {isEditing ? (
            <Input name="name" value={profileData.name} onChange={handleChange} />
          ) : (
            <p>{profileData.name}</p>
          )}
        </div>
        <div className="mb-4">
          <p className="font-bold">Surname:</p>
          {isEditing ? (
            <Input name="surname" value={profileData.surname} onChange={handleChange} />
          ) : (
            <p>{profileData.surname}</p>
          )}
        </div>
        <div className="mb-4">
          <p className="font-bold">Username:</p>
          <p>{profileData.username}</p>
        </div>
        <div className="mb-4">
          <p className="font-bold">Email:</p>
          <p>{profileData.email}</p>
        </div>
        <div className="mb-4">
          <p className="font-bold">Phone Number:</p>
          {isEditing ? (
            <PhoneInput value={profileData.phoneNumber} onChange={handlePhoneChange} />
          ) : (
            <p>{profileData.phoneNumber}</p>
          )}
        </div>
        {isEditing ? (
          <div className="flex space-x-2">
            <Button onClick={handleSave}>Save</Button>
            <Button variant="outline" onClick={handleCancel}>
              Cancel
            </Button>
          </div>
        ) : (
          <Button onClick={handleEdit}>Edit Profile</Button>
        )}
        <Button onClick={handleLogout} className="mt-4">
          Log Out
        </Button>
      </div>

      <h2 className="text-2xl font-bold mt-8 mb-4">Addresses</h2>
      <div className="space-y-4">
        {addresses.map((address, index) => (
          <div key={index} className="bg-white shadow-md rounded px-6 py-4">
            <p>{address.fullName}</p>
            <p>{address.streetAddress}</p>
            <p>
              {address.city}, {address.state} {address.zipCode}
            </p>
            <p>{address.country}</p>
          </div>
        ))}
        <div className="bg-white shadow-md rounded px-6 py-4">
          {!showAddressForm ? (
            <Button onClick={() => setShowAddressForm(true)} className="w-full">
              Add New Address
            </Button>
          ) : (
            <AddressForm onSubmit={handleAddAddress} onCancel={() => setShowAddressForm(false)} />
          )}
        </div>
      </div>

      <h2 className="text-2xl font-bold mt-8 mb-4">Order History</h2>
      <OrderHistory orders={orders} />
    </div>
  )
}

