const { app, BrowserWindow, dialog } = require('electron');
const path = require('path');
const isDev = !app.isPackaged;
const { autoUpdater } = require('electron-updater');
require('dotenv').config(); // Chargement des variables d’environnement

// 🚀 Lancer le backend (Express + SQLite)
require(path.join(__dirname, 'backend', 'server.js'));

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

  // 🔗 Chargement de l’interface
  if (isDev) {
    win.loadURL('http://localhost:5173');
  } else {
    win.loadFile(path.join(__dirname, 'frontend', 'dist', 'index.html'));
  }

  // 🔄 Mises à jour (production uniquement)
  if (!isDev) {
    // ⚠️ Jeton d'accès pour les dépôts privés GitHub
    autoUpdater.requestHeaders = {
      Authorization: `token ${process.env.GH_TOKEN}`
    };

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
      dialog.showErrorBox(
        'Erreur de mise à jour',
        err == null ? "Erreur inconnue" : (err.message || err.toString())
      );
    });
  }
}

// 🚀 Initialisation de l’application
app.whenReady().then(() => {
  createWindow();
});

// 🔒 Quitter si toutes les fenêtres sont fermées (hors Mac)
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});
