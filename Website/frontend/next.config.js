/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
      {
        protocol: 'http',
        hostname: '**',
      }
    ],
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  async rewrites() {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL ;
    return [
      {
        source: '/api/:path*',
        destination: `${apiUrl}/:path*`,
        // verifyTLSCertificates: false,
      },
      {
        source: '/profilePage/api/:path*',
        destination: `${apiUrl}/:path*`,
        // verifyTLSCertificates: false,
      },
    ];
  },
}

module.exports = nextConfig;
