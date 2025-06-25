const Watchlist = require('../models/WatchList');
const cache = require('../utils/cache');
const alphaService = require('../service/apiService');

// Search for stocks
exports.searchStocks = async (req, res) => {
    const query = req.query.query;

    if (!query || query.trim() === '') {
        return res.status(400).json({ error: 'Search query is required' });
    }

    try {
        const result = await alphaService.searchSymbol(query);
        res.json(result);
    } catch (err) {
        console.error('Search error:', err);

        // Handle specific error cases
        if (err.message.includes('Rate Limit Exceeded')) {
            return res.status(429).json({
                error: 'API rate limit exceeded. Please try again tomorrow or upgrade to a premium plan.',
                details: err.message
            });
        }

        if (err.message.includes('API key is not configured')) {
            return res.status(500).json({
                error: 'API configuration error. Please check your API key.',
                details: err.message
            });
        }

        res.status(500).json({ error: 'Search failed', details: err.message });
    }
};

// Get quote
exports.getStockDetails = async (req, res) => {
    const { symbol } = req.params;
    const cacheKey = `quote-${symbol}`;
    if (cache.has(cacheKey)) {
        return res.json(cache.get(cacheKey));
    }
    try {
        const quote = await alphaService.getQuote(symbol);
        cache.set(cacheKey, quote);
        res.json(quote);
    } catch (err) {
        res.status(500).json({ error: 'Failed to get quote' });
    }
};

// Add to watchlist
exports.addToWatchlist = async (req, res) => {
    const { symbol } = req.body;

    if (!symbol) {
        return res.status(400).json({ error: 'Symbol is required' });
    }

    try {
        // Prevent duplicates
        const exists = await Watchlist.findOne({ symbol: symbol.toUpperCase() });
        if (exists) {
            return res.status(400).json({ error: 'Stock already in watchlist' });
        }

        // Fetch company name from Alpha Vantage
        const matches = await alphaService.searchSymbol(symbol);
        const match = matches?.find(m => m['1. symbol'].toUpperCase() === symbol.toUpperCase());

        if (!match) {
            return res.status(404).json({ error: 'Stock symbol not found' });
        }

        const companyName = match['2. name'];
        const stock = new Watchlist({
            symbol: symbol.toUpperCase(),
            companyName
        });
        await stock.save();

        res.status(201).json({
            message: 'Stock added to watchlist successfully',
            stock
        });
    } catch (err) {
        console.error('Add to watchlist error:', err);
        res.status(500).json({ error: 'Failed to add stock to watchlist' });
    }
};

// Get watchlist
exports.getWatchlist = async (req, res) => {
    try {
        const watchlist = await Watchlist.find();
        res.json(watchlist);
    } catch (err) {
        res.status(500).json({ error: 'Fetch failed' });
    }
};

// Remove from watchlist
exports.removeFromWatchlist = async (req, res) => {
    const { symbol } = req.params;
    try {
        await Watchlist.deleteOne({ symbol });
        res.status(204).send();
    } catch (err) {
        res.status(500).json({ error: 'Delete failed' });
    }
};

// Get 7-day trend
exports.getStockHistory = async (req, res) => {
    const { symbol } = req.params;
    try {
        const history = await alphaService.getHistory(symbol);
        const dates = Object.keys(history).slice(0, 7);
        const result = dates.map(date => ({
            date,
            price: history[date]['4. close']
        }));
        res.json(result.reverse());
    } catch (err) {
        res.status(500).json({ error: 'History fetch failed' });
    }
};


