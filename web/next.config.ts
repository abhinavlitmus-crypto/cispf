import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Serve AVIF where supported (smallest), falling back to WebP.
    formats: ["image/avif", "image/webp"],
    qualities: [75],
  },
};

export default nextConfig;
