const puppeteer = require('puppeteer');

async function debugBunjang() {
    console.log('--- Debugging Bunjang ---');
    const browser = await puppeteer.launch({ headless: "new", args: ['--no-sandbox'] });
    const page = await browser.newPage();
    await page.setViewport({ width: 375, height: 812 });
    await page.goto('https://m.bunjang.co.kr/search/products?q=맥북', { waitUntil: 'networkidle2' });
    await page.waitForSelector('.sc-kcDeIU', { timeout: 5000 }).catch(() => console.log('Selector not found'));

    const texts = await page.evaluate(() => {
        const anchors = Array.from(document.querySelectorAll('a[href*="/products/"]'));
        return anchors.slice(0, 3).map(a => a.innerText);
    });
    console.log(texts);
    await browser.close();
}

async function debugJoongna() {
    console.log('--- Debugging Joongna ---');
    const browser = await puppeteer.launch({ headless: "new", args: ['--no-sandbox'] });
    const page = await browser.newPage();
    await page.goto('https://web.joongna.com/search?keyword=맥북', { waitUntil: 'networkidle2' });
    await page.waitForSelector('a[href*="/product/"]', { timeout: 5000 }).catch(() => console.log('Selector not found'));

    const texts = await page.evaluate(() => {
        const anchors = Array.from(document.querySelectorAll('a[href*="/product/"]'));
        return anchors.slice(0, 3).map(a => a.innerText);
    });
    console.log(texts);
    await browser.close();
}

async function debugDaangn() {
    console.log('--- Debugging Daangn ---');
    const browser = await puppeteer.launch({ headless: "new", args: ['--no-sandbox'] });
    const page = await browser.newPage();
    await page.goto('https://www.daangn.com/search/맥북', { waitUntil: 'networkidle2' });
    await page.waitForSelector('._1u5ktd63', { timeout: 5000 }).catch(() => console.log('Selector not found'));

    const items = await page.evaluate(() => {
        const articles = Array.from(document.querySelectorAll('a._1u5ktd63'));
        return articles.slice(0, 3).map(a => {
            const infoDiv = a.querySelector('div:nth-child(2)');
            // Get all spans in the second line div
            const metaSpans = Array.from(infoDiv.querySelector('div:nth-child(2)').querySelectorAll('span'));
            return metaSpans.map(s => s.innerText);
        });
    });
    console.log(items);
    await browser.close();
}

(async () => {
    await debugDaangn();
    await debugBunjang();
    await debugJoongna();
})();
