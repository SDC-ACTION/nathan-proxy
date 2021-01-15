require('newrelic');
const { createProxyMiddleware } = require('http-proxy-middleware');
const express = require('express');
const path = require('path');
const { cache } = require('../middleware/cache.js');

const app = express();
const PORT = 3000;

app.use('/api/reviews/:product_id', cache);

app.use(createProxyMiddleware('/api', {target: 'http://54.67.19.225:3001', changeOrigin: true}));

//app.use(createProxyMiddleware('/products', {target: 'http://54.67.19.225:3001', changeOrigin: true}));

app.use('/loaderio-f7b8e82e72ffb51e0715b32fb34eff6c/', (req, res) => {
  res.sendFile(path.join(__dirname, '../token.txt'));
});

app.use('/', express.static(path.join(__dirname, '../public')));

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/index.html'));
});

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
