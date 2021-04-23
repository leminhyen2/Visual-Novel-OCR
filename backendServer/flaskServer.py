from flask import Flask
from flask import request
from flask_cors import CORS, cross_origin

import json
import takeScreenshot as screenshot 
import removeBackground as background

import checkImage

app = Flask(__name__)

cors = CORS(app)
app.config['CORS_HEADERS'] = 'Content-Type'

@app.route("/", methods = ['POST'])
@cross_origin()

def sendImage():
    data = request.get_json()
    message = data.get("message")
    content = data.get("content")

    print("this content", content)
    if (message == "crops then changes image color"):
        textPostionObject = content["textPostionObject"]
        x = textPostionObject["x"]
        y = textPostionObject["y"]
        width = textPostionObject["width"]
        height = textPostionObject["height"]
        screenshot.takeScreenshot(y, x, width, height)

        imageColorValuesObject = content["imageColorValuesObject"]
        print(imageColorValuesObject)
        hMin = imageColorValuesObject["hMin"]
        sMin = imageColorValuesObject["sMin"]
        vMin = imageColorValuesObject["vMin"]
        hMax = imageColorValuesObject["hMax"]
        sMax = imageColorValuesObject["sMax"]
        vMax = imageColorValuesObject["vMax"]
        binarizedValue = imageColorValuesObject["binarizedValue"]
        background.removeBackground(hMin, sMin, vMin, hMax, sMax, vMax, binarizedValue)

    if (message == "crops image at this position"):
        x = content["x"]
        y = content["y"]
        width = content["width"]
        height = content["height"]

        screenshot.takeScreenshot(y, x, width, height)
        print(content)
    
    if (message == "check if new complete text image"):
        textPostionObject = content["textPostionObject"]
        x = textPostionObject["x"]
        y = textPostionObject["y"]
        width = textPostionObject["width"]
        height = textPostionObject["height"]
        screenshot.takeScreenshot(y, x, width, height)

        imageColorValuesObject = content["imageColorValuesObject"]
        hMin = imageColorValuesObject["hMin"]
        sMin = imageColorValuesObject["sMin"]
        vMin = imageColorValuesObject["vMin"]
        hMax = imageColorValuesObject["hMax"]
        sMax = imageColorValuesObject["sMax"]
        vMax = imageColorValuesObject["vMax"]
        binarizedValue = imageColorValuesObject["binarizedValue"]
        background.removeBackground(hMin, sMin, vMin, hMax, sMax, vMax, binarizedValue)

        result = checkImage.checkIfNewFullTextImage("colorChangedImage.png")
        return json.dumps(result)

        # x = content["x"]
        # y = content["y"]
        # width = content["width"]
        # height = content["height"]

        # screenshot.takeScreenshot(y, x, width, height)

        # result = checkImage.checkIfNewFullTextImage("capturedImage.png")
        # print(result)
        # return json.dumps(result)

    if (message == "changes image color"):
        hMin = content["hMin"]
        sMin = content["sMin"]
        vMin = content["vMin"]
        hMax = content["hMax"]
        sMax = content["sMax"]
        vMax = content["vMax"]
        binarizedValue = content["binarizedValue"]

        background.removeBackground(hMin, sMin, vMin, hMax, sMax, vMax, binarizedValue)
        print(content)

    if (message == "close server"):
        shutdown_server()

    return json.dumps(content)

def shutdown_server():
    func = request.environ.get('werkzeug.server.shutdown')
    if func is None:
        raise RuntimeError('Not running with the Werkzeug Server')
    func()

if __name__ == "__main__":
    app.run()