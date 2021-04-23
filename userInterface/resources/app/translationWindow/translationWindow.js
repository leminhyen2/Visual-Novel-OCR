const {remote} = require('electron');
let thisWindow = remote.getCurrentWindow(); 

const WebSocketConnection = require("../WebsocketConnection.js")
const webSocketConnection = new WebSocketConnection(WebSocket);

const DeepLwebsocketServerPortNumber = 15367
const DeepLwebSocketConnection = new WebSocketConnection(WebSocket, DeepLwebsocketServerPortNumber);

let hideExtractedText = false
let hideTextImage = false
let textTypingEffect = false

DeepLwebSocketConnection.websocket.onopen = function() {
    console.log("connecting to deepL")
    DeepLwebSocketConnection.sendDataToWebSocketServer("subscribe to translated text updates", "no content")
};

DeepLwebSocketConnection.websocket.onmessage = async function incoming(info) {
    console.log(info);

    let parsedInfo = JSON.parse(info.data)
    let message = parsedInfo.message
    let content = parsedInfo.content

    if (message === "translation from server") {
        let translatedText = content
        console.log(translatedText)

        if (textTypingEffect === false) {
            document.getElementById("translatedText").innerHTML = translatedText
        }
        else {
            await typingOutText(translatedText, "translatedText", 25)
        }
    }
};


async function typingOutText(text, textElementID, speed) {
    document.getElementById(textElementID).innerHTML = ""
    await typeWriter(text, textElementID, speed)
}

async function typeWriter(text, textElementID, speed) {
    for (let i=0; i<text.length; i++) {
        document.getElementById(textElementID).innerHTML += text.charAt(i);
        await delay(speed)
    }
}


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

    if (message === "change GUI settings") {
        let GUIsettings = content
        thisWindow.setOpacity(GUIsettings.opacity)
        hideExtractedText = GUIsettings.hideExtractedText
        hideTextImage = GUIsettings.hideTextImage
        textTypingEffect = GUIsettings.textTypingEffect
        document.getElementById("translatedText").style.color = GUIsettings.textColor;
    }

    if (message === "image from server") {
        if (hideTextImage === false) {
            document.getElementById("imageHolder").src = content
        }
    }

    if (message === "extracted text from server") {
        if (hideExtractedText === false) {
            let extractedText = content.extracted
            document.getElementById("extractedText").innerHTML = extractedText
        }
        else {
            document.getElementById("extractedText").innerHTML = ""
        }
    }

};

let extraNote = document.getElementById("extraNote")

function hideExtraNote() {
    extraNote.style.display = "none"
}

function delay(ms) {
	return new Promise(resolve => setTimeout(resolve, ms));
}

