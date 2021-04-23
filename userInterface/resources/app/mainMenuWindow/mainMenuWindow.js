const WebSocketConnection = require("../WebsocketConnection.js")
const webSocketConnection = new WebSocketConnection(WebSocket);

let translationWindowBackgroundTransparency = false

let translationWindowGUIsettings = {}

webSocketConnection.websocket.onopen = () => {
    webSocketConnection.sendDataToWebSocketServer("add main menu window connection", "no content")
};
webSocketConnection.websocket.onmessage = function incoming(info) {
    console.log(info);
    let parsedInfo = JSON.parse(info.data)
    let message = parsedInfo.message
    let content = parsedInfo.content

    if (message === "change translation window GUI settings") {
        translationWindowGUIsettings = content
    }
    
};

const {
    ipcRenderer,
    desktopCapturer,
    screen,
    shell, 
    remote,
} = require('electron');

const BrowserWindow = remote.BrowserWindow;

let screenCaptureWindowPosition 
let TextCaptureWindow = {}

const app = require('electron').remote.app;

window.onbeforeunload = function(){
    app.quit()
}

// let listOfLanguages = new Map(Object.entries({
//     "English": "en",
//     "Spanish": "es",
//     "French": "fr",
//     "Russian": "ru",
//     "Korean": "ko",
//     "Chinese (simplified)": "zh-Hans",
//     "Chinese (traditional)": "zh-Hant",
//     "Indonesian": "id",
//     "Vietnamese": "vi",
//     "Thai": "th",
//     "Afrikaans": "af",
//     "Arabic": "ar",
//     "Bangla": "bn",
//     "Bosnian": "bs",
//     "Bulgarian": "bg",
//     "Cantonese (traditional)": "yue",
//     "Catalan": "ca",
//     "Croatian": "hr",
//     "Czech": "cs",
//     "Danish": "da",
//     "Dutch": "nl",
//     "Estonian": "et",
//     "Fijian": "fj",
//     "Filipino": "fil",
//     "Finnish": "fi",
//     "German": "de",
//     "Greek": "el",
//     "Haitian Creole": "ht",
//     "Hebrew": "he",
//     "Hindi": "hi",
//     "Hmong Daw": "mww",
//     "Hungarian": "hu",
//     "Icelandic": "is",
//     "Irish": "ga",
//     "Italian": "it",
//     "Japanese": "ja",
//     "Kannada": "kn",
//     "Klingon": "tlh",
//     "Latvian": "lv",
//     "Lithuanian": "lt",
//     "Malagasy": "mg",
//     "Malay": "ms",
//     "Malayalam": "ml",
//     "Maltese": "mt",
//     "Maori": "mi",
//     "Norwegian": "nb",
//     "Persian": "fa",
//     "Polish": "pl",
//     "Portuguese (Brazil)": "pt",
//     "Portuguese (Portugal)": "pt-pt",
//     "Punjabi": "pa",
//     "Romanian": "ro",
//     "Samoan": "sm",
//     "Serbian (Cyrillic)": "sr-Cyrl",
//     "Serbian (Latin)": "sr-Latn",
//     "Slovak": "sk",
//     "Slovenian": "sl",
//     "Swahili": "sw",
//     "Swedish": "sv",
//     "Tahitian": "ty",
//     "Tamil": "ta",
//     "Telugu": "te",
//     "Tongan": "to",
//     "Turkish": "tr",
//     "Ukrainian": "uk",
//     "Urdu": "ur",
//     "Welsh": "cy",
//     "Yucatec Maya": "yua"
// }))

// const selectElement = document.getElementById("languagesSelection"); 

// for (let [key, value] of listOfLanguages) {
//     let optionElement = document.createElement("option");
//     optionElement.textContent = key;
//     optionElement.value = value;
//     selectElement.appendChild(optionElement);
// }

// selectElement.addEventListener("change", requestServerToUpdateNewTranslationLanguage);

// function requestServerToUpdateNewTranslationLanguage() {
//     let newLanguage = selectElement.value;
//     webSocketConnection.sendDataToWebSocketServer("update translation language", newLanguage)
// }
const DeepLwebsocketServerPortNumber = 15367
const DeepLwebSocketConnection = new WebSocketConnection(WebSocket, DeepLwebsocketServerPortNumber);

DeepLwebSocketConnection.websocket.onopen = function() {
    console.log("connecting to deepL")
    DeepLwebSocketConnection.sendDataToWebSocketServer("hello translation server", "no content")
};

const translatorsSelection = document.getElementById("translatorsSelection")
translatorsSelection.addEventListener("change", requestServerToUpdateNewTranslators);

function requestServerToUpdateNewTranslators() {
    let newTranslator = translatorsSelection.value;
    DeepLwebSocketConnection.sendDataToWebSocketServer("user requests new translation method", newTranslator)
}


// ipcRenderer.on('new coordinates from screen capture window', (event, arg) => {
//     screenCaptureWindowPosition = arg
//     console.log("new position",screenCaptureWindowPosition) 
// })

// console.log(ipcRenderer.sendSync('synchronous-message', 'ping')) // prints "pong"


// ipcRenderer.send('asynchronous-message', 'ping')

sendMessageToUser("Be aware of the outline window, it's border is thin and quite transparent so you might not see it. Don't forget to setup background removal settings after your first captured image")

document.getElementById("generateAllWindow").onclick = (e) => {
    generateImageSettingsWindow()
    generateTranslationWindow()
    generateScreenCaptureWindow()
    generateTransparentWindow()
    minimizeCurrentWindow()
}

// document.getElementById("generateImageSettingsWindow").onclick = (e) => {
//     generateImageSettingsWindow()
// }

// document.getElementById("generateTextCaptureWindow").onclick = (e) => {
//     generateTextCaptureWindow()
// }

// document.getElementById("generateTranslationWindow").onclick = (e) => {
//     generateTranslationWindow()
// }

const generateImageSettingsWindow = () => {
    TextCaptureWindow = new BrowserWindow({
        title: "Background Removal Window",
        x: -150,
        y: 0,
        width: 900,
        height: 1100,
        alwaysOnTop: true,
        webPreferences: {
            enableRemoteModule: true,
            nodeIntegration: true
        }
  });
    TextCaptureWindow.loadFile('./imageSettingsWindow/imageSettingsWindow.html')
}

const generateScreenCaptureWindow = (mode) => {
    let keyPositionsObject = getAllKeysPostiionMetrics()
    let screenCaptureWindow

    screenCaptureWindow = new BrowserWindow({
        title: "Screen Capture Window",
        opacity: 1,
        x: 850,
        y: 50,
        width: 250,
        height: 150,
        transparent: false,
        frame: true,
        alwaysOnTop: true,
        webPreferences: {
            enableRemoteModule: true,
            nodeIntegration: true
        }
    });
    screenCaptureWindow.loadFile('./screenCaptureWindow/screenCaptureWindow.html')

}

const generateTranslationWindow = () => {
    let translationWindow = {}
    translationWindow = new BrowserWindow({
        title: "Translation Display Window",
        opacity: 0.7,
        x: 800,
        y: 200,
        width: 550,
        height: 200,
        transparent: translationWindowGUIsettings.fullyTransparentBackground,
        frame: translationWindowGUIsettings.showMenuFrame,
        alwaysOnTop: true,
        webPreferences: {
            enableRemoteModule: true,
            nodeIntegration: true
        }
  });
    translationWindow.loadFile('./translationWindow/translationWindow.html')
    //translationWindow.removeMenu()
}

const generateTransparentWindow = () => {
    let transparentWindow = {}

    transparentWindow = new BrowserWindow({
        opacity: 0.5,
        x: 700,
        y: 500,
        width: 700,
        height: 120,
        transparent: true,
        frame: false,
        alwaysOnTop: true,
        webPreferences: {
            enableRemoteModule: true,
            nodeIntegration: true
        }
    });
    transparentWindow.loadFile('./transparentWindow/transparentWindow.html')
}

function sendMessageToUser(message) {
    document.getElementById("messageContainer").innerHTML = message
}

function getAllKeysPostiionMetrics() {
    return remote.getCurrentWindow().getNormalBounds()
}

function minimizeCurrentWindow() {
    return remote.getCurrentWindow().minimize()
}


