const fs = require('fs');
const fileName = './keyboardShortcuts.json';
const file = require(fileName);

console.log("#################################################")
console.log("PROCESS STARTING")
console.log("#################################################")
console.log("PRESSS THE BUTTON YOU WANT AS SHORTCUT FOR THE TRANSLATE BUTTON")
console.log("#################################################")

function changeTranslateButtonShortcut(keycode, rawcode) {
    file.translateButton.keycode = keycode;
    file.translateButton.rawcode = rawcode;

    fs.writeFile(fileName, JSON.stringify(file, null, 4), function writeJSON(err) {
        if (err) return console.log(err);
        console.log("#################################################")
        console.log("DONE, YOU CAN CLOSE THIS SETUP PROGRAM NOW")
    });
}


const ioHook = require('iohook');

ioHook.on('keydown', keyboardEvent => {
    changeTranslateButtonShortcut(keyboardEvent.keycode, keyboardEvent.rawcode)
	//console.log(keyboardEvent)

});

ioHook.start();

