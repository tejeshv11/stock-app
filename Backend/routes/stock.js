const express = require('express');
const router = express.Router();
const controller = require('../controllers/stock');

router.get('/stocks/search', controller.searchStocks);
router.get('/stocks/:symbol', controller.getStockDetails);
router.get('/stocks/:symbol/history', controller.getStockHistory);

router.post('/watchlist', controller.addToWatchlist);
router.get('/watchlist', controller.getWatchlist);
router.delete('/watchlist/:symbol', controller.removeFromWatchlist);

module.exports = router;
