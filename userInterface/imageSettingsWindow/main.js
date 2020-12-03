const cv = require("./opencv.js")

class ServerConnection {
    constructor() {
        this.server = 'http://localhost:8676/'
    }

    async sendingData(thisContent, thisMessage) {
        const response = await fetch(this.server, {
            method: 'POST', // or 'PUT'
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({content: thisContent, message: thisMessage})
        })
        
        const textData = await response.json()

        console.log(textData)
        return textData
    }
}

let serverConnection = new ServerConnection()

// let canvas = document.getElementById("canvasOutput");
// let ctx = canvas.getContext("2d");
// ctx.fillStyle = "black";
// ctx.fillRect(0, 0, canvas.width, canvas.height);

class OriginalImage {
    constructor () {
        this.imgElement = document.getElementById('imageSrc');
        this.inputElement = document.getElementById('fileInput');
    }

    listenForLoad() {
        // this.inputElement.addEventListener('change', (e) => {
        //     this.imgElement.src = URL.createObjectURL(e.target.files[0]);
        // }, false);

        this.imgElement.onload = () => {
            let image = cv.imread(this.imgElement);
            cv.imshow('canvasOutput', image)
            image.delete()
            editedImage.updatesChange()
        }
    }

}

let originalImage = new OriginalImage()
originalImage.listenForLoad()


const webSocketConnection = new WebSocket('ws://localhost:9676/');
webSocketConnection.onopen = function() {
    sendDataToWebSocketServer("subscribe to captured image updates", "no content")
  //webSocketConnection.send("subscribe to image updates");
};
webSocketConnection.onmessage = function incoming(info) {
    console.log(info);
    let parsedInfo = JSON.parse(info.data)
    let message = parsedInfo.message
    let content = parsedInfo.content
    if (message === "image from server") {
        document.getElementById("imageSrc").src = content
    }

};
function sendDataToWebSocketServer(thisMessage, thisContent) {
    webSocketConnection.send(JSON.stringify({message: thisMessage, content: thisContent}));
}


class EditedImage {
    constructor() {
        this.hueMinValue = 0
        this.saturationMinValue = 0
        this.valueMinValue = 0
        this.hueMaxValue = 179
        this.saturationMaxValue = 255
        this.valueMaxValue = 255

        this.binarizedValue = 1

        this.imgElement = document.getElementById('imageSrc');
    }

    returnImageColorValues() {
        return {hueMinValue: this.hueMinValue, saturationMinValue: this.saturationMinValue,
                valueMinValue: this.valueMinValue, hueMaxValue: this.hueMaxValue,
                saturationMaxValue: this.saturationMaxValue, valueMaxValue: this.valueMaxValue, binarizedValue: this.binarizedValue}
    }

    updateHueMinValue(newValue) {
        sendDataToWebSocketServer("update new image color properties", this.returnImageColorValues())
        this.hueMinValue = newValue
        this.updatesChange()
    }

    updateSaturationMinValue(newValue) {
        sendDataToWebSocketServer("update new image color properties", this.returnImageColorValues())
        this.saturationMinValue = newValue
        this.updatesChange()
    }

    updateValueMinValue(newValue) {
        sendDataToWebSocketServer("update new image color properties", this.returnImageColorValues())
        this.valueMinValue = newValue
        this.updatesChange()
    }

    updateHueMaxValue(newValue) {
        sendDataToWebSocketServer("update new image color properties", this.returnImageColorValues())
        this.hueMaxValue = newValue
        this.updatesChange()
    }

    updateSaturationMaxValue(newValue) {
        sendDataToWebSocketServer("update new image color properties", this.returnImageColorValues())
        this.saturationMaxValue = newValue
        this.updatesChange()
    }

    updateValueMaxValue(newValue) {
        sendDataToWebSocketServer("update new image color properties", this.returnImageColorValues())

        this.valueMaxValue = newValue
        this.updatesChange()
    }

    updateBinarizedValue(newValue) {
        sendDataToWebSocketServer("update new image color properties", this.returnImageColorValues())

        this.binarizedValue = newValue
        this.updatesChange()
    }

    updatesChange() {
        //serverConnection.sendingData(this.returnImageColorValues(), "image HSV")
        console.log(this.hueMinValue, this.saturationMinValue, this.valueMinValue, this.hueMaxValue, this.saturationMaxValue, this.valueMaxValue)
        let lower = new cv.Scalar(this.hueMinValue, this.saturationMinValue, this.valueMinValue)
        let upper = new cv.Scalar(this.hueMaxValue, this.saturationMaxValue, this.valueMaxValue)

        let image = cv.imread(this.imgElement)
        let hsv = new cv.Mat()
        let mask = new cv.Mat()
        let output = new cv.Mat()

        cv.cvtColor(image, hsv, cv.COLOR_RGBA2RGB);
        cv.cvtColor(hsv, hsv, cv.COLOR_RGB2HSV);

        // cv.cvtColor(image, hsv, cv.COLOR_BGRA2RGB);
        // cv.cvtColor(hsv, hsv, cv.COLOR_BGR2HSV);

        let lowerBound = new cv.Mat(hsv.rows, hsv.cols, hsv.type(), lower);
        let higherBound = new cv.Mat(hsv.rows, hsv.cols, hsv.type(), upper);

        cv.inRange(hsv, lowerBound, higherBound, mask)
        cv.bitwise_and(image, image, output, mask= mask)

        cv.cvtColor(output, output, cv.COLOR_RGBA2RGB);
        cv.imshow('canvasOutput', output)

        let binarizedOutput = new cv.Mat()
        cv.threshold(output, binarizedOutput, this.binarizedValue, 255, cv.THRESH_BINARY_INV); 
        cv.imshow('finalizedCanvasOutput', binarizedOutput)

        image.delete()
        hsv.delete()
        mask.delete()
        output.delete()
        binarizedOutput.delete()
        lowerBound.delete()
        higherBound.delete()
    }

}

let editedImage = new EditedImage()

class Slider {
    constructor(receivedSliderElement, receivedSliderValueElement) {
        this.sliderElement = receivedSliderElement 
        this.sliderValueElement = receivedSliderValueElement
    }

    getValue() {
        return this.sliderElement.value 
    }
}

class CollectionOfSliders {
    constructor () {
        this.hueMinSlider = new Slider(document.getElementById("hueMinSlider"), document.getElementById("hueMinValue"))
        this.saturationMinSlider = new Slider(document.getElementById("saturationMinSlider"), document.getElementById("saturationMinValue"))
        this.valueMinSlider = new Slider(document.getElementById("valueMinSlider"), document.getElementById("valueMinValue"))
        this.hueMaxSlider = new Slider(document.getElementById("hueMaxSlider"), document.getElementById("hueMaxValue"))
        this.saturationMaxSlider = new Slider(document.getElementById("saturationMaxSlider"), document.getElementById("saturationMaxValue"))
        this.valueMaxSlider = new Slider(document.getElementById("valueMaxSlider"), document.getElementById("valueMaxValue"))

        this.binarizedSlider = new Slider(document.getElementById("binarizedSlider"), document.getElementById("binarizedValue"))

    }

    hueMinSliderListen() {
        this.hueMinSlider.sliderValueElement.innerHTML = this.hueMinSlider.getValue()

        this.hueMinSlider.sliderElement.oninput = () => {
            let sliderValue = this.hueMinSlider.getValue()
            this.hueMinSlider.sliderValueElement.innerHTML = sliderValue
            editedImage.updateHueMinValue(parseInt(sliderValue))
        }
    }

    saturationMinSliderListen() {
        this.saturationMinSlider.sliderValueElement.innerHTML = this.saturationMinSlider.getValue()

        this.saturationMinSlider.sliderElement.oninput = () => {
            let sliderValue = this.saturationMinSlider.getValue()
            this.saturationMinSlider.sliderValueElement.innerHTML = sliderValue
            editedImage.updateSaturationMinValue(parseInt(sliderValue))
        }
    }
    

    valueMinSliderListen() {
        this.valueMinSlider.sliderValueElement.innerHTML = this.valueMinSlider.getValue()

        this.valueMinSlider.sliderElement.oninput = () => {
            let sliderValue = this.valueMinSlider.getValue()
            this.valueMinSlider.sliderValueElement.innerHTML = sliderValue
            editedImage.updateValueMinValue(parseInt(sliderValue))
        }
    }

    hueMaxSliderListen() {
        this.hueMaxSlider.sliderValueElement.innerHTML = this.hueMaxSlider.getValue()

        this.hueMaxSlider.sliderElement.oninput = () => {
            let sliderValue = this.hueMaxSlider.getValue()
            this.hueMaxSlider.sliderValueElement.innerHTML = sliderValue
            editedImage.updateHueMaxValue(parseInt(sliderValue))
        }
    }

    saturationMaxSliderListen() {
        this.saturationMaxSlider.sliderValueElement.innerHTML = this.saturationMaxSlider.getValue()

        this.saturationMaxSlider.sliderElement.oninput = () => {
            let sliderValue = this.saturationMaxSlider.getValue()
            this.saturationMaxSlider.sliderValueElement.innerHTML = sliderValue
            editedImage.updateSaturationMaxValue(parseInt(sliderValue))
        }
    }

    valueMaxSliderListen() {
        this.valueMaxSlider.sliderValueElement.innerHTML = this.valueMaxSlider.getValue()

        this.valueMaxSlider.sliderElement.oninput = () => {
            let sliderValue = this.valueMaxSlider.getValue()
            this.valueMaxSlider.sliderValueElement.innerHTML = sliderValue
            editedImage.updateValueMaxValue(parseInt(sliderValue))
        }
    }

    binarizedSliderListen() {
        this.binarizedSlider.sliderValueElement.innerHTML = this.binarizedSlider.getValue()

        this.binarizedSlider.sliderElement.oninput = () => {
            let sliderValue = this.binarizedSlider.getValue()
            this.binarizedSlider.sliderValueElement.innerHTML = sliderValue
            editedImage.updateBinarizedValue(parseInt(sliderValue))
        }
    }

    listen() {
        this.hueMinSliderListen()
        this.saturationMinSliderListen()
        this.valueMinSliderListen()
        this.hueMaxSliderListen()
        this.saturationMaxSliderListen()
        this.valueMaxSliderListen()

        this.binarizedSliderListen()

    }
}


let collectionOfSliders = new CollectionOfSliders()
collectionOfSliders.listen()