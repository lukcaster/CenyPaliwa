const fs = require('fs');
const { playwright } = require('playwright');
const path = require('path');
import { SetSearch } from './set-search';

(async () => {
    const browser = await playwright.chromium.launch();

    const page = await browser.newPage();

    await page.goto('https://www.autocentrum.pl/stacje-paliw/');

    await page.getByRole('button', { name: 'AKCEPTUJĘ I PRZECHODZĘ DO SERWISU' }).click();

    await page.waitForTimeout(1000);

    await page.reload();

    await page.waitForLoadState('domcontentloaded', { timeout: 1000000 });

    var setSearch = new SetSearch(page, 'Kraków', 'lpg');

    await setSearch.inputTown();

    const prices = await page.$$eval('.station-item', wholeData => {
        const data = [];
        wholeData.forEach(price => {

            const petrol = price.getElementsByClassName('petrol lpg');

            for (var i = 0; i < petrol.length; i++) {
                const stationName = price.querySelector('.address').innerText;
                const address = price.querySelector('.name').innerText;
                const petrolPrice = petrol[i].innerText;
                const lastUpdatedOn = petrol[i].getAttribute('title');
                data.push({ stationName, address, petrolPrice, lastUpdatedOn });
            }

        });
        return data;

    });
    console.log(prices);

    var string = '| Station Name | Address | Price | Last Updated |' + '\n'
        + '| -----------  | ------- | ----- | ------------ |' + '\n';
    for (const { stationName: a, address: b, petrolPrice: c, lastUpdatedOn: d } of prices) {
        string += '| ' + a + ' | ' + b + ' | ' + c + ' | ' + d + ' |' + '\n';
    }

    fs.writeFile(path.join(__dirname, 'README.md'), string, (error) => {
        if (error) {
            console.log(error);
        } else {
            console.log('File written successfully\n');
            console.log('The written has the following contents:');
            console.log(fs.readFileSync('README.md', 'utf8'));
        }
    });
    await browser.close();
})
    ();
