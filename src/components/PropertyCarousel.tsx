"use client";

import { Check, Copy, MapPin, Share2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Carousel,
  CarouselApi,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import { Input } from "@/components/ui/input";
import { PropertyWithDetails } from "@/lib/get-properties";

interface PropertyCarouselProps {
  properties: PropertyWithDetails[];
  category?:
    | "casas"
    | "apartamentos"
    | "casas-destaque"
    | "apartamentos-destaque"
    | "imoveis-destaque"
    | "casas-de-praia"
    | "flats"
    | "pousadas";
  title?: string;
}

const fallbackImage =
  "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=400&h=300&fit=crop";

export function PropertyCarousel({
  properties,
  category,
}: PropertyCarouselProps) {
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);
  const [count, setCount] = useState(0);
  const [baseUrl, setBaseUrl] = useState("");
  const [copiedPropertyId, setCopiedPropertyId] = useState<string | null>(null);

  useEffect(() => {
    setBaseUrl(window.location.origin);
  }, []);

  useEffect(() => {
    if (!api) {
      return;
    }

    setCount(api.scrollSnapList().length);
    setCurrent(api.selectedScrollSnap() + 1);

    api.on("select", () => {
      setCurrent(api.selectedScrollSnap() + 1);
    });
  }, [api]);

  if (properties.length === 0) {
    return (
      <div className="py-12 text-center">
        <p className="text-lg text-gray-500">
          Nenhum imóvel disponível no momento
        </p>
        <p className="mt-2 text-sm text-gray-400">
          Novos imóveis serão adicionados em breve
        </p>
      </div>
    );
  }

  return (
    <div className="relative">
      <Carousel
        setApi={setApi}
        opts={{
          align: "start",
          loop: true,
          skipSnaps: false,
          dragFree: false,
        }}
        className="w-full"
      >
        <CarouselContent className="-ml-2 md:-ml-4">
          {properties.map((property) => {
            const mainImage =
              property.images.find((img) => img.isMain) || property.images[0];
            const imageUrl = mainImage?.imageUrl || fallbackImage;
            const location = `${property.location.neighborhood}, ${property.location.city}`;

            return (
              <CarouselItem
                key={property.id}
                className="pl-2 md:basis-1/2 md:pl-4 lg:basis-1/4"
              >
                <Card className="group overflow-hidden duration-300 hover:shadow-lg">
                  <Link href={`/imovel/${property.id}`} className="block">
                    <div className="relative h-64 px-6 pb-0">
                      <div className="relative h-full overflow-hidden rounded-md">
                        <Image
                          src={imageUrl}
                          alt={property.title}
                          fill
                          className="object-cover shadow-md duration-1000 group-hover:scale-[1.02]"
                        />
                      </div>
                    </div>

                    <CardContent className="p-6 pb-2">
                      <div className="mb-2 flex items-start justify-between">
                        <h3 className="line-clamp-2 text-xl font-semibold text-gray-900">
                          {property.title}
                        </h3>
                      </div>

                      <div className="mb-3 flex items-center gap-1">
                        <MapPin className="h-4 w-4 text-gray-400" />
                        <span className="text-sm text-gray-600">
                          {location}
                        </span>
                      </div>

                      <p className="line-clamp-2 text-sm text-gray-600">
                        {property.shortDescription}
                      </p>
                    </CardContent>
                  </Link>

                  <CardContent className="px-6">
                    <div className="flex items-center justify-between">
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button
                            className="cursor-pointer bg-[#101828] px-4 py-5 text-gray-100 shadow-md duration-200 hover:scale-[1.02] hover:bg-[#101828] hover:text-white hover:active:scale-95"
                            size="sm"
                            variant="outline"
                          >
                            Ver Rapidamente
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent className="mx-auto max-h-[90vh] w-[90vw] overflow-y-auto md:w-[400px]">
                          <AlertDialogHeader>
                            <AlertDialogTitle className="text-lg font-bold text-gray-900">
                              {property.title}
                            </AlertDialogTitle>
                            <AlertDialogDescription className="text-sm text-gray-600">
                              <div className="mb-3 flex items-center gap-1">
                                <MapPin className="h-4 w-4 text-gray-400" />
                                <span>{location}</span>
                              </div>
                            </AlertDialogDescription>
                          </AlertDialogHeader>

                          <div className="space-y-4">
                            {/* Informações principais */}
                            <div className="grid grid-cols-2 gap-3 text-sm">
                              <div className="space-y-1">
                                <span className="font-medium text-gray-700">
                                  Estilo:{" "}
                                </span>
                                <span className="text-gray-600">
                                  {property.propertyStyle}
                                </span>
                              </div>
                              <div className="space-y-1">
                                <span className="font-medium text-gray-700">
                                  Cidade:{" "}
                                </span>
                                <span className="text-gray-600">
                                  {property.location.city}
                                </span>
                              </div>
                              <div className="space-y-1">
                                <span className="font-medium text-gray-700">
                                  Bairro:{" "}
                                </span>
                                <span className="text-gray-600">
                                  {property.location.neighborhood}
                                </span>
                              </div>
                              <div className="space-y-1">
                                <span className="font-medium text-gray-700">
                                  Estado:{" "}
                                </span>
                                <span className="text-gray-600">
                                  {property.location.state}
                                </span>
                              </div>
                            </div>

                            {/* Características especiais */}
                            <div className="border-t pt-3">
                              <h4 className="mb-2 font-medium text-gray-900">
                                Características
                              </h4>
                              <div className="space-y-2">
                                <div className="flex items-center gap-2 text-sm">
                                  <span className="text-blue-600">🏠</span>
                                  <span className="text-gray-600">
                                    Ideal para até {property.maxGuests} pessoas
                                  </span>
                                </div>
                                <div className="flex items-center gap-2 text-sm">
                                  <span className="text-green-600">📍</span>
                                  <span className="text-gray-600">
                                    Localização privilegiada
                                  </span>
                                </div>
                                <div className="flex items-center gap-2 text-sm">
                                  <span className="text-yellow-600">⭐</span>
                                  <span className="text-gray-600">
                                    Imóvel verificado
                                  </span>
                                </div>
                              </div>
                            </div>

                            {/* Descrição */}
                            <div className="border-t pt-3">
                              <h4 className="mb-2 font-medium text-gray-900">
                                Sobre o imóvel
                              </h4>
                              <p className="text-sm leading-relaxed text-gray-600">
                                {property.shortDescription}
                              </p>
                            </div>
                          </div>

                          <AlertDialogFooter className="flex flex-row gap-2 pt-4 sm:gap-4">
                            <AlertDialogCancel className="flex-1 bg-gray-100 text-xs shadow-md hover:bg-gray-200">
                              Fechar
                            </AlertDialogCancel>
                            <Link
                              href={`/imovel/${property.id}`}
                              className="flex-1"
                            >
                              <AlertDialogAction className="w-full bg-[#101828] text-xs hover:bg-[#101828]/90">
                                Ver Página Completa
                              </AlertDialogAction>
                            </Link>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>

                      <div className="space-x-2">
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button
                              className="cursor-pointer bg-[#101828] px-6 py-5 text-gray-100 shadow-md duration-200 hover:scale-[1.02] hover:bg-[#101828] hover:text-white hover:active:scale-95"
                              size="sm"
                              variant="outline"
                            >
                              <Share2 />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent className="mx-auto max-h-[90vh] w-[90vw] overflow-y-auto md:w-[400px]">
                            <AlertDialogHeader>
                              <AlertDialogTitle className="text-lg font-bold text-gray-900">
                                Compartilhar este imóvel
                              </AlertDialogTitle>
                              <AlertDialogDescription className="text-sm text-gray-600">
                                <div className="mb-4">
                                  <h4 className="font-medium text-gray-900">
                                    {property.title}
                                  </h4>
                                  <div className="mt-1 flex items-center gap-1">
                                    <MapPin className="h-3 w-3 text-gray-400" />
                                    <span className="text-xs text-gray-600">
                                      {location}
                                    </span>
                                  </div>
                                </div>
                              </AlertDialogDescription>
                            </AlertDialogHeader>

                            <div className="flex items-center gap-2">
                              <Input
                                readOnly
                                value={`${baseUrl}/imovel/${property.id}`}
                                className="flex-1 text-xs"
                              />
                              <Button
                                size="sm"
                                onClick={async () => {
                                  try {
                                    await navigator.clipboard.writeText(
                                      `${baseUrl}/imovel/${property.id}`,
                                    );
                                    setCopiedPropertyId(property.id);
                                    setTimeout(() => {
                                      setCopiedPropertyId(null);
                                    }, 2000);
                                  } catch (err) {
                                    console.error("Erro ao copiar:", err);
                                  }
                                }}
                                className="bg-[#101828] text-white transition-all duration-300 hover:bg-[#101828]/90"
                              >
                                <div className="flex items-center transition-all duration-300 ease-in-out">
                                  <div
                                    className={`transition-all duration-300 ease-in-out ${copiedPropertyId === property.id ? "scale-100 opacity-100" : "scale-100 opacity-100"}`}
                                  >
                                    {copiedPropertyId === property.id ? (
                                      <Check className="mr-1 h-4 w-4 text-green-400" />
                                    ) : (
                                      <Copy className="mr-1 h-4 w-4" />
                                    )}
                                  </div>
                                  <span className="transition-all duration-300 ease-in-out">
                                    {copiedPropertyId === property.id
                                      ? "Copiado"
                                      : "Copiar"}
                                  </span>
                                </div>
                              </Button>
                            </div>

                            <div className="mt-3 border-t border-gray-300"></div>

                            <AlertDialogFooter className="flex flex-row gap-2 pt-4 sm:gap-4">
                              <AlertDialogCancel className="flex-1 bg-gray-100 text-xs shadow-md hover:bg-gray-200">
                                Fechar
                              </AlertDialogCancel>
                              <Link
                                href={`/imovel/${property.id}`}
                                className="flex-1"
                              >
                                <AlertDialogAction className="w-full bg-[#101828] text-xs hover:bg-[#101828]/90">
                                  Ver Página Completa
                                </AlertDialogAction>
                              </Link>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </CarouselItem>
            );
          })}
        </CarouselContent>
      </Carousel>

      {/* Indicadores do carrossel (bolinhas) */}
      {count > 1 && (
        <div className="mt-6 flex justify-center space-x-2">
          {Array.from({ length: count }).map((_, index) => (
            <button
              key={index}
              onClick={() => api?.scrollTo(index)}
              className={`h-2 w-2 rounded-full transition-all duration-200 ${
                index + 1 === current
                  ? "scale-110 bg-[#101828]"
                  : "bg-gray-300 hover:bg-gray-400"
              }`}
              aria-label={`Ir para slide ${index + 1}`}
            />
          ))}
        </div>
      )}

      {count > 1 && (
        <div className="mt-2 flex justify-center">
          {category ? (
            <Link href={`/categoria/${category}`}>
              <span className="cursor-pointer text-xs text-gray-500 underline hover:text-gray-700">
                ver todos
              </span>
            </Link>
          ) : (
            <span className="cursor-pointer text-xs text-gray-500 underline">
              ver todos
            </span>
          )}
        </div>
      )}
    </div>
  );
}
