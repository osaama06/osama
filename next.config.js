/** @type {import('next').NextConfig} */
const nextConfig = {
  // تحسينات الصور
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'furssati.io',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'img.freepik.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: '*.wordpress.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'secure.gravatar.com',
        port: '',
        pathname: '/**',
      }
    ],
    formats: ['image/webp', 'image/avif'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 60 * 60 * 24 * 30,
    dangerouslyAllowSVG: true,
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },

  // تحسينات الأداء
  experimental: {
    optimizeCss: true,
  },

  // إعدادات الإنتاج
  poweredByHeader: false,
  generateEtags: true,
  compress: true,

  // Headers للأمان والأداء
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on'
          },
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=63072000; includeSubDomains; preload'
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff'
          },
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN'
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block'
          },
          {
            key: 'Referrer-Policy',
            value: 'origin-when-cross-origin'
          }
        ],
      },
      {
        source: '/static/(.*)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      {
        source: '/:path*\\.(ico|png|jpg|jpeg|gif|webp|svg)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
    ];
  },

  // إعدادات Webpack (تم إزالة Preact aliases)
  webpack: (config, { buildId, dev, isServer, defaultLoaders, webpack }) => {
    // تحسين SVG
    config.module.rules.push({
      test: /\.svg$/,
      use: ['@svgr/webpack']
    });

    return config;
  },

  // Static generation تحسينات
  trailingSlash: false,
  skipTrailingSlashRedirect: true,

  // إعدادات الـ output
  output: 'standalone',

  // إعدادات TypeScript
  typescript: {
    ignoreBuildErrors: false,
  },

  // إعدادات ESLint
  eslint: {
    ignoreDuringBuilds: false,
  },

  // إعدادات redirect و rewrite
  async redirects() {
    return [
      {
        source: '/old-product/:slug',
        destination: '/products/:slug',
        permanent: true,
      },
    ];
  },

  async rewrites() {
    return [
      {
        source: '/api/product/:path*',
        destination: '/api/products/:path*',
      },
    ];
  },
};

module.exports = nextConfig;