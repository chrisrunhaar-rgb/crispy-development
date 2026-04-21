import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        source: "/resources/comfort-zone",
        destination: "/resources/escaping-the-comfort-zone",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
