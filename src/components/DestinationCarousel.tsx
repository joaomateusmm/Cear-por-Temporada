"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

import {
  Carousel,
  CarouselApi,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";

interface Destination {
  id: string;
  name: string;
  href: string;
  imageUrl: string;
}

const destinations: Destination[] = [
  {
    id: "fortaleza",
    name: "Fortaleza",
    href: "#fortaleza",
    imageUrl:
      "https://i.pinimg.com/1200x/ea/a9/41/eaa9412926e807479d07745b6de1bb7b.jpg",
  },
  {
    id: "jericoacoara",
    name: "Jericoacoara",
    href: "#jericoacoara",
    imageUrl:
      "https://media-cdn.tripadvisor.com/media/attractions-splice-spp-720x480/07/ba/0b/99.jpg",
  },
  {
    id: "canoa-quebrada",
    name: "Canoa Quebrada",
    href: "#canoa-quebrada",
    imageUrl:
      "https://dynamic-media-cdn.tripadvisor.com/media/photo-o/09/ab/43/3d/praia-de-canoa-quebrada.jpg?w=1200&h=-1&s=1",
  },
  {
    id: "cumbuco",
    name: "Cumbuco",
    href: "#cumbuco",
    imageUrl:
      "https://turismodenatureza.com.br/wp-content/webp-express/webp-images/uploads/2024/07/O_que_Fazer_na_Praia_do_Cumbuco-1199x630.jpg.webp",
  },
  {
    id: "beach-park",
    name: "Beach Park",
    href: "#beach-park",
    imageUrl:
      "https://beachpark.com.br/app/uploads/2025/05/Ajuste-Banner-Site-Institucional-1920-x-770.webp",
  },
  {
    id: "outros",
    name: "Outros",
    href: "#outros",
    imageUrl:
      "https://blog.blablacar.com.br/wp-content/uploads/2024/02/praia-de-iracema-fortaleza.webp",
  },
];

export function DestinationCarousel() {
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

  return (
    <div className="relative">
      {/* Grid para Desktop */}
      <div className="hidden grid-cols-1 gap-6 md:grid md:grid-cols-3">
        {destinations.map((destination) => (
          <Link
            key={destination.id}
            href={destination.href}
            className="group relative h-64 overflow-hidden rounded-lg shadow-md transition-transform duration-500 hover:scale-[1.02]"
          >
            <div
              className="absolute inset-0 bg-cover bg-center"
              style={{
                backgroundImage: `url('${destination.imageUrl}')`,
              }}
            />
            <div className="absolute inset-0 bg-black/40 transition-colors duration-300 group-hover:bg-black/30" />
            <div className="relative flex h-full items-center justify-center">
              <h3 className="text-2xl font-bold text-white">
                {destination.name}
              </h3>
            </div>
          </Link>
        ))}
      </div>

      {/* Carrossel para Mobile */}
      <div className="md:hidden">
        <Carousel
          setApi={setApi}
          opts={{
            align: "start",
            loop: true,
          }}
          className="w-full"
        >
          <CarouselContent className="-ml-4">
            {destinations.map((destination) => (
              <CarouselItem key={destination.id} className="basis-full pl-4">
                <Link
                  href={destination.href}
                  className="group relative block h-64 overflow-hidden rounded-lg shadow-md transition-transform duration-500 hover:scale-[1.02]"
                >
                  <div
                    className="absolute inset-0 bg-cover bg-center"
                    style={{
                      backgroundImage: `url('${destination.imageUrl}')`,
                    }}
                  />
                  <div className="absolute inset-0 bg-black/40 transition-colors duration-300 group-hover:bg-black/30" />
                  <div className="relative flex h-full items-center justify-center">
                    <h3 className="text-2xl font-bold text-white">
                      {destination.name}
                    </h3>
                  </div>
                </Link>
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>

        {/* Dots de navegação - apenas no mobile */}
        {count > 1 && (
          <div className="mt-6 flex justify-center space-x-2">
            {Array.from({ length: count }).map((_, index) => (
              <button
                key={index}
                onClick={() => api?.scrollTo(index)}
                className={`h-2 w-2 rounded-full transition-all duration-200 ${
                  index + 1 === current
                    ? "scale-110 bg-white"
                    : "bg-gray-500 hover:bg-gray-300"
                }`}
                aria-label={`Ir para slide ${index + 1}`}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
