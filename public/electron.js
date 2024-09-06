import { app, BrowserWindow,Menu } from 'electron';
import path, { dirname } from 'path';
import { fileURLToPath } from 'url';
import isDev from 'electron-is-dev';
import url from 'url'; 
import { spawn } from 'child_process';
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
    mainWindow.loadURL(`file://${__dirname}/../build/index.html`);
    Menu.setApplicationMenu(null);
          mainWindow.on("closed", () => (mainWindow = null));
    // mainWindow.loadURL(isDev
    //     ? 'http://localhost:3000'
    //     : `file://${path.join(__dirname, '../build/index.html')}`);
 // Start the Python backend when the window is created
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
});

app.on('will-quit', () => {
    if (pythonProcess) {
        pythonProcess.kill();
    }
});
