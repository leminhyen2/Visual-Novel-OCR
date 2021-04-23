const listOfVariablesData = require("./listOfVariablesData.json")
const websocketServerPortNumber = 15367

class DeepLwebsocketConnection {
    constructor(thisWebsocketClass, thisWebsocketPortNumber=websocketServerPortNumber) {
        this.websocketServerPortNumber = thisWebsocketPortNumber
        this.websocket = new thisWebsocketClass(`ws://localhost:${this.websocketServerPortNumber}/`)
    }
    sendDataToWebSocketServer(thisMessage, thisContent) {
        console.log("this.websocketServerPortNumber", this.websocketServerPortNumber)
        this.websocket.send(JSON.stringify({message: thisMessage, content: thisContent}));
    }
}

module.exports = DeepLwebsocketConnection