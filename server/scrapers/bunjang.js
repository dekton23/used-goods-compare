const puppeteer = require('puppeteer');
const { parseTime } = require('../utils/timeParser');

async function search(keyword) {
    console.log(`[Bunjang] Searching for ${keyword}...`);
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

        await page.setViewport({ width: 375, height: 812 });

        await page.goto(`https://m.bunjang.co.kr/search/products?q=${encodeURIComponent(keyword)}`, {
            waitUntil: 'networkidle2',
            timeout: 30000
        });

        await page.waitForSelector('a[href*="/products/"]', { timeout: 5000 }).catch(() => console.log('Selector not found'));

        const products = await page.evaluate(() => {
            const items = [];
            const anchors = Array.from(document.querySelectorAll('a[href*="/products/"]'));

            anchors.forEach(anchor => {
                try {
                    const textContent = anchor.innerText;
                    const lines = textContent.split('\n').map(l => l.trim()).filter(l => l);

                    let title = '';
                    let price = '';
                    let region = '';
                    let timeStr = '';

                    // 가격 패턴: 숫자와 쉼표로만 이루어진 문자열 (원 포함 가능)
                    // 예: "488,000", "90,000", "200,000원"
                    const pricePattern = /^[\d,]+원?$/;

                    if (lines.length >= 2) {
                        title = lines[0];

                        // 가격 찾기: 숫자와 쉼표로만 이루어진 라인 찾기
                        price = lines.find(l => pricePattern.test(l));

                        // 가격을 찾지 못했으면 숫자가 포함된 짧은 라인 찾기 (fallback)
                        if (!price) {
                            price = lines.find(l => /^\d{1,3}(,\d{3})*원?$/.test(l));
                        }

                        // 가격이 없으면 건너뛰기
                        if (!price) {
                            return;
                        }

                        region = lines.find(l => !pricePattern.test(l) && l !== title && l.length < 20) || '전국';
                    }

                    // Specific selector for time based on inspection
                    // Try to find a span that contains "전" (ago)
                    const spans = Array.from(anchor.querySelectorAll('span'));
                    const timeSpan = spans.find(s => s.innerText.includes('전'));
                    if (timeSpan) {
                        timeStr = timeSpan.innerText.trim();
                    } else {
                        // Fallback to lines if span not found
                        timeStr = lines.find(l => l.includes('전')) || '';
                    }

                    const img = anchor.querySelector('img');
                    const image_url = img ? img.src : '';
                    const link = 'https://m.bunjang.co.kr' + anchor.getAttribute('href');

                    if (title && price) {
                        items.push({
                            platform: 'bunjang',
                            title,
                            price,
                            region,
                            link,
                            image_url,
                            time_str: timeStr
                        });
                    }
                } catch (e) {
                    // Ignore error for single item
                }
            });

            return items.slice(0, 30); // Limit to 30 items
        });

        const results = products.map(p => ({
            ...p,
            date: parseTime(p.time_str)
        }));

        console.log(`[Bunjang] Found ${results.length} items.`);
        return results;

    } catch (error) {
        console.error('[Bunjang] Error:', error);
        return [];
    } finally {
        if (browser) await browser.close();
    }
}

module.exports = { search };
