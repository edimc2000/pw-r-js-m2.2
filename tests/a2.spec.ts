import { expect, test } from '@playwright/test'
import 'dotenv/config'

test.describe('Facebook Login Page Validation', () => {

    test.beforeEach(async ({ page }) => {
        await page.goto('https://www.facebook.com')
    })

    test.afterEach(async ({ page }) => {
        await page.waitForTimeout(500)
    })


    test('[TS-001] Validate the URL, title, fields buttons, contents', async ({ page }) => {
        expect(page.url(), "Validate the URL").toContain('https://www.facebook.com/')
        expect(await page.title(), "Validate the Title").toEqual('Facebook - log in or sign up')
        await expect(page.locator('.fb_logo')).toHaveAttribute('src', 'https://static.xx.fbcdn.net/rsrc.php/y1/r/4lCu2zih0ca.svg')
        await expect(page.locator('h2')).toHaveText('Connect with friends and the world around you on Facebook.')
        await expect(page.locator('#reg_pages_msg')).toHaveText('Create a Page for a celebrity, brand or business.')

        await expect(page.locator('#email')).toBeEnabled()
        await expect(page.locator('#email')).toBeEmpty()
        await expect(page.locator('#email')).toBeEditable()
        await expect(page.locator('#email')).toBeFocused()

        await expect(page.locator('#pass')).toBeEnabled()
        await expect(page.locator('#pass')).toBeEmpty()
        await expect(page.locator('#pass')).toBeEditable()

        await expect(page.getByTestId('royal-login-button')).toBeEnabled()
        await expect(page.getByTestId('royal-login-button')).toHaveText('Log In')

        await expect(page.getByText('Forgot Password')).toHaveAttribute('href', /https:\/\/www\.facebook\.com\/recover\/initiate\/\?privacy_mutation_token.*/)

        await expect(page.getByTestId('open-registration-form-button')).toBeEnabled()
        await expect(page.getByTestId('open-registration-form-button')).toHaveText('Create new account')
    })

    test('[TS-002] Validate login without username and password ', async ({ page }) => {
        await page.getByTestId('royal-login-button').click()
        expect(page.url()).toContain('https://www.facebook.com/login/?privacy_mutation_token')

        expect(page.getByAltText('Facebook')).toHaveAttribute('src', 'https://static.xx.fbcdn.net/rsrc.php/y1/r/4lCu2zih0ca.svg')

        await expect(page.locator('#email')).toBeEnabled()
        await expect(page.locator('#email')).toBeEmpty()
        await expect(page.locator('#email')).toBeEditable()
        await expect(page.locator('#email')).toBeFocused()

        await expect(page.locator('#pass')).toBeEnabled()
        await expect(page.locator('#pass')).toBeEmpty()
        await expect(page.locator('#pass')).toBeEditable()

        await expect(page.getByRole('alert')).toContainText('Wrong CredentialsInvalid username or password')

        await expect(page.locator('#loginbutton')).toBeEnabled()
        await expect(page.locator('#loginbutton')).toHaveText('Log In')

        await expect(page.getByText('Forgot Password')).toHaveAttribute('href', 'https:\/\/www.facebook.com\/recover\/initiate\/?ars=facebook_login&cancel_lara_pswd=0')
    })

    test('[TS-003] Validate login with a non-existent credential ', async ({ page }) => {
        await page.getByTestId('royal-email').fill('test56789@gmail.com')
        await page.locator('#pass').fill('123456789')
        await page.getByTestId('royal-login-button').click()
        await expect(page.getByRole('alert')).toContainText('Wrong CredentialsInvalid username or password')
    })


    test('[TS-004] Validate login with a valid username and incorrect password  ', async ({ page }) => {
        // test.setTimeout(30000);
        await page.getByTestId('royal-email').fill(process.env.FB_USERNAME!)
        await page.locator('#pass').fill('123456789')
        await page.waitForTimeout(2000)
        await page.getByTestId('royal-login-button').click()
        await page.waitForTimeout(30000)
        // await expect(page.locator('div ._9ay7')).toContainText('The password you’ve entered is incorrect.')+
        await page.waitForTimeout(30000)
    })


    test('[TS-005] Validate login with valid credentials', async ({ page }) => {
        test.setTimeout(120000);
        await page.getByTestId('royal-email').fill(process.env.FB_USERNAME!)
        await page.locator('#pass').fill(process.env.FB_PASSWORD!)
        await page.getByTestId('royal-login-button').click()
        

                await page.getByTestId('royal-email').fill(process.env.FB_USERNAME!)
        await page.locator('#pass').fill(process.env.FB_PASSWORD!)
        await page.waitForSelector('[placeholder="Search Facebook"]', { timeout: 120000 })
        // await expect(page.locator('[placeholder="Search Facebook"]' )).toBeVisible()
    })



})