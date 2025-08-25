import { test, expect } from '@playwright/test'
import Base from './page-objects/base.page'

test.describe('Functionality Verification', () => {
    let basePage: Base
    let locatorsId: typeof basePage.idLocators

    test.beforeEach('', async ({ page }) => {
        await page.goto('http://mapleqa.com:8070/js22/?randomParam=12')
        basePage = new Base(page)
        locatorsId = basePage.idLocators
    })

    test('TS888-001: Verify Initial Application State on Load', async ({ page }) => {
        await expect(locatorsId.getIdFrontCardTitle).toHaveText('Guess the card value')
        await expect(locatorsId.getIdFrontCardValue).toHaveText('**')

        await expect(locatorsId.getIdFieldGuess).toBeFocused()
        await expect(locatorsId.getIdFieldGuess).toBeEmpty()
        await expect(locatorsId.getIdFieldGuess).toBeEnabled()

        await expect(locatorsId.getIdButtonGuess).toHaveText('GUESS')
        await expect(locatorsId.getIdButtonGuess).toBeDisabled()

        await expect(locatorsId.getIdTextMessageArea).toBeEmpty()

        await expect(locatorsId.getIdTextGuesses).toBeEmpty()
        await expect(locatorsId.getIdTextShowAttempts).toBeEmpty()
    })

    test('*TS888-002: Verify "GUESS" Button Enables/Disables with Input', async ({ page }) => {
        await expect(locatorsId.getIdButtonGuess).toBeDisabled()
        await locatorsId.getIdFieldGuess.fill('1')
        await expect(locatorsId.getIdButtonGuess).toBeEnabled()
        await locatorsId.getIdFieldGuess.clear()
        await expect(locatorsId.getIdButtonGuess).toBeDisabled()
    })


    test('TS888-003: Verify Correct Guess on First Attempt (Win Condition)', async ({ page }) => {
        let guessNumber = '12'

        await locatorsId.getIdFieldGuess.fill(guessNumber)
        await locatorsId.getIdButtonGuess.click()

        await expect(locatorsId.getIdContainerFirstCard).toContainClass('flipped')
        await expect(locatorsId.getIdCardValue).toHaveText(guessNumber)

        await expect(locatorsId.getIdTextMessageArea).toHaveText('Congratulations! You guessed the number!')

        await expect(locatorsId.getIdButtonGuess).not.toBeAttached()
        await expect.soft(basePage.getButtonReset).toBeAttached()
        await expect.soft(basePage.getButtonReset).toBeVisible()
        await expect.soft(basePage.getButtonReset).toBeEnabled()

        await expect(basePage.getFirstCardGuessed).toHaveText(guessNumber)
        await expect(basePage.getFirstCardGuessed).toContainClass('guessed')

        await expect(locatorsId.getIdFieldGuess).toBeDisabled()

        await expect(locatorsId.getIdTextShowAttempts).toHaveText('1 / 10')
    })

    test('TS888-004: Verify "My number is larger" Feedback', async ({ page }) => {
        let guessInput = '5'
        await locatorsId.getIdFieldGuess.fill(guessInput)
        await locatorsId.getIdFieldGuess.press('Enter')

        await expect(locatorsId.getIdTextMessageArea).toHaveText('My number is larger.\n Try Again!')
        await expect(basePage.getFirstCardGuessed).toContainText(guessInput)
        await expect(locatorsId.getIdTextShowAttempts).toHaveText('1 / 10')

        await expect(locatorsId.getIdFieldGuess).toBeEmpty()
        await expect(locatorsId.getIdFieldGuess).toBeFocused()
    })

    test('*TS888-005: Verify "My number is smaller" Feedback', async ({ page }) => {
        let guessInput: string[] = ['1', '20']

        await locatorsId.getIdFieldGuess.fill(guessInput[0])
        await locatorsId.getIdButtonGuess.click()

        await locatorsId.getIdFieldGuess.fill(guessInput[1])
        await locatorsId.getIdButtonGuess.click()

        await expect(locatorsId.getIdTextMessageArea).toHaveText('My number is smaller.\n Try Again!')
        await expect(basePage.getCardGuesses).toContainText(guessInput[1])
        await expect(locatorsId.getIdTextShowAttempts).toHaveText(`${guessInput.length} / 10`)

        await expect(locatorsId.getIdFieldGuess).toBeEmpty()
        await expect(locatorsId.getIdFieldGuess).toBeFocused()

        await basePage.waitASec(0.005)
    })


    test('*TS888-006: Validate Input Boundary (Lower): Number 1', async ({ page }) => {
        let guessInput: string = '1'

        await locatorsId.getIdFieldGuess.fill(guessInput)
        await locatorsId.getIdButtonGuess.click()
        await expect(basePage.getCardGuesses).toContainText(guessInput)
        await expect(locatorsId.getIdTextShowAttempts).toHaveText("1 / 10")
    })


    test('TS888-016: Verify Sequential Guesses with Mixed Feedback', async ({ page }) => {
        let guessInput: string[] = ['5', '20', '12']

        await locatorsId.getIdFieldGuess.fill(guessInput[0])
        await locatorsId.getIdButtonGuess.click()
        await expect(locatorsId.getIdTextMessageArea).toHaveText('My number is larger.\n Try Again!')

        await locatorsId.getIdFieldGuess.fill(guessInput[1])
        await locatorsId.getIdButtonGuess.click()

        await expect(locatorsId.getIdTextMessageArea).toHaveText('My number is smaller.\n Try Again!')

        await locatorsId.getIdFieldGuess.fill(guessInput[2])
        await locatorsId.getIdButtonGuess.click()
        await expect(locatorsId.getIdTextMessageArea).toHaveText('Congratulations! You guessed the number!')

        await expect(basePage.getCardGuesses).toContainText(guessInput.join(''))
        await expect(locatorsId.getIdTextShowAttempts).toHaveText(`${guessInput.length} / 10`)

        await expect(locatorsId.getIdFieldGuess).toBeEmpty()
        await expect(locatorsId.getIdFieldGuess).not.toBeFocused()
        await expect(locatorsId.getIdFieldGuess).not.toBeEnabled()


    })
})