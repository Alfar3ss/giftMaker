import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  basePath: "/giftmaker",
  turbopack: {
    root: __dirname,
  },
};

export default nextConfig;
