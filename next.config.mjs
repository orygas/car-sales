/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverActions: {
      bodySizeLimit: '10mb'
    }
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'lqkwfibmepwoertzszqo.supabase.co',
        port: '',
        pathname: '/storage/v1/object/public/car-images/**'
      }
    ]
  },
  // Disable ESLint during production build for faster builds
  eslint: {
    // Still run ESLint on save in development but don't fail production builds
    ignoreDuringBuilds: true
  }
};

export default nextConfig; 