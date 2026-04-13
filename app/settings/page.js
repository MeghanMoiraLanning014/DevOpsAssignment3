import { redirect } from "next/navigation"
import { getCurrentUser } from "../../lib/auth"
import { updateProfile } from "../../actions/auth"
import { findUserById } from "../../models/User"

export default async function SettingsPage() {
    const sessionUser = await getCurrentUser()

    if (!sessionUser) {
        redirect("/sign-in")
    }

    // Fetch full user from DB to ensure we have the username
    const dbUser = await findUserById(sessionUser.id)

    if (!dbUser) {
        redirect("/sign-in")
    }

    const user = {
        id: dbUser._id.toString(),
        email: dbUser.email,
        name: dbUser.name,
        username: dbUser.username
    }

    return (
        <div className="max-w-2xl mx-auto py-12 px-4">
            <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
                <div className="bg-indigo-600 px-8 py-8 flex items-center gap-6">
                    <div className="w-20 h-20 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center text-3xl font-bold text-white shadow-inner uppercase">
                        {user.name.charAt(0)}
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold text-white">{user.name}</h1>
                        <p className="text-indigo-100 flex items-center gap-2 mt-1">
                            <span className="font-bold">@{user.username}</span>
                            <span className="w-1 h-1 rounded-full bg-white/30" />
                            <span className="opacity-70 text-sm">{user.email}</span>
                        </p>
                    </div>
                </div>

                <form action={updateProfile} className="p-8 space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label htmlFor="name" className="text-sm font-bold text-gray-700">Full Name</label>
                            <input
                                id="name"
                                name="name"
                                type="text"
                                defaultValue={user.name}
                                required
                                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 transition-all font-medium"
                            />
                        </div>

                        <div className="space-y-2">
                            <label htmlFor="username" className="text-sm font-bold text-gray-700">Username</label>
                            <input
                                id="username"
                                type="text"
                                value={user.username}
                                disabled
                                className="w-full px-4 py-2.5 rounded-xl border border-gray-100 bg-gray-50 text-gray-400 cursor-not-allowed font-medium"
                            />
                            <p className="text-[10px] text-gray-400 italic">Username is unique and cannot be changed.</p>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-semibold text-gray-700">Email Address</label>
                        <input
                            type="email"
                            value={user.email}
                            disabled
                            className="w-full px-4 py-2 rounded-lg border border-gray-200 bg-gray-50 text-gray-500 cursor-not-allowed"
                        />
                        <p className="text-xs text-gray-400 italic">Email cannot be changed for security reasons.</p>
                    </div>

                    <div className="pt-6 border-t border-gray-100 flex justify-end">
                        <button
                            type="submit"
                            className="px-6 py-2.5 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 transition-all active:scale-95 shadow-lg"
                        >
                            Save Changes
                        </button>
                    </div>
                </form>
            </div>

            <div className="mt-8 bg-red-50 rounded-xl p-6 border border-red-100">
                <h3 className="text-red-800 font-bold">Danger Zone</h3>
                <p className="text-red-600 text-sm mt-1">Proceed with caution. These actions cannot be undone.</p>
                <button className="mt-4 px-4 py-2 bg-white border border-red-200 text-red-600 font-medium rounded-lg hover:bg-red-50 transition-colors">
                    Delete Account
                </button>
            </div>
        </div>
    )
}
