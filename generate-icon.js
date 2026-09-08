import fs from 'fs'
import path from 'path'
import pngToIcoModule from 'png-to-ico'

const pngToIco = pngToIcoModule.default || pngToIcoModule

async function generateAppIcons() {
  const sourceLogo = path.resolve('src/renderer/src/assets/mandi_logo.png')
  const buildDir = path.resolve('build')

  if (!fs.existsSync(sourceLogo)) {
    console.error('Source logo not found at:', sourceLogo)
    process.exit(1)
  }

  if (!fs.existsSync(buildDir)) {
    fs.mkdirSync(buildDir, { recursive: true })
  }

  // 1. Copy full 1024x1024 PNG to build/icon.png
  const destPng = path.join(buildDir, 'icon.png')
  fs.copyFileSync(sourceLogo, destPng)
  console.log(`[Icon] Successfully copied ${destPng} (${fs.statSync(destPng).size} bytes)`)

  // 2. Generate multi-resolution build/icon.ico (256, 128, 64, 48, 32, 16)
  const destIco = path.join(buildDir, 'icon.ico')
  const icoBuffer = await pngToIco(destPng)
  fs.writeFileSync(destIco, icoBuffer)
  console.log(`[Icon] Successfully generated ${destIco} (${icoBuffer.length} bytes)`)

  console.log('[Icon] All Soneri Commission Shop icons generated successfully!')
}

generateAppIcons().catch((err) => {
  console.error('[Icon] Error generating icons:', err)
  process.exit(1)
})
