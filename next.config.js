/** @type {import('next').NextConfig} */
const nextConfig = {
  // تحسينات الصور
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'furssati.io',
        port: '',
        pathname: '/**', // أكثر عمومية للسماح بكل المسارات
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
    minimumCacheTTL: 60 * 60 * 24 * 30, // شهر واحد
    dangerouslyAllowSVG: true,
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },

  // تحسينات Turbopack (تم نقله من experimental)
  turbopack: {
    rules: {
      '*.svg': {
        loaders: ['@svgr/webpack'],
        as: '*.js',
      },
    },
  },

  // تحسينات الأداء
  experimental: {
    optimizeCss: true,
    optimizeServerReact: true,
    serverMinification: true,
    serverSourceMaps: false,
    gzipSize: true,
  },

  // إعدادات الإنتاج
  poweredByHeader: false,
  generateEtags: true,
  compress: true,

  // إعدادات التخزين المؤقت
  onDemandEntries: {
    maxInactiveAge: 25 * 1000,
    pagesBufferLength: 2,
  },

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
      // تحسين cache للملفات الثابتة
      {
        source: '/static/(.*)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      // تحسين cache للصور - تم إصلاح regex
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

  // إعدادات Webpack
  webpack: (config, { buildId, dev, isServer, defaultLoaders, webpack }) => {
    // تحسينات bundle
    if (!dev && !isServer) {
      config.resolve.alias = {
        ...config.resolve.alias,
        'react/jsx-runtime.js': 'preact/compat/jsx-runtime',
        react: 'preact/compat',
        'react-dom/test-utils': 'preact/test-utils',
        'react-dom': 'preact/compat',
      };
    }

    // تحسين SVG
    config.module.rules.push({
      test: /\.svg$/,
      use: ['@svgr/webpack']
    });

    // تحسين الـ bundle size
    config.optimization.splitChunks = {
      chunks: 'all',
      cacheGroups: {
        default: false,
        vendors: false,
        vendor: {
          chunks: 'all',
          name: 'vendor',
          test: /node_modules/,
          priority: 20,
        },
        common: {
          name: 'common',
          minChunks: 2,
          priority: 10,
          reuseExistingChunk: true,
          enforce: true,
        },
      },
    };

    return config;
  },

  // Static generation تحسينات
  trailingSlash: false,
  skipTrailingSlashRedirect: true,

  // إعدادات البيئة
  env: {
    CUSTOM_KEY: 'my-value',
  },

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