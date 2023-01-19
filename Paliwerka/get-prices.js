const { chromium } = require('playwright');
// import { setSearch } from './set-search';
// TODO fix importing functions

    async function getPrices() {
        var browser = await chromium.launch({
            headless: false
        });

        var page = await browser.newPage();
        await page.goto('https://www.autocentrum.pl/stacje-paliw/');

        await Promise.all([
            page.waitForNavigation(),
            page.getByRole('button', { name: 'AKCEPTUJĘ I PRZECHODZĘ DO SERWISU'}).click()
        ]);

        page.waitForTimeout(2000);

        var searchField = await page.locator('.search-box').getByRole('input');

        await searchField.fill('Kraków');

        await Promise.all([
            page.waitForNavigation(),
            page.locator('.search-button').getByRole('button').click()
        ]);

        expect(page).toHaveURL('https://www.autocentrum.pl/stacje-paliw/?s=1&order=&q=Krak%C3%B3w');

        await page.selectOption('sort-select')
    }

    getPrices();