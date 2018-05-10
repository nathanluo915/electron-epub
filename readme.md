Electron App to automatically parse the webpage and extract the content to build an EPUB book.

Main application is app.js.

renderers/main-renderer.js does nothing at the moment. Not necessary

**app.js**

Main function is `loadAndParsePage`, which load url and execute custom javascript to populate the `value`, which will be sent to `query` handler to create a chapter. At the last url, it will create the book (create a file).

Clipboard is not used. Sample code is used to handle custom content region.
A function will check clipboard changes constantly and invoke the callback when the content of the clipboard actually chages (with debouncing). 

Start the program by running `npm start`;
Debug with vscode is available (`launch.json` is updated).
