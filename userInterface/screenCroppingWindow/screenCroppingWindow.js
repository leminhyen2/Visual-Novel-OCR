const { remote } = require('electron')
let thisWindow = remote.getCurrentWindow(); 

const WebSocketConnection = require("../WebsocketConnection.js")
const webSocketConnection = new WebSocketConnection(WebSocket);

webSocketConnection.websocket.onopen = function() {
    webSocketConnection.sendDataToWebSocketServer("screen cropping window activated", "no content")
};
webSocketConnection.websocket.onmessage = function incoming(info) {
    console.log(info);
    let parsedInfo = JSON.parse(info.data)
    let message = parsedInfo.message
    let content = parsedInfo.content
};

let mainCanvas = document.getElementById("mainCanvas")
let mainContext = mainCanvas.getContext('2d')

function enlargeCanvasToWindowSize() {
    mainCanvas.width = document.documentElement.clientWidth
    mainCanvas.height = document.documentElement.clientHeight
}

enlargeCanvasToWindowSize()

class RectangleOutline {
    constructor() {
        this.mainCanvas = mainCanvas
        this.mainContext = mainContext
    }

    generate(x, y, width, height) {
        this.mainContext.beginPath(); 
        this.mainContext.fillStyle='rgba(255, 0, 0, 0.5)';
        this.mainContext.fillRect(x, y, width, height);
        this.mainContext.stroke();
    }

    remove(x, y, width, height) {
        this.mainContext.clearRect(x, y, width, height);
    }

    removeAll() {
        this.mainContext.clearRect(0, 0, this.mainCanvas.width, this.mainCanvas.height);
    }

}

class CreateMode {
    constructor(RectangleOutlineClass) {
        this.button = document.getElementById("createMode")
        this.eventsListenerMode = "off"
        this.drag = false
        this.rect = {}
        this.cursorCoordinates = {}
        this.mainCanvas = mainCanvas
        this.mainContext = mainContext

        this.rectangleOutline = RectangleOutlineClass
    }

    turnOn() {
        this.listenToDrag()
    }

    listenToDrag() {
        if (this.eventsListenerMode == "off") {
            this.eventsListenerMode = "on"
            this.startDrawing()
            this.finishDrawing()
        }
    }

    startDrawing() {
        this.mainCanvas.addEventListener("mousedown", (e) => this.mouseDown(e))
        this.mainCanvas.addEventListener("mousemove", (e) => this.mouseMove(e))
    }

    finishDrawing() {
        this.mainCanvas.addEventListener("mouseup", (e) => this.mouseUp(e))
    }

    mouseDown(e) {
        console.log("this point", remote.screen.getCursorScreenPoint())
        this.cursorCoordinates.startX = remote.screen.getCursorScreenPoint().x
        this.cursorCoordinates.startY = remote.screen.getCursorScreenPoint().y

        this.rect.startX = e.pageX - this.mainCanvas.offsetLeft;
        this.rect.startY = e.pageY - this.mainCanvas.offsetTop;
        this.drag = true;
    }

    mouseMove(e) {
        if (this.drag) {
            this.rect.width = (e.pageX - this.mainCanvas.offsetLeft) - this.rect.startX;
            this.rect.height = (e.pageY - this.mainCanvas.offsetTop) - this.rect.startY;
            this.rectangleOutline.removeAll()
            this.rectangleOutline.generate(this.rect.startX, this.rect.startY, this.rect.width, this.rect.height)
        }
    }

    mouseUp(e) {
        let cursorEndX = remote.screen.getCursorScreenPoint().x
        let cursorEndY = remote.screen.getCursorScreenPoint().y

        this.cursorCoordinates.width = cursorEndX - this.cursorCoordinates.startX;
        this.cursorCoordinates.height = cursorEndY - this.cursorCoordinates.startY;

        this.resetDefault() 
        this.sendImageCoordinatesToServer()
    }

    resetDefault() {
        this.drag = false;
        this.rectangleOutline.removeAll()
    }

    sendImageCoordinatesToServer() {
        let imagePosition = {x: this.cursorCoordinates.startX, y: this.cursorCoordinates.startY, width: this.cursorCoordinates.width, height: this.cursorCoordinates.height}
        console.log(imagePosition)
        webSocketConnection.sendDataToWebSocketServer("update new position", imagePosition)
        webSocketConnection.sendDataToWebSocketServer("crop and edit this image", "no content")
        thisWindow.close();
    }
}

new CreateMode(new RectangleOutline()).turnOn()

