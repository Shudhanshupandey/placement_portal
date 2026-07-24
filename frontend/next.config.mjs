import path from "node:path";

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Pin the workspace root to this app (several lockfiles exist on disk).
  outputFileTracingRoot: path.resolve(),
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "res.cloudinary.com" },
      { protocol: "https", hostname: "firebasestorage.googleapis.com" },
      { protocol: "https", hostname: "lh3.googleusercontent.com" },
    ],
  },
  typescript: {
    // Type errors DO fail the build — we want that safety.
    ignoreBuildErrors: false,
  },
  eslint: {
    // Lint runs separately via `npm run lint`; don't block production builds on style.
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
