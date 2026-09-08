import React from 'react'
import { Phone, MapPin, Sparkles } from 'lucide-react'
import KapasLogo from './KapasLogo'

export default function ReceiptHeader() {
  const contacts = [
    {
      name: 'Haji Shabbir Hussain',
      nameUrdu: 'حاجی شبیر حسین (صدر)',
      role: 'President Anjuman Arthian',
      phone: '0300-9696234'
    },
    {
      name: 'Haji Faqir Hussain',
      nameUrdu: 'حاجی فقیر حسین',
      role: 'Commission Agent',
      phone: '0302-6535403'
    },
    {
      name: 'Chaudhry Sami',
      nameUrdu: 'چوہدری سمیع',
      role: 'Partner',
      phone: '0303-4884306'
    },
    {
      name: 'Chaudhry Bilal',
      nameUrdu: 'چوہدری بلال',
      role: 'Partner',
      phone: '0309-9692044'
    }
  ]

  return (
    <div className="bg-slate-900 border border-amber-500/30 rounded-2xl shadow-xl p-5 md:p-6 relative overflow-hidden backdrop-blur-md">
      {/* Warm Golden Top Accent */}
      <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-amber-600 via-yellow-400 to-amber-600" />

      {/* Main Header Top Area */}
      <div className="flex flex-col lg:flex-row items-center justify-between gap-5 pb-5 border-b border-slate-800/90">
        {/* Left Branding */}
        <div className="flex items-center gap-4 text-center lg:text-left">
          <div className="w-14 h-14 rounded-2xl bg-white flex items-center justify-center p-1 shadow-lg ring-4 ring-amber-400/30 shrink-0">
            <KapasLogo size={48} />
          </div>
          <div>
            <div className="flex items-center gap-3 justify-center lg:justify-start">
              <h1 className="text-2xl md:text-3xl font-black text-amber-400 tracking-wide uppercase drop-shadow">
                Soneri Commission Shop
              </h1>
            </div>
            <p className="text-sm text-slate-300 flex items-center justify-center lg:justify-start gap-1.5 font-medium mt-1">
              <MapPin className="w-4 h-4 text-amber-400" />
              <span>Ghalla Mandi, Malka Hans</span>
              <span className="font-urdu text-amber-200 text-sm">(غلہ منڈی ملکہ ہانس)</span>
            </p>
          </div>
        </div>

        {/* Center: Urdu Shop Title & Tagline with Kapas Emblem */}
        <div className="text-center px-8 py-4 rounded-2xl bg-slate-950/90 border border-slate-800 shadow-inner flex flex-col items-center justify-center">
          <div className="flex items-center justify-center mb-1">
            <KapasLogo size={44} />
          </div>
          <h2
            className="text-2xl sm:text-3xl font-bold font-urdu text-amber-300 tracking-normal drop-shadow-md select-text"
            style={{ lineHeight: 1.9 }}
          >
            سنہری کمیشن شاپ
          </h2>
          <p
            className="text-xs sm:text-sm text-amber-100/90 font-urdu font-medium tracking-wide mt-1.5 select-text"
            style={{ lineHeight: 1.6 }}
          >
            ہر قسم کی زرعی اجناس کی خرید و فروخت کا با اعتماد ادارہ
          </p>
        </div>

        {/* Right Info Pill */}
        <div className="hidden lg:flex flex-col items-end gap-1.5 text-right">
          <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
            Mandi Billing System
          </span>
          <span className="text-xs text-slate-300 font-mono font-medium">1 Mann = 40.00 Kgs</span>
        </div>
      </div>

      {/* 4 Contacts Bar - Clear & Larger Typography */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 pt-4">
        {contacts.map((c, idx) => (
          <div
            key={idx}
            className="flex items-center gap-3 bg-slate-950/80 border border-slate-800 hover:border-amber-500/40 rounded-xl p-3 transition-all"
          >
            <div className="p-2 rounded-lg bg-amber-500/10 text-amber-400 shrink-0">
              <Phone className="w-4 h-4" />
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-200 truncate">{c.name}</span>
              </div>
              <div className="flex items-center justify-between gap-1 mt-1">
                <span className="text-xs text-amber-400 font-mono font-black tracking-tight">
                  {c.phone}
                </span>
                <span className="text-xs text-slate-400 font-urdu truncate">{c.nameUrdu}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
