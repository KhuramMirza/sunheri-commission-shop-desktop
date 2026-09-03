import React, { useState, useMemo } from 'react'
import {
  BookOpen,
  FileText,
  Search,
  Printer,
  Trash2,
  TrendingUp,
  Scale,
  DollarSign
} from 'lucide-react'

export default function LedgerTable({
  transactions = [],
  loading = false,
  onDeleteTransaction,
  onReprintTransaction
}) {
  const [searchTerm, setSearchTerm] = useState('')

  // Filter transactions by Client Name or Serial Number
  const filteredTransactions = useMemo(() => {
    if (!searchTerm.trim()) return transactions
    const query = searchTerm.toLowerCase().trim()
    return transactions.filter(
      (t) =>
        (t.clientName && t.clientName.toLowerCase().includes(query)) ||
        String(t.serialNo).includes(query) ||
        (t.date && t.date.includes(query))
    )
  }, [transactions, searchTerm])

  // Calculate Ledger Totals
  const totals = useMemo(() => {
    return filteredTransactions.reduce(
      (acc, t) => {
        acc.netWeight += Number(t.netWeight) || 0
        acc.totalBill += Number(t.totalBill) || 0
        return acc
      },
      { netWeight: 0, totalBill: 0 }
    )
  }, [filteredTransactions])

  const totalManns = Math.floor(totals.netWeight / 40)
  const totalRemainingKgs = Math.round((totals.netWeight % 40) * 100) / 100

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
                {transactions.length} Total Saved
              </span>
            </h2>
            <span className="text-xs text-slate-400 font-urdu">
              روزنامچہ کھاتہ — کمپیوٹر ڈیٹا بیس میں محفوظ شدہ تمام سودے
            </span>
          </div>
        </div>

        {/* Live Search & Filter Bar */}
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="w-3.5 h-3.5 absolute left-2.5 top-2.5 text-slate-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search Client / S.No... (تلاش کریں)"
              className="bg-slate-950 border border-slate-700 focus:border-amber-500 focus:ring-1 focus:ring-amber-500 rounded-lg pl-8 pr-3 py-1.5 text-xs text-slate-200 placeholder:text-slate-500 outline-none w-52 md:w-64 transition"
            />
          </div>
        </div>
      </div>

      {/* Summary Stat Cards on top of table */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
        <div className="bg-slate-950/70 border border-slate-800 rounded-lg p-2.5 flex items-center gap-3">
          <div className="p-2 rounded-md bg-cyan-500/10 text-cyan-400">
            <Scale className="w-4 h-4" />
          </div>
          <div>
            <div className="text-[10px] text-slate-400 uppercase font-semibold">
              Total Net Weight (خالص وزن)
            </div>
            <div className="text-sm font-black font-mono text-cyan-300">
              {totals.netWeight.toLocaleString()} <span className="text-xs font-normal">Kg</span>
              <span className="text-xs text-slate-400 font-sans ml-1">
                ({totalManns}M {totalRemainingKgs}Kg)
              </span>
            </div>
          </div>
        </div>

        <div className="bg-slate-950/70 border border-slate-800 rounded-lg p-2.5 flex items-center gap-3">
          <div className="p-2 rounded-md bg-emerald-500/10 text-emerald-400">
            <DollarSign className="w-4 h-4" />
          </div>
          <div>
            <div className="text-[10px] text-slate-400 uppercase font-semibold">
              Total Turnover (کل رقم)
            </div>
            <div className="text-sm font-black font-mono text-emerald-400">
              Rs.{' '}
              {totals.totalBill.toLocaleString('en-US', {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2
              })}
            </div>
          </div>
        </div>

        <div className="col-span-2 sm:col-span-1 bg-slate-950/70 border border-slate-800 rounded-lg p-2.5 flex items-center gap-3">
          <div className="p-2 rounded-md bg-amber-500/10 text-amber-400">
            <TrendingUp className="w-4 h-4" />
          </div>
          <div>
            <div className="text-[10px] text-slate-400 uppercase font-semibold">
              Entries (کل بلز)
            </div>
            <div className="text-sm font-black font-mono text-amber-300">
              {filteredTransactions.length}{' '}
              <span className="text-xs font-normal text-slate-400">Records</span>
            </div>
          </div>
        </div>
      </div>

      {/* Table Container with dense data styles */}
      <div className="overflow-x-auto border border-slate-800 rounded-lg bg-slate-950/80 max-h-72 overflow-y-auto">
        <table className="w-full text-left border-collapse text-xs">
          <thead className="sticky top-0 z-10">
            <tr className="bg-slate-900 text-slate-300 border-b border-slate-800 select-none">
              <th className="py-2.5 px-3 font-semibold text-center w-12">S.No</th>
              <th className="py-2.5 px-3 font-semibold">Date / تاریخ</th>
              <th className="py-2.5 px-3 font-semibold">Client / گاہک</th>
              <th className="py-2.5 px-3 font-semibold text-right">Saafi (Kg)</th>
              <th className="py-2.5 px-3 font-semibold text-right">Bardana</th>
              <th className="py-2.5 px-3 font-semibold text-right">Kanda</th>
              <th className="py-2.5 px-3 font-semibold text-right text-cyan-400">Net Wt</th>
              <th className="py-2.5 px-3 font-semibold text-center">Manns - Kgs</th>
              <th className="py-2.5 px-3 font-semibold text-right">Rate/Mann</th>
              <th className="py-2.5 px-3 font-semibold text-right text-emerald-400">Total Bill</th>
              <th className="py-2.5 px-3 font-semibold text-center w-24">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60 font-mono">
            {loading ? (
              <tr>
                <td colSpan={11} className="py-8 text-center text-slate-400">
                  <div className="flex items-center justify-center gap-2">
                    <span className="w-3 h-3 rounded-full border-2 border-amber-400 border-t-transparent animate-spin" />
                    <span>Loading database records...</span>
                  </div>
                </td>
              </tr>
            ) : filteredTransactions.length === 0 ? (
              <tr>
                <td colSpan={11} className="py-10 text-center text-slate-500">
                  <div className="flex flex-col items-center justify-center gap-2">
                    <FileText className="w-8 h-8 text-slate-600/70" />
                    <p className="text-xs text-slate-400 font-sans">
                      {searchTerm
                        ? `No transactions matching "${searchTerm}"`
                        : 'No transactions recorded in database yet.'}
                    </p>
                    <p className="text-xs font-urdu text-slate-500">
                      نیا بل بنائیں اور "Generate & Print Bill" پر کلک کریں
                    </p>
                  </div>
                </td>
              </tr>
            ) : (
              filteredTransactions.map((t, idx) => (
                <tr
                  key={t._id || t.id || idx}
                  className="hover:bg-slate-900/60 transition-colors text-slate-300"
                >
                  <td className="py-2 px-3 text-center text-amber-400 font-bold">
                    #{t.serialNo || idx + 1}
                  </td>
                  <td className="py-2 px-3 text-slate-400 font-sans text-[11px] whitespace-nowrap">
                    {t.date}
                  </td>
                  <td className="py-2 px-3 font-semibold text-slate-200 font-sans">
                    {t.clientName || 'Cash Client'}
                  </td>
                  <td className="py-2 px-3 text-right">{Number(t.saafiWeight).toFixed(1)}</td>
                  <td className="py-2 px-3 text-right text-rose-400 font-medium">
                    {Number(t.bardanaWeight).toFixed(1)}
                  </td>
                  <td className="py-2 px-3 text-right text-rose-400 font-medium">
                    {Number(t.kandaWeight).toFixed(1)}
                  </td>
                  <td className="py-2 px-3 text-right font-bold text-cyan-400">
                    {Number(t.netWeight).toFixed(1)}
                  </td>
                  <td className="py-2 px-3 text-center font-sans text-amber-300 whitespace-nowrap">
                    <span className="font-bold">{t.totalManns}</span>
                    <span className="text-[10px] text-slate-500 mx-0.5">M</span>
                    <span className="font-bold">{Number(t.remainingKgs).toFixed(1)}</span>
                    <span className="text-[10px] text-slate-500 ml-0.5">Kg</span>
                  </td>
                  <td className="py-2 px-3 text-right text-amber-400 font-bold whitespace-nowrap">
                    Rs. {Number(t.ratePerMann || 0).toLocaleString()}
                  </td>
                  <td className="py-2 px-3 text-right font-black text-emerald-400 whitespace-nowrap">
                    Rs.{' '}
                    {Number(t.totalBill || 0).toLocaleString('en-US', {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2
                    })}
                  </td>
                  <td className="py-2 px-3 text-center">
                    <div className="flex items-center justify-center gap-1.5">
                      {onReprintTransaction && (
                        <button
                          type="button"
                          onClick={() => onReprintTransaction(t)}
                          className="p-1 rounded bg-slate-800 hover:bg-amber-500 hover:text-slate-950 text-slate-300 transition cursor-pointer"
                          title="Reprint Bill"
                        >
                          <Printer className="w-3.5 h-3.5" />
                        </button>
                      )}
                      {onDeleteTransaction && (
                        <button
                          type="button"
                          onClick={() => onDeleteTransaction(t._id || t.id)}
                          className="p-1 rounded bg-slate-800 hover:bg-rose-500 hover:text-white text-slate-400 transition cursor-pointer"
                          title="Delete Bill"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Ledger Footer Info */}
      <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1">
        <span className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-emerald-400" />
          Offline NeDB Storage Connected (mandi_bills.db)
        </span>
        <span className="font-urdu">سنہری کمیشن شاپ — غلہ منڈی ملکہ ہانس</span>
      </div>
    </div>
  )
}
