/** @type {import('next').NextConfig} */
const { createServer } = require('https');
const { readFileSync } = require('fs');

const nextConfig = {
  webpack: (config, { isServer }) => {
    // Mark esbuild as external to prevent bundling
    if (isServer) {
      config.externals = [...(config.externals || []), 'esbuild']
    }
    
    return config
  },
  server: {
    https: {
      key: readFileSync('./certificates/localhost-key.pem'),
      cert: readFileSync('./certificates/localhost.pem'),
    },
  },
}

module.exports = nextConfig
