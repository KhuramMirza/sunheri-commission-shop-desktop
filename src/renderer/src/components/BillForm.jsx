import React from 'react'
import {
  Calendar,
  Hash,
  User,
  Scale,
  DollarSign,
  Printer,
  RotateCcw,
  TrendingUp,
  Package,
  Layers,
  Eye
} from 'lucide-react'

export default function BillForm({
  formData,
  calculations,
  onInputChange,
  onClearForm,
  onGenerateBill,
  onGenerateAndPrint,
  onPreviewReceipt
}) {
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl shadow-xl p-5 md:p-6 backdrop-blur-md flex flex-col gap-5">
      {/* Form Title */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-3.5">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400">
            <Scale className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-bold text-white uppercase tracking-wider">
              Bill Generation Form
            </h2>
            <span className="text-sm text-slate-300 font-urdu leading-relaxed">
              بل بنانے اور وزن کا حساب لگانے کا فارم
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2 text-sm text-slate-300">
          <span className="px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-800 font-mono font-bold text-amber-400">
            40.00 Kg = 1 Mann (من)
          </span>
        </div>
      </div>

      {/* Inputs Row 1 */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-7 gap-3.5">
        {/* Date Field */}
        <div className="space-y-1.5 lg:col-span-1">
          <label className="text-xs font-bold text-slate-200 flex items-center justify-between">
            <span className="flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-amber-400" /> Date
            </span>
            <span className="font-urdu text-xs text-slate-400">تاریخ</span>
          </label>
          <input
            type="date"
            name="date"
            value={formData.date}
            onChange={onInputChange}
            className="w-full bg-slate-950 border border-slate-700 focus:border-amber-400 focus:ring-2 focus:ring-amber-400/20 rounded-xl px-3 py-2.5 text-sm font-mono text-slate-100 outline-none transition"
          />
        </div>

        {/* Serial Number Field */}
        <div className="space-y-1.5 lg:col-span-1">
          <label className="text-xs font-bold text-slate-200 flex items-center justify-between">
            <span className="flex items-center gap-1.5">
              <Hash className="w-3.5 h-3.5 text-amber-400" /> S.No
            </span>
            <span className="font-urdu text-xs text-slate-400">سیریل نمبر</span>
          </label>
          <input
            type="text"
            name="serialNo"
            value={formData.serialNo}
            readOnly
            className="w-full bg-slate-950/90 border border-slate-800 text-amber-400 font-black font-mono rounded-xl px-3 py-2.5 text-sm outline-none cursor-not-allowed text-center"
          />
        </div>

        {/* Client Name Field */}
        <div className="space-y-1.5 sm:col-span-2 lg:col-span-2">
          <label className="text-xs font-bold text-slate-200 flex items-center justify-between">
            <span className="flex items-center gap-1.5">
              <User className="w-3.5 h-3.5 text-amber-400" /> Client Name
            </span>
            <span className="font-urdu text-xs text-slate-400">گاہک / زمیندار کا نام</span>
          </label>
          <input
            type="text"
            name="clientName"
            value={formData.clientName}
            onChange={onInputChange}
            placeholder="Client Name (گاہک کا نام)"
            className="w-full bg-slate-950 border border-slate-700 focus:border-amber-400 focus:ring-2 focus:ring-amber-400/20 rounded-xl px-3.5 py-2.5 text-base font-bold text-amber-200 placeholder:text-slate-500 placeholder:font-normal outline-none transition"
          />
        </div>

        {/* Saafi Weight (Gross Weight) */}
        <div className="space-y-1.5 lg:col-span-1">
          <label className="text-xs font-bold text-slate-200 flex items-center justify-between">
            <span className="flex items-center gap-1.5">
              <Scale className="w-3.5 h-3.5 text-amber-400" /> Saafi (Kg)
            </span>
            <span className="font-urdu text-xs text-slate-400">صافی وزن</span>
          </label>
          <input
            type="number"
            name="saafiWeight"
            min="0"
            step="any"
            value={formData.saafiWeight}
            onChange={onInputChange}
            placeholder="0.00"
            className="w-full bg-slate-950 border border-slate-700 focus:border-amber-400 focus:ring-2 focus:ring-amber-400/20 rounded-xl px-3 py-2.5 text-base font-mono font-black text-amber-300 placeholder:text-slate-600 outline-none transition"
          />
        </div>

        {/* Bardana Weight (Bag Weight) */}
        <div className="space-y-1.5 lg:col-span-1">
          <label className="text-xs font-bold text-slate-200 flex items-center justify-between">
            <span className="flex items-center gap-1.5">
              <Package className="w-3.5 h-3.5 text-amber-400" /> Bardana (Kg)
            </span>
            <span className="font-urdu text-xs text-slate-400">باردانہ کٹوتی</span>
          </label>
          <input
            type="number"
            name="bardanaWeight"
            min="0"
            step="any"
            value={formData.bardanaWeight}
            onChange={onInputChange}
            placeholder="0.00"
            className="w-full bg-slate-950 border border-slate-700 focus:border-amber-400 focus:ring-2 focus:ring-amber-400/20 rounded-xl px-3 py-2.5 text-base font-mono font-bold text-rose-300 placeholder:text-slate-600 outline-none transition"
          />
        </div>

        {/* Kanda Weight (Machine Variation) */}
        <div className="space-y-1.5 lg:col-span-1">
          <label className="text-xs font-bold text-slate-200 flex items-center justify-between">
            <span className="flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5 text-amber-400" /> Kanda (Kg)
            </span>
            <span className="font-urdu text-xs text-slate-400">کنڈہ کٹوتی</span>
          </label>
          <input
            type="number"
            name="kandaWeight"
            min="0"
            step="any"
            value={formData.kandaWeight}
            onChange={onInputChange}
            placeholder="0.00"
            className="w-full bg-slate-950 border border-slate-700 focus:border-amber-400 focus:ring-2 focus:ring-amber-400/20 rounded-xl px-3 py-2.5 text-base font-mono font-bold text-rose-300 placeholder:text-slate-600 outline-none transition"
          />
        </div>
      </div>

      {/* Row 2: Rate and Live Real-time Calculation Cards */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-3.5 items-stretch">
        {/* Rate Input Card */}
        <div className="md:col-span-3 bg-slate-950 border-2 border-amber-500/40 rounded-2xl p-4 flex flex-col justify-between shadow-md">
          <label className="text-xs font-bold text-slate-200 flex items-center justify-between mb-2">
            <span className="flex items-center gap-1.5 text-amber-400">
              <DollarSign className="w-4 h-4" /> Rate / Mann (Rs)
            </span>
            <span className="font-urdu text-xs text-amber-300">ریٹ فی من (روپیہ)</span>
          </label>
          <div className="relative">
            <input
              type="number"
              name="ratePerMann"
              min="0"
              step="any"
              value={formData.ratePerMann}
              onChange={onInputChange}
              placeholder="0.00"
              className="w-full bg-slate-900 border border-amber-500/50 focus:border-amber-400 focus:ring-2 focus:ring-amber-400/20 rounded-xl px-3.5 py-2.5 text-lg font-mono font-black text-amber-300 placeholder:text-slate-600 outline-none transition"
            />
            <span className="absolute right-3.5 top-3 text-xs text-slate-400 font-bold font-mono">
              PKR
            </span>
          </div>
          <div className="text-xs text-slate-300 mt-2.5 flex justify-between font-mono">
            <span>Rate / 1 Kg:</span>
            <span className="text-amber-300 font-bold">
              Rs. {calculations.ratePerKg.toFixed(2)}
            </span>
          </div>
        </div>

        {/* Real-time Big Metric Cards */}
        <div className="md:col-span-9 grid grid-cols-2 sm:grid-cols-4 gap-3">
          {/* Net Weight */}
          <div className="bg-slate-950 border border-slate-800 rounded-2xl p-3.5 flex flex-col justify-between hover:border-slate-700 transition">
            <div className="flex items-center justify-between text-slate-300 text-xs">
              <span className="font-bold">Net Weight</span>
              <span className="font-urdu text-xs text-slate-400">خالص وزن</span>
            </div>
            <div className="my-1.5">
              <span className="text-2xl lg:text-3xl font-black font-mono text-cyan-300">
                {calculations.netWeight.toLocaleString('en-US', {
                  minimumFractionDigits: 0,
                  maximumFractionDigits: 2
                })}
              </span>
              <span className="text-sm text-slate-400 ml-1.5 font-bold">Kg</span>
            </div>
            <div className="text-[11px] text-slate-400 font-mono truncate">
              صافی - (باردانہ + کنڈہ)
            </div>
          </div>

          {/* Total Manns */}
          <div className="bg-slate-950 border border-slate-800 rounded-2xl p-3.5 flex flex-col justify-between hover:border-slate-700 transition">
            <div className="flex items-center justify-between text-slate-300 text-xs">
              <span className="font-bold">Total Manns</span>
              <span className="font-urdu text-xs text-slate-400">کل من</span>
            </div>
            <div className="my-1.5">
              <span className="text-2xl lg:text-3xl font-black font-mono text-amber-400">
                {calculations.totalManns}
              </span>
              <span className="text-sm text-slate-300 ml-1.5 font-urdu">من</span>
            </div>
            <div className="text-[11px] text-slate-400 font-mono">
              Net Wt ÷ 40
            </div>
          </div>

          {/* Remaining Kgs */}
          <div className="bg-slate-950 border border-slate-800 rounded-2xl p-3.5 flex flex-col justify-between hover:border-slate-700 transition">
            <div className="flex items-center justify-between text-slate-300 text-xs">
              <span className="font-bold">Remaining Kgs</span>
              <span className="font-urdu text-xs text-slate-400">بقیہ کلوگرام</span>
            </div>
            <div className="my-1.5">
              <span className="text-2xl lg:text-3xl font-black font-mono text-amber-300">
                {calculations.remainingKgs.toLocaleString('en-US', {
                  minimumFractionDigits: 0,
                  maximumFractionDigits: 2
                })}
              </span>
              <span className="text-sm text-slate-400 ml-1.5 font-bold">Kg</span>
            </div>
            <div className="text-[11px] text-slate-400 font-mono">
              Net Wt % 40
            </div>
          </div>

          {/* Total Bill Card */}
          <div className="bg-gradient-to-br from-amber-500/20 via-yellow-500/10 to-amber-950/40 border-2 border-amber-500/60 rounded-2xl p-3.5 flex flex-col justify-between shadow-lg">
            <div className="flex items-center justify-between text-amber-200 text-xs">
              <span className="font-bold flex items-center gap-1.5">
                <TrendingUp className="w-4 h-4 text-amber-400" /> Total Bill
              </span>
              <span className="font-urdu font-bold text-amber-300 text-xs">صافی رقم (بعد از مسجد فنڈ)</span>
            </div>
            <div className="my-1">
              <div className="text-xl sm:text-2xl lg:text-3xl font-black font-mono text-emerald-400 tracking-tight">
                <span className="text-xs text-slate-300 font-bold mr-1">Rs.</span>
                {calculations.totalBill.toLocaleString('en-US', {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2
                })}
              </div>
            </div>
            <div className="text-[11px] text-amber-200/90 font-mono flex items-center justify-between pt-1 border-t border-amber-500/20">
              <span className="text-slate-300">
                کل: Rs.{Math.round(calculations.grossBill || calculations.totalBill).toLocaleString()}
              </span>
              <span className="text-rose-300 font-bold font-urdu">
                مسجد فنڈ: -{calculations.masjidFund || 0}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row items-center justify-end gap-3.5 pt-3 border-t border-slate-800">
        <button
          type="button"
          onClick={(e) => {
            e.preventDefault()
            onClearForm(e)
          }}
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl border border-slate-700 bg-slate-800 hover:bg-slate-700 hover:text-white text-slate-200 font-bold text-xs tracking-wide transition shadow-sm active:scale-95 cursor-pointer"
        >
          <RotateCcw className="w-4 h-4 text-slate-400" />
          <span>Clear Form</span>
          <span className="font-urdu text-xs text-slate-300 ml-1">(فارم صاف کریں)</span>
        </button>

        {onPreviewReceipt && (
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault()
              onPreviewReceipt()
            }}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl border border-cyan-500/40 bg-cyan-950/60 hover:bg-cyan-900/60 text-cyan-300 font-bold text-xs tracking-wide transition shadow-sm active:scale-95 cursor-pointer"
          >
            <Eye className="w-4 h-4 text-cyan-400" />
            <span>Preview Receipt</span>
            <span className="font-urdu text-xs text-cyan-200 ml-1">(رسید دیکھیں)</span>
          </button>
        )}

        <button
          type="button"
          onClick={(e) => {
            e.preventDefault()
            if (onGenerateBill) {
              onGenerateBill(e)
            } else if (onGenerateAndPrint) {
              onGenerateAndPrint(e)
            }
          }}
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3 rounded-xl bg-gradient-to-r from-amber-500 via-amber-600 to-yellow-600 hover:from-amber-400 hover:to-yellow-500 text-slate-950 font-black text-sm tracking-wide transition shadow-lg hover:shadow-amber-500/20 active:scale-95 cursor-pointer"
        >
          <Scale className="w-4 h-4 text-slate-950" />
          <span>Generate Bill</span>
          <span className="font-urdu text-sm font-bold text-slate-900 ml-1.5">
            (بل بنائیں)
          </span>
        </button>
      </div>
    </div>
  )
}
