const { checkCache } = require('../models/checkCache.js');

const cache = (req, res, next) => {
    checkCache(req, res, next);
};

module.exports = {
    cache
};