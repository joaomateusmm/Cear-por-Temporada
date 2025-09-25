"use client";

import { ArrowLeft, SlidersHorizontal } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { Suspense, useCallback, useEffect, useState } from "react";

import Footer from "@/components/Footer";
import PropertyCatalog from "@/components/PropertyCatalog";
import ScrollingHeader from "@/components/ScrollingHeader";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { getAllProperties, PropertyWithDetails } from "@/lib/get-properties";

// Mapeamento de categorias
const categoryConfig = {
  casas: {
    title: "Casas",
    description:
      "Descubra todas as casas disponíveis para aluguel por temporada no Ceará",
    filter: "casa",
  },
  apartamentos: {
    title: "Apartamentos",
    description:
      "Encontre todos os apartamentos disponíveis para aluguel por temporada no Ceará",
    filter: "apartamento",
  },
  "casas-destaque": {
    title: "Casas em Destaque",
    description: "As melhores casas selecionadas especialmente para você",
    filter: "casa",
    featured: true,
  },
  "apartamentos-destaque": {
    title: "Apartamentos em Destaque",
    description:
      "Os melhores apartamentos selecionados especialmente para você",
    filter: "apartamento",
    featured: true,
  },
  "imoveis-destaque": {
    title: "Imóveis em Destaque",
    description: "Os melhores imóveis selecionados especialmente para você",
    filter: "all",
    featured: true,
  },
};

// Lista de destinos populares para filtro
const popularDestinations = [
  "Fortaleza",
  "Jericoacoara",
  "Canoa Quebrada",
  "Praia de Picos",
  "Morro Branco",
  "Águas Belas",
  "Cumbuco",
  "Beach Park",
];

function CategoryContent() {
  const params = useParams();
  const slug = params.slug as string;
  const [properties, setProperties] = useState<PropertyWithDetails[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedDestinations, setSelectedDestinations] = useState<string[]>(
    [],
  );
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc"); // A-Z por padrão

  const config = categoryConfig[slug as keyof typeof categoryConfig];

  // Função para alternar filtro de destino
  const toggleDestination = (destination: string) => {
    setSelectedDestinations((prev) =>
      prev.includes(destination)
        ? prev.filter((d) => d !== destination)
        : [...prev, destination],
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
    async function loadProperties() {
      setIsLoading(true);
      try {
        const results = await getAllProperties();

        let filteredProperties = results;

        // Filtrar por tipo se especificado
        if (config?.filter && config.filter !== "all") {
          filteredProperties = results.filter((property: PropertyWithDetails) =>
            property.propertyStyle?.toLowerCase().includes(config.filter),
          );
        }

        // Filtrar por destinos selecionados
        if (selectedDestinations.length > 0) {
          filteredProperties = filteredProperties.filter(
            (property: PropertyWithDetails) =>
              selectedDestinations.some((destination) =>
                property.location?.popularDestination
                  ?.toLowerCase()
                  .includes(destination.toLowerCase()),
              ),
          );
        }

        // Filtrar por destaque se especificado
        if (config && "featured" in config && config.featured) {
          // Aqui você pode implementar a lógica de destaque
          // Por exemplo, propriedades com melhor avaliação, mais recentes, etc.
          filteredProperties = filteredProperties.slice(0, 20); // Exemplo: primeiros 20
        }

        // Aplicar ordenação alfabética
        const sortedProperties = sortProperties(filteredProperties);

        setProperties(sortedProperties);
      } catch (error) {
        console.error("Erro ao carregar propriedades:", error);
        setProperties([]);
      } finally {
        setIsLoading(false);
      }
    }

    if (config) {
      loadProperties();
    }
  }, [slug, config, selectedDestinations, sortOrder, sortProperties]);

  if (!config) {
    return (
      <div className="mt-15 min-h-screen bg-gray-50">
        <ScrollingHeader />
        <div className="container mx-auto px-4 py-8">
          <h1 className="text-2xl font-bold text-gray-900">
            Categoria não encontrada
          </h1>
          <p className="mt-2 text-gray-600">
            A categoria solicitada não existe.
          </p>
          <Link
            href="/"
            className="mt-4 inline-block text-blue-600 hover:underline"
          >
            Voltar para o início
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <ScrollingHeader />

      {/* Results Section */}
      <section className="px-4 py-12 md:px-52">
        <div className="container mx-auto">
          <div className="mb-8 flex flex-col gap-4 text-start md:flex-row md:items-center md:justify-between">
            <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-start">
              <Link href="/">
                <Button className="cursor-pointer bg-gray-800 px-4 py-5 text-gray-100 shadow-md duration-200 hover:scale-[1.02] hover:bg-gray-800 hover:text-white hover:active:scale-95">
                  <ArrowLeft className="h-4 w-4" />
                  Voltar
                </Button>
              </Link>
              <div className="flex flex-col">
                <h2 className="text-xl font-bold text-gray-900 md:text-2xl">
                  {isLoading
                    ? "Carregando..."
                    : `${properties.length} imóveis disponíveis`}
                </h2>
                <p className="text-sm text-gray-600 md:text-base">
                  Aqui estão todos os imóveis na categoria &ldquo;{config.title}
                  &rdquo;.
                </p>
              </div>
            </div>
            <div className="flex gap-2 md:gap-4">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button className="cursor-pointer bg-gray-800 px-3 py-4 text-sm text-gray-100 shadow-md duration-200 hover:scale-[1.02] hover:bg-gray-800 hover:text-white hover:active:scale-95 md:px-4 md:py-5 md:text-base">
                    <SlidersHorizontal className="h-4 w-4" />
                    <span className="hidden sm:inline">Filtros</span>
                    {selectedDestinations.length > 0 && (
                      <span className="ml-1">
                        ({selectedDestinations.length})
                      </span>
                    )}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="ml-2 w-56">
                  <DropdownMenuLabel>Filtrar por Destino</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <div className="space-y-2 p-2">
                    {popularDestinations.map((destination) => (
                      <div
                        key={destination}
                        className="flex items-center space-x-2"
                      >
                        <Checkbox
                          id={destination}
                          checked={selectedDestinations.includes(destination)}
                          onCheckedChange={() => toggleDestination(destination)}
                        />
                        <label
                          htmlFor={destination}
                          className="text-sm leading-none font-medium peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                          {destination}
                        </label>
                      </div>
                    ))}
                  </div>
                  {selectedDestinations.length > 0 && (
                    <>
                      <DropdownMenuSeparator />
                      <div className="p-2">
                        <Button
                          variant="outline"
                          size="sm"
                          className="w-full"
                          onClick={() => setSelectedDestinations([])}
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

          {isLoading ? (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {Array.from({ length: 6 }).map((_, index) => (
                <Card key={index} className="overflow-hidden">
                  <div className="h-64 animate-pulse bg-gray-200" />
                  <CardContent className="p-6">
                    <div className="mb-2 h-4 animate-pulse rounded bg-gray-200" />
                    <div className="mb-4 h-4 animate-pulse rounded bg-gray-200" />
                    <div className="h-8 animate-pulse rounded bg-gray-200" />
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : properties.length > 0 ? (
            <PropertyCatalog properties={properties} />
          ) : (
            <div className="py-12 text-center">
              <h3 className="text-xl font-semibold text-gray-900">
                Nenhum imóvel encontrado
              </h3>
              <p className="mt-2 text-gray-600">
                Não há imóveis disponíveis nesta categoria no momento.
              </p>
            </div>
          )}
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  );
}

export default function CategoryPage() {
  return (
    <Suspense fallback={<div>Carregando...</div>}>
      <CategoryContent />
    </Suspense>
  );
}
