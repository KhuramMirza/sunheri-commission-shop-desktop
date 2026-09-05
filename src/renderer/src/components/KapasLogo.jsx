import React from 'react'

/**
 * Reusable Kapas (Cotton Boll) Logo Component
 * @param {object} props
 * @param {string} props.className - Additional CSS classes
 * @param {number} props.size - Size in pixels (default 46)
 */
export default function KapasLogo({ className = '', size = 46 }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 100 100"
      width={size}
      height={size}
      className={`shrink-0 ${className}`}
      style={{ display: 'inline-block', verticalAlign: 'middle' }}
    >
      <defs>
        <radialGradient id="reactCottonGlow" cx="45%" cy="38%" r="60%">
          <stop offset="0%" stopColor="#ffffff" />
          <stop offset="70%" stopColor="#f8fafc" />
          <stop offset="100%" stopColor="#e2e8f0" />
        </radialGradient>
        <linearGradient id="reactLeafGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#1b4332" />
          <stop offset="100%" stopColor="#081c15" />
        </linearGradient>
        <linearGradient id="reactGoldRing" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#d4af37" />
          <stop offset="50%" stopColor="#f59e0b" />
          <stop offset="100%" stopColor="#b45309" />
        </linearGradient>
      </defs>

      {/* Outer Double Circle Emblem Badge */}
      <circle cx="50" cy="50" r="47" fill="#ffffff" stroke="#1b4332" strokeWidth="2.2" />
      <circle cx="50" cy="50" r="44" fill="none" stroke="#d4af37" strokeWidth="1.2" strokeDasharray="2.5, 2" />

      {/* Wooden/Green Stem */}
      <path d="M50 75 Q52 85 58 89" fill="none" stroke="#1b4332" strokeWidth="3" strokeLinecap="round" />

      {/* Outer Protective Calyx Bracts (Sepals) */}
      <path d="M50 72 C39 74 27 66 23 52 C31 56 41 64 50 72 Z" fill="url(#reactLeafGrad)" stroke="#000" strokeWidth="0.8" />
      <path d="M50 72 C61 74 73 66 77 52 C69 56 59 64 50 72 Z" fill="url(#reactLeafGrad)" stroke="#000" strokeWidth="0.8" />

      {/* 4 Plump Soft Cotton Boll Lobes */}
      <circle cx="50" cy="37" r="16" fill="url(#reactCottonGlow)" stroke="#475569" strokeWidth="1" />
      <circle cx="36" cy="48" r="15" fill="url(#reactCottonGlow)" stroke="#475569" strokeWidth="1" />
      <circle cx="64" cy="48" r="15" fill="url(#reactCottonGlow)" stroke="#475569" strokeWidth="1" />
      <circle cx="50" cy="54" r="15.5" fill="url(#reactCottonGlow)" stroke="#475569" strokeWidth="1" />

      {/* Cotton Pillowy Tuft Texture Folds */}
      <path d="M42 35 Q50 39 58 35" fill="none" stroke="#94a3b8" strokeWidth="1.2" strokeLinecap="round" />
      <path d="M34 47 Q39 52 44 54" fill="none" stroke="#94a3b8" strokeWidth="1.2" strokeLinecap="round" />
      <path d="M66 47 Q61 52 56 54" fill="none" stroke="#94a3b8" strokeWidth="1.2" strokeLinecap="round" />
      <path d="M46 54 Q50 56 54 54" fill="none" stroke="#cbd5e1" strokeWidth="1.2" strokeLinecap="round" />

      {/* Front Central Calyx Sepals embracing the cotton */}
      <path d="M50 72 C46 65 47 55 50 49 C53 55 54 65 50 72 Z" fill="url(#reactLeafGrad)" stroke="#000" strokeWidth="0.8" />
      <path d="M49 71 C43 68 37 60 34 51 C39 57 45 64 49 71 Z" fill="url(#reactLeafGrad)" stroke="#000" strokeWidth="0.8" />
      <path d="M51 71 C57 68 63 60 66 51 C61 57 55 64 51 71 Z" fill="url(#reactLeafGrad)" stroke="#000" strokeWidth="0.8" />
    </svg>
  )
}
