import React, { useState } from 'react'
import { Printer, Download, X, Check, FileText } from 'lucide-react'
import { generateReceiptHtml } from '../utils/receiptTemplate'

export default function ReceiptPreviewModal({ bill, isOpen, onClose, onPrint }) {
  const [savingPdf, setSavingPdf] = useState(false)
  const [pdfSuccess, setPdfSuccess] = useState(false)

  if (!isOpen || !bill) return null

  const serialNo = bill.serialNo || 1
  const date = bill.date || new Date().toISOString().split('T')[0]
  const time = bill.createdAt
    ? new Date(bill.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    : new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  const clientName = bill.clientName || 'Cash Client (نقد گاہک)'
  const saafi = Number(bill.saafiWeight || 0).toFixed(2)
  const bardana = Number(bill.bardanaWeight || 0).toFixed(2)
  const kanda = Number(bill.kandaWeight || 0).toFixed(2)
  const netWeight = Number(bill.netWeight || 0).toFixed(2)
  const totalManns = bill.totalManns || 0
  const remainingKgs = Number(bill.remainingKgs || 0).toFixed(2)
  const ratePerMann = Number(bill.ratePerMann || 0).toFixed(2)
  const ratePerKg = Number(
    bill.ratePerKg || (bill.ratePerMann ? bill.ratePerMann / 40 : 0)
  ).toFixed(2)
  const totalBill = Number(bill.totalBill || 0).toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  })

  // Handle Save As PDF
  const handleSavePdf = async () => {
    setSavingPdf(true)
    setPdfSuccess(false)
    const html = generateReceiptHtml(bill)
    const defaultName = `Receipt_${serialNo}_${clientName.replace(/[^a-zA-Z0-9]/g, '_')}.pdf`

    try {
      if (window.api && window.api.savePdf) {
        const res = await window.api.savePdf(html, defaultName)
        if (res && res.success) {
          setPdfSuccess(true)
          setTimeout(() => setPdfSuccess(false), 3000)
        }
      } else {
        alert('PDF saving is supported in the desktop app window.')
      }
    } catch (err) {
      console.error('Error saving PDF:', err)
      alert('Error saving PDF file.')
    } finally {
      setSavingPdf(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="px-5 py-3.5 bg-slate-800/90 border-b border-slate-700 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-amber-500/10 text-amber-400">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Receipt Preview (رسید کا جائزہ)</h3>
              <p className="text-xs text-slate-400">Inspect receipt without needing a printer</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-700 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Paper Thermal Receipt Container */}
        <div className="flex-1 overflow-y-auto p-4 md:p-6 flex justify-center bg-slate-950/60">
          <div className="bg-white text-black p-5 rounded-lg shadow-xl w-[320px] max-w-full font-mono text-xs leading-relaxed border-t-4 border-amber-500 relative select-text">
            {/* Shop Header */}
            <div className="text-center pb-2">
              <div className="font-urdu font-bold text-xl text-slate-950 mb-0.5">
                سنہری کمیشن شاپ
              </div>
              <div className="font-extrabold text-sm uppercase tracking-wide text-slate-900">
                Sunheri Commission Shop
              </div>
              <div className="text-[11px] font-bold text-slate-800 mt-0.5">
                غلہ منڈی ملکہ ہانس (Ghalla Mandi, Malka Hans)
              </div>
              <div className="text-[10px] font-urdu text-slate-700 mt-0.5">
                ہر قسم کی زرعی اجناس کی خرید و فروخت کا با اعتماد ادارہ
              </div>
            </div>

            <div className="border-t-2 border-black my-2" />

            {/* Contacts */}
            <div className="text-[10px] space-y-1">
              <div className="flex justify-between">
                <span>حاجی شبیر حسین (صدر):</span>
                <span className="font-bold">0300-9696234</span>
              </div>
              <div className="flex justify-between">
                <span>حاجی فقیر حسین:</span>
                <span className="font-bold">0302-6535403</span>
              </div>
              <div className="flex justify-between">
                <span>چوہدری سمیع:</span>
                <span className="font-bold">0303-4884306</span>
              </div>
              <div className="flex justify-between">
                <span>چوہدری بلال:</span>
                <span className="font-bold">0309-9692044</span>
              </div>
            </div>

            <div className="border-t border-dashed border-black my-2" />

            {/* Meta */}
            <div className="flex justify-between font-bold text-[11px]">
              <span>بل نمبر (S.No): #{serialNo}</span>
              <span>
                {date} {time}
              </span>
            </div>
            <div className="flex justify-between mt-1 text-[11px]">
              <span>گاہک (Client):</span>
              <span className="font-bold text-slate-950">{clientName}</span>
            </div>

            <div className="border-t border-black my-2" />

            {/* Weight Breakdown */}
            <div className="space-y-1 text-[11px]">
              <div className="flex justify-between">
                <span>صافی وزن (Gross Wt):</span>
                <span className="font-bold">{saafi} Kg</span>
              </div>
              <div className="flex justify-between text-slate-700">
                <span>باردانہ کٹوتی (Bardana):</span>
                <span>-{bardana} Kg</span>
              </div>
              <div className="flex justify-between text-slate-700">
                <span>کنڈہ کٹوتی (Kanda):</span>
                <span>-{kanda} Kg</span>
              </div>
            </div>

            <div className="border-t border-dashed border-black my-2" />

            {/* Net Weight */}
            <div className="flex justify-between font-bold text-sm text-slate-950 py-0.5">
              <span>خالص وزن (Net Wt):</span>
              <span>{netWeight} Kg</span>
            </div>
            <div className="flex justify-between font-bold bg-slate-100 p-1.5 rounded my-1 text-xs">
              <span className="font-urdu">وزن بحساب من:</span>
              <span>
                {totalManns} من {remainingKgs} کلو
              </span>
            </div>
            <div className="flex justify-between text-[10px] text-slate-600">
              <span>(1 Mann = 40 Kg)</span>
              <span>
                {totalManns}M {remainingKgs}Kg
              </span>
            </div>

            <div className="border-t border-dashed border-black my-2" />

            {/* Pricing */}
            <div className="space-y-1 text-[11px]">
              <div className="flex justify-between">
                <span>ریٹ فی من (Rate/Mann):</span>
                <span className="font-bold">Rs. {ratePerMann}</span>
              </div>
              <div className="flex justify-between text-slate-700">
                <span>ریٹ فی کلو (Rate/Kg):</span>
                <span>Rs. {ratePerKg}</span>
              </div>
            </div>

            {/* Total Highlight Box */}
            <div className="border-2 border-black rounded p-2 my-2.5 text-center bg-amber-50/50">
              <div className="font-bold text-xs">کل رقم (TOTAL BILL)</div>
              <div className="font-black text-lg text-slate-950 mt-0.5">Rs. {totalBill}</div>
            </div>

            <div className="border-t-2 border-double border-black my-2" />
            <div className="text-center text-[10px] text-slate-700">
              <div className="font-urdu font-bold text-xs text-slate-950 mb-0.5">
                شکریہ! دوبارہ تشریف لائیں۔
              </div>
              <div>Software by Sunheri Commission Shop</div>
            </div>
          </div>
        </div>

        {/* Modal Actions Footer */}
        <div className="px-5 py-3.5 bg-slate-800/90 border-t border-slate-700 flex flex-wrap items-center justify-between gap-3">
          <div className="text-xs text-slate-400">
            {pdfSuccess && (
              <span className="text-emerald-400 font-bold flex items-center gap-1">
                <Check className="w-4 h-4" /> PDF saved successfully!
              </span>
            )}
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleSavePdf}
              disabled={savingPdf}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-700 hover:bg-slate-600 text-white font-semibold text-xs transition cursor-pointer"
            >
              <Download className="w-4 h-4 text-cyan-400" />
              <span>{savingPdf ? 'Saving...' : 'Save as PDF'}</span>
            </button>

            {onPrint && (
              <button
                type="button"
                onClick={() => onPrint(bill)}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs transition shadow-lg cursor-pointer"
              >
                <Printer className="w-4 h-4" />
                <span>Send to Printer</span>
              </button>
            )}

            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold text-xs transition cursor-pointer"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
