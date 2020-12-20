const {remote} = require('electron');
const BrowserWindow = remote.BrowserWindow; 
let thisWindow = remote.getCurrentWindow(); 

const WebSocketConnection = require("../WebsocketConnection.js")
const webSocketConnection = new WebSocketConnection(WebSocket);

webSocketConnection.websocket.onopen = () => {
    webSocketConnection.sendDataToWebSocketServer("screen cropping window activated", "no content")
    webSocketConnection.sendDataToWebSocketServer("subscribe to keyboard event", "no content")
};
webSocketConnection.websocket.onmessage = (info) => {
    console.log(info);
    let parsedInfo = JSON.parse(info.data)
    let message = parsedInfo.message
    let content = parsedInfo.content

    if (message === "get image coordinates then send to server") {
        let keyPositionsObject = getAllKeysPostiionMetrics()
        let borderAdjustedPositions = {x: keyPositionsObject.x + 3, y: keyPositionsObject.y + 3, width: keyPositionsObject.width - 6, height: keyPositionsObject.height - 6}
        webSocketConnection.sendDataToWebSocketServer("update new position", borderAdjustedPositions)
        hideEverything()
    }
};

document.body.style.display.onmouseover = (e) => {
    document.getElementById("bottomButtonsContainer").style.display = "block"
}

document.getElementById("cropButton").onclick = (e) => {
    generateTextCaptureWindow("cropMode")
}

document.getElementById("translateButton").onclick = () => {
    let keyPositionsObject = getAllKeysPostiionMetrics()
    let borderAdjustedPositions = {x: keyPositionsObject.x + 3, y: keyPositionsObject.y + 3, width: keyPositionsObject.width - 6, height: keyPositionsObject.height - 6}
    webSocketConnection.sendDataToWebSocketServer("update new position", borderAdjustedPositions)
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


const hideEverything = () => {
    document.body.style.display = "none"

    setTimeout (() => {
        webSocketConnection.sendDataToWebSocketServer("crop and edit this image", "no content")
    },200);
    setTimeout (function(){
        document.body.style.display = "block"
    },500);
}



