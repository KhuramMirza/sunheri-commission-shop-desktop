import React, { useState } from 'react'
import { Printer, Download, X, Check, FileText } from 'lucide-react'
import { generateReceiptHtml } from '../utils/receiptTemplate'
import KapasLogo from './KapasLogo'

export default function ReceiptPreviewModal({ bill, isOpen, onClose }) {
  const [printing, setPrinting] = useState(false)
  const [printSuccess, setPrintSuccess] = useState(false)
  const [savingPdf, setSavingPdf] = useState(false)
  const [pdfSuccess, setPdfSuccess] = useState(false)

  if (!isOpen || !bill) return null

  const serialNo = bill.serialNo || 1
  const date = bill.date || new Date().toISOString().split('T')[0]
  const time = bill.createdAt
    ? new Date(bill.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    : new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  const clientName = bill.clientName && bill.clientName.trim() ? bill.clientName.trim() : 'نقد گاہک'
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

  // Gross Bill calculation
  const grossBillNum =
    bill.grossBill !== undefined
      ? Number(bill.grossBill)
      : Number(bill.totalBill || 0) + (bill.masjidFund !== undefined ? Number(bill.masjidFund) : 200)

  const grossBill = grossBillNum.toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  })

  // Masjid Fund deduction (-200 Rs)
  const masjidFundNum =
    bill.masjidFund !== undefined
      ? Number(bill.masjidFund)
      : grossBillNum > 0
        ? 200
        : 0

  const masjidFund = masjidFundNum.toLocaleString('en-US', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  })

  // Net Total Bill
  const totalBillNum =
    bill.totalBill !== undefined
      ? Number(bill.totalBill)
      : Math.max(0, grossBillNum - masjidFundNum)

  const totalBill = totalBillNum.toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  })

  // Direct Print Popup: Instantly triggers the system/Chromium print window!
  const handlePrint = () => {
    setPrinting(true)
    setPrintSuccess(false)
    const html = generateReceiptHtml(bill)

    try {
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
        setPrintSuccess(true)
        setTimeout(() => setPrintSuccess(false), 3000)
        setTimeout(() => {
          try {
            document.body.removeChild(iframe)
          } catch (_) {}
          setPrinting(false)
        }, 2000)
      }, 350)
    } catch (err) {
      console.error('Error triggering print window:', err)
      setPrinting(false)
    }
  }

  // Handle Save As PDF file to disk
  const handleSavePdf = async () => {
    setSavingPdf(true)
    setPdfSuccess(false)
    const html = generateReceiptHtml(bill)
    const defaultName = `Bill_${serialNo}_${clientName.replace(/[^a-zA-Z0-9\u0600-\u06FF]/g, '_')}.pdf`

    try {
      if (window.api && window.api.savePdf) {
        const res = await window.api.savePdf(html, defaultName)
        if (res && res.success) {
          setPdfSuccess(true)
          setTimeout(() => setPdfSuccess(false), 3000)
        }
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
                <span className="font-urdu">رسید کا منظر</span>
                <span className="text-xs px-2 py-0.5 rounded-md bg-amber-500/20 text-amber-300 border border-amber-500/30 font-mono">
                  #{serialNo}
                </span>
              </h3>
              <p className="text-xs text-slate-400 font-urdu">مکمل اردو رسید واؤچر (پرنٹ کے لیے تیار)</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-700 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Paper Container - 100% Urdu Realistic Voucher Display */}
        <div className="flex-1 overflow-y-auto p-4 md:p-6 flex justify-center bg-slate-950/80">
          <div
            className="bg-white text-black p-4 md:p-5 rounded-lg shadow-2xl w-[6.9in] max-w-full font-sans text-xs leading-normal border-2 border-black flex flex-col gap-2.5 select-text"
            style={{ direction: 'rtl' }}
          >
            {/* Header Section: 3 Columns (Right: Contacts, Center: Shop Title, Left: Date/Time) */}
            <div className="flex justify-between items-center pb-2.5 border-b-2 border-black gap-2.5" style={{ direction: 'rtl' }}>
              {/* Top Right: Contacts with enlarged text & strict nowrap */}
              <div className="w-[37%] shrink-0 text-right text-xs space-y-1">
                <div className="flex justify-between items-center bg-slate-100 border border-slate-400 px-2 py-0.5 rounded whitespace-nowrap flex-nowrap">
                  <span className="font-black text-black font-urdu text-[11.5px] whitespace-nowrap shrink-0">حاجی شبیر حسین (صدر):</span>
                  <span className="font-black font-mono text-black text-[11.5px] whitespace-nowrap shrink-0" style={{ direction: 'ltr', unicodeBidi: 'isolate' }}>0300-9696234</span>
                </div>
                <div className="flex justify-between items-center text-slate-900 px-0.5 whitespace-nowrap flex-nowrap">
                  <span className="font-bold font-urdu text-[11px] whitespace-nowrap shrink-0">حاجی فقیر حسین:</span>
                  <span className="font-bold font-mono text-[11px] whitespace-nowrap shrink-0" style={{ direction: 'ltr', unicodeBidi: 'isolate' }}>0302-6535403</span>
                </div>
                <div className="flex justify-between items-center text-slate-900 px-0.5 whitespace-nowrap flex-nowrap">
                  <span className="font-bold font-urdu text-[11px] whitespace-nowrap shrink-0">چوہدری سمیع:</span>
                  <span className="font-bold font-mono text-[11px] whitespace-nowrap shrink-0" style={{ direction: 'ltr', unicodeBidi: 'isolate' }}>0303-4884306</span>
                </div>
                <div className="flex justify-between items-center text-slate-900 px-0.5 whitespace-nowrap flex-nowrap">
                  <span className="font-bold font-urdu text-[11px] whitespace-nowrap shrink-0">چوہدری بلال:</span>
                  <span className="font-bold font-mono text-[11px] whitespace-nowrap shrink-0" style={{ direction: 'ltr', unicodeBidi: 'isolate' }}>0309-9692044</span>
                </div>
              </div>

              {/* Top Center: Shop Name & Location (No English) */}
              <div className="w-[40%] text-center flex flex-col items-center justify-center">
                <div className="flex items-center justify-center mb-0.5">
                  <KapasLogo size={40} />
                </div>
                <div
                  className="font-urdu font-black text-2xl sm:text-3xl text-slate-950 select-text leading-tight whitespace-nowrap"
                  style={{ lineHeight: 1.6 }}
                >
                  سنہری کمیشن شاپ
                </div>
                <div
                  className="font-urdu font-bold text-sm text-slate-900 select-text mt-0.5 whitespace-nowrap"
                  style={{ lineHeight: 1.4 }}
                >
                  غلہ منڈی ملکہ ہانس
                </div>
                <div
                  className="text-[10px] font-urdu font-bold text-slate-700 select-text mt-0.5 whitespace-nowrap"
                  style={{ lineHeight: 1.35 }}
                >
                  ہر قسم کی زرعی اجناس کی خرید و فروخت کا با اعتماد ادارہ
                </div>
              </div>

              {/* Top Left: Date, Time & Bill Number */}
              <div
                className="w-[23%] shrink-0 bg-slate-50 border border-black rounded p-2 text-left flex flex-col justify-center items-start gap-1"
                style={{ direction: 'ltr' }}
              >
                <div className="flex items-center justify-between w-full text-[11px]">
                  <span className="font-urdu font-bold text-slate-900">تاریخ:</span>
                  <span className="font-mono text-slate-950 font-black">{date}</span>
                </div>
                <div className="flex items-center justify-between w-full text-[11px]">
                  <span className="font-urdu font-bold text-slate-900">وقت:</span>
                  <span className="font-mono text-slate-950 font-black">{time}</span>
                </div>
                <div className="flex items-center justify-between w-full text-[11px]">
                  <span className="font-urdu font-bold text-slate-900">بل نمبر:</span>
                  <span className="font-mono text-slate-950 font-black text-sm">#{serialNo}</span>
                </div>
              </div>
            </div>

            {/* Customer Name Bar: Prominent and pure Urdu */}
            <div className="flex items-center bg-slate-100 border border-black rounded px-3.5 py-1.5 text-xs font-semibold gap-2" style={{ direction: 'rtl' }}>
              <span className="font-black text-sm text-slate-950 font-urdu flex-shrink-0">نام:</span>
              <span className="font-black text-base md:text-lg text-black underline decoration-black decoration-2 underline-offset-4 tracking-wide truncate font-urdu flex-1 text-right">
                {clientName}
              </span>
            </div>

            {/* Main Content: Wide 2-Column Layout (Right: Weights, Left: Financials & Masjid Fund) */}
            <div className="grid grid-cols-12 gap-3.5" style={{ direction: 'rtl' }}>
              {/* Right Column: Weight Breakdown & Net Weight */}
              <div className="col-span-7 border border-black rounded p-3 flex flex-col justify-between bg-white text-right">
                <div>
                  <div className="flex justify-between font-bold text-[11.5px] border-b border-black pb-1 mb-2 font-urdu">
                    <span>وزن کی تفصیل</span>
                    <span>(کلوگرام)</span>
                  </div>
                  <div className="space-y-1.5 text-xs">
                    <div className="flex justify-between items-center">
                      <span className="font-urdu">صافی وزن:</span>
                      <span className="font-bold font-mono text-sm" style={{ direction: 'ltr' }}>{saafi} کلو</span>
                    </div>
                    <div className="flex justify-between items-center text-slate-700">
                      <span className="font-urdu">باردانہ کٹوتی:</span>
                      <span className="font-mono text-sm" style={{ direction: 'ltr' }}>-{bardana} کلو</span>
                    </div>
                    <div className="flex justify-between items-center text-slate-700">
                      <span className="font-urdu">کنڈہ کٹوتی:</span>
                      <span className="font-mono text-sm" style={{ direction: 'ltr' }}>-{kanda} کلو</span>
                    </div>
                  </div>
                </div>

                {/* Net Weight Box */}
                <div className="bg-slate-100 border border-black rounded p-2.5 mt-2.5">
                  <div className="flex justify-between font-black text-sm text-slate-950 border-b border-slate-400 pb-1">
                    <span className="font-urdu">خالص وزن:</span>
                    <span className="font-mono text-base" style={{ direction: 'ltr' }}>{netWeight} کلو</span>
                  </div>
                  <div className="flex justify-between items-center font-bold text-xs mt-1.5">
                    <span className="font-urdu">وزن بحساب من:</span>
                    <span className="inline-flex items-center gap-1 font-bold text-sm" style={{ direction: 'rtl' }}>
                      <span className="font-mono text-base font-black">{totalManns}</span>
                      <span className="font-urdu text-sm font-bold">من</span>
                      <span className="text-slate-500 font-bold mx-1">+</span>
                      <span className="font-mono text-base font-black">{remainingKgs}</span>
                      <span className="font-urdu text-sm font-bold">کلو</span>
                    </span>
                  </div>
                  <div className="flex justify-between text-[10px] text-slate-600 mt-1 font-urdu font-medium">
                    <span>(1 من = 40.00 کلوگرام)</span>
                    <span>صافی - (باردانہ + کنڈہ)</span>
                  </div>
                </div>
              </div>

              {/* Left Column: Financial Summary with Masjid Fund */}
              <div className="col-span-5 border border-black rounded p-3 flex flex-col justify-between bg-slate-50 text-right">
                <div>
                  <div className="flex justify-between font-bold text-[11.5px] border-b border-black pb-1 mb-2 font-urdu">
                    <span>حساب رقم</span>
                    <span>(روپیہ)</span>
                  </div>
                  <div className="space-y-1.5 text-xs">
                    <div className="flex justify-between items-center">
                      <span className="font-urdu">ریٹ فی من:</span>
                      <span className="font-bold font-mono text-sm" style={{ direction: 'ltr' }}>روپیہ {ratePerMann}</span>
                    </div>
                    <div className="flex justify-between items-center text-slate-700">
                      <span className="font-urdu">ریٹ فی کلو:</span>
                      <span className="font-mono text-sm" style={{ direction: 'ltr' }}>روپیہ {ratePerKg}</span>
                    </div>
                    <div className="flex justify-between items-center text-slate-950 font-bold pt-1 border-t border-slate-200">
                      <span className="font-urdu">کل رقم (گروس):</span>
                      <span className="font-mono text-sm font-black" style={{ direction: 'ltr' }}>روپیہ {grossBill}</span>
                    </div>
                    <div className="flex justify-between items-center text-rose-700 font-black">
                      <span className="font-urdu">مسجد فنڈ کٹوتی:</span>
                      <span className="font-mono text-sm font-black" style={{ direction: 'ltr' }}>-{masjidFund} روپیہ</span>
                    </div>
                  </div>
                </div>

                {/* Highlighted Total Amount Box */}
                <div className="border-2 border-black rounded p-2.5 text-center bg-white shadow-sm mt-2.5" style={{ direction: 'rtl' }}>
                  <div className="font-black text-xs text-slate-900 font-urdu tracking-wide">
                    صافی رقم (کل بل)
                  </div>
                  <div className="font-black text-2xl text-slate-950 font-mono mt-0.5" style={{ direction: 'ltr' }}>
                    Rs. {totalBill}
                  </div>
                  <div className="text-[10px] text-slate-700 font-urdu font-bold mt-1">
                    {totalManns} من + {remainingKgs} کلو @ روپیہ {ratePerMann} (-{masjidFund})
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom Row: Signature & Payment Notice */}
            <div className="border-t border-black pt-2 flex justify-between items-end gap-6 mt-1" style={{ direction: 'rtl' }}>
              {/* Right: Pencil Writing / Signature Space */}
              <div className="flex-1 text-right">
                <div className="text-[11px] font-bold text-slate-800 mb-6 font-urdu">
                  دستخط یا قلمی نوٹ:
                </div>
                <div className="border-b border-dashed border-slate-500 w-full" />
              </div>

              {/* Left: Payment Clearance Policy Notice & Shop Info */}
              <div className="text-left min-w-[44%]" style={{ direction: 'rtl' }}>
                <div className="font-urdu font-black text-sm text-slate-950 text-left" style={{ lineHeight: 1.6 }}>
                  پیمنٹ کی ادائیگی 3 سے 4 ہفتوں میں کی جاتی ہے۔
                </div>
                <div className="mt-0.5 text-[10.5px] text-slate-800 font-urdu font-medium text-left">
                  سنہری کمیشن شاپ — غلہ منڈی ملکہ ہانس
                </div>
              </div>
            </div>

            {/* POS Software Credit Bar in Pure Urdu */}
            <div className="border-t border-black mt-2 pt-1.5 flex justify-between items-center text-[10.5px] text-slate-900 select-text" style={{ direction: 'rtl' }}>
              <div>
                <span className="font-urdu">کمپیوٹر سافٹ ویئر: </span>
                <span className="font-black text-slate-950 font-urdu">ایزی سلوشنز</span>
              </div>
              <div className="flex items-center gap-1 font-bold">
                <span className="font-urdu">رابطہ برائے سافٹ ویئر: </span>
                <span className="font-mono text-xs font-black text-slate-950" style={{ direction: 'ltr' }}>0315-6566533</span>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Actions Footer: Direct Print Popup & Save PDF options */}
        <div className="px-6 py-3.5 bg-slate-800 border-t border-slate-700 flex flex-wrap items-center justify-between gap-3">
          <div className="text-xs text-slate-300 font-medium font-urdu">
            {printSuccess && (
              <span className="text-emerald-400 font-bold flex items-center gap-1.5">
                <Check className="w-4 h-4" /> پرنٹ ڈائیلاگ اوپن ہو گیا ہے!
              </span>
            )}
            {pdfSuccess && (
              <span className="text-emerald-400 font-bold flex items-center gap-1.5">
                <Check className="w-4 h-4" /> پی ڈی ایف فائل محفوظ ہو گئی ہے!
              </span>
            )}
          </div>

          <div className="flex items-center gap-2.5">
            <button
              type="button"
              onClick={handlePrint}
              disabled={printing}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-slate-950 font-black text-xs transition shadow-lg cursor-pointer active:scale-95 disabled:opacity-50"
              title="پرنٹ کریں"
            >
              <Printer className="w-4 h-4" />
              <span className="font-urdu text-sm">{printing ? 'پرنٹنگ شروع...' : 'پرنٹ کریں (Print)'}</span>
            </button>

            <button
              type="button"
              onClick={handleSavePdf}
              disabled={savingPdf}
              className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-slate-700 hover:bg-slate-600 text-slate-200 font-bold text-xs transition cursor-pointer active:scale-95 disabled:opacity-50"
              title="پی ڈی ایف محفوظ کریں"
            >
              <Download className="w-3.5 h-3.5" />
              <span className="font-urdu text-xs">{savingPdf ? 'محفوظ ہو رہا ہے...' : 'پی ڈی ایف (Save PDF)'}</span>
            </button>

            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs transition cursor-pointer font-urdu"
            >
              بند کریں (Close)
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
