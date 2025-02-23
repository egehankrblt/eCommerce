"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/contexts/AuthContext"
import LoginForm from "@/components/auth/LoginForm"
import SignUpForm from "@/components/auth/SignUpForm"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function AuthPage({ initialMode = "signin" }: { initialMode?: "signin" | "signup" }) {
  const { user } = useAuth()
  const router = useRouter()
  const isLogin = initialMode === "signin"

  useEffect(() => {
    if (user) {
      router.push("/profile")
    }
  }, [user, router])

  if (user) {
    return null
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6 text-center">{isLogin ? "Log In" : "Sign Up"}</h1>
      {isLogin ? <LoginForm /> : <SignUpForm />}
      <div className="mt-4 text-center">
        {isLogin ? (
          <Link href="/signup">
            <Button variant="link">Need an account? Sign up</Button>
          </Link>
        ) : (
          <Link href="/signin">
            <Button variant="link">Already have an account? Log in</Button>
          </Link>
        )}
      </div>
    </div>
  )
}

