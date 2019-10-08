import {app, BrowserWindow, Menu, crashReporter, ipcMain} from "electron";
import BrowserWindowConstructorOptions = Electron.BrowserWindowConstructorOptions;
import MenuItemConstructorOptions = Electron.MenuItemConstructorOptions;

let mainWindow: Electron.BrowserWindow;
let slashscreen: Electron.BrowserWindow;


process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
app.commandLine.appendSwitch("--ignore-certificate-errors");
const gotTheLock = app.requestSingleInstanceLock();

crashReporter.start({
    uploadToServer: false,
    companyName: "test",
    productName: "test",
    submitURL: ""
});


function showSplashscreen() {
    slashscreen = new BrowserWindow({
        height: 300,
        width: 620,
        frame: false,
        alwaysOnTop: false,
        center: true,
        movable: false,
        skipTaskbar: true,
        resizable: false,
        webPreferences: {
            nodeIntegration: true
        }
    });
    slashscreen.loadURL(`file://${__dirname}/splash.html`);
    slashscreen.setMenu(null);

    slashscreen.on("closed", () => {
        slashscreen = null;
    });
}

async function startContainer() {
    const options: BrowserWindowConstructorOptions = {
        closable: true,
        webPreferences: {
            preload: __dirname + '/preload.js',
            backgroundThrottling: false,
            contextIsolation: false,
            nodeIntegration: false
        }
    };
    mainWindow = new BrowserWindow(options);
    mainWindow.on("closed", () => app.quit());
    mainWindow.maximize();

    await startApps();
}

async function startApps() {
    openApplication("http://www.google.de");
}

export function openApplication(url: string) {
    mainWindow.loadURL(url);
}

app.on("window-all-closed", () => {
    if (process.platform !== "darwin") {
        app.quit();
    }
});

if (!gotTheLock) {
    app.quit();
} else {
    app.on("second-instance", () => {
        if (mainWindow) {
            if (mainWindow.isMinimized()) {
                mainWindow.restore();
            }
            mainWindow.focus();
        }
    });

    app.on("ready", async () => {
        ipcMain.on("splash:ready", async () => {
            await startContainer();
            slashscreen.close();
            createMenu();
        });
        showSplashscreen();
    });
}

app.on("activate", async () => {
    if (mainWindow === null) {
        await startContainer();
    }
});


function createMenu() {
    let mainMenu = Menu.buildFromTemplate(devMenu);
    Menu.setApplicationMenu(mainMenu);
}

const devMenu: MenuItemConstructorOptions[] = [
    {
        label: "DEV",
        submenu: [
            {
                click: () => {
                    app.relaunch();
                    app.quit();
                },
                label: "Neustart"
            }
        ]
    }];

