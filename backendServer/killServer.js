const fetch = require('node-fetch');


function sendMessageToServer(thisContent, thisMessage) {  
	fetch('http://localhost:7676/', {
			method: 'post',
			body:    JSON.stringify({content: thisContent, message: thisMessage}),
			headers: { 'Content-Type': 'application/json' },
		})
		.then(res => res.json())
		.then(json => console.log(json));

}

sendMessageToServer("no content", "close server")