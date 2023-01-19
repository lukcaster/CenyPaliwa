const { playwright, chromium } = require('playwright');
const data = [];

    async function getPrices() {
        var browser = await chromium.launch();

        var page = await browser.newPage();

        await page.route('**/*.{png,jpg.jpeg}', route => route.abort());

        await page.goto('https://www.autocentrum.pl/stacje-paliw/');

        await page.getByRole('button', { name: 'AKCEPTUJĘ I PRZECHODZĘ DO SERWISU'}).click();

        await page.route('**/*.{png,jpg.jpeg}', route => route.abort());

        await page.getByPlaceholder('Wpisz nazwę lub adres stacji').click();

        await page.keyboard.insertText('Kraków');

        await page.keyboard.press('Enter');

        await page.route('**/*.{png,jpg.jpeg}', route => route.abort());

        await page.locator('form').filter({ hasText: 'Szukaj' }).getByRole('button', { name: '' });

        await page.getByRole('combobox').selectOption('lpg');

        const prices = await page.$$eval('.station-item', wholeData => {
            wholeData.forEach(price => {
                const stationName = price.querySelector('.address').innerText;
                const address = price.querySelector('.name.shorter').innerText;
                const lpgPrice = price.querySelector('.petrol.lpg').innerText;
                const lastUpdate = price.querySelector('.petrol.lpg').innerHTML;
                data.push({ stationName, address, lpgPrice, lastUpdate });
            })

            return data;
        });
    console.log(prices);
    console.log(prices.length);
    }   

    getPrices();