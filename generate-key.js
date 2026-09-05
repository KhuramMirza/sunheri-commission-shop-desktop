/**
 * Standalone License Key Generator for Sunheri Commission Shop
 * -----------------------------------------------------------
 * Run this script on your own developer machine (NOT in the Electron app).
 * 
 * Usage:
 *   node generate-key.js <machineId> [expiryDate]
 * 
 * Examples:
 *   node generate-key.js ea6cb001-5d0c-4188-aa5f-da521b067b16
 *   node generate-key.js ea6cb001-5d0c-4188-aa5f-da521b067b16 2027-12-31
 *   node generate-key.js ea6cb001-5d0c-4188-aa5f-da521b067b16 never
 */

import crypto from 'crypto'
import fs from 'fs'
import path from 'path'
import readline from 'readline'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// Directory for storing RSA keys permanently on developer machine
const KEYS_DIR = path.join(__dirname, 'keys')
const PRIVATE_KEY_PATH = path.join(KEYS_DIR, 'private.pem')
const PUBLIC_KEY_PATH = path.join(KEYS_DIR, 'public.pem')

/**
 * 1. Load or Generate RSA Key Pair (2048-bit)
 * Reuses existing keys so previously issued client licenses remain valid.
 */
function getOrCreateKeyPair() {
  if (!fs.existsSync(KEYS_DIR)) {
    fs.mkdirSync(KEYS_DIR, { recursive: true })
  }

  if (fs.existsSync(PRIVATE_KEY_PATH) && fs.existsSync(PUBLIC_KEY_PATH)) {
    const privateKey = fs.readFileSync(PRIVATE_KEY_PATH, 'utf-8')
    const publicKey = fs.readFileSync(PUBLIC_KEY_PATH, 'utf-8')
    return { privateKey, publicKey, isNew: false }
  }

  console.log('Generating new 2048-bit RSA key pair for license signing...')
  const { privateKey, publicKey } = crypto.generateKeyPairSync('rsa', {
    modulusLength: 2048,
    publicKeyEncoding: { type: 'spki', format: 'pem' },
    privateKeyEncoding: { type: 'pkcs8', format: 'pem' }
  })

  fs.writeFileSync(PRIVATE_KEY_PATH, privateKey, { encoding: 'utf-8', mode: 0o600 })
  fs.writeFileSync(PUBLIC_KEY_PATH, publicKey, { encoding: 'utf-8', mode: 0o644 })
  console.log(`RSA keys generated and saved to: ${KEYS_DIR}\n`)

  return { privateKey, publicKey, isNew: true }
}

/**
 * 2. Create and Sign a License for a specific Machine ID & Expiry Date
 * Returns combined string: <Base64Payload>.<Base64Signature>
 */
export function generateLicenseKey(machineId, expiryDate, privateKey) {
  if (!machineId || typeof machineId !== 'string' || !machineId.trim()) {
    throw new Error('Machine ID is required to generate a license key.')
  }

  const payload = {
    machineId: machineId.trim(),
    expiryDate: expiryDate || 'never',
    issuedAt: new Date().toISOString(),
    issuer: 'Sunheri Commission Shop (Ghalla Mandi, Malka Hans)'
  }

  // Base64 encode payload
  const payloadJson = JSON.stringify(payload)
  const payloadBase64 = Buffer.from(payloadJson, 'utf-8').toString('base64')

  // Sign the base64 payload string with Private Key using SHA256
  const signer = crypto.createSign('SHA256')
  signer.update(payloadBase64)
  signer.end()
  const signatureBase64 = signer.sign(privateKey, 'base64')

  // Combined License Key string: payloadBase64.signatureBase64
  const licenseKey = `${payloadBase64}.${signatureBase64}`

  return {
    licenseKey,
    payload,
    payloadBase64,
    signatureBase64
  }
}

/**
 * 3. Verify a License Key using the Public Key (Self-Check verification)
 */
export function verifyLicenseKey(licenseKey, publicKey) {
  try {
    const parts = licenseKey.split('.')
    if (parts.length !== 2) return { valid: false, error: 'Invalid license format' }

    const [payloadBase64, signatureBase64] = parts

    const verifier = crypto.createVerify('SHA256')
    verifier.update(payloadBase64)
    verifier.end()

    const isValid = verifier.verify(publicKey, signatureBase64, 'base64')
    if (!isValid) return { valid: false, error: 'Cryptographic signature verification failed' }

    const payload = JSON.parse(Buffer.from(payloadBase64, 'base64').toString('utf-8'))
    return { valid: true, payload }
  } catch (err) {
    return { valid: false, error: err.message }
  }
}

/**
 * Interactive prompt helper
 */
function promptQuestion(query) {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  })
  return new Promise((resolve) =>
    rl.question(query, (ans) => {
      rl.close()
      resolve(ans.trim())
    })
  )
}

/**
 * Main CLI Execution
 */
async function main() {
  console.log('===============================================================')
  console.log('       Sunheri Commission Shop - RSA License Key Generator     ')
  console.log('===============================================================\n')

  const { privateKey, publicKey, isNew } = getOrCreateKeyPair()

  // Print Public Key (Needed for hardcoding into the Electron app)
  console.log('---------------------------------------------------------------')
  console.log('PUBLIC KEY (Copy and hardcode this into the Electron app):')
  console.log('---------------------------------------------------------------')
  console.log(publicKey.trim())
  console.log('---------------------------------------------------------------\n')

  // Extract CLI arguments
  const args = process.argv.slice(2)
  let inputMachineId = args[0]
  let inputExpiry = args[1]

  // If arguments not provided via CLI, prompt interactively
  if (!inputMachineId) {
    inputMachineId = await promptQuestion('Enter Client Hardware Machine ID: ')
  }

  if (!inputMachineId) {
    console.error('Error: Machine ID cannot be empty.')
    process.exit(1)
  }

  if (!inputExpiry) {
    const defaultExpiry = new Date(Date.now() + 365 * 24 * 60 * 60 * 1000)
      .toISOString()
      .split('T')[0] // 1 year default
    const ans = await promptQuestion(
      `Enter Expiry Date (YYYY-MM-DD or "never") [Default: ${defaultExpiry}]: `
    )
    inputExpiry = ans || defaultExpiry
  }

  // Generate License
  const result = generateLicenseKey(inputMachineId, inputExpiry, privateKey)

  // Verify immediately
  const check = verifyLicenseKey(result.licenseKey, publicKey)

  console.log('\n===============================================================')
  console.log('                   GENERATED LICENSE DETAILS                   ')
  console.log('===============================================================')
  console.log(`Machine ID   : ${result.payload.machineId}`)
  console.log(`Expiry Date  : ${result.payload.expiryDate}`)
  console.log(`Issued Date  : ${result.payload.issuedAt}`)
  console.log(`Self-Verify  : ${check.valid ? 'PASSED (Signature Valid)' : 'FAILED'}`)
  console.log('---------------------------------------------------------------')
  console.log('LICENSE KEY TO GIVE TO CLIENT (Send this entire string):')
  console.log('---------------------------------------------------------------')
  console.log(result.licenseKey)
  console.log('---------------------------------------------------------------\n')
}

// Execute CLI only when run directly (not when imported)
const isDirectCliRun =
  process.argv[1] &&
  (path.resolve(process.argv[1]) === path.resolve(__filename) ||
    process.argv[1].endsWith('generate-key.js'))

if (isDirectCliRun) {
  main().catch((err) => {
    console.error('Fatal Error:', err)
    process.exit(1)
  })
}
