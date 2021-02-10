const axe = require('axe-core');

const urls = [
    'https://google.com',
    'https://yahoo.com',
    'http://www.levio.ca',
    'http://www.android.com',
]

describe('Website URLS', () => {

    let axeResults;
    urls.map((url) => {
        it(url + ' should be accessible', async() => {
            axeResults = {};
            await page.goto(url);

            await page.addScriptTag({
                path: require.resolve('axe-core')
            });

            axeResults = await page.evaluate(async () => {
                return await axe.run();
            });

            expect(axeResults.violations).toHaveLength(0);

        });
    })
});
