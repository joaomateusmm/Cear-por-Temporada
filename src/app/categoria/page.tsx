"use client";

import { ArrowLeft } from "lucide-react";
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
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="flex justify-between">
            <div className="mt-10 mb-8 flex items-center justify-start gap-4">
              <Link href="/">
                <Button className="cursor-pointer bg-gray-800 px-4 py-5 text-gray-100 shadow-md duration-200 hover:scale-[1.02] hover:bg-gray-800 hover:text-white hover:active:scale-95">
                  <ArrowLeft className="h-4 w-4" />
                  Voltar
                </Button>
              </Link>
              <div>
                <h2 className="text-2xl font-bold text-gray-900">
                  {isLoading
                    ? "Carregando..."
                    : `${properties.length} imóveis disponíveis`}
                </h2>
                <p className="text-gray-600">
                  Explore nossa coleção completa de imóveis disponíveis para
                  temporada no Ceará
                </p>
              </div>
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
