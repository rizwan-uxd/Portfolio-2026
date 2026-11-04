import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // The old site's Works page is still in search results; send it to the Works section.
  async redirects() {
    return [{ source: "/works", destination: "/#works", permanent: true }];
  },
};

export default nextConfig;
