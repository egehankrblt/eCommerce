"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { readDatabase, updateDatabase, type UserData, type AdminUserData } from "@/lib/databaseUtils"

interface AuthUser {
  username: string
  email: string
  role: "user" | "admin"
  name: string
  surname: string
  phoneNumber: string
}

interface AuthContextType {
  user: AuthUser | null
  login: (emailOrUsername: string, password: string) => Promise<boolean>
  logout: () => Promise<void>
  signup: (
    name: string,
    surname: string,
    username: string,
    email: string,
    phoneNumber: string,
    password: string,
  ) => Promise<boolean>
  updateUserProfile: (profileData: Partial<AuthUser>) => Promise<boolean>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null)
  const router = useRouter()

  useEffect(() => {
    const loadUser = () => {
      const storedUser = localStorage.getItem("currentUser")
      if (storedUser) {
        setUser(JSON.parse(storedUser))
      }
    }
    loadUser()
  }, [])

  const login = async (emailOrUsername: string, password: string) => {
    try {
      const data = await readDatabase()
      const userData = Object.values(data.users).find(
        (u: UserData) => (u.email === emailOrUsername || u.username === emailOrUsername) && u.password === password,
      ) as UserData | undefined
      const adminUserData = Object.values(data.adminUsers).find(
        (u: AdminUserData) =>
          (u.email === emailOrUsername || u.username === emailOrUsername) && u.password === password,
      ) as AdminUserData | undefined

      if (userData) {
        const loggedInUser: AuthUser = {
          username: userData.username,
          email: userData.email,
          role: userData.role,
          name: userData.name,
          surname: userData.surname,
          phoneNumber: userData.phoneNumber,
        }
        setUser(loggedInUser)
        localStorage.setItem("currentUser", JSON.stringify(loggedInUser))
        router.push("/profile")
        return true
      } else if (adminUserData) {
        const loggedInUser: AuthUser = {
          username: adminUserData.username,
          email: adminUserData.email,
          role: adminUserData.role,
          name: "", // Add empty strings for admin users
          surname: "",
          phoneNumber: "",
        }
        setUser(loggedInUser)
        localStorage.setItem("currentUser", JSON.stringify(loggedInUser))
        router.push("/admin")
        return true
      }
    } catch (error) {
      console.error("Login error:", error)
    }
    return false
  }

  const logout = async () => {
    setUser(null)
    localStorage.removeItem("currentUser")
    router.push("/")
  }

  const signup = async (
    name: string,
    surname: string,
    username: string,
    email: string,
    phoneNumber: string,
    password: string,
  ) => {
    try {
      const data = await readDatabase()
      if (data.users[email] || Object.values(data.users).some((u: UserData) => u.username === username)) {
        return false
      }

      const newUser: UserData = {
        username,
        email,
        password,
        role: "user",
        orders: [],
        cart: [],
        addresses: [],
        name,
        surname,
        phoneNumber,
      }

      await updateDatabase((currentData) => ({
        ...currentData,
        users: {
          ...currentData.users,
          [email]: newUser,
        },
      }))

      const authUser: AuthUser = { username, email, role: "user", name, surname, phoneNumber }
      setUser(authUser)
      localStorage.setItem("currentUser", JSON.stringify(authUser))
      router.push("/profile")
      return true
    } catch (error) {
      console.error("Signup error:", error)
      return false
    }
  }

  const updateUserProfile = async (profileData: Partial<AuthUser>) => {
    try {
      if (!user) return false

      await updateDatabase((currentData) => {
        const updatedUser = {
          ...currentData.users[user.email],
          ...profileData,
        }
        return {
          ...currentData,
          users: {
            ...currentData.users,
            [user.email]: updatedUser,
          },
        }
      })

      const updatedUser: AuthUser = { ...user, ...profileData }
      setUser(updatedUser)
      localStorage.setItem("currentUser", JSON.stringify(updatedUser))
      return true
    } catch (error) {
      console.error("Update profile error:", error)
      return false
    }
  }

  return (
    <AuthContext.Provider value={{ user, login, logout, signup, updateUserProfile }}>{children}</AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}

