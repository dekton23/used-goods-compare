const daangn = require('./server/scrapers/daangn');
const bunjang = require('./server/scrapers/bunjang');
const joongna = require('./server/scrapers/joongna');

async function test() {
    console.log('Starting test...');
    const start = Date.now();

    try {
        const results = await Promise.allSettled([
            daangn.search('맥북').then(r => ({ name: 'daangn', r })),
            bunjang.search('맥북').then(r => ({ name: 'bunjang', r })),
            joongna.search('맥북').then(r => ({ name: 'joongna', r }))
        ]);

        results.forEach((res, index) => {
            if (res.status === 'fulfilled') {
                console.log(`[${res.value.name}] Success: ${res.value.r.length} items`);
            } else {
                console.error(`[Scraper ${index}] Failed:`, res.reason);
            }
        });
    } catch (e) {
        console.error('Global error:', e);
    }

    console.log(`Total time: ${(Date.now() - start) / 1000}s`);
}

test();
