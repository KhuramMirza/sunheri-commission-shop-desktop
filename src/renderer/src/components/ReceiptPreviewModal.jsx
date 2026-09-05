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
        const iframe = document.createElement('iframe')
        iframe.style.position = 'fixed'
        iframe.style.right = '0'
        iframe.style.bottom = '0'
        iframe.style.width = '0'
        iframe.style.height = '0'
        iframe.style.border = '0'
        document.body.appendChild(iframe)

        const doc = iframe.contentWindow.document
        doc.open()
        doc.write(html)
        doc.close()

        iframe.contentWindow.focus()
        setTimeout(() => {
          iframe.contentWindow.print()
          setTimeout(() => document.body.removeChild(iframe), 2000)
        }, 300)

        setPdfSuccess(true)
        setTimeout(() => setPdfSuccess(false), 3000)
      }
    } catch (err) {
      console.error('Error saving PDF:', err)
    } finally {
      setSavingPdf(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 md:p-6 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl max-w-4xl w-full overflow-hidden flex flex-col max-h-[92vh]">
        {/* Modal Header */}
        <div className="px-6 py-3.5 bg-slate-800 border-b border-slate-700 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-1.5 rounded-lg bg-amber-500/10 text-amber-400">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <span>Receipt Preview (رسید کا منظر)</span>
                <span className="text-xs px-2 py-0.5 rounded-md bg-amber-500/20 text-amber-300 border border-amber-500/30">
                  Bill #{serialNo}
                </span>
              </h3>
              <p className="text-xs text-slate-400">A5 Landscape / Half A4 Format (210mm × 148.5mm)</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-700 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Paper Container - Realistic Voucher Display */}
        <div className="flex-1 overflow-y-auto p-4 md:p-6 flex justify-center bg-slate-950/80">
          <div className="bg-white text-black p-5 md:p-6 rounded-lg shadow-2xl w-[760px] max-w-full font-sans text-xs leading-normal border-2 border-black flex flex-col gap-3 select-text">
            {/* Header Section: 3-column horizontal distribution */}
            <div className="flex justify-between items-center pb-3 border-b-2 border-black gap-3">
              {/* Left: English Branding & Location */}
              <div className="w-[32%] text-left">
                <div className="font-black text-sm uppercase tracking-wide text-slate-950">
                  Sunheri Commission Shop
                </div>
                <div className="text-[11px] font-bold text-slate-800 mt-0.5">
                  Ghalla Mandi, Malka Hans
                </div>
                <div className="text-[11px] text-slate-700 font-urdu mt-0.5">غلہ منڈی ملکہ ہانس</div>
              </div>

              {/* Center: Urdu Branding & Tagline with generous line-height and margin */}
              <div className="w-[38%] text-center flex flex-col items-center justify-center">
                <div
                  className="font-urdu font-black text-2xl text-slate-950 select-text"
                  style={{ lineHeight: 2.2 }}
                >
                  سنہری کمیشن شاپ
                </div>
                <div
                  className="text-[11px] font-urdu font-bold text-slate-800 mt-2 select-text"
                  style={{ lineHeight: 1.8 }}
                >
                  ہر قسم کی زرعی اجناس کی خرید و فروخت کا با اعتماد ادارہ
                </div>
              </div>

              {/* Right: Contacts */}
              <div className="w-[30%] text-right text-[10px] space-y-0.5">
                <div className="flex justify-between">
                  <span className="text-slate-700">حاجی شبیر حسین (صدر):</span>
                  <span className="font-bold font-mono">0300-9696234</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-700">حاجی فقیر حسین:</span>
                  <span className="font-bold font-mono">0302-6535403</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-700">چوہدری سمیع:</span>
                  <span className="font-bold font-mono">0303-4884306</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-700">چوہدری بلال:</span>
                  <span className="font-bold font-mono">0309-9692044</span>
                </div>
              </div>
            </div>

            {/* Meta Bar */}
            <div className="flex justify-between items-center bg-slate-100 border border-black rounded px-3 py-1.5 text-xs font-semibold">
              <div>
                <span className="font-bold">بل نمبر (S.No):</span>
                <span className="font-black ml-1.5 text-sm text-slate-950 font-mono">#{serialNo}</span>
              </div>
              <div>
                <span className="font-bold">تاریخ و وقت (Date & Time):</span>
                <span className="ml-1.5 font-mono">
                  {date} {time}
                </span>
              </div>
              <div>
                <span className="font-bold">گاہک / زمیندار (Client):</span>
                <span className="font-black ml-1.5 text-sm text-slate-950">{clientName}</span>
              </div>
            </div>

            {/* Main Content: Wide 2-Column Layout */}
            <div className="grid grid-cols-12 gap-3.5">
              {/* Left Column: Weight Breakdown & Net Weight */}
              <div className="col-span-7 border border-black rounded p-3 flex flex-col justify-between bg-white">
                <div>
                  <div className="flex justify-between font-bold text-[11px] uppercase border-b border-black pb-1 mb-2">
                    <span>وزن کی تفصیل (Weight Breakdown)</span>
                    <span className="font-urdu">کلوگرام (Kg)</span>
                  </div>
                  <div className="space-y-1.5 text-xs">
                    <div className="flex justify-between items-center">
                      <span>صافی وزن (Gross Weight):</span>
                      <span className="font-bold font-mono text-sm">{saafi} Kg</span>
                    </div>
                    <div className="flex justify-between items-center text-slate-700">
                      <span>باردانہ کٹوتی (Bardana Deduction):</span>
                      <span className="font-mono text-sm">-{bardana} Kg</span>
                    </div>
                    <div className="flex justify-between items-center text-slate-700">
                      <span>کنڈہ کٹوتی (Kanda Machine Deduction):</span>
                      <span className="font-mono text-sm">-{kanda} Kg</span>
                    </div>
                  </div>
                </div>

                {/* Net Weight Box */}
                <div className="bg-slate-100 border border-black rounded p-2.5 mt-2.5">
                  <div className="flex justify-between font-black text-sm text-slate-950 border-b border-slate-400 pb-1">
                    <span>خالص وزن (Net Weight):</span>
                    <span className="font-mono text-base">{netWeight} Kg</span>
                  </div>
                  <div className="flex justify-between font-bold text-xs mt-1.5">
                    <span className="font-urdu">وزن بحساب من:</span>
                    <span className="text-sm">
                      {totalManns} من {remainingKgs} کلو
                    </span>
                  </div>
                  <div className="flex justify-between text-[10px] text-slate-600 mt-1">
                    <span>(1 Mann = 40.00 Kgs)</span>
                    <span className="font-mono">
                      {totalManns} Manns + {remainingKgs} Kgs
                    </span>
                  </div>
                </div>
              </div>

              {/* Right Column: Financial Summary */}
              <div className="col-span-5 border border-black rounded p-3 flex flex-col justify-between bg-slate-50">
                <div>
                  <div className="flex justify-between font-bold text-[11px] uppercase border-b border-black pb-1 mb-2">
                    <span>حساب رقم (Financials)</span>
                    <span className="font-urdu">روپیہ (PKR)</span>
                  </div>
                  <div className="space-y-1.5 text-xs">
                    <div className="flex justify-between items-center">
                      <span>ریٹ فی من (Rate / Mann):</span>
                      <span className="font-bold font-mono text-sm">Rs. {ratePerMann}</span>
                    </div>
                    <div className="flex justify-between items-center text-slate-700">
                      <span>ریٹ فی کلو (Rate / 1 Kg):</span>
                      <span className="font-mono text-sm">Rs. {ratePerKg}</span>
                    </div>
                  </div>
                </div>

                {/* Highlighted Total Amount Box */}
                <div className="border-2 border-black rounded p-2.5 text-center bg-white shadow-sm mt-2.5">
                  <div className="font-bold text-[11px] text-slate-800 uppercase tracking-wider">
                    کل رقم (TOTAL BILL)
                  </div>
                  <div className="font-black text-2xl text-slate-950 font-mono mt-0.5">
                    Rs. {totalBill}
                  </div>
                  <div className="text-[10px] text-slate-600 font-mono mt-1">
                    {totalManns}M {remainingKgs}Kg @ Rs.{ratePerMann}
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom Row: Generous Pencil Writing / Signature Space */}
            <div className="border-t border-black pt-2 flex justify-between items-end gap-6 mt-1">
              <div className="flex-1">
                <div className="text-[11px] font-bold text-slate-800 mb-6">
                  دستخط یا قلمی نوٹ (Signature / Notes):
                </div>
                <div className="border-b border-dashed border-slate-500 w-full" />
              </div>
              <div className="text-right text-[10px] text-slate-600">
                <div className="font-urdu font-bold text-xs text-slate-950">
                  شکریہ! دوبارہ تشریف لائیں۔
                </div>
                <div className="mt-0.5">Sunheri Commission Shop • Ghalla Mandi, Malka Hans</div>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Actions Footer: Clean Print & Close actions */}
        <div className="px-6 py-3.5 bg-slate-800 border-t border-slate-700 flex flex-wrap items-center justify-between gap-3">
          <div className="text-xs text-slate-300 font-medium">
            {pdfSuccess && (
              <span className="text-emerald-400 font-bold flex items-center gap-1.5">
                <Check className="w-4 h-4" /> Receipt sent to printer / PDF dialog!
              </span>
            )}
          </div>

          <div className="flex items-center gap-2.5">
            {/* Primary Print Button (Renamed from Save PDF, keeping exact reliable functionality) */}
            <button
              type="button"
              onClick={handleSavePdf}
              disabled={savingPdf}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-slate-950 font-black text-xs transition shadow-lg cursor-pointer active:scale-95"
              title="Print Receipt or Save as PDF"
            >
              <Printer className="w-4 h-4" />
              <span>{savingPdf ? 'Preparing Print...' : 'Print (پرنٹ کریں)'}</span>
            </button>

            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl bg-slate-700 hover:bg-slate-600 text-slate-200 font-bold text-xs transition cursor-pointer"
            >
              Close (بند کریں)
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
