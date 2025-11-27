import { getDatabase } from "./db"
import { ObjectId } from "mongodb"
import bcrypt from "bcryptjs"

export interface AdminUser {
  _id?: ObjectId
  username: string
  email: string
  password: string
  profileImage?: string
  createdAt: Date
  updatedAt: Date
}

const SALT_ROUNDS = 10

export async function getAdminCollection() {
  const db = await getDatabase()
  return db.collection<AdminUser>("admins")
}

export async function getAdminByUsername(username: string) {
  const collection = await getAdminCollection()
  return collection.findOne({ username })
}

export async function getAdminById(id: string) {
  const collection = await getAdminCollection()
  return collection.findOne({ _id: new ObjectId(id) })
}

export async function validateAdminCredentials(username: string, password: string) {
  const admin = await getAdminByUsername(username)
  if (!admin) return null
  
  const isValid = await bcrypt.compare(password, admin.password)
  if (!isValid) return null
  
  return admin
}

export async function updateAdminProfile(id: string, data: Partial<AdminUser>) {
  const collection = await getAdminCollection()
  const updateData = {
    ...data,
    updatedAt: new Date()
  }
  delete (updateData as any)._id
  delete (updateData as any).password
  return collection.updateOne(
    { _id: new ObjectId(id) },
    { $set: updateData }
  )
}

export async function updateAdminPassword(id: string, newPassword: string) {
  const collection = await getAdminCollection()
  const hashedPassword = await bcrypt.hash(newPassword, SALT_ROUNDS)
  return collection.updateOne(
    { _id: new ObjectId(id) },
    { $set: { password: hashedPassword, updatedAt: new Date() } }
  )
}

export async function verifyAdminPassword(id: string, password: string) {
  const admin = await getAdminById(id)
  if (!admin) return false
  return bcrypt.compare(password, admin.password)
}

export async function initializeDefaultAdmin() {
  const collection = await getAdminCollection()
  const existingAdmin = await collection.findOne({ username: "admin" })
  
  if (!existingAdmin) {
    const hashedPassword = await bcrypt.hash("12345@Admin", SALT_ROUNDS)
    await collection.insertOne({
      username: "admin",
      email: "admin@example.com",
      password: hashedPassword,
      profileImage: "",
      createdAt: new Date(),
      updatedAt: new Date()
    })
    console.log("[Admin] Default admin user created with hashed password")
  }
  
  return existingAdmin || await collection.findOne({ username: "admin" })
}
