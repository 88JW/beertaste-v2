import type { NextConfig } from "next";
import withSerwistInit from "@serwist/next";

const withSerwist = withSerwistInit({
  swSrc: "app/sw.ts",
  swDest: ".next/static/sw.js",
  cacheOnNavigation: true,
  reloadOnOnline: true,
  disable: process.env.NODE_ENV === "development",
});

const nextConfig: NextConfig = {
  output: "standalone",
  async rewrites() {
    return [
      {
        source: "/sw.js",
        destination: "/_next/static/sw.js",
      },
      {
        source: "/sw.js.map",
        destination: "/_next/static/sw.js.map",
      },
    ];
  },
};

export default withSerwist(nextConfig);
