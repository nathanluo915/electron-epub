const electron = require('electron');
const app = electron.app;
const BrowserWindow = electron.BrowserWindow;
const ipc = electron.ipcMain;
// const clipboard = electron.clipboard;
const book = require("epub-builder");
const Nightmare = require('nightmare');


let win;
let chapterPayload = {
	title: "",
	content: "",
}
let i = 0;
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

const chapters = [];
for (let cht = 1; cht <= 3; cht ++) {
	chapters.push(`https://www.lightnovel.cn/forum.php?mod=viewthread&tid=863832&extra=&authorid=912367&page=${cht}`)
}

const bookTitle = '10 Years Later...';

book.setUUID('512687913648516');
book.setTitle(bookTitle);
book.setAuthor('Someone');
book.setSummary('10 Years Later...');

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
	electron.Menu.setApplicationMenu(menu);
	win.loadURL('https://www.lightnovel.cn/forum.php');
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

ipc.on('query', function (event, value) {
	console.log(value);
	book.addChapter(value.title, value.content);
	i ++;
	setTimeout(function() {
		loadAndParsePage(i);
	}, 2000);
});

function loadAndParsePage(i) {
	if (i < chapters.length) {
		win.loadURL(chapters[i]);
		win.webContents.on('dom-ready', () => {
			console.log('done loading');
			win.webContents.executeJavaScript(`
				const ipc = require('electron').ipcRenderer;
				console.log(ipc);
				const contentsContainer = document.getElementsByClassName('t_f');
				const contents = [];
				for (let j = 0; j < contentsContainer.length; j++) {
					contents.push(contentsContainer[j].innerHTML);
				}
				const value = {
					title: document.querySelector('.pg strong').innerHTML,
					content: contents.join('<br><br/>------------------------------------<br><br>'),
				};
				ipc.send('query', value);
			`);
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
