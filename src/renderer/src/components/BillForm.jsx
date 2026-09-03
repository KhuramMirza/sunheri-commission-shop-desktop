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
  Layers
} from 'lucide-react'

export default function BillForm({
  formData,
  calculations,
  onInputChange,
  onClearForm,
  onGenerateAndPrint
}) {
  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-xl shadow-xl p-4 md:p-5 backdrop-blur-md flex flex-col gap-4">
      {/* Form Section Title */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-3">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-amber-500/10 text-amber-400">
            <Scale className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-white uppercase tracking-wider">
              Bill Generation Form
            </h2>
            <span className="text-xs text-slate-400 font-urdu">
              بل بنانے اور وزن کا حساب لگانے کا فارم
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs text-slate-400">
          <span className="px-2 py-1 rounded bg-slate-800 border border-slate-700 font-mono">
            40 Kg = 1 Mann (من)
          </span>
        </div>
      </div>

      {/* Inputs Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-7 gap-3">
        {/* Date Field */}
        <div className="space-y-1 lg:col-span-1">
          <label className="text-[11px] font-semibold text-slate-300 flex items-center justify-between">
            <span className="flex items-center gap-1">
              <Calendar className="w-3 h-3 text-amber-400" /> Date
            </span>
            <span className="font-urdu text-[11px] text-slate-400">تاریخ</span>
          </label>
          <input
            type="date"
            name="date"
            value={formData.date}
            onChange={onInputChange}
            className="w-full bg-slate-950 border border-slate-700 focus:border-amber-500 focus:ring-1 focus:ring-amber-500 rounded-lg px-2.5 py-2 text-xs font-mono text-slate-200 outline-none transition"
          />
        </div>

        {/* Serial Number Field */}
        <div className="space-y-1 lg:col-span-1">
          <label className="text-[11px] font-semibold text-slate-300 flex items-center justify-between">
            <span className="flex items-center gap-1">
              <Hash className="w-3 h-3 text-amber-400" /> S.No
            </span>
            <span className="font-urdu text-[11px] text-slate-400">سیریل نمبر</span>
          </label>
          <input
            type="text"
            name="serialNo"
            value={formData.serialNo}
            readOnly
            className="w-full bg-slate-950/80 border border-slate-800 text-amber-400 font-bold font-mono rounded-lg px-2.5 py-2 text-xs outline-none cursor-not-allowed text-center"
          />
        </div>

        {/* Client Name Field */}
        <div className="space-y-1 sm:col-span-2 lg:col-span-2">
          <label className="text-[11px] font-semibold text-slate-300 flex items-center justify-between">
            <span className="flex items-center gap-1">
              <User className="w-3 h-3 text-amber-400" /> Client Name
            </span>
            <span className="font-urdu text-[11px] text-slate-400">گاہک / زمیندار کا نام</span>
          </label>
          <input
            type="text"
            name="clientName"
            value={formData.clientName}
            onChange={onInputChange}
            placeholder="Enter client name (گاہک کا نام درج کریں)"
            className="w-full bg-slate-950 border border-slate-700 focus:border-amber-500 focus:ring-1 focus:ring-amber-500 rounded-lg px-3 py-2 text-xs text-slate-100 placeholder:text-slate-600 outline-none transition"
          />
        </div>

        {/* Saafi Weight (Gross Weight) */}
        <div className="space-y-1 lg:col-span-1">
          <label className="text-[11px] font-semibold text-slate-300 flex items-center justify-between">
            <span className="flex items-center gap-1">
              <Scale className="w-3 h-3 text-amber-400" /> Saafi (Kg)
            </span>
            <span className="font-urdu text-[11px] text-slate-400">صافی وزن</span>
          </label>
          <input
            type="number"
            name="saafiWeight"
            min="0"
            step="any"
            value={formData.saafiWeight}
            onChange={onInputChange}
            placeholder="0.00"
            className="w-full bg-slate-950 border border-slate-700 focus:border-amber-500 focus:ring-1 focus:ring-amber-500 rounded-lg px-2.5 py-2 text-xs font-mono font-bold text-amber-300 placeholder:text-slate-600 outline-none transition"
          />
        </div>

        {/* Bardana Weight (Bag Weight) */}
        <div className="space-y-1 lg:col-span-1">
          <label className="text-[11px] font-semibold text-slate-300 flex items-center justify-between">
            <span className="flex items-center gap-1">
              <Package className="w-3 h-3 text-amber-400" /> Bardana (Kg)
            </span>
            <span className="font-urdu text-[11px] text-slate-400">باردانہ کٹوتی</span>
          </label>
          <input
            type="number"
            name="bardanaWeight"
            min="0"
            step="any"
            value={formData.bardanaWeight}
            onChange={onInputChange}
            placeholder="0.00"
            className="w-full bg-slate-950 border border-slate-700 focus:border-amber-500 focus:ring-1 focus:ring-amber-500 rounded-lg px-2.5 py-2 text-xs font-mono font-bold text-rose-300 placeholder:text-slate-600 outline-none transition"
          />
        </div>

        {/* Kanda Weight (Machine Variation) */}
        <div className="space-y-1 lg:col-span-1">
          <label className="text-[11px] font-semibold text-slate-300 flex items-center justify-between">
            <span className="flex items-center gap-1">
              <Layers className="w-3 h-3 text-amber-400" /> Kanda (Kg)
            </span>
            <span className="font-urdu text-[11px] text-slate-400">کنڈہ کٹوتی</span>
          </label>
          <input
            type="number"
            name="kandaWeight"
            min="0"
            step="any"
            value={formData.kandaWeight}
            onChange={onInputChange}
            placeholder="0.00"
            className="w-full bg-slate-950 border border-slate-700 focus:border-amber-500 focus:ring-1 focus:ring-amber-500 rounded-lg px-2.5 py-2 text-xs font-mono font-bold text-rose-300 placeholder:text-slate-600 outline-none transition"
          />
        </div>
      </div>

      {/* Second Row: Rate per Mann & Real-Time Calculation Cards */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-stretch pt-1">
        {/* Rate Input Card */}
        <div className="md:col-span-3 bg-slate-950/90 border border-amber-500/30 rounded-xl p-3.5 flex flex-col justify-between">
          <label className="text-xs font-semibold text-slate-200 flex items-center justify-between mb-1.5">
            <span className="flex items-center gap-1 text-amber-400 font-bold">
              <DollarSign className="w-4 h-4" /> Rate / Mann (Rs)
            </span>
            <span className="font-urdu text-xs text-amber-200">ریٹ فی من (روپیہ)</span>
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
              className="w-full bg-slate-900 border-2 border-amber-500/50 focus:border-amber-400 focus:ring-2 focus:ring-amber-400/20 rounded-lg px-3 py-2 text-base font-mono font-black text-amber-300 placeholder:text-slate-600 outline-none transition"
            />
            <span className="absolute right-3 top-2.5 text-xs text-slate-400 font-bold font-mono">
              PKR
            </span>
          </div>
          <div className="text-[11px] text-slate-400 mt-2 flex justify-between font-mono">
            <span>Rate/Kg:</span>
            <span className="text-slate-200 font-semibold">
              Rs. {calculations.ratePerKg.toFixed(2)}
            </span>
          </div>
        </div>

        {/* Real-time Calculation Display Summary Grid */}
        <div className="md:col-span-9 grid grid-cols-2 sm:grid-cols-4 gap-2.5">
          {/* Net Weight */}
          <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-3 flex flex-col justify-between hover:border-slate-700 transition">
            <div className="flex items-center justify-between text-slate-400 text-xs">
              <span className="font-semibold">Net Weight</span>
              <span className="font-urdu text-[11px]">خالص وزن</span>
            </div>
            <div className="my-1">
              <span className="text-xl lg:text-2xl font-black font-mono text-cyan-400">
                {calculations.netWeight.toLocaleString('en-US', {
                  minimumFractionDigits: 0,
                  maximumFractionDigits: 2
                })}
              </span>
              <span className="text-xs text-slate-400 ml-1 font-semibold">Kg</span>
            </div>
            <div className="text-[10px] text-slate-500 font-mono truncate">
              Saafi - (Bardana + Kanda)
            </div>
          </div>

          {/* Total Manns */}
          <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-3 flex flex-col justify-between hover:border-slate-700 transition">
            <div className="flex items-center justify-between text-slate-400 text-xs">
              <span className="font-semibold">Total Manns</span>
              <span className="font-urdu text-[11px]">کل من</span>
            </div>
            <div className="my-1">
              <span className="text-xl lg:text-2xl font-black font-mono text-amber-400">
                {calculations.totalManns}
              </span>
              <span className="text-xs text-slate-400 ml-1 font-urdu">من</span>
            </div>
            <div className="text-[10px] text-slate-500 font-mono">
              Net Wt ÷ 40
            </div>
          </div>

          {/* Remaining Kgs */}
          <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-3 flex flex-col justify-between hover:border-slate-700 transition">
            <div className="flex items-center justify-between text-slate-400 text-xs">
              <span className="font-semibold">Remaining Kgs</span>
              <span className="font-urdu text-[11px]">بقیہ کلوگرام</span>
            </div>
            <div className="my-1">
              <span className="text-xl lg:text-2xl font-black font-mono text-amber-300">
                {calculations.remainingKgs.toLocaleString('en-US', {
                  minimumFractionDigits: 0,
                  maximumFractionDigits: 2
                })}
              </span>
              <span className="text-xs text-slate-400 ml-1 font-semibold">Kg</span>
            </div>
            <div className="text-[10px] text-slate-500 font-mono">
              Net Wt % 40
            </div>
          </div>

          {/* Total Bill Calculation Card */}
          <div className="bg-gradient-to-br from-amber-500/20 via-yellow-500/10 to-amber-950/40 border-2 border-amber-500/50 rounded-xl p-3 flex flex-col justify-between shadow-lg">
            <div className="flex items-center justify-between text-amber-200 text-xs">
              <span className="font-bold flex items-center gap-1">
                <TrendingUp className="w-3.5 h-3.5 text-amber-400" /> Total Bill
              </span>
              <span className="font-urdu font-bold text-amber-300 text-[11px]">کل رقم</span>
            </div>
            <div className="my-1">
              <div className="text-lg sm:text-xl lg:text-2xl font-black font-mono text-emerald-400 tracking-tight">
                <span className="text-xs text-slate-300 font-semibold mr-1">Rs.</span>
                {calculations.totalBill.toLocaleString('en-US', {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2
                })}
              </div>
            </div>
            <div className="text-[10px] text-amber-200/70 font-mono truncate">
              {calculations.totalManns}M {calculations.remainingKgs}Kg @ Rs.{formData.ratePerMann || 0}
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row items-center justify-end gap-3 pt-2 border-t border-slate-800">
        <button
          type="button"
          onClick={onClearForm}
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl border border-slate-700 bg-slate-800/80 hover:bg-slate-700 hover:text-white text-slate-300 font-semibold text-xs tracking-wide transition-all shadow-sm active:scale-95 cursor-pointer"
        >
          <RotateCcw className="w-4 h-4 text-slate-400" />
          <span>Clear Form</span>
          <span className="font-urdu text-[11px] text-slate-400 ml-1">(فارم صاف کریں)</span>
        </button>

        <button
          type="button"
          onClick={onGenerateAndPrint}
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 via-amber-600 to-yellow-600 hover:from-amber-400 hover:to-yellow-500 text-slate-950 font-black text-xs tracking-wide transition-all shadow-lg hover:shadow-amber-500/20 active:scale-95 cursor-pointer"
        >
          <Printer className="w-4 h-4" />
          <span>Generate & Print Bill</span>
          <span className="font-urdu text-xs font-bold text-slate-900 ml-1">
            (بل بنائیں اور پرنٹ کریں)
          </span>
        </button>
      </div>
    </div>
  )
}
