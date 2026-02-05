import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  trailingSlash: true, // <--- ADICIONE ISSO (O Segredo)
  images: {
    unoptimized: true,
  },
};

export default nextConfig;