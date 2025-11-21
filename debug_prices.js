const daangnScraper = require('./server/scrapers/daangn');
const bunjangScraper = require('./server/scrapers/bunjang');
const joongnaScraper = require('./server/scrapers/joongna');

async function debugPrices() {
    const keyword = '아이폰';

    console.log('=== Daangn Prices ===');
    const daangn = await daangnScraper.search(keyword);
    daangn.slice(0, 10).forEach(item => {
        console.log(`Title: ${item.title}`);
        console.log(`Price: ${item.price}`);
        console.log(`Parsed: ${parseInt(item.price.replace(/[^0-9]/g, ''))}`);
        console.log('---');
    });

    console.log('\n=== Bunjang Prices ===');
    const bunjang = await bunjangScraper.search(keyword);
    bunjang.slice(0, 10).forEach(item => {
        console.log(`Title: ${item.title}`);
        console.log(`Price: ${item.price}`);
        console.log(`Parsed: ${parseInt(item.price.replace(/[^0-9]/g, ''))}`);
        console.log('---');
    });

    console.log('\n=== Joongna Prices ===');
    const joongna = await joongnaScraper.search(keyword);
    joongna.slice(0, 10).forEach(item => {
        console.log(`Title: ${item.title}`);
        console.log(`Price: ${item.price}`);
        console.log(`Parsed: ${parseInt(item.price.replace(/[^0-9]/g, ''))}`);
        console.log('---');
    });
}

debugPrices().then(() => process.exit(0));
