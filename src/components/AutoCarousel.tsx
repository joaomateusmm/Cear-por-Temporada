"use client";

import {
  BedDouble,
  Bookmark,
  MapPin,
  Share2,
  Toilet,
  Users,
} from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import { getPropertiesByClass } from "@/lib/property-actions";

interface PropertyData {
  id: string;
  title: string;
  shortDescription: string;
  maxGuests: number;
  bedrooms: number;
  bathrooms: number;
  city: string | null;
  state: string | null;
  neighborhood: string | null;
  dailyRate: string | null;
  imageUrl: string | null;
}

export default function AutoCarousel() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [api, setApi] = useState<any>(undefined);
  const [resetTimer, setResetTimer] = useState(0);

  // States para os imóveis dos banners
  const [beachParkProperty, setBeachParkProperty] =
    useState<PropertyData | null>(null);
  const [aDoisProperty, setADoisProperty] = useState<PropertyData | null>(null);

  // Carregar imóveis por classe
  useEffect(() => {
    async function loadBannerProperties() {
      try {
        const [beachPark, aDois] = await Promise.all([
          getPropertiesByClass("Imovel Banner Beach Park"),
          getPropertiesByClass("Imovel Banner a Dois"),
        ]);

        setBeachParkProperty(beachPark);
        setADoisProperty(aDois);
      } catch (error) {
        console.error("Erro ao carregar imóveis dos banners:", error);
      }
    }

    loadBannerProperties();
  }, []);

  // Função para renderizar o card do imóvel
  const renderPropertyCard = (
    property: PropertyData | null,
    fallbackImage: string,
    fallbackTitle: string,
    fallbackDescription: string,
    fallbackPrice: string,
    fallbackLocation: string,
  ) => {
    if (!property) {
      // Fallback para quando não há imóvel da classe específica
      return (
        <Card className="cursor-pointer overflow-hidden transition-shadow hover:shadow-xl">
          <div className="relative h-64 px-6 pb-0">
            <div className="relative h-full overflow-hidden rounded-md">
              <Image
                src={fallbackImage}
                alt={fallbackTitle}
                fill
                className="object-cover shadow-md"
              />
              <div className="absolute top-4 right-4">
                <Badge
                  variant="secondary"
                  className="bg-white/90 text-gray-900"
                >
                  {fallbackPrice}
                </Badge>
              </div>
            </div>
          </div>

          <CardContent className="p-6">
            <div className="mb-2 flex items-start justify-between">
              <h3 className="line-clamp-2 text-xl font-semibold text-gray-900">
                {fallbackTitle}
              </h3>
            </div>

            <div className="mb-3 flex items-center gap-1">
              <MapPin className="h-4 w-4 text-gray-400" />
              <span className="text-sm text-gray-600">{fallbackLocation}</span>
            </div>

            <p className="mb-4 line-clamp-2 text-sm text-gray-600">
              {fallbackDescription}
            </p>

            <div className="mb-4 flex items-center gap-5 text-sm text-gray-600">
              <div className="flex items-center gap-1">
                <span className="flex items-center gap-1">
                  6 <Users className="h-4 w-4" />
                </span>
              </div>
              <div className="flex items-center gap-1">
                <span className="flex items-center gap-1">
                  3 <BedDouble className="h-4 w-4" />
                </span>
              </div>
              <div className="flex items-center gap-1">
                <span className="flex items-center gap-1">
                  2 <Toilet className="h-4 w-4" />
                </span>
              </div>
            </div>

            <div className="-mb-7 flex items-center justify-between">
              <Button
                className="bg-[#101828] px-4 py-5 text-gray-100 shadow-md duration-200 hover:scale-[1.02] hover:bg-[#101828]/90 hover:text-white hover:active:scale-95"
                size="sm"
                variant="outline"
              >
                Ver Detalhes
              </Button>
              <div className="space-x-2">
                <Button
                  className="bg-[#101828] px-6 py-5 text-gray-100 shadow-md duration-200 hover:scale-[1.02] hover:bg-[#101828]/90 hover:text-white hover:active:scale-95"
                  size="sm"
                  variant="outline"
                >
                  <Share2 />
                </Button>
                <Button
                  className="bg-[#101828] px-6 py-5 text-gray-100 shadow-md duration-200 hover:scale-[1.02] hover:bg-[#101828]/90 hover:text-white hover:active:scale-95"
                  size="sm"
                  variant="outline"
                >
                  <Bookmark />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      );
    }

    // Renderizar com dados reais do banco
    const displayPrice = property.dailyRate
      ? `R$ ${property.dailyRate}/noite`
      : fallbackPrice;
    const displayLocation =
      property.city && property.state
        ? `${property.city}, ${property.state}`
        : fallbackLocation;
    const displayImage = property.imageUrl || fallbackImage;

    return (
      <Card className="cursor-pointer overflow-hidden transition-shadow hover:shadow-xl">
        <div className="relative h-64 px-6 pb-0">
          <div className="relative h-full overflow-hidden rounded-md">
            <Image
              src={displayImage}
              alt={property.title}
              fill
              className="object-cover shadow-md"
            />
            <div className="absolute top-4 right-4">
              <Badge variant="secondary" className="bg-white/90 text-gray-900">
                {displayPrice}
              </Badge>
            </div>
          </div>
        </div>

        <CardContent className="p-6">
          <div className="mb-2 flex items-start justify-between">
            <h3 className="line-clamp-2 text-xl font-semibold text-gray-900">
              {property.title}
            </h3>
          </div>

          <div className="mb-3 flex items-center gap-1">
            <MapPin className="h-4 w-4 text-gray-400" />
            <span className="text-sm text-gray-600">{displayLocation}</span>
          </div>

          <p className="mb-4 line-clamp-2 text-sm text-gray-600">
            {property.shortDescription}
          </p>

          <div className="mb-4 flex items-center gap-5 text-sm text-gray-600">
            <div className="flex items-center gap-1">
              <span className="flex items-center gap-1">
                {property.maxGuests} <Users className="h-4 w-4" />
              </span>
            </div>
            <div className="flex items-center gap-1">
              <span className="flex items-center gap-1">
                {property.bedrooms} <BedDouble className="h-4 w-4" />
              </span>
            </div>
            <div className="flex items-center gap-1">
              <span className="flex items-center gap-1">
                {property.bathrooms} <Toilet className="h-4 w-4" />
              </span>
            </div>
          </div>

          <div className="-mb-7 flex items-center justify-between">
            <Button
              className="bg-[#101828] px-4 py-5 text-gray-100 shadow-md duration-200 hover:scale-[1.02] hover:bg-[#101828]/90 hover:text-white hover:active:scale-95"
              size="sm"
              variant="outline"
            >
              Ver Detalhes
            </Button>
            <div className="space-x-2">
              <Button
                className="bg-[#101828] px-6 py-5 text-gray-100 shadow-md duration-200 hover:scale-[1.02] hover:bg-[#101828]/90 hover:text-white hover:active:scale-95"
                size="sm"
                variant="outline"
              >
                <Share2 />
              </Button>
              <Button
                className="bg-[#101828] px-6 py-5 text-gray-100 shadow-md duration-200 hover:scale-[1.02] hover:bg-[#101828]/90 hover:text-white hover:active:scale-95"
                size="sm"
                variant="outline"
              >
                <Bookmark />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
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
    }, 600000000); // 6 segundos

    return () => clearInterval(interval);
  }, [api, resetTimer]); // Dependência do resetTimer faz o timer reiniciar

  return (
    <Carousel
      setApi={setApi}
      opts={{
        align: "start",
        loop: true,
      }}
      className="h-full w-full"
    >
      <CarouselContent className="h-full">
        {/* Slide 1 - Beach Park */}
        <CarouselItem className="relative min-h-[80vh]">
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{
              backgroundImage: "url('/banners/park.png')",
            }}
          />
          <div className="absolute inset-0 bg-black/50" />
          <div className="relative z-10 flex h-full items-center">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
              <div className="grid grid-cols-1 gap-18 lg:grid-cols-2 lg:items-center">
                {/* Texto à esquerda */}
                <div className="space-y-6 text-left">
                  <h1 className="mb-6 text-4xl font-bold text-white md:text-6xl">
                    Beach Park
                  </h1>
                  <p className="max-w-2xl text-lg text-white/90 md:text-xl">
                    Hospede-se pertinho do maior parque aquático da América
                    Latina. Temos imóveis exclusivos a poucos minutos do Beach
                    Park para você aproveitar ao máximo sua diversão em família.
                  </p>
                  <Button className="rounded-full border border-gray-500/20 bg-[#101828]/90 px-12 py-6 text-lg backdrop-blur-md duration-300 hover:bg-[#101828]">
                    Saiba Mais
                  </Button>
                </div>

                {/* Card do imóvel à direita */}
                <div className="hidden max-w-[400px] lg:block">
                  {renderPropertyCard(
                    beachParkProperty,
                    "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=400&h=300&fit=crop",
                    "Casa de Praia Moderna",
                    "Casa moderna com piscina privativa e vista para o mar, perfeita para famílias.",
                    "R$ 350/noite",
                    "Aquiraz, Ceará",
                  )}
                </div>
              </div>
            </div>
          </div>
        </CarouselItem>

        {/* Slide 2 - Casal */}
        <CarouselItem className="relative min-h-[70vh]">
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{
              backgroundImage: "url('/banners/quatro.jpg')",
            }}
          />
          <div className="absolute inset-0 bg-black/25" />
          <div className="relative z-10 flex h-full items-center">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
              <div className="grid grid-cols-1 gap-8 lg:grid-cols-2 lg:items-center">
                {/* Texto à esquerda */}
                <div className="space-y-4 text-left">
                  <h1 className="mb-6 text-4xl font-bold text-white md:text-6xl">
                    Experiência a Dois
                  </h1>
                  <p className="max-w-2xl text-lg text-white/90 md:text-xl">
                    Criem memórias inesquecíveis juntos. Nossos imóveis
                    românticos oferecem o cenário perfeito para sua escapada
                    romântica, com vista para o mar e toda privacidade que vocês
                    merecem.
                  </p>
                  <Button className="rounded-full border border-gray-500/20 bg-[#101828]/90 px-12 py-6 text-lg backdrop-blur-md duration-300 hover:bg-[#101828]">
                    Saiba Mais
                  </Button>
                </div>

                {/* Card do imóvel à direita */}
                <div className="hidden max-w-[400px] lg:block">
                  {renderPropertyCard(
                    aDoisProperty,
                    "https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=400&h=300&fit=crop",
                    "Apartamento Vista Mar",
                    "Apartamento moderno com vista panorâmica do mar, perfeito para casais românticos.",
                    "R$ 280/noite",
                    "Fortaleza, Ceará",
                  )}
                </div>
              </div>
            </div>
          </div>
        </CarouselItem>

        {/* Slide 4 - Praia bonita */}
        <CarouselItem className="relative min-h-[70vh]">
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{
              backgroundImage: "url('/banners/tres.jpg')",
            }}
          />
          <div className="absolute inset-0 bg-black/25" />
          <div className="relative z-10 flex h-full items-center">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
              <div className="max-w-4xl"></div>
            </div>
          </div>
        </CarouselItem>

        {/* Slide 5 - Praia bonita 2 */}
        <CarouselItem className="relative min-h-[70vh]">
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{
              backgroundImage: "url('/banners/dois.jpg')",
            }}
          />
          <div className="absolute inset-0 bg-black/25" />
          <div className="relative z-10 flex h-full items-center">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
              <div className="max-w-4xl"></div>
            </div>
          </div>
        </CarouselItem>
      </CarouselContent>
    </Carousel>
  );
}
