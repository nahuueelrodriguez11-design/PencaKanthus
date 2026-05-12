import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // NO usar output: "standalone" — @netlify/plugin-nextjs
  // maneja el bundling por su cuenta. Standalone causa
  // conflictos con las Netlify Functions.
  turbopack: {},
};

export default nextConfig;
