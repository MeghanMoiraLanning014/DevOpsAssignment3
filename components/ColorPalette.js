"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { generatePalette, savePaletteAction } from "../actions/palette"
import { Plus, Trash2, Copy, RefreshCw, Save, MoreHorizontal, X, ArrowRight } from "lucide-react"
import { generateVariations } from "../lib/colorGenerator"

export default function ColorPalette() {
  const [colors, setColors] = useState(["#f8f9fa", "#e9ecef", "#dee2e6", "#ced4da", "#adb5bd"])
  const [name, setName] = useState("")
  const [isSaving, setIsSaving] = useState(false)
  const [message, setMessage] = useState("")
  const [activeVariationColor, setActiveVariationColor] = useState(null)
  const router = useRouter()

  const variations = activeVariationColor
    ? generateVariations(activeVariationColor.color)
    : []

  async function handleGeneratePalette() {
    const result = await generatePalette()
    if (result.error) {
      setMessage(result.error)
      return
    }

    setColors(result.colors)
    setMessage("")
    setName("")
  }

  async function handleSavePalette() {
    if (name.length < 3) {
      setMessage("Please enter a palette name (min 3 chars)")
      return
    }

    setIsSaving(true)
    const result = await savePaletteAction(colors, { name })
    setIsSaving(false)

    if (result.error) {
      setMessage(result.error)
      return
    }

    setMessage("Palette saved successfully!")
    setName("")
    router.refresh()

    setTimeout(() => {
      setMessage("")
    }, 3000)
  }

  function updateColor(index, newColor) {
    const newColors = [...colors]
    newColors[index] = newColor
    setColors(newColors)
  }

  function removeColor(index) {
    if (colors.length <= 2) {
      setMessage("A palette must have at least 2 colors")
      return
    }
    const newColors = colors.filter((_, i) => i !== index)
    setColors(newColors)
    if (activeVariationColor?.index === index) setActiveVariationColor(null)
  }

  function addColor() {
    if (colors.length >= 8) {
      setMessage("Maximum 8 colors allowed")
      return
    }
    setColors([...colors, "#ffffff"])
  }

  function copyToClipboard(color) {
    navigator.clipboard.writeText(color)
    setMessage(`Copied ${color} to clipboard!`)
    setTimeout(() => setMessage(""), 3000)
  }

  function applyVariation(variationColor) {
    if (activeVariationColor) {
      updateColor(activeVariationColor.index, variationColor)
      setActiveVariationColor({ ...activeVariationColor, color: variationColor })
    }
  }

  return (
    <div className="bg-white p-6 rounded-3xl shadow-xl border border-gray-100 space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex-1">
          <label htmlFor="palette-name" className="block text-sm font-bold text-gray-700 mb-1">
            Palette Name
          </label>
          <input
            id="palette-name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Modern Sunset"
            className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all shadow-sm text-sm"
          />
        </div>
        <div className="flex items-end gap-2">
          <button
            onClick={handleGeneratePalette}
            className="flex items-center gap-2 px-6 py-2.5 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 transition-all active:scale-95 shadow-lg shadow-indigo-100"
          >
            <RefreshCw size={18} />
            Generate
          </button>
          <button
            onClick={addColor}
            className="flex items-center gap-2 px-4 py-2.5 bg-gray-100 text-gray-600 font-bold rounded-xl hover:bg-gray-200 transition-all active:scale-95 border border-gray-200"
            title="Add color"
          >
            <Plus size={18} />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-5 xl:grid-cols-8 gap-4">
        {colors.map((color, index) => (
          <div key={index} className={`group relative flex flex-col items-center bg-gray-50/50 p-2 rounded-2xl border transition-all ${activeVariationColor?.index === index ? 'border-indigo-500 ring-2 ring-indigo-50' : 'border-gray-100'}`}>
            <div
              className="w-full aspect-[3/4] rounded-xl cursor-pointer transition-transform hover:scale-[1.02] shadow-sm mb-3 relative overflow-hidden ring-1 ring-black/5"
              style={{ backgroundColor: color }}
              onClick={() => copyToClipboard(color)}
            >
              <div className="absolute inset-x-0 bottom-0 bg-black/5 backdrop-blur-[2px] py-1 text-[10px] font-bold text-white text-center opacity-0 group-hover:opacity-100 transition-opacity">
                COPY HEX
              </div>
            </div>

            <div className="flex items-center gap-1.5 w-full">
              <input
                type="text"
                value={color}
                onChange={(e) => updateColor(index, e.target.value)}
                className="w-full text-[10px] font-bold text-center bg-white border border-gray-200 rounded-lg px-1 py-1 uppercase text-gray-700"
              />
              <button
                onClick={() => setActiveVariationColor({ index, color })}
                className={`p-1 rounded-md transition-colors ${activeVariationColor?.index === index ? 'text-indigo-600 bg-indigo-50' : 'text-gray-400 hover:bg-gray-200'}`}
                title="View Variations"
              >
                <MoreHorizontal size={14} />
              </button>
              <button
                onClick={() => removeColor(index)}
                className="p-1 text-gray-400 hover:text-red-500 transition-colors"
                title="Remove color"
              >
                <Trash2 size={14} />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Variations Feature */}
      {activeVariationColor && (
        <div className="bg-indigo-50/50 rounded-3xl p-6 border border-indigo-100 animate-in slide-in-from-top-4 duration-300">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-bold text-indigo-900 flex items-center gap-2">
              <Layout size={16} />
              Shades & Tints for {activeVariationColor.color}
            </h3>
            <button
              onClick={() => setActiveVariationColor(null)}
              className="p-1 text-indigo-400 hover:text-indigo-600 transition-colors"
            >
              <X size={18} />
            </button>
          </div>
          <div className="grid grid-cols-3 sm:grid-cols-9 gap-3">
            {variations.map((vColor, idx) => (
              <div key={idx} className="space-y-2">
                <button
                  onClick={() => applyVariation(vColor)}
                  className={`w-full aspect-square rounded-xl shadow-sm transition-transform hover:scale-110 ring-2 ${vColor === activeVariationColor.color ? 'ring-indigo-500' : 'ring-transparent'}`}
                  style={{ backgroundColor: vColor }}
                />
                <p className="text-[8px] font-bold text-center text-indigo-400 uppercase">{vColor}</p>
              </div>
            ))}
          </div>
          <p className="mt-4 text-[10px] text-indigo-400 font-medium text-center">
            Click a swatch above to apply the variation to slot #{activeVariationColor.index + 1}
          </p>
        </div>
      )}

      <div className="flex justify-center pt-4">
        <button
          onClick={handleSavePalette}
          disabled={isSaving}
          className="flex items-center gap-3 px-10 py-4 bg-gray-900 text-white font-bold rounded-2xl hover:bg-black transition-all disabled:opacity-50 active:scale-95 shadow-xl shadow-gray-200 group"
        >
          <Save size={20} className="group-hover:translate-y-[-1px] transition-transform" />
          {isSaving ? "Saving..." : "Save to Collection"}
        </button>
      </div>

      {message && (
        <div className={`text-center p-4 rounded-2xl font-bold text-sm animate-in fade-in slide-in-from-bottom-2 ${message.includes("error") || message.includes("Please")
            ? "bg-rose-50 text-rose-600 border border-rose-100"
            : "bg-emerald-50 text-emerald-600 border border-emerald-100"
          }`}>
          {message}
        </div>
      )}
    </div>
  )
}

