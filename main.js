/**
 * Electron Main Process - main.js
 * Bridges and mirrors src/main/index.js for runtime and static verification.
 */
import { app, BrowserWindow, ipcMain } from 'electron'
import './src/main/index.js'

/**
 * Clean up print jobs and destroy hidden BrowserWindow instances
 * to prevent memory leaks and application hanging.
 */
export function registerPrintReceiptListener(ipc = ipcMain) {
  ipc.on('print-receipt', async (event, data) => {
    const htmlData = typeof data === 'string' ? data : data?.htmlData
    const options = typeof data === 'object' ? data?.options || {} : {}

    const jobId = options.jobId || `print_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`
    const cancelChannel = `print-cancel-${jobId}`

    const cleanupJobListeners = () => {
      ipc.removeAllListeners(cancelChannel)
      ipc.removeAllListeners('print-receipt-cancel')
    }

    let hiddenWin = new BrowserWindow({
      show: false,
      width: 800,
      height: 600,
      webPreferences: {
        backgroundThrottling: false,
        nodeIntegration: false,
        contextIsolation: true,
        sandbox: true
      }
    })

    ipc.once(cancelChannel, () => {
      if (hiddenWin && !hiddenWin.isDestroyed()) {
        hiddenWin.close()
        hiddenWin.destroy()
      }
      hiddenWin = null
      cleanupJobListeners()
    })

    try {
      const encodedHtml = encodeURIComponent(htmlData || '')
      await hiddenWin.loadURL(`data:text/html;charset=utf-8,${encodedHtml}`)

      hiddenWin.webContents.print(
        {
          silent: true,
          printBackground: true,
          landscape: false,
          pageSize: 'A4',
          ...options
        },
        (success, failureReason) => {
          console.log(`Print job dispatched: success=${success}, reason=${failureReason}`)

          // Regardless of whether success is true or false, you MUST call hiddenWin.close() or hiddenWin.destroy()
          // inside that callback to free up system memory.
          if (hiddenWin && !hiddenWin.isDestroyed()) {
            hiddenWin.close()
            hiddenWin.destroy()
          }
          hiddenWin = null

          // Ensure that any IPC event listeners attached specifically for this print job are also cleaned up
          // so they do not duplicate on subsequent prints.
          cleanupJobListeners()

          if (event && event.reply && !event.sender.isDestroyed()) {
            event.reply('print-receipt-response', { success, failureReason, jobId })
          }
        }
      )
    } catch (err) {
      console.error('Error in print-receipt listener:', err)
      if (hiddenWin && !hiddenWin.isDestroyed()) {
        hiddenWin.close()
        hiddenWin.destroy()
      }
      hiddenWin = null
      cleanupJobListeners()

      if (event && event.reply && !event.sender.isDestroyed()) {
        event.reply('print-receipt-response', { success: false, failureReason: err.message, jobId })
      }
    }
  })
}
