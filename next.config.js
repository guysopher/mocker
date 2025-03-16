/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config, { isServer }) => {
    // Mark esbuild as external to prevent bundling
    if (isServer) {
      config.externals = [...(config.externals || []), 'esbuild']
    }
    
    return config
  },
}

module.exports = nextConfig
