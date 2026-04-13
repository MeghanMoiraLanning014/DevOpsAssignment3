"use server";

import { createUser, findUserByEmail, validatePassword, updateUser, findUserById } from "../models/User";
import { createToken, setAuthCookie, removeAuthCookie, getCurrentUser } from "../lib/auth";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

export async function updateProfile(formData) {
  const sessionUser = await getCurrentUser()
  if (!sessionUser || !sessionUser.id) {
    return { error: "Unauthorized" }
  }

  // Fetch full user to get the current username (in case it's missing from old session token)
  const fullUser = await findUserById(sessionUser.id)
  if (!fullUser) {
    return { error: "User not found" }
  }

  const name = formData.get("name")
  const username = fullUser.username

  if (!name || name.length < 2) {
    return { error: "Name must be at least 2 characters" }
  }

  try {
    await updateUser(sessionUser.id, { name })

    // Update token/cookie with new info, keeping existing username
    const token = createToken({ id: sessionUser.id, email: sessionUser.email, name, username });
    await setAuthCookie(token);

    revalidatePath("/settings")
    revalidatePath("/dashboard")
    return { success: true }
  } catch (error) {
    return { error: error.message }
  }
}

export async function signUp(formData) {
  try {
    const email = formData.get("email");
    const password = formData.get("password");
    const name = formData.get("name");
    const username = formData.get("username");

    if (!email || !password || !name || !username) {
      return { error: "All fields are required" };
    }

    const user = await createUser({ email, password, name, username });

    const token = createToken({
      id: user.id.toString(),
      email: user.email,
      name: user.name,
      username: user.username
    });

    await setAuthCookie(token);

    return { success: true };
  } catch (error) {
    return { error: error.message };
  }
}


export async function signIn(formData) {
  try {
    const email = formData.get("email");
    const password = formData.get("password");

    if (!email || !password) {
      return { error: "Email and password are required" };
    }

    const user = await findUserByEmail(email);
    if (!user) {
      return { error: "Invalid email or password" };
    }

    const isValid = await validatePassword(user, password);
    if (!isValid) {
      return { error: "Invalid email or password" };
    }

    const token = createToken({
      id: user._id.toString(),
      email: user.email,
      name: user.name,
      username: user.username
    });
    console.log("SignIn: Token Created for User:", user.email);

    await setAuthCookie(token);
    console.log("SignIn: Cookie Set, Returning Success");

    return { success: true };
  } catch (error) {
    console.error("SignIn Error:", error.message);
    return { error: error.message || "An unexpected error occurred" };
  }
}

export async function signOut() {
  try {
    await removeAuthCookie(); // Remove the auth cookie
  } catch (error) {
    console.error("SignOut Error:", error.message);
    return { error: error.message || "Failed to sign out" };
  }
  redirect("/sign-in"); // Redirect to sign-in page - must be outside try-catch
}