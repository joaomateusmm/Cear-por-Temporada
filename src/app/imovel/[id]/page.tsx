"use client";

import {
  AirVent,
  Armchair,
  Bath,
  BedDouble,
  BedSingle,
  Building2,
  Car,
  Check,
  Coffee,
  Copy,
  Dog,
  Dumbbell,
  GlassWater,
  HousePlus,
  ImageIcon,
  Instagram,
  LampCeiling,
  Link2,
  MapPin,
  Microwave,
  Minus,
  Palmtree,
  Plus,
  Refrigerator,
  RollerCoaster,
  Share2,
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
import { useCallback, useEffect, useRef, useState } from "react";
import { toast } from "sonner";

import Footer from "@/components/Footer";
import Header from "@/components/Header";
import HeaderMobile from "@/components/HeaderMobile";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { getPropertyById } from "@/lib/property-actions";
import { Amenity, PropertyAmenity } from "@/types/database";

const fallbackImage =
  "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&h=600&fit=crop";

// Interface para tipagem das imagens
interface PropertyImage {
  imageUrl: string;
  isMain: boolean;
}

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
  const [currentSlide, setCurrentSlide] = useState(0);
  const [guests, setGuests] = useState(1);
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [showAllAmenities, setShowAllAmenities] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [copiedPropertyId, setCopiedPropertyId] = useState<string | null>(null);
  const thumbnailContainerRef = useRef<HTMLDivElement>(null);

  // URL base para compartilhamento
  const baseUrl = typeof window !== "undefined" ? window.location.origin : "";

  // Função para rolar as miniaturas e manter a selecionada visível
  const scrollThumbnailIntoView = useCallback((slideIndex: number) => {
    if (!thumbnailContainerRef.current) return;

    const container = thumbnailContainerRef.current;
    const thumbnails = container.children;

    if (slideIndex >= 0 && slideIndex < thumbnails.length) {
      const selectedThumbnail = thumbnails[slideIndex] as HTMLElement;

      // Calcula a posição para centralizar a miniatura
      const containerWidth = container.offsetWidth;
      const thumbnailWidth = selectedThumbnail.offsetWidth;
      const thumbnailLeft = selectedThumbnail.offsetLeft;

      // Posição ideal para centralizar a miniatura
      const idealScrollPosition =
        thumbnailLeft - containerWidth / 2 + thumbnailWidth / 2;

      // Aplica o scroll suave
      container.scrollTo({
        left: idealScrollPosition,
        behavior: "smooth",
      });
    }
  }, []);

  useEffect(() => {
    if (!api) return;

    api.on("select", () => {
      const newSlide = api.selectedScrollSnap();
      setCurrentSlide(newSlide);
      scrollThumbnailIntoView(newSlide);
    });
  }, [api, scrollThumbnailIntoView]);

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

  // Função para obter ícone do destino popular
  const getDestinationIcon = (destination: string) => {
    switch (destination) {
      case "Fortaleza":
        return Building2; // Cidade grande
      case "Jericoacoara":
        return Palmtree; // Praia paradisíaca
      case "Canoa Quebrada":
        return Palmtree; // Praia com ondas
      case "Praia de Picos":
        return Palmtree; // Praia
      case "Morro Branco":
        return Palmtree; // Natureza/montanha
      case "Águas Belas":
        return Palmtree; // Águas
      case "Cumbuco":
        return Palmtree; // Praia
      case "Beach Park":
        return RollerCoaster; // Parque aquático/diversão
      default:
        return MapPin; // Padrão
    }
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
              <div className="relative mx-auto w-full max-w-full">
                <Carousel setApi={setApi} className="w-full">
                  <CarouselContent className="-ml-2 md:-ml-4">
                    {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                    {images.map((image: any, index: number) => (
                      <CarouselItem key={index} className="pl-2 md:pl-4">
                        <div className="relative h-64 w-full overflow-hidden rounded-lg bg-gray-50 sm:h-80 md:h-96 lg:h-[28rem] xl:h-[32rem]">
                          <Image
                            src={image.imageUrl}
                            alt={`${property.title} - Imagem ${index + 1}`}
                            fill
                            className="object-contain transition-transform"
                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 66vw, 50vw"
                            priority={index === 0}
                          />
                        </div>
                      </CarouselItem>
                    ))}
                  </CarouselContent>
                  <CarouselPrevious className="absolute top-1/2 left-1 h-10 w-10 -translate-y-1/2 border-gray-600 bg-gray-800/90 text-white shadow-lg hover:bg-gray-800 hover:text-white md:left-4" />
                  <CarouselNext className="absolute top-1/2 right-1 mr-4 h-10 w-10 -translate-y-1/2 border-gray-600 bg-gray-800/90 text-white shadow-lg hover:bg-gray-800 hover:text-white md:right-4" />
                </Carousel>
              </div>

              {/* Carrossel de Miniaturas */}
              {images.length > 1 && (
                <div className="mx-auto max-w-full">
                  <div className="flex justify-center">
                    <div
                      ref={thumbnailContainerRef}
                      className="scrollbar-hide flex gap-2 overflow-x-auto pb-2 md:gap-3"
                    >
                      {images.map((image: PropertyImage, index: number) => (
                        <button
                          key={index}
                          onClick={() => {
                            api?.scrollTo(index);
                            setCurrentSlide(index);
                            scrollThumbnailIntoView(index);
                          }}
                          className={`relative h-16 w-16 flex-shrink-0 overflow-hidden rounded-lg border-2 transition-all duration-300 hover:scale-110 hover:shadow-md md:h-20 md:w-20 ${
                            currentSlide === index
                              ? "border-gray-800 shadow-md ring-2 ring-blue-200"
                              : "border-gray-300 opacity-70 hover:border-gray-400 hover:opacity-100"
                          }`}
                        >
                          <Image
                            src={image.imageUrl}
                            alt={`${property.title} - Miniatura ${index + 1}`}
                            fill
                            className="object-cover transition-transform duration-300"
                            sizes="80px"
                          />
                          {currentSlide === index && (
                            <div className="absolute inset-0 bg-blue-500/10"></div>
                          )}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="mt-2 text-center">
                    <span className="text-sm text-gray-600">
                      {currentSlide + 1} / {images.length}
                    </span>
                  </div>
                </div>
              )}

              <div className="flex justify-center gap-3">
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="outline" className="gap-2 shadow-md">
                      <ImageIcon className="h-4 w-4" />
                      Ampliar fotos
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-h-[90vh] w-[500px] overflow-hidden">
                    <DialogHeader>
                      <DialogTitle className="text-lg font-semibold">
                        {property.title} - Galeria de Fotos
                      </DialogTitle>
                    </DialogHeader>
                    <div className="grid max-h-[60vh] grid-cols-2 gap-x-4 gap-y-40 overflow-y-auto p-4 pr-6 md:grid-cols-3 md:gap-y-28">
                      {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                      {images.map((image: any, index: number) => (
                        <div
                          key={index}
                          className="relative aspect-square cursor-pointer overflow-hidden rounded-lg shadow-md transition-all duration-300 hover:scale-[1.02] hover:shadow-lg"
                          onClick={() => setSelectedImage(image.imageUrl)}
                        >
                          <Image
                            src={image.imageUrl}
                            alt={`${property.title} - Imagem ${index + 1}`}
                            fill
                            className="object-cover"
                          />
                        </div>
                      ))}
                    </div>
                  </DialogContent>
                </Dialog>

                {/* Modal para foto em tamanho real */}
                <Dialog
                  open={!!selectedImage}
                  onOpenChange={() => setSelectedImage(null)}
                >
                  <DialogContent className="h-[95vh] w-[95vw] max-w-[95vw] border-none bg-transparent p-2 text-2xl text-white md:h-[90vh] md:w-auto md:max-w-[90vw]">
                    <div className="flex h-full w-full items-center justify-center">
                      {selectedImage && (
                        <Image
                          src={selectedImage}
                          alt="Foto ampliada"
                          width={1920}
                          height={1080}
                          className="h-full max-h-full w-full max-w-full rounded-lg object-contain"
                          priority
                        />
                      )}
                    </div>
                  </DialogContent>
                </Dialog>

                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button className="bg-gray-800 shadow-md hover:bg-gray-900">
                      <Share2 className="h-4 w-4" />
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent className="mx-auto max-h-[90vh] w-[90vw] overflow-y-auto md:w-[400px]">
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
                            className={`transition-all duration-300 ease-in-out`}
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

                    <AlertDialogFooter className="flex flex-row gap-2 pt-4 sm:gap-4">
                      <AlertDialogCancel className="flex-1 bg-gray-100 text-xs shadow-md hover:bg-gray-200">
                        Fechar
                      </AlertDialogCancel>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
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

                  <p className="mt-4 text-center text-sm text-gray-500">
                    Você não será cobrado agora
                  </p>
                </CardContent>
              </Card>

              {/* Card de Informações do Perfil para Mobile */}
              <Card className="border-gray-200 bg-white shadow-md md:hidden">
                <CardContent>
                  <div className="space-y-4 text-start">
                    <p className="text-lg font-semibold text-gray-900">
                      Perfil do Proprietário
                    </p>
                    <div className="flex items-center gap-4">
                      <div className="h-20 w-20 overflow-hidden rounded-full border-2 border-gray-300 shadow-md duration-300 hover:scale-[1.02]">
                        {property.owner?.profileImage ? (
                          <Image
                            src={property.owner.profileImage}
                            alt="Foto do proprietário"
                            width={64}
                            height={64}
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <div className="flex h-full w-full items-center justify-center bg-gray-200">
                            <UserRound className="h-8 w-8 text-gray-600" />
                          </div>
                        )}
                      </div>
                      <div className="flex-1">
                        {property.owner ? (
                          <div className="space-y-2 text-sm">
                            <p className="text-gray-500">
                              Nome:{" "}
                              <span className="font-medium text-gray-700">
                                {property.owner.fullName || "Não informado"}
                              </span>
                            </p>
                            <div className="flex gap-8">
                              <div className="space-y-1">
                                <p className="text-gray-500">Contatos:</p>
                                <div className="ml-2 space-y-1">
                                  <span className="block font-medium text-gray-700">
                                    {property.owner.email || "Não informado"}
                                  </span>
                                  <span className="block font-medium text-gray-700">
                                    {property.owner.phone || "Não informado"}
                                  </span>
                                </div>
                              </div>
                              {((property.owner.instagram &&
                                property.owner.instagram.trim() !== "") ||
                                (property.owner.website &&
                                  property.owner.website.trim() !== "")) && (
                                <div>
                                  <p className="mb-2 text-gray-500">Redes:</p>
                                  <div className="ml-2 flex gap-3">
                                    {property.owner.instagram &&
                                      property.owner.instagram.trim() !==
                                        "" && (
                                        <Link
                                          href={
                                            property.owner.instagram.startsWith(
                                              "http",
                                            )
                                              ? property.owner.instagram
                                              : `https://instagram.com/${property.owner.instagram.replace("@", "")}`
                                          }
                                          target="_blank"
                                          className="flex items-center gap-1 text-gray-700 transition-colors hover:text-gray-800"
                                          title="Instagram"
                                        >
                                          <Instagram className="h-4 w-4" />
                                        </Link>
                                      )}
                                    {property.owner.website &&
                                      property.owner.website.trim() !== "" && (
                                        <Link
                                          href={
                                            property.owner.website.startsWith(
                                              "http",
                                            )
                                              ? property.owner.website
                                              : `https://${property.owner.website}`
                                          }
                                          target="_blank"
                                          className="flex items-center gap-1 text-gray-700 transition-colors hover:text-gray-800"
                                          title="Website"
                                        >
                                          <Link2 className="h-4 w-4" />
                                        </Link>
                                      )}
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>
                        ) : (
                          <div className="space-y-2 text-sm">
                            <p className="text-gray-700">
                              Nome:{" "}
                              <span className="font-medium text-gray-900">
                                Não informado
                              </span>
                            </p>
                            <div className="space-y-1">
                              <p className="text-gray-700">Contatos:</p>
                              <div className="ml-2 space-y-1">
                                <span className="block text-gray-900">
                                  Não informado
                                </span>
                                <span className="block text-gray-900">
                                  Não informado
                                </span>
                              </div>
                            </div>
                            <p className="text-sm text-gray-500 italic">
                              Informações do proprietário não disponíveis
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
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

                <p className="mt-4 text-center text-sm text-gray-500">
                  Você não será cobrado agora
                </p>
              </CardContent>
            </Card>

            {/* Card de Informações do Perfil */}
            <Card className="hidden border-gray-200 bg-white shadow-md md:block">
              <CardContent>
                <div className="space-y-4 text-start">
                  <p className="text-lg font-semibold text-gray-900">
                    Perfil do Proprietário
                  </p>
                  <div className="flex items-center gap-4">
                    <div className="h-20 w-20 overflow-hidden rounded-full border-2 border-gray-300 shadow-md duration-300 hover:scale-[1.02]">
                      {property.owner?.profileImage ? (
                        <Image
                          src={property.owner.profileImage}
                          alt="Foto do proprietário"
                          width={64}
                          height={64}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center bg-gray-200">
                          <UserRound className="h-8 w-8 text-gray-600" />
                        </div>
                      )}
                    </div>
                    <div className="flex-1">
                      {property.owner ? (
                        <div className="space-y-2 text-sm">
                          <p className="text-gray-500">
                            Nome:{" "}
                            <span className="font-medium text-gray-700">
                              {property.owner.fullName || "Não informado"}
                            </span>
                          </p>
                          <div className="flex gap-8">
                            <div className="space-y-1">
                              <p className="text-gray-500">Contatos:</p>
                              <div className="ml-2 space-y-1">
                                <span className="block font-medium text-gray-700">
                                  {property.owner.email || "Não informado"}
                                </span>
                                <span className="block font-medium text-gray-700">
                                  {property.owner.phone || "Não informado"}
                                </span>
                              </div>
                            </div>
                            {((property.owner.instagram &&
                              property.owner.instagram.trim() !== "") ||
                              (property.owner.website &&
                                property.owner.website.trim() !== "")) && (
                              <div>
                                <p className="mb-2 text-gray-500">Redes:</p>
                                <div className="ml-2 flex gap-3">
                                  {property.owner.instagram &&
                                    property.owner.instagram.trim() !== "" && (
                                      <Link
                                        href={
                                          property.owner.instagram.startsWith(
                                            "http",
                                          )
                                            ? property.owner.instagram
                                            : `https://instagram.com/${property.owner.instagram.replace("@", "")}`
                                        }
                                        target="_blank"
                                        className="flex items-center gap-1 text-gray-700 transition-colors hover:text-gray-800"
                                        title="Instagram"
                                      >
                                        <Instagram className="h-4 w-4" />
                                      </Link>
                                    )}
                                  {property.owner.website &&
                                    property.owner.website.trim() !== "" && (
                                      <Link
                                        href={
                                          property.owner.website.startsWith(
                                            "http",
                                          )
                                            ? property.owner.website
                                            : `https://${property.owner.website}`
                                        }
                                        target="_blank"
                                        className="flex items-center gap-1 text-gray-700 transition-colors hover:text-gray-800"
                                        title="Website"
                                      >
                                        <Link2 className="h-4 w-4" />
                                      </Link>
                                    )}
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      ) : (
                        <div className="space-y-2 text-sm">
                          <p className="text-gray-700">
                            Nome:{" "}
                            <span className="font-medium text-gray-900">
                              Não informado
                            </span>
                          </p>
                          <div className="space-y-1">
                            <p className="text-gray-700">Contatos:</p>
                            <div className="ml-2 space-y-1">
                              <span className="block text-gray-900">
                                Não informado
                              </span>
                              <span className="block text-gray-900">
                                Não informado
                              </span>
                            </div>
                          </div>
                          <p className="text-sm text-gray-500 italic">
                            Informações do proprietário não disponíveis
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

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
            {/* Destino Popular */}
            {property.location?.popularDestination &&
              property.location.popularDestination !==
                "Nenhum dos anteriores" && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-xl text-gray-900">
                      Destino Popular Próximo
                    </CardTitle>
                    <p className="text-gray-600">
                      Este imóvel está localizado próximo a um destino popular
                      do Ceará
                    </p>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center gap-3">
                      <div className="rounded-md bg-gray-200 p-2 shadow-md duration-700 hover:scale-115">
                        {(() => {
                          const DestinationIcon = getDestinationIcon(
                            property.location.popularDestination,
                          );
                          return (
                            <DestinationIcon className="h-4 w-4 text-gray-800" />
                          );
                        })()}
                      </div>
                      <span className="text-gray-900">
                        {property.location.popularDestination}
                      </span>
                      <Check className="ml-auto h-4 w-4 text-gray-600" />
                    </div>
                  </CardContent>
                </Card>
              )}
          </div>
        </div>

        {/* Localização Google Maps
        <div className="mt-6 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl text-gray-900">
                Localização
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
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
        </div> */}

        {/* Localização Detalhada */}
        <div className="mt-6 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl text-gray-900">
                Localização do Imóvel
              </CardTitle>
              <p className="text-gray-600">
                Informações completas sobre a localização e região
              </p>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {property.location ? (
                  <>
                    {/* Endereço Principal */}
                    <div className="rounded-lg border border-gray-200 bg-gray-50 p-4">
                      <div className="flex items-start gap-3">
                        <MapPin className="mt-1 h-5 w-5 text-gray-600" />
                        <div className="space-y-2">
                          <h3 className="font-semibold text-gray-900">
                            Endereço Completo
                          </h3>
                          <div className="space-y-1 text-gray-700">
                            <p className="font-medium">
                              {property.location.fullAddress}
                            </p>
                            <p>
                              {property.location.neighborhood},{" "}
                              {property.location.city} -{" "}
                              {property.location.state}
                            </p>
                            <p className="text-sm text-gray-600">
                              CEP: {property.location.zipCode}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Informações da Região */}
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                      <div className="rounded-lg border border-gray-200 p-4">
                        <h4 className="mb-2 font-semibold text-gray-900">
                          Bairro
                        </h4>
                        <p className="text-gray-700">
                          {property.location.neighborhood}
                        </p>
                        <p className="mt-1 text-sm text-gray-600">
                          Uma região estratégica com boa infraestrutura
                        </p>
                      </div>

                      <div className="rounded-lg border border-gray-200 p-4">
                        <h4 className="mb-2 font-semibold text-gray-900">
                          Cidade
                        </h4>
                        <p className="text-gray-700">
                          {property.location.city}, {property.location.state}
                        </p>
                        <p className="mt-1 text-sm text-gray-600">
                          Localização privilegiada no estado do Ceará
                        </p>
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="rounded-lg border border-gray-200 bg-gray-50 p-8 text-center">
                    <MapPin className="mx-auto mb-3 h-8 w-8 text-gray-400" />
                    <h3 className="mb-2 font-semibold text-gray-900">
                      Informações de Localização
                    </h3>
                    <p className="text-gray-600">
                      As informações detalhadas da localização não estão
                      disponíveis no momento.
                    </p>
                    <p className="mt-2 text-sm text-gray-500">
                      Entre em contato conosco para mais detalhes sobre a
                      localização.
                    </p>
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
