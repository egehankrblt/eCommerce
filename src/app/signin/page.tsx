"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/contexts/AuthContext"
import AuthPage from "@/components/auth/AuthPage"

export default function SignInPage() {
  const { user } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (user) {
      router.push("/profile")
    }
  }, [user, router])

  if (user) {
    return null
  }

  return <AuthPage initialMode="signin" />
}

