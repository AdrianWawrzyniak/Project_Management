import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    unoptimized: true, // Wyłącza optymalizację obrazów, aby uniknąć problemów z cache
  },
};

export default nextConfig;
