"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import {
  ArrowLeft,
  BedDouble,
  Building2,
  Camera,
  ChefHat,
  Eye,
  Loader,
  MapPin,
  Palmtree,
  Plus,
  ShowerHead,
  Sofa,
  Trash,
  Users,
  Utensils,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { use, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import * as z from "zod";

import { GoogleMapsInputTraditional } from "@/components/google-maps-input-traditional";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import {
  createProperty,
  getAmenities,
  type PropertyFormData,
} from "@/lib/property-actions";

const propertyFormSchema = z.object({
  // Dados básicos
  title: z.string().min(3, "Título deve ter pelo menos 3 caracteres"),
  shortDescription: z
    .string()
    .min(10, "Descrição deve ter pelo menos 10 caracteres"),
  fullDescription: z
    .string()
    .min(10, "Descrição completa deve ter pelo menos 10 caracteres"),
  aboutBuilding: z.string().optional(),
  maxGuests: z.number().min(1, "Deve aceitar pelo menos 1 hóspede"),
  bedrooms: z.number().min(0, "Número de quartos inválido"),
  bathrooms: z.number().min(1, "Deve ter pelo menos 1 banheiro"),
  parkingSpaces: z.number().min(0, "Número de vagas inválido").optional(),
  areaM2: z.number().optional(),
  allowsPets: z.boolean(),
  propertyStyle: z
    .array(z.string())
    .min(1, "Selecione pelo menos um tipo do imóvel"),
  propertyClasses: z
    .array(z.string())
    .min(1, "Selecione pelo menos uma classe"),
  minimumStay: z.number().min(1, "Estadia mínima deve ser pelo menos 1 noite"),
  maximumStay: z.number().min(1, "Duração máxima deve ser pelo menos 1 dia"),
  checkInTime: z.string().optional(),
  checkOutTime: z.string().optional(),

  // Preços
  monthlyRent: z.number().min(0, "Valor mensal inválido").optional().default(0),
  dailyRate: z
    .number()
    .min(0, "Valor da diária inválida")
    .optional()
    .default(0),
  condominiumFee: z.number().optional().default(0),
  iptuFee: z.number().optional().default(0),
  monthlyCleaningFee: z.number().optional().default(0),
  otherFees: z.number().optional().default(0),

  // Proximidades (arrays de objetos)
  nearbyPlaces: z
    .array(
      z.object({
        name: z.string(),
        distance: z.string(),
        walkingTime: z.string(),
      }),
    )
    .optional()
    .default([]),
  nearbyBeaches: z
    .array(
      z.object({
        name: z.string(),
        distance: z.string(),
        walkingTime: z.string(),
      }),
    )
    .optional()
    .default([]),
  nearbyAirports: z
    .array(
      z.object({
        name: z.string(),
        distance: z.string(),
        walkingTime: z.string(),
      }),
    )
    .optional()
    .default([]),
  nearbyRestaurants: z
    .array(
      z.object({
        name: z.string(),
        distance: z.string(),
        walkingTime: z.string(),
      }),
    )
    .optional()
    .default([]),

  // Serviços inclusos
  includesKitchenUtensils: z.boolean(),
  includesFurniture: z.boolean(),
  includesElectricity: z.boolean(),
  includesInternet: z.boolean(),
  includesLinens: z.boolean(),
  includesWater: z.boolean(),

  // Localização
  fullAddress: z.string().min(5, "Endereço completo é obrigatório"),
  neighborhood: z.string().min(2, "Bairro é obrigatório"),
  municipality: z.string().min(2, "Município é obrigatório"),
  city: z.string().min(2, "Cidade é obrigatória"),
  state: z.string().min(2, "Estado é obrigatório"),
  zipCode: z.string().min(8, "CEP deve ter 8 dígitos"),
  latitude: z.number().optional(),
  longitude: z.number().optional(),
  googleMapsUrl: z.string().optional(),
  googlePlaceId: z.string().optional(),
  googleMapsEmbedUrl: z.string().optional(),
  popularDestination: z.string().min(1, "Selecione um destino popular"),

  // Regras da casa
  checkInRule: z.string().optional(),
  checkOutRule: z.string().optional(),
  cancellationRule: z.string().optional(),
  childrenRule: z.string().optional(),
  petsRule: z.string().optional(),
  partyRule: z.string().optional(),
  restaurantRule: z.string().optional(),
  bedsRule: z.string().optional(),
  silenceRule: z.string().optional(),
  ageRestrictionRule: z.string().optional(),
  groupsRule: z.string().optional(),

  // Métodos de pagamento
  acceptsVisa: z.boolean().optional().default(false),
  acceptsAmericanExpress: z.boolean().optional().default(false),
  acceptsMasterCard: z.boolean().optional().default(false),
  acceptsMaestro: z.boolean().optional().default(false),
  acceptsElo: z.boolean().optional().default(false),
  acceptsDinersClub: z.boolean().optional().default(false),
  acceptsPix: z.boolean().optional().default(false),
  acceptsCash: z.boolean().optional().default(false),

  // Apartamentos
  apartments: z
    .array(
      z.object({
        name: z.string().min(1, "Nome do apartamento é obrigatório"),
        totalBathrooms: z
          .number()
          .min(0, "Número de banheiros inválido")
          .default(0),
        maxAdults: z
          .number()
          .min(0, "Número máximo de adultos inválido")
          .default(0),
        maxChildren: z
          .number()
          .min(0, "Número máximo de crianças inválido")
          .default(0),
        hasLivingRoom: z.boolean().default(false),
        livingRoomHasSofaBed: z.boolean().default(false),
        hasKitchen: z.boolean().default(false),
        kitchenHasStove: z.boolean().default(false),
        kitchenHasFridge: z.boolean().default(false),
        kitchenHasMinibar: z.boolean().default(false),
        hasBalcony: z.boolean().default(false),
        balconyHasSeaView: z.boolean().default(false),
        hasCrib: z.boolean().default(false),
        rooms: z
          .array(
            z.object({
              roomNumber: z.number(),
              doubleBeds: z
                .number()
                .min(0, "Número de camas de casal inválido")
                .default(0),
              largeBeds: z
                .number()
                .min(0, "Número de camas de casal grande inválido")
                .default(0),
              extraLargeBeds: z
                .number()
                .min(0, "Número de camas de casal extra-grande inválido")
                .default(0),
              singleBeds: z
                .number()
                .min(0, "Número de camas de solteiro inválido")
                .default(0),
              sofaBeds: z
                .number()
                .min(0, "Número de sofás-cama inválido")
                .default(0),
            }),
          )
          .min(1, "Cada apartamento deve ter pelo menos um quarto"),
      }),
    )
    .min(1, "Adicione pelo menos um apartamento"),
});

type PropertyFormValues = z.infer<typeof propertyFormSchema>;

interface AddPropertyPageProps {
  params: Promise<{ adminId: string }>;
}

export default function AddPropertyPage({ params }: AddPropertyPageProps) {
  const { adminId } = use(params);
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedAmenities, setSelectedAmenities] = useState<number[]>([]);
  const [uploadedImages, setUploadedImages] = useState<string[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [isDragOver, setIsDragOver] = useState(false);
  const [amenities, setAmenities] = useState<
    Array<{ id: number; name: string; category: string }>
  >([]);

  const form = useForm({
    resolver: zodResolver(propertyFormSchema),
    defaultValues: {
      title: "",
      shortDescription: "",
      fullDescription: "",
      maxGuests: 1,
      bedrooms: 0,
      bathrooms: 1,
      allowsPets: false,
      parkingSpaces: 0,
      aboutBuilding: "",
      minimumStay: 1,
      maximumStay: 30,
      checkInTime: "15:00",
      checkOutTime: "11:00",
      propertyStyle: ["Apartamento"],
      propertyClasses: ["Imóveis em Destaque"],
      nearbyPlaces: [],
      nearbyBeaches: [],
      nearbyAirports: [],
      nearbyRestaurants: [],
      includesKitchenUtensils: false,
      includesFurniture: false,
      includesElectricity: false,
      includesInternet: false,
      includesLinens: false,
      includesWater: false,
      fullAddress: "",
      neighborhood: "",
      municipality: "",
      city: "",
      state: "",
      zipCode: "",
      condominiumFee: 0,
      iptuFee: 0,
      monthlyCleaningFee: 0,
      otherFees: 0,
      popularDestination: "Nenhum dos anteriores",
      acceptsVisa: false,
      acceptsAmericanExpress: false,
      acceptsMasterCard: false,
      acceptsMaestro: false,
      acceptsElo: false,
      acceptsDinersClub: false,
      acceptsPix: false,
      acceptsCash: false,
      apartments: [
        {
          name: "",
          totalBathrooms: 0,
          maxAdults: 0,
          maxChildren: 0,
          hasLivingRoom: false,
          livingRoomHasSofaBed: false,
          hasKitchen: false,
          kitchenHasStove: false,
          kitchenHasFridge: false,
          kitchenHasMinibar: false,
          hasBalcony: false,
          balconyHasSeaView: false,
          hasCrib: false,
          rooms: [
            {
              roomNumber: 1,
              doubleBeds: 0,
              largeBeds: 0,
              extraLargeBeds: 0,
              singleBeds: 0,
              sofaBeds: 0,
            },
          ],
        },
      ],
    },
  });

  // Carregar comodidades quando o componente monta
  useEffect(() => {
    getAmenities().then(setAmenities);
  }, []);

  const handleImageUpload = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    setIsUploading(true);

    try {
      const formData = new FormData();

      // Adicionar todos os arquivos selecionados
      Array.from(files).forEach((file) => {
        formData.append("files", file);
      });

      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const result = await response.json();

      if (result.success) {
        setUploadedImages([...uploadedImages, ...result.files]);
        toast.success(result.message);
      } else {
        toast.error("Erro no upload: " + result.error);
      }
    } catch (error) {
      console.error("Erro no upload:", error);
      toast.error("Erro inesperado no upload");
    } finally {
      setIsUploading(false);
      // Limpar o input
      if (event.target) {
        event.target.value = "";
      }
    }
  };

  const removeUploadedImage = (index: number) => {
    setUploadedImages(uploadedImages.filter((_, i) => i !== index));
  };

  // Funções para drag and drop
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);

    const files = e.dataTransfer.files;
    if (files.length > 0) {
      // Simular evento de input para reutilizar a lógica existente
      const fakeEvent = {
        target: { files, value: "" },
      } as React.ChangeEvent<HTMLInputElement>;
      handleImageUpload(fakeEvent);
    }
  };

  const handleAmenityChange = (amenityId: number, checked: boolean) => {
    if (checked) {
      setSelectedAmenities([...selectedAmenities, amenityId]);
    } else {
      setSelectedAmenities(selectedAmenities.filter((id) => id !== amenityId));
    }
  };

  const onSubmit = async (values: PropertyFormValues) => {
    console.log("onSubmit chamado com valores:", values);

    if (uploadedImages.length === 0) {
      toast.error("Adicione pelo menos uma imagem do imóvel");
      return;
    }

    setIsSubmitting(true);

    try {
      const propertyData: PropertyFormData = {
        ...values,
        parkingSpaces: values.parkingSpaces || 0,
        nearbyPlaces: values.nearbyPlaces || [],
        nearbyBeaches: values.nearbyBeaches || [],
        nearbyAirports: values.nearbyAirports || [],
        nearbyRestaurants: values.nearbyRestaurants || [],
        amenities: selectedAmenities,
        images: uploadedImages,
      };

      console.log("Dados sendo enviados:", propertyData);
      const result = await createProperty(propertyData);
      console.log("Resultado do createProperty:", result);

      if (result.success) {
        toast.success("Imóvel criado com sucesso!");
        router.push(`/admin/${adminId}/properties`);
      } else {
        toast.error("Erro ao criar imóvel: " + result.error);
      }
    } catch (error) {
      console.error("Erro:", error);
      toast.error("Erro inesperado ao criar imóvel");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Constantes para o formulário
  const propertyStyleOptions = [
    "Apartamento",
    "Casa",
    "Casa de Praia",
    "Flats",
    "Pousada",
  ];

  const propertyClassOptions = [
    "Imóveis em Destaque",
    "Apartamentos em Destaque",
    "Casas em Destaque",
    "Casas de Praia em Destaque",
    "Flats em Destaque",
    "Pousadas em Destaque",
  ];

  const popularDestinations = [
    "Fortaleza",
    "Canoa Quebrada",
    "Jericoacoara",
    "Morro Branco",
    "Cumbuco",
    "Aquiraz",
    "Caucaia",
    "Nenhum dos anteriores",
  ];

  // Lista completa dos 184 municípios do Ceará
  const cearaMunicipalities = [
    "Abaiara",
    "Acarape",
    "Acaraú",
    "Acopiara",
    "Aiuaba",
    "Alcântaras",
    "Altaneira",
    "Alto Santo",
    "Amontada",
    "Antonina do Norte",
    "Apuiarés",
    "Aquiraz",
    "Aracati",
    "Aracoiaba",
    "Ararendá",
    "Araripe",
    "Aratuba",
    "Arneiroz",
    "Assaré",
    "Aurora",
    "Baixio",
    "Banabuiú",
    "Barbalha",
    "Barreira",
    "Barro",
    "Barroquinha",
    "Baturité",
    "Beberibe",
    "Bela Cruz",
    "Boa Viagem",
    "Brejo Santo",
    "Camocim",
    "Campos Sales",
    "Canindé",
    "Capistrano",
    "Caridade",
    "Caririaçu",
    "Cariré",
    "Cariús",
    "Carnaubal",
    "Cascavel",
    "Catarina",
    "Catunda",
    "Caucaia",
    "Cedro",
    "Chaval",
    "Chorozinho",
    "Choró",
    "Coreaú",
    "Crateús",
    "Crato",
    "Croatá",
    "Cruz",
    "Deputado Irapuan Pinheiro",
    "Ererê",
    "Eusébio",
    "Farias Brito",
    "Forquilha",
    "Fortaleza",
    "Fortim",
    "Frecheirinha",
    "General Sampaio",
    "Granja",
    "Granjeiro",
    "Graça",
    "Groaíras",
    "Guaiúba",
    "Guaraciaba do Norte",
    "Guaramiranga",
    "Hidrolândia",
    "Horizonte",
    "Ibaretama",
    "Ibiapina",
    "Ibicuitinga",
    "Icapuí",
    "Icó",
    "Iguatu",
    "Independência",
    "Ipaporanga",
    "Ipaumirim",
    "Ipu",
    "Ipueiras",
    "Iracema",
    "Irauçuba",
    "Itaitinga",
    "Itaiçaba",
    "Itapajé",
    "Itapipoca",
    "Itapiúna",
    "Itarema",
    "Itatira",
    "Jaguaretama",
    "Jaguaribara",
    "Jaguaribe",
    "Jaguaruana",
    "Jardim",
    "Jati",
    "Jijoca de Jericoacoara",
    "Juazeiro do Norte",
    "Jucás",
    "Lavras da Mangabeira",
    "Limoeiro do Norte",
    "Madalena",
    "Maracanaú",
    "Maranguape",
    "Marco",
    "Martinólope",
    "Massapê",
    "Mauriti",
    "Meruoca",
    "Milagres",
    "Milhã",
    "Miraíma",
    "Missão Velha",
    "Mombaça",
    "Monsenhor Tabosa",
    "Morada Nova",
    "Moraújo",
    "Morrinhos",
    "Mucambo",
    "Mulungu",
    "Nova Olinda",
    "Nova Russas",
    "Novo Oriente",
    "Ocara",
    "Orós",
    "Pacajus",
    "Pacatuba",
    "Pacoti",
    "Pacujá",
    "Palhano",
    "Palmácia",
    "Paracuru",
    "Paraipaba",
    "Parambú",
    "Paramoti",
    "Pedra Branca",
    "Penaforte",
    "Pentecoste",
    "Pereiro",
    "Pindoretama",
    "Piquet Carneiro",
    "Pires Ferreira",
    "Poranga",
    "Porteiras",
    "Potengi",
    "Potiretama",
    "Quiterianópolis",
    "Quixadá",
    "Quixelô",
    "Quixeramobim",
    "Quixeré",
    "Redenção",
    "Reriutaba",
    "Russas",
    "Saboeiro",
    "Salitre",
    "Santa Quitéria",
    "Santana do Acaraú",
    "Santana do Cariri",
    "São Benedito",
    "São Gonçalo do Amarante",
    "São João do Jaguaribe",
    "São Luís do Curu",
    "Senador Pompeu",
    "Senador Sá",
    "Sobral",
    "Solonópole",
    "Tabuleiro do Norte",
    "Tamboril",
    "Tarrafas",
    "Tauá",
    "Tejuçuoca",
    "Tianguá",
    "Trairi",
    "Tururu",
    "Ubajara",
    "Umari",
    "Umirim",
    "Uruburetama",
    "Uruoca",
    "Varjota",
    "Várzea Alegre",
    "Viçosa do Ceará",
  ];

  // Agrupar comodidades por categoria
  const amenitiesByCategory = amenities.reduce(
    (acc, amenity) => {
      if (!acc[amenity.category]) {
        acc[amenity.category] = [];
      }
      acc[amenity.category].push(amenity);
      return acc;
    },
    {} as Record<string, typeof amenities>,
  );

  return (
    <>
      <div className="relative mt-26 min-h-screen">
        {/* Background Image - Fixed */}
        <div className="fixed inset-0 bg-cover bg-center bg-no-repeat">
          <div className="absolute inset-0 bg-slate-900"></div>
        </div>

        {/* Content */}
        <div className="relative z-10 px-4 py-8 pb-16 sm:px-6 lg:px-52">
          <div className="mb-8 flex items-center gap-4">
            <Link href={`/admin/${adminId}/properties`}>
              <Button
                size="sm"
                className="border border-blue-400/10 bg-[#182334] text-gray-200 backdrop-blur-sm transition-all duration-200 hover:bg-[#182334] hover:brightness-105"
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Voltar
              </Button>
            </Link>
            <div className="ml-10">
              <h1 className="text-4xl font-bold text-gray-100">
                Adicionar Novo Imóvel
              </h1>
              <p className="mt-2 text-gray-200">
                Preencha as informações para cadastrar um novo imóvel
              </p>
            </div>
          </div>

          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(
                (data) => {
                  console.log(
                    "Formulário validado com sucesso, chamando onSubmit",
                  );
                  return onSubmit(data);
                },
                (errors) => {
                  console.error("Erros de validação:", errors);
                  toast.error(
                    "Por favor, corrija os erros no formulário antes de enviar",
                  );
                },
              )}
              className="mx-auto max-w-4xl space-y-8"
            >
              {/* <Card className="border-slate-700/50 bg-slate-800/80 shadow-2xl backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle className="flex items-center text-2xl font-semibold text-slate-100">
                      <User className="mr-2 h-5 w-5" />
                      Informações do Proprietário
                    </CardTitle>
                    <span className="text-sm text-gray-200">
                      Adicione aqui suas informações de contato.
                    </span>
                  </CardHeader>
                  <CardContent className="space-y-6 p-6">
                    <div className="space-y-2">
                      <FormLabel className="mb-5 text-slate-300">
                        Foto de Perfil (Recomendado)
                      </FormLabel>
                      <div className="flex items-center gap-4">
                        {uploadedOwnerImage ? (
                          <div className="relative">
                            <div className="h-20 w-20 overflow-hidden rounded-full border-2 border-slate-600">
                              <Image
                                src={uploadedOwnerImage}
                                alt="Foto de perfil"
                                width={80}
                                height={80}
                                className="h-full w-full object-cover"
                              />
                            </div>
                            <Button
                              type="button"
                              size="sm"
                              className="absolute -top-2 -right-2 h-9 w-9 rounded-full border border-slate-500 bg-slate-700 hover:bg-slate-600"
                              onClick={removeOwnerImage}
                            >
                              <Trash className="h-8 w-8 text-slate-100" />
                            </Button>
                          </div>
                        ) : (
                          <div className="flex h-20 w-20 items-center justify-center rounded-full border-2 border-slate-600 bg-slate-700">
                            <Camera className="h-8 w-8 text-slate-400" />
                          </div>
                        )}
                        <div>
                          <label className="cursor-pointer">
                            <Button
                              type="button"
                              variant="outline"
                              disabled={isUploading}
                              className="border-slate-600 bg-slate-700 text-slate-100 hover:bg-slate-600 hover:text-slate-100"
                              asChild
                            >
                              <span>
                                {isUploading
                                  ? "Enviando..."
                                  : "Escolher Foto de Perfil"}
                              </span>
                            </Button>
                            <input
                              type="file"
                              accept="image/*"
                              onChange={(e) => handleImageUpload(e, true)}
                              disabled={isUploading}
                              className="hidden"
                            />
                          </label>
                          <p className="mt-1 mb-2 text-sm text-slate-400">
                            Recomendado: foto de perfil para aparecer nos
                            anúncios
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                      <FormField
                        control={form.control}
                        name="ownerName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-slate-300">
                              Nome *
                            </FormLabel>
                            <FormControl>
                              <Input
                                {...field}
                                className="border-slate-600 bg-slate-700 text-slate-100 placeholder:text-slate-400"
                                placeholder="Seu nome completo"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="ownerPhone"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-slate-300">
                              Telefone *
                            </FormLabel>
                            <FormControl>
                              <Input
                                value={field.value}
                                onChange={(e) => {
                                  const formatted = formatPhoneNumber(
                                    e.target.value,
                                  );
                                  field.onChange(formatted);
                                }}
                                className="border-slate-600 bg-slate-700 text-slate-100"
                                placeholder="(85) 9 9999-9999"
                                maxLength={16} // (xx) x xxxx-xxxx
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="ownerEmail"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-slate-300">
                              Email *
                            </FormLabel>
                            <FormControl>
                              <Input
                                {...field}
                                type="email"
                                className="border-slate-600 bg-slate-700 text-slate-100 placeholder:text-slate-400"
                                placeholder="seu@email.com"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="ownerInstagram"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-slate-300">
                              Instagram (Recomendado)
                            </FormLabel>
                            <FormControl>
                              <Input
                                {...field}
                                className="border-slate-600 bg-slate-700 text-slate-100 placeholder:text-slate-400"
                                placeholder="@seuinstagram"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="ownerWebsite"
                        render={({ field }) => (
                          <FormItem className="md:col-span-2">
                            <FormLabel className="text-slate-300">
                              Site (Recomendado)
                            </FormLabel>
                            <FormControl>
                              <Input
                                {...field}
                                className="border-slate-600 bg-slate-700 text-slate-100 placeholder:text-slate-400"
                                placeholder="https://seusite.com"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </CardContent>
                </Card> */}

              {/* Dados Básicos */}
              <Card className="border-slate-700/50 bg-slate-800/80 shadow-2xl backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-2xl font-semibold text-slate-100">
                    Informações Básicas
                  </CardTitle>
                  <span className="text-sm text-gray-200">
                    Adicione aqui as informações principais do imóvel, como
                    título, descrição, capacidade, tipo, classe, entre outros.
                  </span>
                </CardHeader>
                <CardContent className="space-y-6 p-6">
                  <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                    <FormField
                      control={form.control}
                      name="title"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-slate-300">
                            Título do Imóvel *
                          </FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              className="border-slate-600 bg-slate-700 text-slate-100 placeholder:text-slate-400"
                              placeholder="Ex: Apartamento com Vista para o Mar"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="propertyStyle"
                      render={({ field }) => (
                        <FormItem className="md:col-span-2">
                          <FormLabel className="text-slate-300">
                            Tipo do Imóvel *
                          </FormLabel>
                          <div className="space-y-4">
                            {field.value.map((style, index) => (
                              <div key={index} className="flex gap-2">
                                <Select
                                  value={style}
                                  onValueChange={(value) => {
                                    const newStyles = [...field.value];
                                    newStyles[index] = value;
                                    field.onChange(newStyles);
                                  }}
                                >
                                  <FormControl>
                                    <SelectTrigger className="border-slate-600 bg-slate-700 text-slate-300">
                                      <SelectValue
                                        className="text-slate-300"
                                        placeholder="Selecione o tipo"
                                      />
                                    </SelectTrigger>
                                  </FormControl>
                                  <SelectContent className="border-slate-600 bg-slate-700 text-slate-300">
                                    {propertyStyleOptions.map((type) => (
                                      <SelectItem
                                        key={type}
                                        value={type}
                                        className="text-slate-100 focus:bg-slate-600 focus:text-slate-100"
                                      >
                                        {type}
                                      </SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                                {field.value.length > 1 && (
                                  <Button
                                    type="button"
                                    variant="outline"
                                    size="sm"
                                    onClick={() => {
                                      const newStyles = field.value.filter(
                                        (_, i) => i !== index,
                                      );
                                      field.onChange(newStyles);
                                    }}
                                    className="border-slate-600 bg-slate-700 text-slate-300 hover:bg-slate-600 hover:text-slate-300"
                                  >
                                    <Trash className="h-4 w-4" />
                                  </Button>
                                )}
                              </div>
                            ))}
                            <Button
                              type="button"
                              variant="outline"
                              onClick={() => {
                                field.onChange([...field.value, ""]);
                              }}
                              className="border-slate-600 bg-slate-700 text-slate-300 hover:bg-slate-600 hover:text-slate-300"
                            >
                              <Plus className="mr-2 h-4 w-4" />
                              Adicionar Tipo
                            </Button>
                          </div>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="propertyClasses"
                      render={({ field }) => (
                        <FormItem className="md:col-span-2">
                          <FormLabel className="text-slate-300">
                            Classes do Imóvel *
                          </FormLabel>
                          <FormDescription className="text-slate-400">
                            Apenas os admins conseguem determinar as classes dos
                            imóveis. O imóvel com determinada classe será
                            exibido em uma seção diferente dos demais.
                          </FormDescription>

                          <div className="space-y-4">
                            {field.value.map((propertyClass, index) => (
                              <div key={index} className="flex gap-2">
                                <Select
                                  value={propertyClass}
                                  onValueChange={(value) => {
                                    const newClasses = [...field.value];
                                    newClasses[index] = value;
                                    field.onChange(newClasses);
                                  }}
                                >
                                  <FormControl>
                                    <SelectTrigger className="border-slate-600 bg-slate-700 text-slate-300">
                                      <SelectValue
                                        className="text-slate-300"
                                        placeholder="Selecione a classe"
                                      />
                                    </SelectTrigger>
                                  </FormControl>
                                  <SelectContent className="border-slate-600 bg-slate-700 text-slate-300">
                                    {propertyClassOptions.map((classOption) => (
                                      <SelectItem
                                        key={classOption}
                                        value={classOption}
                                        className="text-slate-100 focus:bg-slate-600 focus:text-slate-100"
                                      >
                                        {classOption}
                                      </SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                                {field.value.length > 1 && (
                                  <Button
                                    type="button"
                                    variant="outline"
                                    size="sm"
                                    onClick={() => {
                                      const newClasses = field.value.filter(
                                        (_, i) => i !== index,
                                      );
                                      field.onChange(newClasses);
                                    }}
                                    className="border-slate-600 bg-slate-700 text-slate-300 hover:bg-slate-600 hover:text-slate-300"
                                  >
                                    <Trash className="h-4 w-4" />
                                  </Button>
                                )}
                              </div>
                            ))}
                            <Button
                              type="button"
                              variant="outline"
                              onClick={() => {
                                field.onChange([...field.value, ""]);
                              }}
                              className="border-slate-600 bg-slate-700 text-slate-300 hover:bg-slate-600 hover:text-slate-300"
                            >
                              <Plus className="mr-2 h-4 w-4" />
                              Adicionar Classe
                            </Button>
                          </div>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="shortDescription"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-slate-300">
                          Descrição Curta *
                        </FormLabel>
                        <FormControl>
                          <Textarea
                            {...field}
                            className="min-h-[100px] border-slate-600 bg-slate-700 text-slate-100 placeholder:text-slate-400"
                            placeholder="Descreva brevemente o imóvel (aparecerá nos cards de busca)"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="fullDescription"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-slate-300">
                          Descrição Completa *
                        </FormLabel>
                        <FormControl>
                          <Textarea
                            {...field}
                            className="min-h-[150px] border-slate-600 bg-slate-700 text-slate-100 placeholder:text-slate-400"
                            placeholder="Descrição detalhada do imóvel (aparecerá na página do imóvel)"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="aboutBuilding"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-slate-300">
                          Sobre o Prédio/Condomínio (Opcional)
                        </FormLabel>
                        <FormControl>
                          <Textarea
                            {...field}
                            className="min-h-[100px] border-slate-600 bg-slate-700 text-slate-100 placeholder:text-slate-400"
                            placeholder="Informações sobre o prédio, condomínio, infraestrutura, etc."
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <FormField
                      control={form.control}
                      name="maxGuests"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-slate-300">
                            Máx. Hóspedes por Grupo *
                          </FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              type="number"
                              min="1"
                              onChange={(e) =>
                                field.onChange(parseInt(e.target.value) || 1)
                              }
                              className="border-slate-600 bg-slate-700 text-slate-100"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="parkingSpaces"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-slate-300">
                            Vagas de Garagem
                          </FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              type="number"
                              min="0"
                              onChange={(e) =>
                                field.onChange(parseInt(e.target.value) || 0)
                              }
                              className="border-slate-600 bg-slate-700 text-slate-100"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                    <FormField
                      control={form.control}
                      name="minimumStay"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-slate-300">
                            Estadia Mínima (noites) *
                          </FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              type="number"
                              min="1"
                              onChange={(e) =>
                                field.onChange(parseInt(e.target.value) || 1)
                              }
                              className="border-slate-600 bg-slate-700 text-slate-100"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="maximumStay"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-slate-300">
                            Estadia Máxima (dias) *
                          </FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              type="number"
                              min="1"
                              onChange={(e) =>
                                field.onChange(parseInt(e.target.value) || 30)
                              }
                              className="border-slate-600 bg-slate-700 text-slate-100"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Proximidades da Região */}
              <Card className="border-slate-700/50 bg-slate-800/80 shadow-2xl backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-2xl font-semibold text-slate-100">
                    Proximidades da Região
                  </CardTitle>
                  <span className="text-sm text-gray-200">
                    Configure os locais próximos ao imóvel para cada categoria.
                    É obrigatório adicionar pelo menos um local em cada seção.
                  </span>
                </CardHeader>
                <CardContent className="space-y-8 p-6">
                  {/* O que há por perto? */}
                  <div className="space-y-4">
                    <h3 className="flex items-center gap-2 text-lg font-semibold text-slate-200">
                      <MapPin className="h-5 w-5" />O que há por perto?
                    </h3>
                    <FormField
                      control={form.control}
                      name="nearbyPlaces"
                      render={({ field }) => (
                        <FormItem>
                          <div className="space-y-3">
                            {(field.value || []).map((place, index) => (
                              <div
                                key={index}
                                className="grid grid-cols-1 gap-3 md:grid-cols-3"
                              >
                                <div className="md:col-span-2">
                                  <Input
                                    placeholder="Nome do local (ex: Centro da cidade)"
                                    value={place.name}
                                    onChange={(e) => {
                                      const newPlaces = [
                                        ...(field.value || []),
                                      ];
                                      newPlaces[index].name = e.target.value;
                                      field.onChange(newPlaces);
                                    }}
                                    className="border-slate-600 bg-slate-700 text-slate-300"
                                  />
                                </div>
                                <div className="flex gap-2">
                                  <Input
                                    placeholder="Distância (ex: 2,5 km)"
                                    value={place.distance}
                                    onChange={(e) => {
                                      const newPlaces = [
                                        ...(field.value || []),
                                      ];
                                      newPlaces[index].distance =
                                        e.target.value;
                                      field.onChange(newPlaces);
                                    }}
                                    className="border-slate-600 bg-slate-700 text-slate-300"
                                  />
                                  {(field.value || []).length > 1 && (
                                    <Button
                                      type="button"
                                      variant="outline"
                                      size="icon"
                                      onClick={() => {
                                        const newPlaces = (
                                          field.value || []
                                        ).filter((_, i) => i !== index);
                                        field.onChange(newPlaces);
                                      }}
                                      className="border-slate-600 bg-slate-700 text-slate-300 hover:bg-slate-600 hover:text-slate-300"
                                    >
                                      <Trash className="h-4 w-4" />
                                    </Button>
                                  )}
                                </div>
                              </div>
                            ))}
                            <Button
                              type="button"
                              variant="outline"
                              onClick={() => {
                                field.onChange([
                                  ...(field.value || []),
                                  { name: "", distance: "" },
                                ]);
                              }}
                              className="border-slate-600 bg-slate-700 text-slate-300 hover:bg-slate-600 hover:text-slate-300"
                            >
                              <Plus className="mr-2 h-4 w-4" />
                              Adicionar Local
                            </Button>
                          </div>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  {/* Praias na vizinhança */}
                  <div className="space-y-4">
                    <h3 className="flex items-center gap-2 text-lg font-semibold text-slate-200">
                      <Palmtree className="h-5 w-5" />
                      Praias na vizinhança
                    </h3>
                    <FormField
                      control={form.control}
                      name="nearbyBeaches"
                      render={({ field }) => (
                        <FormItem>
                          <div className="space-y-3">
                            {(field.value || []).map((beach, index) => (
                              <div
                                key={index}
                                className="grid grid-cols-1 gap-3 md:grid-cols-3"
                              >
                                <div className="md:col-span-2">
                                  <Input
                                    placeholder="Nome da praia (ex: Praia de Iracema)"
                                    value={beach.name}
                                    onChange={(e) => {
                                      const newBeaches = [
                                        ...(field.value || []),
                                      ];
                                      newBeaches[index].name = e.target.value;
                                      field.onChange(newBeaches);
                                    }}
                                    className="border-slate-600 bg-slate-700 text-slate-100"
                                  />
                                </div>
                                <div className="flex gap-2">
                                  <Input
                                    placeholder="Distância (ex: 2,1 km)"
                                    value={beach.distance}
                                    onChange={(e) => {
                                      const newBeaches = [
                                        ...(field.value || []),
                                      ];
                                      newBeaches[index].distance =
                                        e.target.value;
                                      field.onChange(newBeaches);
                                    }}
                                    className="border-slate-600 bg-slate-700 text-slate-100"
                                  />
                                  {(field.value || []).length > 1 && (
                                    <Button
                                      type="button"
                                      variant="outline"
                                      size="icon"
                                      onClick={() => {
                                        const newBeaches = (
                                          field.value || []
                                        ).filter((_, i) => i !== index);
                                        field.onChange(newBeaches);
                                      }}
                                      className="border-slate-600 bg-slate-700 text-slate-300 hover:bg-slate-600 hover:text-slate-300"
                                    >
                                      <Trash className="h-4 w-4" />
                                    </Button>
                                  )}
                                </div>
                              </div>
                            ))}
                            <Button
                              type="button"
                              variant="outline"
                              onClick={() => {
                                field.onChange([
                                  ...(field.value || []),
                                  { name: "", distance: "" },
                                ]);
                              }}
                              className="border-slate-600 bg-slate-700 text-slate-300 hover:bg-slate-600 hover:text-slate-300"
                            >
                              <Plus className="mr-2 h-4 w-4" />
                              Adicionar Praia
                            </Button>
                          </div>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  {/* Aeroportos mais próximos */}
                  <div className="space-y-4">
                    <h3 className="flex items-center gap-2 text-lg font-semibold text-slate-200">
                      <Building2 className="h-5 w-5" />
                      Aeroportos mais próximos
                    </h3>
                    <FormField
                      control={form.control}
                      name="nearbyAirports"
                      render={({ field }) => (
                        <FormItem>
                          <div className="space-y-3">
                            {(field.value || []).map((airport, index) => (
                              <div
                                key={index}
                                className="grid grid-cols-1 gap-3 md:grid-cols-3"
                              >
                                <div className="md:col-span-2">
                                  <Input
                                    placeholder="Nome do aeroporto (ex: Aeroporto Internacional Pinto Martins)"
                                    value={airport.name}
                                    onChange={(e) => {
                                      const newAirports = [
                                        ...(field.value || []),
                                      ];
                                      newAirports[index].name = e.target.value;
                                      field.onChange(newAirports);
                                    }}
                                    className="border-slate-600 bg-slate-700 text-slate-100"
                                  />
                                </div>
                                <div className="flex gap-2">
                                  <Input
                                    placeholder="Distância (ex: 15 km)"
                                    value={airport.distance}
                                    onChange={(e) => {
                                      const newAirports = [
                                        ...(field.value || []),
                                      ];
                                      newAirports[index].distance =
                                        e.target.value;
                                      field.onChange(newAirports);
                                    }}
                                    className="border-slate-600 bg-slate-700 text-slate-100"
                                  />
                                  {(field.value || []).length > 1 && (
                                    <Button
                                      type="button"
                                      variant="outline"
                                      size="icon"
                                      onClick={() => {
                                        const newAirports = (
                                          field.value || []
                                        ).filter((_, i) => i !== index);
                                        field.onChange(newAirports);
                                      }}
                                      className="border-slate-600 bg-slate-700 text-slate-300 hover:bg-slate-600 hover:text-slate-300"
                                    >
                                      <Trash className="h-4 w-4" />
                                    </Button>
                                  )}
                                </div>
                              </div>
                            ))}
                            <Button
                              type="button"
                              variant="outline"
                              onClick={() => {
                                field.onChange([
                                  ...(field.value || []),
                                  { name: "", distance: "" },
                                ]);
                              }}
                              className="border-slate-600 bg-slate-700 text-slate-300 hover:bg-slate-600 hover:text-slate-300"
                            >
                              <Plus className="mr-2 h-4 w-4" />
                              Adicionar Aeroporto
                            </Button>
                          </div>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  {/* Restaurantes e cafés */}
                  <div className="space-y-4">
                    <h3 className="flex items-center gap-2 text-lg font-semibold text-slate-200">
                      <Utensils className="h-5 w-5" />
                      Restaurantes e cafés
                    </h3>
                    <FormField
                      control={form.control}
                      name="nearbyRestaurants"
                      render={({ field }) => (
                        <FormItem>
                          <div className="space-y-3">
                            {(field.value || []).map((restaurant, index) => (
                              <div
                                key={index}
                                className="grid grid-cols-1 gap-3 md:grid-cols-3"
                              >
                                <div className="md:col-span-2">
                                  <Input
                                    placeholder="Nome do restaurante (ex: Restaurante Vila Azul)"
                                    value={restaurant.name}
                                    onChange={(e) => {
                                      const newRestaurants = [
                                        ...(field.value || []),
                                      ];
                                      newRestaurants[index].name =
                                        e.target.value;
                                      field.onChange(newRestaurants);
                                    }}
                                    className="border-slate-600 bg-slate-700 text-slate-100"
                                  />
                                </div>
                                <div className="flex gap-2">
                                  <Input
                                    placeholder="Distância (ex: 650 m)"
                                    value={restaurant.distance}
                                    onChange={(e) => {
                                      const newRestaurants = [
                                        ...(field.value || []),
                                      ];
                                      newRestaurants[index].distance =
                                        e.target.value;
                                      field.onChange(newRestaurants);
                                    }}
                                    className="border-slate-600 bg-slate-700 text-slate-100"
                                  />
                                  {(field.value || []).length > 1 && (
                                    <Button
                                      type="button"
                                      variant="outline"
                                      size="icon"
                                      onClick={() => {
                                        const newRestaurants = (
                                          field.value || []
                                        ).filter((_, i) => i !== index);
                                        field.onChange(newRestaurants);
                                      }}
                                      className="border-slate-600 bg-slate-700 text-slate-300 hover:bg-slate-600 hover:text-slate-300"
                                    >
                                      <Trash className="h-4 w-4" />
                                    </Button>
                                  )}
                                </div>
                              </div>
                            ))}
                            <Button
                              type="button"
                              variant="outline"
                              onClick={() => {
                                field.onChange([
                                  ...(field.value || []),
                                  { name: "", distance: "" },
                                ]);
                              }}
                              className="border-slate-600 bg-slate-700 text-slate-300 hover:bg-slate-600 hover:text-slate-300"
                            >
                              <Plus className="mr-2 h-4 w-4" />
                              Adicionar Restaurante
                            </Button>
                          </div>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Serviços Inclusos */}
              <Card className="border-slate-700/50 bg-slate-800/80 shadow-2xl backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-2xl font-semibold text-slate-100">
                    Serviços Inclusos
                  </CardTitle>
                  <span className="text-sm text-gray-200">
                    Marque os serviços que estão inclusos no valor do aluguel.
                  </span>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="grid grid-cols-2 gap-6 md:grid-cols-3">
                    <FormField
                      control={form.control}
                      name="includesKitchenUtensils"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-start space-y-0 space-x-3">
                          <FormControl>
                            <Checkbox
                              checked={field.value}
                              onCheckedChange={field.onChange}
                              className="border-slate-600 data-[state=checked]:bg-blue-600"
                            />
                          </FormControl>
                          <FormLabel className="text-slate-300">
                            Café da Manhã
                          </FormLabel>
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="includesFurniture"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-start space-y-0 space-x-3">
                          <FormControl>
                            <Checkbox
                              checked={field.value}
                              onCheckedChange={field.onChange}
                              className="border-slate-600 data-[state=checked]:bg-blue-600"
                            />
                          </FormControl>
                          <FormLabel className="text-slate-300">
                            Mobiliado
                          </FormLabel>
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="includesElectricity"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-start space-y-0 space-x-3">
                          <FormControl>
                            <Checkbox
                              checked={field.value}
                              onCheckedChange={field.onChange}
                              className="border-slate-600 data-[state=checked]:bg-blue-600"
                            />
                          </FormControl>
                          <FormLabel className="text-slate-300">
                            Energia Elétrica
                          </FormLabel>
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="includesInternet"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-start space-y-0 space-x-3">
                          <FormControl>
                            <Checkbox
                              checked={field.value}
                              onCheckedChange={field.onChange}
                              className="border-slate-600 data-[state=checked]:bg-blue-600"
                            />
                          </FormControl>
                          <FormLabel className="text-slate-300">
                            Internet/Wi-Fi
                          </FormLabel>
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="includesLinens"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-start space-y-0 space-x-3">
                          <FormControl>
                            <Checkbox
                              checked={field.value}
                              onCheckedChange={field.onChange}
                              className="border-slate-600 data-[state=checked]:bg-blue-600"
                            />
                          </FormControl>
                          <FormLabel className="text-slate-300">
                            Roupas de Cama
                          </FormLabel>
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="includesWater"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-start space-y-0 space-x-3">
                          <FormControl>
                            <Checkbox
                              checked={field.value}
                              onCheckedChange={field.onChange}
                              className="border-slate-600 data-[state=checked]:bg-blue-600"
                            />
                          </FormControl>
                          <FormLabel className="text-slate-300">Água</FormLabel>
                        </FormItem>
                      )}
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Localização */}
              <Card className="border-slate-700/50 bg-slate-800/80 shadow-2xl backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-2xl font-semibold text-slate-100">
                    Localização
                  </CardTitle>
                  <span className="text-sm text-gray-200">
                    Informe o endereço completo e localização do imóvel.
                  </span>
                </CardHeader>
                <CardContent className="space-y-6 p-6">
                  <FormField
                    control={form.control}
                    name="fullAddress"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-slate-300">
                          Localização Google Maps *
                        </FormLabel>
                        <FormDescription className="text-xs text-slate-400">
                          Adicione a localização do Google Maps, isso ajuda seus
                          clientes a encontrar o imóvel com mais facilidade e
                          transmite mais confiança na localização.
                        </FormDescription>
                        <FormControl className="border-slate-600 bg-slate-700 text-slate-100 placeholder:text-slate-400">
                          <GoogleMapsInputTraditional
                            onChange={field.onChange}
                            onLocationSelect={(location: {
                              address: string;
                              lat: number;
                              lng: number;
                              placeId: string;
                              mapsUrl: string;
                              embedUrl: string;
                            }) => {
                              // Atualizar todos os campos relacionados ao Google Maps
                              form.setValue("latitude", location.lat);
                              form.setValue("longitude", location.lng);
                              form.setValue("googleMapsUrl", location.mapsUrl);
                              form.setValue("googlePlaceId", location.placeId);
                              form.setValue(
                                "googleMapsEmbedUrl",
                                location.embedUrl,
                              );
                            }}
                            placeholder="Digite o endereço, nome do local ou estabelecimento..."
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="fullAddress"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-slate-300">
                          Endereço Completo *
                        </FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            className="border-slate-600 bg-slate-700 text-slate-100 placeholder:text-slate-400"
                            placeholder="Rua, número, complemento"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="grid grid-cols-2 gap-6">
                    {/* Linha 1 */}
                    <FormField
                      control={form.control}
                      name="neighborhood"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-slate-300">
                            Bairro *
                          </FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              className="border-slate-600 bg-slate-700 text-slate-100 placeholder:text-slate-400"
                              placeholder="Nome do bairro"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="zipCode"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-slate-300">
                            CEP *
                          </FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              className="border-slate-600 bg-slate-700 text-slate-100 placeholder:text-slate-400"
                              placeholder="00000-000"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* Linha 2 */}
                    <FormField
                      control={form.control}
                      name="municipality"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-slate-300">
                            Município *
                          </FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger className="w-full border-slate-600 bg-slate-700 text-slate-100 placeholder:text-slate-400">
                                <SelectValue
                                  className="placeholder:text-slate-400"
                                  placeholder="Selecione o município"
                                />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent className="max-h-60 border-slate-600 bg-slate-700">
                              {cearaMunicipalities.map((municipality) => (
                                <SelectItem
                                  key={municipality}
                                  value={municipality}
                                  className="border-slate-600 bg-slate-700 text-gray-300 hover:selection:text-white"
                                >
                                  {municipality}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="city"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-slate-300">
                            Cidade *
                          </FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              className="border-slate-600 bg-slate-700 text-slate-100 placeholder:text-slate-400"
                              placeholder="Nome da cidade"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* Linha 3 */}
                    <FormField
                      control={form.control}
                      name="state"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-slate-300">
                            Estado *
                          </FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              className="border-slate-600 bg-slate-700 text-slate-100 placeholder:text-slate-400"
                              placeholder="Ex: CE"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="popularDestination"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-slate-300">
                            Destino Popular *
                          </FormLabel>
                          <FormDescription className="text-xs text-slate-400">
                            Selecione se seu imóvel estiver próximo ou em um
                            local turístico popular.
                          </FormDescription>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger className="w-full border-slate-600 bg-slate-700 text-slate-100 placeholder:text-slate-400">
                                <SelectValue placeholder="Selecione um destino" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent className="w-full border-slate-600 bg-slate-700">
                              {popularDestinations.map((destination) => (
                                <SelectItem
                                  key={destination}
                                  value={destination}
                                  className="border-slate-600 bg-slate-700 text-gray-300 hover:selection:text-white"
                                >
                                  {destination}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Imagens */}
              <Card className="border-slate-700/50 bg-slate-800/80 shadow-2xl backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-2xl font-semibold text-slate-100">
                    Imagens do Imóvel
                  </CardTitle>
                  <span className="text-sm text-gray-200">
                    Adicione fotos do imóvel para atrair mais interessados.
                  </span>
                </CardHeader>
                <CardContent className="space-y-4 p-6">
                  <div
                    className="flex items-center gap-4"
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                  >
                    <label className="flex-1 cursor-pointer">
                      <Button
                        type="button"
                        variant="outline"
                        disabled={isUploading}
                        className={`h-24 w-full border-2 border-dashed transition-all duration-200 ${
                          isDragOver
                            ? "border-blue-400 bg-blue-400/10 text-blue-300"
                            : "border-slate-600 bg-slate-700 text-slate-300 hover:bg-slate-600 hover:text-slate-100"
                        }`}
                        asChild
                      >
                        <span className="flex flex-col items-center gap-2">
                          <Camera className="h-6 w-6" />
                          {isUploading
                            ? "Enviando..."
                            : isDragOver
                              ? "Solte as imagens aqui"
                              : "Selecione os arquivos ou arraste aqui"}
                        </span>
                      </Button>
                      <input
                        type="file"
                        accept="image/*"
                        multiple
                        onChange={handleImageUpload}
                        disabled={isUploading}
                        className="hidden"
                      />
                    </label>
                    {isUploading && (
                      <Loader className="h-6 w-6 animate-spin text-blue-400" />
                    )}
                  </div>

                  {uploadedImages.length > 0 && (
                    <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
                      {uploadedImages.map((imageUrl, index) => (
                        <div key={index} className="relative">
                          <Image
                            src={imageUrl}
                            alt={`Imagem ${index + 1}`}
                            width={200}
                            height={150}
                            className="rounded-lg object-cover"
                          />
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            className="absolute -top-2 -right-2 h-9 w-9 rounded-full border-slate-600 bg-slate-700 text-slate-300 hover:bg-slate-600 hover:text-slate-300"
                            onClick={() => removeUploadedImage(index)}
                          >
                            <Trash className="h-3 w-3" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Comodidades */}
              <Card className="border-slate-700/50 bg-slate-800/80 shadow-2xl backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-2xl font-semibold text-slate-100">
                    Comodidades
                  </CardTitle>
                  <span className="text-sm text-gray-200">
                    Selecione as comodidades disponíveis no imóvel.
                  </span>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="space-y-6">
                    {Object.entries(amenitiesByCategory).map(
                      ([category, categoryAmenities]) => (
                        <div key={category}>
                          <h4 className="mb-3 text-lg font-medium text-slate-200">
                            {category}
                          </h4>
                          <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
                            {categoryAmenities.map((amenity) => (
                              <div
                                key={amenity.id}
                                className="flex items-center space-x-2"
                              >
                                <Checkbox
                                  id={`amenity-${amenity.id}`}
                                  checked={selectedAmenities.includes(
                                    amenity.id,
                                  )}
                                  onCheckedChange={(checked) =>
                                    handleAmenityChange(amenity.id, !!checked)
                                  }
                                  className="border-slate-600 data-[state=checked]:bg-blue-600"
                                />
                                <label
                                  htmlFor={`amenity-${amenity.id}`}
                                  className="text-sm text-slate-300"
                                >
                                  {amenity.name}
                                </label>
                              </div>
                            ))}
                          </div>
                        </div>
                      ),
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Regras da Casa */}
              <Card className="border-slate-700/50 bg-slate-800/80 shadow-xl transition-all">
                <CardHeader className="pb-6">
                  <CardTitle className="text-start text-2xl font-bold text-slate-100">
                    Regras da Casa
                  </CardTitle>
                  <CardDescription className="text-start text-slate-100">
                    Defina as regras específicas para seu imóvel. Estes campos
                    são independentes, você pode preencher apenas o que for
                    necessário.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6 pt-6">
                  <div className="grid gap-6 md:grid-cols-2">
                    {/* Entrada (Check-in) */}
                    <FormField
                      control={form.control}
                      name="checkInRule"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="font-semibold text-slate-300">
                            Entrada (Check-in)
                          </FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="Ex: Check-in a partir das 15:00. Apresentar documento de identificação."
                              className="min-h-[100px] border-slate-600 bg-slate-700 text-slate-100 placeholder:text-slate-400"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* Saída (Check-out) */}
                    <FormField
                      control={form.control}
                      name="checkOutRule"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="font-semibold text-slate-300">
                            Saída (Check-out)
                          </FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="Ex: Check-out até às 11:00. Deixar as chaves na portaria."
                              className="min-h-[100px] border-slate-600 bg-slate-700 text-slate-100 placeholder:text-slate-400"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* Cancelamento/Pré-pagamento */}
                    <FormField
                      control={form.control}
                      name="cancellationRule"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="font-semibold text-slate-300">
                            Cancelamento/Pré-pagamento
                          </FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="Ex: Cancelamento gratuito até 7 dias antes da chegada. Pagamento 50% na reserva."
                              className="min-h-[100px] border-slate-600 bg-slate-700 text-slate-100 placeholder:text-slate-400"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* Crianças */}
                    <FormField
                      control={form.control}
                      name="childrenRule"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="font-semibold text-slate-300">
                            Crianças
                          </FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="Ex: Crianças de todas as idades são bem-vindas. Berços disponíveis mediante solicitação."
                              className="min-h-[100px] border-slate-600 bg-slate-700 text-slate-100 placeholder:text-slate-400"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* Pets */}

                    <FormField
                      control={form.control}
                      name="petsRule"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="font-semibold text-slate-300">
                            Pets
                          </FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="Ex: Animais de estimação são permitidos. Taxa adicional pode ser aplicada."
                              className="min-h-[100px] border-slate-600 bg-slate-700 text-slate-100 placeholder:text-slate-400"
                              value={field.value || ""}
                              onChange={field.onChange}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* Festa e Eventos */}

                    <FormField
                      control={form.control}
                      name="partyRule"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="font-semibold text-slate-300">
                            Festa e Eventos
                          </FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="Ex: Festas e eventos são permitidos. Taxa adicional pode ser aplicada."
                              className="min-h-[100px] border-slate-600 bg-slate-700 text-slate-100 placeholder:text-slate-400"
                              value={field.value || ""}
                              onChange={field.onChange}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* Restaurantes */}

                    <FormField
                      control={form.control}
                      name="restaurantRule"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="font-semibold text-slate-300">
                            Restaurantes
                          </FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="Ex: Possuímos restaurantes na instalação. Abre as 6:00 e fecha as 22:00."
                              className="min-h-[100px] border-slate-600 bg-slate-700 text-slate-100 placeholder:text-slate-400"
                              value={field.value || ""}
                              onChange={field.onChange}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* Camas */}
                    <FormField
                      control={form.control}
                      name="bedsRule"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="font-semibold text-slate-300">
                            Camas e Berços
                          </FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="Ex: Camas extras não disponíveis. Berços disponíveis de 0 a 3 anos."
                              className="min-h-[100px] border-slate-600 bg-slate-700 text-slate-100 placeholder:text-slate-400"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* Hora do Silêncio */}
                    <FormField
                      control={form.control}
                      name="silenceRule"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="font-semibold text-slate-300">
                            Hora do Silêncio
                          </FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="Ex: Silêncio absoluto entre 22h e 6h."
                              className="min-h-[100px] border-slate-600 bg-slate-700 text-slate-100 placeholder:text-slate-400"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* Restrições de Idade */}
                    <FormField
                      control={form.control}
                      name="ageRestrictionRule"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="font-semibold text-slate-300">
                            Restrições de Idade
                          </FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="Ex: Idade mínima para check-in: 18 anos. Menores devem estar acompanhados."
                              className="min-h-[100px] border-slate-600 bg-slate-700 text-slate-100 placeholder:text-slate-400"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* Grupos */}
                    <FormField
                      control={form.control}
                      name="groupsRule"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="font-semibold text-slate-300">
                            Grupos
                          </FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="Ex: Grupos de até 8 pessoas são aceitos. Festas não são permitidas. Silêncio após 22h."
                              className="min-h-[100px] border-slate-600 bg-slate-700 text-slate-100 placeholder:text-slate-400"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  {/* Métodos de Pagamento */}
                  <div className="">
                    <h3 className="font-semibold text-slate-300">
                      Cartões aceitos neste imóvel
                    </h3>
                    <p className="mb-4 text-xs text-slate-400">
                      Selecione as bandeiras dos cartões que são aceitos para
                      pagamento neste imóvel, caso seu imóvel não aceite
                      dinheiro, deixe em branco.
                    </p>
                    <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
                      <FormField
                        control={form.control}
                        name="acceptsVisa"
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-start space-y-0 space-x-3">
                            <FormControl>
                              <Checkbox
                                checked={field.value}
                                onCheckedChange={field.onChange}
                                className="border-slate-600 data-[state=checked]:bg-blue-600"
                              />
                            </FormControl>
                            <FormLabel className="text-sm font-normal text-slate-300">
                              Visa
                            </FormLabel>
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="acceptsAmericanExpress"
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-start space-y-0 space-x-3">
                            <FormControl>
                              <Checkbox
                                checked={field.value}
                                onCheckedChange={field.onChange}
                                className="border-slate-600 data-[state=checked]:bg-blue-600"
                              />
                            </FormControl>
                            <FormLabel className="text-sm font-normal text-slate-300">
                              American Express
                            </FormLabel>
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="acceptsMasterCard"
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-start space-y-0 space-x-3">
                            <FormControl>
                              <Checkbox
                                checked={field.value}
                                onCheckedChange={field.onChange}
                                className="border-slate-600 data-[state=checked]:bg-blue-600"
                              />
                            </FormControl>
                            <FormLabel className="text-sm font-normal text-slate-300">
                              Master Card
                            </FormLabel>
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="acceptsMaestro"
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-start space-y-0 space-x-3">
                            <FormControl>
                              <Checkbox
                                checked={field.value}
                                onCheckedChange={field.onChange}
                                className="border-slate-600 data-[state=checked]:bg-blue-600"
                              />
                            </FormControl>
                            <FormLabel className="text-sm font-normal text-slate-300">
                              Maestro
                            </FormLabel>
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="acceptsElo"
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-start space-y-0 space-x-3">
                            <FormControl>
                              <Checkbox
                                checked={field.value}
                                onCheckedChange={field.onChange}
                                className="border-slate-600 data-[state=checked]:bg-blue-600"
                              />
                            </FormControl>
                            <FormLabel className="text-sm font-normal text-slate-300">
                              Elo
                            </FormLabel>
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="acceptsDinersClub"
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-start space-y-0 space-x-3">
                            <FormControl>
                              <Checkbox
                                checked={field.value}
                                onCheckedChange={field.onChange}
                                className="border-slate-600 data-[state=checked]:bg-blue-600"
                              />
                            </FormControl>
                            <FormLabel className="text-sm font-normal text-slate-300">
                              Diners Club
                            </FormLabel>
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="acceptsPix"
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-start space-y-0 space-x-3">
                            <FormControl>
                              <Checkbox
                                checked={field.value}
                                onCheckedChange={field.onChange}
                                className="border-slate-600 data-[state=checked]:bg-blue-600"
                              />
                            </FormControl>
                            <FormLabel className="text-sm font-normal text-slate-300">
                              Pix
                            </FormLabel>
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="acceptsCash"
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-start space-y-0 space-x-3">
                            <FormControl>
                              <Checkbox
                                checked={field.value}
                                onCheckedChange={field.onChange}
                                className="border-slate-600 data-[state=checked]:bg-blue-600"
                              />
                            </FormControl>
                            <FormLabel className="text-sm font-normal text-slate-300">
                              Dinheiro
                            </FormLabel>
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Tipos de Apartamentos do Imóvel */}
              <Card className="border-slate-700/50 bg-slate-800/80 shadow-2xl backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-xl font-bold text-gray-100">
                    Tipos de Apartamentos do Imóvel
                  </CardTitle>
                  <CardDescription className="text-slate-300">
                    Configure os diferentes tipos de apartamentos disponíveis no
                    imóvel
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6 p-6">
                  <FormField
                    control={form.control}
                    name="apartments"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-base font-semibold text-gray-200">
                          Apartamentos
                        </FormLabel>
                        <div className="space-y-6">
                          {(field.value || []).map(
                            (apartment, apartmentIndex) => (
                              <Card
                                key={apartmentIndex}
                                className="border-slate-600/50 bg-slate-700/30"
                              >
                                <CardHeader className="pb-4">
                                  <div className="flex items-center justify-between">
                                    <CardTitle className="text-lg text-gray-100">
                                      Apartamento {apartmentIndex + 1}
                                    </CardTitle>
                                    {(field.value || []).length > 1 && (
                                      <Button
                                        type="button"
                                        variant="outline"
                                        size="sm"
                                        onClick={() => {
                                          const newApartments = (
                                            field.value || []
                                          ).filter(
                                            (_, index) =>
                                              index !== apartmentIndex,
                                          );
                                          field.onChange(newApartments);
                                        }}
                                        className="border-slate-600 bg-slate-700 text-slate-300 hover:bg-slate-600 hover:text-slate-300"
                                      >
                                        <Trash className="h-4 w-4" />
                                      </Button>
                                    )}
                                  </div>
                                </CardHeader>
                                <CardContent className="space-y-6">
                                  {/* Nome do Apartamento */}
                                  <div>
                                    <FormLabel className="text-sm font-medium text-gray-200">
                                      Nome do Apartamento *
                                    </FormLabel>
                                    <FormControl>
                                      <Input
                                        placeholder="Ex: Apartamento Vista Mar"
                                        value={apartment.name}
                                        onChange={(e) => {
                                          const newApartments = [
                                            ...(field.value || []),
                                          ];
                                          newApartments[apartmentIndex].name =
                                            e.target.value;
                                          field.onChange(newApartments);
                                        }}
                                        className="mt-1 border-slate-600 bg-slate-700/50 text-gray-100 placeholder:text-slate-400"
                                      />
                                    </FormControl>
                                  </div>

                                  {/* Quartos */}
                                  <div className="space-y-4">
                                    <div className="flex items-center justify-between">
                                      <FormLabel className="text-sm font-medium text-gray-200">
                                        <BedDouble className="mr-2 inline h-4 w-4" />
                                        Quartos *
                                      </FormLabel>
                                      <Button
                                        type="button"
                                        variant="outline"
                                        size="sm"
                                        onClick={() => {
                                          const newApartments = [
                                            ...(field.value || []),
                                          ];
                                          const roomNumber =
                                            apartment.rooms.length + 1;
                                          newApartments[
                                            apartmentIndex
                                          ].rooms.push({
                                            roomNumber,
                                            doubleBeds: 0,
                                            largeBeds: 0,
                                            extraLargeBeds: 0,
                                            singleBeds: 0,
                                            sofaBeds: 0,
                                          });
                                          field.onChange(newApartments);
                                        }}
                                        className="border-slate-600 bg-slate-700 text-slate-300 hover:bg-slate-600 hover:text-slate-300"
                                      >
                                        <Plus className="mr-2 h-4 w-4" />
                                        Adicionar Quarto
                                      </Button>
                                    </div>

                                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                                      {apartment.rooms.map(
                                        (room, roomIndex) => (
                                          <Card
                                            key={roomIndex}
                                            className="border-slate-500/30 bg-slate-600/20"
                                          >
                                            <CardContent className="p-4">
                                              <div className="mb-3 flex items-center justify-between">
                                                <h4 className="text-sm font-medium text-gray-200">
                                                  Quarto {room.roomNumber}
                                                </h4>
                                                {apartment.rooms.length > 1 && (
                                                  <Button
                                                    type="button"
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={() => {
                                                      const newApartments = [
                                                        ...(field.value || []),
                                                      ];
                                                      newApartments[
                                                        apartmentIndex
                                                      ].rooms =
                                                        apartment.rooms.filter(
                                                          (_, index) =>
                                                            index !== roomIndex,
                                                        );
                                                      // Renumerar quartos
                                                      newApartments[
                                                        apartmentIndex
                                                      ].rooms.forEach(
                                                        (
                                                          room: {
                                                            roomNumber: number;
                                                          },
                                                          i: number,
                                                        ) => {
                                                          room.roomNumber =
                                                            i + 1;
                                                        },
                                                      );
                                                      field.onChange(
                                                        newApartments,
                                                      );
                                                    }}
                                                    className="border-slate-600 bg-slate-700 text-slate-300 hover:bg-slate-600 hover:text-slate-300"
                                                  >
                                                    <Trash className="h-3 w-3" />
                                                  </Button>
                                                )}
                                              </div>

                                              <div className="grid grid-cols-2 gap-4">
                                                <div>
                                                  <FormLabel className="text-xs text-gray-300">
                                                    Camas de Casal
                                                  </FormLabel>
                                                  <Select
                                                    value={(
                                                      room.doubleBeds || 0
                                                    ).toString()}
                                                    onValueChange={(value) => {
                                                      const newApartments = [
                                                        ...(field.value || []),
                                                      ];
                                                      newApartments[
                                                        apartmentIndex
                                                      ].rooms[
                                                        roomIndex
                                                      ].doubleBeds =
                                                        parseInt(value);
                                                      field.onChange(
                                                        newApartments,
                                                      );
                                                    }}
                                                  >
                                                    <SelectTrigger className="mt-1 border-slate-600 bg-slate-700/50 text-gray-100">
                                                      <SelectValue />
                                                    </SelectTrigger>
                                                    <SelectContent className="border-slate-600 bg-slate-700">
                                                      {[0, 1, 2, 3, 4, 5].map(
                                                        (num) => (
                                                          <SelectItem
                                                            className="border-slate-600 bg-slate-700 text-gray-300 hover:selection:text-white"
                                                            key={num}
                                                            value={num.toString()}
                                                          >
                                                            {num}
                                                          </SelectItem>
                                                        ),
                                                      )}
                                                    </SelectContent>
                                                  </Select>
                                                </div>

                                                <div>
                                                  <FormLabel className="text-xs text-gray-300">
                                                    Camas de Casal Grande
                                                  </FormLabel>
                                                  <Select
                                                    value={(
                                                      room.largeBeds || 0
                                                    ).toString()}
                                                    onValueChange={(value) => {
                                                      const newApartments = [
                                                        ...(field.value || []),
                                                      ];
                                                      newApartments[
                                                        apartmentIndex
                                                      ].rooms[
                                                        roomIndex
                                                      ].largeBeds =
                                                        parseInt(value);
                                                      field.onChange(
                                                        newApartments,
                                                      );
                                                    }}
                                                  >
                                                    <SelectTrigger className="mt-1 border-slate-600 bg-slate-700/50 text-gray-100">
                                                      <SelectValue />
                                                    </SelectTrigger>
                                                    <SelectContent className="border-slate-600 bg-slate-700">
                                                      {[0, 1, 2, 3, 4, 5].map(
                                                        (num) => (
                                                          <SelectItem
                                                            className="border-slate-600 bg-slate-700 text-gray-300 hover:selection:text-white"
                                                            key={num}
                                                            value={num.toString()}
                                                          >
                                                            {num}
                                                          </SelectItem>
                                                        ),
                                                      )}
                                                    </SelectContent>
                                                  </Select>
                                                </div>

                                                <div>
                                                  <FormLabel className="text-xs text-gray-300">
                                                    Camas de Casal Extra-Grande
                                                  </FormLabel>
                                                  <Select
                                                    value={(
                                                      room.extraLargeBeds || 0
                                                    ).toString()}
                                                    onValueChange={(value) => {
                                                      const newApartments = [
                                                        ...(field.value || []),
                                                      ];
                                                      newApartments[
                                                        apartmentIndex
                                                      ].rooms[
                                                        roomIndex
                                                      ].extraLargeBeds =
                                                        parseInt(value);
                                                      field.onChange(
                                                        newApartments,
                                                      );
                                                    }}
                                                  >
                                                    <SelectTrigger className="mt-1 border-slate-600 bg-slate-700/50 text-gray-100">
                                                      <SelectValue />
                                                    </SelectTrigger>
                                                    <SelectContent className="border-slate-600 bg-slate-700">
                                                      {[0, 1, 2, 3, 4, 5].map(
                                                        (num) => (
                                                          <SelectItem
                                                            className="border-slate-600 bg-slate-700 text-gray-300 hover:selection:text-white"
                                                            key={num}
                                                            value={num.toString()}
                                                          >
                                                            {num}
                                                          </SelectItem>
                                                        ),
                                                      )}
                                                    </SelectContent>
                                                  </Select>
                                                </div>

                                                <div>
                                                  <FormLabel className="text-xs text-gray-300">
                                                    Camas de Solteiro
                                                  </FormLabel>
                                                  <Select
                                                    value={(
                                                      room.singleBeds || 0
                                                    ).toString()}
                                                    onValueChange={(value) => {
                                                      const newApartments = [
                                                        ...(field.value || []),
                                                      ];
                                                      newApartments[
                                                        apartmentIndex
                                                      ].rooms[
                                                        roomIndex
                                                      ].singleBeds =
                                                        parseInt(value);
                                                      field.onChange(
                                                        newApartments,
                                                      );
                                                    }}
                                                  >
                                                    <SelectTrigger className="mt-1 border-slate-600 bg-slate-700/50 text-gray-100">
                                                      <SelectValue />
                                                    </SelectTrigger>
                                                    <SelectContent className="border-slate-600 bg-slate-700">
                                                      {[0, 1, 2, 3, 4, 5].map(
                                                        (num) => (
                                                          <SelectItem
                                                            className="border-slate-600 bg-slate-700 text-gray-300 hover:selection:text-white"
                                                            key={num}
                                                            value={num.toString()}
                                                          >
                                                            {num}
                                                          </SelectItem>
                                                        ),
                                                      )}
                                                    </SelectContent>
                                                  </Select>
                                                </div>
                                              </div>
                                            </CardContent>
                                          </Card>
                                        ),
                                      )}
                                    </div>
                                  </div>

                                  {/* Outros Cômodos - Grid 3x2 (Desktop) / Flex Column (Mobile) */}
                                  <div className="space-y-6">
                                    {/* Primeira linha: 3 colunas */}
                                    <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                                      {/* Banheiros */}
                                      <div>
                                        <FormLabel className="text-sm font-medium text-gray-200">
                                          <ShowerHead className="mr-2 inline h-4 w-4" />
                                          Quantidade de Banheiros
                                        </FormLabel>
                                        <Select
                                          value={(
                                            apartment.totalBathrooms || 0
                                          ).toString()}
                                          onValueChange={(value) => {
                                            const newApartments = [
                                              ...(field.value || []),
                                            ];
                                            newApartments[
                                              apartmentIndex
                                            ].totalBathrooms = parseInt(value);
                                            field.onChange(newApartments);
                                          }}
                                        >
                                          <SelectTrigger className="mt-1 border-slate-600 bg-slate-700/50 text-gray-100">
                                            <SelectValue placeholder="Selecione a quantidade" />
                                          </SelectTrigger>
                                          <SelectContent className="border-slate-600 bg-slate-700">
                                            {[
                                              0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10,
                                            ].map((num) => (
                                              <SelectItem
                                                className="border-slate-600 bg-slate-700 text-gray-300 hover:selection:text-white"
                                                key={num}
                                                value={num.toString()}
                                              >
                                                {num}{" "}
                                                {num === 1
                                                  ? "banheiro"
                                                  : "banheiros"}
                                              </SelectItem>
                                            ))}
                                          </SelectContent>
                                        </Select>
                                      </div>

                                      {/* Sala de Estar */}
                                      <div className="space-y-3">
                                        <FormLabel className="text-sm font-medium text-gray-200">
                                          <Sofa className="mr-2 inline h-4 w-4" />
                                          Sala de Estar
                                        </FormLabel>
                                        <div className="flex items-center space-x-2">
                                          <Checkbox
                                            checked={apartment.hasLivingRoom}
                                            onCheckedChange={(checked) => {
                                              const newApartments = [
                                                ...(field.value || []),
                                              ];
                                              newApartments[
                                                apartmentIndex
                                              ].hasLivingRoom = !!checked;
                                              if (!checked) {
                                                newApartments[
                                                  apartmentIndex
                                                ].livingRoomHasSofaBed = false;
                                              }
                                              field.onChange(newApartments);
                                            }}
                                            className="border-slate-600 data-[state=checked]:bg-blue-600"
                                          />
                                          <span className="text-sm text-slate-300">
                                            Possui sala de estar
                                          </span>
                                        </div>

                                        {apartment.hasLivingRoom && (
                                          <div className="ml-6 flex items-center space-x-2">
                                            <Checkbox
                                              checked={
                                                apartment.livingRoomHasSofaBed
                                              }
                                              onCheckedChange={(checked) => {
                                                const newApartments = [
                                                  ...(field.value || []),
                                                ];
                                                newApartments[
                                                  apartmentIndex
                                                ].livingRoomHasSofaBed =
                                                  !!checked;
                                                field.onChange(newApartments);
                                              }}
                                              className="border-slate-600 data-[state=checked]:bg-blue-600"
                                            />
                                            <span className="text-sm text-slate-300">
                                              Com sofá-cama
                                            </span>
                                          </div>
                                        )}
                                      </div>

                                      {/* Cozinha */}
                                      <div className="space-y-3">
                                        <FormLabel className="text-sm font-medium text-gray-200">
                                          <ChefHat className="mr-2 inline h-4 w-4" />
                                          Cozinha
                                        </FormLabel>
                                        <div className="flex items-center space-x-2">
                                          <Checkbox
                                            checked={apartment.hasKitchen}
                                            onCheckedChange={(checked) => {
                                              const newApartments = [
                                                ...(field.value || []),
                                              ];
                                              newApartments[
                                                apartmentIndex
                                              ].hasKitchen = !!checked;
                                              if (!checked) {
                                                newApartments[
                                                  apartmentIndex
                                                ].kitchenHasStove = false;
                                                newApartments[
                                                  apartmentIndex
                                                ].kitchenHasFridge = false;
                                                newApartments[
                                                  apartmentIndex
                                                ].kitchenHasMinibar = false;
                                              }
                                              field.onChange(newApartments);
                                            }}
                                            className="border-slate-600 data-[state=checked]:bg-blue-600"
                                          />
                                          <span className="text-sm text-slate-300">
                                            Possui cozinha
                                          </span>
                                        </div>

                                        {apartment.hasKitchen && (
                                          <div className="ml-6 space-y-2">
                                            <div className="flex items-center space-x-2">
                                              <Checkbox
                                                checked={
                                                  apartment.kitchenHasStove
                                                }
                                                onCheckedChange={(checked) => {
                                                  const newApartments = [
                                                    ...(field.value || []),
                                                  ];
                                                  newApartments[
                                                    apartmentIndex
                                                  ].kitchenHasStove = !!checked;
                                                  field.onChange(newApartments);
                                                }}
                                                className="border-slate-600 data-[state=checked]:bg-blue-600"
                                              />
                                              <span className="text-sm text-slate-300">
                                                Fogão
                                              </span>
                                            </div>
                                            <div className="flex items-center space-x-2">
                                              <Checkbox
                                                checked={
                                                  apartment.kitchenHasFridge
                                                }
                                                onCheckedChange={(checked) => {
                                                  const newApartments = [
                                                    ...(field.value || []),
                                                  ];
                                                  newApartments[
                                                    apartmentIndex
                                                  ].kitchenHasFridge =
                                                    !!checked;
                                                  field.onChange(newApartments);
                                                }}
                                                className="border-slate-600 data-[state=checked]:bg-blue-600"
                                              />
                                              <span className="text-sm text-slate-300">
                                                Geladeira
                                              </span>
                                            </div>
                                            <div className="flex items-center space-x-2">
                                              <Checkbox
                                                checked={
                                                  apartment.kitchenHasMinibar
                                                }
                                                onCheckedChange={(checked) => {
                                                  const newApartments = [
                                                    ...(field.value || []),
                                                  ];
                                                  newApartments[
                                                    apartmentIndex
                                                  ].kitchenHasMinibar =
                                                    !!checked;
                                                  field.onChange(newApartments);
                                                }}
                                                className="border-slate-600 data-[state=checked]:bg-blue-600"
                                              />
                                              <span className="text-sm text-slate-300">
                                                Frigobar
                                              </span>
                                            </div>
                                          </div>
                                        )}
                                      </div>
                                    </div>

                                    {/* Segunda linha: 2 colunas centralizadas */}
                                    <div className="grid grid-cols-1 gap-6 md:mx-auto md:max-w-2xl md:grid-cols-3">
                                      {/* Capacidade de Hóspedes */}
                                      <div>
                                        <FormLabel className="text-sm font-medium text-gray-200">
                                          <Users className="mr-2 inline h-4 w-4" />
                                          Capacidade Max. de Hóspedes
                                        </FormLabel>
                                        <FormDescription className="text-xs text-gray-400">
                                          Número máximo recomendado de hóspedes
                                          que o apartamento acomoda
                                          confortavelmente.
                                        </FormDescription>
                                        <div className="flex gap-3">
                                          {/* Adultos */}
                                          <div className="flex-1">
                                            <FormLabel className="text-xs text-gray-400">
                                              Adultos
                                            </FormLabel>
                                            <Select
                                              value={(
                                                apartment.maxAdults || 0
                                              ).toString()}
                                              onValueChange={(value) => {
                                                const newApartments = [
                                                  ...(field.value || []),
                                                ];
                                                newApartments[
                                                  apartmentIndex
                                                ].maxAdults = parseInt(value);
                                                field.onChange(newApartments);
                                              }}
                                            >
                                              <SelectTrigger className="mt-1 border-slate-600 bg-slate-700/50 text-gray-100">
                                                <SelectValue placeholder="0" />
                                              </SelectTrigger>
                                              <SelectContent className="border-slate-600 bg-slate-700">
                                                {[
                                                  0, 1, 2, 3, 4, 5, 6, 7, 8, 9,
                                                  10,
                                                ].map((num) => (
                                                  <SelectItem
                                                    className="border-slate-600 bg-slate-700 text-gray-300 hover:selection:text-white"
                                                    key={`adults-${apartmentIndex}-${num}`}
                                                    value={num.toString()}
                                                  >
                                                    {num}
                                                  </SelectItem>
                                                ))}
                                              </SelectContent>
                                            </Select>
                                          </div>

                                          {/* Crianças */}
                                          <div className="flex-1">
                                            <FormLabel className="text-xs text-gray-400">
                                              Crianças
                                            </FormLabel>
                                            <Select
                                              value={(
                                                apartment.maxChildren || 0
                                              ).toString()}
                                              onValueChange={(value) => {
                                                const newApartments = [
                                                  ...(field.value || []),
                                                ];
                                                newApartments[
                                                  apartmentIndex
                                                ].maxChildren = parseInt(value);
                                                field.onChange(newApartments);
                                              }}
                                            >
                                              <SelectTrigger className="mt-1 border-slate-600 bg-slate-700/50 text-gray-100">
                                                <SelectValue placeholder="0" />
                                              </SelectTrigger>
                                              <SelectContent className="border-slate-600 bg-slate-700">
                                                {[
                                                  0, 1, 2, 3, 4, 5, 6, 7, 8, 9,
                                                  10,
                                                ].map((num) => (
                                                  <SelectItem
                                                    className="border-slate-600 bg-slate-700 text-gray-300 hover:selection:text-white"
                                                    key={`children-${apartmentIndex}-${num}`}
                                                    value={num.toString()}
                                                  >
                                                    {num}
                                                  </SelectItem>
                                                ))}
                                              </SelectContent>
                                            </Select>
                                          </div>
                                        </div>
                                      </div>
                                      {/* Varanda */}
                                      <div className="space-y-3">
                                        <FormLabel className="text-sm font-medium text-gray-200">
                                          <Eye className="mr-2 inline h-4 w-4" />
                                          Varanda
                                        </FormLabel>
                                        <div className="flex items-center space-x-2">
                                          <Checkbox
                                            checked={apartment.hasBalcony}
                                            onCheckedChange={(checked) => {
                                              const newApartments = [
                                                ...(field.value || []),
                                              ];
                                              newApartments[
                                                apartmentIndex
                                              ].hasBalcony = !!checked;
                                              if (!checked) {
                                                newApartments[
                                                  apartmentIndex
                                                ].balconyHasSeaView = false;
                                              }
                                              field.onChange(newApartments);
                                            }}
                                            className="border-slate-600 data-[state=checked]:bg-blue-600"
                                          />
                                          <span className="text-sm text-slate-300">
                                            Possui varanda
                                          </span>
                                        </div>

                                        {apartment.hasBalcony && (
                                          <div className="ml-6 flex items-center space-x-2">
                                            <Checkbox
                                              checked={
                                                apartment.balconyHasSeaView
                                              }
                                              onCheckedChange={(checked) => {
                                                const newApartments = [
                                                  ...(field.value || []),
                                                ];
                                                newApartments[
                                                  apartmentIndex
                                                ].balconyHasSeaView = !!checked;
                                                field.onChange(newApartments);
                                              }}
                                              className="border-slate-600 data-[state=checked]:bg-blue-600"
                                            />
                                            <span className="text-sm text-slate-300">
                                              Com vista para o mar
                                            </span>
                                          </div>
                                        )}
                                      </div>

                                      {/* Berço */}
                                      <div className="space-y-3">
                                        <FormLabel className="text-sm font-medium text-gray-200">
                                          Berço
                                        </FormLabel>
                                        <div className="flex items-center space-x-2">
                                          <Checkbox
                                            checked={apartment.hasCrib}
                                            onCheckedChange={(checked) => {
                                              const newApartments = [
                                                ...(field.value || []),
                                              ];
                                              newApartments[
                                                apartmentIndex
                                              ].hasCrib = !!checked;
                                              field.onChange(newApartments);
                                            }}
                                            className="border-slate-600 data-[state=checked]:bg-blue-600"
                                          />
                                          <span className="text-sm text-slate-300">
                                            Berço disponível
                                          </span>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </CardContent>
                              </Card>
                            ),
                          )}

                          <Button
                            type="button"
                            variant="outline"
                            onClick={() => {
                              const newApartment = {
                                name: "",
                                totalBathrooms: 0,
                                hasLivingRoom: false,
                                livingRoomHasSofaBed: false,
                                hasKitchen: false,
                                kitchenHasStove: false,
                                kitchenHasFridge: false,
                                kitchenHasMinibar: false,
                                hasBalcony: false,
                                balconyHasSeaView: false,
                                hasCrib: false,
                                rooms: [
                                  {
                                    roomNumber: 1,
                                    doubleBeds: 0,
                                    singleBeds: 0,
                                  },
                                ],
                              };
                              field.onChange([
                                ...(field.value || []),
                                newApartment,
                              ]);
                            }}
                            className="w-auto border-slate-600 bg-slate-700 text-slate-300 hover:bg-slate-600 hover:text-slate-300"
                          >
                            <Plus className="mr-2 h-4 w-4" />
                            Adicionar Novo Tipo de Apartamento
                          </Button>
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>

              {/* Botão de Envio */}
              <div className="flex justify-center pt-8">
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="transform rounded-lg bg-[#182334] px-12 py-6 text-lg font-semibold text-white shadow-xl transition-all duration-500 hover:scale-[1.02] hover:bg-[#182334] hover:shadow-2xl disabled:transform-none disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <Loader className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <Plus className="mr-2 h-4 w-4" />
                  )}
                  {isSubmitting ? "Cadastrando..." : "Cadastrar Imóvel"}
                </Button>
              </div>
            </form>
          </Form>
        </div>
      </div>
    </>
  );
}
