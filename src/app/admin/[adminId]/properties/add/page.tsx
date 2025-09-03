"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft, X } from "lucide-react";
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
  fullDescription: z.string().optional(),
  maxGuests: z.number().min(1, "Deve aceitar pelo menos 1 hóspede"),
  bedrooms: z.number().min(0, "Número de quartos inválido"),
  bathrooms: z.number().min(1, "Deve ter pelo menos 1 banheiro"),
  parkingSpaces: z.number().min(0, "Número de vagas inválido"),
  areaM2: z.number().optional(),
  allowsPets: z.boolean(),
  propertyStyle: z.string().min(1, "Selecione o tipo do imóvel"),
  propertyClass: z.string().min(1, "Selecione a classe do imóvel"),
  minimumStay: z.number().min(1, "Estadia mínima deve ser pelo menos 1 noite"),
  checkInTime: z.string().optional(),
  checkOutTime: z.string().optional(),

  // Preços
  monthlyRent: z.number().min(0, "Valor mensal inválido"),
  dailyRate: z.number().min(0, "Valor da diária inválido"),
  condominiumFee: z.number().optional(),
  iptuFee: z.number().optional(),
  monthlyCleaningFee: z.number().optional(),
  otherFees: z.number().optional(),

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
  city: z.string().min(2, "Cidade é obrigatória"),
  state: z.string().min(2, "Estado é obrigatório"),
  zipCode: z.string().min(8, "CEP deve ter 8 dígitos"),
  latitude: z.number().optional(),
  longitude: z.number().optional(),
});

type PropertyFormValues = z.infer<typeof propertyFormSchema>;

interface AddPropertyPageProps {
  params: { adminId: string };
}

export default function AddPropertyPage({ params }: AddPropertyPageProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedAmenities, setSelectedAmenities] = useState<number[]>([]);
  const [uploadedImages, setUploadedImages] = useState<string[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [amenities, setAmenities] = useState<
    Array<{ id: number; name: string; category: string }>
  >([]);

  const form = useForm<PropertyFormValues>({
    resolver: zodResolver(propertyFormSchema),
    defaultValues: {
      allowsPets: false,
      parkingSpaces: 0,
      minimumStay: 1,
      checkInTime: "15:00",
      checkOutTime: "11:00",
      propertyClass: "Normal",
      includesKitchenUtensils: false,
      includesFurniture: false,
      includesElectricity: false,
      includesInternet: false,
      includesLinens: false,
      includesWater: false,
      condominiumFee: 0,
      iptuFee: 0,
      monthlyCleaningFee: 0,
      otherFees: 0,
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

  const handleAmenityChange = (amenityId: number, checked: boolean) => {
    if (checked) {
      setSelectedAmenities([...selectedAmenities, amenityId]);
    } else {
      setSelectedAmenities(selectedAmenities.filter((id) => id !== amenityId));
    }
  };

  const onSubmit = async (values: PropertyFormValues) => {
    if (uploadedImages.length === 0) {
      toast.error("Adicione pelo menos uma imagem do imóvel");
      return;
    }

    setIsSubmitting(true);

    try {
      const propertyData: PropertyFormData = {
        ...values,
        amenities: selectedAmenities,
        images: uploadedImages,
      };

      const result = await createProperty(propertyData);

      if (result.success) {
        toast.success("Imóvel criado com sucesso!");
        router.push(`/admin/${params.adminId}/properties`);
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

  const propertyTypes = [
    "Apartamento",
    "Casa",
    "Flat",
    "Sítio",
    "Chalé",
    "Pousada",
    "Studio",
    "Loft",
  ];

  const propertyClasses = [
    "Normal",
    "Imóvel em Destaque",
    "Destaque em Casas",
    "Destaque em Apartamentos",
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
      <div className="relative z-10 container mx-auto px-4 py-8 pb-16">
        <div className="mb-8 flex items-center gap-4">
          <Link href={`/admin/${params.adminId}/properties`}>
            <Button
              variant="outline"
              size="sm"
              className="border-blue-400/30 bg-blue-500/10 text-blue-300 backdrop-blur-sm transition-all duration-200 hover:border-blue-400 hover:bg-blue-500/20"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Voltar
            </Button>
          </Link>
          <div>
            <h1 className="bg-gradient-to-r from-blue-300 to-cyan-300 bg-clip-text text-4xl font-bold text-transparent">
              Adicionar Novo Imóvel
            </h1>
            <p className="mt-2 text-slate-400">
              Preencha as informações para cadastrar um novo imóvel
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
              <CardHeader className="border-b border-slate-700/50 bg-gradient-to-r from-blue-600/10 to-cyan-600/10">
                <CardTitle className="text-2xl font-semibold text-slate-100">
                  📋 Informações Básicas
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6 p-6">
                <div className="grid grid-cols-1 gap-6 md:grid-cols-4">
                  <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                      <FormItem className="md:col-span-2">
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
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger className="border-slate-600 bg-slate-700/50 text-slate-100 transition-colors focus:border-blue-400 focus:ring-blue-400/20">
                              <SelectValue placeholder="Selecione o tipo" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent className="border-slate-600 bg-slate-800">
                            {propertyTypes.map((type) => (
                              <SelectItem
                                key={type}
                                value={type}
                                className="text-slate-100 focus:bg-slate-700"
                              >
                                {type}
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
                    name="propertyClass"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm font-medium text-slate-200">
                          Classe do Imóvel
                        </FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger className="border-slate-600 bg-slate-700/50 text-slate-100 transition-colors focus:border-blue-400 focus:ring-blue-400/20">
                              <SelectValue placeholder="Selecione a classe" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent className="border-slate-600 bg-slate-800">
                            {propertyClasses.map((propertyClass) => (
                              <SelectItem
                                key={propertyClass}
                                value={propertyClass}
                                className="text-slate-100 focus:bg-slate-700"
                              >
                                {propertyClass}
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
                  name="shortDescription"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium text-slate-200">
                        Descrição Curta
                      </FormLabel>
                      <FormControl>
                        <Textarea
                          {...field}
                          className="resize-none border-slate-600 bg-slate-700/50 text-slate-100 transition-colors placeholder:text-slate-400 focus:border-blue-400 focus:ring-blue-400/20"
                          rows={3}
                          placeholder="Descreva brevemente o imóvel..."
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
                        Descrição Completa (Opcional)
                      </FormLabel>
                      <FormControl>
                        <Textarea
                          {...field}
                          className="resize-none border-slate-600 bg-slate-700/50 text-slate-100 transition-colors placeholder:text-slate-400 focus:border-blue-400 focus:ring-blue-400/20"
                          rows={5}
                          placeholder="Descreva detalhadamente o imóvel, suas características e diferenciais..."
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
                            {...field}
                            type="number"
                            onChange={(e) =>
                              field.onChange(Number(e.target.value))
                            }
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
                            {...field}
                            type="number"
                            onChange={(e) =>
                              field.onChange(Number(e.target.value))
                            }
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
                            {...field}
                            type="number"
                            onChange={(e) =>
                              field.onChange(Number(e.target.value))
                            }
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
                          Vagas
                        </FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            type="number"
                            onChange={(e) =>
                              field.onChange(Number(e.target.value))
                            }
                            className="border-slate-600 bg-slate-700/50 text-slate-100 transition-colors placeholder:text-slate-400 focus:border-blue-400 focus:ring-blue-400/20"
                            placeholder="0"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
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
                            {...field}
                            type="number"
                            onChange={(e) =>
                              field.onChange(
                                e.target.value
                                  ? Number(e.target.value)
                                  : undefined,
                              )
                            }
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
                    name="minimumStay"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm font-medium text-slate-200">
                          Estadia Mínima (noites)
                        </FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            type="number"
                            onChange={(e) =>
                              field.onChange(Number(e.target.value))
                            }
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
                    name="allowsPets"
                    render={({ field }) => (
                      <FormItem className="flex flex-col justify-end">
                        <div className="flex h-10 items-center space-x-3">
                          <FormControl>
                            <Checkbox
                              checked={field.value}
                              onCheckedChange={field.onChange}
                              className="border-slate-600 data-[state=checked]:border-blue-600 data-[state=checked]:bg-blue-600"
                            />
                          </FormControl>
                          <FormLabel className="cursor-pointer text-sm font-medium text-slate-200">
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
              <CardHeader className="border-b border-slate-700/50 bg-gradient-to-r from-green-600/10 to-emerald-600/10">
                <CardTitle className="text-2xl font-semibold text-slate-100">
                  💰 Preços e Taxas
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6 p-6">
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                  <FormField
                    control={form.control}
                    name="dailyRate"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm font-medium text-slate-200">
                          Valor/Diária (R$)
                        </FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            type="number"
                            step="0.01"
                            onChange={(e) =>
                              field.onChange(Number(e.target.value))
                            }
                            className="border-slate-600 bg-slate-700/50 text-slate-100 transition-colors placeholder:text-slate-400 focus:border-blue-400 focus:ring-blue-400/20"
                            placeholder="0,00"
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
                            {...field}
                            type="number"
                            step="0.01"
                            onChange={(e) =>
                              field.onChange(Number(e.target.value))
                            }
                            className="border-slate-600 bg-slate-700/50 text-slate-100 transition-colors placeholder:text-slate-400 focus:border-blue-400 focus:ring-blue-400/20"
                            placeholder="0,00"
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
                          Condomínio (R$)
                        </FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            type="number"
                            step="0.01"
                            onChange={(e) =>
                              field.onChange(
                                e.target.value
                                  ? Number(e.target.value)
                                  : undefined,
                              )
                            }
                            className="border-slate-600 bg-slate-700/50 text-slate-100 transition-colors placeholder:text-slate-400 focus:border-blue-400 focus:ring-blue-400/20"
                            placeholder="0,00"
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
                          IPTU (R$)
                        </FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            type="number"
                            step="0.01"
                            onChange={(e) =>
                              field.onChange(
                                e.target.value
                                  ? Number(e.target.value)
                                  : undefined,
                              )
                            }
                            className="border-slate-600 bg-slate-700/50 text-slate-100 transition-colors placeholder:text-slate-400 focus:border-blue-400 focus:ring-blue-400/20"
                            placeholder="0,00"
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
                          Taxa Limpeza (R$)
                        </FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            type="number"
                            step="0.01"
                            onChange={(e) =>
                              field.onChange(
                                e.target.value
                                  ? Number(e.target.value)
                                  : undefined,
                              )
                            }
                            className="border-slate-600 bg-slate-700/50 text-slate-100 transition-colors placeholder:text-slate-400 focus:border-blue-400 focus:ring-blue-400/20"
                            placeholder="0,00"
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
                          Outras Taxas (R$)
                        </FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            type="number"
                            step="0.01"
                            onChange={(e) =>
                              field.onChange(
                                e.target.value
                                  ? Number(e.target.value)
                                  : undefined,
                              )
                            }
                            className="border-slate-600 bg-slate-700/50 text-slate-100 transition-colors placeholder:text-slate-400 focus:border-blue-400 focus:ring-blue-400/20"
                            placeholder="0,00"
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
              <CardHeader className="border-b border-slate-700/50 bg-gradient-to-r from-purple-600/10 to-violet-600/10">
                <CardTitle className="text-2xl font-semibold text-slate-100">
                  ✨ Serviços Inclusos
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
                  {[
                    {
                      name: "includesKitchenUtensils",
                      label: "Utensílios de Cozinha",
                    },
                    { name: "includesFurniture", label: "Mobiliado" },
                    { name: "includesElectricity", label: "Energia Elétrica" },
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
                            <Checkbox
                              checked={field.value as boolean}
                              onCheckedChange={field.onChange}
                              className="border-slate-600 data-[state=checked]:border-blue-600 data-[state=checked]:bg-blue-600"
                            />
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
              <CardHeader className="border-b border-slate-700/50 bg-gradient-to-r from-orange-600/10 to-red-600/10">
                <CardTitle className="text-2xl font-semibold text-slate-100">
                  📍 Localização
                </CardTitle>
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

                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
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
                            placeholder="Nome do bairro"
                          />
                        </FormControl>
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
                            placeholder="Nome da cidade"
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
                            placeholder="Ex: CE"
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
                            placeholder="00000-000"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Imagens */}
            <Card className="border-slate-700/50 bg-slate-800/80 shadow-2xl backdrop-blur-sm">
              <CardHeader className="border-b border-slate-700/50 bg-gradient-to-r from-pink-600/10 to-rose-600/10">
                <CardTitle className="text-2xl font-semibold text-slate-100">
                  📷 Imagens do Imóvel
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 p-6">
                <div className="space-y-4">
                  <div>
                    <label
                      htmlFor="images"
                      className="mb-2 block text-sm font-medium text-slate-200"
                    >
                      Selecione as imagens do imóvel (máximo 5MB cada)
                    </label>
                    <input
                      id="images"
                      type="file"
                      multiple
                      accept="image/*"
                      onChange={handleImageUpload}
                      disabled={isUploading}
                      className="w-full text-sm text-slate-300 transition-all duration-200 file:mr-4 file:rounded-lg file:border-0 file:bg-blue-600/20 file:px-4 file:py-2 file:font-medium file:text-blue-300 hover:file:bg-blue-600/30 disabled:opacity-50"
                    />
                    {isUploading && (
                      <p className="mt-2 flex items-center text-sm text-blue-400">
                        <div className="mr-2 h-4 w-4 animate-spin rounded-full border-b-2 border-blue-400"></div>
                        Enviando imagens...
                      </p>
                    )}
                  </div>
                </div>

                {uploadedImages.length > 0 && (
                  <div className="space-y-4">
                    <p className="text-sm font-medium text-slate-300">
                      {uploadedImages.length} imagem(ns) carregada(s):
                    </p>
                    <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
                      {uploadedImages.map((imagePath, index) => (
                        <div key={index} className="group relative">
                          <Image
                            src={imagePath}
                            alt={`Imagem ${index + 1}`}
                            width={200}
                            height={128}
                            className="h-32 w-full rounded-md object-cover"
                          />
                          <Button
                            type="button"
                            onClick={() => removeUploadedImage(index)}
                            variant="outline"
                            size="sm"
                            className="absolute top-2 right-2 border-red-600 bg-red-600 text-white opacity-0 transition-opacity group-hover:opacity-100 hover:bg-red-700"
                          >
                            <X className="h-3 w-3" />
                          </Button>
                          {index === 0 && (
                            <div className="absolute bottom-2 left-2 rounded bg-blue-600 px-2 py-1 text-xs text-white">
                              Principal
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Comodidades */}
            <Card className="border-slate-700/50 bg-slate-800/80 shadow-2xl backdrop-blur-sm">
              <CardHeader className="border-b border-slate-700/50 bg-gradient-to-r from-teal-600/10 to-cyan-600/10">
                <CardTitle className="text-2xl font-semibold text-slate-100">
                  🏠 Comodidades
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                {Object.entries(amenitiesByCategory).map(
                  ([category, categoryAmenities]) => (
                    <div key={category} className="mb-6">
                      <h4 className="mb-3 text-sm font-medium text-slate-300 capitalize">
                        {category.replace("_", " ")}
                      </h4>
                      <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
                        {categoryAmenities.map((amenity) => (
                          <div
                            key={amenity.id}
                            className="flex items-center space-x-3"
                          >
                            <Checkbox
                              checked={selectedAmenities.includes(amenity.id)}
                              onCheckedChange={(checked) =>
                                handleAmenityChange(
                                  amenity.id,
                                  checked as boolean,
                                )
                              }
                              className="border-slate-600 data-[state=checked]:border-blue-600 data-[state=checked]:bg-blue-600"
                            />
                            <label className="cursor-pointer text-sm text-slate-200">
                              {amenity.name}
                            </label>
                          </div>
                        ))}
                      </div>
                    </div>
                  ),
                )}
              </CardContent>
            </Card>

            {/* Botão de Envio */}
            <div className="flex justify-center pt-8">
              <Button
                type="submit"
                disabled={isSubmitting}
                className="transform rounded-lg bg-gradient-to-r from-blue-600 to-cyan-600 px-12 py-4 text-lg font-semibold text-white shadow-xl transition-all duration-200 hover:scale-105 hover:from-blue-700 hover:to-cyan-700 hover:shadow-2xl disabled:transform-none disabled:opacity-50"
              >
                {isSubmitting ? (
                  <>
                    <div className="mr-3 h-5 w-5 animate-spin rounded-full border-b-2 border-white"></div>
                    Criando Imóvel...
                  </>
                ) : (
                  <>
                    <span className="mr-2">🏠</span>
                    Criar Imóvel
                  </>
                )}
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
}
