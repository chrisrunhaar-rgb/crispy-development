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
      // Team Leader application flow retired; Team plan is bought on /pricing
      { source: "/apply", destination: "/pricing", permanent: false },
      { source: "/apply/:path*", destination: "/pricing", permanent: false },
      // Courses hidden until more are added; code and data kept
      { source: "/courses", destination: "/resources", permanent: false },
      { source: "/courses/:path*", destination: "/resources", permanent: false },
    ];
  },
};

export default nextConfig;
