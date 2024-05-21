const lightnovelQuery = `
const ipc = require('electron').ipcRenderer;
const contentsContainer = document.getElementsByClassName('#contentbox');
const contents = [];
for (let j = 0; j < contentsContainer.length; j++) {
	contents.push(contentsContainer[j].innerHTML);
}
const value = {
	title: document.querySelector('#timu').innerHTML,
	content: contents.join('<br><br/>------------------------------------<br><br>'),
};
ipc.send('query', value);
`;

const uuChapterList = `
const ipc = require('electron').ipcRenderer;
var chapterList = [];
document.querySelectorAll('#chapterList li a').forEach((x) => chapterList.push(x.getAttribute('href')));
chapterList = chapterList.reverse().map((x) => 'https://www.uukanshu.net'+ x);
ipc.send('chaptersSetup', chapterList);
`;

const uuQuery = `
const ipc = require('electron').ipcRenderer;
const title = document.querySelector('#timu').innerHTML;
const content = document.querySelector('#contentbox').innerHTML;
const value = {
	title,
	content,
};
ipc.send('query', value);
`;

const asxsChapterList = `
const ipc = require('electron').ipcRenderer;
var chapterList = [];
const chapterTable = document.querySelectorAll('#at')[1]
const trs = chapterTable.querySelectorAll('tr:not(:first-child)');
trs.forEach((x) => x.querySelectorAll('a').forEach((x) => chapterList.push(x.getAttribute('href'))));
chapterList = chapterList.map((x) => 'https://www.asxs.com'+ x);
ipc.send('chaptersSetup', chapterList);
`;

const asxsQuery = `
const ipc = require('electron').ipcRenderer;
const title = document.querySelector('h1').innerHTML;
const content= document.querySelector('#contents');
const ads = content.querySelectorAll('#device');
const scripts = content.querySelectorAll('script');
ads.forEach((x) => content.removeChild( x ));
scripts.forEach((x) => content.removeChild( x ));
const value = {
	title,
	content: content.innerHTML,
};
ipc.send('query', value);
`;

const sixnBookURL = 'https://www.69shuba.com/book/50851/'
const sixnChapterList = `
const ipc = require('electron').ipcRenderer;
var chapterList = []
document.querySelectorAll('#catalog ul li a').forEach((x) => chapterList.push(x.getAttribute('href')));
ipc.send('chaptersSetup', chapterList);
`;

const sixnQuery = `
const ipc = require('electron').ipcRenderer;
const title = document.querySelector('h1').innerHTML;
const txtnav = document.querySelector('.txtnav');
// const hide720 = txtnav.querySelector('.hide720');
// hide720.forEach((x) => txtnav.removeChild( x ));
const content = txtnav.innerHTML;
const value = {
	title,
	content,
};
ipc.send('query', value);
`;

module.exports = {
	lightnovelQuery,
	uuChapterList,
	uuQuery,
	asxsChapterList,
	asxsQuery,
	sixnBookURL,
	sixnChapterList,
	sixnQuery,
};
