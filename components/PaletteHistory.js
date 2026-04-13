"use client"

import { useState } from "react"
import { Trash2, Heart, Copy, Search, Filter, Download, Star } from "lucide-react"
import { deletePaletteAction, toggleFavoriteAction } from "../actions/palette"
import { jsPDF } from "jspdf"

export default function PaletteHistory({ initialPalettes = [], error }) {
  const [isDeleting, setIsDeleting] = useState(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [activeTab, setActiveTab] = useState("all") // "all" | "favorites"

  function formatDate(dateString) {
    return new Date(dateString).toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  async function handleDelete(id) {
    if (!confirm("Are you sure you want to delete this palette?")) return

    setIsDeleting(id)
    const result = await deletePaletteAction(id)
    setIsDeleting(null)

    if (result.error) {
      alert(result.error)
    }
  }

  async function handleToggleFavorite(id, currentStatus) {
    const result = await toggleFavoriteAction(id, !currentStatus)
    if (result.error) {
      alert(result.error)
    }
  }

  function copyToClipboard(color) {
    navigator.clipboard.writeText(color);
    alert(`Copied ${color} to clipboard!`);
  }

  const exportToPDF = (palette) => {
    const doc = new jsPDF();
    const { name, colors, createdAt } = palette;

    // Header
    doc.setFillColor(79, 70, 229); // Indigo 600
    doc.rect(0, 0, 210, 40, 'F');

    doc.setTextColor(255, 255, 255);
    doc.setFontSize(24);
    doc.setFont("helvetica", "bold");
    doc.text("Color Palette Spec", 20, 25);

    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.text(`Generated on ${formatDate(createdAt)}`, 20, 32);

    // Palette Name
    doc.setTextColor(31, 41, 55); // Gray 800
    doc.setFontSize(18);
    doc.setFont("helvetica", "bold");
    doc.text(name, 20, 60);

    // Colors
    let yPos = 80;
    colors.forEach((color, index) => {
      // Swatch
      doc.setDrawColor(229, 231, 235);
      doc.setFillColor(color);
      doc.rect(20, yPos, 40, 20, 'FD');

      // Text info
      doc.setTextColor(55, 65, 81);
      doc.setFontSize(12);
      doc.setFont("courier", "bold");
      doc.text(color.toUpperCase(), 70, yPos + 13);

      doc.setFontSize(8);
      doc.setFont("helvetica", "italic");
      doc.setTextColor(156, 163, 175);
      doc.text(`Color Slot ${index + 1}`, 70, yPos + 5);

      yPos += 30;
    });

    // Footer
    doc.setDrawColor(243, 244, 246);
    doc.line(20, 270, 190, 270);
    doc.setFontSize(8);
    doc.setTextColor(156, 163, 175);
    doc.text("Created with ColorPalette App • Join the design revolution", 105, 280, { align: "center" });

    doc.save(`${name.replace(/\s+/g, '-').toLowerCase()}-palette.pdf`);
  };

  const filteredPalettes = initialPalettes.filter(palette => {
    const matchesSearch = palette.name.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesTab = activeTab === "favorites" ? palette.isFavorite : true
    return matchesSearch && matchesTab
  })

  if (error) {
    return (
      <div className="text-center py-12 bg-red-50 rounded-xl border border-red-100">
        <p className="text-red-600 font-medium">{error}</p>
      </div>
    )
  }

  return (
    <div className="space-y-8 pb-20">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-gray-100">
        <div>
          <h2 className="text-2xl font-black text-gray-900 tracking-tight">Your Collection</h2>
          <div className="flex gap-4 mt-3">
            <button
              onClick={() => setActiveTab("all")}
              className={`text-sm font-bold pb-2 border-b-2 transition-all ${activeTab === 'all' ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-gray-400 hover:text-gray-600'}`}
            >
              All Palettes
            </button>
            <button
              onClick={() => setActiveTab("favorites")}
              className={`text-sm font-bold pb-2 border-b-2 transition-all flex items-center gap-1.5 ${activeTab === 'favorites' ? 'border-rose-500 text-rose-500' : 'border-transparent text-gray-400 hover:text-gray-600'}`}
            >
              <Star size={14} fill={activeTab === 'favorites' ? "currentColor" : "none"} />
              Favorites Only
            </button>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="relative group">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-indigo-500 transition-colors" size={18} />
            <input
              type="text"
              placeholder="Search by name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2.5 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-indigo-500 transition-all text-sm w-full md:w-64"
            />
          </div>
        </div>
      </div>

      {filteredPalettes.length === 0 ? (
        <div className="text-center py-24 bg-gray-50/50 rounded-[2.5rem] border-2 border-dashed border-gray-200">
          <div className="mx-auto w-20 h-20 bg-white rounded-3xl flex items-center justify-center mb-6 shadow-sm">
            <Filter className="text-gray-300" size={32} />
          </div>
          <h3 className="text-xl font-bold text-gray-900">
            {searchTerm || activeTab === "favorites" ? "No matches found" : "Your collection is empty"}
          </h3>
          <p className="text-gray-500 max-w-xs mx-auto mt-2 text-sm">
            {searchTerm || activeTab === "favorites"
              ? "We couldn't find any palettes matching your current criteria."
              : "Save your first generated palette to see it appear here!"}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredPalettes.map((palette) => (
            <div
              key={palette._id}
              className="group flex flex-col bg-white border border-gray-100 rounded-3xl overflow-hidden shadow-sm hover:shadow-2xl hover:shadow-indigo-100 transition-all duration-500 hover:translate-y-[-8px]"
            >
              {/* Card Header */}
              <div className="px-6 py-4 flex items-center justify-between bg-gray-50/50">
                <h3 className="font-bold text-gray-900 truncate pr-2 tracking-tight" title={palette.name}>
                  {palette.name}
                </h3>
                <div className="flex gap-1.5">
                  <button
                    onClick={() => handleToggleFavorite(palette._id, palette.isFavorite)}
                    className={`p-2 rounded-xl transition-all active:scale-90 ${palette.isFavorite ? 'text-rose-500 bg-rose-50' : 'text-gray-400 hover:bg-gray-100'
                      }`}
                  >
                    <Heart size={16} fill={palette.isFavorite ? "currentColor" : "none"} />
                  </button>
                  <button
                    onClick={() => handleDelete(palette._id)}
                    disabled={isDeleting === palette._id}
                    className="p-2 text-gray-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-all disabled:opacity-50"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>

              {/* Card Content - Visual Swatch */}
              <div className="flex h-36 w-full group/swatch">
                {palette.colors.map((color, index) => (
                  <div
                    key={index}
                    className="flex-1 h-full cursor-pointer transition-all hover:flex-[2] relative group/single-color"
                    style={{ backgroundColor: color }}
                    onClick={() => copyToClipboard(color)}
                  >
                    <div className="absolute inset-x-0 bottom-0 bg-black/20 backdrop-blur-sm py-1.5 text-[8px] font-black text-white text-center opacity-0 group-hover/single-color:opacity-100 transition-opacity uppercase">
                      {color}
                    </div>
                  </div>
                ))}
              </div>

              {/* Card Footer */}
              <div className="px-6 py-4 flex items-center justify-between text-[11px] font-bold text-gray-400">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full border-2 border-green-500" />
                  {formatDate(palette.createdAt)}
                </div>
                <button
                  onClick={() => exportToPDF(palette)}
                  className="px-3 py-1.5 bg-indigo-50 text-indigo-600 rounded-lg hover:bg-indigo-600 hover:text-white transition-all flex items-center gap-1.5 active:scale-95"
                >
                  <Download size={12} />
                  PDF Export
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
