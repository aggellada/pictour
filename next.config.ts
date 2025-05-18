import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
};

module.exports = {
  experimental: {
    serverActions: {
      bodySizeLimit: "20mb",
    },
  },
  images: {
    domains: ["res.cloudinary.com", "images.unsplash.com"],
  },
};

export default nextConfig;
