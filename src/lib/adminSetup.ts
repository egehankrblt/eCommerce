import { readDatabase, updateDatabase } from "./databaseUtils"

export async function setupAdminUser() {
  const data = await readDatabase()

  if (!data.adminUsers["admin@example.com"]) {
    await updateDatabase((data) => ({
      ...data,
      adminUsers: {
        ...data.adminUsers,
        "admin@example.com": {
          username: "Admin User",
          email: "admin@example.com",
          password: "adminpassword", // In a real application, this should be hashed
          role: "admin",
        },
      },
    }))
    console.log("Admin user created")
  }
}

