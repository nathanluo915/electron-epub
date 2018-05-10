const electron = require('electron');
const ipc = electron.ipcRenderer;
const Nightmare = require('nightmare');
const chapter = new Nightmare({show: false});

document.getElementById('test').addEventListener('click', () => {
  chapter.goto('http://www.reddit.com/r/JacksonWrites/comments/3xaf2v/straylight_chapter_1/')
  .wait()
  .evaluate(function() {
    return {
      title: $('a[data-event-action|=title]')[0],
      content: $('.usertext-body.may-blank-within.md-container')[1].innerHTML
    }
  }, function(value) {
    ipc.send('query', value.title);
  });
  // chapter.goto('http://aerotrak.bandcamp.com/album/at-ease')
  //   .wait()
  //   .screenshot('bandcamp1.png');
})


document.getElementById('new-chapter').addEventListener('click', () => {
  const payload = {
    title: document.getElementById('cht-title').value,
    content: document.getElementById('cht-content').value
  }
  ipc.send('saveChapter', payload);
  document.getElementById('cht-title').value = "";
  document.getElementById('cht-content').value = "";
});

document.getElementById('save-book').addEventListener('click', () => {
  const metaData = {
    title: document.getElementById('book-title').value,
    author: document.getElementById('author').value,
    summary: document.getElementById('summary').value,
    bookName: document.getElementById('file-name').value
  }
  ipc.send('saveBook', metaData);
});

ipc.on('setTitle', (event, title) => {
  document.getElementById('cht-title').value = title;
});

ipc.on('setContent', (event, content) => {
  document.getElementById('cht-content').value = content;
});
console.log('Nice');
