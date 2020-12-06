const webSocketConnection = new WebSocket('ws://localhost:9676/');

webSocketConnection.onopen = function() {
    sendDataToWebSocketServer("subscribe to image updates", "no content")
    sendDataToWebSocketServer("subscribe to text updates", "no content")
//   webSocketConnection.send("subscribe to image updates");
//   webSocketConnection.send("subscribe to text updates");
};

function sendDataToWebSocketServer(thisMessage, thisContent) {
    webSocketConnection.send(JSON.stringify({message: thisMessage, content: thisContent}));
}

webSocketConnection.onmessage = function incoming(info) {
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
