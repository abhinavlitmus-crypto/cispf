import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Serve AVIF where supported (smallest), falling back to WebP.
    formats: ["image/avif", "image/webp"],
    qualities: [75],
    // Images uploaded through the admin portal.
    remotePatterns: [{ protocol: "https", hostname: "res.cloudinary.com", pathname: "/dikjjag54/**" }],
  },
  // Opportunities moved out of What We Do and Events moved into it; keep old links and bookmarks working.
  async redirects() {
    return [
      { source: "/what-we-do/opportunities", destination: "/opportunities", permanent: true },
      { source: "/events", destination: "/what-we-do/events", permanent: true },
      { source: "/events/:slug", destination: "/what-we-do/events/:slug", permanent: true },
    ];
  },
};

export default nextConfig;
