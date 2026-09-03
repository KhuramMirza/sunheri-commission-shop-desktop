import React, { useState, useEffect, useMemo, useCallback } from 'react'
import ReceiptHeader from './components/ReceiptHeader'
import BillForm from './components/BillForm'
import LedgerTable from './components/LedgerTable'
import { generateReceiptHtml } from './utils/receiptTemplate'

const getTodayDateString = () => {
  const today = new Date()
  const year = today.getFullYear()
  const month = String(today.getMonth() + 1).padStart(2, '0')
  const day = String(today.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

export default function App() {
  // Form input state
  const [formData, setFormData] = useState({
    date: getTodayDateString(),
    serialNo: '1',
    clientName: '',
    saafiWeight: '',
    bardanaWeight: '',
    kandaWeight: '',
    ratePerMann: ''
  })

  // State for historical transactions list
  const [transactions, setTransactions] = useState([])
  const [loading, setLoading] = useState(true)
  const [printStatus, setPrintStatus] = useState(null) // null | 'printing' | 'printed' | 'failed'

  // Fetch Next Serial Number from database
  const fetchNextSerialNo = useCallback(async () => {
    try {
      if (window.api && window.api.getNextSerialNo) {
        const nextNo = await window.api.getNextSerialNo()
        setFormData((prev) => ({ ...prev, serialNo: String(nextNo) }))
      } else {
        // Fallback for browser testing
        const stored = JSON.parse(localStorage.getItem('mandi_bills') || '[]')
        const highest = stored.length > 0 ? Math.max(...stored.map((b) => b.serialNo || 0)) : 0
        setFormData((prev) => ({ ...prev, serialNo: String(highest + 1) }))
      }
    } catch (err) {
      console.error('Error fetching next serial number:', err)
    }
  }, [])

  // Fetch all saved bills from database
  const fetchBills = useCallback(async () => {
    setLoading(true)
    try {
      if (window.api && window.api.getBills) {
        const bills = await window.api.getBills()
        setTransactions(bills || [])
      } else {
        // Fallback for browser testing
        const stored = JSON.parse(localStorage.getItem('mandi_bills') || '[]')
        setTransactions(stored)
      }
    } catch (err) {
      console.error('Error loading bills from database:', err)
    } finally {
      setLoading(false)
    }
  }, [])

  // Initial load on mount
  useEffect(() => {
    fetchBills()
    fetchNextSerialNo()
  }, [fetchBills, fetchNextSerialNo])

  // Mathematical Calculations:
  // 1. Net Weight = saafi_weight - bardana_weight - kanda_weight
  // 2. Total Manns = Math.floor(Net Weight / 40)
  // 3. Remaining Kgs = Net Weight % 40
  // 4. Rate per Kg = rate_per_mann / 40
  // 5. Total Bill = (Total Manns * rate_per_mann) + (Remaining Kgs * Rate per Kg)
  const calculations = useMemo(() => {
    const saafi = parseFloat(formData.saafiWeight) || 0
    const bardana = parseFloat(formData.bardanaWeight) || 0
    const kanda = parseFloat(formData.kandaWeight) || 0
    const rate = parseFloat(formData.ratePerMann) || 0

    const netWeight = Math.max(0, saafi - bardana - kanda)
    const totalManns = Math.floor(netWeight / 40)
    const remainingKgs = Math.round((netWeight % 40) * 100) / 100
    const ratePerKg = rate > 0 ? rate / 40 : 0
    const totalBill = (totalManns * rate) + (remainingKgs * ratePerKg)

    return {
      netWeight,
      totalManns,
      remainingKgs,
      ratePerKg,
      totalBill
    }
  }, [formData.saafiWeight, formData.bardanaWeight, formData.kandaWeight, formData.ratePerMann])

  // Silent Print Execution Handler
  const handlePrintReceipt = useCallback(async (bill) => {
    const html = generateReceiptHtml(bill)
    setPrintStatus('printing')

    try {
      if (window.api && window.api.printReceipt) {
        const res = await window.api.printReceipt(html)
        if (res && res.success === false) {
          console.warn('Printer silent call returned status:', res.error)
          setPrintStatus('failed')
        } else {
          setPrintStatus('printed')
        }
      } else {
        // Fallback for browser (opens native print window without crashing)
        const printWin = window.open('', '_blank', 'width=380,height=600')
        if (printWin) {
          printWin.document.write(html)
          printWin.document.close()
          printWin.focus()
          printWin.print()
          printWin.close()
        }
        setPrintStatus('printed')
      }
    } catch (err) {
      console.error('Silent print failed:', err)
      setPrintStatus('failed')
    } finally {
      setTimeout(() => setPrintStatus(null), 3500)
    }
  }, [])

  // Handle Input Changes
  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }))
  }

  // Clear Form (Resets manual fields, keeps date and current serialNo)
  const handleClearForm = () => {
    setFormData((prev) => ({
      date: prev.date || getTodayDateString(),
      serialNo: prev.serialNo,
      clientName: '',
      saafiWeight: '',
      bardanaWeight: '',
      kandaWeight: '',
      ratePerMann: ''
    }))
  }

  // Generate & Print / Save to NeDB Database Handler
  const handleGenerateAndPrint = async () => {
    const saafi = parseFloat(formData.saafiWeight)
    const rate = parseFloat(formData.ratePerMann)

    if (isNaN(saafi) || saafi <= 0) {
      alert('براہ کرم صافی وزن درج کریں۔ (Please enter valid Saafi Gross Weight)')
      return
    }

    if (isNaN(rate) || rate <= 0) {
      alert('براہ کرم ریٹ فی من درج کریں۔ (Please enter valid Rate per Mann)')
      return
    }

    const billRecord = {
      serialNo: parseInt(formData.serialNo, 10) || 1,
      date: formData.date || getTodayDateString(),
      clientName: formData.clientName ? formData.clientName.trim() : 'Cash Client (نقد گاہک)',
      saafiWeight: parseFloat(formData.saafiWeight) || 0,
      bardanaWeight: parseFloat(formData.bardanaWeight) || 0,
      kandaWeight: parseFloat(formData.kandaWeight) || 0,
      netWeight: calculations.netWeight,
      totalManns: calculations.totalManns,
      remainingKgs: calculations.remainingKgs,
      ratePerMann: parseFloat(formData.ratePerMann) || 0,
      ratePerKg: calculations.ratePerKg,
      totalBill: calculations.totalBill
    }

    try {
      let savedDoc = null
      if (window.api && window.api.saveBill) {
        savedDoc = await window.api.saveBill(billRecord)
      } else {
        // Fallback for browser environment
        const stored = JSON.parse(localStorage.getItem('mandi_bills') || '[]')
        savedDoc = { ...billRecord, _id: String(Date.now()), createdAt: new Date().toISOString() }
        stored.unshift(savedDoc)
        localStorage.setItem('mandi_bills', JSON.stringify(stored))
      }

      // Trigger Silent Thermal Print to system default printer
      await handlePrintReceipt(savedDoc || billRecord)

      // Automatically re-fetch database records and update next serial number
      await fetchBills()
      await fetchNextSerialNo()

      // Reset manual fields
      setFormData((prev) => ({
        ...prev,
        clientName: '',
        saafiWeight: '',
        bardanaWeight: '',
        kandaWeight: '',
        ratePerMann: ''
      }))
    } catch (err) {
      console.error('Failed to process and print bill:', err)
      alert('خرابی: بل محفوظ یا پرنٹ نہیں ہو سکا۔ (Error processing bill)')
    }
  }

  // Delete transaction handler
  const handleDeleteTransaction = async (id) => {
    if (!window.confirm('کیا آپ واقعی یہ بل حذف کرنا چاہتے ہیں؟ (Are you sure you want to delete this bill?)')) {
      return
    }

    try {
      if (window.api && window.api.deleteBill) {
        await window.api.deleteBill(id)
      } else {
        const stored = JSON.parse(localStorage.getItem('mandi_bills') || '[]')
        const updated = stored.filter((b) => (b._id || b.id) !== id)
        localStorage.setItem('mandi_bills', JSON.stringify(updated))
      }

      await fetchBills()
      await fetchNextSerialNo()
    } catch (err) {
      console.error('Failed to delete transaction:', err)
    }
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col p-3 md:p-4 gap-3 md:gap-4 overflow-y-auto relative">
      {/* Silent Print Toast Notification */}
      {printStatus && (
        <div className="fixed top-4 right-4 z-50 animate-bounce">
          <div
            className={`px-4 py-2.5 rounded-xl shadow-2xl border flex items-center gap-2 text-xs font-bold ${
              printStatus === 'printing'
                ? 'bg-amber-500/90 text-slate-950 border-amber-300'
                : printStatus === 'printed'
                ? 'bg-emerald-600 text-white border-emerald-400'
                : 'bg-rose-600 text-white border-rose-400'
            }`}
          >
            {printStatus === 'printing' && (
              <>
                <span className="w-2.5 h-2.5 rounded-full bg-slate-950 animate-ping" />
                <span>Printing receipt to default printer... (پرنٹ جاری ہے)</span>
              </>
            )}
            {printStatus === 'printed' && (
              <>
                <span>✓</span>
                <span>Receipt sent silently to printer! (رسید کامیابی سے پرنٹ ہو گئی)</span>
              </>
            )}
            {printStatus === 'failed' && (
              <>
                <span>⚠</span>
                <span>Printer offline or not found. Check default printer settings.</span>
              </>
            )}
          </div>
        </div>
      )}

      {/* 1. Header Section: Shop Details & Receipt Style Branding */}
      <ReceiptHeader />

      {/* 2. Middle Form Section: Bill Inputs, Auto-Math calculations & Action Buttons */}
      <BillForm
        formData={formData}
        calculations={calculations}
        onInputChange={handleInputChange}
        onClearForm={handleClearForm}
        onGenerateAndPrint={handleGenerateAndPrint}
      />

      {/* 3. Bottom Section: Daily Transaction Ledger connected to NeDB with reprint capability */}
      <LedgerTable
        transactions={transactions}
        loading={loading}
        onDeleteTransaction={handleDeleteTransaction}
        onReprintTransaction={handlePrintReceipt}
      />
    </div>
  )
}
