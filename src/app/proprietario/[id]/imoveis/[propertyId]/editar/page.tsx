"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft, Camera, Loader, Plus, User, X } from "lucide-react";
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
import { getOwnerSession } from "@/lib/owner-session";
import {
  getAmenities,
  getPropertyById,
  getPropertyClasses,
  type PropertyFormData,
  updateProperty,
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
  nearbyRegion: z.string().optional(),
  aboutBuilding: z.string().optional(),
  maxGuests: z.number().min(1, "Deve aceitar pelo menos 1 hóspede"),
  bedrooms: z.number().min(0, "Número de quartos inválido"),
  bathrooms: z.number().min(1, "Deve ter pelo menos 1 banheiro"),
  parkingSpaces: z.number().min(0, "Número de vagas inválido").default(0),
  areaM2: z.number().default(0),
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
  monthlyRent: z.number().min(0, "Valor mensal inválido").default(0),
  dailyRate: z.number().min(0, "Valor da diária inválida").default(0),
  condominiumFee: z.number().default(0),
  iptuFee: z.number().default(0),
  monthlyCleaningFee: z.number().default(0),
  otherFees: z.number().default(0),

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
  popularDestination: z.string().min(1, "Selecione uma opção"),

  // Comodidades e imagens
  amenities: z.array(z.number()).default([]),
  images: z.array(z.string()).default([]),
});

interface Amenity {
  id: number;
  name: string;
  category: string;
}

interface PropertyClass {
  id: number;
  name: string;
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

export default function EditPropertyPage() {
  const router = useRouter();
  const params = useParams();
  const ownerId = params.id as string;
  const propertyId = params.propertyId as string;

  const [ownerData, setOwnerData] = useState<OwnerSession | null>(null);
  const [amenities, setAmenities] = useState<Amenity[]>([]);
  const [propertyClasses, setPropertyClasses] = useState<PropertyClass[]>([]);
  const [selectedAmenities, setSelectedAmenities] = useState<number[]>([]);
  const [uploadedImages, setUploadedImages] = useState<string[]>([]);
  const [uploadedOwnerImage, setUploadedOwnerImage] = useState<string>("");
  const [isUploading, setIsUploading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

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
      nearbyRegion: "",
      aboutBuilding: "",
      maxGuests: 1,
      bedrooms: 1,
      bathrooms: 1,
      parkingSpaces: 0,
      areaM2: 0,
      allowsPets: false,
      propertyStyle: "",
      propertyClasses: [],
      minimumStay: 1,
      maximumStay: 365,
      checkInTime: "14:00",
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
      latitude: 0,
      longitude: 0,
      popularDestination: "",
      amenities: [],
      images: [],
    },
  });

  useEffect(() => {
    const checkAuthAndLoadProperty = async () => {
      const session = getOwnerSession();

      if (!session) {
        router.push("/proprietario/login");
        return;
      }

      if (session.userId !== ownerId) {
        router.push(`/proprietario/${session.userId}`);
        return;
      }

      try {
        // Buscar dados do proprietário
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
            } else {
              setOwnerData(session);
            }
          } catch (error) {
            console.error("Erro ao buscar dados do proprietário:", error);
            setOwnerData(session);
          }
        } else {
          setOwnerData(session);
        }

        // Carregar dados necessários
        const [amenitiesData, , propertyData] = await Promise.all([
          getAmenities(),
          getPropertyClasses(), // Carregado mas não utilizado localmente
          getPropertyById(propertyId),
        ]);

        setAmenities(amenitiesData);

        if (!propertyData) {
          toast.error("Imóvel não encontrado");
          router.push(`/proprietario/${ownerId}`);
          return;
        }

        // Verificar se o proprietário tem permissão para editar este imóvel
        if (propertyData.ownerId !== ownerId) {
          toast.error("Você não tem permissão para editar este imóvel");
          router.push(`/proprietario/${ownerId}`);
          return;
        }

        // Classes de propriedades carregadas mas não utilizadas localmente

        // Pré-preencher o formulário com os dados existentes
        form.setValue("title", propertyData.title);
        form.setValue("shortDescription", propertyData.shortDescription);
        form.setValue("fullDescription", propertyData.fullDescription || "");
        form.setValue("nearbyRegion", propertyData.nearbyRegion || "");
        form.setValue("aboutBuilding", propertyData.aboutBuilding || "");
        form.setValue("maxGuests", propertyData.maxGuests);
        form.setValue("bedrooms", propertyData.bedrooms);
        form.setValue("bathrooms", propertyData.bathrooms);
        form.setValue("parkingSpaces", propertyData.parkingSpaces);
        form.setValue("areaM2", parseFloat(propertyData.areaM2 || "0"));
        form.setValue("allowsPets", propertyData.allowsPets);
        form.setValue("propertyStyle", propertyData.propertyStyle || "");
        form.setValue("minimumStay", propertyData.minimumStay);
        form.setValue("maximumStay", propertyData.maximumStay || 365);
        form.setValue("checkInTime", propertyData.checkInTime || "14:00");
        form.setValue("checkOutTime", propertyData.checkOutTime || "11:00");

        // Preencher preços
        if (propertyData.pricing) {
          form.setValue(
            "monthlyRent",
            parseFloat(propertyData.pricing.monthlyRent || "0"),
          );
          form.setValue(
            "dailyRate",
            parseFloat(propertyData.pricing.dailyRate || "0"),
          );
          form.setValue(
            "condominiumFee",
            parseFloat(propertyData.pricing.condominiumFee || "0"),
          );
          form.setValue(
            "iptuFee",
            parseFloat(propertyData.pricing.iptuFee || "0"),
          );
          form.setValue(
            "monthlyCleaningFee",
            parseFloat(propertyData.pricing.monthlyCleaningFee || "0"),
          );
          form.setValue(
            "otherFees",
            parseFloat(propertyData.pricing.otherFees || "0"),
          );
          form.setValue(
            "includesKitchenUtensils",
            propertyData.pricing.includesKitchenUtensils || false,
          );
          form.setValue(
            "includesFurniture",
            propertyData.pricing.includesFurniture || false,
          );
          form.setValue(
            "includesElectricity",
            propertyData.pricing.includesElectricity || false,
          );
          form.setValue(
            "includesInternet",
            propertyData.pricing.includesInternet || false,
          );
          form.setValue(
            "includesLinens",
            propertyData.pricing.includesLinens || false,
          );
          form.setValue(
            "includesWater",
            propertyData.pricing.includesWater || false,
          );
        }

        // Preencher localização
        if (propertyData.location) {
          form.setValue("fullAddress", propertyData.location.fullAddress);
          form.setValue("neighborhood", propertyData.location.neighborhood);
          form.setValue("municipality", propertyData.location.municipality);
          form.setValue("city", propertyData.location.city);
          form.setValue("state", propertyData.location.state);
          form.setValue("zipCode", propertyData.location.zipCode);
          form.setValue(
            "latitude",
            parseFloat(propertyData.location.latitude || "0"),
          );
          form.setValue(
            "longitude",
            parseFloat(propertyData.location.longitude || "0"),
          );
          form.setValue(
            "popularDestination",
            propertyData.location.popularDestination || "",
          );
        }

        // Preencher comodidades
        const amenityIds =
          propertyData.amenities?.map((a) => a.amenityId) || [];
        setSelectedAmenities(amenityIds);
        form.setValue("amenities", amenityIds);

        // Preencher classes
        const classIds = propertyData.classes?.map((c) => c.classId) || [];
        form.setValue("propertyClasses", classIds.map(String));

        // Preencher imagens
        const imageUrls = propertyData.images?.map((img) => img.imageUrl) || [];
        setUploadedImages(imageUrls);
        form.setValue("images", imageUrls);

        // Preencher dados do proprietário - usar dados atualizados quando disponível
        const ownerToUse = ownerData || propertyData.owner;
        if (ownerToUse) {
          form.setValue("ownerName", ownerToUse.fullName);
          form.setValue("ownerEmail", ownerToUse.email);
          form.setValue(
            "ownerPhone",
            formatPhoneNumber(ownerToUse.phone || ""),
          );
          form.setValue("ownerInstagram", ownerToUse.instagram || "");
          form.setValue("ownerWebsite", ownerToUse.website || "");
          form.setValue("ownerProfileImage", ownerToUse.profileImage || "");
          setUploadedOwnerImage(ownerToUse.profileImage || "");
        }
      } catch (error) {
        console.error("Erro ao carregar dados:", error);
        toast.error("Erro ao carregar dados do imóvel");
        router.push(`/proprietario/${ownerId}`);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuthAndLoadProperty();
  }, [ownerId, propertyId, router, form, ownerData]);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [amenitiesData, propertyClassesData] = await Promise.all([
          getAmenities(),
          getPropertyClasses(),
        ]);

        setAmenities(amenitiesData);
        setPropertyClasses(propertyClassesData);
      } catch (error) {
        console.error("Erro ao carregar dados:", error);
        toast.error("Erro ao carregar dados necessários");
      }
    };

    loadData();
  }, []);

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

  const removeOwnerImage = () => {
    setUploadedOwnerImage("");
    form.setValue("ownerProfileImage", "");
  };

  const removeImage = (index: number) => {
    console.log("removeImage chamada com index:", index);
    console.log("uploadedImages antes:", uploadedImages);

    if (index < 0 || index >= uploadedImages.length) {
      console.error("Índice inválido:", index);
      toast.error("Erro ao remover imagem: índice inválido");
      return;
    }

    const newImages = uploadedImages.filter((_, i) => i !== index);
    console.log("newImages após filtro:", newImages);

    setUploadedImages(newImages);
    form.setValue("images", newImages);

    toast.success("Imagem removida com sucesso!");
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
    setIsSubmitting(true);

    try {
      // Converter os dados do formulário para o formato esperado
      const propertyData: PropertyFormData = {
        ownerId: params.id as string,

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
        nearbyRegion: values.nearbyRegion || "",
        aboutBuilding: values.aboutBuilding || "",
        maxGuests: values.maxGuests,
        bedrooms: values.bedrooms,
        bathrooms: values.bathrooms,
        parkingSpaces: values.parkingSpaces || 0,
        areaM2: values.areaM2,
        allowsPets: values.allowsPets,
        propertyStyle: values.propertyStyle,
        propertyClasses: values.propertyClasses,
        minimumStay: values.minimumStay,
        maximumStay: values.maximumStay,
        checkInTime: values.checkInTime,
        checkOutTime: values.checkOutTime,
        monthlyRent: values.monthlyRent || 0,
        dailyRate: values.dailyRate || 0,
        condominiumFee: values.condominiumFee,
        iptuFee: values.iptuFee,
        monthlyCleaningFee: values.monthlyCleaningFee,
        otherFees: values.otherFees,
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
      };

      const result = await updateProperty(propertyId, propertyData);

      if (result.success) {
        toast.success("Imóvel atualizado com sucesso!");
        router.push(`/proprietario/${params.id}`);
      } else {
        toast.error(result.error || "Erro ao atualizar imóvel");
      }
    } catch (error) {
      console.error("Erro ao atualizar imóvel:", error);
      toast.error("Erro interno do servidor");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-900 p-4">
        <div className="max-w-md rounded-lg p-8">
          <div className="flex flex-col items-center justify-center text-center">
            <div className="mb-4 h-8 w-8 animate-spin rounded-full border-4 border-gray-400 border-t-transparent"></div>
            <p className="text-sm text-slate-300">
              Carregando dados do imóvel...
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (!ownerData) {
    return null; // Será redirecionado
  }

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

  const propertyStyleOptions = ["Casa", "Apartamento"];

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
                  Atualizar Imóvel
                </h1>
                <p className="mt-2 text-sm text-gray-200 sm:text-base">
                  Preencha as informações para atualizar o imóvel
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
                          <FormItem>
                            <FormLabel className="text-slate-300">
                              Tipo do Imóvel *
                            </FormLabel>
                            <Select
                              onValueChange={field.onChange}
                              defaultValue={field.value}
                            >
                              <FormControl>
                                <SelectTrigger className="border-slate-600 bg-slate-700 text-slate-100">
                                  <SelectValue placeholder="Selecione o tipo" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent className="border-slate-600 bg-slate-700 text-slate-100">
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
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    {/* <FormField
                      control={form.control}
                      name="propertyClasses"
                      render={() => (
                        <FormItem>
                          <FormLabel className="text-slate-300">
                            Classes do Imóvel *
                          </FormLabel>
                          <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
                            {propertyClasses.map((propertyClass) => (
                              <FormField
                                key={propertyClass.id}
                                control={form.control}
                                name="propertyClasses"
                                render={({ field }) => {
                                  return (
                                    <FormItem
                                      key={propertyClass.id}
                                      className="flex flex-row items-start space-y-0 space-x-3"
                                    >
                                      <FormControl>
                                        <Checkbox
                                          checked={field.value?.includes(
                                            propertyClass.id.toString(),
                                          )}
                                          onCheckedChange={(checked) => {
                                            return checked
                                              ? field.onChange([
                                                  ...field.value,
                                                  propertyClass.id.toString(),
                                                ])
                                              : field.onChange(
                                                  field.value?.filter(
                                                    (value) =>
                                                      value !==
                                                      propertyClass.id.toString(),
                                                  ),
                                                );
                                          }}
                                          className="border-slate-600 data-[state=checked]:bg-blue-600"
                                        />
                                      </FormControl>
                                      <FormLabel className="text-sm font-normal text-slate-300">
                                        {propertyClass.name}
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
                    /> */}

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
                      name="nearbyRegion"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-slate-300">
                            Região Próxima (Opcional)
                          </FormLabel>
                          <FormControl>
                            <Textarea
                              {...field}
                              className="min-h-[100px] border-slate-600 bg-slate-700 text-slate-100 placeholder:text-slate-400"
                              placeholder="Descreva pontos de interesse próximos (praias, centros comerciais, etc.)"
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

                {/* Preços */}
                <Card className="border-slate-700/50 bg-slate-800/80 shadow-2xl backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle className="text-2xl font-semibold text-slate-100">
                      Preços e Tarifas
                    </CardTitle>
                    <span className="text-sm text-gray-200">
                      Configure os valores de aluguel, taxas e serviços
                      inclusos.
                    </span>
                  </CardHeader>
                  <CardContent className="space-y-6 p-6">
                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                      <FormField
                        control={form.control}
                        name="monthlyRent"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-slate-300">
                              Valor Mensal (R$)
                            </FormLabel>
                            <FormControl>
                              <Input
                                {...field}
                                type="number"
                                min="0"
                                step="0.01"
                                onChange={(e) =>
                                  field.onChange(
                                    parseFloat(e.target.value) || 0,
                                  )
                                }
                                className="border-slate-600 bg-slate-700 text-slate-100"
                                placeholder="0.00"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="dailyRate"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-slate-300">
                              Valor da Diária (R$)
                            </FormLabel>
                            <FormControl>
                              <Input
                                {...field}
                                type="number"
                                min="0"
                                step="0.01"
                                onChange={(e) =>
                                  field.onChange(
                                    parseFloat(e.target.value) || 0,
                                  )
                                }
                                className="border-slate-600 bg-slate-700 text-slate-100"
                                placeholder="0.00"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="condominiumFee"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-slate-300">
                              Taxa de Condomínio (R$)
                            </FormLabel>
                            <FormControl>
                              <Input
                                {...field}
                                type="number"
                                min="0"
                                step="0.01"
                                onChange={(e) =>
                                  field.onChange(
                                    parseFloat(e.target.value) || 0,
                                  )
                                }
                                className="border-slate-600 bg-slate-700 text-slate-100"
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
                            <FormLabel className="text-slate-300">
                              IPTU (R$)
                            </FormLabel>
                            <FormControl>
                              <Input
                                {...field}
                                type="number"
                                min="0"
                                step="0.01"
                                onChange={(e) =>
                                  field.onChange(
                                    parseFloat(e.target.value) || 0,
                                  )
                                }
                                className="border-slate-600 bg-slate-700 text-slate-100"
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
                            <FormLabel className="text-slate-300">
                              Taxa de Limpeza Mensal (R$)
                            </FormLabel>
                            <FormControl>
                              <Input
                                {...field}
                                type="number"
                                min="0"
                                step="0.01"
                                onChange={(e) =>
                                  field.onChange(
                                    parseFloat(e.target.value) || 0,
                                  )
                                }
                                className="border-slate-600 bg-slate-700 text-slate-100"
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
                            <FormLabel className="text-slate-300">
                              Outras Taxas (R$)
                            </FormLabel>
                            <FormControl>
                              <Input
                                {...field}
                                type="number"
                                min="0"
                                step="0.01"
                                onChange={(e) =>
                                  field.onChange(
                                    parseFloat(e.target.value) || 0,
                                  )
                                }
                                className="border-slate-600 bg-slate-700 text-slate-100"
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
                              Utensílios de Cozinha
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
                            defaultValue={field.value}
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
                      <label
                        htmlFor="property-images-upload"
                        className="cursor-pointer"
                      >
                        <Button
                          type="button"
                          variant="outline"
                          disabled={isUploading}
                          className="border-slate-600 bg-slate-700 text-slate-100 hover:bg-slate-600 hover:text-slate-100"
                          onClick={() =>
                            document
                              .getElementById("property-images-upload")
                              ?.click()
                          }
                        >
                          {isUploading ? "Enviando..." : "Escolher Imagens"}
                        </Button>
                      </label>
                      <input
                        id="property-images-upload"
                        type="file"
                        accept="image/*"
                        multiple
                        onChange={(e) => handleImageUpload(e, false)}
                        disabled={isUploading}
                        className="hidden"
                      />
                      {isUploading && (
                        <Loader className="h-6 w-6 animate-spin text-blue-400" />
                      )}
                    </div>

                    {uploadedImages.length > 0 && (
                      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
                        {uploadedImages.map((imageUrl, index) => (
                          <div
                            key={`image-${index}-${imageUrl.slice(-10)}`}
                            className="relative"
                          >
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
                              onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                console.log(
                                  "Removendo imagem:",
                                  index,
                                  "URL:",
                                  imageUrl,
                                );
                                removeImage(index);
                              }}
                            >
                              <X className="h-3 w-3" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Classes do Imóvel */}
                <Card className="border-slate-700/50 bg-slate-800/80 shadow-2xl backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle className="text-2xl font-semibold text-slate-100">
                      Classes do Imóvel
                    </CardTitle>
                    <span className="text-sm text-gray-200">
                      Selecione as classes que se aplicam ao imóvel.
                    </span>
                  </CardHeader>
                  <CardContent className="p-6">
                    <FormField
                      control={form.control}
                      name="propertyClasses"
                      render={() => (
                        <FormItem>
                          <FormLabel className="text-slate-300">
                            Classes do Imóvel *
                          </FormLabel>
                          <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
                            {propertyClasses.map((propertyClass) => {
                              // Verificar se é uma classe de destaque (apenas para admins)
                              const isHighlightClass = [
                                "Imóvel em Destaque",
                                "Destaque em Casas",
                                "Destaque em Apartamentos",
                              ].includes(propertyClass.name);

                              return (
                                <FormField
                                  key={propertyClass.id}
                                  control={form.control}
                                  name="propertyClasses"
                                  render={({ field }) => {
                                    return (
                                      <FormItem
                                        key={propertyClass.id}
                                        className="flex flex-row items-start space-y-0 space-x-3"
                                      >
                                        <FormControl>
                                          <Checkbox
                                            disabled={isHighlightClass}
                                            checked={field.value?.includes(
                                              propertyClass.id.toString(),
                                            )}
                                            onCheckedChange={(checked) => {
                                              return checked
                                                ? field.onChange([
                                                    ...field.value,
                                                    propertyClass.id.toString(),
                                                  ])
                                                : field.onChange(
                                                    field.value?.filter(
                                                      (value) =>
                                                        value !==
                                                        propertyClass.id.toString(),
                                                    ),
                                                  );
                                            }}
                                            className="border-slate-600 data-[state=checked]:bg-blue-600"
                                          />
                                        </FormControl>
                                        <FormLabel
                                          className={`text-sm font-normal ${
                                            isHighlightClass
                                              ? "text-slate-500"
                                              : "text-slate-300"
                                          }`}
                                        >
                                          {propertyClass.name}
                                          {isHighlightClass && (
                                            <span className="ml-2 text-xs text-slate-500">
                                              (Apenas Admins)
                                            </span>
                                          )}
                                        </FormLabel>
                                      </FormItem>
                                    );
                                  }}
                                />
                              );
                            })}
                          </div>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
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
                    {isSubmitting ? "Atualizando..." : "Atualizar Imóvel"}
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
