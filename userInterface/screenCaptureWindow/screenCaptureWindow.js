
const {remote} = require('electron');
const BrowserWindow = remote.BrowserWindow; 
let thisWindow = remote.getCurrentWindow(); 

document.getElementById("lockModeButton").addEventListener("click", (event) => { 
    generateTextCaptureWindow("transparentMode")
    thisWindow.close();
})

const generateTextCaptureWindow = (mode) => {
    let keyPositionsObject = getAllKeysPostiionMetrics()
    let TextCaptureWindow

    switch(mode) {
        case "transparentMode":
            TextCaptureWindow = new BrowserWindow({
                opacity: 0.5,
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
            TextCaptureWindow.loadFile('./screenCaptureWindow/transparentWindow/transparentWindow.html')
            break
    }
}

function getAllKeysPostiionMetrics() {
    return remote.getCurrentWindow().getNormalBounds()
}





