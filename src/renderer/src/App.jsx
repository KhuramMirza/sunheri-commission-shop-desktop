import React, { useState, useEffect, useMemo, useCallback } from 'react'
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
  const [loading, setLoading] = useState(true)

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
      if (window.api && window.api.saveBill) {
        await window.api.saveBill(billRecord)
      } else {
        // Fallback for browser environment
        const stored = JSON.parse(localStorage.getItem('mandi_bills') || '[]')
        const newDoc = { ...billRecord, _id: String(Date.now()), createdAt: new Date().toISOString() }
        stored.unshift(newDoc)
        localStorage.setItem('mandi_bills', JSON.stringify(stored))
      }

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
      console.error('Failed to save bill to database:', err)
      alert('خرابی: بل ڈیٹا بیس میں محفوظ نہیں ہو سکا۔ (Error saving bill to database)')
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

      {/* 3. Bottom Section: Daily Transaction Ledger connected to NeDB */}
      <LedgerTable
        transactions={transactions}
        loading={loading}
        onDeleteTransaction={handleDeleteTransaction}
      />
    </div>
  )
}
