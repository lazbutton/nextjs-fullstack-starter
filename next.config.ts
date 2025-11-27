import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Enable compression for better performance and SEO
  compress: true,
  
  // Generate ETags for caching
  generateEtags: true,
  
  // Optimize page extensions
  pageExtensions: ['tsx', 'ts', 'jsx', 'js'],
  
  // Power by header (set to false for security)
  poweredByHeader: false,
  
  // Trailing slash configuration for consistent URLs
  trailingSlash: false,
  
  // Enable strict mode for better React practices
  reactStrictMode: true,
  
  // Image optimization configuration
  images: {
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 60,
    dangerouslyAllowSVG: true,
    contentDispositionType: 'attachment',
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },
  
  // Headers for SEO and security
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on'
          },
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN'
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff'
          },
          {
            key: 'Referrer-Policy',
            value: 'origin-when-cross-origin'
          },
        ],
      },
      {
        source: '/sitemap.xml',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=3600, must-revalidate',
          },
        ],
      },
    ]
  },
  
  // Redirects for SEO (example redirects)
  async redirects() {
    return [
      // Add your redirects here if needed
      // Example:
      // {
      //   source: '/old-page',
      //   destination: '/new-page',
      //   permanent: true,
      // },
    ]
  },
};

export default nextConfig;
