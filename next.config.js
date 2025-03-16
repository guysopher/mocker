/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // your other Next.js config options here
};

// Only run the custom HTTPS server in development mode
if (process.env.NODE_ENV !== 'production') {
  const { createServer } = require('https');
  const { parse } = require('url');
  const next = require('next');
  const fs = require('fs');
  const path = require('path');

  const dev = true;
  const app = next({ dev });
  const handle = app.getRequestHandler();

  try {
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
  } catch (error) {
    console.error('Failed to start HTTPS server:', error);
  }
}

module.exports = nextConfig;
