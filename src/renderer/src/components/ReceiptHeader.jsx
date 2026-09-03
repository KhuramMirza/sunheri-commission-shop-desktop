import React from 'react'
import { Phone, MapPin, Sparkles } from 'lucide-react'

export default function ReceiptHeader() {
  const contacts = [
    {
      name: 'Haji Shabbir Hussain',
      nameUrdu: 'حاجی شبیر حسین',
      role: 'President Anjuman Arthian',
      roleUrdu: 'صدر انجمن آڑھتیاں',
      phone: '0300-9696234'
    },
    {
      name: 'Haji Faqir Hussain',
      nameUrdu: 'حاجی فقیر حسین',
      role: 'Commission Agent',
      roleUrdu: 'آڑھتی',
      phone: '0302-6535403'
    },
    {
      name: 'Chaudhry Sami',
      nameUrdu: 'چوہدری سمیع',
      role: 'Managing Partner',
      roleUrdu: 'پارٹنر',
      phone: '0303-4884306'
    },
    {
      name: 'Chaudhry Bilal',
      nameUrdu: 'چوہدری بلال',
      role: 'Managing Partner',
      roleUrdu: 'پارٹنر',
      phone: '0309-9692044'
    }
  ]

  return (
    <div className="bg-slate-900/90 border border-amber-500/30 rounded-xl shadow-xl p-4 md:p-5 relative overflow-hidden backdrop-blur-md">
      {/* Decorative subtle receipt zig-zag top border accent */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-600" />

      {/* Main Header Row */}
      <div className="flex flex-col lg:flex-row items-center justify-between gap-4 pb-4 border-b border-slate-800">
        {/* Left: Branding & English Name */}
        <div className="flex items-center gap-3.5 text-center lg:text-left">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-400 via-amber-500 to-yellow-600 flex items-center justify-center font-extrabold text-slate-950 text-2xl shadow-lg ring-2 ring-amber-400/20 shrink-0">
            سنہری
          </div>
          <div>
            <div className="flex items-center gap-2 justify-center lg:justify-start">
              <h1 className="text-xl md:text-2xl font-black text-amber-400 tracking-wide uppercase drop-shadow-sm">
                Sunheri Commission Shop
              </h1>
            </div>
            <p className="text-xs text-slate-400 flex items-center justify-center lg:justify-start gap-1 font-medium mt-0.5">
              <MapPin className="w-3.5 h-3.5 text-amber-500/80" />
              Ghalla Mandi, Malka Hans (غلہ منڈی ملکہ ہانس)
            </p>
          </div>
        </div>

        {/* Center: Urdu Shop Title & Tagline */}
        <div className="text-center px-4 py-2 rounded-xl bg-slate-950/60 border border-slate-800/80">
          <h2 className="text-2xl md:text-3xl font-bold font-urdu text-amber-300 tracking-normal leading-relaxed drop-shadow">
            سنہری کمیشن شاپ
          </h2>
          <p className="text-xs md:text-sm text-slate-300 font-urdu font-medium mt-0.5 text-amber-100/90">
            ہر قسم کی زرعی اجناس کی خرید و فروخت کا با اعتماد ادارہ
          </p>
        </div>

        {/* Right: Badge / Offline Status */}
        <div className="hidden lg:flex flex-col items-end gap-1 text-right">
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            Mandi Billing System
          </span>
          <span className="text-[11px] text-slate-400">1 Mann = Exactly 40 Kgs</span>
        </div>
      </div>

      {/* Contacts Grid: 4 Phone numbers */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5 pt-3">
        {contacts.map((c, idx) => (
          <div
            key={idx}
            className="flex items-center gap-2.5 bg-slate-950/70 border border-slate-800/90 hover:border-amber-500/40 rounded-lg p-2.5 transition-all"
          >
            <div className="p-1.5 rounded-md bg-amber-500/10 text-amber-400 shrink-0">
              <Phone className="w-3.5 h-3.5" />
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-semibold text-slate-200 truncate">
                  {c.name}
                </span>
              </div>
              <div className="flex items-center justify-between gap-1 mt-0.5">
                <span className="text-[10px] text-amber-400/90 font-mono font-bold tracking-tight">
                  {c.phone}
                </span>
                <span className="text-[10px] text-slate-400 font-urdu truncate">
                  {c.nameUrdu}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
