export interface AdminUser {
  id: string
  username: string
  email: string
  profileImage?: string
}

export async function validateAdminCredentials(username: string, password: string): Promise<AdminUser | null> {
  const adminUsername = process.env.ADMIN_USERNAME
  const adminPassword = process.env.ADMIN_PASSWORD
  
  if (!adminUsername || !adminPassword) {
    console.error("[Admin] Missing ADMIN_USERNAME or ADMIN_PASSWORD secrets")
    return null
  }
  
  if (username !== adminUsername) {
    return null
  }
  
  if (password !== adminPassword) {
    return null
  }
  
  return {
    id: "admin",
    username: adminUsername,
    email: "admin@example.com",
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
  
  const adminPassword = process.env.ADMIN_PASSWORD
  if (!adminPassword) {
    return false
  }
  
  return password === adminPassword
}
