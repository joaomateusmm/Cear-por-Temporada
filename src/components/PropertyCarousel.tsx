"use client";

import { BedDouble, MapPin, Share2, Toilet, Users } from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Carousel,
  CarouselApi,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { PropertyWithDetails } from "@/lib/get-properties";

interface PropertyCarouselProps {
  properties: PropertyWithDetails[];
}

const fallbackImage =
  "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=400&h=300&fit=crop";

export function PropertyCarousel({ properties }: PropertyCarouselProps) {
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);
  const [count, setCount] = useState(0);

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
        }}
        className="w-full"
      >
        <CarouselContent className="-ml-2 md:-ml-4">
          {properties.map((property) => {
            const mainImage =
              property.images.find((img) => img.isMain) || property.images[0];
            const imageUrl = mainImage?.imageUrl || fallbackImage;
            const location = `${property.location.neighborhood}, ${property.location.city}`;
            const dailyPrice = parseFloat(property.pricing.dailyRate);

            return (
              <CarouselItem
                key={property.id}
                className="pl-2 md:basis-1/2 md:pl-4 lg:basis-1/3"
              >
                <Card className="cursor-pointer overflow-hidden transition-shadow hover:shadow-xl">
                  <div className="relative h-64 px-6 pb-0">
                    <div className="relative h-full overflow-hidden rounded-md">
                      <Image
                        src={imageUrl}
                        alt={property.title}
                        fill
                        className="object-cover shadow-md"
                      />
                      <div className="absolute top-4 right-4">
                        <Badge
                          variant="secondary"
                          className="bg-white/90 text-gray-900"
                        >
                          R$ {dailyPrice.toFixed(0)}/noite
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
                      <span className="text-sm text-gray-600">{location}</span>
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
                        className="cursor-pointer bg-[#101828] px-4 py-5 text-gray-100 shadow-md duration-200 hover:scale-[1.02] hover:bg-[#101828] hover:text-white hover:active:scale-95"
                        size="sm"
                        variant="outline"
                      >
                        Ver Detalhes
                      </Button>
                      <div className="space-x-2">
                        <Button
                          className="cursor-pointer bg-[#101828] px-6 py-5 text-gray-100 shadow-md duration-200 hover:scale-[1.02] hover:bg-[#101828] hover:text-white hover:active:scale-95"
                          size="sm"
                          variant="outline"
                        >
                          <Share2 />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </CarouselItem>
            );
          })}
        </CarouselContent>
        {properties.length > 3 && (
          <>
            <CarouselPrevious className="absolute top-1/2 -left-12 -translate-y-1/2 transform drop-shadow-sm" />
            <CarouselNext className="absolute top-1/2 -right-12 -translate-y-1/2 transform drop-shadow-sm" />
          </>
        )}
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

      {/* Contador de posição para mobile
      {count > 1 && (
        <div className="mt-2 flex justify-center md:hidden">
          <span className="text-xs text-gray-500">
            {current} de {count}
          </span>
        </div>
      )} */}
    </div>
  );
}
