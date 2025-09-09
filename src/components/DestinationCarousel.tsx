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
    href: "/destino/Fortaleza",
    imageUrl:
      "https://i.pinimg.com/1200x/ea/a9/41/eaa9412926e807479d07745b6de1bb7b.jpg",
  },
  {
    id: "jericoacoara",
    name: "Jericoacoara",
    href: "/destino/Jericoacoara",
    imageUrl:
      "https://media-cdn.tripadvisor.com/media/attractions-splice-spp-720x480/07/ba/0b/99.jpg",
  },
  {
    id: "canoa-quebrada",
    name: "Canoa Quebrada",
    href: "/destino/Canoa%20Quebrada",
    imageUrl:
      "https://dynamic-media-cdn.tripadvisor.com/media/photo-o/09/ab/43/3d/praia-de-canoa-quebrada.jpg?w=1200&h=-1&s=1",
  },
  {
    id: "cumbuco",
    name: "Cumbuco",
    href: "/destino/Cumbuco",
    imageUrl:
      "https://turismodenatureza.com.br/wp-content/webp-express/webp-images/uploads/2024/07/O_que_Fazer_na_Praia_do_Cumbuco-1199x630.jpg.webp",
  },
  {
    id: "beach-park",
    name: "Beach Park",
    href: "/destino/Beach%20Park",
    imageUrl:
      "https://beachpark.com.br/app/uploads/2025/05/Ajuste-Banner-Site-Institucional-1920-x-770.webp",
  },
  {
    id: "morro-branco",
    name: "Morro Branco",
    href: "/destino/Morro%20Branco",
    imageUrl:
      "https://t4.ftcdn.net/jpg/03/55/04/09/360_F_355040951_7lwGLbOo7D6FQIYPLWXF6aS0zhcwdI7b.jpg",
  },
  {
    id: "praia-de-picos",
    name: "Praia de Picos",
    href: "/destino/Praia%20de%20Picos",
    imageUrl:
      "https://media-cdn.tripadvisor.com/media/photo-s/15/5c/b8/e1/vista-mais-linda-de-icapui.jpg",
  },
  {
    id: "aguas-belas",
    name: "Águas Belas",
    href: "/destino/Águas%20Belas",
    imageUrl:
      "https://passeiosfortalezace.com.br/assets/images/passeios-259/679f56fda72f0647b74d9b9364e4d228/praiadeaguasbelasnomunicipiodecascavel.jpg",
  },
  {
    id: "todos-destinos",
    name: "Ver Todos",
    href: "/destinos",
    imageUrl:
      "https://blog.blablacar.com.br/wp-content/uploads/2024/02/praia-de-iracema-fortaleza.webp",
  },
];

export function DestinationCarousel() {
  const [api, setApi] = useState<CarouselApi>();
  const [desktopApi, setDesktopApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);
  const [count, setCount] = useState(0);
  const [desktopCurrent, setDesktopCurrent] = useState(0);
  const [desktopCount, setDesktopCount] = useState(0);

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

  useEffect(() => {
    if (!desktopApi) {
      return;
    }

    setDesktopCount(desktopApi.scrollSnapList().length);
    setDesktopCurrent(desktopApi.selectedScrollSnap() + 1);

    desktopApi.on("select", () => {
      setDesktopCurrent(desktopApi.selectedScrollSnap() + 1);
    });
  }, [desktopApi]);

  // Dividir destinos em grupos de 6 para o carrossel desktop (2 linhas x 3 colunas)
  const destinationGroups = [];
  for (let i = 0; i < destinations.length; i += 6) {
    let group = destinations.slice(i, i + 6);

    // Se o grupo tem menos de 6 items, completar com os primeiros destinos
    if (group.length < 6) {
      const needed = 6 - group.length;
      const fillItems = destinations.slice(0, needed);
      group = [...group, ...fillItems];
    }

    destinationGroups.push(group);
  }

  return (
    <div className="relative">
      {/* Carrossel para Desktop - 2 linhas x 3 colunas */}
      <div className="hidden md:block">
        <Carousel
          setApi={setDesktopApi}
          opts={{
            align: "start",
            loop: true,
          }}
          orientation="vertical"
          className="w-full"
        >
          <CarouselContent className="-mt-4 h-[450px]">
            {destinationGroups.map((group, groupIndex) => (
              <CarouselItem key={groupIndex} className="pt-4">
                <div className="grid grid-cols-3 gap-6">
                  {group.map((destination) => (
                    <Link
                      key={destination.id}
                      href={destination.href}
                      className="group relative h-48 overflow-hidden rounded-lg shadow-md transition-transform duration-500 hover:scale-[1.01]"
                    >
                      <div
                        className="absolute inset-0 bg-cover bg-center"
                        style={{
                          backgroundImage: `url('${destination.imageUrl}')`,
                        }}
                      />
                      <div className="absolute inset-0 bg-black/40 transition-colors duration-300 group-hover:bg-black/30" />
                      <div className="relative flex h-full items-center justify-center">
                        <h3 className="text-center text-xl font-bold text-white">
                          {destination.name}
                        </h3>
                      </div>
                    </Link>
                  ))}
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>

        {/* Indicadores de navegação para desktop */}
        {desktopCount > 1 && (
          <div className="mt-3 -mb-5 flex flex-col items-center justify-center space-y-2">
            {Array.from({ length: desktopCount }).map((_, index) => (
              <button
                key={index}
                onClick={() => desktopApi?.scrollTo(index)}
                className={`h-2 w-2 rounded-full transition-all duration-200 ${
                  index + 1 === desktopCurrent
                    ? "scale-110 bg-white"
                    : "bg-gray-500 hover:bg-gray-300"
                }`}
                aria-label={`Ir para grupo ${index + 1}`}
              />
            ))}
          </div>
        )}
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
