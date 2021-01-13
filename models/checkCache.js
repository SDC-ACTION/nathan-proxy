const memcached = require('./index.js');
const { parseResBody } = require('../helpers/parseResBody.js');

const checkCache = (req, res, next) => {
    memcached.get(req.params.product_id, (err, data) => {
        if (err){
            console.log('Error getting cached data: ', err);
        }
        else if (data){
            res.json(data);
        }
        else {
            parseResBody(req, res, next);
        }
    });
};

module.exports = {
    checkCache
};