"use client";

import {
  ArrowLeft,
  Edit,
  LogOut,
  MapPin,
  Pencil,
  Plus,
  Settings,
  User,
  UserRound,
} from "lucide-react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import Footer from "@/components/Footer";
import Header from "@/components/Header";
import HeaderMobile from "@/components/HeaderMobile";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { clearOwnerSession, getOwnerSession } from "@/lib/owner-session";
import { getPropertiesByOwner } from "@/lib/property-actions";

interface OwnerSession {
  userId: number;
  fullName: string;
  email: string;
  phone?: string;
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

export default function OwnerDashboard() {
  const params = useParams();
  const router = useRouter();
  const [ownerData, setOwnerData] = useState<OwnerSession | null>(null);
  const [properties, setProperties] = useState<Property[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const ownerId = parseInt(params.id as string);

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

      // Se a sessão não tem telefone, buscar dados atualizados do servidor
      if (!session.phone) {
        try {
          const response = await fetch(`/api/proprietario/${session.userId}`);
          if (response.ok) {
            const userData = await response.json();
            setOwnerData({
              userId: userData.id,
              fullName: userData.fullName,
              email: userData.email,
              phone: userData.phone,
            });
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
                <Button className="bg-blue-600 hover:bg-blue-700">
                  <Plus className="mr-2 h-4 w-4" />
                  Cadastrar Imóvel
                </Button>
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
                                property.status === "active"
                                  ? "border border-green-700 bg-green-900/30 text-green-400"
                                  : "border border-red-700 bg-red-900/30 text-red-400"
                              }`}
                            >
                              {property.status === "active"
                                ? "Ativo"
                                : "Inativo"}
                            </span>
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex items-center justify-end gap-2">
                              <Button
                                variant="outline"
                                size="sm"
                                className="border-slate-600 bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-slate-100"
                              >
                                <Edit className="h-3 w-3" />
                              </Button>
                            </div>
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
                <Button className="border-slate-600 border bg-slate-800 text-slate-100 hover:bg-slate-700 hover:text-slate-100">
                  <Pencil />
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Card className="border-gray-600 bg-gray-700 shadow-md">
                <CardContent>
                  <div className="space-y-3 text-start">
                    <p className="text-lg font-semibold text-gray-300">
                      Perfil do Anfitrião
                    </p>
                    <div className="flex items-center gap-5">
                      <div className="flex h-18 w-18 items-center justify-center rounded-full bg-gray-200 shadow-lg">
                        <UserRound className="h-9 w-9 text-gray-600/80" />
                      </div>
                      <div className="flex flex-col gap-1 text-sm">
                        <p className="text-slate-200">
                          Nome: {ownerData.fullName}
                        </p>
                        <p className="text-slate-200">
                          Email: {ownerData.email}
                        </p>
                        <p className="text-slate-200">
                          Telefone: {ownerData.phone || "Não informado"}
                        </p>
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
              <CardTitle className="text-slate-100">Resumo</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-slate-400">Imóveis cadastrados</span>
                  <span className="font-bold text-blue-400">
                    {properties.length}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Imóveis ativos</span>
                  <span className="font-bold text-green-400">
                    {properties.filter((p) => p.status === "active").length}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Diária média</span>
                  <span className="font-bold text-purple-400">
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
