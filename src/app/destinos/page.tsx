"use client";

import {
  ArrowLeft,
  Building2,
  Palmtree,
  Plane,
  TreePine,
  Umbrella,
  WavesLadder,
} from "lucide-react";
import Link from "next/link";

import Footer from "@/components/Footer";
import Header from "@/components/Header";
import HeaderMobile from "@/components/HeaderMobile";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

// Informações dos destinos populares
const destinations = [
  {
    name: "Fortaleza",
    icon: Building2,
    description: "A capital cearense, centro urbano e cultural do estado",
    slug: "Fortaleza",
    imageUrl:
      "https://i.pinimg.com/1200x/ea/a9/41/eaa9412926e807479d07745b6de1bb7b.jpg",
  },
  {
    name: "Jericoacoara",
    icon: Palmtree,
    description: "Paraíso tropical com dunas, lagoas e pôr do sol inesquecível",
    slug: "Jericoacoara",
    imageUrl:
      "https://media-cdn.tripadvisor.com/media/attractions-splice-spp-720x480/07/ba/0b/99.jpg",
  },
  {
    name: "Canoa Quebrada",
    icon: WavesLadder,
    description: "Famosa praia com falésias coloridas e excelentes ondas",
    slug: "Canoa Quebrada",
    imageUrl:
      "https://dynamic-media-cdn.tripadvisor.com/media/photo-o/09/ab/43/3d/praia-de-canoa-quebrada.jpg?w=1200&h=-1&s=1",
  },
  {
    name: "Praia de Picos",
    icon: Umbrella,
    description: "Destino tranquilo com belas praias e atmosfera relaxante",
    slug: "Praia de Picos",
    imageUrl:
      "https://media-cdn.tripadvisor.com/media/photo-s/15/5c/b8/e1/vista-mais-linda-de-icapui.jpg",
  },
  {
    name: "Morro Branco",
    icon: TreePine,
    description: "Conhecido pelas falésias e artesanato em garrafas de areia",
    slug: "Morro Branco",
    imageUrl:
      "https://t4.ftcdn.net/jpg/03/55/04/09/360_F_355040951_7lwGLbOo7D6FQIYPLWXF6aS0zhcwdI7b.jpg",
  },
  {
    name: "Águas Belas",
    icon: WavesLadder,
    description: "Águas cristalinas e paisagens naturais preservadas",
    slug: "Águas Belas",
    imageUrl:
      "https://passeiosfortalezace.com.br/assets/images/passeios-259/679f56fda72f0647b74d9b9364e4d228/praiadeaguasbelasnomunicipiodecascavel.jpg",
  },
  {
    name: "Cumbuco",
    icon: Palmtree,
    description:
      "Praia paradisíaca próxima a Fortaleza, ideal para esportes aquáticos",
    slug: "Cumbuco",
    imageUrl:
      "https://turismodenatureza.com.br/wp-content/webp-express/webp-images/uploads/2024/07/O_que_Fazer_na_Praia_do_Cumbuco-1199x630.jpg.webp",
  },
  {
    name: "Beach Park",
    icon: Plane,
    description:
      "Complexo turístico com parque aquático e infraestrutura completa",
    slug: "Beach Park",
    imageUrl:
      "https://beachpark.com.br/app/uploads/2025/05/Ajuste-Banner-Site-Institucional-1920-x-770.webp",
  },
];

export default function DestinosPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <HeaderMobile />

      {/* Conteúdo Principal */}
      <div className="container mx-auto mt-15 px-12 py-8">
        <div className="mb-8 text-start">
          <div className="mb-4 flex items-center justify-start gap-3">
            <Link href="/">
              <Button
                size="sm"
                className="bg-gray-800 text-gray-100 shadow-md backdrop-blur-sm transition-all duration-200 hover:bg-gray-900"
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Voltar
              </Button>
            </Link>
            <h1 className="text-3xl font-bold text-gray-900">
              Destinos Populares
            </h1>
          </div>

          <p className="text-md text-gray-600">
            Explore os destinos mais procurados do Ceará e encontre o imóvel
            perfeito para sua temporada
          </p>
        </div>

        {/* Grid de Destinos */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {destinations.map((destination) => {
            return (
              <Link
                key={destination.slug}
                href={`/destino/${encodeURIComponent(destination.slug)}`}
                className="group"
              >
                <Card className="relative h-80 cursor-pointer overflow-hidden shadow-md transition-all duration-300 hover:scale-[1.01] hover:shadow-lg">
                  {/* Background Image */}
                  <div
                    className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-105"
                    style={{
                      backgroundImage: `url('${destination.imageUrl}')`,
                    }}
                  />

                  {/* Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/20 transition-colors duration-300 group-hover:from-black/70 group-hover:via-black/30 group-hover:to-black/10" />

                  {/* Content */}
                  <div className="relative mt-14 flex h-full flex-col justify-between p-6">
                    <div className="text-center">
                      <h3 className="mb-3 text-2xl font-bold text-white drop-shadow-lg">
                        {destination.name}
                      </h3>
                      <p className="mb-4 text-sm leading-relaxed text-gray-100 drop-shadow-md">
                        {destination.description}
                      </p>
                      <span className="inline-block rounded-full bg-white/20 px-4 py-2 text-sm font-medium text-white backdrop-blur-sm transition-all duration-300 group-hover:bg-white/30">
                        Ver imóveis →
                      </span>
                    </div>
                  </div>
                </Card>
              </Link>
            );
          })}
        </div>
      </div>

      <Footer />
    </div>
  );
}
