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
    win.close()
  }
}

/**
 * Print A5 landscape receipt using Electron BrowserWindow
 * @param {string} htmlContent - Complete HTML receipt template string
 * @param {object} options - Optional printer configuration
 */
export async function printReceiptSilently(htmlContent, options = {}) {
  let printWindow = null

  try {
    printWindow = new BrowserWindow({
      show: false,
      width: 800,
      height: 600,
      webPreferences: {
        nodeIntegration: false,
        contextIsolation: true,
        sandbox: true
      }
    })

    // Fetch available printers and find default
    const printers = await printWindow.webContents.getPrintersAsync()
    const defaultPrinter = printers.find((p) => p.isDefault) || printers[0]
    const printerName = options.deviceName || (defaultPrinter ? defaultPrinter.name : '')

    // Check if the target is a virtual PDF / OneNote printer
    const isVirtualPdfPrinter =
      printerName &&
      (printerName.toLowerCase().includes('pdf') ||
        printerName.toLowerCase().includes('onenote') ||
        printerName.toLowerCase().includes('xps') ||
        printerName.toLowerCase().includes('writer'))

    console.log(`Targeting printer: "${printerName}" (isVirtualPdf: ${isVirtualPdfPrinter}, isDefault: ${defaultPrinter?.isDefault})`)

    const encodedHtml = encodeURIComponent(htmlContent)
    await printWindow.loadURL(`data:text/html;charset=utf-8,${encodedHtml}`)

    return new Promise((resolve) => {
      // Determine silent mode:
      // If it's a virtual PDF printer and user requested silent, virtual printers cannot prompt for file in silent mode,
      // so we allow silent: false (or native save) so the Windows Save dialog pops up!
      const shouldBeSilent = options.silent !== undefined ? options.silent : !isVirtualPdfPrinter

      printWindow.webContents.print(
        {
          silent: shouldBeSilent,
          printBackground: true,
          landscape: true,
          pageSize: 'A5',
          deviceName: printerName,
          margins: {
            marginType: 'none'
          },
          ...options
        },
        (success, failureReason) => {
          console.log(`Print job result: success=${success}, reason=${failureReason}`)

          // Give Windows Print Spooler 1 second before destroying offscreen window
          setTimeout(() => {
            if (printWindow && !printWindow.isDestroyed()) {
              printWindow.close()
              printWindow = null
            }
          }, 1000)

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
 * Save A5 landscape receipt as a PDF file
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

    // Generate PDF in A5 Landscape orientation (210mm x 148.5mm)
    const pdfBuffer = await pdfWindow.webContents.printToPDF({
      printBackground: true,
      landscape: true,
      pageSize: 'A5',
      margins: { marginType: 'none' }
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
