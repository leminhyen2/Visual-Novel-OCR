
const {remote} = require('electron');

const BrowserWindow = remote.BrowserWindow; 

const webSocketConnection = new WebSocket('ws://localhost:9676/');
webSocketConnection.onopen = function() {
    sendDataTowebSocketServer("hello server", "no content")
  //webSocketConnection.send("hello server");
};
webSocketConnection.onmessage = function incoming(info) {
    console.log(info);
    let parsedInfo = JSON.parse(info.data)
    let message = parsedInfo.message
    let content = parsedInfo.content
};

function sendDataTowebSocketServer(thisMessage, thisContent) {
    webSocketConnection.send(JSON.stringify({message: thisMessage, content: thisContent}));
}

let thisWindow = remote.getCurrentWindow(); 


document.getElementById("translateButton").onclick = function() {
    let keyPositionsObject = getAllKeysPostiionMetrics()
    sendDataTowebSocketServer("update new position", keyPositionsObject)
    hideEverything()
}

function hideEverything() {
    document.body.style.display = "none"

   setTimeout (function(){
      sendDataTowebSocketServer("crop and edit this image", "no content")
   },200);
   setTimeout (function(){
      document.body.style.display = "block"
   },500);
}

document.getElementById("returnButton").onclick = function() {
    generateTextCaptureWindow("moveAroundMode")
    thisWindow.close();
}

const generateTextCaptureWindow = (mode) => {
    let keyPositionsObject = getAllKeysPostiionMetrics()
    let TextCaptureWindow

    switch(mode) {
        case "moveAroundMode":
            TextCaptureWindow = new BrowserWindow({
                title: "Text Capture Window",
                opacity: 0.7,
                width: keyPositionsObject.width,
                height: keyPositionsObject.height,
                x: keyPositionsObject.x,
                y: keyPositionsObject.y,
                alwaysOnTop: true,
                webPreferences: {
                    enableRemoteModule: true,
                    nodeIntegration: true
                }
            });
            TextCaptureWindow.loadFile('./screenCaptureWindow/screenCaptureWindow.html')

            break

        case "transparentMode":
            TextCaptureWindow = new BrowserWindow({
                width: keyPositionsObject.width,
                height: keyPositionsObject.height,
                x: keyPositionsObject.x,
                y: keyPositionsObject.y,
                transparent: true,
                frame: false,
                alwaysOnTop: true,
                webPreferences: {
                    enableRemoteModule: true,
                    nodeIntegration: true
                }
            });
            TextCaptureWindow.loadFile('./screenCaptureWindow/transparentWindow.html')

            break
    }
    //TextCaptureWindow.loadFile('./screenCaptureWindow/screenCaptureWindow.html')
}

function getAllKeysPostiionMetrics() {
    return remote.getCurrentWindow().getNormalBounds()
}





