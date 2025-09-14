"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import {
  ArrowLeft,
  Edit,
  Instagram,
  Link2,
  Loader,
  LogOut,
  MapPin,
  MoreHorizontal,
  Pencil,
  Plus,
  Settings,
  Trash2,
  User,
  UserRound,
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
import HeaderMobile from "@/components/HeaderMobile";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  clearOwnerSession,
  getOwnerSession,
  saveOwnerSession,
} from "@/lib/owner-session";
import { deleteProperty, getPropertiesByOwner } from "@/lib/property-actions";

interface OwnerSession {
  userId: string;
  fullName: string;
  email: string;
  phone?: string;
  instagram?: string;
  website?: string;
  profileImage?: string;
}

type Property = {
  id: string;
  title: string;
  shortDescription: string;
  maxGuests: number;
  bedrooms: number;
  bathrooms: number;
  status: string;
  createdAt: Date;
  dailyRate: string | null;
  monthlyRent: string | null;
  fullAddress: string | null;
  neighborhood: string | null;
  city: string | null;
  state: string | null;
};

// Schema de validação para edição do perfil
const profileFormSchema = z.object({
  fullName: z.string().min(2, "Nome deve ter pelo menos 2 caracteres"),
  email: z.string().email("Email inválido"),
  phone: z.string().min(10, "Telefone deve ter pelo menos 10 dígitos"),
  instagram: z.string().optional(),
  website: z.string().optional(),
  profileImage: z.string().optional(),
});

export default function OwnerDashboard() {
  const params = useParams();
  const router = useRouter();
  const [ownerData, setOwnerData] = useState<OwnerSession | null>(null);
  const [properties, setProperties] = useState<Property[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [isUpdatingProfile, setIsUpdatingProfile] = useState(false);
  const [uploadedProfileImage, setUploadedProfileImage] = useState<string>("");
  const [isUploadingImage, setIsUploadingImage] = useState(false);

  const ownerId = params.id as string;

  // Formulário para edição do perfil
  const profileForm = useForm({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      fullName: "",
      email: "",
      phone: "",
      instagram: "",
      website: "",
      profileImage: "",
    },
  });

  // Função para formatar telefone
  const formatPhoneNumber = (value: string) => {
    const phoneNumber = value.replace(/\D/g, "");
    if (phoneNumber.length <= 2) {
      return `(${phoneNumber}`;
    } else if (phoneNumber.length <= 3) {
      return `(${phoneNumber.slice(0, 2)}) ${phoneNumber.slice(2)}`;
    } else if (phoneNumber.length <= 7) {
      return `(${phoneNumber.slice(0, 2)}) ${phoneNumber.slice(2, 3)} ${phoneNumber.slice(3)}`;
    } else if (phoneNumber.length <= 11) {
      return `(${phoneNumber.slice(0, 2)}) ${phoneNumber.slice(2, 3)} ${phoneNumber.slice(3, 7)}-${phoneNumber.slice(7, 11)}`;
    } else {
      const limitedPhone = phoneNumber.slice(0, 11);
      return `(${limitedPhone.slice(0, 2)}) ${limitedPhone.slice(2, 3)} ${limitedPhone.slice(3, 7)}-${limitedPhone.slice(7, 11)}`;
    }
  };

  // Função para upload de imagem de perfil
  const handleProfileImageUpload = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    console.log("Iniciando upload de foto de perfil...");
    setIsUploadingImage(true);
    const formData = new FormData();
    formData.append("files", files[0]);
    formData.append("type", "profiles"); // Especificar que é upload de perfil

    try {
      console.log(
        "Enviando arquivo:",
        files[0].name,
        files[0].size,
        files[0].type,
      );

      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      console.log(
        "Resposta do servidor:",
        response.status,
        response.statusText,
      );

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error("Erro na resposta:", errorData);
        throw new Error(errorData.error || "Erro no upload");
      }

      const data = await response.json();
      console.log("Dados recebidos:", data);

      if (data.files && data.files.length > 0) {
        setUploadedProfileImage(data.files[0]);
        profileForm.setValue("profileImage", data.files[0]);

        // Mensagem específica para Cloudinary vs outros
        if (data.service === "cloudinary") {
          toast.success("Foto de perfil enviada com sucesso! (Cloudinary)");
        } else {
          toast.success("Foto de perfil enviada com sucesso!");
        }
      } else {
        throw new Error("Nenhuma URL retornada pelo servidor");
      }
    } catch (error) {
      console.error("Erro no upload:", error);
      toast.error("Erro ao enviar foto de perfil");
    } finally {
      setIsUploadingImage(false);
    }
  };

  // Função para remover imagem de perfil
  const removeProfileImage = () => {
    setUploadedProfileImage("");
    profileForm.setValue("profileImage", "");
  };

  // Função para abrir o dialog de edição
  const openEditProfile = () => {
    if (ownerData) {
      profileForm.setValue("fullName", ownerData.fullName);
      profileForm.setValue("email", ownerData.email);
      profileForm.setValue("phone", formatPhoneNumber(ownerData.phone || ""));
      profileForm.setValue("instagram", ownerData.instagram || "");
      profileForm.setValue("website", ownerData.website || "");
      profileForm.setValue("profileImage", ownerData.profileImage || "");
      setUploadedProfileImage(ownerData.profileImage || "");
    }
    setIsEditingProfile(true);
  };

  // Função para enviar atualização do perfil
  const onSubmitProfileUpdate = async (
    values: z.infer<typeof profileFormSchema>,
  ) => {
    setIsUpdatingProfile(true);

    try {
      const dataToSend = {
        fullName: values.fullName,
        phone: values.phone,
        instagram: values.instagram || null,
        website: values.website || null,
        profileImage: values.profileImage || null,
      };

      console.log("Dados que serão enviados:", dataToSend);
      console.log("URL da requisição:", `/api/proprietario/${ownerId}/profile`);

      const response = await fetch(`/api/proprietario/${ownerId}/profile`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(dataToSend),
      });

      console.log("Status da resposta:", response.status);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error("Erro da API:", errorData);

        // Exibir informações detalhadas do erro
        let errorMessage = "Erro ao atualizar perfil";
        if (errorData.error) {
          errorMessage = errorData.error;
        }

        // Em produção, exibir informações de debug se disponíveis
        if (errorData.debug || errorData.productionError) {
          console.error(
            "Informações de debug:",
            errorData.debug || errorData.productionError,
          );
          errorMessage += " (Verifique o console para detalhes)";
        }

        throw new Error(errorMessage);
      }

      // Atualizar os dados locais
      const updatedOwnerData = {
        ...ownerData!,
        fullName: values.fullName,
        phone: values.phone,
        instagram: values.instagram,
        website: values.website,
        profileImage: values.profileImage,
      };
      setOwnerData(updatedOwnerData);

      // Atualizar também a sessão no localStorage
      saveOwnerSession({
        userId: updatedOwnerData.userId,
        fullName: updatedOwnerData.fullName,
        email: updatedOwnerData.email,
        phone: updatedOwnerData.phone,
        instagram: updatedOwnerData.instagram,
        website: updatedOwnerData.website,
        profileImage: updatedOwnerData.profileImage,
      });

      toast.success("Perfil atualizado com sucesso!");
      setIsEditingProfile(false);
    } catch (error) {
      console.error("Erro ao atualizar perfil:", error);
      toast.error("Erro ao atualizar perfil");
    } finally {
      setIsUpdatingProfile(false);
    }
  };

  useEffect(() => {
    const checkAuth = async () => {
      const session = getOwnerSession();

      if (!session) {
        // Não está logado, redireciona para login
        router.push("/proprietario/login");
        return;
      }

      if (session.userId !== ownerId) {
        // ID da URL não corresponde ao usuário logado
        router.push(`/proprietario/${session.userId}`);
        return;
      }

      // Buscar dados completos do servidor
      try {
        const response = await fetch(`/api/proprietario/${session.userId}`);
        if (response.ok) {
          const userData = await response.json();
          setOwnerData({
            userId: userData.id,
            fullName: userData.fullName,
            email: userData.email,
            phone: userData.phone,
            instagram: userData.instagram,
            website: userData.website,
            profileImage: userData.profileImage,
          });
        } else {
          setOwnerData({
            userId: session.userId,
            fullName: session.fullName,
            email: session.email,
            phone: session.phone,
          });
        }
      } catch (error) {
        console.error("Erro ao buscar dados do proprietário:", error);
        setOwnerData({
          userId: session.userId,
          fullName: session.fullName,
          email: session.email,
          phone: session.phone,
        });
      }

      // Carregar propriedades do proprietário
      try {
        const propertiesData = await getPropertiesByOwner(session.userId);
        setProperties(propertiesData);
      } catch (error) {
        console.error("Erro ao carregar propriedades:", error);
      }

      setIsLoading(false);
    };

    checkAuth();
  }, [ownerId, router]);

  const handleLogout = () => {
    clearOwnerSession();
    router.push("/proprietario/login");
  };

  const handleDeleteProperty = async (propertyId: string) => {
    if (
      !confirm(
        "Tem certeza que deseja excluir este imóvel? Esta ação não pode ser desfeita.",
      )
    ) {
      return;
    }

    try {
      const result = await deleteProperty(propertyId);

      if (result.success) {
        toast.success("Imóvel excluído com sucesso!");
        // Atualizar a lista de propriedades
        const updatedProperties = properties.filter((p) => p.id !== propertyId);
        setProperties(updatedProperties);
      } else {
        toast.error(result.error || "Erro ao excluir imóvel");
      }
    } catch (error) {
      console.error("Erro ao excluir imóvel:", error);
      toast.error("Erro interno do servidor");
    }
  };

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-900 p-4">
        <div className="max-w-md rounded-lg p-8">
          <div className="flex flex-col items-center justify-center text-center">
            <div className="mb-4 h-8 w-8 animate-spin rounded-full border-4 border-slate-400 border-t-transparent"></div>
            <p className="text-sm text-slate-300">Carregando...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!ownerData) {
    return null; // Será redirecionado
  }

  return (
    <div className="min-h-screen bg-slate-900">
      {/* Header Desktop */}
      <div className="mb-18 hidden md:block">
        <Header />
      </div>

      {/* Header Mobile */}
      <div className="mb-16 block md:hidden">
        <HeaderMobile />
      </div>

      <div className="md:mx-57">
        <div className="container mx-auto px-3 py-4">
          {/* Layout para mobile */}
          <div className="flex flex-col gap-4 md:hidden">
            <div className="flex items-center justify-between">
              <Link href="/">
                <Button
                  variant="outline"
                  size="sm"
                  className="border-slate-600 bg-slate-800 text-slate-100 hover:bg-slate-700 hover:text-slate-100"
                >
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Voltar
                </Button>
              </Link>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="border-slate-600 bg-slate-800 text-slate-100 hover:bg-slate-700 hover:text-slate-100"
                >
                  <Settings className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleLogout}
                  className="border-slate-600 bg-slate-800 text-slate-100 hover:bg-slate-700 hover:text-slate-100"
                >
                  <LogOut className="h-4 w-4" />
                </Button>
              </div>
            </div>
            <div className="text-center">
              <h1 className="text-2xl font-bold text-slate-100">
                Área do Proprietário
              </h1>
              <p className="text-slate-400">Bem-vindo, {ownerData.fullName}</p>
            </div>
          </div>

          {/* Layout para desktop */}
          <div className="hidden items-center justify-between md:flex">
            <div className="flex flex-row items-center gap-6">
              <div>
                <Link href="/">
                  <Button
                    variant="outline"
                    size="sm"
                    className="border-slate-600 bg-slate-800 text-slate-100 hover:bg-slate-700 hover:text-slate-100"
                  >
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Voltar
                  </Button>
                </Link>
              </div>
              <div>
                <h1 className="text-2xl font-bold text-slate-100">
                  Área do Proprietário
                </h1>
                <p className="text-slate-400">
                  Bem-vindo, {ownerData.fullName}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                size="sm"
                onClick={handleLogout}
                className="border-slate-600 bg-slate-800 text-slate-100 hover:bg-slate-700 hover:text-slate-100"
              >
                <LogOut className="mr-2 h-4 w-4" />
                Sair
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container px-4 py-8 md:px-60">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {/* Card de Ações Rápidas */}
          <Card className="border-slate-700 bg-slate-800 md:col-span-2">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-slate-100">Meus Imóveis</CardTitle>
                  <CardDescription className="text-slate-400">
                    Gerencie todos os seus imóveis cadastrados na plataforma
                  </CardDescription>
                </div>
                <Link href={`/proprietario/${ownerId}/imoveis/cadastrar`}>
                  <Button className="bg-gray-900 duration-300 hover:scale-[1.02] hover:bg-gray-900">
                    <Plus className="mr-2 h-4 w-4" />
                    Cadastrar Imóvel
                  </Button>
                </Link>
              </div>
            </CardHeader>
            <CardContent>
              {properties.length === 0 ? (
                <div className="py-8 text-center">
                  <Plus className="mx-auto h-12 w-12 text-slate-400" />
                  <h3 className="mt-2 text-sm font-medium text-slate-200">
                    Nenhum imóvel encontrado
                  </h3>
                  <p className="mt-1 text-sm text-slate-400">
                    Comece adicionando seu primeiro imóvel à plataforma.
                  </p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow className="border-slate-700">
                        <TableHead className="text-slate-300">ID</TableHead>
                        <TableHead className="text-slate-300">Título</TableHead>
                        <TableHead className="text-slate-300">
                          Localização
                        </TableHead>
                        <TableHead className="text-slate-300">Diária</TableHead>
                        <TableHead className="text-slate-300">
                          Capacidade
                        </TableHead>
                        <TableHead className="text-slate-300">Status</TableHead>
                        <TableHead className="text-right text-slate-300">
                          Ações
                        </TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {properties.map((property) => (
                        <TableRow
                          key={property.id}
                          className="border-slate-700 hover:bg-slate-700/50"
                        >
                          <TableCell className="font-medium text-slate-200">
                            #{property.id}
                          </TableCell>
                          <TableCell>
                            <div className="font-medium text-slate-200">
                              {property.title}
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-1">
                              <MapPin className="h-3 w-3 text-slate-400" />
                              <span className="text-sm text-slate-300">
                                {property.neighborhood &&
                                property.city &&
                                property.state
                                  ? `${property.neighborhood}, ${property.city} - ${property.state}`
                                  : property.fullAddress ||
                                    "Endereço não informado"}
                              </span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <span className="font-medium text-slate-200">
                              R${" "}
                              {property.dailyRate
                                ? Number(property.dailyRate).toFixed(2)
                                : "0.00"}
                            </span>
                          </TableCell>
                          <TableCell>
                            <span className="text-sm text-slate-300">
                              {property.maxGuests} pessoas
                            </span>
                          </TableCell>
                          <TableCell>
                            <span
                              className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${
                                property.status === "ativo"
                                  ? "border border-green-700 bg-green-900/30 text-green-400"
                                  : "border border-yellow-700 bg-yellow-900/30 text-yellow-400"
                              }`}
                            >
                              {property.status === "ativo"
                                ? "Ativo"
                                : "Pendente"}
                            </span>
                          </TableCell>
                          <TableCell className="text-right">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  className="border-slate-600 bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-slate-100"
                                >
                                  <MoreHorizontal className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent className="border-slate-600 bg-slate-800">
                                <DropdownMenuItem asChild>
                                  <Link
                                    href={`/proprietario/${ownerId}/imoveis/${property.id}/editar`}
                                    className="flex items-center text-slate-300 hover:text-slate-100"
                                  >
                                    <Edit className="mr-2 h-4 w-4 text-slate-200" />
                                    Editar
                                  </Link>
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  onClick={() =>
                                    handleDeleteProperty(property.id)
                                  }
                                  className="flex items-center text-red-400 hover:text-red-300"
                                >
                                  <Trash2 className="mr-2 h-4 w-4 text-red-400" />
                                  Excluir
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Card de Informações do Perfil */}
          <Card className="border-slate-700 bg-slate-800">
            <CardHeader>
              <CardTitle className="flex items-center justify-between text-slate-100">
                <div className="flex">
                  <User className="mr-2 h-5 w-5" />
                  Como seu perfil aparece para os clientes:
                </div>
                <AlertDialog
                  open={isEditingProfile}
                  onOpenChange={setIsEditingProfile}
                >
                  <AlertDialogTrigger asChild>
                    <Button
                      onClick={openEditProfile}
                      className="border border-slate-600 bg-slate-800 text-slate-100 hover:bg-slate-700 hover:text-slate-100"
                    >
                      <Pencil />
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent className="md:[85vw] max-w-sm border-slate-600 bg-slate-800 sm:max-w-md lg:w-[50vw]">
                    <AlertDialogHeader>
                      <AlertDialogTitle className="text-slate-100">
                        Editar Perfil do Proprietário
                      </AlertDialogTitle>
                      <AlertDialogDescription className="text-slate-400">
                        Atualize suas informações de perfil que aparecerão para
                        os clientes.
                      </AlertDialogDescription>
                    </AlertDialogHeader>

                    <Form {...profileForm}>
                      <form
                        onSubmit={profileForm.handleSubmit(
                          onSubmitProfileUpdate,
                        )}
                        className="space-y-6"
                      >
                        {/* Foto de Perfil */}
                        <div className="space-y-2">
                          <FormLabel className="mb-3 text-slate-300">
                            Foto de Perfil
                          </FormLabel>
                          <div className="flex items-center gap-4">
                            {uploadedProfileImage ? (
                              <div className="relative">
                                <Image
                                  src={uploadedProfileImage}
                                  alt="Perfil"
                                  width={80}
                                  height={80}
                                  className="h-20 w-20 rounded-full object-cover shadow-lg"
                                />
                                <Button
                                  type="button"
                                  size="sm"
                                  onClick={removeProfileImage}
                                  className="absolute -top-2 -right-2 h-9 w-9 rounded-full border border-slate-500 bg-slate-700 hover:bg-slate-600"
                                >
                                  <X className="h-8 w-8" />
                                </Button>
                              </div>
                            ) : (
                              <div className="flex h-20 w-20 items-center justify-center rounded-full bg-slate-600">
                                <UserRound className="h-10 w-10 text-slate-400" />
                              </div>
                            )}
                            <div className="flex items-center gap-2">
                              <label className="cursor-pointer">
                                <Button
                                  type="button"
                                  variant="outline"
                                  disabled={isUploadingImage}
                                  className="border-slate-600 bg-slate-700 text-slate-100 hover:bg-slate-600 hover:text-slate-100"
                                  asChild
                                >
                                  <span>
                                    {isUploadingImage
                                      ? "Enviando..."
                                      : "Escolher Arquivo"}
                                  </span>
                                </Button>
                                <input
                                  type="file"
                                  accept="image/*"
                                  onChange={handleProfileImageUpload}
                                  disabled={isUploadingImage}
                                  className="hidden"
                                />
                              </label>
                              {isUploadingImage && (
                                <Loader className="h-4 w-4 animate-spin text-blue-400" />
                              )}
                            </div>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                          {/* Nome */}
                          <FormField
                            control={profileForm.control}
                            name="fullName"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel className="text-slate-300">
                                  Nome Completo *
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

                          {/* Email */}
                          <FormField
                            control={profileForm.control}
                            name="email"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel className="text-slate-300">
                                  Email *
                                </FormLabel>
                                <FormControl>
                                  <Input
                                    {...field}
                                    type="email"
                                    disabled
                                    className="border-slate-600 bg-slate-600 text-slate-300 opacity-70"
                                    placeholder="seu@email.com"
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          {/* Telefone */}
                          <FormField
                            control={profileForm.control}
                            name="phone"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel className="text-slate-300">
                                  Telefone *
                                </FormLabel>
                                <FormControl>
                                  <Input
                                    {...field}
                                    onChange={(e) => {
                                      const formatted = formatPhoneNumber(
                                        e.target.value,
                                      );
                                      field.onChange(formatted);
                                    }}
                                    className="border-slate-600 bg-slate-700 text-slate-100"
                                    placeholder="(85) 9 9999-9999"
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          {/* Instagram */}
                          <FormField
                            control={profileForm.control}
                            name="instagram"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel className="text-slate-300">
                                  Instagram
                                </FormLabel>
                                <FormControl>
                                  <Input
                                    {...field}
                                    className="border-slate-600 bg-slate-700 text-slate-100"
                                    placeholder="@seuusuario"
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          {/* Website */}
                          <FormField
                            control={profileForm.control}
                            name="website"
                            render={({ field }) => (
                              <FormItem className="md:col-span-2">
                                <FormLabel className="text-slate-300">
                                  Website
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

                        <AlertDialogFooter>
                          <Button
                            type="button"
                            variant="outline"
                            onClick={() => setIsEditingProfile(false)}
                            className="border-slate-600 bg-slate-700 text-slate-100 hover:bg-slate-600"
                          >
                            Cancelar
                          </Button>
                          <Button
                            type="submit"
                            disabled={isUpdatingProfile}
                            className="bg-blue-600 hover:bg-blue-700"
                          >
                            {isUpdatingProfile ? (
                              <>
                                <Loader className="mr-2 h-4 w-4 animate-spin" />
                                Salvando...
                              </>
                            ) : (
                              "Salvar Alterações"
                            )}
                          </Button>
                        </AlertDialogFooter>
                      </form>
                    </Form>
                  </AlertDialogContent>
                </AlertDialog>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Card className="border-gray-600 bg-gray-700 shadow-md">
                <CardContent>
                  <div className="space-y-3 text-start">
                    <p className="text-lg font-semibold text-gray-300">
                      Perfil do Proprietário
                    </p>
                    <div className="flex items-center gap-12">
                      {ownerData.profileImage ? (
                        <Image
                          src={ownerData.profileImage}
                          alt="Perfil do proprietário"
                          width={72}
                          height={72}
                          className="h-18 w-18 rounded-full object-cover shadow-lg"
                        />
                      ) : (
                        <div className="flex h-18 w-18 items-center justify-center rounded-full bg-gray-200 shadow-lg duration-300 hover:scale-[1.02]">
                          <UserRound className="h-9 w-9 text-gray-600/80" />
                        </div>
                      )}
                      <div className="flex flex-col gap-1 text-sm">
                        <p className="mb-2 text-slate-300">
                          Nome:{" "}
                          <span className="font-medium text-slate-100">
                            {ownerData.fullName}
                          </span>
                        </p>
                        <div className="flex justify-between gap-8">
                          <div className="flex flex-col">
                            <p className="text-slate-300">Contatos:</p>
                            <span className="mb-2 font-medium text-slate-100">
                              {ownerData.email}
                            </span>
                            <span className="font-medium text-slate-100">
                              {ownerData.phone || "Não informado"}
                            </span>
                          </div>
                          <div className="flex flex-col">
                            <p className="mb-1 text-slate-300">Redes:</p>
                            <div className="flex gap-2">
                              {ownerData.instagram ? (
                                <Link
                                  href={
                                    ownerData.instagram.startsWith("@")
                                      ? `https://instagram.com/${ownerData.instagram.slice(1)}`
                                      : ownerData.instagram.startsWith("http")
                                        ? ownerData.instagram
                                        : `https://instagram.com/${ownerData.instagram}`
                                  }
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="font-medium text-slate-100 transition-colors hover:text-pink-400"
                                >
                                  <Instagram />
                                </Link>
                              ) : (
                                <div className="font-medium text-slate-500">
                                  <Instagram />
                                </div>
                              )}
                              {ownerData.website ? (
                                <Link
                                  href={
                                    ownerData.website.startsWith("http")
                                      ? ownerData.website
                                      : `https://${ownerData.website}`
                                  }
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="font-medium text-slate-100 transition-colors hover:text-blue-400"
                                >
                                  <Link2 />
                                </Link>
                              ) : (
                                <div className="font-medium text-slate-500">
                                  <Link2 />
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </CardContent>
          </Card>

          {/* Card de Estatísticas */}
          <Card className="border-slate-700 bg-slate-800">
            <CardHeader>
              <CardTitle className="text-slate-100">
                Métricas do Proprietário
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-10">
                <div className="flex justify-between">
                  <span className="text-slate-400">Imóveis cadastrados</span>
                  <span className="font-bold text-slate-100">
                    {properties.length}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Imóveis ativos</span>
                  <span className="font-bold text-slate-100">
                    {properties.filter((p) => p.status === "ativo").length}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Diária média</span>
                  <span className="font-bold text-slate-100">
                    R${" "}
                    {properties.length > 0
                      ? (
                          properties
                            .filter((p) => p.dailyRate)
                            .reduce(
                              (sum, p) => sum + Number(p.dailyRate || 0),
                              0,
                            ) / properties.filter((p) => p.dailyRate).length
                        ).toFixed(0)
                      : "0"}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
      <div className="mt-3">
        <Footer />
      </div>
    </div>
  );
}
