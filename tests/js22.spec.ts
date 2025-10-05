import { test, expect } from '@playwright/test'
import js22Page from './page-objects/js22Page.page'


test.describe('Number Guessing Game Validation', () => {

    let numberGuessingPage: js22Page

    test.beforeEach('', async ({ page }) => {
        await page.goto('https://mapleqa.com/js22/?randomParam=12')
        numberGuessingPage = new js22Page(page)
    })


    test('TS888-001: Verify Initial Application State on Load', async ({ page }) => {
        await expect(numberGuessingPage.getTextFrontCardTitle).toContainText('Guess the card value')
        await expect(numberGuessingPage.getTextFrontCardValue).toContainText('**')
        await page.waitForTimeout(1000)
    })


    test('TS888-003: Verify Correct Guess on First Attempt (Win Condition)', async ({ page }) => {

        await numberGuessingPage.getFieldGuess.fill('12')
        await expect(numberGuessingPage.getFieldGuess).not.toBeEmpty()

        await numberGuessingPage.getButtonGuess.click()
        await expect(numberGuessingPage.getContainerCard1).toHaveClass(/flipped/);
        await expect(numberGuessingPage.getContainerGuesses).toHaveText('12');
        await expect(numberGuessingPage.getContainerGuesses).toHaveText('12');
        await expect(numberGuessingPage.getContainerAttempts).toHaveText('1 / 10');
        // await page.waitForTimeout(10000)
        await numberGuessingPage.waitASec(10)

    })

})