const electron = require('electron');
const app = electron.app;
const BrowserWindow = electron.BrowserWindow;
const ipc = electron.ipcMain;
const book = require("epub-builder");

let win;
app.on('ready', () => {
	win = new BrowserWindow({	});

	win.loadURL(`file://${__dirname}/templates/main.html`)
	app.on('closed', () => {
		win = null;
	})
});

ipc.on('saveChapter', (event, value) => {
	debugger
	console.log(value.title);
})
