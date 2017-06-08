const electron = require('electron');
const shell = require("electron").shell;
const app = electron.app;

const BrowserWindow = electron.BrowserWindow;

var mainWindow;
const Menu = electron.Menu;

const mainMenuTemplate = [
  {
    label: 'Bestand',
    submenu: [
      {
        label: 'Planten importeren',
        click: () => {
          mainWindow.webContents.send('ping','openPlanten');
        }
      }, {
        label: 'Planten exporteren',
        click: () => {
          mainWindow.webContents.send('ping','exportPlanten');
        }
      }, {
        type: 'separator'
      }, {
        label: 'Afsluiten',
        click: () => {
          app.quit();
        }
      }
    ]
  },{
    label: 'Planten gegevens',
    submenu: [
      {
        label: 'Gegevens importeren',
        click: () => {
          mainWindow.webContents.send('ping','openData');
        }
      }, {
        label: 'Gegevens exporteren',
        click: () => {
          mainWindow.webContents.send('ping','exportData');
        }
      }, {
        type: 'separator'
      }, {
        label: 'Gegevens wijzigen',
        click: () => {
          mainWindow.webContents.send('ping','changeData');
        }
      }
    ]
  }
];

const changeMenuTemplate = [
  {
    label: 'Bestand',
    submenu: [
      {
        label: 'Gegevens importeren',
        click: () => {
          mainWindow.webContents.send('importDataChangePage');
        }
      }, {
        label: 'Gegevens exporteren',
        click: () => {
          mainWindow.webContents.send('exportDataChangePage');
        }
      }
    ]
  },{
    label: 'Keer terug',
    click: () => {
        mainWindow.webContents.send('openMain');
    }
  }
];

app.on('ready',function() {
  const {app, BrowserWindow, ipcMain} = require('electron')

  mainWindow = new BrowserWindow({width: 1024, height: 768, backgroundColor: '#ffffff'});
  mainWindow.loadURL('file://' + __dirname + '/index.html');
  //mainWindow.webContents.openDevTools();

  const mainMenu = Menu.buildFromTemplate(mainMenuTemplate);
  Menu.setApplicationMenu(mainMenu);

  mainWindow.on('closed', function() {
    mainWindow = null;
  });

  mainWindow.webContents.on('new-window', function(event, url) {
    event.preventDefault();
    console.log("Handing off to O/S: "+url);
    shell.openExternal(url);
  });

  ipcMain.on('openMain', () => {
    mainWindow.loadURL('file://' + __dirname + '/index.html');
    const mainMenu = Menu.buildFromTemplate(mainMenuTemplate);
    Menu.setApplicationMenu(mainMenu);
  });

  ipcMain.on('openChangeData', () => {
    mainWindow.loadURL('file://' + __dirname + '/changeData.html');
    const changeMenu = Menu.buildFromTemplate(changeMenuTemplate);
    Menu.setApplicationMenu(changeMenu);
  });

  ipcMain.on('exportGraph', function(event, location) {
    const fs =require('fs');
    if(location)
    mainWindow.webContents.printToPDF({landscape: true, pageSize: 'A5'}, (error, data) =>{
      if (error) throw error;
      fs.writeFile(location, data, (error) => {
        if (error) throw error;
        console.log('Write PDF succesfully');
      })
    })
  });


});

app.on('window-all-closed', function() {
  if (process.platform != 'darwin')
    app.quit();
});
