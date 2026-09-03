import { BrowserWindow, dialog } from 'electron'
import fs from 'fs'

/**
 * Silently print A5 landscape receipt using a hidden Electron BrowserWindow
 * @param {string} htmlContent - Complete HTML receipt template string
 * @param {object} options - Optional printer configuration
 */
export function printReceiptSilently(htmlContent, options = {}) {
  return new Promise((resolve, reject) => {
    try {
      let printWindow = new BrowserWindow({
        show: false,
        width: 800,
        height: 600,
        webPreferences: {
          nodeIntegration: false,
          contextIsolation: true,
          sandbox: true
        }
      })

      const encodedHtml = encodeURIComponent(htmlContent)
      printWindow.loadURL(`data:text/html;charset=utf-8,${encodedHtml}`)

      printWindow.webContents.on('did-finish-load', () => {
        printWindow.webContents.print(
          {
            silent: true,
            printBackground: true,
            landscape: true,
            pageSize: 'A5',
            deviceName: options.deviceName || '',
            margins: {
              marginType: 'none'
            },
            ...options
          },
          (success, failureReason) => {
            if (!success) {
              console.warn('Silent print failed or cancelled:', failureReason)
              resolve({ success: false, error: failureReason })
            } else {
              console.log('Receipt sent to default printer in A5 Landscape format.')
              resolve({ success: true })
            }

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

/**
 * Save A5 landscape receipt as a PDF file
 * @param {string} htmlContent - Complete HTML receipt template string
 * @param {string} defaultFileName - Default filename for save dialog
 */
export function saveReceiptAsPdf(htmlContent, defaultFileName = 'Mandi_Receipt.pdf') {
  return new Promise(async (resolve, reject) => {
    try {
      const { canceled, filePath } = await dialog.showSaveDialog({
        title: 'Save Mandi Receipt as PDF (رسید پی ڈی ایف محفوظ کریں)',
        defaultPath: defaultFileName,
        filters: [{ name: 'PDF Document', extensions: ['pdf'] }]
      })

      if (canceled || !filePath) {
        return resolve({ success: false, canceled: true })
      }

      let pdfWindow = new BrowserWindow({
        show: false,
        width: 800,
        height: 600,
        webPreferences: {
          nodeIntegration: false,
          contextIsolation: true,
          sandbox: true
        }
      })

      const encodedHtml = encodeURIComponent(htmlContent)
      pdfWindow.loadURL(`data:text/html;charset=utf-8,${encodedHtml}`)

      pdfWindow.webContents.on('did-finish-load', async () => {
        try {
          // Generate PDF in A5 Landscape orientation (210mm width x 148.5mm height)
          const pdfBuffer = await pdfWindow.webContents.printToPDF({
            printBackground: true,
            landscape: true,
            pageSize: 'A5',
            margins: { marginType: 'none' }
          })

          await fs.promises.writeFile(filePath, pdfBuffer)
          resolve({ success: true, filePath })
        } catch (pdfErr) {
          console.error('Error generating PDF buffer:', pdfErr)
          resolve({ success: false, error: pdfErr.message })
        } finally {
          if (pdfWindow) {
            pdfWindow.close()
            pdfWindow = null
          }
        }
      })
    } catch (err) {
      console.error('Error in saveReceiptAsPdf:', err)
      reject(err)
    }
  })
}
