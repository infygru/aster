/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  // Keep @directus/sdk as a Node.js external — never bundle it via webpack.
  // This prevents dev-mode HMR from creating phantom client stubs for the ESM package.
  // Note: renamed from experimental.serverComponentsExternalPackages in Next.js 14.
  serverExternalPackages: ['@directus/sdk'],
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'api.asterhomecare.co.uk',
      },
      {
        protocol: 'https',
        hostname: '**.directus.app',
      },
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '8055',
      },
    ],
  },
}

export default nextConfig
