const Heysoo = require('heysoo');
const { app, BrowserWindow, ipcMain } = require('electron');
const desktop = app;
const config = require('./config.js');

function createWindow (title = `${config.appName} [主窗口]`) {
  const win = new BrowserWindow({
    width: 1440, height: 900,
    minWidth: 1440, minHeight: 900,
    title,
  })

  const url = `http://${config.host}:${config.env === 'development' ? config.devPort : config.port}`;
  console.log('>>> url', url);
  win.loadURL(url);
}

ipcMain.on('openNewWindow', msg => {
  createWindow(`${config.appName} [新增窗口]`);
});

desktop.on('ready', async () => {
  const nodeServer = new Heysoo();
  await nodeServer.start();
  createWindow();
});