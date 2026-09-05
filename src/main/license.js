import nodeMachineId from 'node-machine-id'
import { app } from 'electron'
import { join } from 'path'
import fs from 'fs'

// Support both CommonJS export shapes in ESM
const machineIdSync = nodeMachineId.machineIdSync || nodeMachineId.default?.machineIdSync

const getLicenseFilePath = () => {
  const userDataDir = app.getPath('userData')
  if (!fs.existsSync(userDataDir)) {
    fs.mkdirSync(userDataDir, { recursive: true })
  }
  return join(userDataDir, 'activation.json')
}

export const licenseService = {
  /**
   * Get unique hardware machine ID using node-machine-id
   */
  getMachineId: () => {
    try {
      if (typeof machineIdSync === 'function') {
        const id = machineIdSync({ original: true })
        return String(id).trim()
      }
      throw new Error('machineIdSync function not available in node-machine-id package')
    } catch (err) {
      console.error('Error retrieving hardware machine ID:', err)
      return 'HWID-FETCH-ERROR'
    }
  },

  /**
   * Check if app has already been activated on this system
   */
  getActivationStatus: () => {
    try {
      const filePath = getLicenseFilePath()
      if (!fs.existsSync(filePath)) {
        return { isActivated: false }
      }
      const raw = fs.readFileSync(filePath, 'utf-8')
      const data = JSON.parse(raw)
      if (data && data.isActivated && data.licenseKey) {
        return {
          isActivated: true,
          licenseKey: data.licenseKey,
          activatedAt: data.activatedAt,
          machineId: data.machineId
        }
      }
      return { isActivated: false }
    } catch (err) {
      console.error('Error checking activation status:', err)
      return { isActivated: false }
    }
  },

  /**
   * Validate and save license key locally
   */
  activateLicense: (licenseKey) => {
    try {
      if (!licenseKey || typeof licenseKey !== 'string' || licenseKey.trim().length === 0) {
        return {
          success: false,
          message: 'براہ کرم درست لائسنس کی درج کریں۔ (Please enter a valid license key)'
        }
      }

      const key = licenseKey.trim()
      const machineId = licenseService.getMachineId()
      const filePath = getLicenseFilePath()

      const record = {
        isActivated: true,
        licenseKey: key,
        machineId,
        activatedAt: new Date().toISOString()
      }

      fs.writeFileSync(filePath, JSON.stringify(record, null, 2), 'utf-8')
      return {
        success: true,
        message: 'سافٹ ویئر کامیابی سے ایکٹیویٹ ہو گیا ہے۔ (Software activated successfully!)'
      }
    } catch (err) {
      console.error('Error activating license:', err)
      return {
        success: false,
        message: 'خرابی: لائسنس ایکٹیویٹ نہیں ہو سکا۔ (Error saving activation: ' + err.message + ')'
      }
    }
  }
}
