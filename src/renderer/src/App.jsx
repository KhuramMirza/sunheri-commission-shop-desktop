import React, { useState, useEffect } from 'react'

export default function App() {
  const [ipcStatus, setIpcStatus] = useState('checking')

  useEffect(() => {
    if (window.api && window.api.ping) {
      window.api
        .ping()
        .then(() => setIpcStatus('connected'))
        .catch(() => setIpcStatus('disconnected'))
    } else {
      setIpcStatus('web-fallback')
    }
  }, [])

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      {/* Top Header */}
      <header className="border-b border-slate-800 bg-slate-900/80 backdrop-blur px-6 py-4 flex items-center justify-between shadow-lg">
        <div className="flex items-center gap-4">
          <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center font-bold text-slate-950 text-xl shadow-md">
            غ
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
              Mandi App Running
              <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 font-medium">
                Ready
              </span>
            </h1>
            <p className="text-xs text-slate-400 font-urdu">
              سنہری کمیشن شاپ — غلہ منڈی ملکہ ہانس
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 text-xs">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-800/80 border border-slate-700/60">
            <span className="text-slate-400">IPC Bridge:</span>
            <span
              className={`font-semibold ${
                ipcStatus === 'connected'
                  ? 'text-emerald-400'
                  : ipcStatus === 'checking'
                  ? 'text-amber-400'
                  : 'text-slate-400'
              }`}
            >
              {ipcStatus.toUpperCase()}
            </span>
          </div>
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-800/80 border border-slate-700/60">
            <span className="text-slate-400">Environment:</span>
            <span className="font-semibold text-amber-400">Electron + React + Tailwind</span>
          </div>
        </div>
      </header>

      {/* Main Content Area Placeholder */}
      <main className="flex-1 flex flex-col items-center justify-center p-8 text-center">
        <div className="max-w-md p-8 rounded-2xl border border-slate-800 bg-slate-900/50 shadow-2xl space-y-4">
          <div className="inline-flex p-3 rounded-full bg-amber-500/10 text-amber-400 mb-2">
            <svg
              className="w-8 h-8"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-white">Setup Successful</h2>
          <p className="text-sm text-slate-400">
            Electron, React (JavaScript), and Tailwind CSS are fully configured. IPC bridges are ready for database storage and thermal printer integration.
          </p>
        </div>
      </main>
    </div>
  )
}
