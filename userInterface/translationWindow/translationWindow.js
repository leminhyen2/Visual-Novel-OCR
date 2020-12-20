const WebSocketConnection = require("../WebsocketConnection.js")
const webSocketConnection = new WebSocketConnection(WebSocket);

webSocketConnection.websocket.onopen = function() {
    webSocketConnection.sendDataToWebSocketServer("subscribe to image updates", "no content")
    webSocketConnection.sendDataToWebSocketServer("subscribe to text updates", "no content")
};

webSocketConnection.websocket.onmessage = function incoming(info) {
    hideExtraNote()
    console.log(info);

    let parsedInfo = JSON.parse(info.data)
    let message = parsedInfo.message
    let content = parsedInfo.content

    if (message === "image from server") {
        document.getElementById("imageHolder").src = content
    }
    else if (message === "text from server") {
        let extractedText = content.extracted
        let translatedText = content.translated
        document.getElementById("extractedText").innerHTML = extractedText
        document.getElementById("translatedText").innerHTML = translatedText
    }
};

let extraNote = document.getElementById("extraNote")

function hideExtraNote() {
    extraNote.style.display = "none"
}



