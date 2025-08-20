import { Locator, Page } from "@playwright/test";
import path from "path";

export default class Base {
    page: Page
    getFieldGuess: Locator
    getButtonGuess: Locator
    getFrontCardTitle: Locator
    getFrontCardValue: Locator
    getTextMiscTitle: Locator
    getTextAttempts: Locator

    constructor(page: Page) {
        this.page = page
        this.getFieldGuess = page.locator('#guessField')
        this.getButtonGuess = page.locator('button')
        this.getFrontCardTitle = page.locator('#frontCardTitle')
        this.getFrontCardValue = page.locator('#frontCardValue')
        this.getTextMiscTitle  = page.locator('.miscTitle')
        this.getTextAttempts = page.locator('#attempts')

    }


}