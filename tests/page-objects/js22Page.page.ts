import { Locator, Page } from "@playwright/test";

export default class js22Page {
    page: Page
    getTextFrontCardTitle: Locator
    getTextFrontCardValue: Locator
    getFieldGuess: Locator
    getButtonGuess: Locator
    getContainerCard1: Locator
    getContainerGuesses: Locator
    getContainerAttempts: Locator

    constructor(page: Page) {
        this.page = page

        this.getTextFrontCardTitle = page.locator('#frontCardTitle')
        this.getTextFrontCardValue = page.locator('#frontCardValue')
        this.getFieldGuess = page.getByTestId('guessField')
        this.getButtonGuess = page.getByTestId('guessButton')

        this.getContainerCard1 = page.locator('#card')
        this.getContainerGuesses = page.getByTestId('guesses')
        this.getContainerAttempts = page.getByTestId('showAttempts')
    }

    waitASec = async (seconds: number) => {
       await this.page.waitForTimeout(seconds * 1000)
    }


}