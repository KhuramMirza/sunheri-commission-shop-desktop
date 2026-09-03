import React, { useState, useMemo } from 'react'
import ReceiptHeader from './components/ReceiptHeader'
import BillForm from './components/BillForm'
import LedgerTable from './components/LedgerTable'

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

  // Mathematical Calculations according to Mandi Commission Shop domain rules:
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
    // Handle floating-point precision cleanly up to 2 decimals
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

  // Handle Input Changes
  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }))
  }

  // Clear Form (Resets manual fields, keeps date and serialNo)
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

  // Generate & Print handler
  const handleGenerateAndPrint = () => {
    if (!formData.clientName && !formData.saafiWeight && !formData.ratePerMann) {
      alert('براہ کرم گاہک کا نام اور وزن درج کریں۔ (Please enter client details and weight)')
      return
    }

    const newTransaction = {
      id: Date.now(),
      date: formData.date,
      serialNo: formData.serialNo,
      clientName: formData.clientName || 'Cash Client (نقد گاہک)',
      saafiWeight: parseFloat(formData.saafiWeight) || 0,
      bardanaWeight: parseFloat(formData.bardanaWeight) || 0,
      kandaWeight: parseFloat(formData.kandaWeight) || 0,
      netWeight: calculations.netWeight,
      totalManns: calculations.totalManns,
      remainingKgs: calculations.remainingKgs,
      ratePerMann: parseFloat(formData.ratePerMann) || 0,
      totalBill: calculations.totalBill
    }

    setTransactions((prev) => [newTransaction, ...prev])

    // Update serial number for next transaction
    setFormData((prev) => ({
      ...prev,
      serialNo: String(parseInt(prev.serialNo || '1', 10) + 1),
      clientName: '',
      saafiWeight: '',
      bardanaWeight: '',
      kandaWeight: '',
      ratePerMann: ''
    }))
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col p-3 md:p-4 gap-3 md:gap-4 overflow-y-auto">
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

      {/* 3. Bottom Section: Daily Transaction Ledger */}
      <LedgerTable transactions={transactions} />
    </div>
  )
}
