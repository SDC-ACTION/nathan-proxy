const memcached = require('./index.js');

const saveToCache = (req, res, next) => {
    let oldWrite = res.write,
    oldEnd = res.end;
    let chunks = [];
    let productId = req.params.product_id;

    res.write = function (chunk) {
        chunks.push(chunk);
        return oldWrite.apply(res, arguments);
    };

    res.end = function (chunk) {
        if (chunk){
            chunks.push(chunk);
        }    
        if (typeof chunks[0] !== 'string' && chunks[0].toString('utf8') !== 'OK' && res.statusCode !== 404 && res.statusCode !== 500){
            let body = Buffer.concat(chunks).toString('utf8');
            memcached.set(productId, body, 86400, (err) => {
                if (err){
                    console.log('Error caching data: ', err)
                };
            })
        } else{
            res.status(500);
        }
        oldEnd.apply(res, arguments);
    };
    next();
};

module.exports = {
    saveToCache
};