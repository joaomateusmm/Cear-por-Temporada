import { Metadata } from "next";

import Footer from "@/components/Footer";
import Header from "@/components/Header";
import HeaderMobile from "@/components/HeaderMobile";

export const metadata: Metadata = {
  title: "Administração - Ceará por Temporada",
  description: "Área administrativa para gerenciamento de imóveis",
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-slate-900">
      <HeaderMobile />
      <Header />

      {/* Conteúdo principal */}
      <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        {children}
      </main>
      <div className="mt-5 w-screen">
        <Footer />
      </div>
    </div>
  );
}
