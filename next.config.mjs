/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  webpack: (config, options) => {
    config.cache = false;
    return config;
  },
};

export default nextConfig;
