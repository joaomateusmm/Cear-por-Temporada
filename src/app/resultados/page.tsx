"use client";

import { CalendarSearch, MapPinHouse } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { useEffect, useState } from "react";

import { AdvancedSearch } from "@/components/AdvancedSearch";
import AutoCarousel from "@/components/AutoCarousel";
import Footer from "@/components/Footer";
import PropertyCatalog from "@/components/PropertyCatalog";
import ScrollingHeader from "@/components/ScrollingHeader";
import { Card, CardContent } from "@/components/ui/card";
import { PropertyWithDetails, searchProperties } from "@/lib/get-properties";

function ResultadosContent() {
  const searchParams = useSearchParams();
  const [properties, setProperties] = useState<PropertyWithDetails[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchInfo, setSearchInfo] = useState<{
    checkIn: string;
    checkOut: string;
    guests: string;
  } | null>(null);

  // Função para realizar a busca inicial baseada nos parâmetros da URL
  useEffect(() => {
    async function performInitialSearch() {
      const checkIn = searchParams.get("checkIn");
      const checkOut = searchParams.get("checkOut");
      const guests = searchParams.get("guests");

      if (checkIn && checkOut && guests) {
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
      } else {
        setProperties([]);
      }
      setIsLoading(false);
    }

    performInitialSearch();
  }, [searchParams]);

  // Função para atualizar os resultados quando uma nova pesquisa é feita
  const handleNewSearchResults = (results: PropertyWithDetails[]) => {
    setProperties(results);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header padrão */}
      <ScrollingHeader />

      {/* Banner com carrossel igual à página principal */}
      <div className="relative h-[80vh] pt-16">
        <AutoCarousel />

        {/* Overlay com pesquisa avançada */}
        <div className="absolute inset-0 z-20 bg-black/40">
          <div className="relative flex h-full items-center justify-center pt-8">
            <div className="mx-auto max-w-[70%] px-4 sm:px-6 lg:px-8">
              {/* Tabs triggers centralizados acima do card - Desktop */}
              <div className="mb-0 flex justify-center">
                <div className="flex">
                  <button className="rounded-t-lg bg-[#101828]/85 px-4 py-3 text-gray-100 backdrop-blur-sm">
                    <CalendarSearch />
                  </button>
                  <button className="rounded-t-lg border-transparent bg-[#101828]/70 px-4 py-3 text-gray-100/70 duration-300 hover:bg-sky-200/80">
                    <MapPinHouse />
                  </button>
                </div>
              </div>

              <Card className="rounded-lg border-0 bg-[#101828]/85 shadow-md backdrop-blur-sm">
                <CardContent className="px-8">
                  <div className="mb-6 text-center">
              <h2 className="mb-2 text-[27px] font-bold text-gray-100">
                Faça sua reserva online
              </h2>
              <h2 className="text-md font-normal text-gray-100">
                Encontre o lugar perfeito pra sua estadia.
              </h2>
            </div>
                  <AdvancedSearch
                    onSearchResults={handleNewSearchResults}
                    redirectOnSearch={false}
                  />
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>

      {/* Seção de resultados */}
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        {isLoading ? (
          <div className="text-center">
            <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-blue-600 border-r-transparent"></div>
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
                  {searchInfo.guests} hóspede
                  {Number(searchInfo.guests) > 1 ? "s" : ""} •{" "}
                  {searchInfo.checkIn} até {searchInfo.checkOut}
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
