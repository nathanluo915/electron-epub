// Select all volumes
const volumeElements = document.querySelectorAll('.catalog-volume');

volumeElements.forEach(volumeElement => {
    const volume = {};
    // Extract the volume title
    const volumeTitle = volumeElement.querySelector('h3').textContent;
    volume.title = volumeTitle;
    
    // Initialize an array to hold the chapters
    const chapters = [];
    
    // Select all chapter elements within the volume
    const chapterElements = volumeElement.querySelectorAll('.jsChapter .chapter-li-a');
    
    chapterElements.forEach(chapterElement => {
        const chapter = {
            title: chapterElement.querySelector('.chapter-index').textContent,
            url: chapterElement.getAttribute('href')
        };
        chapters.push(chapter);
    });
    
    // Add the chapters to the volume
    volume.chapters = chapters;
    
    // Add the volume to the volumes array
    volumeList.push(volume);
});
console.log(volumeList);
