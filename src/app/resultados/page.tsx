"use client";

import { CalendarSearch, Instagram, MapPinHouse } from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { useEffect, useState } from "react";

import { AdvancedSearch } from "@/components/AdvancedSearch";
import AutoCarousel from "@/components/AutoCarousel";
import PropertyCatalog from "@/components/PropertyCatalog";
import ScrollingHeader from "@/components/ScrollingHeader";
import { TikTokIcon, WhatsAppIcon } from "@/components/SocialIcons";
import { Card, CardContent } from "@/components/ui/card";
import { PropertyWithDetails, searchProperties } from "@/lib/get-properties";

function ResultadosContent() {
  const searchParams = useSearchParams();
  const [properties, setProperties] = useState<PropertyWithDetails[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchInfo, setSearchInfo] = useState<{
    checkIn: string;
    checkOut: string;
    guests: string;
  } | null>(null);

  // Função para realizar a busca inicial baseada nos parâmetros da URL
  useEffect(() => {
    async function performInitialSearch() {
      const checkIn = searchParams.get("checkIn");
      const checkOut = searchParams.get("checkOut");
      const guests = searchParams.get("guests");

      if (checkIn && checkOut && guests) {
        setSearchInfo({
          checkIn: new Date(checkIn).toLocaleDateString("pt-BR"),
          checkOut: new Date(checkOut).toLocaleDateString("pt-BR"),
          guests,
        });

        try {
          const results = await searchProperties({
            checkIn: new Date(checkIn),
            checkOut: new Date(checkOut),
            maxGuests: Number(guests),
          });
          setProperties(results);
        } catch (error) {
          console.error("Erro ao buscar imóveis:", error);
          setProperties([]);
        }
      } else {
        setProperties([]);
      }
      setIsLoading(false);
    }

    performInitialSearch();
  }, [searchParams]);

  // Função para atualizar os resultados quando uma nova pesquisa é feita
  const handleNewSearchResults = (results: PropertyWithDetails[]) => {
    setProperties(results);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header padrão */}
      <ScrollingHeader />

      {/* Banner com carrossel igual à página principal */}
      <div className="relative h-[80vh]">
        <AutoCarousel />

        {/* Overlay com pesquisa avançada */}
        <div className="absolute inset-0 z-20 bg-black/40">
          <div className="relative flex h-full items-center justify-center">
            <div className="mx-auto max-w-[70%] px-4 sm:px-6 lg:px-8">
              {/* Tabs triggers centralizados acima do card - Desktop */}
              <div className="mb-0 flex justify-center">
                <div className="flex">
                  <button className="rounded-t-lg bg-gray-50/70 px-4 py-3 text-[#101828] shadow-sm">
                    <CalendarSearch />
                  </button>
                  <button className="rounded-t-lg border-transparent bg-gray-300/70 px-4 py-3 text-[#101828]/70 duration-300 hover:bg-gray-200/70">
                    <MapPinHouse />
                  </button>
                </div>
              </div>

              <Card className="rounded-lg border-0 bg-gray-50/70 shadow-md backdrop-blur-sm">
                <CardContent className="px-8">
                  <div className="mb-4 text-center">
                    <h2 className="mb-2 text-[18px] font-bold text-gray-800">
                      Encontre o imóvel perfeito para sua estadia.
                    </h2>
                  </div>
                  <AdvancedSearch
                    onSearchResults={handleNewSearchResults}
                    redirectOnSearch={false}
                  />
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>

      {/* Seção de resultados */}
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        {isLoading ? (
          <div className="text-center">
            <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-blue-600 border-r-transparent"></div>
            <p className="mt-4 text-gray-600">Carregando resultados...</p>
          </div>
        ) : (
          <>
            {/* Título dos resultados */}
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900">
                Resultado da Pesquisa: {properties.length} imóveis
              </h2>
              {searchInfo && (
                <p className="mt-2 text-gray-600">
                  {searchInfo.guests} hóspede
                  {Number(searchInfo.guests) > 1 ? "s" : ""} •{" "}
                  {searchInfo.checkIn} até {searchInfo.checkOut}
                </p>
              )}
            </div>

            {/* Catálogo de propriedades */}
            {properties.length > 0 ? (
              <PropertyCatalog properties={properties} />
            ) : (
              <div className="py-12 text-center">
                <div className="mx-auto max-w-md">
                  <svg
                    className="mx-auto h-12 w-12 text-gray-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                    />
                  </svg>
                  <h3 className="mt-4 text-lg font-medium text-gray-900">
                    Nenhum imóvel encontrado
                  </h3>
                  <p className="mt-2 text-gray-500">
                    Tente ajustar os filtros de busca ou as datas selecionadas.
                  </p>
                </div>
              </div>
            )}
          </>
        )}
      </div>
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

export default function ResultadosPage() {
  return (
    <Suspense fallback={<div>Carregando...</div>}>
      <ResultadosContent />
    </Suspense>
  );
}
