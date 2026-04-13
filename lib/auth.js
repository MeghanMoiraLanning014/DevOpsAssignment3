import { sign, verify } from "jsonwebtoken";
import { cookies } from "next/headers";

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";

// Create JWT token
export function createToken(payload) {
  const token = sign(payload, JWT_SECRET, { expiresIn: "7d" });
  console.log("Created Token:", token); // Debug log
  return token;
}

// Verify JWT token
export function verifyToken(token) {
  try {
    const decoded = verify(token, JWT_SECRET);
    console.log("Verified Token:", decoded); // Debug log
    return decoded;
  } catch (error) {
    console.error("Token Verification Failed:", error.message);
    return null;
  }
}

// Set JWT cookie
export async function setAuthCookie(token) {
  try {
    const cookieStore = await cookies();
    cookieStore.set("auth_token", token, {
      httpOnly: true,
      path: "/",
      secure: false, // Allow cookie over HTTP
      sameSite: "lax", // Use Lax for same-site requests
      maxAge: 60 * 60 * 24 * 7, // 1 week
      domain: process.env.COOKIE_DOMAIN || undefined,
    });
    console.log("Cookie Set Successfully: auth_token"); // Debug log
  } catch (error) {
    console.error("Error setting auth cookie:", error);
    throw new Error("Failed to set authentication cookie");
  }
}

// Get JWT cookie
export async function getAuthCookie() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("auth_token")?.value || null;
    console.log("Retrieved Cookie (auth_token):", token); // Debug log
    return token;
  } catch (error) {
    console.error("Error getting auth cookie:", error);
    return null;
  }
}

// Remove JWT cookie
export async function removeAuthCookie() {
  try {
    const cookieStore = await cookies();
    cookieStore.delete("auth_token");
    console.log("Cookie Removed: auth_token"); // Debug log
  } catch (error) {
    console.error("Error removing auth cookie:", error);
  }
}

// Get current user by verifying token
export async function getCurrentUser() {
  try {
    const token = await getAuthCookie();
    if (!token) {
      console.log("No Token Found in getCurrentUser");
      return null;
    }

    const decoded = verifyToken(token);
    if (!decoded) {
      console.log("Token Verification Failed in getCurrentUser");
      return null;
    }

    return decoded;
  } catch (error) {
    console.error("Error in getCurrentUser:", error);
    return null;
  }
}