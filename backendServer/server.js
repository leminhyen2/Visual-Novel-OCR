const fs = require('fs') 

const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const open = require('open');
const cors = require('cors');
const base64Img = require('base64-img');
const fetch = require('node-fetch');

const translateTextInImage = require("./imgTranslation.js")

const portNumber = 8676
let extractedLanguage = "ja"
let translationLanguage = "en"

const WebSocket = require('ws');
const webSocketServer = new WebSocket.Server({ port: 9676 });

let capturedImageSubscribingClients = []
let imageSubscribingClients = []
let textSubscribingClients = []

let imageColorValuesObject = {hMin: 0, sMin: 0, vMin: 0, hMax: 179, sMax: 255, vMax: 255, binarizedValue: 1}
let textPostionObject = { x: 0, y: 0, width: 1000, height: 500 }

webSocketServer.on('connection', (webSocketConnection) => {
	webSocketConnection.on('message', async (data) => {
		let parsedData = JSON.parse(data)

		let message = parsedData.message
		let content = parsedData.content

		console.log('received: %s', message);

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
			textSubscribingClients.push(webSocketConnection)
			// Promise.resolve(translateTextInImage('colorChangedImage.png', extractedLanguage, translationLanguage))
			// .then(data => {
			// 	sendMessageAndContentToAllClients(textSubscribingClients, "text from server", data)
			// })
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

			console.log(content)
		}

		if (message == "update new position") {
			textPostionObject = content
			console.log(content)
		}

		if (message == "crop and edit this image") {
			console.log("#####################################################################")
			console.log({imageColorValuesObject:imageColorValuesObject, textPostionObject:textPostionObject})
			console.log("#####################################################################")

			sendMessageToServer({imageColorValuesObject:imageColorValuesObject, textPostionObject:textPostionObject}, "crops then changes image color")

			await delay(250)

			Promise.resolve(translateTextInImage('colorChangedImage.png', extractedLanguage, translationLanguage))
			.then(data => {
				sendMessageAndContentToAllClients(textSubscribingClients, "text from server", data)
			})

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
	});

});


function sendMessageToServer(thisContent, thisMessage) {  
	fetch('http://localhost:7676/', {
			method: 'post',
			body:    JSON.stringify({content: thisContent, message: thisMessage}),
			headers: { 'Content-Type': 'application/json' },
		})
		.then(res => res.json())
		.then(json => console.log(json));

}

// app.use(cors())
// app.use(bodyParser.json({limit: '100mb', extended: true}))
// app.use(bodyParser.urlencoded({limit: '100mb', extended: true}))

// app.post('/', function (req, res) {
//     const body = req.body;
//     let message = body.message
//     let content = body.content

//     if (message === "image HSV") {
//         imageColorValuesObject.hMin = content.hueMinValue
//         imageColorValuesObject.sMin = content.saturationMinValue
//         imageColorValuesObject.vMin = content.valueMinValue
//         imageColorValuesObject.hMax = content.hueMaxValue
//         imageColorValuesObject.sMax = content.saturationMaxValue
//         imageColorValuesObject.vMax = content.valueMaxValue

//         console.log("check colors", imageColorValuesObject)
//     }

//     res.send(JSON.stringify({replay: "hello you"}))
// });

app.listen(portNumber, function (err) {
  if (err) {
    throw err;
  }

  console.log(`Server started on port ${portNumber} and 9676`);
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
	console.log("message to all")
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