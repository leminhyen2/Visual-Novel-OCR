
// document.body.addEventListener("mouseover",showButtonsContainer);
// document.body.addEventListener("mouseleave",hideButtonsContainer);

// function showButtonsContainer() {
//     document.getElementById("bottomButtonsContainer").style.opacity = 1
// }

// function hideButtonsContainer() {
//     document.getElementById("bottomButtonsContainer").style.opacity = 0.5
// }


const {remote} = require('electron');
const BrowserWindow = remote.BrowserWindow; 
let thisWindow = remote.getCurrentWindow(); 


const webSocketConnection = new WebSocket('ws://localhost:9676/');
webSocketConnection.onopen = function() {
    sendDataTowebSocketServer("screen cropping window activated", "no content")
    sendDataTowebSocketServer("subscribe to keyboard event", "no content")
  //webSocketConnection.send("hello server");
};
webSocketConnection.onmessage = function incoming(info) {
    console.log(info);
    let parsedInfo = JSON.parse(info.data)
    let message = parsedInfo.message
    let content = parsedInfo.content

    if (message === "get image coordinates then send to server") {
        let keyPositionsObject = getAllKeysPostiionMetrics()
        let borderAdjustedPositions = {x: keyPositionsObject.x + 3, y: keyPositionsObject.y + 3, width: keyPositionsObject.width - 6, height: keyPositionsObject.height - 6}
        sendDataTowebSocketServer("update new position", borderAdjustedPositions)
        hideEverything()
    }
};

function sendDataTowebSocketServer(thisMessage, thisContent) {
    webSocketConnection.send(JSON.stringify({message: thisMessage, content: thisContent}));
}

document.body.style.display.onmouseover = (e) => {
    document.getElementById("bottomButtonsContainer").style.display = "block"
}

document.getElementById("cropButton").onclick = (e) => {
    generateTextCaptureWindow("cropMode")
}

document.getElementById("translateButton").onclick = function() {
    let keyPositionsObject = getAllKeysPostiionMetrics()
    let borderAdjustedPositions = {x: keyPositionsObject.x + 3, y: keyPositionsObject.y + 3, width: keyPositionsObject.width - 6, height: keyPositionsObject.height - 6}
    sendDataTowebSocketServer("update new position", borderAdjustedPositions)
    hideEverything()
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
                opacity: 0.5,
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
            TextCaptureWindow.loadFile('./screenCaptureWindow/transparentWindow/transparentWindow.html')
            break

        case "cropMode":
            TextCaptureWindow = new BrowserWindow({
                title: "Screen Cropping Window",
                opacity: 0.5,
                transparent: false,
                frame: false,
                alwaysOnTop: true,
                webPreferences: {
                    enableRemoteModule: true,
                    nodeIntegration: true
                }
            });
            TextCaptureWindow.loadFile('./screenCroppingWindow/screenCroppingWindow.html')
            TextCaptureWindow.maximize();
            TextCaptureWindow.show();
            break
    }
    //TextCaptureWindow.loadFile('./screenCaptureWindow/screenCaptureWindow.html')
}

function getAllKeysPostiionMetrics() {
    return remote.getCurrentWindow().getNormalBounds()
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



