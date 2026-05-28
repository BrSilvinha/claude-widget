const { app, BrowserWindow, ipcMain, Tray, Menu, nativeImage, screen, Notification } = require('electron');
const path = require('path');
const { getUsageStats } = require('./usage');
const { getLimits } = require('./limits');
const { downloadIcon, ICON_PATH } = require('./fetch-icon');

let mainWindow;
let tray;
let statsInterval;

async function buildPayload() {
  const [stats, limits] = await Promise.allSettled([
    Promise.resolve(getUsageStats()),
    getLimits(),
  ]);
  return {
    stats: stats.status === 'fulfilled' ? stats.value : null,
    limits: limits.status === 'fulfilled' ? limits.value : null,
  };
}

function createWindow() {
  const { width, height } = screen.getPrimaryDisplay().workAreaSize;

  const W = 320;
  const H = 270;

  mainWindow = new BrowserWindow({
    width: W,
    height: H,
    x: width - W - 12,
    y: height - H - 12,
    frame: false,
    transparent: true,
    alwaysOnTop: true,
    skipTaskbar: true,
    resizable: false,
    hasShadow: true,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false,
    },
  });

  mainWindow.loadFile('index.html');
  mainWindow.setAlwaysOnTop(true, 'pop-up-menu');

  ipcMain.on('close-widget', () => app.quit());
  ipcMain.on('minimize-widget', () => mainWindow.hide());
  ipcMain.handle('get-data', () => buildPayload());

  // Enviar ruta del icono al renderer para usarlo en el header
  ipcMain.handle('get-icon-path', () => {
    const fs = require('fs');
    if (fs.existsSync(ICON_PATH)) {
      const buf = fs.readFileSync(ICON_PATH);
      return 'data:image/png;base64,' + buf.toString('base64');
    }
    return null;
  });

  let lastSessionResetsAt = null;

  async function pushData() {
    if (mainWindow && !mainWindow.isDestroyed()) {
      const payload = await buildPayload();
      mainWindow.webContents.send('data-update', payload);

      const currentResetsAt = payload.limits?.session?.resetsAt;
      if (currentResetsAt && lastSessionResetsAt && lastSessionResetsAt !== currentResetsAt) {
        const exactTime = payload.limits.session.resetsAtExact;
        new Notification({
          title: 'Claude Code — Sesión reiniciada',
          body: `Tu límite de sesión se reinició. Próximo reinicio a las ${exactTime}.`,
          icon: require('fs').existsSync(ICON_PATH) ? ICON_PATH : undefined,
        }).show();
      }
      if (currentResetsAt) lastSessionResetsAt = currentResetsAt;
    }
  }

  pushData();
  statsInterval = setInterval(pushData, 30_000);
}

async function createTray(iconDataUrl) {
  let icon;
  if (iconDataUrl) {
    icon = nativeImage.createFromDataURL(iconDataUrl);
    // Escalar a 16x16 para el tray
    icon = icon.resize({ width: 16, height: 16 });
  } else {
    // Fallback: cuadrado naranja con "C"
    icon = nativeImage.createFromDataURL(getFallbackIcon());
  }

  tray = new Tray(icon);
  const contextMenu = Menu.buildFromTemplate([
    {
      label: 'Mostrar / Ocultar',
      click: () => {
        if (mainWindow.isVisible()) mainWindow.hide();
        else mainWindow.show();
      },
    },
    { type: 'separator' },
    { label: 'Salir', click: () => app.quit() },
  ]);

  tray.setToolTip('Claude Pro');
  tray.setContextMenu(contextMenu);
  tray.on('click', () => {
    if (mainWindow.isVisible()) mainWindow.hide();
    else mainWindow.show();
  });
}

// Genera un PNG 16x16 naranja con "C" como fallback
function getFallbackIcon() {
  // PNG 16x16 mínimo generado manualmente
  return 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAAXNSR0IArs4c6QAAAARnQU5ErkJggg==';
}

app.whenReady().then(async () => {
  createWindow();

  // Descargar icono real y crear tray
  const iconPath = await downloadIcon().catch(() => null);
  let iconDataUrl = null;
  if (iconPath) {
    const fs = require('fs');
    const buf = fs.readFileSync(iconPath);
    iconDataUrl = 'data:image/png;base64,' + buf.toString('base64');
  }
  await createTray(iconDataUrl);
});

app.on('window-all-closed', () => {
  clearInterval(statsInterval);
  app.quit();
});
