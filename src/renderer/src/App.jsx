import React, { useState, useEffect, useMemo, useCallback } from 'react'
import ReceiptHeader from './components/ReceiptHeader'
import BillForm from './components/BillForm'
import LedgerTable from './components/LedgerTable'
import ReceiptPreviewModal from './components/ReceiptPreviewModal'
import Activation from './components/Activation'
import { generateReceiptHtml } from './utils/receiptTemplate'

const getTodayDateString = () => {
  const today = new Date()
  const year = today.getFullYear()
  const month = String(today.getMonth() + 1).padStart(2, '0')
  const day = String(today.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

export default function App() {
  // Software Activation Status: null (checking) | true (activated) | false (unactivated)
  const [isActivated, setIsActivated] = useState(null)

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
  const [ledgerResetTrigger, setLedgerResetTrigger] = useState(0)

  // Receipt Preview Modal State
  const [previewModalOpen, setPreviewModalOpen] = useState(false)
  const [previewBill, setPreviewBill] = useState(null)

  // Check Activation Status on Mount
  useEffect(() => {
    // Purge any stale mock/demo keys from localStorage
    try {
      localStorage.removeItem('mandi_license')
    } catch (_) {}

    async function checkActivation() {
      try {
        if (window.api && window.api.getLicenseStatus) {
          const status = await window.api.getLicenseStatus()
          setIsActivated(Boolean(status && status.isActivated))
        } else {
          setIsActivated(false)
        }
      } catch (err) {
        console.error('Error verifying activation status:', err)
        setIsActivated(false)
      }
    }

    checkActivation()
  }, [])

  // Fetch Next Serial Number from database
  const fetchNextSerialNo = useCallback(async () => {
    try {
      if (window.api && window.api.getNextSerialNo) {
        const nextNo = await window.api.getNextSerialNo()
        setFormData((prev) => ({ ...prev, serialNo: String(nextNo) }))
      } else {
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
        const stored = JSON.parse(localStorage.getItem('mandi_bills') || '[]')
        setTransactions(stored)
      }
    } catch (err) {
      console.error('Error loading bills from database:', err)
    } finally {
      setLoading(false)
    }
  }, [])

  // Initial load on mount once activated
  useEffect(() => {
    if (isActivated) {
      fetchBills()
      fetchNextSerialNo()
    }
  }, [isActivated, fetchBills, fetchNextSerialNo])

  // Mathematical Calculations
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

  // Open Preview Modal for current form data
  const handlePreviewCurrentForm = () => {
    const billPreview = {
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

    setPreviewBill(billPreview)
    setPreviewModalOpen(true)
  }

  // Open Preview Modal for a specific saved ledger transaction
  const handlePreviewTransaction = (transaction) => {
    setPreviewBill(transaction)
    setPreviewModalOpen(true)
  }

  // Handle Input Changes
  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }))
  }

  // Clear Form
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

  // Generate Bill & Save to NeDB Database Handler
  const handleGenerateBill = async (e) => {
    if (e && typeof e.preventDefault === 'function') {
      e.preventDefault()
    }

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
        const stored = JSON.parse(localStorage.getItem('mandi_bills') || '[]')
        savedDoc = { ...billRecord, _id: String(Date.now()), createdAt: new Date().toISOString() }
        stored.unshift(savedDoc)
        localStorage.setItem('mandi_bills', JSON.stringify(stored))
      }

      // Automatically re-fetch database records and update next serial number
      await fetchBills()
      await fetchNextSerialNo()

      // Reset ledger pagination back to Page 1 so newly saved entry is immediately visible at the top
      setLedgerResetTrigger((prev) => prev + 1)

      // Reset manual fields
      setFormData((prev) => ({
        ...prev,
        clientName: '',
        saafiWeight: '',
        bardanaWeight: '',
        kandaWeight: '',
        ratePerMann: ''
      }))

      // Automatically open receipt preview modal so user can click Print
      const currentSavedBill = savedDoc || billRecord
      setPreviewBill(currentSavedBill)
      setPreviewModalOpen(true)
    } catch (err) {
      console.error('Failed to process bill:', err)
      alert('خرابی: بل محفوظ نہیں ہو سکا۔ (Error saving bill)')
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

  // Loading state while verifying activation status on startup
  if (isActivated === null) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center font-sans select-none">
        <div className="flex flex-col items-center gap-3.5 text-amber-400">
          <span className="w-9 h-9 rounded-full border-3 border-amber-400 border-t-transparent animate-spin" />
          <span className="text-xs font-mono font-bold tracking-widest text-slate-400 uppercase">
            Verifying License Status...
          </span>
        </div>
      </div>
    )
  }

  // If app is not activated, display the Activation screen
  if (isActivated === false) {
    return <Activation onActivated={() => setIsActivated(true)} />
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col p-4 md:p-6 gap-4 md:gap-5 overflow-y-auto relative font-sans">
      {/* 1. Header Section */}
      <ReceiptHeader />

      {/* 2. Middle Form Section with Preview and Generate actions */}
      <BillForm
        formData={formData}
        calculations={calculations}
        onInputChange={handleInputChange}
        onClearForm={handleClearForm}
        onGenerateBill={handleGenerateBill}
        onPreviewReceipt={handlePreviewCurrentForm}
      />

      {/* 3. Bottom Section: Daily Transaction Ledger with fixed scroll, pagination, and sticky headers */}
      <LedgerTable
        transactions={transactions}
        loading={loading}
        onDeleteTransaction={handleDeleteTransaction}
        onPreviewTransaction={handlePreviewTransaction}
        resetTrigger={ledgerResetTrigger}
      />

      {/* 4. On-Screen Receipt Preview & Print Modal */}
      <ReceiptPreviewModal
        bill={previewBill}
        isOpen={previewModalOpen}
        onClose={() => setPreviewModalOpen(false)}
      />

      {/* 5. Bottom System Footer & POS Software Credits */}
      <footer className="mt-4 pt-3 pb-2 border-t border-slate-800/80 flex flex-wrap justify-between items-center gap-2 text-xs text-slate-500">
        <div>
          Sunheri Commission Shop (سنہری کمیشن شاپ) • Ghalla Mandi, Malka Hans
        </div>
        <div className="flex items-center gap-2">
          <span>POS Software: <strong className="text-slate-300">Easy Solutions</strong></span>
          <span className="text-slate-600">•</span>
          <span>Contact (رابطہ): <strong className="text-amber-400 font-mono">0315-6566533</strong></span>
        </div>
      </footer>
    </div>
  )
}
