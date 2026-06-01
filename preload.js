const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('claude', {
  getData:     () => ipcRenderer.invoke('get-data'),
  onData:      (cb) => ipcRenderer.on('data-update', (_, d) => cb(d)),
  close:       () => ipcRenderer.send('close-widget'),
  minimize:    () => ipcRenderer.send('minimize-widget'),
  getIconPath: () => ipcRenderer.invoke('get-icon-path'),
  setCompact:  (compact) => ipcRenderer.send('set-compact', compact),
});
