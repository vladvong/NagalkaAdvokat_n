/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  compiler: { styledComponents: true },

  experimental: {
  },

  images: {
    formats: ['image/avif', 'image/webp'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'determined-desk-f2e043cadd.strapiapp.com',
      },
      {
        protocol: 'https',
        hostname: 'determined-desk-f2e043cadd.media.strapiapp.com',
      },
    ],
  },

  trailingSlash: true,
};

export default nextConfig;
