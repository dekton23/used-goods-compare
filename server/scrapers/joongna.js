const puppeteer = require('puppeteer');
const { parseTime } = require('../utils/timeParser');

async function search(keyword) {
    console.log(`[Joongna] Searching for ${keyword}...`);
    let browser;
    try {
        browser = await puppeteer.launch({
            headless: "new",
            args: ['--no-sandbox', '--disable-setuid-sandbox']
        });
        const page = await browser.newPage();

        await page.goto(`https://web.joongna.com/search?keyword=${encodeURIComponent(keyword)}`, {
            waitUntil: 'networkidle2',
            timeout: 30000
        });

        await page.waitForSelector('a[href*="/product/"]', { timeout: 10000 }).catch(() => console.log('Selector not found'));

        const products = await page.evaluate(() => {
            const items = [];
            const anchors = Array.from(document.querySelectorAll('a[href*="/product/"]'));

            anchors.forEach(anchor => {
                try {
                    const textContent = anchor.innerText;
                    const lines = textContent.split('\n').filter(l => l.trim() !== '');

                    let title = '';
                    let price = '';
                    let region = '';
                    let timeStr = '';

                    const priceLine = lines.find(l => l.includes('원') && (l.includes(',') || /^\d+원$/.test(l.replace(/,/g, ''))));
                    if (priceLine) {
                        price = priceLine;
                        title = lines.find(l => l !== price && !l.includes('안전결제') && !l.includes('배송비')) || '';

                        // Region and time often in one line: "지산동|7분 전"
                        const metaLine = lines.find(l => l.includes('전') || l.includes('|'));
                        if (metaLine) {
                            if (metaLine.includes('|')) {
                                const parts = metaLine.split('|');
                                region = parts[0].trim();
                                timeStr = parts[1] ? parts[1].trim() : '';
                            } else {
                                timeStr = metaLine.trim();
                            }
                        }

                        if (!region) {
                            region = lines.find(l => l.endsWith('동') || l.endsWith('구') || l.endsWith('시')) || '전국';
                        }
                    }

                    const img = anchor.querySelector('img');
                    const image_url = img ? img.src : '';
                    const link = 'https://web.joongna.com' + anchor.getAttribute('href');

                    if (title && price) {
                        items.push({
                            platform: 'joongna',
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

        const results = products.map(p => ({
            ...p,
            date: parseTime(p.time_str)
        }));

        console.log(`[Joongna] Found ${results.length} items.`);
        return results;

    } catch (error) {
        console.error('[Joongna] Error:', error);
        return [];
    } finally {
        if (browser) await browser.close();
    }
}

module.exports = { search };
