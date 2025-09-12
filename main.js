const { app, BrowserWindow } = require("electron");
const next = require("next");
const express = require("express");

const dev = !app.isPackaged;
const nextApp = next({ dev });
const handle = nextApp.getRequestHandler();

let server;

async function createWindow() {
  if (dev) {
    // In dev, assume next dev server is already running on localhost:3000
    const win = new BrowserWindow({
      width: 1600,
      height: 900,
      resizable: false,
      webPreferences: {
        nodeIntegration: false,
      },
    });

    win.loadURL("http://localhost:3000");
    // win.webContents.openDevTools();
  } else {
    // Production: launch express server with nextApp handler
    await nextApp.prepare();

    server = express();

    server.use((req, res) => {
      return handle(req, res);
    });

    server.listen(3000, () => {
      console.log("> Ready on http://localhost:3000");

      const win = new BrowserWindow({
        width: 1024,
        height: 768,
        webPreferences: {
          nodeIntegration: false,
        },
      });

      win.loadURL("http://localhost:3000");
    });
  }
}

app.whenReady().then(createWindow);

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});

app.on("activate", () => {
  if (BrowserWindow.getAllWindows().length === 0) createWindow();
});
