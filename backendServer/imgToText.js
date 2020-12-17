 const tesseract = require("./node-tesseract-ocr.js")

module.exports =  async function (imageFile, imageOrientation="horizontal") {
	let config
	if (imageOrientation === "horizontal") {
		config = {
			lang: "jpn",
			oem: 1,
			psm: 6,
		}
	}
	else {
		config = {
			lang: "jpn_vert",
			oem: 1,
			psm: 3,
		}
	}


	try{
		text = await tesseract.recognize(imageFile, config)
	}
	catch(error){
		console.log(error.message)
	}

	const jpTextWithNoSpace = text.replace(/\s/g, '')
	return jpTextWithNoSpace
}


