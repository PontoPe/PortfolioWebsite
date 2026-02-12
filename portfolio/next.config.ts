import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  trailingSlash: true, // <--- ADICIONE ISSO (O Segredo)
  images: {
    unoptimized: true, // Permite imagens externas sem otimização
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'raw.githubusercontent.com',
        port: '',
        pathname: '/PontoPe/ObsidianGit/main/**',
      },
    ],
  },  
};

export default nextConfig;