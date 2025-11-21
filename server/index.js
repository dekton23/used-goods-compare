const express = require('express');
const cors = require('cors');
const { initDatabase } = require('./database');
const daangnScraper = require('./scrapers/daangn');
const bunjangScraper = require('./scrapers/bunjang');
const joongnaScraper = require('./scrapers/joongna');

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

// Initialize Database
initDatabase();

function calculateStats(items) {
    const prices = items
        .map(item => parseInt(item.price.replace(/[^0-9]/g, '')))
        .filter(p => !isNaN(p) && p > 0)
        .sort((a, b) => a - b);

    if (prices.length === 0) return { min: 0, max: 0, avg: 0, median: 0 };

    const min = prices[0];
    const max = prices[prices.length - 1];
    const sum = prices.reduce((a, b) => a + b, 0);
    const avg = Math.round(sum / prices.length);

    let median = 0;
    const mid = Math.floor(prices.length / 2);
    if (prices.length % 2 === 0) {
        median = (prices[mid - 1] + prices[mid]) / 2;
    } else {
        median = prices[mid];
    }

    return { min, max, avg, median };
}

app.get('/api/search', async (req, res) => {
    const { keyword } = req.query;
    if (!keyword) {
        return res.status(400).json({ error: 'Keyword is required' });
    }

    console.log(`Searching for: ${keyword}`);

    try {
        const [daangnResults, bunjangResults, joongnaResults] = await Promise.all([
            daangnScraper.search(keyword),
            bunjangScraper.search(keyword),
            joongnaScraper.search(keyword)
        ]);

        const allResults = [
            ...daangnResults.map(item => ({ ...item, platform: 'daangn' })),
            ...bunjangResults.map(item => ({ ...item, platform: 'bunjang' })),
            ...joongnaResults.map(item => ({ ...item, platform: 'joongna' }))
        ];

        // Sort by date descending (newest first)
        allResults.sort((a, b) => new Date(b.date) - new Date(a.date));

        const stats = calculateStats(allResults);

        res.json({
            items: allResults,
            stats
        });
    } catch (error) {
        console.error('Search failed:', error);
        res.status(500).json({ error: 'Search failed' });
    }
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
