const { createServer } = require('https');
const { parse } = require('url');
const next = require('next');
const fs = require('fs');
const path = require('path');

const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();

const httpsOptions = {
  key: fs.readFileSync(path.join(__dirname, 'certificates/localhost-key.pem')),
  cert: fs.readFileSync(path.join(__dirname, 'certificates/localhost.pem')),
};

app.prepare().then(() => {
  createServer(httpsOptions, (req, res) => {
    const parsedUrl = parse(req.url, true);
    handle(req, res, parsedUrl);
  }).listen(3001, (err) => {
    if (err) throw err;
    console.log('> Ready on https://localhost:3001');
  });
});

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // your other Next.js config options here
};

module.exports = nextConfig;
