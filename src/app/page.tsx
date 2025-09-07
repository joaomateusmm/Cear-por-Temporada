import { CalendarSearch, Instagram, MapPinHouse } from "lucide-react";
import Link from "next/link";

import { AdvancedSearch } from "@/components/AdvancedSearch";
import AutoCarousel from "@/components/AutoCarousel";
import { PropertyCarousel } from "@/components/PropertyCarousel";
import ScrollingHeader from "@/components/ScrollingHeader";
import { TikTokIcon, WhatsAppIcon } from "@/components/SocialIcons";
import { Card, CardContent } from "@/components/ui/card";
import {
  getPropertiesByClass,
  getPropertiesByType,
  PropertyWithDetails,
} from "@/lib/get-properties";

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

        <PropertyCarousel properties={properties} />
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

        {/* Card de pesquisa sobreposto para mobile */}
        <div className="absolute inset-x-0 top-1/2 z-30 block -translate-y-1/2 transform px-4 md:hidden">
          <div className="mx-auto max-w-md">
            {/* Tabs triggers centralizados acima do card - Mobile */}
            <div className="mb-0 flex justify-center">
              <div className="flex">
                <button className="rounded-t-lg bg-gray-50/70 px-4 py-3 text-[#101828] backdrop-blur-sm">
                  <CalendarSearch />
                </button>
                <button className="rounded-t-lg border-transparent bg-gray-300/70 px-4 py-3 text-[#101828]/70 duration-300 hover:bg-gray-200/70">
                  <MapPinHouse />
                </button>
              </div>
            </div>

            <Card className="rounded-lg border-0 bg-gray-50/70 shadow-md backdrop-blur-sm">
              <CardContent className="p-6">
                <div className="mb-4 text-center">
                  <h2 className="text-xl2 -mt-5 mb-6 font-bold text-gray-800">
                    Encontre o lugar perfeito pra sua estadia.
                  </h2>
                </div>
                <AdvancedSearch />
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Área de Pesquisa Avançada - Desktop */}
      <section className="relative z-20 -mt-22 mb-4 hidden md:block">
        <div className="mx-auto max-w-[70%] px-4 sm:px-6 lg:px-8">
          {/* Tabs triggers centralizados acima do card - Desktop */}
          <div className="mb-0 flex justify-center">
            <div className="flex">
              <button className="rounded-t-lg bg-gray-50 px-4 py-3 text-[#101828] shadow-sm">
                <CalendarSearch />
              </button>
              <button className="rounded-t-lg border-transparent bg-gray-200 px-4 py-3 text-[#101828]/70 hover:bg-gray-200">
                <MapPinHouse />
              </button>
            </div>
          </div>

          <Card className="rounded-lg border-0 bg-gray-50 shadow-lg backdrop-blur-sm">
            <CardContent className="px-8">
              <div className="mb-4 text-center">
                <h2 className="mb-2 text-[18px] font-bold text-gray-800">
                  Encontre o imóvel perfeito para sua estadia
                </h2>
              </div>
              <AdvancedSearch />
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
