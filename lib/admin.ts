import { getDatabase } from "./db"
import { ObjectId } from "mongodb"

export interface AdminUser {
  _id?: ObjectId
  username: string
  email: string
  password: string
  profileImage?: string
  createdAt: Date
  updatedAt: Date
}

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
  if (admin.password !== password) return null
  return admin
}

export async function updateAdminProfile(id: string, data: Partial<AdminUser>) {
  const collection = await getAdminCollection()
  const updateData = {
    ...data,
    updatedAt: new Date()
  }
  delete (updateData as any)._id
  return collection.updateOne(
    { _id: new ObjectId(id) },
    { $set: updateData }
  )
}

export async function updateAdminPassword(id: string, newPassword: string) {
  const collection = await getAdminCollection()
  return collection.updateOne(
    { _id: new ObjectId(id) },
    { $set: { password: newPassword, updatedAt: new Date() } }
  )
}

export async function initializeDefaultAdmin() {
  const collection = await getAdminCollection()
  const existingAdmin = await collection.findOne({ username: "admin" })
  
  if (!existingAdmin) {
    await collection.insertOne({
      username: "admin",
      email: "admin@example.com",
      password: "12345@Admin",
      profileImage: "",
      createdAt: new Date(),
      updatedAt: new Date()
    })
    console.log("[Admin] Default admin user created")
  }
  
  return existingAdmin || await collection.findOne({ username: "admin" })
}
