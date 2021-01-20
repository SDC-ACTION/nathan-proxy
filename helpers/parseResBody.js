const { saveToCache } = require('../models/saveToCache.js');
const { deleteFromCache } = require('../models/deleteFromCache.js');

const parseResBody = (req, res, next) => {
    let oldWrite = res.write,
    oldEnd = res.end;
    let chunks = [];
    let resBody;
    let productId = req.params.product_id;

    res.write = function (chunk) {
        chunks.push(chunk);
        return oldWrite.apply(res, arguments);
    };

    res.end = async function (chunk) {
        if (chunk){
            chunks.push(chunk);
        }
        if (res.statusCode !== 404 && res.statusCode !== 500 && res.statusCode !== 304) {
            if (Buffer.concat(chunks).length > 0) {
            resBody = JSON.parse(Buffer.concat(chunks)); 
                if (resBody.reviews) {
                    await saveToCache(productId, resBody);
                }
                if (resBody.rows) {
                    await deleteFromCache(resBody.rows[0].product_id, res);
                }
            }
        }
        
        oldEnd.apply(res, arguments);
    };

    next();
};

module.exports = {
  parseResBody
};