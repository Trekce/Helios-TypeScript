/* eslint-disable prefer-destructuring */
/* eslint global-require: off, no-console: off, promise/always-return: off */
import path from 'path';
import { app, BrowserWindow, ipcMain, globalShortcut } from 'electron';
import { WebSocket } from 'ws';
import fs from 'fs';
import { resolveHtmlPath } from './util';

let config: object;

if (!fs.existsSync('.\\config.json')) {
  fs.writeFileSync('.\\config.json', JSON.stringify({}));
} else {
  config = JSON.parse(fs.readFileSync('.\\config.json').toString('utf-8'));
  console.log(config);
}

// #region Main Window Stuff
let mainWindow: BrowserWindow | null = null;
const ws = new WebSocket('wss://lostfox.me/websocket');

if (process.env.NODE_ENV === 'production') {
  const sourceMapSupport = require('source-map-support');
  sourceMapSupport.install();
}

const isDebug =
  process.env.NODE_ENV === 'development' || process.env.DEBUG_PROD === 'true';

if (isDebug) require('electron-debug')();

const createWindow = async () => {
  let ignoreMouse = false;

  const RESOURCES_PATH = app.isPackaged
    ? path.join(process.resourcesPath, 'assets')
    : path.join(__dirname, '../../assets');

  const getAssetPath = (...paths: string[]): string => {
    return path.join(RESOURCES_PATH, ...paths);
  };

  mainWindow = new BrowserWindow({
    show: false,
    width: 304,
    height: 410,
    frame: false,
    transparent: true,
    alwaysOnTop: true,
    title: 'EldenPie',
    icon: getAssetPath('icon.png'),
    webPreferences: {
      preload: app.isPackaged
        ? path.join(__dirname, 'preload.js')
        : path.join(__dirname, '../../.erb/dll/preload.js'),
    },
    x: config.x,
    y: config.y,
  });

  mainWindow.focus();
  mainWindow.setIgnoreMouseEvents(ignoreMouse);

  const zindex = () => {
    mainWindow?.setAlwaysOnTop(false);
    mainWindow?.setAlwaysOnTop(true);
    mainWindow?.moveTop();
  };

  const ToggleIgnoreMouseHotkey = globalShortcut.register('home', () => {
    ignoreMouse = !ignoreMouse;
    console.log(`Ignore Mouse Events: ${ignoreMouse}`);
    mainWindow?.setIgnoreMouseEvents(ignoreMouse);
    zindex();
  });

  if (!ToggleIgnoreMouseHotkey) console.log('Registration of hotkeys failed.');

  console.log(globalShortcut.isRegistered('CommandorControl+Alt+Space'));

  mainWindow.loadURL(resolveHtmlPath('index.html'));

  mainWindow.on('closed', () => {
    mainWindow = null;
  });

  mainWindow.on('ready-to-show', () => {
    if (!mainWindow) {
      throw new Error('"mainWindow" is not defined');
    }
    if (process.env.START_MINIMIZED) {
      mainWindow.minimize();
    } else {
      mainWindow.show();
      setTimeout(() => {
        mainWindow?.moveTop();
        mainWindow?.setAlwaysOnTop(false);
        mainWindow?.setAlwaysOnTop(true);
      }, 3000);
    }
  });
  // #endregion

  let selectedCounter = '';

  //* Functions for WebSocket Messages from IPC *//
  const wsSend = (target: string, ...args: unknown[]) =>
    ws.send(JSON.stringify({ target, data: args }));
  const getDeaths = () => wsSend('GetDeathCounts');

  const incrementHotkey = globalShortcut.register('pageUp', () => {
    wsSend('increment', selectedCounter);
  });

  const decrementHotkey = globalShortcut.register('pageDown', () => {
    wsSend('decrement', selectedCounter);
  });

  if (!incrementHotkey) console.log('Registration of increment hotkey failed.');
  if (!decrementHotkey) console.log('Registration of decrement hotkey failed.');

  //* test WebSocket IPC function
  const test = () => wsSend('GetDeathCounts');

  //* IPC switch
  ipcMain.on('ipc', async (event, args) => {
    let target;
    console.log(typeof args);
    if (typeof args === 'object') {
      target = args[0];
      console.log(args[0]);
    } else target = args;
    switch (target) {
      case 'test':
        test();
        break;
      case 'keepalive':
        wsSend('keepalive');
        break;
      case 'getDeaths':
        getDeaths();
        break;
      case 'select':
        selectedCounter = args[1];
        break;
      case 'closeApp':
        mainWindow?.close();
        break;
      case 'updateWindowLocation':
        fs.writeFileSync(
          '.\\config.json',
          JSON.stringify({
            x: mainWindow?.getBounds().x,
            y: mainWindow?.getBounds().y,
          }),
        );
        break;
      default:
        break;
    }
  });

  ws.on('open', () => {
    //* Keeps websocket open indefinitely by pinging the server every five seconds
    setInterval(() => wsSend('keepalive'), 5000);

    ws.on('message', (msg) => {
      const { target, data } = JSON.parse(msg.toString('utf8'));
      switch (target) {
        case 'UpdateDeathCounts':
          mainWindow?.webContents.send('ipc', data);
          break;
        default:
          break;
      }
    });
    // setTimeout(() => getDeaths(), 2000);
  });

  setInterval(() => {
    zindex();
  }, 1000);
};

// #region App stuff
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});

app
  .whenReady()
  .then(() => {
    createWindow();
    app.on('activate', () => {
      if (mainWindow === null) createWindow();
    });
  })
  .catch(console.log);
// #endregion
