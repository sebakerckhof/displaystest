import { app, BrowserWindow, screen } from 'electron';
import path from 'path';
import isDev from 'electron-is-dev';
import { promisify } from 'util';
import udev from 'udev';
import { fsPromise } from 'fs';

const createClient = promisify(require('x11').createClient);

require('electron-debug')();

async function getDisplaysFromSys() {
  const promiseList = udev.list('drm')
  .filter(display => !!display.syspath)
  .map(async (display) => {
    let status;
    try {
      status = await fsPromise.readFile(path.join(display.syspath, 'status'));
    } catch (error) {
      status = 'disconnected';
    }

    return {
      port: display.syspath.substr(display.syspath.lastIndexOf('/') + 1),
      status,
    };
  })

  return Promise.all(promiseList);
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', async () => {
  try {
    const displays = console.log(await getDisplaysFromSys());
    
    const display = await createClient();

    const X = display.client;
    X.on('error', function(err) { console.log(err); });

    const root = display.screen[0].root;
    const XRequire = promisify(X.require.bind(X));
    const randr = await XRequire('randr');
    randr.SelectInput(root, randr.NotifyMask.ScreenChange);
    X.on('event', function(ev) {
      console.log("XRANDR change event");
    });

    screen.on('display-added', () => {
      console.log("ELECTRON added event");
    });
    screen.on('display-metrics-changed', () => {
      console.log("ELECTRON metrics changed event");
    });
    screen.on('display-removed', () => {
      console.log("ELECTRON removed event");
    });
   
    var monitor = udev.monitor("drm");
    monitor.on('add', function (device) {
        console.log("UDEV added event");
    });
    monitor.on('remove', function (device) {
        console.log("UDEV removed event");
    });
    monitor.on('change', function (device) {
      console.log("UDEV change event");
    });

  } catch (error) {
    console.log(error);
  }
});

// Quit when all windows are closed.
app.on('window-all-closed', () => {
  // On OS X it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (mainWindow === null) {
    createWindow();
  }
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and import them here.
