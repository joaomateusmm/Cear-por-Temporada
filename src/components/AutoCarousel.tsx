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

  // Função para renderizar o card de pesquisa (desktop)
  const renderSearchCard = () => {
    return (
      <div className="mx-auto max-w-md">
        {/* Tabs triggers centralizados acima do card - Desktop */}
        <div className="mb-0 flex justify-center">
          <div className="flex">
            <button className="rounded-t-lg bg-gray-50/85 px-4 py-3 text-[#101828] backdrop-blur-sm">
              <CalendarSearch />
            </button>
            <button className="rounded-t-lg border-transparent bg-gray-300/70 px-4 py-3 text-[#101828]/70 duration-300 hover:bg-gray-200/70">
              <MapPinHouse />
            </button>
          </div>
        </div>

        <Card className="rounded-lg border-0 bg-gray-50/85 shadow-lg backdrop-blur-sm">
          <CardContent className="px-6 pt-6 pb-2">
            <div className="mb-6 text-center">
              <h2 className="mb-2 text-[27px] font-bold text-gray-800">
                Faça sua reserva online
              </h2>
              <h2 className="text-md font-normal text-gray-800">
                Encontre o lugar perfeito pra sua estadia.
              </h2>
            </div>
            {/* AdvancedSearch */}
            <AdvancedSearch />
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
          <CarouselItem className="relative min-h-[80vh] w-full flex-[0_0_100%]">
            <div
              className="absolute inset-0 bg-cover bg-center"
              style={{
                backgroundImage: "url('/banners/park.png')",
              }}
            />
            <div className="absolute inset-0 bg-black/50" />
            <div className="relative z-10 flex h-full items-end pb-8">
              <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
                {/* Texto centralizado na parte inferior */}
                <div className="mb-6 text-center">
                  <h1 className="text-4xl font-bold text-white md:text-6xl">
                    Beach Park
                  </h1>
                  <p className="mx-auto max-w-3xl text-lg text-white/90 md:text-xl">
                    Hospede-se pertinho do maior parque aquático da América
                    Latina e com o pé na areia.
                  </p>
                </div>
              </div>
            </div>
          </CarouselItem>

          {/* Slide 2 - Casal */}
          <CarouselItem className="relative min-h-[70vh] w-full flex-[0_0_100%]">
            <div
              className="absolute inset-0 bg-cover bg-center"
              style={{
                backgroundImage: "url('/banners/quatro.jpg')",
              }}
            />
            <div className="absolute inset-0 bg-black/25" />
            <div className="relative z-10 flex h-full items-end pb-8">
              <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
                {/* Texto centralizado na parte inferior */}
                <div className="mb-6 text-center">
                  <h1 className="text-4xl font-bold text-white md:text-6xl">
                    Experiência a Dois
                  </h1>
                  <p className="max-w-sm text-lg text-white/90 md:text-xl">
                    Criem memórias inesquecíveis juntos. Nossos imóveis
                    românticos oferecem o cenário perfeito para casais.
                  </p>
                </div>
              </div>
            </div>
          </CarouselItem>

          {/* Slide 3 - Praia bonita */}
          <CarouselItem className="relative min-h-[70vh] w-full flex-[0_0_100%]">
            <div
              className="absolute inset-0 bg-cover bg-center"
              style={{
                backgroundImage: "url('/banners/tres.jpg')",
              }}
            />
            <div className="absolute inset-0 bg-black/25" />
            <div className="relative z-10 flex h-full items-end pb-8">
              <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
                {/* Texto centralizado na parte inferior */}
                <div className="mb-3 text-center">
                  <h1 className="text-4xl font-bold text-white md:text-6xl">
                    Paraíso Natural
                  </h1>
                  <p className="mx-auto max-w-3xl text-lg text-white/90 md:text-xl">
                    Descubra as praias mais exuberantes do Ceará. Nossos imóveis
                    oferecem acesso privilegiado às belezas naturais da região.
                  </p>
                </div>
              </div>
            </div>
          </CarouselItem>

          {/* Slide 4 - Praia bonita 2 */}
          <CarouselItem className="relative min-h-[70vh] w-full flex-[0_0_100%]">
            <div
              className="absolute inset-0 bg-cover bg-center"
              style={{
                backgroundImage: "url('/banners/dois.jpg')",
              }}
            />
            <div className="absolute inset-0 bg-black/25" />
            <div className="relative z-10 flex h-full items-end pb-8">
              <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
                {/* Texto centralizado na parte inferior */}
                <div className="mb-4 text-center">
                  <h1 className="text-4xl font-bold text-white md:text-6xl">
                    Refúgio Exclusivo
                  </h1>
                  <p className="mx-auto max-w-3xl text-lg text-white/90 md:text-xl">
                    Viva momentos únicos em locais paradisíacos. Onde o luxo e a
                    natureza se encontram para criar experiências memoráveis.
                  </p>
                </div>
              </div>
            </div>
          </CarouselItem>
        </CarouselContent>
      </Carousel>

      {/* Card de pesquisa fixo centralizado por cima de todos os slides */}
      <div className="pointer-events-none absolute inset-0 z-30 mb-25 flex items-center justify-center">
        <div className="pointer-events-auto">
          {/* Card para desktop */}
          <div className="hidden lg:block">{renderSearchCard()}</div>

          {/* Card para mobile */}
          <div className="block px-4 lg:hidden">
            <div className="mx-auto max-w-md">
              {/* Tabs triggers centralizados acima do card - Mobile */}
              <div className="mb-0 flex justify-center">
                <div className="flex">
                  <button className="rounded-t-lg bg-gray-200/85 px-4 py-3 text-[#101828] backdrop-blur-sm">
                    <CalendarSearch />
                  </button>
                  <button className="rounded-t-lg border-transparent bg-gray-300/70 px-4 py-3 text-[#101828]/70 duration-300 hover:bg-gray-200/70">
                    <MapPinHouse />
                  </button>
                </div>
              </div>

              <Card className="mb-10 rounded-lg border-0 bg-gray-200/85 shadow-lg backdrop-blur-sm">
                <CardContent className="p-6">
                  <div className="mb-10 text-center">
                    <h2 className="mb-2 text-[27px] font-bold text-gray-800">
                      Faça sua reserva online
                    </h2>
                    <h2 className="text-md font-normal text-gray-800">
                      Encontre o lugar perfeito pra sua estadia
                    </h2>
                  </div>
                  <AdvancedSearch />
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
