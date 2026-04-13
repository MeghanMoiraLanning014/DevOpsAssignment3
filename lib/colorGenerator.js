// Convert HSL to HEX
function hslToHex(h, s, l) {
  l /= 100
  const a = (s * Math.min(l, 1 - l)) / 100
  const f = (n) => {
    const k = (n + h / 30) % 12
    const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1)
    return Math.round(255 * color)
      .toString(16)
      .padStart(2, "0")
  }
  return `#${f(0)}${f(8)}${f(4)}`
}

// Generate a random color in HSL
function getRandomHue() {
  return Math.floor(Math.random() * 360)
}

// Generate a monochromatic palette
export function generateMonochromaticPalette() {
  const hue = getRandomHue()
  return [
    hslToHex(hue, 100, 90),
    hslToHex(hue, 100, 80),
    hslToHex(hue, 100, 70),
    hslToHex(hue, 100, 60),
    hslToHex(hue, 100, 50),
  ]
}

// Generate an analogous palette
export function generateAnalogousPalette() {
  const hue = getRandomHue()
  return [
    hslToHex(hue, 100, 50),
    hslToHex((hue + 30) % 360, 100, 50),
    hslToHex((hue + 60) % 360, 100, 50),
    hslToHex((hue + 90) % 360, 100, 50),
    hslToHex((hue + 120) % 360, 100, 50),
  ]
}

// Generate a complementary palette
export function generateComplementaryPalette() {
  const hue = getRandomHue()
  return [
    hslToHex(hue, 100, 70),
    hslToHex(hue, 100, 50),
    hslToHex(hue, 100, 30),
    hslToHex((hue + 180) % 360, 100, 70),
    hslToHex((hue + 180) % 360, 100, 50),
  ]
}

// Generate a random palette
export function generateRandomPalette() {
  const generators = [generateMonochromaticPalette, generateAnalogousPalette, generateComplementaryPalette]

  const randomGenerator = generators[Math.floor(Math.random() * generators.length)]
  return randomGenerator()
}
// Generate variations (shades and tints)
export function generateVariations(hex) {
  // Simple hex to rgb
  const r = parseInt(hex.slice(1, 3), 16)
  const g = parseInt(hex.slice(3, 5), 16)
  const b = parseInt(hex.slice(5, 7), 16)

  const variations = []

  // Tints (lighter)
  for (let i = 1; i <= 4; i++) {
    const factor = i * 0.2
    const nr = Math.round(r + (255 - r) * factor).toString(16).padStart(2, '0')
    const ng = Math.round(g + (255 - g) * factor).toString(16).padStart(2, '0')
    const nb = Math.round(b + (255 - b) * factor).toString(16).padStart(2, '0')
    variations.unshift(`#${nr}${ng}${nb}`)
  }

  variations.push(hex) // Original

  // Shades (darker)
  for (let i = 1; i <= 4; i++) {
    const factor = 1 - (i * 0.15)
    const nr = Math.round(r * factor).toString(16).padStart(2, '0')
    const ng = Math.round(g * factor).toString(16).padStart(2, '0')
    const nb = Math.round(b * factor).toString(16).padStart(2, '0')
    variations.push(`#${nr}${ng}${nb}`)
  }

  return variations
}
