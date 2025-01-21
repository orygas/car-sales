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
  }
};

export default nextConfig; 