"use client"

import type React from "react"
import { useState } from "react"
import { useAuth } from "@/contexts/AuthContext"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { PhoneInput } from "@/components/PhoneInput"
import { isValidPhoneNumber } from "libphonenumber-js"

export default function SignUpForm() {
  const [formData, setFormData] = useState({
    name: "",
    surname: "",
    username: "",
    email: "",
    phoneNumber: "",
    password: "",
    confirmPassword: "",
  })
  const [error, setError] = useState("")
  const { signup } = useAuth()

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handlePhoneChange = (value: string) => {
    setFormData((prev) => ({ ...prev, phoneNumber: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match")
      return
    }
    if (!isValidPhoneNumber(formData.phoneNumber)) {
      setError("Invalid phone number")
      return
    }
    const success = signup(
      formData.name,
      formData.surname,
      formData.username,
      formData.email,
      formData.phoneNumber,
      formData.password,
    )
    if (!success) {
      setError("Email or username already in use")
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-md mx-auto">
      {error && <p className="text-red-500">{error}</p>}
      <div>
        <Label htmlFor="name">Name</Label>
        <Input id="name" name="name" type="text" required value={formData.name} onChange={handleChange} />
      </div>
      <div>
        <Label htmlFor="surname">Surname</Label>
        <Input id="surname" name="surname" type="text" required value={formData.surname} onChange={handleChange} />
      </div>
      <div>
        <Label htmlFor="username">Username</Label>
        <Input id="username" name="username" type="text" required value={formData.username} onChange={handleChange} />
      </div>
      <div>
        <Label htmlFor="email">Email</Label>
        <Input id="email" name="email" type="email" required value={formData.email} onChange={handleChange} />
      </div>
      <div>
        <Label htmlFor="phoneNumber">Phone Number</Label>
        <PhoneInput value={formData.phoneNumber} onChange={handlePhoneChange} />
      </div>
      <div>
        <Label htmlFor="password">Password</Label>
        <Input
          id="password"
          name="password"
          type="password"
          required
          value={formData.password}
          onChange={handleChange}
        />
      </div>
      <div>
        <Label htmlFor="confirmPassword">Confirm Password</Label>
        <Input
          id="confirmPassword"
          name="confirmPassword"
          type="password"
          required
          value={formData.confirmPassword}
          onChange={handleChange}
        />
      </div>
      <Button type="submit" className="w-full">
        Sign Up
      </Button>
    </form>
  )
}

