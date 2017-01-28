const electron = require('electron');
const ipc = electron.ipcRenderer;

document.getElementById('new-chapter').addEventListener('click', () => {
  const payload = {
    title: document.getElementById('cht-title').value,
    content: document.getElementById('cht-content').value
  }
  debugger
  ipc.send('saveChapter', payload);
});
console.log('Nice');