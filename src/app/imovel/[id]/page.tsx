"use client";

import {
  AirVent,
  Armchair,
  Bath,
  BedDouble,
  BedSingle,
  Car,
  Check,
  Coffee,
  Dog,
  Dumbbell,
  GlassWater,
  HousePlus,
  ImageIcon,
  LampCeiling,
  MapPin,
  Microwave,
  Minus,
  Plus,
  Refrigerator,
  Shirt,
  SquareCheck,
  SquareM,
  Toilet,
  TvMinimal,
  UserRound,
  Users,
  Utensils,
  WavesLadder,
  Wifi,
  Wind,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";

import Footer from "@/components/Footer";
import Header from "@/components/Header";
import HeaderMobile from "@/components/HeaderMobile";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Carousel,
  CarouselApi,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { getPropertyById } from "@/lib/property-actions";
import { Amenity, PropertyAmenity } from "@/types/database";

const fallbackImage =
  "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&h=600&fit=crop";

// Interface para tipagem das comodidades
interface AmenityWithIcon {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  included: boolean;
}

export default function PropertyPage() {
  const params = useParams();
  const id = params.id as string;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [property, setProperty] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [api, setApi] = useState<CarouselApi>();
  const [guests, setGuests] = useState(1);
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [showAllAmenities, setShowAllAmenities] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    if (!api) return;

    api.on("select", () => {
      // Código para controle do carrossel se necessário
    });
  }, [api]);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    async function loadProperty() {
      try {
        setIsLoading(true);
        const data = await getPropertyById(id);
        if (data) {
          setProperty(data);
          setGuests(1); // Valor padrão
        } else {
          toast.error("Imóvel não encontrado");
        }
      } catch (error) {
        console.error("Erro ao carregar imóvel:", error);
        toast.error("Erro ao carregar dados do imóvel");
      } finally {
        setIsLoading(false);
      }
    }

    if (id) {
      loadProperty();
    }
  }, [id]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <HeaderMobile />
        <div className="container mx-auto px-4 py-8">
          <div className="animate-pulse">
            <div className="mb-4 h-8 w-3/4 rounded bg-gray-200"></div>
            <div className="mb-6 h-64 rounded bg-gray-200"></div>
            <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
              <div className="space-y-6 lg:col-span-2">
                <div className="h-32 rounded bg-gray-200"></div>
                <div className="h-48 rounded bg-gray-200"></div>
              </div>
              <div className="space-y-4">
                <div className="h-64 rounded bg-gray-200"></div>
              </div>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!property) {
    return (
      <div className="mt-15 min-h-screen bg-gray-50">
        <Header />
        <HeaderMobile />
        <div className="container mx-auto px-4 py-8 text-center">
          <h1 className="mb-4 text-2xl font-bold text-gray-900">
            Imóvel não encontrado
          </h1>
          <p className="mb-8 text-gray-600">
            O imóvel solicitado não existe ou foi removido.
          </p>
          <Link href="/">
            <Button>Voltar ao início</Button>
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  const images =
    property.images && property.images.length > 0
      ? property.images
      : [{ imageUrl: fallbackImage, isMain: true }];
  const location = property.location
    ? `${property.location.neighborhood}, ${property.location.city}`
    : "Localização não informada";
  const dailyPrice = parseFloat(property.pricing?.dailyRate || "0");
  const monthlyRent = parseFloat(property.pricing?.monthlyRent || "0");
  const cleaningFee = parseFloat(property.pricing?.monthlyCleaningFee || "0");

  const calculateNightlyRate = () => {
    if (dailyPrice > 0) return dailyPrice;
    if (monthlyRent > 0) return Math.round(monthlyRent / 30);
    return 0;
  };

  const nightlyRate = calculateNightlyRate();

  const includedServices = [
    {
      icon: Utensils,
      label: "Utensílios de cozinha",
      included: property.pricing?.includesKitchenUtensils || false,
    },
    {
      icon: Armchair,
      label: "Mobília",
      included: property.pricing?.includesFurniture || false,
    },
    {
      icon: LampCeiling,
      label: "Luz",
      included: property.pricing?.includesElectricity || false,
    },
    {
      icon: Wifi,
      label: "Internet",
      included: property.pricing?.includesInternet || false,
    },
    {
      icon: BedSingle,
      label: "Kit enxoval",
      included: property.pricing?.includesLinens || false,
    },
    {
      icon: GlassWater,
      label: "Água",
      included: property.pricing?.includesWater || false,
    },
    { icon: TvMinimal, label: "TV a cabo", included: true },
  ];

  // Função para obter ícone da comodidade
  const getAmenityIcon = (amenityName: string) => {
    // Verifica se o nome existe antes de tentar fazer toLowerCase
    if (!amenityName) return SquareCheck;

    // Procura por palavras-chave no nome da comodidade
    const name = amenityName.toLowerCase();

    if (name.includes("ar condicionado") || name.includes("ar-condicionado"))
      return AirVent;
    if (name.includes("internet") || name.includes("wifi")) return Wifi;
    if (name.includes("tv") || name.includes("televisão")) return TvMinimal;
    if (name.includes("cozinha")) return Coffee;
    if (name.includes("geladeira") || name.includes("refrigerador"))
      return Refrigerator;
    if (name.includes("microondas")) return Microwave;
    if (name.includes("máquina") || name.includes("lavar")) return Shirt;
    if (name.includes("secadora")) return Wind;
    if (name.includes("ferro")) return HousePlus;
    if (name.includes("cabide") || name.includes("guarda-roupa"))
      return HousePlus;
    if (name.includes("piscina")) return WavesLadder;
    if (name.includes("academia") || name.includes("ginástica"))
      return Dumbbell;
    if (name.includes("ventilador")) return HousePlus;
    if (name.includes("banheira") || name.includes("hidro")) return Bath;
    if (
      name.includes("utensílio") ||
      name.includes("panela") ||
      name.includes("prato")
    )
      return Utensils;
    if (name.includes("água quente") || name.includes("aquecedor"))
      return HousePlus;
    if (
      name.includes("estacionamento") ||
      name.includes("garagem") ||
      name.includes("vaga")
    )
      return Car;
    if (name.includes("pet") || name.includes("animal")) return Dog;

    // Ícone padrão para comodidades não mapeadas
    return HousePlus;
  };

  // Preparar lista de comodidades com ícones
  const amenitiesWithIcons =
    property.amenities?.map(
      (propertyAmenity: PropertyAmenity & { amenity: Amenity }) => ({
        icon: getAmenityIcon(propertyAmenity.amenity?.name),
        label: propertyAmenity.amenity?.name || "Comodidade",
        included: true, // Todas as comodidades do imóvel estão incluídas
      }),
    ) || [];

  // Lógica para exibição das comodidades
  const totalAmenities = amenitiesWithIcons.length;
  const shouldShowViewAllButton = totalAmenities > 10;

  // Para evitar problemas de hidratação, sempre mostra as primeiras 10 inicialmente
  const displayedAmenities =
    isMounted && shouldShowViewAllButton && showAllAmenities
      ? amenitiesWithIcons
      : amenitiesWithIcons.slice(0, Math.min(10, totalAmenities));

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <HeaderMobile />

      {/* Conteúdo Principal */}
      <div className="mt-15 max-w-7xl px-4 py-8 md:mx-40">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          {/* Coluna Esquerda - Informações do Imóvel */}
          <div className="space-y-8 lg:col-span-2">
            {/* Galeria de Imagens */}
            <div className="space-y-4">
              <Carousel setApi={setApi} className="w-full">
                <CarouselContent>
                  {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                  {images.map((image: any, index: number) => (
                    <CarouselItem key={index}>
                      <div className="relative h-96 overflow-hidden rounded-lg">
                        <Image
                          src={image.imageUrl}
                          alt={`${property.title} - Imagem ${index + 1}`}
                          fill
                          className="object-cover"
                        />
                      </div>
                    </CarouselItem>
                  ))}
                </CarouselContent>
                <CarouselPrevious className="left-4" />
                <CarouselNext className="right-4" />
              </Carousel>

              <div className="flex justify-center">
                <Button variant="outline" className="gap-2">
                  <ImageIcon className="h-4 w-4" />
                  Ampliar fotos
                </Button>
              </div>
            </div>

            {/* Informações Principais */}
            <div className="space-y-6">
              <div>
                <h1 className="mb-2 text-3xl font-bold text-gray-900">
                  {property.title}
                </h1>
                <div className="flex items-center gap-2 text-gray-600">
                  <MapPin className="h-4 w-4" />
                  <span>{location}</span>
                </div>
              </div>

              {/* Personalizar Moradia */}
              <Card className="sticky top-4 md:hidden">
                <CardHeader>
                  <CardTitle className="text-lg text-gray-900">
                    Personalize sua moradia
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Datas */}
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <Label htmlFor="checkin" className="text-sm font-medium">
                        Data de entrada
                      </Label>
                      <Input
                        id="checkin"
                        type="date"
                        value={checkIn}
                        onChange={(e) => setCheckIn(e.target.value)}
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label htmlFor="checkout" className="text-sm font-medium">
                        Saída
                      </Label>
                      <Input
                        id="checkout"
                        type="date"
                        value={checkOut}
                        onChange={(e) => setCheckOut(e.target.value)}
                        className="mt-1"
                      />
                    </div>
                  </div>

                  {/* Número de Pessoas */}
                  <div>
                    <Label className="text-sm font-medium">
                      Número de pessoas
                    </Label>
                    <div className="mt-2 flex items-center justify-between">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setGuests(Math.max(1, guests - 1))}
                        disabled={guests <= 1}
                      >
                        <Minus className="h-4 w-4" />
                      </Button>
                      <span className="text-lg font-semibold">{guests}</span>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() =>
                          setGuests(Math.min(property.maxGuests, guests + 1))
                        }
                        disabled={guests >= property.maxGuests}
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  {/* Valores */}
                  <div className="space-y-3 border-t pt-4">
                    <div className="flex justify-between">
                      <span>Aluguel</span>
                      <span>
                        R${" "}
                        {monthlyRent > 0
                          ? monthlyRent.toFixed(2)
                          : dailyPrice.toFixed(2)}
                      </span>
                    </div>

                    {cleaningFee > 0 && (
                      <div className="flex justify-between">
                        <span>Limpeza mensal</span>
                        <span>R$ {cleaningFee.toFixed(2)}</span>
                      </div>
                    )}

                    <div className="flex justify-between">
                      <span>Pacote de moradia</span>
                      <span>Incluído</span>
                    </div>

                    <div className="border-t pt-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Até 29 noites</span>
                        <div className="text-right">
                          <div className="text-xl font-bold">
                            {nightlyRate > 0
                              ? `R$ ${nightlyRate.toFixed(0)}/Noite`
                              : "A combinar"}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Botão Reservar */}
                  <Link
                    href={`https://api.whatsapp.com/send/?phone=5585992718222&text=${encodeURIComponent(`🏠 *RESERVA DE IMÓVEL* 🏠\n\nOlá! Gostaria de fazer uma reserva para o imóvel:\n\n📝 *${property.title}*\n📍 ${location}\n💰 Valor: ${nightlyRate > 0 ? `R$ ${nightlyRate}/noite` : "A combinar"}\n\n👥 Número de hóspedes: ${guests}\n📅 Check-in: ${checkIn || "A definir"}\n📅 Check-out: ${checkOut || "A definir"}\n\nPor favor, me ajude a finalizar esta reserva! 😊`)}&type=phone_number&app_absent=0`}
                    target="_blank"
                  >
                    <Button className="w-full bg-green-500 py-6 text-lg text-white shadow-md duration-300 hover:bg-green-600">
                      Reservar Agora
                    </Button>
                  </Link>

                  <p className="text-center text-sm text-gray-500">
                    Você não será cobrado agora
                  </p>
                </CardContent>
              </Card>

              {/* Grid de Informações */}
              <div className="grid cursor-default grid-cols-2 gap-4 md:grid-cols-3">
                <Card className="p-4 shadow-md duration-700 hover:scale-[1.02]">
                  <div className="flex items-center gap-5">
                    <Users className="h-5 w-5 text-gray-600" />
                    <div>
                      <div className="text-sm text-gray-600">Hóspedes</div>
                      <div className="font-semibold">{property.maxGuests}</div>
                    </div>
                  </div>
                </Card>

                <Card className="p-4 shadow-md duration-700 hover:scale-[1.02]">
                  <div className="flex items-center gap-5">
                    <BedDouble className="h-5 w-5 text-gray-600" />
                    <div>
                      <div className="text-sm text-gray-600">Quartos</div>
                      <div className="font-semibold">{property.bedrooms}</div>
                    </div>
                  </div>
                </Card>

                <Card className="p-4 shadow-md duration-700 hover:scale-[1.02]">
                  <div className="flex items-center gap-5">
                    <Toilet className="h-5 w-5 text-gray-600" />
                    <div>
                      <div className="text-sm text-gray-600">Banheiros</div>
                      <div className="font-semibold">{property.bathrooms}</div>
                    </div>
                  </div>
                </Card>

                <Card className="p-4 shadow-md duration-700 hover:scale-[1.02]">
                  <div className="flex items-center gap-5">
                    <Car className="h-5 w-5 text-gray-600" />
                    <div>
                      <div className="text-sm text-gray-600">Vagas</div>
                      <div className="font-semibold">
                        {property.parkingSpaces}
                      </div>
                    </div>
                  </div>
                </Card>

                {property.areaM2 && (
                  <Card className="p-4 shadow-md duration-700 hover:scale-[1.02]">
                    <div className="flex items-center gap-5">
                      <SquareM className="h-5 w-5 text-gray-600" />
                      <div>
                        <div className="text-sm text-gray-600">Área</div>
                        <div className="font-semibold">{property.areaM2}m²</div>
                      </div>
                    </div>
                  </Card>
                )}

                <Card className="p-4 shadow-md duration-700 hover:scale-[1.03]">
                  <div className="flex items-center gap-5">
                    <Dog className="h-5 w-5 text-gray-600" />
                    <div>
                      <div className="text-sm text-gray-600">Aceita Pet?</div>
                      <div
                        className={`font-semibold ${property.allowsPets ? "text-gray-800" : "text-gray-800"}`}
                      >
                        {property.allowsPets ? "Sim" : "Não"}
                      </div>
                    </div>
                  </div>
                </Card>
              </div>
            </div>

            {/* Pacote de Moradia Incluso */}
            <Card>
              <CardHeader>
                <CardTitle className="text-xl text-gray-900">
                  Serviços Inclusos no imóvel
                </CardTitle>
                <p className="text-gray-600">
                  No pacote de moradia dessa unidade, estão incluídas as taxas
                  de:
                </p>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  {includedServices.map((service, index) => (
                    <div key={index} className="flex items-center gap-3">
                      <div
                        className={`rounded-md p-2 shadow-md duration-700 hover:scale-115 ${service.included ? "bg-gray-200" : "bg-gray-100/70"}`}
                      >
                        <service.icon
                          className={`h-4 w-4 ${service.included ? "text-gray-800" : "text-gray-400"}`}
                        />
                      </div>
                      <span
                        className={`${service.included ? "text-gray-900" : "text-gray-400"}`}
                      >
                        {service.label}
                      </span>
                      {service.included && (
                        <Check className="ml-auto h-4 w-4 text-gray-600" />
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* O que tem no imóvel */}
            <Card>
              <CardHeader>
                <CardTitle className="text-xl text-gray-900">
                  O que tem nesse imóvel
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  {displayedAmenities.map(
                    (amenity: AmenityWithIcon, index: number) => (
                      <div key={index} className="flex items-center gap-3">
                        <div
                          className={`rounded-md p-2 shadow-md duration-700 hover:scale-115 ${amenity.included ? "bg-gray-200" : "bg-gray-100/70"}`}
                        >
                          <amenity.icon
                            className={`h-4 w-4 ${amenity.included ? "text-gray-800" : "text-gray-400"}`}
                          />
                        </div>
                        <span
                          className={`${amenity.included ? "text-gray-900" : "text-gray-400"}`}
                        >
                          {amenity.label}
                        </span>
                        {amenity.included && (
                          <Check className="ml-auto h-4 w-4 text-gray-600" />
                        )}
                      </div>
                    ),
                  )}
                </div>
                {isMounted && shouldShowViewAllButton && (
                  <div className="mt-4">
                    <Button
                      variant="link"
                      className="h-auto p-0"
                      onClick={() => setShowAllAmenities(!showAllAmenities)}
                    >
                      {showAllAmenities
                        ? "Ver menos comodidades"
                        : `Ver todas as ${totalAmenities} comodidades →`}
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Sobre o imóvel */}
            <Card>
              <CardHeader>
                <CardTitle className="text-xl text-gray-900">
                  Sobre esse imóvel
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4 leading-relaxed text-gray-700">
                  <p>{property.fullDescription}</p>
                  <p className="text-xs text-gray-600">
                    {property.shortDescription}
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Região Próxima */}
            {property.nearbyRegion && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-xl text-gray-900">
                    Região Próxima
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="leading-relaxed text-gray-700">
                    <p>{property.nearbyRegion}</p>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Sobre o Prédio */}
            {property.aboutBuilding && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-xl text-gray-900">
                    Sobre o prédio
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="leading-relaxed text-gray-700">
                    <p>{property.aboutBuilding}</p>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Coluna Direita - Sidebar */}
          <div className="space-y-6">
            {/* Personalizar Moradia */}
            <Card className="sticky top-4 hidden md:block">
              <CardHeader>
                <CardTitle className="text-lg text-gray-900">
                  Personalize sua moradia
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Datas */}
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <Label htmlFor="checkin" className="text-sm font-medium">
                      Data de entrada
                    </Label>
                    <Input
                      id="checkin"
                      type="date"
                      value={checkIn}
                      onChange={(e) => setCheckIn(e.target.value)}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="checkout" className="text-sm font-medium">
                      Saída
                    </Label>
                    <Input
                      id="checkout"
                      type="date"
                      value={checkOut}
                      onChange={(e) => setCheckOut(e.target.value)}
                      className="mt-1"
                    />
                  </div>
                </div>

                {/* Número de Pessoas */}
                <div>
                  <Label className="text-sm font-medium">
                    Número de pessoas
                  </Label>
                  <div className="mt-2 flex items-center justify-between">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setGuests(Math.max(1, guests - 1))}
                      disabled={guests <= 1}
                    >
                      <Minus className="h-4 w-4" />
                    </Button>
                    <span className="text-lg font-semibold">{guests}</span>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        setGuests(Math.min(property.maxGuests, guests + 1))
                      }
                      disabled={guests >= property.maxGuests}
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                {/* Valores */}
                <div className="space-y-3 border-t pt-4">
                  <div className="flex justify-between">
                    <span>Aluguel</span>
                    <span>
                      R${" "}
                      {monthlyRent > 0
                        ? monthlyRent.toFixed(2)
                        : dailyPrice.toFixed(2)}
                    </span>
                  </div>

                  {cleaningFee > 0 && (
                    <div className="flex justify-between">
                      <span>Limpeza mensal</span>
                      <span>R$ {cleaningFee.toFixed(2)}</span>
                    </div>
                  )}

                  <div className="flex justify-between">
                    <span>Pacote de moradia</span>
                    <span>Incluído</span>
                  </div>

                  <div className="border-t pt-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Até 29 noites</span>
                      <div className="text-right">
                        <div className="text-xl font-bold">
                          {nightlyRate > 0
                            ? `R$ ${nightlyRate.toFixed(0)}/Noite`
                            : "A combinar"}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Botão Reservar */}
                <Link
                  href={`https://api.whatsapp.com/send/?phone=5585992718222&text=${encodeURIComponent(`🏠 *RESERVA DE IMÓVEL* 🏠\n\nOlá! Gostaria de fazer uma reserva para o imóvel:\n\n📝 *${property.title}*\n📍 ${location}\n💰 Valor: ${nightlyRate > 0 ? `R$ ${nightlyRate}/noite` : "A combinar"}\n\n👥 Número de hóspedes: ${guests}\n📅 Check-in: ${checkIn || "A definir"}\n📅 Check-out: ${checkOut || "A definir"}\n\nPor favor, me ajude a finalizar esta reserva! 😊`)}&type=phone_number&app_absent=0`}
                  target="_blank"
                >
                  <Button className="w-full bg-green-500 py-6 text-lg text-white shadow-md duration-300 hover:bg-green-600">
                    Reservar Agora
                  </Button>
                </Link>

                <p className="text-center text-sm text-gray-500 mt-4">
                  Você não será cobrado agora
                </p>
              </CardContent>
            </Card>

            {/* Perfil do Anfitrião
            <Card>
              <CardContent>
                <div className="space-y-3 text-start">
                  <p className="text-lg font-semibold text-gray-900">
                    Perfil do Anfitrião
                  </p>
                  <div className="flex items-center gap-5">
                    <div className="flex h-18 w-18 items-center justify-center rounded-full bg-gray-200 shadow-lg">
                      <UserRound className="h-9 w-9 text-gray-600/80" />
                    </div>
                    <div className="flex flex-col gap-2">
                      <p>Nome: (nome não encontrado no sistema)</p>
                      <p>Contatos: (contato não encontrado no sistema)</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card> */}

            {/* Suporte */}
            <Card>
              <CardContent>
                <div className="space-y-3 text-center">
                  <p className="text-lg font-semibold text-gray-900">
                    Dúvidas ou Precisa de ajuda?
                  </p>
                  <Link
                    href={`https://api.whatsapp.com/send/?phone=5585992718222&text=${encodeURIComponent(`Olá! 👋\n\nEstou interessado(a) no imóvel *${property.title}* e gostaria de tirar algumas dúvidas.\n\n📍 Localização: ${location}\n💰 Valor: ${nightlyRate > 0 ? `R$ ${nightlyRate}/noite` : "A combinar"}\n\nPoderia me ajudar com mais informações?`)}&type=phone_number&app_absent=0`}
                    target="_blank"
                  >
                    <Button className="gap-2 bg-gray-800 py-4 text-white shadow-md duration-300 hover:bg-gray-900">
                      Fale com a gente
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>

            {/* Benefícios */}
            <Card>
              <CardContent>
                <div className="space-y-4">
                  <div className="text-center">
                    <h3 className="mb-4 text-lg font-semibold text-gray-900">
                      Sem burocracia e 100% Online
                    </h3>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-200">
                        <SquareCheck className="h-4 w-4 text-gray-800" />
                      </div>
                      <div>
                        <div className="font-medium">Alugou, viajou!</div>
                        <div className="text-sm text-gray-600">
                          Apartamentos e casas prontos para uso.
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-200">
                        <SquareCheck className="h-4 w-4 text-gray-800" />
                      </div>
                      <div>
                        <div className="font-medium">
                          Segurança e zero burocracia
                        </div>
                        <div className="text-sm text-gray-600">
                          Não precisa de depósito, é simples e 100% digital.
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Localização */}
        <div className="mt-12 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl text-gray-900">
                Localização
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {/* Placeholder para mapa */}
                <div className="flex h-64 w-full items-center justify-center rounded-lg bg-gray-200">
                  <div className="text-center text-gray-500">
                    <MapPin className="mx-auto mb-2 h-8 w-8" />
                    <p>Mapa interativo</p>
                    <p className="text-sm">Integração com Google Maps</p>
                  </div>
                </div>

                {property.location && (
                  <div className="text-gray-700">
                    <p className="font-semibold">
                      {property.location.fullAddress}
                    </p>
                    <p>
                      {property.location.neighborhood}, {property.location.city}{" "}
                      - {property.location.state}
                    </p>
                    <p>CEP: {property.location.zipCode}</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <Footer />
    </div>
  );
}
