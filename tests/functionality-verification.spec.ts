import { test, expect } from '@playwright/test'
import Base from './page-objects/base.page'

test.describe('Functionality Verification', () => {
    let basePage: Base
    let locatorsId: typeof basePage.idLocators

    test.beforeEach('', async ({ page }) => {
        // await page.goto('https://mapleqa.com/js22/?randomParam=12')
        await page.goto('http://127.0.0.1:5500/web_dev_basic/HW/eddie-cabangon-js-assignment-M2.2/?randomParam=12')
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

        await expect(locatorsId.getIdAttemptsHeader).toHaveText('ATTEMPTS')
        await expect(locatorsId.getIdTextMiscTitle).toHaveText('guesses')
    })

    test('TS888-002: Verify "GUESS" Button Enables/Disables with Input', async ({ page }) => {
        await expect(locatorsId.getIdButtonGuess).toBeDisabled()
        await locatorsId.getIdFieldGuess.fill('1')
        await expect(locatorsId.getIdButtonGuess).toBeEnabled()
        await locatorsId.getIdFieldGuess.clear()
        await expect(locatorsId.getIdButtonGuess).toBeDisabled()
    })


    test('TS888-003: Verify Correct Guess on First Attempt (Win Condition)', async ({ page }) => {
        let guessNumber = '12'

        await locatorsId.getIdFieldGuess.fill(guessNumber)
        await locatorsId.getIdFieldGuess.press('Enter')
        // await locatorsId.getIdButtonGuess.click()

        await expect.soft(locatorsId.getIdContainerFirstCard).toContainClass('flipped')
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

    test('TS888-005: Verify "My number is smaller" Feedback', async ({ page }) => {
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

        // await basePage.waitASec(0.005)
    })


    test('TS888-006: Validate Input Boundary (Lower): Number 1', async ({ page }) => {
        let guessInput: string = '1'

        await locatorsId.getIdFieldGuess.fill(guessInput)
        await locatorsId.getIdButtonGuess.click()
        await expect(basePage.getCardGuesses).toContainText(guessInput)
        await expect(locatorsId.getIdTextShowAttempts).toHaveText("1 / 10")
    })

    test('TS888-007: Validate Input Boundary (Upper): Number 50', async ({ page }) => {
        let guessInput: string = '50'
        await locatorsId.getIdFieldGuess.fill(guessInput)
        await locatorsId.getIdButtonGuess.click()
        await expect(locatorsId.getIdTextMessageArea).toHaveText('My number is smaller.\n Try Again!')
        await expect(locatorsId.getIdTextShowAttempts).toHaveText('1 / 10')
    })

    test('TS888-008: Verify Error for Out-of-Range Input (Low: 0)', async ({ page }) => {
        let guessInput: string = '0'
        await locatorsId.getIdFieldGuess.fill(guessInput)
        await locatorsId.getIdButtonGuess.click()
        await expect(locatorsId.getIdTextMessageArea).toHaveText('ERROR:Input should be between 1 & 50')
        await expect(locatorsId.getIdTextShowAttempts).toHaveText('0 / 10')
        await expect(locatorsId.getIdTextGuesses).not.toHaveText(guessInput)
    })

    test('TS888-009: Verify Error for Out-of-Range Input (High: 51)', async ({ page }) => {
        let guessInput: string = '51'
        await locatorsId.getIdFieldGuess.fill(guessInput)
        await locatorsId.getIdButtonGuess.click()
        await expect(locatorsId.getIdTextMessageArea).toHaveText('ERROR:Input should be between 1 & 50')
        await expect(locatorsId.getIdTextShowAttempts).toHaveText('0 / 10')
        await expect(locatorsId.getIdTextGuesses).not.toHaveText(guessInput)
    })

    test('TS888-010: Verify Error for Negative Input', async ({ page }) => {
        let guessInput: string = '-5'
        await locatorsId.getIdFieldGuess.fill(guessInput)
        await locatorsId.getIdButtonGuess.click()
        await expect(locatorsId.getIdTextMessageArea).toHaveText('ERROR:Input should be between 1 & 50')
        await expect(locatorsId.getIdTextShowAttempts).toHaveText('0 / 10')
        await expect(locatorsId.getIdTextGuesses).not.toHaveText(guessInput)
    })

    test('TS888-011: Verify Error for Non-Numeric Input', async ({ page }) => {
        let guessInput: string = 'ab'
        await locatorsId.getIdFieldGuess.fill(guessInput)
        await locatorsId.getIdButtonGuess.click()
        await expect(locatorsId.getIdTextMessageArea).toHaveText('ERROR:Input should be between 1 & 50')
        await expect(locatorsId.getIdTextShowAttempts).toHaveText('0 / 10')
        await expect(locatorsId.getIdTextGuesses).not.toHaveText(guessInput)
    })

    test('*TS888-012: Verify Game Over After 10 Incorrect Attempts (Lose Condition)', async ({ page }) => {
        let secretNumber = '12'
        for (let i = 1; i <= 10; i++) {
            await locatorsId.getIdFieldGuess.fill(`${i}`)
            await locatorsId.getIdButtonGuess.click()
        }
        await expect(locatorsId.getIdTextShowAttempts).toHaveText('10 / 10')
        await expect(locatorsId.getIdCardValue).toHaveText(`${secretNumber}`)
        await expect(locatorsId.getIdTextMessageArea).toHaveText('Game Over! You\'ve used all your attempts.')

        await expect(locatorsId.getIdButtonGuess).not.toBeAttached()
        await expect.soft(basePage.getButtonReset).toBeAttached()
        await expect.soft(basePage.getButtonReset).toBeVisible()
        await expect.soft(basePage.getButtonReset).toBeEnabled()
        await expect(locatorsId.getIdFieldGuess).toBeDisabled()
        // await basePage.waitASec(1)
    })

    test('TS888-013: Verify "RESET" Button Functionality After Win', async ({ page }) => {

        for (let i = 3; i <= 12; i++) {
            await locatorsId.getIdFieldGuess.fill(`${i}`)
            await locatorsId.getIdButtonGuess.click()
        }

        await basePage.getButtonReset.click()

        //TS888-001 checks 
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

        // await basePage.waitASec(1)

    })


    test('TS888-014: Verify "RESET" Button Functionality After Loss', async ({ page }) => {
        for (let i = 13; i <= 22; i++) {
            await locatorsId.getIdFieldGuess.fill(`${i}`)
            await locatorsId.getIdButtonGuess.click()
        }

        await basePage.getButtonReset.click()

        //TS888-001 checks 
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

        // await basePage.waitASec(1)
    })


    test('TS888-015: Verify Attempts Counter Increments Only on Valid Guesses', async ({ page }) => {
        let guessInput: string[][] = [["0", "60", "5", "30", "12"], ["0", "0", "1", "2", "3"]]

        for (let index = 0; index < guessInput[0].length; index++) {
            await locatorsId.getIdFieldGuess.fill(`${guessInput[0][index]}`)
            await locatorsId.getIdButtonGuess.click()
            await expect(basePage.getTextAttemptCounter).toHaveText(`${guessInput[1][index]}`)
        }
        // await basePage.waitASec(10)
    })

    test('TS888-016: Verify Sequential Guesses with Mixed Feedback', async ({ page }) => {
        let guessInput: string[][] = [
            ['5', '20', '12'],
            ['My number is larger.\n Try Again!', 'My number is smaller.\n Try Again!', 'Congratulations! You guessed the number!'],
            []
        ]

        for (let index = 0; index < guessInput[0].length; index++) {
            await locatorsId.getIdFieldGuess.fill(guessInput[0][index])
            await locatorsId.getIdButtonGuess.click()
            await expect(locatorsId.getIdTextMessageArea).toHaveText(guessInput[1][index])
        }

        // await locatorsId.getIdFieldGuess.fill(guessInput[0])
        // await locatorsId.getIdButtonGuess.click()
        // await expect(locatorsId.getIdTextMessageArea).toHaveText(My number is larger.\n Try Again!)

        // await locatorsId.getIdFieldGuess.fill(guessInput[1])
        // await locatorsId.getIdButtonGuess.click()

        // await expect(locatorsId.getIdTextMessageArea).toHaveText('My number is smaller.\n Try Again!')

        // await locatorsId.getIdFieldGuess.fill(guessInput[2])
        // await locatorsId.getIdButtonGuess.click()
        // await expect(locatorsId.getIdTextMessageArea).toHaveText('Congratulations! You guessed the number!')

        await expect(basePage.getCardGuesses).toContainText(guessInput[0].join(''))
        await expect(locatorsId.getIdTextShowAttempts).toHaveText(`${guessInput[0].length} / 10`)

        await expect(locatorsId.getIdFieldGuess).toBeEmpty()
        await expect(locatorsId.getIdFieldGuess).not.toBeFocused()
        await expect(locatorsId.getIdFieldGuess).not.toBeEnabled()

        // await basePage.waitASec(0.5)
    })

    test('TS888-017: Verify Input via Keyboard "Enter" Key', async ({ page }) => {
        let guessInput = '5'
        await locatorsId.getIdFieldGuess.fill(guessInput)
        await locatorsId.getIdFieldGuess.press('Enter')

        await expect(locatorsId.getIdTextMessageArea).toHaveText('My number is larger.\n Try Again!')
        await expect(basePage.getFirstCardGuessed).toContainText(guessInput)
        await expect(locatorsId.getIdTextShowAttempts).toHaveText('1 / 10')

        await expect(locatorsId.getIdFieldGuess).toBeEmpty()
        await expect(locatorsId.getIdFieldGuess).toBeFocused()

    })


    test('TS888-018: Verify Previous Guesses Styling and Order', async ({ page }) => {
        let guessInput: string[] = ['5', '20', '12']

        for (let index = 0; index < guessInput.length; index++) {
            await locatorsId.getIdFieldGuess.fill(guessInput[index])
            await locatorsId.getIdFieldGuess.press('Enter')
        }

        for (let index = 0; index < guessInput.length; index++) {
            index === guessInput.length - 1
                ? await expect(basePage.getCardGuessesIndividual.nth(index)).toContainClass('boxed guessed')
                : await expect(basePage.getCardGuessesIndividual.nth(index)).toContainClass('boxed')
        }
        await expect(locatorsId.getIdTextGuesses).toHaveText(guessInput.join(''))


    })



    test('TS888-019: Verify Mixed Out-of-Range and Valid Attempts Count', async ({ page }) => {
        let guessInput: string[][] =
            [
                ["0", "60", "5", "30", "12"],
                ["0", "0", "1", "2", "3"],
                [
                    'ERROR:Input should be between 1 & 50',
                    'ERROR:Input should be between 1 & 50',
                    'My number is larger.\n Try Again!',
                    'My number is smaller.\n Try Again!',
                    'Congratulations! You guessed the number!'
                ]
            ]

        for (let index = 0; index < guessInput[0].length; index++) {
            await locatorsId.getIdFieldGuess.fill(`${guessInput[0][index]}`)
            await locatorsId.getIdButtonGuess.click()
            await expect(basePage.getTextAttemptCounter).toHaveText(`${guessInput[1][index]}`)
            await expect(locatorsId.getIdTextMessageArea).toHaveText(`${guessInput[2][index]}`)
        }

    })


    test('TS888-020: Verify guess field is focused if mouse is used', async ({ page }) => {
        const guessInput: string = '10'
        await locatorsId.getIdFieldGuess.fill(`${guessInput}`)
        await locatorsId.getIdButtonGuess.click()
        await expect(locatorsId.getIdFieldGuess).toBeFocused()
    })

})