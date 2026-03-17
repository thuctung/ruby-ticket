let cachedFontBase64: string | null = null

export async function getFontBase64() {
  if (cachedFontBase64) return cachedFontBase64

  const res = await fetch("/font/Roboto-Regular.ttf")
  const buffer = await res.arrayBuffer()

  // convert 1 lần duy nhất
  let binary = ""
  const bytes = new Uint8Array(buffer)

  for (let i = 0; i < bytes.length; i++) {
    binary += String.fromCharCode(bytes[i])
  }

  cachedFontBase64 = btoa(binary)

  return cachedFontBase64
}