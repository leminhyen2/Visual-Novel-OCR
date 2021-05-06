const puppeteer = require('puppeteer');

const userSettings = require("../DeepL-Settings.json")

class DeepL {
    constructor() {
        this.browser
        this.page
        this.inputTextboxID = userSettings.inputTextboxID
        this.resultTextboxID = userSettings.resultTextboxID
        this.currentTranslationText = ""
        this.copiedText = ""
    }

    async stop() {
        await this.browser.close();
    }

    async activate() {
        this.browser = await this.launchBrowser();
        [this.page] = await this.browser.pages();	//use the opening page instead of opening a new one
        
        await this.page.setUserAgent('Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/78.0.3904.108 Safari/537.36');
        await this.page.goto(`https://www.deepl.com/en/translator#ja/en/`);
        await this.page.waitForSelector(this.inputTextboxID);
        await this.page.waitForSelector(this.resultTextboxID)
    
        this.initiateTranslation("こんにちは DeepL")
    }

    async launchBrowser() {
        let launchOptions = { headless: userSettings.hideBrowserWindowTrueOrFalse, defaultViewport: null, args: ['--start-maximized'] };
        let chromium = puppeteer.launch(launchOptions)
        return chromium;
    }

    async initiateTranslation(textToBeTranslated) {
        const input = await this.page.$(this.inputTextboxID);
        await input.click({ clickCount: 3 })
        await input.type("");
    
        await this.page.type(this.inputTextboxID, textToBeTranslated);
    }

    async translateWithDeepL(originalLanguage, targetLanguage, textToBeTranslated) {
        this.copiedText = textToBeTranslated

        const input = await this.page.$(this.inputTextboxID);
        await input.click({ clickCount: 3 })
        await input.type("");

        //await this.page.type(this.inputTextboxID, textToBeTranslated);
        //await this.page.goto('https://www.deepl.com/en/translator#ja/en/'+textToBeTranslated);
        await this.page.focus(this.inputTextboxID);
        await this.page.goto('https://www.deepl.com/en/translator#ja/en/'+textToBeTranslated);
        //await this.page.keyboard.sendCharacter(textToBeTranslated);
    }

    async checkIfCurrentTranslationTextChanged(thisPage, resultTextboxID) {
        let textInTranslationBox = await this.returnTranslationText(thisPage, resultTextboxID)

        let result = false
    
        if (textInTranslationBox != this.currentTranslationText) {
            this.currentTranslationText = textInTranslationBox
            result = true
        }

        return result
    }
    
    async returnTranslationText(thisPage, resultTextboxID) {
        let translationText = await thisPage.evaluate((resultTextboxID) => {
            const element = document.querySelector(resultTextboxID);
            return element.textContent; // will return undefined if the element is not found
        }, resultTextboxID);

        return translationText
    }

    grabCopiedTextThenTranslate(copiedText) {
        this.copiedText = copiedText
        this.translateWithDeepL("ja", "en", this.copiedText)
    }

}

module.exports = DeepL