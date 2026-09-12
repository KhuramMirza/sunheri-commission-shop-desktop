import React from 'react'

export default function ReceiptTemplate({ bill }) {
  if (!bill) return null

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

  return (
    <div
      id="receipt-print-container"
      className="hidden print:block w-[6.9in] max-w-[6.9in] mx-auto p-3 bg-white text-black font-sans text-xs leading-normal select-text"
      style={{ display: 'none', direction: 'rtl' }}
    >
      {/* Header: 3-Column Distribution */}
      <div className="flex justify-between items-center pb-2 border-b-2 border-black gap-2.5" style={{ direction: 'rtl' }}>
        {/* Top Right: Contacts */}
        <div className="w-[37%] shrink-0 text-right text-xs space-y-0.5">
          <div className="flex justify-between items-center bg-gray-100 border border-gray-400 px-1.5 py-0.5 rounded font-black text-black whitespace-nowrap flex-nowrap">
            <span className="text-[11.5px] whitespace-nowrap shrink-0">حاجی شبیر حسین (صدر):</span>
            <span className="text-[11.5px] whitespace-nowrap shrink-0 font-mono" style={{ direction: 'ltr', unicodeBidi: 'isolate' }}>0300-9696234</span>
          </div>
          <div className="flex justify-between items-center px-0.5 whitespace-nowrap flex-nowrap">
            <span className="text-[11px] whitespace-nowrap shrink-0">حاجی فقیر حسین:</span>
            <span className="text-[11px] whitespace-nowrap shrink-0 font-mono" style={{ direction: 'ltr', unicodeBidi: 'isolate' }}>0302-6535403</span>
          </div>
          <div className="flex justify-between items-center px-0.5 whitespace-nowrap flex-nowrap">
            <span className="text-[11px] whitespace-nowrap shrink-0">چوہدری سمیع:</span>
            <span className="text-[11px] whitespace-nowrap shrink-0 font-mono" style={{ direction: 'ltr', unicodeBidi: 'isolate' }}>0303-4884306</span>
          </div>
          <div className="flex justify-between items-center px-0.5 whitespace-nowrap flex-nowrap">
            <span className="text-[11px] whitespace-nowrap shrink-0">چوہدری بلال:</span>
            <span className="text-[11px] whitespace-nowrap shrink-0 font-mono" style={{ direction: 'ltr', unicodeBidi: 'isolate' }}>0309-9692044</span>
          </div>
        </div>

        {/* Top Center: Shop Name & Location (Pure Urdu) */}
        <div className="w-[40%] text-center flex flex-col items-center justify-center">
          <div className="font-urdu font-black text-2xl leading-relaxed text-black whitespace-nowrap">سنہری کمیشن شاپ</div>
          <div className="font-urdu font-bold text-sm text-black whitespace-nowrap">غلہ منڈی ملکہ ہانس</div>
          <div className="text-[10px] font-urdu font-bold text-gray-800 leading-normal mt-0.5 whitespace-nowrap">
            ہر قسم کی زرعی اجناس کی خرید و فروخت کا با اعتماد ادارہ
          </div>
        </div>

        {/* Top Left: Date, Time & Bill Number */}
        <div
          className="w-[23%] shrink-0 bg-gray-50 border border-black rounded p-1.5 text-left flex flex-col justify-center items-start text-[10.5px]"
          style={{ direction: 'ltr' }}
        >
          <div className="flex justify-between w-full">
            <span className="font-urdu font-bold">تاریخ:</span>
            <span className="font-mono font-bold">{date}</span>
          </div>
          <div className="flex justify-between w-full">
            <span className="font-urdu font-bold">وقت:</span>
            <span className="font-mono font-bold">{time}</span>
          </div>
          <div className="flex justify-between w-full">
            <span className="font-urdu font-bold">بل نمبر:</span>
            <span className="font-mono font-black">#{serialNo}</span>
          </div>
        </div>
      </div>

      {/* Customer Name Row (Pure Urdu) */}
      <div className="flex items-center bg-gray-100 border border-black rounded px-3 py-1 my-2 text-xs font-bold gap-2" style={{ direction: 'rtl' }}>
        <span className="font-urdu font-black text-sm flex-shrink-0">نام:</span>
        <span className="text-base font-black text-black underline decoration-2 underline-offset-4 tracking-wide truncate font-urdu flex-1 text-right">
          {clientName}
        </span>
      </div>

      {/* Main Content Columns: Right: Weights, Left: Financials & Masjid Fund */}
      <div className="grid grid-cols-2 gap-3 my-2" style={{ direction: 'rtl' }}>
        {/* Right Column: Weight Deductions & Net Weight */}
        <div className="border border-black rounded p-2 text-right">
          <div className="font-bold border-b border-black pb-1 mb-1 font-urdu flex justify-between">
            <span>وزن کی تفصیل</span>
            <span>(کلوگرام)</span>
          </div>
          <div className="flex justify-between text-xs py-0.5">
            <span className="font-urdu">صافی وزن:</span>
            <span className="font-bold" style={{ direction: 'ltr' }}>{saafi} کلو</span>
          </div>
          <div className="flex justify-between text-gray-700 text-xs py-0.5">
            <span className="font-urdu">باردانہ کٹوتی:</span>
            <span style={{ direction: 'ltr' }}>-{bardana} کلو</span>
          </div>
          <div className="flex justify-between text-gray-700 text-xs py-0.5">
            <span className="font-urdu">کنڈہ کٹوتی:</span>
            <span style={{ direction: 'ltr' }}>-{kanda} کلو</span>
          </div>
          <div className="border-t border-black pt-1 mt-1 font-bold">
            <div className="flex justify-between text-xs">
              <span className="font-urdu">خالص وزن:</span>
              <span style={{ direction: 'ltr' }}>{netWeight} کلو</span>
            </div>
            <div className="flex justify-between items-center text-xs mt-0.5">
              <span className="font-urdu">وزن بحساب من:</span>
              <span className="inline-flex items-center gap-1 font-bold text-sm" style={{ direction: 'rtl' }}>
                <span className="font-mono text-base font-black">{totalManns}</span>
                <span className="font-urdu text-sm font-bold">من</span>
                <span className="text-gray-500 font-bold mx-0.5">+</span>
                <span className="font-mono text-base font-black">{remainingKgs}</span>
                <span className="font-urdu text-sm font-bold">کلو</span>
              </span>
            </div>
          </div>
        </div>

        {/* Left Column: Financials & Masjid Fund */}
        <div className="border border-black rounded p-2 flex flex-col justify-between bg-gray-50 text-right">
          <div>
            <div className="font-bold border-b border-black pb-1 mb-1 font-urdu flex justify-between">
              <span>حساب رقم</span>
              <span>(روپیہ)</span>
            </div>
            <div className="flex justify-between text-xs py-0.5">
              <span className="font-urdu">ریٹ فی من:</span>
              <span className="font-bold" style={{ direction: 'ltr' }}>روپیہ {ratePerMann}</span>
            </div>
            <div className="flex justify-between text-gray-700 text-xs py-0.5">
              <span className="font-urdu">ریٹ فی کلو:</span>
              <span style={{ direction: 'ltr' }}>روپیہ {ratePerKg}</span>
            </div>
            <div className="flex justify-between text-xs py-0.5 font-bold">
              <span className="font-urdu">کل رقم (گروس):</span>
              <span style={{ direction: 'ltr' }}>روپیہ {grossBill}</span>
            </div>
            <div className="flex justify-between text-xs py-0.5 text-red-700 font-bold">
              <span className="font-urdu">مسجد فنڈ کٹوتی:</span>
              <span style={{ direction: 'ltr' }}>-{masjidFund} روپیہ</span>
            </div>
          </div>
          <div className="border-2 border-black rounded p-1.5 text-center bg-white mt-1" style={{ direction: 'rtl' }}>
            <div className="font-bold text-xs font-urdu">صافی رقم (کل بل)</div>
            <div className="font-black text-lg" style={{ direction: 'ltr' }}>Rs. {totalBill}</div>
          </div>
        </div>
      </div>

      {/* Bottom: Signature & Payment Notice */}
      <div className="border-t border-black pt-2 flex justify-between items-end mt-2" style={{ direction: 'rtl' }}>
        <div className="flex-1 text-right">
          <div className="text-[11px] font-bold mb-4 font-urdu">دستخط یا قلمی نوٹ:</div>
          <div className="border-b border-dashed border-gray-600 w-full" />
        </div>
        <div className="text-left text-[10px] min-w-[42%]" style={{ direction: 'rtl' }}>
          <div className="font-urdu font-black text-xs text-black text-left">
            پیمنٹ کی ادائیگی 3 سے 4 ہفتوں میں کی جاتی ہے۔
          </div>
          <div className="text-[10px] text-gray-700 font-urdu mt-0.5 text-left">
            سنہری کمیشن شاپ — غلہ منڈی ملکہ ہانس
          </div>
        </div>
      </div>

      {/* POS Software Credit Bar in pure Urdu */}
      <div className="border-t border-black mt-2 pt-1 flex justify-between items-center text-[9.5px] text-gray-800" style={{ direction: 'rtl' }}>
        <div>
          <span className="font-urdu">کمپیوٹر سافٹ ویئر: </span>
          <span className="font-bold text-black font-urdu">ایزی سلوشنز</span>
        </div>
        <div className="flex items-center gap-1 font-bold">
          <span className="font-urdu">رابطہ برائے سافٹ ویئر: </span>
          <span className="font-mono text-xs font-bold text-black" style={{ direction: 'ltr' }}>0315-6566533</span>
        </div>
      </div>
    </div>
  )
}
