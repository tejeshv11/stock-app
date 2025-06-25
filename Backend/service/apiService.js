const axios = require('axios');
const API_KEY = process.env.ALPHA_VANTAGE_KEY;

exports.searchSymbol = async (query) => {
    const url = `https://www.alphavantage.co/query?function=SYMBOL_SEARCH&keywords=${query}&apikey=${API_KEY}`;
    const { data } = await axios.get(url);
    return data.bestMatches;
};

exports.getQuote = async (symbol) => {
    const url = `https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${symbol}&apikey=${API_KEY}`;
    const { data } = await axios.get(url);
    return data['Global Quote'];
};

exports.getHistory = async (symbol) => {
    const url = `https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=${symbol}&apikey=${API_KEY}`;
    const { data } = await axios.get(url);
    return data['Time Series (Daily)'];
};
