"use client";

import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { useEffect, useState } from "react";

import AutoCarousel from "@/components/AutoCarousel";
import Footer from "@/components/Footer";
import PropertyCatalog from "@/components/PropertyCatalog";
import ScrollingHeader from "@/components/ScrollingHeader";
import { PropertyWithDetails, searchProperties } from "@/lib/get-properties";

function ResultadosContent() {
  const searchParams = useSearchParams();
  const [properties, setProperties] = useState<PropertyWithDetails[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchInfo, setSearchInfo] = useState<
    | {
        checkIn: string;
        checkOut: string;
        guests: string;
      }
    | {
        municipality?: string;
        city?: string;
        neighborhood?: string;
      }
    | null
  >(null);

  // Função para realizar a busca inicial baseada nos parâmetros da URL
  useEffect(() => {
    async function performInitialSearch() {
      const checkIn = searchParams.get("checkIn");
      const checkOut = searchParams.get("checkOut");
      const guests = searchParams.get("guests");

      // Parâmetros de busca por localização
      const municipality = searchParams.get("municipality");
      const city = searchParams.get("city");
      const neighborhood = searchParams.get("neighborhood");

      if (checkIn && checkOut && guests) {
        // Busca por data e hóspedes
        setSearchInfo({
          checkIn: new Date(checkIn).toLocaleDateString("pt-BR"),
          checkOut: new Date(checkOut).toLocaleDateString("pt-BR"),
          guests,
        });

        try {
          const results = await searchProperties({
            checkIn: new Date(checkIn),
            checkOut: new Date(checkOut),
            maxGuests: Number(guests),
          });
          setProperties(results);
        } catch (error) {
          console.error("Erro ao buscar imóveis:", error);
          setProperties([]);
        }
      } else if (municipality || city || neighborhood) {
        // Busca por localização
        setSearchInfo({
          municipality: municipality || undefined,
          city: city || undefined,
          neighborhood: neighborhood || undefined,
        });

        try {
          const results = await searchProperties({
            municipality: municipality || undefined,
            city: city || undefined,
            neighborhood: neighborhood || undefined,
          });
          setProperties(results);
        } catch (error) {
          console.error("Erro ao buscar imóveis por localização:", error);
          setProperties([]);
        }
      } else {
        setProperties([]);
      }
      setIsLoading(false);
    }

    performInitialSearch();
  }, [searchParams]);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header padrão */}
      <ScrollingHeader />

      {/* Banner com carrossel igual à página principal */}
      <div className="relative h-[80vh]">
        <AutoCarousel />
      </div>

      {/* Seção de resultados */}
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-52">
        {isLoading ? (
          <div className="text-center">
            <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-gray-500 border-r-transparent"></div>
            <p className="mt-4 text-gray-600">Carregando resultados...</p>
          </div>
        ) : (
          <>
            {/* Título dos resultados */}
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900">
                Resultado da Pesquisa: {properties.length} imóveis
              </h2>
              {searchInfo && (
                <p className="mt-2 text-gray-600">
                  {"guests" in searchInfo ? (
                    <>
                      {searchInfo.guests} hóspede
                      {Number(searchInfo.guests) > 1 ? "s" : ""} •{" "}
                      {searchInfo.checkIn} até {searchInfo.checkOut}
                    </>
                  ) : (
                    <>
                      Busca por localização:
                      {searchInfo.municipality && ` ${searchInfo.municipality}`}
                      {searchInfo.city &&
                        (searchInfo.municipality
                          ? `, ${searchInfo.city}`
                          : ` ${searchInfo.city}`)}
                      {searchInfo.neighborhood &&
                        (searchInfo.municipality || searchInfo.city
                          ? `, ${searchInfo.neighborhood}`
                          : ` ${searchInfo.neighborhood}`)}
                    </>
                  )}
                </p>
              )}
            </div>

            {/* Catálogo de propriedades */}
            {properties.length > 0 ? (
              <PropertyCatalog properties={properties} />
            ) : (
              <div className="py-12 text-center">
                <div className="mx-auto max-w-md">
                  <svg
                    className="mx-auto h-12 w-12 text-gray-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                    />
                  </svg>
                  <h3 className="mt-4 text-lg font-medium text-gray-900">
                    Nenhum imóvel encontrado
                  </h3>
                  <p className="mt-2 text-gray-500">
                    Tente ajustar os filtros de busca ou as datas selecionadas.
                  </p>
                </div>
              </div>
            )}
          </>
        )}
      </div>
      {/* Footer */}
      <Footer />
    </div>
  );
}

export default function ResultadosPage() {
  return (
    <Suspense fallback={<div>Carregando...</div>}>
      <ResultadosContent />
    </Suspense>
  );
}
