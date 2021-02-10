const util = require('util');
const puppeteer = require('puppeteer');
const axe = require('axe-core');
const {writeLog, consoleLog} = require('./src/utils/utils');


const urls = [
    'https://google.com',
    'https://yahoo.com',
    'http://www.levio.ca',
    'http://www.android.com',
    // 'http://www.jdhglfjf7eb.com',
];

puppeteer.launch().then(async browser => {
    const asyncCalls = [];
    const urlResults = [];
    let axeResults;

    urls.map((url) => {
        asyncCalls.push(browser.newPage().then(async page => {
            try {
                await page.setViewport({ width: 1366, height: 768});
                await page.goto(`${url}`, {waitUntil: 'load', timeout: 10000});

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
            } catch (e) {
                console.log(`${url}: ${e.message}`);
            }
        }))
    })
    await Promise.all(asyncCalls)
    browser.close();

    const filename = 'log' + Date.now().toString();
    writeLog(urlResults, filename);
    consoleLog(urlResults);
    // console.log(util.inspect(urlResults, false, null, true))
});
