import { ObjectId } from "mongodb"
import clientPromise from "../lib/mongodb"

export async function savePalette(userId, colors, options = {}) {
  const client = await clientPromise
  const db = client.db()

  const { name = "Untitled Palette", tags = [], isFavorite = false } = options

  const result = await db.collection("palettes").insertOne({
    userId: new ObjectId(userId),
    colors,
    name,
    tags,
    isFavorite,
    createdAt: new Date(),
  })

  return { id: result.insertedId, colors, name, tags, isFavorite, createdAt: new Date() }
}

export async function getUserPalettes(userId, filters = {}) {
  const client = await clientPromise
  const db = client.db()

  const query = { userId: new ObjectId(userId) }

  if (filters.isFavorite !== undefined) {
    query.isFavorite = filters.isFavorite
  }

  if (filters.tag) {
    query.tags = filters.tag
  }

  return db
    .collection("palettes")
    .find(query)
    .sort({ createdAt: -1 })
    .toArray()
}

export async function deletePalette(userId, paletteId) {
  const client = await clientPromise
  const db = client.db()

  return db.collection("palettes").deleteOne({
    _id: new ObjectId(paletteId),
    userId: new ObjectId(userId),
  })
}

export async function toggleFavorite(userId, paletteId, isFavorite) {
  const client = await clientPromise
  const db = client.db()

  return db.collection("palettes").updateOne(
    { _id: new ObjectId(paletteId), userId: new ObjectId(userId) },
    { $set: { isFavorite } }
  )
}

