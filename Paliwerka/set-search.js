const { page, expect } = require('@playwright/test');

async function setSearch(miasto, sortowanie) {
    var searchField = await page.locator('.search-box').getByRole('input');

    await searchField.fill(miasto);

    await Promise.all([
        page.waitForNavigation(),
        page.locator('.search-button').getByRole('button').click()
        ]);

    expect(page).toHaveURL('https://www.autocentrum.pl/stacje-paliw/?s=1&order=&q=Krak%C3%B3w');

    await page.selectOption('sort-select')
}

export { setSearch };