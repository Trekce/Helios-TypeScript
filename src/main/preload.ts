import { contextBridge, ipcRenderer, IpcRendererEvent } from 'electron';
import { cwd } from 'process';

const cmd = require('node-cmd');

// const dir = cmd.runSync('dir').data;
// console.log(dir);

export type Channels = 'ipc-example';

ipcRenderer.on('serial-data', (e, data) => {
  postMessage({ channel: 'serial-data', data });
});

contextBridge.exposeInMainWorld('electron', {
  ipcRenderer: {
    sendMessage(channel: Channels, args: unknown[]) {
      ipcRenderer.send(channel, args);
    },
    on(channel: Channels, func: (...args: unknown[]) => void) {
      const subscription = (_event: IpcRendererEvent, ...args: unknown[]) =>
        func(...args);
      ipcRenderer.on(channel, subscription);

      return () => ipcRenderer.removeListener(channel, subscription);
    },
    once(channel: Channels, func: (...args: unknown[]) => void) {
      ipcRenderer.once(channel, (_event, ...args) => func(...args));
    },
  },
  ericsson: {
    getAllInfo: async () => {
      cmd.run(
        `${cwd()}/bin/ericssonTest.exe -f`,
        (err: unknown, res: unknown) => {
          if (!err) {
            console.log(res);
          } else console.log(err);
        }
      );

      // const dir = cmd.runSync('').data;
      // console.log(dir);
    },
    getProductInfo: async () => {
      let i = 0;
      const timer = setInterval(() => {
        i += 1;
        postMessage('ericssonTestProgress');
        if (i > 50) {
          i = 0;
          clearInterval(timer);
          postMessage('ericssonTestComplete');
        }
      }, 60);
    },
  },
});
