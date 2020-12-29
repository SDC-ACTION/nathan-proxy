require('newrelic');
const { createProxyMiddleware } = require('http-proxy-middleware');
const Memcached = require('memcached');
const express = require('express');
const path = require('path');

const memcached = new Memcached();
const app = express();
const PORT = 3000;

memcached.connect('localhost:11211', (err) => {
  if (err) console.log('Error connecting to Memcached: ', err);
  else {
    console.log('Connected to Memcached!');
    memcached.flush((err) => {
      if (err) console.log(err);
    })
  }
});

app.use((req, res, next) => {
  memcached.get(req.url.slice(13), (err, data) => {
    if (err) console.log(err);
    else if (data){
      console.log('cached data');
       res.json(JSON.parse(data));
    }
    else {
      console.log('new data');
      let oldWrite = res.write,
      oldEnd = res.end;

      let chunks = [];

      res.write = function (chunk) {
        chunks.push(chunk);

        return oldWrite.apply(res, arguments);
      };

      res.end = function (chunk) {
        if (chunk)
          chunks.push(chunk);
          
          if (typeof chunks[0] !== 'string') {
          let body = Buffer.concat(chunks).toString('utf8');
          memcached.set(req.url.slice(13), body, 3600, (err) => {
            if (err) console.log('Error caching data ', err);
          })
        } else {
          res.status(500);
        }

        oldEnd.apply(res, arguments);
      };

      next();
    }
  });
});

app.use(createProxyMiddleware('/api', {target: 'http://localhost:3001', changeOrigin: true}));

app.use(createProxyMiddleware('/products', {target: 'http://localhost:3001', changeOrigin: true}));

app.use('/', express.static(path.join(__dirname, '../public')));

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/index.html'));
});

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
