"use client";

import { CalendarSearch, MapPinHouse } from "lucide-react";
import { useEffect, useState } from "react";

import { Card, CardContent } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";

import { AdvancedSearch } from "./AdvancedSearch";

export default function AutoCarousel() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [api, setApi] = useState<any>(undefined);
  const [resetTimer, setResetTimer] = useState(0);
  const [searchMode, setSearchMode] = useState<"date" | "location">("date");

  // Função para renderizar o card de pesquisa (desktop)
  const renderSearchCard = () => {
    return (
      <div className="mx-auto max-w-md">
        {/* Tabs triggers centralizados acima do card - Desktop */}
        <div className="mb-0 flex justify-center">
          <div className="flex">
            <button
              onClick={() => setSearchMode("date")}
              className={`rounded-t-lg px-4 py-3 text-gray-100 backdrop-blur-sm transition-all duration-300 ${
                searchMode === "date"
                  ? "bg-[#101828]/85"
                  : "bg-[#101828]/70 hover:bg-[#101828]/80"
              }`}
            >
              <CalendarSearch />
            </button>
            <button
              onClick={() => setSearchMode("location")}
              className={`rounded-t-lg px-4 py-3 text-gray-100 backdrop-blur-sm transition-all duration-300 ${
                searchMode === "location"
                  ? "bg-[#101828]/85"
                  : "bg-[#101828]/70 hover:bg-[#101828]/80"
              }`}
            >
              <MapPinHouse />
            </button>
          </div>
        </div>

        <Card className="rounded-lg border-0 bg-[#101828]/85 shadow-md backdrop-blur-sm">
          <CardContent className="px-6 pt-6 pb-2">
            <div className="mb-6 text-center">
              <h2 className="mb-2 text-[27px] font-bold text-gray-100">
                {searchMode === "date"
                  ? "Faça sua reserva online"
                  : "Busque por localização"}
              </h2>
              <h2 className="text-md font-normal text-gray-100">
                {searchMode === "date"
                  ? "Encontre o lugar perfeito pra sua estadia."
                  : "Encontre imóveis por município, cidade ou bairro."}
              </h2>
            </div>
            {/* AdvancedSearch */}
            <AdvancedSearch
              searchMode={searchMode}
              onModeChange={setSearchMode}
            />
          </CardContent>
        </Card>
      </div>
    );
  };

  useEffect(() => {
    if (!api) {
      return;
    }

    // Escutar eventos de interação manual
    const handleManualInteraction = () => {
      setResetTimer((prev) => prev + 1); // Força reinicialização do timer
    };

    // Adicionar listeners para detectar interação manual
    api.on("select", handleManualInteraction);
    api.on("pointerDown", handleManualInteraction);

    return () => {
      // Limpar listeners
      api.off("select", handleManualInteraction);
      api.off("pointerDown", handleManualInteraction);
    };
  }, [api]);

  useEffect(() => {
    if (!api) {
      return;
    }

    const interval = setInterval(() => {
      api.scrollNext();
    }, 8000); // 8 segundos

    return () => clearInterval(interval);
  }, [api, resetTimer]); // Dependência do resetTimer faz o timer reiniciar

  return (
    <div className="relative h-full w-full overflow-hidden">
      <Carousel
        setApi={setApi}
        opts={{
          align: "center",
          loop: true,
          containScroll: "trimSnaps",
          dragFree: false,
        }}
        className="h-full w-full"
      >
        <CarouselContent className="-ml-0 h-full">
          {/* Slide 1 - Beach Park */}
          <CarouselItem className="relative min-h-[95vh] w-full flex-[0_0_100%]">
            <div
              className="absolute inset-0 bg-cover bg-center"
              style={{
                backgroundImage: "url('/banners/park.png')",
              }}
            />
            <div className="absolute inset-0 bg-black/50" />
          </CarouselItem>

          {/* Slide 2 - Casal */}
          <CarouselItem className="relative min-h-[95vh] w-full flex-[0_0_100%]">
            <div
              className="absolute inset-0 bg-cover bg-center"
              style={{
                backgroundImage: "url('/banners/quatro.jpg')",
              }}
            />
            <div className="absolute inset-0 bg-black/25" />
          </CarouselItem>

          {/* Slide 3 - Praia bonita */}
          <CarouselItem className="relative min-h-[95vh] w-full flex-[0_0_100%]">
            <div
              className="absolute inset-0 bg-cover bg-center"
              style={{
                backgroundImage: "url('/banners/tres.jpg')",
              }}
            />
            <div className="absolute inset-0 bg-black/25" />
          </CarouselItem>

          {/* Slide 4 - Praia bonita 2 */}
          <CarouselItem className="relative min-h-[95vh] w-full flex-[0_0_100%]">
            <div
              className="absolute inset-0 bg-cover bg-center"
              style={{
                backgroundImage: "url('/banners/dois.jpg')",
              }}
            />
            <div className="absolute inset-0 bg-black/25" />
          </CarouselItem>
        </CarouselContent>
      </Carousel>

      {/* Card de pesquisa fixo centralizado por cima de todos os slides */}
      <div className="pointer-events-none absolute inset-0 z-30 mb-25 flex items-center justify-center pt-32">
        <div className="pointer-events-auto">
          {/* Card para desktop */}
          <div className="hidden lg:block">{renderSearchCard()}</div>

          {/* Card para mobile */}
          <div className="block px-4 lg:hidden">
            <div className="mx-auto max-w-md">
              {/* Tabs triggers centralizados acima do card - Mobile */}
              <div className="mb-0 flex justify-center">
                <div className="flex">
                  <button
                    onClick={() => setSearchMode("date")}
                    className={`rounded-t-lg px-4 py-3 text-gray-100 backdrop-blur-sm transition-all duration-300 ${
                      searchMode === "date"
                        ? "bg-[#101828]/85"
                        : "bg-[#101828]/70 hover:bg-[#101828]/80"
                    }`}
                  >
                    <CalendarSearch />
                  </button>
                  <button
                    onClick={() => setSearchMode("location")}
                    className={`rounded-t-lg px-4 py-3 text-gray-100 backdrop-blur-sm transition-all duration-300 ${
                      searchMode === "location"
                        ? "bg-[#101828]/85"
                        : "bg-[#101828]/70 hover:bg-[#101828]/80"
                    }`}
                  >
                    <MapPinHouse />
                  </button>
                </div>
              </div>

              <Card className="rounded-lg border-0 bg-[#101828]/85 shadow-md backdrop-blur-sm">
                <CardContent className="p-6">
                  <div className="mb-10 text-center">
                    <h2 className="mb-2 text-[27px] font-bold text-gray-100">
                      {searchMode === "date"
                        ? "Faça sua reserva online"
                        : "Busque por localização"}
                    </h2>
                    <h2 className="text-md font-normal text-gray-100">
                      {searchMode === "date"
                        ? "Encontre o lugar perfeito pra sua estadia"
                        : "Encontre imóveis por município, cidade ou bairro"}
                    </h2>
                  </div>
                  <AdvancedSearch
                    searchMode={searchMode}
                    onModeChange={setSearchMode}
                  />
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
