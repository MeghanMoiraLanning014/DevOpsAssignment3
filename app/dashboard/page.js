import { redirect } from "next/navigation"
import { getCurrentUser } from "../../lib/auth"
import { getPalettes } from "../../actions/palette"
import ColorPalette from "../../components/ColorPalette"
import PaletteHistory from "../../components/PaletteHistory"

export default async function Dashboard() {
  const user = await getCurrentUser()

  if (!user) {
    redirect("/sign-in")
  }

  const { palettes, error } = await getPalettes()

  return (
    <div className="space-y-12">
      <div>
        <h1 className="text-2xl font-bold mb-6">Welcome, {user.name}</h1>
        <p className="text-gray-600 mb-8">Generate and save your favorite color palettes.</p>
        <ColorPalette />
      </div>

      <div>
        <PaletteHistory initialPalettes={palettes} error={error} />
      </div>
    </div>
  )
}

