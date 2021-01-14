const memcached = require('./index.js');

const saveToCache = (key, value) => {
    memcached.set(key, value, 86400, (err) => {
        if (err) {
            console.log('Error caching data: ', err);
        }
    });
};

module.exports = {
    saveToCache
};