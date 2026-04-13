"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "../actions/auth";
import { Palette, LayoutDashboard, Settings, LogOut, User } from "lucide-react";

export default function Navbar({ user }) {
  const pathname = usePathname();

  return (
    <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100 h-16 transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full">
        <div className="flex justify-between items-center h-full">
          {/* Logo Section */}
          <div className="flex items-center gap-2">
            <Link href="/" className="flex items-center gap-2 group">
              <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-indigo-200 group-hover:scale-110 transition-transform duration-300">
                <Palette size={22} />
              </div>
              <span className="text-xl font-black text-gray-900 tracking-tight hidden sm:block">
                Color<span className="text-indigo-600">Palette</span>
              </span>
            </Link>
          </div>

          {/* Navigation Section */}
          <div className="flex items-center gap-1 sm:gap-4">
            {user ? (
              <>
                <div className="hidden md:flex items-center gap-1 mr-4 border-r border-gray-100 pr-4">
                  <Link
                    href="/dashboard"
                    className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold transition-all ${pathname === "/dashboard"
                      ? "bg-indigo-50 text-indigo-600"
                      : "text-gray-500 hover:bg-gray-50 hover:text-gray-900"
                      }`}
                  >
                    <LayoutDashboard size={18} />
                    <span>Dashboard</span>
                  </Link>
                  <Link
                    href="/settings"
                    className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold transition-all ${pathname === "/settings"
                      ? "bg-indigo-50 text-indigo-600"
                      : "text-gray-500 hover:bg-gray-50 hover:text-gray-900"
                      }`}
                  >
                    <Settings size={18} />
                    <span>Settings</span>
                  </Link>
                </div>

                {/* User Profile & Sign Out */}
                <div className="flex items-center gap-4">
                  <div className="flex flex-col items-end text-right">
                    <span className="text-sm font-black text-gray-900 leading-tight">
                      {user.name}
                    </span>
                  </div>

                  <div className="relative group">
                    <button className="w-10 h-10 rounded-xl bg-gray-50 border border-gray-200 flex items-center justify-center text-gray-600 hover:bg-white hover:border-indigo-200 transition-all shadow-sm overflow-hidden">
                      <User size={20} />
                    </button>

                    {/* Simplified Dropdown */}
                    <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-2xl border border-gray-100 py-4 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 translate-y-2 group-hover:translate-y-0">
                      <div className="px-6 pb-4 border-b border-gray-50 mb-2">
                        <p className="text-sm font-black text-gray-900 leading-tight">{user.name}</p>
                        <p className="text-xs font-bold text-indigo-500 tracking-wider mt-0.5">@{user.username}</p>
                      </div>
                      <form action={signOut} className="px-2">
                        <button
                          type="submit"
                          className="w-full flex items-center gap-3 px-4 py-2.5 text-sm font-bold text-rose-600 hover:bg-rose-50 rounded-xl transition-colors"
                        >
                          <LogOut size={18} /> Sign Out
                        </button>
                      </form>
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <div className="flex items-center gap-3">
                <Link
                  href="/sign-in"
                  className="px-5 py-2 rounded-xl text-sm font-bold text-gray-600 hover:bg-gray-50 transition-all"
                >
                  Sign In
                </Link>
                <Link
                  href="/sign-up"
                  className="px-6 py-2 rounded-xl text-sm font-bold bg-gray-900 text-white hover:bg-indigo-600 transition-all shadow-lg shadow-gray-200 active:scale-95"
                >
                  Join Now
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
