"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";

import Footer from "@/components/Footer";
import Header from "@/components/Header";
import HeaderMobile from "@/components/HeaderMobile";
import PropertyCatalog from "@/components/PropertyCatalog";
import { getAllProperties, PropertyWithDetails } from "@/lib/get-properties";

export default function AllCategoriesPage() {
  const [properties, setProperties] = useState<PropertyWithDetails[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadAllProperties() {
      try {
        setIsLoading(true);
        const data = await getAllProperties();
        setProperties(data || []);
      } catch (error) {
        console.error("Erro ao carregar imóveis:", error);
        toast.error("Erro ao carregar imóveis");
      } finally {
        setIsLoading(false);
      }
    }

    loadAllProperties();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <HeaderMobile />

      {/* Conteúdo Principal */}
      <div className="container mx-auto mt-15 px-4 py-8">
        <div className="mb-8 text-center">
          <h1 className="mb-4 text-4xl font-bold text-gray-900">
            Todos os Imóveis
          </h1>
          <p className="text-xl text-gray-600">
            Explore nossa coleção completa de imóveis disponíveis para temporada
            no Ceará
          </p>
          {!isLoading && (
            <p className="mt-2 text-sm text-gray-500">
              {properties.length}{" "}
              {properties.length === 1
                ? "imóvel encontrado"
                : "imóveis encontrados"}
            </p>
          )}
        </div>

        {/* Catálogo de Imóveis */}
        {isLoading ? (
          <div className="py-12 text-center">
            <div className="mx-auto h-8 w-8 animate-spin rounded-full border-b-2 border-gray-400"></div>
            <p className="mt-2 text-gray-600">Carregando imóveis...</p>
          </div>
        ) : (
          <PropertyCatalog properties={properties} />
        )}
      </div>

      <Footer />
    </div>
  );
}
