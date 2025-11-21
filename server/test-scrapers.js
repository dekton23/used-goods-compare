const daangn = require('./scrapers/daangn');
const bunjang = require('./scrapers/bunjang');
const joongna = require('./scrapers/joongna');

async function test() {
    const keyword = '맥북';
    console.log(`Testing scrapers for keyword: ${keyword}`);

    try {
        console.log('--- Testing Daangn ---');
        const daangnResults = await daangn.search(keyword);
        console.log(`Daangn Results: ${daangnResults.length}`);
        if (daangnResults.length > 0) console.log(daangnResults[0]);

        // console.log('--- Testing Bunjang ---');
        // const bunjangResults = await bunjang.search(keyword);
        // console.log(`Bunjang Results: ${bunjangResults.length}`);
        // if (bunjangResults.length > 0) console.log(bunjangResults[0]);

        // console.log('--- Testing Joongna ---');
        // const joongnaResults = await joongna.search(keyword);
        // console.log(`Joongna Results: ${joongnaResults.length}`);
        // if (joongnaResults.length > 0) console.log(joongnaResults[0]);

    } catch (error) {
        console.error('Test failed:', error);
    }
}

test();
