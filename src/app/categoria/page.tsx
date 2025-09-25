"use client";

import { ArrowLeft, SlidersHorizontal } from "lucide-react";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";

import Footer from "@/components/Footer";
import PropertyCatalog from "@/components/PropertyCatalog";
import ScrollingHeader from "@/components/ScrollingHeader";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { getAllProperties, PropertyWithDetails } from "@/lib/get-properties";

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

export default function AllCategoriesPage() {
  const [properties, setProperties] = useState<PropertyWithDetails[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedDestinations, setSelectedDestinations] = useState<string[]>(
    [],
  );
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc"); // A-Z por padrão

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
    async function loadAllProperties() {
      try {
        setIsLoading(true);
        const results = await getAllProperties();

        let filteredProperties = results;

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

        // Aplicar ordenação alfabética
        const sortedProperties = sortProperties(filteredProperties);

        setProperties(sortedProperties);
      } catch (error) {
        console.error("Erro ao carregar imóveis:", error);
        toast.error("Erro ao carregar imóveis");
      } finally {
        setIsLoading(false);
      }
    }

    loadAllProperties();
  }, [selectedDestinations, sortOrder, sortProperties]);

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
                  Explore nossa coleção completa de imóveis disponíveis para
                  temporada no Ceará
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
                <DropdownMenuContent className="w-56 ml-2">
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

          {/* Catálogo de Imóveis */}
          {isLoading ? (
            <div className="py-12 text-center">
              <div className="mx-auto h-8 w-8 animate-spin rounded-full border-b-2 border-gray-400"></div>
              <p className="mt-2 text-gray-600">Carregando imóveis...</p>
            </div>
          ) : (
            <PropertyCatalog properties={properties} />
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
}
