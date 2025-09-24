"use client";

import {
  AirVent,
  Album,
  Baby,
  BanknoteX,
  Bath,
  Bed,
  BedDouble,
  BedSingle,
  Car,
  Check,
  CircleQuestionMark,
  Clock,
  Coffee,
  Copy,
  CreditCard,
  Dog,
  DoorOpen,
  Dumbbell,
  GlassWater,
  Hamburger,
  HousePlus,
  ImageIcon,
  LampCeiling,
  LogOut,
  MapPin,
  Microwave,
  Minus,
  Palmtree,
  PartyPopper,
  Plane,
  Plus,
  Refrigerator,
  Share2,
  Shirt,
  Sofa,
  SquareCheck,
  TvMinimal,
  User,
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
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { getPropertyById } from "@/lib/property-actions";
import { Amenity, PropertyAmenity } from "@/types/database";

const fallbackImage =
  "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&h=600&fit=crop";

// Interface para tipagem das imagens
interface PropertyImage {
  imageUrl: string;
  isMain: boolean;
}

// Interface para tipagem das proximidades
interface NearbyItem {
  name: string;
  distance: string;
}

// Interface para tipagem das comodidades
interface AmenityWithIcon {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  included: boolean;
}

// Interface para tipagem dos quartos dos apartamentos
interface ApartmentRoom {
  name?: string;
  doubleBeds?: number;
  largeBeds?: number;
  extraLargeBeds?: number;
  singleBeds?: number;
  sofaBeds?: number;
}

// Interface para tipagem dos apartamentos
interface PropertyApartment {
  name?: string;
  totalBathrooms?: number;
  hasLivingRoom?: boolean;
  livingRoomHasSofaBed?: boolean;
  hasKitchen?: boolean;
  kitchenHasStove?: boolean;
  kitchenHasFridge?: boolean;
  kitchenHasMinibar?: boolean;
  hasBalcony?: boolean;
  balconyHasSeaView?: boolean;
  hasCrib?: boolean;
  maxAdults?: number;
  maxChildren?: number;
  rooms?: ApartmentRoom[];
}

export default function PropertyPage() {
  const params = useParams();
  const id = params.id as string;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [property, setProperty] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [api, setApi] = useState<CarouselApi>();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [adults, setAdults] = useState(1);
  const [children, setChildren] = useState(0);
  const [rooms] = useState(property?.bedrooms || 1);
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [showAllAmenities, setShowAllAmenities] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [copiedPropertyId, setCopiedPropertyId] = useState<string | null>(null);
  const [selectedApartment, setSelectedApartment] = useState<number | null>(
    null,
  );
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
      icon: Coffee,
      label: "Café da Manhã",
      included: property.pricing?.includesKitchenUtensils || false,
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
      label: "Roupas de cama",
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
  const shouldShowViewAllButton = totalAmenities > 8;

  // Para evitar problemas de hidratação, sempre mostra as primeiras 8 inicialmente
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
                          className={`relative h-16 w-16 flex-shrink-0 overflow-hidden rounded-lg border-2 transition-all duration-300 hover:scale-[1.02] hover:shadow-md md:h-20 md:w-20 ${
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
                <CardHeader className="flex justify-between">
                  <CardTitle className="mb-3 text-lg text-gray-900">
                    Personalize sua estadia
                  </CardTitle>
                  <div>
                    <Tooltip>
                      <TooltipTrigger>
                        <CircleQuestionMark className="h-5 w-5 text-gray-900" />
                      </TooltipTrigger>
                      <TooltipContent className="max-h-none overflow-visible border border-gray-300/50 bg-white">
                        <p className="py-3 text-sm leading-relaxed text-gray-900">
                          Cada imóvel tem políticas diferentes, leia em <br />
                          &apos;Regras da casa&apos; para mais informações.
                        </p>
                      </TooltipContent>
                    </Tooltip>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Datas */}
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <Label
                        htmlFor="checkin-mobile"
                        className="text-sm font-medium"
                      >
                        Data de entrada
                      </Label>
                      <Input
                        id="checkin-mobile"
                        type="date"
                        value={checkIn}
                        onChange={(e) => setCheckIn(e.target.value)}
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label
                        htmlFor="checkout-mobile"
                        className="text-sm font-medium"
                      >
                        Saída
                      </Label>
                      <Input
                        id="checkout-mobile"
                        type="date"
                        value={checkOut}
                        onChange={(e) => setCheckOut(e.target.value)}
                        className="mt-1"
                      />
                    </div>
                  </div>

                  <div className="mt-6 border-t"></div>

                  {/* Capacidade: Adultos / Crianças / Cômodos */}
                  <div className="space-y-3">
                    <div className="">
                      <Label className="text-sm font-medium">Adultos</Label>
                      <div className="mt-2 flex items-center justify-between">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setAdults(Math.max(1, adults - 1))}
                          disabled={adults <= 1}
                        >
                          <Minus className="h-4 w-4" />
                        </Button>
                        <span className="mx-4 text-lg font-semibold">
                          {adults}
                        </span>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setAdults(adults + 1)}
                        >
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>

                      <Label className="mt-3 text-sm font-medium">
                        Crianças
                      </Label>
                      <div className="mt-2 flex items-center justify-between py-3">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setChildren(Math.max(0, children - 1))}
                          disabled={children <= 0}
                        >
                          <Minus className="h-4 w-4" />
                        </Button>
                        <span className="mx-4 text-lg font-semibold">
                          {children}
                        </span>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setChildren(children + 1)}
                        >
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    {/* Aviso só aparece quando exceder o limite recomendado */}
                    {adults + children > property.maxGuests && (
                      <p className="mt-2 text-xs text-gray-500">
                        O recomendado pelo anfitrião é no máx.{" "}
                        {property.maxGuests} hóspedes.
                      </p>
                    )}

                    <div className="border-t pt-1"></div>

                    {/* Seleção de Apartamentos Mobile */}
                    {property.apartments && property.apartments.length > 0 && (
                      <>
                        <Label className="mt-3 text-sm font-medium">
                          Selecionar Apartamento
                        </Label>

                        <div className="scrollbar-thin scrollbar-track-gray-100 scrollbar-thumb-gray-100 hover:scrollbar-thumb-gray-100 flex gap-3 overflow-x-auto pb-2">
                          {property.apartments.map(
                            (
                              apartment: PropertyApartment,
                              apartmentIndex: number,
                            ) => (
                              <div
                                key={apartmentIndex}
                                className={`flex flex-shrink-0 cursor-pointer flex-col items-center duration-200 ${
                                  selectedApartment === apartmentIndex
                                    ? "opacity-100"
                                    : "opacity-70 hover:opacity-100"
                                }`}
                                onClick={() =>
                                  setSelectedApartment(apartmentIndex)
                                }
                              >
                                <div
                                  className={`flex h-auto w-auto flex-col space-y-3 rounded-lg border-2 px-2 py-3 shadow-md ${
                                    selectedApartment === apartmentIndex
                                      ? "border-gray-500 bg-gray-50"
                                      : "border-gray-200"
                                  }`}
                                >
                                  {/* Quartos */}
                                  {apartment.rooms?.map(
                                    (
                                      room: ApartmentRoom,
                                      roomIndex: number,
                                    ) => (
                                      <div key={roomIndex}>
                                        <div className="mb-1 text-xs font-bold text-gray-800">
                                          {room.name ||
                                            `Quarto ${roomIndex + 1}`}
                                          :
                                        </div>
                                        {(room.doubleBeds || 0) > 0 && (
                                          <div className="mb-1 flex items-center gap-1">
                                            {Array.from({
                                              length: room.doubleBeds || 0,
                                            }).map((_, index) => (
                                              <BedDouble
                                                key={index}
                                                className="h-4 w-4 text-gray-500"
                                              />
                                            ))}
                                            <p className="ml-1 text-xs text-gray-500">
                                              {room.doubleBeds} cama(s) casal
                                            </p>
                                          </div>
                                        )}
                                        {(room.largeBeds || 0) > 0 && (
                                          <div className="mb-1 flex items-center gap-1">
                                            {Array.from({
                                              length: room.largeBeds || 0,
                                            }).map((_, index) => (
                                              <BedDouble
                                                key={index}
                                                className="h-4 w-4 text-gray-500"
                                              />
                                            ))}
                                            <p className="ml-1 text-xs text-gray-500">
                                              {room.largeBeds} cama(s) casal
                                              grande
                                            </p>
                                          </div>
                                        )}
                                        {(room.extraLargeBeds || 0) > 0 && (
                                          <div className="mb-1 flex items-center gap-1">
                                            {Array.from({
                                              length: room.extraLargeBeds || 0,
                                            }).map((_, index) => (
                                              <BedDouble
                                                key={index}
                                                className="h-4 w-4 text-gray-500"
                                              />
                                            ))}
                                            <p className="ml-1 text-xs text-gray-500">
                                              {room.extraLargeBeds} cama(s)
                                              casal extra-grande
                                            </p>
                                          </div>
                                        )}
                                        {(room.singleBeds || 0) > 0 && (
                                          <div className="mb-1 flex items-center gap-1">
                                            {Array.from({
                                              length: room.singleBeds || 0,
                                            }).map((_, index) => (
                                              <Bed
                                                key={index}
                                                className="h-4 w-4 text-gray-500"
                                              />
                                            ))}
                                            <p className="ml-1 text-xs text-gray-500">
                                              {room.singleBeds} cama(s) solteiro
                                            </p>
                                          </div>
                                        )}
                                        {(room.sofaBeds || 0) > 0 && (
                                          <div className="mb-1 flex items-center gap-1">
                                            {Array.from({
                                              length: room.sofaBeds || 0,
                                            }).map((_, index) => (
                                              <Sofa
                                                key={index}
                                                className="h-4 w-4 text-gray-500"
                                              />
                                            ))}
                                            <p className="ml-1 text-xs text-gray-500">
                                              {room.sofaBeds} sofá-cama(s)
                                            </p>
                                          </div>
                                        )}
                                      </div>
                                    ),
                                  )}

                                  {/* Outras informações */}
                                  {apartment.hasLivingRoom &&
                                    !apartment.livingRoomHasSofaBed && (
                                      <div className="flex items-center gap-2">
                                        <p className="text-xs font-bold text-gray-800">
                                          Sala de estar:
                                        </p>
                                        <Sofa className="h-4 w-4 text-gray-500" />
                                        <p className="text-xs text-gray-500">
                                          Disponível
                                        </p>
                                      </div>
                                    )}

                                  {apartment.livingRoomHasSofaBed && (
                                    <div className="flex items-center gap-2">
                                      <p className="text-xs font-bold text-gray-800">
                                        Sala de estar:
                                      </p>
                                      <Sofa className="h-4 w-4 text-gray-500" />
                                      <p className="text-xs text-gray-500">
                                        Com sofá-cama
                                      </p>
                                    </div>
                                  )}

                                  {(apartment.totalBathrooms || 0) > 0 && (
                                    <div className="flex items-center gap-1">
                                      <p className="text-xs font-bold text-gray-800">
                                        Banheiros:
                                      </p>
                                      {Array.from({
                                        length: apartment.totalBathrooms || 0,
                                      }).map((_, index) => (
                                        <Bath
                                          key={index}
                                          className="h-4 w-4 text-gray-500"
                                        />
                                      ))}
                                      <p className="ml-1 text-xs text-gray-500">
                                        {apartment.totalBathrooms} banheiro(s)
                                      </p>
                                    </div>
                                  )}

                                  {apartment.hasCrib && (
                                    <div className="flex items-center gap-2">
                                      <p className="text-xs font-bold text-gray-800">
                                        Berço:
                                      </p>
                                      <Baby className="h-4 w-4 text-gray-500" />
                                      <p className="text-xs text-gray-500">
                                        Disponível
                                      </p>
                                    </div>
                                  )}

                                  {apartment.hasKitchen && (
                                    <div className="flex items-center gap-2">
                                      <p className="text-xs font-bold text-gray-800">
                                        Cozinha:
                                      </p>
                                      <p className="text-xs text-gray-500">
                                        {apartment.kitchenHasStove ||
                                        apartment.kitchenHasFridge ||
                                        apartment.kitchenHasMinibar
                                          ? `Disponível (${[
                                              apartment.kitchenHasStove &&
                                                "fogão",
                                              apartment.kitchenHasFridge &&
                                                "geladeira",
                                              apartment.kitchenHasMinibar &&
                                                "frigobar",
                                            ]
                                              .filter(Boolean)
                                              .join(", ")})`
                                          : "Disponível"}
                                      </p>
                                    </div>
                                  )}

                                  {apartment.hasBalcony && (
                                    <div className="flex items-center gap-2">
                                      <p className="text-xs font-bold text-gray-800">
                                        Varanda:
                                      </p>
                                      <p className="text-xs text-gray-500">
                                        {apartment.balconyHasSeaView
                                          ? "Com vista para o mar"
                                          : "Disponível"}
                                      </p>
                                    </div>
                                  )}

                                  {/* Capacidade de Hóspedes */}
                                  {(apartment.maxAdults ||
                                    apartment.maxChildren) && (
                                    <div className="flex items-center gap-1">

                                      <div className="flex items-center gap-1">
                                        {/* Adultos */}
                                        {Array.from({ 
                                          length: apartment.maxAdults || 0,
                                        }).map((_, index) => (
                                          <User
                                            key={`adult-${index}`}
                                            className="h-4 w-4 text-gray-600"
                                          />
                                        ))}
                                        {/* Crianças */}
                                        {Array.from({
                                          length: apartment.maxChildren || 0,
                                        }).map((_, index) => (
                                          <User
                                            key={`child-${index}`}
                                            className="h-3.5 w-3.5 text-gray-600"
                                          />
                                        ))}
                                        <p className="ml-1 text-xs text-gray-500">
                                          {apartment.maxAdults || 0} adulto
                                          {(apartment.maxAdults || 0) !== 1
                                            ? "s"
                                            : ""}
                                          {(apartment.maxChildren || 0) > 0
                                            ? `, ${apartment.maxChildren} criança${(apartment.maxChildren || 0) !== 1 ? "s" : ""}`
                                            : ""}
                                        </p>
                                      </div>
                                    </div>
                                  )}
                                </div>
                                <p className="my-2 w-35 text-center text-xs font-medium text-gray-800">
                                  {apartment.name ||
                                    `Apartamento ${apartmentIndex + 1}`}
                                </p>
                              </div>
                            ),
                          )}
                        </div>
                      </>
                    )}
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
                      <div className="flex items-center justify-between"></div>
                    </div>
                  </div>

                  {/* Botão Reservar */}
                  <Button
                    className="w-full bg-green-500 py-7 text-lg text-white shadow-md duration-200 hover:bg-green-600 active:scale-95"
                    onClick={() => {
                      if (!checkIn || !checkOut) {
                        toast.error(
                          "Por favor, preencha as datas de saída e entrada antes de reservar.",
                        );
                        return;
                      }

                      if (
                        property.apartments &&
                        property.apartments.length > 0 &&
                        selectedApartment === null
                      ) {
                        toast.error(
                          "Por favor, selecione um apartamento antes de reservar.",
                        );
                        return;
                      }

                      const generateApartmentDetails = () => {
                        if (
                          selectedApartment === null ||
                          !property.apartments ||
                          !property.apartments[selectedApartment]
                        ) {
                          return "";
                        }

                        const apartment =
                          property.apartments[selectedApartment];
                        let apartmentDetails = `\n🏠 *Apartamento: ${apartment.name || `Apartamento ${selectedApartment + 1}`}*`;

                        // Quartos
                        if (apartment.rooms && apartment.rooms.length > 0) {
                          apartmentDetails += "\n\n🛏️ *Quartos:*";
                          apartment.rooms.forEach(
                            (room: ApartmentRoom, index: number) => {
                              const roomName =
                                room.name || `Quarto ${index + 1}`;
                              apartmentDetails += `\n• ${roomName}:`;

                              if (room.doubleBeds && room.doubleBeds > 0) {
                                apartmentDetails += ` ${room.doubleBeds} cama(s) casal`;
                              }
                              if (room.largeBeds && room.largeBeds > 0) {
                                apartmentDetails += `${room.doubleBeds ? ", " : " "}${room.largeBeds} cama(s) casal grande`;
                              }
                              if (
                                room.extraLargeBeds &&
                                room.extraLargeBeds > 0
                              ) {
                                apartmentDetails += `${room.doubleBeds || room.largeBeds ? ", " : " "}${room.extraLargeBeds} cama(s) casal extra-grande`;
                              }
                              if (room.singleBeds && room.singleBeds > 0) {
                                apartmentDetails += `${room.doubleBeds || room.largeBeds || room.extraLargeBeds ? ", " : " "}${room.singleBeds} cama(s) solteiro`;
                              }
                              if (room.sofaBeds && room.sofaBeds > 0) {
                                apartmentDetails += `${room.doubleBeds || room.largeBeds || room.extraLargeBeds || room.singleBeds ? ", " : " "}${room.sofaBeds} sofá-cama(s)`;
                              }
                            },
                          );
                        }

                        // Sala de estar
                        if (
                          apartment.hasLivingRoom &&
                          !apartment.livingRoomHasSofaBed
                        ) {
                          apartmentDetails +=
                            "\n🛋️ *Sala de estar:* Disponível";
                        }
                        if (apartment.livingRoomHasSofaBed) {
                          apartmentDetails +=
                            "\n🛋️ *Sala de estar:* Com sofá-cama";
                        }

                        // Banheiros
                        if (
                          apartment.totalBathrooms &&
                          apartment.totalBathrooms > 0
                        ) {
                          apartmentDetails += `\n🚿 *Banheiros:* ${apartment.totalBathrooms} banheiro(s)`;
                        }

                        // Cozinha
                        if (apartment.hasKitchen) {
                          apartmentDetails += "\n🍳 *Cozinha:* Disponível";
                          if (apartment.kitchenHasStove)
                            apartmentDetails += " (com fogão)";
                          if (apartment.kitchenHasFridge)
                            apartmentDetails += " (com geladeira)";
                          if (apartment.kitchenHasMinibar)
                            apartmentDetails += " (com frigobar)";
                        }

                        // Varanda
                        if (apartment.hasBalcony) {
                          apartmentDetails += "\n🌅 *Varanda:* Disponível";
                          if (apartment.balconyHasSeaView)
                            apartmentDetails += " (com vista para o mar)";
                        }

                        // Berço
                        if (apartment.hasCrib) {
                          apartmentDetails += "\n👶 *Berço:* Disponível";
                        }

                        return apartmentDetails;
                      };

                      const selectedApartmentInfo = generateApartmentDetails();

                      const whatsappUrl = `https://api.whatsapp.com/send/?phone=5585992718222&text=${encodeURIComponent(`🏠 *RESERVA DE IMÓVEL* 🏠\n\nOlá! Gostaria de fazer uma reserva para o imóvel:\n\n📝 *${property.title}*\n📍 ${location}\n💰 Valor: ${nightlyRate > 0 ? `R$ ${nightlyRate}/noite` : "A combinar"}${selectedApartmentInfo}\n\n👥 Hóspedes: ${adults} adultos, ${children} crianças\n🚪 Cômodos: ${rooms}\n📅 Check-in: ${checkIn}\n📅 Check-out: ${checkOut}\n\nPor favor, me ajude a finalizar esta reserva! 😊`)}&type=phone_number&app_absent=0`;
                      window.open(whatsappUrl, "_blank");
                    }}
                  >
                    Reservar Agora
                  </Button>

                  <p className="mt-2 text-center text-sm text-gray-500">
                    Você não será cobrado agora
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* O que tem no imóvel */}
            <Card>
              <CardHeader>
                <CardTitle className="text-xl text-gray-900">
                  Comodidades de {property.title}
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
                      className="mt-2.5 h-auto p-0"
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
            <Card className="mt-8">
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
          </div>

          {/* Coluna Direita - Sidebar */}
          <div className="space-y-6.5">
            {/* Personalizar Moradia */}
            <Card className="sticky top-4 hidden md:block">
              <CardHeader className="flex justify-between">
                <CardTitle className="mb-3 text-lg text-gray-900">
                  Personalize sua estadia
                </CardTitle>
                <div>
                  <Tooltip>
                    <TooltipTrigger>
                      <CircleQuestionMark className="h-5 w-5 text-gray-900" />
                    </TooltipTrigger>
                    {/* Prevent any internal scrollbar: make overflow visible and remove max-height constraints */}
                    <TooltipContent className="max-h-none overflow-visible border border-gray-300/50 bg-white">
                      <p className="py-3 text-sm leading-relaxed text-gray-900">
                        Cada imóvel tem políticas diferentes, leia em <br />
                        &apos;Regras da casa&apos; para mais informações.
                      </p>
                    </TooltipContent>
                  </Tooltip>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Datas */}
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <Label htmlFor="checkin" className="text-sm font-medium">
                      Data de Entrada
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
                      Data de Saída
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

                {/* Capacidade: Adultos / Crianças / Cômodos */}
                <div className="space-y-3">
                  <div className="">
                    <Label className="text-sm font-medium">Adultos</Label>
                    <div className="mt-2 flex items-center justify-between">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setAdults(Math.max(1, adults - 1))}
                        disabled={adults <= 1}
                      >
                        <Minus className="h-4 w-4" />
                      </Button>
                      <span className="mx-4 text-lg font-semibold">
                        {adults}
                      </span>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setAdults(adults + 1)}
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>

                    <Label className="mt-3 text-sm font-medium">Crianças</Label>
                    <div className="mt-2 flex items-center justify-between py-3">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setChildren(Math.max(0, children - 1))}
                        disabled={children <= 0}
                      >
                        <Minus className="h-4 w-4" />
                      </Button>
                      <span className="mx-4 text-lg font-semibold">
                        {children}
                      </span>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setChildren(children + 1)}
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  {/* Aviso só aparece quando exceder o limite recomendado */}
                  {adults + children > property.maxGuests && (
                    <p className="mt-2 text-xs text-gray-500">
                      O recomendado pelo anfitrião é no máx.{" "}
                      {property.maxGuests} hóspedes.
                    </p>
                  )}

                  <div className="border-t pt-1"></div>

                  {/* Seleção de Apartamentos Mobile */}
                  {property.apartments && property.apartments.length > 0 && (
                    <>
                      <Label className="mt-3 text-sm font-medium">
                        Selecionar Apartamento
                      </Label>

                      <div className="scrollbar-thin scrollbar-track-gray-100 scrollbar-thumb-gray-100 hover:scrollbar-thumb-gray-100 flex gap-3 overflow-x-auto pb-2">
                        {property.apartments.map(
                          (
                            apartment: PropertyApartment,
                            apartmentIndex: number,
                          ) => (
                            <div
                              key={apartmentIndex}
                              className={`flex flex-shrink-0 cursor-pointer flex-col items-center duration-200 ${
                                selectedApartment === apartmentIndex
                                  ? "opacity-100"
                                  : "opacity-70 hover:opacity-100"
                              }`}
                              onClick={() =>
                                setSelectedApartment(apartmentIndex)
                              }
                            >
                              <div
                                className={`flex h-auto w-auto flex-col space-y-3 rounded-lg border-2 px-2 py-3 shadow-md ${
                                  selectedApartment === apartmentIndex
                                    ? "border-gray-500 bg-gray-50"
                                    : "border-gray-200"
                                }`}
                              >
                                {/* Quartos */}
                                {apartment.rooms?.map(
                                  (room: ApartmentRoom, roomIndex: number) => (
                                    <div key={roomIndex}>
                                      <div className="mb-1 text-xs font-bold text-gray-800">
                                        {room.name || `Quarto ${roomIndex + 1}`}
                                        :
                                      </div>
                                      {(room.doubleBeds || 0) > 0 && (
                                        <div className="mb-1 flex items-center gap-1">
                                          {Array.from({
                                            length: room.doubleBeds || 0,
                                          }).map((_, index) => (
                                            <BedDouble
                                              key={index}
                                              className="h-4 w-4 text-gray-500"
                                            />
                                          ))}
                                          <p className="ml-1 text-xs text-gray-500">
                                            {room.doubleBeds} cama(s) casal
                                          </p>
                                        </div>
                                      )}
                                      {(room.largeBeds || 0) > 0 && (
                                        <div className="mb-1 flex items-center gap-1">
                                          {Array.from({
                                            length: room.largeBeds || 0,
                                          }).map((_, index) => (
                                            <BedDouble
                                              key={index}
                                              className="h-4 w-4 text-gray-500"
                                            />
                                          ))}
                                          <p className="ml-1 text-xs text-gray-500">
                                            {room.largeBeds} cama(s) casal
                                            grande
                                          </p>
                                        </div>
                                      )}
                                      {(room.extraLargeBeds || 0) > 0 && (
                                        <div className="mb-1 flex items-center gap-1">
                                          {Array.from({
                                            length: room.extraLargeBeds || 0,
                                          }).map((_, index) => (
                                            <BedDouble
                                              key={index}
                                              className="h-4 w-4 text-gray-500"
                                            />
                                          ))}
                                          <p className="ml-1 text-xs text-gray-500">
                                            {room.extraLargeBeds} cama(s) casal
                                            extra-grande
                                          </p>
                                        </div>
                                      )}
                                      {(room.singleBeds || 0) > 0 && (
                                        <div className="mb-1 flex items-center gap-1">
                                          {Array.from({
                                            length: room.singleBeds || 0,
                                          }).map((_, index) => (
                                            <Bed
                                              key={index}
                                              className="h-4 w-4 text-gray-500"
                                            />
                                          ))}
                                          <p className="ml-1 text-xs text-gray-500">
                                            {room.singleBeds} cama(s) solteiro
                                          </p>
                                        </div>
                                      )}
                                      {(room.sofaBeds || 0) > 0 && (
                                        <div className="mb-1 flex items-center gap-1">
                                          {Array.from({
                                            length: room.sofaBeds || 0,
                                          }).map((_, index) => (
                                            <Sofa
                                              key={index}
                                              className="h-4 w-4 text-gray-500"
                                            />
                                          ))}
                                          <p className="ml-1 text-xs text-gray-500">
                                            {room.sofaBeds} sofá-cama(s)
                                          </p>
                                        </div>
                                      )}
                                    </div>
                                  ),
                                )}

                                {/* Outras informações */}
                                {apartment.hasLivingRoom &&
                                  !apartment.livingRoomHasSofaBed && (
                                    <div className="flex items-center gap-2">
                                      <p className="text-xs font-bold text-gray-800">
                                        Sala de estar:
                                      </p>
                                      <Sofa className="h-4 w-4 text-gray-500" />
                                      <p className="text-xs text-gray-500">
                                        Disponível
                                      </p>
                                    </div>
                                  )}

                                {apartment.livingRoomHasSofaBed && (
                                  <div className="flex items-center gap-2">
                                    <p className="text-xs font-bold text-gray-800">
                                      Sala de estar:
                                    </p>
                                    <Sofa className="h-4 w-4 text-gray-500" />
                                    <p className="text-xs text-gray-500">
                                      Com sofá-cama
                                    </p>
                                  </div>
                                )}

                                {(apartment.totalBathrooms || 0) > 0 && (
                                  <div className="flex items-center gap-1">
                                    <p className="text-xs font-bold text-gray-800">
                                      Banheiros:
                                    </p>
                                    {Array.from({
                                      length: apartment.totalBathrooms || 0,
                                    }).map((_, index) => (
                                      <Bath
                                        key={index}
                                        className="h-4 w-4 text-gray-500"
                                      />
                                    ))}
                                    <p className="ml-1 text-xs text-gray-500">
                                      {apartment.totalBathrooms} banheiro(s)
                                    </p>
                                  </div>
                                )}

                                {apartment.hasCrib && (
                                  <div className="flex items-center gap-2">
                                    <p className="text-xs font-bold text-gray-800">
                                      Berço:
                                    </p>
                                    <Baby className="h-4 w-4 text-gray-500" />
                                    <p className="text-xs text-gray-500">
                                      Disponível
                                    </p>
                                  </div>
                                )}

                                {apartment.hasKitchen && (
                                  <div className="flex items-center gap-2">
                                    <p className="text-xs font-bold text-gray-800">
                                      Cozinha:
                                    </p>
                                    <p className="text-xs text-gray-500">
                                      {apartment.kitchenHasStove ||
                                      apartment.kitchenHasFridge ||
                                      apartment.kitchenHasMinibar
                                        ? `Disponível (${[
                                            apartment.kitchenHasStove &&
                                              "fogão",
                                            apartment.kitchenHasFridge &&
                                              "geladeira",
                                            apartment.kitchenHasMinibar &&
                                              "frigobar",
                                          ]
                                            .filter(Boolean)
                                            .join(", ")})`
                                        : "Disponível"}
                                    </p>
                                  </div>
                                )}

                                {apartment.hasBalcony && (
                                  <div className="flex items-center gap-2">
                                    <p className="text-xs font-bold text-gray-800">
                                      Varanda:
                                    </p>
                                    <p className="text-xs text-gray-500">
                                      {apartment.balconyHasSeaView
                                        ? "Com vista para o mar"
                                        : "Disponível"}
                                    </p>
                                  </div>
                                )}
                              </div>
                              <p className="my-2 w-35 text-center text-xs font-medium text-gray-800">
                                {apartment.name ||
                                  `Apartamento ${apartmentIndex + 1}`}
                              </p>
                            </div>
                          ),
                        )}
                      </div>
                    </>
                  )}
                </div>

                {/* Valores */}
                <div className="space-y-3 border-t pt-4">
                  <div className="flex justify-between">
                    <span>Aluguel</span>
                    <span>A combinar</span>
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

                  <div className="border-t pt-3"></div>
                </div>

                {/* Botão Reservar: mantém aparência original, mas valida antes de abrir o WhatsApp */}
                <Button
                  className="w-full bg-green-500 py-7 text-lg text-white shadow-md duration-200 hover:scale-[1.02] hover:bg-green-600 active:scale-95"
                  onClick={() => {
                    if (!checkIn || !checkOut) {
                      toast.error(
                        "Por favor, preencha as datas de saída e entrada antes de reservar.",
                      );
                      return;
                    }

                    if (
                      property.apartments &&
                      property.apartments.length > 0 &&
                      selectedApartment === null
                    ) {
                      toast.error(
                        "Por favor, selecione um apartamento antes de reservar.",
                      );
                      return;
                    }

                    const generateApartmentDetails = () => {
                      if (
                        selectedApartment === null ||
                        !property.apartments ||
                        !property.apartments[selectedApartment]
                      ) {
                        return "";
                      }

                      const apartment = property.apartments[selectedApartment];
                      let apartmentDetails = `\n🏠 *Apartamento: ${apartment.name || `Apartamento ${selectedApartment + 1}`}*`;

                      // Quartos
                      if (apartment.rooms && apartment.rooms.length > 0) {
                        apartmentDetails += "\n\n🛏️ *Quartos:*";
                        apartment.rooms.forEach(
                          (room: ApartmentRoom, index: number) => {
                            const roomName = room.name || `Quarto ${index + 1}`;
                            apartmentDetails += `\n• ${roomName}:`;

                            if (room.doubleBeds && room.doubleBeds > 0) {
                              apartmentDetails += ` ${room.doubleBeds} cama(s) casal`;
                            }
                            if (room.largeBeds && room.largeBeds > 0) {
                              apartmentDetails += `${room.doubleBeds ? ", " : " "}${room.largeBeds} cama(s) casal grande`;
                            }
                            if (
                              room.extraLargeBeds &&
                              room.extraLargeBeds > 0
                            ) {
                              apartmentDetails += `${room.doubleBeds || room.largeBeds ? ", " : " "}${room.extraLargeBeds} cama(s) casal extra-grande`;
                            }
                            if (room.singleBeds && room.singleBeds > 0) {
                              apartmentDetails += `${room.doubleBeds || room.largeBeds || room.extraLargeBeds ? ", " : " "}${room.singleBeds} cama(s) solteiro`;
                            }
                            if (room.sofaBeds && room.sofaBeds > 0) {
                              apartmentDetails += `${room.doubleBeds || room.largeBeds || room.extraLargeBeds || room.singleBeds ? ", " : " "}${room.sofaBeds} sofá-cama(s)`;
                            }
                          },
                        );
                      }

                      // Sala de estar
                      if (
                        apartment.hasLivingRoom &&
                        !apartment.livingRoomHasSofaBed
                      ) {
                        apartmentDetails += "\n🛋️ *Sala de estar:* Disponível";
                      }
                      if (apartment.livingRoomHasSofaBed) {
                        apartmentDetails +=
                          "\n🛋️ *Sala de estar:* Com sofá-cama";
                      }

                      // Banheiros
                      if (
                        apartment.totalBathrooms &&
                        apartment.totalBathrooms > 0
                      ) {
                        apartmentDetails += `\n🚿 *Banheiros:* ${apartment.totalBathrooms} banheiro(s)`;
                      }

                      // Cozinha
                      if (apartment.hasKitchen) {
                        apartmentDetails += "\n🍳 *Cozinha:* Disponível";
                        if (apartment.kitchenHasStove)
                          apartmentDetails += " (com fogão)";
                        if (apartment.kitchenHasFridge)
                          apartmentDetails += " (com geladeira)";
                        if (apartment.kitchenHasMinibar)
                          apartmentDetails += " (com frigobar)";
                      }

                      // Varanda
                      if (apartment.hasBalcony) {
                        apartmentDetails += "\n🌅 *Varanda:* Disponível";
                        if (apartment.balconyHasSeaView)
                          apartmentDetails += " (com vista para o mar)";
                      }

                      // Berço
                      if (apartment.hasCrib) {
                        apartmentDetails += "\n👶 *Berço:* Disponível";
                      }

                      return apartmentDetails;
                    };

                    const selectedApartmentInfo = generateApartmentDetails();

                    const whatsappUrl = `https://api.whatsapp.com/send/?phone=5585992718222&text=${encodeURIComponent(`🏠 *RESERVA DE IMÓVEL* \n\nOlá! Gostaria de fazer uma reserva para o imóvel:\n\n📝 *${property.title}*\n📍 ${location}\n💰 Valor: ${nightlyRate > 0 ? `R$ ${nightlyRate}/noite` : "A combinar"}${selectedApartmentInfo}\n\n👥 Hóspedes: ${adults} adultos, ${children} crianças\n🚪 Cômodos: ${rooms}\n📅 Check-in: ${checkIn}\n📅 Check-out: ${checkOut}\n\nPor favor, me ajude a finalizar esta reserva! 😊`)}&type=phone_number&app_absent=0`;
                    window.open(whatsappUrl, "_blank");
                  }}
                >
                  Reservar Agora
                </Button>

                <p className="mt-2 text-center text-sm text-gray-500">
                  Você não será cobrado agora
                </p>
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
                    <Button className="gap-2 bg-gray-800 py-4 text-white shadow-md duration-300 hover:scale-[1.02] hover:bg-gray-900">
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
                        className={`rounded-md p-2 shadow-md duration-700 hover:scale-115 ${service.included ? "bg-gray-200" : "bg-gray-100/70 hover:scale-100"}`}
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
            {/* Grid de Informações */}
            <div className="grid cursor-default grid-cols-2 gap-4">
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
                  <Car className="h-5 w-5 text-gray-600" />
                  <div>
                    <div className="text-sm text-gray-600">Vagas</div>
                    <div className="font-semibold">
                      {property.parkingSpaces}
                    </div>
                  </div>
                </div>
              </Card>
            </div>
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

        {/* Sobre o Prédio */}
        {property.aboutBuilding && (
          <Card className="mt-8">
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

        {/* Proximidades da região */}
        {((property.nearbyPlaces && property.nearbyPlaces.length > 0) ||
          (property.nearbyBeaches && property.nearbyBeaches.length > 0) ||
          (property.nearbyAirports && property.nearbyAirports.length > 0) ||
          (property.nearbyRestaurants &&
            property.nearbyRestaurants.length > 0)) && (
          <Card className="mt-8">
            <CardHeader>
              <CardTitle className="text-2xl text-gray-900">
                Proximidades da região
              </CardTitle>
              <p className="text-gray-600">
                Os hóspedes adoraram caminhar pelo bairro! Visite os principais
                locais próximos do imóvel.
              </p>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                {/* O que há por perto? */}
                {property.nearbyPlaces && property.nearbyPlaces.length > 0 && (
                  <div className="space-y-3 md:mr-3">
                    <div className="flex items-center gap-2">
                      <MapPin className="h-5 w-5 text-gray-600" />
                      <h3 className="font-semibold text-gray-900">
                        O que há por perto?
                      </h3>
                    </div>
                    <div className="space-y-2 text-sm">
                      {property.nearbyPlaces.map(
                        (place: NearbyItem, index: number) => (
                          <div
                            key={index}
                            className="flex items-center justify-between"
                          >
                            <span className="text-gray-700">{place.name}</span>
                            <span className="text-gray-700/30">-----</span>
                            <span className="text-gray-600">
                              {place.distance}
                            </span>
                          </div>
                        ),
                      )}
                    </div>
                    <div className="mt-6 border-t"></div>
                  </div>
                )}

                {/* Praias na vizinhança */}
                {property.nearbyBeaches &&
                  property.nearbyBeaches.length > 0 && (
                    <div className="space-y-3 md:ml-6">
                      <div className="flex items-center gap-2">
                        <Palmtree className="h-5 w-5 text-gray-600" />
                        <h3 className="font-semibold text-gray-900">
                          Praias na vizinhança
                        </h3>
                      </div>
                      <div className="space-y-2 text-sm">
                        {property.nearbyBeaches.map(
                          (beach: NearbyItem, index: number) => (
                            <div
                              key={index}
                              className="flex items-center justify-between"
                            >
                              <span className="text-gray-700">
                                {beach.name}
                              </span>
                              <span className="text-gray-700/30">-----</span>
                              <span className="text-gray-600">
                                {beach.distance}
                              </span>
                            </div>
                          ),
                        )}
                      </div>
                      <div className="mt-6 border-t"></div>
                    </div>
                  )}

                {/* Aeroportos mais próximos */}
                {property.nearbyAirports &&
                  property.nearbyAirports.length > 0 && (
                    <div className="space-y-3 md:mr-3">
                      <div className="flex items-center gap-2">
                        <Plane className="h-5 w-5 text-gray-600" />
                        <h3 className="font-semibold text-gray-900">
                          Aeroportos mais próximos
                        </h3>
                      </div>
                      <div className="space-y-2 text-sm">
                        {property.nearbyAirports.map(
                          (airport: NearbyItem, index: number) => (
                            <div
                              key={index}
                              className="flex items-center justify-between"
                            >
                              <span className="text-gray-700">
                                {airport.name}
                              </span>
                              <span className="text-gray-700/30">-----</span>
                              <span className="text-gray-600">
                                {airport.distance}
                              </span>
                            </div>
                          ),
                        )}
                      </div>
                      <div className="mt-6 border-t md:hidden"></div>
                    </div>
                  )}

                {/* Restaurantes e cafés */}
                {property.nearbyRestaurants &&
                  property.nearbyRestaurants.length > 0 && (
                    <div className="space-y-3 md:ml-6">
                      <div className="flex items-center gap-2">
                        <Utensils className="h-5 w-5 text-gray-600" />
                        <h3 className="font-semibold text-gray-900">
                          Restaurantes e cafés
                        </h3>
                      </div>
                      <div className="space-y-2 text-sm">
                        {property.nearbyRestaurants.map(
                          (restaurant: NearbyItem, index: number) => (
                            <div
                              key={index}
                              className="flex items-center justify-between"
                            >
                              <span className="text-gray-700">
                                {restaurant.name}
                              </span>
                              <span className="text-gray-700/30">-----</span>
                              <span className="text-gray-600">
                                {restaurant.distance}
                              </span>
                            </div>
                          ),
                        )}
                      </div>
                    </div>
                  )}
              </div>

              {/* Nota informativa */}
              <div className="mt-6 rounded-lg bg-gray-50 p-4">
                <p className="text-sm text-gray-600">
                  É exibida uma estimativa das distâncias mais curtas de
                  caminhada ou de carro. As distâncias reais podem variar.
                </p>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Regras da Casa */}
        {(property.houseRules &&
          (property.houseRules.checkInRule ||
            property.houseRules.checkOutRule ||
            property.houseRules.cancellationRule ||
            property.houseRules.childrenRule ||
            property.houseRules.bedsRule ||
            property.houseRules.ageRestrictionRule ||
            property.houseRules.groupsRule ||
            property.houseRules.petsRule ||
            property.houseRules.partyRule ||
            property.houseRules.restaurantRule ||
            property.houseRules.silenceRule)) ||
        (property.paymentMethods &&
          (property.paymentMethods.acceptsVisa ||
            property.paymentMethods.acceptsAmericanExpress ||
            property.paymentMethods.acceptsMasterCard ||
            property.paymentMethods.acceptsMaestro ||
            property.paymentMethods.acceptsElo ||
            property.paymentMethods.acceptsDinersClub ||
            property.paymentMethods.acceptsPix ||
            property.paymentMethods.acceptsCash)) ? (
          <Card className="mt-8">
            <CardHeader>
              <CardTitle className="text-xl text-gray-900">
                Regras da Casa
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {/* Entrada */}
                {property.houseRules?.checkInRule && (
                  <div className="flex flex-col gap-3 border-b border-gray-100 pb-6 md:flex-row md:gap-8">
                    <div className="flex items-start gap-3 md:w-1/3">
                      <div className="rounded-md bg-gray-200 p-2 shadow-md duration-700 hover:scale-115">
                        <DoorOpen className="h-4 w-4 text-gray-800" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900">Entrada</h4>
                      </div>
                    </div>
                    <div className="md:w-2/3">
                      <p className="text-sm leading-relaxed text-gray-600">
                        {property.houseRules.checkInRule}
                      </p>
                    </div>
                  </div>
                )}

                {/* Saída */}
                {property.houseRules?.checkOutRule && (
                  <div className="flex flex-col gap-3 border-b border-gray-100 pb-6 md:flex-row md:gap-8">
                    <div className="flex items-start gap-3 md:w-1/3">
                      <div className="rounded-md bg-gray-200 p-2 shadow-md duration-700 hover:scale-115">
                        <LogOut className="h-4 w-4 text-gray-800" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900">Saída</h4>
                      </div>
                    </div>
                    <div className="md:w-2/3">
                      <p className="text-sm leading-relaxed text-gray-600">
                        {property.houseRules.checkOutRule}
                      </p>
                    </div>
                  </div>
                )}

                {/* Cancelamento/pré-pagamento */}
                {property.houseRules?.cancellationRule && (
                  <div className="flex flex-col gap-3 border-b border-gray-100 pb-6 md:flex-row md:gap-8">
                    <div className="flex items-start gap-3 md:w-1/3">
                      <div className="rounded-md bg-gray-200 p-2 shadow-md duration-700 hover:scale-115">
                        <BanknoteX className="h-4 w-4 text-gray-800" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900">
                          Cancelamento/ pré-pagamento
                        </h4>
                      </div>
                    </div>
                    <div className="md:w-2/3">
                      <p className="text-sm leading-relaxed text-gray-600">
                        {property.houseRules.cancellationRule}
                      </p>
                    </div>
                  </div>
                )}

                {/* Crianças */}
                {property.houseRules?.childrenRule && (
                  <div className="flex flex-col gap-3 border-b border-gray-100 pb-6 md:flex-row md:gap-8">
                    <div className="flex items-start gap-3 md:w-1/3">
                      <div className="rounded-md bg-gray-200 p-2 shadow-md duration-700 hover:scale-115">
                        <Baby className="h-4 w-4 text-gray-800" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900">
                          Crianças
                        </h4>
                      </div>
                    </div>
                    <div className="md:w-2/3">
                      <p className="text-sm leading-relaxed text-gray-600">
                        {property.houseRules.childrenRule}
                      </p>
                    </div>
                  </div>
                )}

                {/* Pets */}
                {property.houseRules?.petsRule && (
                  <div className="flex flex-col gap-3 border-b border-gray-100 pb-6 md:flex-row md:gap-8">
                    <div className="flex items-start gap-3 md:w-1/3">
                      <div className="rounded-md bg-gray-200 p-2 shadow-md duration-700 hover:scale-115">
                        <Dog className="h-4 w-4 text-gray-800" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900">Pets</h4>
                      </div>
                    </div>
                    <div className="md:w-2/3">
                      <p className="text-sm leading-relaxed text-gray-600">
                        {property.houseRules.petsRule}
                      </p>
                    </div>
                  </div>
                )}

                {/* Camas */}
                {property.houseRules?.bedsRule && (
                  <div className="flex flex-col gap-3 border-b border-gray-100 pb-6 md:flex-row md:gap-8">
                    <div className="flex items-start gap-3 md:w-1/3">
                      <div className="rounded-md bg-gray-200 p-2 shadow-md duration-700 hover:scale-115">
                        <Bed className="h-4 w-4 text-gray-800" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900">
                          Camas e Berços
                        </h4>
                      </div>
                    </div>
                    <div className="md:w-2/3">
                      <p className="text-sm leading-relaxed text-gray-600">
                        {property.houseRules.bedsRule}
                      </p>
                    </div>
                  </div>
                )}

                {/* Restrições de idade */}
                {property.houseRules?.ageRestrictionRule && (
                  <div className="flex flex-col gap-3 border-b border-gray-100 pb-6 md:flex-row md:gap-8">
                    <div className="flex items-start gap-3 md:w-1/3">
                      <div className="rounded-md bg-gray-200 p-2 shadow-md duration-700 hover:scale-115">
                        <Album className="h-4 w-4 text-gray-800" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900">
                          Restrições de idade
                        </h4>
                      </div>
                    </div>
                    <div className="md:w-2/3">
                      <p className="text-sm leading-relaxed text-gray-600">
                        {property.houseRules.ageRestrictionRule}
                      </p>
                    </div>
                  </div>
                )}

                {/* Festas e Eventos */}
                {property.houseRules?.partyRule && (
                  <div className="flex flex-col gap-3 border-b border-gray-100 pb-6 md:flex-row md:gap-8">
                    <div className="flex items-start gap-3 md:w-1/3">
                      <div className="rounded-md bg-gray-200 p-2 shadow-md duration-700 hover:scale-115">
                        <PartyPopper className="h-4 w-4 text-gray-800" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900">
                          Festas e Eventos
                        </h4>
                      </div>
                    </div>
                    <div className="md:w-2/3">
                      <p className="text-sm leading-relaxed text-gray-600">
                        {property.houseRules.partyRule}
                      </p>
                    </div>
                  </div>
                )}

                {/* Restaurante */}
                {property.houseRules?.restaurantRule && (
                  <div className="flex flex-col gap-3 border-b border-gray-100 pb-6 md:flex-row md:gap-8">
                    <div className="flex items-start gap-3 md:w-1/3">
                      <div className="rounded-md bg-gray-200 p-2 shadow-md duration-700 hover:scale-115">
                        <Hamburger className="h-4 w-4 text-gray-800" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900">
                          Restaurante Local
                        </h4>
                      </div>
                    </div>
                    <div className="md:w-2/3">
                      <p className="text-sm leading-relaxed text-gray-600">
                        {property.houseRules.restaurantRule}
                      </p>
                    </div>
                  </div>
                )}

                {/* Grupos */}
                {property.houseRules?.groupsRule && (
                  <div className="flex flex-col gap-3 border-b border-gray-100 pb-6 md:flex-row md:gap-8">
                    <div className="flex items-start gap-3 md:w-1/3">
                      <div className="rounded-md bg-gray-200 p-2 shadow-md duration-700 hover:scale-115">
                        <Users className="h-4 w-4 text-gray-800" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900">Grupos</h4>
                      </div>
                    </div>
                    <div className="md:w-2/3">
                      <p className="text-sm leading-relaxed text-gray-600">
                        {property.houseRules.groupsRule}
                      </p>
                    </div>
                  </div>
                )}

                {/* Hora do Silêncio */}
                {property.houseRules?.silenceRule && (
                  <div className="flex flex-col gap-3 border-b border-gray-100 pb-6 md:flex-row md:gap-8">
                    <div className="flex items-start gap-3 md:w-1/3">
                      <div className="rounded-md bg-gray-200 p-2 shadow-md duration-700 hover:scale-115">
                        <Clock className="h-4 w-4 text-gray-800" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900">
                          Hora do Silêncio
                        </h4>
                      </div>
                    </div>
                    <div className="md:w-2/3">
                      <p className="text-sm leading-relaxed text-gray-600">
                        {property.houseRules.silenceRule}
                      </p>
                    </div>
                  </div>
                )}

                {/* Festas e Eventos */}
                {property.houseRules?.partyRule && (
                  <div className="flex flex-col gap-3 border-b border-gray-100 pb-6 md:flex-row md:gap-8">
                    <div className="flex items-start gap-3 md:w-1/3">
                      <div className="rounded-md bg-gray-200 p-2 shadow-md duration-700 hover:scale-115">
                        <PartyPopper className="h-4 w-4 text-gray-800" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900">
                          Festas e Eventos
                        </h4>
                      </div>
                    </div>
                    <div className="md:w-2/3">
                      <p className="text-sm leading-relaxed text-gray-600">
                        {property.houseRules.partyRule}
                      </p>
                    </div>
                  </div>
                )}

                {/* Restaurantes */}
                {property.houseRules?.restaurantRule && (
                  <div className="flex flex-col gap-3 border-b border-gray-100 pb-6 md:flex-row md:gap-8">
                    <div className="flex items-start gap-3 md:w-1/3">
                      <div className="rounded-md bg-gray-200 p-2 shadow-md duration-700 hover:scale-115">
                        <Utensils className="h-4 w-4 text-gray-800" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900">
                          Restaurantes
                        </h4>
                      </div>
                    </div>
                    <div className="md:w-2/3">
                      <p className="text-sm leading-relaxed text-gray-600">
                        {property.houseRules.restaurantRule}
                      </p>
                    </div>
                  </div>
                )}

                {/* Cartões aceitos - só exibe se houver algum método de pagamento aceito */}
                {property.paymentMethods &&
                  (property.paymentMethods.acceptsVisa ||
                    property.paymentMethods.acceptsAmericanExpress ||
                    property.paymentMethods.acceptsMasterCard ||
                    property.paymentMethods.acceptsMaestro ||
                    property.paymentMethods.acceptsElo ||
                    property.paymentMethods.acceptsDinersClub ||
                    property.paymentMethods.acceptsPix ||
                    property.paymentMethods.acceptsCash) && (
                    <div className="flex flex-col gap-3 md:flex-row md:gap-8">
                      <div className="flex items-start gap-3 md:w-1/3">
                        <div className="rounded-md bg-gray-200 p-2 shadow-md duration-700 hover:scale-115">
                          <CreditCard className="h-4 w-4 text-gray-800" />
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-900">
                            Cartões aceitos neste imóvel
                          </h4>
                        </div>
                      </div>
                      <div className="md:w-2/3">
                        <div className="mb-3 flex flex-wrap gap-2">
                          {property.paymentMethods.acceptsVisa && (
                            <div className="flex h-8 w-12 items-center justify-center rounded border bg-gray-100 shadow-md duration-300 hover:scale-[1.05]">
                              <Image
                                src="/cards/visa.png"
                                alt="Visa"
                                width={32}
                                height={20}
                              />
                            </div>
                          )}
                          {property.paymentMethods.acceptsAmericanExpress && (
                            <div className="flex h-8 w-12 items-center justify-center overflow-hidden rounded border bg-gray-100 shadow-md duration-300 hover:scale-[1.05]">
                              <Image
                                src="/cards/american.png"
                                alt="American Express"
                                width={48}
                                height={32}
                                className="object-cover"
                              />
                            </div>
                          )}
                          {property.paymentMethods.acceptsMasterCard && (
                            <div className="flex h-8 w-12 items-center justify-center overflow-hidden rounded border bg-gray-100 shadow-md duration-300 hover:scale-[1.05]">
                              <Image
                                src="/cards/master.png"
                                alt="Master Card"
                                width={55}
                                height={35}
                                className="object-cover"
                              />
                            </div>
                          )}
                          {property.paymentMethods.acceptsMaestro && (
                            <div className="flex h-8 w-12 items-center justify-center overflow-hidden rounded border bg-gray-100 shadow-md duration-300 hover:scale-[1.05]">
                              <Image
                                src="/cards/maestro.png"
                                alt="Maestro"
                                width={55}
                                height={35}
                                className="object-cover"
                              />
                            </div>
                          )}
                          {property.paymentMethods.acceptsElo && (
                            <div className="flex h-8 w-12 items-center justify-center rounded border bg-gray-100 shadow-md duration-300 hover:scale-[1.05]">
                              <Image
                                src="/cards/elo.png"
                                alt="Elo"
                                width={55}
                                height={35}
                                className="object-cover"
                              />
                            </div>
                          )}
                          {property.paymentMethods.acceptsDinersClub && (
                            <div className="flex h-8 w-12 items-center justify-center overflow-hidden rounded border bg-gray-100 shadow-md duration-300 hover:scale-[1.05]">
                              <Image
                                src="/cards/diners.webp"
                                alt="Diners Club"
                                width={55}
                                height={35}
                                className="object-cover"
                              />
                            </div>
                          )}
                          {property.paymentMethods.acceptsPix && (
                            <div className="flex h-8 w-12 items-center justify-center overflow-hidden rounded border bg-gray-50 p-1 shadow-md duration-300 hover:scale-[1.05]">
                              <Image
                                src="/cards/pix.svg"
                                alt="Pix"
                                width={55}
                                height={35}
                                className="object-cover"
                              />
                            </div>
                          )}
                          {!property.paymentMethods.acceptsCash && (
                            <div className="flex h-8 w-22 cursor-default items-center justify-center rounded border border-red-800 bg-red-600 px-2 text-xs text-white shadow-md duration-300 hover:scale-[1.05]">
                              Dinheiro não é aceito
                            </div>
                          )}
                          {property.paymentMethods.acceptsCash && (
                            <div className="flex h-8 w-16 cursor-default items-center justify-center rounded border border-green-800 bg-green-600 px-2 text-xs text-white shadow-md duration-300 hover:scale-[1.05]">
                              Dinheiro aceito
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  )}
              </div>
            </CardContent>
          </Card>
        ) : null}

        {/* Localização Detalhada */}
        <div className="mt-8 space-y-6">
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
