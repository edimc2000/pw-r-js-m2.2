import { test, expect } from '@playwright/test'
import Base from './page-objects/base.page'

test.describe('Functionality Validation', () => {

    let basePage: Base

    test.beforeEach(async ({ page }) => {
        await page.goto('http://mapleqa.com:8070/js22/?randomParam=10')
        basePage = new Base(page)
    })

    test('[HW-R-888-001] Validate page elements', async ({ page }) => {
        await expect(basePage.getFieldGuess).toBeEnabled()
        await expect(basePage.getFieldGuess).toBeVisible()

        await expect(basePage.getButtonGuess).toBeDisabled()
        await expect(basePage.getButtonGuess).toHaveText('GUESS')

        await expect(basePage.getFrontCardTitle).toHaveAttribute('id', 'frontCardTitle')
        expect(await basePage.getFrontCardTitle.innerText()).toContain('GUESS')
        expect(await basePage.getFrontCardTitle.innerText()).toBe('Guess the card value'.toUpperCase())

        await expect(basePage.getFrontCardValue).toHaveText('**')
        await expect(basePage.getFrontCardValue).not.toBeHidden()

        await expect(basePage.getTextMiscTitle).toHaveText('guesses')

        await expect(basePage.getTextAttempts).toHaveText('ATTEMPTS')

        await page.waitForTimeout(10)

    })


    test('[HW-R-888-001-1] Validate page\'s basic functionality', async ({ page }) => {
        await page.locator('#guessField').fill('20')
        await page.locator('#guessField').press('Enter')
        await expect(page.locator('#messageArea')).toContainText('My number is smaller')

        await page.locator('#guessField').fill('5')
        await page.locator('#guessButton button').click()
        await expect(page.locator('#messageArea')).toContainText('My number is larger')

        await page.locator('#guessField').fill('A')
        await page.locator('#guessButton button').click()
        await expect(page.locator('#messageArea')).toContainText('Input should be between 1 & 5')

        await page.locator('#guessField').fill('-10')
        await page.locator('#guessButton button').click()
        await expect(page.locator('#messageArea')).toContainText('Input should be between 1 & 5')

        await page.locator('#guessField').fill('60')
        await page.locator('#guessButton button').click()
        await expect(page.locator('#messageArea')).toContainText('Input should be between 1 & 5')

        await page.locator('#guessField').fill('10')
        await page.locator('#guessButton button').click()
        await expect.soft(page.locator('#messageArea')).toContainText('Congratulations')

        // await page.waitForTimeout(10)
    })

    test('[HW-R-888-002] Validate max attempts - win', async ({ page }) => {
        for (let i = 1; i <= 10; i++) {
            await page.locator('#guessField').fill(`${i}`)
            await page.locator('#guessButton button').click()
            i === 10
                ? await expect(page.locator('#messageArea')).toContainText('Congratulations')
                : await expect(page.locator('#messageArea')).toContainText('My number is larger')
        }
        // await page.waitForTimeout(10)
    })

    test('[HW-R-888-003] Validate max attempts - lose', async ({ page }) => {
        for (let i = 11; i <= 20; i++) {
            await page.locator('#guessField').fill(`${i}`)
            await page.locator('#guessButton button').click()
            // console.log (i)
            i === 20
                ? await expect(page.locator('#messageArea')).toContainText('Game Over')
                : await expect(page.locator('#messageArea')).toContainText('My number is smaller')
        }
        // await page.waitForTimeout(10)
    })

})