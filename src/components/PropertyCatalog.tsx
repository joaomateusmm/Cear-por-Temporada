"use client";

import {
  BedDouble,
  Check,
  Copy,
  MapPin,
  Share2,
  Toilet,
  Users,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { PropertyWithDetails } from "@/lib/get-properties";

interface PropertyCatalogProps {
  properties: PropertyWithDetails[];
}

const fallbackImage =
  "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=400&h=300&fit=crop";

export default function PropertyCatalog({ properties }: PropertyCatalogProps) {
  const [baseUrl, setBaseUrl] = useState("");
  const [copiedPropertyId, setCopiedPropertyId] = useState<string | null>(null);

  useEffect(() => {
    setBaseUrl(window.location.origin);
  }, []);

  if (properties.length === 0) {
    return (
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
    );
  }

  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {properties.map((property) => {
        const mainImage =
          property.images.find((img) => img.isMain) || property.images[0];
        const imageUrl = mainImage?.imageUrl || fallbackImage;
        const location =
          `${property.location.neighborhood || ""}, ${property.location.city || ""}`.replace(
            /^,\s*/,
            "",
          );
        const dailyPrice = parseFloat(property.pricing.dailyRate || "0");

        return (
          <Card
            key={property.id}
            className="overflow-hidden transition-shadow hover:shadow-xl"
          >
            <Link href={`/imovel/${property.id}`} className="block">
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
                      {dailyPrice === 0
                        ? "Valor a combinar"
                        : `R$ ${dailyPrice.toFixed(0)}/noite`}
                    </Badge>
                  </div>
                </div>
              </div>

              <CardContent className="p-6 pb-2">
                <div className="mb-2 flex items-start justify-between">
                  <h3 className="line-clamp-2 text-xl font-semibold text-gray-900">
                    {property.title}
                  </h3>
                </div>

                <div className="mb-3 flex items-center gap-1">
                  <MapPin className="h-4 w-4 text-gray-400" />
                  <span className="text-sm text-gray-600">{location}</span>
                </div>

                <p className="mb-4 line-clamp-2 text-sm text-gray-600">
                  {property.shortDescription}
                </p>

                <div className="mb-4 flex items-center gap-5 text-sm text-gray-600">
                  <div className="flex items-center gap-1">
                    <span className="flex items-center gap-1">
                      {property.maxGuests} <Users className="h-4 w-4" />
                    </span>
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="flex items-center gap-1">
                      {property.bedrooms} <BedDouble className="h-4 w-4" />
                    </span>
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="flex items-center gap-1">
                      {property.bathrooms} <Toilet className="h-4 w-4" />
                    </span>
                  </div>
                </div>
              </CardContent>
            </Link>

            <CardContent className="px-6 pt-0 pb-6">
              <div className="flex items-center justify-between">
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button
                      className="cursor-pointer bg-[#101828] px-4 py-5 text-gray-100 shadow-md duration-200 hover:scale-[1.02] hover:bg-[#101828] hover:text-white hover:active:scale-95"
                      size="sm"
                      variant="outline"
                    >
                      Ver Rapidamente
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent className="mx-auto max-h-[90vh] w-[400px] overflow-y-auto">
                    <AlertDialogHeader>
                      <AlertDialogTitle className="text-lg font-bold text-gray-900">
                        {property.title}
                      </AlertDialogTitle>
                      <AlertDialogDescription className="text-sm text-gray-600">
                        <div className="mb-3 flex items-center gap-1">
                          <MapPin className="h-4 w-4 text-gray-400" />
                          <span>{location}</span>
                        </div>
                      </AlertDialogDescription>
                    </AlertDialogHeader>

                    <div className="space-y-4">
                      {/* Informações básicas */}
                      <div className="grid grid-cols-2 gap-3 text-sm">
                        <div className="space-y-1">
                          <span className="font-medium text-gray-700">
                            Hóspedes:{" "}
                          </span>
                          <span className="text-gray-600">
                            {property.maxGuests}
                          </span>
                        </div>
                        <div className="space-y-1">
                          <span className="font-medium text-gray-700">
                            Quartos:{" "}
                          </span>
                          <span className="text-gray-600">
                            {property.bedrooms}
                          </span>
                        </div>
                        <div className="space-y-1">
                          <span className="font-medium text-gray-700">
                            Banheiros:{" "}
                          </span>
                          <span className="text-gray-600">
                            {property.bathrooms}
                          </span>
                        </div>
                        <div className="space-y-1">
                          <span className="font-medium text-gray-700">
                            Tipo:{" "}
                          </span>
                          <span className="text-gray-600">
                            {property.propertyStyle}
                          </span>
                        </div>
                        <div className="space-y-1">
                          <span className="font-medium text-gray-700">
                            Aceita Pets:{" "}
                          </span>
                          <span
                            className={`${property.allowsPets ? "text-green-600" : "text-red-600"} font-medium`}
                          >
                            {property.allowsPets ? "Sim" : "Não"}
                          </span>
                        </div>
                      </div>

                      {/* Preços */}
                      <div className="border-t pt-3">
                        <h4 className="mb-2 font-medium text-gray-900">
                          Preços
                        </h4>
                        <div className="grid grid-cols-2 gap-3 text-sm">
                          <div className="space-y-1">
                            <span className="font-medium text-gray-700">
                              Diária:{" "}
                            </span>
                            <span className="font-semibold text-green-600">
                              {parseFloat(property.pricing.dailyRate || "0") ===
                              0
                                ? "Valor a combinar"
                                : `R$ ${property.pricing.dailyRate}/dia`}
                            </span>
                          </div>
                          <div className="space-y-1">
                            <span className="font-medium text-gray-700">
                              Mensal:{" "}
                            </span>
                            <span className="font-semibold text-green-600">
                              {parseFloat(
                                property.pricing.monthlyRent || "0",
                              ) === 0
                                ? "Valor a combinar"
                                : `R$ ${property.pricing.monthlyRent}/mês`}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Descrição */}
                      <div className="border-t pt-3">
                        <h4 className="mb-2 font-medium text-gray-900">
                          Sobre o imóvel
                        </h4>
                        <p className="text-sm leading-relaxed text-gray-600">
                          {property.shortDescription}
                        </p>
                      </div>
                    </div>

                    <AlertDialogFooter className="gap-2 pt-4">
                      <AlertDialogCancel className="text-xs">
                        Fechar
                      </AlertDialogCancel>
                      <Link href={`/imovel/${property.id}`}>
                        <AlertDialogAction className="bg-[#101828] text-xs hover:bg-[#101828]/90">
                          Ver Página Completa
                        </AlertDialogAction>
                      </Link>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
                <div className="space-x-2">
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button
                        className="cursor-pointer bg-[#101828] px-6 py-5 text-gray-100 shadow-md duration-200 hover:scale-[1.02] hover:bg-[#101828] hover:text-white hover:active:scale-95"
                        size="sm"
                        variant="outline"
                      >
                        <Share2 />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent className="mx-4 w-80 max-w-xs">
                      <AlertDialogHeader>
                        <AlertDialogTitle className="text-lg font-bold text-gray-900">
                          Compartilhar este imóvel
                        </AlertDialogTitle>
                        <AlertDialogDescription className="text-sm text-gray-600">
                          <div className="mb-4">
                            <h4 className="font-medium text-gray-900">
                              {property.title}
                            </h4>
                            <div className="mt-1 flex items-center gap-1">
                              <MapPin className="h-3 w-3 text-gray-400" />
                              <span className="text-xs text-gray-600">
                                {location}
                              </span>
                            </div>
                          </div>
                        </AlertDialogDescription>
                      </AlertDialogHeader>

                      <div className="flex items-center gap-2">
                        <Input
                          readOnly
                          value={`${baseUrl}/imovel/${property.id}`}
                          className="flex-1 text-xs"
                        />
                        <Button
                          size="sm"
                          onClick={async () => {
                            try {
                              await navigator.clipboard.writeText(
                                `${baseUrl}/imovel/${property.id}`,
                              );
                              setCopiedPropertyId(property.id);
                              setTimeout(() => {
                                setCopiedPropertyId(null);
                              }, 2000);
                            } catch (err) {
                              console.error("Erro ao copiar:", err);
                            }
                          }}
                          className="bg-[#101828] text-white transition-all duration-300 hover:bg-[#101828]/90"
                        >
                          <div className="flex items-center transition-all duration-300 ease-in-out">
                            <div
                              className={`transition-all duration-300 ease-in-out ${copiedPropertyId === property.id ? "scale-100 opacity-100" : "scale-100 opacity-100"}`}
                            >
                              {copiedPropertyId === property.id ? (
                                <Check className="mr-1 h-4 w-4 text-green-400" />
                              ) : (
                                <Copy className="mr-1 h-4 w-4" />
                              )}
                            </div>
                            <span className="transition-all duration-300 ease-in-out">
                              {copiedPropertyId === property.id
                                ? "Copiado"
                                : "Copiar"}
                            </span>
                          </div>
                        </Button>
                      </div>

                      <div className="mt-3 border-t border-gray-300"></div>

                      <AlertDialogFooter className="w-full gap-2 pt-4">
                        <Link href={`/imovel/${property.id}`}>
                          <AlertDialogAction className="bg-[#101828] text-xs hover:bg-[#101828]/90">
                            Ver Página Completa
                          </AlertDialogAction>
                        </Link>
                        <AlertDialogCancel className="bg-gray-100 text-xs shadow-md hover:bg-gray-200">
                          Fechar
                        </AlertDialogCancel>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
