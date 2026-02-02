import type { NextConfig } from "next";
import { InjectManifest } from "workbox-webpack-plugin";

const nextConfig: NextConfig = {
  output: "standalone",
  webpack: (config, { isServer, dev }) => {
    // Add Workbox plugin only for client-side production builds
    if (!isServer && !dev) {
      config.plugins.push(
        new InjectManifest({
          swSrc: "./public/sw.js",
          swDest: "../static/sw.js",
          exclude: [/\.map$/, /^manifest.*\.js$/],
        })
      );
    }
    return config;
  },
};

export default nextConfig;
