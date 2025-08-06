import type { NextConfig } from "next";

// Static export is not compatible with app directory and runtime features (such as useRouter).
// Removing 'output: "export"' to allow default Next.js SSR/ISR behavior.
const nextConfig: NextConfig = {};

export default nextConfig;
