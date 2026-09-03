import { BrowserWindow } from 'electron'

/**
 * Silently print thermal receipt using a hidden Electron BrowserWindow
 * @param {string} htmlContent - Complete HTML receipt template string
 * @param {object} options - Optional printer configuration
 */
export function printReceiptSilently(htmlContent, options = {}) {
  return new Promise((resolve, reject) => {
    try {
      // Create a hidden offscreen window for silent printing
      let printWindow = new BrowserWindow({
        show: false,
        width: 380,
        height: 800,
        webPreferences: {
          nodeIntegration: false,
          contextIsolation: true,
          sandbox: true
        }
      })

      // Load receipt HTML via data URL
      const encodedHtml = encodeURIComponent(htmlContent)
      printWindow.loadURL(`data:text/html;charset=utf-8,${encodedHtml}`)

      printWindow.webContents.on('did-finish-load', () => {
        // Use Electron's webContents.print with silent: true
        printWindow.webContents.print(
          {
            silent: true,
            printBackground: true,
            deviceName: options.deviceName || '', // Default system printer if empty
            margins: {
              marginType: 'none'
            },
            ...options
          },
          (success, failureReason) => {
            if (!success) {
              console.warn('Silent print failed or cancelled:', failureReason)
              // Resolve with failure reason instead of throwing so app doesn't crash if printer is offline
              resolve({ success: false, error: failureReason })
            } else {
              console.log('Receipt sent to default printer successfully.')
              resolve({ success: true })
            }

            // Cleanup window after printing
            if (printWindow) {
              printWindow.close()
              printWindow = null
            }
          }
        )
      })

      printWindow.webContents.on('did-fail-load', (event, errorCode, errorDescription) => {
        console.error('Failed to load receipt HTML in hidden print window:', errorDescription)
        if (printWindow) {
          printWindow.close()
          printWindow = null
        }
        reject(new Error(`Failed to load receipt HTML: ${errorDescription}`))
      })
    } catch (err) {
      console.error('Error in printReceiptSilently:', err)
      reject(err)
    }
  })
}
