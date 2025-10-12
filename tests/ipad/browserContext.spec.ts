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
    test('aria matching ', async ({ page }) => {
        await page.goto('https://www.google.com')
        await expect(page.getByRole('navigation')).toMatchAriaSnapshot(`
    - navigation:
      - link "About":
        - /url: https://about.google/?fg=1&utm_source=google-CA&utm_medium=referral&utm_campaign=hp-header
      - link "Store":
        - /url: https://store.google.com/CA?utm_source=hp_header&utm_medium=google_ooo&utm_campaign=GS100042&hl=en-CA
      - link "Gmail":
        - /url: https://mail.google.com/mail/&ogbl
      - link "Search for Images":
        - /url: https://www.google.com/imghp?hl=en&ogbl
      - button "Google apps":
        - img
      - link "Sign in":
        - /url: https://accounts.google.com/ServiceLogin?hl=en&passive=true&continue=https://www.google.com/&ec=futura_exp_og_so_72776762_e
    `);


    await expect(page.getByRole('contentinfo')).toMatchAriaSnapshot(`
    - link "Advertising":
      - /url: https://www.google.com/intl/en_ca/ads/?subid=ww-ww-et-g-awa-a-g_hpafoot1_1!o2&utm_source=google.com&utm_medium=referral&utm_campaign=google_hpafooter&fg=1
    - link "Business":
      - /url: https://www.google.com/services/?subid=ww-ww-et-g-awa-a-g_hpbfoot1_1!o2&utm_source=google.com&utm_medium=referral&utm_campaign=google_hpbfooter&fg=1
    - link "How Search works":
      - /url: https://google.com/search/howsearchworks/?fg=1
    - link "Privacy":
      - /url: https://policies.google.com/privacy?hl=en-CA&fg=1
    - link "Terms":
      - /url: https://policies.google.com/terms?hl=en-CA&fg=1
    - button "Settings"
    `);
    
    })


})