const memcached = require('./index.js');
const { parseResBody } = require('../helpers/parseResBody.js');
let cacheCount = 0;
let newCount = 0;

const checkCache = (req, res, next) => {
    memcached.get(req.params.product_id, (err, data) => {
        if (err){
            console.log('Error getting cached data: ', err);
        }
        else if (data){
            cacheCount++;
            process.stdout.write(`req handled by cache: ${cacheCount}`);
            process.stdout.write(` req handled by service: ${newCount}\r`);
            res.json(data);
        }
        else {
            newCount++;
            process.stdout.write(`req handled by cache: ${cacheCount}`);
            process.stdout.write(` req handled by service: ${newCount}\r`);
            parseResBody(req, res, next);
        }
    });
};

module.exports = {
    checkCache
};