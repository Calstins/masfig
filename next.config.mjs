/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  trailingSlash: true,
  experimental: {
    cpus: 1,
    workerThreads: false
  },
  images: {
    unoptimized: true,
  },
}

export default nextConfig
