const electron = require('electron');
const app = electron.app;
const BrowserWindow = electron.BrowserWindow;
const ipc = electron.ipcMain;
// const clipboard = electron.clipboard;
const queries = require("./parseQueries")

const TIMEOUT = 1500;
let win;
// let i = 1053;
let i = 0;
let j = 7;
var chapters = [];
var volumes = [];

// const bookUrl = queries.sixnBookURL;
// const chapterQuery = queries.sixnChapterList;
// const contentQuery = queries.sixnQuery;

const bookUrl = "https://www.bilinovel.com/novel/2978/catalog";
const volumeQuery = queries.biliVolumeList;
const contentQuery = queries.biliQuery;
const urlParser = queries.biliUrlParser;

let book = null;
const bookTitle = '叹息的亡灵想引退';
let volumeTitle = bookTitle;
const bookAuthor = '槻影';

function generateHexRandomString(length = 16) {
  const charset = '0123456789abcdef';
  let result = '';
  const charactersLength = charset.length;

  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * charactersLength);
    result += charset[randomIndex];
  }

  return result;
}


app.on('ready', () => {
	win = new BrowserWindow({
		webPreferences: {
			allowDisplayingInsecureContent: true,
			allowRunningInsecureContent: true,
		}
	});
	win.webContents.session.webRequest.onBeforeSendHeaders((details, callback) => {
    details.requestHeaders['User-Agent'] = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/90.0.4430.93 Safari/537.36';
    callback({ cancel: false, requestHeaders: details.requestHeaders });
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
			triggerChapterSetup();
		},
	}));
	menu.append(new electron.MenuItem({
		label: 'Setup Volumes',
		click: () => {
			triggerVolumeSetup();
		},
	}));
	electron.Menu.setApplicationMenu(menu);
	win.loadURL(bookUrl);
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

function triggerChapterSetup() {
	if (chapterQuery != null) {
		win.webContents.executeJavaScript(chapterQuery)
	} else {
		console.log("chapterQuery is empty")
	}
}

function triggerVolumeSetup() {
	if (volumeQuery != null) {
		win.webContents.executeJavaScript(volumeQuery)
	} else {
		console.log("volumeQuery is empty")
	}
}

ipc.on('chaptersSetup', function (event, chapterList) {
	console.log('chapters setup: ', chapterList);
	chapters = chapterList;
	book = require("epub-builder");
	book.setUUID(generateHexRandomString());
	book.setTitle(bookTitle);
	book.setAuthor(bookAuthor);
	book.setSummary(bookTitle);
});

ipc.on('volumesSetup', function (event, volumeList) {
	console.log('volumes setup: ', volumeList);
	volumes = volumeList;
	chapters = urlParser(volumes[j].chapters);
	console.log("Chapters: ", chapters);
	volumeTitle = bookTitle + " - " + volumes[j].title;
	console.log("volumeTitle: ", volumeTitle);
	book = require("epub-builder");
	book.setUUID(generateHexRandomString());
	book.setTitle(volumeTitle);
	book.setAuthor(bookAuthor);
	book.setSummary(volumeTitle);
});


ipc.on('query', function (event, value) {
	console.log(value);
	book.addChapter(value.title, value.content);
	i ++;
	setTimeout(function() {
		loadAndParsePage(i);
	}, TIMEOUT);
});

function newVolume() {
	volumeTitle = bookTitle + " - " + volumes[j].title;
	chapters = urlParser(volumes[j].chapters);
	i = 0;
	book = require("epub-builder");
	book.setUUID(generateHexRandomString());
	book.setTitle(volumeTitle);
	book.setAuthor(bookAuthor);
	book.setSummary(volumeTitle);
	setTimeout(function() {
		loadAndParsePage(i);
	}, TIMEOUT);
};

function loadAndParsePage(chapterIndex) {
	console.log('Chapters Length: ', chapters.length)
	if (chapterIndex < chapters.length) {
		console.log('load window: ', chapters[chapterIndex])
		win.loadURL(chapters[chapterIndex]);
		
		win.webContents.on('did-finish-load', () => {
			console.log('done loading');
			win.webContents.executeJavaScript(contentQuery);
		});
	} else {
		book.createBook(volumeTitle);
		console.log('Book creation done...');
		if (volumes != []) {
			j += 1;
			if (j < volumes.length) {
				newVolume();
			}
		}
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
