const Memcached = require('memcached');
const memcached = new Memcached();

memcached.connect('localhost:11211', (err) => {
    if (err) console.log('Error connecting to Memcached: ', err);
    else {
      console.log('Connected to Memcached!');
      memcached.flush((err) => {
        if (err) console.log(err);
      })
    }
});

module.exports = memcached;