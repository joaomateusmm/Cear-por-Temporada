"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft, Loader, Plus, SquareCheck, SquareX, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import * as z from "zod";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
  getAmenities,
  getPropertyById,
  getPropertyClasses,
  type PropertyFormData,
  updateProperty,
} from "@/lib/property-actions";

const propertyFormSchema = z.object({
  // Dados básicos
  title: z.string().min(3, "Título deve ter pelo menos 3 caracteres"),
  shortDescription: z
    .string()
    .min(10, "Descrição deve ter pelo menos 10 caracteres"),
  fullDescription: z
    .string()
    .min(10, "Descrição deve ter pelo menos 10 caracteres"),
  nearbyRegion: z.string().optional(),
  aboutBuilding: z.string().optional(),
  maxGuests: z.number().min(1, "Deve aceitar pelo menos 1 hóspede"),
  bedrooms: z.number().min(0, "Número de quartos inválido"),
  bathrooms: z.number().min(1, "Deve ter pelo menos 1 banheiro"),
  parkingSpaces: z.number().min(0, "Número de vagas inválido").optional(),
  areaM2: z.number().optional(),
  allowsPets: z.boolean(),
  propertyStyle: z.string().min(1, "Selecione o tipo do imóvel"),
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
  popularDestination: z.string().min(1, "Selecione um destino popular"),

  // Comodidades
  amenities: z.array(z.number()).optional(),

  // Imagens
  images: z.array(z.string()).optional(),
});

type PropertyFormValues = z.infer<typeof propertyFormSchema>;

interface EditPropertyPageProps {
  params: Promise<{
    adminId: string;
    propertyId: string;
  }>;
}

export default function EditPropertyPage({ params }: EditPropertyPageProps) {
  const router = useRouter();
  const [adminId, setAdminId] = useState<string>("");
  const [propertyId, setPropertyId] = useState<string>("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [amenities, setAmenities] = useState<
    Array<{ id: number; name: string; category: string }>
  >([]);
  const [propertyClassesList, setPropertyClassesList] = useState<
    Array<{ id: number; name: string; description: string | null }>
  >([]);
  const [uploadedImages, setUploadedImages] = useState<string[]>([]);

  const form = useForm({
    resolver: zodResolver(propertyFormSchema),
    defaultValues: {
      title: "",
      shortDescription: "",
      fullDescription: "",
      nearbyRegion: "",
      aboutBuilding: "",
      maxGuests: 1,
      bedrooms: 1,
      bathrooms: 1,
      parkingSpaces: undefined,
      areaM2: undefined,
      allowsPets: false,
      propertyStyle: "",
      propertyClasses: [],
      minimumStay: 1,
      maximumStay: 30,
      checkInTime: "15:00",
      checkOutTime: "11:00",
      monthlyRent: 0,
      dailyRate: 0,
      condominiumFee: 0,
      iptuFee: 0,
      monthlyCleaningFee: 0,
      otherFees: 0,
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
      latitude: undefined,
      longitude: undefined,
      amenities: [],
      images: [],
    },
  });

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

  useEffect(() => {
    const loadData = async () => {
      try {
        const resolvedParams = await params;
        const { adminId: id, propertyId: propId } = resolvedParams;
        setAdminId(id);
        setPropertyId(propId);

        // Carregar comodidades
        const amenitiesData = await getAmenities();
        setAmenities(amenitiesData);

        // Carregar classes de imóveis
        const classesData = await getPropertyClasses();
        setPropertyClassesList(classesData);

        // Carregar dados do imóvel
        const property = await getPropertyById(propId);
        if (!property) {
          toast.error("Imóvel não encontrado");
          router.push(`/admin/${id}/properties`);
          return;
        }

        // Preencher o formulário com os dados do imóvel
        form.reset({
          title: property.title || "",
          shortDescription: property.shortDescription || "",
          fullDescription: property.fullDescription || "",
          maxGuests: property.maxGuests || 1,
          bedrooms: property.bedrooms || 1,
          bathrooms: property.bathrooms || 1,
          parkingSpaces: property.parkingSpaces || 0,
          areaM2: property.areaM2 ? Number(property.areaM2) : undefined,
          allowsPets: property.allowsPets || false,
          propertyStyle: property.propertyStyle || "",
          propertyClasses:
            property.classes?.map((c: { classId: number }) =>
              c.classId.toString(),
            ) || [],
          minimumStay: property.minimumStay || 1,
          maximumStay: property.maximumStay || 30,
          checkInTime: property.checkInTime || "15:00",
          checkOutTime: property.checkOutTime || "11:00",
          monthlyRent: property.pricing?.monthlyRent
            ? Number(property.pricing.monthlyRent)
            : 0,
          dailyRate: Number(property.pricing?.dailyRate) || 0,
          condominiumFee: property.pricing?.condominiumFee
            ? Number(property.pricing.condominiumFee)
            : 0,
          iptuFee: property.pricing?.iptuFee
            ? Number(property.pricing.iptuFee)
            : 0,
          monthlyCleaningFee: property.pricing?.monthlyCleaningFee
            ? Number(property.pricing.monthlyCleaningFee)
            : 0,
          otherFees: property.pricing?.otherFees
            ? Number(property.pricing.otherFees)
            : 0,
          includesKitchenUtensils:
            property.pricing?.includesKitchenUtensils || false,
          includesFurniture: property.pricing?.includesFurniture || false,
          includesElectricity: property.pricing?.includesElectricity || false,
          includesInternet: property.pricing?.includesInternet || false,
          includesLinens: property.pricing?.includesLinens || false,
          includesWater: property.pricing?.includesWater || false,
          fullAddress: property.location?.fullAddress || "",
          neighborhood: property.location?.neighborhood || "",
          municipality: property.location?.municipality || "",
          city: property.location?.city || "",
          state: property.location?.state || "",
          zipCode: property.location?.zipCode || "",
          latitude: property.location?.latitude
            ? Number(property.location.latitude)
            : undefined,
          longitude: property.location?.longitude
            ? Number(property.location.longitude)
            : undefined,
          popularDestination:
            (property.location as { popularDestination?: string })
              ?.popularDestination || "Nenhum dos anteriores",
          amenities:
            property.amenities?.map(
              (a: { amenityId: number }) => a.amenityId,
            ) || [],
          images:
            property.images?.map((img: { imageUrl: string }) => img.imageUrl) ||
            [],
        });

        // Definir imagens
        setUploadedImages(
          property.images?.map((img: { imageUrl: string }) => img.imageUrl) ||
            [],
        );
      } catch (error) {
        console.error("Erro ao carregar dados:", error);
        toast.error("Erro ao carregar dados do imóvel");
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [params, form, router]);

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
        form.setValue("images", [...uploadedImages, ...result.files]);
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
    const newImages = uploadedImages.filter((_, i) => i !== index);
    setUploadedImages(newImages);
    form.setValue("images", newImages);
  };

  const onSubmit = async (data: PropertyFormValues) => {
    setIsSubmitting(true);

    try {
      const propertyData: PropertyFormData = {
        ...data,
        parkingSpaces: data.parkingSpaces || 0,
        amenities: data.amenities || [],
        images: uploadedImages,
      };

      const result = await updateProperty(propertyId, propertyData);

      if (result.success) {
        toast.success("Imóvel atualizado com sucesso!");
        router.push(`/admin/${adminId}/properties`);
      } else {
        toast.error(result.error || "Erro ao atualizar imóvel");
      }
    } catch (error) {
      console.error("Erro ao atualizar imóvel:", error);
      toast.error("Erro inesperado ao atualizar imóvel");
    } finally {
      setIsSubmitting(false);
    }
  };

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

  if (isLoading) {
    return (
      <div className="mt-30 flex items-center justify-center py-12">
        <div className="text-center">
          <div className="mx-auto h-8 w-8 animate-spin rounded-full border-b-2 border-slate-400"></div>
          <p className="mt-2 text-slate-300">Carregando dados do imóvel...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="relative min-h-screen">
        {/* Background Image - Fixed */}
        <div
          className="fixed inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: "url('/assets/hero-background.jpg')",
            backgroundAttachment: "fixed",
          }}
        >
          <div className="absolute inset-0 bg-black/60"></div>
        </div>

        {/* Content */}
        <div className="relative z-10 px-4 py-8 pb-16 sm:px-6 lg:px-52">
          <div className="mb-8 flex items-center gap-4">
            <Link href={`/admin/${adminId}/properties`}>
              <Button
                size="sm"
                className="border-blue-400/30 bg-blue-500/10 text-blue-300 backdrop-blur-sm transition-all duration-200 hover:border-blue-400 hover:bg-blue-500/20"
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Voltar
              </Button>
            </Link>
            <div className="ml-10">
              <h1 className="text-4xl font-bold text-white">Editar Imóvel</h1>
              <p className="mt-2 text-gray-200">
                Modifique as informações do imóvel cadastrado
              </p>
            </div>
          </div>

          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="mx-auto max-w-4xl space-y-8"
            >
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
                          <FormLabel className="text-sm font-medium text-slate-200">
                            Título do Anúncio
                          </FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              className="border-slate-600 bg-slate-700/50 text-slate-100 transition-colors placeholder:text-slate-400 focus:border-blue-400 focus:ring-blue-400/20"
                              placeholder="Ex: Apartamento 3 quartos com vista para o mar"
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
                        <FormItem>
                          <FormLabel className="text-sm font-medium text-slate-200">
                            Tipo do Imóvel
                          </FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            value={field.value}
                          >
                            <FormControl>
                              <SelectTrigger className="border-slate-600 bg-slate-700/50 text-slate-100 transition-colors focus:border-blue-400 focus:ring-blue-400/20">
                                <SelectValue placeholder="Selecione o tipo" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {["Apartamento", "Casa"].map((propertyType) => (
                                <SelectItem
                                  key={propertyType}
                                  value={propertyType}
                                >
                                  {propertyType}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="propertyClasses"
                    render={() => (
                      <FormItem>
                        <div className="mb-4">
                          <FormLabel className="text-sm font-medium text-slate-200">
                            Classes do Imóvel (selecione pelo menos 1)
                          </FormLabel>
                        </div>
                        <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
                          {propertyClassesList.map((item) => (
                            <FormField
                              key={item.id}
                              control={form.control}
                              name="propertyClasses"
                              render={({ field }) => {
                                return (
                                  <FormItem
                                    key={item.id}
                                    className="flex flex-row items-start space-y-0 space-x-3"
                                  >
                                    <FormControl>
                                      <Checkbox
                                        checked={field.value?.includes(
                                          item.id.toString(),
                                        )}
                                        onCheckedChange={(checked) => {
                                          return checked
                                            ? field.onChange([
                                                ...field.value,
                                                item.id.toString(),
                                              ])
                                            : field.onChange(
                                                field.value?.filter(
                                                  (value) =>
                                                    value !==
                                                    item.id.toString(),
                                                ),
                                              );
                                        }}
                                        className="border-slate-600 bg-slate-700/50 text-blue-400 focus:ring-blue-400/20"
                                      />
                                    </FormControl>
                                    <FormLabel className="text-sm font-normal text-slate-200">
                                      {item.name}
                                    </FormLabel>
                                  </FormItem>
                                );
                              }}
                            />
                          ))}
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="shortDescription"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm font-medium text-slate-200">
                          Descrição no Card (obrigatória)
                        </FormLabel>
                        <FormControl>
                          <Textarea
                            {...field}
                            className="resize-none border-slate-600 bg-slate-700/50 text-slate-100 transition-colors placeholder:text-slate-400 focus:border-blue-400 focus:ring-blue-400/20"
                            rows={3}
                            placeholder="Essa descrição ficará exibida APENAS no card de amostra do seu imóvel, resuma e seja breve"
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
                        <FormLabel className="text-sm font-medium text-slate-200">
                          Descrição na Página (obrigatória)
                        </FormLabel>
                        <FormControl>
                          <Textarea
                            {...field}
                            className="resize-none border-slate-600 bg-slate-700/50 text-slate-100 transition-colors placeholder:text-slate-400 focus:border-blue-400 focus:ring-blue-400/20"
                            rows={5}
                            placeholder="Essa descrição ficará exibida APENAS na página principal do seu imóvel, a parte mais importante, aqui você precisa ser mais detalhista para o seu hóspede."
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="nearbyRegion"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm font-medium text-slate-200">
                          Região Próxima (opcional)
                        </FormLabel>
                        <FormControl>
                          <Textarea
                            {...field}
                            className="resize-none border-slate-600 bg-slate-700/50 text-slate-100 transition-colors placeholder:text-slate-400 focus:border-blue-400 focus:ring-blue-400/20"
                            rows={3}
                            placeholder="Descreva aqui como é a região próxima ao imóvel alugado, se possui restaurantes bons, academia, pracinhas, pontos turísticos, lugares interessantes, etc."
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
                        <FormLabel className="text-sm font-medium text-slate-200">
                          Sobre o Prédio (opcional)
                        </FormLabel>
                        <FormControl>
                          <Textarea
                            {...field}
                            className="resize-none border-slate-600 bg-slate-700/50 text-slate-100 transition-colors placeholder:text-slate-400 focus:border-blue-400 focus:ring-blue-400/20"
                            rows={3}
                            placeholder="Descreva aqui como é o prédio do imóvel que seu cliente irá frequentar."
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
                    <FormField
                      control={form.control}
                      name="maxGuests"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-sm font-medium text-slate-200">
                            Hóspedes
                          </FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              onChange={(e) =>
                                field.onChange(Number(e.target.value))
                              }
                              value={field.value}
                              className="border-slate-600 bg-slate-700/50 text-slate-100 transition-colors placeholder:text-slate-400 focus:border-blue-400 focus:ring-blue-400/20"
                              placeholder="0"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="bedrooms"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-sm font-medium text-slate-200">
                            Quartos
                          </FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              onChange={(e) =>
                                field.onChange(Number(e.target.value))
                              }
                              value={field.value}
                              className="border-slate-600 bg-slate-700/50 text-slate-100 transition-colors placeholder:text-slate-400 focus:border-blue-400 focus:ring-blue-400/20"
                              placeholder="0"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="bathrooms"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-sm font-medium text-slate-200">
                            Banheiros
                          </FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              onChange={(e) =>
                                field.onChange(Number(e.target.value))
                              }
                              value={field.value}
                              className="border-slate-600 bg-slate-700/50 text-slate-100 transition-colors placeholder:text-slate-400 focus:border-blue-400 focus:ring-blue-400/20"
                              placeholder="0"
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
                          <FormLabel className="text-sm font-medium text-slate-200">
                            Vagas de Veículos (opcional)
                          </FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              onChange={(e) =>
                                field.onChange(
                                  e.target.value
                                    ? Number(e.target.value)
                                    : undefined,
                                )
                              }
                              value={field.value || ""}
                              className="border-slate-600 bg-slate-700/50 text-slate-100 transition-colors placeholder:text-slate-400 focus:border-blue-400 focus:ring-blue-400/20"
                              placeholder="Caso você deixe essa opção vazia, o sistema vai entender que seu imóvel NÃO POSSUI vagas para veículos."
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
                    <FormField
                      control={form.control}
                      name="areaM2"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-sm font-medium text-slate-200">
                            Área (m²)
                          </FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              onChange={(e) =>
                                field.onChange(
                                  e.target.value
                                    ? Number(e.target.value)
                                    : undefined,
                                )
                              }
                              value={field.value || ""}
                              className="border-slate-600 bg-slate-700/50 text-slate-100 transition-colors placeholder:text-slate-400 focus:border-blue-400 focus:ring-blue-400/20"
                              placeholder="Ex: 120"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="minimumStay"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-sm font-medium text-slate-200">
                            Estadia Mínima (noites)
                          </FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              min="1"
                              onChange={(e) =>
                                field.onChange(Number(e.target.value))
                              }
                              value={field.value}
                              className="border-slate-600 bg-slate-700/50 text-slate-100 transition-colors placeholder:text-slate-400 focus:border-blue-400 focus:ring-blue-400/20"
                              placeholder="1"
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
                          <FormLabel className="text-sm font-medium text-slate-200">
                            Estadia Máxima Máxima (dias)
                          </FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              min="1"
                              onChange={(e) =>
                                field.onChange(Number(e.target.value))
                              }
                              value={field.value}
                              className="border-slate-600 bg-slate-700/50 text-slate-100 transition-colors placeholder:text-slate-400 focus:border-blue-400 focus:ring-blue-400/20"
                              placeholder="30"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="allowsPets"
                      render={({ field }) => (
                        <FormItem className="flex flex-col justify-end">
                          <div className="flex items-center space-x-2">
                            <Checkbox
                              id="allowsPets"
                              checked={field.value}
                              onCheckedChange={field.onChange}
                              className="border-slate-600 bg-slate-700 data-[state=checked]:bg-blue-600"
                            />
                            <FormLabel
                              htmlFor="allowsPets"
                              className="text-sm font-medium text-slate-200"
                            >
                              Aceita Pets
                            </FormLabel>
                          </div>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Preços */}
              <Card className="border-slate-700/50 bg-slate-800/80 shadow-2xl backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-2xl font-semibold text-slate-100">
                    Preços e Taxas
                  </CardTitle>
                  <span className="text-sm text-gray-200">
                    Adicione aqui as informações sobre preços e taxas do imóvel.
                    Se você deixar o valor igual a 0, o sistema irá entender
                    como <strong>&apos;A combinar&apos;</strong>.
                  </span>
                </CardHeader>
                <CardContent className="space-y-6 p-6">
                  <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                    <FormField
                      control={form.control}
                      name="dailyRate"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-sm font-medium text-slate-200">
                            Valor da Diária (R$)
                          </FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              min="0"
                              step="0.01"
                              onChange={(e) =>
                                field.onChange(Number(e.target.value))
                              }
                              value={field.value}
                              className="border-slate-600 bg-slate-700/50 text-slate-100 transition-colors placeholder:text-slate-400 focus:border-blue-400 focus:ring-blue-400/20"
                              placeholder="Ex: 150.00"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="monthlyRent"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-sm font-medium text-slate-200">
                            Valor Mensal (R$)
                          </FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              min="0"
                              step="0.01"
                              onChange={(e) =>
                                field.onChange(Number(e.target.value))
                              }
                              value={field.value}
                              className="border-slate-600 bg-slate-700/50 text-slate-100 transition-colors placeholder:text-slate-400 focus:border-blue-400 focus:ring-blue-400/20"
                              placeholder="Ex: 3000.00"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
                    <FormField
                      control={form.control}
                      name="condominiumFee"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-sm font-medium text-slate-200">
                            Condomínio (opicional)
                          </FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              min="0"
                              step="0.01"
                              onChange={(e) =>
                                field.onChange(
                                  e.target.value ? Number(e.target.value) : 0,
                                )
                              }
                              value={field.value || ""}
                              className="border-slate-600 bg-slate-700/50 text-slate-100 transition-colors placeholder:text-slate-400 focus:border-blue-400 focus:ring-blue-400/20"
                              placeholder="0.00"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="iptuFee"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-sm font-medium text-slate-200">
                            IPTU (opicional)
                          </FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              min="0"
                              step="0.01"
                              onChange={(e) =>
                                field.onChange(
                                  e.target.value ? Number(e.target.value) : 0,
                                )
                              }
                              value={field.value || ""}
                              className="border-slate-600 bg-slate-700/50 text-slate-100 transition-colors placeholder:text-slate-400 focus:border-blue-400 focus:ring-blue-400/20"
                              placeholder="0.00"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="monthlyCleaningFee"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-sm font-medium text-slate-200">
                            Limpeza Mensal (opicional)
                          </FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              min="0"
                              step="0.01"
                              onChange={(e) =>
                                field.onChange(
                                  e.target.value ? Number(e.target.value) : 0,
                                )
                              }
                              value={field.value || ""}
                              className="border-slate-600 bg-slate-700/50 text-slate-100 transition-colors placeholder:text-slate-400 focus:border-blue-400 focus:ring-blue-400/20"
                              placeholder="0.00"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="otherFees"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-sm font-medium text-slate-200">
                            Outras Taxas (opicional)
                          </FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              min="0"
                              step="0.01"
                              onChange={(e) =>
                                field.onChange(
                                  e.target.value ? Number(e.target.value) : 0,
                                )
                              }
                              value={field.value || ""}
                              className="border-slate-600 bg-slate-700/50 text-slate-100 transition-colors placeholder:text-slate-400 focus:border-blue-400 focus:ring-blue-400/20"
                              placeholder="0.00"
                            />
                          </FormControl>
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
                    Seleciones alguns serviços que já estão inclusos no valor do
                    imóvel.
                  </span>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
                    {[
                      {
                        name: "includesKitchenUtensils",
                        label: "Utensílios de Cozinha",
                      },
                      { name: "includesFurniture", label: "Mobiliado" },
                      {
                        name: "includesElectricity",
                        label: "Energia Elétrica",
                      },
                      { name: "includesInternet", label: "Internet" },
                      { name: "includesLinens", label: "Roupas de Cama" },
                      { name: "includesWater", label: "Água" },
                    ].map((service) => (
                      <FormField
                        key={service.name}
                        control={form.control}
                        name={service.name as keyof PropertyFormValues}
                        render={({ field }) => (
                          <FormItem className="flex items-center space-x-3">
                            <FormControl>
                              <button
                                type="button"
                                onClick={() => field.onChange(!field.value)}
                                className="flex h-5 w-5 items-center justify-center rounded border border-slate-600 transition-colors hover:border-blue-400"
                              >
                                {field.value ? (
                                  <SquareCheck className="h-4 w-4 text-green-500" />
                                ) : (
                                  <SquareX className="h-4 w-4 text-red-500" />
                                )}
                              </button>
                            </FormControl>
                            <FormLabel className="cursor-pointer text-sm font-medium text-slate-200">
                              {service.label}
                            </FormLabel>
                          </FormItem>
                        )}
                      />
                    ))}
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
                    Adicione aqui a localização do imóvel.
                  </span>
                </CardHeader>
                <CardContent className="space-y-6 p-6">
                  <FormField
                    control={form.control}
                    name="fullAddress"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm font-medium text-slate-200">
                          Endereço Completo
                        </FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            className="border-slate-600 bg-slate-700/50 text-slate-100 transition-colors placeholder:text-slate-400 focus:border-blue-400 focus:ring-blue-400/20"
                            placeholder="Rua, número, complemento"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                    <FormField
                      control={form.control}
                      name="neighborhood"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-sm font-medium text-slate-200">
                            Bairro
                          </FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              className="border-slate-600 bg-slate-700/50 text-slate-100 transition-colors placeholder:text-slate-400 focus:border-blue-400 focus:ring-blue-400/20"
                              placeholder="Centro"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="municipality"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-sm font-medium text-slate-200">
                            Município
                          </FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            value={field.value}
                          >
                            <FormControl>
                              <SelectTrigger className="border-slate-600 bg-slate-700/50 text-slate-100 transition-colors focus:border-blue-400 focus:ring-blue-400/20">
                                <SelectValue placeholder="Selecione o município" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent className="max-h-60 border-slate-600 bg-slate-800">
                              {cearaMunicipalities.map((municipality) => (
                                <SelectItem
                                  key={municipality}
                                  value={municipality}
                                  className="text-slate-100 hover:bg-slate-700/50 focus:bg-slate-700/50"
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
                          <FormLabel className="text-sm font-medium text-slate-200">
                            Cidade
                          </FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              className="border-slate-600 bg-slate-700/50 text-slate-100 transition-colors placeholder:text-slate-400 focus:border-blue-400 focus:ring-blue-400/20"
                              placeholder="Fortaleza"
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
                      name="state"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-sm font-medium text-slate-200">
                            Estado
                          </FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              className="border-slate-600 bg-slate-700/50 text-slate-100 transition-colors placeholder:text-slate-400 focus:border-blue-400 focus:ring-blue-400/20"
                              placeholder="CE"
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
                          <FormLabel className="text-sm font-medium text-slate-200">
                            CEP
                          </FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              className="border-slate-600 bg-slate-700/50 text-slate-100 transition-colors placeholder:text-slate-400 focus:border-blue-400 focus:ring-blue-400/20"
                              placeholder="60000-000"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="popularDestination"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm font-medium text-slate-200">
                          Seu imóvel está localizado em um destes destinos
                          populares ou está muito próximo deles?
                        </FormLabel>
                        <FormDescription className="text-xs text-slate-400">
                          Essa opção ajuda nossos clientes que estiverem
                          interessados em destinos específicos, que seu imóvel
                          pode estar próximo.
                        </FormDescription>
                        <Select
                          onValueChange={field.onChange}
                          value={field.value}
                        >
                          <FormControl>
                            <SelectTrigger className="border-slate-600 bg-slate-700/50 text-slate-100 transition-colors focus:border-blue-400 focus:ring-blue-400/20">
                              <SelectValue placeholder="Selecione um destino popular" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent className="max-h-60 border-slate-600 bg-slate-800">
                            <SelectItem
                              value="Fortaleza"
                              className="text-slate-100 hover:bg-slate-700/50 focus:bg-slate-700/50"
                            >
                              Fortaleza
                            </SelectItem>
                            <SelectItem
                              value="Jericoacoara"
                              className="text-slate-100 hover:bg-slate-700/50 focus:bg-slate-700/50"
                            >
                              Jericoacoara
                            </SelectItem>
                            <SelectItem
                              value="Canoa Quebrada"
                              className="text-slate-100 hover:bg-slate-700/50 focus:bg-slate-700/50"
                            >
                              Canoa Quebrada
                            </SelectItem>
                            <SelectItem
                              value="Praia de Picos"
                              className="text-slate-100 hover:bg-slate-700/50 focus:bg-slate-700/50"
                            >
                              Praia de Picos
                            </SelectItem>
                            <SelectItem
                              value="Morro Branco"
                              className="text-slate-100 hover:bg-slate-700/50 focus:bg-slate-700/50"
                            >
                              Morro Branco
                            </SelectItem>
                            <SelectItem
                              value="Águas Belas"
                              className="text-slate-100 hover:bg-slate-700/50 focus:bg-slate-700/50"
                            >
                              Águas Belas
                            </SelectItem>
                            <SelectItem
                              value="Cumbuco"
                              className="text-slate-100 hover:bg-slate-700/50 focus:bg-slate-700/50"
                            >
                              Cumbuco
                            </SelectItem>
                            <SelectItem
                              value="Beach Park"
                              className="text-slate-100 hover:bg-slate-700/50 focus:bg-slate-700/50"
                            >
                              Beach Park
                            </SelectItem>
                            <SelectItem
                              value="Nenhum dos anteriores"
                              className="text-slate-100 hover:bg-slate-700/50 focus:bg-slate-700/50"
                            >
                              Nenhum dos anteriores
                            </SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>

              {/* Imagens */}
              <Card className="border-slate-700/50 bg-slate-800/80 shadow-2xl backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-2xl font-semibold text-slate-100">
                    Imagens do Imóvel
                  </CardTitle>
                  <span className="text-sm text-gray-200">
                    Adicione imagens do imóvel em alta qualidade. Recomendamos
                    imagens com resolução de 1200x800px, máximo 5MB cada, nos
                    formatos JPG, PNG ou WEBP para melhor visualização.
                  </span>
                </CardHeader>
                <CardContent className="space-y-4 p-6">
                  <div className="space-y-4">
                    <div>
                      <label
                        htmlFor="images"
                        className="-mt-5 mb-4 block text-sm font-medium text-slate-200"
                      >
                        Adicionar Imagens
                      </label>
                      <label className="cursor-pointer">
                        <div className="w-full rounded-lg border border-slate-600 bg-slate-700 px-4 py-2 text-sm text-slate-100 transition-all duration-200 hover:bg-slate-600 disabled:opacity-50">
                          {isUploading ? "Enviando..." : "Escolher Imagens"}
                        </div>
                        <input
                          id="images"
                          type="file"
                          multiple
                          accept="image/*"
                          onChange={handleImageUpload}
                          disabled={isUploading}
                          className="hidden"
                        />
                      </label>
                      {isUploading && (
                        <p className="mt-2 text-sm text-blue-400">
                          Fazendo upload...
                        </p>
                      )}
                    </div>
                  </div>

                  {uploadedImages.length > 0 && (
                    <div className="space-y-4">
                      <h4 className="text-lg font-medium text-slate-200">
                        Imagens Carregadas ({uploadedImages.length})
                      </h4>
                      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
                        {uploadedImages.map((imageUrl, index) => (
                          <div key={index} className="group relative">
                            <Image
                              src={imageUrl}
                              alt={`Imagem ${index + 1}`}
                              width={200}
                              height={200}
                              className="h-24 w-full rounded-lg border border-slate-600 object-cover"
                            />
                            <button
                              type="button"
                              onClick={() => removeUploadedImage(index)}
                              className="absolute -top-2 -right-2 h-9 w-9 rounded-full border border-slate-500 bg-slate-700 hover:bg-slate-600"
                            >
                              <X className="h-4 w-4" />
                            </button>
                          </div>
                        ))}
                      </div>
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
                    Selecione aqui as comodidades disponíveis para o imóvel.
                  </span>
                </CardHeader>
                <CardContent className="p-6">
                  <FormField
                    control={form.control}
                    name="amenities"
                    render={() => (
                      <FormItem>
                        <div className="mb-6">
                          <FormLabel className="text-lg font-semibold text-slate-200">
                            Selecione as comodidades disponíveis
                          </FormLabel>
                        </div>
                        {Object.entries(amenitiesByCategory).map(
                          ([category, categoryAmenities]) => (
                            <div key={category} className="mb-6">
                              <h4 className="mb-3 text-lg font-medium text-slate-300 capitalize">
                                {category.replace("_", " ")}
                              </h4>
                              <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
                                {categoryAmenities.map((amenity) => (
                                  <FormField
                                    key={amenity.id}
                                    control={form.control}
                                    name="amenities"
                                    render={({ field }) => {
                                      return (
                                        <FormItem
                                          key={amenity.id}
                                          className="flex flex-row items-start space-y-0 space-x-3"
                                        >
                                          <FormControl>
                                            <Checkbox
                                              checked={field.value?.includes(
                                                amenity.id,
                                              )}
                                              onCheckedChange={(checked) => {
                                                return checked
                                                  ? field.onChange([
                                                      ...(field.value || []),
                                                      amenity.id,
                                                    ])
                                                  : field.onChange(
                                                      field.value?.filter(
                                                        (value) =>
                                                          value !== amenity.id,
                                                      ),
                                                    );
                                              }}
                                              className="border-slate-600 bg-slate-700 data-[state=checked]:bg-blue-600"
                                            />
                                          </FormControl>
                                          <FormLabel className="text-sm font-normal text-slate-200">
                                            {amenity.name}
                                          </FormLabel>
                                        </FormItem>
                                      );
                                    }}
                                  />
                                ))}
                              </div>
                            </div>
                          ),
                        )}
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
