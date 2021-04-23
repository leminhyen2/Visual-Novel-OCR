
const listOfVariablesData = require("./listOfVariablesData.json")
const websocketServerPortNumber = listOfVariablesData.DeepLwebsocketServerPortNumber
//const pythonFlaskServerPortNumber = listOfVariablesData.pythonFlaskServerPortNumber

const fetch = require('node-fetch');

const WebSocket = require('ws');
const webSocketServer = new WebSocket.Server({ port: websocketServerPortNumber });

let copiedTextSubscribingClients = []
let translatedTextSubscribingClients = []

const ClipboardListener = require('clipboard-listener');
let clipboardListener = new ClipboardListener({timeInterval: 100, immediate: false})

const DeepL = require('./DeepLtranslator.js');
const requestBingTranslation = require("./requestBingTranslation")

class DeepLtranslator {
    constructor() {
        this.deepL = new DeepL()
        this.deepLinterval 
    }

    async start() {
        await this.deepL.activate()

        this.deepLinterval = setInterval(async () => {
            let result = await this.deepL.checkIfCurrentTranslationTextChanged(this.deepL.page, this.deepL.resultTextboxID)
            if (result === true) {
                //sendMessageAndContentToAllClients(copiedTextSubscribingClients, "copied text from server", this.deepL.copiedText)
                sendMessageAndContentToAllClients(translatedTextSubscribingClients, "translation from server", this.deepL.currentTranslationText)
            }
        }, 650);
    }
    
    stop() {
        this.deepL.stop()
        clearInterval(this.deepLinterval);
    }
}

let deepLtranslator = new DeepLtranslator()

//deepLtranslator.start()

let currentTranslationMethod = "Bing"
let currentCopiedText = ""

clipboardListener.on('change', async (value) => {
    if ((checkIfJapaneseText(value) === true) && (checkIfCopiedTextHasChanged(value, currentCopiedText) === true)) {

        console.log("Copied text is Japanese. Initiate translation process")
        currentCopiedText = value

        if (currentTranslationMethod === "DeepL") {
            deepLtranslator.deepL.grabCopiedTextThenTranslate(value)
        }
        if (currentTranslationMethod === "Bing") {
            let translationResult = await requestBingTranslation("ja", value, "en")
            sendMessageAndContentToAllClients(copiedTextSubscribingClients, "copied text from server", value)
            sendMessageAndContentToAllClients(translatedTextSubscribingClients, "translation from server", translationResult)
        }
        // if (currentTranslationMethod === "Offline Translator") {
        //     let translationResult = await requestTranslationFromPythonServer(value, "translate sentences", pythonFlaskServerPortNumber)
        //     // sendMessageToServer("ありがとう。来てくれて、嬉しいよ", "translate sentences")
        //     // let translationResult = await requestBingTranslation("ja", value, "en")
        //     sendMessageAndContentToAllClients(copiedTextSubscribingClients, "copied text from server", value)
        //     sendMessageAndContentToAllClients(translatedTextSubscribingClients, "translation from server", translationResult)
        // }

    }
});

webSocketServer.on('connection', (webSocketConnection) => {
    console.log("receive connection request")
	webSocketConnection.on('message', async (data) => {
		let parsedData = JSON.parse(data)

		let message = parsedData.message
		let content = parsedData.content

		console.log('received: %s', message);

		if (message == "subscribe to copied text updates") {
			copiedTextSubscribingClients.push(webSocketConnection)
		}

		if (message == "subscribe to translated text updates") {
            console.log("received message from client")
			translatedTextSubscribingClients.push(webSocketConnection)
        }
        
        if (message == "user requests new translation method") {
            if (content === "DeepL") {
                deepLtranslator.start()
            }
            else {
                deepLtranslator.stop()
            }
            console.log(content)
            currentTranslationMethod = content
		}

	});

	webSocketConnection.on('close', () => {
		removeElementFromArray(webSocketConnection, copiedTextSubscribingClients)
		removeElementFromArray(webSocketConnection, translatedTextSubscribingClients)
	});

});


function sendMessageAndContentToAllClients(listOfClients, thisMessage, thisContent) {
	console.log("server sending messages to window")
	listOfClients.forEach((client) => {
		client.send(JSON.stringify({message: thisMessage, content: thisContent}));
	})
}

async function requestTranslationFromPythonServer(thisContent, thisMessage, serverPort) {  
	let translation = await fetch(`http://localhost:${serverPort}/`, {
			method: 'post',
			body:    JSON.stringify({content: thisContent, message: thisMessage}),
			headers: { 'Content-Type': 'application/json' },
        })
    return translation.json()
}

function checkIfCopiedTextHasChanged(copiedText, currentCopiedText) {
    return !(copiedText === currentCopiedText)
}

function checkIfJapaneseText(text) {
    if (text === undefined) {
        text = "エラーが発生しましたので、もう一度お試しください。"
    }
    else {
        const REGEX_Japanese = /[\u3040-\u30ff\u3400-\u4dbf\u4e00-\u9fff\uf900-\ufaff\uff66-\uff9f]/;
        const hasJapanese = text.match(REGEX_Japanese);
        if (hasJapanese) {
            return true
        }
        else {
            return false
        }
    }
}












