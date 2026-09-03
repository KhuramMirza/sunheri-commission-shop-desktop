import { app, shell, BrowserWindow, ipcMain } from 'electron'
import { join } from 'path'
import { dbService } from './db.js'
import { printReceiptSilently } from './printer.js'

function createWindow() {
  const mainWindow = new BrowserWindow({
    width: 1280,
    height: 800,
    minWidth: 1024,
    minHeight: 700,
    show: false,
    autoHideMenuBar: true,
    title: 'Sunheri Commission Shop (سنہری کمیشن شاپ)',
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      sandbox: false,
      contextIsolation: true,
      nodeIntegration: false
    }
  })

  mainWindow.on('ready-to-show', () => {
    mainWindow.show()
  })

  mainWindow.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url)
    return { action: 'deny' }
  })

  // Load renderer
  if (process.env['ELECTRON_RENDERER_URL']) {
    mainWindow.loadURL(process.env['ELECTRON_RENDERER_URL'])
  } else {
    mainWindow.loadFile(join(__dirname, '../renderer/index.html'))
  }
}

app.whenReady().then(() => {
  // App health & info
  ipcMain.handle('app:ping', async () => {
    return {
      status: 'online',
      version: app.getVersion(),
      time: new Date().toISOString()
    }
  })

  // Database IPC Handlers
  ipcMain.handle('db:get-next-serial-no', async () => {
    try {
      return await dbService.getNextSerialNo()
    } catch (err) {
      console.error('Error fetching next serial number:', err)
      return 1
    }
  })

  ipcMain.handle('db:save-bill', async (_event, billData) => {
    try {
      return await dbService.saveBill(billData)
    } catch (err) {
      console.error('Error saving bill:', err)
      throw err
    }
  })

  ipcMain.handle('db:get-bills', async (_event, query) => {
    try {
      return await dbService.getBills(query)
    } catch (err) {
      console.error('Error fetching bills:', err)
      return []
    }
  })

  ipcMain.handle('db:delete-bill', async (_event, id) => {
    try {
      return await dbService.deleteBill(id)
    } catch (err) {
      console.error('Error deleting bill:', err)
      throw err
    }
  })

  // Silent Thermal Printer IPC Handler
  ipcMain.handle('printer:print-receipt', async (_event, htmlData) => {
    try {
      return await printReceiptSilently(htmlData)
    } catch (err) {
      console.error('Error in printer:print-receipt handler:', err)
      return { success: false, error: err.message }
    }
  })

  createWindow()

  app.on('activate', function () {
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})
