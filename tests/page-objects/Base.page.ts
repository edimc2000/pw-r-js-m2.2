import { Locator, Page } from "@playwright/test";
import path from "path";

export default class Base {
    page: Page
    getFieldGuess: Locator
    getButtonGuess: Locator
    getFrontCardTitle: Locator
    getFrontCardValue: Locator
    getTextMiscTitle: Locator
    getTextAttemptsTitle: Locator
    getTextMessageArea: Locator
    getTextGuesses: Locator
    getTextShowAttempts: Locator
    getCardTitle: Locator
    getCardValue: Locator
    getButtonReset: Locator
    getContainerCard: Locator
    getFirstCardGuessed: Locator
    getCardGuesses: Locator
    
    idLocators: {
        getIdFieldGuess: Locator
        getIdButtonGuess: Locator
        getIdTextMessageArea: Locator
        getIdFrontCardTitle: Locator
        getIdFrontCardValue: Locator
        getIdTextMiscTitle: Locator
        getIdTextGuesses: Locator
        getIdTextAttemptsTitle: Locator
        getIdTextShowAttempts: Locator
        getIdCardTitle: Locator
        getIdCardValue: Locator

        getIdContainerFirstCard: Locator
    }

    constructor(page: Page) {
        this.page = page

        this.getFieldGuess = this.page.locator('#guessField')
        this.getButtonGuess = this.page.locator('button')
        this.getTextMessageArea = this.page.locator('#messageArea')

        this.getFrontCardTitle = this.page.locator('#frontCardTitle')
        this.getFrontCardValue = this.page.locator('#frontCardValue')

        this.getTextMiscTitle = this.page.locator('.miscTitle')
        this.getTextGuesses = this.page.locator('#guesses')

        this.getTextAttemptsTitle = this.page.locator('#attemptsTitle')
        this.getTextShowAttempts = this.page.locator('#showAttempts')

        this.getCardTitle = this.page.locator("#cardTitle")
        this.getCardValue = this.page.locator('#cardValue')
        this.getButtonReset = this.page.locator('#reset')
        this.getContainerCard = this.page.locator('#card')

        this.getFirstCardGuessed = this.page.locator('#guesses>span:first-child')
        this.getCardGuesses = this.page.locator('#guesses')
        
        this.idLocators = {
            getIdFieldGuess: this.page.getByTestId('guessField'),
            getIdButtonGuess: this.page.getByTestId('guessButton'),
            getIdTextMessageArea: this.page.getByTestId('messageArea'),

            getIdFrontCardTitle: this.page.getByTestId('frontCardTitle'),
            getIdFrontCardValue: this.page.getByTestId('frontCardValue'),

            getIdTextMiscTitle: this.page.getByTestId('miscTitle'),
            getIdTextGuesses: this.page.getByTestId('guesses'),

            getIdTextAttemptsTitle: this.page.getByTestId('attemptsTitle'),
            getIdTextShowAttempts: this.page.getByTestId('showAttempts'),

            getIdCardTitle: this.page.getByTestId("cardTitle"),
            getIdCardValue: this.page.getByTestId('cardValue'),

            getIdContainerFirstCard: this.page.locator('#card')
        }
    }

    // async XwaitASec(second: number) {
    //     await this.page.waitForTimeout(second * 1000);
    // }

       waitASec = async (second: number) => await this.page.waitForTimeout(second * 1000)
  
    //   async wait(ms: number) {
    //     await this.page.waitForTimeout(ms);
    //   }

}