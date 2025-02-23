"use client"

import type React from "react"

import { useEffect } from "react"
import storeConfig from "public/data/storeConfig.json"

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    document.documentElement.style.setProperty("--primary-color", storeConfig.primaryColor)
    document.documentElement.style.setProperty("--secondary-color", storeConfig.secondaryColor)
  }, [])

  return <>{children}</>
}

