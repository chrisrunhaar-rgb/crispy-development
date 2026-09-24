import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  typescript: { ignoreBuildErrors: true },
  async redirects() {
    return [
      {
        source: "/resources/comfort-zone",
        destination: "/resources/escaping-the-comfort-zone",
        permanent: true,
      },
      // Old 60-day challenge retired; links in past posts land on the journey
      { source: "/challenge", destination: "/journey", permanent: true },
      { source: "/challenge/:path*", destination: "/journey", permanent: true },
      { source: "/influential-leadership-challenge", destination: "/journey", permanent: true },
      { source: "/influential-leadership-challenge/:path*", destination: "/journey", permanent: true },
    ];
  },
};

export default nextConfig;
