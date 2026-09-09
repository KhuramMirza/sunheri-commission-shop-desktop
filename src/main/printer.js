import { BrowserWindow, dialog } from 'electron'
import fs from 'fs'

/**
 * Get all available system printers
 */
export async function getSystemPrinters() {
  let win = new BrowserWindow({ show: false, width: 100, height: 100 })
  try {
    const printers = await win.webContents.getPrintersAsync()
    return printers || []
  } catch (err) {
    console.error('Error fetching printers:', err)
    return []
  } finally {
    if (win && !win.isDestroyed()) {
      win.close()
    }
  }
}

/**
 * Print portrait receipt using Electron BrowserWindow
 * @param {string} htmlContent - Complete HTML receipt template string
 * @param {object} options - Optional printer configuration
 */
export async function printReceiptSilently(htmlContent, options = {}) {
  let printWindow = null

  try {
    // Check available printers to find default
    const printers = await getSystemPrinters()
    const defaultPrinter = printers.find((p) => p.isDefault) || printers[0]
    const printerName = options.deviceName || (defaultPrinter ? defaultPrinter.name : '')

    // Check if target is a virtual PDF / XPS printer
    const isVirtualPrinter =
      printerName &&
      (printerName.toLowerCase().includes('pdf') ||
        printerName.toLowerCase().includes('onenote') ||
        printerName.toLowerCase().includes('xps') ||
        printerName.toLowerCase().includes('writer'))

    // Determine if print dialog should be shown:
    // If options.silent is explicitly false, OR if it's a virtual printer without a physical paper queue,
    // we show the dialog so Windows can prompt for file save / printer selection.
    const isSilent = options.silent !== undefined ? options.silent : !isVirtualPrinter

    // IMPORTANT: On Windows, to show a system print dialog, the window must be visible (show: true).
    // If silent printing to a physical printer, keep it completely hidden (show: false).
    printWindow = new BrowserWindow({
      show: !isSilent,
      width: 850,
      height: 650,
      title: 'Print Receipt - Soneri Commission Shop',
      autoHideMenuBar: true,
      webPreferences: {
        nodeIntegration: false,
        contextIsolation: true,
        sandbox: true
      }
    })

    const encodedHtml = encodeURIComponent(htmlContent)
    await printWindow.loadURL(`data:text/html;charset=utf-8,${encodedHtml}`)

    return new Promise((resolve) => {
      printWindow.webContents.print(
        {
          silent: isSilent,
          printBackground: true,
          landscape: false,
          pageSize: 'A4',
          deviceName: printerName,
          margins: {
            marginType: 'none'
          },
          ...options
        },
        (success, failureReason) => {
          console.log(`Print job dispatched: success=${success}, reason=${failureReason}`)

          // Keep window open briefly for spooler dispatch before closing
          setTimeout(() => {
            if (printWindow && !printWindow.isDestroyed()) {
              printWindow.close()
              printWindow = null
            }
          }, isSilent ? 1000 : 300)

          if (!success) {
            resolve({ success: false, error: failureReason, printerName })
          } else {
            resolve({ success: true, printerName })
          }
        }
      )
    })
  } catch (err) {
    console.error('Error in printReceiptSilently:', err)
    if (printWindow && !printWindow.isDestroyed()) {
      printWindow.close()
    }
    return { success: false, error: err.message }
  }
}

/**
 * Save portrait receipt as a PDF file
 * @param {string} htmlContent - Complete HTML receipt template string
 * @param {string} defaultFileName - Default filename for save dialog
 */
export async function saveReceiptAsPdf(htmlContent, defaultFileName = 'Mandi_Receipt.pdf') {
  let pdfWindow = null
  try {
    const { canceled, filePath } = await dialog.showSaveDialog({
      title: 'Save Mandi Receipt as PDF (رسید پی ڈی ایف محفوظ کریں)',
      defaultPath: defaultFileName,
      filters: [{ name: 'PDF Document', extensions: ['pdf'] }]
    })

    if (canceled || !filePath) {
      return { success: false, canceled: true }
    }

    pdfWindow = new BrowserWindow({
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
    await pdfWindow.loadURL(`data:text/html;charset=utf-8,${encodedHtml}`)

    // Generate PDF in A4 Portrait orientation (7in width voucher)
    const pdfBuffer = await pdfWindow.webContents.printToPDF({
      printBackground: true,
      landscape: false,
      pageSize: 'A4',
      margins: { marginType: 'none' },
      pageRanges: '1'
    })

    await fs.promises.writeFile(filePath, pdfBuffer)
    return { success: true, filePath }
  } catch (err) {
    console.error('Error in saveReceiptAsPdf:', err)
    return { success: false, error: err.message }
  } finally {
    if (pdfWindow && !pdfWindow.isDestroyed()) {
      pdfWindow.close()
    }
  }
}
