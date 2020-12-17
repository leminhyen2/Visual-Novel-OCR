const request = require('request');

module.exports = async function requestBingTranslation(originalLang, mainText, languageDesired) {
    let translation = new Promise( (resolve, reject) => {request.post({url:'http://www.bing.com/ttranslatev3/', form: {fromLang:originalLang, text:mainText, to:languageDesired}}, function optionalCallback(err, httpResponse, body) {
            if (err) {
                console.error('translation error:', err);
                resolve("Connection error to Bing Translation. Make sure your internet is up. If the problem persisted, use translation feature of Translation Aggregator as last resort")
            }
            else {
                resolve(JSON.parse(body)[0].translations[0].text)
            }
        })
    })
    return translation
} 



