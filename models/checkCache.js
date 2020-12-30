const memcached = require('./index.js');
const { saveToCache } = require('./saveToCache.js');

const checkCache = (req, res, next) => {
    memcached.get(req.params.product_id, (err, data) => {
        if (err){
            console.log('Error getting cached data: ', err);
        } 
        else if (data){
            res.json(data);
        }
        else {
            saveToCache(req, res, next);
        }
    });
};

module.exports = {
    checkCache
};