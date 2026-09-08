import React from 'react'
import MANDI_LOGO_BASE64 from '../assets/mandiLogoBase64'

/**
 * Authentic Mandi Logo Component (Soneri Commission Shop)
 * Features symmetrical wheat stalks, central cotton boll, and green crops
 * @param {object} props
 * @param {string} props.className - Additional CSS classes
 * @param {number} props.size - Size in pixels (default 52)
 */
export default function KapasLogo({ className = '', size = 52 }) {
  return (
    <img
      src={MANDI_LOGO_BASE64}
      alt="Soneri Commission Shop Emblem"
      width={size}
      height={size}
      className={`shrink-0 object-contain ${className}`}
      style={{ display: 'inline-block', verticalAlign: 'middle' }}
    />
  )
}
