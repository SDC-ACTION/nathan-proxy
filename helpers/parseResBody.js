const { saveToCache } = require('../models/saveToCache.js');
const { deleteFromCache } = require('../models/deleteFromCache.js');

const parseResBody = (req, res, next) => {
  let oldWrite = res.write,
  oldEnd = res.end;
  let chunks = [];
  let resBody;

  res.write = function (chunk) {
      chunks.push(chunk);
      return oldWrite.apply(res, arguments);
  };

  res.end = function (chunk) {
      if (chunk){
          chunks.push(chunk);
      }
      if (typeof chunks[0] !== 'string' && chunks[0].toString('utf8') !== 'OK' && res.statusCode !== 404 && res.statusCode !== 500) {
        resBody = JSON.parse(Buffer.concat(chunks));
        if (resBody.reviews) {
          saveToCache(req.params.product_id, resBody);
        }

        if (resBody.rows) {
          deleteFromCache(resBody.rows[0].product_id, res);
        }
      }
      oldEnd.apply(res, arguments);
  };

  next();
};

module.exports = {
  parseResBody
};