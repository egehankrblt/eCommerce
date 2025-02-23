"use client"

import { type ReactNode, useEffect } from "react"
import { useAuth } from "@/contexts/AuthContext"
import { useRouter } from "next/navigation"
import AdminLayoutContent from "@/components/admin/AdminLayoutContent"

export default function AdminLayout({ children }: { children: ReactNode }) {
  const { user } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!user) {
      router.push("/signin")
    } else if (user.role !== "admin") {
      router.push("/profile")
    }
  }, [user, router])

  if (!user || user.role !== "admin") {
    return null
  }

  return <AdminLayoutContent>{children}</AdminLayoutContent>
}

