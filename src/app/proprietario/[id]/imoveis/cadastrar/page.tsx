"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import {
  ArrowLeft,
  Building2,
  Camera,
  Loader,
  MapPin,
  Palmtree,
  Plus,
  Trash2,
  User,
  Utensils,
  X,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import * as z from "zod";

import Footer from "@/components/Footer";
import Header from "@/components/Header";
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
import { getOwnerSession } from "@/lib/owner-session";
import {
  createProperty,
  getAmenities,
  type PropertyFormData,
} from "@/lib/property-actions";

const propertyFormSchema = z.object({
  // Seção Proprietário
  ownerName: z.string().min(2, "Nome deve ter pelo menos 2 caracteres"),
  ownerPhone: z.string().min(10, "Telefone deve ter pelo menos 10 dígitos"),
  ownerEmail: z.string().email("Email inválido"),
  ownerInstagram: z.string().optional(),
  ownerWebsite: z.string().optional(),
  ownerProfileImage: z.string().optional(),

  // Dados básicos do imóvel
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
  parkingSpaces: z.number().min(0, "Número de vagas inválido").default(0),
  areaM2: z.number().default(0),
  allowsPets: z.boolean(),
  propertyStyle: z
    .array(z.string())
    .min(1, "Selecione pelo menos um tipo do imóvel"),
  minimumStay: z.number().min(1, "Estadia mínima deve ser pelo menos 1 noite"),
  maximumStay: z.number().min(1, "Duração máxima deve ser pelo menos 1 dia"),
  checkInTime: z.string().optional(),
  checkOutTime: z.string().optional(),

  // Proximidades da região
  nearbyPlaces: z
    .array(
      z.object({
        name: z.string().min(1, "Nome é obrigatório"),
        distance: z.string().min(1, "Distância é obrigatória"),
      }),
    )
    .min(1, "Adicione pelo menos um local próximo"),
  nearbyBeaches: z
    .array(
      z.object({
        name: z.string().min(1, "Nome é obrigatório"),
        distance: z.string().min(1, "Distância é obrigatória"),
      }),
    )
    .min(1, "Adicione pelo menos uma praia próxima"),
  nearbyAirports: z
    .array(
      z.object({
        name: z.string().min(1, "Nome é obrigatório"),
        distance: z.string().min(1, "Distância é obrigatória"),
      }),
    )
    .min(1, "Adicione pelo menos um aeroporto próximo"),
  nearbyRestaurants: z
    .array(
      z.object({
        name: z.string().min(1, "Nome é obrigatório"),
        distance: z.string().min(1, "Distância é obrigatória"),
      }),
    )
    .min(1, "Adicione pelo menos um restaurante próximo"),

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
  latitude: z.number().default(0),
  longitude: z.number().default(0),
  popularDestination: z.string().min(1, "Selecione um destino popular"),

  // Comodidades e imagens
  amenities: z.array(z.number()).default([]),
  images: z.array(z.string()).default([]),

  // Regras da Casa
  checkInRule: z.string().optional(),
  checkOutRule: z.string().optional(),
  cancellationRule: z.string().optional(),
  childrenRule: z.string().optional(),
  bedsRule: z.string().optional(),
  ageRestrictionRule: z.string().optional(),
  groupsRule: z.string().optional(),

  // Métodos de pagamento aceitos
  acceptsVisa: z.boolean().default(false),
  acceptsAmericanExpress: z.boolean().default(false),
  acceptsMasterCard: z.boolean().default(false),
  acceptsMaestro: z.boolean().default(false),
  acceptsElo: z.boolean().default(false),
  acceptsDinersClub: z.boolean().default(false),
  acceptsPix: z.boolean().default(false),
  acceptsCash: z.boolean().default(false),
});

interface Amenity {
  id: number;
  name: string;
  category: string;
}

interface OwnerSession {
  userId: string;
  fullName: string;
  email: string;
  phone?: string;
  instagram?: string;
  website?: string;
  profileImage?: string;
}

export default function AddPropertyPage() {
  const router = useRouter();
  const params = useParams();
  const ownerId = params.id as string;

  const [ownerData, setOwnerData] = useState<OwnerSession | null>(null);
  const [amenities, setAmenities] = useState<Amenity[]>([]);
  const [selectedAmenities, setSelectedAmenities] = useState<number[]>([]);
  const [uploadedImages, setUploadedImages] = useState<string[]>([]);
  const [uploadedOwnerImage, setUploadedOwnerImage] = useState<string>("");
  const [isUploading, setIsUploading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm({
    resolver: zodResolver(propertyFormSchema),
    defaultValues: {
      ownerName: "",
      ownerPhone: "",
      ownerEmail: "",
      ownerInstagram: "",
      ownerWebsite: "",
      ownerProfileImage: "",
      title: "",
      shortDescription: "",
      fullDescription: "",
      aboutBuilding: "",
      maxGuests: 1,
      bedrooms: 1,
      bathrooms: 1,
      parkingSpaces: 0,
      areaM2: 0,
      allowsPets: false,
      propertyStyle: [""],
      minimumStay: 1,
      maximumStay: 365,
      checkInTime: "14:00",
      checkOutTime: "11:00",
      nearbyPlaces: [{ name: "", distance: "" }],
      nearbyBeaches: [{ name: "", distance: "" }],
      nearbyAirports: [{ name: "", distance: "" }],
      nearbyRestaurants: [{ name: "", distance: "" }],
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
      latitude: 0,
      longitude: 0,
      popularDestination: "",
      amenities: [],
      images: [],
      checkInRule: "",
      checkOutRule: "",
      cancellationRule: "",
      childrenRule: "",
      bedsRule: "",
      ageRestrictionRule: "",
      groupsRule: "",
      acceptsVisa: false,
      acceptsAmericanExpress: false,
      acceptsMasterCard: false,
      acceptsMaestro: false,
      acceptsElo: false,
      acceptsDinersClub: false,
      acceptsPix: false,
      acceptsCash: false,
    },
  });

  useEffect(() => {
    const checkAuth = async () => {
      const session = getOwnerSession();

      if (!session) {
        router.push("/proprietario/login");
        return;
      }

      if (session.userId !== ownerId) {
        router.push(`/proprietario/${session.userId}`);
        return;
      }

      // Buscar dados atualizados do servidor se necessário
      if (
        !session.phone ||
        !session.instagram ||
        !session.website ||
        !session.profileImage
      ) {
        try {
          const response = await fetch(`/api/proprietario/${session.userId}`);
          if (response.ok) {
            const userData = await response.json();
            const fullData = {
              userId: userData.id,
              fullName: userData.fullName,
              email: userData.email,
              phone: userData.phone,
              instagram: userData.instagram,
              website: userData.website,
              profileImage: userData.profileImage,
            };
            setOwnerData(fullData);

            // Pré-preencher dados do proprietário
            form.setValue("ownerName", fullData.fullName);
            form.setValue("ownerEmail", fullData.email);
            form.setValue(
              "ownerPhone",
              fullData.phone ? formatPhoneNumber(fullData.phone) : "",
            );
            form.setValue("ownerInstagram", fullData.instagram || "");
            form.setValue("ownerWebsite", fullData.website || "");
            form.setValue("ownerProfileImage", fullData.profileImage || "");
            setUploadedOwnerImage(fullData.profileImage || "");
          } else {
            setOwnerData(session);
            form.setValue("ownerName", session.fullName);
            form.setValue("ownerEmail", session.email);
            form.setValue(
              "ownerPhone",
              session.phone ? formatPhoneNumber(session.phone) : "",
            );
            form.setValue("ownerInstagram", session.instagram || "");
            form.setValue("ownerWebsite", session.website || "");
            form.setValue("ownerProfileImage", session.profileImage || "");
            setUploadedOwnerImage(session.profileImage || "");
          }
        } catch (error) {
          console.error("Erro ao buscar dados do proprietário:", error);
          setOwnerData(session);
          form.setValue("ownerName", session.fullName);
          form.setValue("ownerEmail", session.email);
          form.setValue(
            "ownerPhone",
            session.phone ? formatPhoneNumber(session.phone) : "",
          );
          form.setValue("ownerInstagram", session.instagram || "");
          form.setValue("ownerWebsite", session.website || "");
          form.setValue("ownerProfileImage", session.profileImage || "");
          setUploadedOwnerImage(session.profileImage || "");
        }
      } else {
        setOwnerData(session);
        form.setValue("ownerName", session.fullName);
        form.setValue("ownerEmail", session.email);
        form.setValue(
          "ownerPhone",
          session.phone ? formatPhoneNumber(session.phone) : "",
        );
        form.setValue("ownerInstagram", session.instagram || "");
        form.setValue("ownerWebsite", session.website || "");
        form.setValue("ownerProfileImage", session.profileImage || "");
        setUploadedOwnerImage(session.profileImage || "");
      }
    };

    checkAuth();
  }, [ownerId, router, form]);

  useEffect(() => {
    const loadData = async () => {
      try {
        const amenitiesData = await getAmenities();
        setAmenities(amenitiesData);
      } catch (error) {
        console.error("Erro ao carregar dados:", error);
        toast.error("Erro ao carregar dados necessários");
      }
    };

    loadData();
  }, [form]);

  const handleImageUpload = async (
    event: React.ChangeEvent<HTMLInputElement>,
    isOwnerImage = false,
  ) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    setIsUploading(true);
    const formData = new FormData();

    Array.from(files).forEach((file) => {
      formData.append("files", file);
    });

    // Determinar tipo baseado no isOwnerImage
    const type = isOwnerImage ? "profiles" : "properties";
    formData.append("type", type);

    try {
      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        let errorMessage = "Erro no upload";
        try {
          const errorData = await response.json();
          errorMessage =
            errorData.error ||
            errorData.message ||
            `Erro HTTP ${response.status}`;
        } catch {
          errorMessage = `Erro HTTP ${response.status}: ${response.statusText}`;
        }
        throw new Error(errorMessage);
      }

      const data = await response.json();

      if (
        !data.files ||
        !Array.isArray(data.files) ||
        data.files.length === 0
      ) {
        throw new Error("Nenhuma URL de imagem foi retornada pelo servidor");
      }

      if (isOwnerImage && data.files.length > 0) {
        setUploadedOwnerImage(data.files[0]);
        form.setValue("ownerProfileImage", data.files[0]);
      } else {
        const newImages = [...uploadedImages, ...data.files];
        setUploadedImages(newImages);
        form.setValue("images", newImages);
      }

      toast.success(
        isOwnerImage
          ? data.service === "cloudinary"
            ? "Foto de perfil enviada com sucesso! (Cloudinary)"
            : "Foto de perfil enviada com sucesso!"
          : data.service === "cloudinary"
            ? `${data.files.length} imagem(ns) enviada(s) com sucesso! (Cloudinary)`
            : `${data.files.length} imagem(ns) enviada(s) com sucesso!`,
      );
    } catch (error) {
      console.error("Erro no upload:", error);
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Erro desconhecido ao enviar imagem(ns)";
      toast.error(errorMessage);
    } finally {
      setIsUploading(false);
    }
  };

  const removeImage = (index: number) => {
    const newImages = uploadedImages.filter((_, i) => i !== index);
    setUploadedImages(newImages);
    form.setValue("images", newImages);
  };

  const removeOwnerImage = () => {
    setUploadedOwnerImage("");
    form.setValue("ownerProfileImage", "");
  };

  const handleAmenityChange = (amenityId: number, checked: boolean) => {
    let newSelectedAmenities;
    if (checked) {
      newSelectedAmenities = [...selectedAmenities, amenityId];
    } else {
      newSelectedAmenities = selectedAmenities.filter((id) => id !== amenityId);
    }
    setSelectedAmenities(newSelectedAmenities);
    form.setValue("amenities", newSelectedAmenities);
  };

  // Função para formatar telefone
  const formatPhoneNumber = (value: string) => {
    // Remove todos os caracteres não numéricos
    const phoneNumber = value.replace(/\D/g, "");

    // Aplica a formatação baseada no tamanho
    if (phoneNumber.length <= 2) {
      return `(${phoneNumber}`;
    } else if (phoneNumber.length <= 3) {
      return `(${phoneNumber.slice(0, 2)}) ${phoneNumber.slice(2)}`;
    } else if (phoneNumber.length <= 7) {
      return `(${phoneNumber.slice(0, 2)}) ${phoneNumber.slice(2, 3)} ${phoneNumber.slice(3)}`;
    } else if (phoneNumber.length <= 11) {
      return `(${phoneNumber.slice(0, 2)}) ${phoneNumber.slice(2, 3)} ${phoneNumber.slice(3, 7)}-${phoneNumber.slice(7, 11)}`;
    } else {
      // Limita a 11 dígitos
      const limitedPhone = phoneNumber.slice(0, 11);
      return `(${limitedPhone.slice(0, 2)}) ${limitedPhone.slice(2, 3)} ${limitedPhone.slice(3, 7)}-${limitedPhone.slice(7, 11)}`;
    }
  };

  const onSubmit = async (values: z.infer<typeof propertyFormSchema>) => {
    console.log("Função onSubmit chamada com valores:", values);
    setIsSubmitting(true);

    try {
      // Converter os dados do formulário para o formato esperado
      const propertyData: PropertyFormData = {
        ownerId: params.id as string, // Adicionar o ID do proprietário

        // Dados do proprietário
        ownerName: values.ownerName,
        ownerPhone: values.ownerPhone,
        ownerEmail: values.ownerEmail,
        ownerInstagram: values.ownerInstagram,
        ownerWebsite: values.ownerWebsite,
        ownerProfileImage: values.ownerProfileImage,

        // Dados básicos do imóvel
        title: values.title,
        shortDescription: values.shortDescription,
        fullDescription: values.fullDescription || "",
        aboutBuilding: values.aboutBuilding || "",
        maxGuests: values.maxGuests,
        bedrooms: values.bedrooms,
        bathrooms: values.bathrooms,
        parkingSpaces: values.parkingSpaces || 0,
        areaM2: values.areaM2,
        allowsPets: values.allowsPets,
        propertyStyle: values.propertyStyle.join(", "), // Converter array para string
        propertyClasses: ["1"], // Sempre usar classe "Normal" (ID 1)
        minimumStay: values.minimumStay,
        maximumStay: values.maximumStay,
        checkInTime: values.checkInTime,
        checkOutTime: values.checkOutTime,

        // Proximidades da região
        nearbyPlaces: values.nearbyPlaces,
        nearbyBeaches: values.nearbyBeaches,
        nearbyAirports: values.nearbyAirports,
        nearbyRestaurants: values.nearbyRestaurants,

        includesKitchenUtensils: values.includesKitchenUtensils,
        includesFurniture: values.includesFurniture,
        includesElectricity: values.includesElectricity,
        includesInternet: values.includesInternet,
        includesLinens: values.includesLinens,
        includesWater: values.includesWater,
        fullAddress: values.fullAddress,
        neighborhood: values.neighborhood,
        municipality: values.municipality,
        city: values.city,
        state: values.state,
        zipCode: values.zipCode,
        latitude: values.latitude,
        longitude: values.longitude,
        popularDestination: values.popularDestination,
        amenities: selectedAmenities,
        images: uploadedImages,

        // Regras da Casa
        checkInRule: values.checkInRule,
        checkOutRule: values.checkOutRule,
        cancellationRule: values.cancellationRule,
        childrenRule: values.childrenRule,
        bedsRule: values.bedsRule,
        ageRestrictionRule: values.ageRestrictionRule,
        groupsRule: values.groupsRule,

        // Métodos de pagamento aceitos
        acceptsVisa: values.acceptsVisa,
        acceptsAmericanExpress: values.acceptsAmericanExpress,
        acceptsMasterCard: values.acceptsMasterCard,
        acceptsMaestro: values.acceptsMaestro,
        acceptsElo: values.acceptsElo,
        acceptsDinersClub: values.acceptsDinersClub,
        acceptsPix: values.acceptsPix,
        acceptsCash: values.acceptsCash,
      };

      console.log("Dados preparados para envio:", propertyData);

      const result = await createProperty(propertyData);

      console.log("Resultado da criação:", result);

      if (result.success) {
        toast.success("Imóvel cadastrado com sucesso!");
        router.push(`/proprietario/${params.id}`);
      } else {
        toast.error(result.error || "Erro ao cadastrar imóvel");
      }
    } catch (error) {
      console.error("Erro ao cadastrar imóvel:", error);
      toast.error("Erro interno do servidor");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!ownerData) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-900 p-4">
        <div className="max-w-md rounded-lg p-8">
          <div className="flex flex-col items-center justify-center text-center">
            <div className="mb-4 h-8 w-8 animate-spin rounded-full border-4 border-gray-400 border-t-transparent"></div>
            <p className="text-sm text-slate-300">Carregando...</p>
          </div>
        </div>
      </div>
    );
  }

  const popularDestinations = [
    "Fortaleza",
    "Canoa Quebrada",
    "Jericoacoara",
    "Morro Branco",
    "Praia das Fontes",
    "Aquiraz",
    "Cumbuco",
    "Paracuru",
    "Trairi",
    "Outros",
  ];

  const propertyStyleOptions = [
    "Apartamento",
    "Casa",
    "Casa de Praia",
    "Flats",
    "Pousada",
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
      <Header />
      <div className="relative mt-16 min-h-screen">
        {/* Background Image - Fixed */}
        <div className="fixed inset-0 bg-cover bg-center bg-no-repeat">
          <div className="absolute inset-0 bg-black"></div>
        </div>

        {/* Content */}
        <div className="relative z-10 px-4 py-8 pb-16 sm:px-6 lg:px-52">
          <div className="mx-auto max-w-5xl">
            <div className="mb-8 flex items-center gap-4">
              <Link href={`/proprietario/${ownerId}`}>
                <Button
                  size="sm"
                  className="border border-blue-400/10 bg-[#182334] text-gray-200 backdrop-blur-sm transition-all duration-200 hover:bg-[#182334] hover:brightness-105"
                >
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Voltar
                </Button>
              </Link>
              <div className="ml-4 sm:ml-10">
                <h1 className="text-2xl font-bold text-gray-100 sm:text-4xl">
                  Cadastrar Novo Imóvel
                </h1>
                <p className="mt-2 text-sm text-gray-200 sm:text-base">
                  Preencha as informações para cadastrar um novo imóvel
                </p>
              </div>
            </div>

            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="mx-auto max-w-4xl space-y-8"
              >
                {/* Seção Proprietário */}
                <Card className="border-slate-700/50 bg-slate-800/80 shadow-2xl backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle className="flex items-center text-2xl font-semibold text-slate-100">
                      <User className="mr-2 h-5 w-5" />
                      Informações do Proprietário
                    </CardTitle>
                    <span className="text-sm text-gray-200">
                      Adicione aqui suas informações de contato que aparecerão
                      nos anúncios do imóvel.
                    </span>
                  </CardHeader>
                  <CardContent className="space-y-6 p-6">
                    {/* Foto de Perfil */}
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
                              <X className="h-8 w-8 text-slate-100" />
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
                      {/* Nome */}
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
                                className="border-slate-600 bg-slate-700 text-slate-100"
                                placeholder="Seu nome completo"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      {/* Telefone */}
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

                      {/* Email */}
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
                                className="border-slate-600 bg-slate-700 text-slate-100"
                                placeholder="seu@email.com"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      {/* Instagram */}
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
                                className="border-slate-600 bg-slate-700 text-slate-100"
                                placeholder="@seuinstagram"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      {/* Site */}
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
                                className="border-slate-600 bg-slate-700 text-slate-100"
                                placeholder="https://seusite.com"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </CardContent>
                </Card>

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
                              Tipos do Imóvel *
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
                                      className="border-slate-600 bg-slate-700 text-slate-300 hover:bg-red-600"
                                    >
                                      <X className="h-4 w-4" />
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
                                className="border-slate-600 bg-slate-700 text-slate-300 hover:bg-slate-600"
                              >
                                <Plus className="mr-2 h-4 w-4" />
                                Adicionar Tipo
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

                    <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
                      <FormField
                        control={form.control}
                        name="maxGuests"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-slate-300">
                              Máx. Hóspedes *
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
                        name="bedrooms"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-slate-300">
                              Quartos *
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

                      <FormField
                        control={form.control}
                        name="bathrooms"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-slate-300">
                              Banheiros *
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

                    <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                      <FormField
                        control={form.control}
                        name="areaM2"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-slate-300">
                              Área (m²)
                            </FormLabel>
                            <FormControl>
                              <Input
                                {...field}
                                type="number"
                                min="0"
                                onChange={(e) =>
                                  field.onChange(
                                    parseFloat(e.target.value) || 0,
                                  )
                                }
                                className="border-slate-600 bg-slate-700 text-slate-100"
                                placeholder="Ex: 85"
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

                    <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                      <FormField
                        control={form.control}
                        name="checkInTime"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-slate-300">
                              Horário de Check-in
                            </FormLabel>
                            <FormControl>
                              <Input
                                {...field}
                                type="time"
                                className="border-slate-600 bg-slate-700 text-slate-100"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="checkOutTime"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-slate-300">
                              Horário de Check-out
                            </FormLabel>
                            <FormControl>
                              <Input
                                {...field}
                                type="time"
                                className="border-slate-600 bg-slate-700 text-slate-100"
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
                          <FormItem className="flex flex-row items-start space-y-0 space-x-3 rounded-md p-4">
                            <FormControl>
                              <Checkbox
                                checked={field.value}
                                onCheckedChange={field.onChange}
                                className="border-slate-600 data-[state=checked]:bg-blue-600"
                              />
                            </FormControl>
                            <div className="space-y-1 leading-none">
                              <FormLabel className="text-slate-300">
                                Aceita Pets
                              </FormLabel>
                            </div>
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
                      Configure os locais próximos ao imóvel para cada
                      categoria. É obrigatório adicionar pelo menos um local em
                      cada seção.
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
                              {field.value.map((place, index) => (
                                <div
                                  key={index}
                                  className="grid grid-cols-1 gap-3 md:grid-cols-3"
                                >
                                  <div className="md:col-span-2">
                                    <Input
                                      placeholder="Nome do local (ex: Centro da cidade)"
                                      value={place.name}
                                      onChange={(e) => {
                                        const newPlaces = [...field.value];
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
                                        const newPlaces = [...field.value];
                                        newPlaces[index].distance =
                                          e.target.value;
                                        field.onChange(newPlaces);
                                      }}
                                      className="border-slate-600 bg-slate-700 text-slate-300"
                                    />
                                    {field.value.length > 1 && (
                                      <Button
                                        type="button"
                                        variant="outline"
                                        size="icon"
                                        onClick={() => {
                                          const newPlaces = field.value.filter(
                                            (_, i) => i !== index,
                                          );
                                          field.onChange(newPlaces);
                                        }}
                                        className="border-slate-600 bg-slate-700 text-slate-300 hover:bg-slate-600"
                                      >
                                        <Trash2 className="h-4 w-4" />
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
                                    ...field.value,
                                    { name: "", distance: "" },
                                  ]);
                                }}
                                className="border-slate-600 bg-slate-700 text-slate-300 hover:bg-slate-600"
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
                              {field.value.map((beach, index) => (
                                <div
                                  key={index}
                                  className="grid grid-cols-1 gap-3 md:grid-cols-3"
                                >
                                  <div className="md:col-span-2">
                                    <Input
                                      placeholder="Nome da praia (ex: Praia de Iracema)"
                                      value={beach.name}
                                      onChange={(e) => {
                                        const newBeaches = [...field.value];
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
                                        const newBeaches = [...field.value];
                                        newBeaches[index].distance =
                                          e.target.value;
                                        field.onChange(newBeaches);
                                      }}
                                      className="border-slate-600 bg-slate-700 text-slate-100"
                                    />
                                    {field.value.length > 1 && (
                                      <Button
                                        type="button"
                                        variant="outline"
                                        size="icon"
                                        onClick={() => {
                                          const newBeaches = field.value.filter(
                                            (_, i) => i !== index,
                                          );
                                          field.onChange(newBeaches);
                                        }}
                                        className="border-slate-600 bg-slate-700 text-slate-300 hover:bg-slate-600"
                                      >
                                        <Trash2 className="h-4 w-4" />
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
                                    ...field.value,
                                    { name: "", distance: "" },
                                  ]);
                                }}
                                className="border-slate-600 bg-slate-700 text-slate-300 hover:bg-slate-600"
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
                              {field.value.map((airport, index) => (
                                <div
                                  key={index}
                                  className="grid grid-cols-1 gap-3 md:grid-cols-3"
                                >
                                  <div className="md:col-span-2">
                                    <Input
                                      placeholder="Nome do aeroporto (ex: Aeroporto Internacional Pinto Martins)"
                                      value={airport.name}
                                      onChange={(e) => {
                                        const newAirports = [...field.value];
                                        newAirports[index].name =
                                          e.target.value;
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
                                        const newAirports = [...field.value];
                                        newAirports[index].distance =
                                          e.target.value;
                                        field.onChange(newAirports);
                                      }}
                                      className="border-slate-600 bg-slate-700 text-slate-100"
                                    />
                                    {field.value.length > 1 && (
                                      <Button
                                        type="button"
                                        variant="outline"
                                        size="icon"
                                        onClick={() => {
                                          const newAirports =
                                            field.value.filter(
                                              (_, i) => i !== index,
                                            );
                                          field.onChange(newAirports);
                                        }}
                                        className="border-slate-600 bg-slate-700 text-slate-300 hover:bg-slate-600"
                                      >
                                        <Trash2 className="h-4 w-4" />
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
                                    ...field.value,
                                    { name: "", distance: "" },
                                  ]);
                                }}
                                className="border-slate-600 bg-slate-700 text-slate-300 hover:bg-slate-600"
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
                              {field.value.map((restaurant, index) => (
                                <div
                                  key={index}
                                  className="grid grid-cols-1 gap-3 md:grid-cols-3"
                                >
                                  <div className="md:col-span-2">
                                    <Input
                                      placeholder="Nome do restaurante (ex: Restaurante Vila Azul)"
                                      value={restaurant.name}
                                      onChange={(e) => {
                                        const newRestaurants = [...field.value];
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
                                        const newRestaurants = [...field.value];
                                        newRestaurants[index].distance =
                                          e.target.value;
                                        field.onChange(newRestaurants);
                                      }}
                                      className="border-slate-600 bg-slate-700 text-slate-100"
                                    />
                                    {field.value.length > 1 && (
                                      <Button
                                        type="button"
                                        variant="outline"
                                        size="icon"
                                        onClick={() => {
                                          const newRestaurants =
                                            field.value.filter(
                                              (_, i) => i !== index,
                                            );
                                          field.onChange(newRestaurants);
                                        }}
                                        className="border-slate-600 bg-slate-700 text-slate-300 hover:bg-slate-600"
                                      >
                                        <Trash2 className="h-4 w-4" />
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
                                    ...field.value,
                                    { name: "", distance: "" },
                                  ]);
                                }}
                                className="border-slate-600 bg-slate-700 text-slate-300 hover:bg-slate-600"
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
                            <FormLabel className="text-slate-300">
                              Água
                            </FormLabel>
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

                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
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
                                className="border-slate-600 bg-slate-700 text-slate-100"
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
                                className="border-slate-600 bg-slate-700 text-slate-100"
                                placeholder="00000-000"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
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
                                <SelectTrigger className="border-slate-600 bg-slate-700 text-slate-100">
                                  <SelectValue placeholder="Selecione o município" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent className="max-h-60 border-slate-600 bg-slate-700">
                                {cearaMunicipalities.map((municipality) => (
                                  <SelectItem
                                    key={municipality}
                                    value={municipality}
                                    className="text-slate-100 focus:bg-slate-600"
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
                                className="border-slate-600 bg-slate-700 text-slate-100"
                                placeholder="Nome da cidade"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

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
                                className="border-slate-600 bg-slate-700 text-slate-100"
                                placeholder="Ex: CE"
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
                          <FormLabel className="text-slate-300">
                            Destino Popular *
                          </FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger className="border-slate-600 bg-slate-700 text-slate-100">
                                <SelectValue placeholder="Selecione um destino" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent className="border-slate-600 bg-slate-700">
                              {popularDestinations.map((destination) => (
                                <SelectItem
                                  key={destination}
                                  value={destination}
                                  className="text-slate-100 focus:bg-slate-600"
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

                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                      <FormField
                        control={form.control}
                        name="latitude"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-slate-300">
                              Latitude (Opcional)
                            </FormLabel>
                            <FormControl>
                              <Input
                                {...field}
                                type="number"
                                step="any"
                                onChange={(e) =>
                                  field.onChange(
                                    parseFloat(e.target.value) || 0,
                                  )
                                }
                                className="border-slate-600 bg-slate-700 text-slate-100"
                                placeholder="-3.7319"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="longitude"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-slate-300">
                              Longitude (Opcional)
                            </FormLabel>
                            <FormControl>
                              <Input
                                {...field}
                                type="number"
                                step="any"
                                onChange={(e) =>
                                  field.onChange(
                                    parseFloat(e.target.value) || 0,
                                  )
                                }
                                className="border-slate-600 bg-slate-700 text-slate-100"
                                placeholder="-38.5267"
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
                  <CardHeader>
                    <CardTitle className="text-2xl font-semibold text-slate-100">
                      Imagens do Imóvel
                    </CardTitle>
                    <span className="text-sm text-gray-200">
                      Adicione fotos do imóvel para atrair mais interessados.
                    </span>
                  </CardHeader>
                  <CardContent className="space-y-4 p-6">
                    <div className="flex items-center gap-4">
                      <label className="cursor-pointer">
                        <Button
                          type="button"
                          variant="outline"
                          disabled={isUploading}
                          className="border-slate-600 bg-slate-700 text-slate-100 hover:bg-slate-600 hover:text-slate-100"
                          asChild
                        >
                          <span>
                            {isUploading ? "Enviando..." : "Escolher Imagens"}
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
                              variant="destructive"
                              size="sm"
                              className="absolute -top-2 -right-2 h-9 w-9 rounded-full border border-slate-500 bg-slate-700 hover:bg-slate-600"
                              onClick={() => removeImage(index)}
                            >
                              <X className="h-3 w-3" />
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
                      são opcionais. Você não precisa preencher todos.
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
                          <FormItem className="md:col-span-2">
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
      </div>
      <div className="relative z-50">
        <Footer />
      </div>
    </>
  );
}
