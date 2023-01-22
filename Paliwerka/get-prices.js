const playwright = require('playwright');

(async () => {
    const browser = await playwright.chromium.launch();

    const page = await browser.newPage();

    await page.route('**/*.{png,jpg.jpeg}', route => route.abort());

    await page.goto('https://www.autocentrum.pl/stacje-paliw/');

    await page.getByRole('button', { name: 'AKCEPTUJĘ I PRZECHODZĘ DO SERWISU' }).click();

    await page.route('**/*.{png,jpg.jpeg}', route => route.abort());

    await page.getByPlaceholder('Wpisz nazwę lub adres stacji').click();

    await page.keyboard.insertText('Kraków');

    await page.keyboard.press('Enter');

    await page.route('**/*.{png,jpg.jpeg}', route => route.abort());

    await page.locator('form').filter({ hasText: 'Szukaj' }).getByRole('button', { name: '' });

    await page.getByRole('combobox').selectOption('lpg');

    const prices = await page.$$eval('.station-item', wholeData => {
        const data = [];
        wholeData.forEach(price => {
            const stationName = price.querySelector('.address').innerText;
            const address = price.querySelector('.name').innerText;
            const petrol = price.getElementsByClassName('petrol');

            const petrolPrices = [];
            const lastUpdate = [];
            for (var i = 0; i < petrol.length; i++) {
                var value = petrol[i].innerText;
                var title = petrol[i].getAttribute('title');
                petrolPrices.push({ value });
                lastUpdate.push({ title })
            }
            data.push({ stationName, address });

            data.concat(petrolPrices);

            data.concat(lastUpdate);
        })

        return data;
    });
    await browser.close();
})
    ();
