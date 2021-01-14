const memcached = require('./index.js');

const deleteFromCache = (key, res) => {
  memcached.del(key, (err) => {
    if (err) {
      res.status(500);
    }
  });
};

module.exports = {
  deleteFromCache
};