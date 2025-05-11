/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: [
      'media.discordapp.net',
      'cdn.discordapp.com',
      'files.fm'
    ],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'pvcanhsbbuktocfleuld.supabase.co',
        pathname: '/storage/v1/object/public/**',
      },
    ],
  },
};

module.exports = nextConfig;
