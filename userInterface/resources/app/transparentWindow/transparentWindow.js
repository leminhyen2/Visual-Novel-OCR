const {remote} = require('electron');
const BrowserWindow = remote.BrowserWindow; 
let thisWindow = remote.getCurrentWindow(); 

const WebSocketConnection = require("../WebsocketConnection.js")
const webSocketConnection = new WebSocketConnection(WebSocket);

webSocketConnection.websocket.onopen = () => {
    webSocketConnection.sendDataToWebSocketServer("add transparent window connection", "no content")
};
webSocketConnection.websocket.onmessage = (info) => {
    console.log(info);
    let parsedInfo = JSON.parse(info.data)
    let message = parsedInfo.message
    let content = parsedInfo.content

    if (message === "get image position") {
        sendImagePositionToServer()
    }

};

function sendImagePositionToServer() {
    let keyPositionsObject = getAllKeysPostiionMetrics()
    let borderAdjustedPositions = {x: keyPositionsObject.x + 3, y: keyPositionsObject.y + 3, width: keyPositionsObject.width - 6, height: keyPositionsObject.height - 6}
    webSocketConnection.sendDataToWebSocketServer("update new position", borderAdjustedPositions)
}


function getAllKeysPostiionMetrics() {
    let currentWindowCoordinates = remote.getCurrentWindow().getNormalBounds()
    console.log("currentWindowCoordinates", currentWindowCoordinates)

    let finalWindowCoordinates = remote.screen.screenToDipPoint(currentWindowCoordinates)
    console.log("final window coordinates", finalWindowCoordinates)

    let windowScaleFactor = currentWindowCoordinates.y / finalWindowCoordinates.y

    return {x: Math.floor(currentWindowCoordinates.x * windowScaleFactor), y: Math.floor(currentWindowCoordinates.y * windowScaleFactor), width: Math.floor(currentWindowCoordinates.width * windowScaleFactor), height: Math.floor(currentWindowCoordinates.height * windowScaleFactor)}
}

//webSocketConnection.sendDataToWebSocketServer("crop and edit this image", "no content")






