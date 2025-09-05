import {
  BedDouble,
  Bookmark,
  Instagram,
  MapPin,
  Search,
  Share2,
  Toilet,
  Users,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";

import AutoCarousel from "@/components/AutoCarousel";
import ScrollingHeader from "@/components/ScrollingHeader";
import { TikTokIcon, WhatsAppIcon } from "@/components/SocialIcons";
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
                            <span className="text-sm text-gray-600">
                              {location}
                            </span>
                          </div>

                          <p className="mb-4 line-clamp-2 text-sm text-gray-600">
                            {property.shortDescription}
                          </p>

                          <div className="mb-4 flex items-center gap-5 text-sm text-gray-600">
                            <div className="flex items-center gap-1">
                              <span className="flex items-center gap-1">
                                {property.maxGuests}{" "}
                                <Users className="h-4 w-4" />
                              </span>
                            </div>
                            <div className="flex items-center gap-1">
                              <span className="flex items-center gap-1">
                                {property.bedrooms}{" "}
                                <BedDouble className="h-4 w-4" />
                              </span>
                            </div>
                            <div className="flex items-center gap-1">
                              <span className="flex items-center gap-1">
                                {property.bathrooms}{" "}
                                <Toilet className="h-4 w-4" />
                              </span>
                            </div>
                          </div>

                          {/* <div className="mb-4 flex items-center justify-between gap-2">
                            <div className="flex items-center gap-2">
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
                            <div className="flex items-center gap-1">
                              <span className="text-sm text-gray-600">
                                (Nota)
                              </span>
                              <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                              <span className="font-medium">4.8</span>
                              <span className="text-sm text-gray-500"></span>
                            </div>
                          </div> ADICIONAR AVALIAÇOES NO FUTURO */}

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

  // Buscar imóveis em destaque por tipo específico
  const featuredHouses = await getPropertiesByClass("Destaque em Casas");
  const featuredApartments = await getPropertiesByClass(
    "Destaque em Apartamentos",
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header fixo que aparece/desaparece no scroll */}
      <ScrollingHeader />

      {/* Banner Principal com Carrossel */}
      <section className="relative min-h-[60vh] overflow-hidden pt-16 text-white">
        <AutoCarousel />
      </section>

      {/* Área de Pesquisa */}
      <section className="relative z-20 -mt-22 mb-4">
        <div className="mx-auto max-w-[70%] px-4 sm:px-6 lg:px-8">
          <Card className="rounded-full border-0 bg-white/95 shadow-lg backdrop-blur-sm">
            <CardContent className="p-8">
              <div className="grid grid-cols-1 gap-4 md:grid-cols-5">
                <div className="md:col-span-2">
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    Onde vc quer morar?
                  </label>
                  <Input
                    type="text"
                    placeholder="Procure por cidades, bairros..."
                    className="h-12 w-full"
                  />
                </div>
                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    Por quanto tempo?
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
                    className="hover:bg-brightness-105 h-12 w-full bg-[#101828]"
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
      <section id="imoveis-destaque">
        <PropertySection
          title="Imóveis em Destaque"
          description="Selecionamos as melhores opções para tornar sua viagem inesquecível."
          properties={featuredProperties}
        />
      </section>

      <section id="apartamentos">
        <PropertySection
          title="Apartamentos"
          description=" Todos os nossos apartamentos modernos e confortáveis em localização privilegiada"
          properties={apartments}
        />
      </section>

      <section id="casas">
        <PropertySection
          title="Casas"
          description="Todas as nossas casas espaçosas para você e sua família desfrutarem com total privacidade"
          properties={houses}
        />
      </section>

      {/* Seção de Destinos */}
      <section id="destinos" className="bg-[#101828] py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-12 text-center">
            <h2 className="mb-4 text-3xl font-bold text-gray-50 md:text-4xl">
              Destinos Populares
            </h2>
            <p className="mx-auto max-w-2xl text-lg text-gray-400">
              Explore os destinos mais procurados pelos nossos hóspedes no Ceará
            </p>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            {/* Linha 1 */}
            <Link
              href="#fortaleza"
              className="group relative h-64 overflow-hidden rounded-lg shadow-md transition-transform duration-500 hover:scale-[1.02]"
            >
              <div
                className="absolute inset-0 bg-cover bg-center"
                style={{
                  backgroundImage:
                    "url('https://i.pinimg.com/1200x/ea/a9/41/eaa9412926e807479d07745b6de1bb7b.jpg')",
                }}
              />
              <div className="absolute inset-0 bg-black/40 transition-colors duration-300 group-hover:bg-black/30" />
              <div className="relative flex h-full items-center justify-center">
                <h3 className="text-2xl font-bold text-white">Fortaleza</h3>
              </div>
            </Link>

            <Link
              href="#jericoacoara"
              className="group relative h-64 overflow-hidden rounded-lg shadow-md transition-transform duration-500 hover:scale-[1.02]"
            >
              <div
                className="absolute inset-0 bg-cover bg-center"
                style={{
                  backgroundImage:
                    "url('https://media-cdn.tripadvisor.com/media/attractions-splice-spp-720x480/07/ba/0b/99.jpg')",
                }}
              />
              <div className="absolute inset-0 bg-black/40 transition-colors duration-300 group-hover:bg-black/30" />
              <div className="relative flex h-full items-center justify-center">
                <h3 className="text-2xl font-bold text-white">Jericoacoara</h3>
              </div>
            </Link>

            <Link
              href="#canoa-quebrada"
              className="group relative h-64 overflow-hidden rounded-lg shadow-md transition-transform duration-500 hover:scale-[1.02]"
            >
              <div
                className="absolute inset-0 bg-cover bg-center"
                style={{
                  backgroundImage:
                    "url('https://dynamic-media-cdn.tripadvisor.com/media/photo-o/09/ab/43/3d/praia-de-canoa-quebrada.jpg?w=1200&h=-1&s=1')",
                }}
              />
              <div className="absolute inset-0 bg-black/40 transition-colors duration-300 group-hover:bg-black/30" />
              <div className="relative flex h-full items-center justify-center">
                <h3 className="text-2xl font-bold text-white">
                  Canoa Quebrada
                </h3>
              </div>
            </Link>

            {/* Linha 2 */}
            <Link
              href="#cumbuco"
              className="group relative h-64 overflow-hidden rounded-lg shadow-md transition-transform duration-500 hover:scale-[1.02]"
            >
              <div
                className="absolute inset-0 bg-cover bg-center"
                style={{
                  backgroundImage:
                    "url('https://turismodenatureza.com.br/wp-content/webp-express/webp-images/uploads/2024/07/O_que_Fazer_na_Praia_do_Cumbuco-1199x630.jpg.webp')",
                }}
              />
              <div className="absolute inset-0 bg-black/40 transition-colors duration-300 group-hover:bg-black/30" />
              <div className="relative flex h-full items-center justify-center">
                <h3 className="text-2xl font-bold text-white">Cumbuco</h3>
              </div>
            </Link>

            <Link
              href="#beach-park"
              className="group relative h-64 overflow-hidden rounded-lg shadow-md transition-transform duration-500 hover:scale-[1.02]"
            >
              <div
                className="absolute inset-0 bg-cover bg-center"
                style={{
                  backgroundImage:
                    "url('https://beachpark.com.br/app/uploads/2025/05/Ajuste-Banner-Site-Institucional-1920-x-770.webp')",
                }}
              />
              <div className="absolute inset-0 bg-black/40 transition-colors duration-300 group-hover:bg-black/30" />
              <div className="relative flex h-full items-center justify-center">
                <h3 className="text-2xl font-bold text-white">Beach Park</h3>
              </div>
            </Link>

            <Link
              href="#outros"
              className="group relative h-64 overflow-hidden rounded-lg shadow-md transition-transform duration-500 hover:scale-[1.02]"
            >
              <div
                className="absolute inset-0 bg-cover bg-center"
                style={{
                  backgroundImage:
                    "url('https://blog.blablacar.com.br/wp-content/uploads/2024/02/praia-de-iracema-fortaleza.webp')",
                }}
              />
              <div className="absolute inset-0 bg-black/40 transition-colors duration-300 group-hover:bg-black/30" />
              <div className="relative flex h-full items-center justify-center">
                <h3 className="text-2xl font-bold text-white">Outros</h3>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* Novas Seções de Destaques por Tipo */}
      <section id="casas-destaque">
        <PropertySection
          title="Destaque em: Casas"
          description="Nossos imóveis mais procurados pelos clientes em sua categoria"
          properties={featuredHouses}
        />
      </section>

      <section id="apartamentos-destaque">
        <PropertySection
          title="Destaque em: Apartamentos"
          description="Nossos imóveis mais procurados pelos clientes em sua categoria"
          properties={featuredApartments}
        />
      </section>

      {/* Footer */}
      <footer id="footer" className="bg-gray-900 py-16 text-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
            <div className="md:col-span-2 lg:col-span-1">
              <div className="mb-4 text-2xl font-bold">Logo</div>
              <p className="mb-4 max-w-md text-gray-300">
                A plataforma líder em aluguel de imóveis por temporada no Ceará.
                Conectamos viajantes aos melhores destinos do estado.
              </p>
              <div className="flex gap-4">
                <a
                  href="https://www.tiktok.com/@cearaportemporada?ug_source=op.auth&ug_term=Linktr.ee&utm_source=awyc6vc625ejxp86&utm_campaign=tt4d_profile_link&_r=1"
                  className="text-gray-400 transition-colors hover:text-white"
                >
                  <TikTokIcon className="h-6 w-6" />
                </a>
                <a
                  href="https://www.instagram.com/cearaportemporada/"
                  className="text-gray-400 transition-colors hover:text-white"
                >
                  <Instagram className="h-6 w-6" />
                </a>
                <a
                  href="https://api.whatsapp.com/send/?phone=5585992718222&text&type=phone_number&app_absent=0"
                  className="text-gray-400 transition-colors hover:text-white"
                >
                  <WhatsAppIcon className="h-6 w-6" />
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
              </ul>
            </div>
            <div>
              <h4 className="mb-4 font-semibold">Proprietário</h4>
              <ul className="space-y-2 text-gray-300">
                <li>
                  <a href="#" className="transition-colors hover:text-white">
                    Adicione seu Imóvel
                  </a>
                </li>
                <li>
                  <a href="#" className="transition-colors hover:text-white">
                    Como funciona?
                  </a>
                </li>
                <li>
                  <a href="#" className="transition-colors hover:text-white">
                    Tira dúvidas
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
