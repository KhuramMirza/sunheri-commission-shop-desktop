import { contextBridge, ipcRenderer } from 'electron'

const api = {
  ping: () => ipcRenderer.invoke('app:ping'),
  getNextSerialNo: () => ipcRenderer.invoke('db:get-next-serial-no'),
  saveBill: (billData) => ipcRenderer.invoke('db:save-bill', billData),
  getBills: (query) => ipcRenderer.invoke('db:get-bills', query),
  deleteBill: (id) => ipcRenderer.invoke('db:delete-bill', id),
  printReceipt: (htmlData) => ipcRenderer.invoke('printer:print-receipt', htmlData),
  savePdf: (htmlData, fileName) => ipcRenderer.invoke('printer:save-pdf', { htmlData, fileName })
}

const electronAPI = {
  ipcRenderer: {
    send: (channel, data) => ipcRenderer.send(channel, data),
    invoke: (channel, data) => ipcRenderer.invoke(channel, data)
  }
}

if (process.contextIsolated) {
  try {
    contextBridge.exposeInMainWorld('api', api)
    contextBridge.exposeInMainWorld('electron', electronAPI)
  } catch (error) {
    console.error('Failed to expose context bridge:', error)
  }
} else {
  window.api = api
  window.electron = electronAPI
}
