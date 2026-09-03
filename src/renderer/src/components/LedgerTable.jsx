import React from 'react'
import { BookOpen, FileText, Search, ArrowUpDown, Filter, Printer } from 'lucide-react'

export default function LedgerTable({ transactions = [] }) {
  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-xl shadow-xl p-4 md:p-5 backdrop-blur-md flex flex-col gap-3">
      {/* Ledger Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-3">
        <div className="flex items-center gap-2.5">
          <div className="p-1.5 rounded-lg bg-amber-500/10 text-amber-400">
            <BookOpen className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
              Daily Transaction Ledger
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-slate-800 text-amber-400 border border-slate-700">
                {transactions.length} Records
              </span>
            </h2>
            <span className="text-xs text-slate-400 font-urdu">
              روزنامچہ کھاتہ — آج کے تمام سودے اور بلز
            </span>
          </div>
        </div>

        {/* Action / Search Bar Placeholder */}
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="w-3.5 h-3.5 absolute left-2.5 top-2.5 text-slate-500" />
            <input
              type="text"
              placeholder="Search client / S.No..."
              disabled
              className="bg-slate-950/80 border border-slate-800 rounded-lg pl-8 pr-3 py-1.5 text-xs text-slate-400 placeholder:text-slate-600 outline-none w-44 md:w-56 cursor-not-allowed"
            />
          </div>
          <button
            disabled
            className="p-1.5 rounded-lg bg-slate-800 border border-slate-700 text-slate-500 cursor-not-allowed"
            title="Filter (Coming soon)"
          >
            <Filter className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Table Container with dense styles */}
      <div className="overflow-x-auto border border-slate-800 rounded-lg bg-slate-950/60">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="bg-slate-900/90 text-slate-400 border-b border-slate-800 select-none">
              <th className="py-2.5 px-3 font-semibold text-center w-12">#</th>
              <th className="py-2.5 px-3 font-semibold">Date / تاریخ</th>
              <th className="py-2.5 px-3 font-semibold">Client / گاہک</th>
              <th className="py-2.5 px-3 font-semibold text-right">Saafi (Kg)</th>
              <th className="py-2.5 px-3 font-semibold text-right">Bardana</th>
              <th className="py-2.5 px-3 font-semibold text-right">Kanda</th>
              <th className="py-2.5 px-3 font-semibold text-right text-cyan-400">Net Wt</th>
              <th className="py-2.5 px-3 font-semibold text-center">Manns - Kgs</th>
              <th className="py-2.5 px-3 font-semibold text-right">Rate / Mann</th>
              <th className="py-2.5 px-3 font-semibold text-right text-emerald-400">Total Bill</th>
              <th className="py-2.5 px-3 font-semibold text-center w-20">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60 font-mono">
            {transactions.length === 0 ? (
              <tr>
                <td colSpan={11} className="py-10 text-center text-slate-500">
                  <div className="flex flex-col items-center justify-center gap-2">
                    <FileText className="w-8 h-8 text-slate-600/70" />
                    <p className="text-xs text-slate-400 font-sans">
                      No transactions recorded for today yet.
                    </p>
                    <p className="text-xs font-urdu text-slate-500">
                      ابھی تک کوئی ریکارڈ درج نہیں ہوا۔ نیا بل بنائیں اور پرنٹ کریں۔
                    </p>
                  </div>
                </td>
              </tr>
            ) : (
              transactions.map((t, idx) => (
                <tr
                  key={t.id || idx}
                  className="hover:bg-slate-900/50 transition-colors text-slate-300"
                >
                  <td className="py-2 px-3 text-center text-amber-400/90 font-bold">
                    {t.serialNo || idx + 1}
                  </td>
                  <td className="py-2 px-3 text-slate-400 font-sans text-[11px]">{t.date}</td>
                  <td className="py-2 px-3 font-semibold text-slate-200 font-sans">
                    {t.clientName || '—'}
                  </td>
                  <td className="py-2 px-3 text-right">{t.saafiWeight}</td>
                  <td className="py-2 px-3 text-right text-rose-400">{t.bardanaWeight}</td>
                  <td className="py-2 px-3 text-right text-rose-400">{t.kandaWeight}</td>
                  <td className="py-2 px-3 text-right font-bold text-cyan-400">{t.netWeight}</td>
                  <td className="py-2 px-3 text-center font-sans text-amber-300">
                    <span className="font-bold">{t.totalManns}</span>
                    <span className="text-[10px] text-slate-500 mx-0.5">M</span>
                    <span className="font-bold">{t.remainingKgs}</span>
                    <span className="text-[10px] text-slate-500 ml-0.5">Kg</span>
                  </td>
                  <td className="py-2 px-3 text-right text-amber-400 font-bold">
                    Rs. {Number(t.ratePerMann || 0).toLocaleString()}
                  </td>
                  <td className="py-2 px-3 text-right font-black text-emerald-400">
                    Rs. {Number(t.totalBill || 0).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                  </td>
                  <td className="py-2 px-3 text-center">
                    <button
                      className="p-1 rounded bg-slate-800 hover:bg-amber-500 hover:text-slate-950 text-slate-300 transition"
                      title="Reprint Receipt"
                    >
                      <Printer className="w-3.5 h-3.5" />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Ledger Footer Info */}
      <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1">
        <span>Local Database Storage (Offline Standalone)</span>
        <span className="font-urdu">سنہری کمیشن شاپ — غلہ منڈی ملکہ ہانس</span>
      </div>
    </div>
  )
}
