import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Serve AVIF where supported (smallest), falling back to WebP.
    formats: ["image/avif", "image/webp"],
    qualities: [75],
    // Images uploaded through the admin portal.
    remotePatterns: [{ protocol: "https", hostname: "res.cloudinary.com", pathname: "/dikjjag54/**" }],
  },
};

export default nextConfig;
