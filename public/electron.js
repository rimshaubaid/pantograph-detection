import { app, BrowserWindow } from 'electron';
import path, { dirname } from 'path';
import { fileURLToPath } from 'url';
import isDev from 'electron-is-dev';
import url from 'url'; 
// Manually define __dirname for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


async function createWindow() {
    let mainWindow = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            preload: path.join(__dirname, 'preload.js'),
            nodeIntegration: true,
            contextIsolation: false,
            webSecurity: false, // May be needed to handle local media devices
        },
    });
   
    mainWindow.webContents.openDevTools();
    mainWindow.webContents.on("devtools-opened", () => {
        mainWindow.webContents.closeDevTools();
    });
    mainWindow.loadURL(isDev ? `http://localhost:3000` : `file://${__dirname}/../build/index.html`);
          mainWindow.on("closed", () => (mainWindow = null));
    // mainWindow.loadURL(isDev
    //     ? 'http://localhost:3000'
    //     : `file://${path.join(__dirname, '../build/index.html')}`);

}

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});
