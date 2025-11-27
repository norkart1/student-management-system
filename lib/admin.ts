import bcrypt from "bcryptjs"

export interface AdminUser {
  id: string
  username: string
  email: string
  profileImage?: string
}

export async function validateAdminCredentials(username: string, password: string): Promise<AdminUser | null> {
  const adminUsername = process.env.ADMIN_USERNAME
  const adminPasswordHash = process.env.ADMIN_PASSWORD_HASH
  
  if (!adminUsername || !adminPasswordHash) {
    console.error("[Admin] Missing ADMIN_USERNAME or ADMIN_PASSWORD_HASH environment variables")
    return null
  }
  
  if (username !== adminUsername) {
    return null
  }
  
  const isValid = await bcrypt.compare(password, adminPasswordHash)
  if (!isValid) {
    return null
  }
  
  return {
    id: "admin",
    username: adminUsername,
    email: process.env.ADMIN_EMAIL || "admin@example.com",
    profileImage: ""
  }
}

export async function getAdminById(id: string): Promise<AdminUser | null> {
  if (id !== "admin") {
    return null
  }
  
  const adminUsername = process.env.ADMIN_USERNAME
  if (!adminUsername) {
    return null
  }
  
  return {
    id: "admin",
    username: adminUsername,
    email: process.env.ADMIN_EMAIL || "admin@example.com",
    profileImage: ""
  }
}

export async function verifyAdminPassword(id: string, password: string): Promise<boolean> {
  if (id !== "admin") {
    return false
  }
  
  const adminPasswordHash = process.env.ADMIN_PASSWORD_HASH
  if (!adminPasswordHash) {
    return false
  }
  
  return bcrypt.compare(password, adminPasswordHash)
}
