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
    domains: ['avatars.githubusercontent.com'],
    formats: ['image/webp', 'image/avif'],
  },
  // Performance optimizations
  experimental: {
    optimizePackageImports: ['lucide-react', 'gsap'],
    // Enable faster refresh for development
    turbo: {
      rules: {
        '*.svg': {
          loaders: ['@svgr/webpack'],
          as: '*.js',
        },
      },
    },
  },
  webpack: (config, { dev }) => {
    if (dev) {
      // Development optimizations
      config.optimization = {
        ...config.optimization,
        moduleIds: 'named',
        chunkIds: 'named',
      }
    }
    
    // Optimize video loading
    config.module.rules.push({
      test: /\.(mp4|webm|ogg|avi|mov)$/,
      type: 'asset/resource',
      generator: {
        filename: 'static/media/[name].[hash][ext]'
      }
    })

    return config
  },
}

export default nextConfig
