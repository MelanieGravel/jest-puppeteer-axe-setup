const util = require('util');
const puppeteer = require('puppeteer');
const axe = require('axe-core');
const fs = require('fs');

const writeToFile = (data, name) => {
    try {
        const dir = './logs';
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir);
        }
        fs.writeFileSync('./logs/' + name + '.json', JSON.stringify(data))
    } catch (err) {
        console.error(err)
    }
}

const urls = [
    'https://google.com',
    'https://yahoo.com',
    'http://www.levio.ca',
    'http://www.android.com',
];

puppeteer.launch().then(async browser => {
    const asyncCalls = [];
    const urlResults = [];
    let axeResults;

    urls.map((url) => {
        asyncCalls.push(browser.newPage().then(async page => {
            await page.goto(`${url}`);

            await page.addScriptTag({
                path: require.resolve('axe-core')
            });

            axeResults = await page.evaluate(async () => {
                return await axe.run();
            });
            axeResults.url = url;
            delete axeResults.passes;
            delete axeResults.inapplicable;
            delete axeResults.incomplete;
            delete axeResults.testEngine;
            delete axeResults.testRunner;
            delete axeResults.toolOptions;

            urlResults.push(axeResults);
        }))
    })
    await Promise.all(asyncCalls)
    browser.close();

    const filename = 'logs' + Date.now().toString();
    writeToFile(urlResults, filename)
    console.log(util.inspect(urlResults, false, null, true))
});
