/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  // Maximum performance settings for development
  experimental: {
    // Only compile what's needed
    optimizePackageImports: [
      'lucide-react',
      '@radix-ui/react-slot',
      'class-variance-authority',
    ],
    // Enable faster development
    turbo: {
      rules: {
        '*.svg': {
          loaders: ['@svgr/webpack'],
          as: '*.js',
        },
      },
    },
  },
  
  webpack: (config, { dev, isServer }) => {
    if (dev) {
      // Completely disable source maps for max speed
      config.devtool = false
      
      // Ultra-fast filesystem cache
      config.cache = {
        type: 'filesystem',
        compression: false, // Disable compression for speed
        maxAge: 1000 * 60 * 60 * 24 * 7, // 1 week cache
      }
      
      // Aggressive code splitting to minimize initial bundles
      config.optimization = {
        ...config.optimization,
        splitChunks: {
          chunks: 'all',
          minSize: 0,
          maxSize: 244000, // Small chunks for faster compilation
          cacheGroups: {
            framework: {
              chunks: 'all',
              name: 'framework',
              test: /(?<!node_modules.*)[\\/]node_modules[\\/](react|react-dom|scheduler|prop-types|use-subscription)[\\/]/,
              priority: 40,
              enforce: true,
            },
            lib: {
              test: /[\\/]node_modules[\\/]/,
              name: 'lib',
              priority: 30,
              chunks: 'all',
              enforce: true,
            },
            commons: {
              name: 'commons',
              chunks: 'all',
              minChunks: 2,
              priority: 20,
            },
            default: false,
            vendors: false,
          },
        },
        // Disable heavy optimizations in dev
        minimize: false,
        usedExports: false,
        sideEffects: false,
      }
      
      // Ultra-fast file watching
      config.watchOptions = {
        aggregateTimeout: 50, // Even faster aggregation
        poll: false,
        ignored: ['**/node_modules/**', '**/.git/**', '**/.next/**'],
      }
      
      // Reduce module resolution time
      config.resolve.symlinks = false
      config.resolve.cacheWithContext = false
    }
    
    return config
  },
  
  // Tree shaking optimizations
  modularizeImports: {
    'lucide-react': {
      transform: 'lucide-react/dist/esm/icons/{{member}}.js',
    },
    '@radix-ui/react-icons': {
      transform: '@radix-ui/react-icons/dist/{{member}}.js',
    },
    'gsap': {
      transform: 'gsap/{{member}}.js',
    },
  },
  
  // Disable unnecessary features for speed
  compress: false, // Disable compression in dev
  poweredByHeader: false,
  generateEtags: false,
}

export default nextConfig
