const { app, BrowserWindow, dialog } = require('electron');
const path = require('path');
const isDev = !app.isPackaged;
const { autoUpdater } = require('electron-updater');

function createWindow() {
  const win = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: true,
      contextIsolation: false,
    },
  });

  if (isDev) {
    win.loadURL('http://localhost:5173');
  } else {
    win.loadFile(path.join(__dirname, 'frontend', 'dist', 'index.html'));
  }

  // 🔄 Vérifier les mises à jour en production uniquement
  if (!isDev) {
    autoUpdater.checkForUpdatesAndNotify();

    autoUpdater.on('update-available', () => {
      dialog.showMessageBox({
        type: 'info',
        title: 'Mise à jour disponible',
        message: 'Une mise à jour est disponible. Elle sera téléchargée automatiquement.',
      });
    });

    autoUpdater.on('update-downloaded', () => {
      dialog.showMessageBox({
        type: 'info',
        title: 'Mise à jour prête',
        message: 'La mise à jour est prête. L’application va redémarrer pour l’installer.',
      }).then(() => {
        autoUpdater.quitAndInstall();
      });
    });

    autoUpdater.on('error', (err) => {
      dialog.showErrorBox('Erreur de mise à jour', err == null ? "Erreur inconnue" : (err.message || err.toString()));
    });
  }
}

app.whenReady().then(() => {
  createWindow();
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});
