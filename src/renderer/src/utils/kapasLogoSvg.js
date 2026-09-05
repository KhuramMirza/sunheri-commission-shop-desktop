/**
 * Authentic Kapas (Cotton Boll) Vector Emblem SVG
 * Optimized for crisp high-contrast printing (300+ DPI) and UI display.
 */
export const KAPAS_LOGO_SVG = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="46" height="46" class="kapas-logo" style="display: inline-block; vertical-align: middle;">
  <defs>
    <radialGradient id="cottonGlow" cx="45%" cy="38%" r="60%">
      <stop offset="0%" stop-color="#ffffff" />
      <stop offset="70%" stop-color="#f8fafc" />
      <stop offset="100%" stop-color="#e2e8f0" />
    </radialGradient>
    <linearGradient id="leafGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#1b4332" />
      <stop offset="100%" stop-color="#081c15" />
    </linearGradient>
    <linearGradient id="goldRing" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#d4af37" />
      <stop offset="50%" stop-color="#f59e0b" />
      <stop offset="100%" stop-color="#b45309" />
    </linearGradient>
  </defs>

  <!-- Outer Double Circle Emblem Badge -->
  <circle cx="50" cy="50" r="47" fill="#ffffff" stroke="#1b4332" stroke-width="2.2" />
  <circle cx="50" cy="50" r="44" fill="none" stroke="#d4af37" stroke-width="1.2" stroke-dasharray="2.5, 2" />

  <!-- Wooden/Green Stem -->
  <path d="M50 75 Q52 85 58 89" fill="none" stroke="#1b4332" stroke-width="3" stroke-linecap="round" />

  <!-- Outer Protective Calyx Bracts (Sepals) -->
  <!-- Left Calyx Leaf -->
  <path d="M50 72 C39 74 27 66 23 52 C31 56 41 64 50 72 Z" fill="url(#leafGrad)" stroke="#000" stroke-width="0.8" />
  <!-- Right Calyx Leaf -->
  <path d="M50 72 C61 74 73 66 77 52 C69 56 59 64 50 72 Z" fill="url(#leafGrad)" stroke="#000" stroke-width="0.8" />

  <!-- 4 Plump Soft Cotton Boll Lobes -->
  <!-- Top Center Lobe -->
  <circle cx="50" cy="37" r="16" fill="url(#cottonGlow)" stroke="#475569" stroke-width="1" />
  <!-- Left Lobe -->
  <circle cx="36" cy="48" r="15" fill="url(#cottonGlow)" stroke="#475569" stroke-width="1" />
  <!-- Right Lobe -->
  <circle cx="64" cy="48" r="15" fill="url(#cottonGlow)" stroke="#475569" stroke-width="1" />
  <!-- Bottom Center Lobe -->
  <circle cx="50" cy="54" r="15.5" fill="url(#cottonGlow)" stroke="#475569" stroke-width="1" />

  <!-- Cotton Pillowy Tuft Texture Folds -->
  <path d="M42 35 Q50 39 58 35" fill="none" stroke="#94a3b8" stroke-width="1.2" stroke-linecap="round" />
  <path d="M34 47 Q39 52 44 54" fill="none" stroke="#94a3b8" stroke-width="1.2" stroke-linecap="round" />
  <path d="M66 47 Q61 52 56 54" fill="none" stroke="#94a3b8" stroke-width="1.2" stroke-linecap="round" />
  <path d="M46 54 Q50 56 54 54" fill="none" stroke="#cbd5e1" stroke-width="1.2" stroke-linecap="round" />

  <!-- Front Central Calyx Sepals embracing the cotton -->
  <path d="M50 72 C46 65 47 55 50 49 C53 55 54 65 50 72 Z" fill="url(#leafGrad)" stroke="#000" stroke-width="0.8" />
  <path d="M49 71 C43 68 37 60 34 51 C39 57 45 64 49 71 Z" fill="url(#leafGrad)" stroke="#000" stroke-width="0.8" />
  <path d="M51 71 C57 68 63 60 66 51 C61 57 55 64 51 71 Z" fill="url(#leafGrad)" stroke="#000" stroke-width="0.8" />
</svg>
`
