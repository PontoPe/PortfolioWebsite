import type { Metadata } from "next";
import { Inter, IBM_Plex_Mono } from "next/font/google";
import "./globals.css";

// Títulos (Geist/Inter Style) - Bold
const sans = Inter({ 
  subsets: ["latin"],
  variable: "--font-sans",
  weight: ["700"], // Carregando apenas o Bold como pedido para títulos
});

// Texto Geral (IBM Plex Mono)
const mono = IBM_Plex_Mono({ 
  subsets: ["latin"],
  variable: "--font-mono",
  weight: ["400", "500", "600"], // Pesos para leitura
});

export const metadata: Metadata = {
  title: "Pedro Martins | Portfolio",
  description: "AI & Automation Engineer Portfolio",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full">
      <body className={`${sans.variable} ${mono.variable} font-mono h-full antialiased`}>
        {children}
      </body>
    </html>
  );
}