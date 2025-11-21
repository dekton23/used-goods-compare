const daangnScraper = require('./server/scrapers/daangn');
const bunjangScraper = require('./server/scrapers/bunjang');
const joongnaScraper = require('./server/scrapers/joongna');

async function test() {
    const keyword = '아이폰';
    console.log(`Testing search for: ${keyword}`);

    console.log('--- Testing Daangn ---');
    try {
        const daangn = await daangnScraper.search(keyword);
        console.log(`Daangn results: ${daangn.length}`);
    } catch (e) {
        console.error('Daangn failed:', e);
    }

    console.log('--- Testing Bunjang ---');
    try {
        const bunjang = await bunjangScraper.search(keyword);
        console.log(`Bunjang results: ${bunjang.length}`);
    } catch (e) {
        console.error('Bunjang failed:', e);
    }

    console.log('--- Testing Joongna ---');
    try {
        const joongna = await joongnaScraper.search(keyword);
        console.log(`Joongna results: ${joongna.length}`);
    } catch (e) {
        console.error('Joongna failed:', e);
    }
}

test();
