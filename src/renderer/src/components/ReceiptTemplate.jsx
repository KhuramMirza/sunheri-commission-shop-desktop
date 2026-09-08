import React from 'react'

export default function ReceiptTemplate({ bill }) {
  if (!bill) return null

  const serialNo = bill.serialNo || 1
  const date = bill.date || new Date().toISOString().split('T')[0]
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

  return (
    <div
      id="receipt-print-container"
      className="hidden print:block w-[210mm] max-w-[210mm] h-[148.5mm] p-4 bg-white text-black font-sans text-xs leading-normal select-text"
      style={{ display: 'none' }}
    >
      {/* Header */}
      <div className="flex justify-between items-center pb-2 border-b-2 border-black">
        <div className="w-1/3 text-left">
          <div className="font-black text-sm uppercase">Soneri Commission Shop</div>
          <div className="text-[10px] font-bold">Ghalla Mandi, Malka Hans (غلہ منڈی ملکہ ہانس)</div>
        </div>
        <div className="w-1/3 text-center flex flex-col items-center justify-center">
          <div className="font-urdu font-black text-2xl leading-relaxed mb-1">سنہری کمیشن شاپ</div>
          <div className="text-[11px] font-urdu font-bold text-slate-800 leading-normal">
            ہر قسم کی زرعی اجناس کی خرید و فروخت کا با اعتماد ادارہ
          </div>
        </div>
        <div className="w-1/3 text-right text-[9px] space-y-0.5">
          <div className="font-black text-black"><strong>حاجی شبیر حسین (صدر): 0300-9696234</strong></div>
          <div>حاجی فقیر حسین: 0302-6535403</div>
          <div>چوہدری سمیع: 0303-4884306 | چوہدری بلال: 0309-9692044</div>
        </div>
      </div>

      {/* Meta Bar: Person the bill belongs to in the CENTER */}
      <div className="flex justify-between items-center bg-gray-100 border border-black rounded px-3 py-1 my-2 text-xs font-bold" style={{ direction: 'rtl' }}>
        <span className="w-1/4 text-right">بل نمبر (S.No): #{serialNo}</span>
        <div className="flex-1 text-center flex items-center justify-center">
          <div className="inline-flex items-center gap-2 px-3 py-0.5 bg-white border-2 border-black rounded">
            <span className="text-xs font-bold text-gray-800">گاہک / زمیندار (Client):</span>
            <span className="text-lg font-black text-black underline decoration-2 underline-offset-4 tracking-wide">{clientName}</span>
          </div>
        </div>
        <span className="w-1/4 text-left" style={{ direction: 'ltr' }}>تاریخ: {date}</span>
      </div>

      {/* Content: Urdu First (Right: Weights, Left: Financials) */}
      <div className="grid grid-cols-2 gap-4 my-2" style={{ direction: 'rtl' }}>
        {/* Right Column: Weight Deductions & Net Weight */}
        <div className="border border-black rounded p-2 text-right">
          <div className="font-bold border-b border-black pb-1 mb-1">وزن کی تفصیل (Weights)</div>
          <div className="flex justify-between">
            <span>صافی وزن (Gross):</span>
            <span className="font-bold" style={{ direction: 'ltr' }}>{saafi} Kg</span>
          </div>
          <div className="flex justify-between text-gray-700">
            <span>باردانہ کٹوتی (Bardana):</span>
            <span style={{ direction: 'ltr' }}>-{bardana} Kg</span>
          </div>
          <div className="flex justify-between text-gray-700">
            <span>کنڈہ کٹوتی (Kanda):</span>
            <span style={{ direction: 'ltr' }}>-{kanda} Kg</span>
          </div>
          <div className="border-t border-black pt-1 mt-1 font-bold">
            <div className="flex justify-between">
              <span>خالص وزن (Net Weight):</span>
              <span style={{ direction: 'ltr' }}>{netWeight} Kg</span>
            </div>
            <div className="flex justify-between items-center text-xs mt-0.5">
              <span>وزن بحساب من:</span>
              <span className="inline-flex items-center gap-1 font-bold text-sm" style={{ direction: 'ltr' }}>
                <span className="font-mono text-base font-bold">{totalManns}</span>
                <span className="font-urdu text-sm">من</span>
                <span className="text-gray-500 font-bold mx-0.5">+</span>
                <span className="font-mono text-base font-bold">{remainingKgs}</span>
                <span className="font-urdu text-sm">کلو</span>
              </span>
            </div>
          </div>
        </div>

        {/* Left Column: Financials */}
        <div className="border border-black rounded p-2 flex flex-col justify-between bg-gray-50 text-right">
          <div>
            <div className="font-bold border-b border-black pb-1 mb-1">حساب رقم (Financials)</div>
            <div className="flex justify-between">
              <span>ریٹ فی من (Rate/Mann):</span>
              <span className="font-bold" style={{ direction: 'ltr' }}>Rs. {ratePerMann}</span>
            </div>
            <div className="flex justify-between text-gray-700">
              <span>ریٹ فی کلو (Rate/Kg):</span>
              <span style={{ direction: 'ltr' }}>Rs. {ratePerKg}</span>
            </div>
          </div>
          <div className="border-2 border-black rounded p-2 text-center bg-white" style={{ direction: 'ltr' }}>
            <div className="font-bold text-xs">کل رقم (TOTAL BILL)</div>
            <div className="font-black text-lg">Rs. {totalBill}</div>
          </div>
        </div>
      </div>

      {/* Bottom: Urdu First (Right: Signature, Left: Payment Notice) */}
      <div className="border-t border-black pt-2 flex justify-between items-end mt-4" style={{ direction: 'rtl' }}>
        <div className="flex-1 text-right">
          <div className="text-[11px] font-bold mb-6">دستخط یا قلمی نوٹ (Signature / Notes):</div>
          <div className="border-b border-dashed border-gray-600 w-full" />
        </div>
        <div className="text-left text-[10px] min-w-[42%]" style={{ direction: 'ltr' }}>
          <div className="font-urdu font-bold text-xs text-black" style={{ direction: 'rtl', textAlign: 'left' }}>
            پیمنٹ کی ادائیگی 3 سے 4 ہفتوں میں کی جاتی ہے۔
          </div>
          <div className="text-[9px] text-gray-600 mt-0.5">(Payment will be made within 3-4 weeks)</div>
          <div className="mt-0.5 text-gray-700">Soneri Commission Shop • Ghalla Mandi, Malka Hans</div>
        </div>
      </div>

      {/* POS Software Credit Bar */}
      <div className="border-t border-black mt-2 pt-1 flex justify-between items-center text-[10px] text-gray-800">
        <div>
          <span className="font-semibold text-gray-600">POS Software: </span>
          <span className="font-bold text-black">Easy Solutions</span>
        </div>
        <div className="flex items-center gap-1 font-bold">
          <span className="font-urdu text-xs">رابطہ برائے کمپیوٹر سافٹ ویئر: </span>
          <span className="font-mono text-xs font-bold text-black">0315-6566533</span>
        </div>
        <div>
          <span className="font-semibold text-gray-600">Contact: </span>
          <span className="font-mono font-bold text-black">0315-6566533</span>
        </div>
      </div>
    </div>
  )
}
