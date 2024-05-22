const fs = require("fs");

function readQueryFile(filepath) {
	try {
    const data = fs.readFileSync(filepath, 'utf8');
    console.log('File content:', data);
		return data;
	} catch (err) {
		console.error('Error reading file:', err);
	}
}

const commonLib = "const ipc = require('electron').ipcRenderer;\n"
function generateChapterListQuery(listQuery) {
	return commonLib + "var chapterList = [];\n" + listQuery + "\nipc.send('chaptersSetup', chapterList);"
}

function generateVolumeListQuery(listQuery) {
	return commonLib + "var volumeList = [];\n" + listQuery + "\nipc.send('volumesSetup', volumeList);"
}

function generateContentQuery(contentQuery) {
	return commonLib + contentQuery + `
const value = {
	title,
	content,
};
ipc.send('query', value);`;
}

const lightnovelQuery = commonLib + `
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

const uuChapterList = commonLib + `
var chapterList = [];
document.querySelectorAll('#chapterList li a').forEach((x) => chapterList.push(x.getAttribute('href')));
chapterList = chapterList.reverse().map((x) => 'https://www.uukanshu.net'+ x);
ipc.send('chaptersSetup', chapterList);
`;

const uuQuery = commonLib + `
const title = document.querySelector('#timu').innerHTML;
const content = document.querySelector('#contentbox').innerHTML;
const value = {
	title,
	content,
};
ipc.send('query', value);
`;

const asxsChapterList = commonLib + `
var chapterList = [];
const chapterTable = document.querySelectorAll('#at')[1]
const trs = chapterTable.querySelectorAll('tr:not(:first-child)');
trs.forEach((x) => x.querySelectorAll('a').forEach((x) => chapterList.push(x.getAttribute('href'))));
chapterList = chapterList.map((x) => 'https://www.asxs.com'+ x);
ipc.send('chaptersSetup', chapterList);
`;

const asxsQuery = commonLib + `
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
const sixnChapterList = commonLib + `
var chapterList = []
document.querySelectorAll('#catalog ul li a').forEach((x) => chapterList.push(x.getAttribute('href')));
ipc.send('chaptersSetup', chapterList);
`;

const sixnQuery = commonLib + `
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


const biliVolumeList = generateVolumeListQuery(readQueryFile("./parseQueries/biliVolumeQuery.js"));
const biliQuery = generateContentQuery(readQueryFile("./parseQueries/biliContentQuery.js"));
const biliUrlParser = function(chapterList) {
	console.log("Chapter List: ", chapterList);
	const chapterUrlList = []
	for (let i = 0; i < chapterList.length;  i++) {
		let page = chapterList[i].url;
		console.log("Chapter Url: ", page)
		if (chapterList[i].title == "登场人物回顾") {
			break
		} else if (page.includes("javascript")) {
			page = chapterList[i-1].url
			const pg = page.split("/");
			const num = pg[pg.length - 1].split(".html")[0] ;
			pg[pg.length - 1] = parseInt(num) + 1 + ".html";
			page = pg.join("/");
		}
		chapterUrlList.push("https://www.bilinovel.com" + page);
	}
	return chapterUrlList;
}

module.exports = {
	lightnovelQuery,
	uuChapterList,
	uuQuery,
	asxsChapterList,
	asxsQuery,
	sixnBookURL,
	sixnChapterList,
	sixnQuery,
	biliVolumeList,
	biliQuery,
	biliUrlParser,
};
