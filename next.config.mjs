/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "export",
  images: { unoptimized: true },
  eslint: {
    ignoreDuringBuilds: true, // Ignores ESLint warnings
  },
  typescript: {
    ignoreBuildErrors: false, // Fails on TypeScript errors
  },
};

export default nextConfig;
