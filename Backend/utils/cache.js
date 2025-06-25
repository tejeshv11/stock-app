const NodeCache = require('node-cache');
const cache = new NodeCache({ stdTTL: 60 }); // cache valid for 60 seconds
module.exports = cache;
