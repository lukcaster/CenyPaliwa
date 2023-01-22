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
            
            const petrol = price.getElementsByClassName('petrol lpg');

            
            for (var i = 0; i < petrol.length; i++) {
                const stationName = price.querySelector('.address').innerText;
                const address = price.querySelector('.name').innerText;
                var petrolPrice = petrol[i].innerText;
                var lastUpdatedOn = petrol[i].getAttribute('title');
                data.push({ stationName, address, petrolPrice, lastUpdatedOn });
            }
            
        })
        return data;

    });
    console.log(prices);

    //Todo add file saving and work on filters for different petrol
    await browser.close();
})
    ();
