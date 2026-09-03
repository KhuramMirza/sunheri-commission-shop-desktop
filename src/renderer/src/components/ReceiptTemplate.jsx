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
  const ratePerKg = Number(bill.ratePerKg || (bill.ratePerMann ? bill.ratePerMann / 40 : 0)).toFixed(2)
  const totalBill = Number(bill.totalBill || 0).toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  })

  return (
    <div
      id="receipt-print-container"
      className="hidden print:block w-[78mm] max-w-[78mm] p-2 bg-white text-black font-mono text-[11px] leading-tight select-text"
      style={{ display: 'none' }}
    >
      {/* Header */}
      <div className="text-center">
        <div className="font-urdu font-bold text-base leading-snug">سنہری کمیشن شاپ</div>
        <div className="font-bold text-xs uppercase tracking-wider">Sunheri Commission Shop</div>
        <div className="text-[10px] font-semibold">غلہ منڈی ملکہ ہانس (Ghalla Mandi, Malka Hans)</div>
        <div className="text-[9px] font-urdu">ہر قسم کی زرعی اجناس کی خرید و فروخت کا با اعتماد ادارہ</div>
      </div>

      <div className="border-t-2 border-black my-1" />

      {/* Contacts */}
      <div className="text-[9px] space-y-0.5">
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

      <div className="border-t border-dashed border-black my-1" />

      {/* Bill Meta */}
      <div className="flex justify-between font-bold text-[11px]">
        <span>بل نمبر (S.No): #{serialNo}</span>
        <span>{date}</span>
      </div>
      <div className="flex justify-between mt-0.5">
        <span>گاہک (Client):</span>
        <span className="font-bold">{clientName}</span>
      </div>

      <div className="border-t border-black my-1" />

      {/* Weight Breakdown */}
      <div className="space-y-0.5">
        <div className="flex justify-between">
          <span>صافی وزن (Gross):</span>
          <span className="font-bold">{saafi} Kg</span>
        </div>
        <div className="flex justify-between text-gray-700">
          <span>باردانہ کٹوتی (Bardana):</span>
          <span>-{bardana} Kg</span>
        </div>
        <div className="flex justify-between text-gray-700">
          <span>کنڈہ کٹوتی (Kanda):</span>
          <span>-{kanda} Kg</span>
        </div>
      </div>

      <div className="border-t border-dashed border-black my-1" />

      {/* Net Weight */}
      <div className="flex justify-between font-bold text-xs py-0.5">
        <span>خالص وزن (Net Wt):</span>
        <span>{netWeight} Kg</span>
      </div>
      <div className="flex justify-between font-bold bg-gray-100 p-0.5 my-0.5">
        <span>بحساب من:</span>
        <span>
          {totalManns} من {remainingKgs} کلو
        </span>
      </div>

      <div className="border-t border-dashed border-black my-1" />

      {/* Rates */}
      <div className="space-y-0.5">
        <div className="flex justify-between">
          <span>ریٹ فی من (Rate/Mann):</span>
          <span className="font-bold">Rs. {ratePerMann}</span>
        </div>
        <div className="flex justify-between text-gray-700">
          <span>ریٹ فی کلو (Rate/Kg):</span>
          <span>Rs. {ratePerKg}</span>
        </div>
      </div>

      {/* Total Box */}
      <div className="border-2 border-black p-1 my-1 text-center">
        <div className="font-bold text-[10px]">کل رقم (TOTAL BILL)</div>
        <div className="font-black text-sm">Rs. {totalBill}</div>
      </div>

      <div className="border-t-2 border-double border-black my-1" />
      <div className="text-center text-[9px]">
        <div className="font-urdu font-bold">شکریہ! دوبارہ تشریف لائیں۔</div>
        <div>Mandi Desktop Billing System</div>
      </div>
    </div>
  )
}
