"use server"

import { getCurrentUser } from "../lib/auth"
import { savePalette, getUserPalettes, deletePalette, toggleFavorite } from "../models/Palette"
import { generateRandomPalette } from "../lib/colorGenerator"
import { revalidatePath } from "next/cache"

export async function generatePalette() {
  const colors = generateRandomPalette()
  return { colors }
}

export async function savePaletteAction(colors, options = {}) {
  const user = await getCurrentUser()
  if (!user || !user.id) {
    return { error: "You must be logged in to save a palette" }
  }

  // Validation for test cases
  if (!colors || colors.length === 0) {
    return { error: "Palette must have colors" }
  }

  if (options.name && (options.name.length < 3 || options.name.length > 50)) {
    return { error: "Palette name must be between 3 and 50 characters" }
  }

  try {
    await savePalette(user.id, colors, options)
    revalidatePath("/dashboard")
    return { success: true }
  } catch (error) {
    return { error: error.message }
  }
}

export async function deletePaletteAction(paletteId) {
  const user = await getCurrentUser()
  if (!user || !user.id) {
    return { error: "Unauthorized" }
  }

  try {
    await deletePalette(user.id, paletteId)
    revalidatePath("/dashboard")
    return { success: true }
  } catch (error) {
    return { error: error.message }
  }
}

export async function toggleFavoriteAction(paletteId, isFavorite) {
  const user = await getCurrentUser()
  if (!user || !user.id) {
    return { error: "Unauthorized" }
  }

  try {
    await toggleFavorite(user.id, paletteId, isFavorite)
    revalidatePath("/dashboard")
    return { success: true }
  } catch (error) {
    return { error: error.message }
  }
}

export async function getPalettes(filters = {}) {
  const user = await getCurrentUser()
  if (!user) {
    return { error: "You must be logged in" }
  }

  try {
    const palettes = await getUserPalettes(user.id, filters)

    // Serialize palettes
    const serializedPalettes = palettes.map(palette => ({
      ...palette,
      _id: palette._id.toString(),
      userId: palette.userId.toString(),
      createdAt: palette.createdAt.toISOString(),
      name: palette.name || "Untitled Palette",
      tags: palette.tags || [],
      isFavorite: !!palette.isFavorite
    }))

    return { palettes: serializedPalettes }
  } catch (error) {
    return { error: error.message }
  }
}