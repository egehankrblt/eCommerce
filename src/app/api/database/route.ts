import { NextResponse } from "next/server"
import { promises as fs } from "fs"
import path from "path"
import type { DatabaseStructure } from "@/lib/databaseUtils"

const DB_PATH = path.join(process.cwd(), "public", "data", "database.json")

export async function GET() {
  try {
    const data = await fs.readFile(DB_PATH, "utf-8")
    return NextResponse.json(JSON.parse(data))
  } catch (error) {
    console.error("Error reading database:", error)
    return NextResponse.json({ error: "Failed to read database" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const updatedData: DatabaseStructure = await request.json()
    await fs.writeFile(DB_PATH, JSON.stringify(updatedData, null, 2))
    return NextResponse.json({ message: "Database updated successfully" })
  } catch (error) {
    console.error("Error updating database:", error)
    return NextResponse.json({ error: "Failed to update database" }, { status: 500 })
  }
}