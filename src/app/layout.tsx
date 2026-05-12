import type { Metadata } from "next";
import type { ReactNode } from "react";
import "./globals.css";
import { ClientShell } from "@/components/ClientShell";

export const metadata: Metadata = {
  title: "Penca Mundial Kanthus | Kanthus Smash Club",
  description:
    "Jugá, acertá resultados y ganá premios mientras vivís el Mundial con Kanthus Smash Club. Predicciones, ranking y premios exclusivos.",
  keywords: "penca, mundial, kanthus, smash club, hamburguesas, predicciones, futbol",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="es">
      <body className="antialiased bg-pattern">
        <ClientShell>{children}</ClientShell>
      </body>
    </html>
  );
}
