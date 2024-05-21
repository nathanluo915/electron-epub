const electron = require('electron');
const app = electron.app;
const BrowserWindow = electron.BrowserWindow;
const ipc = electron.ipcMain;
// const clipboard = electron.clipboard;
const book = require("epub-builder");
const Nightmare = require('nightmare');
const queries = require("./parseQueries")

const TIMEOUT = 1500;
let win;
let chapterPayload = {
	title: "",
	content: "",
}
let i = 1053;
// const chapters = [
// 	'https://www.lightnovel.cn/thread-901603-1-1.html',
// 	'https://www.lightnovel.cn/thread-901603-2-1.html',
// 	'https://www.lightnovel.cn/thread-901603-3-1.html',
// 	'https://www.lightnovel.cn/thread-901603-4-1.html',
// 	'https://www.lightnovel.cn/thread-901603-5-1.html',
// 	'https://www.lightnovel.cn/thread-901603-6-1.html',
// 	'https://www.lightnovel.cn/thread-901603-7-1.html',
// 	'https://www.lightnovel.cn/thread-901603-8-1.html',
// ]
// document.querySelectorAll('#chapterList li')
var chapters = [];
// for (let cht = 95205; cht <= 95210; cht ++) {
// 	chapters.push(`https://www.uukanshu.net/b/240239/${cht}.html`)
// }

const bookTitle = '长生仙游2';
234345
book.setUUID('23434593437830299');
book.setTitle(bookTitle);
book.setAuthor('四更不睡');
book.setSummary(bookTitle);

app.on('ready', () => {
	win = new BrowserWindow({
		webPreferences: {
			allowDisplayingInsecureContent: true,
			allowRunningInsecureContent: true,
		}
	});
	const menu = electron.Menu.getApplicationMenu();
	menu.append(new electron.MenuItem({
		label: 'Start Building',
		click: () => {
			loadAndParsePage(i);
		},
	}));
	menu.append(new electron.MenuItem({
		label: 'Setup Chapters',
		click: () => {
			setupChapters();
		},
	}));
	electron.Menu.setApplicationMenu(menu);
	win.loadURL(queries.sixnBookURL);
	// menu.append(new MenuItem({label: 'MenuItem1', click() { console.log('item 1 clicked') }}))
	// win.loadURL(`file://${__dirname}/templates/main.html`);
	// checkClipboardForChange(clipboard, (text) => {
	// 	if (chapterPayload.title === "") {
	// 		chapterPayload.title = text;
	// 		win.webContents.send('setTitle', text);
	// 	} else {
	// 		chapterPayload.content = text;
	// 		win.webContents.send('setContent', text);
	// 	}
	// });
	// loadAndParsePage(i);

	app.on('closed', () => {
		win = null;
	})
});

ipc.on('chaptersSetup', function (event, chapterList) {
	console.log('chapters setup: ', chapterList);
	chapters = chapterList
});

function setupChapters() {
	win.webContents.executeJavaScript(queries.sixnChapterList)
}


ipc.on('query', function (event, value) {
	console.log(value);
	book.addChapter(value.title, value.content);
	i ++;
	setTimeout(function() {
		loadAndParsePage(i);
	}, TIMEOUT);
});

function loadAndParsePage(i) {
	console.log('Chapters Length: ', chapters.length)
	if (i < chapters.length) {
		console.log('load window: ', chapters[i])
		win.loadURL(chapters[i]);
		
		win.webContents.on('dom-ready', () => {
			console.log('done loading');
			win.webContents.executeJavaScript(queries.sixnQuery);
		});
	} else {
		book.createBook(bookTitle);
		console.log('Book creation done...');
	}
	
}


// function checkClipboardForChange(clipboard, onChange) {
//   let cache = clipboard.readText()
//   let latest
//   setInterval(_ => {
//     latest = clipboard.readText()
//     if (latest !== cache) {
//       cache = latest
//       onChange(cache)
//     }
//   }, 1000)
// }
