"use client"

import { useState } from "react"
import { useAuth } from "@/contexts/AuthContext"
import LoginForm from "@/components/auth/LoginForm"
import SignUpForm from "@/components/auth/SignUpForm"
import UserProfile from "@/components/auth/UserProfile"
import { Button } from "@/components/ui/button"

export default function AuthPage() {
  const { user } = useAuth()
  const [isLogin, setIsLogin] = useState(true)

  if (user) {
    return <UserProfile />
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6 text-center">{isLogin ? "Log In" : "Sign Up"}</h1>
      {isLogin ? <LoginForm /> : <SignUpForm />}
      <div className="mt-4 text-center">
        <Button variant="link" onClick={() => setIsLogin(!isLogin)}>
          {isLogin ? "Need an account? Sign up" : "Already have an account? Log in"}
        </Button>
      </div>
    </div>
  )
}

