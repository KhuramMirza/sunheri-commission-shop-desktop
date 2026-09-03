import Datastore from '@seald-io/nedb'
import { app } from 'electron'
import { join } from 'path'

// Initialize NeDB datastore in the user's local application data directory
const dbPath = join(app.getPath('userData'), 'mandi_bills.db')
const billsDb = new Datastore({ filename: dbPath, autoload: true })

// Ensure index on serialNo for fast sequential lookup
billsDb.ensureIndex({ fieldName: 'serialNo' }, (err) => {
  if (err) console.error('Error creating index on serialNo:', err)
})

export const dbService = {
  // Get next sequential Serial Number
  getNextSerialNo: () => {
    return new Promise((resolve, reject) => {
      billsDb
        .find({})
        .sort({ serialNo: -1 })
        .limit(1)
        .exec((err, docs) => {
          if (err) return reject(err)
          if (!docs || docs.length === 0 || !docs[0].serialNo) {
            return resolve(1)
          }
          const highestNo = parseInt(docs[0].serialNo, 10)
          resolve(isNaN(highestNo) ? 1 : highestNo + 1)
        })
    })
  },

  // Save a new bill record
  saveBill: (billData) => {
    return new Promise((resolve, reject) => {
      const record = {
        serialNo: parseInt(billData.serialNo, 10) || 1,
        date: billData.date || new Date().toISOString().split('T')[0],
        clientName: billData.clientName ? billData.clientName.trim() : 'Cash Client (نقد گاہک)',
        saafiWeight: parseFloat(billData.saafiWeight) || 0,
        bardanaWeight: parseFloat(billData.bardanaWeight) || 0,
        kandaWeight: parseFloat(billData.kandaWeight) || 0,
        netWeight: parseFloat(billData.netWeight) || 0,
        totalManns: parseInt(billData.totalManns, 10) || 0,
        remainingKgs: parseFloat(billData.remainingKgs) || 0,
        ratePerMann: parseFloat(billData.ratePerMann) || 0,
        ratePerKg: parseFloat(billData.ratePerKg) || 0,
        totalBill: parseFloat(billData.totalBill) || 0,
        createdAt: new Date().toISOString()
      }

      billsDb.insert(record, (err, newDoc) => {
        if (err) return reject(err)
        resolve(newDoc)
      })
    })
  },

  // Retrieve bills sorted in reverse chronological order (newest first)
  getBills: (query = {}) => {
    return new Promise((resolve, reject) => {
      billsDb
        .find(query)
        .sort({ serialNo: -1, createdAt: -1 })
        .exec((err, docs) => {
          if (err) return reject(err)
          resolve(docs || [])
        })
    })
  },

  // Delete a bill record by _id
  deleteBill: (id) => {
    return new Promise((resolve, reject) => {
      billsDb.remove({ _id: id }, {}, (err, numRemoved) => {
        if (err) return reject(err)
        resolve(numRemoved)
      })
    })
  }
}
