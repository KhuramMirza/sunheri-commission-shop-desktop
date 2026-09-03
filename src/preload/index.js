import { contextBridge, ipcRenderer } from 'electron'

// Custom APIs for renderer
const api = {
  ping: () => ipcRenderer.invoke('app:ping'),
  // Bridge placeholders ready for DB operations and Silent Printing
  printReceipt: (htmlData) => ipcRenderer.invoke('printer:print-receipt', htmlData),
  saveBill: (billData) => ipcRenderer.invoke('db:save-bill', billData),
  getBills: (query) => ipcRenderer.invoke('db:get-bills', query)
}

if (process.contextIsolated) {
  try {
    contextBridge.exposeInMainWorld('api', api)
  } catch (error) {
    console.error('Failed to expose context bridge:', error)
  }
} else {
  window.api = api
}
