import { URL } from "node:url";
import type { NextConfig } from "next";
import { PHASE_DEVELOPMENT_SERVER } from "next/constants";

module.exports = (phase: string) => {
  const nextConfig: NextConfig = {
    images: {
      remotePatterns: [new URL("http://localhost:20080/**")],
      dangerouslyAllowLocalIP: phase === PHASE_DEVELOPMENT_SERVER ? true : false,
    },
    turbopack: {
      rules: {
        "*.svg": {
          loaders: ["@svgr/webpack"],
          as: "*.js",
        },
      },
    },
  };

  return nextConfig;
};
