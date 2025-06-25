const mongoose = require('mongoose');

const WatchlistSchema = new mongoose.Schema({
    symbol: { type: String, required: true },
    companyName: { type: String },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Watchlist', WatchlistSchema);
