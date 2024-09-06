import { app, BrowserWindow, Menu } from 'electron';
import path from 'path';
import { fileURLToPath } from 'url';
import isDev from 'electron-is-dev';
import { spawn } from 'child_process';
import url from 'url'; 
// Manually define __dirname for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

let pythonProcess = null;

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
    mainWindow.loadURL(isDev ? "http://localhost:3000" : url.format({
        pathname: path.join(__dirname, 'index.html'),
        protocol: 'file:',
        slashes: true
    }));

    Menu.setApplicationMenu(null);
    mainWindow.on("closed", () => (mainWindow = null));

    // Start Python backend
    startPythonBackend();
}

// Start the Python backend
function startPythonBackend() {
    console.log('Resources Path:', process.resourcesPath);

    const isDev = process.env.NODE_ENV === 'development'; // Ensure this correctly reflects your dev environment
    const script = isDev
        ? path.join(__dirname, '../python/main.py') // Path for development
        : path.join(process.resourcesPath, 'python', 'main.py'); // Path for production

    console.log('Script Path:', script);

    // Ensure the Python executable is available
    const pythonExecutable = 'python'; // or the full path to python executable if necessary

    pythonProcess = spawn(pythonExecutable, [script]);

    pythonProcess.stdout.on('data', (data) => {
        console.log(`Python: ${data}`);
    });

    pythonProcess.stderr.on('data', (data) => {
        console.error(`Python Error: ${data}`);
    });

    pythonProcess.on('close', (code) => {
        console.log(`Python process exited with code ${code}`);
    });
}
app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
    if (pythonProcess) {
        pythonProcess.kill();
    }
});

app.on('will-quit', () => {
    if (pythonProcess) {
        pythonProcess.kill();
    }
});