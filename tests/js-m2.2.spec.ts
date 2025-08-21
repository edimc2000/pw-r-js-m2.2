import { test, expect } from '@playwright/test'
import Base from './page-objects/base.page'

test.describe('Functionality Validation', () => {

    let basePage: Base
    let basePageId: typeof basePage.idLocators

    test.beforeEach(async ({ page }) => {

        const site = 'staging'
        site === 'staging'
            ? await page.goto('http://127.0.0.1:5500/web_dev_basic/HW/eddie-cabangon-js-assignment-M2.2/?randomParam=10') // staging 
            : await page.goto('http://mapleqa.com:8070/js22/?randomParam=10') // live site 

        basePage = new Base(page)
        basePageId = basePage.idLocators
    })

    test('[HW-R-888-001-1a] Validate page elements - using CSS locators (demo)', async ({ page }) => {
        await expect(basePage.getFrontCardTitle).toHaveAttribute('data-testid', 'frontCardTitle')
        expect(await basePage.getFrontCardTitle.innerText()).toContain('GUESS')
        expect(await basePage.getFrontCardTitle.innerText()).toBe('Guess the card value'.toUpperCase())

        await expect(basePage.getFrontCardValue).toHaveText('**')
        await expect(basePage.getFrontCardValue).not.toBeHidden()

        await expect(basePage.getCardTitle).toHaveText('')
        await expect(basePage.getCardValue).toBeEmpty()

        await expect(basePage.getFieldGuess).toBeEnabled()
        await expect(basePage.getFieldGuess).toBeVisible()

        await expect(basePage.getButtonGuess).toBeDisabled()
        await expect(basePage.getButtonGuess).toHaveText('GUESS')

        await expect(basePage.getTextMessageArea).toBeEmpty()

        await expect(basePage.getTextMiscTitle).toHaveText('guesses')
        await expect(basePage.getTextGuesses).toBeEmpty()

        await expect(basePage.getTextAttemptsTitle).toHaveText('ATTEMPTS')
        await expect(basePage.getTextShowAttempts).toBeEmpty()

        await page.waitForTimeout(10)
    })

    test('[HW-R-888-001-1a] Validate page elements - using data-testid POM (demo)', async ({ page }) => {

        await expect(basePageId.getIdFrontCardTitle).toHaveText('Guess the card value')
        await expect(basePageId.getIdFrontCardTitle).toBeVisible()
        await expect(basePageId.getIdFrontCardValue).toHaveText('**')

        await expect(basePageId.getIdCardTitle).toBeEmpty()
        await expect(basePageId.getIdCardValue).toBeEmpty()

        await expect(basePageId.getIdFieldGuess).toBeEnabled()
        await expect(basePageId.getIdFieldGuess).toBeVisible()
        await expect(basePageId.getIdFieldGuess).toBeEditable()

        await expect(basePageId.getIdButtonGuess).toBeDisabled()
        await expect(basePageId.getIdButtonGuess).toHaveText('GUESS')

        await expect(basePageId.getIdTextMessageArea).toBeEmpty()

        await expect(basePageId.getIdTextMiscTitle).toHaveText('guesses')
        await expect(basePageId.getIdTextGuesses).toBeEmpty()

        await expect(basePageId.getIdTextAttemptsTitle).toHaveText('ATTEMPTS')
        await expect(basePageId.getIdTextShowAttempts).toBeEmpty()

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

        await page.waitForTimeout(10)
    })

    test('[HW-R-888-002] Validate max attempts - win', async ({ page }) => {
        for (let i = 1; i <= 10; i++) {
            await page.locator('#guessField').fill(`${i}`)
            await page.locator('#guessButton button').click()
            i === 10
                ? await expect(page.locator('#messageArea')).toContainText('Congratulations')
                : await expect(page.locator('#messageArea')).toContainText('My number is larger')
        }
        await page.waitForTimeout(10)
    })
 
 


    test('[HW-R-888-003] Validate max attempts - lose - click reset', async ({ page }) => {
        for (let i = 11; i <= 20; i++) {
            await page.locator('#guessField').fill(`${i}`)
            await page.locator('#guessButton button').click()
            // console.log (i)
            i === 20
                ? await expect(page.locator('#messageArea')).toContainText('Game Over')
                : await expect(page.locator('#messageArea')).toContainText('My number is smaller')
        }

        await basePage.getButtonReset.click()
        await expect(basePageId.getIdTextShowAttempts).toBeEmpty()
        await page.waitForTimeout(10)
    })
    
    test('[HW-R-888-004] Validate max attempts - lose - pressing enter for reset and guessfield', async ({ page }) => {
        for (let i = 11; i <= 20; i++) {
            await page.locator('#guessField').fill(`${i}`)
            await page.locator('#guessField').press('Enter')
            // await page.locator('#guessButton button').click()
            // console.log (i)
            i === 20
                ? await expect(page.locator('#messageArea')).toContainText('Game Over')
                : await expect(page.locator('#messageArea')).toContainText('My number is smaller')
        }

        await basePage.getButtonReset.press('Enter')
        await expect(basePageId.getIdTextShowAttempts).toBeEmpty()
        await page.waitForTimeout(10)
    })

    test('[HW-R-888-002] Validate max attempts - win pressing enter for reset and guessfield', async ({ page }) => {
        for (let i = 1; i <= 10; i++) {
            await page.locator('#guessField').fill(`${i}`)
            await page.locator('#guessField').press('Enter')
            i === 10
                ? await expect(page.locator('#messageArea')).toContainText('Congratulations')
                : await expect(page.locator('#messageArea')).toContainText('My number is larger')
        }
        await basePage.getButtonReset.press('Enter')
        await expect(basePageId.getIdTextShowAttempts).toBeEmpty()
        // await page.waitForTimeout(10)
    })

    // testing API  *** 
    test.skip('API getUsersList', async ({ request }) => {
        const getUsersList = await request.get("https://gorest.co.in/public/v2/users",
            {
                headers: {
                    'Accept': '*/*',
                    'Authorization': `Bearer b2b30c9695d885f4e8a777bc6e07ff079952706d187b00ff12557da42e47ff8b`
                }
            }
        )

        expect(getUsersList.status()).toEqual(200)
        // debugging
        console.log(getUsersList.status())
        console.log(await getUsersList.json())
        console.log((await getUsersList.json())[1])

        console.log((await getUsersList.json()).length)

    })

})