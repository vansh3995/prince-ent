/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  async redirects() {
    return [
      {
        source: '/favicon.ico',
        destination: '/icons/favicon.ico',
        permanent: true,
      },
    ]
  },
}

module.exports = nextConfig
