"use client";

import { ArrowLeft, SlidersHorizontal } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { toast } from "sonner";

import Footer from "@/components/Footer";
import PropertyCatalog from "@/components/PropertyCatalog";
import ScrollingHeader from "@/components/ScrollingHeader";
import { Button } from "@/components/ui/button";
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
      <ScrollingHeader />

      {/* Results Section */}
      <section className="px-4 py-12 md:px-52">
        <div className="container mx-auto">
          <div className="mb-8 flex flex-col gap-4 text-start md:flex-row md:items-center md:justify-between">
            <div className="mt-10 mb-8 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-start">
              <Link href="/">
                <Button className="cursor-pointer bg-gray-800 px-4 py-5 text-gray-100 shadow-md duration-200 hover:scale-[1.02] hover:bg-gray-800 hover:text-white hover:active:scale-95">
                  <ArrowLeft className="h-4 w-4" />
                  Voltar
                </Button>
              </Link>
              <div className="flex flex-col">
                <h2 className="text-xl font-bold text-gray-900 md:text-2xl">
                  {isLoading
                    ? "Carregando..."
                    : `${properties.length} imóveis disponíveis`}
                </h2>
                <p className="text-sm text-gray-600 md:text-base">
                  Explore nossa coleção completa de imóveis disponíveis para
                  temporada no Ceará
                </p>
              </div>
            </div>
            <div className="flex gap-2 md:gap-4">
              <Button className="cursor-pointer bg-gray-800 px-3 py-4 text-sm text-gray-100 shadow-md duration-200 hover:scale-[1.02] hover:bg-gray-800 hover:text-white hover:active:scale-95 md:px-4 md:py-5 md:text-base">
                <SlidersHorizontal className="h-4 w-4" />
                <span className="hidden sm:inline">Filtros</span>
              </Button>
              <Button className="cursor-pointer bg-gray-800 px-3 py-4 text-sm text-gray-100 shadow-md duration-200 hover:scale-[1.02] hover:bg-gray-800 hover:text-white hover:active:scale-95 md:px-4 md:py-5 md:text-base">
                A - Z
              </Button>
            </div>
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
      </section>

      <Footer />
    </div>
  );
}
