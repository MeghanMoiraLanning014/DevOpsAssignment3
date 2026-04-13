import Link from "next/link"
import { Palette, Share2, Shield, Zap, Heart, Layout } from "lucide-react"

export default function Home() {
  return (
    <div className="flex flex-col gap-20 pb-20">
      {/* Hero Section */}
      <section className="relative pt-20 pb-16 px-4 overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full -z-10 overflow-hidden">
          <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-100/50 rounded-full blur-[100px]" />
          <div className="absolute bottom-[10%] right-[-10%] w-[30%] h-[30%] bg-rose-100/50 rounded-full blur-[100px]" />
        </div>

        <div className="max-w-4xl mx-auto text-center space-y-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-600 text-sm font-medium animate-fade-in">
            <Zap size={14} />
            <span>New: Advanced Contrast Checking</span>
          </div>

          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-gray-900 leading-[1.1]">
            Design faster with <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-rose-500">perfect colors</span>
          </h1>

          <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
            The super-fast color schemes generator! Create, save and share perfect palettes in seconds. Optimized for designers and developers.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Link
              href="/sign-up"
              className="w-full sm:w-auto px-8 py-4 bg-gray-900 text-white rounded-2xl font-bold text-lg hover:bg-gray-800 transition-all hover:scale-105 shadow-xl shadow-gray-200"
            >
              Start Generating — It's Free
            </Link>
            <Link
              href="/sign-in"
              className="w-full sm:w-auto px-8 py-4 bg-white text-gray-700 border border-gray-200 rounded-2xl font-bold text-lg hover:bg-gray-50 transition-all"
            >
              View Examples
            </Link>
          </div>
        </div>

        {/* Visual Preview */}
        <div className="mt-20 max-w-5xl mx-auto grid grid-cols-5 h-64 rounded-3xl overflow-hidden shadow-2xl border-8 border-white group">
          <div className="bg-[#264653] relative group/color transition-all hover:flex-[1.5]">
            <span className="absolute bottom-4 left-4 text-white text-xs font-bold opacity-0 group-hover/color:opacity-100 transition-opacity uppercase tracking-widest">#264653</span>
          </div>
          <div className="bg-[#2a9d8f] relative group/color transition-all hover:flex-[1.5]">
            <span className="absolute bottom-4 left-4 text-white text-xs font-bold opacity-0 group-hover/color:opacity-100 transition-opacity uppercase tracking-widest">#2a9d8f</span>
          </div>
          <div className="bg-[#e9c46a] relative group/color transition-all hover:flex-[1.5]">
            <span className="absolute bottom-4 left-4 text-white text-xs font-bold opacity-0 group-hover/color:opacity-100 transition-opacity uppercase tracking-widest">#e9c46a</span>
          </div>
          <div className="bg-[#f4a261] relative group/color transition-all hover:flex-[1.5]">
            <span className="absolute bottom-4 left-4 text-white text-xs font-bold opacity-0 group-hover/color:opacity-100 transition-opacity uppercase tracking-widest">#f4a261</span>
          </div>
          <div className="bg-[#e76f51] relative group/color transition-all hover:flex-[1.5]">
            <span className="absolute bottom-4 left-4 text-white text-xs font-bold opacity-0 group-hover/color:opacity-100 transition-opacity uppercase tracking-widest">#e76f51</span>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-12">
        <div className="space-y-4 p-8 rounded-3xl bg-white border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
          <div className="w-12 h-12 rounded-2xl bg-indigo-50 flex items-center justify-center text-indigo-600">
            <Palette size={24} />
          </div>
          <h3 className="text-xl font-bold text-gray-900">Custom Generation</h3>
          <p className="text-gray-500 leading-relaxed">
            Use advanced algorithms to generate monochromatic, analogous, or triadic palettes instantly.
          </p>
        </div>

        <div className="space-y-4 p-8 rounded-3xl bg-white border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
          <div className="w-12 h-12 rounded-2xl bg-rose-50 flex items-center justify-center text-rose-600">
            <Heart size={24} />
          </div>
          <h3 className="text-xl font-bold text-gray-900">Personal Collection</h3>
          <p className="text-gray-500 leading-relaxed">
            Create an account to save your favorite palettes, name them, and organize your design assets.
          </p>
        </div>

        <div className="space-y-4 p-8 rounded-3xl bg-white border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
          <div className="w-12 h-12 rounded-2xl bg-amber-50 flex items-center justify-center text-amber-600">
            <Share2 size={24} />
          </div>
          <h3 className="text-xl font-bold text-gray-900">One-Click Export</h3>
          <p className="text-gray-500 leading-relaxed">
            Export your palettes to CSS, SCSS, or JSON. Quick copy HEX codes directly to your clipboard.
          </p>
        </div>
      </section>

      {/* Trust Quote */}
      <section className="bg-gray-50 rounded-[3rem] p-12 md:p-20 text-center max-w-7xl mx-auto w-full border border-gray-100">
        <div className="max-w-2xl mx-auto space-y-6">
          <h2 className="text-3xl font-bold text-gray-900">Ready to transform your workflow?</h2>
          <p className="text-gray-600">Join thousands of creatives building beautiful interfaces with our color tools.</p>
          <Link
            href="/sign-up"
            className="inline-block px-8 py-4 bg-indigo-600 text-white rounded-2xl font-bold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-200"
          >
            Create Your First Palette
          </Link>
        </div>
      </section>
    </div>
  )
}

