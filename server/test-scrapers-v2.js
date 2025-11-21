const daangn = require('./scrapers/daangn');
const bunjang = require('./scrapers/bunjang');
const joongna = require('./scrapers/joongna');

async function test() {
    const keyword = '맥북';
    console.log(`Testing V2 scrapers for keyword: ${keyword}`);

    try {
        console.log('--- Testing Daangn ---');
        const daangnResults = await daangn.search(keyword);
        console.log(`Daangn Results: ${daangnResults.length}`);
        if (daangnResults.length > 0) {
            console.log('First item date:', daangnResults[0].date);
            console.log('First item time_str:', daangnResults[0].time_str);
        }

        console.log('--- Testing Joongna ---');
        const joongnaResults = await joongna.search(keyword);
        console.log(`Joongna Results: ${joongnaResults.length}`);
        if (joongnaResults.length > 0) {
            console.log('First item date:', joongnaResults[0].date);
            console.log('First item time_str:', joongnaResults[0].time_str);
        }

        console.log('--- Testing Bunjang ---');
        const bunjangResults = await bunjang.search(keyword);
        console.log(`Bunjang Results: ${bunjangResults.length}`);
        if (bunjangResults.length > 0) {
            console.log('Bunjang First 5 items time_str:');
            bunjangResults.slice(0, 5).forEach((item, index) => {
                console.log(`Item ${index}: ${item.time_str}`);
            });
        }

    } catch (error) {
        console.error('Test failed:', error);
    }
}

test();
