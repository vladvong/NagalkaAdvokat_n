/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  compiler: { styledComponents: true },
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
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'Content-Security-Policy',
            value: "script-src 'self' https://binotel.ua https://widgets.binotel.com; object-src 'none';",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
