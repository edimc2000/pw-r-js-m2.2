import { test, expect, chromium } from '@playwright/test'


test.describe('Browser Context', () => {

    test('New Page Context @smoke @login', async () => {
        const chPage = await chromium.launch()
        const newcontext = await chPage.newContext()
        const newChPage = await newcontext.newPage()

        const chPage2 = await chromium.launch()
        const newcontext2 = await chPage2.newContext()
        const newChPage2 = await newcontext2.newPage()
        await newChPage.goto('https://www.facebook.com')
        await newChPage2.goto('https://www.google.com')

        // await newChPage.waitForTimeout(5000)
        await newChPage2.waitForTimeout(5000)

        await chPage.close()
        await chPage2.close()

    })


    test('New Page Context 1', async ({ page }) => {
        await page.goto('https://mapleqa.com/js23/')
        await expect(page).toHaveScreenshot()
        await page.waitForTimeout(1000)
    })


})