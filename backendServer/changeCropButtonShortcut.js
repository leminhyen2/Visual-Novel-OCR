const fs = require('fs');
const fileName = './keyboardShortcuts.json';
const file = require(fileName);

console.log("#################################################")
console.log("PROCESS STARTING")
console.log("#################################################")
console.log("PRESSS THE BUTTON YOU WANT AS SHORTCUT FOR THE CROP BUTTON")
console.log("#################################################")

function changeCropButtonShortcut(keycode, rawcode) {
    file.cropButton.keycode = keycode;
    file.cropButton.rawcode = rawcode;

    fs.writeFile(fileName, JSON.stringify(file, null, 4), function writeJSON(err) {
        if (err) return console.log(err);
        console.log("#################################################")
        console.log("DONE, YOU CAN CLOSE THIS SETUP PROGRAM NOW")
    });
}


const ioHook = require('iohook');

ioHook.on('keydown', keyboardEvent => {
    changeCropButtonShortcut(keyboardEvent.keycode, keyboardEvent.rawcode)
});

ioHook.start();

