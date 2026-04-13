import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "../components/Navbar";
import { getCurrentUser } from "../lib/auth";
import { findUserById } from "../models/User";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "ColorPalette - Generate Beautiful Color Palettes",
  description: "Create and save beautiful color palettes with just a click.",
  generator: "v0.dev",
};

export default async function RootLayout({ children }) {
  const sessionUser = await getCurrentUser();
  let user = null;

  if (sessionUser?.id) {
    const dbUser = await findUserById(sessionUser.id);
    if (dbUser) {
      user = {
        id: dbUser._id.toString(),
        email: dbUser.email,
        name: dbUser.name,
        username: dbUser.username
      };
    }
  }

  return (
    <html lang="en">
      <body className={inter.className} suppressHydrationWarning>
        <Navbar user={user} />
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">{children}</main>
      </body>
    </html>
  );
}