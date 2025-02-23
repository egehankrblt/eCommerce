"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"

interface UserData {
  username: string
  email: string
}

export default function UserProfile() {
  const [userData, setUserData] = useState<UserData>({
    username: "JohnDoe",
    email: "john@example.com",
  })

  const handleLogout = () => {
    // Here you would typically clear the user's session
    console.log("User logged out")
  }

  return (
    <div className="max-w-md mx-auto mt-8 p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4">User Profile</h2>
      <div className="mb-4">
        <p>
          <strong>Username:</strong> {userData.username}
        </p>
        <p>
          <strong>Email:</strong> {userData.email}
        </p>
      </div>
      <Button onClick={handleLogout}>Log Out</Button>
    </div>
  )
}

