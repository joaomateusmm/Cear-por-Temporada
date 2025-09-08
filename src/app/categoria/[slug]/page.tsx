"use client";

import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";

import Footer from "@/components/Footer";
import PropertyCatalog from "@/components/PropertyCatalog";
import ScrollingHeader from "@/components/ScrollingHeader";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { getAllProperties, PropertyWithDetails } from "@/lib/get-properties";

// Mapeamento de categorias
const categoryConfig = {
  casas: {
    title: "Todas as Casas",
    description:
      "Descubra todas as casas disponíveis para aluguel por temporada no Ceará",
    filter: "casa",
  },
  apartamentos: {
    title: "Todos os Apartamentos",
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

function CategoryContent() {
  const params = useParams();
  const slug = params.slug as string;
  const [properties, setProperties] = useState<PropertyWithDetails[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const config = categoryConfig[slug as keyof typeof categoryConfig];

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

        // Filtrar por destaque se especificado
        if (config && "featured" in config && config.featured) {
          // Aqui você pode implementar a lógica de destaque
          // Por exemplo, propriedades com melhor avaliação, mais recentes, etc.
          filteredProperties = filteredProperties.slice(0, 20); // Exemplo: primeiros 20
        }

        setProperties(filteredProperties);
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
  }, [slug, config]);

  if (!config) {
    return (
      <div className="min-h-screen bg-gray-50">
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
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="mt-10 mb-8 flex items-center justify-start gap-4">
            <Link href="/">
              <Button className="cursor-pointer bg-gray-800 px-4 py-5 text-gray-100 shadow-md duration-200 hover:scale-[1.02] hover:bg-gray-800 hover:text-white hover:active:scale-95">
                <ArrowLeft className="h-4 w-4" />
                Voltar
              </Button>
            </Link>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">
                {isLoading
                  ? "Carregando..."
                  : `${properties.length} imóveis disponíveis`}
              </h2>
              <p className="text-gray-600">
                Aqui está todos os imóveis nessa categoria.
              </p>
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
              <Link
                href="/"
                className="mt-4 inline-block rounded-md bg-blue-600 px-6 py-3 text-white hover:bg-blue-700"
              >
                Ver todos os imóveis
              </Link>
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
