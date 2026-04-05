interface LogoParams {
  letter: string
  primaryColor: string
  secondaryColor: string
  backgroundColor: string
  shape: 'circle' | 'rounded-square' | 'hexagon' | 'diamond'
  fontFamily: string
}

export function generateLogoSVG(params: LogoParams): string {
  const { letter, primaryColor, backgroundColor, shape, fontFamily } = params
  const size = 400
  const center = size / 2

  let shapeSVG = ''
  switch (shape) {
    case 'circle':
      shapeSVG = `<circle cx="${center}" cy="${center}" r="${center - 20}" fill="${primaryColor}" />`
      break
    case 'rounded-square':
      shapeSVG = `<rect x="20" y="20" width="${size - 40}" height="${size - 40}" rx="40" fill="${primaryColor}" />`
      break
    case 'hexagon': {
      const pts = Array.from({ length: 6 }, (_, i) => {
        const angle = (Math.PI / 3) * i - Math.PI / 2
        const r = center - 20
        return `${center + r * Math.cos(angle)},${center + r * Math.sin(angle)}`
      }).join(' ')
      shapeSVG = `<polygon points="${pts}" fill="${primaryColor}" />`
      break
    }
    case 'diamond':
      shapeSVG = `<polygon points="${center},20 ${size - 20},${center} ${center},${size - 20} 20,${center}" fill="${primaryColor}" />`
      break
  }

  const fontSize = letter.length === 1 ? 180 : letter.length === 2 ? 140 : 100

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${size} ${size}" width="${size}" height="${size}">
  <defs>
    <style>@import url('https://fonts.googleapis.com/css2?family=${encodeURIComponent(fontFamily)}:wght@700&amp;display=swap');</style>
  </defs>
  ${shapeSVG}
  <text
    x="${center}"
    y="${center}"
    text-anchor="middle"
    dominant-baseline="central"
    font-family="'${fontFamily}', Arial, sans-serif"
    font-weight="700"
    font-size="${fontSize}"
    fill="${backgroundColor}"
    letter-spacing="-2"
  >${letter.toUpperCase()}</text>
</svg>`
}

export function generateWordmarkSVG(params: {
  brandName: string
  primaryColor: string
  fontFamily: string
}): string {
  const { brandName, primaryColor, fontFamily } = params
  const width = Math.max(brandName.length * 45, 300)

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} 80" width="${width}" height="80">
  <defs>
    <style>@import url('https://fonts.googleapis.com/css2?family=${encodeURIComponent(fontFamily)}:wght@700&amp;display=swap');</style>
  </defs>
  <text
    x="0"
    y="55"
    font-family="'${fontFamily}', Arial, sans-serif"
    font-weight="700"
    font-size="52"
    fill="${primaryColor}"
    letter-spacing="1"
  >${brandName}</text>
</svg>`
}
