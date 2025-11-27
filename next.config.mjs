/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  allowedDevOrigins: [
    'https://*.replit.dev',
    'https://*.repl.co',
    'https://*.replit.app',
  ],
  webpack: (config, { isServer }) => {
    config.watchOptions = {
      poll: 1000,
      aggregateTimeout: 300,
    }
    if (isServer) {
      config.externals.push({
        '@mongodb-js/zstd': 'commonjs @mongodb-js/zstd',
        kerberos: 'commonjs kerberos',
        '@aws-sdk/credential-providers': 'commonjs @aws-sdk/credential-providers',
        'mongodb-client-encryption': 'commonjs mongodb-client-encryption',
        snappy: 'commonjs snappy',
        aws4: 'commonjs aws4',
      })
    }
    return config
  },
}

export default nextConfig
