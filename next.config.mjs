/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  experimental: {
    // Admin photo uploads (resized in the browser to ~1 MB, Vercel caps bodies at 4.5 MB)
    serverActions: {
      bodySizeLimit: '4mb',
    },
  },
}

export default nextConfig
