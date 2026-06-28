// Preload script runs in a privileged context before the renderer.
// Expose only what the renderer needs via contextBridge.
const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('electronAPI', {
  // Example: send a ping from renderer → main
  ping: () => ipcRenderer.invoke('ping'),
})
