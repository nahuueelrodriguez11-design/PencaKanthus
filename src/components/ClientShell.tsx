"use client";

// ============================================
// CLIENT SHELL — Wrapper cliente que carga
// Navbar y WhatsAppButton con ssr: false
// para evitar cualquier problema de SSR
// en Netlify Functions
// ============================================
import dynamic from "next/dynamic";
import { Suspense } from "react";

const Navbar = dynamic(() => import("@/components/Navbar").then(m => ({ default: m.Navbar })), {
  ssr: false,
  loading: () => (
    <div className="sticky top-0 z-50 h-16 bg-[#0a0a0a]/95 border-b border-[#2a2a2a]" />
  ),
});

const WhatsAppButton = dynamic(() => import("@/components/WhatsAppButton").then(m => ({ default: m.WhatsAppButton })), {
  ssr: false,
});

export function ClientShell({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Suspense fallback={<div className="sticky top-0 z-50 h-16 bg-[#0a0a0a]/95 border-b border-[#2a2a2a]" />}>
        <Navbar />
      </Suspense>
      {children}
      <Suspense fallback={null}>
        <WhatsAppButton />
      </Suspense>
    </>
  );
}
