/** @type {import('next').NextConfig} */

const getAllowedOrigins = () => {
  const origins = ['localhost:5000', 'localhost:3000']
  
  if (process.env.VERCEL_URL) {
    origins.push(process.env.VERCEL_URL)
  }
  if (process.env.NEXT_PUBLIC_APP_URL) {
    try {
      const url = new URL(process.env.NEXT_PUBLIC_APP_URL)
      origins.push(url.host)
    } catch {}
  }
  if (process.env.REPLIT_DEV_DOMAIN) {
    origins.push(process.env.REPLIT_DEV_DOMAIN)
  }
  if (process.env.REPLIT_DOMAINS) {
    process.env.REPLIT_DOMAINS.split(',').forEach(domain => {
      origins.push(domain.trim())
    })
  }
  origins.push('*.replit.dev')
  origins.push('*.repl.co')
  
  return origins.filter(Boolean)
}

const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
      },
    ],
  },
  experimental: {
    serverActions: {
      allowedOrigins: getAllowedOrigins(),
    },
  },
  allowedDevOrigins: getAllowedOrigins(),
  webpack: (config, { isServer }) => {
    if (process.env.REPLIT_DEV_DOMAIN) {
      config.watchOptions = {
        poll: 1000,
        aggregateTimeout: 300,
      }
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
