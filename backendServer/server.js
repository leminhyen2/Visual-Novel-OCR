const listOfVariablesData = require("./listOfVariablesData.json")
const httpServerPortNumber = listOfVariablesData.HTTPserverPortNumber
const websocketServerPortNumber = listOfVariablesData.websocketServerPortNumber
const pythonFlaskServerPortNumber = listOfVariablesData.pythonFlaskServerPortNumber

const keyboardShortcuts = require("./keyboardShortcuts.json")
const translationWindowSettings = require("../translationWindowSettings.json")

const fs = require('fs') 

const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const open = require('open');
const cors = require('cors');
const base64Img = require('base64-img');
const fetch = require('node-fetch');

const translateTextInImage = require("./imgTranslation.js")

let extractedLanguage = "ja"
let translationLanguage = "en"

const WebSocket = require('ws');
const webSocketServer = new WebSocket.Server({ port: websocketServerPortNumber });

let capturedImageSubscribingClients = []
let imageSubscribingClients = []
let translationWindow = []
let keyboardSubscribingClients = []

let transparentWindow = []
let mainMenuWindow = []

let imageColorValuesObject = {hMin: 0, sMin: 0, vMin: 0, hMax: 179, sMax: 255, vMax: 255, binarizedValue: 1}
let textPostionObject = { x: 0, y: 0, width: 1000, height: 500 }
let imageOrientation = "horizontal"

const ioHook = require('iohook');

console.log("test test test, you can type anything here then follow my commands")

ioHook.on('keydown', keyboardEvent => {
	//console.log(keyboardEvent)
	if (checkIfTranslateButtonShortcut(keyboardEvent)) {
		sendMessageAndContentToAllClients(keyboardSubscribingClients, "activate translate button", "no content")
	}

	if (checkIfCustomCropButtonShortcut(keyboardEvent)) {
		sendMessageAndContentToAllClients(keyboardSubscribingClients, "activate crop button", "no content")
	}

});

// Register and start hook
ioHook.start();

function checkIfTranslateButtonShortcut(keyboardEvent) {
	return (checkIfBackTickButton(keyboardEvent) || checkIfCustomTranslateButtonShortcut(keyboardEvent))
}

function checkIfBackTickButton(keyboardEvent) {
	return (keyboardEvent.keycode === 41 || keyboardEvent.rawcode === 192)
}

function checkIfCustomTranslateButtonShortcut(keyboardEvent) {
	return (keyboardEvent.keycode === keyboardShortcuts.translateButton.keycode || keyboardEvent.rawcode === keyboardShortcuts.translateButton.rawcode)
}

function checkIfCustomCropButtonShortcut(keyboardEvent) {
	return (keyboardEvent.keycode === keyboardShortcuts.cropButton.keycode || keyboardEvent.rawcode === keyboardShortcuts.cropButton.rawcode)
}


webSocketServer.on('connection', (webSocketConnection) => {
	webSocketConnection.on('message', async (data) => {
		let parsedData = JSON.parse(data)

		let message = parsedData.message
		let content = parsedData.content

		//console.log('received: %s', message);

		if (message == "windowScaleFactor") {
			console.log("window scale factor", content)
			// base64Img.base64('capturedImage.png', function(err, data) {
			// 	sendMessageAndContentToClient(webSocketConnection, "image from server", data)
			// })
		}

		if (message == "subscribe to captured image updates") {
			capturedImageSubscribingClients.push(webSocketConnection)
			// base64Img.base64('capturedImage.png', function(err, data) {
			// 	sendMessageAndContentToClient(webSocketConnection, "image from server", data)
			// })
		}

		if (message == "subscribe to image updates") {
			imageSubscribingClients.push(webSocketConnection)
			// base64Img.base64('colorChangedImage.png', function(err, data) {
			// 	sendMessageAndContentToClient(webSocketConnection, "image from server", data)
			// })
		}

		if (message == "subscribe to text updates") {
			translationWindow.push(webSocketConnection)
			sendMessageAndContentToAllClients(translationWindow, "change GUI settings", translationWindowSettings)
		}

		if (message == "subscribe to keyboard event") {
			keyboardSubscribingClients.push(webSocketConnection)
		}

		if (message == "add transparent window connection") {
			transparentWindow.push(webSocketConnection)
		}

		if (message == "add main menu window connection") {
			mainMenuWindow.push(webSocketConnection)
			sendMessageAndContentToAllClients(mainMenuWindow, "change translation window GUI settings", translationWindowSettings)
		}

		if (message == "check if new complete text image then translate") {
			let result = await sendMessageToServer({imageColorValuesObject:imageColorValuesObject, textPostionObject:textPostionObject}, "check if new complete text image")
			if (result === true) {
				sendMessageAndContentToAllClients(transparentWindow, "get image position", data)

				await delay(50)
	
				sendMessageToServer({imageColorValuesObject:imageColorValuesObject, textPostionObject:textPostionObject}, "crops then changes image color")
	
				await delay(250)

				let extractedText = await Promise.resolve(translateTextInImage('colorChangedImage.png', imageOrientation, extractedLanguage, translationLanguage))
				sendMessageAndContentToAllClients(translationWindow, "extracted text from server", {extracted: extractedText})
	
				// Promise.resolve(translateTextInImage('colorChangedImage.png', imageOrientation, extractedLanguage, translationLanguage))
				// .then(data => {
				// 	sendMessageAndContentToAllClients(translationWindow, "text from server", data)
				// })
	
				base64Img.base64('colorChangedImage.png', function(err, data) {
					sendMessageAndContentToAllClients(imageSubscribingClients, "image from server", data)
				})
	
				base64Img.base64('capturedImage.png', function(err, data) {
					sendMessageAndContentToAllClients(capturedImageSubscribingClients, "image from server", data)
				})
			}
		}

		if (message == "update translation language") {
			translationLanguage = content
		}

		if (message == "update new image color properties") {
			imageColorValuesObject.hMin = content.hueMinValue
			imageColorValuesObject.sMin = content.saturationMinValue
			imageColorValuesObject.vMin = content.valueMinValue
			imageColorValuesObject.hMax = content.hueMaxValue
			imageColorValuesObject.sMax = content.saturationMaxValue
			imageColorValuesObject.vMax = content.valueMaxValue
			imageColorValuesObject.binarizedValue = content.binarizedValue
		}

		if (message == "update new position") {
			console.log("position", content)
			textPostionObject = content
			let ImageWidth = content.width
			let ImageHeight = content.height
			if (ImageHeight > ImageWidth) {
				imageOrientation = "vertical"
				console.log(imageOrientation)
			}
			else {
				imageOrientation = "horizontal"
				console.log(imageOrientation)
			}
		}

		if (message == "translate via crop window") {
			sendMessageToServer({imageColorValuesObject:imageColorValuesObject, textPostionObject:textPostionObject}, "crops then changes image color")

			await delay(250)

			let extractedText = await Promise.resolve(translateTextInImage('colorChangedImage.png', imageOrientation, extractedLanguage, translationLanguage))
			sendMessageAndContentToAllClients(translationWindow, "extracted text from server", {extracted: extractedText})


			// Promise.resolve(translateTextInImage('colorChangedImage.png', imageOrientation, extractedLanguage, translationLanguage))
			// .then(data => {
			// 	sendMessageAndContentToAllClients(translationWindow, "text from server", data)
			// })

			base64Img.base64('colorChangedImage.png', function(err, data) {
				sendMessageAndContentToAllClients(imageSubscribingClients, "image from server", data)
			})

			base64Img.base64('capturedImage.png', function(err, data) {
				sendMessageAndContentToAllClients(capturedImageSubscribingClients, "image from server", data)
			})
		}

		if (message == "translate via transparent window") {
			sendMessageAndContentToAllClients(transparentWindow, "get image position", data)

			await delay(50)

			sendMessageToServer({imageColorValuesObject:imageColorValuesObject, textPostionObject:textPostionObject}, "crops then changes image color")

			await delay(250)

			let extractedText = await Promise.resolve(translateTextInImage('colorChangedImage.png', imageOrientation, extractedLanguage, translationLanguage))
			sendMessageAndContentToAllClients(translationWindow, "extracted text from server", {extracted: extractedText})


			// Promise.resolve(translateTextInImage('colorChangedImage.png', imageOrientation, extractedLanguage, translationLanguage))
			// .then(data => {
			// 	sendMessageAndContentToAllClients(translationWindow, "text from server", data)
			// })

			base64Img.base64('colorChangedImage.png', function(err, data) {
				sendMessageAndContentToAllClients(imageSubscribingClients, "image from server", data)
			})

			base64Img.base64('capturedImage.png', function(err, data) {
				sendMessageAndContentToAllClients(capturedImageSubscribingClients, "image from server", data)
			})
		}

	});

	webSocketConnection.on('close', () => {
		removeElementFromArray(webSocketConnection, imageSubscribingClients)
		removeElementFromArray(webSocketConnection, translationWindow)
		removeElementFromArray(webSocketConnection, capturedImageSubscribingClients)
	});

});


// function sendMessageToServer(thisContent, thisMessage) {  
// 	fetch(`http://localhost:${pythonFlaskServerPortNumber}/`, {
// 			method: 'post',
// 			body:    JSON.stringify({content: thisContent, message: thisMessage}),
// 			headers: { 'Content-Type': 'application/json' },
// 		})
// 		.then(res => res.json())
// 		.then(json => console.log(json));
// }

async function sendMessageToServer(thisContent, thisMessage) {  
	let result = await fetch(`http://localhost:${pythonFlaskServerPortNumber}/`, {
			method: 'post',
			body:    JSON.stringify({content: thisContent, message: thisMessage}),
			headers: { 'Content-Type': 'application/json' },
		})
	
	return result.json()
}

app.use(cors())
app.use(bodyParser.json({limit: '100mb', extended: true}))
app.use(bodyParser.urlencoded({limit: '100mb', extended: true}))

app.post('/', function (req, res) {
    const body = req.body;
    let message = body.message
    let content = body.content

	if (message == "close server") {
		res.send(JSON.stringify({content: "no content", message: "node server closing"}))
		process.exit()
	}

});

app.listen(httpServerPortNumber, function (err) {
  if (err) {
    throw err;
  }

  console.log(`Server started on port ${httpServerPortNumber} and ${webSocketServer}`);
  console.log(`You can now minimize the command lines windows`);
  console.log(`In case the program seems to have errors or not responding, take a look at both cmd windows`);

});

function sendMessageAndContentToClient(client, thisMessage, thisContent) {
	if (makeSureClientIsConnectedToWebSocketServer(client)) {
		client.send(JSON.stringify({message: thisMessage, content: thisContent}));
	}
}

function makeSureClientIsConnectedToWebSocketServer(client) {
  return client.readyState === WebSocket.OPEN
}

function sendMessageAndContentToAllClients(listOfClients, thisMessage, thisContent) {
	console.log("SERVER SENDING MESSAGE TO WINDOWS")
	listOfClients.forEach((client) => {
		client.send(JSON.stringify({message: thisMessage, content: thisContent}));
	})
}

function delay(ms) {
	return new Promise(resolve => setTimeout(resolve, ms));
  }

function removeElementFromArray(thisElement, thisArray) {
	let indexOfElement = thisArray.indexOf(thisElement)
	if (indexOfElement !== -1) {
		thisArray.splice(indexOfElement, 1);
	}
}