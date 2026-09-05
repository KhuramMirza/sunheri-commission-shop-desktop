import crypto from 'crypto'
import nodeMachineId from 'node-machine-id'
import electronPkg from 'electron'
import { join } from 'path'
import fs from 'fs'

const app = electronPkg?.app || electronPkg?.default?.app

// Support both CommonJS export shapes in ESM for node-machine-id
const machineIdSync = nodeMachineId.machineIdSync || nodeMachineId.default?.machineIdSync

/**
 * 2048-bit RSA Public Key for Offline License Verification
 * Matches the Private Key in generate-key.js
 */
export const RSA_PUBLIC_KEY = `-----BEGIN PUBLIC KEY-----
MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEA2J8qRjTaSxGPF8ENlr7L
0VAIgINqAYlWu0kuYAGRtIWl3eSU8uQ+i3zKejIROaUjKzvexzeCU2OPdhB9xblt
QjgMLylxrBMBrMiZsrp68pKlQrLME6YuVefe0kXr/aB5RYspXeLlAcyh2Oh26Zrc
PW7EkNTELsozQBt9U3gxt53Egr9eOCYHy9bLhvJjIC96AdkTKXQ2lLojGHzPXvvV
417kN5qxE1nHtLgWDh7ULm7wluMmFwyb59y+apBHFhxguWvKt/gZ01qxSrlRUYAE
kszS4PtO+Arh5QFesFwLScHVazTFC/OypdPX0eBndCdmvuNFLImDzm6fJZ5US+br
PQIDAQAB
-----END PUBLIC KEY-----`

/**
 * Path to local activation record in Electron's userData folder
 */
export const getLicenseFilePath = () => {
  const userDataDir =
    app && typeof app.getPath === 'function'
      ? app.getPath('userData')
      : join(process.cwd(), '.user_data_test')
  if (!fs.existsSync(userDataDir)) {
    fs.mkdirSync(userDataDir, { recursive: true })
  }
  return join(userDataDir, 'activation.json')
}

/**
 * Core Offline License Verification Logic
 * 1. Checks format: <payloadBase64>.<signatureBase64>
 * 2. Verifies cryptographic signature using RSA Public Key with SHA256
 * 3. Compares payload machineId with the local machine's unique hardware ID
 * 4. Checks if current date is before expiryDate (unless "never")
 */
export function verifyLicenseKeyOffline(rawLicenseKey, expectedMachineId) {
  try {
    if (!rawLicenseKey || typeof rawLicenseKey !== 'string') {
      return {
        valid: false,
        message: 'براہ کرم لائسنس کوڈ درج کریں۔ (License key cannot be empty)'
      }
    }

    // Clean whitespace and line-breaks that might occur during copy-pasting
    const cleanedKey = rawLicenseKey.replace(/\s+/g, '')
    const parts = cleanedKey.split('.')

    if (parts.length !== 2) {
      return {
        valid: false,
        message: 'لائسنس کا فارمیٹ درست نہیں ہے۔ (Invalid license key format)'
      }
    }

    const [payloadBase64, signatureBase64] = parts

    // 1. Cryptographic Signature Verification
    const verifier = crypto.createVerify('SHA256')
    verifier.update(payloadBase64)
    verifier.end()

    const isSignatureValid = verifier.verify(RSA_PUBLIC_KEY, signatureBase64, 'base64')
    if (!isSignatureValid) {
      return {
        valid: false,
        message:
          'لائسنس کی تصدیق ناکام ہو گئی! لائسنس جعلی یا تبدیل شدہ ہے۔ (Cryptographic verification failed: Invalid or tampered license)'
      }
    }

    // 2. Decode and Parse JSON Payload
    let payload
    try {
      const payloadJson = Buffer.from(payloadBase64, 'base64').toString('utf-8')
      payload = JSON.parse(payloadJson)
    } catch (parseErr) {
      return {
        valid: false,
        message: 'لائسنس ڈیٹا پڑھنے میں ناکامی۔ (Unable to parse license payload)'
      }
    }

    // 3. Machine ID Check
    if (!payload.machineId) {
      return {
        valid: false,
        message: 'لائسنس میں کمپیوٹر کا شناختی کوڈ موجود نہیں ہے۔ (No machine ID in license payload)'
      }
    }

    const targetMachineId = expectedMachineId || licenseService.getMachineId()
    if (payload.machineId.trim().toLowerCase() !== targetMachineId.trim().toLowerCase()) {
      return {
        valid: false,
        message: `یہ لائسنس کسی اور کمپیوٹر کے لیے ہے۔ لائسنس اس کمپیوٹر پر قابل استعمال نہیں ہے۔ (License machine ID does not match this computer)`
      }
    }

    // 4. Expiry Date Check
    if (payload.expiryDate && payload.expiryDate.toLowerCase() !== 'never') {
      // Treat expiry date as end of that day (23:59:59.999 UTC)
      const expiryTimestamp = new Date(payload.expiryDate + 'T23:59:59.999Z').getTime()
      if (isNaN(expiryTimestamp)) {
        return {
          valid: false,
          message: 'لائسنس کی تاریخ تنسیخ درست نہیں ہے۔ (Invalid expiry date format in license)'
        }
      }

      if (Date.now() > expiryTimestamp) {
        return {
          valid: false,
          message: `اس لائسنس کی معیاد (${payload.expiryDate}) کو ختم ہو چکی ہے۔ براہ کرم تجدید کروائیں۔ (License expired on ${payload.expiryDate})`
        }
      }
    }

    return {
      valid: true,
      cleanedKey,
      payload
    }
  } catch (err) {
    console.error('Error during license verification:', err)
    return {
      valid: false,
      message: `تصدیق کے دوران خرابی پیش آگئی: ${err.message}`
    }
  }
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
   * Check if app has a valid license file on system startup
   * Re-verifies cryptographic signature, hardware ID, and expiration date every time
   */
  getActivationStatus: () => {
    try {
      const filePath = getLicenseFilePath()
      if (!fs.existsSync(filePath)) {
        return { isActivated: false }
      }

      const raw = fs.readFileSync(filePath, 'utf-8')
      const data = JSON.parse(raw)

      if (!data || !data.licenseKey) {
        return { isActivated: false }
      }

      // Re-verify the saved license key against current machine hardware ID and date
      const currentMachineId = licenseService.getMachineId()
      const verification = verifyLicenseKeyOffline(data.licenseKey, currentMachineId)

      if (verification.valid) {
        return {
          isActivated: true,
          licenseKey: data.licenseKey,
          payload: verification.payload,
          activatedAt: data.activatedAt,
          machineId: currentMachineId
        }
      } else {
        console.warn('Saved license verification failed on startup:', verification.message)
        return {
          isActivated: false,
          error: verification.message
        }
      }
    } catch (err) {
      console.error('Error checking activation status on startup:', err)
      return { isActivated: false }
    }
  },

  /**
   * Validate user-submitted license key, check signature, machine ID & expiry,
   * then securely save it in userData/activation.json
   */
  activateLicense: (rawLicenseKey) => {
    try {
      const currentMachineId = licenseService.getMachineId()
      const verification = verifyLicenseKeyOffline(rawLicenseKey, currentMachineId)

      if (!verification.valid) {
        return {
          success: false,
          message: verification.message
        }
      }

      const filePath = getLicenseFilePath()
      const record = {
        isActivated: true,
        licenseKey: verification.cleanedKey,
        machineId: currentMachineId,
        payload: verification.payload,
        activatedAt: new Date().toISOString()
      }

      fs.writeFileSync(filePath, JSON.stringify(record, null, 2), 'utf-8')
      console.log('License activated and saved successfully for machine:', currentMachineId)

      return {
        success: true,
        message: 'سافٹ ویئر کامیابی سے ایکٹیویٹ ہو گیا ہے۔ (Software activated successfully!)',
        payload: verification.payload
      }
    } catch (err) {
      console.error('Error activating license:', err)
      return {
        success: false,
        message: 'خرابی: لائسنس محفوظ نہیں ہو سکا۔ (Error saving activation: ' + err.message + ')'
      }
    }
  }
}
