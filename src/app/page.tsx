import { Dog, MapPin, Search, Star, Users, Utensils, Wifi } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Input } from "@/components/ui/input";
import {
  getPropertiesByClass,
  getPropertiesByType,
  PropertyWithDetails,
} from "@/lib/get-properties";

// Dados fictícios para propriedades sem imagem
const fallbackImage =
  "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=400&h=300&fit=crop";

// Componente para renderizar uma seção de propriedades
function PropertySection({
  title,
  description,
  properties,
}: {
  title: string;
  description: string;
  properties: PropertyWithDetails[];
}) {
  return (
    <section className="py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-12 text-center">
          <h2 className="mb-4 text-3xl font-bold text-gray-900 md:text-4xl">
            {title}
          </h2>
          <p className="mx-auto max-w-2xl text-lg text-gray-600">
            {description}
          </p>
        </div>

        {properties.length > 0 ? (
          <div className="relative">
            <Carousel
              opts={{
                align: "start",
                loop: true,
              }}
              className="w-full"
            >
              <CarouselContent className="-ml-2 md:-ml-4">
                {properties.map((property) => {
                  const mainImage =
                    property.images.find((img) => img.isMain) ||
                    property.images[0];
                  const imageUrl = mainImage?.imageUrl || fallbackImage;
                  const location = `${property.location.neighborhood}, ${property.location.city}`;
                  const dailyPrice = parseFloat(property.pricing.dailyRate);

                  return (
                    <CarouselItem
                      key={property.id}
                      className="pl-2 md:basis-1/2 md:pl-4 lg:basis-1/3"
                    >
                      <Card className="cursor-pointer overflow-hidden transition-shadow hover:shadow-xl">
                        <div className="relative h-64">
                          <Image
                            src={imageUrl}
                            alt={property.title}
                            fill
                            className="object-cover"
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

                        <CardContent className="p-6">
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

                          <p className="mb-4 line-clamp-2 text-sm text-gray-600">
                            {property.shortDescription}
                          </p>

                          <div className="mb-4 flex items-center gap-4 text-sm text-gray-600">
                            <div className="flex items-center gap-1">
                              <Users className="h-4 w-4" />
                              <span>{property.maxGuests} hóspedes</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <span>{property.bedrooms} quartos</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <span>{property.bathrooms} banheiros</span>
                            </div>
                          </div>

                          <div className="mb-4 flex items-center gap-2">
                            <div className="flex items-center gap-1 text-gray-500">
                              <Wifi className="h-4 w-4" />
                            </div>
                            {property.allowsPets && (
                              <div className="flex items-center gap-1 text-gray-500">
                                <Dog className="h-4 w-4" />
                              </div>
                            )}
                            <div className="flex items-center gap-1 text-gray-500">
                              <Utensils className="h-4 w-4" />
                            </div>
                          </div>

                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-1">
                              <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                              <span className="font-medium">4.8</span>
                              <span className="text-sm text-gray-500">
                                (Novo)
                              </span>
                            </div>
                            <Button size="sm" variant="outline">
                              Ver Detalhes
                            </Button>
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
          </div>
        ) : (
          <div className="py-12 text-center">
            <p className="text-lg text-gray-500">
              Nenhum imóvel disponível no momento
            </p>
            <p className="mt-2 text-sm text-gray-400">
              Novos imóveis serão adicionados em breve
            </p>
          </div>
        )}
      </div>
    </section>
  );
}

export default async function Home() {
  // Buscar imóveis por classe "Imóvel em Destaque"
  const featuredProperties = await getPropertiesByClass("Imóvel em Destaque");

  // Buscar imóveis por tipo específico
  const apartments = await getPropertiesByType("Apartamento");
  const houses = await getPropertiesByType("Casa");

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Banner Principal com Header integrado */}
      <section
        className="relative bg-cover bg-center bg-no-repeat text-white"
        style={{
          backgroundImage: "url('/assets/hero-background.jpg')",
        }}
      >
        {/* Overlay escuro */}
        <div className="absolute inset-0 bg-black/50"></div>

        {/* Header */}
        <header className="relative z-10 border-b border-gray-50/10 bg-black/5 backdrop-blur-md">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex h-24 items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="text-2xl font-bold text-white">Logo</div>
              </div>
              <nav className="hidden items-center gap-6 font-medium md:flex">
                <Link
                  href="/"
                  className="text-white/90 transition-colors hover:text-white"
                >
                  Início
                </Link>
                <a
                  href="#"
                  className="text-white/90 transition-colors hover:text-white"
                >
                  Destinos
                </a>
                <a
                  href="#"
                  className="text-white/90 transition-colors hover:text-white"
                >
                  Sobre
                </a>
                <a
                  href="#"
                  className="text-white/90 transition-colors hover:text-white"
                >
                  Contato
                </a>
              </nav>
              <div className="flex items-center">
                <Button className="rounded-3xl bg-gray-300/20 p-6 px-8 backdrop-blur-md duration-500 hover:bg-gray-300/40">
                  Começar
                </Button>
              </div>
            </div>
          </div>
        </header>

        {/* Conteúdo do Banner */}
        <div className="relative z-10 mx-auto max-w-7xl px-4 py-32 text-start sm:px-6 lg:px-8">
          <h1 className="mb-6 text-4xl font-bold md:text-6xl">
            Descubra o Ceará
          </h1>
          <p className="mb-8 max-w-2xl text-xl text-gray-300 md:text-lg">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Illo
            consequatur sapiente necessitatibus magnam possimus, minus
            consectetur cumque corrupti alias, dignissimos, dicta molestiae
            nulla rem obcaecati. Est recusandae iste quisquam aspernatur.
          </p>
          <Button className="h-15 w-[30%] rounded-full border border-gray-300/40 bg-gray-300/20 backdrop-blur-sm hover:bg-gray-300/30">
            Saiba Mais
          </Button>
        </div>
      </section>

      {/* Área de Pesquisa */}
      <section className="relative z-20 -mt-16 mb-4">
        <div className="mx-auto max-w-[70%] px-4 sm:px-6 lg:px-8">
          <Card className="rounded-full border-0 bg-white/95 shadow-lg backdrop-blur-sm">
            <CardContent className="p-8">
              <div className="grid grid-cols-1 gap-4 md:grid-cols-5">
                <div className="md:col-span-2">
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    Localização
                  </label>
                  <Input
                    type="text"
                    placeholder="Onde você quer ficar?"
                    className="h-12 w-full"
                  />
                </div>
                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    Check-in
                  </label>
                  <Input type="date" className="h-12 w-full" />
                </div>
                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    Check-out
                  </label>
                  <Input type="date" className="h-12 w-full" />
                </div>
                <div className="flex items-end">
                  <Button
                    size="lg"
                    className="h-12 w-full bg-blue-600 hover:bg-blue-700"
                  >
                    <Search className="mr-2 h-5 w-5" />
                    Buscar
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Seções de Imóveis por Tipo */}
      <PropertySection
        title="Imóveis em Destaque"
        description="Selecionamos as melhores opções para tornar sua viagem inesquecível"
        properties={featuredProperties}
      />

      <PropertySection
        title="Apartamentos"
        description="Apartamentos modernos e confortáveis em localização privilegiada"
        properties={apartments}
      />

      <PropertySection
        title="Casas"
        description="Casas espaçosas para você e sua família desfrutarem com total privacidade"
        properties={houses}
      />

      {/* Footer */}
      <footer className="bg-gray-900 py-16 text-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
            <div className="md:col-span-2">
              <div className="mb-4 text-2xl font-bold">
                🏖️ Ceará por Temporada
              </div>
              <p className="mb-4 max-w-md text-gray-300">
                A plataforma líder em aluguel de imóveis por temporada no Ceará.
                Conectamos viajantes aos melhores destinos do estado.
              </p>
              <div className="flex gap-4">
                <a
                  href="#"
                  className="text-gray-400 transition-colors hover:text-white"
                >
                  Facebook
                </a>
                <a
                  href="#"
                  className="text-gray-400 transition-colors hover:text-white"
                >
                  Instagram
                </a>
                <a
                  href="#"
                  className="text-gray-400 transition-colors hover:text-white"
                >
                  WhatsApp
                </a>
              </div>
            </div>

            <div>
              <h4 className="mb-4 font-semibold">Destinos</h4>
              <ul className="space-y-2 text-gray-300">
                <li>
                  <a href="#" className="transition-colors hover:text-white">
                    Fortaleza
                  </a>
                </li>
                <li>
                  <a href="#" className="transition-colors hover:text-white">
                    Jericoacoara
                  </a>
                </li>
                <li>
                  <a href="#" className="transition-colors hover:text-white">
                    Canoa Quebrada
                  </a>
                </li>
                <li>
                  <a href="#" className="transition-colors hover:text-white">
                    Cumbuco
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="mb-4 font-semibold">Suporte</h4>
              <ul className="space-y-2 text-gray-300">
                <li>
                  <a href="#" className="transition-colors hover:text-white">
                    Central de Ajuda
                  </a>
                </li>
                <li>
                  <a href="#" className="transition-colors hover:text-white">
                    Privacidade
                  </a>
                </li>
                <li>
                  <a href="#" className="transition-colors hover:text-white">
                    Termos de Uso
                  </a>
                </li>
                <li>
                  <Link
                    href="/admin/login"
                    className="transition-colors hover:text-white"
                  >
                    Administrativo
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          <div className="mt-12 border-t border-gray-800 pt-8 text-center text-gray-400">
            <p>
              &copy; 2025 Ceará por Temporada. Todos os direitos reservados.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
