import type { Metadata } from "next";
import type { ReactNode } from "react";
import "./globals.css";

export const metadata: Metadata = {
  title: "Penca Mundial Kanthus | Kanthus Smash Club",
  description: "Jugá, acertá resultados y ganá premios mientras vivís el Mundial con las mejores smash burgers de Kanthus.",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="es" className="scroll-smooth">
      <body className="bg-[#0a0a0a] text-neutral-100 antialiased min-h-screen selection:bg-[#39FF14] selection:text-black">
        {children}
      </body>
    </html>
  );
}
