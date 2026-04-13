import { hash, compare } from "bcryptjs"
import { ObjectId } from "mongodb"
import clientPromise from "../lib/mongodb"

export async function createUser(userData) {
  const client = await clientPromise
  const db = client.db()

  const { email, password, name, username } = userData

  // Validate required fields
  if (!email || !password || !name || !username) {
    throw new Error("All fields including username are required")
  }

  // Helper to escape regex special characters
  const escapeRegExp = (string) => string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')

  // Check if user with email or username already exists (case-insensitive)
  const existingUser = await db.collection("users").findOne({
    $or: [
      { email: { $regex: new RegExp(`^${escapeRegExp(email)}$`, "i") } },
      { username: { $regex: new RegExp(`^${escapeRegExp(username)}$`, "i") } }
    ]
  })

  if (existingUser) {
    if (existingUser.email.toLowerCase() === email.toLowerCase()) {
      throw new Error("User with this email already exists")
    }
    if (existingUser.username.toLowerCase() === username.toLowerCase()) {
      throw new Error("This username is already taken")
    }
  }

  // Hash the password
  const hashedPassword = await hash(password, 12)

  // Create the user with username included
  const result = await db.collection("users").insertOne({
    email,
    password: hashedPassword,
    name,
    username,       // <--- add username here
    createdAt: new Date(),
  })

  return { id: result.insertedId, email, name, username }
}

export async function findUserByEmail(email) {
  const client = await clientPromise
  const db = client.db()

  return db.collection("users").findOne({ email })
}

export async function validatePassword(user, inputPassword) {
  return compare(inputPassword, user.password)
}
export async function updateUser(userId, updateData) {
  const client = await clientPromise
  const db = client.db()

  const { name, username } = updateData

  // Check if username is taken by another user
  if (username) {
    const existingUser = await db.collection("users").findOne({
      username,
      _id: { $ne: new ObjectId(userId) }
    })
    if (existingUser) {
      throw new Error("Username already taken")
    }
  }

  const result = await db.collection("users").updateOne(
    { _id: new ObjectId(userId) },
    { $set: { name, username, updatedAt: new Date() } }
  )

  return result
}

export async function findUserById(id) {
  const client = await clientPromise
  const db = client.db()
  return db.collection("users").findOne({ _id: new ObjectId(id) })
}
