const {remote} = require('electron');
const BrowserWindow = remote.BrowserWindow; 
let thisWindow = remote.getCurrentWindow(); 


let croppingWindow 
function generateCropWindow() {
    //let keyPositionsObject = getAllKeysPostiionMetrics()

    croppingWindow = new BrowserWindow({
        title: "Screen Cropping Window",
        opacity: 0.3,
        transparent: false,
        frame: true,
        alwaysOnTop: true,
        webPreferences: {
            enableRemoteModule: true,
            nodeIntegration: true
        }
    });
    croppingWindow.loadFile('./screenCroppingWindow/screenCroppingWindow.html')
    croppingWindow.maximize();
    croppingWindow.show();
    setTimeout(function(){ croppingWindow.hide() }, 400);
    //croppingWindow.hide();

}

generateCropWindow()


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

    if (message === "activate translate button") {
        activateTranslateButton()
    }

    if (message === "activate crop button") {
        activateCropButton()
    }

};

document.body.style.display.onmouseover = (e) => {
    document.getElementById("bottomButtonsContainer").style.display = "block"
}

document.getElementById("cropButton").onclick = (e) => {
    activateCropButton()
}

document.getElementById("translateButton").onclick = () => {
    activateTranslateButton()
}

let autoInterval 

document.getElementById("AutoOn").onclick = () => {
    autoInterval = setInterval(checkIfNewTextImageThenTranslate, 300);
}

document.getElementById("AutoOff").onclick = () => {
    if (autoInterval != undefined) {
        clearInterval(autoInterval)
    }
}

function checkIfNewTextImageThenTranslate() {
    webSocketConnection.sendDataToWebSocketServer("check if new complete text image then translate", "no content")
}

function activateTranslateButton() {
    webSocketConnection.sendDataToWebSocketServer("translate via transparent window", "no content")
}

function activateCropButton() {
    croppingWindow.maximize()
    croppingWindow.show()
}

function getAllKeysPostiionMetrics() {
    return remote.getCurrentWindow().getNormalBounds()
}





