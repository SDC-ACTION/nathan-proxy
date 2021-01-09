const memcached = require('./index.js');

const saveToCache = (req, res, next) => {
    let oldWrite = res.write,
    oldEnd = res.end;

    let chunks = [];

    res.write = function (chunk) {
        chunks.push(chunk);
        return oldWrite.apply(res, arguments);
    };

    res.end = function (chunk) {
        if (chunk){
            chunks.push(chunk);
        }    
        if (typeof chunks[0] !== 'string'){
            let body = Buffer.concat(chunks).toString('utf8');
            memcached.set(req.params.product_id, body, 3600, (err) => {
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