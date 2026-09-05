import React, { useState, useEffect } from 'react'
import {
  ShieldCheck,
  Key,
  Copy,
  Check,
  Phone,
  MapPin,
  Lock,
  Sparkles,
  AlertCircle,
  Cpu
} from 'lucide-react'

export default function Activation({ onActivated }) {
  const [machineId, setMachineId] = useState('')
  const [licenseKey, setLicenseKey] = useState('')
  const [loadingId, setLoadingId] = useState(true)
  const [activating, setActivating] = useState(false)
  const [copied, setCopied] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')
  const [successMsg, setSuccessMsg] = useState('')

  // Contacts list for license assistance
  const contacts = [
    { name: 'Haji Shabbir Hussain (صدر)', phone: '0300-9696234' },
    { name: 'Haji Faqir Hussain', phone: '0302-6535403' },
    { name: 'Chaudhry Sami', phone: '0303-4884306' },
    { name: 'Chaudhry Bilal', phone: '0309-9692044' }
  ]

  // Fetch unique hardware Machine ID on mount
  useEffect(() => {
    async function loadMachineId() {
      setLoadingId(true)
      try {
        if (window.api && window.api.getMachineId) {
          const id = await window.api.getMachineId()
          setMachineId(id || 'HARDWARE-ID-UNAVAILABLE')
        } else {
          setMachineId('DESKTOP-BRIDGE-ERROR')
          setErrorMsg('سافٹ ویئر کا سسٹم برج لوڈ نہیں ہو سکا۔ (Desktop Bridge unavailable)')
        }
      } catch (err) {
        console.error('Failed to fetch hardware ID:', err)
        setMachineId('ERROR-FETCHING-HWID')
      } finally {
        setLoadingId(false)
      }
    }

    loadMachineId()
  }, [])

  // Copy Hardware Machine ID to clipboard
  const handleCopyId = async () => {
    if (!machineId) return
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(machineId)
      } else {
        const textarea = document.createElement('textarea')
        textarea.value = machineId
        document.body.appendChild(textarea)
        textarea.select()
        document.execCommand('copy')
        document.body.removeChild(textarea)
      }
      setCopied(true)
      setTimeout(() => setCopied(false), 2500)
    } catch (err) {
      console.error('Failed to copy ID:', err)
    }
  }

  // Handle License Key Submission
  const handleActivate = async (e) => {
    if (e && typeof e.preventDefault === 'function') {
      e.preventDefault()
    }

    setErrorMsg('')
    setSuccessMsg('')

    const trimmedKey = licenseKey.trim()
    if (!trimmedKey) {
      setErrorMsg('براہ کرم اپنا لائسنس کوڈ درج کریں۔ (Please enter your License Key)')
      return
    }

    setActivating(true)
    try {
      if (window.api && window.api.activateLicense) {
        const result = await window.api.activateLicense(trimmedKey)
        if (result && result.success) {
          setSuccessMsg(result.message || 'Software activated successfully!')
          setTimeout(() => {
            if (onActivated) onActivated()
          }, 1200)
        } else {
          setErrorMsg(result?.message || 'غلط لائسنس کی ہے۔ (Invalid License Key)')
        }
      } else {
        setErrorMsg('سافٹ ویئر کا سسٹم برج دستیاب نہیں ہے۔ براہ کرم ایپلیکیشن دوبارہ کھولیں۔ (Desktop API Bridge unavailable)')
      }
    } catch (err) {
      console.error('Activation failed:', err)
      setErrorMsg('ایکٹیویشن کے دوران خرابی پیش آگئی۔ (Activation error: ' + err.message + ')')
    } finally {
      setActivating(false)
    }
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col items-center justify-center p-4 md:p-6 relative overflow-hidden font-sans select-none">
      {/* Background Subtle Golden Glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Main Activation Card */}
      <div className="w-full max-w-xl bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl p-6 sm:p-8 backdrop-blur-xl relative z-10 flex flex-col gap-6">
        {/* Warm Golden Accent Strip */}
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-amber-600 via-yellow-400 to-amber-600 rounded-t-3xl" />

        {/* Header Branding */}
        <div className="flex flex-col items-center text-center gap-2 pt-2">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-400 via-amber-500 to-yellow-600 flex items-center justify-center text-slate-950 shadow-xl ring-4 ring-amber-400/20 mb-1">
            <Lock className="w-8 h-8" />
          </div>

          <h1 className="text-2xl sm:text-3xl font-black text-amber-400 tracking-wide uppercase">
            Sunheri Commission Shop
          </h1>

          {/* Urdu Title & Tagline with generous line-height */}
          <div className="flex flex-col items-center mt-1">
            <h2
              className="text-2xl sm:text-3xl font-bold font-urdu text-amber-300"
              style={{ lineHeight: 2.2 }}
            >
              سنہری کمیشن شاپ
            </h2>
            <p
              className="text-xs sm:text-sm text-amber-100/90 font-urdu font-medium"
              style={{ lineHeight: 1.7 }}
            >
              غلہ منڈی ملکہ ہانس — ہر قسم کی زرعی اجناس کی خرید و فروخت کا با اعتماد ادارہ
            </p>
          </div>

          <div className="mt-1">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-500/10 text-amber-400 border border-amber-500/30">
              <Key className="w-3.5 h-3.5" />
              <span>Software Activation Required (ایکٹیویشن درکار ہے)</span>
            </span>
          </div>
        </div>

        {/* Feedback Alert Banners */}
        {errorMsg && (
          <div className="p-3.5 rounded-xl bg-rose-950/60 border border-rose-500/60 text-rose-200 text-xs font-bold flex items-center gap-2.5 animate-in fade-in">
            <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {successMsg && (
          <div className="p-3.5 rounded-xl bg-emerald-950/60 border border-emerald-500/60 text-emerald-200 text-xs font-bold flex items-center gap-2.5 animate-in fade-in">
            <Check className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{successMsg}</span>
          </div>
        )}

        {/* Step 1: Unique Hardware Machine ID */}
        <div className="space-y-2 bg-slate-950/90 border border-slate-800 rounded-2xl p-4 shadow-inner">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
              <Cpu className="w-3.5 h-3.5 text-amber-400" />
              <span>Machine Hardware ID</span>
            </label>
            <span className="font-urdu text-xs text-amber-400 font-bold">مشین شناختی کوڈ</span>
          </div>

          <div className="flex items-center gap-2">
            <div className="flex-1 bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2.5 font-mono text-sm font-black text-amber-300 select-all truncate">
              {loadingId ? (
                <span className="text-slate-500 animate-pulse">Reading Machine Hardware ID...</span>
              ) : (
                machineId
              )}
            </div>

            <button
              type="button"
              onClick={handleCopyId}
              disabled={loadingId || !machineId}
              className={`px-4 py-2.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer shrink-0 shadow-md ${
                copied
                  ? 'bg-emerald-600 text-white border border-emerald-400'
                  : 'bg-slate-800 hover:bg-slate-700 text-slate-100 border border-slate-700 active:scale-95'
              }`}
              title="Copy Hardware ID to Clipboard"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-white" />
                  <span>Copied! (کاپی ہو گیا)</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5 text-amber-400" />
                  <span>Copy ID</span>
                </>
              )}
            </button>
          </div>

          <p className="text-[11px] text-slate-400 font-urdu leading-normal pt-1">
            یہ شناختی کوڈ کاپی کر کے انتظامیہ کو بھیجیں تاکہ آپ کو لائسنس کی فراہم کی جا سکے۔
          </p>
        </div>

        {/* Step 2: License Key Input & Activation Action */}
        <form onSubmit={handleActivate} className="space-y-4">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                <Key className="w-3.5 h-3.5 text-amber-400" />
                <span>Enter License Key</span>
              </label>
              <span className="font-urdu text-xs text-slate-400">لائسنس کی درج کریں</span>
            </div>

            <input
              type="text"
              value={licenseKey}
              onChange={(e) => setLicenseKey(e.target.value)}
              placeholder="PASTE-LICENSE-KEY-HERE"
              className="w-full bg-slate-950 border border-slate-700 focus:border-amber-400 focus:ring-2 focus:ring-amber-400/20 rounded-xl px-4 py-3 text-sm font-mono font-bold text-slate-100 placeholder:text-slate-600 outline-none uppercase transition"
              autoFocus
            />
          </div>

          <button
            type="submit"
            disabled={activating || !licenseKey.trim()}
            className="w-full inline-flex items-center justify-center gap-2 py-3.5 px-6 rounded-xl bg-gradient-to-r from-amber-500 via-amber-600 to-yellow-600 hover:from-amber-400 hover:to-yellow-500 disabled:opacity-50 disabled:cursor-not-allowed text-slate-950 font-black text-sm tracking-wide transition shadow-lg hover:shadow-amber-500/20 cursor-pointer active:scale-95"
          >
            {activating ? (
              <>
                <span className="w-4 h-4 rounded-full border-2 border-slate-950 border-t-transparent animate-spin" />
                <span>Verifying License...</span>
              </>
            ) : (
              <>
                <ShieldCheck className="w-5 h-5" />
                <span>Activate Software</span>
                <span className="font-urdu text-sm font-bold text-slate-950 ml-1.5">
                  (سافٹ ویئر ایکٹیویٹ کریں)
                </span>
              </>
            )}
          </button>
        </form>

        {/* Contact Details for License Keys */}
        <div className="border-t border-slate-800/90 pt-4 space-y-2.5">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span className="font-bold text-slate-300">Need a license key? Contact:</span>
            <span className="font-urdu text-amber-300">لائسنس کے لیے رابطہ کریں</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {contacts.map((c, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between bg-slate-950/70 border border-slate-800 rounded-xl px-3 py-2 text-xs"
              >
                <span className="text-slate-300 font-medium truncate">{c.name}</span>
                <span className="font-mono font-bold text-amber-400 tracking-tight ml-2">
                  {c.phone}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
