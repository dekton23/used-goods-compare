const puppeteer = require('puppeteer');
const { parseTime } = require('../utils/timeParser');

async function search(keyword) {

    console.log(`[Daangn] Searching for ${keyword}...`);
    let browser;
    try {
        browser = await puppeteer.launch({
            headless: "new",
            args: [
                '--no-sandbox',
                '--disable-setuid-sandbox',
                '--disable-dev-shm-usage',
                '--disable-gpu'
            ]
        });
        const page = await browser.newPage();

        await page.goto(`https://www.daangn.com/search/${encodeURIComponent(keyword)}`, {
            waitUntil: 'networkidle2',
            timeout: 30000
        });

        await page.waitForSelector('._1u5ktd63', { timeout: 5000 }).catch(() => console.log('Selector not found'));

        const products = await page.evaluate(() => {
            const items = [];
            const articles = Array.from(document.querySelectorAll('a._1u5ktd63'));

            articles.forEach(article => {
                try {
                    const infoDiv = article.querySelector('div:nth-child(2)');
                    const titleEl = infoDiv?.querySelector('div:nth-child(1) > span:nth-child(1)');
                    const priceEl = infoDiv?.querySelector('div:nth-child(1) > span:nth-child(2)');
                    const regionDiv = infoDiv?.querySelector('div:nth-child(2)');
                    const regionEl = regionDiv?.querySelector('span:nth-child(1)');
                    // Time is usually in the text content of the regionDiv or a span inside it
                    // Based on debug: "둔산동\n·\n끌올 2시간 전"
                    const metaText = regionDiv ? regionDiv.innerText : '';

                    const imgEl = article.querySelector('img');

                    const title = titleEl ? titleEl.innerText.trim() : '';
                    const price = priceEl ? priceEl.innerText.trim() : '';
                    const region = regionEl ? regionEl.innerText.trim() : '';
                    const image_url = imgEl ? imgEl.src : '';
                    const link = 'https://www.daangn.com' + article.getAttribute('href');

                    // Parse time from metaText
                    // Example: "둔산동\n·\n끌올 2시간 전" -> "끌올 2시간 전"
                    let timeStr = '';
                    if (metaText.includes('전')) {
                        const parts = metaText.split('\n');
                        timeStr = parts.find(p => p.includes('전')) || '';
                    }

                    if (title && price) {
                        items.push({
                            platform: 'daangn',
                            title,
                            price,
                            region,
                            link,
                            image_url,
                            time_str: timeStr
                        });
                    }
                } catch (e) {
                    // Ignore
                }
            });

            return items.slice(0, 30);
        });

        // Process time on server side
        const results = products.map(p => ({
            ...p,
            date: parseTime(p.time_str)
        }));

        console.log(`[Daangn] Found ${results.length} items.`);
        return results;

    } catch (error) {
        console.error('[Daangn] Error:', error);
        return [];
    } finally {
        if (browser) await browser.close();
    }
}

module.exports = { search };
