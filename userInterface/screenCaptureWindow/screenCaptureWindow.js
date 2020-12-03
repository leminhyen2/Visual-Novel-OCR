
const {remote} = require('electron');

const BrowserWindow = remote.BrowserWindow; 


let thisWindow = remote.getCurrentWindow(); 

let lockModeButton = document.getElementById("lockModeButton"); 
lockModeButton.addEventListener("click", (event) => { 
    generateTextCaptureWindow("transparentMode")
    thisWindow.close();
})

const generateTextCaptureWindow = (mode) => {
    let keyPositionsObject = getAllKeysPostiionMetrics()
    let TextCaptureWindow

    switch(mode) {
        case "moveAroundMode":
            TextCaptureWindow = new BrowserWindow({
                title: "Text Capture Window",
                opacity: 0.7,
                width: keyPositionsObject.width,
                height: keyPositionsObject.height,
                x: keyPositionsObject.x,
                y: keyPositionsObject.y,
                alwaysOnTop: true,
                webPreferences: {
                    enableRemoteModule: true,
                    nodeIntegration: true
                }
            });
            TextCaptureWindow.loadFile('./screenCaptureWindow/screenCaptureWindow.html')

            break

        case "transparentMode":
            TextCaptureWindow = new BrowserWindow({
                opacity: 0.7,
                width: keyPositionsObject.width,
                height: keyPositionsObject.height,
                x: keyPositionsObject.x,
                y: keyPositionsObject.y,
                transparent: true,
                frame: false,
                alwaysOnTop: true,
                webPreferences: {
                    enableRemoteModule: true,
                    nodeIntegration: true
                }
            });
            TextCaptureWindow.loadFile('./screenCaptureWindow/transparentWindow.html')

            break
    }
}

function getAllKeysPostiionMetrics() {
    return remote.getCurrentWindow().getNormalBounds()
}





