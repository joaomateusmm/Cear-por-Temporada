"use client";

import {
  ArrowLeft,
  Building2,
  MapPin,
  Palmtree,
  Plane,
  SlidersHorizontal,
  TreePine,
  Umbrella,
  WavesLadder,
} from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";

import Footer from "@/components/Footer";
import Header from "@/components/Header";
import HeaderMobile from "@/components/HeaderMobile";
import PropertyCatalog from "@/components/PropertyCatalog";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  getPropertiesByDestination,
  PropertyWithDetails,
} from "@/lib/get-properties";

// Mapeamento de destinos para ícones e descrições
const destinationInfo = {
  Fortaleza: {
    icon: Building2,
    description: "A capital cearense, centro urbano e cultural do estado",
    fullName: "Fortaleza",
  },
  Jericoacoara: {
    icon: Palmtree,
    description: "Paraíso tropical com dunas, lagoas e pôr do sol inesquecível",
    fullName: "Jericoacoara",
  },
  "Canoa Quebrada": {
    icon: WavesLadder,
    description: "Famosa praia com falésias coloridas e excelentes ondas",
    fullName: "Canoa Quebrada",
  },
  "Praia de Picos": {
    icon: Umbrella,
    description: "Destino tranquilo com belas praias e atmosfera relaxante",
    fullName: "Praia de Picos",
  },
  "Morro Branco": {
    icon: TreePine,
    description: "Conhecido pelas falésias e artesanato em garrafas de areia",
    fullName: "Morro Branco",
  },
  "Águas Belas": {
    icon: WavesLadder,
    description: "Águas cristalinas e paisagens naturais preservadas",
    fullName: "Águas Belas",
  },
  Cumbuco: {
    icon: Palmtree,
    description:
      "Praia paradisíaca próxima a Fortaleza, ideal para esportes aquáticos",
    fullName: "Cumbuco",
  },
  "Beach Park": {
    icon: Plane,
    description:
      "Complexo turístico com parque aquático e infraestrutura completa",
    fullName: "Beach Park",
  },
};

// Lista de categorias de imóveis para filtro
const propertyCategories = [
  "Casas",
  "Casas de Praia",
  "Apartamentos",
  "Flats",
  "Pousadas",
  "Imóveis em Destaque",
];

export default function DestinationPage() {
  const params = useParams();
  const destination = decodeURIComponent(params.destination as string);

  const [properties, setProperties] = useState<PropertyWithDetails[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc"); // A-Z por padrão
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);

  // Informações do destino atual
  const destinationData =
    destinationInfo[destination as keyof typeof destinationInfo];
  const DestinationIcon = destinationData?.icon || MapPin;

  // Função para alternar filtro de categoria
  const toggleCategory = (category: string) => {
    setSelectedCategories((prev) =>
      prev.includes(category)
        ? prev.filter((c) => c !== category)
        : [...prev, category],
    );
  };

  // Função para alternar ordem alfabética
  const toggleSortOrder = () => {
    setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"));
  };

  // Função para ordenar propriedades alfabeticamente
  const sortProperties = useCallback(
    (properties: PropertyWithDetails[]) => {
      return [...properties].sort((a, b) => {
        const titleA = a.title.toLowerCase();
        const titleB = b.title.toLowerCase();

        if (sortOrder === "asc") {
          return titleA.localeCompare(titleB);
        } else {
          return titleB.localeCompare(titleA);
        }
      });
    },
    [sortOrder],
  );

  useEffect(() => {
    async function loadPropertiesByDestination() {
      try {
        setIsLoading(true);
        const data = await getPropertiesByDestination(destination);

        let filteredProperties = data || [];

        // Filtrar por categorias selecionadas
        if (selectedCategories.length > 0) {
          filteredProperties = filteredProperties.filter(
            (property: PropertyWithDetails) =>
              selectedCategories.some((category) => {
                const propertyType =
                  property.propertyStyle?.toLowerCase() || "";

                if (category === "Casas") return propertyType.includes("casa");
                if (category === "Casas de Praia")
                  return propertyType.includes("casa");
                if (category === "Apartamentos")
                  return propertyType.includes("apartamento");
                if (category === "Flats") return propertyType.includes("flat");
                if (category === "Pousadas")
                  return propertyType.includes("pousada");
                if (category === "Imóveis em Destaque") return true; // Para "destaque" mostra todos

                return propertyType.includes(category.toLowerCase());
              }),
          );
        }

        // Aplicar ordenação alfabética
        const sortedProperties = sortProperties(filteredProperties);
        setProperties(sortedProperties);
      } catch (error) {
        console.error("Erro ao carregar imóveis do destino:", error);
        toast.error("Erro ao carregar imóveis do destino");
      } finally {
        setIsLoading(false);
      }
    }

    if (destination) {
      loadPropertiesByDestination();
    }
  }, [destination, selectedCategories, sortOrder, sortProperties]);

  // Se não encontrou informações do destino, mostrar erro
  if (!destinationData) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <HeaderMobile />

        <div className="container mx-auto mt-15 px-4 py-8">
          <div className="text-center">
            <h1 className="mb-4 text-4xl font-bold text-gray-900">
              Destino não encontrado
            </h1>
            <p className="text-xl text-gray-600">
              O destino &ldquo;{destination}&rdquo; não foi encontrado.
            </p>
          </div>
        </div>

        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <HeaderMobile />

      {/* Conteúdo Principal */}
      <div className="container mx-auto mt-15 px-4 py-8 md:px-52">
        {/* Cabeçalho do Destino */}
        <div className="mb-8 flex flex-col gap-4 text-start md:flex-row md:items-center md:justify-between">
          <div>
            <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-start">
              <Link href="/">
                <Button
                  variant="outline"
                  size="sm"
                  className="cursor-pointer bg-gray-800 px-4 py-5 text-gray-100 shadow-md duration-200 hover:scale-[1.02] hover:bg-gray-800 hover:text-white hover:active:scale-95"
                >
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Voltar
                </Button>
              </Link>
              <div className="flex flex-col">
                <h2 className="text-xl font-bold text-gray-900 md:text-2xl">
                  {destinationData.fullName}
                </h2>
                <p className="w-52 text-sm text-gray-600 md:w-full md:text-base">
                  {destinationData.description}
                </p>
              </div>
            </div>

            {!isLoading && (
              <p className="text-sm text-gray-500">
                {properties.length}{" "}
                {properties.length === 1
                  ? "imóvel encontrado"
                  : "imóveis encontrados"}{" "}
                próximo a {destinationData.fullName}
              </p>
            )}
          </div>
          <div className="flex gap-2 md:gap-4">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button className="cursor-pointer bg-gray-800 px-3 py-4 text-sm text-gray-100 shadow-md duration-200 hover:scale-[1.02] hover:bg-gray-800 hover:text-white hover:active:scale-95 md:px-4 md:py-5 md:text-base">
                  <SlidersHorizontal className="h-4 w-4" />
                  <span className="hidden sm:inline">Filtros</span>
                  {selectedCategories.length > 0 && (
                    <span className="ml-1">({selectedCategories.length})</span>
                  )}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56 ml-2">
                <DropdownMenuLabel>Filtrar por Categoria</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <div className="space-y-2 p-2">
                  {propertyCategories.map((category) => (
                    <div key={category} className="flex items-center space-x-2">
                      <Checkbox
                        id={category}
                        checked={selectedCategories.includes(category)}
                        onCheckedChange={() => toggleCategory(category)}
                      />
                      <label
                        htmlFor={category}
                        className="text-sm leading-none font-medium peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        {category}
                      </label>
                    </div>
                  ))}
                </div>
                {selectedCategories.length > 0 && (
                  <>
                    <DropdownMenuSeparator />
                    <div className="p-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="w-full"
                        onClick={() => setSelectedCategories([])}
                      >
                        Limpar Filtros
                      </Button>
                    </div>
                  </>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
            <Button
              className="cursor-pointer bg-gray-800 px-3 py-4 text-sm text-gray-100 shadow-md duration-200 hover:scale-[1.02] hover:bg-gray-800 hover:text-white hover:active:scale-95 md:px-4 md:py-5 md:text-base"
              onClick={toggleSortOrder}
            >
              {sortOrder === "asc" ? "A - Z" : "Z - A"}
            </Button>
          </div>
        </div>

        {/* Catálogo de Imóveis */}
        {isLoading ? (
          <div className="py-12 text-center">
            <div className="mx-auto h-8 w-8 animate-spin rounded-full border-b-2 border-blue-400"></div>
            <p className="mt-2 text-gray-600">
              Carregando imóveis próximos a {destinationData.fullName}...
            </p>
          </div>
        ) : properties.length > 0 ? (
          <PropertyCatalog properties={properties} />
        ) : (
          <div className="py-12 text-center">
            <div className="mb-4">
              <DestinationIcon className="mx-auto h-16 w-16 text-gray-400" />
            </div>
            <h3 className="mb-2 text-xl font-semibold text-gray-900">
              Nenhum imóvel encontrado
            </h3>
            <p className="text-gray-600">
              Ainda não temos imóveis disponíveis próximos a{" "}
              {destinationData.fullName}.
              <br />
              Que tal explorar outros destinos ou voltar mais tarde?
            </p>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
}
