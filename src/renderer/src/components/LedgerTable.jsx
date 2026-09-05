import React, { useState, useMemo } from 'react'
import {
  BookOpen,
  FileText,
  Search,
  Printer,
  Trash2,
  TrendingUp,
  Scale,
  DollarSign,
  Eye
} from 'lucide-react'

export default function LedgerTable({
  transactions = [],
  loading = false,
  onDeleteTransaction,
  onReprintTransaction,
  onPreviewTransaction
}) {
  const [searchTerm, setSearchTerm] = useState('')

  // Filter transactions by Client Name, Serial Number, or Date
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
    <div className="bg-slate-900 border border-slate-800 rounded-2xl shadow-xl p-5 md:p-6 backdrop-blur-md flex flex-col gap-4">
      {/* Ledger Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3.5 border-b border-slate-800 pb-4">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400">
            <BookOpen className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-bold text-white uppercase tracking-wider flex items-center gap-2">
              Daily Transaction Ledger
              <span className="text-xs font-mono font-bold px-2.5 py-0.5 rounded-full bg-slate-800 text-amber-400 border border-slate-700">
                {transactions.length} Total Records
              </span>
            </h2>
            <span className="text-sm text-slate-300 font-urdu leading-relaxed">
              روزنامچہ کھاتہ — کمپیوٹر ڈیٹا بیس میں محفوظ شدہ تمام سودے
            </span>
          </div>
        </div>

        {/* Live Search */}
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search Client / S.No... (تلاش کریں)"
              className="bg-slate-950 border border-slate-700 focus:border-amber-400 focus:ring-2 focus:ring-amber-400/20 rounded-xl pl-9 pr-3.5 py-2 text-sm text-slate-100 placeholder:text-slate-500 outline-none w-60 md:w-72 transition"
            />
          </div>
        </div>
      </div>

      {/* Summary Stat Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        <div className="bg-slate-950 border border-slate-800 rounded-xl p-3.5 flex items-center gap-3.5">
          <div className="p-2.5 rounded-lg bg-cyan-500/10 text-cyan-400">
            <Scale className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs text-slate-400 font-bold uppercase">
              Total Net Weight (خالص وزن)
            </div>
            <div className="text-base font-black font-mono text-cyan-300 mt-0.5">
              {totals.netWeight.toLocaleString()} <span className="text-xs font-normal">Kg</span>
              <span className="text-xs text-slate-300 font-sans ml-1.5">
                ({totalManns}M {totalRemainingKgs}Kg)
              </span>
            </div>
          </div>
        </div>

        <div className="bg-slate-950 border border-slate-800 rounded-xl p-3.5 flex items-center gap-3.5">
          <div className="p-2.5 rounded-lg bg-emerald-500/10 text-emerald-400">
            <DollarSign className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs text-slate-400 font-bold uppercase">
              Total Turnover (کل رقم)
            </div>
            <div className="text-base font-black font-mono text-emerald-400 mt-0.5">
              Rs.{' '}
              {totals.totalBill.toLocaleString('en-US', {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2
              })}
            </div>
          </div>
        </div>

        <div className="col-span-2 sm:col-span-1 bg-slate-950 border border-slate-800 rounded-xl p-3.5 flex items-center gap-3.5">
          <div className="p-2.5 rounded-lg bg-amber-500/10 text-amber-400">
            <TrendingUp className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs text-slate-400 font-bold uppercase">
              Entries (کل بلز)
            </div>
            <div className="text-base font-black font-mono text-amber-300 mt-0.5">
              {filteredTransactions.length}{' '}
              <span className="text-xs font-normal text-slate-400">Bills</span>
            </div>
          </div>
        </div>
      </div>

      {/* Table Container with spacious, readable rows */}
      <div className="overflow-x-auto border border-slate-800 rounded-xl bg-slate-950/90 max-h-80 overflow-y-auto">
        <table className="w-full text-left border-collapse text-xs md:text-sm">
          <thead className="sticky top-0 z-10">
            <tr className="bg-slate-800/95 text-slate-200 border-b border-slate-700 select-none">
              <th className="py-3 px-3.5 font-bold text-center w-14">S.No</th>
              <th className="py-3 px-3.5 font-bold">Date / تاریخ</th>
              <th className="py-3 px-3.5 font-bold">Client / گاہک</th>
              <th className="py-3 px-3.5 font-bold text-right">Saafi (Kg)</th>
              <th className="py-3 px-3.5 font-bold text-right">Bardana</th>
              <th className="py-3 px-3.5 font-bold text-right">Kanda</th>
              <th className="py-3 px-3.5 font-bold text-right text-cyan-300">Net Wt</th>
              <th className="py-3 px-3.5 font-bold text-center">Manns - Kgs</th>
              <th className="py-3 px-3.5 font-bold text-right">Rate/Mann</th>
              <th className="py-3 px-3.5 font-bold text-right text-emerald-400">Total Bill</th>
              <th className="py-3 px-3.5 font-bold text-center w-28">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800 font-mono">
            {loading ? (
              <tr>
                <td colSpan={11} className="py-10 text-center text-slate-300">
                  <div className="flex items-center justify-center gap-2.5">
                    <span className="w-4 h-4 rounded-full border-2 border-amber-400 border-t-transparent animate-spin" />
                    <span className="text-sm">Loading database records...</span>
                  </div>
                </td>
              </tr>
            ) : filteredTransactions.length === 0 ? (
              <tr>
                <td colSpan={11} className="py-12 text-center text-slate-400">
                  <div className="flex flex-col items-center justify-center gap-2">
                    <FileText className="w-10 h-10 text-slate-600" />
                    <p className="text-sm text-slate-300 font-sans font-medium">
                      {searchTerm
                        ? `No transactions matching "${searchTerm}"`
                        : 'No transactions recorded in database yet.'}
                    </p>
                    <p className="text-sm font-urdu text-slate-400">
                      نیا بل بنائیں اور "Generate & Print Bill" پر کلک کریں
                    </p>
                  </div>
                </td>
              </tr>
            ) : (
              filteredTransactions.map((t, idx) => (
                <tr
                  key={t._id || t.id || idx}
                  className="hover:bg-slate-900 transition-colors text-slate-200"
                >
                  <td className="py-2.5 px-3.5 text-center text-amber-400 font-black">
                    #{t.serialNo || idx + 1}
                  </td>
                  <td className="py-2.5 px-3.5 text-slate-300 font-sans text-xs whitespace-nowrap">
                    {t.date}
                  </td>
                  <td className="py-2.5 px-3.5 font-bold text-white font-sans text-xs md:text-sm">
                    {t.clientName || 'Cash Client'}
                  </td>
                  <td className="py-2.5 px-3.5 text-right font-medium">
                    {Number(t.saafiWeight).toFixed(1)}
                  </td>
                  <td className="py-2.5 px-3.5 text-right text-rose-300 font-medium">
                    {Number(t.bardanaWeight).toFixed(1)}
                  </td>
                  <td className="py-2.5 px-3.5 text-right text-rose-300 font-medium">
                    {Number(t.kandaWeight).toFixed(1)}
                  </td>
                  <td className="py-2.5 px-3.5 text-right font-black text-cyan-300">
                    {Number(t.netWeight).toFixed(1)}
                  </td>
                  <td className="py-2.5 px-3.5 text-center font-sans text-amber-300 whitespace-nowrap font-medium">
                    <span className="font-bold">{t.totalManns}</span>
                    <span className="text-xs text-slate-400 mx-0.5">M</span>
                    <span className="font-bold">{Number(t.remainingKgs).toFixed(1)}</span>
                    <span className="text-xs text-slate-400 ml-0.5">Kg</span>
                  </td>
                  <td className="py-2.5 px-3.5 text-right text-amber-400 font-black whitespace-nowrap">
                    Rs. {Number(t.ratePerMann || 0).toLocaleString()}
                  </td>
                  <td className="py-2.5 px-3.5 text-right font-black text-emerald-400 whitespace-nowrap text-sm">
                    Rs.{' '}
                    {Number(t.totalBill || 0).toLocaleString('en-US', {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2
                    })}
                  </td>
                  <td className="py-2.5 px-3.5 text-center">
                    <div className="flex items-center justify-center gap-2">
                      {onPreviewTransaction && (
                        <button
                          type="button"
                          onClick={() => onPreviewTransaction(t)}
                          className="p-1.5 rounded-lg bg-slate-800 hover:bg-amber-500 hover:text-slate-950 text-amber-300 transition cursor-pointer flex items-center gap-1 text-xs font-sans px-2"
                          title="View & Print Receipt (رسید دیکھیں اور پرنٹ کریں)"
                        >
                          <Printer className="w-3.5 h-3.5" />
                          <span>Print</span>
                        </button>
                      )}
                      {onDeleteTransaction && (
                        <button
                          type="button"
                          onClick={() => onDeleteTransaction(t._id || t.id)}
                          className="p-1.5 rounded-lg bg-slate-800 hover:bg-rose-500 hover:text-white text-slate-400 transition cursor-pointer"
                          title="Delete Bill (بل خارج کریں)"
                        >
                          <Trash2 className="w-4 h-4" />
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

      {/* Footer Info */}
      <div className="flex items-center justify-between text-xs text-slate-400 pt-1">
        <span className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
          Offline NeDB Storage Connected (mandi_bills.db)
        </span>
        <span className="font-urdu text-sm">سنہری کمیشن شاپ — غلہ منڈی ملکہ ہانس</span>
      </div>
    </div>
  )
}
